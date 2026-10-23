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
function start(){watch('parents/'+ME.uid,v=>{PDATA=v||{};renderKids();renderGroups()})}

/* ---------- kids ---------- */
const KIDV={},KIDG={};
function renderKids(){const kids=PDATA.kids||{};const box=$('#kids');
  if(!Object.keys(kids).length){box.innerHTML='<p class="sub">עוד אין חשבון שחקן. פותחים אחד למטה, ומקבלים קוד שחקן ו־PIN שהילד מקליד במשחק.</p>';return}
  box.innerHTML=Object.entries(kids).map(([k,v])=>`<article class="kid" id="kid-${k}"><div class="row"><h3 class="grow" dir="auto">${esc(v.nick)}</h3><span class="sub" id="last-${k}"></span></div>
    <div class="cred"><span>קוד שחקן: <b>${esc(v.code)}</b></span><span>PIN: <b>${esc(v.pin)}</b></span><span>קוד חבר: <b id="fc-${k}">…</b></span></div>
    <div class="stats" id="stats-${k}"></div><p class="sub" id="hires-${k}"></p><div class="skills" id="sk-${k}"></div>
    <div class="row"><label class="sub" for="lim-${k}">זמן משחק ביום</label><select class="txt" id="lim-${k}" data-kid="${k}" style="max-width:180px">${[[0,'בלי הגבלה'],[20,'20 דקות'],[30,'30 דקות'],[45,'45 דקות'],[60,'שעה'],[90,'שעה וחצי'],[120,'שעתיים']].map(([m,t])=>`<option value="${m}">${t}</option>`).join('')}</select><span class="sub" id="limMsg-${k}"></span></div>
    <div id="kg-${k}" class="row"></div></article>`).join('');
  Object.keys(kids).forEach(k=>{
    if(!KIDV[k]){KIDV[k]=1;watch('kids/'+k,v=>{KIDV[k]=v||{};fillKid(k)});watch('kidGroups/'+k,v=>{KIDG[k]=v||{};fillKid(k);renderGroups()})}else fillKid(k);
    $('#lim-'+k).onchange=e=>{db.ref('kids/'+k+'/limit').set(+e.target.value).then(()=>{$('#limMsg-'+k).textContent='נשמר ✓'}).catch(err=>{$('#limMsg-'+k).textContent='לא נשמר: '+err.code})}})}
function fillKid(k){const v=typeof KIDV[k]==='object'?KIDV[k]:{};const p=v.progress||{};const el=$('#stats-'+k);if(!el)return;
  const minToday=p.day===today()?(p.min||0):0;
  el.innerHTML=[['רמה',p.lv||1],['דקות היום',minToday+(v.limit?' / '+v.limit:'')],['מילים שנלמדו',p.words||0],['הרפתקאות',p.adv||0],['יהלומים ביד',p.gems??'–'],['חיסכון בבנק',p.sav??'–'],['דרגת חוקר',p.rank||'Rookie'],['מפתחות זהב 🗝️',p.keys||0],['מקומות סודיים',(p.gates||0)+' / 3'],['תעלומות שנפתרו',(p.badges&&p.badges.det)||0]]
    .map(([a,b])=>`<div class="stat"><small>${a}</small><b>${esc(b)}</b></div>`).join('');
  const hl=$('#hires-'+k);if(hl){const H=p.hires||[];hl.innerHTML=H.length?'🦸 עסקאות גיבורים אחרונות: '+H.map(x=>`${x.a>0?'+':''}${x.a}💎 ${esc(x.who==='city'?'עבודה בעיר':x.who)}`).join(' · '):''}
  const sk=p.sk||{};$('#sk-'+k).innerHTML=Object.entries(SKILLS).map(([s,t])=>{const val=+sk[s]||3;return`<div class="sk">${t} · ${val.toFixed(1)}<div class="bar"><i style="width:${val*10}%"></i></div></div>`}).join('');
  $('#last-'+k).textContent=ago(p.last);const fcEl=$('#fc-'+k);if(fcEl)fcEl.textContent=v.fc||'…';if(v.parent===ME.uid&&!v.fc)backfill(k,v);const sel=$('#lim-'+k);if(sel&&document.activeElement!==sel)sel.value=String(v.limit||0);
  const groups=Object.keys(KIDG[k]||{});$('#kg-'+k).innerHTML=groups.length?groups.map(g=>`<span class="pill ok">👫 ${esc(GNAMES[g]||'קבוצה')}</span>`).join(''):'<span class="sub">עוד לא בקבוצה</span>';
  groups.forEach(g=>{if(!GNAMES[g])db.ref('groups/'+g+'/meta/name').get().then(s=>{GNAMES[g]=s.val()||'קבוצה';fillKid(k)}).catch(()=>{})})}
