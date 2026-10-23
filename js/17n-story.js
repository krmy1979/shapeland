/* Shapeland · a world by Shirel Yitzhak */
/* ===================== THE LEGEND OF SHAPELAND =====================
   The Great Shaper made many worlds only to give good. In Shapeland every shape holds a spark, and the Crystal of Unity joined them all.
   The creatures did not understand why they were made and cried "Mine! Mine!" — the Crystal broke into seven shards and the Mine-Fog spread.
   Messengers came, but nobody listened. Then a basket floated to your shore: Mosh, the boy drawn from the water, whose words are heavy —
   so YOU are his voice. Every act of kindness brings back light (✨). Together the shards are found, and Shapeland shines again.
   (The wise will slowly notice which very old book this legend is built on.) */
function ST(){if(!P.story||typeof P.story!=='object')P.story={ch:0,step:0,light:0,k:0,echo:[],ming:0,shards:0,met:{},intro:0,acts:[]};return P.story}
const CHAPTERS=[
  {en:'The Fading',he:'הדהייה',em:'🌫️'},
  {en:'Drawn from the Water',he:'המָּשׁוּי מן המים',em:'🧺'},
  {en:'Echoes of the Messengers',he:'הד השליחים',em:'🦉'},
  {en:'The Mine-Fog',he:'ערפל ה״שלי״',em:'👾'},
  {en:'The Bitter Well',he:'הבאר המרה',em:'🪣',soon:1},
  {en:'The Mountain of Shapes',he:'הר הצורות',em:'⛰️',soon:1},
  {en:'The Golden Shape',he:'צורת הזהב',em:'🟨',soon:1},
  {en:'Together',he:'ביחד',em:'🤝',soon:1}];
const SHARDC=['#F43F5E','#F97316','#FACC15','#22C55E','#3B82F6','#8B5CF6','#EC4899'];

/* ---------- the storybook (intro) ---------- */
const INTRO=[
  ['✨','בהתחלה היה רק אור. ה־Shaper, היוצר הגדול, רצה דבר אחד: לתת טוב.','In the beginning there was only light. The Great Shaper wanted only one thing: to give good.'],
  ['🌌','הוא יצר עולמות רבים: עולם האור, עולם הים, עולם האבן ועולם הרוח. ובאחד מהם, הקטן והצבעוני מכולם, יצר את ארץ הצורות.','He shaped many worlds. And one small, colorful world: Shapeland.'],
  ['💎','בכל צורה הוא הטמין ניצוץ קטן של אור. ובלב הארץ הניח את גביש האחדות, שחיבר את כולם יחד.','In every shape he hid a little spark. And in the heart of the land he placed the Crystal of Unity.'],
  ['😠','אבל הברואים לא הבינו למה נבראו. כל אחד חטף צורות וצעק: "שלי! שלי!"','But the creatures did not understand why they were made. Everyone grabbed and shouted: Mine! Mine!'],
  ['💔','הגביש נסדק ונשבר לשבעה רסיסים. הצבעים התחילו לדהות, וערפל ה״שלי״ התפשט על הארץ.','The Crystal broke into seven shards. The colors faded, and the Mine-Fog spread.'],
  ['🦉','היוצר שלח שליחים: ינשוף חכם, שומר הים, וכוכב מהשמיים. הם גילו את הסוד, אבל אף אחד לא הקשיב.','The Shaper sent messengers. They told the secret, but nobody listened.'],
  ['🧺','ואז, ביום סוער אחד, סל קטן צף אל החוף של האי שלך…','And then, one stormy day, a small basket floated to the shore of your island…']];
const SB={i:0};
ACTX.story=()=>{const s=ST();if(!s.intro){SB.i=0;storyPage();return}openBook()};
ACTX.sbnext=()=>{SB.i++;if(SB.i>=INTRO.length){const s=ST();s.intro=1;if(s.ch<1){s.ch=1;s.step=0;s.k=0}save();closeSheet();renderQuestChip();toast('🧺 משהו צף אל החוף של האי… הולכים לראות!');say('Go to the beach of your island!');placeMosh();return}storyPage()};
ACTX.sbback=()=>{SB.i=Math.max(0,SB.i-1);storyPage()};
function storyPage(){PANEL='storybook';const[em,he,enl]=INTRO[SB.i];
  sheet(`<div class="sbook"><div class="sbart">${em}</div><p class="sbhe">${he}</p><div class="bubble" style="font-size:15px">${en(enl)}</div>
  <div class="row"><button class="spk" data-a="sayt" data-t="${esc(enl)}">🔊</button>${SB.i?'<button class="btn ghost mini" data-a="sbback">◀</button>':''}<button class="btn sun" data-a="sbnext">${SB.i<INTRO.length-1?'הבא ▶':'🧺 ללכת לחוף!'}</button></div>
  <p class="sub" style="text-align:center">${SB.i+1} / ${INTRO.length} · ${en('The Legend of Shapeland')}</p></div>`);say(enl)}

