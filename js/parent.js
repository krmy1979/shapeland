/* Shapeland · parents' area: kid accounts, progress, daily time, closed groups */
(function(){
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KID_DOMAIN='kids.shapeland.game';
const SKILLS={vocab:'אוצר מילים',listen:'הבנת הנשמע',spell:'איות',sentence:'בניית משפטים',talk:'שיחה',math:'חשבון וכסף'};
if(!window.firebase||!window.FIREBASE_CONFIG||!FIREBASE_CONFIG.apiKey){$('#noCloud').hidden=false;return}
firebase.initializeApp(FIREBASE_CONFIG);const auth=firebase.auth(),db=firebase.database();
let ME=null,PDATA={},WATCH=[];
const rnd=(chars,n)=>{const a=new Uint32Array(n);crypto.getRandomValues(a);return[...a].map(v=>chars[v%chars.length]).join('')};
const today=()=>new Date().toISOString().slice(0,10);
const ago=t=>{if(!t)return'עוד לא שיחק/ה';const m=Math.round((Date.now()-t)/60000);if(m<2)return'משחק/ת עכשיו';if(m<60)return`לפני ${m} דקות`;const h=Math.round(m/60);if(h<24)return`לפני ${h} שעות`;return`לפני ${Math.round(h/24)} ימים`};

$('#gLogin').onclick=async()=>{$('#loginMsg').textContent='';try{await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}catch(e){$('#loginMsg').textContent='הכניסה לא הצליחה: '+(e.code||e.message)}};
$('#logout').onclick=()=>auth.signOut();
auth.onAuthStateChanged(u=>{WATCH.forEach(f=>f());WATCH=[];
  if(u&&u.email&&u.email.endsWith('@'+KID_DOMAIN)){auth.signOut();return}
  ME=u;$('#loginCard').hidden=!!u;$('#dash').hidden=!u;$('#who').textContent=u?(u.displayName||u.email||''):'';if(u)start()});

function watch(path,fn){const r=db.ref(path);const cb=s=>fn(s.val());r.on('value',cb,e=>console.warn(path,e));WATCH.push(()=>r.off('value',cb))}
function start(){watch('parents/'+ME.uid,v=>{PDATA=v||{};renderKids();renderGroups();renderJoinSelect()})}

/* ---------- kids ---------- */
const KIDV={},KIDG={};
function renderKids(){const kids=PDATA.kids||{};const box=$('#kids');
  if(!Object.keys(kids).length){box.innerHTML='<p class="sub">עוד אין חשבון שחקן. פותחים אחד למטה, ומקבלים קוד שחקן ו־PIN שהילד מקליד במשחק.</p>';return}
  box.innerHTML=Object.entries(kids).map(([k,v])=>`<article class="kid" id="kid-${k}"><div class="row"><h3 class="grow" dir="auto">${esc(v.nick)}</h3><span class="sub" id="last-${k}"></span></div>
    <div class="cred"><span>קוד שחקן: <b>${esc(v.code)}</b></span><span>PIN: <b>${esc(v.pin)}</b></span></div>
    <div class="stats" id="stats-${k}"></div><div class="skills" id="sk-${k}"></div>
    <div class="row"><label class="sub" for="lim-${k}">זמן משחק ביום</label><select class="txt" id="lim-${k}" data-kid="${k}" style="max-width:180px">${[[0,'בלי הגבלה'],[20,'20 דקות'],[30,'30 דקות'],[45,'45 דקות'],[60,'שעה'],[90,'שעה וחצי'],[120,'שעתיים']].map(([m,t])=>`<option value="${m}">${t}</option>`).join('')}</select><span class="sub" id="limMsg-${k}"></span></div>
    <div id="kg-${k}" class="row"></div></article>`).join('');
  Object.keys(kids).forEach(k=>{
    if(!KIDV[k]){KIDV[k]=1;watch('kids/'+k,v=>{KIDV[k]=v||{};fillKid(k)});watch('kidGroups/'+k,v=>{KIDG[k]=v||{};fillKid(k);renderGroups()})}else fillKid(k);
    $('#lim-'+k).onchange=e=>{db.ref('kids/'+k+'/limit').set(+e.target.value).then(()=>{$('#limMsg-'+k).textContent='נשמר ✓'}).catch(err=>{$('#limMsg-'+k).textContent='לא נשמר: '+err.code})}})}
function fillKid(k){const v=typeof KIDV[k]==='object'?KIDV[k]:{};const p=v.progress||{};const el=$('#stats-'+k);if(!el)return;
  const minToday=p.day===today()?(p.min||0):0;
  el.innerHTML=[['רמה',p.lv||1],['דקות היום',minToday+(v.limit?' / '+v.limit:'')],['מילים שנלמדו',p.words||0],['הרפתקאות',p.adv||0],['יהלומים ביד',p.gems??'–'],['חיסכון בבנק',p.sav??'–'],['כוכבי בטיחות',(p.badges&&p.badges.safe)||0],['משמרות עבודה',p.shifts||0]]
    .map(([a,b])=>`<div class="stat"><small>${a}</small><b>${esc(b)}</b></div>`).join('');
  const sk=p.sk||{};$('#sk-'+k).innerHTML=Object.entries(SKILLS).map(([s,t])=>{const val=+sk[s]||3;return`<div class="sk">${t} · ${val.toFixed(1)}<div class="bar"><i style="width:${val*10}%"></i></div></div>`}).join('');
  $('#last-'+k).textContent=ago(p.last);const sel=$('#lim-'+k);if(sel&&document.activeElement!==sel)sel.value=String(v.limit||0);
  const groups=Object.keys(KIDG[k]||{});const pend=Object.keys(((PDATA.pending||{})[k])||{}).filter(g=>!groups.includes(g));
  $('#kg-'+k).innerHTML=groups.map(g=>`<span class="pill ok">✓ ${esc(GNAMES[g]||'חבורה')}</span>`).join('')+pend.map(g=>`<span class="pill wait">⏳ ממתין לאישור: ${esc(GNAMES[g]||'חבורה')}</span>`).join('')||'<span class="sub">עוד לא בחבורה, משחק/ת לבד</span>';
  groups.concat(pend).forEach(g=>{if(!GNAMES[g])db.ref('groups/'+g+'/meta/name').get().then(s=>{GNAMES[g]=s.val()||'חבורה';fillKid(k)})});
  if(groups.length&&PDATA.pending&&PDATA.pending[k])groups.forEach(g=>{if(PDATA.pending[k][g])db.ref('parents/'+ME.uid+'/pending/'+k+'/'+g).remove()})}
const GNAMES={};

$('#addKid').onsubmit=async e=>{e.preventDefault();const nick=$('#kidNick').value.trim();if(!nick)return;const msg=$('#addMsg');msg.textContent='פותחים חשבון…';
  const code=rnd('abcdefghjkmnpqrstuvwxyz',3)+rnd('23456789',3),pin=rnd('0123456789',6);let sec;
  try{sec=firebase.initializeApp(FIREBASE_CONFIG,'sec'+Date.now());const c=await sec.auth().createUserWithEmailAndPassword(code+'@'+KID_DOMAIN,pin+'-sl');const kid=c.user.uid;await sec.auth().signOut();
    const up={};up['kids/'+kid+'/parent']=ME.uid;up['kids/'+kid+'/nick']=nick;up['kids/'+kid+'/code']=code;up['parents/'+ME.uid+'/kids/'+kid]={nick,code,pin};
    await db.ref().update(up);$('#kidNick').value='';msg.innerHTML=`נפתח! קוד שחקן <span class="code">${code}</span> PIN <span class="code">${pin}</span>. הם שמורים גם בכרטיס של הילד למעלה.`}
  catch(err){msg.textContent='לא הצליח: '+(err.code||err.message)}finally{if(sec)sec.delete().catch(()=>{})}};

/* ---------- groups ---------- */
function renderJoinSelect(){const kids=PDATA.kids||{};$('#joinKid').innerHTML=Object.entries(kids).map(([k,v])=>`<option value="${k}">${esc(v.nick)}</option>`).join('')||'<option value="">קודם פותחים חשבון שחקן</option>'}
const GW={};
function renderGroups(){const owned=Object.keys(PDATA.groups||{});const box=$('#groups');
  if(!owned.length){box.innerHTML='';return}
  box.innerHTML=owned.map(g=>`<div class="box" id="grp-${g}"><div class="row"><h3 class="grow" id="gname-${g}">חבורה</h3><span class="sub">קוד להצטרפות: <span class="code" id="gcode-${g}"></span></span></div>
    <p class="sub">את הקוד שולחים להורים של החברים. כל בקשה מגיעה לכאן, ורק מה שמאשרים כאן נכנס.</p>
    <h3>בקשות שממתינות</h3><ul class="list" id="req-${g}"></ul><h3>חברי החבורה</h3><ul class="list" id="mem-${g}"></ul></div>`).join('');
  owned.forEach(g=>{if(!GW[g]){GW[g]={};watch('groups/'+g+'/meta',v=>{GW[g].meta=v||{};GNAMES[g]=(v||{}).name;paintGroup(g)});watch('groups/'+g+'/requests',v=>{GW[g].req=v||{};paintGroup(g)});watch('groups/'+g+'/members',v=>{GW[g].mem=v||{};paintGroup(g)})}else paintGroup(g)})}
function paintGroup(g){const G=GW[g]||{};if(!$('#grp-'+g))return;const m=G.meta||{};$('#gname-'+g).textContent=m.name||'חבורה';$('#gcode-'+g).textContent=m.code||'';
  const req=Object.entries(G.req||{});$('#req-'+g).innerHTML=req.length?req.map(([k,v])=>`<li><span dir="auto">${esc(v.nick)}</span><span class="row"><button class="btn ok mini" data-ok="${g}|${k}">אישור</button><button class="btn ghost mini" data-no="${g}|${k}">דחייה</button></span></li>`).join(''):'<li class="sub">אין בקשות חדשות</li>';
  const mem=Object.entries(G.mem||{});$('#mem-'+g).innerHTML=mem.length?mem.map(([k,v])=>`<li><span dir="auto">${esc(v.nick)}</span><button class="btn ghost mini" data-rm="${g}|${k}">הוצאה מהחבורה</button></li>`).join(''):'<li class="sub">עוד אין חברים. גם את הילד שלך צריך לאשר כאן.</li>'}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-ok],[data-no],[data-rm]');if(!b)return;b.disabled=true;
  try{if(b.dataset.ok){const[g,k]=b.dataset.ok.split('|');const r=(GW[g].req||{})[k]||{};const up={};up['groups/'+g+'/members/'+k]={nick:r.nick||'',parent:r.parent||''};up['groups/'+g+'/requests/'+k]=null;up['kidGroups/'+k+'/'+g]=true;await db.ref().update(up)}
    if(b.dataset.no){const[g,k]=b.dataset.no.split('|');await db.ref('groups/'+g+'/requests/'+k).remove()}
    if(b.dataset.rm){const[g,k]=b.dataset.rm.split('|');if(!confirmRemove(b))return;const up={};up['groups/'+g+'/members/'+k]=null;up['kidGroups/'+k+'/'+g]=null;await db.ref().update(up);
      const pres=(await db.ref('groups/'+g+'/presence').get()).val()||{};Object.keys(pres).filter(p=>p.startsWith(k+'_')).forEach(p=>db.ref('groups/'+g+'/presence/'+p).remove())}}
  catch(err){alertBox(err.code||err.message)}finally{b.disabled=false}});
