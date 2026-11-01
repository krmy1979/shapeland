/* Shapeland · a world by Shirel Yitzhak */
/* ===================== THE FIRST FIVE MINUTES: a hook, one clear goal at a time, fast wins =====================
   New players do not read a 7-page book or face 20 buttons. They see the Crystal of Unity burst, run after the light,
   say the magic word in English, earn a superpower, choose who they want to be, and meet Mosh on the beach.
   The full screen of buttons appears only after that. A guiding beam keeps pointing to the next story step. */
const FT={on:false,step:'',t:0,sparks:[],got:0,tgt:null,cine:0,allowPower:false,replay:false};
(()=>{const st=document.createElement('style');st.textContent=`
body.ft .hud:not(#pad),body.ft #pad .act:not(#bJump):not(.ftglow){visibility:hidden!important}
#ftPill{position:fixed;top:calc(env(safe-area-inset-top) + 14px);left:50%;transform:translateX(-50%);z-index:40;background:#1D2A48ee;color:#fff;border-radius:22px;padding:10px 18px;font:700 19px/1.3 system-ui,sans-serif;
  text-align:center;box-shadow:0 6px 18px #0004;max-width:88vw;pointer-events:none;animation:ftIn .4s ease}
#ftPill small{display:block;font-weight:500;font-size:14px;opacity:.85;direction:ltr}
#ftArrow{position:fixed;z-index:39;width:64px;height:64px;margin:-32px 0 0 -32px;pointer-events:none;font-size:50px;line-height:64px;text-align:center;color:#FACC15;-webkit-text-stroke:2px #1D2A48;filter:drop-shadow(0 0 10px #FDE68A)}
#ftCine{position:fixed;inset:0;z-index:60;pointer-events:none;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding-bottom:16vh;background:linear-gradient(transparent 60%,#0008)}
#ftCine b{color:#fff;font:800 26px/1.3 system-ui,sans-serif;text-align:center;text-shadow:0 3px 10px #000a;padding:0 18px;animation:ftIn .6s ease}
#ftCine small{color:#FDE68A;font:600 17px/1.3 system-ui,sans-serif;direction:ltr;margin-top:6px}
#ftSkip{position:fixed;bottom:calc(env(safe-area-inset-bottom) + 12px);left:12px;z-index:61;background:#fff8;border:0;border-radius:14px;padding:6px 12px;font:600 13px system-ui;color:#1D2A48}
@keyframes ftIn{from{opacity:0;transform:translate(-50%,-10px)}to{opacity:1}}
#ftCine b{animation:none}
.ftglow{animation:ftGlow 1s ease-in-out infinite!important;visibility:visible!important}
@keyframes ftGlow{0%,100%{box-shadow:0 0 0 0 #FACC15}50%{box-shadow:0 0 0 12px #FACC1555}}
body.ftreveal .hud{animation:ftPop .7s ease both}
@keyframes ftPop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
.ftword{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:44px;padding:14px 8px;border-radius:20px;border:3px solid #E0E7FF;background:#fff;flex:1}
.ftword b{font:800 22px system-ui;direction:ltr;color:#1D2A48}
.ftword.no{animation:ftShake .4s}.ftword.yes{background:#DCFCE7;border-color:#22C55E}
@keyframes ftShake{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
`;document.head.appendChild(st)})();