/* ---------- kindness = light ---------- */
function kind(n,why){const s=ST();s.light+=n;if(s.ch===1&&s.step===1)s.k+=1;s.acts.unshift({t:Date.now(),n,why});s.acts=s.acts.slice(0,12);save();
  floatText('✨ +'+n+' '+(why||''),'#FDE68A');if(ME.obj)fxBurst(ME.pos.x,ME.y+1.8,ME.pos.z,'#FDE68A',10,1.4);if(AU.on)tone(1046,.12,'sine',.06,null,null,.01,1568);
  if(s.ch===1&&s.step===1&&s.k>=3){s.step=2;save();setTimeout(()=>{toast('✨✨✨ שלושה מעשים טובים! חוזרים ל־Mosh בחוף');say('Three sparks! Go back to Mosh.')},900)}renderQuestChip();updateMoshMark()}
const KINDRE=[[/Mrs\. Kim|רשימת קניות/,2,'עזרת ל־Mrs. Kim'],[/Hero job|גיבור\/ה להשכרה/,2,'עזרת לעיר'],[/Hero pay|שכר גיבור/,3,'עזרת לחבר/ה'],[/Fire Rescue|Lifeguard Rescue|Catch the Raccoon/,2,'הצלת את העיר'],[/Tour|תייר/,1,'עזרת לתיירים']];
const _logmS=logm;logm=function(he,enw,a){_logmS(he,enw,a);const s=(he||'')+' '+(enw||'');const m=KINDRE.find(([re])=>re.test(s));if(m&&a>0)kind(m[1],m[2])};
if(ACTX.hserve){const _hs=ACTX.hserve;ACTX.hserve=d=>{const b=P.badges.host;_hs(d);if(P.badges.host>b)kind(3,'אירחת חברים')}}
if(ACTX.guserve){const _gs=ACTX.guserve;ACTX.guserve=()=>{const b=P.badges.host;_gs();if(P.badges.host>b)kind(1,'אירחת אורח')}}

/* ---------- Mosh, the boy drawn from the water ---------- */
const MOSH_CH={g:'boy',hair:'messy',hc:'#3B2A1E',skin:'#B9875F',top:'#E7D7B5',bot:'pants',bc:'#8B6B4A'};
let MOSH=null;
function placeMosh(){if(MOSH)return;const d=human3D(Object.assign({kind:'human',eyes:'happy'},MOSH_CH));
  const st=mesh(new THREE.CylinderGeometry(.05,.06,2,8),mat('#7C4A2D'));st.position.set(.55,1,.1);d.add(st);const gem=mesh(new THREE.OctahedronGeometry(.13),mat('#FDE68A',{emissive:'#FACC15',emissiveIntensity:.7}));gem.position.set(.55,2.05,.1);d.add(gem);
  const bk=new THREE.Group();const b0=mesh(new THREE.CylinderGeometry(.45,.35,.35,14,1,true),mat('#C08A4B'));b0.position.y=.18;bk.add(b0);const b1=mesh(new THREE.CylinderGeometry(.35,.35,.04,14),mat('#A16207'));b1.position.y=.02;bk.add(b1);bk.position.set(-.9,0,.4);d.add(bk);
  const lb=label('Mosh 🧺','#7C4A2D','#FFFFFF',.45);lb.position.y=2.55;d.add(lb);const mk=marker('❗','#F59E0B');mk.position.y=3.15;d.add(mk);d.userData.mk=mk;
  d.position.set(3.2,0,12.2);d.lookAt(0,0,3);scene.add(d);rootify(d);d.userData.zact=()=>talkMosh();d.userData.talker='Mosh';EXTRA_PICK.push(d);MOSH=d;updateMoshMark()}
