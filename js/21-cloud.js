/* Shapeland · a world by Shirel Yitzhak */
/* ===================== CLOUD (Firebase): closed groups, kid logins, saves, time limits ===================== */
window.CLOUD={on:false,auth:null,db:null,user:null,kid:null,gid:null,gname:'',groups:{},invites:{},offset:0,limit:0,min:0,session:Math.random().toString(36).slice(2,8)};
const KID_DOMAIN='kids.shapeland.game';
(function(){try{if(!window.firebase||!window.FIREBASE_CONFIG||!FIREBASE_CONFIG.apiKey)return;
  firebase.initializeApp(FIREBASE_CONFIG);CLOUD.auth=firebase.auth();CLOUD.db=firebase.database();CLOUD.on=true;
  CLOUD.db.ref('.info/serverTimeOffset').on('value',s=>{CLOUD.offset=s.val()||0})}catch(e){console.warn('cloud off',e)}})();
const today=()=>new Date().toISOString().slice(0,10);

async function loadKid(){const uid=CLOUD.user.uid;const k=(await CLOUD.db.ref('kids/'+uid).get()).val()||{};CLOUD.kid=k;
  await loadGroups();
  const pr=k.progress||{};CLOUD.min=pr.day===today()?(+pr.min||0):0;CLOUD.limit=+k.limit||0;
  CLOUD.db.ref('kids/'+uid+'/limit').on('value',s=>{CLOUD.limit=+s.val()||0;checkLimit()});
  CLOUD.db.ref('kidInvites/'+uid).on('value',s=>{const before=Object.keys(CLOUD.invites||{}).length;CLOUD.invites=s.val()||{};const n=Object.keys(CLOUD.invites).length;
    if(typeof renderFriends==='function'){friendsSig='';renderFriends()}if(n>before&&$('#title').hidden){toast('📩 קיבלת הזמנה לקבוצה! נוגעים ב־👫 חברים');sfx.coin()}if(PANEL==='friends'){KEEP=true;openFriends()}});
  return k}
async function loadGroups(){const uid=CLOUD.user.uid;const gids=Object.keys((await CLOUD.db.ref('kidGroups/'+uid).get()).val()||{});CLOUD.groups={};
  await Promise.all(gids.map(async g=>{const m=(await CLOUD.db.ref('groups/'+g+'/meta').get()).val()||{};CLOUD.groups[g]={name:m.name||'קבוצה',owner:m.owner===uid}}));
  let act=(CLOUD.kid&&CLOUD.kid.active)||'';try{act=localStorage.getItem('sl-active-'+uid)||act}catch(e){}
  CLOUD.gid=CLOUD.groups[act]?act:(gids[0]||null);CLOUD.gname=CLOUD.gid?CLOUD.groups[CLOUD.gid].name:''}

