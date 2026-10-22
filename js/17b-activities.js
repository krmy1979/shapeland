/* Shapeland · a world by Shirel Yitzhak */
/* ===================== SALON, MAKEUP, GYM, SCOOTERS, TOOLSHOP ===================== */
const ACTX={};
const NUMW20=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
function hostHead(name,ch,sub){return`<div class="npchead"><div class="face" style="background:var(--soft)">${humanSVG(Object.assign({kind:'human'},ch))}</div><div class="grow"><h2>${en(name)}</h2><p class="sub">${sub||''}</p></div>${gemTag()}</div>`}
const own=k=>(P.ward||[]).includes(k);
if(!Array.isArray(P.makeup))P.makeup=[];if(!Array.isArray(P.rides))P.rides=[];if(!Array.isArray(P.tools))P.tools=[];
ACC.helmet=['hat',15,'⛑️'];if(!CH.hat.some(x=>x[0]==='helmet'))CH.hat.push(['helmet','קסדה','helmet']);

/* ---------- lesson engine: listen, then do ---------- */
let LS=null;
function openLesson(def){PANEL='lesson';LS={def,i:0,ch:Object.assign({},P.ch),wrong:null,done:false};renderLesson();say(def.steps[0].say)}
function renderLesson(){const d=LS.def,st=d.steps[LS.i];
  if(LS.done){sheet(`${d.head}<div class="preview">${humanSVG(LS.ch)}</div><div class="bubble">${en(d.end)}</div>
    <p class="plus" style="font-family:var(--f-display);font-size:18px;margin:0">+${d.reward} 💎</p>${d.keep?d.keep(LS.ch):''}<button class="btn ghost" data-a="close">${en('Thank you!')}</button>`);return}
  sheet(`${d.head}<div class="steps">${d.steps.map((_,i)=>`<i class="${i<LS.i?'ok':i===LS.i?'now':''}"></i>`).join('')}</div>
    <div class="preview small">${humanSVG(LS.ch)}</div>
    <div class="bubble">${en(st.say)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(st.say)}">🔊</button></div>
    <div class="opts">${st.opts.map((o,i)=>`<button class="opt lopt ${LS.wrong===i?'no':''}" data-a="lsopt" data-i="${i}">${o.svg||`<span class="em">${o.em}</span>`}${o.en?`<span class="en" dir="ltr">${esc(o.en)}</span>`:''}</button>`).join('')}</div>
    <button class="btn ghost" data-a="close">${en('Maybe later')}</button>`)}
ACTX.lsopt=d=>{const st=LS.def.steps[LS.i],o=st.opts[+d.i];if(!o.ok){LS.wrong=+d.i;sfx.bad();learnResult('listen',false);say('Hmm, not that one. Listen again! '+st.say);KEEP=true;renderLesson();return}
  learnResult('listen',true,o.word||o.en);if(o.apply)o.apply(LS.ch);sfx.place();LS.wrong=null;LS.i++;KEEP=true;
  if(LS.i>=LS.def.steps.length){LS.done=true;addGems(LS.def.reward,LS.def.log,'Lesson');addXp(15);sfx.win();burst('✨ +'+LS.def.reward+' 💎');renderLesson();say(LS.def.end);return}
  renderLesson();const nx=LS.def.steps[LS.i].say;setTimeout(()=>say(nx),350)};
const shuffleOpts=a=>shuffle(a.slice());

/* ---------- Beauty Salon ---------- */
const LILY={g:'girl',hair:'curly',hc:'#FF7EB6',top:'#EC4899',bot:'skirt',bc:'#FFFFFF'};
function openSalon(){PANEL='salon';sheet(`${hostHead('Lily',LILY,'מספרה · Beauty Salon')}<div class="bubble">${en('Hi! I can teach you to do hair like a real stylist. Or choose a new look!')}</div>
  <div class="opts one"><button class="opt" data-a="hairlesson">💇 ${en('Hair lesson')} <small dir="ltr">+5 💎</small></button><button class="opt" data-a="avatar">✂️ ${en('Change my hairstyle')}</button></div>
  <p class="sub">תסרוקות וצבעי שיער נעולים קונים כאן, בעיצוב הדמות.</p><button class="btn ghost" data-a="close">${en('Bye, Lily!')}</button>`)}
