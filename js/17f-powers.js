/* Shapeland · a world by Shirel Yitzhak */
/* ===================== MY SUPERPOWER: each player picks one, and it grows with what you know ===================== */
const POWERS={fly:{en:'Fly',he:'לעוף',em:'🕊️',say:'You can fly! Hold the jump button to go up.'},
  speed:{en:'Super speed',he:'מהירות על',em:'⚡',say:'You are super fast! Tap the power button and run!'},
  jump:{en:'Super jump',he:'קפיצת על',em:'🦘',say:'You can jump super high! Tap the power button, then jump.'}};
const PW={e:0,max:6,active:false,trailT:0,trail:[],wings:null};
function powerMax(){const r=typeof rankInfo==='function'?rankInfo().i:0;return 6+r*1.6}
function flyCeil(){const r=typeof rankInfo==='function'?rankInfo().i:0;return Math.min(12,3.5+r*.9)}
PW.e=powerMax();
function openPowers(first){PANEL='powers';const cur=P.power;
  sheet(`<div class="center"><div style="font-size:56px">✨</div><h2>${en(first?'Choose your superpower!':'My superpower')}</h2><p class="sub">${first?'כל שחקן בוחר כוח־על משלו. הכוח מתחזק ככל שהדרגה שלך עולה 📈':'הכוח מתחזק ככל שהדרגה עולה. אפשר להחליף כוח בכל רגע.'}</p></div>
  <div class="opts one">${Object.entries(POWERS).map(([k,v])=>`<button class="opt pw ${cur===k?'on':''}" data-a="setpower" data-v="${k}"><span class="em">${v.em}</span><span><b>${v.he}</b> <span class="en" dir="ltr">${v.en}</span></span></button>`).join('')}</div>
  ${cur?`<p class="sub">⏱️ זמן כוח: ${powerMax().toFixed(0)} שניות${cur==='fly'?` · גובה מקסימלי: ${flyCeil().toFixed(1)} מטר`:''}</p>`:''}<button class="btn ghost" data-a="close">${en(cur?'Close':'Later')}</button>`)}
ACTX.powers=()=>openPowers(false);
ACTX.setpower=d=>{P.power=d.v;save();PW.e=powerMax();stopPower();updatePowerBtn();closeSheet();const v=POWERS[d.v];burst(v.em+' '+v.en+'!');say(v.say);toast(`${v.em} ${v.he}! הכפתור ${v.em} נמצא ליד הג׳ויסטיק`);if(typeof SND!=='undefined')SND.sparkle()};
function updatePowerBtn(){let b=$('#bPow');const acts=document.querySelector('#pad .acts');if(!acts)return;
  if(!b){b=document.createElement('button');b.id='bPow';b.className='act pow';b.setAttribute('aria-label','כוח־על');acts.appendChild(b);
    b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(!P.power){openPowers(true);return}togglePower()})}
  const v=POWERS[P.power];b.innerHTML=`${v?v.em:'✨'}<small>${v?(PW.active?'פועל!':v.he):'כוח־על'}</small>`;b.setAttribute('aria-pressed',PW.active);b.style.setProperty('--e',Math.round(PW.e/powerMax()*100)+'%')}
function togglePower(){if(PW.active){stopPower();return}if(PW.e<1){toast('⚡ הכוח נטען... עוד רגע');return}PW.active=true;
  if(P.power==='fly'){ME.flying=true;ME.vy=4;if(typeof SND!=='undefined')SND.whoosh();addWings(true)}
  if(P.power==='speed'&&typeof SND!=='undefined')SND.sparkle();if(P.power==='jump'&&typeof SND!=='undefined')SND.boing();updatePowerBtn()}
