/* Shapeland · a world by Shirel Yitzhak */
/* ===================== THE ARMORY OF LIGHT: tools you earn, powers you use in the war of the Sons of Light =====================
   Shield of Faith, David's Sling, Gideon's Fire, the East Wind — earned in trials of their own.
   Water, Lightning and Strength come from the Power Academy (the stronger you trained, the stronger they hit).
   In every trial they appear as buttons on the right; each has its own cooldown. */
const ARM={
  shield:{em:'🛡️',he:'מגן האמונה',en:'Shield of Faith',cd:9,txt:'חוסם כל פגיעה למשך כמה שניות.',how:'מקבלים אחרי שמגיעים לפסגת הר הצורות (פרק 5)',wise:'"מגן הוא לכל החוסים בו". איפה זה כתוב?'},
  sling:{em:'🎯',he:'הקלע של דוד',en:"David's Sling",cd:2.5,txt:'אבן מהירה וחזקה פי שלושה, מכל מרחק.',how:'מנצחים את הענק בעמק',trial:'giant',wise:'"ויקח חמישה חלוקי אבנים מן הנחל". מול מי עמד הנער?'},
  fire:{em:'🔥',he:'האש של גדעון',en:"Gideon's Fire",cd:7,txt:'טבעת אש סביבך שפוגעת בכל מי שקרוב.',how:'מנצחים בלילה של גדעון',trial:'gideon',wise:'שלוש מאות לוחמים, כדים, לפידים ושופרות. איך ניצחו צבא שלם?'},
  wind:{em:'💨',he:'רוח הקדים',en:'The East Wind',cd:8,txt:'דוחפת את כל האויבים אחורה ומעיפה חיצים וערפל.',how:'תופסים את הנוצות במקדש הרוח',trial:'wind',wise:'"ויולך ה׳ את הים ברוח קדים עזה כל הלילה". איזה ים נקרע?'},
  water:{em:'💧',he:'כוח המים',en:'Water Power',cd:6,txt:'סילון מים שמקפיא אויבים לכמה שניות.',how:'מתאמנים באקדמיית הכוחות',elem:'water',wise:'"מים רבים לא יוכלו לכבות את האהבה".'},
  elec:{em:'⚡',he:'כוח הברק',en:'Lightning Power',cd:7,txt:'ברק שקופץ בין 4 אויבים.',how:'מתאמנים באקדמיית הכוחות',elem:'elec',wise:'בספר העתיק ירדה אש מהשמיים על ההר, ליד נביא אחד. מי?'},
  str:{em:'💪',he:'כוח שמשון',en:"Samson's Strength",cd:8,txt:'מכה באדמה שמעיפה את כולם מסביב.',how:'מתאמנים באקדמיית הכוחות',elem:'str',wise:'הגיבור החזק ביותר בספר העתיק. מאיפה בא הכוח שלו?'}};
const armLv=k=>{const A=ARM[k];if(A.elem)return(P.elem&&P.elem[A.elem])||0;const s=ST();s.arm=s.arm||{};if(k==='shield'&&s.ch>5)s.arm.shield=1;return s.arm[k]?1:0};
const armHas=k=>armLv(k)>0||(LG.active&&LG.temp&&LG.temp.includes(k));
CHAPTERS.giant={en:'The Giant of the Valley',he:'הענק בעמק',em:'🎯'};CHAPTERS.gideon={en:"Gideon's Night",he:'הלילה של גדעון',em:'🔥'};CHAPTERS.wind={en:'Shrine of the Wind',he:'מקדש הרוח',em:'💨'};
PAGES.push({ch:6,em:'📜',t:'מגילת בני האור',en:'The Scroll of the Sons of Light',txt:'יש אגדה על מלחמה גדולה בין בני האור לבני החושך. בני האור לא מנצחים לבד, אלא כשהם מאוחדים ומחזיקים בכלים של האור.',wise:'במערות ליד ים המלח נמצאה מגילה עתיקה בשם "מלחמת בני אור בבני חושך". איך קוראים למקום?'});