const GNAMES={};

$('#addKid').onsubmit=async e=>{e.preventDefault();const nick=$('#kidNick').value.trim();if(!nick)return;const msg=$('#addMsg');msg.textContent='פותחים חשבון…';
  const code=rnd('abcdefghjkmnpqrstuvwxyz',3)+rnd('23456789',3),pin=rnd('0123456789',6);let sec;
  try{sec=firebase.initializeApp(FIREBASE_CONFIG,'sec'+Date.now());const c=await sec.auth().createUserWithEmailAndPassword(code+'@'+KID_DOMAIN,pin+'-sl');const kid=c.user.uid;await sec.auth().signOut();
    const fc=newFc();const up={};up['kids/'+kid+'/parent']=ME.uid;up['kids/'+kid+'/nick']=nick;up['kids/'+kid+'/code']=code;up['kids/'+kid+'/fc']=fc;up['kids/'+kid+'/pname']=pname();up['kids/'+kid+'/created']=firebase.database.ServerValue.TIMESTAMP;
    up['fcodes/'+fc]=kid;up['pub/'+kid]={nick,created:firebase.database.ServerValue.TIMESTAMP};up['parents/'+ME.uid+'/kids/'+kid]={nick,code,pin};
    await db.ref().update(up);$('#kidNick').value='';msg.innerHTML=`נפתח! קוד שחקן <span class="code">${code}</span> PIN <span class="code">${pin}</span>. הם שמורים גם בכרטיס של הילד למעלה.`}
  catch(err){msg.textContent='לא הצליח: '+(err.code||err.message)}finally{if(sec)sec.delete().catch(()=>{})}};

/* ---------- friend codes ---------- */
const newFc=()=>'F-'+rnd('ABCDEFGHJKMNPQRSTUVWXYZ23456789',5);
const pname=()=>String((ME.displayName||'').split(' ')[0]||'הורה').slice(0,20);
const BF={};
async function backfill(k,v){if(BF[k])return;BF[k]=1;const fc=newFc();const up={};up['kids/'+k+'/fc']=fc;up['kids/'+k+'/pname']=pname();up['fcodes/'+fc]=k;up['pub/'+k]={nick:v.nick||'',created:v.created||firebase.database.ServerValue.TIMESTAMP};
  try{await db.ref().update(up)}catch(e){console.warn('backfill',e);BF[k]=0}}

/* ---------- groups: supervise, don't approve ---------- */
const GW={},KINV={};
const kidsOf=()=>Object.keys(PDATA.kids||{});
function renderGroups(){const box=$('#groups');const kids=kidsOf();if(!kids.length){box.innerHTML='';return}
  kids.forEach(k=>{if(!KINV[k]){KINV[k]={};watch('kidInvites/'+k,v=>{KINV[k]=v||{};paintAll()})}});
  const gids=[...new Set(kids.flatMap(k=>Object.keys(KIDG[k]||{})))];
  gids.forEach(g=>{if(GW[g])return;GW[g]={};['meta','members','invites','reports','presence'].forEach(part=>watch('groups/'+g+'/'+part,v=>{GW[g][part]=v||{};if(part==='meta')GNAMES[g]=(v||{}).name;paintAll()}))});
  paintAll()}
