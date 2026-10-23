/* Shapeland · a world by Shirel Yitzhak */
/* ===================== HOME LIFE: design themes, a real kitchen, cooking, hosting friends, receipts and "my money" =====================
   Home themes recolor walls, floors, the house outside, curtains, the kitchen and the soft furniture together, so the colors always match.
   Food: buy at the Market (or order a delivery), keep it in the fridge, cook recipes in a little action game, eat, or host friends.
   Money: every receipt is kept, and income / expenses are counted by category. */
function ensureHome(){P.dishes=P.dishes||{};P.money=P.money||{in:{},out:{},since:Date.now()};P.receipts=P.receipts||[];P.pantry=P.pantry||{};P.badges=P.badges||{};P.badges.host=P.badges.host||0}
ensureHome();

/* ---------- furniture: a real kitchen and curtains (colors come from the home theme) ---------- */
const DEFPAL={'@K':'#FFFFFF','@T':'#94A3B8','@C':'#F9A8D4','@A':'#2DD4BF','@A2':'#14B8A6','@L':'#99F6E4'};
Object.assign(MODELS.fridge,{lvl:1,themed:1,parts:[['box','@K',0,.95,0,.8,1.9,.72],['box','#1D2A48',0,1.3,.365,.8,.025,.01],['box','@T',.3,1.65,.375,.05,.35,.04],['box','@T',.3,.85,.375,.05,.45,.04],['box','#CBD5E1',0,1.9,0,.82,.02,.74]]});
Object.assign(MODELS.stove,{lvl:1,themed:1,parts:[['box','@K',0,.43,0,.8,.86,.7],['box','#1F2937',0,.88,0,.8,.04,.7],...[[-1,-1],[-1,1],[1,-1],[1,1]].map(([a,b])=>['cylinder','#4B5563',a*.2,.91,b*.16,.22,.02,.22]),['box','#111827',0,.42,.355,.6,.42,.02],['box','@T',0,.7,.36,.5,.04,.03]]});
Object.assign(MODELS,{
  counter:{he:'משטח עבודה',em:'🔪',price:14,lvl:1,themed:1,parts:[['box','@K',0,.43,0,1,.86,.62],['box','@T',0,.88,0,1.04,.05,.66],['box','#1D2A48',0,.45,.315,.01,.7,.01],['box','@T',-.12,.6,.33,.03,.15,.03],['box','@T',.12,.6,.33,.03,.15,.03],['ball','#EF4444',.3,.95,-.1,.16,.12,.16],['ball','#FACC15',.18,.94,-.15,.12,.1,.12]]},
  sink:{he:'כיור',em:'🚰',price:16,lvl:1,themed:1,parts:[['box','@K',0,.43,0,1,.86,.62],['box','@T',0,.88,0,1.04,.05,.66],['box','#CBD5E1',0,.9,0,.6,.03,.4],['box','#7DD3FC',0,.905,0,.5,.01,.3,0,.7],['cylinder','#94A3B8',0,1.05,-.22,.05,.3,.05],['box','#94A3B8',0,1.18,-.14,.05,.04,.18]]},
  cupboard:{he:'ארון מטבח',em:'🗄️',price:12,lvl:1,themed:1,parts:[['box','@K',0,1.75,0,1,.7,.4],['box','#1D2A48',0,1.75,.205,.01,.66,.01],['box','@T',-.1,1.62,.21,.03,.14,.03],['box','@T',.1,1.62,.21,.03,.14,.03]]},
  curtains:{he:'חלון עם וילונות',em:'🪟',price:10,lvl:1,themed:1,parts:[['box','#BAE6FD',0,1.45,0,1.1,.9,.04,0,.75],['box','#FFFFFF',0,1.45,.01,.06,.9,.05],['box','#FFFFFF',0,1.45,.01,1.1,.05,.05],['cylinder','@T',0,2.02,.06,.04,1.5,.04],
    ['box','@C',-.62,1.4,.08,.3,1.2,.06],['box','@C',.62,1.4,.08,.3,1.2,.06],['box','@L',-.62,1.25,.12,.32,.06,.04],['box','@L',.62,1.25,.12,.32,.06,.04]]},
  dining:{he:'פינת אוכל',em:'🍽️',price:26,lvl:1,themed:1,parts:[['box','#A47148',0,.72,0,1.4,.08,.9],['box','@L',0,.765,0,1.2,.01,.7],...[[-1,-1],[-1,1],[1,-1],[1,1]].map(([a,b])=>['cylinder','#7C4A2D',a*.6,.35,b*.36,.1,.7,.1]),
    ...[[-.4,-.75],[.4,-.75],[-.4,.75],[.4,.75]].flatMap(([x,z])=>[['box','@A',x,.45,z,.42,.07,.42],['box','@A',x,.72,z+(z>0?.2:-.2),.42,.5,.06]])]}});