function updateMoshMark(){if(!MOSH)return;const s=ST();MOSH.userData.mk.visible=s.ch===1&&(s.step===0||s.step===2)||s.ch===2&&s.step===0||s.ch===2&&s.echo.length>=3||s.ch===3&&(s.step===0||s.ming>=5)||s.ch===4&&!s.saw4}
const moshHead=()=>`<div class="npchead"><div class="face" style="background:#FEF3C7">${humanSVG(Object.assign({kind:'human'},MOSH_CH))}</div><div class="grow"><h2>${en('Mosh')}</h2><p class="sub">המשוי מן המים 🧺 · ✨ ${ST().light}</p></div>${gemTag()}</div>`;
function moshSay(enl,he,btns){PANEL='mosh';sheet(`${moshHead()}<div class="bubble">${en(enl)}</div><p class="sub">${he}</p><div class="row"><button class="spk" data-a="sayt" data-t="${esc(enl)}">🔊</button>${btns||''}</div>`);say(enl)}
function talkMosh(){const s=ST();
  if(!s.intro){SB.i=0;storyPage();return}
  if(s.ch===1&&s.step===0){moshSay("H-h-hello… They call me Mosh, because I was drawn out of the water. My words are heavy… Will you be my voice?",'שלום… קוראים לי Mosh, כי משו אותי מן המים. קשה לי לדבר… תהיי את הקול שלי?','<button class="btn sun" data-a="moshyes">💛 '+en('Yes, I will!')+'</button>');return}
  if(s.ch===1&&s.step===1){moshSay(`The Shaper made the world to give good. But only a giver can hold the good. Light ${3-s.k} more sparks of kindness!`,`היוצר ברא את העולם כדי לתת טוב. אבל רק מי שנותן בעצמו יכול להחזיק את הטוב. נשארו ${3-s.k} מעשים טובים. איך? מארחים חברים 🎉, עוזרים ל־Mrs. Kim 🛒, גיבור/ה להשכרה 🦸, משימות הצלה 🚒.`,'<button class="btn ghost" data-a="book">📜 הספר</button>');return}
  if(s.ch===1&&s.step===2){s.shards=Math.max(s.shards,1);s.ch=2;s.step=0;save();shardFx(0);
    moshSay('Look! The first shard is shining again! When we are good to each other, the light comes back.','תראי! הרסיס הראשון של גביש האחדות זוהר שוב! כשאנחנו טובים זה לזה, האור חוזר. ✨ פרק 1 הושלם!','<button class="btn sun" data-a="moshnext">▶ '+en('What now?')+'</button>');return}
  if(s.ch===2&&s.step===0){s.step=1;save();placeEchoes();moshSay('Long ago, three messengers left their words inside glowing stones. Find the three echoes and listen!','לפני הרבה זמן, שלושה שליחים השאירו את המילים שלהם בתוך אבנים זוהרות. מוצאים את שלושת ההדים ומקשיבים: אחד בגן הלאומי באשקלון, אחד בחוף ליד המציל, ואחד ליד המזרקה הוורודה בגן הבנות.','<button class="btn ghost" data-a="map">🗺️ מפה</button>');return}
  if(s.ch===2&&s.step===1&&s.echo.length<3){moshSay(`You found ${s.echo.length} of 3 echoes. Keep looking!`,`מצאת ${s.echo.length} מתוך 3 הדים. אחד בגן הלאומי (העמודים העתיקים), אחד בחוף ליד המציל, אחד ליד המזרקה הוורודה.`);return}
  if(s.ch===2){s.shards=Math.max(s.shards,2);s.ch=3;s.step=0;save();shardFx(1);
    moshSay('Be kind. Go together. Give what you love. The messengers said it again and again… Now we must carry it to everyone.','"היו טובים. לכו יחד. תנו את מה שאתם אוהבים." השליחים אמרו את זה שוב ושוב… עכשיו אנחנו צריכים להביא את זה לכולם. ✨ הרסיס השני זוהר!','<button class="btn sun" data-a="moshnext">▶ '+en('What now?')+'</button>');return}
  if(s.ch===3&&s.step===0){s.step=1;s.ming=0;save();spawnMinelings();moshSay("Oh no! Minelings! They grab everything and shout 'Mine!'. They are not bad… they are empty. Give them a gift, and they will learn to give.",'אוי! Minelings! הם חוטפים הכול וצועקים "שלי!". הם לא רעים… הם ריקים. נותנים להם מתנה (1 💎), והם לומדים לתת. רודפים אחריהם באי ונוגעים בהם מקרוב!');return}
  if(s.ch===3&&s.ming<5){moshSay(`${5-s.ming} Minelings are still empty. Chase them and give them a gift!`,`עוד ${5-s.ming} Minelings ריקים באי. רודפים אחריהם ונותנים מתנה 🎁`);if(!MING.length)spawnMinelings();return}
  if(s.ch===3){s.shards=Math.max(s.shards,3);s.ch=4;s.step=0;save();shardFx(2);
    moshSay('The Minelings are sharing now! Three shards shine. But the journey is long… Next: the Bitter Well.','ה־Minelings משתפים עכשיו! שלושה רסיסים זוהרים. אבל הדרך עוד ארוכה… הפרק הבא: הבאר המרה. 🪣','<button class="btn" data-a="book">📜 הספר</button>');return}
  s.saw4=1;save();updateMoshMark();moshSay('The next part of the legend is coming soon. Until then, keep the light: be good to each other!','החלק הבא של האגדה יגיע בקרוב. בינתיים שומרים על האור: עוזרים, מארחים, משתפים. כל מעשה טוב מוסיף ✨','<button class="btn" data-a="book">📜 הספר</button>')}
ACTX.moshyes=()=>{const s=ST();s.step=1;s.k=0;save();renderQuestChip();updateMoshMark();sfx.win();burst('💛');
  moshSay('Thank you, friend! Together we will bring the light back to Shapeland.','תודה, חברה! ביחד נחזיר את האור לארץ הצורות. המשימה הראשונה: 3 מעשים טובים ✨ (מארחים חברים, עוזרים ל־Mrs. Kim, גיבור/ה להשכרה, משימות הצלה).','<button class="btn ghost" data-a="close">יאללה!</button>')};