/* ---------- small pieces: pill, arrow, beam, cinematic text ---------- */
function ftPill(he,enl,prog){let p=$('#ftPill');if(!p){p=document.createElement('div');p.id='ftPill';document.body.appendChild(p)}p.hidden=false;p.innerHTML=`${he}${prog?` <span style="color:#FDE68A">${prog}</span>`:''}${enl?`<small>${enl}</small>`:''}`;p.style.animation='none';void p.offsetWidth;p.style.animation=''}
function ftPillOff(){const p=$('#ftPill');if(p)p.hidden=true}
const GUIDE={beam:null,arrow:null,tgt:null};
function guideBeam(){if(GUIDE.beam)return GUIDE.beam;const g=new THREE.Group();
  const b=new THREE.Mesh(new THREE.CylinderGeometry(.35,.6,14,16,1,true),new THREE.MeshBasicMaterial({color:'#FDE68A',transparent:true,opacity:.28,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));b.position.y=7;g.add(b);
  const r=new THREE.Mesh(new THREE.RingGeometry(.7,1,32),new THREE.MeshBasicMaterial({color:'#FACC15',transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}));r.rotation.x=-Math.PI/2;r.position.y=.06;g.add(r);g.userData.ring=r;
  g.visible=false;scene.add(g);return GUIDE.beam=g}
function guideArrow(){if(GUIDE.arrow)return GUIDE.arrow;const a=document.createElement('div');a.id='ftArrow';a.textContent='➤';a.hidden=true;document.body.appendChild(a);return GUIDE.arrow=a}
/* point at a spot in the world: a beam of light there, and an arrow on the edge of the screen when it is off-screen */
function stepGuide(t){const tg=FT.on?FT.tgt:(typeof storyGuide==='function'?storyGuide():null);const bm=guideBeam(),ar=guideArrow();
  const show=tg&&$('#sheet').hidden&&$('#title').hidden&&ME.zone===(tg.zone||'island')&&!FT.cine;
  bm.visible=!!show;if(!show){ar.hidden=true;return}
  bm.position.set(tg.x,tg.y||0,tg.z);bm.userData.ring.scale.setScalar(1+.15*Math.sin(t*4));bm.children[0].material.opacity=.22+.08*Math.sin(t*3);
  const d=Math.hypot(tg.x-ME.pos.x,tg.z-ME.pos.z);if(d<2.2){ar.hidden=true;return}
  const v=new THREE.Vector3(tg.x,1.5,tg.z).project(camera);const behind=v.z>1;let sx=(v.x+1)/2*innerWidth,sy=(1-v.y)/2*innerHeight;
  const on=!behind&&sx>40&&sx<innerWidth-40&&sy>90&&sy<innerHeight-160;
  if(on){ar.hidden=false;ar.style.left=sx+'px';ar.style.top=(sy-60+Math.sin(t*6)*8)+'px';ar.style.transform='rotate(90deg)';return}
  if(behind){sx=innerWidth-sx;sy=innerHeight-sy}const cx=innerWidth/2,cy=innerHeight/2;let dx=sx-cx,dy=sy-cy;if(behind&&Math.abs(dy)<1)dy=1;
  const k=Math.min((innerWidth/2-46)/Math.abs(dx||1e-3),(innerHeight/2-110)/Math.abs(dy||1e-3));ar.hidden=false;ar.style.left=(cx+dx*k)+'px';ar.style.top=(cy+dy*k)+'px';ar.style.transform=`rotate(${Math.atan2(dy,dx)}rad) scale(${1+.1*Math.sin(t*6)})`}
function ftCine(he,enl,ms){let c=$('#ftCine');if(!c){c=document.createElement('div');c.id='ftCine';document.body.appendChild(c)}c.hidden=false;c.innerHTML=`<b>${he}</b>${enl?`<small>${enl}</small>`:''}`;if(enl)say(enl,.92)}
function ftCineOff(){const c=$('#ftCine');if(c)c.hidden=true}

/* ---------- the opening ---------- */
const CRYSPOS=()=>CRYS?{x:CRYS.g.position.x,z:CRYS.g.position.z}:{x:-3.2,z:6.6};
function ftStart(replay){if(FT.on)return;FT.on=true;FT.replay=!!replay;FT.got=0;FT.sparks=[];document.body.classList.add('ft');closeSheet&&closeSheet();
  let sk=$('#ftSkip');if(!sk){sk=document.createElement('button');sk.id='ftSkip';sk.textContent='דילוג ⏭';sk.addEventListener('click',()=>ftEnd(true));document.body.appendChild(sk)}sk.hidden=false;
  if(ME.zone!=='island')teleport('island');ftCinematic()}
function ftCinematic(){FT.step='cine';FT.cine=1;FT.t=0;const c=CRYSPOS();
  ftCine('לפני הרבה זמן, גביש האחדות שמר על האור של ארץ הצורות…','Long ago, the Crystal of Unity kept the light of Shapeland…');
  setTimeout(()=>{if(!FT.on)return;FT.cine=2;if(CRYS){CRYS.core.material.emissiveIntensity=1.4}if(typeof SND!=='undefined'&&SND.sparkle)SND.sparkle();
    ftCine('אבל הגביש נשבר! ⚡ והאור התפזר בכל האי','But the Crystal broke! The light flew all over the island!');
    fxBurst(c.x,1.4,c.z,'#FDE68A',40,4);fxBurst(c.x,1.4,c.z,'#93C5FD',26,3);ftMakeSparks();try{sfx.bad()}catch(e){}},3600);
  setTimeout(()=>{if(!FT.on)return;ftCine('רק את/ה יכול/ה להחזיר את האור! ✨','Only you can bring the light back!')},7000);
  setTimeout(()=>{if(!FT.on)return;FT.cine=0;ftCineOff();if(CRYS)CRYS.core.material.emissiveIntensity=.15;ftSparksStep()},10200)}
/* three sparks fly out of the crystal and land around the island */
function ftMakeSparks(){const c=CRYSPOS();const spots=[];let tries=0;
  while(spots.length<3&&tries<200){tries++;const a=Math.random()*Math.PI*2,r=7+Math.random()*6;const p={x:c.x+Math.cos(a)*r,z:c.z+Math.sin(a)*r};
    if(!walkable(new THREE.Vector3(p.x,0,p.z),'island'))continue;if(spots.some(s=>Math.hypot(s.x-p.x,s.z-p.z)<6))continue;if(Math.hypot(p.x-ME.pos.x,p.z-ME.pos.z)<4)continue;spots.push(p)}
  FT.sparks=spots.map((p,i)=>{const g=new THREE.Group();const core=new THREE.Mesh(new THREE.OctahedronGeometry(.32),new THREE.MeshStandardMaterial({color:SHARDC[i%SHARDC.length]||'#FDE68A',emissive:SHARDC[i%SHARDC.length]||'#FACC15',emissiveIntensity:1}));g.add(core);
    const halo=new THREE.Mesh(new THREE.SphereGeometry(.65,16,12),new THREE.MeshBasicMaterial({color:'#FDE68A',transparent:true,opacity:.25,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(halo);
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(.12,.25,9,10,1,true),new THREE.MeshBasicMaterial({color:'#FDE68A',transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));beam.position.y=4.5;g.add(beam);
    g.position.set(c.x,1.4,c.z);scene.add(g);return{g,core,halo,from:{x:c.x,z:c.z},to:p,fly:0,got:false}})}
function ftSparksStep(){FT.step='sparks';ftPill('אספו את ניצוצות האור ✨',"Catch the sparks of light!",`${FT.got}/3`);say('Catch the sparks of light!');ftNextTarget()}
function ftNextTarget(){const left=FT.sparks.filter(s=>!s.got);if(!left.length){FT.tgt=null;return}left.sort((a,b)=>Math.hypot(a.to.x-ME.pos.x,a.to.z-ME.pos.z)-Math.hypot(b.to.x-ME.pos.x,b.to.z-ME.pos.z));FT.tgt={x:left[0].to.x,z:left[0].to.z}}
function ftStep(dt,t){if(!FT.on)return;
  FT.sparks.forEach(s=>{if(s.got)return;if(s.fly<1){s.fly=Math.min(1,s.fly+dt*.7);const k=s.fly;s.g.position.set(s.from.x+(s.to.x-s.from.x)*k,1.4+Math.sin(k*Math.PI)*5-(1.4-1.1)*k,s.from.z+(s.to.z-s.from.z)*k)}
    else s.g.position.y=1.1+Math.sin(t*2.5+s.to.x)*.15;s.core.rotation.y+=dt*2.5;s.halo.scale.setScalar(1+.12*Math.sin(t*5));
    if(FT.step==='sparks'&&s.fly>=1&&Math.hypot(s.to.x-ME.pos.x,s.to.z-ME.pos.z)<1.7){s.got=true;FT.got++;fxBurst(s.to.x,1.2,s.to.z,'#FDE68A',22,3);scene.remove(s.g);
      try{sfx.coin()}catch(e){}P.gems+=5;renderHud();const praise=['Great!','Wonderful!','You did it!'][FT.got-1];say(praise);burst('✨ +5 💎');
      if(FT.got<3){ftPill('אספו את ניצוצות האור ✨',"Catch the sparks of light!",`${FT.got}/3`);ftNextTarget()}
      else{FT.step='crystal';const c=CRYSPOS();FT.tgt={x:c.x,z:c.z};ftPill('יש! עכשיו מחזירים את האור לגביש 💎','Bring the light back to the Crystal!');setTimeout(()=>say('Bring the light back to the Crystal!'),900)}}});
  if(FT.step==='crystal'&&$('#sheet').hidden){const c=CRYSPOS();if(Math.hypot(c.x-ME.pos.x,c.z-ME.pos.z)<3.2)ftWord()}
  if(FT.step==='trypow'&&typeof PW!=='undefined'&&PW.active&&!FT.powOk){FT.powOk=1;setTimeout(()=>{if(!FT.on)return;burst('🤩 Wow!');say('Amazing!');setTimeout(ftLook,2200)},2600)}
  if(FT.step==='mosh'&&MOSH&&Math.hypot(MOSH.position.x-ME.pos.x,MOSH.position.z-ME.pos.z)<3)ftEnd(false)}

/* the magic word: a tiny, friendly English moment */
const FTW=[['LIGHT','💡','אור'],['STAR','⭐','כוכב'],['SUN','☀️','שמש']];
function ftWord(){FT.step='word';FT.tgt=null;ftPillOff();const w=FTW[0];const opts=[['LIGHT','💡'],['CAT','🐱'],['CAR','🚗']].sort(()=>Math.random()-.5);PANEL='ftword';
  sheet(`<div class="center"><div style="font-size:54px">💎</div><h2>הגביש צריך מילת קסם!</h2><p class="sub" style="font-size:18px">איך אומרים <b>${w[2]}</b> באנגלית?</p>
    <div class="row" style="gap:8px;width:100%">${opts.map(([e,em])=>`<button class="ftword" data-a="ftw" data-v="${e}">${em}<b>${e}</b></button>`).join('')}</div>
    <p class="sub">🔊 נוגעים במילה כדי לשמוע אותה</p></div>`);say('Which word means light?')}
ACTX.ftw=d=>{const b=document.querySelector(`[data-a="ftw"][data-v="${d.v}"]`);say(d.v.toLowerCase());
  if(d.v!=='LIGHT'){if(b){b.classList.remove('no');void b.offsetWidth;b.classList.add('no')}setTimeout(()=>say('Try again!'),700);return}
  if(b)b.classList.add('yes');setTimeout(()=>{closeSheet();ftLightUp()},700)};
function ftLightUp(){const c=CRYSPOS();if(CRYS){CRYS.core.material.emissiveIntensity=1.6;CRYS.core.scale.setScalar(1.6);setTimeout(()=>{if(CRYS){CRYS.core.material.emissiveIntensity=.35;CRYS.core.scale.setScalar(1)}},2600)}
  fxBurst(c.x,1.5,c.z,'#FDE68A',50,5);fxBurst(c.x,1.5,c.z,'#F9A8D4',30,4);fxBurst(c.x,1.5,c.z,'#93C5FD',30,4);try{sfx.win()}catch(e){}
  if(typeof kind==='function'&&!FT.replay)kind(3,'החזרתי את האור לגביש');P.gems+=20;logm('מתנת פתיחה: החזרת האור','Welcome gift',20);addXp(20);renderHud();
  burst('💎 LIGHT! +20 💎');say('Light! You brought the light back!');
  setTimeout(()=>{if(!FT.on)return;if(P.power&&FT.replay){ftLook();return}FT.step='power';FT.allowPower=true;ftPill('קיבלת כוח־על! בוחרים אחד 🎁','You earned a superpower!');openPowers(true);FT.allowPower=false},2600)}
/* after choosing a superpower: try it right away */
const _setPowerF=ACTX.setpower;ACTX.setpower=d=>{_setPowerF(d);if(FT.on&&FT.step==='power'){FT.step='trypow';FT.powOk=0;const b=$('#bPow');if(b)b.classList.add('ftglow');
  ftPill('נסו את הכוח! לוחצים על הכפתור הזוהר',`Try your power! Press ${POWERS[d.v].em}`);setTimeout(()=>{if(FT.on&&FT.step==='trypow'&&!FT.powOk){FT.powOk=1;ftLook()}},14000)}};
const _openPowersF=openPowers;openPowers=function(first){if(first&&FT.on&&!FT.allowPower&&FT.step!=='power')return;return _openPowersF.apply(this,arguments)};
/* who do you want to be? */
function ftLook(){if(!FT.on||FT.step==='look'||FT.step==='mosh')return;FT.step='look';const b=$('#bPow');if(b)b.classList.remove('ftglow');ftPillOff();PANEL='ftlook';const c=sanitizeHuman(P.ch),girl=c.g==='girl';
  const cards=LOOKS.slice(0,9).map(([id,he,e,f,h])=>{const x=Object.assign({},c,f,{hair:h[girl?'girl':'boy']});return`<button class="ochip" data-a="ftlook" data-v="${id}" style="flex-direction:column;padding:4px"><span style="width:78px;height:78px;display:block">${realPortrait(x,'face')}</span><b style="font-size:.78em">${he}</b></button>`}).join('');
  sheet(`<div class="center"><h2>מי את/ה רוצה להיות? 🪞</h2><p class="sub">בוחרים מראה. אחר כך אפשר לשנות כל דבר: שיער, בגדים ואיפור</p>
    <div class="chips" style="justify-content:center">${cards}</div><div class="row"><button class="btn ghost mini" data-a="ftg" data-v="${girl?'boy':'girl'}">${girl?'👦 בן':'👧 בת'}</button><button class="btn ghost" data-a="ftlook" data-v="keep">ככה אני מעולה ✨</button></div></div>`);say('Who do you want to be?')}
ACTX.ftg=d=>{P.ch.g=d.v;if(HAIRS[P.ch.hair]&&HAIRS[P.ch.hair][2]!==d.v)P.ch.hair=d.v==='girl'?'long':'short';if(d.v==='boy'&&(P.ch.bot==='skirt'||P.ch.bot==='dress'))P.ch.bot='jeans';save();FT.step='';ftLook()};
ACTX.ftlook=d=>{if(d.v!=='keep'){const L=LOOKS.find(x=>x[0]===d.v);if(L){Object.assign(P.ch,{frk:0},L[3],{hair:L[4][P.ch.g==='boy'?'boy':'girl']})}save();rebuildMe();pushPresence&&pushPresence(true);burst('🤩');say('You look amazing!')}
  closeSheet();setTimeout(ftMosh,900)};
/* the story begins: Mosh in his basket on the beach */
function ftMosh(){if(!FT.on)return;FT.step='mosh';const s=ST();if(!FT.replay){s.intro=1;if(s.ch<1){s.ch=1;s.step=0;s.k=0}save()}placeMosh();renderQuestChip();
  if(MOSH)FT.tgt={x:MOSH.position.x,z:MOSH.position.z};ftPill('מישהו קורא לך מהחוף! 🧺 הולכים לאור','Someone is calling you from the beach!');say('Someone is calling you from the beach!')}
function ftEnd(skipped){if(!FT.on)return;FT.on=false;FT.tgt=null;FT.cine=0;ftCineOff();ftPillOff();FT.sparks.forEach(s=>{if(!s.got)scene.remove(s.g)});FT.sparks=[];
  const b=$('#bPow');if(b)b.classList.remove('ftglow');const sk=$('#ftSkip');if(sk)sk.hidden=true;
  document.body.classList.remove('ft');document.body.classList.add('ftreveal');setTimeout(()=>document.body.classList.remove('ftreveal'),1200);
  if(!FT.replay)FT.calmUntil=Date.now()+5*60000;
  if(!FT.replay){const s=ST();if(!s.intro){s.intro=1;if(s.ch<1){s.ch=1;s.step=0;s.k=0}placeMosh()}P.ftue=1;save()}renderHud();renderQuestChip();
  if(!skipped){burst('🌟 Welcome to Shapeland!');toast('🧺 Mosh מחכה לך! נוגעים בו כדי לדבר. הכפתורים למטה נפתחו: בנייה, בית, מפה ועוד');say('Welcome to Shapeland!')}}
/* the camera is ours during the cinematic */
const _stepCamF=stepCamera;stepCamera=function(dt){_stepCamF(dt);if(FT.on&&FT.cine){const t=performance.now()/1000;const c=CRYSPOS();const a=t*.25;const R=FT.cine===2?9:12;camera.position.set(c.x+Math.cos(a)*R,FT.cine===2?4.5:6,c.z+Math.sin(a)*R);camera.lookAt(c.x,1.3,c.z)}};
/* no 7-page book and no surprise popups while the opening runs */
const _storyPageF=storyPage;storyPage=function(){if(FT.on)return;return _storyPageF.apply(this,arguments)};
/* the loop */
const _stepBF=stepBuilder;stepBuilder=function(dt,t){_stepBF(dt,t);try{ftStep(dt,t);stepGuide(t)}catch(e){}};
/* start it for new players; older players can replay it from the story book */
(function ftWatch(){const iv=setInterval(()=>{if(!$('#title').hidden||!ME.obj)return;clearInterval(iv);const s=ST();
  if(P.ftue)return;if(s.intro||s.ch>1||(P.xp||0)>60){P.ftue=1;save();return}setTimeout(()=>ftStart(false),600)},500)})();
ACTX.ftreplay=()=>{closeSheet();ftStart(true)};
const _openBookF=openBook;openBook=function(){_openBookF.apply(this,arguments);const r=document.querySelector('#sheet [data-a="replayintro"]');if(r&&!document.querySelector('#sheet [data-a="ftreplay"]'))r.insertAdjacentHTML('beforebegin','<button class="btn ghost mini" data-a="ftreplay">✨ הפתיחה של המשחק</button>')};

/* ---------- after the opening: the beam keeps showing where the story goes next ---------- */
function storyGuide(){if(P&&P.guideOff)return null;const s=ST();if(!s.intro||ME.zone!=='island'||!MOSH)return null;const m={x:MOSH.position.x,z:MOSH.position.z};
  if(s.ch===1)return s.step===1?null:m;
  if(s.ch===2){if(s.step===1&&s.echo.length<3){const left=Object.values(ECHOOBJ).filter(g=>g.parent);if(!left.length)return null;left.sort((a,b)=>Math.hypot(a.position.x-ME.pos.x,a.position.z-ME.pos.z)-Math.hypot(b.position.x-ME.pos.x,b.position.z-ME.pos.z));return{x:left[0].position.x,z:left[0].position.z}}return m}
  if(s.ch===3)return s.step===1&&s.ming<5?null:m;return null}

/* no darkness creatures during the opening, and a calm first five minutes after it */
const ftCalm=()=>FT.on||(FT.calmUntil&&Date.now()<FT.calmUntil);
if(typeof startRaid==='function'){const _sr=startRaid;startRaid=function(){if(ftCalm()){RAID.raidT=60;return}return _sr.apply(this,arguments)}}
if(typeof spawnOne==='function'){const _so=spawnOne;spawnOne=function(){if(ftCalm())return;return _so.apply(this,arguments)}}