MODELS.curtains.parts=MODELS.curtains.parts.map(q=>{const r=q.slice();r[1]=r[1];return r});
const KITCHEN=['fridge','stove','counter','sink','cupboard'];
/* existing furniture follows the theme too */
const RECOL={sofa:{'#2DD4BF':'@A','#14B8A6':'@A2','#99F6E4':'@L'},bed:{'#F9A8D4':'@A'},rug:{'#F472B6':'@A','#FBCFE8':'@L'},lamp:{}};
const HTHEMES={
  beach:{he:'חוף ים',en:'Beach house',em:'🏖️',wall:'#E0F2FE',floor:'#F5E6C8',kfloor:'#FFFFFF',ext:'#BAE6FD',pal:{'@K':'#FFFFFF','@T':'#38BDF8','@C':'#7DD3FC','@A':'#0EA5E9','@A2':'#0284C7','@L':'#E0F2FE'}},
  candy:{he:'ורוד מתוק',en:'Candy pink',em:'🍬',wall:'#FCE7F3',floor:'#FFF1F2',kfloor:'#FDF2F8',ext:'#FBCFE8',pal:{'@K':'#FBCFE8','@T':'#FFFFFF','@C':'#F472B6','@A':'#EC4899','@A2':'#DB2777','@L':'#FDF2F8'}},
  modern:{he:'מודרני',en:'Modern',em:'🖤',wall:'#F3F4F6',floor:'#9CA3AF',kfloor:'#E5E7EB',ext:'#E5E7EB',pal:{'@K':'#374151','@T':'#D1D5DB','@C':'#6B7280','@A':'#1F2937','@A2':'#111827','@L':'#E5E7EB'}},
  forest:{he:'בית ביער',en:'Forest cabin',em:'🌲',wall:'#ECFCCB',floor:'#A16207',kfloor:'#FEF3C7',ext:'#D9F99D',pal:{'@K':'#FEF3C7','@T':'#A16207','@C':'#65A30D','@A':'#15803D','@A2':'#166534','@L':'#DCFCE7'}},
  sunset:{he:'שקיעה',en:'Sunset',em:'🌅',wall:'#FFEDD5',floor:'#D6B98C',kfloor:'#FFF7ED',ext:'#FED7AA',pal:{'@K':'#FDBA74','@T':'#FFFFFF','@C':'#FB923C','@A':'#EA580C','@A2':'#C2410C','@L':'#FFEDD5'}},
  royal:{he:'ארמון',en:'Palace',em:'👑',wall:'#EDE9FE',floor:'#E7E5E4',kfloor:'#F5F3FF',ext:'#DDD6FE',pal:{'@K':'#FFFFFF','@T':'#FACC15','@C':'#7C3AED','@A':'#6D28D9','@A2':'#5B21B6','@L':'#EDE9FE'}}};
let HCTX=null;
const _itemModelH=itemModel;itemModel=function(id,defs){const M=MODELS[id];const th=HTHEMES[HCTX];
  if(M&&(M.themed||(th&&RECOL[id]))){const pal=th?th.pal:DEFPAL,rc=th?(RECOL[id]||{}):{};return partsModel(M.parts.map(q=>{let c=rc[q[1]]||q[1];if(typeof c==='string'&&c[0]==='@')c=pal[c]||DEFPAL[c];if(c===q[1])return q;const r=q.slice();r[1]=c;return r}))}
  return _itemModelH(id,defs)};
const _addPieceH=addPieceObj;addPieceObj=function(p,scope,zone,defs){const prev=HCTX;HCTX=zone==='home'?P.house.theme:zone==='visit'?(VISIT&&VISIT.house&&VISIT.house.theme):null;try{return _addPieceH(p,scope,zone,defs)}finally{HCTX=prev}};
/* visitors see the theme too */
const _houseDataH=houseData;houseData=function(){const d=_houseDataH();if(P.house.theme)d.th=P.house.theme;return d};
const _cleanHouseH=cleanHouse;cleanHouse=function(o){const r=_cleanHouseH(o);if(r&&o&&HTHEMES[o.th]){const T=HTHEMES[o.th];r.house.theme=o.th;const ok=[T.wall,T.floor,T.kfloor];
  if(o.s&&typeof o.s==='object')Object.entries(o.s).forEach(([k,v])=>{if(ROOMS[k]&&v){r.house.styles[k]=r.house.styles[k]||{};if(ok.includes(v.wall))r.house.styles[k].wall=v.wall;if(ok.includes(v.floor))r.house.styles[k].floor=v.floor}})}return r};
function redrawHome(){clearScope('H');P.house.pieces.forEach(p=>addPieceObj(p,'H','home',P.furn))}
function applyTheme(k){const T=HTHEMES[k];P.house.styles={};if(T){P.house.theme=k;Object.keys(ROOMS).forEach(r=>P.house.styles[r]={wall:T.wall,floor:r==='kitchen'||r==='bathroom'?T.kfloor:T.floor});P.house.color=T.ext}
  else{P.house.theme=null;P.house.color='#FDE68A'}houseChanged();redrawHome();if(typeof renderExteriors==='function')renderExteriors();pushPresence(true);
  sfx.win();if(T){say(`${T.en}! It looks beautiful.`);burst(T.em+' '+T.he)}openDesign()}

/* ---------- the home menu ---------- */
const _renderBarH=renderBar;renderBar=function(){_renderBarH();if(ME.zone!=='home')return;const b=$('#bar');if(!b||b.querySelector('[data-a="homemenu"]'))return;
  b.insertAdjacentHTML('afterbegin','<button class="tool hm" data-a="homemenu"><span>🏡</span>הבית שלי</button>')};
ACTX.homemenu=()=>openHomeMenu();
function openHomeMenu(){ensureHome();PANEL='homemenu';const n=Object.values(P.pantry).reduce((a,b)=>a+b,0)+Object.values(P.dishes).reduce((a,b)=>a+b,0);
  sheet(`<h2>🏡 ${en('My home')} · הבית שלי</h2>
  <div class="mapgrid">
    <button data-a="hdesign" style="background:#FCE7F3"><span class="ic">🎨</span>עיצוב הבית<small>צבעים שמתאימים</small></button>
    <button data-a="fridge" style="background:#E0F2FE"><span class="ic">🧊</span>המקרר<small>${n?n+' דברים בפנים':'ריק'}</small></button>
    <button data-a="cookbook" style="background:#FEF3C7"><span class="ic">🍳</span>מבשלים<small>מתכונים</small></button>
    <button data-a="host" style="background:#DCFCE7"><span class="ic">🎉</span>מארחים<small>חברים ואורחים</small></button>
    <button data-a="money" style="background:#EDE9FE"><span class="ic">💰</span>הכסף שלי<small>הכנסות, הוצאות, קבלות</small></button>
    <button data-a="store" data-v="furniture" style="background:#FFEDD5"><span class="ic">🛋️</span>חנות רהיטים<small>מטבח, וילונות ועוד</small></button>
  </div><button class="btn ghost" data-a="close">סגירה</button>`)}

