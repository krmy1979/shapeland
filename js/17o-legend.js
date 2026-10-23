/* Shapeland · a world by Shirel Yitzhak */
/* ===================== THE REALM OF TRIALS: chapters 4–7 of the legend =====================
   Lord Grabb, who wants everything for himself, opens a dark realm. Four action trials, real villains, and the good always wins in the end.
   The Shaper never appears — only a hidden hand: a sudden wind, a storm from nowhere, friends who arrive just in time.
   Stuck? Write a letter IN ENGLISH to the Keeper of Shapeland. A good letter brings help; who doesn't ask, keeps losing. */
const RL=24;ZC.legend=[0,230];ZNAME.legend='ממלכת המבחנים ✨';OUTZ.push('legend');
const LW=(x,z)=>[ZC.legend[0]+x,ZC.legend[1]+z];
const _zaL=zoneAt;zoneAt=function(x,z){if(Math.hypot(x-ZC.legend[0],z-ZC.legend[1])<RL+1)return'legend';return _zaL(x,z)};
const _wkL=walkable;walkable=function(pt,zone){if(zone==='legend')return Math.hypot(pt.x-ZC.legend[0],pt.z-ZC.legend[1])<RL-.3;return _wkL(pt,zone)};
CHAPTERS.forEach(c=>{c.soon=0});
PAGES.push({ch:4,em:'😈',t:'Lord Grabb',en:'Lord Grabb',txt:'הוא רוצה הכול לעצמו. הוא הרעיל את הבאר, שלח רוחות ערפל, ובנה צורת זהב כדי שכולם ירצו רק "עוד". הרע קיים, אבל האור תמיד חזק ממנו.',wise:'בספר העתיק היה מלך שלא נתן לעם ללכת, ולבו התקשה שוב ושוב.'},
  {ch:4,em:'🖐️',t:'היד הנעלמה',en:'The Hidden Hand',txt:'היוצר אף פעם לא נראה. אבל רוח פתאומית, סערה משום מקום, וחברים שמגיעים בדיוק בזמן… אולי זה לא מקרה.',wise:'יש מגילה עתיקה שבה שם היוצר לא כתוב אפילו פעם אחת, ובכל זאת ידו בכל מקום. איזו מגילה?'},
  {ch:5,em:'⛰️',t:'הר הצורות',en:'The Mountain of Shapes',txt:'על ראש ההר נכתבו מילות הנתינה. רק מי שמטפס למרות הערפל יכול לקרוא אותן.',wise:'בספר העתיק עלה מנהיג אל ההר וירד עם שני לוחות.'},
  {ch:6,em:'🟨',t:'צורת הזהב',en:'The Golden Shape',txt:'Grabb גרם לכולם לרקוד סביב צורת זהב ולצעוק "עוד! עוד!". מי שמתעורר מבין: אושר לא בא מ"עוד", אלא מנתינה.',wise:'בספר העתיק, כשהמנהיג התעכב על ההר, העם עשה לעצמו פסל מזהב.'});
const LGS=()=>{const s=ST();s.fails=s.fails||{};s.help=s.help||{};s.letters=s.letters||[];s.hh=s.hh||[];return s};

/* ---------- the realm ---------- */
let LGW=null;
function buildLegend(){if(LGW)return;const[cx,cz]=ZC.legend;const g=new THREE.Group();
  const ground=mesh(new THREE.CylinderGeometry(RL+1,RL+1.5,1,64),mat('#4C3D6B'),false);ground.position.set(cx,-.5,cz);ground.receiveShadow=true;g.add(ground);
  const rim=mesh(new THREE.TorusGeometry(RL+.6,.35,8,64),mat('#7C3AED',{emissive:'#7C3AED',emissiveIntensity:.5}),false);rim.rotation.x=Math.PI/2;rim.position.set(cx,.05,cz);g.add(rim);
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2+.1,r=RL-1.2-(i%3)*.8;const c=mesh(new THREE.ConeGeometry(.35+Math.random()*.3,1.2+Math.random()*1.4,5),mat(['#A78BFA','#8B5CF6','#C4B5FD'][i%3],{emissive:'#6D28D9',emissiveIntensity:.35}));c.position.set(cx+Math.cos(a)*r,.6,cz+Math.sin(a)*r);g.add(c)}
  scene.add(g);EXTRA_PICK.push(ground);const back=portalMesh('#22C55E','🌀 Back to the island');const[bx,bz]=LW(0,19.5);back.position.set(bx,0,bz);scene.add(back);rootify(back);back.userData.zact=()=>leaveLegend();EXTRA_PICK.push(back);
  LGW={g,ground,back};paintLegend()}
function paintLegend(){if(!LGW)return;const n=clamp(ST().shards-3,0,4);const k=n/4;const c=new THREE.Color('#4C3D6B').lerp(new THREE.Color('#86D97B'),k);LGW.ground.material=mat('#'+c.getHexString())}
function portalMesh(col,txt){const g=new THREE.Group();const ring=mesh(new THREE.TorusGeometry(1.25,.18,10,32),mat(col,{emissive:col,emissiveIntensity:.8}));ring.position.y=1.45;g.add(ring);
  const fill=mesh(new THREE.CircleGeometry(1.1,32),mat(col,{transparent:true,opacity:.35,emissive:col,emissiveIntensity:.6,side:THREE.DoubleSide}),false);fill.position.y=1.45;g.add(fill);
  const lb=label(txt,'#1D2A48','#FFFFFF',.38);lb.position.y=3.1;g.add(lb);g.userData.ring=ring;return g}
/* a portal on the island, next to the Crystal */
let PORTAL=null;
function placePortal(){if(PORTAL||ST().ch<4)return;PORTAL=portalMesh('#8B5CF6','🌀 Realm of Trials');PORTAL.position.set(-1.2,0,8.8);PORTAL.lookAt(0,0,3);scene.add(PORTAL);rootify(PORTAL);PORTAL.userData.zact=()=>enterLegend();EXTRA_PICK.push(PORTAL)}
function enterLegend(){if(ST().ch<4){toast('השער עוד סגור');return}buildLegend();const[cx,cz]=ZC.legend;ME.zone='legend';ME.path=[];ME.pos.set(cx,0,cz+16);ME.y=0;
  if(ME.obj)ME.obj.position.copy(ME.pos);if(ME.pet)ME.pet.position.copy(ME.pos);controls.target.set(ME.pos.x,0,ME.pos.z);camera.position.set(ME.pos.x,13,ME.pos.z+16);MODE='walk';
  setAtmos('island');legendSky();if(typeof camFromView==='function')camFromView();renderBar();renderTray();renderLoc();pushPresence(true);syncAvatars();sfx.door&&sfx.door();
  if(AU.on){tone(196,.6,'sine',.08);tone(147,.9,'triangle',.06)}fxBurst(ME.pos.x,1,ME.pos.z,'#8B5CF6',30,3);setTimeout(()=>legendArrive(),600)}
function legendSky(){const k=clamp(ST().shards-3,0,4)/4;const c=new THREE.Color('#2E1F4F').lerp(new THREE.Color('#9FD6FF'),k);scene.background.copy(c);scene.fog.color.copy(c)}
function leaveLegend(){lgCleanup();teleport('island',[-1.2,6.4]);fxBurst(ME.pos.x,1,ME.pos.z,'#22C55E',24,2.5)}
const _setModeL=setMode;setMode=function(m){if(ME.zone==='legend'&&m!=='walk'){toast('בממלכת המבחנים רק הולכים ונלחמים באור ✨');return}_setModeL(m)};
const _renderBarL=renderBar;renderBar=function(){_renderBarL();if(ME.zone!=='legend')return;const b=$('#bar');if(!b)return;
  b.innerHTML=`<button class="tool" data-a="mode" data-v="walk" aria-pressed="true"><span>🚶</span>הליכה</button><button class="tool" data-a="lgready"><span>⚔️</span>משימה</button><button class="tool" data-a="keeper"><span>📨</span>Keeper</button><button class="tool" data-a="book"><span>📜</span>הספר</button><button class="tool go" data-a="lgleave"><span>🌀</span>לאי</button>`};