async function kidLogin(code,pin){code=String(code||'').trim().toLowerCase();pin=String(pin||'').trim();
  if(!/^[a-z0-9]{4,12}$/.test(code)||!/^\d{6}$/.test(pin))throw new Error('format');
  const cred=await CLOUD.auth.signInWithEmailAndPassword(code+'@'+KID_DOMAIN,pin+'-sl');CLOUD.user=cred.user;const k=await loadKid();
  const key='u'+cred.user.uid.slice(0,9);let data=null;
  if(typeof k.save==='string'&&k.save.length>10)data=k.save;
  else if(P.key!==key)data=JSON.stringify(Object.assign(freshP(),{name:k.nick||'Player',key}));
  if(data){try{const o=JSON.parse(data);o.key=key;o.name=k.nick||o.name;localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
  else{P.name=k.nick||P.name;P.key=key;try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
  try{sessionStorage.setItem('sl-go','1')}catch(e){}location.reload()}

function cloudStartGame(){const k=CLOUD.kid||{};P.name=k.nick||P.name;$('#tName').value=P.name;$('#tCode').value='shapeland';act('play',{})}

/* the same interface the game uses for live play (presence, events, peers) */
function cloudRoom(gid){const db=CLOUD.db,uid=CLOUD.user.uid,me=uid+'_'+CLOUD.session,base='groups/'+gid;
  const presRef=db.ref(base+'/presence/'+me);let mine={},peers=new Map(),peerH=[],connH=[],topicH={},connected=false,lastSent={},pending=null,timer=null;
  const toPeer=(pid,v)=>({peer:pid,by:pid.split('_')[0],isMe:pid.split('_')[0]===uid,sameTab:pid===me,kind:'viewer',guest:false,presence:v||{},updatedAt:Date.now()});
  db.ref('.info/connected').on('value',s=>{connected=!!s.val();if(connected){presRef.onDisconnect().remove();if(Object.keys(mine).length)presRef.update(mine).catch(()=>{})}connH.forEach(h=>h(connected))});
  db.ref(base+'/presence').on('value',s=>{const v=s.val()||{};const next=new Map();Object.entries(v).forEach(([pid,pv])=>next.set(pid,toPeer(pid,pv)));
    const joined=[...next.keys()].filter(k=>!peers.has(k)).map(k=>next.get(k)),left=[...peers.keys()].filter(k=>!next.has(k)).map(k=>peers.get(k));
    peers=next;const ch={peers:[...peers.values()],joined,left,updated:[]};peerH.forEach(h=>{try{h(ch)}catch(e){console.warn(e)}})},e=>console.warn('presence',e));
  const t0=Date.now()+CLOUD.offset-2000;
  db.ref(base+'/events').orderByChild('t').startAt(t0).on('child_added',s=>{const e=s.val();if(!e||typeof e.topic!=='string')return;let data;try{data=JSON.parse(e.d)}catch(x){return}
    const msg={topic:e.topic,data,peer:e.from,by:e.uid,isMe:e.uid===uid,sameTab:e.from===me,kind:'viewer',guest:false};(topicH[e.topic]||[]).forEach(h=>{try{h(msg)}catch(x){console.warn(x)}})},e=>console.warn('events',e));
  db.ref(base+'/events').orderByChild('t').endAt(Date.now()+CLOUD.offset-600000).limitToFirst(50).get().then(s=>s.forEach(c=>{c.ref.remove().catch(()=>{})})).catch(()=>{});
  function flush(){timer=null;if(!pending)return;const p=pending;pending=null;presRef.update(p).catch(()=>{})}
  return{name:gid,onPeers(h){peerH.push(h);return()=>{}},onConnection(h){connH.push(h);return()=>{}},connected:()=>connected,
    on(t,h){(topicH[t]=topicH[t]||[]).push(h);return()=>{}},peers:()=>[...peers.values()],
    presence(patch){const diff={};for(const k in patch){const v=patch[k]===undefined?null:patch[k];const js=JSON.stringify(v);if(lastSent[k]!==js){diff[k]=v;lastSent[k]=js;if(v===null)delete mine[k];else mine[k]=v}}
      if(Object.keys(diff).length){pending=Object.assign(pending||{},diff);if(!timer)timer=setTimeout(flush,700)}return Promise.resolve()},
    emit(topic,data){const d=JSON.stringify(data===undefined?null:data);if(d.length>6000)return Promise.reject(new Error('too big'));const ref=db.ref(base+'/events').push();
      const p=ref.set({topic,d,from:me,uid,t:firebase.database.ServerValue.TIMESTAMP});setTimeout(()=>ref.remove().catch(()=>{}),45000);return p},
    leave(){presRef.remove().catch(()=>{});db.ref(base+'/presence').off();db.ref(base+'/events').off();db.ref('.info/connected').off();return Promise.resolve()}}}

/* progress for the parents' dashboard, cloud save, daily time limit */
let lastSaveStr='';
function cloudSave(){if(!CLOUD.user)return;const s=JSON.stringify(P);if(s===lastSaveStr)return;lastSaveStr=s;CLOUD.db.ref('kids/'+CLOUD.user.uid+'/save').set(s).catch(()=>{})}
function cloudProgress(){if(!CLOUD.user)return;const sk={};for(const k in P.sk)sk[k]=Math.round(P.sk[k]*10)/10;
  CLOUD.db.ref('kids/'+CLOUD.user.uid+'/progress').set({day:today(),min:CLOUD.min,lv:level(),xp:P.xp,words:Object.keys(P.learned).length,sk,adv:P.adv,shifts:P.shifts||0,
    badges:P.badges||{},rank:(typeof rankInfo==='function'?rankInfo().name:''),keys:P.keys||0,hires:(P.hires||[]).slice(0,5),elem:P.elem||{},gates:Object.keys(P.gates||{}).length,gems:Math.round(P.gems),sav:Math.round(P.savings),plots:(P.plots||[]).length,last:firebase.database.ServerValue.TIMESTAMP}).catch(()=>{})}
function checkLimit(){if(!CLOUD.user||!CLOUD.limit||!$('#title').hidden)return;if(CLOUD.min>=CLOUD.limit)showLimit()}
function showLimit(){if($('#limitBox'))return;cloudSave();cloudProgress();const d=document.createElement('div');d.id='limitBox';d.className='sheet';d.dir='rtl';d.style.zIndex=90;
  d.innerHTML=`<div class="sheet-in" style="text-align:center;align-items:center"><div style="font-size:64px">🌙</div><h2>${en('See you tomorrow!')}</h2><p class="sub">זמן המשחק להיום נגמר. הכל נשמר, והעולם מחכה לך מחר.</p></div>`;document.body.appendChild(d);say('Great playing today! See you tomorrow!')}
if(CLOUD.on){
  setInterval(()=>{if(!CLOUD.user||!$('#title').hidden||document.hidden)return;CLOUD.min++;cloudProgress();cloudSave();checkLimit()},60000);
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&CLOUD.user&&$('#title').hidden){cloudSave();cloudProgress()}});
  // title screen in cloud mode: kid code + PIN, solo play, parents' area
  $('#cloudBox').hidden=false;$('#localBox').hidden=true;
  CLOUD.auth.onAuthStateChanged(async u=>{
    if(!u){$('#kidWelcome').hidden=true;$('#kidLoginForm').hidden=false;return}
    if(!u.email||!u.email.endsWith('@'+KID_DOMAIN)){$('#kidWelcome').hidden=true;$('#kidLoginForm').hidden=false;$('#parentNote').hidden=false;return}
    CLOUD.user=u;try{await loadKid()}catch(e){console.warn(e)}
    $('#kidLoginForm').hidden=true;$('#kidWelcome').hidden=false;$('#kidHello').textContent=(CLOUD.kid&&CLOUD.kid.nick)||'';
    const ni=Object.keys(CLOUD.invites||{}).length;$('#kidGroup').textContent=CLOUD.gid?('הקבוצה: '+(CLOUD.gname||'')):(ni?'📩 מחכה לך הזמנה לקבוצה!':'עוד אין קבוצה. בתוך המשחק, בכפתור 👫, פותחים קבוצה ומזמינים חברים');
    if(CLOUD.limit&&CLOUD.min>=CLOUD.limit){$('#kidGroup').textContent='זמן המשחק להיום נגמר 🌙 נתראה מחר!';$('#kidGo').disabled=true}
    let go=false;try{go=sessionStorage.getItem('sl-go')==='1';sessionStorage.removeItem('sl-go')}catch(e){}
    if(go&&!$('#kidGo').disabled)cloudStartGame()});
}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-c]');if(!b||b.disabled)return;const a=b.dataset.c;
  if(a==='kidlogin'){const msg=$('#kidMsg');msg.textContent='נכנסים…';b.disabled=true;
    try{await kidLogin($('#kCode').value,$('#kPin').value)}catch(err){b.disabled=false;msg.textContent=err&&err.message==='format'?'הקוד הוא אותיות ומספרים באנגלית, וה־PIN הוא 6 ספרות':'הקוד או ה־PIN לא נכונים. אפשר לבקש אותם מההורים'}}
  if(a==='kidgo')cloudStartGame();
  if(a==='solo'){$('#cloudBox').hidden=true;$('#localBox').hidden=false;$('#tCode').closest('.codewrap').hidden=true;$('#tCode').value='solo'}
  if(a==='logout'){try{await CLOUD.auth.signOut()}catch(err){}try{localStorage.removeItem(KEY)}catch(err){}location.reload()}});

