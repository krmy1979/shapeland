/* Shapeland · a world by Shirel Yitzhak */
/* ===================== PANELS ===================== */
let PANEL=null,PANEL_DATA=null,PZ=null;
let KEEP=false;
function sheet(html){const s=$('#sheet');const prev=s.firstChild&&!s.hidden?s.firstChild.scrollTop:0;s.hidden=false;s.innerHTML=`<div class="sheet-in${KEEP?' still':''}" role="dialog">${html}</div>`;if(KEEP&&s.firstChild)s.firstChild.scrollTop=prev}
function closeSheet(){$('#sheet').hidden=true;PANEL=null;PZ=null}
function npcHead(id,extra){const n=NPCS.find(x=>x.id===id);return`<div class="npchead"><div class="face" style="background:${n.color}33">${n.face}</div><div class="grow"><h2>${en(n.name)}</h2><p class="sub">${n.role}</p></div>${extra||''}</div>`}
const gemTag=()=>`<span class="gems" style="box-shadow:none">💎 ${fmt(P.gems)}</span>`;

/* --- Bella --- */
function genQuest(){const r=P.sk.vocab,t=tierFor(r);const owned=P.owned;const s=pick(owned.length>4&&Math.random()<.6?owned.slice(4):owned);
  const c=pick(Object.keys(COLS));const c2=pick(Object.keys(COLS).filter(x=>x!==c));
  const n=clamp([0,rnd(1,3),rnd(2,4),rnd(3,5),rnd(3,6),rnd(4,7)][t],1,7);const sz=t>=2&&Math.random()<.5?pick(['small','big']):null;const high=t>=3&&Math.random()<.35;
  const sw=n===1?s:SHAPES[s].pl,szw=sz?sz+' ':'';let text;
  if(t===1)text=`Build ${nw(n)} ${c} ${sw}, please!`;
  else if(t===2)text=`Can you build ${nw(n)} ${szw}${c} ${sw}?`;
  else if(t===3)text=high?`I need ${nw(n)} ${c} ${sw}. Put ${n===1?'it':'them'} up high, above three meters!`:`Please build ${nw(n)} ${szw}${c} ${sw} for my garden.`;
  else if(t===4)text=high?`The birds want ${nw(n)} ${szw}${c} ${sw} high in the sky, above three meters. Can you help?`:`My little brother loves the color ${c}. Could you make ${nw(n)} ${szw}${sw} for him?`;
  else text=`We are decorating for a party. Build ${nw(n)} ${szw}${sw}${high?' above three meters':''}, but they must be ${c}, not ${c2}!`;
  const he=`${n} × ${SHAPES[s].he} · צבע ${COLS[c][1]}${sz?' · גודל '+SIZES[sz][1]:''}${high?' · גבוה מ־3 מטר':''} · אפשר באי או בבית`;
  return{text,he,s,c,sz,high,n,start:Date.now(),reward:6+t*3+(high?3:0),short:`${nw(n)} ${szw}${c} ${sw}${high?' ↑':''}`,hint:false}}
function questProgress(q){const d=P.pieces.concat(P.house.pieces,P.cpieces).filter(p=>p.ts>=q.start&&p.s===q.s&&p.c===q.c&&(!q.sz||p.sz===q.sz)&&(!q.high||p.y-hOf(p.s,p.sz)/2>=3)).length;return[Math.min(d,q.n),q.n]}
function checkQuest(){const q=P.quest;if(!q)return;const[d,n]=questProgress(q);renderQuestChip();if(d>=n){
  P.quest=null;learnResult('vocab',true);if(!q.hint)P.sk.vocab=clamp(P.sk.vocab+.25,1,10);addGems(q.reward,'משימה של Bella','Quest reward');addXp(30);sfx.win();burst('🎉 +'+q.reward+' 💎');
  say(pick(['Thank you! It looks amazing!','Wow, you did it! Great job!','Perfect! You are a real builder!']));adventure();renderQuestChip();setNpcMarks()}}
function openBella(){PANEL='bella';const q=P.quest;
  if(q){sheet(`${npcHead('bella')}<div class="bubble">${en(q.text)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(q.text)}">🔊</button><button class="btn ghost mini" data-a="qhint">💡</button></div>
    <div class="hint" id="qh" ${q.hint?'':'hidden'}>${esc(q.he)}</div><p class="sub">התקדמות: ${questProgress(q).join('/')}</p>
    <div class="row"><button class="btn" data-a="close">${en("I'm on it!")}</button><button class="btn ghost mini" data-a="dropq">לוותר על המשימה</button></div>`);say(q.text);return}
  const nq=genQuest();PANEL_DATA=nq;
  sheet(`${npcHead('bella')}<div class="bubble">${en('Hi '+(P.name||'friend')+'! '+nq.text)}</div>
    <div class="row"><button class="spk" data-a="sayt" data-t="${esc(nq.text)}">🔊</button><button class="btn ghost mini" data-a="nqhint">💡</button></div>
    <div class="hint" id="qh" hidden>${esc(nq.he)}</div><p class="sub">פרס: 💎${nq.reward} · מה עונים לה?</p>
    <div class="opts one"><button class="opt" data-a="takeq">${en("Sure! I'll build it!")}</button><button class="opt" data-a="close">${en('Maybe later.')}</button></div>`);
  say('Hi '+spName()+'! '+nq.text)}

/* --- Leo --- */
function pricePuzzle(price,r){const d=clamp(Math.round(r),1,10);let e,h;
  if(d<=2){const a=rnd(1,price-1);e=`It costs ${a} + ${price-a} gems.`;h=`המחיר: ${a} ועוד ${price-a}`}
  else if(d<=4){const fs=[2,3,4,5,6].filter(f=>price%f===0&&price/f>1);if(fs.length){const f=pick(fs);e=`It costs ${nw(f)} times ${price/f} gems.`;h=`המחיר: ${f} כפול ${price/f}`}else{const a=rnd(2,price-2);e=`It costs ${price+a} minus ${a} gems.`;h=`המחיר: ${price+a} פחות ${a}`}}
  else if(d<=6){const f=pick([2,3]);const b=Math.floor(price/f),c=price-b*f;e=c?`${f} × ${b} + ${c} gems.`:`${f} × ${b} gems.`;h=`${f} כפול ${b}${c?' ועוד '+c:''}`}
  else if(d<=8){const opts=[[50,2],[25,4/3],[20,5/4],[10,10/9]].filter(([pc,m])=>Number.isInteger(price*m));if(opts.length){const[pc,m]=pick(opts);const o=price*m;e=`It was ${o} gems. Today it's ${pc}% off!`;h=`היה ${o}, היום ${pc}% הנחה`}else{const have=price+rnd(5,30);e=`You have ${have} gems. After you buy it, you will have ${have-price} left. What is the price?`;h=`יש ${have}, אחרי הקנייה נשאר ${have-price}`}}
  else{const have=price+rnd(10,60);e=`You have ${have} gems. After you buy it, you will have ${have-price} gems left. What is the price?`;h=`יש ${have}, אחרי הקנייה נשאר ${have-price}`}
  return{e,h,opts:numOpts(price),ans:String(price)}}
function openShop(focus){PANEL='leo';const L=level();const items=Object.entries(SHAPES).filter(([k])=>!P.owned.includes(k));
  sheet(`${npcHead('leo',gemTag())}<div class="bubble">${en(items.length?'Welcome to my magic shape shop! What would you like?':'You have every shape! Amazing!')}</div>
    <div class="chips">${items.map(([k,v])=>`<button class="ochip ${L<v.lvl?'lock':''}" data-a="buyshape" data-v="${k}" aria-pressed="${focus===k}">${shapeIcon(k,L<v.lvl?'#A9B6CC':'#8B5CF6')}<span class="en">${k}</span><span class="tag">${L<v.lvl?'🔒 Level '+v.lvl:'💎 '+v.price}</span></button>`).join('')}</div>
    <p class="sub">נוגעים בצורה כדי לקנות אותה.</p><button class="btn ghost" data-a="close">${en('Bye, Leo!')}</button>`);
  say(items.length?'Welcome to my magic shape shop!':'You have every shape!')}
function buyShape(k){const v=SHAPES[k];if(level()<v.lvl){toast(`ה־${k} נפתח ב־Level ${v.lvl}`);return}const price=v.price;
  if(P.gems<price){say(`A ${k} costs ${price} gems. You need more gems.`);toast(`חסרים ${fmt(price-P.gems)} 💎. אפשר למשוך מהבנק או לעבוד בעיירה`);return}
  P.gems-=price;P.owned.push(k);logm('קנייה: '+k,'Shopping',-price);SEL.s=k;save();sfx.win();burst(shapeIcon(k,'#fff').replace('<svg','<svg style="width:90px;height:90px"'));say(`Here is your ${k}! That's ${price} gems. Have fun!`);closeSheet();renderHud();setNpcMarks()}