const STYLE_SAY={ponytail:'a ponytail',bun:'a bun',braids:'two braids',pigtails:'pigtails',spiky:'spiky hair',side:'a side part',messy:'messy hair',mohawk:'a mohawk',buzz:'a buzz cut',curlyshort:'short curls'};
function hairLesson(){const girl=P.ch.g==='girl';const thumb=(ch,h)=>humanSVG(Object.assign({},ch,{hair:h}));
  let steps;
  if(girl){const T=pick(['ponytail','bun','braids','pigtails']);const C=pick([['pink','#F472B6'],['purple','#A855F7'],['blue','#3B82F6'],['yellow','#FACC15'],['red','#EF4444']]);
    steps=[{say:'First, brush the hair.',opts:shuffleOpts([{em:'🪮',en:'brush',ok:1},{em:'🥄',en:'spoon'},{em:'🪥',en:'toothbrush'}])},
      {say:`Now make ${STYLE_SAY[T]}.`,opts:shuffleOpts(['ponytail','bun','braids','pigtails'].map(h=>({svg:thumb(P.ch,h),ok:h===T,word:h,apply:c=>c.hair=h})))},
      {say:`Add a ${C[0]} bow.`,opts:shuffleOpts([C,...shuffle([['pink','#F472B6'],['purple','#A855F7'],['blue','#3B82F6'],['yellow','#FACC15'],['red','#EF4444']].filter(x=>x[0]!==C[0])).slice(0,2)].map(x=>({svg:`<span class="dot" style="background:${x[1]}"></span>`,ok:x[0]===C[0],word:x[0],apply:c=>c.hat='bow'})))}]}
  else{const T=pick(['spiky','side','messy','mohawk','buzz']);
    steps=[{say:'First, wash the hair with shampoo.',opts:shuffleOpts([{em:'🧴',en:'shampoo',ok:1},{em:'🍯',en:'honey'},{em:'🥛',en:'milk'}])},
      {say:'Now cut the hair with the scissors.',opts:shuffleOpts([{em:'✂️',en:'scissors',ok:1},{em:'🔨',en:'hammer'},{em:'🍴',en:'fork'}])},
      {say:`Make ${STYLE_SAY[T]}.`,opts:shuffleOpts([T,...shuffle(['spiky','side','messy','mohawk','buzz'].filter(h=>h!==T)).slice(0,3)].map(h=>({svg:thumb(P.ch,h),ok:h===T,word:h,apply:c=>c.hair=h})))}];
    if(!steps[2].opts.some(o=>o.ok))steps[2].opts[0]={svg:thumb(P.ch,T),ok:1,word:T,apply:c=>c.hair=T}}
  openLesson({head:hostHead('Lily',LILY,'שיעור עיצוב שיער'),steps,reward:5,log:'שיעור במספרה',end:'You are a real hair stylist! It looks beautiful!',
    keep:ch=>{const pr=hairPrice(ch.hair),ok=!pr||salonOwned('hair:'+ch.hair);return`<button class="btn" data-a="keephair" data-v="${ch.hair}" data-h="${ch.hat}">${ok?'💇 '+en('Keep this look'):'💇 '+en('Buy & keep')+` <span dir="ltr">💎${pr}</span>`}</button>`}})}
ACTX.hairlesson=()=>hairLesson();
ACTX.keephair=d=>{const pr=hairPrice(d.v);if(pr&&!salonOwned('hair:'+d.v)){if(P.gems<pr){toast(`חסרים ${fmt(pr-P.gems)} 💎`);return}P.gems-=pr;P.salon.push('hair:'+d.v);logm('מספרה: '+HAIRS[d.v][0],'Hair salon',-pr)}
  P.ch.hair=d.v;if(d.h==='bow')P.ch.hat='bow';save();rebuildMe();renderHud();pushPresence(true);closeSheet();burst('💇 ✨');say('Wow! New hair!')};

/* ---------- Makeup Studio ---------- */
const ROSE={g:'girl',hair:'long',hc:'#E8C268',top:'#C026D3',bot:'dress',bc:'#C026D3',lip:'#E11D48',lash:1};
function openMakeup(){PANEL='makeup';const it=[...LIPS.map(([c,n,p])=>({id:'lip:'+c,en:n+' lipstick',sw:c,p})),{id:'lash',en:'mascara',em:'🖌️',p:10},{id:'glit',en:'glitter',em:'✨',p:12}];
  sheet(`${hostHead('Bella Rose',ROSE,'סטודיו איפור · Makeup Studio')}<div class="bubble">${en('Welcome! Do you want a makeup lesson? Or buy something pretty!')}</div>
  <div class="opts one"><button class="opt" data-a="mklesson">💄 ${en('Makeup lesson')} <small dir="ltr">+5 💎</small></button></div>
  <h3>${en('Shop')}</h3><div class="goods">${it.map(x=>{const o=P.makeup.includes(x.id);return`<button class="good ${o?'lock':''}" data-a="buymk" data-v="${x.id}">${x.sw?`<span class="em"><span class="dot" style="background:${x.sw}"></span></span>`:`<span class="em">${x.em}</span>`}${en(x.en)}<span class="pr">${o?'✓ יש לך':'💎 '+x.p}</span></button>`}).join('')}</div>
  <p class="sub">את האיפור שקנית מורחים ב־🎨 עיצוב הדמות.</p><button class="btn ghost" data-a="close">${en('Bye!')}</button>`)}