ACTX.lgleave=()=>{if(LG.active&&!confirmLeave())return;leaveLegend()};
function confirmLeave(){lgEnd(false,true);return true}

/* ---------- mission state, hearts, light shots ---------- */
const LG={active:false,ch:0,hp:3,inv:0,ents:[],shots:[],fx:[],objs:[],d:{},t:0,cd:0,paused:false};
const HELP=()=>!!LGS().help[LG.ch];
function lgHud(txt){let h=$('#lgHud');if(!h){h=document.createElement('div');h.id='lgHud';document.body.appendChild(h)}h.hidden=!LG.active;if(!LG.active)return;
  h.innerHTML=`<span class="hp">${'❤️'.repeat(Math.max(0,LG.hp))}${'🖤'.repeat(Math.max(0,(LG.max||3)-LG.hp))}</span><b>${CHAPTERS[LG.ch].em} ${CHAPTERS[LG.ch].he}</b><span>${txt||''}</span>${HELP()?'<span class="kp">📨✓</span>':''}`}
function lgAdd(o){scene.add(o);LG.objs.push(o);return o}
function lgCleanup(){LG.objs.forEach(o=>scene.remove(o));LG.objs=[];LG.ents=[];LG.shots=[];LG.fx=[];LG.d={};LG.active=false;const h=$('#lgHud');if(h)h.hidden=true;lightBtn()}
function lgHurt(why){if(LG.inv>0||!LG.active)return;LG.hp--;LG.inv=1.6;if(typeof shake==='function')shake(.35,.35);sfx.bad();if(AU.on)tone(110,.25,'sawtooth',.08);
  const f=$('#hurtFx')||(()=>{const d=document.createElement('div');d.id='hurtFx';document.body.appendChild(d);return d})();f.classList.remove('on');void f.offsetWidth;f.classList.add('on');if(why)floatText(why,'#FCA5A5');lgHud(LG.d.hud);
  if(LG.hp<=0)setTimeout(()=>lgFail(),300)}
function lightBtn(){const acts=document.querySelector('#pad .acts');if(!acts)return;let b=$('#bLight');if(!b){b=document.createElement('button');b.id='bLight';b.className='act lightb';b.innerHTML='✨<small>אור</small>';acts.appendChild(b);
    b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();fireLight()})}b.hidden=!(LG.active&&ME.zone==='legend')}
window.addEventListener('keydown',e=>{if(e.code==='KeyF'&&!e.repeat&&LG.active&&!(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName)))fireLight()});
function fireLight(){if(!LG.active||LG.cd>0||!$('#sheet').hidden)return;LG.cd=.33;let tx=null;let best=11;
  for(const e of LG.ents){if(e.dead||!e.shootable)continue;const d=Math.hypot(e.g.position.x-ME.pos.x,e.g.position.z-ME.pos.z);if(d<best){best=d;tx=e}}
  const a=ME.obj?ME.obj.rotation.y:0;let dx=Math.sin(a),dz=Math.cos(a),dy=0;if(tx){const v=new THREE.Vector3(tx.g.position.x-ME.pos.x,(tx.aimY||.8)-(ME.y+1.1),tx.g.position.z-ME.pos.z).normalize();dx=v.x;dz=v.z;dy=v.y;if(ME.obj)ME.obj.rotation.y=Math.atan2(dx,dz)}
  const o=mesh(new THREE.SphereGeometry(.22,10,8),mat('#FEF9C3',{emissive:'#FDE047',emissiveIntensity:1}),false);o.position.set(ME.pos.x,ME.y+1.1,ME.pos.z);lgAdd(o);LG.shots.push({o,vx:dx*16,vy:dy*16,vz:dz*16,life:.85});
  if(AU.on)tone(880,.07,'triangle',.05,null,null,.005,1320)}
function stepShots(dt){for(let i=LG.shots.length-1;i>=0;i--){const s=LG.shots[i];s.life-=dt;s.o.position.x+=s.vx*dt;s.o.position.y+=s.vy*dt;s.o.position.z+=s.vz*dt;let hit=null;
  for(const e of LG.ents){if(e.dead||!e.shootable)continue;const dy=Math.abs(s.o.position.y-(e.aimY||.8));if(Math.hypot(s.o.position.x-e.g.position.x,s.o.position.z-e.g.position.z)<(e.r||.8)&&dy<(e.hy||1.3)){hit=e;break}}
  if(hit){hit.hit&&hit.hit();fxBurst(s.o.position.x,s.o.position.y,s.o.position.z,'#FDE047',8,1.4)}if(hit||s.life<=0){scene.remove(s.o);LG.shots.splice(i,1)}}}
const near=(g,r)=>Math.hypot(g.position.x-ME.pos.x,g.position.z-ME.pos.z)<r;

/* ---------- villains ---------- */
function grabbMesh(sc){const g=new THREE.Group();const robe=mesh(new THREE.ConeGeometry(.75,2.2,10),mat('#3B0764'));robe.position.y=1.1;g.add(robe);const cape=mesh(new THREE.ConeGeometry(.9,1.9,10,1,true),mat('#7F1D1D',{side:THREE.DoubleSide}));cape.position.set(0,1.05,-.08);g.add(cape);
  const head=mesh(new THREE.SphereGeometry(.42,14,10),mat('#A78BFA'));head.position.y=2.45;g.add(head);[-1,1].forEach(k=>{const e=mesh(new THREE.SphereGeometry(.08,8,6),mat('#EF4444',{emissive:'#EF4444',emissiveIntensity:1}));e.position.set(k*.15,2.5,.36);g.add(e)});
  const crown=mesh(new THREE.CylinderGeometry(.36,.4,.25,6,1,true),mat('#FACC15',{metalness:.6,roughness:.3,side:THREE.DoubleSide}));crown.position.y=2.85;g.add(crown);
  [-1,1].forEach(k=>{const h=mesh(new THREE.SphereGeometry(.16,8,6),mat('#A78BFA'));h.position.set(k*.75,1.55,.2);g.add(h)});g.scale.setScalar(sc||1);g.userData.head=head;g.userData.robe=robe;g.userData.cape=cape;g.userData.crown=crown;return g}
function grumbler(x,z){const g=new THREE.Group();const b=mesh(new THREE.SphereGeometry(.5,12,10),mat('#57534E'));b.position.y=.55;g.add(b);const brow=mesh(new THREE.BoxGeometry(.6,.08,.1),mat('#1C1917'));brow.position.set(0,.8,.42);brow.rotation.z=.15;g.add(brow);
  [-1,1].forEach(k=>{const e=mesh(new THREE.SphereGeometry(.08,8,6),mat('#FDE047',{emissive:'#FACC15',emissiveIntensity:.8}));e.position.set(k*.17,.68,.45);g.add(e)});
  const lb=label('Grumbler 😠','#1C1917','#FFFFFF',.3);lb.position.y=1.35;g.add(lb);g.position.set(x,0,z);lgAdd(g);return{g,body:b,kind:'grum',shootable:true,r:.8,stun:0,
    hit(){this.stun=HELP()?6:4;this.body.material=mat('#A8A29E');floatText('💫 stunned');sfx.pop()},
    up(dt){if(this.stun>0){this.stun-=dt;if(this.stun<=0)this.body.material=mat('#57534E');return}const dx=ME.pos.x-this.g.position.x,dz=ME.pos.z-this.g.position.z,d=Math.hypot(dx,dz)||1;const sp=HELP()?2.1:2.7;
      this.g.position.x+=dx/d*sp*dt;this.g.position.z+=dz/d*sp*dt;this.g.rotation.y=Math.atan2(dx,dz);this.g.position.y=Math.abs(Math.sin(LG.t*9))*.12;
      if(d<.95&&ME.y<.8&&LG.inv<=0){lgHurt('😠');if(P.gems>0){P.gems--;logm('Grumbler גנב','Stolen',-1);renderHud();toast('😠 Grumbler גנב לך 1 💎! יורים בו אור ✨')}const k=1/d;for(let i=0;i<6;i++)tryMove(dx*k*.25,dz*k*.25)}}}}

