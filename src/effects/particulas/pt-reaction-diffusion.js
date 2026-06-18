import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'pt-reaction-diffusion', title:'Reaction-Diffusion', cat:'Partículas',
  tags:['reaction diffusion','gray-scott','turing','patrones','manchas','orgánico','generativo'],
  desc:'Patrones de Turing (modelo Gray-Scott) que crecen y se ramifican como manchas orgánicas.',
  meta:['Canvas 2D','Gray-Scott','Turing'],
  prompt:`Implementa reacción-difusión con el modelo Gray-Scott en canvas 2D sobre una rejilla de dos químicos A y B.
Cada celda guarda concentraciones a y b. En cada paso aplica las ecuaciones:
  a' = a + (Da*lapA - a*b*b + feed*(1-a)) * dt
  b' = b + (Db*lapB + a*b*b - (kill+feed)*b) * dt
donde lapA/lapB es el laplaciano por convolución 3x3 con pesos (centro -1, ortogonales 0.2, diagonales 0.05). Da=1.0, Db=0.5, dt=1.0. feed~0.055, kill~0.062 dan patrones de tipo "coral/laberinto".
Usa doble buffer. Inicializa todo con a=1,b=0 y siembra varios parches de b=1. Da varios pasos de simulación por frame. Mapea b a color (interpola entre #07090d, #7b5cff y #00e0c6) escribiendo en un ImageData.`,
  code:`// Gray-Scott reaction-diffusion (canvas 2D)
const Da=1.0, Db=0.5, feed=0.055, kill=0.062, dt=1.0;
function step(){
  for(let y=1;y<H-1;y++) for(let x=1;x<W-1;x++){
    const i=y*W+x;
    // laplaciano 3x3 ponderado
    let lA=-A[i], lB=-B[i];
    lA+=0.2*(A[i-1]+A[i+1]+A[i-W]+A[i+W]);
    lA+=0.05*(A[i-W-1]+A[i-W+1]+A[i+W-1]+A[i+W+1]);
    lB+=0.2*(B[i-1]+B[i+1]+B[i-W]+B[i+W]);
    lB+=0.05*(B[i-W-1]+B[i-W+1]+B[i+W-1]+B[i+W+1]);
    const a=A[i], b=B[i], abb=a*b*b;
    nA[i]=a+(Da*lA - abb + feed*(1-a))*dt;
    nB[i]=b+(Db*lB + abb - (kill+feed)*b)*dt;
  }
}`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const sc=2;let W=1,H=1,A,B,nA,nB,img;
    function alloc(){W=Math.max(8,Math.floor(o.W()/sc));H=Math.max(8,Math.floor(o.H()/sc));const n=W*H;A=new Float32Array(n);B=new Float32Array(n);nA=new Float32Array(n);nB=new Float32Array(n);A.fill(1);img=x.createImageData(W,H);
      for(let k=0;k<14;k++){const cx=2+Math.floor(Math.random()*(W-4)),cy=2+Math.floor(Math.random()*(H-4)),r=2+Math.floor(Math.random()*4);for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const px=cx+dx,py=cy+dy;if(px>0&&px<W-1&&py>0&&py<H-1)B[py*W+px]=1;}}}
    alloc();
    const Da=1.0,Db=0.5,feed=0.055,kill=0.062,dt=1.0;let raf,run=true;
    function step(){
      for(let y=1;y<H-1;y++)for(let xx=1;xx<W-1;xx++){const i=y*W+xx;
        let lA=-A[i],lB=-B[i];
        lA+=0.2*(A[i-1]+A[i+1]+A[i-W]+A[i+W]);lA+=0.05*(A[i-W-1]+A[i-W+1]+A[i+W-1]+A[i+W+1]);
        lB+=0.2*(B[i-1]+B[i+1]+B[i-W]+B[i+W]);lB+=0.05*(B[i-W-1]+B[i-W+1]+B[i+W-1]+B[i+W+1]);
        const a=A[i],b=B[i],abb=a*b*b;
        let va=a+(Da*lA-abb+feed*(1-a))*dt;let vb=b+(Db*lB+abb-(kill+feed)*b)*dt;
        nA[i]=va<0?0:(va>1?1:va);nB[i]=vb<0?0:(vb>1?1:vb);}
      let t=A;A=nA;nA=t;t=B;B=nB;nB=t;
    }
    (function loop(){if(!run)return;
      if(W!==Math.max(8,Math.floor(o.W()/sc))||H!==Math.max(8,Math.floor(o.H()/sc)))alloc();
      for(let s=0;s<8;s++)step();
      const d=img.data;
      for(let i=0;i<W*H;i++){let v=B[i]*3.2;if(v>1)v=1;const r=Math.round(7+v*(v<0.5?246:0));const g=Math.round(9+v*(v<0.5?72:215));const bb=Math.round(13+v*(v<0.5?242:185));const j=i*4;d[j]=r;d[j+1]=g;d[j+2]=bb;d[j+3]=255;}
      const off=document.createElement('canvas');off.width=W;off.height=H;off.getContext('2d').putImageData(img,0,0);
      x.imageSmoothingEnabled=true;x.drawImage(off,0,0,o.W(),o.H());
      raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