ACTX.buymk=d=>{if(P.makeup.includes(d.v))return;const p=d.v.startsWith('lip:')?(LIPS.find(x=>'lip:'+x[0]===d.v)||[])[2]:d.v==='lash'?10:12;
  if(P.gems<p){toast(`חסרים ${fmt(p-P.gems)} 💎`);sfx.bad();return}P.gems-=p;P.makeup.push(d.v);logm('סטודיו איפור','Makeup',-p);
  if(d.v.startsWith('lip:'))P.ch.lip=d.v.slice(4);else P.ch[d.v]=1;save();rebuildMe();renderHud();sfx.coin();burst('💄');say('It looks great on you!');KEEP=true;openMakeup()};
function makeupLesson(){const L=pick(LIPS);const pool=[
   {say:`Put on some ${L[1]} lipstick.`,opts:shuffleOpts(LIPS.map(([c,n])=>({svg:`<span class="dot" style="background:${c}"></span>`,ok:n===L[1],word:n,apply:ch=>ch.lip=c})))},
   {say:'Now put mascara on the eyelashes.',opts:shuffleOpts([{em:'🖌️',en:'mascara',ok:1,apply:ch=>ch.lash=1},{em:'🪥',en:'toothbrush'},{em:'🖍️',en:'crayon'}])},
   {say:'Add some glitter on the cheeks.',opts:shuffleOpts([{em:'✨',en:'glitter',ok:1,apply:ch=>ch.glit=1},{em:'🧂',en:'salt'},{em:'❄️',en:'snow'}])},
   {say:'Spray a little perfume.',opts:shuffleOpts([{em:'🌸',en:'perfume',ok:1},{em:'🧯',en:'fire extinguisher'},{em:'💦',en:'water gun'}])}];
  const steps=[pool[0],...shuffle(pool.slice(1)).slice(0,2)];
  openLesson({head:hostHead('Bella Rose',ROSE,'שיעור איפור'),steps,reward:5,log:'שיעור איפור',end:'Beautiful! You are a makeup artist!',
    keep:()=>`<p class="sub">את המוצרים אפשר לקנות כאן בחנות של הסטודיו 💄</p><button class="btn" data-a="makeup">${en('Go to the shop')}</button>`})}
ACTX.mklesson=()=>makeupLesson();ACTX.makeup=()=>openMakeup();

/* ---------- Power Gym ---------- */
const MAX={g:'boy',hair:'buzz',hc:'#1F1B1A',skin:'#C68657',top:'#1E3A8A',bot:'shorts',bc:'#111827'};
let GYM=null;
function openGym(){PANEL='gym';sheet(`${hostHead('Coach Max',MAX,'חדר כושר · Power Gym')}<div class="bubble">${en("Hey champ! Listen to me and do exactly what I say. Ready?")}</div>
  <div class="opts one"><button class="opt" data-a="workout">💪 ${en('Start a workout')}</button></div><p class="sub">כוכבי כוח: ${'💪'.repeat(Math.min(P.badges.strong||0,10))||'עוד אין'}</p><button class="btn ghost" data-a="close">${en('See you, coach!')}</button>`);say('Hey champ! Ready to work out?')}
function newWorkout(){const top=clamp(4+Math.round(P.sk.listen),5,20);const N=rnd(3,top);const E=pick([['push-ups','שכיבות סמיכה','🤸'],['sit-ups','כפיפות בטן','🧘'],['jumping jacks','קפיצות פיסוק','⭐'],['squats','סקוואטים','🏋️']]);
  GYM={N,E,c:0,line:`Do ${NUMW20[N]} ${E[0]}!`};renderGym();say(GYM.line)}