/* ---------- the buttons ---------- */
const ARMCD={};
function armBar(){let b=$('#armBar');const show=LG.active&&ME.zone==='legend';if(!b){b=document.createElement('div');b.id='armBar';b.className='hud';document.body.appendChild(b);
    b.addEventListener('pointerdown',e=>{const x=e.target.closest('[data-arm]');if(!x)return;e.preventDefault();e.stopPropagation();useArm(x.dataset.arm)})}
  const ks=Object.keys(ARM).filter(armHas);b.hidden=!show||!ks.length;if(b.hidden)return;const sig=ks.join(',');if(b.dataset.sig!==sig){b.dataset.sig=sig;b.innerHTML=ks.map(k=>`<button class="arm" data-arm="${k}" aria-label="${ARM[k].he}"><span>${ARM[k].em}</span><i></i></button>`).join('')}
  ks.forEach(k=>{const el=b.querySelector(`[data-arm="${k}"] i`);const c=ARMCD[k]||0;if(el)el.style.background=c>0?`conic-gradient(rgba(29,42,72,.6) ${c/ARM[k].cd*360}deg,transparent 0)`:'transparent'})}
window.addEventListener('keydown',e=>{if(!LG.active||(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName)))return;const m={Digit1:'shield',Digit2:'sling',Digit3:'fire',Digit4:'wind',Digit5:'water',Digit6:'elec',Digit7:'str'}[e.code];if(m&&armHas(m))useArm(m)});
const foes=()=>LG.ents.filter(e=>!e.dead&&e.shootable);
const dist2=e=>Math.hypot(e.g.position.x-ME.pos.x,e.g.position.z-ME.pos.z);
function dmg(e,n){for(let i=0;i<n&&!e.dead;i++)e.hit&&e.hit()}
function stunE(e,s){if('stun'in e){e.stun=Math.max(e.stun||0,s);floatText('💫','#BAE6FD');return true}return false}
function useArm(k){if(!LG.active||!$('#sheet').hidden)return;if((ARMCD[k]||0)>0){toast(`${ARM[k].em} עוד ${Math.ceil(ARMCD[k])} שניות`);return}const lv=Math.max(1,armLv(k));ARMCD[k]=Math.max(1.5,ARM[k].cd-(ARM[k].elem?(lv-1)*.6:0));
  const[mx,mz]=[ME.pos.x,ME.pos.z];const a=ME.obj?ME.obj.rotation.y:0;
  if(k==='shield'){LG.shieldT=2.6+lv*.4;sfx.coin();say('Shield of faith!');if(!LG.bubble){LG.bubble=mesh(new THREE.SphereGeometry(1.25,18,12),mat('#93C5FD',{transparent:true,opacity:.32,emissive:'#3B82F6',emissiveIntensity:.5}),false);scene.add(LG.bubble)}LG.bubble.visible=true}
  if(k==='sling'){let t=null,best=18;for(const e of foes()){const d=dist2(e);if(d<best){best=d;t=e}}slingShot(t);say('Sling!')}
  if(k==='fire'){fxBurst(mx,.6,mz,'#F97316',40,4.5);fxBurst(mx,1.2,mz,'#FACC15',24,3);if(AU.on)hiss&&hiss(.5,'bandpass',900,1,.12);foes().forEach(e=>{if(dist2(e)<4.8)dmg(e,1+lv)});ring('#F97316',4.8);say('Fire!')}
  if(k==='wind'){fxBurst(mx,1,mz,'#E0F2FE',40,5);if(AU.on)hiss&&hiss(.8,'lowpass',600,1,.15);LG.fx=LG.fx.filter(f=>{if(f.v||f.t!==undefined){scene.remove(f.o);return false}return true});
    foes().forEach(e=>{const d=dist2(e);if(d<9&&e.kind!=='king'&&e.kind!=='boss'&&e.kind!=='giant'){const dx=(e.g.position.x-mx)/(d||1),dz=(e.g.position.z-mz)/(d||1);e.g.position.x+=dx*4;e.g.position.z+=dz*4;stunE(e,2)}});ring('#BAE6FD',9);say('The east wind!')}
  if(k==='water'){const fx=Math.sin(a),fz=Math.cos(a);let n=0;foes().forEach(e=>{const dx=e.g.position.x-mx,dz=e.g.position.z-mz,d=Math.hypot(dx,dz);if(d<7.5&&(dx*fx+dz*fz)/(d||1)>.45){n++;if(!stunE(e,2+lv))dmg(e,1);else dmg(e,lv>2?1:0)}});
    for(let i=1;i<8;i++)fxBurst(mx+fx*i,1,mz+fz*i,'#38BDF8',4,.6);if(AU.on)hiss&&hiss(.4,'highpass',1500,1,.1);say('Water!')}
  if(k==='elec'){let from=new THREE.Vector3(mx,1.4,mz);const hit=foes().sort((p,q)=>dist2(p)-dist2(q)).filter(e=>dist2(e)<11).slice(0,4);hit.forEach(e=>{const to=new THREE.Vector3(e.g.position.x,(e.aimY||1),e.g.position.z);beamFx(from,to,'#FDE047');dmg(e,1+lv);from=to});
    if(AU.on)tone(1400,.15,'sawtooth',.05);if(typeof shake==='function')shake(.15,.2);say(hit.length?'Lightning!':'No one is near…')}
  if(k==='str'){if(typeof shake==='function')shake(.45,.4);fxBurst(mx,.2,mz,'#A16207',40,4);ring('#A16207',5.5);if(AU.on)tone(70,.4,'sine',.12);foes().forEach(e=>{const d=dist2(e);if(d<5.5){dmg(e,lv);if(e.kind!=='king'&&e.kind!=='boss'&&e.kind!=='giant'){const dx=(e.g.position.x-mx)/(d||1),dz=(e.g.position.z-mz)/(d||1);e.g.position.x+=dx*3;e.g.position.z+=dz*3}}});say('Strength!')}
  armBar()}
