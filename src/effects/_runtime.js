/**
 * _runtime.js — helpers compartidos por las previews. SIN dependencias.
 * Extraídos verbatim del prototipo (no reescribir a mano).
 */
export function shaderPreview(el, frag){
  const c=document.createElement('canvas'); c.className='stage'; el.appendChild(c);
  const gl=c.getContext('webgl',{antialias:true})||c.getContext('experimental-webgl');
  if(!gl){el.innerHTML='<div style="color:#666;display:grid;place-items:center;height:100%;font-size:12px">WebGL no disponible</div>';return{stop(){}}}
  function resize(){const dpr=Math.min(devicePixelRatio,2);c.width=Math.max(1,el.clientWidth*dpr);c.height=Math.max(1,el.clientHeight*dpr);gl.viewport(0,0,c.width,c.height);}
  resize();
  const vsrc='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fsrc='precision highp float;uniform vec2 u_res;uniform float u_t;'+frag;
  function sh(t,s){const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o;}
  const prog=gl.createProgram();
  gl.attachShader(prog,sh(gl.VERTEX_SHADER,vsrc));
  gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,fsrc));
  gl.linkProgram(prog);gl.useProgram(prog);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const uR=gl.getUniformLocation(prog,'u_res'),uT=gl.getUniformLocation(prog,'u_t');
  let raf,t0=performance.now(),running=true;
  const ro=new ResizeObserver(resize);ro.observe(el);
  function loop(){if(!running)return;gl.uniform2f(uR,c.width,c.height);gl.uniform1f(uT,(performance.now()-t0)/1000);gl.drawArrays(gl.TRIANGLES,0,3);raf=requestAnimationFrame(loop);}
  loop();
  return{stop(){running=false;cancelAnimationFrame(raf);ro.disconnect();try{const ex=gl.getExtension('WEBGL_lose_context');ex&&ex.loseContext();}catch(e){}}};
}

export function canvasPreview(el){
  const c=document.createElement('canvas');c.className='stage';el.appendChild(c);const x=c.getContext('2d');
  function size(){const dpr=Math.min(devicePixelRatio,2);c.width=Math.max(1,el.clientWidth*dpr);c.height=Math.max(1,el.clientHeight*dpr);x.setTransform(dpr,0,0,dpr,0,0);}
  size();const ro=new ResizeObserver(size);ro.observe(el);
  return {c,x,ro,W:()=>el.clientWidth,H:()=>el.clientHeight};
}