/* ---------- cut scenes (storybook style) ---------- */
const CUT={pages:null,i:0,done:null};
function cut(pages,done){CUT.pages=pages;CUT.i=0;CUT.done=done;cutPage()}
function cutPage(){const[em,he,enl,who]=CUT.pages[CUT.i];PANEL='cut';sheet(`<div class="sbook"><div class="sbart ${who==='grabb'?'evil':''}">${em}</div><p class="sbhe">${he}</p><div class="bubble ${who==='grabb'?'evilb':''}" style="font-size:15px">${en(enl)}</div>
  <div class="row"><button class="spk" data-a="sayt" data-t="${esc(enl)}">🔊</button><button class="btn sun" data-a="cutnext">${CUT.i<CUT.pages.length-1?'הבא ▶':'⚔️ יאללה!'}</button></div></div>`);say(enl);if(who==='grabb'&&AU.on){tone(98,.5,'sawtooth',.06);tone(73,.7,'square',.04)}}
ACTX.cutnext=()=>{CUT.i++;if(CUT.i>=CUT.pages.length){closeSheet();const f=CUT.done;CUT.done=null;f&&f();return}cutPage()};
const INTROS={
  4:[['😈','מתוך הערפל הופיעה דמות גבוהה עם כתר: Lord Grabb.','HAHAHA! I am Lord Grabb, and everything is MINE! I poisoned the well of the Realm. Now all the water is bitter!','grabb'],
     ['🪣','יצורי ג׳לי של Grabb זוחלים אל הבאר כדי למלא אותה במרירות. אם חמישה מהם יגיעו, הבאר תיהרס.','Stop the goo blobs! Shoot them with light, or jump on them!'],
     ['✨','הכפתור ✨ (או F במקלדת) יורה אור. קופצים על יצור כדי למעוך אותו. יש לך 3 לבבות.','The light is with you. Go!']],
  5:[['⛰️','בקצה הממלכה עולה הר עשוי צורות. על ראשו כתובות מילות הנתינה.','On the top of the Mountain of Shapes are the Words of Giving.'],
     ['👻','Grabb שלח רוחות ערפל שיורות כדורי ערפל. מטפסים בקפיצות, מתחמקים, ויורים בהן אור.','HAHA! My Fog Ghosts will push you down! You will never reach the top!','grabb'],
     ['📜','למעלה מחכות 5 שאלות. תשובה לא נכונה, והברק של Grabb פוגע.','Climb, dodge, and answer with a wise heart.']],
  6:[['🟨','בזמן שטיפסת, Grabb בנה צורת זהב ענקית. כל ה־Shapelings רוקדים סביבה וצועקים "עוד! עוד!".','Gold! More gold! Dance around my Golden Shape and want MORE!','grabb'],
     ['😠','ה־Grumblers שלו רודפים אחרייך וגונבים יהלומים. יריית אור מקפיאה אותם לכמה שניות.','Watch out! The Grumblers steal gems!'],
     ['💛','מתקרבים לכל Shapeling, נוגעים בו, ועונים לו נכון כדי להעיר אותו. צריך להעיר 8.','Wake them up with the right words!']],
  7:[['🌫️','Grabb אסף את כל הערפל לענן אחד גדול. זה הקרב האחרון.','Enough! I will take the whole Crystal for MYSELF!','grabb'],
     ['🤝','אבל לא באת לבד. כל מי שעזרת לו בא לעזור לך: Bella, Leo, Mia, Captain Shell ו־Mosh.','You helped us, now we help you! Together!'],
     ['🔴','נזהרים מהעיגולים האדומים, יורים אור, וכשהוא מרים מגן של "שלי", אוספים 3 כדורי אור.','Dodge the red circles, shoot light, and break his shield together!']]};
function legendArrive(){const s=LGS();if(!LGCH[s.ch]){toast('🌈 הממלכה שקטה ומוארת. תודה לך!');return}const ch=s.ch;s.seen=s.seen||{};if(!s.seen[ch]){s.seen[ch]=1;save();cut(INTROS[ch],()=>lgReady())}else lgReady()}
ACTX.lgready=()=>{if(!LGCH[ST().ch]){toast('כל המבחנים הושלמו 🌈');return}if(LG.active){toast('המשימה כבר רצה ⚔️');return}lgReady()};
function lgReady(){const s=LGS(),ch=s.ch;PANEL='lgready';const tips={4:'🪣 עוצרים 3 גלים של יצורי ג׳לי לפני שהם מגיעים לבאר',5:'⛰️ מטפסים בקפיצות לראש ההר ועונים על 5 שאלות',6:'💛 מעירים 8 Shapelings ונזהרים מה־Grumblers',7:'😈 הקרב הגדול נגד Lord Grabb'};if(LGCH[ch].tip)tips[ch]=LGCH[ch].tip;
  sheet(`<h2>${CHAPTERS[ch].em} ${CHAPTERS[ch].he} · ${en(CHAPTERS[ch].en)}</h2><p class="sub">${tips[ch]}</p><p class="sub">❤️❤️❤️ · ✨ יורים אור · ⤴ קופצים על אויבים${s.fails[ch]?` · ניסיונות: ${s.fails[ch]}`:''}</p>
  ${HELP()?'<p class="sub">📨 ה־Keeper עונה לך ועוזר במשימה הזאת ✓</p>':''}<div class="row"><button class="btn sun" data-a="lggo">⚔️ ${en('Start!')}</button><button class="btn ghost" data-a="close">אחר כך</button></div>`)}
ACTX.lggo=()=>{closeSheet();lgStart(LGS().ch)};

/* ---------- the chapter registry (later acts add their own) ---------- */
const LGCH={};
/* ---------- starting and ending a trial ---------- */
function lgStart(ch){lgCleanup();const C=LGCH[ch];Object.assign(LG,{active:true,ch,hp:C.hp||3,max:C.hp||3,inv:1,t:0,cd:0,d:{}});const[cx,cz]=ZC.legend;const st=C.at||[0,10];ME.pos.set(cx+st[0],0,cz+st[1]);ME.y=0;lightBtn();
  C.start();lgHud(LG.d.hud);say('Go!');if(AU.on)tone(523,.15,'square',.05)}
function lgFail(){if(!LG.active)return;const ch=LG.ch;const s=LGS();s.fails[ch]=(s.fails[ch]||0)+1;save();lgCleanup();PANEL='lgfail';const n=s.fails[ch];
  if(AU.on){tone(196,.3,'triangle',.06);setTimeout(()=>tone(147,.5,'triangle',.06),250)}
  sheet(`<h2>😵 ${en('Lord Grabb won… this time.')}</h2><div class="bubble evilb">${en('HAHAHA! You will never beat me alone!')}</div>
  <p class="sub">${n>=2&&!s.help[ch]?'נתקעת? בעולם הזה יש מנהל: Keeper of Shapeland. כותבים לו מכתב באנגלית ומבקשים עזרה. מי שלא מבקש, ממשיך להפסיד…':'אפשר לנסות שוב. כל ניסיון מלמד משהו.'}</p>
  <div class="row"><button class="btn sun" data-a="lggo">🔄 ${en('Try again')}</button>${n>=2&&!s.help[ch]?`<button class="btn" data-a="keeper">📨 ${en('Write to the Keeper')}</button>`:''}<button class="btn ghost" data-a="close">אחר כך</button></div>`);say('HAHAHA! You will never beat me alone!')}
