/* Shapeland · a world by Shirel Yitzhak */
/* ===================== CLOUD (Firebase): closed groups, kid logins, saves, time limits ===================== */
window.CLOUD={on:false,auth:null,db:null,user:null,kid:null,gid:null,gname:'',offset:0,limit:0,min:0,session:Math.random().toString(36).slice(2,8)};
const KID_DOMAIN='kids.shapeland.game';
(function(){try{if(!window.firebase||!window.FIREBASE_CONFIG||!FIREBASE_CONFIG.apiKey)return;
  firebase.initializeApp(FIREBASE_CONFIG);CLOUD.auth=firebase.auth();CLOUD.db=firebase.database();CLOUD.on=true;
  CLOUD.db.ref('.info/serverTimeOffset').on('value',s=>{CLOUD.offset=s.val()||0})}catch(e){console.warn('cloud off',e)}})();
const today=()=>new Date().toISOString().slice(0,10);

async function loadKid(){const uid=CLOUD.user.uid;const k=(await CLOUD.db.ref('kids/'+uid).get()).val()||{};CLOUD.kid=k;
  const gids=Object.keys((await CLOUD.db.ref('kidGroups/'+uid).get()).val()||{});CLOUD.gid=gids[0]||null;CLOUD.gname='';
  if(CLOUD.gid){CLOUD.gname=(await CLOUD.db.ref('groups/'+CLOUD.gid+'/meta/name').get()).val()||''}
  const pr=k.progress||{};CLOUD.min=pr.day===today()?(+pr.min||0):0;CLOUD.limit=+k.limit||0;
  CLOUD.db.ref('kids/'+uid+'/limit').on('value',s=>{CLOUD.limit=+s.val()||0;checkLimit()});return k}

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
    badges:P.badges||{},gems:Math.round(P.gems),sav:Math.round(P.savings),plots:(P.plots||[]).length,last:firebase.database.ServerValue.TIMESTAMP}).catch(()=>{})}
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
    $('#kidGroup').textContent=CLOUD.gid?('החבורה: '+(CLOUD.gname||'')):'עוד לא אושרת לחבורה, אפשר לשחק לבד בינתיים';
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
