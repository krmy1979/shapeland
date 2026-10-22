/* Shapeland · a world by Shirel Yitzhak */
/* ===================== SEA, POOL, ADVENTURE PARK, CREATURES, DETECTIVE ===================== */
ZC.adv=[46,-178];
const AX0=32,AX1=60;
const PLATS=[];      // {x0,x1,z0,z1,top}
const SWIMS=[];      // {x0,x1,z0,z1,y,name}
const LAVAS=[];      // {x0,x1,z0,z1}
const CREAT=[];      // roaming creatures
const PICKUPS=[];    // underwater treasure
function floorAt(x,z){let h=0,swim=null,lava=false;
  for(const s of SWIMS){if(s.on&&!s.on())continue;if(x>s.x0&&x<s.x1&&z>s.z0&&z<s.z1){h=s.y;swim=s}}
  for(const l of LAVAS)if(x>l.x0&&x<l.x1&&z>l.z0&&z<l.z1){h=-.6;lava=true}
  for(const p of PLATS)if(x>p.x0&&x<p.x1&&z>p.z0&&z<p.z1&&p.top>h-.01&&(!lava||true)){if(p.top>=h){h=p.top;lava=false;swim=null}}
  return{h,swim,lava}}

/* ---------- the sea at Ashkelon beach: swim, find treasure ---------- */
(()=>{const x0=-60,x1=-24,z0=-160,z1=-100;SWIMS.push({x0:-46,x1:-24.05,z0:-154.5,z1:-105.5,y:-1.2,name:'sea'});
  const sf=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),new THREE.MeshStandardMaterial({color:'#38BDF8',transparent:true,opacity:.55,roughness:.15}));sf.rotation.x=-Math.PI/2;sf.position.set((x0+x1)/2,-.3,(z0+z1)/2);scene.add(sf);ZFX.sea=sf;
  wbox(x1-x0,.1,z1-z0,'#F3D9A4',(x0+x1)/2,-1.55,(z0+z1)/2,false);
  for(let z=-150;z<-106;z+=3){const b=mesh(new THREE.SphereGeometry(.22,10,8),mat(z%2?'#EF4444':'#FFFFFF'));b.position.set(-46,-.25,z);scene.add(b)}
  const lb=label('Swim only inside the buoys 🛟','#FFFFFF','#0369A1',.45);lb.position.set(-40,1.6,-128);scene.add(lb);
  // lifeguard tower
  const lg=new THREE.Group();[[-.5,-.5],[.5,-.5],[-.5,.5],[.5,.5]].forEach(([a,b])=>{const l=mesh(new THREE.CylinderGeometry(.06,.06,2.2,6),mat('#FFFFFF'));l.position.set(a,1.1,b);lg.add(l)});
  const cab=mesh(new THREE.BoxGeometry(1.5,1,1.5),mat('#EF4444'));cab.position.y=2.6;lg.add(cab);const rf=mesh(new THREE.ConeGeometry(1.2,.6,4),mat('#FFFFFF'));rf.rotation.y=Math.PI/4;rf.position.y=3.4;lg.add(rf);
  const ll=label('Lifeguard 🛟','#EF4444','#FFFFFF',.42);ll.position.y=4.2;lg.add(ll);lg.position.set(-21.5,0,-128);scene.add(lg);
  // fish & a turtle
  for(let i=0;i<7;i++){const f=new THREE.Group();const b=mesh(new THREE.SphereGeometry(.22,10,8),mat(['#F97316','#FDE047','#F472B6','#60A5FA'][i%4]));b.scale.set(1.5,.8,.6);f.add(b);
    const t=mesh(new THREE.ConeGeometry(.16,.3,4),mat(['#F97316','#FDE047','#F472B6','#60A5FA'][i%4]));t.rotation.z=Math.PI/2;t.position.x=-.38;f.add(t);scene.add(f);CREAT.push({kind:'fish',g:f,cx:-35+Math.random()*8,cz:-140+i*5,r:2+Math.random()*2,sp:.6+Math.random()*.5,ph:i})}
  const tu=new THREE.Group();const sh=mesh(new THREE.SphereGeometry(.45,14,10,0,Math.PI*2,0,Math.PI/2),mat('#15803D'));tu.add(sh);const hd=mesh(new THREE.SphereGeometry(.16,10,8),mat('#86EFAC'));hd.position.set(.5,.05,0);tu.add(hd);
  scene.add(tu);CREAT.push({kind:'turtle',g:tu,cx:-36,cz:-124,r:5,sp:.25,ph:0});
  // underwater treasure (swim over it to pick it up)
  const T=[['starfish','⭐','כוכב ים','#F97316'],['shell','🐚','צדף','#FBCFE8'],['pearl','⚪','פנינה','#FFFFFF'],['coin','🪙','מטבע','#FACC15'],['crab','🦀','סרטן','#EF4444']];
  for(let i=0;i<9;i++){const[w,em,he,c]=T[i%T.length];const m=mesh(i%5===2?new THREE.SphereGeometry(.16,12,10):new THREE.CylinderGeometry(.22,.22,.08,i%5===0?5:12),mat(c,{emissive:c,emissiveIntensity:.25}));
    const x=-43+Math.random()*16,z=-150+Math.random()*40;m.position.set(x,-1.45,z);scene.add(m);PICKUPS.push({m,w,em,he,x,z,back:0})}})();

