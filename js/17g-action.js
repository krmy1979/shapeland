/* Shapeland · a world by Shirel Yitzhak */
/* ===================== ACTION JOBS: fast, loud, against the clock ===================== */
/* Each job reads its orders in English (addresses, numbers, places), so you read fast without noticing. */
let ACT=null;
const JOBS_ACT={
  pizza:{en:'Pizza Rush',he:'משלוחי פיצה',em:'🍕',zone:'town',time:75,pay:'5 💎 למשלוח + בונוס זמן',desc:'אוספים פיצה מהמאפייה ורצים למסור לכתובות לפני שהפיצה מתקררת!'},
  coins:{en:'Coin Storm',he:'סערת מטבעות',em:'🪙',zone:null,time:45,pay:'1 💎 לכל מטבע',desc:'מטבעות נופלים מהשמיים בכל מקום. אוספים כמה שיותר לפני שהזמן נגמר!'},
  fire:{en:'Fire Rescue',he:'כבאים',em:'🚒',zone:'town',time:70,pay:'6 💎 לכל שריפה',desc:'יש שריפות בעיירה! רצים למקום, עומדים ליד האש ומכבים עם הצינור.'},
  rescue:{en:'Lifeguard Rescue',he:'מציל/ה',em:'🛟',zone:'city',time:70,pay:'8 💎 לכל הצלה',desc:'שחיינים בים צועקים Help! שוחים אליהם מהר ומחזירים אותם לחוף.'},
  thief:{en:'Catch the Raccoon',he:'לתפוס את הדביבון',em:'🦝',zone:null,time:50,pay:'15 💎 + מה שהוא גנב',desc:'דביבון שובב גנב יהלומים ובורח! רודפים אחריו (ריצה, קורקינט או כוח־על) ונוגעים בו.'}};
/* board in the town plaza */
(()=>{const[cx,cz]=ZC.town;const b=signBoard('⚡ ACTION JOBS ⚡','#DC2626','#FFFFFF',3);b.position.set(cx+5.5,0,cz+6.5);b.lookAt(cx+5.5,0,cz+20);scene.add(b);rootify(b);b.userData.zact=()=>openActionBoard();EXTRA_PICK.push(b);
  const lb=label('Action Jobs ⚡','#DC2626','#FFFFFF',.5);lb.position.set(cx+5.5,3.3,cz+6.5);scene.add(lb)})();
function openActionBoard(){PANEL='actboard';sheet(`<h2>⚡ ${en('Action Jobs')}</h2><p class="sub">עבודות מהירות נגד השעון. כל עבודה מרוויחה יהלומים, והשיא שלך נשמר 🏆</p>
  <div class="opts one">${Object.entries(JOBS_ACT).map(([k,j])=>`<button class="opt pw" data-a="actgo" data-v="${k}"><span class="em">${j.em}</span><span><b>${j.he}</b> <span class="en" dir="ltr">${j.en}</span><br><small class="sub">${j.desc}<br>⏱️ ${j.time} שניות · ${j.pay}${(P.actBest||{})[k]?` · 🏆 שיא: ${P.actBest[k]}`:''}</small></span></button>`).join('')}</div>
  <button class="btn ghost" data-a="close">סגירה</button>`)}
ACTX.actboard=()=>openActionBoard();
ACTX.actgo=d=>{closeSheet();startAction(d.v)};
function countdown(cb){const el=document.createElement('div');el.className='count';document.body.appendChild(el);let n=3;const tick=()=>{if(n===0){el.textContent='GO!';if(typeof SND!=='undefined')tone(1046,.35,'square',.08);setTimeout(()=>{el.remove();cb()},500);return}
  el.textContent=n;say(NUMW20[n]);if(AU.on)tone(523,.15,'square',.07);n--;setTimeout(tick,800)};tick()}
function hudSet(){let h=$('#actHud');if(!ACT){if(h)h.remove();return}if(!h){h=document.createElement('div');h.id='actHud';document.body.appendChild(h)}
  h.className=ACT.left<10?'hurry':'';h.innerHTML=`<span>${JOBS_ACT[ACT.kind].em}</span><span>⏱️ ${Math.ceil(ACT.left)}</span><span>⭐ ${ACT.score}</span>${ACT.order?`<span class="en" dir="ltr" style="font-size:15px">${esc(ACT.order)}</span>`:''}`}
