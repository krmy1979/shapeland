/* Shapeland · a world by Shirel Yitzhak */
/* ===================== POWER ACADEMY: water, electricity, strength ===================== */
/* Powers are earned with gems + rank + a short training in English or math. Training again makes them stronger.
   Every power DOES something in the world: water puts out fires and makes flowers bloom, electricity wakes up
   machines and lights, strength moves boulders that hide treasure. */
if(!P.elem)P.elem={};if(!P.elemSel)P.elemSel=null;
const ELEM={
  water:{en:'Water',he:'מים',em:'💧',color:'#38BDF8',cost:[30,45,70,100,140],rank:[1,2,3,4,5],words:[['rain','גשם','🌧️'],['river','נהר','🏞️'],['ocean','אוקיינוס','🌊'],['cloud','ענן','☁️'],['drop','טיפה','💧'],['wave','גל','🌊'],['ice','קרח','🧊'],['snow','שלג','❄️'],['storm','סערה','⛈️'],['island','אי','🏝️']]},
  elec:{en:'Electricity',he:'חשמל',em:'⚡',color:'#FACC15',cost:[40,60,90,120,160],rank:[2,3,4,5,6]},
  str:{en:'Strength',he:'כוח',em:'💪',color:'#F97316',cost:[25,40,60,90,130],rank:[0,1,2,3,4]}};
const elemLv=k=>P.elem[k]||0;
function powerStrength(){return elemLv('str')*.6+(EL.boost>0?1.5:0)}
const EL={cd:0,boost:0,fx:[],zap:null};

/* ---------- the academy building in the Sports Park ---------- */
zbuilding({id:'academy',zone:'boys',en:'Power Academy',em:'✨',color:'#E9D5FF',roof:'#7C3AED',door:'#F5F3FF',x:10.5,z:-197,fx:10.5,fz:-180});
const NOVA={g:'girl',hair:'wavy',hc:'#9D6BFF',skin:'#E3A97F',top:'#7C3AED',bot:'dress',bc:'#7C3AED',eyes:'happy'};
PROPS.orb=(g,c)=>{const o=mesh(new THREE.SphereGeometry(.4,18,14),mat(c||'#A78BFA',{emissive:c||'#8B5CF6',emissiveIntensity:.7,transparent:true,opacity:.85}));o.position.y=1.3;g.add(o);pc(g,.3,.4,.9,'#4C1D95',0,.45,0)};
SHOPS_IN.academy={en:'Power Academy',wall:'#DDD6FE',floor:'#EDE9FE',host:{name:'Master Nova',ch:NOVA,line:'Welcome to the Power Academy! Learn, train, and become powerful.',act:()=>openAcademy()},
  props:[['orb',-5,-4,0,'#38BDF8'],['orb',-2.5,-4.2,0,'#FACC15'],['orb',0,-4,0,'#F97316'],['books',5.5,-4.4],['dumbbell',-5.5,-1.5],['plant',6.3,-1]]};
(()=>{const P0=SHOPS_IN.academy.props;P0[0].word='water';P0[1].word='electricity';P0[2].word='strength'})();
if(typeof CAVE_HE!=='undefined')Object.assign(CAVE_HE,{water:'מים',electricity:'חשמל',strength:'כוח'});

function openAcademy(){PANEL='academy';const r=rankInfo();
  sheet(`<div class="npchead"><div class="face" style="background:#EDE9FE">${humanSVG(Object.assign({kind:'human'},NOVA))}</div><div class="grow"><h2>${en('Master Nova')}</h2><p class="sub">אקדמיית הכוחות ✨</p></div>${gemTag()}</div>
  <div class="bubble">${en('A power is not bought. It is earned! Pay for the training, show what you know, and the power is yours. Train again to make it stronger.')}</div>
  ${Object.entries(ELEM).map(([k,E])=>{const lv=elemLv(k),nx=lv+1;const max=lv>=5;const cost=E.cost[lv],rk=E.rank[lv];const rOk=max||r.i>=rk;
    return`<div class="box"><div class="row"><b class="grow">${E.em} ${E.he} <span class="en" dir="ltr">${E.en}</span></b><span>${'⭐'.repeat(lv)||'—'}</span></div>
      <p class="sub">${elemWhat(k)}</p>
      ${max?'<p class="sub">הגעת לרמה המקסימלית! 🌟</p>':`<div class="row"><button class="btn ${rOk?'':'ghost'} mini" data-a="eltrain" data-v="${k}" ${rOk?'':'disabled'}>${lv?'💪 '+en('Train to level '+nx):'✨ '+en('Learn this power')} · 💎${cost}</button>${rOk?'':`<span class="sub">צריך דרגה: ${RANKS[rk][2]} ${RANKS[rk][1]}</span>`}</div>`}</div>`}).join('')}
  <button class="btn ghost" data-a="close">${en('Thank you, Master!')}</button>`);say('Welcome to the Power Academy!')}