/* ---------- swimming pool in the garden at home ---------- */
(()=>{const[cx,cz]=ZC.home;const x0=cx+5.5,x1=cx+9.5,z0=cz+4,z1=cz+7;SWIMS.push({x0,x1,z0,z1,y:-.95,name:'pool',on:()=>!!P.pool&&ME.zone==='home'});
  const g=new THREE.Group();const water=mesh(new THREE.BoxGeometry(x1-x0,.04,z1-z0),mat('#38BDF8',{roughness:.1,emissive:'#0EA5E9',emissiveIntensity:.15}),false);water.position.y=.04;g.add(water);
  [[0,-(z1-z0)/2-.15,x1-x0+.6,.3],[0,(z1-z0)/2+.15,x1-x0+.6,.3],[-(x1-x0)/2-.15,0,.3,z1-z0],[(x1-x0)/2+.15,0,.3,z1-z0]].forEach(([x,z,w,d])=>{const e=mesh(new THREE.BoxGeometry(w,.14,d),mat('#F5F5F4'));e.position.set(x,.07,z);g.add(e)});
  const lad=mesh(new THREE.TorusGeometry(.2,.03,6,12,Math.PI),mat('#94A3B8'));lad.position.set(-(x1-x0)/2+.3,.2,-(z1-z0)/2-.05);g.add(lad);
  g.position.set((x0+x1)/2,0,(z0+z1)/2);scene.add(g);ZFX.pool=g;
  const sign=signBoard('Pool 🏊 60 💎','#0EA5E9','#FFFFFF',1.8);sign.position.set((x0+x1)/2,0,z0-.8);scene.add(sign);ZFX.poolSign=sign;rootify(sign);sign.userData.zact=()=>buyPool();EXTRA_PICK.push(sign);
  const upd=()=>{g.visible=!!P.pool;sign.visible=!P.pool};upd();ZFX.poolUpd=upd})();
function buyPool(){if(P.pool)return;if(P.gems<60){toast(`בריכה עולה 60 💎. חסרים ${fmt(60-P.gems)} 💎`);say('A pool costs sixty gems.');return}
  P.gems-=60;P.pool=1;logm('בריכה בגינה','Swimming pool',-60);save();renderHud();ZFX.poolUpd();sfx.win();burst('🏊 Pool!');say('Your new pool is ready! Jump in!')}

