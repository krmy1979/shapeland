/* Shapeland · a world by Shirel Yitzhak */
/* ===================== EXPLORER: ranks, riddle hunts, golden keys, secret places ===================== */
/* The world shows places you cannot reach yet. Knowing more English and more math is the only way in. */
if(!P.gates)P.gates={};if(!P.chests2)P.chests2={};if(!P.keys)P.keys=0;
const RANKS=[[0,'Rookie','🥚','טירון'],[40,'Scout','🐣','צופה'],[85,'Explorer','🧭','חוקר'],[140,'Adventurer','🗺️','הרפתקן'],[205,'Pathfinder','🔦','מגלה דרכים'],[280,'Treasure Hunter','💎','צייד אוצרות'],[365,'Hero','🦸','גיבור'],[460,'Legend','🐉','אגדה'],[570,'Master','👑','מאסטר'],[700,'Grand Master','🌟','גרנד מאסטר']];
function explorerPts(){const sk=Object.values(P.sk||{});const avg=sk.length?sk.reduce((a,b)=>a+b,0)/sk.length:3;
  return Math.round(Object.keys(P.learned||{}).length*2+(avg-3)*25+(P.keys||0)*15+Object.keys(P.gates).length*20+((P.badges&&P.badges.det)||0)*3)}
function rankInfo(){const p=explorerPts();let i=0;RANKS.forEach((r,k)=>{if(p>=r[0])i=k});const nx=RANKS[i+1];return{i,name:RANKS[i][1],em:RANKS[i][2],he:RANKS[i][3],pts:p,next:nx?nx[0]:null,nextName:nx?nx[1]:null,base:RANKS[i][0]}}
const GATES={
  sky:{en:'Sky Island',he:'אי השמיים',em:'☁️',keys:1,rank:1,tier:2,tease:'Somewhere above Shirel\'s Island, a rainbow is waiting...'},
  cave:{en:'Secret Cave',he:'המערה הסודית',em:'🕳️',keys:2,rank:3,tier:3,tease:'In the Adventure Park there is a rock with a door. Something shines inside.'},
  crystal:{en:'Crystal Tower',he:'מגדל הקריסטל',em:'💎',keys:3,rank:5,tier:4,tease:'Only real Treasure Hunters can climb to the top of the Crystal Tower.'}};
let rankSeen=null;

/* ---------- 3D: owl gatekeeper ---------- */
function owl(){const g=new THREE.Group();const st=mesh(new THREE.CylinderGeometry(.45,.55,.6,10),mat('#9CA3AF'));st.position.y=.3;g.add(st);
  const b=mesh(new THREE.SphereGeometry(.42,16,12),mat('#A8A29E'));b.scale.y=1.25;b.position.y=1.05;g.add(b);
  [-1,1].forEach(s=>{const e=mesh(new THREE.SphereGeometry(.13,12,10),mat('#FDE047',{emissive:'#FACC15',emissiveIntensity:.6}));e.position.set(s*.15,1.25,.33);g.add(e);const p=mesh(new THREE.SphereGeometry(.06,8,6),mat('#111827'));p.position.set(s*.15,1.25,.44);g.add(p);
    const ear=mesh(new THREE.ConeGeometry(.08,.22,4),mat('#78716C'));ear.position.set(s*.22,1.58,0);g.add(ear)});
  const bk=mesh(new THREE.ConeGeometry(.06,.14,4),mat('#F59E0B'));bk.rotation.x=Math.PI/2;bk.position.set(0,1.12,.42);g.add(bk);return g}
function gateOwl(id,x,z,lx,lz){const o=owl();o.position.set(x,0,z);o.lookAt(lx,0,lz);const lb=label('🦉 '+GATES[id].en+(P.gates[id]?'':' 🔒'),'#1D2A48','#FFFFFF',.42);lb.position.y=2.2;o.add(lb);o.userData.lb=lb;scene.add(o);rootify(o);o.userData.zact=()=>openGate(id);o.userData.talker='Wise Owl';EXTRA_PICK.push(o);return o}