function elemWhat(k){return{water:'מכבה שריפות מהר, מפריח ערוגות יבשות 🌸, ומרטיב סליימים שיברחו.',elec:'מדליק תיבות חשמל ⚡ שמפעילות מופעי אורות ונותנות פרסים, ומקפיא את הסרטן לרגע.',str:'דוחפים דברים כבדים בקלות, ומזיזים סלעים ענקיים שמסתירים אוצרות 🪨.'}[k]}
/* training: a short challenge, then the power */
let TRN=null;
ACTX.eltrain=d=>{const k=d.v,E=ELEM[k],lv=elemLv(k),cost=E.cost[lv];if(P.gems<cost){toast(`חסרים ${fmt(cost-P.gems)} 💎`);sfx.bad();return}
  TRN={k,i:0,n:3,qs:[],miss:0};for(let i=0;i<3;i++)TRN.qs.push(trainQ(k,lv));renderTrain()};
function trainQ(k,lv){if(k==='water'){const w=pick(ELEM.water.words.slice(0,Math.min(10,4+lv*2)));return{typed:true,show:`<div style="font-size:60px">${w[2]}</div>`,ask:'Type the water word!',he:'מה המילה באנגלית?',ans:w[0]}}
  if(k==='elec'){const a=rnd(2,4+lv*3),b=rnd(2,4+lv*3);const op=lv>=2&&Math.random()<.5?'×':'+';const ans=op==='×'?a*b:a+b;
    return{typed:true,show:`<div class="word en" dir="ltr" style="font-size:24px">🔋 ${a} volts ${op==='×'?'times':'plus'} 🔋 ${b} ${op==='×'?'':'volts'}</div>`,ask:op==='×'?`${a} batteries with ${b} volts each. How many volts?`:'How many volts in total?',he:'כמה וולט ביחד?',ans:String(ans)}}
  const reps=rnd(3,6+lv*2);return{typed:false,reps,ask:`Lift the weight ${NUMW20[reps]} times!`,he:'מרימים בדיוק כמה שהמאמנת אמרה',ans:String(reps)}}
function renderTrain(){const q=TRN.qs[TRN.i];const E=ELEM[TRN.k];
  sheet(`<div class="npchead"><div class="face" style="background:#EDE9FE">${E.em}</div><div class="grow"><h2>${en(E.en+' training')}</h2><p class="sub">אימון ${TRN.i+1} מתוך ${TRN.n}</p></div></div>
  <div class="steps">${TRN.qs.map((_,i)=>`<i class="${i<TRN.i?'ok':i===TRN.i?'now':''}"></i>`).join('')}</div>
  ${q.typed?`<div class="pz center">${q.show}</div><div class="bubble">${en(q.ask)} <small class="sub">${q.he}</small></div>
    <form class="row" onsubmit="return false"><input class="txt en" id="trIn" dir="ltr" autocomplete="off" autocapitalize="none" spellcheck="false" style="font-size:22px;text-align:center"><button class="btn" data-a="trsub">✓</button></form>`
  :`<div class="bubble">${en(q.ask)} <small class="sub">${q.he}</small></div><div class="center"><button class="bigtap" data-a="trrep">🏋️<b>${q.c||0}</b></button></div><div class="row"><button class="btn" data-a="trdone">✅ ${en('Done!')}</button></div>`}
  ${TRN.msg?`<p class="sub">${TRN.msg}</p>`:''}<button class="btn ghost" data-a="close">${en('Stop')}</button>`);say(q.ask);
  if(q.typed)setTimeout(()=>{const i=$('#trIn');if(i){i.focus();i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();ACTX.trsub()}})}},60)}