/* ---------- Adventure Park: jump over Slime Lake, avoid the bouncy slimes ---------- */
(()=>{const gr=wbox(AX1-AX0,.5,46,'#5DBB63',(AX0+AX1)/2,-.25,-178.5,false);EXTRA_PICK.push(gr);wbox(AX1-AX0,4,46,'#4D7C0F',(AX0+AX1)/2,-2.6,-178.5,false);
  // Slime Lake
  const L={x0:36,x1:58,z0:-190,z1:-170};LAVAS.push(L);const lk=mesh(new THREE.BoxGeometry(L.x1-L.x0,.1,L.z1-L.z0),mat('#84CC16',{emissive:'#65A30D',emissiveIntensity:.35,roughness:.2}),false);lk.position.set((L.x0+L.x1)/2,-.02,(L.z0+L.z1)/2);scene.add(lk);ZFX.lake=lk;
  const ll=label('Slime Lake! Jump on the stones 🟢','#65A30D','#FFFFFF',.5);ll.position.set(47,3.2,-168.5);scene.add(ll);
  // stepping stones path (start at north, finish at south-east)
  const S=[[38,-172,.35,1.6],[40.2,-174.2,.6,1.4],[42.6,-175.4,.85,1.3],[45,-174.4,.6,1.3],[47.4,-176,.9,1.2],[49.4,-178.2,1.2,1.2],[51.6,-179.6,.9,1.2],[53.6,-181.6,.6,1.3],[55.4,-184,.4,1.4],[56.6,-187.2,.3,2.2]];
  S.forEach(([x,z,top,s],i)=>{const st=mesh(new THREE.CylinderGeometry(s*.55,s*.62,top+.6,12),mat(i===S.length-1?'#FDE047':['#A8A29E','#D6D3D1','#78716C'][i%3]));st.position.set(x,(top-.6)/2,z);scene.add(st);PLATS.push({x0:x-s*.5,x1:x+s*.5,z0:z-s*.5,z1:z+s*.5,top})});
  // start pad & finish flag
  const sp=mesh(new THREE.BoxGeometry(4,.3,3),mat('#FDE68A'));sp.position.set(37,.15,-167.8);scene.add(sp);PLATS.push({x0:35,x1:39,z0:-169.3,z1:-166.3,top:.3});
  const sl=label('START 🏁 Adventure Run','#F59E0B','#FFFFFF',.5);sl.position.set(37,2.6,-167.8);scene.add(sl);
  const fl=new THREE.Group();const pole=mesh(new THREE.CylinderGeometry(.06,.06,2.4,8),mat('#E5E7EB'));pole.position.y=1.2;fl.add(pole);const fg=mesh(new THREE.BoxGeometry(.9,.55,.04),mat('#EF4444'));fg.position.set(.45,2.1,0);fl.add(fg);
  fl.position.set(56.6,.3,-187.2);scene.add(fl);const fn=label('FINISH 🏆','#EF4444','#FFFFFF',.45);fn.position.set(56.6,3.2,-187.2);scene.add(fn);
  // land path to the start + trees
  [[34,-158],[58,-158],[34,-198],[58,-198],[45,-196],[40,-160],[52,-162]].forEach(([x,z])=>ztree(x,z,'#22C55E'));
  const ar=new THREE.Group();const a=mesh(new THREE.TorusGeometry(2.6,.25,10,26,Math.PI),mat('#65A30D'));a.position.y=1.2;ar.add(a);[-2.6,2.6].forEach(x=>{const p=mesh(new THREE.CylinderGeometry(.24,.24,1.2,10),mat('#65A30D'));p.position.set(x,.6,0);ar.add(p)});
  const al=label('Adventure Park 🌿','#65A30D','#FFFFFF',.6);al.position.y=4.5;ar.add(al);ar.position.set(46,0,-157.5);scene.add(ar);
  placeAt(signBoard('Watch out for the slimes!','#ECFCCB','#3F6212',2.6),36,-162,40,-165);
  // bouncy slimes patrol the path to the start
  [[40,-163,3.5,1.4],[44,-166,3,1.1],[50,-162,4,1.6]].forEach(([x,z,r,sp],i)=>{const s=new THREE.Group();const body=mesh(new THREE.SphereGeometry(.55,16,12),mat(['#A3E635','#22D3EE','#F472B6'][i],{transparent:true,opacity:.85}));body.scale.y=.75;body.position.y=.42;s.add(body);
    [-1,1].forEach(k=>{const e=mesh(new THREE.SphereGeometry(.1,8,6),mat('#FFFFFF'));e.position.set(k*.17,.62,.4);s.add(e);const p=mesh(new THREE.SphereGeometry(.05,8,6),mat('#111827'));p.position.set(k*.17,.62,.48);s.add(p)});
    s.position.set(x,0,z);scene.add(s);CREAT.push({kind:'slime',g:s,cx:x,cz:z,r,sp,ph:i*2,body,hitT:0,jumped:0})});
  // a friendly bunny
  const bn=new THREE.Group();const bb=mesh(new THREE.SphereGeometry(.3,12,10),mat('#FFFFFF'));bb.position.y=.3;bn.add(bb);const bh=mesh(new THREE.SphereGeometry(.2,12,10),mat('#FFFFFF'));bh.position.set(0,.55,.2);bn.add(bh);
  [-1,1].forEach(k=>{const e=mesh(new THREE.SphereGeometry(.06,8,6),mat('#FFFFFF'));e.scale.set(1,3.5,.6);e.position.set(k*.08,.85,.18);bn.add(e)});bn.position.set(52,0,-194);scene.add(bn);rootify(bn);bn.userData.zact=()=>sayWord('bunny','ארנב');EXTRA_PICK.push(bn);CREAT.push({kind:'bunny',g:bn,cx:50,cz:-194,r:3,sp:.5,ph:0})})();