/* ---------- design ---------- */
ACTX.hdesign=()=>openDesign();ACTX.hpaint=()=>{closeSheet();setMode('room');toast('🖌️ בוחרים חדר וצבע במגש למטה')};ACTX.htheme=d=>applyTheme(d.v);
function openDesign(){PANEL='design';const cur=P.house.theme;
  const card=(k,T)=>`<button class="thm ${cur===k?'on':''}" data-a="htheme" data-v="${k}"><span class="prev" style="background:linear-gradient(${T.wall} 0 62%,${T.floor} 62%)"><i style="background:${T.pal['@C']}"></i><i style="background:${T.pal['@C']}"></i><b style="background:${T.pal['@K']};border-color:${T.pal['@T']}"></b><u style="background:${T.pal['@A']}"></u></span>
    <span class="nm">${T.em} ${T.he}</span>${en(T.en)}<span class="sw">${[T.wall,T.floor,T.pal['@C'],T.pal['@K'],T.pal['@A']].map(c=>`<i style="background:${c}"></i>`).join('')}</span></button>`;
  sheet(`<h2>🎨 עיצוב הבית · ${en('Home design')}</h2>
  <p class="sub">בוחרים סגנון אחד, והכול מתאים: קירות, רצפה, וילונות, מטבח, ספה ומיטה, וגם הבית מבחוץ. כלל של מעצבים: צבע אחד חזק ושני צבעים רגועים.</p>
  <div class="thms">${Object.entries(HTHEMES).map(([k,T])=>card(k,T)).join('')}</div>
  <div class="row"><button class="btn ghost mini" data-a="htheme" data-v="">↩️ הצבעים הרגילים</button><button class="btn ghost mini" data-a="hpaint">🖌️ לצבוע חדר לבד</button><button class="btn ghost mini" data-a="store" data-v="furniture">🛋️ לקנות וילונות ומטבח</button></div>
  <button class="btn ghost" data-a="homemenu">חזרה</button>`)}

/* ---------- food: more groceries, drinks, recipes ---------- */
[['juice','מיץ','🧃',2],['water','מים','💧',1],['lemonade','לימונדה','🍋',2],['cocoa','אבקת שוקו','🍫',2],['flour','קמח','🌾',1],['pasta','פסטה','🍝',2],['ice cream','גלידה','🍦',3]].forEach(([en,he,em,price])=>{if(!GOODS.some(g=>g.en===en))GOODS.push({en,he,em,tr:1,price})});
const DRINKS=['juice','water','lemonade','milk'];const READY=['pizza','cake','soup','salad'];
const RECIPES={
  salad:{em:'🥗',he:'סלט ירקות',need:{tomato:1,cucumber:1,carrot:1},serves:4,steps:['Wash','Chop','Mix']},
  sandwich:{em:'🥪',he:'כריך',need:{bread:1,cheese:1,tomato:1},serves:2,steps:['Slice','Fill','Close']},
  omelette:{em:'🍳',he:'חביתה',need:{egg:2,cheese:1},serves:2,steps:['Crack','Whisk','Flip']},
  pancakes:{em:'🥞',he:'פנקייקים',need:{egg:1,milk:1,flour:1},serves:4,steps:['Mix','Pour','Flip']},
  'fruit salad':{em:'🍧',he:'סלט פירות',need:{apple:1,banana:1,orange:1,grapes:1},serves:4,steps:['Peel','Cut','Mix']},
  pasta:{em:'🍝',he:'פסטה ברוטב',need:{pasta:1,tomato:2,cheese:1},serves:4,steps:['Boil','Stir','Serve']},
  'chicken and rice':{em:'🍗',he:'עוף ואורז',need:{chicken:1,rice:1,carrot:1},serves:4,steps:['Wash','Cook','Serve']},
  milkshake:{em:'🥤',he:'מילקשייק',need:{milk:1,'ice cream':1,banana:1},serves:2,steps:['Pour','Blend','Serve']},
  'hot cocoa':{em:'☕',he:'שוקו חם',need:{milk:1,cocoa:1},serves:2,steps:['Heat','Stir','Pour']},
  'honey cake':{em:'🍰',he:'עוגת דבש',need:{egg:2,flour:2,honey:1,milk:1},serves:8,steps:['Mix','Bake','Slice']}};
const gOf=k=>GOODS.find(g=>g.en===k)||{en:k,he:k,em:'🍽️',price:2};
const foodEm=k=>RECIPES[k]?RECIPES[k].em:gOf(k).em;const foodHe=k=>RECIPES[k]?RECIPES[k].he:gOf(k).he;
const isDrink=k=>DRINKS.includes(k)||k==='milkshake'||k==='hot cocoa';
const recipeCost=r=>Object.entries(r.need).reduce((s,[k,q])=>s+gOf(k).price*q,0);
const qty=(n,w)=>`${n} ${n===1?w:(w==='cheese'||w==='flour'||w==='milk'||w==='honey'||w==='rice'||w==='pasta'||w==='cocoa'||w==='ice cream'?w:w==='tomato'?'tomatoes':w==='grapes'?w:w+'s')}`;
/* what you can eat or drink: cooked dishes + ready food and drinks from the market */
function edibles(){ensureHome();const out=[];Object.entries(P.dishes).forEach(([k,n])=>{if(n>0)out.push({k,n,src:'d'})});
  Object.entries(P.pantry).forEach(([k,n])=>{if(n>0&&(READY.includes(k)||DRINKS.includes(k)||k==='ice cream'||k==='cake'||k==='apple'||k==='banana'||k==='orange'||k==='grapes'))out.push({k,n,src:'p'})});return out}
function takeOne(k,src){const S=src==='d'?P.dishes:P.pantry;if(!(S[k]>0))return false;S[k]--;if(!S[k])delete S[k];save();return true}