function lgEnd(win,quiet){const ch=LG.ch;lgCleanup();if(quiet||!win)return;const s=LGS();if(ch<=7)s.shards=Math.max(s.shards,ch);s.ch=ch+1;save();paintShards();paintLegend();legendSky();
  burst(`<span style="color:${SHARDC[ch-1]||'#FDE047'}">${ch<=7?'💎':'🕯️'}</span> ${CHAPTERS[ch].he}`);sfx.win();if(typeof shake==='function')shake(.25,.4);fxBurst(ME.pos.x,2,ME.pos.z,SHARDC[ch-1]||'#FDE047',40,3.5);
  addGems(15+ch*2,'מבחן: '+CHAPTERS[ch].he,'Trial won');addXp(60);kind(3,'ניצחת את '+CHAPTERS[ch].he);renderQuestChip();updateMoshMark()}
function hiddenHand(he,enl){const s=LGS();if(!s.hh.includes(he)){s.hh.push(he);save()}toast('🖐️ '+he);say(enl);if(AU.on){tone(1318,.4,'sine',.05);setTimeout(()=>tone(1760,.5,'sine',.04),180)}}

/* ---------- 4: the Bitter Well ---------- */
function startWell(){const[wx,wz]=LW(0,-10);const g=new THREE.Group();const ring=mesh(new THREE.CylinderGeometry(1.6,1.7,.9,18,1,true),mat('#A8A29E',{side:THREE.DoubleSide}));ring.position.y=.45;g.add(ring);
  const top=mesh(new THREE.TorusGeometry(1.65,.16,8,24),mat('#78716C'));top.rotation.x=Math.PI/2;top.position.y=.9;g.add(top);const water=mesh(new THREE.CircleGeometry(1.5,24),mat('#65A30D',{emissive:'#3F6212',emissiveIntensity:.3}),false);water.rotation.x=-Math.PI/2;water.position.y=.7;g.add(water);
  const lb=label('🪣 Bitter Well','#3F6212','#FFFFFF',.4);lb.position.y=2.2;g.add(lb);g.position.set(wx,0,wz);lgAdd(g);
  Object.assign(LG.d,{well:g,water,wx,wz,bitter:0,wave:0,left:0,spawnT:1.5,alive:0,phase:'waves',sizes:HELP()?[4,6,8]:[6,8,10]});nextWave()}
function nextWave(){const d=LG.d;d.wave++;d.left=d.sizes[d.wave-1];d.hud=`גל ${d.wave}/3 · 🪣 ${d.bitter}/5`;lgHud(d.hud);toast(`🌊 גל ${d.wave}!`);say('Wave '+d.wave+'!')}
function blob(){const d=LG.d;const a=Math.random()*Math.PI*2,r=14;const cx=d.wx,cz=d.wz+3;const g=new THREE.Group();const b=mesh(new THREE.SphereGeometry(.45,12,10),mat('#84CC16',{transparent:true,opacity:.85,emissive:'#4D7C0F',emissiveIntensity:.3}));b.position.y=.4;b.scale.y=.75;g.add(b);
  [-1,1].forEach(k=>{const e=mesh(new THREE.SphereGeometry(.07,6,4),mat('#111827'));e.position.set(k*.14,.5,.36);g.add(e)});g.position.set(cx+Math.cos(a)*r,0,cz+Math.sin(a)*r);lgAdd(g);d.alive++;
  const sp=(HELP()?.75:1)+d.wave*.12;LG.ents.push({g,body:b,kind:'blob',shootable:true,r:.7,aimY:.4,
    hit(){this.die()},die(){if(this.dead)return;this.dead=true;scene.remove(this.g);d.alive--;fxBurst(this.g.position.x,.4,this.g.position.z,'#84CC16',12,1.6);sfx.pop()},
    up(dt){const dx=d.wx-this.g.position.x,dz=d.wz-this.g.position.z,dd=Math.hypot(dx,dz);this.g.position.x+=dx/dd*sp*dt;this.g.position.z+=dz/dd*sp*dt;this.body.scale.y=.7+Math.abs(Math.sin(LG.t*6+this.g.position.x))*.2;this.g.rotation.y=Math.atan2(dx,dz);
      if(dd<1.8){this.die();d.bitter++;floatText('🤢 +1');if(AU.on)tone(140,.2,'sawtooth',.05);d.hud=`גל ${d.wave}/3 · 🪣 ${d.bitter}/5`;lgHud(d.hud);if(d.bitter>=5){toast('🪣 הבאר התמלאה במרירות…');lgFail()}return}
      const pd=Math.hypot(ME.pos.x-this.g.position.x,ME.pos.z-this.g.position.z);if(pd<.85){if(ME.y>.3&&ME.vy<=0){this.die();ME.vy=7;floatText('💥 Stomp!')}else if(ME.y<.3)lgHurt('🟢')}}})}
function stepWell(dt){const d=LG.d;if(d.phase==='waves'){if(d.left>0){d.spawnT-=dt;if(d.spawnT<=0){d.spawnT=HELP()?1.6:1.15;d.left--;blob()}}
    else if(d.alive<=0){if(d.wave<3)nextWave();else{d.phase='branch';
      const a=Math.random()*Math.PI*2;const bx=clamp(ME.pos.x+Math.cos(a)*5,ZC.legend[0]-RL+4,ZC.legend[0]+RL-4),bz=clamp(ME.pos.z+Math.sin(a)*5,ZC.legend[1]-RL+4,ZC.legend[1]+RL-4);
      const br=new THREE.Group();const st=mesh(new THREE.CylinderGeometry(.06,.08,1.4,6),mat('#92400E'));st.rotation.z=Math.PI/2;st.position.y=.2;br.add(st);for(let i=0;i<5;i++){const l=mesh(new THREE.SphereGeometry(.18,8,6),mat('#4ADE80',{emissive:'#22C55E',emissiveIntensity:.6}));l.position.set(-.5+i*.25,.35,(i%2?.12:-.12));br.add(l)}
      const lb=label('🌿','#FFFFFF','#15803D',.35);lb.position.y=1.1;br.add(lb);br.position.set(bx,6,bz);lgAdd(br);d.branch=br;d.hud='🌿 מוצאים את הענף';lgHud(d.hud);
      hiddenHand('רוח פתאומית הפילה ענף מתוק… האם זה מקרה?','A sudden wind… a branch fell from the sky!')}}}
  else if(d.phase==='branch'){const br=d.branch;if(br.position.y>0)br.position.y=Math.max(0,br.position.y-dt*5);br.rotation.y+=dt;if(br.position.y===0&&near(br,1.4)){d.phase='carry';scene.remove(br);d.hud='🌿 ← מביאים את הענף לבאר';lgHud(d.hud);sfx.coin();say('Bring the branch to the well!')}}
  else if(d.phase==='carry'&&near(d.well,2.6)){d.phase='done';d.water.material=mat('#38BDF8',{emissive:'#0EA5E9',emissiveIntensity:.5});fxBurst(d.wx,1.5,d.wz,'#7DD3FC',50,4);
    say('The water is sweet again!');setTimeout(()=>{cut([['💧','הענף נגע במים, והם נעשו מתוקים. גם Grabb לא הבין איך.','The water is sweet! But Lord Grabb is not finished…'],['😈','"זה עוד לא נגמר! ההר שלי יעצור אותך!"','You were lucky! My mountain will stop you!','grabb']],()=>lgEnd(true))},900)}}

