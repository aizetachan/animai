/** @type {import('../types.js').Effect} */
const effect = {
  id:'sc-card-carousel-3d', title:'3D Card Carousel', cat:'Scroll',
  tags:['scroll','3d','carousel','carrusel','perspective','cards','旋转木马'],
  desc:'Carrusel circular 3D de tarjetas que rota alrededor de un eje vertical a medida que se hace scroll.',
  meta:['perspective','transform 3D','scroll %'],
  prompt:`Crea un carrusel 3D de tarjetas que rota con el scroll.
Estructura: un contenedor con perspective (~800px) y un escenario hijo con transform-style:preserve-3d. Coloca N tarjetas en círculo: cada tarjeta i se rota rotateY(i*360/N) y se traslada translateZ(radio) para formar un cilindro.
Algoritmo: mapea el progreso de scroll 0->1 a un ángulo global; aplica al escenario rotateY(-angulo) para girar todo el cilindro. Atenúa opacidad/brillo de las tarjetas según su orientación (las del frente más brillantes, las del fondo oscurecidas) calculando el coseno de su ángulo efectivo.
Timings: el ángulo se interpola suave; añade un ligero tilt rotateX para perspectiva cinematográfica. Radio = (cardWidth/2)/tan(PI/N).`,
  code:`<div class="cc"><div class="cc-stage">
  <div class="cc-card">1</div><div class="cc-card">2</div>
  <div class="cc-card">3</div><div class="cc-card">4</div>
  <div class="cc-card">5</div><div class="cc-card">6</div>
</div></div>
<style>
.cc{perspective:800px;height:300px;display:grid;place-items:center}
.cc-stage{position:relative;width:140px;height:180px;transform-style:preserve-3d}
.cc-card{position:absolute;inset:0;border-radius:14px;display:grid;place-items:center;
  font:800 32px Inter,sans-serif;color:#fff;backface-visibility:hidden;
  background:linear-gradient(135deg,#7b5cff,#00e0c6)}
</style>
<script>
const stage=document.querySelector('.cc-stage');
const cards=[...document.querySelectorAll('.cc-card')];
const N=cards.length,radius=(140/2)/Math.tan(Math.PI/N);
cards.forEach((c,i)=>{c.style.transform='rotateY('+(i*360/N)+'deg) translateZ('+radius+'px)';});
function frame(){
  const p=scrollY/(document.body.scrollHeight-innerHeight||1);
  const angle=p*360*1.5;
  stage.style.transform='rotateX(-6deg) rotateY('+(-angle)+'deg)';
  cards.forEach((c,i)=>{
    const eff=(i*360/N - angle)*Math.PI/180;
    const front=(Math.cos(eff)+1)/2;
    c.style.filter='brightness('+(0.4+front*0.6)+')';
  });
  requestAnimationFrame(frame);
}
frame();
</script>`,
  /* @render-start */
  render(el){
    const s=document.createElement('div');s.className='stage';
    s.style.cssText='display:grid;place-items:center;overflow:hidden;perspective:600px';
    el.appendChild(s);
    const N=6;
    const stage=document.createElement('div');
    stage.style.cssText='position:relative;width:84px;height:112px;transform-style:preserve-3d';
    s.appendChild(stage);
    const cols=[['#7b5cff','#5a3fd6'],['#00e0c6','#0a9d8c'],['#ff6ad5','#a23fc6'],
                ['#ffb347','#ff6a3f'],['#4ad6ff','#3f7fd6'],['#b6ff5c','#4fb33f']];
    const radius=(84/2)/Math.tan(Math.PI/N);
    const cards=[];
    for(let i=0;i<N;i++){
      const c=document.createElement('div');
      c.style.cssText='position:absolute;inset:0;border-radius:12px;display:grid;place-items:center;'
        +'font:800 26px Inter,system-ui,sans-serif;color:#fff;backface-visibility:hidden;'
        +'box-shadow:0 8px 24px rgba(0,0,0,.4);background:linear-gradient(135deg,'+cols[i][0]+','+cols[i][1]+')';
      c.textContent=String(i+1);
      c.style.transform='rotateY('+(i*360/N)+'deg) translateZ('+radius+'px)';
      stage.appendChild(c);cards.push(c);
    }
    let raf,run=true,p=0,dir=1,angle=0,target=0;
    (function loop(){if(!run)return;
      p+=dir*0.0035;if(p>=1){p=1;dir=-1;}if(p<=0){p=0;dir=1;}
      target=p*360*1.4;
      angle+=(target-angle)*0.12;
      stage.style.transform='rotateX(-7deg) rotateY('+(-angle)+'deg)';
      cards.forEach((c,i)=>{
        const eff=(i*360/N - angle)*Math.PI/180;
        const front=(Math.cos(eff)+1)/2;
        c.style.filter='brightness('+(0.35+front*0.65)+')';
        c.style.opacity=String(0.5+front*0.5);
      });
      raf=requestAnimationFrame(loop);
    })();
    return{stop(){run=false;cancelAnimationFrame(raf);el.innerHTML='';}};
  }
};
export default effect;