function renderGym(){const g=GYM;sheet(`${hostHead('Coach Max',MAX,'אימון')}<div class="bubble">${en(g.line)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(g.line)}">🔊</button></div>
  <div class="center"><button class="bigtap" data-a="rep">${g.E[2]}<b>${g.c}</b></button></div><p class="sub center">נוגעים כדי לעשות עוד אחת. כשסיימת: Done</p>
  <div class="row"><button class="btn" data-a="repdone">✅ ${en('Done!')}</button><button class="btn ghost" data-a="close">${en('Stop')}</button></div>`)}
ACTX.workout=()=>newWorkout();
ACTX.rep=()=>{GYM.c++;say(NUMW20[GYM.c]||String(GYM.c));blip(400+GYM.c*30,.08,'square',.04);KEEP=true;renderGym()};
ACTX.repdone=()=>{const g=GYM;if(g.c===g.N){learnResult('listen',true,NUMW20[g.N]);const rw=Math.min(12,g.N);P.badges.strong=(P.badges.strong||0)+1;addGems(rw,'אימון בחדר הכושר','Workout');addXp(10);sfx.win();burst('💪 +'+rw+' 💎');
    sheet(`${hostHead('Coach Max',MAX,'')}<div class="bubble">${en(`Great job! ${NUMW20[g.N]} ${g.E[0]}. You are so strong!`)}</div><div class="row"><button class="btn" data-a="workout">${en('Again!')}</button><button class="btn ghost" data-a="close">${en('Bye!')}</button></div>`);say('Great job! You are so strong!')}
  else{learnResult('listen',false);sfx.bad();const msg=`Oops! I said ${NUMW20[g.N]}. You did ${NUMW20[g.c]||g.c}. Let's try again!`;g.c=0;g.line=msg+` Do ${NUMW20[g.N]} ${g.E[0]}!`;KEEP=true;renderGym();say(msg)}};

/* ---------- Scooter Shop ---------- */
const ZACK={g:'boy',hair:'messy',hc:'#C8562A',top:'#0E7490',bot:'pants',bc:'#1D2A48',hat:'cap'};
const RIDES={scooter:['קורקינט','scooter',40,'🛴'],skateboard:['סקייטבורד','skateboard',35,'🛹'],helmet:['קסדה','helmet',15,'⛑️']};
function openRides(){PANEL='rides';sheet(`${hostHead('Zack',ZACK,'חנות קורקינטים · Scooter Shop')}<div class="bubble">${en('A scooter is super fast! Always wear a helmet. Safety first!')}</div>
  <div class="goods">${Object.entries(RIDES).map(([k,[he,e,p,em]])=>{const o=k==='helmet'?own('helmet'):P.rides.includes(k);return`<button class="good ${o?'lock':''}" data-a="buyride" data-v="${k}"><span class="em">${em}</span>${en(e)}<span class="pr">${o?'✓ יש לך':'💎 '+p}</span></button>`}).join('')}</div>
  <p class="sub">אחרי שקונים, מופיע כפתור 🛴 ליד הג׳ויסטיק. נוגעים בו כדי לרכוב ולטוס מהר בכל העיר!</p><button class="btn ghost" data-a="close">${en('Bye, Zack!')}</button>`);say('Want something fast?')}
ACTX.buyride=d=>{const[he,e,p]=RIDES[d.v];if(d.v==='helmet'?own('helmet'):P.rides.includes(d.v))return;if(P.gems<p){toast(`חסרים ${fmt(p-P.gems)} 💎. אפשר להתאמן בחדר הכושר או לעבוד בעיירה`);sfx.bad();return}
  P.gems-=p;logm('חנות קורקינטים: '+he,'Scooter shop',-p);if(d.v==='helmet'){P.ward.push('helmet');P.ch.hat='helmet';rebuildMe()}else{P.rides.push(d.v);P.ride=d.v}save();renderHud();updateRideBtn();sfx.win();burst(RIDES[d.v][3]);say(d.v==='helmet'?'Safety first! Great choice.':'Wow! Let us ride!');KEEP=true;openRides()};