ACTX.moshnext=()=>talkMosh();ACTX.book=()=>openBook();

/* ---------- the Crystal of Unity on the island ---------- */
let CRYS=null;
(()=>{const g=new THREE.Group();const base=mesh(new THREE.CylinderGeometry(1.1,1.3,.5,8),mat('#E7E5E4'));base.position.y=.25;g.add(base);const top=mesh(new THREE.CylinderGeometry(.9,1,.15,8),mat('#D6D3D1'));top.position.y=.57;g.add(top);
  const core=mesh(new THREE.OctahedronGeometry(.45),mat('#E0F2FE',{emissive:'#93C5FD',emissiveIntensity:.15,transparent:true,opacity:.85}));core.position.y=1.35;g.add(core);
  const shards=SHARDC.map((c,i)=>{const a=i/7*Math.PI*2;const m=mesh(new THREE.OctahedronGeometry(.16),mat('#9CA3AF',{transparent:true,opacity:.5}));m.position.set(Math.cos(a)*.75,1.1,Math.sin(a)*.75);m.scale.y=1.6;g.add(m);return m});
  const lb=label('Crystal of Unity 💎','#1D2A48','#FFFFFF',.4);lb.position.y=2.35;g.add(lb);g.position.set(-3.2,0,6.6);scene.add(g);rootify(g);g.userData.zact=()=>openBook();EXTRA_PICK.push(g);
  CRYS={g,core,shards};paintShards()})();
function paintShards(){const n=ST().shards;CRYS.shards.forEach((m,i)=>{m.material=i<n?mat(SHARDC[i],{emissive:SHARDC[i],emissiveIntensity:.8}):mat('#9CA3AF',{transparent:true,opacity:.45})});CRYS.core.material=mat('#E0F2FE',{emissive:'#FDE68A',emissiveIntensity:.15+n*.12,transparent:true,opacity:.9})}
function shardFx(i){paintShards();sfx.win();burst(`<span style="color:${SHARDC[i]}">💎</span> ${CHAPTERS[i+1].he}`);if(typeof shake==='function')shake(.2,.4);
  if(ME.zone==='island')fxBurst(CRYS.g.position.x,1.5,CRYS.g.position.z,SHARDC[i],30,3);addXp(40);addGems(10,'רסיס של גביש האחדות','Crystal shard');renderQuestChip();updateMoshMark()}

/* ---------- chapter 2: echo stones ---------- */
const ECHOES=[
  {id:'owl',em:'🦉',he:'הד הינשוף',x:CX+2.5,z:CZ+15,zone:'city',where:'הגן הלאומי',msg:'Be kind to each other, and the light will stay with you.',q:'What did the owl say?',opts:['Be kind to each other','Be the first','Keep everything'],a:0,mhe:'"היו טובים זה לזה, והאור יישאר איתכם."'},
  {id:'sea',em:'🌊',he:'הד שומר הים',x:CX-18.5,z:CZ+3.5,zone:'city',where:'החוף ליד המציל',msg:'A river is strong because many drops go together.',q:'Why is a river strong?',opts:['Many drops go together','It is very cold','It is fast'],a:0,mhe:'"נהר חזק כי הרבה טיפות הולכות יחד."'},
  {id:'star',em:'⭐',he:'הד הכוכב',x:-7,z:-174,zone:'girls',where:'המזרקה הוורודה',msg:'What you love for yourself, give to others too.',q:'What should you give to others?',opts:['What you love for yourself','Nothing','Only old things'],a:0,mhe:'"את מה שאת אוהבת לעצמך, תני גם לאחרים."'}];
const ECHOOBJ={};
function placeEchoes(){const s=ST();ECHOES.forEach(e=>{if(ECHOOBJ[e.id]||s.echo.includes(e.id))return;const g=new THREE.Group();const st=mesh(new THREE.DodecahedronGeometry(.55),mat('#A5B4FC',{emissive:'#818CF8',emissiveIntensity:.6}));st.position.y=.6;g.add(st);
  const glow=mesh(new THREE.SphereGeometry(1,14,10),mat('#C7D2FE',{transparent:true,opacity:.18,emissive:'#C7D2FE',emissiveIntensity:.5}),false);glow.position.y=.7;g.add(glow);const lb=label(e.em+' echo','#4338CA','#FFFFFF',.38);lb.position.y=1.7;g.add(lb);
  g.position.set(e.x,0,e.z);scene.add(g);rootify(g);g.userData.zact=()=>openEcho(e);EXTRA_PICK.push(g);ECHOOBJ[e.id]=g})}