/* ---------- Sky Island: rainbow stairs above Shirel's Island ---------- */
const SKY={c:[6.5,6.5],steps:[],top:7.6};
(()=>{const[cx,cz]=SKY.c;const cols=['#EF4444','#F97316','#FACC15','#22C55E','#3B82F6','#6366F1','#A855F7','#EC4899','#F472B6'];
  for(let i=0;i<9;i++){const a=Math.PI*1.05+i*.42;const x=cx+Math.cos(a)*4,z=cz+Math.sin(a)*4,top=.8*(i+1);const m=mesh(new THREE.BoxGeometry(1.5,.3,1.5),mat(cols[i],{transparent:true,opacity:.25}));m.position.set(x,top-.15,z);m.rotation.y=-a;scene.add(m);SKY.steps.push({m,x,z,top})}
  const g=new THREE.Group();[[0,0,2.6],[1.6,.3,1.6],[-1.7,.2,1.5],[0,.3,-1.8],[.4,.5,1.8]].forEach(([x,z,r])=>{const c=mesh(new THREE.SphereGeometry(r,16,10),mat('#FFFFFF'));c.scale.y=.32;c.position.set(x,-.2,z);g.add(c)});
  const gr=mesh(new THREE.CylinderGeometry(2.8,2.8,.12,24),mat('#BBF7D0'));gr.position.y=0;g.add(gr);
  const cs=new THREE.Group();[[-.7,-.7],[.7,-.7],[-.7,.7],[.7,.7]].forEach(([x,z])=>{const t=mesh(new THREE.CylinderGeometry(.28,.3,1.6,12),mat('#FBCFE8'));t.position.set(x,.8,z-.6);cs.add(t);const r=mesh(new THREE.ConeGeometry(.36,.6,12),mat('#EC4899'));r.position.set(x,1.9,z-.6);cs.add(r)});
  const wall=mesh(new THREE.BoxGeometry(1.4,1.1,1.4),mat('#FDF2F8'));wall.position.set(0,.55,-.6);cs.add(wall);g.add(cs);
  const chest=treasureChest();chest.position.set(0,0,1.2);g.add(chest);rootify(chest);chest.userData.zact=()=>openSecretChest('sky');
  const lb=label('Sky Island ☁️','#38BDF8','#FFFFFF',.55);lb.position.y=3.2;g.add(lb);g.position.set(cx,SKY.top,cz);scene.add(g);SKY.g=g;EXTRA_PICK.push(chest);
  SKY.sign=signBoard('🔒 Sky Island · 1 🗝️','#0EA5E9','#FFFFFF',2.2);SKY.sign.position.set(cx+Math.cos(Math.PI*1.05)*5.6,0,cz+Math.sin(Math.PI*1.05)*5.6);SKY.sign.lookAt(0,0,0);scene.add(SKY.sign);
  SKY.owl=gateOwl('sky',cx+Math.cos(Math.PI*.95)*5.4,cz+Math.sin(Math.PI*.95)*5.4,0,0)})();
function treasureChest(){const g=new THREE.Group();const b=mesh(new THREE.BoxGeometry(1,.6,.7),mat('#B45309'));b.position.y=.3;g.add(b);const l=mesh(new THREE.CylinderGeometry(.35,.35,1,12,1,false,0,Math.PI),mat('#92400E'));l.rotation.z=Math.PI/2;l.position.y=.6;g.add(l);
  const band=mesh(new THREE.BoxGeometry(1.02,.1,.72),mat('#FACC15',{metalness:.5,roughness:.3}));band.position.y=.45;g.add(band);const lk=mesh(new THREE.BoxGeometry(.16,.2,.05),mat('#FACC15'));lk.position.set(0,.5,.37);g.add(lk);return g}

/* ---------- Secret Cave in the Adventure Park ---------- */
(()=>{const g=new THREE.Group();const rock=mesh(new THREE.DodecahedronGeometry(3,1),mat('#78716C',{flatShading:true}));rock.scale.set(1,.8,1);rock.position.y=1.4;g.add(rock);
  const door=mesh(new THREE.BoxGeometry(1.4,2,.3),mat('#1C1917'));door.position.set(0,1,2.75);g.add(door);g.userData.door=door;
  [[-.9,2.2,2.5],[.8,2.5,2.4],[0,3.1,2.2]].forEach(([x,y,z])=>{const c=mesh(new THREE.OctahedronGeometry(.25),mat('#67E8F9',{emissive:'#22D3EE',emissiveIntensity:.6}));c.position.set(x,y,z);g.add(c)});
  const lb=label('Secret Cave 🕳️','#44403C','#FFFFFF',.55);lb.position.y=4.6;g.add(lb);g.position.set(56.5,0,-163);g.lookAt(46,0,-163);scene.add(g);ZFX.cave=g;
  DOORS.push({id:'cave',zone:'adv',x:53.4,z:-163,ox:51.8,oz:-163,lock:()=>!P.gates.cave});gateOwl('cave',53.6,-159.6,46,-163)})();
PROPS.crystal=(g,c)=>{const m=mesh(new THREE.OctahedronGeometry(.45),mat(c||'#67E8F9',{emissive:c||'#22D3EE',emissiveIntensity:.55,transparent:true,opacity:.9}));m.scale.y=1.8;m.position.y=.9;g.add(m);pc(g,.4,.5,.2,'#57534E',0,.1,0)};
PROPS.chest=g=>{const c=treasureChest();g.add(c)};
SHOPS_IN.cave={en:'Secret Cave',wall:'#44403C',floor:'#57534E',host:{name:'Luna the Explorer',ch:{g:'girl',hair:'braids',hc:'#1F1B1A',skin:'#C68657',top:'#0F766E',bot:'pants',bc:'#78350F',hat:'helmet'},line:'You found the Secret Cave! Every crystal has a word. Touch them all!',act:()=>openSecretChest('cave')},
  props:[['crystal',-5,-4,0,'#67E8F9'],['crystal',-3,-4.2,0,'#A78BFA'],['crystal',-1,-4,0,'#F472B6'],['crystal',1,-4.3,0,'#FDE047'],['crystal',-5.5,-1,0,'#86EFAC'],['chest',5.5,-3.8]]};
const CAVE_WORDS=['ancient','treasure','discover','brave','whisper','crystal'];
(()=>{const orig=SHOPS_IN.cave.props;orig.forEach((p,i)=>{if(p[0]==='crystal')p.word=CAVE_WORDS[i]})})();
const CAVE_HE={ancient:'עתיק',treasure:'אוצר',discover:'לגלות',brave:'אמיץ',whisper:'לוחש',crystal:'גביש'};