/* ===================== MY FRIENDS: kids make their own groups (invite-only) ===================== */
const tsNow=()=>firebase.database.ServerValue.TIMESTAMP;
function reconnectGroup(){try{if(NET.room)NET.room.leave()}catch(e){}NET.room=null;NET.peers=[];NET.avatars.forEach(a=>scene.remove(a.obj));NET.avatars.clear();friendsSig='';connect()}
async function setActiveGroup(g){CLOUD.gid=g;CLOUD.gname=(CLOUD.groups[g]||{}).name||'';try{localStorage.setItem('sl-active-'+CLOUD.user.uid,g)}catch(e){}CLOUD.db.ref('kids/'+CLOUD.user.uid+'/active').set(g).catch(()=>{});reconnectGroup()}
async function createGroup(name){const uid=CLOUD.user.uid,k=CLOUD.kid||{};const g=CLOUD.db.ref('groups').push().key;const up={};
  up['groups/'+g+'/meta']={owner:uid,op:k.parent,name,onick:k.nick||'',created:tsNow()};
  up['groups/'+g+'/members/'+uid]={nick:k.nick||'',parent:k.parent,pn:k.pname||'',t:tsNow(),by:'owner'};
  up['groups/'+g+'/pw/'+k.parent+'/'+uid]=true;up['kidGroups/'+uid+'/'+g]=true;
  await CLOUD.db.ref().update(up);CLOUD.groups[g]={name,owner:true};await setActiveGroup(g);return g}
