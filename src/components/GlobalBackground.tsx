import { useEffect, useRef } from 'react';

// Vertex shader source
const VERTEX_SHADER_SRC = `
  attribute vec2 a_position;
  varying vec2 v_texCoord;
  void main() {
    v_texCoord = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fragment shader source
const FRAGMENT_SHADER_SRC = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_texCoord;
  uniform sampler2D u_texture;
  uniform float u_time;
  uniform float u_amount;

  // Pseudo-random hash
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // 2D Value Noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Fractal Brownian Motion (3 octaves for smooth fluid look)
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 3; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = v_texCoord;

    // Use FBM noise to calculate a fluid, animated flow field
    vec2 p = uv * 2.5;
    
    // First wave layer (driven by time)
    float t1 = u_time * 0.12;
    vec2 flow1 = vec2(
      fbm(p + vec2(t1, t1 * 0.6)),
      fbm(p + vec2(-t1 * 0.4, t1 * 0.8))
    ) * 2.0 - 1.0;
    
    // Second wave layer for organic turbulence
    float t2 = u_time * 0.08;
    vec2 flow2 = vec2(
      fbm(p * 1.4 + flow1 + vec2(-t2, t2)),
      fbm(p * 1.6 + flow1 + vec2(t2 * 0.5, -t2 * 0.6))
    ) * 2.0 - 1.0;

    // Distort the texture sampling coordinate using the flow field (8% warping)
    vec2 uvWarped = uv + flow2 * 0.08;

    // Zoom in slightly (scale 0.86) to hide border clamping artifacts
    vec2 uvScaled = (uvWarped - 0.5) * 0.86 + 0.5;

    // Fluid distortion angle using FBM noise
    float angle = fbm(uvScaled * 3.0 + vec2(u_time * 0.05, -u_time * 0.05)) * 6.28318;
    vec2 dispDir = vec2(cos(angle), sin(angle));

    // Dynamic chromatic aberration: subtle baseline (0.0025) + scroll speed impact
    float aberration = 0.0025 + u_amount * 0.035;

    // Chromatic aberration sampling (R, G, B channels)
    float r = texture2D(u_texture, uvScaled + dispDir * aberration).r;
    float g = texture2D(u_texture, uvScaled).g;
    float b = texture2D(u_texture, uvScaled - dispDir * aberration).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get WebGL context
    const gl = canvas.getContext('webgl', { alpha: false, antialias: true }) || 
               canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;

    if (!gl) {
      console.warn('[animai] WebGL no soportado en este navegador.');
      return;
    }

    // Helper: compile shader
    const compileShader = (src: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('[animai] Error compilando shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(VERTEX_SHADER_SRC, gl.VERTEX_SHADER);
    const fs = compileShader(FRAGMENT_SHADER_SRC, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    // Create & link program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[animai] Error enlazando WebGL program:', gl.getProgramInfoLog(program));
      return;
    }

    // Quad vertices covering the full viewport: [-1, -1] to [1, 1]
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Uniform and attribute locations
    const aPosition = gl.getAttribLocation(program, 'a_position');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uAmount = gl.getUniformLocation(program, 'u_amount');
    const uTexture = gl.getUniformLocation(program, 'u_texture');

    // Create the procedural texture canvas with original predominant dark navy/indigo colors
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 512;
    texCanvas.height = 512;
    const ctx = texCanvas.getContext('2d');
    if (ctx) {
      // 1. Dark theme background (predominant color)
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, 512, 512);

      // 2. Large, soft indigo gradient (matching the previous body background gradient)
      let grad = ctx.createRadialGradient(400, 50, 0, 400, 50, 400);
      grad.addColorStop(0, '#1a1330');
      grad.addColorStop(1, '#0a0a0f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // 3. Subtle purple glow (corporate Accent 1)
      grad = ctx.createRadialGradient(160, 200, 0, 160, 200, 280);
      grad.addColorStop(0, 'rgba(123, 92, 255, 0.32)');
      grad.addColorStop(1, 'rgba(123, 92, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // 4. Very dim cyan glow (Accent 2)
      grad = ctx.createRadialGradient(380, 380, 0, 380, 380, 220);
      grad.addColorStop(0, 'rgba(0, 224, 198, 0.12)');
      grad.addColorStop(1, 'rgba(0, 224, 198, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // 5. Very dim pink glow
      grad = ctx.createRadialGradient(300, 150, 0, 300, 150, 200);
      grad.addColorStop(0, 'rgba(255, 92, 168, 0.12)');
      grad.addColorStop(1, 'rgba(255, 92, 168, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
    }

    // Upload procedural texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // WebGL flips textures natively to match bottom-left origin
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Resize handling
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    window.addEventListener('resize', resize);
    resize();

    // Scroll speed tracking variables
    let targetAmount = 0;
    let currentAmount = 0;
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();

    const handleScroll = () => {
      const now = Date.now();
      const currentScrollY = window.scrollY;
      
      const dt = Math.max(1, now - lastScrollTime);
      const dy = Math.abs(currentScrollY - lastScrollY);
      
      // Speed in pixels per millisecond
      const speed = dy / dt;
      
      // Calculate target aberration amount, clamped to range [0, 1]
      targetAmount = Math.min(1.0, speed * 0.35);

      lastScrollY = currentScrollY;
      lastScrollTime = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Render loop
    const startTime = Date.now();
    let animId = 0;

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      // Smoothly decay target scroll speed
      targetAmount *= 0.94;
      if (targetAmount < 0.0001) targetAmount = 0;

      // Ease current aberration uniform towards target
      currentAmount += (targetAmount - currentAmount) * 0.08;

      // Re-bind states on every frame for context state consistency
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPosition);

      // Active texture bindings
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uTexture, 0);

      // Update uniforms
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uAmount, currentAmount);

      // Clear & Draw
      gl.clearColor(0.04, 0.04, 0.06, 1.0); // matches --bg hex #0a0a0f
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);

      gl.disableVertexAttribArray(aPosition);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.deleteBuffer(buffer);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas id="webgl-background" ref={canvasRef} aria-hidden="true" />;
}
