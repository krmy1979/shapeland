/* Shapeland · a world by Shirel Yitzhak */
/* ===================== EVENTS ===================== */
document.addEventListener('click',e=>{const sh=$('#sheet');if(e.target===sh&&!(PZ&&(PZ.race||PZ.series))){closeSheet();return}
  const b=e.target.closest('[data-a]');if(!b||b.disabled)return;const a=b.dataset.a,d=b.dataset;
  KEEP=['mq','busans','cplus','cminus','tile','untile','clearb','addcart','rmcart','opt','check','serve','said','coans','pay','dep','wd','goal','sound'].includes(a);
  try{act(a,d)}finally{KEEP=false}});
function act(a,d){if(ACTX[a]){ACTX[a](d);return}
  switch(a){
   case'play':{const nm=$('#tName').value.trim().slice(0,14);const code=($('#tCode').value.trim()||'shirel-friends').toLowerCase().replace(/\s+/g,'-');
     if(!CODE_RE.test(code)){toast('קוד החבורה באנגלית או מספרים בלבד, למשל shirel-friends');break}P.name=nm||P.name||'Player';P.code=code;save();
     $('#title').hidden=true;$('#hudTop').hidden=false;$('#hudBot').hidden=false;rebuildMe();renderHouse('home',P.house);clearScope('H');P.house.pieces.forEach(p=>addPieceObj(p,'H','home',P.furn));
     clearScope('W');P.ws.forEach(p=>addPieceObj(p,'W','work',P.furn));renderExteriors();teleport('island');renderHud();setNpcMarks();say("Welcome to Shirel Yitzhak's World, "+spName()+'!');connect();
     if(!P.adv)setTimeout(()=>toast('👷‍♀️ Bella מחכה לך עם משימה ראשונה! לגעת בה'),2500);break}
   case'mode':setMode(d.v);break;
   case'sel':SEL[d.k]=d.v;if(d.k==='s'&&!P.owned.includes(d.v))openShop(d.v);say(d.v);renderTray();break;
   case'selitem':SEL.item=d.v;say(itemName(d.v,P.furn));renderTray();break;
   case'selroom':SEL.room=d.v;if(d.v!=='erase')say(ROOMS[d.v].en);renderTray();break;
   case'paintmode':SEL.paint=d.v;say(d.v);renderTray();break;
   case'paint':{const r=SEL.room;if(r==='erase')break;P.house.styles[r]=P.house.styles[r]||{};P.house.styles[r][SEL.paint]=PAINTS[d.v];say(d.v+' '+SEL.paint);houseChanged();renderTray();break}
   case'hcolor':P.house.color=d.v;save();renderExteriors();pushPresence(true);renderTray();toast('צבע הבית מבחוץ השתנה 🎨');break;
   case'rot':SEL.r=(SEL.r+1)%8;toast('↻ '+SEL.r*45+'°');break;
   case'avatar':openAvatar();break;
   case'avdone':closeSheet();if(!$('#title').hidden){$('#titleAv').innerHTML=charSVG(P.ch);break}rebuildMe();renderHud();pushPresence(true);renderExteriors();break;
   case'salon':{const btn=document.querySelector(`[data-a="salon"][data-k="${d.k}"][data-v="${d.v}"]`);if(!salonBuy(btn,d.k,d.v))break;P.ch[d.k]=d.v;save();KEEP=true;openAvatar();if(!$('#title').hidden)$('#titleAv').innerHTML=charSVG(P.ch);break}
   case'ch':{if(ACC[d.v]&&!P.ward.includes(d.v)){say(d.t);toast(`${d.t} נמכר ב־Clothes Shop בעיירה 👗`);break}P.ch[d.k]=d.v;say(d.t);
     if(d.k==='g'){const g=d.v;if(HAIRS[P.ch.hair][2]!==g)P.ch.hair=g==='girl'?'long':'short';if(g==='boy'&&(P.ch.bot==='skirt'||P.ch.bot==='dress'))P.ch.bot='pants';if(g==='girl'&&P.ch.bot==='pants')P.ch.bot='skirt'}
     save();if(d.k==='g'||d.k==='bot'){KEEP=true;openAvatar();if(!$('#title').hidden)$('#titleAv').innerHTML=charSVG(P.ch);break}$('#pv').innerHTML=charSVG(P.ch);
     document.querySelectorAll(`[data-a="ch"][data-k="${d.k}"]`).forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===d.v));if(!$('#title').hidden)$('#titleAv').innerHTML=charSVG(P.ch);break}
   case'wchat':chatWalker(+d.v);break;
   case'setpet':P.pet=d.v==='none'?null:d.v;save();rebuildPet();pushPresence(true);document.querySelectorAll('[data-a="setpet"]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===d.v));if(P.pet)say(P.pet);break;
   case'bank':openBank(true);break;
   case'arena':openArena();break;
   case'settings':openSettings();break;
   case'map':openMap();break;
   case'goto':closeSheet();if(d.v==='visit'&&!(VISIT&&VISIT.house))break;teleport(d.v);if(d.v==='home'||d.v==='visit')sfx.door();if(d.v==='work')say('Welcome to the workshop! Build something new.');break;
   case'close':closeSheet();break;
   case'sayt':say(d.t);break;
   case'sayq':if(PZ&&PZ.q)say(PZ.q.sayFirst||PZ.q.sayText||PZ.q.sayAfter);break;
   case'sayans':if(PZ&&PZ.q)say(PZ.q.sayAfter);break;
   case'hint':{const t=$('#hintTxt');if(t)t.hidden=false;break}
   case'reveal':{const t=$('#npcTxt'),h=$('#npcHid');if(t){t.hidden=false;h.hidden=true}break}
   case'qhint':{if(P.quest)P.quest.hint=true;const t=$('#qh');if(t)t.hidden=false;save();break}
   case'nqhint':{if(PANEL_DATA)PANEL_DATA.hint=true;const t=$('#qh');if(t)t.hidden=false;break}
   case'takeq':P.quest=PANEL_DATA;P.quest.start=Date.now();save();closeSheet();renderQuestChip();setNpcMarks();if(MODE!=='build'&&ME.zone!=='town')setMode('build');say("Great! Let's build!");break;
   case'dropq':P.quest=null;save();closeSheet();renderQuestChip();setNpcMarks();break;
   case'questinfo':openBella();break;
   case'mission':openKim();break;
   case'takemission':P.mission=PANEL_DATA;save();closeSheet();renderQuestChip();setNpcMarks();say('Thank you, dear!');break;
   case'dropmission':P.mission=null;save();closeSheet();renderQuestChip();setNpcMarks();break;
   case'shop':openShop();break;
   case'buyshape':buyShape(d.v);break;
   case'pay':{const{k,pz}=PANEL_DATA;const o=pz.opts[+d.i];if(o.val!==pz.ans){PANEL_DATA.wrong=o.val;learnResult('math',false);sfx.bad();say("Hmm, that's not the right price. Try again!");renderBuy();break}
     const price=SHAPES[k].price;learnResult('math',true);if(P.gems<price){say("That's right! But you need more gems.");toast(`נכון! אבל חסרים ${fmt(price-P.gems)} 💎. אפשר למשוך מהבנק או לעבוד בעיירה`);break}
     P.gems-=price;P.owned.push(k);logm('קנייה: '+k,'Shopping',-price);SEL.s=k;save();sfx.win();burst(shapeIcon(k,'#fff').replace('<svg','<svg style="width:90px;height:90px"'));say('Here is your '+k+'! Have fun!');closeSheet();renderHud();setNpcMarks();
     if(ME.zone!=='town')setMode('build');break}
   case'opt':{if(!PZ||PZ.answered)break;const o=PZ.q.opts[+d.i];answerPZ(o.val===PZ.q.ans,o.val);break}
   case'tile':{if(!PZ||PZ.answered)break;const i=+d.i;if(!PZ.built.includes(i)){PZ.built.push(i);if(PZ.q.skill==='sentence')say(PZ.q.tokens[i]);renderPZ()}break}
   case'untile':PZ.built.splice(+d.k,1);renderPZ();break;
   case'clearb':PZ.built=[];renderPZ();break;
   case'check':{const q=PZ.q,got=PZ.built.map(i=>q.tokens[i]).join(q.joiner);answerPZ(got.toLowerCase()===q.target.join(q.joiner).toLowerCase(),got);break}
   case'cplus':PZ.counts[+d.i]=Math.min(9,PZ.counts[+d.i]+1);blip(600,.05);renderPZ();break;
   case'cminus':PZ.counts[+d.i]=Math.max(0,PZ.counts[+d.i]-1);blip(400,.05);renderPZ();break;
   case'serve':{const ok=PZ.q.want.every((w,i)=>w===PZ.counts[i]);answerPZ(ok,null);break}
   case'said':if(!PZ.said){PZ.said=true;addGems(1);renderPZ()}break;
   case'pzdone':{const cb=PZ.onDone,ok=PZ.answered&&PZ.answered.ok;closeSheet();if(cb)cb(ok);break}
   case'nextcust':{const S=PZ.series;if(S.kind==='escape'&&!(PZ.answered&&PZ.answered.ok)){USED=new Set();S.qs[S.i]=escQ();PZ.q=S.qs[S.i];prepQ();renderSeries();if(PZ.q.sayFirst)setTimeout(()=>say(PZ.q.sayFirst),250);break}S.i++;if(S.i<S.qs.length){PZ.q=S.qs[S.i];prepQ();renderSeries();if(PZ.q.sayFirst)setTimeout(()=>say(PZ.q.sayFirst),250)}else renderSeries();break}
   case'shiftdone':{const pay=+d.v;addGems(pay,'משכורת: '+JOBINFO[PZ.series.kind].he,'Salary');P.shifts++;addXp(20);adventure();sfx.coin();burst('💼 +'+pay+' 💎');say('Great work! Here is your salary.');closeSheet();break}
   case'race':closeSheet();startRaceLocal();break;
   case'job':openJob(d.v);break;
   case'shift':startShift(d.v);break;
   case'store':openStore(d.v);break;
   case'backstore':openStore(CART.store);break;
   case'addcart':{const it=storeItems(CART.store).find(x=>x.id===d.v);if(!it)break;if(it.own){toast('כבר יש לך את זה 🙂');break}if(it.lock){toast(`נפתח ב־Level ${it.lock}`);break}
     if(['clothes','pets'].includes(CART.store)&&CART.items[it.id])break;CART.items[it.id]=(CART.items[it.id]||0)+1;say(it.en);blip(700,.06);openStore(CART.store);break}
   case'rmcart':CART.items[d.v]=Math.max(0,(CART.items[d.v]||0)-1);openStore(CART.store);break;
   case'checkout':checkout();break;
   case'coans':{const D=PANEL_DATA;const o=D.opts[+d.i];if(o.val!==String(D.ans)){D.wrong=o.val;learnResult('math',false);sfx.bad();say("Hmm, let me check... that's not right. Try again!");renderCheckout();break}
     learnResult('math',true);payCart(D.lines,D.total);break}
   case'friend':{const p=NET.peers.find(x=>x.peer===d.p);if(!p)break;PANEL='friend';PANEL_DATA=p;const pr=p.presence||{};
     sheet(`<div class="npchead"><div class="face" style="background:var(--soft)">${charSVG(sanitizeCh(pr.ch))}</div><div class="grow"><h2>${esc(nameOf(p))}</h2><p class="sub">${en('Level '+clamp(+pr.lv||1,1,99))} · ${clamp(+pr.pc||0,0,999)} 🧱</p></div></div>
       <button class="btn" data-a="invite" data-p="${esc(p.peer)}">🔑 להזמין לבית שלי</button>
       <p class="sub">לשלוח ל${esc(nameOf(p))} משהו נחמד:</p><div class="row">${[['👋','Hi!'],['🎉','Great job!'],['⭐','Cool!'],['💖','You are awesome!']].map(([e,t])=>`<button class="btn ghost mini" data-a="wave" data-e="${e}">${e} ${en(t)}</button>`).join('')}</div>
       ${pr.zone==='island'||pr.zone==='town'||pr.zone==='city'?'<button class="btn gem" data-a="gofriend">ללכת אליו/ה 🚶</button>':''}<button class="btn ghost" data-a="close">סגירה</button>`);break}
   case'wave':{const p=PANEL_DATA;emit('wave',{to:p.peer,from:P.name,e:d.e});toast('נשלח! '+d.e);closeSheet();break}
   case'gofriend':{const pr=PANEL_DATA.presence||{};const z=pr.zone==='town'?'town':pr.zone==='city'?'city':'island';if(ME.zone!==z&&!(z!=='city'&&(ME.zone==='island'||ME.zone==='town')))teleport(z);
     const[cx,cz]=ZC[z];walkTo(new THREE.Vector3(cx+clamp(+pr.x||0,-14,14)+1,0,cz+clamp(+pr.z||0,-14,14)+1));setMode('walk');closeSheet();break}
   case'invite':{const peer=d.p;INVITED.add(peer);emit('invite',{to:peer,from:P.name,h:P.key});toast('🔑 ההזמנה נשלחה!');closeSheet();if(ME.zone!=='home')teleport('home');break}
   case'knock':{const p=PANEL_DATA;emit('knock',{to:p.peer,from:P.name});sfx.door();toast('🚪 דפקת בדלת. מחכים שיפתחו…');closeSheet();break}
   case'accept':{const D=PANEL_DATA;if(VISIT&&VISIT.host!==D.h)leaveVisit();VISIT={host:D.h,hostPeer:D.peer,name:D.who,house:null,defs:{},mine:new Set(),pending:true};emit('enter',{h:D.h,to:D.peer});toast('🔑 פותחים את הדלת…');closeSheet();break}
   case'mq':{const D=PANEL_DATA;const o=D.opts[+d.i];if(o.val!==String(D.ans)){D.wrong=o.val;learnResult('math',false);sfx.bad();say('Hmm, not quite. Try again!');renderMoneyQ();break}learnResult('math',true);D.onOk();break}
   case'plot':openPlot(d.v);break;
   case'buyplot':buyPlot(d.v,d.m);break;
   case'taketour':P.tour={dest:PANEL_DATA};save();closeSheet();renderQuestChip();setNpcMarks();say("Thank you! I will follow you.");if(MODE!=='walk')setMode('walk');break;
   case'droptour':P.tour=null;NPCOBJ.tom.position.set(CX+TOM_HOME[0],0,CZ+TOM_HOME[1]);save();closeSheet();renderQuestChip();setNpcMarks();break;
   case'tourinfo':openTom();break;
   case'saminfo':openSam();break;
   case'safetask':P.safeTask=true;save();closeSheet();renderQuestChip();setNpcMarks();say('Go to the crosswalk and wait for the green man.');break;
   case'safeq':closeSheet();openPuzzle({head:npcHead('sam'),q:qSafety(),reward:5,onDone:ok=>{if(ok){P.badges.safe++;save();setNpcMarks()}}});break;
   case'escape':closeSheet();startEscape();break;
   case'escdone':{const rw=+d.v;P.badges.escape++;addGems(rw,'חדר בריחה במגדל הים','Escape room');addXp(40);adventure();sfx.win();burst('🗝️ +'+rw+' 💎');say('You escaped! Amazing!');clearInterval(escTimer);closeSheet();break}
   case'escfail':clearInterval(escTimer);closeSheet();break;
   case'busans':{const D=PANEL_DATA;const o=D.opts[+d.i];if(o.val!==D.ans){D.wrong=o.val;learnResult('math',false);sfx.bad();say('Oh no, wrong time! Try again.');renderBus();break}learnResult('math',true);rideBus(D.dest);break}
   case'savefurn':openSaveFurn();break;
   case'fword':PANEL_DATA.word=d.v;say(d.v);document.querySelectorAll('[data-a="fword"]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===d.v));$('#sfBtn').disabled=false;break;
   case'dosavefurn':doSaveFurn();break;
   case'dep':{const amt=d.v==='all'?P.gems:Math.min(+d.v,P.gems);if(amt<=0){toast('אין יהלומים ביד');break}P.gems-=amt;P.savings+=amt;logm('הפקדה לבנק','Deposit',amt);sfx.coin();save();renderHud();openBank();break}
   case'wd':{const amt=d.v==='all'?P.savings:Math.min(+d.v,P.savings);if(amt<=0){toast('הבנק ריק');break}P.savings-=amt;P.gems+=amt;logm('משיכה מהבנק','Withdraw',-amt);save();renderHud();openBank();break}
   case'goal':P.goal=d.v;save();openBank();break;
   case'sound':P.sound=!P.sound;save();openSettings();break;
   case'tocode':closeSheet();$('#title').hidden=false;$('#hudTop').hidden=true;$('#hudBot').hidden=true;if(NET.room){NET.room.leave().catch(()=>{});NET.room=null}
     NET.avatars.forEach(a=>scene.remove(a.obj));NET.avatars.clear();OTHERS.forEach((m,o)=>clearScope(o));OTHERS.clear();OTHC.forEach((m,o)=>clearScope(o));OTHC.clear();if(VISIT)leaveVisit();NET.peers=[];NET.state='off';renderExteriors();break;
   case'reset':$('#resetBox').innerHTML='<div class="row"><span class="sub">בטוח? כל הבנייה וההתקדמות יימחקו.</span><button class="btn mini" data-a="reset2">כן, לאפס</button></div>';break;
   case'reset2':{try{localStorage.removeItem(KEY)}catch(e){}const k=P.key;[...OBJ.keys()].forEach(removePieceObj);OTHERS.clear();P=freshP();P.key=k;save();closeSheet();
     rebuildMe();renderHouse('home',P.house);renderExteriors();teleport('island');renderHud();setNpcMarks();toast('המשחק אופס');break}
  }}
document.addEventListener('input',e=>{if(e.target.id==='nm'){P.name=e.target.value.slice(0,14);save()}
  if(e.target.id==='sw'||e.target.id==='sh'){P.ch[e.target.id==='sw'?'w':'h']=+e.target.value;save();$('#pv').innerHTML=charSVG(P.ch)}});