/* ---------- the fridge ---------- */
ACTX.fridge=()=>openFridge();
function openFridge(){ensureHome();PANEL='fridge';const ing=Object.entries(P.pantry).filter(([k,n])=>n>0);const ed=edibles();
  const tile=(k,n,act,src)=>`<button class="good" ${act?`data-a="${act}" data-v="${esc(k)}" data-s="${src||''}"`:'disabled'}><span class="q">${n}</span><span class="em">${foodEm(k)}</span>${en(k)}${act?'<span class="pr">😋 לאכול</span>':''}</button>`;
  sheet(`<div class="npchead"><div class="face" style="background:#E0F2FE">🧊</div><div class="grow"><h2>${en('My fridge')}</h2><p class="sub">המקרר שלי</p></div>${gemTag()}</div>
  ${ed.length?`<h3>😋 מוכן לאכול ולשתות</h3><div class="goods">${ed.map(e=>tile(e.k,e.n,'eat',e.src)).join('')}</div>`:''}
  ${ing.length?`<h3>🥕 מצרכים לבישול</h3><div class="goods">${ing.filter(([k])=>!ed.some(e=>e.k===k&&e.src==='p')).map(([k,n])=>tile(k,n)).join('')}</div>`:''}
  ${!ed.length&&!ing.length?`<div class="bubble">${en('The fridge is empty!')}</div><p class="sub">קונים אוכל במכולת (Market) בעיירה, או מזמינים משלוח הביתה 🛵</p>`:''}
  <div class="row"><button class="btn sun" data-a="cookbook">🍳 לבשל</button><button class="btn" data-a="host">🎉 לארח</button><button class="btn ghost" data-a="deliver">🛵 משלוח מהמכולת</button></div>
  <button class="btn ghost" data-a="homemenu">חזרה</button>`);say('My fridge')}
ACTX.eat=d=>{const k=d.v;if(!takeOne(k,d.s))return;if(typeof PW!=='undefined')PW.e=PW.max;floatText(`😋 ${foodEm(k)}`);sfx.pop();
  say(isDrink(k)?`Mmm, ${k}! So refreshing!`:`Yummy ${k}! I'm full of energy!`);toast(`${foodEm(k)} ${foodHe(k)} · ⚡ האנרגיה מלאה`);addXp(2);openFridge()};
/* delivery: the same market, at home, with a small delivery fee (a real-life lesson) */
ACTX.deliver=()=>{CART={store:'market',items:{},delivery:1};openStore('market');toast('🛵 משלוח הביתה: דמי משלוח 2 💎 על כל הזמנה')};

/* ---------- cooking: recipe card → a quick action game ---------- */
ACTX.cookbook=()=>openCookbook();
function haveAll(r){return Object.entries(r.need).every(([k,q])=>(P.pantry[k]||0)>=q)}
function openCookbook(){ensureHome();PANEL='cookbook';
  sheet(`<div class="npchead"><div class="face" style="background:#FEF3C7">🍳</div><div class="grow"><h2>${en('Cookbook')}</h2><p class="sub">ספר המתכונים</p></div>${gemTag()}</div>
  <div class="recipes">${Object.entries(RECIPES).map(([k,r])=>{const ok=haveAll(r);const c=recipeCost(r);
    return`<button class="rcp ${ok?'ok':''}" data-a="cookopen" data-v="${esc(k)}"><span class="em">${r.em}</span><b>${en(k)}</b><span class="he">${r.he}</span>
      <span class="need">${Object.entries(r.need).map(([g,q])=>`<i class="${(P.pantry[g]||0)>=q?'y':'n'}">${gOf(g).em}${q>1?'×'+q:''}</i>`).join('')}</span>
      <span class="sub">${r.serves} מנות · עלות 💎${c}</span>${ok?'<span class="go">✓ אפשר לבשל!</span>':''}</button>`}).join('')}</div>
  <button class="btn ghost" data-a="fridge">🧊 למקרר</button>`)}
ACTX.cookopen=d=>openRecipe(d.v);
function openRecipe(k){const r=RECIPES[k];if(!r)return;PANEL='recipe';const ok=haveAll(r);const c=recipeCost(r);const per=c/r.serves;
  const list=Object.entries(r.need).map(([g,q])=>`<li><span>${gOf(g).em} ${en(qty(q,g))}</span><b class="${(P.pantry[g]||0)>=q?'plus':'minus'}">${(P.pantry[g]||0)>=q?'✓ יש':'חסר '+(q-(P.pantry[g]||0))}</b></li>`).join('');
  sheet(`<h2>${r.em} ${en(k)} · ${r.he}</h2><div class="bubble">${en('You need:')}</div><ul class="list">${list}</ul>
  <p class="sub">🧮 המצרכים עולים 💎${c}, ויוצאות ${r.serves} מנות. כל מנה עולה בערך ${c} ÷ ${r.serves} = 💎${Number.isInteger(per)?per:per.toFixed(1)}</p>
  <div class="row">${ok?`<button class="btn sun" data-a="cookgo" data-v="${esc(k)}">${en("Let's cook!")} 👩‍🍳</button>`:`<button class="btn" data-a="deliver">🛵 להזמין את מה שחסר</button>`}<button class="btn ghost" data-a="cookbook">חזרה</button></div>`);say(`${k}. You need: `+Object.entries(r.need).map(([g,q])=>qty(q,g)).join(', '))}
const CK={k:null,step:0,stars:0,pos:0,dir:1,zone:[40,24],iv:null,speed:1};
ACTX.cookgo=d=>{const r=RECIPES[d.v];if(!r||!haveAll(r))return;Object.entries(r.need).forEach(([g,q])=>{P.pantry[g]-=q;if(P.pantry[g]<=0)delete P.pantry[g]});save();
  Object.assign(CK,{k:d.v,step:0,stars:0,pos:0,dir:1,speed:1});cookRound()};