function spawn(kind,x,z,zone,extra){let g=new THREE.Group();
  if(kind==='coin'){const c=mesh(new THREE.CylinderGeometry(.35,.35,.08,18),mat('#FACC15',{metalness:.6,roughness:.25,emissive:'#CA8A04',emissiveIntensity:.3}));c.rotation.x=Math.PI/2;g.add(c);g.position.set(x,6+Math.random()*4,z)}
  else if(kind==='pizza'){const b=mesh(new THREE.BoxGeometry(.8,.12,.8),mat('#FDE68A'));g.add(b);const p=mesh(new THREE.CylinderGeometry(.32,.32,.05,16),mat('#F97316'));p.position.y=.08;g.add(p);g.position.set(x,1.2,z)}
  else if(kind==='house'){const r=mesh(new THREE.TorusGeometry(1,.08,8,30),mat('#22C55E',{emissive:'#22C55E',emissiveIntensity:.6}));r.rotation.x=Math.PI/2;r.position.y=.1;g.add(r);const a=mesh(new THREE.ConeGeometry(.3,.6,4),mat('#22C55E',{emissive:'#16A34A',emissiveIntensity:.5}));a.rotation.x=Math.PI;a.position.y=2.4;g.add(a);g.position.set(x,0,z)}
  else if(kind==='fire'){for(let i=0;i<3;i++){const f=mesh(new THREE.ConeGeometry(.45-i*.1,1.2-i*.2,8),mat(['#EF4444','#F97316','#FDE047'][i],{emissive:['#DC2626','#EA580C','#FACC15'][i],emissiveIntensity:.8,transparent:true,opacity:.9}),false);f.position.y=.6+i*.15;g.add(f)}g.position.set(x,0,z)}
  else if(kind==='swimmer'){const hd=mesh(new THREE.SphereGeometry(.28,12,10),mat('#F6CBA5'));g.add(hd);const hr=mesh(new THREE.SphereGeometry(.3,12,8,0,Math.PI*2,0,Math.PI/2),mat('#4A2E1F'));hr.position.y=.03;g.add(hr);
    const arm=mesh(new THREE.CylinderGeometry(.06,.06,.6,6),mat('#F6CBA5'));arm.position.set(.3,.35,0);arm.rotation.z=-.4;g.add(arm);const lb=label('Help!','#DC2626','#FFFFFF',.4);lb.position.y=1.1;g.add(lb);g.position.set(x,-.45,z)}
  else if(kind==='raccoon'){const b=mesh(new THREE.SphereGeometry(.35,12,10),mat('#6B7280'));b.scale.set(1,.8,1.4);b.position.y=.35;g.add(b);const h=mesh(new THREE.SphereGeometry(.25,12,10),mat('#9CA3AF'));h.position.set(0,.55,.45);g.add(h);
    const mask=mesh(new THREE.BoxGeometry(.4,.1,.1),mat('#111827'));mask.position.set(0,.6,.66);g.add(mask);const tail=mesh(new THREE.CylinderGeometry(.09,.12,.7,8),mat('#374151'));tail.rotation.x=1.1;tail.position.set(0,.45,-.6);g.add(tail);
    const bag=mesh(new THREE.SphereGeometry(.18,10,8),mat('#A16207'));bag.position.set(.3,.5,0);g.add(bag);const lb=label('💎 🦝','#FFFFFF','#1D2A48',.36);lb.position.y=1.3;g.add(lb);g.position.set(x,0,z)}
  scene.add(g);return Object.assign({g,x,z,zone,kind,done:false,hold:0},extra||{})}
function zoneRandPoint(zone){const[cx,cz]=ZC[zone];for(let i=0;i<60;i++){const p=new THREE.Vector3(cx+(Math.random()-.5)*44,0,cz+(Math.random()-.5)*44);if(zoneAt(p.x,p.z)===zone&&walkable(p,zone)&&floorAt(p.x,p.z).h===0&&!floorAt(p.x,p.z).swim)return p}return new THREE.Vector3(cx,0,cz)}
const PIZZA_ADDR=[['bank','Bear Bank'],['pets','the Pet Shop'],['clothes','the Clothes Shop'],['market','the Market'],['furniture','the Furniture Store']];
function startAction(kind){const J=JOBS_ACT[kind];let zone=J.zone||(OUTZ.includes(ME.zone)?ME.zone:'island');if(ME.zone!==zone)teleport(zone);
  ACT={kind,left:J.time,score:0,items:[],zone,started:false,carry:false,order:''};
  countdown(()=>{if(!ACT)return;ACT.started=true;const[cx,cz]=ZC[zone];
    if(kind==='coins'){for(let i=0;i<26;i++){const p=zoneRandPoint(zone);ACT.items.push(spawn('coin',p.x,p.z,zone,{fall:true}))}}
    if(kind==='pizza'){nextPizza()}
    if(kind==='fire'){const ids=shuffle(BUILDINGS.map(b=>b.id)).slice(0,4);ids.forEach(id=>{const d=DOORS.find(x=>x.id===id);if(d)ACT.items.push(spawn('fire',d.ox,d.oz,'town',{name:BUILDINGS.find(b=>b.id===id).en}))});ACT.order='Fire at '+ACT.items.map(i=>i.name).join(', ')+'!';say(ACT.order)}
    if(kind==='rescue'){teleport('city',[-21,0]);for(let i=0;i<4;i++)ACT.items.push(spawn('swimmer',-30-Math.random()*13,-145+i*10+Math.random()*4,'city',{n:i+1}));ACT.order='Swimmer number one needs help!';say('Help! Help! Swim to the swimmers!')}
    if(kind==='thief'){const p=zoneRandPoint(zone);ACT.items.push(spawn('raccoon',p.x,p.z,zone,{vx:0,vz:0,turn:0}));say('Catch that raccoon! He took our gems!')}
    hudSet()})}