/* ---------- Crystal Tower in the Adventure Park ---------- */
const CT={c:[40,-195.5],steps:[],top:9.6};
(()=>{const[cx,cz]=CT.c;const col=mesh(new THREE.CylinderGeometry(1.1,1.4,CT.top,8),mat('#A5F3FC',{emissive:'#22D3EE',emissiveIntensity:.25,transparent:true,opacity:.85,flatShading:true}));col.position.set(cx,CT.top/2,cz);scene.add(col);
  for(let i=0;i<12;i++){const a=i*.62;const x=cx+Math.cos(a)*2.4,z=cz+Math.sin(a)*2.4,top=.78*(i+1);const m=mesh(new THREE.BoxGeometry(1.3,.25,1.3),mat(i%2?'#C4B5FD':'#99F6E4',{transparent:true,opacity:.25}));m.position.set(x,top-.12,z);m.rotation.y=-a;scene.add(m);CT.steps.push({m,x,z,top})}
  const tp=mesh(new THREE.CylinderGeometry(1.8,1.8,.25,16),mat('#E0F2FE'));tp.position.set(cx,CT.top,cz);scene.add(tp);
  const tr=new THREE.Group();const cup=mesh(new THREE.OctahedronGeometry(.5),mat('#F0F9FF',{emissive:'#7DD3FC',emissiveIntensity:.8}));cup.position.y=.9;tr.add(cup);tr.position.set(cx,CT.top,cz);scene.add(tr);CT.trophy=tr;rootify(tr);tr.userData.zact=()=>openSecretChest('crystal');EXTRA_PICK.push(tr);
  const lb=label('Crystal Tower 💎','#0891B2','#FFFFFF',.6);lb.position.set(cx,CT.top+2.6,cz);scene.add(lb);gateOwl('crystal',cx+3.6,cz+1.6,cx,cz-6)})();
function applyGates(){const on=(steps,open)=>steps.forEach(s=>{s.m.material.opacity=open?1:.25;s.m.material.transparent=!open;s.m.material.needsUpdate=true});
  for(let i=PLATS.length-1;i>=0;i--)if(PLATS[i].gate)PLATS.splice(i,1);
  on(SKY.steps,!!P.gates.sky);if(P.gates.sky){SKY.steps.forEach(s=>PLATS.push({x0:s.x-.8,x1:s.x+.8,z0:s.z-.8,z1:s.z+.8,top:s.top,gate:1}));PLATS.push({x0:SKY.c[0]-2.6,x1:SKY.c[0]+2.6,z0:SKY.c[1]-2.6,z1:SKY.c[1]+2.6,top:SKY.top+.06,gate:1})}
  SKY.sign.visible=!P.gates.sky;
  on(CT.steps,!!P.gates.crystal);if(P.gates.crystal){CT.steps.forEach(s=>PLATS.push({x0:s.x-.7,x1:s.x+.7,z0:s.z-.7,z1:s.z+.7,top:s.top,gate:1}));PLATS.push({x0:CT.c[0]-1.7,x1:CT.c[0]+1.7,z0:CT.c[1]-1.7,z1:CT.c[1]+1.7,top:CT.top+.12,gate:1})}
  if(ZFX.cave)ZFX.cave.userData.door.material=mat(P.gates.cave?'#FDE68A':'#1C1917',P.gates.cave?{emissive:'#FDE68A',emissiveIntensity:.5}:undefined)}
applyGates();

/* ---------- gatekeeper: prove what you know ---------- */
let EXM=null;
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();
function examQ(kind,tier){
  if(kind==='word'){const pool=WORDS.filter(w=>w.tr>=Math.max(1,tier-1)&&w.tr<=tier);const w=pick(pool.filter(x=>x.em).length&&tier<4?pool.filter(x=>x.em):pool);
    return{kind,typed:true,word:w.en,show:w.em&&tier<4?`<div style="font-size:64px;line-height:1">${w.em}</div>`:`<div class="word" style="font-size:28px">${esc(w.he)}</div>`,ask:'Type the English word.',he:'כותבים את המילה באנגלית',ans:w.en}}
  if(kind==='math'){const q=qMath(clamp(tier*2,1,10));return{kind,typed:true,show:q.prompt,ask:'Type the answer.',he:'כותבים את התשובה במספרים',ans:String(q.ans).replace(/\.0+$/,'')}}
  const s=pickTier(SENTS,clamp(tier,1,5),x=>x.en);const others=shuffle(SENTS.filter(x=>x.en!==s.en)).slice(0,2);
  return{kind:'read',typed:false,show:`<div class="word" style="font-size:22px">${esc(s.he)}</div>`,ask:'Which sentence means this?',he:'איזה משפט אומר את זה?',opts:shuffle([s,...others]).map(x=>({en:x.en,ok:x.en===s.en})),ans:s.en}}
