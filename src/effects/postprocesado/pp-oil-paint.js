import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pp-oil-paint', title:'Oil Paint', cat:'Postprocesado',
  tags:['oil paint','óleo','kuwahara','pintura','painterly','filtro','postprocessing','stylize'],
  desc:'Filtro pintura al óleo (Kuwahara): planos de color suavizados con bordes nítidos, look painterly.',
  meta:['canvas','kuwahara','painterly'],
  prompt:`Aplica un filtro de pintura al óleo basado en el operador de Kuwahara sobre una escena de colores.
Algoritmo Kuwahara: para cada píxel, divide su vecindario (ventana de radio r) en 4 subregiones cuadradas solapadas en las esquinas (superior-izq, superior-der, inferior-izq, inferior-der). Para cada subregión calcula la media de color y la varianza (sobre la luminancia). Asigna al píxel la media de la subregión con MENOR varianza. Resultado: zonas planas de color (pinceladas) con bordes preservados, sin el desenfoque de un blur gaussiano.
Variante generalizada (anisotrópica): usa sectores circulares en lugar de cuadrantes y pondera por un gradiente estructural para pinceladas orientadas.
Parámetros: radio del kernel (tamaño de la pincelada) y número de subregiones. Radios grandes => trazos más abstractos.
Para la preview en canvas, trabaja sobre ImageData a baja resolución (rendimiento): muestrea los 4 cuadrantes con paso, elige el de menor varianza.`,
  code:`// Kuwahara oil-paint — fragment GLSL idiomático (postpro sobre tScene)
// uniform sampler2D tScene; uniform vec2 uRes; const int R=4;
void mainImage(in vec2 uv, out vec3 col){
  vec2 px = 1.0/uRes;
  vec3 mean[4]; float var[4];
  // offsets de inicio de cada cuadrante (incluye el centro)
  ivec2 lo[4]; ivec2 hi[4];
  lo[0]=ivec2(-R,-R); hi[0]=ivec2(0,0);   // sup-izq
  lo[1]=ivec2(0,-R);  hi[1]=ivec2(R,0);   // sup-der
  lo[2]=ivec2(-R,0);  hi[2]=ivec2(0,R);   // inf-izq
  lo[3]=ivec2(0,0);   hi[3]=ivec2(R,R);   // inf-der
  for(int k=0;k<4;k++){
    vec3 sum=vec3(0.0); float sum2=0.0; float n=0.0;
    for(int j=-R;j<=R;j++) for(int i=-R;i<=R;i++){
      if(i<lo[k].x||i>hi[k].x||j<lo[k].y||j>hi[k].y) continue;
      vec3 c = texture2D(tScene, uv + vec2(float(i),float(j))*px).rgb;
      float l = dot(c, vec3(0.299,0.587,0.114));
      sum+=c; sum2+=l*l; n+=1.0;
    }
    mean[k]=sum/n;
    float ml=dot(mean[k],vec3(0.299,0.587,0.114));
    var[k]=sum2/n - ml*ml;             // varianza de luminancia
  }
  // elige cuadrante de menor varianza
  float mv=var[0]; col=mean[0];
  for(int k=1;k<4;k++){ if(var[k]<mv){ mv=var[k]; col=mean[k]; } }
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;let t=0,raf,run=true;
    // buffer a baja resolución para Kuwahara (rendimiento)
    const buf=document.createElement('canvas');const bx=buf.getContext('2d',{willReadFrequently:true});
    (function loop(){if(!run)return;t+=0.016;
      const W=o.W(),H=o.H();
      // 1) escena base colorida y procedural en el buffer pequeño
      const bw=Math.max(8,Math.round(W*0.42)),bh=Math.max(8,Math.round(H*0.42));
      buf.width=bw;buf.height=bh;
      for(let yy=0;yy<bh;yy++){const v=yy/bh;
        const r=Math.round(120+100*Math.sin(t+v*4.0));
        const g=Math.round(90+90*Math.sin(t*0.7+v*5.0+1.5));
        const b=Math.round(150+90*Math.sin(t*1.3+v*3.0+3.0));
        bx.fillStyle='rgb('+r+','+g+','+b+')';bx.fillRect(0,yy,bw,1);
      }
      // manchas de color (motivo de "flores"/abstracto) para que el óleo luzca
      for(let i=0;i<7;i++){
        const ang=t*0.4+i*0.9;
        const cx=bw*(0.5+0.32*Math.cos(ang)),cy=bh*(0.5+0.32*Math.sin(ang*1.3));
        const rad=bw*(0.10+0.06*((i%3)));
        const hue=(i*52+t*30)%360;
        const gr=bx.createRadialGradient(cx,cy,0,cx,cy,rad);
        gr.addColorStop(0,'hsla('+hue+',85%,60%,1)');
        gr.addColorStop(1,'hsla('+((hue+40)%360)+',70%,35%,0)');
        bx.fillStyle=gr;bx.beginPath();bx.arc(cx,cy,rad,0,6.2832);bx.fill();
      }
      // acento de marca
      bx.fillStyle='rgba(123,92,255,0.35)';bx.beginPath();bx.arc(bw*0.7,bh*0.3,bw*0.12,0,6.2832);bx.fill();
      bx.fillStyle='rgba(0,224,198,0.3)';bx.beginPath();bx.arc(bw*0.3,bh*0.7,bw*0.1,0,6.2832);bx.fill();
      // 2) Kuwahara sobre el buffer
      const src=bx.getImageData(0,0,bw,bh),s=src.data;
      const out=bx.createImageData(bw,bh),d=out.data;
      const R=3;
      const quad=[[-R,-R,0,0],[0,-R,R,0],[-R,0,0,R],[0,0,R,R]];
      for(let py=0;py<bh;py++)for(let px=0;px<bw;px++){
        let bestVar=1e9,br=0,bg=0,bb=0;
        for(let q=0;q<4;q++){
          const[lx,ly,hx,hy]=quad[q];
          let sr=0,sg=0,sb=0,sl2=0,n=0;
          for(let j=ly;j<=hy;j++)for(let i=lx;i<=hx;i++){
            const xx=px+i,yy=py+j;if(xx<0||yy<0||xx>=bw||yy>=bh)continue;
            const o2=(yy*bw+xx)*4,rr=s[o2],gg=s[o2+1],bb2=s[o2+2];
            sr+=rr;sg+=gg;sb+=bb2;const l=0.299*rr+0.587*gg+0.114*bb2;sl2+=l*l;n++;
          }
          if(!n)continue;
          const mr=sr/n,mg=sg/n,mb=sb/n,ml=0.299*mr+0.587*mg+0.114*mb;
          const vv=sl2/n-ml*ml;
          if(vv<bestVar){bestVar=vv;br=mr;bg=mg;bb=mb;}
        }
        const od=(py*bw+px)*4;d[od]=br;d[od+1]=bg;d[od+2]=bb;d[od+3]=255;
      }
      bx.putImageData(out,0,0);
      // 3) escalar al canvas (nearest off -> suave) manteniendo trazo
      x.imageSmoothingEnabled=true;x.clearRect(0,0,W,H);
      x.drawImage(buf,0,0,bw,bh,0,0,W,H);
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