function renderBuy(){const{k,pz,wrong}=PANEL_DATA;
  sheet(`${npcHead('leo',gemTag())}<div class="pz">${shapeIcon(k,'#8B5CF6').replace('<svg','<svg style="width:70px;height:70px"')}<div class="word">${en('A '+k+'!')}</div></div>
    <div class="bubble">${en(pz.e)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(pz.e)}">🔊</button><button class="btn ghost mini" data-a="hint">💡</button></div><div class="hint" id="hintTxt" hidden>${esc(pz.h)}</div>
    <p class="sub">כמה יהלומים לשלם?</p><div class="opts">${pz.opts.map((o,i)=>`<button class="opt ${wrong===o.val?'no':''}" data-a="pay" data-i="${i}">💎 ${o.html}</button>`).join('')}</div>
    <button class="btn ghost" data-a="shop">חזרה לחנות</button>`);say(pz.e)}

/* --- generic puzzle (Mia, chests) --- */
function openMia(){PANEL='mia';USED=new Set();openPuzzle({head:npcHead('mia'),q:qTalk(P.sk.talk),reward:4,onDone:ok=>{if(ok)adventure()}})}
function openChest(g){PANEL='chest';USED=new Set();const type=pick(['vocab','listen','spell','sentence','math','vocab','listen']);
  openPuzzle({head:`<div class="npchead"><div class="face" style="background:#19B8C933">🧰</div><div class="grow"><h2>תיבת אוצר</h2><p class="sub">${en('Open the magic lock!')}</p></div></div>`,q:makeQ(type,P.sk[type]),reward:rnd(5,12),
    onDone:ok=>{if(ok){g.visible=false;adventure();setTimeout(()=>placeChest(g),90000)}else toast('המנעול נתקע. אפשר לנסות שוב עם חידה חדשה')}})}
function openPuzzle(o){PZ=Object.assign({answered:null,built:[],said:false},o);renderPZ();if(PZ.q.sayFirst)setTimeout(()=>say(PZ.q.sayFirst),250)}
function fbBlock(q,A){return`<div class="fb ${A.ok?'ok':'no'}"><h3>${A.ok?pick(['יש! 🎉','מעולה! ⭐','בול! 🎯']):'כמעט! ככה זה:'}</h3><div style="font-size:18px">${en(q.showAns)}${q.heAns?`<div class="sub">${esc(q.heAns)}</div>`:''}</div>
    ${!A.ok&&q.note?`<p class="sub">${esc(q.note)}</p>`:''}
    ${q.talk&&A.ok?`<p class="sub"><b>עכשיו להגיד את זה בקול!</b></p><div class="row"><button class="spk" data-a="sayans">🔊</button>${PZ.said?'<span class="plus">🎤 +1 💎</span>':'<button class="btn sun mini" data-a="said">🎤 אמרתי!</button>'}</div>`:(q.sayAfter?`<div class="row"><button class="spk" data-a="sayans">🔊</button></div>`:'')}</div>`}
function renderPZ(){if(!PZ)return;if(PZ.race)return renderRace();if(PZ.series)return renderSeries();const q=PZ.q,A=PZ.answered;let h=PZ.head+`<div class="pz">${q.prompt}</div>`+qBody(q,A);
  if(A)h+=fbBlock(q,A)+(A.ok?`<p class="plus" style="margin:0;font-family:var(--f-display);font-size:18px">+${PZ.reward} 💎</p>`:'')+`<button class="btn" data-a="pzdone">המשך</button>`;sheet(h)}
function qBody(q,A){if(q.type==='choice')return`<div class="opts ${q.one?'one':''}">${q.opts.map((o,i)=>{let c='';if(A){if(o.val===q.ans)c='ok';else if(o.val===A.picked)c='no'}
    return`<button class="opt ${c}" data-a="opt" data-i="${i}" ${A?'disabled':''} ${o.aria?`aria-label="${esc(o.aria)}"`:''}>${o.html}</button>`}).join('')}</div>`;
  if(q.type==='counter')return`<div class="cnt">${q.menu.map((it,i)=>`<div><span class="em">${it[1]}</span>${en(it[0])}<div class="ctl"><button data-a="cminus" data-i="${i}" ${A?'disabled':''} aria-label="פחות">−</button><span>${PZ.counts[i]}</span><button data-a="cplus" data-i="${i}" ${A?'disabled':''} aria-label="עוד">+</button></div></div>`).join('')}</div>
    ${A?'':`<button class="btn" data-a="serve">${en('Serve')} 🧺</button>`}`;
  const B=PZ.built;return`<div class="built">${B.map((ti,k)=>`<button class="tile in" data-a="untile" data-k="${k}" ${A?'disabled':''}>${esc(q.tokens[ti])}</button>`).join('')}</div>
    <div class="tiles">${q.tokens.map((t,i)=>`<button class="tile ${B.includes(i)?'used':''}" data-a="tile" data-i="${i}" ${A?'disabled':''}>${esc(t)}</button>`).join('')}</div>
    ${A?'':`<div class="row" style="justify-content:center"><button class="btn" data-a="check" ${B.length?'':'disabled'}>✓</button><button class="btn ghost" data-a="clearb">↺</button></div>`}`}
function answerPZ(ok,picked){const q=PZ.q;PZ.answered={ok,picked};learnResult(q.skill,ok,q.word);
  if(ok){sfx.coin();if(PZ.reward&&!PZ.series)addGems(PZ.reward,PANEL==='chest'?'תיבת אוצר':'שיחה באנגלית',PANEL==='chest'?'Treasure':'Chat');addXp(PZ.race?5:PZ.series?8:15)}else sfx.bad();
  if(q.sayAfter)setTimeout(()=>say(q.sayAfter),220);
  if(PZ.race){raceAnswer(ok);return}if(PZ.series){PZ.series.res.push(ok);renderSeries();return}renderPZ()}

/* --- jobs (series) --- */
function qCashier(r){const t=tierFor(r);const n=clamp(t>=3?rnd(2,3):rnd(1,2),1,3);const items=shuffle(GOODS.filter(g=>g.tr<=t+1)).slice(0,n).map(g=>({g,q:t>=4?rnd(1,3):1}));
  const total=items.reduce((s,x)=>s+x.g.price*x.q,0);const askTotal=r<3.2;const note=[5,10,20,50,100].find(v=>v>total)||100;
  const list=items.map(x=>goodPh(x.g.en,x.q));
  const line=askTotal?`Hello! I want ${listEn(list)}. How much is it?`:`Hi! I'll take ${listEn(list)}. Here are ${note} gems.`;
  const ans=askTotal?total:note-total;
  return{type:'choice',skill:'math',sayFirst:line,prompt:`<div class="bubble" style="width:100%;text-align:start">${en(line)}</div>
    <div class="list" style="width:100%">${items.map(x=>`<div class="cart"><div class="line"><span>${x.g.em} ${en(x.g.en)}${x.q>1?' ×'+x.q:''}</span><b>💎 ${x.g.price}${x.q>1?' × '+x.q:''}</b></div></div>`).join('')}</div>
    <div class="row" style="justify-content:center"><button class="spk" data-a="sayq">🔊</button><button class="btn ghost mini" data-a="hint">💡</button></div>
    <div class="hint" id="hintTxt" hidden>${askTotal?'מחברים את כל המחירים':`קודם מחברים את המחירים (${total}), ואז ${note} פחות הסכום`}</div><p class="sub">${askTotal?'כמה זה עולה בסך הכל?':'כמה עודף מחזירים?'}</p>`,
    opts:numOpts(ans),ans:String(ans),showAns:(askTotal?'Total: ':'Change: ')+ans+' gems',sayAfter:askTotal?`That's ${ans} gems, please.`:`Here is your change: ${ans} gems. Thank you!`}}
function qBaker(r){const t=tierFor(r);const k=clamp(t>=4?3:t>=2?2:1,1,3);const chosen=shuffle(PASTRY).slice(0,k);const counts=chosen.map(()=>rnd(1,Math.min(5,t+1)));
  const ph=(it,c)=>`${nw(c)} ${c===1?it[2]:it[3]}`;const parts=chosen.map((it,i)=>ph(it,counts[i]));let line;
  if(t===1)line=`${parts[0][0].toUpperCase()+parts[0].slice(1)}, please!`;else if(t===2)line=`Can I have ${listEn(parts)}, please?`;
  else if(t===3)line=`Good morning! I'd like ${listEn(parts)}.`;else if(t===4)line=`Hello! I need ${parts[0]} for my party, and ${listEn(parts.slice(1))} for my family.`;
  else line=`Hi! Please give me ${parts[0]}. Oh, and ${listEn(parts.slice(1))}, too. Thanks!`;
  const menu=shuffle(PASTRY.filter(p=>!chosen.includes(p))).slice(0,6-k).concat(chosen);const order=shuffle(menu);const want=order.map(it=>{const i=chosen.indexOf(it);return i<0?0:counts[i]});
  return{type:'counter',skill:'listen',sayFirst:line,menu:order,want,prompt:`<div class="bubble" style="width:100%;text-align:start">${r>=7?`<span id="npcTxt" hidden>${en(line)}</span><span id="npcHid">🎧 …</span>`:en(line)}</div>
    <div class="row" style="justify-content:center"><button class="spk" data-a="sayq">🔊</button>${r>=7?'<button class="btn ghost mini" data-a="reveal">👀</button>':''}</div>`,
    showAns:line,sayAfter:'Thank you! It smells delicious!'}}