function openEcho(e){const d=Math.hypot(ME.pos.x-e.x,ME.pos.z-e.z);if(d>7){toast('✨ צריך ללכת עד האבן הזוהרת כדי לשמוע את ההד');return}PANEL='echo';
  sheet(`<h2>${e.em} ${e.he} · ${en('Echo')}</h2><div class="bubble">${en(e.msg)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(e.msg)}">🔊</button></div>
  <h3>${en(e.q)}</h3><div class="opts">${e.opts.map((o,i)=>`<button class="opt" data-a="echoans" data-v="${e.id}" data-i="${i}">${en(o)}</button>`).join('')}</div>`);say(e.msg)}
ACTX.echoans=d=>{const e=ECHOES.find(x=>x.id===d.v);if(!e)return;if(+d.i!==e.a){sfx.bad();learnResult('listen',false);toast('מקשיבים שוב להד 🔊');say(e.msg);return}
  const s=ST();if(!s.echo.includes(e.id))s.echo.push(e.id);learnResult('listen',true);save();const g=ECHOOBJ[e.id];if(g){fxBurst(g.position.x,1,g.position.z,'#A5B4FC',24,2.5);scene.remove(g);const i=EXTRA_PICK.indexOf(g);if(i>=0)EXTRA_PICK.splice(i,1);delete ECHOOBJ[e.id]}
  kind(1,'הקשבת לשליח');sfx.win();PANEL='echodone';sheet(`<h2>${e.em} ✓</h2><p style="font-size:18px;text-align:center">${e.mhe}</p><p class="sub">${s.echo.length<3?`מצאת ${s.echo.length} מתוך 3 הדים.`:'מצאת את כל ההדים! חוזרים ל־Mosh בחוף של האי 🧺'}</p><button class="btn ghost" data-a="close">סגירה</button>`);renderQuestChip();updateMoshMark()};

/* ---------- chapter 3: Minelings ---------- */
const MING=[];
function spawnMinelings(){const s=ST();const need=5-s.ming;while(MING.length<need){const g=new THREE.Group();const body=mesh(new THREE.SphereGeometry(.42,14,10),mat('#6B7280'));body.position.y=.5;body.scale.y=.9;g.add(body);
    [-1,1].forEach(k=>{const e=mesh(new THREE.SphereGeometry(.1,8,6),mat('#FFFFFF'));e.position.set(k*.15,.62,.36);g.add(e);const p=mesh(new THREE.SphereGeometry(.05,6,4),mat('#111827'));p.position.set(k*.15,.6,.45);g.add(p);
      const arm=mesh(new THREE.CylinderGeometry(.04,.04,.4,6),mat('#6B7280'));arm.position.set(k*.45,.6,0);arm.rotation.z=k*.9;g.add(arm)});
    const lb=label('Mine! 😠','#374151','#FFFFFF',.32);lb.position.y=1.25;g.add(lb);const a=Math.random()*Math.PI*2,r=3+Math.random()*7;g.position.set(Math.cos(a)*r,0,Math.sin(a)*r);scene.add(g);rootify(g);
    const m={g,body,lb,vx:0,vz:0,t:Math.random()*3,happy:0};g.userData.zact=()=>giftMineling(m);g.userData.talker='Mineling';EXTRA_PICK.push(g);MING.push(m)}}
function giftMineling(m){if(m.happy)return;const d=Math.hypot(ME.pos.x-m.g.position.x,ME.pos.z-m.g.position.z);if(d>3.6){toast('🏃 מתקרבים ל־Mineling ואז נוגעים בו');return}
  if(P.gems<1){toast('צריך 1 💎 בשביל מתנה');return}P.gems-=1;logm('מתנה ל־Mineling','Gift',-1);renderHud();m.happy=1;m.body.material=mat('#F472B6',{emissive:'#F9A8D4',emissiveIntensity:.5});
  m.g.remove(m.lb);const lb=label('Thank you! 💛','#DB2777','#FFFFFF',.32);lb.position.y=1.25;m.g.add(lb);fxBurst(m.g.position.x,1,m.g.position.z,'#F472B6',22,2.2);sfx.coin();say('Thank you! Now I want to share too!');
  const s=ST();s.ming++;save();kind(2,'נתת מתנה');if(s.ming>=5)setTimeout(()=>{toast('👾💛 כל ה־Minelings משתפים! חוזרים ל־Mosh');say('All the Minelings are happy! Go back to Mosh.')},1200)}