/* ---------- a crab on the beach that chases you (only a pinch!) ---------- */
(()=>{const c=new THREE.Group();const b=mesh(new THREE.SphereGeometry(.35,12,10),mat('#EF4444'));b.scale.set(1.4,.6,1);b.position.y=.25;c.add(b);
  [-1,1].forEach(k=>{const cl=mesh(new THREE.SphereGeometry(.15,10,8),mat('#DC2626'));cl.position.set(k*.55,.3,.3);c.add(cl);for(let j=0;j<3;j++){const l=mesh(new THREE.CylinderGeometry(.03,.03,.4,5),mat('#B91C1C'));l.rotation.z=k*1.1;l.position.set(k*.45,.15,-.15+j*.15);c.add(l)}
    const e=mesh(new THREE.SphereGeometry(.07,8,6),mat('#111827'));e.position.set(k*.12,.5,.25);c.add(e)});
  c.position.set(CX-19,0,CZ);scene.add(c);rootify(c);c.userData.zact=()=>sayWord('crab','סרטן');EXTRA_PICK.push(c);CREAT.push({kind:'crab',g:c,cx:CX-19,cz:CZ,r:6,sp:1.5,ph:0,hitT:0,chase:0})})();

/* ---------- Detective Dan: math mysteries in the city ---------- */
const DAN={g:'boy',hair:'side',hc:'#4A2E1F',skin:'#E3A97F',top:'#92400E',bot:'pants',bc:'#1D2A48'};
(()=>{const d=human3D(Object.assign({kind:'human',eyes:'big'},DAN));const hd=d.userData.head;const h=mesh(new THREE.CylinderGeometry(.42,.42,.04,18),mat('#78350F'));h.position.y=.24;hd.add(h);const c=mesh(new THREE.CylinderGeometry(.27,.31,.26,16),mat('#78350F'));c.position.y=.36;hd.add(c);
  const lb=label('Detective Dan 🕵️','#78350F','#FFFFFF',.45);lb.position.y=2.5;d.add(lb);const mk=marker('?','#78350F');mk.position.y=3.1;d.add(mk);d.position.set(CX+9,0,CZ+11);d.lookAt(CX+9,0,CZ+16);scene.add(d);rootify(d);d.userData.zact=()=>openMystery();EXTRA_PICK.push(d)})();
