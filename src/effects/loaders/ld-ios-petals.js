/** @type {import('../types.js').Effect} */
const effect = {
  id:'ld-ios-petals', title:'iOS Petals', cat:'Loaders',
  tags:['css','loader','spinner','ios','petals','petalos','apple','carga'],
  desc:'Doce petalos dispuestos en circulo que se desvanecen en secuencia, el clasico spinner de iOS.',
  meta:['transform','0 JS'],
  prompt:`Crea el clasico spinner de iOS con 12 petalos.
Genera 12 divs (petalos) dentro de un contenedor relativo. Cada petalo es una barra redondeada de ~3x9px, posicionada en el centro con transform-origin desplazado y rotada en pasos de 30deg (rotate(0)..rotate(330deg) translate(radio)).
Cada petalo usa un mismo @keyframes que va de opacity:1 a opacity:.15, con animation-delay escalonado en pasos de ~1/12 de la duracion para crear el efecto de desvanecimiento secuencial girando.
Duracion total ~1.2s, linear, infinite. Solo CSS, sin SVG ni JS.`,
  code:`.ios-spin { position: relative; width: 40px; height: 40px; }
.ios-spin i {
  position: absolute; left: 50%; top: 50%; width: 3px; height: 9px;
  border-radius: 2px; background: #7b5cff;
  transform-origin: 50% 17px;
  animation: ios-fade 1.2s linear infinite;
}
/* 12 petalos: rotacion 30deg y delay escalonado */
.ios-spin i:nth-child(1){ transform: rotate(0deg) translateY(-17px); animation-delay:-1.1s; }
.ios-spin i:nth-child(2){ transform: rotate(30deg) translateY(-17px); animation-delay:-1.0s; }
/* ... hasta nth-child(12) con rotate(330deg) y delay -0s ... */
@keyframes ios-fade {
  0% { opacity: 1; }
  100% { opacity: 0.15; }
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    const N=12, dur=1.2;
    let petals='';
    for(let k=0;k<N;k++){
      const ang=k*(360/N);
      const delay=-(dur*(N-1-k)/N).toFixed(3);
      const col=k%2===0?'#7b5cff':'#00e0c6';
      petals+='<i style="background:'+col+';transform:rotate('+ang+'deg) translateY(-19px);animation-delay:'+delay+'s"></i>';
    }
    s.innerHTML='<style>'+
      '.ldIosSpin{position:relative;width:48px;height:48px}'+
      '.ldIosSpin i{position:absolute;left:calc(50% - 2px);top:calc(50% - 5px);width:4px;height:11px;border-radius:2px;transform-origin:50% 19px;animation:ldIosFade '+dur+'s linear infinite}'+
      '@keyframes ldIosFade{0%{opacity:1}100%{opacity:.15}}'+
      '</style>'+
      '<div class="ldIosSpin">'+petals+'</div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