function startShift(kind){const r=kind==='cashier'?P.sk.math:P.sk.listen;USED=new Set();const qs=[0,1,2,3].map(()=>kind==='cashier'?qCashier(r):qBaker(r));
  PANEL='job';PZ={series:{kind,qs,i:0,res:[]},answered:null,built:[],counts:null,q:qs[0]};prepQ();renderSeries();if(PZ.q.sayFirst)setTimeout(()=>say(PZ.q.sayFirst),300)}
function prepQ(){PZ.answered=null;PZ.built=[];if(PZ.q.type==='counter')PZ.counts=PZ.q.menu.map(()=>0)}
const JOBINFO={cashier:{en:'Cashier',he:'קופאי/ת במכולת',face:'🧾',per:3},baker:{en:'Baker',he:'אופה במאפייה',face:'🧑‍🍳',per:4}};
function renderEscape(){const S=PZ.series;
  if(S.failed){sheet(`<div class="pz"><div class="pic">⏰</div><h2>${en('Time is up!')}</h2><p class="sub">${S.i} מתוך 3 מנעולים נפתחו. אפשר לנסות שוב מתי שרוצים.</p></div><button class="btn" data-a="escfail">חזרה</button>`);return}
  if(S.i>=S.qs.length){const rw=25+level()*2;sheet(`<div class="pz"><div class="pic">🗝️🎉</div><h2>${en('You escaped!')}</h2><p class="sub">כל 3 המנעולים נפתחו בזמן</p></div><button class="btn" data-a="escdone" data-v="${rw}">${en('Collect')} 💎${rw}</button>`);return}
  const q=PZ.q,A=PZ.answered;let h=`<div class="row"><h2 class="grow">🔐 ${en('Lock '+(S.i+1)+' of 3')}</h2><span class="timer" id="escT">⏱️</span></div><div class="dots">${S.qs.map((_,i)=>`<i class="${i<S.i?'ok':i===S.i?'cur':''}"></i>`).join('')}</div><div class="pz">${q.prompt}</div>`+qBody(q,A);
  if(A)h+=fbBlock(q,A)+`<button class="btn" data-a="nextcust">${A.ok?(S.i+1>=3?en('Open the door!'):en('Next lock!')):en('Try another riddle')}</button>`;sheet(h)}
function renderSeries(){const S=PZ.series;if(S.kind==='escape')return renderEscape();const J=JOBINFO[S.kind];
  if(S.i>=S.qs.length){const good=S.res.filter(Boolean).length;const pay=5+good*J.per+level();sheet(`<div class="pz"><div class="pic">${J.face}</div><h2>${en('Shift complete!')}</h2><p class="sub">${good} מתוך ${S.qs.length} לקוחות מרוצים</p>
      <div class="receipt"><div><span>PAYSLIP · ${esc(J.en)}</span><span></span></div><div><span>Base</span><span>${5+level()}</span></div><div><span>Happy customers × ${J.per}</span><span>${good*J.per}</span></div><div><b>Salary</b><b>${pay} gems</b></div></div></div>
      <button class="btn" data-a="shiftdone" data-v="${pay}">${en('Get paid')} 💎</button>`);return}
  const q=PZ.q,A=PZ.answered;let h=`<div class="npchead"><div class="face" style="background:var(--soft)">${J.face}</div><div class="grow"><h2>${en(J.en)}</h2><p class="sub">${J.he} · ${en('Customer')} ${S.i+1}/${S.qs.length}</p></div></div>
    <div class="dots">${S.qs.map((_,i)=>`<i class="${i<S.res.length?(S.res[i]?'ok':'no'):i===S.i?'cur':''}"></i>`).join('')}</div><div class="pz">${q.prompt}</div>`+qBody(q,A);
  if(A)h+=fbBlock(q,A)+`<button class="btn" data-a="nextcust">${S.i+1>=S.qs.length?'סיום המשמרת':en('Next customer!')}</button>`;sheet(h)}

/* --- team --- */
function teamGoal(){return TEAM[P.team%TEAM.length]}
function teamReward(){return 20+Math.floor(P.team/TEAM.length)*10}
function checkTeam(){const[d,n]=teamGoal().prog(allIsland());if(d>=n){const rw=teamReward();P.team++;addGems(rw,'משימת צוות','Team mission');addXp(40);sfx.win();
  burst('TEAMWORK! 🤝');say('Teamwork! Mission complete!');adventure();save()}if(PANEL==='team')openTeam(true)}
function openTeam(silent){PANEL='team';const g=teamGoal();const[d,n]=g.prog(allIsland());
  const by=new Map();by.set(P.key,P.pieces.length);OTHERS.forEach((m,k)=>by.set(k,m.size));
  const helpers=[...by.entries()].filter(([,c])=>c>0).map(([k,c])=>`<li><span>${esc(k===P.key?(P.name||'את/ה')+' (את/ה)':(NET.names.get(k)||'חבר/ה'))}</span><b>${c} חלקים</b></li>`).join('');
  sheet(`<div class="npchead"><div class="face" style="background:#FFD34D55">🤝</div><div class="grow"><h2>${en("Shirel Yitzhak's World")}</h2><p class="sub">משימת צוות #${P.team+1} · כל מי שמחובר עוזר</p></div></div>
    <div class="bubble">${en(g.en)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(g.en)}">🔊</button><button class="btn ghost mini" data-a="hint">💡</button></div><div class="hint" id="hintTxt" hidden>${esc(g.he)}</div>
    <div class="pbar"><i style="width:${Math.round(d/n*100)}%"></i></div><p class="sub">${d} / ${n} · פרס לכל אחת: 💎${teamReward()}</p>
    ${helpers?`<h3>מי בנה על האי</h3><ul class="list">${helpers}</ul>`:''}<button class="btn" data-a="close">${en("Let's do it!")}</button>`);if(!silent)say(g.en)}

/* --- arena / race --- */
function openArena(){PANEL='arena';const others=NET.peers.filter(p=>!p.sameTab);
  const rows=[{n:P.name||'את/ה',lv:level(),pc:P.pieces.length,me:true},...others.map(p=>({n:nameOf(p),lv:clamp(+(p.presence||{}).lv||1,1,99),pc:clamp(+(p.presence||{}).pc||0,0,999)}))].sort((a,b)=>b.lv-a.lv||b.pc-a.pc);
  sheet(`<div class="npchead"><div class="face" style="background:#FFB41F44">⚡</div><div class="grow"><h2>${en('Word Race')}</h2><p class="sub">6 אתגרים מהירים. ${others.length?'כל המחוברים מתחרים יחד!':'אפשר להתחרות נגד השעון.'}</p></div></div>
    <div class="row"><button class="btn sun" data-a="race">${others.length?'להתחיל מרוץ לכולם 🏁':'להתחיל מרוץ 🏁'}</button><span class="sub">שיא אישי: ${P.best}</span></div>
    <h3>הטבלה של החבורה</h3><ul class="list">${rows.map((r,i)=>`<li><span>${['🥇','🥈','🥉'][i]||'⭐'} ${esc(r.n)}${r.me?' (את/ה)':''}</span><b>${en('Level '+r.lv)} · ${r.pc} 🧱</b></li>`).join('')}</ul>
    <button class="btn ghost" data-a="close">סגירה</button>`)}
function startRaceLocal(){const id=uid6(),seed=Math.floor(Math.random()*1e9),r=+avgSkill().toFixed(1);
  if(NET.room&&NET.room.connected()&&NET.peers.some(p=>!p.sameTab))emit('race',{id,seed,r,by:P.name});else startRace(id,seed,r,'')}
function startRace(id,seed,r,by){if(NET.race&&NET.race.id===id)return;const save_=Math.random;Math.random=mulberry(seed);USED=new Set();let qs;
  try{qs=['vocab','listen','math','vocab','listen','math'].map(t=>makeQ(t,t==='math'?Math.min(r,6):r))}finally{Math.random=save_}
  NET.race={id,qs,i:-1,score:0,res:[],scores:new Map(),cd:3,by};PANEL='race';PZ={race:true,answered:null,built:[],reward:0,head:''};raceCountdown()}
function raceCountdown(){const RC=NET.race;if(!RC)return;if(RC.cd>0){sheet(`<div class="pz" style="padding:30px 0"><h2>${en('Get ready!')}</h2><div class="big" style="font-size:80px">${RC.cd}</div>${RC.by?`<p class="sub">${esc(RC.by)} התחיל/ה מרוץ!</p>`:''}</div>`);blip(440,.15);RC.cd--;setTimeout(raceCountdown,800)}
  else{blip(880,.25);nextRaceQ()}}