function openGate(id){PANEL='gate';const G=GATES[id];const r=rankInfo();
  if(P.gates[id]){sheet(`<div class="npchead"><div class="face" style="background:#E7E5E4">🦉</div><div class="grow"><h2>${en(G.en)}</h2><p class="sub">${G.he} · פתוח ✓</p></div></div><div class="bubble">${en('The way is open, brave explorer. Go!')}</div><button class="btn" data-a="close">${en('Thank you, Owl!')}</button>`);say('The way is open, brave explorer!');return}
  const kOk=(P.keys||0)>=G.keys,rOk=r.i>=G.rank;
  sheet(`<div class="npchead"><div class="face" style="background:#E7E5E4">🦉</div><div class="grow"><h2>${en('The Wise Owl')}</h2><p class="sub">שומר הדרך ל־${G.he} ${G.em}</p></div></div>
  <div class="bubble">${en(`Only explorers who know enough may pass. Bring ${G.keys} golden key${G.keys>1?'s':''} and be a ${RANKS[G.rank][1]}. Then answer my three questions.`)}</div>
  <div class="row"><button class="spk" data-a="sayt" data-t="Only explorers who know enough may pass.">🔊</button></div>
  <ul class="list"><li><span>🗝️ ${en('Golden keys')}</span><b>${P.keys||0} / ${G.keys} ${kOk?'✅':''}</b></li><li><span>${RANKS[G.rank][2]} ${en('Rank')}: ${en(RANKS[G.rank][1])}</span><b>${r.em} ${en(r.name)} ${rOk?'✅':''}</b></li></ul>
  ${kOk&&rOk?`<button class="btn" data-a="exam" data-v="${id}">🦉 ${en("Take the Owl's challenge")}</button>`:`<p class="sub">${!kOk?'מפתחות זהב מקבלים מ־Captain Shell במרינה של אשקלון, בציד חידות 📜. ':''}${!rOk?'הדרגה עולה ככל שיודעים יותר: מילים שלמדת, חשבון, תעלומות ומפתחות. ':''}</p>`}
  <button class="btn ghost" data-a="close">${en('Later')}</button>`);say(`Bring ${G.keys} golden key${G.keys>1?'s':''} and answer my questions.`)}
ACTX.exam=d=>{const G=GATES[d.v];EXM={id:d.v,i:0,qs:shuffle(['word','math','read']).map(k=>examQ(k,G.tier)),miss:0,wrong:null};renderExam()};
function renderExam(){const q=EXM.qs[EXM.i];const G=GATES[EXM.id];
  sheet(`<div class="npchead"><div class="face" style="background:#E7E5E4">🦉</div><div class="grow"><h2>${en("Owl's challenge")}</h2><p class="sub">${G.he} · שאלה ${EXM.i+1} מתוך 3</p></div></div>
  <div class="steps">${EXM.qs.map((_,i)=>`<i class="${i<EXM.i?'ok':i===EXM.i?'now':''}"></i>`).join('')}</div>
  <div class="pz center">${q.show}</div><div class="bubble">${en(q.ask)} <small class="sub">${q.he}</small></div>
  ${q.typed?`<form class="row" data-exam="1" onsubmit="return false"><input class="txt en" id="exIn" dir="ltr" autocomplete="off" autocapitalize="none" spellcheck="false" ${q.kind==='math'?'inputmode="decimal"':''} style="font-size:22px;text-align:center"><button class="btn" data-a="exsub">✓</button></form>`
    :`<div class="opts one">${q.opts.map((o,i)=>`<button class="opt ${EXM.wrong===i?'no':''}" data-a="exopt" data-i="${i}"><span class="en" dir="ltr">${esc(o.en)}</span></button>`).join('')}</div>`}
  ${EXM.msg?`<p class="sub">${EXM.msg}</p>`:''}<button class="btn ghost" data-a="close">${en('Stop')}</button>`);
  if(q.typed)setTimeout(()=>{const i=$('#exIn');if(i){i.focus();i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();ACTX.exsub()}})}},60);if(q.kind==='read')say(q.ask)}
function examAnswer(ok){const q=EXM.qs[EXM.i];learnResult(q.kind==='math'?'math':q.kind==='word'?'spell':'sentence',ok,q.kind==='word'?q.word:null);
  if(!ok){EXM.miss++;sfx.bad();if(EXM.miss>=4){sheet(`<div class="npchead"><div class="face" style="background:#E7E5E4">🦉</div><div class="grow"><h2>${en('Not yet...')}</h2></div></div><div class="bubble">${en('Learn a little more and come back. I will wait for you!')}</div><p class="sub">התשובה הייתה: <b dir="ltr">${esc(q.ans)}</b>. אפשר לנסות שוב מתי שרוצים.</p><button class="btn" data-a="close">OK</button>`);say('Learn a little more and come back!');EXM=null;return}
    EXM.msg=`לא בדיוק. התשובה הייתה <b dir="ltr">${esc(q.ans)}</b>. הנה שאלה אחרת:`;EXM.qs[EXM.i]=examQ(q.kind,GATES[EXM.id].tier);EXM.wrong=null;renderExam();say('Not quite. Try this one!');return}
  sfx.place();EXM.msg='';EXM.i++;if(EXM.i<3){renderExam();return}
  const id=EXM.id,G=GATES[id];EXM=null;P.gates[id]=1;P.keys=Math.max(0,(P.keys||0)-G.keys);save();applyGates();addXp(60);sfx.win();burst(G.em+' '+G.en+'!');
  sheet(`<div class="npchead"><div class="face" style="background:#FEF3C7">🦉</div><div class="grow"><h2>${en('The way is open!')}</h2><p class="sub">${G.he} נפתח/ה</p></div></div><div class="bubble">${en(`You know so much! ${G.en} is open for you now.`)}</div><button class="btn" data-a="close">${en("Let's go!")} ${G.em}</button>`);say(`You know so much! ${G.en} is open!`)}
ACTX.exsub=()=>{const q=EXM&&EXM.qs[EXM.i];if(!q)return;const v=($('#exIn')||{}).value;if(!norm(v)){toast('קודם כותבים תשובה');return}
  const ok=q.kind==='math'?Math.abs(parseFloat(String(v).replace(',','.'))-parseFloat(q.ans))<1e-6:norm(v)===norm(q.ans);examAnswer(ok)};