let MY=null;
const SUS=[['Lily','girl','#F472B6','ponytail','#E8C268'],['Ben','boy','#60A5FA','short','#1F1B1A'],['Max','boy','#34D399','spiky','#C8562A'],['Noa','girl','#A78BFA','bob','#4A2E1F'],['Tom','boy','#F59E0B','curlyshort','#8A5530'],['Mia','girl','#FB7185','braids','#1F1B1A']];
function mysteryCase(){const L=P.sk.math;const sus=shuffle(SUS).slice(0,3);const thing=pick([['cookies','עוגיות'],['stickers','מדבקות'],['marbles','גולות'],['coins','מטבעות'],['candies','סוכריות']]);
  const clue=()=>{let a,txt;
    if(L<3.5){const t=rnd(0,1);if(t){const x=rnd(3,9),y=rnd(2,8);a=x+y;txt=`had ${NUMW20[x]} ${thing[0]} and found ${NUMW20[y]} more`}else{const x=rnd(10,18),y=rnd(2,8);a=x-y;txt=`had ${NUMW20[x]} ${thing[0]} and gave away ${NUMW20[y]}`}}
    else if(L<6){const t=rnd(0,2);if(t===0){const x=rnd(2,5),y=rnd(2,6);a=x*y;txt=`has ${x} bags with ${y} ${thing[0]} in each bag`}else if(t===1){const x=rnd(12,40),y=rnd(3,11);a=x-y;txt=`had ${x} ${thing[0]} and ate ${y}`}else{const x=rnd(10,30),y=rnd(5,20);a=x+y;txt=`has ${x} ${thing[0]} at home and ${y} at school`}}
    else{const t=rnd(0,2);if(t===0){const x=pick([20,24,30,36,40,48]);a=x/2;txt=`had ${x} ${thing[0]} and gave half to a friend`}else if(t===1){const x=pick([12,16,20,24,28]);a=x/4*3;txt=`had ${x} ${thing[0]} and lost a quarter of them`}else{const x=rnd(3,6),y=rnd(4,9),z=rnd(2,9);a=x*y+z;txt=`has ${x} boxes of ${y} ${thing[0]} and ${z} more in a pocket`}}
    return{a,txt}};
  let cl;do{cl=sus.map(clue)}while(new Set(cl.map(c=>c.a)).size<3);
  const most=pick([true,false]);const vals=cl.map(c=>c.a);const ans=vals.indexOf(most?Math.max(...vals):Math.min(...vals));
  const story=most?`Someone has the most ${thing[0]}. That person is the ${thing[0].replace(/s$/,"")} champion! Who is it?`:`The winner has the fewest ${thing[0]} left. Who is it?`;
  return{sus,thing,cl,ans,story,wrong:null,most}}
function openMystery(){PANEL='mystery';if(!MY)MY=mysteryCase();renderMystery()}
function renderMystery(){const m=MY;sheet(`<div class="npchead"><div class="face" style="background:#FEF3C7">${humanSVG(Object.assign({kind:'human'},DAN))}</div><div class="grow"><h2>${en('Detective Dan')}</h2><p class="sub">תעלומה 🕵️ · ${m.thing[1]}</p></div>${gemTag()}</div>
  <div class="bubble">${en(m.story)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(m.story+' '+m.sus.map((s,i)=>s[0]+' '+m.cl[i].txt+'.').join(' '))}">🔊</button><button class="btn ghost mini" data-a="myhint">💡</button></div>
  <div class="clues">${m.sus.map((s,i)=>`<button class="clue ${m.wrong===i?'no':''}" data-a="mypick" data-i="${i}">${humanSVG({kind:'human',g:s[1],top:s[2],hair:s[3],hc:s[4],bot:s[1]==='girl'?'skirt':'pants'})}<span class="en" dir="ltr"><b>${s[0]}</b> ${esc(m.cl[i].txt)}.</span></button>`).join('')}</div>
  <div class="hint" id="hintTxt" hidden>מחשבים לכל חשוד/ה כמה ${m.thing[1]} יש בסוף, ואז בוחרים את ${m.most?'הכי הרבה':'הכי מעט'}. אפשר לכתוב על דף 📝</div>
  <button class="btn ghost" data-a="close">${en('Later')}</button>`);say(m.story)}
ACTX.myhint=()=>{const h=$('#hintTxt');if(h)h.hidden=!h.hidden};
ACTX.mypick=d=>{const m=MY;const i=+d.i;if(i!==m.ans){m.wrong=i;learnResult('math',false);sfx.bad();say(`Hmm, ${m.sus[i][0]} has ${m.cl[i].a}. Check again!`);KEEP=true;renderMystery();return}
  learnResult('math',true);P.badges.det=(P.badges.det||0)+1;addGems(6,'תעלומה של Detective Dan','Mystery');addXp(20);sfx.win();burst('🕵️ +6 💎');
  const msg=`Case closed! ${m.sus[i][0]} has ${m.cl[i].a} ${m.thing[0]}. Great detective work!`;MY=null;
  sheet(`<div class="npchead"><div class="face" style="background:#FEF3C7">${humanSVG(Object.assign({kind:'human'},DAN))}</div><div class="grow"><h2>${en('Case closed!')}</h2><p class="sub">תיקים שנפתרו: ${P.badges.det}</p></div></div><div class="bubble">${en(msg)}</div>
    <div class="row"><button class="btn" data-a="mynext">🕵️ ${en('New case')}</button><button class="btn ghost" data-a="close">${en('Bye!')}</button></div>`);say(msg)};
