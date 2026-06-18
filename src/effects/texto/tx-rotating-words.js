/** @type {import('../types.js').Effect} */
const effect = {
  id:'tx-rotating-words', title:'Rotating Words', cat:'Texto',
  tags:['texto','rotating','words','3d','cube','flip','carrusel'],
  desc:'Una palabra dentro de la frase rota verticalmente en 3D para intercambiarse por la siguiente.',
  meta:['transform 3D','perspective','rotateX'],
  prompt:`Crea un "rotating words" donde una palabra de una frase fija se sustituye por otra con un giro 3D vertical.
Estructura: una frase tipo "Hazlo [palabra]" con un contenedor inline de altura fija y overflow:hidden que actua de ventana. Dentro, las palabras se apilan; el grupo tiene transform-style:preserve-3d y perspective en el padre.
Tecnica: cada palabra ocupa una cara; al cambiar, el grupo gira en rotateX para mostrar la siguiente palabra (entra desde arriba con rotateX(90deg), pasa a 0deg, y la anterior sale hacia abajo a rotateX(-90deg)), con un fundido de opacidad. Alternativamente translateY del stack.
Timing: cada palabra visible ~2s, transicion ~0.6s cubic-bezier. La palabra rotada va en color acento #7b5cff. Recorre una lista de 3-4 palabras en bucle.`,
  code:`<h2 class="rot">Hazlo <span class="rot-words"><b>rapido</b><b>fluido</b><b>memorable</b></span></h2>
<style>
.rot-words{display:inline-block;height:1.2em;overflow:hidden;vertical-align:bottom;perspective:300px}
.rot-words b{display:block;color:#7b5cff;font-weight:800;transition:transform .6s cubic-bezier(.2,.8,.2,1),opacity .6s}
</style>
<script>
const box=document.querySelector('.rot-words');const items=[...box.children];let i=0;
function tick(){items.forEach((b,n)=>{const d=((n-i)+items.length)%items.length;b.style.transform='rotateX('+(d===0?0:d===items.length-1?90:-90)+'deg) translateY('+(d===0?0:-100)+'%)';b.style.opacity=d===0?1:0;});i=(i+1)%items.length;}
tick();setInterval(tick,2000);
<\/script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.innerHTML='<style>'
      +'.txrw{margin:0;font-size:28px;font-weight:800;color:#fff;letter-spacing:-.01em;display:flex;align-items:baseline;gap:.28em}'
      +'.txrw-w{display:inline-block;height:1.2em;line-height:1.2em;overflow:hidden;perspective:340px;position:relative;min-width:5.2em}'
      +'.txrw-w b{position:absolute;left:0;top:0;display:block;color:#7b5cff;font-weight:800;transform-origin:50% 50% -.6em;transition:transform .6s cubic-bezier(.2,.8,.2,1),opacity .6s;opacity:0}'
      +'</style>'
      +'<div style="height:100%;display:grid;place-items:center"><h2 class="txrw">Hazlo <span class="txrw-w"><b>rapido</b><b>fluido</b><b>memorable</b></span></h2></div>';
    el.appendChild(s);
    const box=s.querySelector('.txrw-w');const items=[...box.children];let i=0,run=true;
    function tick(){
      items.forEach((b,n)=>{
        const d=((n-i)+items.length)%items.length;
        if(d===0){b.style.transform='rotateX(0deg)';b.style.opacity='1';}
        else if(d===items.length-1){b.style.transform='rotateX(90deg)';b.style.opacity='0';}
        else{b.style.transform='rotateX(-90deg)';b.style.opacity='0';}
      });
      i=(i+1)%items.length;
    }
    tick();
    const t=setInterval(()=>{if(run)tick();},2000);
    return{stop(){run=false;clearInterval(t);el.innerHTML='';}};
  }
};
export default effect;