function cookRound(){const r=RECIPES[CK.k];const w=Math.max(14,26-CK.step*5);CK.zone=[10+Math.random()*(80-w),w];PANEL='cooking';
  sheet(`<h2>${r.em} ${en(r.steps[CK.step]+'!')}</h2><p class="sub">שלב ${CK.step+1} מתוך 3 · לוחצים כשהסמן בתוך האזור הירוק</p>
  <div class="cookbar"><i style="left:${CK.zone[0]}%;width:${CK.zone[1]}%"></i><b id="ckN"></b></div>
  <div class="ckstars">${[0,1,2].map(i=>i<CK.stars?'⭐':'☆').join('')}</div>
  <button class="btn sun big" data-a="cktap">${{Wash:'💦',Chop:'🔪',Mix:'🥄',Slice:'🔪',Fill:'🧀',Close:'🥪',Crack:'🥚',Whisk:'🥄',Flip:'🍳',Pour:'🫗',Peel:'🍌',Cut:'🔪',Boil:'♨️',Stir:'🥄',Serve:'🍽️',Cook:'🔥',Blend:'🌀',Heat:'🔥',Bake:'🔥'}[r.steps[CK.step]]||'👩‍🍳'} ${en(r.steps[CK.step])}!</button>`);
  say(r.steps[CK.step]+'!');clearInterval(CK.iv);let last=performance.now();
  CK.iv=setInterval(()=>{if(PANEL!=='cooking'){clearInterval(CK.iv);return}const now=performance.now(),dt=(now-last)/1000;last=now;CK.pos+=CK.dir*dt*(70+CK.step*25);if(CK.pos>100){CK.pos=100;CK.dir=-1}if(CK.pos<0){CK.pos=0;CK.dir=1}
    const n=$('#ckN');if(n)n.style.left=CK.pos+'%'},16)}
ACTX.cktap=()=>{if(PANEL!=='cooking')return;clearInterval(CK.iv);const hit=CK.pos>=CK.zone[0]&&CK.pos<=CK.zone[0]+CK.zone[1];
  if(hit){CK.stars++;sfx.coin();floatText('⭐ Perfect!')}else{sfx.bad();floatText('Oops!','#FCA5A5')}if(AU.on)tone(hit?880:220,.1,'triangle',.08);
  CK.step++;if(CK.step<3)setTimeout(cookRound,hit?350:550);else setTimeout(cookDone,450)};
function cookDone(){const k=CK.k,r=RECIPES[k];ensureHome();P.dishes[k]=(P.dishes[k]||0)+r.serves;P.cookStars=(P.cookStars||0)+CK.stars;P.lastStars=CK.stars;addXp(8+CK.stars*3);learnResult('vocab',true);save();PANEL='cooked';
  const msg=['It is a little burnt… but still yummy!','Good job, chef!','Great cooking!','Perfect! You are a master chef!'][CK.stars];sfx.win();burst(r.em+' '+'⭐'.repeat(CK.stars||0));say(msg);
  sheet(`<h2>${r.em} ${en(k)} ${'⭐'.repeat(CK.stars)}</h2><div class="bubble">${en(msg)}</div><p class="sub">נוספו למקרר ${r.serves} מנות של ${r.he}. אפשר לאכול, לשמור, או לארח חברים 🎉</p>
  <div class="row"><button class="btn sun" data-a="host">🎉 לארח</button><button class="btn" data-a="fridge">🧊 למקרר</button><button class="btn ghost" data-a="close">סגירה</button></div>`)}

/* ---------- hosting: real friends in your house, or a dinner guest who pays (a little home restaurant) ---------- */
ACTX.host=()=>openHost();
const GUESTS=[['Bella','👧'],['Leo','👦'],['Mia','👩'],['Dan','🕵️'],['Captain Shell','🧑‍✈️'],['Mrs. Kim','👵']];
function openHost(){ensureHome();PANEL='host';const ed=edibles();const fr=[...VISITORS].map(p=>nameOf(NET.peers.find(x=>x.peer===p))).filter(Boolean);
  const inHome=ME.zone==='home';
  sheet(`<div class="npchead"><div class="face" style="background:#DCFCE7">🎉</div><div class="grow"><h2>${en('Party time!')}</h2><p class="sub">מארחים בבית</p></div>${gemTag()}</div>
  ${fr.length?`<h3>👫 החברים אצלך: ${fr.map(esc).join(', ')}</h3><p class="sub">מגישים לכולם. צריך מנה לכל חבר/ה: ${fr.length} ${fr.length===1?'מנה':'מנות'}.</p>
    <div class="goods">${ed.length?ed.map(e=>`<button class="good" data-a="hserve" data-v="${esc(e.k)}" data-s="${e.src}"><span class="q">${e.n}</span><span class="em">${foodEm(e.k)}</span>${en(e.k)}<span class="pr">🍽️ להגיש</span></button>`).join(''):'<p class="sub">המקרר ריק. מבשלים או קונים משהו קודם 🙂</p>'}</div>`
   :`<p class="sub">${inHome?'אין עדיין חברים בבית. מזמינים חבר/ה מהקבוצה לבית (👫 חברים → 🏠 הזמנה), ואז מגישים להם אוכל ושתייה.':'מארחים כשנמצאים בבית שלך 🏡'}</p>`}
  <h3>🍽️ אורח/ת לארוחה (מסעדה ביתית)</h3><p class="sub">אורח מזמין באנגלית, מגישים בדיוק את מה שביקש, והוא משלם. בסוף רואים כמה הרווחת אחרי מה שהמצרכים עלו.</p>
  <div class="row"><button class="btn sun" data-a="guest" ${ed.length?'':'disabled'}>🔔 להזמין אורח/ת</button><button class="btn ghost" data-a="cookbook">🍳 לבשל</button></div>
  <p class="sub">⭐ ארוחות שאירחת: ${P.badges.host}</p><button class="btn ghost" data-a="homemenu">חזרה</button>`)}
