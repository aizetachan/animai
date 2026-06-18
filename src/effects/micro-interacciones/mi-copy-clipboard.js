/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-copy-clipboard', title:'Copy to Clipboard', cat:'Micro-interacciones',
  tags:['copy','copiar','clipboard','boton','check','feedback','toggle'],
  desc:'Boton que al pulsarse cambia su icono a un check y el texto a Copiado, luego revierte solo (auto-demo).',
  meta:['CSS+JS','transition'],
  prompt:`Crea un boton "Copiar" que da feedback al copiar.
Estructura: un boton con un icono (dos rectangulos simulando paginas) y la etiqueta "Copiar".
Al hacer clic: cambia el fondo a color secundario (#00e0c6), el icono se transforma en un check (dibujado con un span rotado con bordes, o un SVG) y el texto pasa a "Copiado". Anima la transicion con transform/opacity (escala o crossfade del icono).
Tras ~1.4s revierte al estado original. Para la demo, simula el clic con setInterval cada ~2.6s.`,
  code:`<button class="copy-btn">
  <span class="ic"></span><span class="lbl">Copiar</span>
</button>
<style>
.copy-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;
  border:none;border-radius:10px;background:#7b5cff;color:#fff;
  font:600 15px system-ui;cursor:pointer;transition:background .25s}
.copy-btn .ic{width:16px;height:16px;position:relative;transition:transform .25s}
.copy-btn .ic::before{content:'';position:absolute;inset:0 4px 4px 0;
  border:2px solid #fff;border-radius:3px}
.copy-btn.copied{background:#00e0c6;color:#04201c}
.copy-btn.copied .ic::before{border:none;width:11px;height:6px;
  border-left:2px solid #04201c;border-bottom:2px solid #04201c;
  inset:auto;left:2px;top:4px;transform:rotate(-45deg)}
</style>
<script>
const btn=document.querySelector('.copy-btn'),lbl=btn.querySelector('.lbl');
function copy(){
  btn.classList.add('copied');lbl.textContent='Copiado';
  setTimeout(()=>{btn.classList.remove('copied');lbl.textContent='Copiar';},1400);
}
btn.addEventListener('click',copy);
setInterval(copy,2600);
</scr` + `ipt>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'.miCopyBtn{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border:none;border-radius:10px;background:#7b5cff;color:#fff;font:600 15px system-ui;cursor:pointer;transition:background .25s}'
      +'.miCopyBtn .ic{width:16px;height:16px;position:relative;transition:transform .25s}'
      +'.miCopyBtn .ic::before{content:"";position:absolute;inset:0 4px 4px 0;border:2px solid #fff;border-radius:3px}'
      +'.miCopyBtn.copied{background:#00e0c6;color:#04201c}'
      +'.miCopyBtn.copied .ic::before{border:none;width:11px;height:6px;border-left:2px solid #04201c;border-bottom:2px solid #04201c;inset:auto;left:2px;top:4px;transform:rotate(-45deg)}'
      +'</style><button class="miCopyBtn"><span class="ic"></span><span class="lbl">Copiar</span></button>';
    el.appendChild(s);
    const btn=s.querySelector('.miCopyBtn'),lbl=btn.querySelector('.lbl');let r=null;
    function copy(){
      btn.classList.add('copied');lbl.textContent='Copiado';
      r=setTimeout(()=>{btn.classList.remove('copied');lbl.textContent='Copiar';},1400);
    }
    const iv=setInterval(copy,2600);copy();
    return{stop(){clearInterval(iv);if(r)clearTimeout(r);el.innerHTML='';}};
  }
};
export default effect;