function nextRaceQ(){const RC=NET.race;RC.i++;if(RC.i>=RC.qs.length){finishRace();return}PZ.q=RC.qs[RC.i];PZ.answered=null;PZ.built=[];RC.qt=performance.now();renderRace();if(PZ.q.sayFirst)setTimeout(()=>say(PZ.q.sayFirst),200)}
function renderRace(){const RC=NET.race;if(!RC||RC.i<0)return;if(RC.i>=RC.qs.length)return renderRaceEnd();const q=PZ.q,A=PZ.answered;
  sheet(`<div class="row"><div class="dots grow">${RC.qs.map((_,i)=>`<i class="${i<RC.res.length?(RC.res[i]?'ok':'no'):i===RC.i?'cur':''}"></i>`).join('')}</div><span class="timer">⚡ ${RC.score}</span></div><div class="pz">${q.prompt}</div>${qBody(q,A)}`)}
function raceAnswer(ok){const RC=NET.race;RC.res.push(ok);if(ok)RC.score+=100+Math.max(0,Math.round(100-(performance.now()-RC.qt)/80));renderRace();setTimeout(nextRaceQ,900)}
function finishRace(){const RC=NET.race;if(RC.score>P.best)P.best=RC.score;RC.scores.set('me',{n:P.name||'את/ה',s:RC.score,me:true});emit('score',{id:RC.id,n:P.name,s:RC.score});
  addXp(20+RC.res.filter(Boolean).length*5);adventure();save();sfx.win();renderRaceEnd()}
function renderRaceEnd(){const RC=NET.race;const rows=[...RC.scores.values()].sort((a,b)=>b.s-a.s);
  sheet(`<div class="pz"><h2>${en('Finish!')} 🏁</h2><div class="big">⚡ ${RC.score}</div><p class="sub">${RC.res.filter(Boolean).length} מתוך 6 · שיא אישי ${P.best}</p></div>
    <h3>תוצאות</h3><ul class="list">${rows.map((r,i)=>`<li><span>${['🥇','🥈','🥉'][i]||'⭐'} ${esc(r.n)}${r.me?' (את/ה)':''}</span><b>${r.s}</b></li>`).join('')}</ul>
    ${NET.peers.some(p=>!p.sameTab)?'<p class="sub">תוצאות של חברים מופיעות כשהם מסיימים.</p>':''}<div class="row"><button class="btn sun" data-a="race">עוד מרוץ</button><button class="btn ghost" data-a="close">חזרה למשחק</button></div>`)}

/* --- bank --- */
function openBank(greet){PANEL='bank';const goalShape=P.goal&&SHAPES[P.goal]?P.goal:null;const left=5-(P.adv%5);
  sheet(`${npcHead('bear')}<div class="two"><div class="box"><span class="sub">${en('Wallet')} · ביד</span><div class="big">💎 ${fmt(P.gems)}</div></div><div class="box"><span class="sub">${en('Savings')} · בבנק</span><div class="big">💎 ${fmt(P.savings)}</div></div></div>
    <div class="row"><button class="btn gem mini" data-a="dep" data-v="10">להפקיד 10</button><button class="btn gem mini" data-a="dep" data-v="all">להפקיד הכל</button><button class="btn ghost mini" data-a="wd" data-v="10">למשוך 10</button><button class="btn ghost mini" data-a="wd" data-v="all">למשוך הכל</button></div>
    <div class="bubble" style="font-size:16px">${en('Money in my bank grows! After every adventure, your savings get 2% more. That is called interest.')}</div>
    <ul class="list"><li><span>ריבית בהרפתקה הבאה ${en('Interest')}</span><b class="plus">+${fmt(P.savings*.02)} 💎</b></li><li><span>חשבונות הבית בעוד ${left} הרפתקאות ${en('Bills')}</span><b class="minus">−${islandTax()} 💎</b></li>${P.loan?`<li><span>הלוואה על מגרש ${en('Loan')} · נשארו ${P.loan.left} תשלומים</span><b class="minus">−${P.loan.pay} 💎</b></li>`:''}</ul>
    <h3>חוסכים בשביל ${en('Saving goal')}</h3>
    ${goalShape?`<div class="pbar"><i style="width:${Math.min(100,P.savings/SHAPES[goalShape].price*100)}%"></i></div><p class="sub">${en(goalShape)} עולה בערך ${SHAPES[goalShape].price} 💎 ${P.savings>=SHAPES[goalShape].price?'· יש מספיק! 🎉':''}</p>`:''}
    <div class="chips">${Object.keys(SHAPES).filter(k=>!P.owned.includes(k)).map(k=>`<button class="ochip" data-a="goal" data-v="${k}" aria-pressed="${P.goal===k}">${shapeIcon(k,'#19B8C9')}<span class="en">${k}</span></button>`).join('')||'<span class="sub">כל הצורות כבר אצלך!</span>'}</div>
    <h3>פעולות אחרונות</h3>${P.log.length?`<ul class="list">${P.log.slice(0,8).map(l=>`<li><span>${esc(l.he)} ${en(l.en)}</span><b class="${l.a<0?'minus':'plus'}">${l.a<0?'−':'+'}${fmt(Math.abs(l.a))}</b></li>`).join('')}</ul>`:'<p class="sub">עוד אין פעולות.</p>'}
    <button class="btn ghost" data-a="close">${en('Thanks, Mr. Bear!')}</button>`);if(greet)say('Welcome to the bank! Money in the bank grows.')}

/* --- town buildings & shops with cart --- */
let CART=null;
function storeItems(store){const L=level();
  if(store==='furniture')return Object.entries(MODELS).map(([k,v])=>({id:k,en:k,em:v.em,price:v.price,lock:L<v.lvl?v.lvl:0}));
  if(store==='clothes')return Object.entries(ACC).map(([k,v])=>({id:k,en:CH[v[0]].find(x=>x[0]===k)[2],em:v[2],price:v[1],own:P.ward.includes(k)}));
  if(store==='pets')return Object.entries(PETS).map(([k,v])=>({id:k,en:k,em:v.em,price:v.price,lock:L<v.lvl?v.lvl:0,own:P.pets.includes(k)}));
  if(store==='market')return GOODS.map(g=>({id:g.en,en:g.en,em:g.em,price:g.price}));return[]}
const STORE={furniture:{face:'🛋️',hi:'Welcome! Beds, sofas, lamps... what do you need for your house?'},clothes:{face:'👗',hi:'Hello! Do you want to look fabulous today?'},
  pets:{face:'🐾',hi:'Hi! All my pets are looking for a friend.'},market:{face:'🧺',hi:'Good morning! Fresh fruit and vegetables!'}};
function openBuilding(id){if(id==='bank'){openBank(true);return}if(id==='bakery'){openJob('baker');return}if(id==='market'){openMarket();return}openStore(id)}
function openMarket(){PANEL='marketmenu';sheet(`<div class="npchead"><div class="face" style="background:#60A5FA33">🧺</div><div class="grow"><h2>${en('Market')}</h2><p class="sub">מכולת</p></div>${gemTag()}</div>
  <div class="mapgrid"><button data-a="store" data-v="market" style="background:#DBEAFE"><span class="ic">🛒</span>${en('Go shopping')}</button><button data-a="job" data-v="cashier" style="background:#FEF3C7"><span class="ic">🧾</span>${en('Work: Cashier')}</button></div>
  ${P.mission?`<p class="sub">🛒 יש לך רשימת קניות מ־Mrs. Kim: ${en(P.mission.short)}</p>`:'<p class="sub">רוצה רשימת קניות עם פרס? Mrs. Kim עומדת ליד המכולת.</p>'}<button class="btn ghost" data-a="close">סגירה</button>`)}
function openJob(kind){PANEL='jobinfo';const J=JOBINFO[kind];sheet(`<div class="npchead"><div class="face" style="background:var(--soft)">${J.face}</div><div class="grow"><h2>${en(J.en)}</h2><p class="sub">${J.he}</p></div>${gemTag()}</div>
  <div class="bubble">${en(kind==='baker'?'We need help in the bakery! Listen to each customer and give them exactly what they ask for.':'We need a cashier! Help each customer and give the right change.')}</div>
  <ul class="list"><li><span>${en('Salary')} · משכורת</span><b>💎 ${5+level()} + ${J.per} ${en('per happy customer')}</b></li><li><span>משמרת</span><b>4 ${en('customers')}</b></li></ul>
  <div class="row"><button class="btn sun" data-a="shift" data-v="${kind}">${en("Let's work!")} 💼</button><button class="btn ghost" data-a="close">סגירה</button></div>`);say(kind==='baker'?'We need help in the bakery!':'We need a cashier!')}