async function findFriend(fc){fc=String(fc||'').trim().toUpperCase().replace(/^F?-?/,'F-');if(!/^F-[A-Z0-9]{5}$/.test(fc))throw new Error('format');
  const kid=(await CLOUD.db.ref('fcodes/'+fc).get()).val();if(!kid)throw new Error('none');if(kid===CLOUD.user.uid)throw new Error('me');
  const pub=(await CLOUD.db.ref('pub/'+kid).get()).val()||{};return{kid,nick:pub.nick||'?'}}
async function inviteFriend(g,f){const k=CLOUD.kid||{};const up={};up['groups/'+g+'/invites/'+f.kid]={nick:f.nick,by:k.nick||'',t:tsNow()};
  up['kidInvites/'+f.kid+'/'+g]={gname:CLOUD.groups[g].name,from:k.nick||'',t:tsNow()};await CLOUD.db.ref().update(up)}
async function acceptInvite(g){const uid=CLOUD.user.uid,k=CLOUD.kid||{};const inv=CLOUD.invites[g]||{};const up={};
  up['groups/'+g+'/members/'+uid]={nick:k.nick||'',parent:k.parent,pn:k.pname||'',t:tsNow(),by:inv.from||''};up['groups/'+g+'/invites/'+uid]=null;
  up['groups/'+g+'/pw/'+k.parent+'/'+uid]=true;up['kidGroups/'+uid+'/'+g]=true;up['kidInvites/'+uid+'/'+g]=null;
  await CLOUD.db.ref().update(up);CLOUD.groups[g]={name:inv.gname||'קבוצה',owner:false};await setActiveGroup(g)}