ACTX.hserve=d=>{const n=Math.max(1,VISITORS.size);const S=d.s==='d'?P.dishes:P.pantry;if((S[d.v]||0)<n){toast(`צריך ${n} מנות של ${foodHe(d.v)}, ויש רק ${S[d.v]||0}. מבשלים עוד או מגישים משהו אחר`);sfx.bad();return}
  for(let i=0;i<n;i++)takeOne(d.v,d.s);emit('serve',{h:P.key,from:P.name||'',k:d.v,em:foodEm(d.v),he:foodHe(d.v)});P.badges.host++;addXp(5*n);save();
  sfx.win();burst(`🍽️ ${foodEm(d.v)} × ${n}`);say(isDrink(d.v)?'Cheers, everyone!':'Enjoy your meal, everyone!');if(ME.obj)fxBurst(ME.pos.x,ME.y+1.4,ME.pos.z,'#F472B6',14,1.6);openHost()};
/* a dinner guest orders in English; serve the right food and drink, get paid, see the profit */
const GU={g:null,food:null,drink:null,pickF:null,pickD:null};
ACTX.guest=()=>{const ed=edibles();const foods=ed.filter(e=>!isDrink(e.k)),drinks=ed.filter(e=>isDrink(e.k));if(!ed.length){toast('אין מה להגיש. מבשלים קודם 🍳');return}
  const g=pick(GUESTS);GU.g=g;GU.food=foods.length?pick(foods).k:null;GU.drink=drinks.length?pick(drinks).k:null;if(!GU.food&&!GU.drink)return;GU.pickF=GU.pickD=null;
  const mix=(have,pool,ans)=>{const a=[...new Set(have.map(e=>e.k))];pool.filter(k=>!a.includes(k)).sort(()=>Math.random()-.5).forEach(k=>{if(a.length<4)a.push(k)});return a.sort(()=>Math.random()-.5).map(k=>({k}))};
  GU.fo=GU.food?mix(foods,[...Object.keys(RECIPES).filter(k=>!isDrink(k)),...READY]):[];GU.dro=GU.drink?mix(drinks,[...DRINKS,'milkshake','hot cocoa']):[];renderGuest(true)};
function renderGuest(first){const g=GU.g;const ed=edibles();const art=k=>/s$/.test(k)||['pasta','soup','chicken and rice','rice','cake'].includes(k)?'some '+k:(/^[aeiou]/.test(k)?'an ':'a ')+k;
  const dr=k=>k==='milkshake'?'a milkshake':k==='hot cocoa'?'a cup of hot cocoa':'a glass of '+k;
  const ask=[GU.food?art(GU.food):null,GU.drink?dr(GU.drink):null].filter(Boolean).join(' and ');
  const line=`Hello! I'd like ${ask}, please.`;PANEL='guest';
  const opt=(arr,sel,a)=>arr.map(e=>`<button class="opt ${sel===e.k?'on':''}" data-a="${a}" data-v="${esc(e.k)}">${en(e.k)}</button>`).join('');
  sheet(`<div class="npchead"><div class="face" style="background:#FDE68A">${g[1]}</div><div class="grow"><h2>${en(g[0])}</h2><p class="sub">אורח/ת לארוחה</p></div>${gemTag()}</div>
  <div class="bubble">${en(line)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(line)}">🔊</button></div>
  ${GU.food?`<h3>🍽️ מה לאכול?</h3><div class="opts">${opt(GU.fo,GU.pickF,'gufood')}</div>`:''}
  ${GU.drink?`<h3>🥤 מה לשתות?</h3><div class="opts">${opt(GU.dro,GU.pickD,'gudrink')}</div>`:''}
  <div class="row"><button class="btn sun" data-a="guserve">🍽️ ${en('Serve')}</button><button class="btn ghost" data-a="host">חזרה</button></div>`);if(first)say(line)}
ACTX.gufood=d=>{GU.pickF=d.v;renderGuest()};ACTX.gudrink=d=>{GU.pickD=d.v;renderGuest()};
ACTX.guserve=()=>{if((GU.food&&!GU.pickF)||(GU.drink&&!GU.pickD)){toast('בוחרים גם אוכל וגם שתייה, כמו שביקשו');return}
  if(GU.pickF!==GU.food||GU.pickD!==GU.drink){sfx.bad();say(`Oops! I asked for ${[GU.food,GU.drink].filter(Boolean).join(' and ')}.`);learnResult('listen',false);toast('לא בדיוק. מקשיבים שוב 🔊');return}
  const src=k=>P.dishes[k]>0?'d':'p';const cost=[GU.food,GU.drink].filter(Boolean).reduce((s,k)=>s+(RECIPES[k]?Math.ceil(recipeCost(RECIPES[k])/RECIPES[k].serves):gOf(k).price),0);
  [GU.food,GU.drink].filter(Boolean).forEach(k=>takeOne(k,src(k)));
  const pay=(GU.food?(RECIPES[GU.food]?5:4):0)+(GU.drink?2:0);const tip=GU.food&&RECIPES[GU.food]?((P.lastStars||0)>=2?2:1):0;learnResult('listen',true);P.badges.host++;
  addGems(pay+tip,'ארוחה ל־'+GU.g[0],'Dinner guest');sfx.win();say('Delicious! Thank you! Here is your money.');PANEL='guestpaid';
  sheet(`<h2>${GU.g[1]} ${en('Delicious! Thank you!')}</h2><div class="receipt"><div><b>HOME RESTAURANT</b><span>${esc(GU.g[0])}</span></div>
    ${[GU.food,GU.drink].filter(Boolean).map(k=>`<div><span>${esc(k)}</span><span>${RECIPES[k]?5:k===GU.food?4:2}</span></div>`).join('')}${tip?`<div><span>tip ⭐</span><span>${tip}</span></div>`:''}<div><b>PAID</b><b>${pay+tip} gems</b></div></div>
    <ul class="list"><li><span>💰 קיבלת</span><b class="plus">+${pay+tip}</b></li><li><span>🥕 המצרכים עלו בערך</span><b class="minus">−${cost}</b></li><li><span>🧮 רווח = ${pay+tip} − ${cost}</span><b class="${pay+tip-cost>=0?'plus':'minus'}">${pay+tip-cost}</b></li></ul>
    <div class="row"><button class="btn sun" data-a="guest">🔔 עוד אורח/ת</button><button class="btn ghost" data-a="host">חזרה</button></div>`)};