function paintAll(){const box=$('#groups');const kids=kidsOf();const P0=PDATA.kids||{};let h='';
  const inv=kids.flatMap(k=>Object.entries(KINV[k]||{}).map(([g,v])=>({k,g,v})));
  if(inv.length)h+=`<div class="box"><h3>📩 הזמנות שהילדים קיבלו</h3><ul class="list">${inv.map(({k,g,v})=>`<li><span><b dir="auto">${esc(v.from)}</b> הזמינ/ה את <b dir="auto">${esc(P0[k].nick)}</b> לקבוצה <b dir="auto">${esc(v.gname)}</b></span><button class="btn ghost mini" data-dec="${k}|${g}">לבטל את ההזמנה</button></li>`).join('')}</ul></div>`;
  const gids=[...new Set(kids.flatMap(k=>Object.keys(KIDG[k]||{})))];
  if(!gids.length)h+='<p class="sub">הילדים עוד לא בקבוצות. כשהם יפתחו קבוצה או יצטרפו לאחת, היא תופיע כאן.</p>';
  gids.forEach(g=>{const G=GW[g]||{};const m=G.meta||{};const mem=Object.entries(G.members||{});const rep=G.reports||{};const online=new Set(Object.keys(G.presence||{}).map(p=>p.split('_')[0]));
    const iAmOp=m.op===ME.uid||m.owner===ME.uid;const mine=kids.filter(k=>(KIDG[k]||{})[g]);const now=Date.now();
    h+=`<div class="box"><div class="row"><h3 class="grow" dir="auto">👫 ${esc(m.name||'קבוצה')}</h3><span class="sub">${mem.length} ילדים · ${online.size} מחוברים עכשיו</span></div>
      <p class="sub">פתח/ה את הקבוצה: <b dir="auto">${esc(m.onick||'?')}</b>${iAmOp?' (הילד/ה שלך, ולכן את/ה יכול/ה להוציא כל אחד)':''}</p>
      <ul class="list">${mem.map(([k,v])=>{const isMine=!!P0[k];const r=Object.keys(rep[k]||{}).length;const iRep=!!(rep[k]||{})[ME.uid];const fresh=v.t&&now-v.t<48*3600e3;
        return`<li class="${r?'warn':''}"><span><span class="dot ${online.has(k)?'on':''}"></span><b dir="auto">${esc(v.nick)}</b>${isMine?' <span class="pill ok">שלך</span>':''}
          <span class="sub"> · ההורה: ${esc(v.pn||'לא ידוע')}${v.by&&v.by!=='owner'?' · הוזמנ/ה ע״י '+esc(v.by):''}${fresh?' · <b class="new">חדש</b>':''}${r?` · 🚩 ${r} דיווחים`:''}</span></span>
          <span class="row">${isMine?`<button class="btn ghost mini" data-out="${g}|${k}|${esc(v.parent||'')}">להוציא את ${esc(v.nick)} מהקבוצה</button>`:`
            <button class="btn ghost mini" data-rep="${g}|${k}" aria-pressed="${iRep}">${iRep?'✓ סימנתי':'🚩 לא מוכר/ת לי'}</button>
            ${mine.map(mk=>`<button class="btn ghost mini" data-blk="${mk}|${k}">🚫 לחסום מ־${esc(P0[mk].nick)}</button>`).join('')}
            ${iAmOp?`<button class="btn ghost mini" data-out="${g}|${k}|${esc(v.parent||'')}">להוציא מהקבוצה</button>`:''}`}</span></li>`}).join('')}</ul>
      ${Object.keys(G.invites||{}).length?`<p class="sub">📩 הוזמנו ועוד לא הצטרפו: ${Object.values(G.invites).map(x=>esc(x.nick)).join(', ')}</p>`:''}</div>`});
  box.innerHTML=h}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-dec],[data-out],[data-rep],[data-blk]');if(!b)return;
  try{if(b.dataset.dec){const[k,g]=b.dataset.dec.split('|');b.disabled=true;await Promise.all([db.ref('kidInvites/'+k+'/'+g).remove(),db.ref('groups/'+g+'/invites/'+k).remove().catch(()=>{})])}
    if(b.dataset.out){if(!confirmRemove(b))return;const[g,k,p]=b.dataset.out.split('|');b.disabled=true;const up={};up['groups/'+g+'/members/'+k]=null;up['kidGroups/'+k+'/'+g]=null;if(p)up['groups/'+g+'/pw/'+p+'/'+k]=null;
      await db.ref().update(up);const pres=(GW[g]&&GW[g].presence)||{};Object.keys(pres).filter(x=>x.startsWith(k+'_')).forEach(x=>db.ref('groups/'+g+'/presence/'+x).remove().catch(()=>{}))}
    if(b.dataset.rep){const[g,k]=b.dataset.rep.split('|');const ref=db.ref('groups/'+g+'/reports/'+k+'/'+ME.uid);if(b.getAttribute('aria-pressed')==='true')await ref.remove();else await ref.set(Date.now())}
    if(b.dataset.blk){if(!confirmRemove(b))return;const[mk,k]=b.dataset.blk.split('|');b.disabled=true;await db.ref('kids/'+mk+'/block/'+k).set(true);b.textContent='🚫 נחסם/ה';}}
  catch(err){alertBox(err.code||err.message)}finally{b.disabled=false}});
function confirmRemove(b){if(b.dataset.sure)return true;b.dataset.sure='1';b.textContent='בטוח? ללחוץ שוב';return false}
function alertBox(t){const p=document.createElement('p');p.className='sub';p.textContent='שגיאה: '+t;$('#groups').prepend(p);setTimeout(()=>p.remove(),5000)}
})();