ACTX.exopt=d=>{const q=EXM.qs[EXM.i];examAnswer(!!q.opts[+d.i].ok)};
function openSecretChest(id){const done=P.chests2[id];const R={sky:[40,'crown','👑 crown'],cave:[60,'wings','🦋 wings'],crystal:[100,null,'💎 Diamond Explorer']}[id];
  if(id==='cave'&&ME.zone!=='inside'){openGate('cave');return}
  if(done){toast('כבר פתחת את האוצר הזה 🎁');say('You already opened this treasure.');return}
  P.chests2[id]=1;addGems(R[0],'אוצר סודי: '+GATES[id].he,'Secret treasure');if(R[1]&&!P.ward.includes(R[1]))P.ward.push(R[1]);if(id==='crystal'){P.badges.diamond=1}save();sfx.win();burst('🎁 +'+R[0]+' 💎');
  say(id==='crystal'?'You are a Diamond Explorer! Amazing!':'You found the secret treasure!');toast(`🎁 אוצר סודי! +${R[0]} 💎 · ${R[2]}`)}

/* ---------- Captain Shell: riddle hunts for golden keys ---------- */
const SHELL={g:'boy',hair:'messy',hc:'#EDE6D6',skin:'#C68657',top:'#1E3A8A',bot:'pants',bc:'#F5F0E6'};
const HUNT_LOCS={
  bakery:{z:'town',x:-4,zz:-55.5,r:[['Go to the bakery.'],['Go to the place where they make bread and cakes.'],['Find the place that smells of fresh bread every morning.']],he:'המאפייה'},
  pets:{z:'town',x:-9,zz:-50,r:[['Go to the pet shop.'],['Go where you can buy a fish or a bird.'],['Find the shop where animals wait for a new family.']],he:'חנות החיות'},
  bank:{z:'town',x:4.5,zz:-55.5,r:[['Go to the bank.'],['Go where you can save your gems.'],['Find the place where money grows a little every day.']],he:'הבנק'},
  sign:{z:'island',x:0,zz:-8.5,r:[["Go to Shirel's sign."],["Find the big wooden sign with Shirel's name on it."],['Find the place that says whose world this is.']],he:'השלט של שיראל'},
  tower:{z:'city',x:CX-11.5,zz:CZ-19.5,r:[['Go to the Sea Tower.'],['Go to the tall white and red tower near the boats.'],['I am tall, white and red. I stand by the sea and I hide an escape room.']],he:'מגדל הים'},
  park:{z:'city',x:CX+1,zz:CZ+15,r:[['Go to the National Park.'],['Find the old stone columns.'],['Walk to the columns that are more than two thousand years old.']],he:'הגן הלאומי'},
  mall:{z:'city',x:CX+16.5,zz:CZ-14,r:[['Go to the mall.'],['Go to the big building with many shops.'],['Find the place where friends meet to shop and to compete.']],he:'הקניון'},
  lifeguard:{z:'city',x:CX-20,zz:CZ+2,r:[['Go to the lifeguard.'],['Find the red tower on the beach.'],['Find the person who keeps swimmers safe in the sea.']],he:'המציל'},
  fountain:{z:'girls',x:-10,zz:-177,r:[['Go to the pink fountain.'],['Find the fountain with a heart.'],['Look for water that dances around a pink heart.']],he:'המזרקה הוורודה'},
  stage:{z:'girls',x:-16,zz:-185,r:[['Go to the dance stage.'],['Find the stage with a disco ball.'],['Go where music plays and everybody can dance.']],he:'במת הריקודים'},
  soccer:{z:'boys',x:24,zz:-163,r:[['Go to the soccer field.'],['Go where players kick a ball into a goal.'],['Find the green field with two white goals.']],he:'מגרש הכדורגל'},
  gymdoor:{z:'boys',x:24.5,zz:-191,r:[['Go to the gym.'],['Go where people lift heavy things to get strong.'],['Find the place where a coach counts your push-ups.']],he:'חדר הכושר'},
  advstart:{z:'adv',x:37,zz:-165.5,r:[['Go to the start of the Adventure Run.'],['Find the yellow start line near Slime Lake.'],['Go where brave runners begin their jump over the slime.']],he:'קו הזינוק בפארק ההרפתקאות'}};
let SCROLL=null;
(()=>{const s=new THREE.Group();const p=mesh(new THREE.CylinderGeometry(.18,.18,.9,12),mat('#FEF3C7',{emissive:'#FDE68A',emissiveIntensity:.5}));p.rotation.z=Math.PI/2;s.add(p);
  [-1,1].forEach(k=>{const e=mesh(new THREE.CylinderGeometry(.22,.22,.08,12),mat('#B45309'));e.rotation.z=Math.PI/2;e.position.x=k*.48;s.add(e)});
  const glow=mesh(new THREE.SphereGeometry(.7,14,10),mat('#FDE68A',{transparent:true,opacity:.25,emissive:'#FDE68A',emissiveIntensity:.6}),false);s.add(glow);const lb=label('📜','#FFFFFF','#1D2A48',.4);lb.position.y=1.1;s.add(lb);s.visible=false;scene.add(s);SCROLL=s;rootify(s);s.userData.zact=()=>huntArrive(true);EXTRA_PICK.push(s)})();
