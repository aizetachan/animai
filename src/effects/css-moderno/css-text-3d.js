/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-text-3d', title:'CSS 3D Text', cat:'CSS Moderno',
  tags:['css','texto','3d','extruido','sombra','titular'],
  desc:'Texto con profundidad 3D usando solo text-shadow apilada. Titulares con relieve sin imágenes.',
  meta:['text-shadow','3D fake','0 JS'],
  prompt:`Da relieve 3D a un titular usando solo text-shadow apilada en CSS.
Genera N capas de sombra desplazadas 1px en diagonal con color cada vez más oscuro (text-shadow: 1px 1px #c, 2px 2px #c, ... 8px 8px #c) para simular extrusión.
Opcional: anima un ligero rotateX con transform y perspective en el contenedor. Para heros retro/arcade o branding con peso.`,
  code:`/* Extrusión 3D solo con text-shadow apilada */
.text-3d {
  font-size: 4rem; font-weight: 900; color: #7b5cff;
  text-shadow:
    1px 1px 0 #5a3fd6, 2px 2px 0 #523acb,
    3px 3px 0 #4a34c0, 4px 4px 0 #422eb5,
    5px 5px 0 #3a28aa, 6px 6px 12px rgba(0,0,0,.4);
}`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<span style="font-size:46px;font-weight:900;color:#7b5cff;letter-spacing:-.02em;text-shadow:1px 1px 0 #5a3fd6,2px 2px 0 #523acb,3px 3px 0 #4a34c0,4px 4px 0 #422eb5,5px 5px 0 #3a28aa,6px 6px 0 #32229f,7px 7px 14px rgba(0,0,0,.5)">MOTION</span>';
    el.appendChild(s);return{stop(){el.innerHTML='';}};
  }
};
export default effect;