function nextPizza(){const[id,name]=pick(PIZZA_ADDR);const shop=DOORS.find(x=>x.id==='bakery');const dest=DOORS.find(x=>x.id===id);
  ACT.items.forEach(i=>scene.remove(i.g));ACT.items=[spawn('pizza',shop.ox,shop.oz,'town'),spawn('house',dest.ox,dest.oz,'town',{dest:true})];ACT.items[1].g.visible=false;ACT.carry=false;ACT.destName=name;
  const tier=typeof rankInfo==='function'?rankInfo().i:0;const hood=pick(['near the fountain','next to the big sign','on the other side of the plaza']);
  ACT.order=`Take the pizza to ${name}${tier>=3?' '+hood:''}.`;say('New order! '+ACT.order);hudSet()}
function endAction(why){if(!ACT)return;const J=JOBS_ACT[ACT.kind];ACT.items.forEach(i=>scene.remove(i.g));const k=ACT.kind,sc=ACT.score;let gems=0;
  if(k==='coins')gems=sc;else if(k==='pizza')gems=sc*5+(sc>=4?5:0);else if(k==='fire')gems=sc*6+(why==='all'?Math.ceil(ACT.left/5):0);else if(k==='rescue')gems=sc*8+(why==='all'?Math.ceil(ACT.left/5):0);else if(k==='thief')gems=why==='caught'?15+Math.ceil(ACT.left/4):0;
  ACT=null;hudSet();if(gems>0)addGems(gems,'עבודת אקשן: '+J.he,J.en);addXp(10+gems);P.actBest=P.actBest||{};const best=P.actBest[k]||0;const nb=sc>best;if(nb)P.actBest[k]=sc;save();
  if(typeof SND!=='undefined'){if(gems>0)sfx.win();else sfx.bad()}burst(J.em+' +'+gems+' 💎');
  sheet(`<div class="center"><div style="font-size:64px">${J.em}</div><h2>${en(why==='time'?"Time's up!":'Great job!')}</h2></div>
    <ul class="list"><li><span>⭐ ${en('Score')}</span><b>${sc}${nb&&sc?' 🏆 '+en('New record!'):''}</b></li><li><span>💎 ${en('You earned')}</span><b>${gems}</b></li></ul>
    <div class="row"><button class="btn" data-a="actgo" data-v="${k}">🔁 ${en('Again!')}</button><button class="btn ghost" data-a="actboard">⚡ ${en('Other jobs')}</button><button class="btn ghost" data-a="close">${en('Done')}</button></div>`);
  say(why==='time'?"Time's up! Great effort!":'Great job! Mission complete!')}