function trainAnswer(ok){const q=TRN.qs[TRN.i];learnResult(TRN.k==='water'?'spell':TRN.k==='elec'?'math':'listen',ok,TRN.k==='water'?q.ans:null);
  if(!ok){TRN.miss++;sfx.bad();TRN.msg=`לא בדיוק (התשובה: <b dir="ltr">${esc(q.ans)}</b>). עוד אחת:`;TRN.qs[TRN.i]=trainQ(TRN.k,elemLv(TRN.k));if(TRN.miss>=4){TRN=null;sheet(`<div class="bubble">${en('Almost! Practice a little and come back.')}</div><p class="sub">לא שילמת כלום. אפשר לנסות שוב מתי שרוצים.</p><button class="btn" data-a="close">OK</button>`);return}KEEP=true;renderTrain();return}
  sfx.place();TRN.msg='';TRN.i++;if(TRN.i<TRN.n){KEEP=true;renderTrain();return}
  const k=TRN.k,E=ELEM[k],lv=elemLv(k),cost=E.cost[lv];TRN=null;P.gems-=cost;logm('אקדמיית הכוחות: '+E.he,'Power Academy',-cost);P.elem[k]=lv+1;if(!P.elemSel)P.elemSel=k;save();renderHud();updateElemBtn();
  sfx.win();shake(.25,.3);fxBurst(ME.pos.x,1.2,ME.pos.z,E.color,30,3);burst(E.em+' '+E.en+' '+'⭐'.repeat(lv+1));
  sheet(`<div class="center"><div style="font-size:72px">${E.em}</div><h2>${en(lv?E.en+' level '+(lv+1)+'!':'You have the '+E.en+' power!')}</h2><p class="sub">הכפתור ${E.em} נמצא ליד הג׳ויסטיק. לחיצה ארוכה עליו מחליפה כוח.</p></div><button class="btn" data-a="close">${en("Let's go!")}</button>`);say(lv?'Your power is stronger now!':'You have a new power! Use it well.')}
ACTX.trsub=()=>{const q=TRN&&TRN.qs[TRN.i];if(!q)return;const v=($('#trIn')||{}).value;if(!String(v||'').trim())return;trainAnswer(norm(v)===norm(q.ans))};
ACTX.trrep=()=>{const q=TRN.qs[TRN.i];q.c=(q.c||0)+1;say(NUMW20[q.c]||String(q.c));if(AU.on)tone(300+q.c*30,.08,'square',.05);KEEP=true;renderTrain()};
ACTX.trdone=()=>{const q=TRN.qs[TRN.i];trainAnswer((q.c||0)===q.reps)};

/* ---------- the element button ---------- */
function updateElemBtn(){const acts=document.querySelector('#pad .acts');if(!acts)return;let b=$('#bElem');const owned=Object.keys(ELEM).filter(k=>elemLv(k));
  if(!owned.length){if(b)b.hidden=true;return}if(!owned.includes(P.elemSel))P.elemSel=owned[0];
  if(!b){b=document.createElement('button');b.id='bElem';b.className='act elem';acts.appendChild(b);let hold=null,long=false;
    b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();long=false;hold=setTimeout(()=>{long=true;cycleElem()},450)});
    b.addEventListener('pointerup',e=>{e.preventDefault();clearTimeout(hold);if(!long)useElement()});b.addEventListener('pointerleave',()=>clearTimeout(hold))}
  const E=ELEM[P.elemSel];b.hidden=false;b.style.setProperty('--c',E.color);b.innerHTML=`${E.em}<small>${E.he} ${'★'.repeat(elemLv(P.elemSel))}</small>`}
function cycleElem(){const owned=Object.keys(ELEM).filter(k=>elemLv(k));const i=owned.indexOf(P.elemSel);P.elemSel=owned[(i+1)%owned.length];save();updateElemBtn();const E=ELEM[P.elemSel];toast(E.em+' '+E.he);if(AU.on)SND.click()}
window.addEventListener('keydown',e=>{if(e.code==='KeyF'&&!e.repeat&&!$('#hudBot').hidden&&!(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName)))useElement()});