function stepMing(dt,t){for(let i=MING.length-1;i>=0;i--){const m=MING[i],g=m.g;
  if(m.happy){m.happy+=dt;g.position.y+=dt*1.6;g.rotation.y+=dt*4;if(m.happy>2.2){scene.remove(g);const j=EXTRA_PICK.indexOf(g);if(j>=0)EXTRA_PICK.splice(j,1);MING.splice(i,1)}continue}
  if(ME.zone!=='island')continue;m.t-=dt;const dx=g.position.x-ME.pos.x,dz=g.position.z-ME.pos.z,d=Math.hypot(dx,dz);
  if(d<4.5){const sp=2.6;m.vx=dx/d*sp;m.vz=dz/d*sp}else if(m.t<=0){m.t=1+Math.random()*2;const a=Math.random()*Math.PI*2;m.vx=Math.cos(a)*1.2;m.vz=Math.sin(a)*1.2}
  let nx=g.position.x+m.vx*dt,nz=g.position.z+m.vz*dt;if(Math.hypot(nx,nz)>12){nx=g.position.x-m.vx*dt*2;nz=g.position.z-m.vz*dt*2;m.vx*=-1;m.vz*=-1}
  g.position.x=nx;g.position.z=nz;g.position.y=Math.abs(Math.sin(t*8+i))*.18;g.rotation.y=Math.atan2(m.vx,m.vz)}}

/* ---------- visitors from other worlds ---------- */
const BEINGS=[
  {id:'lumin',en:'Lumin',he:'לוּמִין',world:'עולם האור',em:'🌟',c:'#FEF9C3',e:'#FDE047',line:'I come from the World of Light. Your island shines a little more every day!',he2:'אני בא מעולם האור. האי שלך זוהר קצת יותר בכל יום!'},
  {id:'coral',en:'Coralian',he:'קוֹרָלִי',world:'עולם הים',em:'🐚',c:'#67E8F9',e:'#06B6D4',line:'In the Sea World we swim together, like one big fish.',he2:'בעולם הים שוחים יחד, כמו דג אחד גדול.'},
  {id:'stone',en:'Stonekin',he:'בן־אבן',world:'עולם האבן',em:'🪨',c:'#A8A29E',e:'#78716C',line:'In the Stone World, many small stones make one strong mountain.',he2:'בעולם האבן, הרבה אבנים קטנות עושות הר אחד חזק.'},
  {id:'wind',en:'Windling',he:'רוּחִי',world:'עולם הרוח',em:'🌬️',c:'#F1F5F9',e:'#BAE6FD',line:'The wind carries kind words to all the worlds.',he2:'הרוח נושאת מילים טובות לכל העולמות.'}];
const VIS={o:null,b:null,t:0,next:60};
function spawnBeing(){const b=pick(BEINGS);const g=new THREE.Group();let body;
  if(b.id==='stone'){body=mesh(new THREE.DodecahedronGeometry(.55),mat(b.c));body.position.y=.6;g.add(body);const hd=mesh(new THREE.DodecahedronGeometry(.32),mat(b.e));hd.position.y=1.35;g.add(hd)}
  else if(b.id==='coral'){body=mesh(new THREE.CylinderGeometry(.3,.45,1.1,12),mat(b.c));body.position.y=.65;g.add(body);const fin=mesh(new THREE.ConeGeometry(.25,.5,3),mat(b.e));fin.position.y=1.4;g.add(fin)}
  else{body=mesh(new THREE.SphereGeometry(.5,16,12),mat(b.c,{emissive:b.e,emissiveIntensity:b.id==='lumin'?.8:.2,transparent:b.id==='wind',opacity:.85}));body.position.y=1.1;g.add(body);if(b.id==='lumin'){const h=mesh(new THREE.TorusGeometry(.42,.04,8,24),mat('#FDE047',{emissive:'#FDE047',emissiveIntensity:1}));h.rotation.x=Math.PI/2;h.position.y=1.75;g.add(h)}}
  [-1,1].forEach(k=>{const e=mesh(new THREE.SphereGeometry(.08,8,6),mat('#111827'));e.position.set(k*.16,b.id==='stone'?1.4:b.id==='coral'?.95:1.2,.42);g.add(e)});
  const lb=label(b.em+' '+b.en,'#1D2A48','#FFFFFF',.38);lb.position.y=2.2;g.add(lb);const a=Math.random()*Math.PI*2;g.position.set(clamp(ME.pos.x+Math.cos(a)*5,-10,10),0,clamp(ME.pos.z+Math.sin(a)*5,-10,10));scene.add(g);rootify(g);
  g.userData.zact=()=>talkBeing();g.userData.talker=b.en;EXTRA_PICK.push(g);VIS.o=g;VIS.b=b;VIS.t=120;fxBurst(g.position.x,1,g.position.z,b.e,26,2.6);sfx.pop();toast(`${b.em} מישהו הגיע מ${b.world}!`)}
