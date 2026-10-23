/* Shapeland · a world by Shirel Yitzhak */
/* ===================== HEROES FOR HIRE: use your powers as a job ===================== */
/* City people post jobs that need a power. Friends can hire each other's powers for gems.
   The hero sets a price between 5 and 50 gems: too high and nobody hires, too low and you earn little. */
if(!P.hero)P.hero={on:true,price:{}};if(!P.heroStars)P.heroStars={n:0,sum:0};if(!P.hires)P.hires=[];
const HPOW={water:{em:'💧',he:'מים',has:()=>elemLv('water')},elec:{em:'⚡',he:'חשמל',has:()=>elemLv('elec')},str:{em:'💪',he:'כוח',has:()=>elemLv('str')},fly:{em:'🕊️',he:'תעופה',has:()=>P.power==='fly'?1:0}};
const heroPrice=k=>clamp(+(P.hero.price[k]||10),5,50);
const myPowers=()=>Object.keys(HPOW).filter(k=>HPOW[k].has());
/* ---------- the board ---------- */
(()=>{const b=signBoard('🦸 HEROES FOR HIRE','#7C3AED','#FFFFFF',3);b.position.set(CX+11,0,CZ-21.5);b.lookAt(CX+11,0,CZ-10);scene.add(b);rootify(b);b.userData.zact=()=>openHeroes();EXTRA_PICK.push(b);
  const lb=label('Heroes for Hire 🦸','#7C3AED','#FFFFFF',.5);lb.position.set(CX+11,3.3,CZ-21.5);scene.add(lb)})();
/* ---------- city jobs that need a power ---------- */
const HJOBS=[
  {k:'water',need:1,pay:18,en:'Big fire at the Bakery! We need a hero with water power!',he:'שריפה גדולה במאפייה!',zone:'town',at:()=>{const d=DOORS.find(x=>x.id==='bakery');return[d.ox,d.oz]}},
  {k:'water',need:2,pay:28,en:'The flowers in the Girls\' Garden are dying. Please water them!',he:'הפרחים בגן הבנות נובלים',zone:'girls',at:()=>[-10,-172]},
  {k:'elec',need:1,pay:22,en:'The lights at the marina are off. Can you bring the power back?',he:'האורות במרינה כבו',zone:'city',at:()=>[CX-16,CZ-12]},
  {k:'elec',need:2,pay:32,en:'The machine in the Tools Workshop stopped. It needs a big zap!',he:'המכונה בסדנת הכלים נעצרה',zone:'boys',at:()=>{const d=DOORS.find(x=>x.id==='tools');return[d.ox,d.oz]}},
  {k:'str',need:1,pay:20,en:'A big rock fell on Ben Gurion Boulevard. Move it, strong hero!',he:'סלע חוסם את השדרה',zone:'road',at:()=>[14,-80]},
  {k:'str',need:2,pay:30,en:'The bus is stuck in the sand near the beach. Push it out!',he:'האוטובוס נתקע בחול',zone:'city',at:()=>[CX-14,CZ+4]},
  {k:'fly',need:1,pay:25,en:'A kitten is stuck high on the Sea Tower! Fly up and save it!',he:'חתלתול תקוע על מגדל הים',zone:'city',at:()=>[CX-12,CZ-19.5],high:3},
  {k:'fly',need:1,pay:20,en:'A kite is stuck at the top of a tree on Shirel\'s Island. Fly and get it!',he:'עפיפון תקוע על עץ באי',zone:'island',at:()=>[-9,-1],high:2.5}];