async function declineInvite(g){const uid=CLOUD.user.uid;await Promise.all([CLOUD.db.ref('kidInvites/'+uid+'/'+g).remove(),CLOUD.db.ref('groups/'+g+'/invites/'+uid).remove().catch(()=>{})])}
async function removeMember(g,kid,parent){const up={};up['groups/'+g+'/members/'+kid]=null;up['kidGroups/'+kid+'/'+g]=null;if(parent)up['groups/'+g+'/pw/'+parent+'/'+kid]=null;await CLOUD.db.ref().update(up);
  const pres=(await CLOUD.db.ref('groups/'+g+'/presence').get()).val()||{};Object.keys(pres).filter(p=>p.startsWith(kid+'_')).forEach(p=>CLOUD.db.ref('groups/'+g+'/presence/'+p).remove().catch(()=>{}))}
async function leaveGroup(g){const uid=CLOUD.user.uid;await removeMember(g,uid,(CLOUD.kid||{}).parent);delete CLOUD.groups[g];if(CLOUD.gid===g){const next=Object.keys(CLOUD.groups)[0]||null;if(next)await setActiveGroup(next);else{CLOUD.gid=null;CLOUD.gname='';reconnectGroup()}}}
let FR={members:{},find:{},msg:{}};
async function openFriends(){PANEL='friends';const k=CLOUD.kid||{};const inv=Object.entries(CLOUD.invites||{});const gs=Object.entries(CLOUD.groups||{});
  sheet(`<h2>👫 החברים שלי</h2>
  ${inv.length?`<div class="box"><h3>📩 הזמנות</h3>${inv.map(([g,v])=>`<div class="row"><span class="grow"><b dir="auto">${esc(v.from)}</b> מזמינ/ה אותך לקבוצה <b dir="auto">${esc(v.gname)}</b></span><button class="btn mini" data-a="fraccept" data-v="${g}">✓ להצטרף</button><button class="btn ghost mini" data-a="frdecline" data-v="${g}">לא תודה</button></div>`).join('')}</div>`:''}
  <div class="box center"><p class="sub" style="margin:0">קוד החבר/ה שלי</p><div class="fcode" dir="ltr">${esc(k.fc||'···')}</div><p class="sub" style="margin:0">נותנים את הקוד רק לחברים שמכירים באמת, מהכיתה או מהשכונה. עם הקוד הם יכולים להזמין אותך לקבוצה, ואת/ה מחליט/ה אם להצטרף.</p></div>
  <h3>הקבוצות שלי</h3>${gs.length?gs.map(([g,v])=>{const mem=FR.members[g];return`<div class="box grp ${CLOUD.gid===g?'on':''}"><div class="row"><h3 class="grow" dir="auto">${v.owner?'⭐ ':''}${esc(v.name)}</h3>${CLOUD.gid===g?'<span class="pill">▶ משחקים עכשיו</span>':`<button class="btn mini" data-a="frplay" data-v="${g}">▶ לשחק עם הקבוצה</button>`}</div>
    <div class="chips">${mem?Object.entries(mem).map(([kid,m])=>`<span class="mchip" dir="auto">${esc(m.nick)}${kid===CLOUD.user.uid?' (אני)':''}${v.owner&&kid!==CLOUD.user.uid?` <button class="x" data-a="frkick" data-v="${g}" data-k="${kid}" data-p="${esc(m.parent||'')}" aria-label="להוציא את ${esc(m.nick)}">✕</button>`:''}</span>`).join(''):'<span class="sub">טוען…</span>'}</div>
    ${v.owner?`<div class="row"><input class="txt en" id="fc-${g}" dir="ltr" maxlength="7" placeholder="F-XXXXX" autocapitalize="characters" autocomplete="off" spellcheck="false" style="max-width:150px"><button class="btn ghost mini" data-a="frfind" data-v="${g}">🔎 למצוא חבר/ה</button></div>
      ${FR.find[g]?`<div class="row"><span class="grow">נמצא/ה: <b dir="auto">${esc(FR.find[g].nick)}</b>. זה באמת החבר/ה שלך?</span><button class="btn mini" data-a="frinvite" data-v="${g}">📩 להזמין</button></div>`:''}`:`<button class="link" data-a="frleave" data-v="${g}">לצאת מהקבוצה</button>`}
    ${FR.msg[g]?`<p class="sub">${FR.msg[g]}</p>`:''}</div>`}).join(''):'<p class="sub">עוד אין לך קבוצה. אפשר לפתוח אחת ולהזמין חברים, או לחכות להזמנה מחבר/ה.</p>'}
  <div class="box"><h3>➕ קבוצה חדשה</h3><div class="row"><input class="txt" id="newgName" dir="auto" maxlength="30" placeholder="שם הקבוצה"><button class="btn mini" data-a="frcreate">לפתוח</button></div></div>
  <p class="sub">🔒 נכנסים לקבוצה רק בהזמנה. ההורים רואים את הקבוצות ומי נמצא בהן, ויכולים לעזור אם מישהו לא מוכר.</p><button class="btn ghost" data-a="close">סגירה</button>`);
  gs.forEach(([g])=>{if(!FR.members[g])CLOUD.db.ref('groups/'+g+'/members').get().then(s=>{FR.members[g]=s.val()||{};if(PANEL==='friends'){KEEP=true;openFriends()}}).catch(()=>{FR.members[g]={}})})}