function ring(col,r){const o=mesh(new THREE.RingGeometry(.2,.5,32),mat(col,{transparent:true,opacity:.8,side:THREE.DoubleSide,emissive:col,emissiveIntensity:.8}),false);o.rotation.x=-Math.PI/2;o.position.set(ME.pos.x,.08,ME.pos.z);lgAdd(o);
  LG.fx.push({o,t2:0,up(dt){this.t2+=dt;const s=r/.5*Math.min(1,this.t2/.35);this.o.scale.setScalar(s);this.o.material.opacity=Math.max(0,.8-this.t2*1.6);if(this.t2>.5){scene.remove(this.o);return false}return true}})}
function beamFx(a,b,col){const len=a.distanceTo(b);const m=mesh(new THREE.CylinderGeometry(.06,.06,len,5),mat(col,{emissive:col,emissiveIntensity:1}),false);m.position.copy(a).add(b).multiplyScalar(.5);m.lookAt(b);m.rotateX(Math.PI/2);lgAdd(m);setTimeout(()=>scene.remove(m),200)}
function slingShot(t){const o=mesh(new THREE.DodecahedronGeometry(.18),mat('#D6D3D1'),false);o.position.set(ME.pos.x,ME.y+1.3,ME.pos.z);lgAdd(o);const a=ME.obj?ME.obj.rotation.y:0;
  let v=new THREE.Vector3(Math.sin(a),0,Math.cos(a));if(t){v=new THREE.Vector3(t.g.position.x-ME.pos.x,(t.headY||t.aimY||1)-(ME.y+1.3),t.g.position.z-ME.pos.z).normalize();if(ME.obj)ME.obj.rotation.y=Math.atan2(v.x,v.z)}
  v.multiplyScalar(24);if(AU.on)tone(500,.08,'triangle',.06,null,null,.005,900);
  LG.fx.push({o,v,sling:1,life:1,up(dt){this.o.position.addScaledVector(this.v,dt);this.o.rotation.x+=dt*20;this.life-=dt;for(const e of foes()){const hy=e.headY||e.aimY||1;if(Math.hypot(this.o.position.x-e.g.position.x,this.o.position.z-e.g.position.z)<(e.r||.8)+.3&&Math.abs(this.o.position.y-hy)<(e.hy||1.4)){
      if(e.slingHit)e.slingHit();else dmg(e,3);fxBurst(this.o.position.x,this.o.position.y,this.o.position.z,'#E7E5E4',10,1.4);this.life=0;break}}if(this.life<=0){scene.remove(this.o);return false}return true}})}