/* ---------- 5: the Mountain of Shapes ---------- */
const MPL=[];
function startMountain(){const[mx,mz]=LW(13,-3);const N=12,step=HELP()?.62:.75;MPL.length=0;
  for(let i=0;i<N;i++){const a=i*.5,r=3.3,x=mx+Math.cos(a)*r,z=mz+Math.sin(a)*r,top=step*(i+1);const c=mesh(new THREE.CylinderGeometry(.85,.95,top,8),mat(['#A8A29E','#78716C','#D6D3D1'][i%3]));c.position.set(x,top/2,z);lgAdd(c);
    const pl={x0:x-.8,x1:x+.8,z0:z-.8,z1:z+.8,top};PLATS.push(pl);MPL.push(pl)}
  const st=step*N+.45;const sm=mesh(new THREE.CylinderGeometry(2.3,2.6,st,10),mat('#57534E'));sm.position.set(mx,st/2,mz);lgAdd(sm);const sp={x0:mx-2.2,x1:mx+2.2,z0:mz-2.2,z1:mz+2.2,top:st};PLATS.push(sp);MPL.push(sp);
  const tab=new THREE.Group();[-1,1].forEach(k=>{const t=mesh(new THREE.BoxGeometry(.8,1.2,.15),mat('#E7E5E4',{emissive:'#FDE68A',emissiveIntensity:.2}));t.position.set(k*.45,.6,0);tab.add(t)});tab.position.set(mx,st,mz);lgAdd(tab);
  Object.assign(LG.d,{mx,mz,st,tab,ghosts:[],q:0,asked:false,hud:'⛰️ מטפסים לפסגה'});
  for(let i=0;i<(HELP()?1:2);i++){const g=new THREE.Group();const b=mesh(new THREE.SphereGeometry(.55,12,10),mat('#E5E7EB',{transparent:true,opacity:.75}));g.add(b);const tail=mesh(new THREE.ConeGeometry(.5,.9,10),mat('#E5E7EB',{transparent:true,opacity:.6}));tail.rotation.x=Math.PI;tail.position.y=-.6;g.add(tail);
    [-1,1].forEach(k=>{const e=mesh(new THREE.SphereGeometry(.09,6,4),mat('#1F2937'));e.position.set(k*.18,.1,.48);g.add(e)});lgAdd(g);
    const gh={g,kind:'ghost',shootable:true,r:.9,hy:1.6,a:i*3.1,stun:0,cd:2.5+i*1.5,aimY:0,hit(){this.stun=5;this.g.visible=false;floatText('👻💨')},
      up(dt){if(this.stun>0){this.stun-=dt;if(this.stun<=0)this.g.visible=true;return}this.a+=dt*(HELP()?.35:.5);const y=clamp(ME.y+2.5,2.5,LG.d.st+2);this.g.position.set(mx+Math.cos(this.a)*7.5,y+Math.sin(LG.t*2+this.a)*.4,mz+Math.sin(this.a)*7.5);this.aimY=this.g.position.y;
        this.g.lookAt(ME.pos.x,ME.y+1,ME.pos.z);this.cd-=dt;if(this.cd<=0){this.cd=HELP()?5.5:3.6;if(Math.hypot(this.g.position.x-ME.pos.x,this.g.position.z-ME.pos.z)<13)fogBall(this.g.position)}}};LG.ents.push(gh)}}
function fogBall(from){const o=mesh(new THREE.SphereGeometry(.35,10,8),mat('#6B7280',{transparent:true,opacity:.85}),false);o.position.copy(from);lgAdd(o);const v=new THREE.Vector3(ME.pos.x-from.x,ME.y+1-from.y,ME.pos.z-from.z).normalize().multiplyScalar(HELP()?3:4);
  LG.fx.push({o,v,life:4,up(dt){this.o.position.addScaledVector(this.v,dt);this.life-=dt;const d=Math.hypot(this.o.position.x-ME.pos.x,this.o.position.y-(ME.y+1),this.o.position.z-ME.pos.z);if(d<.75){lgHurt('🌫️');this.life=0}return this.life>0}})}
function stepMountain(dt){const d=LG.d;d.tab.rotation.y+=dt*.4;if(!d.asked&&ME.y>d.st-.3&&Math.hypot(ME.pos.x-d.mx,ME.pos.z-d.mz)<2.6){d.asked=true;d.q=0;d.hud='📜 מילות הנתינה';lgHud(d.hud);
    hiddenHand('העננים נפתחו מעל הפסגה…','The clouds opened above the top.');nextWord()}}
const GIVING=[['Help your ___.','friend',['friend','shoe','stone']],['Share your ___ with others.','food',['food','fight','fog']],['Say please and ___ you.','thank',['thank','take','tell']],['Do not ___ from others.','steal',['steal','sing','swim']],
  ['Be ___ to animals.','kind',['kind','mean','late']],['Tell the ___.','truth',['truth','table','tree']],['Listen to your ___.','parents',['parents','pencils','plates']],['Visit a friend who is ___.','sick',['sick','rich','big']],['Give a ___ to someone sad.','smile',['smile','smell','snake']]];
function nextWord(){const d=LG.d;PANEL='words';let q;if(d.q%2===1){const m=qMath(clamp(Math.round(P.sk.math),2,8));q={p:m.prompt,a:String(m.ans).replace(/\.0+$/,''),o:numOpts?numOpts(m.ans).map(o=>String(o.val)):[String(m.ans)]}}
  else{const w=pick(GIVING);q={p:w[0],a:w[1],o:[...w[2]].sort(()=>Math.random()-.5)}}d.cur=q;
  sheet(`<h2>📜 ${en('Words of Giving')} ${d.q+1}/5</h2><div class="bubble" style="font-size:20px">${en(q.p)}</div><div class="opts">${q.o.map(o=>`<button class="opt" data-a="wordans" data-v="${esc(o)}">${en(o)}</button>`).join('')}</div>`);say(q.p.replace('___','blank'))}
ACTX.wordans=dd=>{const d=LG.d;if(!d.cur)return;if(String(dd.v)!==String(d.cur.a)){learnResult(d.q%2?'math':'vocab',false);lgHurt('⚡ Grabb!');if(LG.active)nextWord();return}
  learnResult(d.q%2?'math':'vocab',true);d.q++;sfx.coin();if(d.q<5){nextWord();return}closeSheet();d.tab.children.forEach(t=>t.material=mat('#FEF9C3',{emissive:'#FDE047',emissiveIntensity:.9}));fxBurst(d.mx,d.st+1,d.mz,'#FDE047',50,4);
  setTimeout(()=>cut([['📜','הלוחות זוהרים: "עזרו, שתפו, אמרו תודה, אמרו אמת".','Help. Share. Say thank you. Tell the truth. These are the Words of Giving.'],['😈','"אה כן? בזמן שטיפסת, בניתי משהו שכולם אוהבים יותר…"','While you were climbing, I built something everyone loves MORE!','grabb']],()=>lgEnd(true)),700)};

/* ---------- 6: the Golden Shape ---------- */
function startGold(){const[gx,gz]=LW(-12,-3);const st=shapeMesh('star','yellow');st.material=mat('#FACC15',{metalness:.8,roughness:.25,emissive:'#CA8A04',emissiveIntensity:.25});st.scale.setScalar(3.2);st.position.set(gx,3.6,gz);lgAdd(st);
  const ped=mesh(new THREE.CylinderGeometry(1.6,2,1.2,10),mat('#A16207'));ped.position.set(gx,.6,gz);lgAdd(ped);const lb=label('🟨 MORE! MORE!','#A16207','#FFFFFF',.45);lb.position.set(gx,7.4,gz);lgAdd(lb);
  Object.assign(LG.d,{gx,gz,statue:st,woke:0,hud:'💛 0/8 התעוררו'});const shapes=['ball','box','cone','cylinder','heart','pyramid','donut','star'],cols=['red','blue','green','pink','orange','purple','yellow','white'];
  for(let i=0;i<8;i++){const g=new THREE.Group();const b=shapeMesh(shapes[i],cols[i]);b.scale.setScalar(.75);b.position.y=.7;g.add(b);[-1,1].forEach(k=>{const e=mesh(new THREE.SphereGeometry(.07,6,4),mat('#7C3AED',{emissive:'#7C3AED',emissiveIntensity:.8}));e.position.set(k*.14,.85,.36);g.add(e)});
    const lb=label('💫 more!','#7C3AED','#FFFFFF',.28);lb.position.y=1.6;g.add(lb);lgAdd(g);rootify(g);const sh={g,lb,kind:'shapeling',a:i/8*Math.PI*2,awake:0,shootable:false,
      up(dt){if(this.awake){this.awake+=dt;const dx=this.g.position.x-LG.d.gx,dz=this.g.position.z-LG.d.gz,dd=Math.hypot(dx,dz)||1;if(dd<11){this.g.position.x+=dx/dd*3*dt;this.g.position.z+=dz/dd*3*dt}this.g.position.y=Math.abs(Math.sin(LG.t*6+this.a))*.3;return}
        this.a+=dt*.6;this.g.position.set(LG.d.gx+Math.cos(this.a)*4.3,Math.abs(Math.sin(LG.t*5+this.a))*.25,LG.d.gz+Math.sin(this.a)*4.3);this.g.rotation.y=-this.a}};
    g.userData.zact=()=>wakeTalk(sh);g.userData.talker='Shapeling';EXTRA_PICK.push(g);LG.ents.push(sh)}
  const n=HELP()?2:3;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2;LG.ents.push(grumbler(gx+Math.cos(a)*9,gz+Math.sin(a)*9))}}