let HJ=null;
function jobBoard(){const h=Math.floor(Date.now()/600000);let s=h;const r=()=>{s=(s*9301+49297)%233280;return s/233280};return[...HJOBS].sort(()=>r()-.5).slice(0,4)}
function openHeroes(){PANEL='heroes';const mine=myPowers();const st=P.heroStars;const avg=st.n?(st.sum/st.n).toFixed(1):'—';
  const friends=(NET.peers||[]).filter(p=>!p.sameTab&&!p.isMe&&p.presence&&p.presence.hero&&Array.isArray(p.presence.hero.p)&&p.presence.hero.p.length);
  sheet(`<h2>🦸 ${en('Heroes for Hire')}</h2>
  <div class="box"><b>📋 ${en('City jobs')}</b> <span class="sub">(מתחלפות כל 10 דקות)</span>
  ${jobBoard().map((j,i)=>{const can=HPOW[j.k].has()>=j.need;return`<div class="row" style="align-items:flex-start;margin-top:6px"><span class="grow"><span dir="ltr" class="en" style="display:block;text-align:left">${HPOW[j.k].em} ${esc(j.en)}</span><small class="sub">${j.he} · צריך ${HPOW[j.k].em}${'★'.repeat(j.need)} · 💎${j.pay}</small></span>
    <button class="btn mini ${can?'':'ghost'}" data-a="hjob" data-i="${HJOBS.indexOf(j)}" ${can?'':'disabled'}>${can?en('Take it!'):'🔒'}</button></div>`}).join('')}
  ${HJ?`<p class="sub">🦸 יש לך משימה פעילה: ${HJ.job.he}</p>`:''}</div>
  <div class="box"><b>🪪 ${en('My hero card')}</b> ${mine.length?`<span class="sub">⭐ ${avg} (${st.n} דירוגים)</span>
    <label class="row"><input type="checkbox" id="heroOn" ${P.hero.on?'checked':''}> <span>חברים יכולים להזמין אותי</span></label>
    ${mine.map(k=>`<div class="row"><span class="grow">${HPOW[k].em} ${HPOW[k].he}</span><input type="range" min="5" max="50" step="1" value="${heroPrice(k)}" data-hp="${k}" style="max-width:150px"><b dir="ltr" id="hp-${k}">💎${heroPrice(k)}</b></div>`).join('')}
    <p class="sub">טיפ: מחיר גבוה מדי, אף אחד לא מזמין. מחיר נמוך מדי, מרוויחים מעט. מה המחיר ההוגן? 🤔</p>`:'<p class="sub">עוד אין לך כוח. לומדים באקדמיית הכוחות ✨ (או בוחרים לעוף 🕊️)</p>'}</div>
  <div class="box"><b>👫 ${en('Hire a friend')}</b>${friends.length?friends.map(p=>{const h=p.presence.hero;return`<div class="row"><span class="grow">${esc(nameOf(p))} ${h.p.map(k=>HPOW[k]?HPOW[k].em+'💎'+clamp(+(h.c||{})[k]||10,5,50):'').join(' ')} ${h.s?'⭐'+h.s:''}</span>
      ${h.p.map(k=>HPOW[k]?`<button class="btn mini ghost" data-a="hire" data-k="${k}" data-to="${esc(p.presence.k||'')}" data-n="${esc(nameOf(p))}" data-c="${clamp(+(h.c||{})[k]||10,5,50)}">${HPOW[k].em}</button>`:'').join('')}</div>`}).join(''):'<p class="sub">כשחברים עם כוחות מחוברים, אפשר להזמין אותם לעזור כאן.</p>'}</div>
  <button class="btn ghost" data-a="close">סגירה</button>`);
  const on=$('#heroOn');if(on)on.onchange=()=>{P.hero.on=on.checked;save();pushPresence(true)};
  document.querySelectorAll('[data-hp]').forEach(r=>r.oninput=()=>{P.hero.price[r.dataset.hp]=+r.value;$('#hp-'+r.dataset.hp).textContent='💎'+r.value;save();pushPresence(true)})}
ACTX.hjob=d=>{const j=HJOBS[+d.i];if(HPOW[j.k].has()<j.need)return;const[x,z]=j.at();
  if(HJ&&HJ.mk)scene.remove(HJ.mk);const mk=new THREE.Group();const ring=mesh(new THREE.TorusGeometry(1.4,.1,8,30),mat('#A855F7',{emissive:'#A855F7',emissiveIntensity:.7}));ring.rotation.x=Math.PI/2;ring.position.y=.1;mk.add(ring);
  const ic=label(HPOW[j.k].em+' HERO','#7C3AED','#FFFFFF',.5);ic.position.y=(j.high||0)+2.6;mk.add(ic);if(j.high){const cat=mesh(new THREE.SphereGeometry(.25,10,8),mat('#F59E0B'));cat.position.y=j.high;mk.add(cat)}
  mk.position.set(x,0,z);scene.add(mk);HJ={job:j,x,z,mk,t:0};closeSheet();say(j.en);toast(`🦸 ${j.he} · הולכים לסימון הסגול ומשתמשים ב־${HPOW[j.k].em}`);if(AU.on)SND.sparkle()};
