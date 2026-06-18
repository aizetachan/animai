/** @type {import('../types.js').Effect} */
const effect = {
  id:'nv-custom-scrollbar', title:'Custom Scrollbar', cat:'Navegación',
  tags:['scrollbar','scroll','thumb','barra','custom','stretch','elastic'],
  desc:'Scrollbar personalizada cuyo thumb se estira elásticamente al desplazar y vuelve a su tamaño al parar.',
  meta:['scroll','thumb','CSS+JS'],
  prompt:`Crea una scrollbar personalizada con un "thumb" (mango) que se estira mientras el usuario hace scroll y se relaja al detenerse.
Elementos: un contenedor scrolleable (overflow:auto) con su contenido, y un track + thumb propios renderizados como divs absolutos a la derecha (oculta la scrollbar nativa con scrollbar-width:none / ::-webkit-scrollbar{display:none}).
Técnica: en cada evento scroll calcula la posición proporcional del thumb (scrollTop/(scrollHeight-clientHeight)) y su altura base (clientHeight/scrollHeight). Mide la velocidad de scroll (delta de scrollTop por frame) y aplica un scaleY temporal al thumb proporcional a la velocidad (transform-origin según la dirección) para simular el estiramiento elástico; al parar, transición de vuelta a scaleY(1).
Detalles: thumb con gradiente #7b5cff→#00e0c6, esquinas redondeadas, transición suave del scale. Bucle de auto-demo: anima el scrollTop arriba y abajo.`,
  code:`<div class="scroller"><div class="content">…contenido largo…</div></div>
<div class="bar"><div class="thumb"></div></div>
<style>
.scroller{overflow:auto;height:300px;scrollbar-width:none}
.scroller::-webkit-scrollbar{display:none}
.bar{position:absolute;right:4px;top:6px;bottom:6px;width:6px;border-radius:6px;background:#1a1a2e}
.thumb{position:absolute;left:0;width:6px;border-radius:6px;background:linear-gradient(#7b5cff,#00e0c6);transition:transform .25s ease}
</style>
<script>
const sc=document.querySelector('.scroller'),thumb=document.querySelector('.thumb'),bar=document.querySelector('.bar');
let last=0,vel=0;
function update(){
  const max=sc.scrollHeight-sc.clientHeight;
  const ratio=sc.clientHeight/sc.scrollHeight;
  const h=Math.max(20,bar.clientHeight*ratio);
  thumb.style.height=h+'px';
  const top=(bar.clientHeight-h)*(sc.scrollTop/max);
  thumb.style.top=top+'px';
  vel=sc.scrollTop-last;last=sc.scrollTop;
  const stretch=Math.min(.5,Math.abs(vel)/40);
  thumb.style.transformOrigin=vel>0?'top':'bottom';
  thumb.style.transform='scaleY('+(1+stretch)+')';
  clearTimeout(thumb._t);thumb._t=setTimeout(()=>thumb.style.transform='scaleY(1)',120);
}
sc.addEventListener('scroll',update);update();
<\/script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='position:relative;width:100%;height:100%;background:#0a0a14;overflow:hidden;font-family:Inter,system-ui,sans-serif';
    let rows='';for(let i=0;i<14;i++)rows+='<div class="nvcs-row">Sección '+(i+1)+'</div>';
    s.innerHTML='<style>'
      +'.nvcs-scroller{position:absolute;inset:0;right:14px;overflow:auto;padding:10px 12px;scrollbar-width:none}'
      +'.nvcs-scroller::-webkit-scrollbar{display:none}'
      +'.nvcs-row{background:#16162a;border:1px solid #24243a;border-radius:7px;padding:9px 12px;margin-bottom:8px;color:#aaaace;font:600 12px Inter}'
      +'.nvcs-bar{position:absolute;right:5px;top:8px;bottom:8px;width:6px;border-radius:6px;background:#191929}'
      +'.nvcs-thumb{position:absolute;left:0;width:6px;border-radius:6px;background:linear-gradient(#7b5cff,#00e0c6);transition:transform .22s ease}'
      +'</style>'
      +'<div class="nvcs-scroller">'+rows+'</div>'
      +'<div class="nvcs-bar"><div class="nvcs-thumb"></div></div>';
    el.appendChild(s);
    const sc=s.querySelector('.nvcs-scroller'),thumb=s.querySelector('.nvcs-thumb'),bar=s.querySelector('.nvcs-bar');
    let last=0,resetT,raf,run=true,t0=performance.now();
    function update(){
      const max=Math.max(1,sc.scrollHeight-sc.clientHeight);
      const ratio=sc.clientHeight/sc.scrollHeight;
      const h=Math.max(22,bar.clientHeight*ratio);
      thumb.style.height=h+'px';
      thumb.style.top=(bar.clientHeight-h)*(sc.scrollTop/max)+'px';
      const vel=sc.scrollTop-last;last=sc.scrollTop;
      const stretch=Math.min(.55,Math.abs(vel)/30);
      thumb.style.transformOrigin=vel>=0?'top':'bottom';
      thumb.style.transform='scaleY('+(1+stretch)+')';
      clearTimeout(resetT);resetT=setTimeout(()=>{thumb.style.transform='scaleY(1)';},110);
    }
    update();
    // auto-demo: oscila el scroll con un seno acelerado
    function loop(){
      if(!run)return;
      const max=Math.max(1,sc.scrollHeight-sc.clientHeight);
      const t=(performance.now()-t0)/1000;
      const p=(1-Math.cos(t*1.1))/2; // 0..1 suave de ida y vuelta
      sc.scrollTop=p*max;
      update();
      raf=requestAnimationFrame(loop);
    }
    raf=requestAnimationFrame(loop);
    return{stop(){run=false;cancelAnimationFrame(raf);clearTimeout(resetT);el.innerHTML='';}};
  }
};
export default effect;