(()=>{const d=human3D(Object.assign({kind:'human',eyes:'happy'},SHELL));const hd=d.userData.head;const h=mesh(new THREE.ConeGeometry(.5,.35,3),mat('#111827'));h.rotation.x=-.15;h.position.y=.38;hd.add(h);
  const lb=label('Captain Shell 🏴‍☠️','#111827','#FFFFFF',.45);lb.position.y=2.5;d.add(lb);const mk=marker('📜','#B45309');mk.position.y=3.1;d.add(mk);d.position.set(CX-15.2,0,CZ-14.5);d.lookAt(CX-8,0,CZ-14.5);scene.add(d);rootify(d);d.userData.zact=()=>openShell();d.userData.talker='Captain Shell';EXTRA_PICK.push(d)})();
function riddleTier(){const r=rankInfo().i;return r<2?0:r<4?1:2}
function newHunt(){const t=riddleTier();const n=3+t;const keys=shuffle(Object.keys(HUNT_LOCS)).slice(0,n);
  return{t,steps:keys.map(k=>({k,txt:HUNT_LOCS[k].r[t][0]})),i:0,code:null}}
function openShell(){PANEL='shell';const h=P.hunt;
  if(h&&h.i>=h.steps.length){if(!h.code){const q=qMath(clamp(2+rankInfo().i,1,10));h.code={prompt:q.prompt,ans:String(q.ans).replace(/\.0+$/,'')};save()}renderLock();return}
  sheet(`<div class="npchead"><div class="face" style="background:#DBEAFE">${humanSVG(Object.assign({kind:'human'},SHELL))}</div><div class="grow"><h2>${en('Captain Shell')}</h2><p class="sub">ציד חידות 📜 · 🗝️ ${P.keys||0}</p></div>${gemTag()}</div>
  ${h?`<div class="bubble">${en('Follow the riddle! When you find the glowing scroll, you get the next riddle.')}</div><div class="parch" dir="ltr">📜 ${esc(h.steps[h.i].txt)}</div>
    <div class="row"><button class="spk" data-a="sayt" data-t="${esc(h.steps[h.i].txt)}">🔊</button><button class="btn ghost mini" data-a="hhint">💡</button><span class="sub">חידה ${h.i+1} מתוך ${h.steps.length}</span></div><div class="hint" id="hintTxt" hidden>${HUNT_LOCS[h.steps[h.i].k].he}</div>
    <button class="link" data-a="hstop">לוותר על הציד הזה</button>`
  :`<div class="bubble">${en('Ahoy! I hide golden keys all over the world. Read my riddles in English, find the scrolls, and open my treasure chest with a number code!')}</div>
    <p class="sub">מפתחות זהב פותחים מקומות סודיים בעולם 🦉. ככל שהדרגה שלך עולה, החידות נעשות חכמות יותר.</p><button class="btn" data-a="hstart">📜 ${en('Start a riddle hunt')}</button>`}
  <button class="btn ghost" data-a="close">${en('Bye, Captain!')}</button>`);if(h)say(h.steps[h.i].txt);else say('Ahoy! Do you want to hunt for a golden key?')}
ACTX.hstart=()=>{P.hunt=newHunt();save();placeScroll();renderQuestChip();openShell()};
ACTX.hstop=()=>{P.hunt=null;save();placeScroll();renderQuestChip();closeSheet()};
ACTX.hhint=()=>{const h=$('#hintTxt');if(h)h.hidden=!h.hidden};
ACTX.hunt=()=>{const h=P.hunt;if(!h)return;if(h.i>=h.steps.length){toast('🗝️ חוזרים ל־Captain Shell במרינה כדי לפתוח את התיבה');return}const tx=h.steps[h.i].txt;
  sheet(`<h2>📜 ${en('Riddle')} ${h.i+1}/${h.steps.length}</h2><div class="parch" dir="ltr">${esc(tx)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(tx)}">🔊</button><button class="btn ghost mini" data-a="hhint">💡</button></div><div class="hint" id="hintTxt" hidden>${HUNT_LOCS[h.steps[h.i].k].he}</div><button class="btn ghost" data-a="close">OK</button>`);PANEL='hunt';say(tx)};
function placeScroll(){const h=P.hunt;if(!SCROLL)return;if(!h||h.i>=h.steps.length){SCROLL.visible=false;return}const L=HUNT_LOCS[h.steps[h.i].k];SCROLL.position.set(L.x,1,L.zz);SCROLL.visible=true;SCROLL.userData.zone=L.z}
function huntArrive(tapped){const h=P.hunt;if(!h||h.i>=h.steps.length)return;const L=HUNT_LOCS[h.steps[h.i].k];if(Math.hypot(ME.pos.x-L.x,ME.pos.z-L.zz)>(tapped?6:2.2))return;
  h.i++;learnResult('vocab',true);addXp(8);sfx.coin();save();placeScroll();renderQuestChip();
  if(h.i>=h.steps.length){burst('📜 ✓');say('You found all the scrolls! Go back to Captain Shell at the marina.');toast('📜 מצאת את כל המגילות! חוזרים ל־Captain Shell במרינה');return}
  burst('📜');const tx=h.steps[h.i].txt;toast('📜 '+tx);say('You found a scroll! Next riddle: '+tx)}
function renderLock(){const h=P.hunt;PANEL='shell';sheet(`<div class="npchead"><div class="face" style="background:#DBEAFE">${humanSVG(Object.assign({kind:'human'},SHELL))}</div><div class="grow"><h2>${en('The treasure chest')}</h2><p class="sub">מנעול מספרים 🔢</p></div></div>
  <div class="bubble">${en('You found all my scrolls! The code for my chest is the answer to this:')}</div><div class="pz center">${h.code.prompt}</div>
  <form class="row" onsubmit="return false"><input class="txt en" id="lockIn" dir="ltr" inputmode="decimal" autocomplete="off" style="font-size:26px;text-align:center;letter-spacing:4px"><button class="btn" data-a="lockgo">🔓</button></form>
  ${h.lockMsg?`<p class="sub">${h.lockMsg}</p>`:''}<button class="btn ghost" data-a="close">${en('Later')}</button>`);setTimeout(()=>{const i=$('#lockIn');if(i){i.focus();i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();ACTX.lockgo()}})}},60)}