/* friends receive what you serve */
(function attachHome(){setInterval(()=>{if(!NET.room||NET.room.__home)return;const r=NET.room;r.__home=1;
  r.on('serve',m=>{if(m.sameTab)return;const d=m.data||{};if(!VISIT||d.h!==VISIT.host)return;const k=String(d.k||'').slice(0,20);const em=String(d.em||'🍽️').slice(0,4);const from=String(d.from||VISIT.name||'').slice(0,14);
    PANEL='served';sfx.pop();say(`${from} served you ${k}!`);sheet(`<h2>🍽️ ${esc(from)} ${en('served you')}</h2><div class="bigem">${esc(em)}</div><p class="sub">${en(k)} · ${esc(String(d.he||'').slice(0,20))}</p>
      <div class="row"><button class="btn sun" data-a="yum" data-v="${esc(k)}" data-h="${esc(d.h)}">😋 ${en('Yum! Thank you!')}</button></div>`)});
  r.on('yum',m=>{if(m.sameTab)return;const d=m.data||{};if(d.to!==P.key)return;const who=String(d.from||'').slice(0,14);toast(`😋 ${who}: Yummy! Thank you!`);say('Yummy! Thank you!');addXp(3)})},1000)})();
ACTX.yum=d=>{if(typeof PW!=='undefined')PW.e=PW.max;emit('yum',{to:d.h,from:P.name||''});floatText('😋 Yum!');addXp(2);closeSheet()};

/* ---------- money: every receipt kept, income and expenses by category ---------- */
const MCAT=[[/מכולת|Market|משלוח|delivery/i,'🍎 אוכל'],[/רהיט|Furniture/i,'🛋️ בית ורהיטים'],[/בגד|Clothes|Boutique|אופנה|סלון|איפור/i,'👗 בגדים ויופי'],[/חיה|Pet/i,'🐾 חיות'],[/מגרש|plot/i,'🏡 מגרשים'],
  [/בנייה|Building/i,'🧱 בנייה'],[/גיבור|Hero/i,'🦸 גיבורים'],[/הלווא|Loan|ריבית|interest/i,'🏦 בנק'],[/ארוחה|Dinner/i,'🍽️ מסעדה ביתית'],[/משמרת|Salary|shift|עבודה|Work|Job/i,'💼 עבודה'],
  [/משימ|Quest|רשימת|Mission|Action/i,'🎯 משימות'],[/אוצר|chest|תיבה/i,'🧰 אוצרות'],[/קנייה|Shopping|צורה/i,'🛍️ קניות']];