function rideModel(kind){const g=new THREE.Group();(PROPS[kind]||PROPS.scooter)(g);g.scale.setScalar(1.15);return g}
function setRiding(on){P.riding=!!on&&P.rides.length>0;if(P.riding&&!P.rides.includes(P.ride))P.ride=P.rides[0];save();rebuildMe();updateRideBtn();if(P.riding){say(pick(['Let us ride!','Whoosh!','So fast!']));if(P.ch.hat!=='helmet'&&own('helmet'))toast('⛑️ טיפ: לחבוש קסדה בעיצוב הדמות')}}
function updateRideBtn(){let b=$('#bRide');if(!b){const acts=document.querySelector('#pad .acts');if(!acts)return;b=document.createElement('button');b.id='bRide';b.className='act ride';b.setAttribute('aria-label','רכיבה');acts.appendChild(b);
    b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(P.rides.length>1&&P.riding){const i=P.rides.indexOf(P.ride);if(i<P.rides.length-1){P.ride=P.rides[i+1];setRiding(true);return}}setRiding(!P.riding)})}
  b.hidden=!P.rides.length;b.setAttribute('aria-pressed',!!P.riding);b.innerHTML=`${P.riding?RIDES[P.ride][3]:'🛴'}<small>${P.riding?'לרדת':'לרכוב'}</small>`}
const _rebuildMe=rebuildMe;rebuildMe=function(){_rebuildMe();if(P.riding&&P.ride&&ME.obj){const m=rideModel(P.ride);ME.obj.add(m);ME.obj.userData.riding=true;const L=ME.obj.userData.limbs;if(L)L.rig.position.y=.85+.14}};

/* ---------- Tools Workshop ---------- */
const FIX={g:'boy',hair:'short',hc:'#4A2E1F',skin:'#E3A97F',top:'#1D4ED8',bot:'pants',bc:'#334155',hat:'cap'};
const TOOLSHOP={hammer:['פטיש','hammer',8,'🔨'],saw:['מסור','saw',10,'🪚'],wrench:['מפתח ברגים','wrench',8,'🔧'],screwdriver:['מברג','screwdriver',8,'🪛'],toolbox:['ארגז כלים','toolbox',12,'🧰']};
const JOBS=[['hammer','This nail is sticking out.','Bring me the hammer!'],['saw','This board is too long. I need to cut it.','Bring me the saw!'],['wrench','The pipe is loose. I need to turn this bolt.','Bring me the wrench!'],
  ['screwdriver','The door handle has a loose screw.','Bring me the screwdriver!'],['hammer','The fence fell down. I need to hit the nails back in.','Bring me the hammer!'],['saw','The tree branch is in the way. I need to cut it.','Bring me the saw!']];
let FJ=null;
function openTools(){PANEL='tools';sheet(`${hostHead('Mr. Fix',FIX,'סדנת כלים · Tools Workshop')}<div class="bubble">${en('Hello! I fix things all over Ashkelon. Do you want to be my helper today?')}</div>
  <div class="opts one"><button class="opt" data-a="fixjob">🛠️ ${en('Help Mr. Fix')} <small dir="ltr">+3 💎</small></button></div>
  <h3>${en('Buy your own tools')}</h3><div class="goods">${Object.entries(TOOLSHOP).map(([k,[he,e,p,em]])=>{const o=P.tools.includes(k);return`<button class="good ${o?'lock':''}" data-a="buytool" data-v="${k}"><span class="em">${em}</span>${en(e)}<span class="pr">${o?'✓ יש לך':'💎 '+p}</span></button>`}).join('')}</div>
  <p class="sub">מי שמביא כלי משלו מקבל בונוס בעבודה 🧰</p><button class="btn ghost" data-a="close">${en('Bye, Mr. Fix!')}</button>`);say('Do you want to be my helper?')}
ACTX.buytool=d=>{if(P.tools.includes(d.v))return;const[he,e,p]=TOOLSHOP[d.v];if(P.gems<p){toast(`חסרים ${fmt(p-P.gems)} 💎`);sfx.bad();return}P.gems-=p;P.tools.push(d.v);logm('סדנת כלים: '+he,'Tools',-p);save();renderHud();sfx.coin();burst(TOOLSHOP[d.v][3]);say('Here is your '+e+'!');KEEP=true;openTools()};
function fixJob(){const j=pick(JOBS);const hard=P.sk.listen>=5;const line=hard?j[1]:j[1]+' '+j[2];FJ={j,line,wrong:null,opts:shuffle(['hammer','saw','wrench','screwdriver'])};renderFix();say(line)}
function renderFix(){sheet(`${hostHead('Mr. Fix',FIX,'עוזר/ת של Mr. Fix')}<div class="bubble">${en(FJ.line)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(FJ.line)}">🔊</button></div>
  <div class="opts">${FJ.opts.map(k=>`<button class="opt lopt ${FJ.wrong===k?'no':''}" data-a="fixpick" data-v="${k}"><span class="em">${TOOLSHOP[k][3]}</span><span class="en" dir="ltr">${TOOLSHOP[k][1]}</span></button>`).join('')}</div><button class="btn ghost" data-a="close">${en('Stop')}</button>`)}
