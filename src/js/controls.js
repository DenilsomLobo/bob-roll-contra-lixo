const touch={left:false,right:false,up:false,down:false,jump:false,shoot:false};
const held=new Map();
const joystick=document.querySelector('#joystick');
const stick=document.querySelector('#joystick-stick');
let stickPointer=null;
function centerStick(){stickPointer=null;stick.style.transform='translate(-50%,-50%)';joystick.classList.remove('active');}
function resetTouch(){held.clear();centerStick();Object.keys(touch).forEach(k=>touch[k]=false);document.querySelectorAll('[data-input]').forEach(b=>b.classList.remove('pressed'));}
function refreshTouch(){Object.keys(touch).forEach(k=>touch[k]=false);for(const keys of held.values())for(const k of keys)touch[k]=true;document.querySelectorAll('[data-input]').forEach(b=>b.classList.toggle('pressed',b.dataset.input.split(' ').every(k=>touch[k])));}
for(const button of document.querySelectorAll('[data-input]')){
 button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);held.set(e.pointerId,button.dataset.input.split(' '));refreshTouch();});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,e=>{held.delete(e.pointerId);refreshTouch();});
}
function moveStick(e){
 const box=joystick.getBoundingClientRect(),radius=box.width*.32;
 let x=e.clientX-box.left-box.width/2,y=e.clientY-box.top-box.height/2;
 const distance=Math.hypot(x,y);if(distance>radius){x*=radius/distance;y*=radius/distance;}
 stick.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;
 let keys=[];
 if(distance>box.width*.12){const sector=(Math.round(Math.atan2(y,x)/(Math.PI/4))+8)%8;keys=[['right'],['right','down'],['down'],['left','down'],['left'],['left','up'],['up'],['right','up']][sector];}
 held.set(e.pointerId,keys);refreshTouch();
}
joystick.addEventListener('pointerdown',e=>{if(stickPointer!==null)return;e.preventDefault();stickPointer=e.pointerId;joystick.setPointerCapture(e.pointerId);joystick.classList.add('active');moveStick(e);});
joystick.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)moveStick(e);});
for(const event of ['pointerup','pointercancel','lostpointercapture'])joystick.addEventListener(event,e=>{if(e.pointerId!==stickPointer)return;held.delete(e.pointerId);centerStick();refreshTouch();});
window.addEventListener('blur',resetTouch);
document.addEventListener('visibilitychange',()=>{if(document.hidden)resetTouch();});
const mission=()=>window.bobGame?.scene.getScene('mission');
document.querySelector('#pause').onclick=()=>{resetTouch();mission()?.pauseGame();};
document.querySelector('#start-touch').onclick=()=>{resetTouch();const s=mission();if(s?.mode==='title')s.start();else if(['won','lost'].includes(s?.mode))s.scene.restart();};
document.querySelector('#toggle-touch').onclick=()=>{resetTouch();const on=document.body.classList.toggle('show-touch');document.querySelector('#toggle-touch').setAttribute('aria-pressed',String(on));};
function formatTime(seconds){return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');}
const ranking={
 read(){try{const rows=JSON.parse(localStorage.getItem('bobroll-ranking-v1')||'[]');return Array.isArray(rows)?rows.filter(r=>r&&typeof r.name==='string'&&Number.isFinite(r.score)&&Number.isFinite(r.seconds)&&r.score>=0&&r.seconds>=0).sort((a,b)=>b.score-a.score||a.seconds-b.seconds).slice(0,10):[];}catch{return [];}},
 render(rows=this.read()){const body=document.querySelector('#rank-rows');body.replaceChildren();document.querySelector('#rank-empty').hidden=rows.length>0;rows.forEach((r,i)=>{const tr=document.createElement('tr');for(const value of [i+1,r.name,String(r.score).padStart(6,'0'),formatTime(r.seconds),r.won?'VITÓRIA':'DERROTA']){const td=document.createElement('td');td.textContent=value;tr.append(td);}body.append(tr);});},
 finish(scene){if(scene.rankSaved)return;scene.rankSaved=true;const name=scene.pilotName||document.querySelector('#pilot').value.trim().slice(0,16)||'BOB';const row={name,score:scene.score,seconds:Math.floor(scene.elapsed/1000),won:scene.mode==='won'};const rows=[...this.read(),row].sort((a,b)=>b.score-a.score||a.seconds-b.seconds).slice(0,10);try{localStorage.setItem('bobroll-ranking-v1',JSON.stringify(rows));document.querySelector('#rank-status').textContent='Partida registrada no ranking deste navegador.';}catch{document.querySelector('#rank-status').textContent='Armazenamento indisponível: esta partida não pôde ser salva.';}this.render();if(globalRanking.configured)this.publish(row);}
};
ranking.publish=async function(row){
 const status=document.querySelector('#rank-status');status.textContent='Enviando pontuação ao ranking global…';
 try{await globalRanking.save(row,crypto.randomUUID());this.render(await globalRanking.read());document.querySelector('#rank-scope').textContent='Top 10 global';status.textContent='Pontuação registrada no Top 10 global.';}
 catch{status.textContent='Não foi possível enviar ao ranking global. A partida foi salva neste navegador.';}
};
ranking.render();
globalRanking.init().then(async service=>{if(!service)return;ranking.render(await service.read());document.querySelector('#rank-scope').textContent='Top 10 global';document.querySelector('#rank-status').textContent='Ranking global conectado.';}).catch(error=>{document.querySelector('#rank-status').textContent=error.code==='permission-denied'?'Ranking global aguardando liberação das regras Firebase. Exibindo o Top 10 deste navegador.':'Ranking global indisponível. Exibindo o Top 10 deste navegador.';});
const nameKeyboard=document.querySelector('#name-keyboard'),pilot=document.querySelector('#pilot');
for(const row of ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM','0123456789']){
 const line=document.createElement('div');line.className='keyboard-row';
 for(const letter of row){const button=document.createElement('button');button.type='button';button.textContent=letter;button.onclick=()=>{if(pilot.value.length<16)pilot.value+=letter;pilot.dispatchEvent(new Event('input',{bubbles:true}));};line.append(button);}nameKeyboard.append(line);
}
for(const [label,action]of [['ESPAÇO',()=>{if(pilot.value.length<16)pilot.value+=' ';}],['APAGAR',()=>{pilot.value=pilot.value.slice(0,-1);}],['PRONTO',()=>{document.querySelector('#toggle-keyboard').click();}]]){const button=document.createElement('button');button.type='button';button.textContent=label;button.onclick=action;nameKeyboard.append(button);}
document.querySelector('#toggle-keyboard').onclick=e=>{const show=nameKeyboard.hidden;nameKeyboard.hidden=!show;e.currentTarget.setAttribute('aria-pressed',String(show));pilot.inputMode=show?'none':'text';pilot.blur();};
document.querySelector('#pilot').addEventListener('focus',()=>{const s=mission();if(s?.mode==='playing')s.pauseGame();if(s?.input.keyboard)s.input.keyboard.enabled=false;});
document.querySelector('#pilot').addEventListener('blur',()=>{const s=mission();if(s?.input.keyboard)s.input.keyboard.enabled=true;});

document.querySelector('#begin-mission').onclick=()=>mission()?.start();
pilot.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();e.stopPropagation();mission()?.start();}});
pilot.addEventListener('input',()=>{if(pilot.value.trim()){document.querySelector('#pilot-error').hidden=true;pilot.removeAttribute('aria-invalid');}});