const catOf=(he,en)=>{const s=(he||'')+' '+(en||'');const c=MCAT.find(([re])=>re.test(s));return c?c[1]:'✨ אחר'};
const _logmM=logm;logm=function(he,enw,a){_logmM(he,enw,a);if(!a||/הפקד|משיכ|Deposit|Withdraw|Savings/i.test((he||'')+(enw||'')))return;ensureHome();const B=a>0?P.money.in:P.money.out;const c=catOf(he,enw);B[c]=(B[c]||0)+Math.abs(a);save()};
/* receipts: every store checkout is saved */
const _payCartM=payCart;payCart=function(lines,total){const store=CART&&CART.store,deliv=CART&&CART.delivery;
  if(deliv&&P.gems>=total&&P.gems<total+2){toast('חסרים 💎 לדמי המשלוח (2 💎). אפשר ללכת למכולת ברגל, שם אין דמי משלוח 🚶');return}
  _payCartM(lines,total);const paid=!!(CART&&lines.length&&!Object.keys(CART.items).length);if(paid&&deliv){P.gems-=2;logm('דמי משלוח','Delivery fee',-2);renderHud()}
  if(paid&&store){ensureHome();const B=BUILDINGS.find(b=>b.id===store);const rc={t:Date.now(),store:B?B.en:store,he:B?B.he:'',lines:lines.map(l=>[l.it.en,l.it.em,l.q,l.it.price]),total,fee:deliv?2:0};
    P.receipts.unshift(rc);P.receipts=P.receipts.slice(0,40);save();const r=$('#sheet .receipt');if(r){const last=r.lastElementChild;if(deliv&&last){last.insertAdjacentHTML('beforebegin','<div><span>delivery 🛵</span><span>2</span></div>');last.innerHTML=`<b>TOTAL</b><b>${total+2} gems</b>`}
      r.insertAdjacentHTML('afterend',`<p class="sub">🧾 הקבלה נשמרה ב־<button class="link" data-a="money">💰 הכסף שלי</button>${store==='market'?' · האוכל מחכה במקרר 🧊':''}</p>`)}}
};
const _openMarketM=openMarket;openMarket=function(){if(CART)CART.delivery=0;_openMarketM()};
/* big building costs count as expenses too */
if(typeof commitBig==='function'){const _cb=commitBig;commitBig=function(pl,zone,quiet){const g=P.gems;const m=_cb(pl,zone,quiet);if(m&&P.gems<g){ensureHome();const c='🧱 בנייה';P.money.out[c]=(P.money.out[c]||0)+(g-P.gems);save()}return m}}
ACTX.money=()=>openMoney();ACTX.rcpt=d=>openReceipt(+d.i);
function openMoney(){ensureHome();PANEL='money';const I=P.money.in,O=P.money.out;const ti=Object.values(I).reduce((a,b)=>a+b,0),to=Object.values(O).reduce((a,b)=>a+b,0);const mx=Math.max(1,ti,to);
  const rows=(B,cls)=>{const e=Object.entries(B).sort((a,b)=>b[1]-a[1]);const m=Math.max(1,...e.map(x=>x[1]));return e.length?e.map(([k,v])=>`<li class="mrow"><span>${k}</span><span class="mbar"><i class="${cls}" style="width:${Math.round(v/m*100)}%"></i></span><b class="${cls==='in'?'plus':'minus'}">${fmt(v)}</b></li>`).join(''):'<li><span class="sub">עוד אין</span></li>'};
  const tips=['הכנסות − הוצאות = מה שנשאר לחסוך','לפני שקונים שואלים: אני צריכה את זה, או רק רוצה?','לבשל בבית יוצא זול יותר מלקנות מוכן? בודקים בספר המתכונים!','משלוח עולה 2 💎. ללכת למכולת ברגל זה חינם 🚶','כסף בחיסכון בבנק מרוויח ריבית 🏦'];
  const d=ti-to;const dt=t=>{const x=new Date(t);return`${x.getDate()}/${x.getMonth()+1} ${String(x.getHours()).padStart(2,'0')}:${String(x.getMinutes()).padStart(2,'0')}`};
  sheet(`<div class="npchead"><div class="face" style="background:#EDE9FE">💰</div><div class="grow"><h2>${en('My money')}</h2><p class="sub">הכסף שלי · נספר מ־${dt(P.money.since||Date.now()).split(' ')[0]}</p></div>${gemTag()}</div>
  <div class="mtot"><div><span>💎 בכיס</span><b>${fmt(P.gems)}</b></div><div><span>🏦 בחיסכון</span><b>${fmt(P.savings||0)}</b></div></div>
  <div class="mbig"><div><span>⬆️ הכנסות</span><span class="mbar"><i class="in" style="width:${ti/mx*100}%"></i></span><b class="plus">${fmt(ti)}</b></div><div><span>⬇️ הוצאות</span><span class="mbar"><i class="out" style="width:${to/mx*100}%"></i></span><b class="minus">${fmt(to)}</b></div></div>
  <p class="sub">🧮 ${fmt(ti)} − ${fmt(to)} = <b class="${d>=0?'plus':'minus'}">${d>=0?'':'−'}${fmt(Math.abs(d))}</b> ${d>=0?'נשאר לך יותר ממה שהוצאת 👏':'הוצאת יותר ממה שהרווחת. כדאי לעבוד קצת או לחסוך 💡'}</p>
  <details open><summary>⬇️ על מה הוצאתי</summary><ul class="list">${rows(O,'out')}</ul></details>
  <details><summary>⬆️ מאיפה הרווחתי</summary><ul class="list">${rows(I,'in')}</ul></details>
  <details><summary>🧾 הקבלות שלי (${P.receipts.length})</summary><ul class="list">${P.receipts.length?P.receipts.slice(0,20).map((r,i)=>`<li><button class="link" data-a="rcpt" data-i="${i}">${dt(r.t)} · ${esc(r.he||r.store)}</button><b class="minus">−${r.total+(r.fee||0)}</b></li>`).join(''):'<li><span class="sub">כל קנייה בחנות שומרת כאן קבלה</span></li>'}</ul></details>
  <div class="bubble" style="font-size:15px">💡 ${pick(tips)}</div><div class="row"><button class="btn ghost" data-a="bank">🏦 לבנק</button><button class="btn ghost" data-a="close">סגירה</button></div>`)}
function openReceipt(i){const r=P.receipts[i];if(!r)return;PANEL='rcptview';const x=new Date(r.t);
  sheet(`<h2>🧾 ${en('Receipt')} · קבלה</h2><div class="receipt"><div><b>${esc(String(r.store).toUpperCase())}</b><span>${x.toLocaleDateString('en-GB')} ${x.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</span></div>
    ${r.lines.map(([n,em,q,p])=>`<div><span>${esc(em)} ${esc(n)} ${q>1?q+' x '+p:''}</span><span>${q*p}</span></div>`).join('')}${r.fee?`<div><span>delivery 🛵</span><span>${r.fee}</span></div>`:''}<div><b>TOTAL</b><b>${r.total+(r.fee||0)} gems</b></div></div>
    <p class="sub">🧮 בודקים: ${r.lines.map(([n,em,q,p])=>q>1?`${q}×${p}`:p).join(' + ')}${r.fee?' + '+r.fee:''} = ${r.total+(r.fee||0)}</p><button class="btn ghost" data-a="money">חזרה</button>`)}
/* money also from the settings menu */
const _openSettingsM=openSettings;openSettings=function(){_openSettingsM();const h=$('#sheet h2');if(h)h.insertAdjacentHTML('afterend','<div class="row"><button class="btn mini" data-a="money">💰 הכסף שלי והקבלות</button>'+(ME.zone==='home'?'<button class="btn mini" data-a="homemenu">🏡 הבית שלי</button>':'')+'</div>')};
/* tapping the fridge, the stove or a table at home opens them */
const _tapHome=tap;tap=function(e){if(MODE==='walk'&&ME.zone==='home'){try{const rc=renderer.domElement.getBoundingClientRect();ndc.set(((e.clientX-rc.left)/rc.width)*2-1,-((e.clientY-rc.top)/rc.height)*2+1);ray.setFromCamera(ndc,camera);
    const h=ray.intersectObjects(pickTargets(),true)[0];const root=h&&(h.object.userData.root||h.object);const u=root&&root.userData||{};
    if(u.piece&&u.item&&u.scope==='H'){const p=P.house.pieces.find(x=>x.id===u.id);const id=p&&p.c;
      if(id==='fridge'){sfx.door&&sfx.door();openFridge();return}if(id==='stove'||id==='counter'||id==='sink'){openCookbook();return}if(id==='table'||id==='dining'){openHost();return}}}catch(err){}}
  return _tapHome(e)};