function stepAction(dt,t){if(!ACT||!ACT.started)return;if(!$('#sheet').hidden&&PANEL!=='actboard'){}ACT.left-=dt;if(ACT.left<=0){endAction('time');return}
  ACT.hudT=(ACT.hudT||0)-dt;if(ACT.hudT<=0){ACT.hudT=.25;hudSet();if(ACT.left<10&&AU.on)tone(880,.05,'square',.03)}
  const near=(i,r)=>ME.zone===i.zone&&Math.hypot(ME.pos.x-i.g.position.x,ME.pos.z-i.g.position.z)<r;
  ACT.items.forEach(i=>{if(i.done)return;
    if(i.kind==='coin'){if(i.fall){i.g.position.y=Math.max(.8,i.g.position.y-dt*5);if(i.g.position.y<=.8)i.fall=false}i.g.rotation.y=t*4;if(near(i,1.1)&&ME.y<2.5){i.done=true;scene.remove(i.g);ACT.score++;{const n=performance.now();ACT.combo=(n-(ACT.lastC||0)<1300)?(ACT.combo||1)+1:1;ACT.lastC=n;if(ACT.combo>=3){ACT.score+=1;floatText('x'+ACT.combo+' COMBO!','#F472B6');if(ACT.combo%5===0)shake(.15,.2)}fxBurst(i.g.position.x,.9,i.g.position.z,'#FACC15',8,2)}if(AU.on){tone(1320,.06,'square',.05);tone(1760,.08,'square',.04,null,auNow()+.05)}
      if(ACT.items.filter(x=>!x.done).length<6){for(let k=0;k<5;k++){const p=zoneRandPoint(ACT.zone);ACT.items.push(spawn('coin',p.x,p.z,ACT.zone,{fall:true}))}}}}
    else if(i.kind==='pizza'){i.g.rotation.y=t*2;if(near(i,1.4)){i.done=true;scene.remove(i.g);ACT.carry=true;ACT.items[1].g.visible=true;SND.pop();toast('🍕 '+ACT.order);say('Got it! '+ACT.order)}}
    else if(i.kind==='house'){if(i.g.visible){i.g.children[1].position.y=2.4+Math.sin(t*5)*.25}if(ACT.carry&&near(i,1.6)){ACT.score++;sfx.coin();burst('🍕 +5');say(pick(['Thank you! Yummy!','Hot pizza! Thanks!','Wow, so fast!']));nextPizza()}}
    else if(i.kind==='fire'){i.g.children.forEach((f,k)=>{f.scale.y=1+Math.sin(t*12+k*2)*.18;f.rotation.y=t*3*(k%2?1:-1)});if(near(i,2.2)){i.hold+=dt;if(AU.on&&Math.random()<.3)hiss(.12,'highpass',3000,.5,.06);
        const s=1-i.hold/1.6;i.g.scale.setScalar(Math.max(.05,s));if(i.hold>=1.6){i.done=true;fxBurst(i.g.position.x,1,i.g.position.z,'#E5E7EB',20,2.5);shake(.2,.25);hitStop(120);scene.remove(i.g);ACT.score++;sfx.coin();burst('🚒 +6');say('The fire at '+i.name+' is out!');const left=ACT.items.filter(x=>!x.done);ACT.order=left.length?'Fire at '+left.map(x=>x.name).join(', ')+'!':'';if(!left.length)endAction('all')}}
      else i.hold=Math.max(0,i.hold-dt*.5)}
    else if(i.kind==='swimmer'){i.g.position.y=-.45+Math.sin(t*3+i.n)*.1;i.g.children[2].rotation.z=-.4+Math.sin(t*8)*.5;if(!i.saved&&near(i,1.3)&&ME.swim){i.saved=true;i.done=true;scene.remove(i.g);ACT.score++;sfx.coin();burst('🛟 +8');
        const left=ACT.items.filter(x=>!x.done);say('You saved swimmer number '+NUMW20[i.n]+'!');ACT.order=left.length?`Swimmer number ${NUMW20[left[0].n]} needs help!`:'';if(!left.length)endAction('all')}}
    else if(i.kind==='raccoon'){const g=i.g;const dx=g.position.x-ME.pos.x,dz=g.position.z-ME.pos.z,d=Math.hypot(dx,dz)||1;i.turn-=dt;
      let vx=i.vx,vz=i.vz;if(d<7){vx=dx/d;vz=dz/d}else if(i.turn<=0){i.turn=1.5;const a=Math.random()*Math.PI*2;vx=Math.cos(a);vz=Math.sin(a)}
      if(i.turn<=0&&d<7){i.turn=.6;const a=Math.atan2(vz,vx)+(Math.random()-.5)*1.4;vx=Math.cos(a);vz=Math.sin(a)}i.vx=vx;i.vz=vz;const sp=d<7?6.2:2.5;
      const nx=g.position.x+vx*sp*dt,nz=g.position.z+vz*sp*dt;const np=new THREE.Vector3(nx,0,nz);if(zoneAt(nx,nz)===ACT.zone&&walkable(np,ACT.zone)){g.position.x=nx;g.position.z=nz}else{i.vx=-vx;i.vz=-vz;i.turn=.3}
      g.rotation.y=Math.atan2(vx,vz);g.position.y=Math.abs(Math.sin(t*14))*.12;if(d<1.1&&ME.y<1.5){i.done=true;shake(.35,.3);hitStop(200);fxBurst(g.position.x,.6,g.position.z,'#A5F3FC',20,3);endAction('caught')}}});
  if(ACT&&ACT.kind==='coins'&&ACT.items.every(x=>x.done)){}}
const _dangerNow=dangerNow;dangerNow=function(){return ACT&&ACT.started?1:_dangerNow()};
ACTX.actstop=()=>{if(ACT)endAction('time')};
