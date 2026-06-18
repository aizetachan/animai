import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-old-film', title:'Old Film', cat:'Postprocesado',
  tags:['old film','película antigua','grano','grain','arañazos','scratches','viñeta','flicker','retro','cine'],
  desc:'Película antigua: grano fino, arañazos verticales, motas de polvo, viñeta y parpadeo de exposición.',
  meta:['canvas','film','grain','vignette'],
  prompt:`Recrea un postprocesado de "película antigua" (distinto del VHS, que es analógico de cinta) sobre una escena base.
Componentes y algoritmo:
1) Virado sepia/monocromo: convierte el color a luminancia (0.299R+0.587G+0.114B) y tíñela con un tono cálido (sepia) o frío.
2) Grano de film: ruido aleatorio por fotograma sumado a la luminancia con baja amplitud (no estático tipo VHS). En canvas: muchos píxeles de opacidad aleatoria redibujados cada frame.
3) Arañazos verticales: 0-3 líneas finas casi blancas que aparecen en X aleatoria y persisten unos frames, con jitter horizontal.
4) Polvo/motas: pequeñas manchas claras y oscuras posicionadas al azar cada frame (hairs/dust).
5) Viñeta: gradiente radial oscuro en los bordes (radial dark).
6) Flicker de exposición: multiplicar el brillo global por un factor 0.85..1.1 variando lento + ruido (simula inestabilidad del proyector).
7) Opcional: salto de cuadro (frame jump) ocasional desplazando todo verticalmente unos px.
Parámetros clave: grainAmount, scratchProb, dustCount, vignetteStrength, flickerSpeed.`,
  code:`// Old Film — fragment GLSL idiomático (postpro sobre tScene)
// uniform sampler2D tScene; uniform float uTime; uniform vec2 uRes;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
void mainImage(in vec2 uv, out vec3 col){
  vec3 src = texture2D(tScene, uv).rgb;
  // 1) luminancia -> sepia
  float lum = dot(src, vec3(0.299,0.587,0.114));
  vec3 sepia = vec3(lum)*vec3(1.10,0.92,0.70);
  // 2) grano por fotograma
  float g = hash(uv*uRes + fract(uTime)*97.13);
  sepia += (g-0.5)*0.18;
  // 3) arañazo vertical: si una franja X coincide con ruido temporal
  float sx = floor(uv.x*60.0);
  float scratch = step(0.985, hash(vec2(sx, floor(uTime*8.0))));
  sepia += scratch*0.6;
  // 4) flicker de exposición
  float flick = 0.92 + 0.08*sin(uTime*8.0) + 0.06*hash(vec2(floor(uTime*12.0)));
  sepia *= flick;
  // 5) viñeta
  float v = smoothstep(0.9, 0.35, length(uv-0.5));
  sepia *= mix(0.55, 1.0, v);
  col = clamp(sepia, 0.0, 1.0);
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    // arañazos persistentes: {x, life}
    let scratches=[];
    (function loop(){if(!run)return;t+=1;
      const W=o.W(),H=o.H();
      // salto de cuadro ocasional
      const jump=Math.random()<0.03?(Math.random()-0.5)*6:0;
      // flicker global
      const flick=0.85+0.12*Math.sin(t*0.18)+Math.random()*0.08;
      // 1) escena base sepia: barras / texto procedural
      x.save();
      x.translate(0,jump);
      x.fillStyle='#1a140c';x.fillRect(0,-8,W,H+16);
      // gradiente de "luz de proyector" cálida
      const cx=W/2,cy=H/2;
      let bg=x.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*0.7);
      bg.addColorStop(0,'rgba('+Math.round(120*flick)+','+Math.round(98*flick)+','+Math.round(64*flick)+',1)');
      bg.addColorStop(1,'rgba(20,15,8,1)');
      x.fillStyle=bg;x.fillRect(0,-8,W,H+16);
      // sujeto procedural: silueta circular oscilante (estilo cine mudo)
      const r=Math.min(W,H)*0.22*flick;
      const sy=cy+Math.sin(t*0.04)*H*0.06;
      let sg=x.createRadialGradient(cx,sy,0,cx,sy,r);
      sg.addColorStop(0,'rgba(210,185,140,'+(0.9*flick)+')');
      sg.addColorStop(1,'rgba(40,30,18,0)');
      x.fillStyle=sg;x.beginPath();x.arc(cx,sy,r,0,6.2832);x.fill();
      x.restore();
      // 2) grano de film
      x.globalCompositeOperation='lighter';
      for(let i=0;i<W*H*0.06;i++){
        const gx=Math.random()*W,gy=Math.random()*H,a=Math.random()*0.12;
        x.fillStyle='rgba(255,240,210,'+a+')';x.fillRect(gx,gy,1,1);
      }
      x.globalCompositeOperation='source-over';
      for(let i=0;i<W*H*0.03;i++){
        const gx=Math.random()*W,gy=Math.random()*H,a=Math.random()*0.12;
        x.fillStyle='rgba(0,0,0,'+a+')';x.fillRect(gx,gy,1,1);
      }
      // 3) arañazos verticales
      if(Math.random()<0.12) scratches.push({x:Math.random()*W,life:6+Math.random()*14});
      scratches=scratches.filter(s=>s.life>0);
      x.globalCompositeOperation='lighter';
      scratches.forEach(s=>{ s.life--;
        const jx=s.x+(Math.random()-0.5)*1.5;
        x.fillStyle='rgba(255,250,235,'+(0.18+Math.random()*0.2)+')';
        x.fillRect(jx,0,Math.random()<0.5?1:0.6,H);
      });
      x.globalCompositeOperation='source-over';
      // 4) polvo / motas
      const dust=4+Math.floor(Math.random()*6);
      for(let i=0;i<dust;i++){
        const dx=Math.random()*W,dy=Math.random()*H,dr=0.6+Math.random()*1.8;
        x.fillStyle=Math.random()<0.6?'rgba(245,235,215,0.7)':'rgba(20,12,6,0.7)';
        x.beginPath();x.arc(dx,dy,dr,0,6.2832);x.fill();
      }
      // 5) viñeta
      let vg=x.createRadialGradient(cx,cy,Math.min(W,H)*0.2,cx,cy,Math.max(W,H)*0.62);
      vg.addColorStop(0,'rgba(0,0,0,0)');
      vg.addColorStop(1,'rgba(0,0,0,0.85)');
      x.fillStyle=vg;x.fillRect(0,0,W,H);
      // marca de cuadro / borde superior parpadeante (acento)
      if(Math.random()<0.05){x.fillStyle='rgba(123,92,255,0.18)';x.fillRect(0,0,W,2);}
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