/* ---------- world targets ---------- */
const BEDS=[],BOXES=[],ROCKS=[];
[[-6,4,'island'],[-8,-40,'town'],[-20,-176,'girls'],[-2,-188,'girls'],[30,-160,'boys']].forEach(([x,z,zone],i)=>{const g=new THREE.Group();const soil=mesh(new THREE.CylinderGeometry(.95,1,.2,18),mat('#7C4A2D'));soil.position.y=.1;g.add(soil);
  const dry=new THREE.Group();for(let k=0;k<5;k++){const s=mesh(new THREE.CylinderGeometry(.02,.02,.4,4),mat('#A16207'));const a=k/5*Math.PI*2;s.position.set(Math.cos(a)*.5,.35,Math.sin(a)*.5);s.rotation.z=.5;dry.add(s)}g.add(dry);
  const fl=new THREE.Group();for(let k=0;k<9;k++){const a=k/9*Math.PI*2,r=.25+(k%3)*.22;const st=mesh(new THREE.CylinderGeometry(.025,.025,.5,4),mat('#16A34A'));st.position.set(Math.cos(a)*r,.4,Math.sin(a)*r);fl.add(st);const h=mesh(new THREE.SphereGeometry(.13,8,6),mat(['#F472B6','#FDE047','#C084FC','#FB7185','#FFFFFF'][k%5]));h.position.set(Math.cos(a)*r,.68,Math.sin(a)*r);fl.add(h)}
  fl.scale.setScalar(.01);g.add(fl);const lb=label('🥀 dry','#FFFFFF','#7C4A2D',.32);lb.position.y=1.2;g.add(lb);g.position.set(x,0,z);scene.add(g);BEDS.push({g,dry,fl,lb,x,z,zone,i})});
[[5,-9,'island'],[-6,-38,'town'],[CX-14,CZ-8,'city'],[12,-176,'boys'],[36,-160,'adv']].forEach(([x,z,zone],i)=>{const g=new THREE.Group();const b=mesh(new THREE.BoxGeometry(.8,1.2,.5),mat('#64748B'));b.position.y=.6;g.add(b);
  const sign=mesh(new THREE.BoxGeometry(.5,.5,.02),mat('#FACC15',{emissive:'#CA8A04',emissiveIntensity:.3}));sign.position.set(0,.8,.26);g.add(sign);
  const lamps=[];for(let k=0;k<6;k++){const a=k/6*Math.PI*2;const p=mesh(new THREE.CylinderGeometry(.05,.05,2.2,6),mat('#334155'));p.position.set(Math.cos(a)*2.6,1.1,Math.sin(a)*2.6);g.add(p);
    const bl=mesh(new THREE.SphereGeometry(.18,10,8),mat('#CBD5E1'));bl.position.set(Math.cos(a)*2.6,2.3,Math.sin(a)*2.6);g.add(bl);lamps.push(bl)}
  const lb=label('⚡ power box','#334155','#FDE047',.34);lb.position.y=1.8;g.add(lb);g.position.set(x,0,z);scene.add(g);BOXES.push({g,lamps,x,z,zone,i,on:0})});
[[-9,8,'island',1],[58,-198,'adv',2],[CX-21.5,CZ+21,'city',3]].forEach(([x,z,zone,need],i)=>{const g=new THREE.Group();const chest=treasureChest();chest.scale.setScalar(.8);g.add(chest);
  const rock=mesh(new THREE.DodecahedronGeometry(1.25,0),mat('#78716C',{flatShading:true}));rock.position.y=1.05;rock.scale.y=.85;g.add(rock);const lb=label(`🪨 💪${'★'.repeat(need)}`,'#FFFFFF','#44403C',.36);lb.position.y=2.6;g.add(lb);
  g.position.set(x,0,z);scene.add(g);ROCKS.push({g,rock,chest,lb,x,z,zone,need,i})});
function addElementColliders(){if(!SOL)return;ROCKS.forEach(r=>{if(!rockDone(r))SOL.push({t:'cir',x:r.x,z:r.z,r:1.15,top:2.2,rock:r})});BOXES.forEach(b=>SOL.push({t:'cir',x:b.x,z:b.z,r:.45,top:1.2}))}
const _buildColliders=buildColliders;buildColliders=function(){_buildColliders();addElementColliders()};
const dayK=()=>new Date().toISOString().slice(0,10);
const bedDone=b=>P.bloom&&P.bloom[b.i]===dayK();const boxDone=b=>P.boxes&&P.boxes[b.i]===dayK();const rockDone=r=>P.rocks&&P.rocks[r.i];
function refreshTargets(){BEDS.forEach(b=>{const d=bedDone(b);b.fl.scale.setScalar(d?1:.01);b.dry.visible=!d;b.lb.visible=!d});
  BOXES.forEach(b=>{const d=boxDone(b);b.lamps.forEach(l=>l.material=mat(d?'#FDE047':'#CBD5E1',d?{emissive:'#FACC15',emissiveIntensity:.8}:undefined))});
  ROCKS.forEach(r=>{const d=rockDone(r);r.rock.visible=!d;r.lb.visible=!d;r.chest.visible=!(P.rocks&&P.rocks[r.i]===2)})}