function openStore(store){PANEL='store';if(!CART||CART.store!==store)CART={store,items:{}};const items=storeItems(store);const S=STORE[store];const B=BUILDINGS.find(b=>b.id===store);
  const lines=Object.entries(CART.items).filter(([,q])=>q>0);
  sheet(`<div class="npchead"><div class="face" style="background:${B.color}33">${S.face}</div><div class="grow"><h2>${en(B.en)}</h2><p class="sub">${B.he}</p></div>${gemTag()}</div>
    <div class="bubble" style="font-size:16px">${en(S.hi)}</div>
    <div class="goods">${items.map(it=>{const q=CART.items[it.id]||0;const dis=it.lock||it.own;return`<button class="good ${dis?'lock':''}" data-a="addcart" data-v="${esc(it.id)}">${q?`<span class="q">${q}</span>`:''}<span class="em">${it.em}</span>${en(it.en)}<span class="pr">${it.own?'✓ '+'יש לך':it.lock?'🔒 Level '+it.lock:'💎 '+it.price}</span></button>`}).join('')}</div>
    ${lines.length?`<div class="cart"><h3>🛒 ${en('My cart')}</h3>${lines.map(([id,q])=>{const it=items.find(x=>x.id===id);return`<div class="line"><span>${it.em} ${en(it.en)} ${q>1?'×'+q:''}</span><span><b>💎 ${it.price}${q>1?' × '+q:''}</b> <button class="btn ghost mini" style="padding:2px 8px" data-a="rmcart" data-v="${esc(id)}" aria-label="להוציא">−</button></span></div>`}).join('')}
      <button class="btn gem" data-a="checkout">${en('Checkout')} 🧾</button></div>`:'<p class="sub">נוגעים במוצר כדי להוסיף לעגלה.</p>'}
    <button class="btn ghost" data-a="close">${en('Bye!')}</button>`);if(!openStore.last||openStore.last!==store){say(S.hi);openStore.last=store}}
function checkout(){const items=storeItems(CART.store);const lines=Object.entries(CART.items).filter(([,q])=>q>0).map(([id,q])=>({it:items.find(x=>x.id===id),q}));
  const total=lines.reduce((s,l)=>s+l.it.price*l.q,0);if(!lines.length)return;
  const multi=lines.length>1||lines[0].q>1;const easy=P.sk.math<2.5&&!multi;const note=[5,10,20,50,100,200,500].find(v=>v>total)||total+50;
  payCart(lines,total);return;
  const ask=multi?`What is the total?`:`It costs ${total} gems. You pay with ${note}. How much change do you get?`;const ans=multi?total:note-total;
  PANEL='checkout';PANEL_DATA={lines,total,ans,ask,opts:numOpts(ans),wrong:null};renderCheckout();say(multi?'What is the total, please?':ask)}
function renderCheckout(){const d=PANEL_DATA;sheet(`<div class="npchead"><div class="face" style="background:#FDE68A">🧑‍💼</div><div class="grow"><h2>${en('Checkout')}</h2><p class="sub">קופה</p></div>${gemTag()}</div>
  <div class="cart">${d.lines.map(l=>`<div class="line"><span>${l.it.em} ${en(l.it.en)}</span><b>💎 ${l.it.price}${l.q>1?' × '+l.q:''}</b></div>`).join('')}</div>
  <div class="bubble">${en(d.ask)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(d.ask)}">🔊</button><button class="btn ghost mini" data-a="hint">💡</button></div>
  <div class="hint" id="hintTxt" hidden>${d.lines.length>1||d.lines[0].q>1?'מחברים את כל המחירים (וכופלים כשיש כמה מאותו דבר)':'מהסכום ששילמת מורידים את המחיר'}</div>
  <div class="opts">${d.opts.map((o,i)=>`<button class="opt ${d.wrong===o.val?'no':''}" data-a="coans" data-i="${i}">💎 ${o.html}</button>`).join('')}</div><button class="btn ghost" data-a="backstore">חזרה לחנות</button>`)}
function payCart(lines,total){if(P.gems<total){say("Oh no! You don't have enough gems.");toast(`חסרים ${fmt(total-P.gems)} 💎. אפשר למשוך מהבנק, לעבוד בעיירה או לוותר על משהו`);openStore(CART.store);return}
  const store=CART.store;P.gems-=total;logm('קנייה ב'+BUILDINGS.find(b=>b.id===store).he,'Shopping',-total);
  lines.forEach(({it,q})=>{if(store==='furniture')P.inv[it.id]=(P.inv[it.id]||0)+q;if(store==='clothes'&&!P.ward.includes(it.id))P.ward.push(it.id);
    if(store==='pets'&&!P.pets.includes(it.id)){P.pets.push(it.id);P.pet=it.id;rebuildPet();pushPresence(true)}if(store==='market')P.pantry[it.id]=(P.pantry[it.id]||0)+q});
  let missionMsg='';if(store==='market'&&P.mission){const m=P.mission.items;const ok=Object.keys(m).length===lines.length&&lines.every(l=>m[l.it.id]===l.q);
    if(ok){const rw=P.mission.reward;P.gems+=total+rw;logm('רשימת קניות של Mrs. Kim','Shopping list',total+rw);missionMsg=`<p class="plus" style="font-family:var(--f-display);font-size:18px;margin:0">✅ ${en('Mrs. Kim paid you back + '+rw+' gems!')}</p>`;
      P.mission=null;learnResult('vocab',true);addXp(30);adventure();setTimeout(()=>{burst('🛒 +'+rw+' 💎');sfx.win();say('You got everything on the list! Thank you!')},300)}
    else missionMsg=`<p class="sub">זה לא בדיוק מה שהיה ברשימה של Mrs. Kim, אז היא לא מחזירה את הכסף. אפשר לנסות שוב.</p>`}
  CART={store,items:{}};save();renderHud();sfx.coin();PANEL='receipt';
  say(`That's ${total} gems. Thank you!`);sheet(`<h2>${en('Thank you!')} 🧾</h2><div class="receipt"><div><b>${esc(BUILDINGS.find(b=>b.id===store).en.toUpperCase())}</b><span>RECEIPT</span></div>${lines.map(l=>`<div><span>${esc(l.it.en)} ${l.q>1?'x'+l.q:''}</span><span>${l.it.price*l.q}</span></div>`).join('')}<div><b>TOTAL</b><b>${total} gems</b></div></div>
    ${missionMsg}${store==='furniture'?`<p class="sub">הרהיטים מחכים במלאי. בבית בוחרים 🛋️ רהיטים ומציבים.</p>`:store==='clothes'?`<p class="sub">אפשר ללבוש ב־🎨 עיצוב הדמות.</p>`:store==='pets'?`<p class="sub">החיה החדשה הולכת איתך לכל מקום!</p>`:''}
    <div class="row"><button class="btn" data-a="close">${en('Bye!')}</button><button class="btn ghost" data-a="store" data-v="${store}">להמשיך לקנות</button></div>`)}

/* --- Mrs. Kim shopping lists --- */
function genMission(){const t=tierFor(P.sk.vocab);const k=clamp(t,1,4);const goods=shuffle(GOODS.filter(g=>g.tr<=t+1)).slice(0,k);const items={};goods.forEach(g=>items[g.en]=t===1?1:rnd(1,Math.min(4,t+1)));
  const ph=g=>goodPh(g.en,items[g.en]);
  const list=goods.map(ph);let text;if(t===1)text=`Please buy ${list[0]} for me.`;else if(t===2)text=`Can you buy ${listEn(list)}?`;else if(t===3)text=`I'm making dinner. I need ${listEn(list)}.`;
  else text=`My shopping list: ${listEn(list)}. Please don't buy anything else!`;
  return{items,text,short:goods.map(g=>items[g.en]+' '+g.em).join(' '),he:goods.map(g=>items[g.en]+' × '+g.he).join(' · '),reward:6+t*3}}
function openKim(){PANEL='kim';if(P.mission){const m=P.mission;sheet(`${npcHead('kim')}<div class="bubble">${en(m.text)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(m.text)}">🔊</button><button class="btn ghost mini" data-a="hint">💡</button></div>
    <div class="hint" id="hintTxt" hidden>${esc(m.he)}</div><p class="sub">קונים בדיוק את מה שברשימה ב־${en('Market')}, ו־Mrs. Kim מחזירה את הכסף ועוד 💎${m.reward}.</p>
    <div class="row"><button class="btn" data-a="store" data-v="market">${en('To the market!')} 🛒</button><button class="btn ghost mini" data-a="dropmission">לוותר</button></div>`);say(m.text);return}
  const m=genMission();PANEL_DATA=m;sheet(`${npcHead('kim')}<div class="bubble">${en('Hello dear! '+m.text)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(m.text)}">🔊</button><button class="btn ghost mini" data-a="hint">💡</button></div>
    <div class="hint" id="hintTxt" hidden>${esc(m.he)}</div><div class="opts one"><button class="opt" data-a="takemission">${en("Sure, I'll go shopping!")}</button><button class="opt" data-a="close">${en('Sorry, not now.')}</button></div>`);say('Hello dear! '+m.text)}