function heroUsed(k){/* called when any power is used */
  if(HJ&&HJ.job.k===k&&ME.zone===HJ.job.zone&&Math.hypot(ME.pos.x-HJ.x,ME.pos.z-HJ.z)<4.5){if(HJ.job.high&&ME.y<HJ.job.high-.3){toast('🕊️ צריך לעוף גבוה יותר!');return}heroJobDone()}
  if(HIRE.job&&HIRE.job.k===k)hireCheck()}
function heroJobDone(){const j=HJ.job;scene.remove(HJ.mk);HJ=null;addGems(j.pay,'גיבור/ה להשכרה: '+j.he,'Hero job');addXp(25);sfx.win();shake(.25,.3);fxBurst(ME.pos.x,1.5,ME.pos.z,'#C084FC',30,3.5);burst('🦸 +'+j.pay+' 💎');
  P.hires.unshift({t:Date.now(),k:j.k,who:'city',a:j.pay});P.hires=P.hires.slice(0,10);save();say(pick(['Thank you, hero!','You saved the day!','Our hero!']))}
/* fly jobs finish by flying into the marker high enough */
function stepHeroes(dt,t){if(HJ){HJ.mk.rotation.y=t;if(HJ.job.k==='fly'&&ME.flying&&ME.zone===HJ.job.zone&&Math.hypot(ME.pos.x-HJ.x,ME.pos.z-HJ.z)<2&&ME.y>=HJ.job.high-.3)heroJobDone()}
  if(HIRE.job&&HIRE.job.k==='fly'&&ME.flying)hireCheck()}
/* hook: every power use tells the hero system */
const _useElement=useElement;useElement=function(){const k=P.elemSel;const cd=EL.cd;_useElement();if(cd<=0&&k&&elemLv(k))heroUsed(k)};

/* ---------- friends hire friends (over the group, with a price) ---------- */
const HIRE={job:null,pending:null};
const _pushPresence=pushPresence;pushPresence=function(force){if(NET.room){const p=myPowers();const st=P.heroStars;NET.heroCard=P.hero.on&&p.length?{p,c:Object.fromEntries(p.map(k=>[k,heroPrice(k)])),s:st.n?+(st.sum/st.n).toFixed(1):0}:null}_pushPresence(force)};
(function patchPresence(){const iv=setInterval(()=>{if(!NET.room||NET.room.__hero)return;const r=NET.room;const orig=r.presence.bind(r);r.presence=patch=>orig(Object.assign({},patch,{hero:NET.heroCard||null}));r.__hero=1;attachHero(r);pushPresence(true)},1000)})();
function attachHero(r){
  r.on('hire',m=>{if(m.sameTab)return;const d=m.data||{};if(d.to!==P.key||!HPOW[d.k]||!HPOW[d.k].has())return;const c=clamp(+d.c||10,5,50);HIRE.pending={from:d.from,fk:d.fk,k:d.k,c,zone:d.zone,x:+d.x||0,z:+d.z||0};
    sfx.coin();toast(`🦸 ${String(d.from||'חבר/ה').slice(0,14)} רוצה להזמין את ה${HPOW[d.k].he} שלך ב־💎${c}`);openHireOffer()});
  r.on('hireok',m=>{if(m.sameTab)return;const d=m.data||{};if(d.to!==P.key)return;HIRE.waiting={hero:d.from,hk:d.hk,k:d.k,c:clamp(+d.c||10,5,50)};toast(`🦸 ${String(d.from).slice(0,14)} בדרך אלייך! ${HPOW[d.k].em}`);say('Your hero is on the way!')});
  r.on('hireno',m=>{if(m.sameTab)return;const d=m.data||{};if(d.to!==P.key)return;toast(`${String(d.from).slice(0,14)} לא יכול/ה עכשיו 🙂`)});
  r.on('hiredone',m=>{if(m.sameTab)return;const d=m.data||{};if(d.to!==P.key||!HIRE.waiting)return;const w=HIRE.waiting;HIRE.waiting=null;const c=w.c;
    if(P.gems<c){toast('אין מספיק 💎 לשלם לגיבור/ה 😕');emit('hirepay',{to:w.hk,a:0,from:P.name});return}P.gems-=c;logm('תשלום לגיבור/ה '+w.hero,'Hired a hero',-c);P.hires.unshift({t:Date.now(),k:w.k,who:w.hero,a:-c});P.hires=P.hires.slice(0,10);save();renderHud();
    emit('hirepay',{to:w.hk,a:c,from:P.name});sfx.win();openRate(w)});
  r.on('hirepay',m=>{if(m.sameTab)return;const d=m.data||{};if(d.to!==P.key)return;const a=clamp(+d.a||0,0,50);if(a>0){addGems(a,'שכר גיבור/ה מ־'+String(d.from).slice(0,14),'Hero pay');P.hires.unshift({t:Date.now(),k:HIRE.lastK||'',who:String(d.from).slice(0,14),a});P.hires=P.hires.slice(0,10);save();burst('🦸 +'+a+' 💎')}else toast('החבר/ה לא הצליח/ה לשלם הפעם')});
  r.on('rate',m=>{if(m.sameTab)return;const d=m.data||{};if(d.to!==P.key)return;const s=clamp(Math.round(+d.s||0),1,5);P.heroStars.n++;P.heroStars.sum+=s;save();toast(`⭐ קיבלת ${s} כוכבים!`);pushPresence(true)})}
