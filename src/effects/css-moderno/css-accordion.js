/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-accordion', title:'Smooth Accordion', cat:'CSS Moderno',
  tags:['accordion','acordeón','grid','expandir','css','faq','height'],
  desc:'Acordeón que se expande con animación fluida usando grid-rows. El truco moderno para animar altura auto.',
  meta:['grid-template-rows','0fr→1fr','0 JS'],
  prompt:`Anima un acordeón/FAQ con altura "auto" de forma fluida usando el truco de CSS grid.
El contenido va en un wrapper con grid-template-rows:0fr (cerrado) que pasa a 1fr (abierto) con transición; el hijo tiene overflow:hidden. Esto permite animar de 0 a la altura real del contenido, algo imposible con height:auto.
Para FAQs, menús desplegables, "ver más".`,
  code:`/* Acordeón fluido con grid-template-rows (anima height:auto) */
.accordion-content {
  display: grid; grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s ease;
}
.accordion[open] .accordion-content { grid-template-rows: 1fr; }
.accordion-content > div { overflow: hidden; }`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:flex;flex-direction:column;gap:8px;justify-content:center;padding:16px';
    s.innerHTML='<style>.acc{background:#16162a;border-radius:10px;overflow:hidden}.acch{padding:11px 14px;color:#eef0f7;font-weight:600;font-size:13px}.accc{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s ease}.accc>div{overflow:hidden;padding:0 14px;color:#8a8ca3;font-size:12px}.acc.open .accc{grid-template-rows:1fr}.acc.open .accc>div{padding:0 14px 12px}</style><div class="acc" id="a1"><div class="acch">¿Qué incluye? ▾</div><div class="accc"><div>Acceso completo a todos los efectos y su código fuente.</div></div></div><div class="acc"><div class="acch">¿Es gratis? ▾</div><div class="accc"><div>Sí, copia y pega lo que necesites.</div></div></div>';
    el.appendChild(s);const a1=s.querySelector('#a1');let raf,run=true,t=0;
    (function loop(){if(!run)return;t++;if(t%90===0)a1.classList.toggle('open');raf=requestAnimationFrame(loop);})();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