/* shield blocks damage */
const _hurtA=lgHurt;lgHurt=function(w){if(LG.shieldT>0&&LG.active){if(LG.inv<=0){LG.inv=.4;floatText('🛡️ Blocked!','#93C5FD');if(AU.on)tone(900,.06,'square',.04)}return}_hurtA(w)};
function stepArmory(dt){Object.keys(ARMCD).forEach(k=>{ARMCD[k]=Math.max(0,ARMCD[k]-dt)});if(LG.shieldT>0){LG.shieldT-=dt;if(LG.bubble){LG.bubble.position.set(ME.pos.x,ME.y+1,ME.pos.z);LG.bubble.visible=LG.shieldT>0}}else if(LG.bubble)LG.bubble.visible=false;
  if(LG.active&&LG.side&&LGCH[LG.ch].step2)LGCH[LG.ch].step2(dt);armBar()}
const _stepLegA=stepLegend;stepLegend=function(dt,t){_stepLegA(dt,t);if(LG.active&&$('#sheet').hidden)stepArmory(dt);else armBar()};
const _cleanA=lgCleanup;lgCleanup=function(){_cleanA();LG.shieldT=0;if(LG.bubble){scene.remove(LG.bubble);LG.bubble=null}LG.temp=null;LG.side=false;armBar()};

/* ---------- side trials: earn a tool ---------- */
function sideStart(id){const go=()=>{lgCleanup();LG.side=true;LG.ch=id;const C=LGCH[id];Object.assign(LG,{active:true,ch:id,side:true,hp:C.hp||3,max:C.hp||3,inv:1,t:0,cd:0,d:{},temp:C.temp||[]});const[cx,cz]=ZC.legend;const st=C.at||[0,10];ME.pos.set(cx+st[0],0,cz+st[1]);ME.y=0;lightBtn();C.start();lgHud(LG.d.hud);armBar()};
  if(ME.zone!=='legend'){window.__side=id;enterLegend();return}cut(C2[id],go)}
const _arriveA=legendArrive;legendArrive=function(){if(window.__side){const id=window.__side;window.__side=null;sideStart(id);return}_arriveA()};
const _endA=lgEnd;lgEnd=function(win,quiet){if(!LG.side)return _endA(win,quiet);const id=LG.ch;lgCleanup();if(!win||quiet)return;const k=Object.keys(ARM).find(x=>ARM[x].trial===id);const s=ST();s.arm=s.arm||{};s.arm[k]=1;save();
  sfx.win();burst(ARM[k].em+' '+ARM[k].he);addGems(20,'כלי חדש: '+ARM[k].he,'New tool');addXp(50);kind(2,'השגת '+ARM[k].he);
  setTimeout(()=>{PANEL='armgot';sheet(`<h2>${ARM[k].em} ${en(ARM[k].en)}</h2><div class="bigem">${ARM[k].em}</div><p class="sub" style="text-align:center">${ARM[k].he} שלך! ${ARM[k].txt}<br>במבחנים הוא מופיע ככפתור בצד ימין.</p><div class="row"><button class="btn sun" data-a="armory">⚔️ לנשקייה</button><button class="btn ghost" data-a="close">סגירה</button></div>`)},600)};