ACTX.lockgo=()=>{const h=P.hunt;if(!h||!h.code)return;const v=parseFloat(String(($('#lockIn')||{}).value||'').replace(',','.'));if(isNaN(v)){toast('כותבים מספר');return}
  if(Math.abs(v-parseFloat(h.code.ans))>1e-6){learnResult('math',false);sfx.bad();h.lockMsg='🔒 המנעול לא נפתח. בודקים שוב את החשבון (אפשר על דף).';say('The lock did not open. Check your math!');KEEP=true;renderLock();return}
  learnResult('math',true);P.keys=(P.keys||0)+1;P.hunt=null;addGems(15,'ציד חידות של Captain Shell','Riddle hunt');addXp(40);save();placeScroll();renderQuestChip();sfx.win();burst('🗝️ +1');
  const nx=Object.entries(GATES).find(([k,g])=>!P.gates[k]);
  sheet(`<div class="npchead"><div class="face" style="background:#FEF3C7">🗝️</div><div class="grow"><h2>${en('A golden key!')}</h2><p class="sub">יש לך ${P.keys} מפתחות זהב</p></div></div><div class="bubble">${en('Well done, matey! Keys open secret places. '+(nx?nx[1].tease:'You opened every secret place!'))}</div>
  <div class="row"><button class="btn" data-a="journal">📔 ${en('Explorer journal')}</button><button class="btn ghost" data-a="close">${en('Ahoy!')}</button></div>`);say('Well done! Here is a golden key!')};

/* ---------- signs that plant ideas, and daily word stones ---------- */
const MOTTOS=[['Words are keys 🗝️','מילים הן מפתחות',2,-12,'island'],['The sky keeps a secret ☁️','השמיים שומרים סוד',11,2,'island'],['Brave explorers learn every day','חוקרים אמיצים לומדים כל יום',8,-40,'town'],
  ['Read the signs. They know the way.','קוראים את השלטים. הם יודעים את הדרך',16.4,-70,'road'],['Numbers open doors 🔢','מספרים פותחים דלתות',CX+6,CZ+9,'city'],['Curious kids find treasure','ילדים סקרנים מוצאים אוצרות',CX-12,CZ-10,'city'],
  ['A smart mind finds hidden places','מוח חכם מוצא מקומות נסתרים',50,-158,'adv'],['Every word makes you stronger','כל מילה מחזקת אותך',29,-188,'boys'],['Learn a word, open a world 🌍','לומדים מילה, פותחים עולם',-6,-170,'girls']];
MOTTOS.forEach(([e,he,x,z])=>{const s=signBoard(e,'#FFFBEB','#92400E',2.8);s.position.set(x,0,z);s.lookAt(x,0,z+5);scene.add(s);rootify(s);s.userData.zact=()=>{say(e.replace(/[^\x20-\x7E]/g,'').trim());toast('🪧 '+e+' · '+he)};EXTRA_PICK.push(s)});
const STONES=[[-4,7,'island'],[-6,-48,'town'],[14,-85,'road'],[CX+12,CZ+20,'city'],[-16,-196,'girls'],[30,-170,'boys'],[48,-196,'adv']];const STONEO=[];
const dayKey=()=>new Date().toISOString().slice(0,10);
function stoneWord(i){const t=clamp(rankInfo().i+1,1,5);const pool=WORDS.filter(w=>w.tr===t||w.tr===t-1);let h=0;const s=dayKey()+i;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return pool[h%pool.length]}
STONES.forEach(([x,z],i)=>{const g=new THREE.Group();const st=mesh(new THREE.DodecahedronGeometry(.45,0),mat('#A78BFA',{emissive:'#8B5CF6',emissiveIntensity:.5,flatShading:true}));st.position.y=.5;g.add(st);
  const lb=label('✨ ?','#7C3AED','#FFFFFF',.38);lb.position.y=1.4;g.add(lb);g.position.set(x,0,z);scene.add(g);rootify(g);g.userData.zact=()=>takeStone(i);EXTRA_PICK.push(g);STONEO.push({g,st,lb,x,z})});
function stonesToday(){if(!P.wst||P.wst.d!==dayKey())P.wst={d:dayKey(),got:[]};return P.wst}
function takeStone(i){const s=stonesToday();if(s.got.includes(i)){const w=stoneWord(i);sayWord(w.en,w.he);return}const o=STONEO[i];if(Math.hypot(ME.pos.x-o.x,ME.pos.z-o.z)>6){walkTo(new THREE.Vector3(o.x,0,o.z+1.2));return}
  const w=stoneWord(i);s.got.push(i);sayWord(w.en,w.he);P.learned[w.en]=(P.learned[w.en]||0)+1;addGems(1,'אבן מילים','Word stone');addXp(4);save();refreshStones();burst(`✨ ${w.en}`);toast(`✨ אבני מילים היום: ${s.got.length}/${STONES.length} · ${w.en} = ${w.he}`)}