/* --- avatar editor with wardrobe locks --- */
const CH_LABELS={shape:'צורת גוף',pat:'דוגמה',eyes:'עיניים',mouth:'פה',ears:'על הראש',back:'מאחור',hat:'כובע'};
const BOTC=[['#3B4A75','navy'],['#4F7CC2','denim'],['#1F2937','black'],['#FFFFFF','white'],['#B08968','beige'],...COLORS];
function openAvatar(){PANEL='avatar';const c=P.ch;const girl=c.g==='girl';
  const sec=(h,body)=>`<div style="display:flex;flex-direction:column;gap:6px"><h3>${h}</h3><div class="chips">${body}</div></div>`;
  const sw=(k,list)=>list.map(([v,e,he,pr])=>{const lock=pr&&!salonOwned(k+':'+v);return`<button class="sw ${lock?'lk':''}" style="background:${v}" data-a="${lock?'salon':'ch'}" data-k="${k}" data-v="${v}" data-t="${e}" aria-pressed="${c[k]===v}" aria-label="${he||e}${lock?' · 💎'+pr:''}">${lock?'<span>🔒</span>':''}</button>`}).join('');
  const hairChip=([id,[he,e,,pr]])=>{const lock=pr&&!salonOwned('hair:'+id);return`<button class="ochip ${lock?'lock':''}" data-a="${lock?'salon':'ch'}" data-k="hair" data-v="${id}" data-t="${e}" aria-pressed="${c.hair===id}">${he}${en(e)}${lock?`<span class="tag">🔒 💎${pr}</span>`:''}</button>`};
  const mine=Object.entries(HAIRS).filter(([,v])=>v[2]===c.g),other=Object.entries(HAIRS).filter(([,v])=>v[2]!==c.g);
  const acc=k=>CH[k].filter(([v])=>k==='hat'||v==='none'||v==='wings').map(([v,he,e])=>{const lock=ACC[v]&&!P.ward.includes(v);return`<button class="ochip ${lock?'lock':''}" data-a="ch" data-k="${k}" data-v="${v}" data-t="${e}" aria-pressed="${c[k]===v}">${he}${en(e)}${lock?`<span class="tag">🔒 💎${ACC[v][1]}</span>`:''}</button>`}).join('');
  sheet(`<div class="preview" id="pv">${charSVG(c)}</div><input class="txt" id="nm" dir="auto" maxlength="14" placeholder="שם במשחק" value="${esc(P.name)}" aria-label="שם במשחק">
    ${sec('אני',`<button class="ochip big" data-a="ch" data-k="g" data-v="girl" data-t="girl" aria-pressed="${girl}">👧 בת${en('girl')}</button><button class="ochip big" data-a="ch" data-k="g" data-v="boy" data-t="boy" aria-pressed="${!girl}">👦 בן${en('boy')}</button>`)}
    ${sec('צבע עור',sw('skin',SKINS))}
    ${sec(girl?'תסרוקות לבנות 💇‍♀️':'תספורות לבנים 💇‍♂️',mine.map(hairChip).join(''))}
    <details class="more"><summary>${girl?'עוד תספורות (קצרות)':'עוד תסרוקות (ארוכות)'}</summary><div class="chips">${other.map(hairChip).join('')}</div></details>
    ${sec('צבע שיער',sw('hc',HAIRC))}
    <p class="sub">🔒 תסרוקות וצבעים נעולים קונים ביהלומים: נוגעים פעם אחת לראות מחיר, ופעם שנייה לקנות.</p>
    ${sec('חולצה',sw('top',COLORS))}
    ${sec('למטה',Object.entries(BOTTOMS).map(([v,[he,e]])=>`<button class="ochip" data-a="ch" data-k="bot" data-v="${v}" data-t="${e}" aria-pressed="${c.bot===v}">${he}${en(e)}</button>`).join(''))}
    ${c.bot==='dress'?'':sec(c.bot==='skirt'?'צבע החצאית':'צבע המכנסיים',sw('bc',BOTC))}
    ${sec('עיניים',Object.entries(HEYES).map(([v,[he,e]])=>`<button class="ochip" data-a="ch" data-k="eyes" data-v="${v}" data-t="${e}" aria-pressed="${c.eyes===v}">${he}${en(e)}</button>`).join(''))}
    ${sec('אביזרים',acc('hat')+acc('back'))}
    ${P.pets.length?sec('חיית המחמד שלי',['none',...P.pets].map(k=>`<button class="ochip" data-a="setpet" data-v="${k}" aria-pressed="${(P.pet||'none')===k}">${k==='none'?'—':PETS[k].em}${en(k==='none'?'no pet':k)}</button>`).join('')):''}
    <button class="btn" data-a="avdone">${en('Looking good!')} ✨</button>`)}
function salonBuy(b,k,v){const pr=k==='hair'?hairPrice(v):hcPrice(v);const key=k+':'+v;if(salonOwned(key))return true;
  if(!b.dataset.sure){document.querySelectorAll('[data-sure]').forEach(x=>{delete x.dataset.sure;x.classList.remove('ask')});b.dataset.sure='1';b.classList.add('ask');
    const nm=k==='hair'?HAIRS[v][1]:(HAIRC.find(x=>x[0]===v)||[])[1];say(nm);toast(`💇 ${k==='hair'?'תסרוקת':'צבע שיער'} ב־💎${pr}. נוגעים שוב כדי לקנות`);return false}
  if(P.gems<pr){toast(`חסרים ${fmt(pr-P.gems)} 💎. אפשר להרוויח בעבודה בעיירה או למשוך מהבנק`);sfx.bad();return false}
  P.gems-=pr;P.salon.push(key);logm('מספרה: '+(k==='hair'?HAIRS[v][0]:'צבע שיער'),'Hair salon',-pr);sfx.coin();burst('💇 −'+pr+' 💎');renderHud();return true}

/* --- map --- */
function openMap(){PANEL='map';sheet(`<h2>לאן הולכים? 🗺️</h2><div class="mapgrid">
  <button data-a="goto" data-v="island" style="background:#DCFCE7"><span class="ic">🏝️</span>${en("Shirel's Island")}</button><button data-a="goto" data-v="town" style="background:#DBEAFE"><span class="ic">🏙️</span>${en('Town')}</button>
  <button data-a="goto" data-v="home" style="background:#FEF3C7"><span class="ic">🏠</span>${en('My House')}</button><button data-a="goto" data-v="work" style="background:#FCE7F3"><span class="ic">🛠️</span>${en('Workshop')}</button><button data-a="goto" data-v="city" style="background:#CFFAFE"><span class="ic">🌊</span>${en('Ashkelon')}</button><button data-a="goto" data-v="girls" style="background:#FCE7F3"><span class="ic">🌸</span>${en("Girls' Garden")}</button><button data-a="goto" data-v="boys" style="background:#DBEAFE"><span class="ic">⚽</span>${en('Sports Park')}</button>
  ${VISIT&&VISIT.house?`<button data-a="goto" data-v="visit" style="background:#EDE9FE"><span class="ic">🔑</span>${en('Visit '+(VISIT.name||'friend'))}</button>`:''}</div>
  <p class="sub">הכל מחובר ואפשר ללכת ברגל: מהאי לעיירה על הגשר 🌉, מהעיירה לאשקלון בשדרות בן גוריון 🌴, ומאשקלון דרומה לגן הבנות ולפארק הספורט, שמחוברים בשער החברים 🌈. אפשר גם לנסוע באוטובוס 🚌</p><button class="btn ghost" data-a="close">סגירה</button>`)}

/* --- workshop save --- */
function openSaveFurn(){if(!P.ws.length){toast('קודם בונים רהיט מצורות על השולחן של הסדנה');return}PANEL='savefurn';PANEL_DATA={word:null};
  sheet(`<h2>מה בנית? 🛠️</h2><p class="sub">בוחרים שם באנגלית לרהיט החדש (${P.ws.length} צורות)</p><div class="chips">${FURN_WORDS.map(w=>`<button class="ochip" data-a="fword" data-v="${w}">${en(w)}</button>`).join('')}</div>
    <div class="row"><button class="btn" data-a="dosavefurn" disabled id="sfBtn">💾 ${en('Save')}</button><button class="btn ghost" data-a="close">ביטול</button></div>`)}
function doSaveFurn(){const w=PANEL_DATA.word;if(!w)return;const id='cf_'+uid6().slice(0,6);P.furn[id]={n:w,parts:P.ws.map(p=>[p.s,p.c,p.sz,p.x,p.y,p.z,p.r])};
  P.inv[id]=(P.inv[id]||0)+1;clearScope('W');P.ws=[];save();closeSheet();burst('🛠️ '+w+'!');sfx.win();say('Your new '+w+' is ready!');addXp(15);toast('הרהיט נשמר! מציבים אותו בבית עם 🛋️ רהיטים')}