const WAKE=[["More gold! I want MORE!","Share with your friends!",["Take more gold!","Hide it from everyone!"]],["Gold is the best thing in the world!","Friends are better than gold!",["Gold forever!","I want a bigger statue!"]],
  ["I don't need anybody. I have gold!","Everybody needs friends.",["You are right!","Buy more gold!"]],["Mine! Mine! All mine!","Let's play together!",["Yes, all yours!","Grab it fast!"]]];
function wakeTalk(sh){if(!LG.active||sh.awake)return;if(!near(sh.g,3)){toast('🏃 מתקרבים ל־Shapeling ואז נוגעים');return}const w=pick(WAKE);LG.d.wk={sh,w};PANEL='wake';const opts=[w[1],...w[2]].sort(()=>Math.random()-.5);
  sheet(`<h2>💫 ${en('Shapeling')}</h2><div class="bubble">${en(w[0])}</div><h3>${en('What do you say?')}</h3><div class="opts">${opts.map(o=>`<button class="opt" data-a="wakeans" data-v="${esc(o)}">${en(o)}</button>`).join('')}</div>`);say(w[0])}
ACTX.wakeans=dd=>{const k=LG.d.wk;if(!k)return;closeSheet();if(dd.v!==k.w[1]){learnResult('sentence',false);say('HAHAHA! More gold!');lgHurt('😈');return}learnResult('sentence',true);const sh=k.sh;sh.awake=.01;
  sh.g.remove(sh.lb);const lb=label('💛 Thank you!','#DB2777','#FFFFFF',.28);lb.position.y=1.6;sh.g.add(lb);fxBurst(sh.g.position.x,1,sh.g.position.z,'#F472B6',20,2);sfx.coin();say('Thank you! I am awake!');
  const d=LG.d;d.woke++;d.hud=`💛 ${d.woke}/8 התעוררו`;lgHud(d.hud);if(d.woke>=8){d.end=1;hiddenHand('סערה הגיעה משום מקום, וברק פגע בצורת הזהב!','A storm came from nowhere!');
    const bolt=mesh(new THREE.CylinderGeometry(.25,.05,14,6),mat('#FEF9C3',{emissive:'#FDE047',emissiveIntensity:1}),false);bolt.position.set(d.gx,7,d.gz);lgAdd(bolt);if(typeof shake==='function')shake(.5,.6);if(AU.on)hiss&&hiss(.8,'lowpass',400,1,.15);
    setTimeout(()=>{scene.remove(bolt);fxBurst(d.gx,3,d.gz,'#FACC15',70,5);d.statue.visible=false;setTimeout(()=>cut([['💥','צורת הזהב התנפצה לאלפי חתיכות. ה־Shapelings התעוררו וחיבקו זה את זה.','The Golden Shape broke! Friends are better than gold!'],['😈','"מספיק! עכשיו אקח את כל הגביש לעצמי!"','ENOUGH! Now I will take the whole Crystal for MYSELF!','grabb']],()=>lgEnd(true)),900)},450)}};

/* ---------- 7: Together — the battle with Lord Grabb ---------- */
const ALLY=[['Bella',{g:'girl',hair:'ponytail',hc:'#E8C268',top:'#F472B6',bot:'skirt',bc:'#1D2A48'}],['Leo',{g:'boy',hair:'short',hc:'#1F1B1A',top:'#3B82F6',bot:'pants',bc:'#334155'}],
  ['Mia',{g:'girl',hair:'long',hc:'#8A5530',top:'#22C55E',bot:'dress',bc:'#22C55E'}],['Captain Shell',SHELL],['Mosh',MOSH_CH]];
function startBoss(){const[bx,bz]=LW(0,-1);const gb=grabbMesh(1.7);gb.position.set(bx,2.4,bz);lgAdd(gb);const shield=mesh(new THREE.SphereGeometry(3,20,14),mat('#7C3AED',{transparent:true,opacity:.28,emissive:'#7C3AED',emissiveIntensity:.5}),false);shield.position.set(bx,4.2,bz);shield.visible=false;lgAdd(shield);
  const max=HELP()?26:40;const friends=NET.peers.filter(p=>!p.sameTab&&p.presence&&p.presence.zone==='legend').length;
  const boss={g:gb,kind:'boss',shootable:true,r:1.6,hy:3,aimY:4,hp:max,max,shield:false,orbs:0,bombT:2,phase:1,
    hit(){if(this.shield){floatText('🛡️ Mine!');return}this.hp-=1+(friends?1:0);this.g.userData.head.material=mat('#FFFFFF');setTimeout(()=>this.g.userData.head.material=mat('#A78BFA'),90);if(AU.on)tone(220,.06,'square',.04);bossHud()},
    up(dt){if(LG.d.won)return;this.g.position.y=2.4+Math.sin(LG.t*1.5)*.5;this.g.rotation.y=Math.atan2(ME.pos.x-this.g.position.x,ME.pos.z-this.g.position.z);this.bombT-=dt;
      if(this.bombT<=0){this.bombT=(HELP()?3.4:2.6)-(this.phase>=2?.4:0);fogBomb()}
      if(this.phase===1&&this.hp<this.max*.66){this.phase=2;say('Grumblers! Get her!');for(let i=0;i<2;i++)LG.ents.push(grumbler(this.g.position.x+(i?4:-4),this.g.position.z+3))}
      if(this.phase===2&&this.hp<this.max*.33){this.phase=3;this.shield=true;shield.visible=true;say('My shield of MINE! You can not touch me!');toast('🛡️ מגן של "שלי"! אוספים 3 כדורי אור ביחד');spawnOrbs()}
      if(this.hp<=0){LG.d.won=1;bossDown()}}};
  LG.ents.push(boss);Object.assign(LG.d,{boss,shield,friends,hud:''});
  ALLY.forEach(([n,ch],i)=>{const a=-Math.PI*.15-i/(ALLY.length-1)*Math.PI*.7;const d=human3D(Object.assign({kind:'human',eyes:'happy'},ch));d.position.set(bx+Math.cos(a)*10,0,bz-Math.sin(a)*10+6);d.lookAt(bx,0,bz);
    const lb=label(n,'#15803D','#FFFFFF',.32);lb.position.y=2.4;d.add(lb);lgAdd(d);LG.ents.push({g:d,kind:'ally',cd:2+i*.6,up(dt){this.cd-=dt;if(this.cd<=0&&!LG.d.won){this.cd=HELP()?2.4:3.2;allyBeam(this.g,boss)}}})});
  bossHud();setTimeout(()=>{if(LG.active)toast(friends?`👫 ${friends} חברים בממלכה! האור שלכם חזק פי 2`:'🤝 כל מי שעזרת לו בא לעזור!')},1200)}
