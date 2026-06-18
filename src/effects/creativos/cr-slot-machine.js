import { canvasPreview } from '../_runtime.js';
/** @type {import('../types.js').Effect} */
const effect = {
  id:'cr-slot-machine', title:'Slot Machine', cat:'Creativos',
  tags:['slot','老虎机','tragaperras','reels','spin','jackpot','canvas'],
  desc:'Tragaperras con rodillos de símbolos que giran y se detienen en cascada. Auto-demo con jackpot.',
  meta:['canvas','reels','老虎机'],
  prompt:`Crea una tragaperras (老虎机 / slot machine) de 3 rodillos.
Estructura de datos: un array de símbolos (emojis o glifos); cada rodillo tiene un offset vertical 'pos' (en unidades de celda) y una velocidad 'vel'.
Algoritmo: al girar, cada rodillo incrementa pos += vel cada frame; los símbolos se dibujan repetidos verticalmente con módulo para hacer scroll infinito. Para detener, cada rodillo decelera (vel *= friction) y, cuando es lenta, se engancha (snap) al múltiplo de celda más cercano con un pequeño rebote (easing). Los rodillos paran en cascada (uno tras otro) para dar tensión.
Render: ventana con 3 columnas y 3 filas visibles; línea de premio central resaltada; al alinear se hace flash de jackpot. Timings: aceleración ~300ms, giro ~1.4s, paradas escalonadas cada ~280ms, hold ~1.2s, reinicio.`,
  code:`// Slot machine: scroll infinito por rodillo + snap a celda al frenar
const SYM = ['🍒','🔔','⭐','🍋','7️⃣','💎'];
reels.forEach((r,i)=>{
  if (r.spinning){ r.pos += r.vel; }
  else { // snap al múltiplo de celda con rebote
    const target = Math.round(r.pos);
    r.pos += (target - r.pos) * 0.2;
  }
});
// dibujar: para cada fila visible, sym = SYM[ ((floor(pos)+row) % n + n) % n ]`,
  /* @render-start */
  render(el){
    const o=canvasPreview(el),x=o.x;
    const SYM=['🍒','🔔','⭐','🍋','7','💎'];
    let raf,run=true;
    let reels,phase,t0,holdUntil,flash;
    function reset(){
      reels=[0,1,2].map(()=>({pos:Math.random()*SYM.length,vel:0,spinning:false,stopAt:0,target:0}));
      phase='accel';t0=performance.now();holdUntil=0;flash=0;
      reels.forEach(r=>{r.spinning=true;r.vel=0;});
    }
    reset();
    function loop(now){
      if(!run)return;
      const W=o.W(),H=o.H();
      x.fillStyle='#0a0a16';x.fillRect(0,0,W,H);
      // marco de la máquina
      const pad=10;
      const winW=W-pad*2, winH=H-pad*2;
      const colW=winW/3, rowH=winH/3;
      const elapsed=now-t0;

      if(phase==='accel'){
        reels.forEach(r=>{r.vel=Math.min(r.vel+0.025,0.42);});
        if(elapsed>1500){
          phase='stop';t0=now;
          // resultado: 70% jackpot (alineado), si no aleatorio
          const jackpot=Math.random()<0.6;
          const win=Math.floor(Math.random()*SYM.length);
          reels.forEach((r,i)=>{
            r.stopAt=now+i*300;
            r.target=jackpot? win : Math.floor(Math.random()*SYM.length);
          });
        }
      } else if(phase==='stop'){
        let allStopped=true;
        reels.forEach((r,i)=>{
          if(r.spinning){
            if(now>=r.stopAt){
              r.vel*=0.86;
              if(r.vel<0.06){
                // snap para que la fila central sea r.target
                const desired=((r.target-1)%SYM.length+SYM.length)%SYM.length;
                let p=r.pos%SYM.length; if(p<0)p+=SYM.length;
                let diff=desired-p; while(diff>SYM.length/2)diff-=SYM.length; while(diff<-SYM.length/2)diff+=SYM.length;
                r.pos+=diff*0.25;
                if(Math.abs(diff)<0.02){r.pos=Math.round(r.pos-1)+1;r.spinning=false;}
              } else { r.pos+=r.vel; }
            } else { r.pos+=r.vel; }
            allStopped=false;
          }
        });
        if(allStopped){
          const c=reels.map(r=>{let p=Math.round(r.pos)+1;return((p%SYM.length)+SYM.length)%SYM.length;});
          if(c[0]===c[1]&&c[1]===c[2]) flash=now+1200;
          phase='hold';holdUntil=now+1200;
        }
      } else if(phase==='hold'){
        if(now>=holdUntil) reset();
      }

      // dibujar rodillos
      x.save();
      x.beginPath();x.rect(pad,pad,winW,winH);x.clip();
      x.fillStyle='#13132a';x.fillRect(pad,pad,winW,winH);
      reels.forEach((r,ci)=>{
        const colX=pad+ci*colW;
        // alterna fondo de columna
        x.fillStyle=ci%2?'#15152e':'#181834';
        x.fillRect(colX,pad,colW,winH);
        const frac=((r.pos%1)+1)%1;
        for(let row=-1;row<3;row++){
          let idx=Math.floor(r.pos)+row;
          let s=SYM[((idx%SYM.length)+SYM.length)%SYM.length];
          const cy=pad+(row*rowH)+rowH/2 - frac*rowH + rowH; // +rowH por la fila -1
          const isCenter=row===1;
          x.fillStyle=isCenter?'#eef0f7':'#8a8aac';
          x.font=(isCenter?'800 ':'600 ')+(rowH*.5)+'px Inter';
          x.textAlign='center';x.textBaseline='middle';
          x.fillText(s,colX+colW/2,cy);
        }
      });
      x.restore();
      // línea de premio central
      const lineY=pad+rowH;
      const won=flash>now;
      x.lineWidth=won?3:2;
      x.strokeStyle=won?'#00e0c6':'#7b5cff';
      if(won){x.shadowColor='#00e0c6';x.shadowBlur=12;}
      x.beginPath();x.moveTo(pad,lineY);x.lineTo(pad+winW,lineY);x.moveTo(pad,lineY+rowH);x.lineTo(pad+winW,lineY+rowH);x.stroke();
      x.shadowBlur=0;
      // borde
      x.lineWidth=2;x.strokeStyle='#2a2a48';x.strokeRect(pad,pad,winW,winH);
      if(won&&Math.floor(now/180)%2===0){
        x.fillStyle='rgba(0,224,198,.10)';x.fillRect(pad,lineY,winW,rowH);
      }
      raf=requestAnimationFrame(loop);
    }
    raf=requestAnimationFrame(loop);
    return{stop(){run=false;cancelAnimationFrame(raf);o.ro.disconnect();el.innerHTML='';}};
  }
};
export default effect;