/* --- settings --- */
function openSettings(){PANEL='settings';const L=Object.keys(P.learned);
  sheet(`<h2>הגדרות</h2><div class="row"><button class="btn ghost mini" data-a="sound">${P.sound?'🔊 צלילים פועלים':'🔇 צלילים כבויים'}</button>${window.CLOUD&&CLOUD.user?'<button class="btn ghost mini" data-c="logout">יציאה מהחשבון</button>':'<button class="btn ghost mini" data-a="tocode">להחליף קוד חבורה</button>'}<button class="btn ghost mini" data-a="avatar">🎨 עיצוב דמות</button></div>
    ${window.CLOUD&&CLOUD.on?`<p class="sub">${CLOUD.gid?'החבורה: '+esc(CLOUD.gname||''):'משחק לבד'} · רק ילדים שאושרו על ידי מנהל החבורה רואים אחד את השני.</p>`:`<p class="sub">קוד החבורה: ${en(P.code)}. רק מי שמקליד בדיוק את אותו קוד נכנס לאותו עולם.</p>`}
    <details><summary style="font-family:var(--f-display);font-size:17px;cursor:pointer">🔒 פינת הורים</summary>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px"><p class="sub">מה תורגל בלי להרגיש: הרמות עולות לבד לפי התשובות (1–10), בלי קשר לגיל.</p>
      <ul class="list">${Object.entries({vocab:'אוצר מילים',listen:'הבנת הנשמע',spell:'איות',sentence:'בניית משפטים',talk:'שיחה',math:'חשבון וכסף'}).map(([k,v])=>`<li><span>${v}</span><b>${P.sk[k].toFixed(1)} / 10</b></li>`).join('')}
      <li><span>מילים שנלמדו</span><b>${L.length}</b></li><li><span>הרפתקאות</span><b>${P.adv}</b></li><li><span>משמרות עבודה</span><b>${P.shifts}</b></li><li><span>כוכבי בטיחות 🚦</span><b>${P.badges.safe}</b></li><li><span>חדרי בריחה 🔐</span><b>${P.badges.escape}</b></li><li><span>תיירים שהדריכה 🧳</span><b>${P.badges.tour}</b></li><li><span>חיסכון בבנק</span><b>💎 ${fmt(P.savings)}</b></li></ul>
      ${L.length?`<p class="sub" dir="ltr" style="text-align:left">${L.slice(-40).map(esc).join(' · ')}</p>`:''}
      <button class="btn ghost mini" data-a="reset">איפוס המשחק במכשיר הזה</button><div id="resetBox"></div></div></details>
    <button class="btn" data-a="close">סגירה</button>`)}

/* --- money question helper (real-life math before paying) --- */
function openMoneyQ(o){PANEL='moneyq';PANEL_DATA=Object.assign({opts:numOpts(o.ans),wrong:null},o);renderMoneyQ();say(o.ask)}
function renderMoneyQ(){const d=PANEL_DATA;sheet(`${d.head}<div class="bubble">${en(d.ask)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(d.ask)}">🔊</button><button class="btn ghost mini" data-a="hint">💡</button></div>
  <div class="hint" id="hintTxt" hidden>${esc(d.hint)}</div><div class="opts">${d.opts.map((o,i)=>`<button class="opt ${d.wrong===o.val?'no':''}" data-a="mq" data-i="${i}">💎 ${o.html}</button>`).join('')}</div><button class="btn ghost" data-a="close">ביטול</button>`)}

/* --- Dana: land for sale + loans --- */
function openPlot(id){PANEL='plot';const head=npcHead('dana',gemTag());
  if(!id){sheet(`${head}<div class="bubble">${en('Hello! I sell land in Ashkelon. Land near the sea costs more. Which plot do you like?')}</div>
    <ul class="list">${PLOTSC.map(pl=>{const o=plotOwner(pl.id);return`<li><span>${en(pl.en)} · ${pl.he}</span>${o?`<b>${o.me?'🏡 שלך':esc(o.name)}</b>`:`<button class="btn sun mini" data-a="plot" data-v="${pl.id}">💎 ${pl.price}</button>`}</li>`}).join('')}</ul>
    <p class="sub">${P.loan?'יש לך כבר הלוואה פתוחה. אפשר לקנות עוד מגרש רק במזומן.':'אפשר לשלם הכל עכשיו, או לקחת הלוואה מ־Bear Bank ולשלם בתשלומים.'}</p><button class="btn ghost" data-a="close">${en('Thanks, Dana!')}</button>`);say('Hello! I sell land in Ashkelon.');return}
  const pl=PLOTSC.find(x=>x.id===id);const o=plotOwner(id);
  if(o){sheet(`${head}<div class="bubble">${en(o.me?'This land is yours! Use build mode to build your dream house here.':'Sorry, '+o.name+' already owns this land.')}</div><button class="btn" data-a="close">OK</button>`);say(o.me?'This land is yours!':'Sorry, this land is sold.');return}
  const down=pl.price/4,pay=Math.ceil(pl.price*.75*1.1/5);
  sheet(`${head}<div class="bubble">${en(`${pl.en} costs ${pl.price} gems. ${pl.price>=120?'It is right on the beach!':pl.price>=80?'It is in the center, near the park.':'It is a quiet place, far from the sea.'}`)}</div>
    <ul class="list"><li><span>💎 לשלם הכל עכשיו ${en('Pay now')}</span><b>${pl.price}</b></li>
    <li><span>🏦 הלוואה ${en('Loan')}: עכשיו 25%, ואז 5 תשלומים (עם 10% ריבית)</span><b class="en" dir="ltr">${down} + 5×${pay}</b></li></ul>
    <p class="sub">שימו לב: עם הלוואה משלמים בסוף ${down+pay*5} במקום ${pl.price}. ככה עובדת ריבית על הלוואה.</p>
    <div class="row"><button class="btn sun" data-a="buyplot" data-v="${id}" data-m="cash">💎 ${en('Pay now')}</button>${P.loan?'':`<button class="btn gem" data-a="buyplot" data-v="${id}" data-m="loan">🏦 ${en('Take a loan')}</button>`}<button class="btn ghost" data-a="close">${en('Not now')}</button></div>`);say(`${pl.en} costs ${pl.price} gems.`)}
function buyPlot(id,mode){const pl=PLOTSC.find(x=>x.id===id);if(plotOwner(id))return;const head=npcHead('dana',gemTag());
  if(mode==='cash'){if(P.gems<pl.price){say("You don't have enough gems.");toast(`חסרים ${fmt(pl.price-P.gems)} 💎. אפשר למשוך מהבנק, לחסוך או לקחת הלוואה`);return}
    const finish=()=>{P.gems-=pl.price;logm('קניית מגרש: '+pl.he,'Land',-pl.price);gotPlot(pl)};
    finish();return}
  const down=pl.price/4;if(P.gems<down){toast(`למקדמה צריך ${down} 💎`);return}const pay=Math.ceil(pl.price*.75*1.1/5);
  P.gems-=down;P.loan={left:5,pay,plot:id};logm('מקדמה על מגרש: '+pl.he,'Down payment',-down);gotPlot(pl);
  setTimeout(()=>toast(`🏦 שילמת מקדמה של ${down} 💎 (רבע מהמחיר). ההלוואה תשולם ב־5 תשלומים של ${pay} 💎, אחד אחרי כל הרפתקה`),1600)}
function gotPlot(pl){P.plots.push(pl.id);save();closeSheet();updatePlotSigns();pushPresence(true);renderBar();renderHud();setNpcMarks();sfx.win();burst('🏡 '+pl.en+'!');say('Congratulations! This land is yours! Now you can build on it.');addXp(30)}

