/* Shapeland · a world by Shirel Yitzhak */
/* ===================== FUN UPGRADE: built from research on why kids drop games =====================
   1. Play in one tap: no codes or PINs before the first fun (the kid code moves to "I have a code").
   2. A faster opening: tap to move it along, and it lasts about 7 seconds instead of 10.
   3. Buttons appear step by step: a new player sees few buttons, and each new one opens with a celebration card.
   4. Treasure first, learning by choice: a chest always opens and gives a prize. A question is an optional bonus (x2), and a wrong answer takes nothing away.
   5. Sticker album: 30 stickers in 5 sets, with rarity levels, a flip reveal and a prize for each full set. Tapping a sticker says its name in English.
   6. A daily gift: tap the box 3 times, a streak of days, and a sticker every day.
   7. Smoothness: resolution drops automatically on weak devices. */
const FUN={q:[],busy:false,fps:[],lowered:0};
const funDay=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const funYest=()=>{const d=new Date(Date.now()-864e5);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
(()=>{const st=document.createElement('style');st.textContent=`
/* title: one big play button */
#quickBox{display:flex;flex-direction:column;gap:10px}
#quickBox .bigplay{font-size:30px;padding:18px 10px;border-radius:26px;animation:funPulse 1.6s ease-in-out infinite}
@keyframes funPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
#cloudBox:has(#kidWelcome:not([hidden])) #quickBox,#cloudBox:has(#kidWelcome:not([hidden])) .kidcode>summary{display:none}
#cloudBox:has(#kidWelcome:not([hidden])) .kidcode{display:contents}
details.kidcode{background:#F4F8FF;border-radius:16px;padding:6px 10px}
details.kidcode>summary{cursor:pointer;font-weight:600;color:var(--muted);list-style:none;text-align:center;padding:4px}
details.kidcode>summary::-webkit-details-marker{display:none}
details.kidcode[open]>summary{margin-bottom:8px}
/* step-by-step buttons */
body.lk-build #bar [data-a="mode"]:not([data-v="walk"]){display:none!important}
body.lk-arena #bar [data-a="arena"]{display:none!important}
body.lk-roll #bRoll{display:none!important}
body.lk-cam #camBtns{display:none!important}
body.lk-arm #armBar{display:none!important}
body.lk-journal #questChip .jr{display:none!important}
.funnew{animation:funGlow 1s ease-in-out 6!important}
@keyframes funGlow{0%,100%{box-shadow:0 0 0 0 #FACC15}50%{box-shadow:0 0 0 12px #FACC1566}}
/* album chip */
#albumChip{background:#fff;border:0;border-radius:18px;padding:6px 12px;font:700 16px var(--f-display);color:var(--ink);box-shadow:0 3px 0 #C9DCF3;display:flex;gap:4px;align-items:center}
#albumChip.bump{animation:funBump .5s}
@keyframes funBump{50%{transform:scale(1.25)}}
/* sticker cards */
.funcards{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.stk{position:relative;width:104px;height:138px;border:0;padding:0;background:none;cursor:pointer}
.stk.flip{animation:funFlip .45s ease}
@keyframes funFlip{0%{transform:scaleX(1)}50%{transform:scaleX(0) scale(1.08)}100%{transform:scaleX(1)}}
.stk .f,.stk .b{position:absolute;inset:0;border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
.stk.back .f,.stk:not(.back) .b{display:none}
.stk .b{background:repeating-linear-gradient(45deg,#6366F1 0 10px,#818CF8 10px 20px);color:#fff;font-size:44px;box-shadow:0 5px 0 #4338CA;animation:funWob 1.4s ease-in-out infinite}
.stk.back:hover .b{filter:brightness(1.1)}
.stk .f{background:#fff;border:4px solid #CBD5E1;box-shadow:0 5px 0 #CBD5E1}
.stk .e{font-size:52px;line-height:1}
.stk .n{font:700 15px var(--f-display);direction:ltr;color:var(--ink)}
.stk .h{font-size:12px;color:var(--muted)}
.stk .r{position:absolute;top:6px;font:700 10px var(--f-display);letter-spacing:.5px;padding:1px 7px;border-radius:9px;background:#E2E8F0;color:#475569;direction:ltr}
.stk.rare .f{border-color:#60A5FA;background:linear-gradient(160deg,#fff,#DBEAFE);box-shadow:0 5px 0 #60A5FA}.stk.rare .r{background:#60A5FA;color:#fff}
.stk.epic .f{border-color:#A855F7;background:linear-gradient(160deg,#fff,#F3E8FF);box-shadow:0 5px 0 #A855F7,0 0 18px #C084FC}.stk.epic .r{background:#A855F7;color:#fff}
.stk.legend .f{border-color:#F59E0B;background:linear-gradient(120deg,#FEF3C7,#FFF 40%,#FDE68A 60%,#FEF3C7);background-size:250% 100%;animation:funShine 2s linear infinite;box-shadow:0 5px 0 #F59E0B,0 0 24px #FCD34D}.stk.legend .r{background:#F59E0B;color:#fff}
@keyframes funShine{to{background-position:-250% 0}}
.stk .dup{position:absolute;bottom:-10px;background:#22C55E;color:#fff;border-radius:10px;padding:1px 8px;font:700 12px var(--f-display)}
.stk.new .f::after{content:'NEW';position:absolute;bottom:6px;font:800 11px var(--f-display);color:#E11D48;direction:ltr}
/* album */
.albset{display:flex;flex-direction:column;gap:6px;background:#F8FAFF;border-radius:18px;padding:10px}
.albset h3{margin:0;display:flex;justify-content:space-between;align-items:center}
.albset h3 small{font:600 13px var(--f-body);color:var(--muted)}
.albset.full{background:linear-gradient(135deg,#FEF9C3,#FCE7F3)}
.albgrid{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
.albgrid .stk{width:100%;height:auto;aspect-ratio:3/4}
.albgrid .stk .e{font-size:30px}.albgrid .stk .n{font-size:10px}.albgrid .stk .h,.albgrid .stk .r{display:none}
.albgrid .miss{aspect-ratio:3/4;border-radius:14px;border:3px dashed #CBD5E1;display:flex;align-items:center;justify-content:center;font-size:22px;color:#CBD5E1}
.albbar{height:10px;background:#E2E8F0;border-radius:6px;overflow:hidden}.albbar i{display:block;height:100%;background:linear-gradient(90deg,#F472B6,#FACC15)}
@media (max-width:420px){.albgrid{grid-template-columns:repeat(3,1fr)}}
/* daily gift */
.gift{font-size:110px;line-height:1;border:0;background:none;cursor:pointer;transition:transform .15s}
.gift.t1{transform:rotate(-10deg) scale(1.1)}.gift.t2{transform:rotate(12deg) scale(1.2)}
.gift.wob{animation:funWob 1.2s ease-in-out infinite}
@keyframes funWob{0%,100%{transform:rotate(0)}25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}}
.streak{display:flex;gap:6px;justify-content:center}.streak i{width:26px;height:26px;border-radius:50%;background:#E2E8F0;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:14px}
.streak i.on{background:#FACC15;box-shadow:0 0 8px #FDE68A}
.unlockem{font-size:76px;line-height:1;animation:funBump .8s ease 2}
`;document.head.appendChild(st)})();

/* ---------- 1. play in one tap ---------- */
ACTX.quickplay=()=>{const q=$('#qName');const nm=(q&&q.value.trim())||($('#tName').value.trim())||P.name||'';
  $('#tName').value=nm||('Star '+rnd(1,99));if(window.CLOUD&&CLOUD.on&&!CLOUD.user)$('#tCode').value='solo';act('play',{})};
(()=>{const q=$('#qName');if(q){q.value=P.name||'';q.addEventListener('keydown',e=>{if(e.key==='Enter')ACTX.quickplay()})}})();

/* ---------- 2. a faster opening that a tap moves along ---------- */
ftCinematic=function(){FT.step='cine';FT.cine=1;FT.t=0;const tok=FT.ctok=(FT.ctok||0)+1;
  const beats=[
    ()=>ftCine('הגביש הקסום שמר על האור של ארץ הצורות…','The magic Crystal kept the light of Shapeland…'),
    ()=>{const c=CRYSPOS();FT.cine=2;if(CRYS)CRYS.core.material.emissiveIntensity=1.4;
      ftCine('בום! ⚡ הגביש נשבר והאור עף לכל האי','Boom! The Crystal broke!');fxBurst(c.x,1.4,c.z,'#FDE68A',40,4);fxBurst(c.x,1.4,c.z,'#93C5FD',26,3);ftMakeSparks();try{sfx.bad()}catch(e){}},
    ()=>ftCine('רק את/ה יכול/ה להחזיר את האור! ✨','Only you can bring the light back!'),
    ()=>{FT.cine=0;ftCineOff();if(CRYS)CRYS.core.material.emissiveIntensity=.15;ftSparksStep()}];
  const gaps=[2300,2400,1900];let i=0;
  const next=()=>{if(!FT.on||FT.ctok!==tok||i>=beats.length)return;clearTimeout(FT.ctm);beats[i++]();if(i<beats.length)FT.ctm=setTimeout(next,gaps[i-1])};
  FT.cineNext=next;next();
  let h=$('#ftTap');if(!h){h=document.createElement('div');h.id='ftTap';h.style.cssText='position:fixed;bottom:calc(env(safe-area-inset-bottom) + 14px);left:50%;transform:translateX(-50%);z-index:61;color:#fff;font:600 14px system-ui;opacity:.8;pointer-events:none';h.textContent='👆 נוגעים במסך כדי להמשיך';document.body.appendChild(h)}h.hidden=false};
/* while the opening plays, a tap only moves it along and never reaches the world behind it */
let funCineTapT=0;
const funCineEat=e=>{const live=FT.on&&FT.cine&&FT.cineNext;if(!live&&Date.now()-funCineTapT>500)return false;if(e.target.closest&&e.target.closest('#ftSkip'))return false;e.stopPropagation();e.stopImmediatePropagation();if(e.cancelable)e.preventDefault();return live};
window.addEventListener('pointerdown',e=>{if(funCineEat(e)){funCineTapT=Date.now();FT.cineNext()}},true);
['pointerup','click','mousedown','mouseup','touchstart','touchend'].forEach(t=>window.addEventListener(t,funCineEat,{capture:true,passive:false}));
setInterval(()=>{const h=$('#ftTap');if(h&&(!FT.on||!FT.cine))h.hidden=true},400);

/* ---------- 3. buttons that open step by step ---------- */
const FUN_GATES=[
  {id:'build',lv:2,em:'🧱',he:'בנייה',desc:'בונים מצורות כל מה שרוצים: בית, מגדל, גשר או פסל ענק!',en:'Build!',sel:'#bar [data-a="mode"][data-v="build"]',also:()=>!!P.quest},
  {id:'roll',lv:2,em:'🌀',he:'גלגול',desc:'מתגלגלים מהר ומתחמקים מסכנות. במחשב: המקש Q',en:'Roll!',sel:'#bRoll'},
  {id:'arena',lv:3,em:'🏆',he:'תחרויות',desc:'מירוצים ואתגרים נגד השעון. שוברים שיאים ואוספים גביעים!',en:'Compete!',sel:'#bar [data-a="arena"]'},
  {id:'journal',lv:3,em:'🥚',he:'מסע החוקר',desc:'דרגות חוקר, מפתחות זהב ומקומות סודיים שמחכים לך',en:'Explore!',sel:'#questChip .jr'},
  {id:'cam',lv:3,em:'🎥',he:'כפתורי מצלמה',desc:'מסובבים את העולם ומקרבים אותו. אפשר גם בצביטה או בגלגלת',en:'Look around!',sel:'#camBtns'}];
if(!Array.isArray(P.unl))P.unl=[];
const funGateOpen=g=>P.unl.includes(g.id);
const funGateReady=g=>level()>=g.lv||(g.also&&g.also());
if(!P.unlInit){P.unlInit=1;if(P.ftue||P.xp>0)FUN_GATES.forEach(g=>{if(funGateReady(g)&&!P.unl.includes(g.id))P.unl.push(g.id)});save()}
function funApplyGates(){const inBuildZone=['home','work','visit'].includes(ME.zone)||(ME.zone==='city'&&P.plots&&P.plots.length);
  FUN_GATES.forEach(g=>{let lock=!funGateOpen(g);if(g.id==='build'&&inBuildZone)lock=false;document.body.classList.toggle('lk-'+g.id,lock)});
  const fight=(typeof LG!=='undefined'&&LG.active)||(typeof RAID!=='undefined'&&RAID.raid);document.body.classList.toggle('lk-arm',level()<3&&!fight)}
function funCheckGates(){if(!$('#title').hidden||FT.on)return;FUN_GATES.forEach(g=>{if(!funGateOpen(g)&&funGateReady(g)){P.unl.push(g.id);save();funQueue(()=>funUnlockCard(g))}})}
function funUnlockCard(g){PANEL='fununlock';funApplyGates();try{sfx.win()}catch(e){}
  sheet(`<div class="center"><div class="sub" style="font-weight:700;color:#E11D48">🎉 חדש! נפתח לך</div><div class="unlockem">${g.em}</div><h2>${g.he}</h2><p class="sub" style="font-size:17px">${g.desc}</p>
    <button class="btn" data-a="fundone" style="font-size:22px;width:100%">יאללה! ✨</button></div>`);say(g.en);
  FUN.glow=g.sel}
ACTX.fundone=()=>{closeSheet();if(FUN.glow){const el=document.querySelector(FUN.glow);if(el){el.classList.remove('funnew');void el.offsetWidth;el.classList.add('funnew');setTimeout(()=>el.classList.remove('funnew'),6500)}FUN.glow=null}};

/* a small queue so celebration cards never land on top of each other or on a game in progress */
function funQueue(fn){FUN.q.push(fn)}
function funFree(){return $('#title').hidden&&$('#sheet').hidden&&!FT.on&&!(typeof LG!=='undefined'&&LG.active)&&!(typeof RAID!=='undefined'&&RAID.raid)&&!$('#hudBot').hidden}
setInterval(()=>{try{funApplyGates();funCheckGates();funAlbumChip();if(FUN.q.length&&funFree()){const fn=FUN.q.shift();fn()}}catch(e){console.warn(e)}},700);

/* ---------- 5. sticker album ---------- */
const RAR={c:['common','COMMON',0],r:['rare','RARE',1],e:['epic','EPIC',2],l:['legend','LEGEND',3]};
const ALBUM=[
  {id:'sea',he:'חיות הים',em:'🐬',list:[['turtle','🐢','צב','c'],['fish','🐠','דג','c'],['crab','🦀','סרטן','c'],['octopus','🐙','תמנון','r'],['dolphin','🐬','דולפין','e'],['whale','🐋','לווייתן','l']]},
  {id:'shape',he:'צורות',em:'🔷',list:[['star','⭐','כוכב','c'],['heart','❤️','לב','c'],['moon','🌙','ירח','c'],['diamond','💎','יהלום','r'],['rainbow','🌈','קשת','e'],['crystal','🔮','כדור בדולח','l']]},
  {id:'hero',he:'גיבורים',em:'🦸',list:[['shield','🛡️','מגן','c'],['water','💧','מים','c'],['lightning','⚡','ברק','r'],['fire','🔥','אש','r'],['crown','👑','כתר','e'],['dragon','🐉','דרקון','l']]},
  {id:'city',he:'אשקלון',em:'🏖️',list:[['beach','🏖️','חוף','c'],['ice cream','🍦','גלידה','c'],['boat','⛵','סירה','c'],['bicycle','🚲','אופניים','r'],['ferris wheel','🎡','גלגל ענק','e'],['lighthouse','🗼','מגדלור','l']]},
  {id:'light',he:'עולם האור',em:'✨',list:[['owl','🦉','ינשוף','c'],['basket','🧺','סל','c'],['candle','🕯️','נר','r'],['key','🗝️','מפתח','r'],['magic wand','🪄','שרביט','e'],['unicorn','🦄','חד־קרן','l']]}];
const ALLST=ALBUM.flatMap(s=>s.list.map(([en_,em,he,r])=>({id:en_,en:en_,em,he,r,set:s.id})));
if(!P.album||typeof P.album!=='object')P.album={};
const albumCount=()=>ALLST.filter(s=>P.album[s.id]).length;
function rollSticker(minR){const p=Math.random();let r=p<.02?'l':p<.12?'e':p<.4?'r':'c';const order='crel';if(minR&&order.indexOf(r)<order.indexOf(minR))r=minR;
  const pool=ALLST.filter(s=>s.r===r);const miss=pool.filter(s=>!P.album[s.id]);const s=Math.random()<.65&&miss.length?pick(miss):pick(pool);
  const isNew=!P.album[s.id];P.album[s.id]=(P.album[s.id]||0)+1;let dup=0;if(!isNew){dup=[3,5,10,25][RAR[s.r][2]];addGems(dup,'מדבקה כפולה','Double sticker')}
  const set=ALBUM.find(x=>x.id===s.set);let setDone=false;if(isNew&&set.list.every(([id])=>P.album[id])){setDone=true;P.setsDone=P.setsDone||{};P.setsDone[set.id]=1;addGems(50,'השלמת סט: '+set.he,'Set complete');addXp(30)}
  save();return Object.assign({},s,{isNew,dup,setDone,setHe:set.he})}
function stkHTML(s,i,back){const R=RAR[s.r];return`<button class="stk ${R[0]}${back?' back':''}${s.isNew?' new':''}" data-a="funflip" data-i="${i}" aria-label="${esc(s.en)}">
  <span class="f"><span class="r">${R[1]}</span><span class="e">${s.em}</span><span class="n">${esc(s.en)}</span><span class="h">${esc(s.he)}</span>${s.dup?`<span class="dup">+${s.dup} 💎</span>`:''}</span><span class="b">✨</span></button>`}
/* a pack of face-down cards: the kid flips each one */
function openPack(title,sub,cards,extra){PANEL='funpack';FUN.pack=cards;FUN.packExtra=extra||'';FUN.flipped=new Set();
  sheet(`<div class="center"><h2>${title}</h2>${sub?`<p class="sub" style="font-size:17px">${sub}</p>`:''}<div class="funcards">${cards.map((s,i)=>stkHTML(s,i,true)).join('')}</div>
    <p class="sub" id="packHint">👆 נוגעים בקלף כדי להפוך אותו</p><div id="packEnd" style="display:flex;flex-direction:column;gap:8px;width:100%"></div></div>`)}
ACTX.funflip=d=>{const i=+d.i;if(PANEL==='funalbum'){const s=ALLST.find(x=>x.id===d.v);if(s){say(s.en);const b=document.querySelector(`.albgrid [data-v="${CSS.escape(s.id)}"]`);if(b){b.classList.remove('funnew');void b.offsetWidth;b.classList.add('funnew')}}return}
  if(PANEL!=='funpack'||!FUN.pack||FUN.flipped.has(i))return;FUN.flipped.add(i);const s=FUN.pack[i];const el=document.querySelectorAll('#sheet .stk')[i];if(el){el.classList.add('flip');setTimeout(()=>el.classList.remove('back'),220)}
  try{(RAR[s.r][2]>=2?sfx.win:sfx.coin)()}catch(e){}setTimeout(()=>say(s.en),250);
  if(s.r==='l')setTimeout(()=>burst('🌟 LEGENDARY! 🌟'),400);else if(s.r==='e')setTimeout(()=>burst('💜 EPIC!'),400);
  if(FUN.flipped.size===FUN.pack.length){const h=$('#packHint');if(h)h.hidden=true;const done=FUN.pack.filter(x=>x.setDone);
    $('#packEnd').innerHTML=(done.length?done.map(x=>`<div class="fb ok"><h3>🏆 השלמת את הסט "${esc(x.setHe)}"!</h3><div>+50 💎</div></div>`).join(''):'')+FUN.packExtra+
      `<div class="row" style="gap:8px"><button class="btn ghost" data-a="album">📒 לאלבום (${albumCount()}/${ALLST.length})</button><button class="btn" data-a="fundone">מעולה! ✨</button></div>`;
    if(done.length)setTimeout(()=>{burst('🏆 SET COMPLETE!');say('You completed the set! Amazing!')},900);funAlbumChip(true)}};
function openAlbum(){PANEL='funalbum';const n=albumCount();
  sheet(`<div class="npchead"><div class="face" style="background:#FDE68A">📒</div><div class="grow"><h2>אלבום המדבקות שלי</h2><p class="sub">${n}/${ALLST.length} מדבקות · מסיימים סט ומקבלים 50 💎</p></div></div>
    <div class="albbar"><i style="width:${Math.round(n/ALLST.length*100)}%"></i></div>
    ${ALBUM.map(set=>{const have=set.list.filter(([id])=>P.album[id]).length;const full=have===set.list.length;
      return`<div class="albset${full?' full':''}"><h3><span>${set.em} ${set.he}</span><small>${full?'🏆 הושלם!':have+'/'+set.list.length}</small></h3><div class="albgrid">${set.list.map(([id])=>{const s=ALLST.find(x=>x.id===id);
        return P.album[id]?stkHTML(s,0,false).replace('data-i="0"',`data-v="${esc(id)}"`):`<div class="miss">?</div>`}).join('')}</div></div>`}).join('')}
    <p class="sub">איך משיגים מדבקות? 🧰 תיבות אוצר · 🎁 מתנה יומית · ⬆️ עולים רמה · ⭐ בונוס בחידות. נוגעים במדבקה ושומעים את השם שלה באנגלית</p>
    <button class="btn" data-a="close">סגירה</button>`)}
ACTX.album=()=>openAlbum();
if(!ACTX.close)ACTX.close=()=>closeSheet();
function funAlbumChip(bump){const row=document.querySelector('#hudTop .row');if(!row)return;let b=$('#albumChip');
  if(!b){b=document.createElement('button');b.id='albumChip';b.dataset.a='album';b.setAttribute('aria-label','אלבום המדבקות');row.appendChild(b)}
  const t=`📒 ${albumCount()}/${ALLST.length}`;if(b.textContent!==t)b.textContent=t;if(bump){b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump')}}

/* ---------- 4. treasure first, learning by choice ---------- */
openChest=function(g){if(!g||!g.visible)return;g.visible=false;const p=g.position;fxBurst(p.x,.8,p.z,'#FDE68A',30,4);fxBurst(p.x,.8,p.z,'#F9A8D4',18,3);
  const gems=rnd(6,12);addGems(gems,'תיבת אוצר','Treasure chest');addXp(6);adventure();setTimeout(()=>placeChest(g),90000);
  const s=rollSticker();FUN.bonus=gems;
  openPack('🧰 תיבת אוצר!',`+${gems} 💎 ומדבקה חדשה`,[s],
    `<button class="btn sun" data-a="funbonus" style="font-size:19px">⭐ בונוס: חידה קטנה = עוד ${gems} 💎</button><p class="sub" style="margin:0">לא חובה! גם בלי החידה הפרס כבר שלך</p>`);say('Treasure!')};
ACTX.funbonus=()=>{closeSheet();PANEL='chest';const type=pick(['vocab','listen','vocab','math','spell']);
  openPuzzle({head:`<div class="npchead"><div class="face" style="background:#FDE68A">⭐</div><div class="grow"><h2>בונוס פי 2!</h2><p class="sub">${en('Bonus question!')}</p></div></div>`,q:makeQ(type,P.sk[type]),reward:FUN.bonus||8,
    onDone:ok=>{if(ok){burst('⭐ x2!');if(Math.random()<.35)funQueue(()=>openPack('⭐ מדבקת בונוס!','ענית נכון, אז יש עוד מדבקה',[rollSticker('r')]))}else toast('לא נורא! מה שקיבלת מהתיבה נשאר שלך 💎')}})};

/* level up = a sticker pack */
const _addXpF=addXp;addXp=function(n){const b=level();_addXpF(n);const a=level();if(a>b&&$('#title').hidden){funQueue(()=>openPack(`⬆️ רמה ${a}!`,'חבילת מדבקות לכבוד הרמה החדשה',[rollSticker(),rollSticker(a%3===0?'e':'r')]))}};

/* first pack at the end of the opening */
const _ftEndF=ftEnd;ftEnd=function(skipped){const was=FT.on&&!FT.replay;_ftEndF(skipped);if(was&&!P.firstPack){P.firstPack=1;P.daily=funDay();P.streak=1;save();
  setTimeout(()=>funQueue(()=>openPack('🎁 מתנת פתיחה!','החבילה הראשונה שלך לאלבום המדבקות',[rollSticker(),rollSticker('r'),rollSticker()])),skipped?1500:4500)}};

/* ---------- 6. daily gift ---------- */
function funDailyCheck(){if(!$('#title').hidden||!P.ftue||P.daily===funDay())return;P.streak=P.daily===funYest()?Math.min((P.streak||0)+1,99):1;P.daily=funDay();save();funQueue(openGift)}
function openGift(){PANEL='fungift';FUN.taps=0;const s=P.streak||1;const dots=Array.from({length:7},(_,i)=>`<i class="${i<((s-1)%7)+1?'on':''}">${i===6?'⭐':''}</i>`).join('');
  sheet(`<div class="center"><h2>🎁 המתנה היומית שלך!</h2><p class="sub" style="font-size:17px">${s>1?`יום ${s} ברצף! 🔥 ככל שהרצף ארוך יותר, המתנה גדולה יותר`:'כל יום שנכנסים יש מתנה חדשה'}</p>
    <div class="streak">${dots}</div><button class="gift wob" data-a="funtap" aria-label="לפתוח את המתנה">🎁</button><p class="sub" id="giftHint">👆 נוגעים 3 פעמים כדי לפתוח</p></div>`);say('A gift for you!')}
ACTX.funtap=()=>{const b=$('#sheet .gift');if(!b)return;FUN.taps++;b.classList.remove('wob','t1','t2');try{sfx.pop()}catch(e){}
  if(FUN.taps<3){b.classList.add('t'+FUN.taps);return}
  const s=P.streak||1,seventh=s%7===0;const gems=Math.min(10+s*5,45)+(seventh?30:0);addGems(gems,'מתנה יומית','Daily gift');closeSheet();
  openPack(seventh?'⭐ מתנת שבוע!':'🎁 יש!',`+${gems} 💎`,seventh?[rollSticker('e'),rollSticker()]:[rollSticker()])};
setInterval(()=>{try{funDailyCheck()}catch(e){}},3000);

/* ---------- 7. smoothness on weak devices ---------- */
try{renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5))}catch(e){}
(()=>{let n=0,t0=performance.now();const f=()=>{n++;const t=performance.now();if(t-t0>=2000){const fps=n*1000/(t-t0);n=0;t0=t;
    if(!document.hidden&&$('#title').hidden){FUN.fps.push(fps);if(FUN.fps.length>3)FUN.fps.shift();const avg=FUN.fps.reduce((a,b)=>a+b,0)/FUN.fps.length;
      if(FUN.fps.length===3&&avg<26){if(FUN.lowered===0&&renderer.getPixelRatio()>1){renderer.setPixelRatio(1);FUN.lowered=1;FUN.fps=[]}
        else if(FUN.lowered<=1&&renderer.shadowMap.enabled){renderer.shadowMap.enabled=false;scene.traverse(o=>{if(o.material){[].concat(o.material).forEach(m=>m.needsUpdate=true)}});FUN.lowered=2;FUN.fps=[]}}}}
  requestAnimationFrame(f)};requestAnimationFrame(f)})();
