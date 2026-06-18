/** @type {import('../types.js').Effect} */
const effect = {
  id:'css-number-ticker', title:'Number Ticker', cat:'CSS Moderno',
  tags:['number','ticker','odometer','dígitos','rodar','contador','métricas'],
  desc:'Dígitos que ruedan en vertical como un cuentakilómetros. Distinto del count-up por interpolación.',
  meta:['translateY','steps','Odometer'],
  prompt:`Crea un "number ticker / odometer": cada dígito es una columna 0-9 que se desliza verticalmente hasta mostrar el dígito correcto, como un cuentakilómetros o un Vestaboard numérico.
A diferencia del count-up (que interpola un número), aquí cada posición rueda físicamente sus 10 dígitos. Anima translateY de cada columna a -(dígito * altura).
Para dashboards, métricas de impacto y precios.`,
  code:`/* Number ticker (cada dígito es una columna que rueda) */
.digit-col {
  display: flex; flex-direction: column;
  transition: transform 0.8s cubic-bezier(.2,.8,.2,1);
  transform: translateY(calc(var(--n) * -10%));   /* --n = 0..9 */
}
/* la columna contiene 0,1,2,...,9 apilados verticalmente */`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';s.style.cssText='display:grid;place-items:center';
    s.innerHTML='<div id="od" style="display:flex;gap:3px;font-size:36px;font-weight:800;color:#7b5cff"></div>';
    el.appendChild(s);const od=s.querySelector('#od');const cols=[];for(let k=0;k<4;k++){const wrap=document.createElement('div');wrap.style.cssText='height:44px;overflow:hidden';const col=document.createElement('div');col.style.cssText='display:flex;flex-direction:column;transition:transform .8s cubic-bezier(.2,.8,.2,1)';for(let d=0;d<10;d++){const c=document.createElement('div');c.textContent=d;c.style.cssText='height:44px;line-height:44px';col.appendChild(c);}wrap.appendChild(col);od.appendChild(wrap);cols.push(col);}
    let raf,run=true,c=0;function setN(n){const str=String(n).padStart(4,'0');cols.forEach((col,i)=>{col.style.transform='translateY(-'+(+str[i]*44)+'px)';});}
    (function loop(){if(!run)return;c++;if(c%70===0)setN(Math.floor(Math.random()*9000+1000));raf=requestAnimationFrame(loop);})();
    setN(1280);return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