ACTX.mynext=()=>{MY=null;openMystery()};

/* ---------- Boys vs Girls this week (points = gems earned from activities) ---------- */
const weekId=()=>{const d=new Date();const j=new Date(d.getFullYear(),0,1);return d.getFullYear()+'-'+Math.ceil(((d-j)/864e5+j.getDay()+1)/7)};
function teamAdd(n){if(!(n>0))return;if(!P.tp||P.tp.w!==weekId())P.tp={w:weekId(),p:0};P.tp.p+=Math.round(n);save()}
const _addGems=addGems;addGems=function(n,he,enw){_addGems(n,he,enw);if(n>0&&he)teamAdd(n)};
async function teamBoard(){let girls=0,boys=0,rows=[];const myP=(P.tp&&P.tp.w===weekId())?P.tp.p:0;
  if(window.CLOUD&&CLOUD.user&&CLOUD.gid){try{const v=(await CLOUD.db.ref('groups/'+CLOUD.gid+'/teams').get()).val()||{};Object.entries(v).forEach(([k,t])=>{if(!t||t.w!==weekId())return;const p=k===CLOUD.user.uid?myP:(+t.p||0);if(t.g==='boy')boys+=p;else girls+=p;rows.push([t.n,p,t.g])});
      if(!v[CLOUD.user.uid]){if(P.ch.g==='boy')boys+=myP;else girls+=myP;rows.push([P.name,myP,P.ch.g])}}catch(e){}}
  else{if(P.ch.g==='boy')boys=myP;else girls=myP;rows.push([P.name,myP,P.ch.g])}
  rows.sort((a,b)=>b[1]-a[1]);return{girls,boys,rows}}
function pushTeam(){if(!(window.CLOUD&&CLOUD.user&&CLOUD.gid))return;const p=(P.tp&&P.tp.w===weekId())?P.tp.p:0;CLOUD.db.ref('groups/'+CLOUD.gid+'/teams/'+CLOUD.user.uid).set({g:P.ch.g==='boy'?'boy':'girl',n:String(P.name||'').slice(0,14),p,w:weekId()}).catch(()=>{})}
setInterval(pushTeam,60000);
const _openMall=openMall;openMall=async function(){_openMall();const b=await teamBoard();const box=document.querySelector('#sheet .sheet-in');if(!box||PANEL!=='mall')return;const tot=Math.max(1,b.girls+b.boys);
  box.insertAdjacentHTML('afterbegin',`<div class="vs"><h3>${en('Girls vs Boys · this week')}</h3><div class="vsbar"><i class="g" style="width:${b.girls/tot*100}%"></i><i class="b" style="width:${b.boys/tot*100}%"></i></div>
    <div class="row" style="justify-content:space-between"><b>💖 בנות ${b.girls}</b><b>${b.boys} בנים 💙</b></div><p class="sub">כל יהלום שמרוויחים השבוע בפעילויות (עבודה, אימונים, שיעורים, תעלומות, גולים, מסלול ההרפתקאות) הוא נקודה לקבוצה שלך. מתאפס כל שבוע.</p>
    <ol class="sub">${b.rows.slice(0,6).map(r=>`<li dir="auto">${r[2]==='boy'?'💙':'💖'} ${esc(r[0])} · ${r[1]}</li>`).join('')}</ol></div>`)};