function bossHud(){const b=LG.d.boss;LG.d.hud=`😈 ${'█'.repeat(Math.max(0,Math.ceil(b.hp/b.max*10)))}${'░'.repeat(10-Math.max(0,Math.ceil(b.hp/b.max*10)))}${b.shield?' 🛡️ '+b.orbs+'/3':''}`;lgHud(LG.d.hud)}
function allyBeam(from,boss){const a=new THREE.Vector3(from.position.x,1.5,from.position.z),b=new THREE.Vector3(boss.g.position.x,boss.g.position.y+1.5,boss.g.position.z);const len=a.distanceTo(b);
  const beam=mesh(new THREE.CylinderGeometry(.07,.07,len,6),mat('#FDE047',{emissive:'#FDE047',emissiveIntensity:1,transparent:true,opacity:.8}),false);beam.position.copy(a).add(b).multiplyScalar(.5);beam.lookAt(b);beam.rotateX(Math.PI/2);lgAdd(beam);setTimeout(()=>scene.remove(beam),180);
  if(!boss.shield){boss.hp-=1;bossHud()}}
function fogBomb(){const x=ME.pos.x+(Math.random()-.5)*1.5,z=ME.pos.z+(Math.random()-.5)*1.5;const ring=mesh(new THREE.RingGeometry(1.3,1.6,24),mat('#EF4444',{transparent:true,opacity:.75,side:THREE.DoubleSide,emissive:'#EF4444',emissiveIntensity:.6}),false);ring.rotation.x=-Math.PI/2;ring.position.set(x,.06,z);lgAdd(ring);
  LG.fx.push({o:ring,t:HELP()?2:1.5,up(dt){this.t-=dt;this.o.scale.setScalar(1+Math.sin(LG.t*20)*.05);if(this.t<=0){scene.remove(this.o);fxBurst(x,.6,z,'#6B7280',22,2.4);if(AU.on)hiss&&hiss(.3,'lowpass',500,1,.08);if(Math.hypot(ME.pos.x-x,ME.pos.z-z)<1.6&&ME.y<1.2)lgHurt('🌫️');return false}return true}})}
function spawnOrbs(){const[cx,cz]=ZC.legend;for(let i=0;i<3;i++){const a=i/3*Math.PI*2+Math.random();const o=mesh(new THREE.SphereGeometry(.4,14,10),mat('#FEF9C3',{emissive:'#FDE047',emissiveIntensity:1}),false);o.position.set(cx+Math.cos(a)*12,1,cz-1+Math.sin(a)*12);lgAdd(o);
  LG.fx.push({o,up(dt){this.o.position.y=1+Math.sin(LG.t*3+i)*.3;if(near(this.o,1.3)){scene.remove(this.o);const b=LG.d.boss;b.orbs++;sfx.coin();floatText('✨ '+b.orbs+'/3');bossHud();if(b.orbs>=3){b.shield=false;LG.d.shield.visible=false;fxBurst(b.g.position.x,4,b.g.position.z,'#FDE047',60,5);say('Together we are stronger!');hiddenHand('ציפורים עפו פתאום ופיזרו את הערפל…','Birds came and blew the fog away!');bossHud()}return false}return true}})}}
function bossDown(){const b=LG.d.boss;LG.ents.filter(e=>e.kind==='grum').forEach(e=>{e.dead=true;scene.remove(e.g)});LG.fx.forEach(f=>scene.remove(f.o));LG.fx=[];b.g.position.y=0;
  setTimeout(()=>{PANEL='grabbdown';sheet(`<div class="sbook"><div class="sbart evil">😔</div><p class="sbhe">Lord Grabb נפל על הברכיים. הכתר נפל מראשו.</p><div class="bubble evilb">${en('I… I only wanted to be full. But I was always empty…')}</div>
    <h3>${en('What do you do?')}</h3><div class="row"><button class="btn sun" data-a="grabbgift">🎁 ${en('Give him a gift')}</button><button class="btn ghost" data-a="grabbblast">⚡ ${en('Blast him away')}</button></div></div>`);say('I only wanted to be full. But I was always empty.')},700)}
ACTX.grabbblast=()=>{PANEL='mosh2';sheet(`<div class="npchead"><div class="face" style="background:#FEF3C7">${humanSVG(Object.assign({kind:'human'},MOSH_CH))}</div><div class="grow"><h2>Mosh</h2></div></div><div class="bubble">${en('Wait… Remember the secret of the Minelings? He is not bad. He is empty.')}</div>
  <p class="sub">"זוכרת את הסוד של ה־Minelings? הוא לא רע. הוא ריק."</p><div class="row"><button class="btn sun" data-a="grabbgift">🎁 ${en('Give him a gift')}</button></div>`);say('Wait. Remember the secret of the Minelings? He is not bad. He is empty.')};
ACTX.grabbgift=()=>{closeSheet();const b=LG.d.boss.g;b.userData.robe.material=mat('#FFFFFF');b.userData.cape.material=mat('#FACC15',{side:THREE.DoubleSide});b.userData.head.material=mat('#FDE68A');fxBurst(b.position.x,2,b.position.z,'#FDE047',80,5);sfx.win();
  setTimeout(()=>cut([['🎁','נתת לו מתנה. בפעם הראשונה בחייו, Grabb קיבל משהו באהבה.','For the first time, someone gave me something with love…'],['🌟','הכתר השחור נעשה זהב, והגלימה לבנה. "עכשיו גם אני רוצה לתת. קראו לי Grant."','Now I want to give too. Call me Grant, the Giver.'],
    ['💎','הרסיס האחרון חזר. גביש האחדות שלם. הצבעים חזרו לכל ארץ הצורות.','The Crystal of Unity is whole again! The light is back in all of Shapeland!'],['🖐️','ואת היוצר? אף אחד לא ראה. אבל כולם הרגישו את היד שלו.','Nobody saw the Shaper… but everybody felt his hand.'],['📜','סוף המערכה הראשונה. האגדה ממשיכה…','The end of the first part. The legend continues…']],()=>{lgEnd(true);finale()}),900)};
function finale(){const s=LGS();s.done1=1;s.shards=7;save();paintShards();P.badges.lightkeeper=1;addGems(30,'שומר/ת האור','Light Keeper');burst('🌈 Light Keeper!');
  setTimeout(()=>{leaveLegend();let n=0;const iv=setInterval(()=>{if(++n>12){clearInterval(iv);return}const a=Math.random()*Math.PI*2;fxBurst(Math.cos(a)*6,6+Math.random()*3,Math.sin(a)*6,pick(SHARDC),40,4);if(AU.on)tone(600+Math.random()*900,.15,'triangle',.05)},350)},1500)}

/* ---------- the Keeper of Shapeland: write in English to ask for help ---------- */
const TOPIC={4:/water|well|bitter|blob|goo|slime|wave/,5:/mountain|climb|fog|ghost|top|question|jump/,6:/gold|golden|statue|wake|grumbler|shapeling|steal/,7:/grabb|lord|boss|shield|fight|fog|bomb|battle/};
ACTX.keeper=()=>openKeeper();
function openKeeper(){const s=LGS();PANEL='keeper';const ch=s.ch;const stuck=!!LGCH[ch];
  sheet(`<div class="npchead"><div class="face" style="background:#E0E7FF">🏛️</div><div class="grow"><h2>${en('The Keeper of Shapeland')}</h2><p class="sub">המנהל של העולם · עונה רק למכתבים באנגלית</p></div></div>
  <p class="sub">${stuck?`נתקעת ב${CHAPTERS[ch].he}? כותבים מכתב מנומס באנגלית: למי כותבים, מה הבעיה, ומה מבקשים.`:'אפשר לכתוב ל־Keeper בכל זמן ולבקש רמז.'}</p>
  <textarea id="kpIn" dir="ltr" rows="4" placeholder="Dear Keeper, ..." class="kp"></textarea>
  <details><summary>💡 ${en('Help me write')}</summary><p class="sub" dir="ltr" style="text-align:left">Dear Keeper,<br>please help me. The ______ is too hard.<br>Thank you, ${esc(P.name||'Shirel')}</p><p class="sub">מילים שימושיות: please · help · hard · can you · thank you</p></details>
  <div class="row"><button class="btn sun" data-a="kpsend">📨 ${en('Send')}</button><button class="btn ghost" data-a="close">סגירה</button></div>
  ${s.letters.length?`<details><summary>📨 המכתבים שלי (${s.letters.length})</summary>${s.letters.slice(0,5).map(l=>`<p class="sub" dir="ltr" style="text-align:left">✉️ ${esc(l.t)}<br>↩️ <i>${esc(l.r)}</i></p>`).join('')}</details>`:''}`);setTimeout(()=>{const t=$('#kpIn');if(t)t.focus()},200)}