refreshTargets();

/* ---------- using a power ---------- */
function facing(){const a=ME.obj?ME.obj.rotation.y:0;return{x:Math.sin(a),z:Math.cos(a)}}
function inFront(x,z,range){const f=facing();const dx=x-ME.pos.x,dz=z-ME.pos.z;const d=Math.hypot(dx,dz);if(d>range)return false;if(d<1.2)return true;return(dx*f.x+dz*f.z)/d>.45}
function useElement(){const k=P.elemSel;if(!k||!elemLv(k)){openAcademyHint();return}if(EL.cd>0)return;const lv=elemLv(k),E=ELEM[k];EL.cd=k==='str'?1.2:.8;
  const f=facing();const range=4+lv*.8;
  if(k==='water'){for(let i=0;i<26;i++){const s=mesh(new THREE.SphereGeometry(.08,6,4),mat('#7DD3FC',{transparent:true,opacity:.9}),false);s.position.set(ME.pos.x+f.x*.6,ME.y+1.2,ME.pos.z+f.z*.6);scene.add(s);
      const sp=6+Math.random()*3,j=(Math.random()-.5)*.35;FX.push({s,vx:(f.x+j*f.z)*sp,vz:(f.z-j*f.x)*sp,vy:2+Math.random()*1.5,life:.6+Math.random()*.25})}
    if(AU.on)hiss(.7,'highpass',2500,.5,.16,null,null,1200);
    if(ACT&&ACT.kind==='fire')ACT.items.forEach(i=>{if(!i.done&&i.kind==='fire'&&inFront(i.g.position.x,i.g.position.z,range))i.hold+=.6+lv*.25});
    BEDS.forEach(b=>{if(b.zone===ME.zone&&!bedDone(b)&&inFront(b.x,b.z,range)){P.bloom=P.bloom||{};P.bloom[b.i]=dayK();save();bloomAnim(b);addGems(3,'ערוגה פורחת','Flowers');sayWord('bloom','לפרוח');learnResult('vocab',true,'bloom')}});
    CREAT.forEach(c=>{if(c.kind==='slime'&&ME.zone==='adv'&&inFront(c.g.position.x,c.g.position.z,range)){c.hitT=2.5;c.cx+=f.x*2;fxBurst(c.g.position.x,.6,c.g.position.z,'#7DD3FC',8,2)}})}
  if(k==='elec'){zapBolt(f,range);if(AU.on){hiss(.25,'bandpass',3000,4,.18);tone(80,.3,'sawtooth',.08)}shake(.12,.15);
    BOXES.forEach(b=>{if(b.zone===ME.zone&&!boxDone(b)&&inFront(b.x,b.z,range)){P.boxes=P.boxes||{};P.boxes[b.i]=dayK();save();lightShow(b);const rw=3+lv;addGems(rw,'תיבת חשמל','Power box');sayWord('electricity','חשמל');learnResult('vocab',true,'electricity')}});
    CREAT.forEach(c=>{if(c.kind==='crab'&&inFront(c.g.position.x,c.g.position.z,range)){c.hitT=4;fxBurst(c.g.position.x,.5,c.g.position.z,'#FDE047',10,2);say('The crab is frozen!')}})}
  if(k==='str'){EL.boost=3+lv;if(AU.on){tone(70,.4,'sine',.25);hiss(.3,'lowpass',300,.7,.2)}shake(.3,.3);fxBurst(ME.pos.x,.1,ME.pos.z,'#D6D3D1',14,3);say(pick(['Super strong!','Power!','Hulk mode!'.replace('Hulk','Mega')]));
    ROCKS.forEach(r=>{if(r.zone!==ME.zone||rockDone(r)||!inFront(r.x,r.z,3.2))return;if(lv<r.need){toast(`🪨 הסלע הזה צריך כוח ${'★'.repeat(r.need)}. מתאמנים באקדמיה`);say('It is too heavy! Train more.');return}
      P.rocks=P.rocks||{};P.rocks[r.i]=1;save();rockAnim(r)})}
  updateElemBtn()}