/* ---------- per-frame: creatures, pickups, swimming, course ---------- */
let RUN=null;
function stepAdventure(dt,t){
  CREAT.forEach(c=>{const g=c.g;
    if(c.kind==='fish'){const a=t*c.sp+c.ph;g.position.set(c.cx+Math.cos(a)*c.r,-.95+Math.sin(t*2+c.ph)*.1,c.cz+Math.sin(a)*c.r);g.rotation.y=-a}
    else if(c.kind==='turtle'){const a=t*c.sp;g.position.set(c.cx+Math.cos(a)*c.r,-.6,c.cz+Math.sin(a)*c.r);g.rotation.y=-a-Math.PI/2}
    else if(c.kind==='bunny'){const a=t*c.sp;g.position.set(c.cx+Math.cos(a)*c.r,Math.abs(Math.sin(t*6))*.3,c.cz+Math.sin(a)*c.r);g.rotation.y=-a}
    else if(c.kind==='slime'){const a=Math.sin(t*c.sp+c.ph);g.position.x=c.cx+a*c.r;g.position.z=c.cz;g.position.y=Math.abs(Math.sin(t*5+c.ph))*.5;c.body.scale.y=.75-Math.abs(Math.sin(t*5+c.ph))*.15;
      if(ME.zone==='adv'&&c.hitT<=0){const d=Math.hypot(ME.pos.x-g.position.x,ME.pos.z-g.position.z);
        if(d<.8&&ME.y<.6){c.hitT=1.2;const dx=(ME.pos.x-g.position.x)/(d||1),dz=(ME.pos.z-g.position.z)/(d||1);tryMove(dx*1.8,dz*1.8);ME.vy=5;blip(160,.15,'square',.06);say(pick(['Boing! Run away!','Oops! A slime!','Jump over the slime!']))}
        else if(d<1&&ME.y>.7&&!c.jumped){c.jumped=1;c.hitT=1.5;addGems(1,'קפיצה מעל סליים','Slime jump');blip(880,.08,'sine',.05);toast('🟢 קפיצה מעל הסליים! +1 💎')}}
      if(c.hitT>0){c.hitT-=dt;if(c.hitT<=0)c.jumped=0}}
    else if(c.kind==='crab'){if(c.hitT>0)c.hitT-=dt;const inBeach=ME.zone==='city'&&ME.pos.x<CX-14&&ME.pos.x>CX-24.5&&Math.abs(ME.pos.z-CZ)<14;
      let tx,tz;if(inBeach&&c.hitT<=0){tx=ME.pos.x;tz=ME.pos.z}else{tx=c.cx+Math.cos(t*.4)*2;tz=c.cz+Math.sin(t*.3)*c.r}
      const dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);if(d>.05){const st=Math.min(d,(inBeach?1.9:1)*dt);g.position.x+=dx/d*st;g.position.z+=dz/d*st;g.rotation.y=Math.atan2(dx,dz)+Math.PI/2}
      g.position.x=Math.max(CX-24,Math.min(CX-14.5,g.position.x));
      if(inBeach&&c.hitT<=0&&Math.hypot(ME.pos.x-g.position.x,ME.pos.z-g.position.z)<.7&&ME.y<.5){c.hitT=3;ME.vy=4.5;const dd=Math.hypot(dx,dz)||1;tryMove(-dx/dd*2,-dz/dd*2);blip(220,.2,'sawtooth',.05);say('Ouch! The crab pinched you! Run!');toast('🦀 הסרטן צבט! לברוח ממנו')}}});
  if(ZFX.sea)ZFX.sea.position.y=-.3+Math.sin(t*.9)*.04;
  if(ZFX.lake)ZFX.lake.material.emissiveIntensity=.3+Math.sin(t*3)*.08;
  // underwater treasure
  if(ME.swim&&ME.zone==='city')PICKUPS.forEach(p=>{if(p.back>0)return;if(Math.hypot(ME.pos.x-p.x,ME.pos.z-p.z)<1.1){p.back=1;p.m.visible=false;addGems(2,'אוצר בים','Sea treasure');sayWord(p.w,p.he);burst(p.em+' +2 💎');setTimeout(()=>{p.back=0;p.m.visible=true},90000)}});
  // adventure run timer
  if(ME.zone==='adv'){const onStart=ME.pos.x>35&&ME.pos.x<39&&ME.pos.z>-169.3&&ME.pos.z<-166.3;const fin=Math.hypot(ME.pos.x-56.6,ME.pos.z+187.2)<1.1&&ME.y>.2;
    if(onStart&&!RUN){RUN={t0:performance.now()}}
    if(RUN&&fin){const s=(performance.now()-RUN.t0)/1000;RUN=null;const best=P.advBest&&P.advBest<s?P.advBest:s;const nb=!P.advBest||s<P.advBest;P.advBest=best;addGems(10,'מסלול ההרפתקאות','Adventure run');addXp(25);sfx.win();
      burst(`🏆 ${s.toFixed(1)}s`);say(nb?`New record! ${Math.round(s)} seconds!`:`You made it! ${Math.round(s)} seconds.`);toast(`🏆 סיימת את המסלול ב־${s.toFixed(1)} שניות${nb?' · שיא חדש!':''} +10 💎`);save()}}}