const frErr=e=>e&&e.message==='format'?'קוד חבר נראה כך: F-AB12C':e&&e.message==='none'?'לא מצאנו קוד כזה. כדאי לבדוק שוב עם החבר/ה':e&&e.message==='me'?'זה הקוד שלך 🙂':e&&/PERMISSION/i.test(e.code||e.message)?'אי אפשר להזמין את החבר/ה הזה/ו':'משהו לא הצליח, אפשר לנסות שוב';
ACTX.friends=()=>{FR.members={};openFriends()};
ACTX.frcreate=async()=>{const n=($('#newgName').value||'').trim();if(!n){toast('קודם כותבים שם לקבוצה');return}try{const g=await createGroup(n);FR.members={};sfx.win();burst('👫 '+n);openFriends()}catch(e){toast(frErr(e))}};
ACTX.frplay=async d=>{await setActiveGroup(d.v);FR.members={};openFriends();toast('▶ משחקים עכשיו עם '+CLOUD.gname)};
ACTX.frfind=async d=>{const g=d.v;FR.find[g]=null;FR.msg[g]='';try{const f=await findFriend($('#fc-'+g).value);if(FR.members[g]&&FR.members[g][f.kid]){FR.msg[g]=esc(f.nick)+' כבר בקבוצה'}else FR.find[g]=f}catch(e){FR.msg[g]=frErr(e)}KEEP=true;openFriends()};
ACTX.frinvite=async d=>{const g=d.v,f=FR.find[g];if(!f)return;try{await inviteFriend(g,f);FR.msg[g]='📩 ההזמנה נשלחה ל־'+esc(f.nick)+'. כשהיא/הוא יאשרו, הם יופיעו בקבוצה.';FR.find[g]=null;sfx.coin()}catch(e){FR.msg[g]=frErr(e)}KEEP=true;openFriends()};
ACTX.fraccept=async d=>{try{await acceptInvite(d.v);FR.members={};sfx.win();burst('👫');openFriends()}catch(e){toast(frErr(e))}};
ACTX.frdecline=async d=>{try{await declineInvite(d.v)}catch(e){}KEEP=true;openFriends()};
ACTX.frkick=async d=>{const b=document.querySelector(`[data-a="frkick"][data-k="${d.k}"]`);if(b&&!b.dataset.sure){b.dataset.sure='1';b.textContent='בטוח?';return}try{await removeMember(d.v,d.k,d.p);delete FR.members[d.v]}catch(e){toast(frErr(e))}KEEP=true;openFriends()};
ACTX.frleave=async d=>{const b=document.querySelector(`[data-a="frleave"][data-v="${d.v}"]`);if(b&&!b.dataset.sure){b.dataset.sure='1';b.textContent='בטוח? ללחוץ שוב כדי לצאת';return}try{await leaveGroup(d.v);FR.members={}}catch(e){toast(frErr(e))}openFriends()};