function removeBeing(){if(!VIS.o)return;fxBurst(VIS.o.position.x,1,VIS.o.position.z,VIS.b.e,18,2);scene.remove(VIS.o);const i=EXTRA_PICK.indexOf(VIS.o);if(i>=0)EXTRA_PICK.splice(i,1);VIS.o=null;VIS.b=null;VIS.next=200+Math.random()*120}
function talkBeing(){const b=VIS.b;if(!b)return;const s=ST();const first=!s.met[b.id];s.met[b.id]=(s.met[b.id]||0)+1;save();PANEL='being';
  if(first){addGems(3,'מתנה מ'+b.world,'Visitor gift');kind(1,'פגשת ישות חדשה')}
  sheet(`<div class="npchead"><div class="face" style="background:${b.c}">${b.em}</div><div class="grow"><h2>${en(b.en)}</h2><p class="sub">${b.he} · מ${b.world}</p></div>${gemTag()}</div>
  <div class="bubble">${en(b.line)}</div><p class="sub">${b.he2}${first?' 🎁 קיבלת מתנה: 3 💎':''}</p><div class="row"><button class="spk" data-a="sayt" data-t="${esc(b.line)}">🔊</button><button class="btn" data-a="byebeing">👋 ${en('Goodbye, friend!')}</button></div>`);say(b.line)}
ACTX.byebeing=()=>{closeSheet();say('Goodbye!');VIS.t=Math.min(VIS.t,1.2)};

/* ---------- the Book of Shapeland ---------- */
const PAGES=[
  {ch:0,em:'✨',t:'היוצר הגדול',en:'The Great Shaper',txt:'לפני הכול היה רק אור. היוצר רצה דבר אחד: לתת טוב לברואים שלו. בשביל זה יצר אותם.',wise:'יש ספר עתיק מאוד. המילה הראשונה בו פירושה "בהתחלה".'},
  {ch:0,em:'🌌',t:'עולמות רבים',en:'Many Worlds',txt:'ארץ הצורות היא רק עולם אחד מתוך רבים: עולם האור, עולם הים, עולם האבן ועולם הרוח. לפעמים ישויות מהעולמות האחרים באות לבקר.',wise:'יש חכמים שאמרו: לפני העולם הזה נבראו ונחרבו עולמות רבים.'},
  {ch:0,em:'💔',t:'השבירה',en:'The Breaking',txt:'הברואים לא הבינו למה נבראו, וכל אחד צעק "שלי!". גביש האחדות נשבר לשבעה רסיסים, וניצוצות האור התפזרו בכל הארץ.',wise:'יש חכמים שסיפרו על כלים של אור שנשברו, ועל כך שתפקידנו לאסוף בחזרה את הניצוצות.'},
  {ch:1,em:'🦉',t:'השליחים',en:'The Messengers',txt:'היוצר שלח שליחים שיגלו את הסוד: היו טובים זה לזה. אבל אף אחד לא הקשיב להם.',wise:'בספר העתיק קוראים לשליחים כאלה "נביאים".'},
  {ch:1,em:'🧺',t:'המשוי מן המים',en:'Drawn from the Water',txt:'ביום סוער צף סל אל החוף, ובו ילד. קראו לו Mosh, כי משו אותו מן המים. קשה לו לדבר, ולכן הוא צריך אותך: את הקול שלו.',wise:'בספר העתיק יש תינוק בתיבה שצפה על היאור. בת המלך משתה אותו מן המים, ולכן נתנה לו את שמו… מי זה?'},
  {ch:2,em:'💛',t:'הדרך של הנתינה',en:'The Way of Giving',txt:'רק מי שנותן בעצמו יכול להחזיק את הטוב. כשעוזרים, מארחים ומשתפים, האור חוזר לארץ.',wise:'חכם גדול אמר למי שרצה ללמוד את כל התורה על רגל אחת: "מה ששנוא עליך, אל תעשה לחברך". והשאר? "צא ולמד".'},
  {ch:3,em:'👾',t:'ה־Minelings',en:'The Minelings',txt:'הם לא רעים, הם ריקים. מי שמקבל מתנה באהבה לומד לתת בעצמו.',wise:'"ואהבת לרעך כמוך". איפה זה כתוב?'},
  {ch:4,em:'🤝',t:'ביחד',en:'Together',txt:'הרסיס האחרון נמצא רק כשכולם יחד. אף אחד לא יכול להשלים את הגביש לבד.',wise:'"כאיש אחד בלב אחד". מתי העם היה כך?'}];