ACTX.hire=d=>{if(!d.to)return;emit('hire',{to:d.to,k:d.k,c:+d.c,from:P.name,fk:P.key,zone:ME.zone,x:+ME.pos.x.toFixed(1),z:+ME.pos.z.toFixed(1)});closeSheet();toast(`📩 שלחת הזמנה ל־${d.n}. מחכים לתשובה...`)};
function openHireOffer(){const h=HIRE.pending;if(!h)return;PANEL='hire';sheet(`<div class="center"><div style="font-size:56px">🦸</div><h2>${en('A job for you!')}</h2></div>
  <div class="bubble"><b>${esc(h.from)}</b> רוצה את כוח ה${HPOW[h.k].he} ${HPOW[h.k].em} שלך ב${ZNAME[h.zone]||''}, תמורת <b>💎${h.c}</b>.</div>
  <div class="row"><button class="btn" data-a="hireyes">✓ ${en('I am coming!')}</button><button class="btn ghost" data-a="hireno">${en('Not now')}</button></div>`)}
ACTX.hireyes=()=>{const h=HIRE.pending;if(!h)return;HIRE.pending=null;HIRE.job={k:h.k,to:h.fk,zone:h.zone,x:h.x,z:h.z,c:h.c};HIRE.lastK=h.k;emit('hireok',{to:h.fk,from:P.name,hk:P.key,k:h.k,c:h.c});closeSheet();
  toast(`🦸 הולכים ל${ZNAME[h.zone]||''} ומשתמשים ב־${HPOW[h.k].em} ליד ${h.from}`)};
ACTX.hireno=()=>{const h=HIRE.pending;if(h)emit('hireno',{to:h.fk,from:P.name});HIRE.pending=null;closeSheet()};
function hireCheck(){const j=HIRE.job;if(!j||ME.zone!==j.zone)return;const fr=(NET.peers||[]).find(p=>p.presence&&p.presence.k===j.to);let x=j.x,z=j.z;
  if(fr&&fr.presence){const[cx,cz]=ZC[fr.presence.zone]||[0,0];x=cx+(+fr.presence.x||0);z=cz+(+fr.presence.z||0)}
  if(Math.hypot(ME.pos.x-x,ME.pos.z-z)<5){emit('hiredone',{to:j.to,from:P.name});HIRE.job=null;sfx.coin();toast('🦸 עזרת! מחכים לתשלום...');say('Job done!')}}
function openRate(w){PANEL='rate';sheet(`<div class="center"><div style="font-size:56px">⭐</div><h2>${en('Rate your hero')}</h2><p class="sub">שילמת 💎${w.c} ל־${esc(w.hero)}</p></div>
  <div class="row" style="justify-content:center">${[1,2,3,4,5].map(s=>`<button class="btn ghost" data-a="rateh" data-s="${s}" data-to="${esc(w.hk)}">${'⭐'.repeat(s)}</button>`).join('')}</div>`)}
ACTX.rateh=d=>{emit('rate',{to:d.to,s:+d.s});closeSheet();toast('תודה! 🦸')};
/* fly power counts when the hero arrives flying */