ACTX.fixjob=()=>fixJob();
ACTX.fixpick=d=>{if(d.v!==FJ.j[0]){FJ.wrong=d.v;learnResult('listen',false);sfx.bad();say("Hmm, that won't work. Listen again!");KEEP=true;renderFix();return}
  learnResult('listen',true,d.v);const mine=P.tools.includes(d.v);const rw=3+(mine?2:0);addGems(rw,'עבודה עם Mr. Fix','Fix-it job');addXp(8);sfx.win();burst('🛠️ +'+rw+' 💎');
  const msg=mine?`Thank you! You brought your own ${d.v}! Here is a bonus.`:'Thank you! Now it is fixed!';
  sheet(`${hostHead('Mr. Fix',FIX,'')}<div class="bubble">${en(msg)}</div><div class="row"><button class="btn" data-a="fixjob">${en('Next job')}</button><button class="btn ghost" data-a="close">${en('Bye!')}</button></div>`);say(msg)};

/* ---------- avatar panel extras: outfits & makeup ---------- */
const _openAvatar=openAvatar;openAvatar=function(){_openAvatar();const c=P.ch;const box=document.querySelector('#sheet .sheet-in');if(!box)return;const done=box.querySelector('[data-a="avdone"]');
  const ow=Object.entries(OUTFITS).filter(([k])=>own('o:'+k));
  const mk=P.makeup;let h='';
  h+=`<div style="display:flex;flex-direction:column;gap:6px"><h3>בגדים מיוחדים 👔</h3><div class="chips"><button class="ochip" data-a="ch" data-k="outfit" data-v="none" data-t="regular clothes" aria-pressed="${c.outfit==='none'||!c.outfit}">רגיל${en('regular')}</button>${ow.map(([k,[he,e,,em]])=>`<button class="ochip" data-a="ch" data-k="outfit" data-v="${k}" data-t="${e}" aria-pressed="${c.outfit===k}">${em} ${he}${en(e)}</button>`).join('')}</div>${ow.length?'':'<p class="sub">בגדים יפים ליציאה קונים בחנות הבגדים ובבוטיק בגן הבנות</p>'}</div>`;
  const lips=LIPS.filter(([col])=>mk.includes('lip:'+col));
  h+=`<div style="display:flex;flex-direction:column;gap:6px"><h3>איפור 💄</h3>${mk.length?`<div class="chips"><button class="sw" style="background:#F6CBA5" data-a="ch" data-k="lip" data-v="none" data-t="no lipstick" aria-pressed="${c.lip==='none'||!c.lip}" aria-label="בלי שפתון">∅</button>${lips.map(([col,n])=>`<button class="sw" style="background:${col}" data-a="ch" data-k="lip" data-v="${col}" data-t="${n} lipstick" aria-pressed="${c.lip===col}" aria-label="${n}"></button>`).join('')}
    ${mk.includes('lash')?`<button class="ochip" data-a="mktog" data-v="lash" aria-pressed="${!!c.lash}">🖌️${en('mascara')}</button>`:''}${mk.includes('glit')?`<button class="ochip" data-a="mktog" data-v="glit" aria-pressed="${!!c.glit}">✨${en('glitter')}</button>`:''}</div>`:'<p class="sub">איפור קונים ב־Makeup Studio בגן הבנות 🌸</p>'}</div>`;
  if(done)done.insertAdjacentHTML('beforebegin',h)};
ACTX.mktog=d=>{P.ch[d.v]=P.ch[d.v]?0:1;save();KEEP=true;openAvatar();if(!$('#title').hidden)$('#titleAv').innerHTML=charSVG(P.ch)};

/* clothes shop sells things people can wear + going-out outfits */
const _storeItems=storeItems;storeItems=function(store){if(store!=='clothes')return _storeItems(store);
  const acc=['cap','flower','bow','crown','wings'].filter(k=>ACC[k]).map(k=>({id:k,en:(CH[ACC[k][0]].find(x=>x[0]===k)||[])[2]||k,em:ACC[k][2],price:ACC[k][1],own:P.ward.includes(k)}));
  return[...Object.entries(OUTFITS).map(([k,[he,e,p,em]])=>({id:'o:'+k,en:e,em,price:p,own:P.ward.includes('o:'+k)})),...acc]};

updateRideBtn();