ACTX.kpsend=()=>{const t=($('#kpIn')||{}).value||'';const s=LGS(),ch=s.ch;const txt=t.trim();const low=txt.toLowerCase();const words=low.match(/[a-z']+/g)||[];
  const no=(m,he)=>{say(m);toast('🏛️ '+he);sfx.bad()};
  if(/[֐-׿]/.test(txt)){no('The Keeper reads only English.','ה־Keeper קורא רק אנגלית. כותבים באותיות באנגלית ✍️');return}
  if(words.length<4){no('Please write a full sentence.','קצר מדי. כותבים משפט שלם, לפחות 4 מילים');return}
  if(!/help|assist/.test(low)){no('What do you need? Use the word help.','מה את צריכה? משתמשים במילה help');return}
  if(!/please|could you|can you|would you/.test(low)){no('The Keeper likes polite letters.','ה־Keeper אוהב מכתבים מנומסים. מוסיפים please 🙂');return}
  let reply,he,granted=false;
  if(LGCH[ch]&&!LGCH[ch].topic.test(low)){reply='Dear friend, I want to help! But what is the problem? Tell me more.';he='"אני רוצה לעזור! אבל מה הבעיה? ספרי לי יותר." מוסיפים במכתב באנגלית מה בדיוק קשה במשימה'}
  else if(LGCH[ch]){granted=!s.help[ch];s.help[ch]=1;reply=LGCH[ch].reply||{4:'Dear friend, I will slow the blobs, and the wind will be with you.',5:'Dear friend, I will make the steps lower and the ghosts slower.',6:'Dear friend, I will send fewer Grumblers, and they will sleep longer.',7:"Dear friend, Grabb's fog will be slower, and your friends will shine brighter."}[ch];
    he='"חבר/ה יקר/ה, אני אעזור לך." המשימה עכשיו קלה יותר ✓'}
  else{reply='Dear friend, '+objective().replace(/[^\x20-\x7E]/g,'').trim()+' Keep going!';he=objective()}
  s.letters.unshift({t:txt.slice(0,200),r:reply});s.letters=s.letters.slice(0,20);learnResult('sentence',true);save();if(granted){kind(1,'ביקשת עזרה בחוכמה');hiddenHand('מכתב זוהר הגיע בחזרה…','A glowing letter came back…')}
  PANEL='kpreply';sfx.win();sheet(`<h2>✉️ ${en('A letter from the Keeper')}</h2><div class="letter" dir="ltr">${esc(reply)}<br><br>— The Keeper of Shapeland 🏛️</div><p class="sub">${he}</p>
    <div class="row"><button class="spk" data-a="sayt" data-t="${esc(reply)}">🔊</button>${LGCH[ch]&&granted?`<button class="btn sun" data-a="lggo">⚔️ ${en('Try again')}</button>`:''}<button class="btn ghost" data-a="close">סגירה</button></div>`);say(reply)};

/* ---------- Mosh, the HUD and the loop ---------- */
const _talkMoshL=talkMosh;talkMosh=function(){const s=LGS();if(s.ch<4)return _talkMoshL();placePortal();
  if(s.ch>7){moshSay('You did it! You brought the light back. Now Shapeland knows its purpose: to be good to each other.','הצלחת! החזרת את האור. עכשיו ארץ הצורות יודעת למה נבראה: כדי שנהיה טובים זה לזה. 🌈','<button class="btn" data-a="book">📜 הספר</button>');return}
  moshSay('A dark lord, Lord Grabb, opened the Realm of Trials. The portal is next to the Crystal. I will be with you. And if you are stuck… write to the Keeper.',`אדון אפל בשם Lord Grabb פתח את ממלכת המבחנים. השער נמצא ליד הגביש 🌀. הפרק הבא: ${CHAPTERS[s.ch].he}. ואם נתקעים, כותבים ל־Keeper באנגלית 📨`,'<button class="btn sun" data-a="lgportal">🌀 לשער</button>')};
ACTX.lgportal=()=>{closeSheet();enterLegend()};
const _objL=objective;objective=function(){const s=LGS();if(s.ch>7)return'🌈 האגדה הושלמה! שומרים על האור';if(s.ch>=4)return`🌀 ${CHAPTERS[s.ch].he}: נכנסים לשער שליד הגביש`;return _objL()};
const _umm=updateMoshMark;updateMoshMark=function(){_umm();if(MOSH&&ST().ch>=4)MOSH.userData.mk.visible=ST().ch<=7&&ME.zone==='island'&&!LG.active&&!PORTAL};
const _stepStoryL=stepStory;stepStory=function(dt,t){_stepStoryL(dt,t);stepLegend(dt,t)};
function stepLegend(dt,t){if(PORTAL){PORTAL.userData.ring.rotation.z+=dt;if(ME.zone==='island'&&$('#sheet').hidden&&Math.hypot(ME.pos.x-PORTAL.position.x,ME.pos.z-PORTAL.position.z)<.9)enterLegend()}
  if(LGW){LGW.back.userData.ring.rotation.z-=dt}if(!LG.active)return;LG.t+=dt;if(ME.zone!=='legend'){lgEnd(false,true);return}if(!$('#sheet').hidden)return;
  LG.cd=Math.max(0,LG.cd-dt);LG.inv=Math.max(0,LG.inv-dt);if(ME.obj&&LG.inv>0)ME.obj.visible=Math.floor(LG.t*12)%2===0;else if(ME.obj)ME.obj.visible=true;
  stepShots(dt);for(const e of LG.ents)if(!e.dead&&e.up)e.up(dt);LG.ents=LG.ents.filter(e=>!e.dead);LG.fx=LG.fx.filter(f=>{const k=f.up(dt);if(!k&&f.o.parent)scene.remove(f.o);return k});
  if(!LG.active)return;(LGCH[LG.ch].step||(()=>{}))(dt);if(LG.ch!==5&&MPL.length){MPL.forEach(p=>{const i=PLATS.indexOf(p);if(i>=0)PLATS.splice(i,1)});MPL.length=0}}
const _lgCleanup0=lgCleanup;lgCleanup=function(){_lgCleanup0();MPL.forEach(p=>{const i=PLATS.indexOf(p);if(i>=0)PLATS.splice(i,1)});MPL.length=0;if(ME.obj)ME.obj.visible=true;
  for(let i=EXTRA_PICK.length-1;i>=0;i--)if(EXTRA_PICK[i].userData&&EXTRA_PICK[i].userData.talker==='Shapeling')EXTRA_PICK.splice(i,1)};
Object.assign(LGCH,{4:{start:startWell,step:stepWell,at:[0,-5],topic:TOPIC[4]},5:{start:startMountain,step:stepMountain,at:[6,4],topic:TOPIC[5]},6:{start:startGold,at:[-5,5],topic:TOPIC[6]},7:{start:startBoss,at:[0,10],hp:5,topic:TOPIC[7]}});
(function startLegend(){placePortal()})();
/* safety: never let a bad number break the camera */
const _stepCamL=stepCamera;stepCamera=function(dt){if(!isFinite(ME.y))ME.y=0;if(!isFinite(CAM.ty))CAM.ty=0;if(ME.zone==='legend'&&Math.hypot(ME.pos.x-ZC.legend[0],ME.pos.z-ZC.legend[1])>RL){ME.pos.x=ZC.legend[0];ME.pos.z=ZC.legend[1]+12}return _stepCamL(dt)};