function confirmRemove(b){if(b.dataset.sure)return true;b.dataset.sure='1';b.textContent='בטוח? ללחוץ שוב';b.disabled=false;return false}
function alertBox(t){const p=document.createElement('p');p.className='sub';p.textContent='שגיאה: '+t;$('#groups').prepend(p);setTimeout(()=>p.remove(),5000)}
$('#newGroup').onsubmit=async e=>{e.preventDefault();const name=$('#groupName').value.trim();if(!name)return;const msg=$('#groupMsg');
  const g=db.ref('groups').push().key,code='SL-'+rnd('ABCDEFGHJKMNPQRSTUVWXYZ23456789',4);const up={};
  up['groups/'+g+'/meta']={owner:ME.uid,name,code,created:firebase.database.ServerValue.TIMESTAMP};up['joinCodes/'+code]=g;up['parents/'+ME.uid+'/groups/'+g]=true;
  try{await db.ref().update(up);$('#groupName').value='';msg.innerHTML=`החבורה נפתחה! הקוד שלה: <span class="code">${code}</span>`}catch(err){msg.textContent='לא הצליח: '+(err.code||err.message)}};
$('#joinGroup').onsubmit=async e=>{e.preventDefault();const k=$('#joinKid').value,code=$('#joinCode').value.trim().toUpperCase();const msg=$('#joinMsg');if(!k){msg.textContent='קודם פותחים חשבון שחקן';return}
  try{const g=(await db.ref('joinCodes/'+code).get()).val();if(!g){msg.textContent='לא מצאנו חבורה עם הקוד הזה';return}
    const kid=(PDATA.kids||{})[k]||{};const up={};up['groups/'+g+'/requests/'+k]={nick:kid.nick||'',parent:ME.uid,t:firebase.database.ServerValue.TIMESTAMP};up['parents/'+ME.uid+'/pending/'+k+'/'+g]=true;
    await db.ref().update(up);$('#joinCode').value='';msg.textContent='הבקשה נשלחה למנהל החבורה ✓'}catch(err){msg.textContent='לא הצליח: '+(err.code||err.message)}};
})();