function openAcademyHint(){toast('✨ כוחות לומדים באקדמיית הכוחות שבפארק הספורט')}
function bloomAnim(b){b.dry.visible=false;b.lb.visible=false;let t=0;const iv=setInterval(()=>{t+=.05;b.fl.scale.setScalar(Math.min(1,t));if(t>=1)clearInterval(iv)},30);fxBurst(b.x,.6,b.z,'#F9A8D4',18,2);if(AU.on)SND.sparkle()}
function lightShow(b){let k=0;const iv=setInterval(()=>{const l=b.lamps[k%b.lamps.length];l.material=mat('#FDE047',{emissive:'#FACC15',emissiveIntensity:.9});if(AU.on)tone(523*Math.pow(2,(k%6)/6),.12,'triangle',.06);k++;
    if(k>=b.lamps.length){clearInterval(iv);for(let j=0;j<3;j++)setTimeout(()=>fxBurst(b.x+(Math.random()-.5)*3,4+Math.random()*2,b.z+(Math.random()-.5)*3,pick(['#F472B6','#FDE047','#60A5FA','#34D399']),20,4),j*250)}},120)}
function rockAnim(r){let t=0;const f=facing();const iv=setInterval(()=>{t+=.04;r.rock.position.set(f.x*t*4,1.05+Math.sin(Math.min(1,t)*Math.PI)*2.5,f.z*t*4);r.rock.rotation.x+=.2;if(t>=1){clearInterval(iv);r.rock.visible=false;r.lb.visible=false;shake(.4,.35);hitStop(150);fxBurst(r.x+f.x*4,.3,r.z+f.z*4,'#A8A29E',20,3);if(AU.on)tone(55,.4,'sine',.3);
    if(SOL){const i=SOL.findIndex(s=>s.rock===r);if(i>=0)SOL.splice(i,1)}r.chest.userData.zact=()=>openRockChest(r);rootify(r.chest);r.chest.userData.zact=()=>openRockChest(r);EXTRA_PICK.push(r.chest);toast('🎁 מתחת לסלע הסתתר אוצר! נוגעים בתיבה')}},25)}
function openRockChest(r){if(P.rocks[r.i]===2)return;const rw=15+r.need*15;P.rocks[r.i]=2;save();r.chest.visible=false;addGems(rw,'אוצר מתחת לסלע','Hidden treasure');sfx.win();burst('🎁 +'+rw+' 💎');say('You found a hidden treasure!')}
ROCKS.forEach(r=>{if(P.rocks&&P.rocks[r.i]===1){rootify(r.chest);r.chest.userData.zact=()=>openRockChest(r);EXTRA_PICK.push(r.chest)}});
function zapBolt(f,range){const pts=[];let x=ME.pos.x+f.x*.5,y=ME.y+1.3,z=ME.pos.z+f.z*.5;for(let i=0;i<8;i++){pts.push(new THREE.Vector3(x,y,z));x+=f.x*range/8+(Math.random()-.5)*.6;z+=f.z*range/8+(Math.random()-.5)*.6;y+=(Math.random()-.5)*.5}
  const g=new THREE.Group();for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];const l=a.distanceTo(b);const c=mesh(new THREE.CylinderGeometry(.05,.05,l,5),mat('#FEF08A',{emissive:'#FDE047',emissiveIntensity:1}),false);
    c.position.set((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);c.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(b.x-a.x,b.y-a.y,b.z-a.z).normalize());g.add(c)}scene.add(g);setTimeout(()=>scene.remove(g),220)}
function stepElements(dt,t){if(EL.cd>0)EL.cd-=dt;if(EL.boost>0)EL.boost-=dt;EL.ui=(EL.ui||0)+dt;if(EL.ui>1){EL.ui=0;updateElemBtn()}}
updateElemBtn();
/* the academy also appears in the explorer journal */
const _openJournal=openJournal;openJournal=function(){_openJournal();const box=document.querySelector('#sheet .sheet-in');if(!box)return;const own=Object.keys(ELEM).filter(k=>elemLv(k));
  box.insertAdjacentHTML('beforeend',`<div class="box"><b>✨ ${en('My powers')}</b><p class="sub">${own.length?own.map(k=>ELEM[k].em+' '+ELEM[k].he+' '+'⭐'.repeat(elemLv(k))).join(' · '):'עוד אין. לומדים כוחות באקדמיית הכוחות בפארק הספורט'}</p></div>`)};