const _failA=lgFail;lgFail=function(){if(!LG.side)return _failA();const id=LG.ch;const s=LGS();s.fails[id]=(s.fails[id]||0)+1;save();lgCleanup();PANEL='lgfail';
  sheet(`<h2>😵 ${en('Not this time…')}</h2><p class="sub">כל ניסיון מלמד משהו. גם דוד התאמן הרבה לפני הענק.</p><div class="row"><button class="btn sun" data-a="armtry" data-v="${id}">🔄 ${en('Try again')}</button><button class="btn ghost" data-a="close">אחר כך</button></div>`)};
ACTX.armtry=d=>{closeSheet();sideStart(d.v)};
const C2={
  giant:[['⛰️','בעמק עומד ענק של צל, גבוה כמו בית. כולם מפחדים לגשת אליו.','Who will fight me? Send me your strongest warrior!','grabb'],['🎯','ילד צעיר לקח מהנחל חמש אבנים חלקות וקלע. "אתה בא עם כוח, ואני בא עם האור."','Five smooth stones from the brook. Aim at his forehead when the helmet opens!'],
    ['💡','רק הקלע 🎯 (או 2 במקלדת) פוגע בו, ורק כשהמצח שלו זוהר. כשהוא רוקע באדמה, קופצים מעל גל ההדף! אבנים נוספות מחכות ליד הנחל.','Only the sling can hurt him. Jump over the shock waves!']],
  gideon:[['🌙','מחנה ענק של צללים מכסה את העמק. לגדעון יש רק שלוש מאות לוחמים.','So many shadows! And we are so few…'],['🏺','גדעון נתן לכל אחד כד, ובתוכו לפיד. אוספים שלושה כדים מהשומרים בחושך.','Find the three jars in the dark!'],['🔥','כשתחזיקי את שלושתם, שוברים את הכדים 🔥 (או 3 במקלדת), והאש תבהיל את כל המחנה!','Then break the jars, and let the fire shine!']],
  wind:[['💨','במקדש הרוח, נוצות של אור עפות עם הרוח החזקה.','Catch the feathers of light before the wind takes them!'],['🌬️','הרוח משנה כיוון ודוחפת אותך. תופסים 8 נוצות לפני שהזמן נגמר.','Hold strong in the wind!']]};
/* the giant */
function startGiant(){const[cx,cz]=ZC.legend;const gm=grabbMesh(3.1);gm.userData.robe.material=mat('#78350F');gm.userData.cape.material=mat('#451A03',{side:THREE.DoubleSide});gm.userData.crown.material=mat('#B45309',{metalness:.7,roughness:.3});
  const helm=mesh(new THREE.SphereGeometry(.47,14,10,0,Math.PI*2,0,Math.PI/2),mat('#92400E',{metalness:.6}));helm.position.y=2.5;gm.add(helm);gm.position.set(cx,0,cz-8);lgAdd(gm);
  const G={g:gm,kind:'giant',shootable:true,r:2,hy:2.2,aimY:3,headY:7.6,hp:HELP()?4:5,open:0,cyc:2,wave:3.5,hit(){floatText('🛡️ Clang!','#FCD34D')},
    slingHit(){if(this.open<=0){floatText('🛡️ Clang!','#FCD34D');if(AU.on)tone(1200,.05,'square',.04);return}this.hp--;sfx.coin();if(typeof shake==='function')shake(.3,.3);floatText('🎯 Bullseye! '+this.hp,'#FDE047');gm.userData.head.material=mat('#FFFFFF');setTimeout(()=>gm.userData.head.material=mat('#A78BFA'),120);
      if(this.hp<=0){this.dead=true;LG.active=false;fxBurst(gm.position.x,4,gm.position.z,'#92400E',70,6);gm.rotation.x=-1.4;gm.position.y=1;setTimeout(()=>cut([['🎯','הענק נפל! לא בגלל כוח, אלא בגלל אומץ ודיוק.','The giant fell! Courage and aim, not size.']],()=>{LG.active=true;lgEnd(true)}),900)}},
    up(dt){const dx=ME.pos.x-gm.position.x,dz=ME.pos.z-gm.position.z,d=Math.hypot(dx,dz)||1;gm.rotation.y=Math.atan2(dx,dz);if(d>7){gm.position.x+=dx/d*.7*dt;gm.position.z+=dz/d*.7*dt}
      this.cyc-=dt;if(this.cyc<=0){this.open=HELP()?2.4:1.7;this.cyc=this.open+(HELP()?2.4:3)}if(this.open>0){this.open-=dt;helm.position.y=3.1;gm.userData.head.material=mat('#FDE047',{emissive:'#FACC15',emissiveIntensity:.8})}else{helm.position.y=2.5;gm.userData.head.material=mat('#A78BFA')}
      this.wave-=dt;if(this.wave<=0){this.wave=HELP()?7:5.5;shockwave(gm.position.x,gm.position.z)}}};
  LG.ents.push(G);LG.d.stones=5;LG.d.brook=[];LG.d.giant=G;const bw=mesh(new THREE.BoxGeometry(14,.06,1.4),mat('#38BDF8',{emissive:'#0EA5E9',emissiveIntensity:.3}),false);bw.position.set(cx,.04,cz+15);lgAdd(bw);brookStones();LG.d.hud=`🎯 ${LG.d.stones} אבנים · 🗿 ${G.hp}`}