function openBook(){const s=ST();PANEL='book';const met=BEINGS.filter(b=>s.met[b.id]);
  sheet(`<div class="npchead"><div class="face" style="background:#FEF3C7">📜</div><div class="grow"><h2>${en('The Book of Shapeland')}</h2><p class="sub">ספר ארץ הצורות · ✨ ${s.light} אור · 💎 ${s.shards}/7 רסיסים</p></div></div>
  <div class="chaps">${CHAPTERS.slice(1).map((c,i)=>{const n=i+1;const done=s.shards>=n,cur=s.ch===n&&!c.soon;return`<div class="chap ${done?'done':cur?'cur':''}"><span class="sh" style="background:${done?SHARDC[i]:'#E5E7EB'}">${done?'💎':c.soon?'🔒':cur?'▶':'·'}</span><b>${c.em} ${c.he}</b>${en(c.en)}${c.soon&&!done?'<small>בקרוב</small>':''}</div>`}).join('')}</div>
  <h3>🎯 עכשיו</h3><p class="sub">${objective()}</p>
  <details ${s.ch<=1?'open':''}><summary>📖 האגדה</summary>${PAGES.filter(p=>p.ch<=Math.max(0,s.ch-1)).map(p=>`<div class="page"><b>${p.em} ${p.t}</b> ${en(p.en)}<p>${p.txt}</p><p class="wise">🦉 לחכמים: ${p.wise}</p></div>`).join('')}</details>
  <details><summary>🌌 ישויות שפגשת (${met.length}/${BEINGS.length})</summary>${met.length?met.map(b=>`<p>${b.em} <b>${b.he}</b> ${en(b.en)} · ${b.world}</p>`).join(''):'<p class="sub">ישויות מעולמות אחרים מגיעות לאי כשיש בו מספיק אור ✨</p>'}</details>
  <details><summary>✨ מעשים טובים אחרונים</summary>${s.acts.length?s.acts.map(a=>`<p>✨ +${a.n} ${esc(a.why||'')}</p>`).join(''):'<p class="sub">עוד אין. כל עזרה, אירוח ושיתוף מוסיפים אור</p>'}</details>
  <div class="row"><button class="btn ghost mini" data-a="replayintro">🎬 הסיפור מההתחלה</button><button class="btn ghost" data-a="close">סגירה</button></div>`)}
ACTX.replayintro=()=>{SB.i=0;const s=ST();const was=s.intro;s.intro=0;storyPage();s.intro=was};
function objective(){const s=ST();if(!s.intro)return'📖 קוראים את תחילת האגדה';if(s.ch===1)return s.step===0?'🧺 הולכים לחוף של האי ומדברים עם Mosh':s.step===1?`✨ עושים מעשים טובים: ${s.k}/3`:'🧺 חוזרים ל־Mosh בחוף';
  if(s.ch===2)return s.step===0?'🧺 מדברים עם Mosh':s.echo.length<3?`🦉 מוצאים את הדים של השליחים: ${s.echo.length}/3`:'🧺 חוזרים ל־Mosh';
  if(s.ch===3)return s.step===0?'🧺 מדברים עם Mosh':s.ming<5?`👾 נותנים מתנה ל־Minelings באי: ${s.ming}/5`:'🧺 חוזרים ל־Mosh';return'💛 שומרים על האור: עוזרים, מארחים ומשתפים. הפרק הבא בקרוב'}

/* ---------- HUD chip, the loop, start ---------- */
const _rqcS=renderQuestChip;renderQuestChip=function(){_rqcS();const el=$('#questChip');if(!el||!P||!$('#title').hidden)return;const s=ST();
  el.insertAdjacentHTML('beforeend',`<button class="quest stq" data-a="story" style="margin-top:6px"><span>📜</span><span>${objective().slice(0,34)}</span><span>✨${s.light}</span></button>`)};
const _stepBS=stepBuilder;stepBuilder=function(dt,t){_stepBS(dt,t);try{stepStory(dt,t)}catch(e){}};
function stepStory(dt,t){const s=ST();if(MOSH){MOSH.userData.mk.position.y=3.15+Math.sin(t*3)*.08;if(MOSH.userData.rig&&typeof animLimbs==='function'){}}
  if(CRYS){CRYS.core.rotation.y+=dt*.8;CRYS.core.position.y=1.35+Math.sin(t*1.5)*.08;CRYS.shards.forEach((m,i)=>{m.rotation.y+=dt*(i<s.shards?2:.3)})}
  Object.values(ECHOOBJ).forEach(g=>{g.children[0].rotation.y+=dt;g.children[0].position.y=.6+Math.sin(t*2)*.1});
  stepMing(dt,t);
  if(VIS.o){VIS.t-=dt;VIS.o.position.y=Math.sin(t*2)*.15+(VIS.b&&VIS.b.id!=='stone'&&VIS.b.id!=='coral'?.3:0);VIS.o.rotation.y=Math.atan2(ME.pos.x-VIS.o.position.x,ME.pos.z-VIS.o.position.z);if(VIS.t<=0||ME.zone!=='island')removeBeing()}
  else if(s.shards>=1&&ME.zone==='island'&&$('#sheet').hidden){VIS.next-=dt;if(VIS.next<=0)spawnBeing()}}
(function startStory(){const s=ST();if(s.intro)placeMosh();if(s.ch===2&&s.step===1)placeEchoes();if(s.ch===3&&s.step===1&&s.ming<5)spawnMinelings();paintShards();
  const iv=setInterval(()=>{if(!$('#title').hidden||!$('#sheet').hidden)return;const s=ST();if(!s.intro&&ME.zone==='island'){clearInterval(iv);setTimeout(()=>{if($('#sheet').hidden){SB.i=0;storyPage()}},2500)}else if(s.intro)clearInterval(iv)},3000)})();