function refreshStones(){const s=stonesToday();STONEO.forEach((o,i)=>{const got=s.got.includes(i);o.st.material=mat(got?'#C4B5FD':'#A78BFA',{emissive:'#8B5CF6',emissiveIntensity:got?.1:.5,flatShading:true})})}
refreshStones();

/* ---------- journal, rank chip, rank-up, camera lift ---------- */
function openJournal(){PANEL='journal';const r=rankInfo();const s=stonesToday();const pct=r.next?Math.round((r.pts-r.base)/(r.next-r.base)*100):100;
  sheet(`<h2>📔 ${en('Explorer journal')}</h2><div class="box center"><div style="font-size:48px">${r.em}</div><h3>${en(r.name)} · ${r.he}</h3><div class="bar big"><i style="width:${pct}%"></i></div>
    <p class="sub">${r.next?`${r.pts} / ${r.next} נקודות חוקר עד ${en(r.nextName)}`:'הגעת לדרגה הכי גבוהה! 🌟'}</p></div>
  <ul class="list"><li><span>🗝️ ${en('Golden keys')}</span><b>${P.keys||0}</b></li><li><span>📚 ${en('Words I know')}</span><b>${Object.keys(P.learned).length}</b></li><li><span>✨ ${en('Word stones today')}</span><b>${s.got.length}/${STONES.length}</b></li><li><span>🕵️ ${en('Cases closed')}</span><b>${(P.badges&&P.badges.det)||0}</b></li></ul>
  <h3>${en('Secret places')}</h3>${Object.entries(GATES).map(([k,g])=>`<div class="box"><div class="row"><b class="grow">${g.em} ${en(g.en)} · ${g.he}</b><span>${P.gates[k]?'✅':'🔒'}</span></div><p class="sub" dir="ltr" style="text-align:left">${esc(g.tease)}</p>${P.gates[k]?'':`<p class="sub">צריך: 🗝️ ${g.keys} · ${RANKS[g.rank][2]} ${RANKS[g.rank][1]}</p>`}</div>`).join('')}
  <div class="row"><button class="btn ghost mini" data-a="powers">✨ ${en('My superpower')}</button><button class="btn ghost mini" data-a="actboard">⚡ ${en('Action jobs')}</button></div><p class="sub">איך עולים בדרגה? לומדים מילים (אבני מילים ✨, נגיעה בחפצים, שיעורים), פותרים תעלומות 🕵️, ומוצאים מפתחות אצל Captain Shell 📜.</p><button class="btn ghost" data-a="close">סגירה</button>`)}
ACTX.journal=()=>openJournal();
const _renderQuestChip=renderQuestChip;renderQuestChip=function(){_renderQuestChip();const el=$('#questChip');if(!el)return;const h=P.hunt;let x='';
  if(h)x+=`<button class="quest" data-a="hunt" style="margin-top:6px;background:#FEF3C7;box-shadow:0 3px 0 #E5C27A;color:var(--ink)"><span>📜</span><span>${h.i>=h.steps.length?'🗝️ חוזרים ל־Captain Shell':'חידה '+(h.i+1)+'/'+h.steps.length}</span></button>`;
  const r=rankInfo();x+=`<button class="quest jr" data-a="journal" style="margin-top:6px"><span>${r.em}</span><span class="en">${r.name}</span><span>🗝️${P.keys||0}</span></button>`;el.insertAdjacentHTML('beforeend',x)};
let exT=0;
function stepExplorer(dt,t){if(SCROLL&&SCROLL.visible){SCROLL.rotation.y=t*1.5;SCROLL.position.y=1+Math.sin(t*3)*.15;if(ME.zone===SCROLL.userData.zone)huntArrive(false)}
  STONEO.forEach((o,i)=>{o.st.rotation.y=t*.8+i;o.st.position.y=.5+Math.sin(t*2+i)*.1;if(Math.hypot(ME.pos.x-o.x,ME.pos.z-o.z)<1&&!stonesToday().got.includes(i))takeStone(i)});
  if(CT.trophy)CT.trophy.rotation.y=t;
  if(ME.obj&&ME.zone!=='inside'){const ty=Math.max(0,ME.y*.85);const dy=(ty-controls.target.y)*Math.min(1,dt*4);if(Math.abs(dy)>.0005){controls.target.y+=dy;camera.position.y+=dy}}
  exT+=dt;if(exT>2){exT=0;const r=rankInfo();if(rankSeen===null)rankSeen=P.rankSeen??r.i;if(r.i>rankSeen&&$('#title').hidden&&!PANEL){rankSeen=r.i;P.rankSeen=r.i;save();rankUp(r)}}}
function rankUp(r){sfx.win();burst(r.em+' '+r.name+'!');const g=Object.entries(GATES).find(([k,x])=>!P.gates[k]&&x.rank===r.i);
  sheet(`<div class="center"><div style="font-size:72px">${r.em}</div><h2>${en('New rank: '+r.name+'!')}</h2><p class="sub">דרגה חדשה: ${r.he}</p></div><div class="bubble">${en(g?'Now you can try to open '+g[1].en+'. '+g[1].tease:'You know more and more. New secrets are waiting!')}</div>
  <div class="row"><button class="btn" data-a="journal">📔 ${en('Explorer journal')}</button><button class="btn ghost" data-a="close">${en('Cool!')}</button></div>`);say('New rank! You are now a '+r.name+'!')}
placeScroll();
const _closeSheet=closeSheet;closeSheet=function(){_closeSheet();setTimeout(()=>{if(typeof renderQuestChip==='function')renderQuestChip()},50)};
