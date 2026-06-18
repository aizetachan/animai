/** @type {import('../types.js').Effect} */
const effect = {
  id:'mi-swipe-delete', title:'Swipe to Delete', cat:'Micro-interacciones',
  tags:['swipe','delete','eliminar','deslizar','lista','row','micro'],
  desc:'Fila de lista que se desliza a la izquierda revelando un boton rojo de eliminar, en bucle automatico.',
  meta:['transform','overflow','animation'],
  prompt:`Crea una micro-interaccion "swipe to delete" de lista.
Estructura: un contenedor .item con overflow hidden. Dentro, una .action roja absoluta a la derecha (icono papelera "Eliminar") y una .row con el contenido (avatar + texto) encima.
La .row se anima con transform:translateX desde 0 hasta -84px (revelando la accion) y vuelve, con @keyframes en bucle, ease-in-out.
La accion roja usa background #ff3b30. Cuando la row esta desplazada del todo, opcionalmente la accion hace un pequeno scale de feedback.
Timing del ciclo ~3s infinite.`,
  code:`<div class="item">
  <div class="action">\u{1F5D1}</div>
  <div class="row">
    <div class="av"></div>
    <div class="txt"><b>Mensaje</b><span>Toca para abrir</span></div>
  </div>
</div>
<style>
.item{position:relative;width:220px;height:60px;border-radius:12px;overflow:hidden}
.action{position:absolute;right:0;top:0;bottom:0;width:84px;background:#ff3b30;
  color:#fff;display:grid;place-items:center;font-size:22px}
.row{position:absolute;inset:0;background:#16161f;display:flex;align-items:center;
  gap:10px;padding:0 14px;animation:swSwipe 3s ease-in-out infinite}
.av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#7b5cff,#00e0c6)}
.txt{display:flex;flex-direction:column;color:#fff;font-size:13px}
.txt span{opacity:.5;font-size:11px}
@keyframes swSwipe{0%,15%{transform:translateX(0)}50%,80%{transform:translateX(-84px)}100%{transform:translateX(0)}}
</style>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<style>'
      +'@keyframes miSwSwipe{0%,15%{transform:translateX(0)}50%,80%{transform:translateX(-84px)}100%{transform:translateX(0)}}'
      +'.miSwItem{position:relative;width:220px;height:60px;border-radius:12px;overflow:hidden;font-family:system-ui,sans-serif}'
      +'.miSwAction{position:absolute;right:0;top:0;bottom:0;width:84px;background:#ff3b30;color:#fff;display:grid;place-items:center;font-size:22px}'
      +'.miSwRow{position:absolute;inset:0;background:#16161f;display:flex;align-items:center;gap:10px;padding:0 14px;animation:miSwSwipe 3s ease-in-out infinite}'
      +'.miSwAv{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#7b5cff,#00e0c6);flex:none}'
      +'.miSwTxt{display:flex;flex-direction:column;color:#fff;font-size:13px}'
      +'.miSwTxt span{opacity:.5;font-size:11px}'
      +'</style>'
      +'<div class="miSwItem"><div class="miSwAction">\u{1F5D1}</div><div class="miSwRow"><div class="miSwAv"></div><div class="miSwTxt"><b>Mensaje</b><span>Toca para abrir</span></div></div></div>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