function brookStones(){const[cx,cz]=ZC.legend;for(let i=0;i<5;i++){const o=mesh(new THREE.DodecahedronGeometry(.22),mat('#E7E5E4',{emissive:'#FDE68A',emissiveIntensity:.25}),false);o.position.set(cx-5+i*2.5,.25,cz+13.6);lgAdd(o);LG.d.brook.push(o)}}
function shockwave(x,z){const o=mesh(new THREE.RingGeometry(.6,1,40),mat('#A16207',{transparent:true,opacity:.85,side:THREE.DoubleSide}),false);o.rotation.x=-Math.PI/2;o.position.set(x,.1,z);lgAdd(o);if(typeof shake==='function')shake(.2,.2);if(AU.on)tone(60,.3,'sine',.1);
  LG.fx.push({o,t:0,r:0,wave:1,up(dt){this.r+=dt*(HELP()?7:9);this.o.scale.setScalar(this.r);const d=Math.hypot(ME.pos.x-x,ME.pos.z-z);if(!this.done&&Math.abs(d-this.r*.8)<.5&&ME.y<.3){this.done=1;lgHurt('💥')}if(this.r>16){scene.remove(this.o);return false}return true}})}
const _useArmG=useArm;useArm=function(k){if(LG.active&&LG.ch==='giant'&&k==='sling'){if(LG.d.stones<=0){toast('🎯 נגמרו האבנים! אוספים עוד ליד הנחל');return}if((ARMCD.sling||0)>0)return;LG.d.stones--;}_useArmG(k);if(LG.active&&LG.ch==='giant'){const G=LG.d.giant;LG.d.hud=`🎯 ${LG.d.stones} אבנים · 🗿 ${G.hp}`;lgHud(LG.d.hud)}};
const _fireG=fireLight;fireLight=function(){if(LG.active&&LG.ch==='giant'){if(LG.cd<=0){LG.cd=.8;toast('🎯 רק הקלע מגיע אליו! הכפתור 🎯 מימין')}return}_fireG()};
function stepGiant(dt){const d=LG.d;d.brook=d.brook.filter(o=>{if(near(o,1.1)){scene.remove(o);d.stones++;sfx.coin();floatText('🎯 +1');return false}return true});if(!d.brook.length&&d.stones<2)brookStones();d.hud=`🎯 ${d.stones} אבנים · 🗿 ${d.giant.hp}`;lgHud(d.hud)}
/* Gideon's night */
function startGideon(){document.body.classList.add('lgnight');scene.background.set('#0B1026');const[cx,cz]=ZC.legend;Object.assign(LG.d,{jars:[],got:0,phase:'jars',army:[]});
  for(let i=0;i<3;i++){const a=i/3*Math.PI*2+.5;const x=cx+Math.cos(a)*11,z=cz-2+Math.sin(a)*11;const j=new THREE.Group();const pot=mesh(new THREE.SphereGeometry(.35,10,8),mat('#B45309'));pot.position.y=.35;j.add(pot);const fl=mesh(new THREE.ConeGeometry(.15,.4,8),mat('#F97316',{emissive:'#F97316',emissiveIntensity:1}));fl.position.y=.85;j.add(fl);j.position.set(x,0,z);lgAdd(j);LG.d.jars.push(j);LG.ents.push(shade(x+1.5,z,2))}
  LG.d.hud='🏺 0/3 כדים'}