function stopPower(){PW.active=false;if(ME.flying){ME.flying=false;ME.glide=true}addWings(false);updatePowerBtn()}
function addWings(on){if(PW.wings&&PW.wings.parent)PW.wings.parent.remove(PW.wings);PW.wings=null;if(!on||!ME.obj)return;const g=new THREE.Group();
  [-1,1].forEach(s=>{const w=mesh(new THREE.SphereGeometry(.42,14,10),mat('#FFFFFF',{transparent:true,opacity:.85,emissive:'#E0E7FF',emissiveIntensity:.5}));w.scale.set(1.3,.55,.12);w.position.set(s*.42,1.05,-.25);w.rotation.z=s*.45;g.add(w)});ME.obj.add(g);PW.wings=g}
/* called from the movement step: returns the speed to use, and handles flying */
function powerPhysics(dt,fl,grounded){const max=powerMax();
  if(PW.active){PW.e=Math.max(0,PW.e-dt);if(PW.e<=0){stopPower();toast('✨ הכוח נגמר. הוא נטען כשנחים על הקרקע')}}
  else if(grounded||ME.swim)PW.e=Math.min(max,PW.e+dt*.8);
  if(ME.flying){const up=PAD.jumpHeld;const ceil=fl.h+flyCeil();ME.vy+=((up?4.2:-1.1)-ME.vy)*Math.min(1,dt*4);ME.y+=ME.vy*dt;if(ME.y>ceil){ME.y=ceil;ME.vy=Math.min(0,ME.vy)}
    if(ME.y<=fl.h){ME.y=fl.h;ME.vy=0}ME.air=ME.y>fl.h+.02;ME.swim=false;return true}
  if(ME.glide&&!grounded){ME.vy=Math.max(ME.vy-9*dt,-2.2);ME.y+=ME.vy*dt;if(ME.y<=fl.h){ME.y=fl.h;ME.vy=0;ME.glide=false}ME.air=ME.y>fl.h+.02;return true}
  ME.glide=false;return false}
function powerSpeed(base){if(PW.active&&P.power==='speed')return Math.max(base,13);if(ME.flying)return 7.5;return base}
function powerJumpV(){if(PW.active&&P.power==='jump')return 13;return 7.2}
let pwUi=0;
function stepPowers(dt,t){pwUi+=dt;if(pwUi>.25){pwUi=0;updatePowerBtn()}
  if(!ME.obj)return;const L=ME.obj.userData.limbs;
  if(ME.flying&&L){L.arms[0].rotation.set(0,0,-1.35+Math.sin(t*6)*.15);L.arms[1].rotation.set(0,0,1.35-Math.sin(t*6)*.15);L.legs[0].rotation.x=.35;L.legs[1].rotation.x=.15;L.rig.rotation.x=.35;
    if(PW.wings)PW.wings.children.forEach((w,i)=>w.rotation.z=(i?1:-1)*(.45+Math.sin(t*10)*.35))}
  else if(L&&L.rig.rotation.x&&ME.rollT<=0){L.rig.rotation.x=0;L.arms[0].rotation.z=-.1;L.arms[1].rotation.z=.1}
  // sparkle trail while a power is on
  if(PW.active){PW.trailT-=dt;if(PW.trailT<=0){PW.trailT=.06;const s=mesh(new THREE.SphereGeometry(.08,6,4),mat(P.power==='speed'?'#FDE047':P.power==='jump'?'#86EFAC':'#E0E7FF',{emissive:'#FFFFFF',emissiveIntensity:.6,transparent:true,opacity:.9}),false);
    s.position.set(ME.pos.x+(Math.random()-.5)*.4,ME.y+.5+Math.random()*.8,ME.pos.z+(Math.random()-.5)*.4);scene.add(s);PW.trail.push({s,life:.7})}}
  PW.trail=PW.trail.filter(p=>{p.life-=dt;p.s.material.opacity=Math.max(0,p.life);p.s.position.y+=dt*.4;if(p.life<=0){scene.remove(p.s);return false}return true})}
updatePowerBtn();
/* first time in the world: choose a superpower */
setTimeout(function askPower(){if(!$('#title').hidden||PANEL){setTimeout(askPower,3000);return}if(!P.power)openPowers(true)},4000);
