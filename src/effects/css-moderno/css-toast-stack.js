/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-toast-stack', title:'Toast Stack', cat:'CSS Moderno',
  tags:['toast','notificación','stack','apilar','spring','entrar','salir'],
  desc:'Notificaciones que entran y se apilan, y salen con animación spring. El sistema de toasts moderno.',
  meta:['enter/exit','stack','Spring'],
  prompt:`Crea un sistema de notificaciones (toasts) apiladas: cada toast entra deslizándose desde un lado, se apila con las anteriores (que se escalan/desplazan ligeramente hacia atrás, estilo Sonner), y sale al expirar con fade+slide.
Gestiona una lista; al añadir, anima la entrada; al expirar, la salida; reposiciona la pila. Las de atrás se ven un poco más pequeñas y desplazadas.
Para feedback de sistema elegante.`,
  code:`// Toast stack (estilo Sonner) — las de atrás se escalan y desplazan
toasts.map((t, i) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: i * -8, scale: 1 - i * 0.05 }}
    exit={{ opacity: 0, x: 100 }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
))`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='position:relative;overflow:hidden';
    s.innerHTML='<div id="tstack" style="position:absolute;right:14px;bottom:14px;width:180px;height:120px"></div>';
    el.appendChild(s);const stack=s.querySelector('#tstack');let toasts=[],raf,run=true,c=0,id=0;
    const msgs=['Guardado ✓','Email enviado','Nuevo seguidor','Pago recibido'];
    function render(){[...stack.children].forEach(n=>n.remove());toasts.forEach((t,idx)=>{const i=toasts.length-1-idx;const d=document.createElement('div');d.textContent=t.msg;d.style.cssText='position:absolute;right:0;bottom:0;width:100%;box-sizing:border-box;padding:10px 12px;background:#16162a;border:1px solid #2a2a3e;border-radius:10px;color:#eef0f7;font-size:12px;font-weight:600;transition:.4s cubic-bezier(.3,1.4,.4,1);transform:translateY('+(-i*10)+'px) scale('+(1-i*.06)+');opacity:'+(1-i*.2)+';box-shadow:0 4px 16px rgba(0,0,0,.3)';stack.appendChild(d);});}
    (function loop(){if(!run)return;c++;if(c%50===0){toasts.push({id:id++,msg:msgs[id%msgs.length]});if(toasts.length>3)toasts.shift();render();}raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