function stepGideon(dt){const d=LG.d;if(d.phase==='jars'){d.jars=d.jars.filter(j=>{if(near(j,1.3)){scene.remove(j);d.got++;sfx.coin();floatText('🏺 '+d.got);return false}return true});d.hud=`🏺 ${d.got}/3 כדים`;lgHud(d.hud);
    if(d.got>=3){d.phase='army';const[cx,cz]=ZC.legend;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;LG.ents.push(shade(cx+Math.cos(a)*20,cz-2+Math.sin(a)*20,4))}LG.temp=['fire'];ARMCD.fire=0;d.hud='🔥 שוברים את הכדים! הכפתור 🔥 מימין';lgHud(d.hud);toast('🔥 עכשיו! שוברים את הכדים!');say('Now! Break the jars!')}}}
const _useArmF=useArm;useArm=function(k){const army=LG.active&&LG.ch==='gideon'&&LG.d.phase==='army'&&k==='fire';_useArmF(k);if(!army)return;LG.d.phase='won';document.body.classList.remove('lgnight');fxBurst(ME.pos.x,2,ME.pos.z,'#F97316',120,12);
  hiddenHand('שלוש מאות לפידים נדלקו יחד, והצללים נבהלו ונלחמו זה בזה!','Three hundred torches! The shadows ran away in fear!');if(AU.on){tone(233,.8,'sawtooth',.07);setTimeout(()=>tone(311,1,'sawtooth',.07),500)}
  LG.ents.filter(e=>e.kind==='shade').forEach((e,i)=>{e.up=function(dt){this.g.rotation.y+=dt*10;this.g.position.y+=dt*2;if(this.g.position.y>4){this.dead=true;scene.remove(this.g)}}});
  setTimeout(()=>{LG.active=false;cut([['🔥','בלי קרב גדול, רק אור ואומץ, מחנה שלם ברח.','No big battle. Just light and courage!']],()=>{LG.active=true;lgEnd(true)})},2600)};
/* shrine of the wind */
function startWind(){Object.assign(LG.d,{got:0,need:8,time:HELP()?60:45,wind:new THREE.Vector3(1,0,0),wT:0,gust:3,feathers:[]});const[cx,cz]=ZC.legend;
  for(let i=0;i<10;i++){const o=mesh(new THREE.ConeGeometry(.12,.7,6),mat('#F8FAFC',{emissive:'#BAE6FD',emissiveIntensity:.7}),false);o.position.set(cx+(Math.random()-.5)*30,1,cz+(Math.random()-.5)*30);lgAdd(o);LG.d.feathers.push({o,ph:Math.random()*6})}}