/* --- Tom the tourist --- */
function openTom(){PANEL='tom';const head=npcHead('tom');
  if(P.tour){sheet(`${head}<div class="bubble">${en(`I'm following you! Please take me to the ${P.tour.dest}.`)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc('Please take me to the '+P.tour.dest)}">🔊</button></div>
    <div class="row"><button class="btn" data-a="close">${en("Let's go!")}</button><button class="btn ghost mini" data-a="droptour">לוותר</button></div>`);return}
  const dest=pick(Object.keys(ANCHORS));PANEL_DATA=dest;const t=tierFor(P.sk.listen);
  const line=t<=2?`Hello! Where is the ${dest}? Can you take me there?`:t<=3?`Excuse me! I'm lost. I want to go to the ${dest}. Can you show me the way?`:`Hi there! I'm visiting Ashkelon and I'm totally lost. Could you please walk with me to the ${dest}?`;
  sheet(`${head}<div class="bubble">${P.sk.listen>=7?`<span id="npcTxt" hidden>${en(line)}</span><span id="npcHid">🎧 …</span>`:en(line)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(line)}">🔊</button>${P.sk.listen>=7?'<button class="btn ghost mini" data-a="reveal">👀</button>':''}<button class="btn ghost mini" data-a="hint">💡</button></div>
    <div class="hint" id="hintTxt" hidden>Tom רוצה שתיקחי אותו ל: ${esc({beach:'החוף',marina:'המרינה (הנמל עם הסירות)','national park':'הגן הלאומי (העמודים העתיקים)',mall:'הקניון',school:'בית הספר'}[dest])}</div>
    <div class="opts one"><button class="opt" data-a="taketour">${en('Sure! Follow me!')}</button><button class="opt" data-a="close">${en("Sorry, I can't now.")}</button></div>`);say(line)}
const TOM_HOME=[NPCS.find(n=>n.id==='tom').x,NPCS.find(n=>n.id==='tom').z];
function tourDone(){const rw=10+tierFor(P.sk.listen)*3;P.tour=null;P.badges.tour++;learnResult('listen',true);addGems(rw,'הדרכת תייר','Tour guide');addXp(30);sfx.win();burst('🧳 +'+rw+' 💎');say('We are here! Thank you so much, you are a great guide!');
  const t=NPCOBJ.tom;t.position.set(CX+TOM_HOME[0],0,CZ+TOM_HOME[1]);adventure();save();renderQuestChip();setNpcMarks()}

/* --- Officer Sam: real safety rules --- */
function openSam(){PANEL='sam';const head=npcHead('sam');
  sheet(`${head}<div class="bubble">${en(P.safeTask?'Go to the crosswalk. Wait for the GREEN man, then tap the white stripes to cross.':"Hi! I'm Officer Sam. I teach kids how to stay safe in the city. Ready for a challenge?")}</div>
    <div class="row"><button class="spk" data-a="sayt" data-t="${esc(P.safeTask?'Wait for the green man, then cross.':"Hi! I'm Officer Sam. Ready for a challenge?")}">🔊</button></div>
    <div class="opts one">${P.safeTask?'':`<button class="opt" data-a="safetask">🚦 ${en('The crosswalk challenge')}</button>`}<button class="opt" data-a="safeq">❓ ${en('A safety question')}</button></div>
    <p class="sub">כוכבי בטיחות: ${'⭐'.repeat(Math.min(P.badges.safe,10))||'עוד אין'}</p><button class="btn ghost" data-a="close">${en('Bye, Sam!')}</button>`);if(!P.safeTask)say("Hi! I'm Officer Sam. Ready for a challenge?")}
function crossTap(id,pt){const c=CROSS[id];
  if(!P.safeTask){walkTo(pt);return}
  if(!PEDGREEN){sfx.bad();say('Stop! The light is red. Wait for the green man.');toast('🔴 אדום! עוצרים ומחכים לאיש הירוק');return}
  const side=ME.pos.x-CX<c.x?1:-1;ME.path=[new THREE.Vector3(CX+c.x-side*2.6,0,CZ+c.z),new THREE.Vector3(CX+c.x+side*2.6,0,CZ+c.z)];
  P.safeTask=false;P.badges.safe++;addGems(10,'אתגר מעבר חצייה','Safety star');addXp(20);sfx.win();burst('🚦⭐');say('Great! You waited for the green light. Well done!');save();renderQuestChip();setNpcMarks();}

/* --- Sea Tower escape room --- */
function openEscape(){PANEL='escape';sheet(`<div class="npchead"><div class="face" style="background:#FEE2E2">🔐</div><div class="grow"><h2>${en('Sea Tower Escape')}</h2><p class="sub">חדר בריחה במגדל הים</p></div></div>
  <div class="bubble">${en('Oh no! The door of the Sea Tower closed behind you. Open three magic locks in three minutes to escape!')}</div>
  <ul class="list"><li><span>⏱️ זמן</span><b>3:00</b></li><li><span>🔐 מנעולים</span><b>3</b></li><li><span>🏆 פרס</span><b>💎 ${25+level()*2}</b></li></ul>
  <div class="row"><button class="btn sun" data-a="escape">${en("Let's escape!")} 🗝️</button><button class="btn ghost" data-a="close">${en('Not now')}</button></div>`);say('Oh no! The door closed behind you!')}
function escQ(){const t=pick(['spell','math','sentence','listen','vocab']);return makeQ(t,P.sk[t])}
let escTimer=null;
function startEscape(){USED=new Set();const qs=[escQ(),escQ(),escQ()];PANEL='job';PZ={series:{kind:'escape',qs,i:0,res:[],deadline:Date.now()+180000},answered:null,built:[],counts:null,q:qs[0]};prepQ();renderSeries();
  if(PZ.q.sayFirst)setTimeout(()=>say(PZ.q.sayFirst),300);clearInterval(escTimer);escTimer=setInterval(()=>{if(!PZ||!PZ.series||PZ.series.kind!=='escape'){clearInterval(escTimer);return}
    const S=PZ.series;const left=Math.max(0,S.deadline-Date.now());const el=$('#escT');if(el)el.textContent='⏱️ '+Math.floor(left/60000)+':'+String(Math.floor(left/1000)%60).padStart(2,'0');
    if(left<=0&&S.i<S.qs.length){S.failed=true;clearInterval(escTimer);renderSeries();say('Time is up! Try again later.')}},500)}

/* --- mall, bus, people --- */
function openMall(){PANEL='mall';sheet(`<div class="npchead"><div class="face" style="background:#FCE7F3">🛍️</div><div class="grow"><h2>${en('Ashkelon Mall')}</h2><p class="sub">קניון</p></div>${gemTag()}</div>
  <div class="mapgrid"><button data-a="store" data-v="furniture" style="background:#FEF3C7"><span class="ic">🛋️</span>${en('Furniture')}</button><button data-a="store" data-v="clothes" style="background:#FCE7F3"><span class="ic">👗</span>${en('Clothes')}</button>
  <button data-a="store" data-v="pets" style="background:#DCFCE7"><span class="ic">🐾</span>${en('Pets')}</button><button data-a="store" data-v="market" style="background:#DBEAFE"><span class="ic">🧺</span>${en('Supermarket')}</button></div>
  <p class="sub">💡 טיפ של Officer Sam: מי שהולך לאיבוד בקניון פונה למאבטח או לקופאית.</p><button class="btn ghost" data-a="close">סגירה</button>`);say('Welcome to the mall!')}
const hm=m=>`8:${String(m).padStart(2,'0')}`;
function openBus(id){const dest=id==='town'?'city':'town';rideBus(dest)}
function renderBus(){const d=PANEL_DATA;sheet(`<div class="npchead"><div class="face" style="background:#DBEAFE">🚌</div><div class="grow"><h2>${en('Bus Stop')}</h2><p class="sub">לוח זמנים</p></div></div>
  <div class="bubble">${en(d.ask)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(d.ask)}">🔊</button><button class="btn ghost mini" data-a="hint">💡</button></div><div class="hint" id="hintTxt" hidden>${esc(d.hint)}</div>
  <div class="opts">${d.opts.map((o,i)=>`<button class="opt ${d.wrong===o.val?'no':''}" data-a="busans" data-i="${i}">${o.html}</button>`).join('')}</div><button class="btn ghost" data-a="close">${en('I will walk')}</button>`)}
function rideBus(dest){closeSheet();burst('🚌 💨');blip(330,.2,'square',.05);setTimeout(()=>blip(392,.25,'square',.05),200);say(dest==='city'?'Next stop: Ashkelon!':'Next stop: Shapeland Town!');
  setTimeout(()=>{teleport(dest,dest==='city'?[-12.5,-3.5]:[5.5,10.5]);addXp(5)},700)}
const WLINES=["Hi! Nice to meet you!","Hello! What a sunny day!","Hi there! I love the beach in Ashkelon.","Hey! I'm going to the mall. See you!","Good morning! Do you like ice cream?","Hi! I like your hair!","Hello! The marina is so pretty today.","Hey! Let's play together later!"];
function talkWalker(i){const w=WALKERS[i];w.pause=8;PANEL='walker';const line=pick(WLINES);
  sheet(`<div class="npchead"><div class="face" style="background:var(--soft)">${charSVG(w.ch)}</div><div class="grow"><h2>${en(w.name)}</h2><p class="sub">${en('Someone in the street')}</p></div></div>
    <div class="bubble">${en(line)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(line)}">🔊</button></div>
    <div class="row"><button class="btn" data-a="close">${en('Bye!')} 👋</button><button class="btn ghost" data-a="wchat" data-v="${i}">💬 ${en('Chat')} <small dir="ltr" style="unicode-bidi:isolate">+3 💎</small></button></div>`);say(line)}
function chatWalker(i){const w=WALKERS[i];w.pause=8;USED=new Set();
  openPuzzle({head:`<div class="npchead"><div class="face" style="background:var(--soft)">${charSVG(w.ch)}</div><div class="grow"><h2>${en(w.name)}</h2><p class="sub">${en('Someone in the street')}</p></div></div>`,q:qTalk(P.sk.talk),reward:3})}

/* --- NPC routing & marks --- */
function talkTo(id){if(id==='dana')openPlot();else if(id==='tom')openTom();else if(id==='sam')openSam();else if(id==='bella')openBella();else if(id==='leo')openShop();else if(id==='mia')openMia();else if(id==='bear')openBank(true);else if(id==='kim')openKim()}
function setNpcMarks(){NPCOBJ.bella.userData.mk.visible=!P.quest;NPCOBJ.leo.userData.mk.visible=Object.keys(SHAPES).some(k=>!P.owned.includes(k)&&SHAPES[k].lvl<=level());NPCOBJ.mia.userData.mk.visible=true;
  NPCOBJ.bear.userData.mk.visible=P.savings>0||P.gems>=30;NPCOBJ.kim.userData.mk.visible=!P.mission;NPCOBJ.dana.userData.mk.visible=!P.plots.length;NPCOBJ.tom.userData.mk.visible=!P.tour;NPCOBJ.sam.userData.mk.visible=!P.badges.safe}
function setMode(m){MODE=m;renderBar();renderTray();if(m==='build')say('Build mode!')}