function stepWind(dt){const d=LG.d;const[cx,cz]=ZC.legend;d.time-=dt;d.wT-=dt;if(d.wT<=0){d.wT=4;const a=Math.random()*Math.PI*2;d.wind.set(Math.cos(a),0,Math.sin(a));toast('🌬️ הרוח משנה כיוון!')}
  d.feathers.forEach(f=>{if(f.got)return;f.ph+=dt;f.o.position.x+=d.wind.x*(HELP()?3:4.2)*dt+Math.sin(f.ph*2)*.03;f.o.position.z+=d.wind.z*(HELP()?3:4.2)*dt+Math.cos(f.ph*2)*.03;f.o.position.y=1+Math.sin(f.ph*3)*.4;f.o.rotation.z+=dt*3;
    if(Math.hypot(f.o.position.x-cx,f.o.position.z-cz)>RL-2){f.o.position.x=cx-(f.o.position.x-cx)*.9;f.o.position.z=cz-(f.o.position.z-cz)*.9}if(near(f.o,1.3)){f.got=1;scene.remove(f.o);d.got++;sfx.coin();floatText('🪶 '+d.got)}});
  d.gust-=dt;if(d.gust<=0){d.gust=HELP()?4:3;for(let i=0;i<8;i++)tryMove(d.wind.x*.35,d.wind.z*.35);fxBurst(ME.pos.x,1,ME.pos.z,'#E0F2FE',8,1.5)}
  d.hud=`🪶 ${d.got}/${d.need} · ⏳ ${Math.max(0,Math.ceil(d.time))}`;lgHud(d.hud);
  if(d.got>=d.need){LG.active=false;cut([['💨','הרוח נרגעה ונכנסה אלייך. עכשיו היא עוזרת לך.','The east wind is yours!']],()=>{LG.active=true;lgEnd(true)});return}if(d.time<=0)lgFail()}
Object.assign(LGCH,{giant:{start:startGiant,step2:stepGiant,at:[0,8],hp:5,temp:['sling'],topic:/giant|stone|stones|sling|helmet/,reply:'Dear friend, the giant will open his helmet longer.'},
  gideon:{start:startGideon,step2:stepGideon,at:[0,2],topic:/jar|jars|night|dark|shadow|fire/,reply:'Dear friend, fewer shadows will guard the jars.'},
  wind:{start:startWind,step2:stepWind,at:[0,0],topic:/wind|feather|feathers|time/,reply:'Dear friend, the wind will be gentler.'}});

/* ---------- the Armory sheet ---------- */
ACTX.armory=()=>openArmory();ACTX.armgo=d=>{closeSheet();sideStart(d.v)};ACTX.academy=()=>{closeSheet();toast('💪 אקדמיית הכוחות נמצאת בפארק הספורט. נכנסים ומתאמנים!');if(typeof enterBuilding==='function'&&ME.zone!=='legend'){}};
function openArmory(){PANEL='armory';const s=ST();
  sheet(`<div class="npchead"><div class="face" style="background:#FEF3C7">⚔️</div><div class="grow"><h2>${en('The Armory of Light')}</h2><p class="sub">הנשקייה של בני האור · משיגים כלים ומשתמשים בהם במבחנים</p></div></div>
  <div class="arms">${Object.entries(ARM).map(([k,A])=>{const has=armLv(k)>0;return`<div class="armc ${has?'on':''}"><span class="em">${A.em}</span><b>${A.he}</b>${en(A.en)}${A.elem&&has?`<small>${'★'.repeat(armLv(k))}</small>`:''}
    <p>${A.txt}</p>${has?'<span class="ok">✓ שלך</span>':A.trial?`<button class="btn mini sun" data-a="armgo" data-v="${A.trial}">⚔️ ${en('Earn it')}</button>`:`<span class="how">🔒 ${A.how}</span>`}${has?`<p class="wise">🦉 ${A.wise}</p>`:''}</div>`}).join('')}</div>
  <p class="sub">במבחנים: הכפתורים בצד ימין, או המקשים 1–7. אחרי כל שימוש צריך לחכות קצת (העיגול מתמלא).</p><button class="btn ghost" data-a="close">סגירה</button>`)}
const _barA=renderBar;renderBar=function(){_barA();if(ME.zone!=='legend')return;const b=$('#bar');if(b&&!b.querySelector('[data-a="armory"]'))b.insertAdjacentHTML('beforeend','<button class="tool" data-a="armory"><span>⚔️</span>נשקייה</button>')};
const _bookA=openBook;openBook=function(){_bookA();const r=$('#sheet .row');if(r&&ST().ch>=4)r.insertAdjacentHTML('afterbegin','<button class="btn mini" data-a="armory">⚔️ הנשקייה</button>')};
