/* Shapeland · a world by Shirel Yitzhak */
/* ===================== ACT II · THE PROMISE: the wanderer, the Twelve Lights, and the road to the Land of Light =====================
   Long before Mosh, a wanderer named Avram heard the Shaper: "Go to the land that I will show you." The land was promised to him
   and to his children: Tzahi, then Kobi — who wrestled all night and got a new name, Isra-el — and his twelve sons, the Twelve Lights.
   Only united do they shine. Josh the Brave leads them across the river into the Land of Light, against the Shadow Kings.
   Players choose a tribe, and choose whom to follow. (As before: the wise slowly recognise the very old book.) */
CHAPTERS.push(
  {en:'The Promise',he:'ההבטחה',em:'⭐'},{en:'The Twelve Lights',he:'שנים־עשר האורות',em:'🕯️'},{en:'The Twelve Scouts',he:'שנים־עשר המרגלים',em:'👣'},
  {en:'The River',he:'הנהר',em:'🌊'},{en:'The Walls of Shadow',he:'חומות הצל',em:'📯'},{en:'The Hidden Treasure',he:'האוצר המוסתר',em:'⛺'},{en:'The Sun Stands Still',he:'השמש עומדת',em:'☀️'});
const TRIBES=[
  {id:'lion',em:'🦁',en:'Lion',he:'שבט האריה',c:'#2563EB',perk:'heart',wise:'יהודה, "גור אריה"'},{id:'ox',em:'🐂',en:'Ox',he:'שבט השור',c:'#16A34A',perk:'heart',wise:'יוסף (אפרים ומנשה), "בכור שורו"'},
  {id:'tower',em:'🏰',en:'Tower',he:'שבט המגדל',c:'#15803D',perk:'heart',wise:'שמעון, והעיר שכם'},{id:'deer',em:'🦌',en:'Deer',he:'שבט האיילה',c:'#B45309',perk:'quick',wise:'נפתלי, "אילה שלוחה"'},
  {id:'wolf',em:'🐺',en:'Wolf',he:'שבט הזאב',c:'#7C3AED',perk:'quick',wise:'בנימין, "זאב יטרף"'},{id:'ship',em:'⛵',en:'Ship',he:'שבט הספינה',c:'#0EA5E9',perk:'quick',wise:'זבולון, "לחוף אניות"'},
  {id:'stones',em:'💠',en:'Shining Stones',he:'שבט האבנים הזוהרות',c:'#E11D48',perk:'shield',wise:'לוי, והחושן עם האבנים'},{id:'camp',em:'⛺',en:'Camp',he:'שבט המחנה',c:'#64748B',perk:'shield',wise:'גד, "גדוד יגודנו"'},
  {id:'scales',em:'⚖️',en:'Scales',he:'שבט המאזניים',c:'#0D9488',perk:'shield',wise:'דן, "דן ידין עמו"'},{id:'olive',em:'🫒',en:'Olive Tree',he:'שבט עץ הזית',c:'#65A30D',perk:'rich',wise:'אשר, "טובל בשמן רגלו"'},
  {id:'flower',em:'🌺',en:'Flower',he:'שבט הפרח',c:'#DC2626',perk:'rich',wise:'ראובן, והדודאים'},{id:'moon',em:'🌙',en:'Sun and Moon',he:'שבט השמש והירח',c:'#1E3A8A',perk:'rich',wise:'יששכר, "יודעי בינה לעיתים"'}];
const PERK={heart:'❤️ לב נוסף בכל מבחן',quick:'✨ אור מהיר יותר',shield:'🛡️ הגנה ארוכה אחרי פגיעה',rich:'💎 עוד 5 יהלומים על כל ניצחון'};
const myTribe=()=>TRIBES.find(t=>t.id===ST().tribe)||null;
PAGES.push(
  {ch:8,em:'⭐',t:'הנודד Avram',en:'Avram the Wanderer',txt:'לפני הרבה דורות, נודד בשם Avram שמע את קולו של היוצר: "לך אל הארץ שאראה לך". הוא יצא מביתו בלי לדעת לאן.',wise:'בספר העתיק: "לך לך מארצך וממולדתך ומבית אביך". מי שמע את זה?'},
  {ch:8,em:'🌌',t:'כוכבי השמיים',en:'The Stars of the Sky',txt:'"הבט השמימה וספור את הכוכבים. ככה יהיו ילדיך." הארץ הובטחה ל־Avram ולצאצאיו אחריו.',wise:'"וספור הכוכבים אם תוכל לספור אותם, כה יהיה זרעך."'},
  {ch:9,em:'🌙',t:'Kobi שנקרא Isra-el',en:'Kobi, named Isra-el',txt:'הנכד של Avram נאבק לילה שלם עם שליח, ולא ויתר. בבוקר קיבל שם חדש: Isra-el, "מי שנאבק וניצח". לו היו שנים־עשר בנים: שנים־עשר האורות.',wise:'"לא יעקב ייאמר עוד שמך כי אם ישראל". ומי הם האב, הבן והנכד?'},
  {ch:9,em:'🕯️',t:'שנים־עשר האורות',en:'The Twelve Lights',txt:'כל שבט שונה: אריה, איילה, ספינה, עץ זית… אבל רק כשכל השנים־עשר עומדים יחד, האור שלהם מאיר לכל העולם.',wise:'בספר העתיק לכל שבט היה דגל עם סמל. נסו לגלות מי הוא כל סמל.'},
  {ch:10,em:'👣',t:'המרגלים',en:'The Scouts',txt:'שנים־עשר יצאו לראות את ארץ האור. עשרה חזרו מפוחדים, ושניים, Josh ו־Kal, אמרו: "אנחנו יכולים!". כל אחד בוחר אחרי מי ללכת.',wise:'בספר העתיק, מי שהלך אחרי הפחד נדד ארבעים שנה במדבר.'},
  {ch:11,em:'🌊',t:'הנהר',en:'The River',txt:'כשהנושאים נכנסו למים, הנהר עצר. העם עבר ביבשה, ולקח שתים־עשרה אבנים לזיכרון.',wise:'"ותעמוד הירדן". איזה נהר?'},
  {ch:12,em:'📯',t:'החומות',en:'The Walls',txt:'שבעה ימים הקיפו את חומות הצל בשקט. ביום השביעי תקעו בשופר, כולם הריעו יחד, והחומות נפלו.',wise:'איזו עיר הייתה מוקפת חומה שנפלה מתרועה?'},
  {ch:13,em:'⛺',t:'מה שמוסתר',en:'What Was Hidden',txt:'אחד לקח לעצמו אוצר אסור והסתיר אותו באוהל, וכל המחנה הפסיד בגללו. מעשה של אחד משפיע על כולם.',wise:'בספר העתיק, אחרי ההפסד בעי, מצאו את מה שהוסתר באוהל של עכן.'},
  {ch:14,em:'☀️',t:'שמש בגבעון',en:'Sun, Stand Still',txt:'הקרב נמשך, והיום עמד להיגמר. Josh קרא "Sun, stand still!", והשמש עמדה עד שהאור ניצח.',wise:'"שמש בגבעון דום, וירח בעמק אילון". מי אמר את זה?'});

/* ---------- tribe choice and perks ---------- */
ACTX.tribes=()=>openTribes();ACTX.tribepick=d=>{const t=TRIBES.find(x=>x.id===d.v);if(!t)return;const s=ST();s.tribe=t.id;save();sfx.win();burst(t.em+' '+t.he);say(`You joined the ${t.en} tribe!`);pushPresence(true);renderQuestChip();
  if(LG.d&&LG.d.afterTribe){const f=LG.d.afterTribe;LG.d.afterTribe=null;closeSheet();f()}else openTribes()};
function openTribes(){PANEL='tribes';const mine=ST().tribe;sheet(`<h2>🕯️ ${en('The Twelve Lights')} · בוחרים שבט</h2><p class="sub">כל שבט עם סמל, צבע וכוח מיוחד. חברים מאותה קבוצה יכולים לבחור שבטים שונים, ורק יחד יש שנים־עשר.</p>
  <div class="tribes">${TRIBES.map(t=>`<button class="trb ${mine===t.id?'on':''}" data-a="tribepick" data-v="${t.id}" style="--tc:${t.c}"><span class="em">${t.em}</span><b>${t.he}</b>${en(t.en)}<small>${PERK[t.perk]}</small></button>`).join('')}</div>
  <button class="btn ghost" data-a="close">סגירה</button>`)}
(function patchTribe(){setInterval(()=>{if(!NET.room||NET.room.__tribe)return;const r=NET.room;const orig=r.presence.bind(r);r.presence=patch=>{const t=myTribe();return orig(t&&patch&&patch.n?Object.assign({},patch,{n:t.em+' '+patch.n}):patch)};r.__tribe=1;pushPresence(true)},1000)})();
const _lgStartP=lgStart;lgStart=function(ch){_lgStartP(ch);const t=myTribe();if(t&&t.perk==='heart'&&LG.active){LG.hp++;LG.max++;lgHud(LG.d.hud)}};
const _fireP=fireLight;fireLight=function(){const c=LG.cd;_fireP();const t=myTribe();if(t&&t.perk==='quick'&&LG.cd>c)LG.cd*=.65};
const _hurtP=lgHurt;lgHurt=function(w){const before=LG.inv;_hurtP(w);const t=myTribe();if(t&&t.perk==='shield'&&LG.inv>before)LG.inv+=.8};
const _endP=lgEnd;lgEnd=function(win,quiet){const ch=LG.ch;_endP(win,quiet);const t=myTribe();if(win&&!quiet&&t&&t.perk==='rich')addGems(5,'כוח השבט '+t.he,'Tribe bonus');if(win&&!quiet&&ch===14)setTimeout(finale2,600)};

/* ---------- helpers for Act II ---------- */
function shadeFoe(x,z,hp,col){const g=new THREE.Group();const body=mesh(new THREE.ConeGeometry(.5,1.5,8),mat(col||'#1E1B4B'));body.position.y=.75;g.add(body);const hd=mesh(new THREE.SphereGeometry(.3,10,8),mat('#312E81'));hd.position.y=1.65;g.add(hd);
  [-1,1].forEach(k=>{const e=mesh(new THREE.SphereGeometry(.06,6,4),mat('#F87171',{emissive:'#EF4444',emissiveIntensity:1}));e.position.set(k*.11,1.7,.26);g.add(e)});const sp=mesh(new THREE.CylinderGeometry(.03,.03,1.6,5),mat('#94A3B8'));sp.position.set(.4,1,.1);g.add(sp);
  g.position.set(x,0,z);lgAdd(g);return{g,body,kind:'shade',shootable:true,r:.8,aimY:1,hp:hp||2,stun:0,
    hit(){this.hp--;this.body.material=mat('#A5B4FC');setTimeout(()=>{if(!this.dead)this.body.material=mat(col||'#1E1B4B')},100);if(this.hp<=0){this.dead=true;scene.remove(this.g);fxBurst(this.g.position.x,1,this.g.position.z,'#312E81',14,1.8);sfx.pop();LG.d.killed=(LG.d.killed||0)+1}},
    up(dt){if(this.stun>0){this.stun-=dt;return}const dx=ME.pos.x-this.g.position.x,dz=ME.pos.z-this.g.position.z,d=Math.hypot(dx,dz)||1;const sp=HELP()?1.7:2.2;if(d>.9){this.g.position.x+=dx/d*sp*dt;this.g.position.z+=dz/d*sp*dt}this.g.rotation.y=Math.atan2(dx,dz);
      if(d<1&&ME.y<.8&&LG.inv<=0){lgHurt('🗡️');const k=1/d;for(let i=0;i<5;i++)tryMove(dx*k*.25,dz*k*.25)}}}}
function arrow(from,speed){const o=mesh(new THREE.CylinderGeometry(.04,.04,.9,5),mat('#111827'),false);o.position.copy(from);lgAdd(o);const v=new THREE.Vector3(ME.pos.x-from.x,ME.y+1-from.y,ME.pos.z-from.z).normalize().multiplyScalar(speed);
  o.lookAt(from.clone().add(v));o.rotateX(Math.PI/2);LG.fx.push({o,v,life:4,up(dt){this.o.position.addScaledVector(this.v,dt);this.life-=dt;if(Math.hypot(this.o.position.x-ME.pos.x,this.o.position.y-(ME.y+1),this.o.position.z-ME.pos.z)<.7){lgHurt('🏹');this.life=0}return this.life>0}})}
function npcAt(name,ch,x,z,col){const d=human3D(Object.assign({kind:'human',eyes:'happy'},ch));d.position.set(x,0,z);const lb=label(name,col||'#15803D','#FFFFFF',.32);lb.position.y=2.4;d.add(lb);lgAdd(d);rootify(d);return d}
const JOSH={g:'boy',hair:'short',hc:'#3B2A1E',skin:'#C68657',top:'#1D4ED8',bot:'pants',bc:'#78350F'},KAL={g:'boy',hair:'messy',hc:'#9CA3AF',skin:'#B9875F',top:'#B91C1C',bot:'pants',bc:'#44403C'};
const AVRAM={g:'boy',hair:'messy',hc:'#E5E7EB',skin:'#B9875F',top:'#F5F5F4',bot:'pants',bc:'#A8A29E'};
function allyShoot(npc,targets,every){return{g:npc,kind:'ally',cd:every,up(dt){this.cd-=dt;if(this.cd>0)return;this.cd=every;const t=targets().filter(e=>!e.dead&&e.shootable)[0];if(!t)return;
  const a=new THREE.Vector3(npc.position.x,1.5,npc.position.z),b=new THREE.Vector3(t.g.position.x,(t.aimY||1),t.g.position.z);const len=a.distanceTo(b);if(len>18)return;
  const beam=mesh(new THREE.CylinderGeometry(.06,.06,len,6),mat('#FDE047',{emissive:'#FDE047',emissiveIntensity:1,transparent:true,opacity:.8}),false);beam.position.copy(a).add(b).multiplyScalar(.5);beam.lookAt(b);beam.rotateX(Math.PI/2);lgAdd(beam);setTimeout(()=>scene.remove(beam),160);t.hit&&t.hit()}}}
const L=(x,z)=>LW(x,z);

/* ---------- 8: The Promise — catch the falling stars ---------- */
function startStars(){const need=HELP()?7:10;Object.assign(LG.d,{got:0,need,left:need+12,starT:1,time:HELP()?120:95,stars:[],hud:''});scene.background.set('#0B1026');scene.fog.color.set('#0B1026');document.body.classList.add('lgnight');
  const av=npcAt('Avram ⭐',AVRAM,...L(0,-14),'#78350F');av.lookAt(ZC.legend[0],0,ZC.legend[1]);
  const tent=mesh(new THREE.ConeGeometry(1.6,2,4),mat('#D6B38A'));const[tx,tz]=L(2.6,-15);tent.position.set(tx,1,tz);tent.rotation.y=.8;lgAdd(tent);
  for(let i=0;i<(HELP()?1:2);i++){const[x,z]=L(-14+i*28,-18);LG.ents.push(crow(x,z))}}
function crow(x,z){const g=new THREE.Group();const b=mesh(new THREE.SphereGeometry(.35,10,8),mat('#111827'));g.add(b);[-1,1].forEach(k=>{const w=mesh(new THREE.BoxGeometry(.7,.05,.3),mat('#1F2937'));w.position.x=k*.5;g.add(w)});
  const bk=mesh(new THREE.ConeGeometry(.08,.25,6),mat('#F59E0B'));bk.rotation.x=Math.PI/2;bk.position.z=.38;g.add(bk);g.position.set(x,3,z);lgAdd(g);
  return{g,kind:'crow',shootable:true,r:.9,aimY:3,hy:2.5,stun:0,hit(){this.stun=4;this.g.visible=false;floatText('🐦‍⬛💨')},up(dt){if(this.stun>0){this.stun-=dt;if(this.stun<=0)this.g.visible=true;return}
    const tg=LG.d.stars.find(s=>s.landed&&!s.taken&&s.life<7);const tx=tg?tg.o.position.x:ME.pos.x,tz=tg?tg.o.position.z:ME.pos.z;const dx=tx-this.g.position.x,dz=tz-this.g.position.z,d=Math.hypot(dx,dz)||1;const sp=HELP()?1.6:2.2;
    this.g.position.x+=dx/d*sp*dt;this.g.position.z+=dz/d*sp*dt;this.g.position.y=2.2+Math.sin(LG.t*4)*.4;this.aimY=this.g.position.y;this.g.rotation.y=Math.atan2(dx,dz);this.g.children[1].rotation.z=Math.sin(LG.t*14)*.5;this.g.children[2].rotation.z=-Math.sin(LG.t*14)*.5;
    if(tg&&d<.8){tg.taken=1;scene.remove(tg.o);floatText('🐦‍⬛ stole a star!','#FCA5A5');if(AU.on)tone(180,.15,'sawtooth',.05)}}}}
function stepStars(dt){const d=LG.d;d.time-=dt;d.hud=`⭐ ${d.got}/${d.need} · ⏳ ${Math.max(0,Math.ceil(d.time))}`;lgHud(d.hud);if(d.time<=0){toast('⏳ הזמן נגמר…');lgFail();return}
  d.starT-=dt;if(d.starT<=0&&d.left>0){d.starT=HELP()?2.6:2.2;d.left--;const a=Math.random()*Math.PI*2,r=3+Math.random()*8;const cx=clamp(ME.pos.x,ZC.legend[0]-12,ZC.legend[0]+12),cz=clamp(ME.pos.z,ZC.legend[1]-12,ZC.legend[1]+12);
    const o=mesh(new THREE.OctahedronGeometry(.35),mat('#FDE047',{emissive:'#FACC15',emissiveIntensity:1}),false);o.position.set(cx+Math.cos(a)*r,14,cz+Math.sin(a)*r);lgAdd(o);d.stars.push({o,landed:0,taken:0,life:10})}
  d.stars.forEach(s=>{if(s.taken)return;s.o.rotation.y+=dt*3;if(!s.landed){s.o.position.y-=dt*7;if(s.o.position.y<=.6){s.o.position.y=.6;s.landed=1;fxBurst(s.o.position.x,.6,s.o.position.z,'#FDE047',10,1.5)}return}
    s.life-=dt;if(s.life<=0){s.taken=1;scene.remove(s.o);return}if(near(s.o,1.2)){s.taken=1;scene.remove(s.o);d.got++;sfx.coin();floatText('⭐ '+d.got);if(d.got>=d.need)starsWin()}});
  if(d.left<=0&&d.stars.every(s=>s.taken)&&d.got<d.need){toast('⭐ לא מספיק כוכבים…');lgFail()}}
function starsWin(){LG.d.won=1;const d=LG.d;LG.active=false;cut([['🌌',`אספת ${d.got} כוכבים! Avram הביט בשמיים ושמע את ההבטחה.`,'Look at the sky and count the stars. So many will your children be. And this land I give to you and to them.'],
  ['⛺','Avram, ואחריו Tzahi, ואחריו Kobi, חיו באוהלים ושמרו על ההבטחה.','Avram, then Tzahi, then Kobi kept the promise alive.']],()=>{LG.active=true;lgEnd(true)})}

/* ---------- 9: The Twelve Lights — choose a tribe, light the twelve stones ---------- */
function startLights(){const d=LG.d;d.lit=0;d.stones=[];const go=()=>{TRIBES.forEach((t,i)=>{const a=i/12*Math.PI*2;const[x,z]=L(Math.cos(a)*11,-2+Math.sin(a)*11);const g=new THREE.Group();
    const st=mesh(new THREE.CylinderGeometry(.55,.7,1.4,6),mat('#78716C'));st.position.y=.7;g.add(st);const fl=mesh(new THREE.BoxGeometry(.9,.6,.04),mat('#57534E'));fl.position.set(0,2.2,0);g.add(fl);const pole=mesh(new THREE.CylinderGeometry(.04,.04,1.6,5),mat('#78350F'));pole.position.set(-.45,1.9,0);g.add(pole);
    const lb=label(t.em,'#1F2937','#FFFFFF',.38);lb.position.y=3;g.add(lb);g.position.set(x,0,z);g.lookAt(ZC.legend[0],0,ZC.legend[1]-2);lgAdd(g);rootify(g);const S={t,g,st,fl,lit:0,guard:null};d.stones.push(S);
    g.userData.zact=()=>touchStone(S);g.userData.talker='Stone';EXTRA_PICK.push(g);if(i%(HELP()?3:2)===0){const gd=shadeFoe(x*0+ZC.legend[0]+Math.cos(a)*9,ZC.legend[1]-2+Math.sin(a)*9,2);S.guard=gd;LG.ents.push(gd)}});
    d.hud=`🕯️ 0/12 אורות · ${myTribe()?myTribe().em:''}`;lgHud(d.hud)};
  if(!ST().tribe){LG.d.afterTribe=go;setTimeout(()=>{openTribes();toast('קודם בוחרים שבט 🕯️')},200)}else go()}
function touchStone(S){if(S.lit||!LG.active)return;if(!near(S.g,3.2)){toast('🏃 מתקרבים לאבן');return}if(S.guard&&!S.guard.dead){toast('🗡️ צל שומר על האבן. יורים בו אור קודם!');return}
  const opts=[S.t,...TRIBES.filter(x=>x!==S.t).sort(()=>Math.random()-.5).slice(0,2)].sort(()=>Math.random()-.5);LG.d.cur=S;PANEL='stoneq';
  sheet(`<h2>${S.t.em} ${en('Which banner is this?')}</h2><div class="bigem">${S.t.em}</div><div class="opts">${opts.map(o=>`<button class="opt" data-a="stoneans" data-v="${o.id}">${en(o.en)}</button>`).join('')}</div>`);say('Which banner is this?')}
ACTX.stoneans=dd=>{const S=LG.d.cur;closeSheet();if(!S)return;if(dd.v!==S.t.id){learnResult('vocab',false);lgHurt('❌');return}learnResult('vocab',true);S.lit=1;S.st.material=mat(S.t.c,{emissive:S.t.c,emissiveIntensity:.6});S.fl.material=mat(S.t.c);
  fxBurst(S.g.position.x,1.5,S.g.position.z,S.t.c,20,2);sfx.coin();say(S.t.en+'!');const d=LG.d;d.lit++;d.hud=`🕯️ ${d.lit}/12 אורות`;lgHud(d.hud);
  if(d.lit>=12){LG.active=false;const[cx,cz]=ZC.legend;fxBurst(cx,3,cz-2,'#FDE047',90,6);hiddenHand('שנים־עשר האורות נדלקו יחד, והערפל ברח…','When the twelve stand together, no darkness can stand!');
    setTimeout(()=>cut([['🕯️','שנים־עשר האורות זוהרים יחד. כל אחד שונה, וכולם משפחה אחת.','Twelve different lights, one family. Together we shine!'],['👴','Mosh הזקן אסף את כולם: "הגיע הזמן לשלוח מרגלים לארץ האור."','It is time to send scouts to the Land of Light.']],()=>{LG.active=true;lgEnd(true)}),900)}};

/* ---------- 10: The Twelve Scouts — whom will you follow? ---------- */
const SCOUTS=[['Shammua','The people there are giants!'],['Shaphat','We are like little grasshoppers!'],['Igal','Their walls touch the sky!'],['Palti','We can not win. Let us go back!'],['Gaddiel','I am too afraid!'],
  ['Gaddi','The land eats the people who live there!'],['Ammiel','Their cities are too strong!'],['Sethur','We are too small!'],['Nahbi','It is impossible!'],['Geuel','Let us choose a new leader and go home!']];
const BRAVE=[['Josh','The land is very, very good! If the Shaper is with us, we can do it!',JOSH],['Kal','We can go up now! Together we are strong!',KAL]];
function startScouts(){const d=LG.d;const all=[...SCOUTS.map(([n,l])=>({n,l,brave:0,ch:{g:'boy',hair:pick(['short','messy']),hc:pick(['#1F1B1A','#3B2A1E','#8A5530']),top:pick(['#6B7280','#78716C','#57534E']),bot:'pants',bc:'#44403C'}})),...BRAVE.map(([n,l,ch])=>({n,l,brave:1,ch}))].sort(()=>Math.random()-.5);
  all.forEach((s,i)=>{const[x,z]=L(-11+i*2,-6);const g=npcAt(s.n,s.ch,x,z,s.brave?'#15803D':'#475569');g.lookAt(x,0,z+5);g.userData.zact=()=>hearScout(s);g.userData.talker=s.n;EXTRA_PICK.push(g)});
  Object.assign(d,{hud:'👣 מקשיבים לכל המרגלים ובוחרים אחרי מי ללכת',wander:0});lgHud(d.hud)}
function hearScout(s){if(LG.d.wander)return;PANEL='scout';sheet(`<h2>👣 ${esc(s.n)}</h2><div class="bubble">${en(s.l)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(s.l)}">🔊</button><button class="btn sun" data-a="follow" data-v="${s.brave}" data-n="${esc(s.n)}">👣 ${en('Follow '+s.n)}</button><button class="btn ghost" data-a="close">${en('Listen to others')}</button></div>`);say(s.l)}
ACTX.follow=dd=>{closeSheet();const s=ST();s.followed=s.followed||[];s.followed.push(dd.n);save();
  if(dd.v==='1'){LG.active=false;learnResult('listen',true);cut([['💪',`בחרת ללכת אחרי ${dd.n}! מי שהולך אחרי האומץ, מגיע.`,'You chose courage! Josh and Kal will lead the way.'],['👣','Josh, התלמיד של Mosh, הפך למנהיג החדש של שנים־עשר האורות.','Josh the Brave is the new leader of the Twelve Lights!']],()=>{LG.active=true;lgEnd(true)});return}
  learnResult('listen',false);const d=LG.d;d.wander=40;scene.fog.near=4;scene.fog.far=16;toast('🌫️ הלכת אחרי הפחד… עכשיו נודדים בערפל 40 שניות');say('You followed fear. Now you must wander in the fog.');
  for(let i=0;i<(HELP()?2:4);i++){const a=Math.random()*Math.PI*2;LG.ents.push(shadeFoe(ME.pos.x+Math.cos(a)*9,ME.pos.z+Math.sin(a)*9,2))}};
function stepScouts(dt){const d=LG.d;if(!d.wander)return;d.wander-=dt;d.hud=`🌫️ נודדים בערפל… ${Math.max(0,Math.ceil(d.wander))}`;lgHud(d.hud);
  if(d.wander<=0){d.wander=0;scene.fog.near=50;scene.fog.far=120;LG.ents.filter(e=>e.kind==='shade').forEach(e=>{e.dead=true;scene.remove(e.g)});toast('🌤️ הערפל התפזר. מקשיבים שוב, ובוחרים טוב יותר');d.hud='👣 בוחרים שוב אחרי מי ללכת';lgHud(d.hud)}}

/* ---------- 11: The River — when they step in, the water stops ---------- */
function startRiver(){const[cx,cz]=ZC.legend;const rz=cz-1;const water=mesh(new THREE.BoxGeometry(2*RL,.3,5),mat('#38BDF8',{transparent:true,opacity:.85,emissive:'#0284C7',emissiveIntensity:.25}),false);water.position.set(cx,.1,rz);lgAdd(water);
  const bed=mesh(new THREE.BoxGeometry(2*RL,.05,5),mat('#A8A29E'),false);bed.position.set(cx,.01,rz);lgAdd(bed);
  const j=npcAt('Josh 👣',JOSH,cx+2,cz+5,'#1D4ED8');j.lookAt(cx,0,rz);Object.assign(LG.d,{river:1,rz,water,dry:0,phase:'wait',got:0,stones:[],rocks:[],hud:'🌊 עומדים על שפת הנהר ונוגעים במים'});
  water.userData.zact=()=>stepIn();rootify(water);EXTRA_PICK.push(water)}
function stepIn(){const d=LG.d;if(d.phase!=='wait')return;if(Math.abs(ME.pos.z-d.rz)>5){toast('🏃 מתקרבים לשפת הנהר');return}d.phase='dry';d.dry=1;d.time=HELP()?55:42;hiddenHand('ברגע שנגעו במים… הנהר עצר!','The moment they stepped in, the river stopped!');
  const[cx]=ZC.legend;for(let i=0;i<12;i++){const x=cx-20+i*3.6+(Math.random()-.5),z=d.rz+(Math.random()-.5)*3.4;const o=mesh(new THREE.DodecahedronGeometry(.32),mat('#E7E5E4',{emissive:'#FDE68A',emissiveIntensity:.3}),false);o.position.set(x,.3,z);lgAdd(o);d.stones.push({o,got:0})}}
function stepRiver(dt){const d=LG.d;if(d.phase==='wait')return;
  if(d.phase==='dry'){d.water.scale.z=Math.max(.02,d.water.scale.z-dt*1.5);d.time-=dt;d.hud=`🧱 ${d.got}/12 אבנים · ⏳ ${Math.max(0,Math.ceil(d.time))}`;lgHud(d.hud);
    d.stones.forEach(s=>{if(!s.got&&near(s.o,1.1)){s.got=1;scene.remove(s.o);d.got++;sfx.coin();floatText('🧱 '+d.got)}});
    if(Math.random()<dt*(HELP()?.45:.8)){const g=mesh(new THREE.DodecahedronGeometry(.7),mat('#57534E'));const side=Math.random()<.5?-1:1;g.position.set(ZC.legend[0]-side*RL,.7,d.rz+(Math.random()-.5)*3.6);lgAdd(g);d.rocks.push({g,v:side*(HELP()?5:7)})}
    d.rocks.forEach(r=>{r.g.position.x+=r.v*dt;r.g.rotation.z-=r.v*dt;if(Math.hypot(r.g.position.x-ME.pos.x,r.g.position.z-ME.pos.z)<1&&ME.y<.9)lgHurt('🧱')});
    if(d.got>=12){d.phase='done';LG.active=false;cut([['🧱','שתים־עשרה אבנים, אחת לכל שבט. בניתם מהן מצבת זיכרון על הגדה.','Twelve stones for twelve tribes. Remember this day!'],['🌊','כשכולם עברו, המים חזרו לזרום.','When everyone crossed, the water came back.']],()=>{LG.active=true;lgEnd(true)});return}
    if(d.time<=0){d.phase='back';d.dry=0;toast('🌊 המים חוזרים!');if(Math.abs(ME.pos.z-d.rz)<3)lgHurt('🌊');setTimeout(()=>{if(LG.active&&LG.ch===11)lgFail()},900)}}
  if(d.phase==='back')d.water.scale.z=Math.min(1,d.water.scale.z+dt*2)}
const _wkR=walkable;walkable=function(pt,zone){if(zone==='legend'&&LG.active&&LG.ch===11&&LG.d.river&&!LG.d.dry&&Math.abs(pt.z-LG.d.rz)<2.4)return false;return _wkR(pt,zone)};

/* ---------- 12: The Walls of Shadow — seven silent laps, then the shofar ---------- */
function startWalls(){const[cx,cz]=ZC.legend;const fz=cz-3;const walls=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const w=mesh(new THREE.BoxGeometry(3.2,3.2,.8),mat('#312E81'));w.position.set(cx+Math.cos(a)*5.5,1.6,fz+Math.sin(a)*5.5);w.rotation.y=-a+Math.PI/2;lgAdd(w);walls.push(w)}
  const tw=mesh(new THREE.CylinderGeometry(.8,1,4.5,8),mat('#1E1B4B'));tw.position.set(cx,2.25,fz);lgAdd(tw);const beacon=mesh(new THREE.SphereGeometry(.5,12,10),mat('#334155'));beacon.position.set(cx,4.8,fz);lgAdd(beacon);
  Object.assign(LG.d,{fx:cx,fz,walls,beacon,laps:0,ang:null,acc:0,down:0,hud:'📯 0/7 הקפות · בשקט, בלי לירות!',archT:2});
  const j=npcAt('Josh 👣',JOSH,cx+3,cz+13,'#1D4ED8');j.lookAt(cx,0,fz)}
const _fireW=fireLight;fireLight=function(){if(LG.active&&LG.ch===12&&!LG.d.down){if(LG.cd<=0){LG.cd=.6;LG.d.acc=Math.max(0,LG.d.acc-Math.PI*2);toast('🤫 שקט! זו הקפה שקטה. איבדת הקפה');say('Shh! Silent march!')}return}_fireW()};
function stepWalls(dt){const d=LG.d;if(d.down){if(d.down===1){d.walls.forEach((w,i)=>{w.rotation.x=Math.min(1.5,w.rotation.x+dt*1.2);w.position.y=Math.max(-1,w.position.y-dt*1.5)})}
    if(d.down===1&&Math.hypot(ME.pos.x-d.fx,ME.pos.z-d.fz)<2){d.down=2;d.beacon.material=mat('#FDE047',{emissive:'#FDE047',emissiveIntensity:1});fxBurst(d.fx,5,d.fz,'#FDE047',60,5);LG.active=false;
      setTimeout(()=>cut([['📯','החומות נפלו! האור בוער במגדל.','The walls fell down! The light is shining in the tower!']],()=>{LG.active=true;lgEnd(true)}),700)}return}
  const r=Math.hypot(ME.pos.x-d.fx,ME.pos.z-d.fz);const a=Math.atan2(ME.pos.z-d.fz,ME.pos.x-d.fx);if(r>6.8&&r<15){if(d.ang!==null){let da=a-d.ang;if(da>Math.PI)da-=2*Math.PI;if(da<-Math.PI)da+=2*Math.PI;d.acc+=da}d.ang=a}else d.ang=null;
  const laps=Math.min(7,Math.floor(Math.abs(d.acc)/(Math.PI*2)));if(laps!==d.laps){d.laps=laps;sfx.coin();floatText(`📯 ${laps}/7`);if(laps>=7){toast('📯 שבע הקפות! תוקעים בשופר!');say('Now blow the shofar!');shofarBtn(true)}}
  d.hud=`📯 ${d.laps}/7 הקפות · בשקט!`;lgHud(d.hud);
  d.archT-=dt;if(d.archT<=0){d.archT=HELP()?4.5:3;const w=pick(d.walls);arrow(new THREE.Vector3(w.position.x,3.4,w.position.z),HELP()?6:8)}}
function shofarBtn(on){let b=$('#bShofar');if(!b&&on){b=document.createElement('button');b.id='bShofar';b.className='btn sun shofar';b.innerHTML='📯 Blow the shofar!';document.body.appendChild(b);b.addEventListener('click',()=>blowShofar())}if(b)b.hidden=!on}
function blowShofar(){const d=LG.d;shofarBtn(false);if(!LG.active||LG.ch!==12)return;if(AU.on){tone(233,.9,'sawtooth',.07);setTimeout(()=>tone(311,1.2,'sawtooth',.07),700)}say('Shout! Everybody, shout!');
  setTimeout(()=>{hiddenHand('כולם הריעו יחד… והחומות רעדו!','Everybody shouted together, and the walls shook!');if(typeof shake==='function')shake(.6,1.2);d.down=1;d.walls.forEach(w=>fxBurst(w.position.x,1.5,w.position.z,'#312E81',10,2));
    LG.fx=LG.fx.filter(f=>{scene.remove(f.o);return false});d.hud='🏃 רצים למגדל והדליקו את האור';lgHud(d.hud)},1500)}

/* ---------- 13: The Hidden Treasure — lose, search the tents, return it, win ---------- */
const TENTC=[['red','#DC2626'],['blue','#2563EB'],['green','#16A34A'],['yellow','#EAB308'],['purple','#7C3AED'],['orange','#EA580C'],['white','#F1F5F9'],['brown','#92400E']];
function startHidden(){const[cx,cz]=ZC.legend;const d=LG.d;Object.assign(d,{phase:'attack',t0:7,tents:[],hud:'⚔️ Josh: Attack!'});const j=npcAt('Josh 👣',JOSH,cx+2,cz+9,'#1D4ED8');d.josh=j;j.userData.zact=()=>talkJosh13();j.userData.talker='Josh';EXTRA_PICK.push(j);
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2;LG.ents.push(shadeFoe(cx+Math.cos(a)*14,cz-4+Math.sin(a)*14,3))}}
function stepHidden(dt){const d=LG.d;if(d.phase==='attack'){d.t0-=dt;if(d.t0<=0){d.phase='lost';LG.ents.filter(e=>e.kind==='shade').forEach(e=>{e.dead=true;scene.remove(e.g)});LG.hp=Math.max(LG.hp,2);
    cut([['😞','הצללים היו חזקים מדי. מה קרה? אנחנו אף פעם לא מפסידים כשאנחנו מאוחדים…','We lost! Why? When we are united, we never lose…'],['⛺','Josh הבין: מישהו לקח לעצמו אוצר אסור והסתיר אותו באוהל. כשאחד לוקח לעצמו, כולם מפסידים.','Someone took the forbidden treasure and hid it in a tent. Find it!']],()=>placeTents())}}
  if(d.phase==='battle'&&LG.ents.filter(e=>e.kind==='shade').length===0){if(d.wave<3){d.wave++;spawnWave13()}else{d.phase='done';LG.active=false;cut([['🏆','הפעם, מאוחדים ונקיים, ניצחתם!','This time, united and honest, you won!']],()=>{LG.active=true;lgEnd(true)})}}}
function placeTents(){const d=LG.d;d.phase='search';const[cx,cz]=ZC.legend;const order=[...TENTC].sort(()=>Math.random()-.5);d.chain=order;
  order.forEach((c,i)=>{const a=i/order.length*Math.PI*2;const t=mesh(new THREE.ConeGeometry(1.3,1.9,4),mat(c[1]));t.position.set(cx+Math.cos(a)*10,.95,cz-3+Math.sin(a)*10);t.rotation.y=.8;lgAdd(t);rootify(t);
    const lb=label('⛺ '+c[0],'#1F2937','#FFFFFF',.3);lb.position.y=1.6;t.add(lb);t.userData.zact=()=>searchTent(i);t.userData.talker='Tent';EXTRA_PICK.push(t);d.tents.push(t)});
  d.hud='⛺ מחפשים את האוצר באוהלים';lgHud(d.hud)}
function searchTent(i){const d=LG.d;if(d.phase!=='search')return;if(!near(d.tents[i],3)){toast('🏃 מתקרבים לאוהל');return}const n=d.chain.length;PANEL='tent';
  if(i===n-1){d.phase='found';sfx.win();sheet(`<h2>💰 ${en('You found it!')}</h2><div class="bigem">💰</div><p class="sub">מצאת את האוצר המוסתר. מחזירים אותו ל־Josh.</p><button class="btn sun" data-a="close">👣 ${en('Bring it to Josh')}</button>`);say('You found it! Bring it to Josh.');d.hud='💰 מביאים את האוצר ל־Josh';lgHud(d.hud);return}
  const nx=d.chain[i+1][0];const line=pick([`Not here. Look in the ${nx} tent.`,`It is not in my tent. Try the ${nx} tent.`,`Nothing here! Go to the ${nx} tent.`]);
  sheet(`<h2>⛺ ${en(d.chain[i][0]+' tent')}</h2><div class="bubble">${en(line)}</div><div class="row"><button class="spk" data-a="sayt" data-t="${esc(line)}">🔊</button><button class="btn ghost" data-a="close">${en('OK!')}</button></div>`);say(line)}
function talkJosh13(){const d=LG.d;if(d.phase==='found'){d.phase='battle';d.wave=1;sfx.win();say('Thank you! Now we are united again. Attack!');hiddenHand('ברגע שהאוצר חזר, האור חזר למחנה','The light came back to the camp!');
    LG.ents.push(allyShoot(d.josh,()=>LG.ents.filter(e=>e.kind==='shade'),HELP()?1.6:2.4));spawnWave13()}else if(d.phase==='search')toast('⛺ מחפשים באוהלים. מתחילים מכל אוהל וקוראים את הרמז')}
function spawnWave13(){const d=LG.d;const n=(HELP()?2:3)+d.wave;const[cx,cz]=ZC.legend;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2;LG.ents.push(shadeFoe(cx+Math.cos(a)*16,cz-2+Math.sin(a)*16,2))}d.hud=`⚔️ גל ${d.wave}/3`;lgHud(d.hud);toast(`⚔️ גל ${d.wave}!`)}

/* ---------- 14: The Sun Stands Still — five Shadow Kings ---------- */
function startSun(){const[cx,cz]=ZC.legend;const d=LG.d;Object.assign(d,{time:HELP()?110:85,stopped:0,asked:0,kings:[]});scene.background.set('#FDBA74');
  const sun=mesh(new THREE.SphereGeometry(2.4,20,14),mat('#FDE047',{emissive:'#F59E0B',emissiveIntensity:1}),false);sun.position.set(cx+20,22,cz-30);lgAdd(sun);d.sun=sun;
  const cols=['#7F1D1D','#1E3A8A','#14532D','#581C87','#78350F'];for(let i=0;i<5;i++){const a=-Math.PI/2+(i-2)*.55;const k=grabbMesh(1.15);k.userData.crown.material=mat(cols[i],{metalness:.5});k.userData.robe.material=mat('#111827');k.position.set(cx+Math.cos(a)*11,0,cz-2+Math.sin(a)*11);lgAdd(k);
    const K={g:k,kind:'king',shootable:true,r:1.1,hy:2.6,aimY:1.8,hp:HELP()?7:10,cd:2+i*1.1,hit(){this.hp--;floatText('👑 '+Math.max(0,this.hp));if(this.hp<=0){this.dead=true;scene.remove(this.g);fxBurst(this.g.position.x,1.5,this.g.position.z,'#111827',30,3);sfx.win();say('A Shadow King is defeated!')}},
      up(dt){this.g.rotation.y=Math.atan2(ME.pos.x-this.g.position.x,ME.pos.z-this.g.position.z);this.g.position.y=Math.abs(Math.sin(LG.t*1.5+this.cd))*.3;this.cd-=dt;if(this.cd<=0){this.cd=HELP()?7:5;fogBomb()}}};d.kings.push(K);LG.ents.push(K)}
  const j=npcAt('Josh 👣',JOSH,cx-3,cz+9,'#1D4ED8'),k2=npcAt('Kal',KAL,cx+3,cz+9,'#B91C1C');[j,k2].forEach(n=>LG.ents.push(allyShoot(n,()=>d.kings,HELP()?2.2:3)))}
function stepSun(dt){const d=LG.d;const alive=d.kings.filter(k=>!k.dead).length;if(!d.stopped)d.time-=dt;const sk=clamp(d.time/90,0,1);d.sun.position.y=4+18*sk;
  d.hud=`👑 ${alive}/5 · ☀️ ${d.stopped?'⏸ עומדת!':Math.max(0,Math.ceil(d.time))}`;lgHud(d.hud);
  if(alive===0){LG.active=false;cut([['☀️','השמש עמדה עד שחמשת מלכי הצל נפלו. ארץ האור מוארת!','The sun stood still until the light won!']],()=>{LG.active=true;lgEnd(true)});return}
  if(d.asked<0){d.asked=Math.min(0,d.asked+dt)}if(d.asked===0&&!d.stopped&&d.time<25){d.asked=1;PANEL='sun';const opts=['Sun, stand still!','Sun, go to sleep!','Sun, run away!'].sort(()=>Math.random()-.5);
    sheet(`<h2>☀️ Josh: ${en('The day is ending! What do we say?')}</h2><div class="opts">${opts.map(o=>`<button class="opt" data-a="sunans" data-v="${esc(o)}">${en(o)}</button>`).join('')}</div>`);say('The day is ending! What do we say?')}
  if(d.time<=0&&!d.stopped){toast('🌙 החושך ירד, ומלכי הצל ברחו…');lgFail()}}
ACTX.sunans=dd=>{closeSheet();const d=LG.d;if(dd.v!=='Sun, stand still!'){learnResult('sentence',false);d.asked=-3;toast('Josh: לא… מה אומרים לשמש? 🤔');return}learnResult('sentence',true);d.stopped=1;
  hiddenHand('השמש עמדה באמצע השמיים!','Sun, stand still! And the sun stood still!');if(AU.on)tone(1046,.8,'sine',.06)};

/* ---------- register the chapters ---------- */
Object.assign(LGCH,{
  8:{start:startStars,step:stepStars,at:[0,-9],tip:'⭐ אוספים כוכבים נופלים לפני שהעורבים חוטפים אותם',topic:/star|stars|crow|crows|bird|time/,reply:'Dear friend, I will give you more time and fewer crows.'},
  9:{start:startLights,at:[0,-2],tip:'🕯️ בוחרים שבט, מביסים את הצללים ומדליקים את 12 האבנים',topic:/stone|stones|light|lights|tribe|shadow|banner/,reply:'Dear friend, fewer shadows will guard the stones.'},
  10:{start:startScouts,step:stepScouts,at:[0,2],tip:'👣 מקשיבים ל־12 המרגלים ובוחרים אחרי מי ללכת',topic:/scout|scouts|follow|fog|lost|wander/,reply:'Dear friend, listen to the ones who are brave and believe.'},
  11:{start:startRiver,step:stepRiver,at:[0,6],tip:'🌊 נוגעים במים, ואז אוספים 12 אבנים מקרקעית הנהר לפני שהמים חוזרים',topic:/river|water|stone|stones|rock|rocks|time/,reply:'Dear friend, the river will wait longer for you.'},
  12:{start:startWalls,step:stepWalls,at:[0,10],tip:'📯 מקיפים את החומות 7 פעמים בשקט, בלי לירות, ואז תוקעים בשופר',topic:/wall|walls|lap|laps|arrow|arrows|shofar|circle/,reply:'Dear friend, the archers will be slower.'},
  13:{start:startHidden,step:stepHidden,at:[0,12],tip:'⛺ מוצאים את האוצר המוסתר לפי הרמזים באנגלית, ואז מנצחים יחד',topic:/tent|tents|treasure|gold|shadow|lost|find/,reply:'Dear friend, Josh will shoot faster, and the shadows will be fewer.'},
  14:{start:startSun,step:stepSun,at:[0,12],hp:5,tip:'☀️ מביסים 5 מלכי צל לפני שהשמש שוקעת',topic:/sun|king|kings|time|dark|night/,reply:'Dear friend, the sun will shine longer, and your friends will be stronger.'}});
Object.assign(INTROS,{
  8:[['🏜️','הרבה לפני Mosh, חי נודד בשם Avram. יום אחד שמע קול: "לך אל הארץ שאראה לך."','Go to the land that I will show you.'],['🌌','בלילה, היוצר אמר לו: "הבט לשמיים וספור את הכוכבים."','Look at the sky and count the stars!'],
     ['🐦‍⬛','אבל עורבי הצל של Grabb הישן רוצים לחטוף את הכוכבים. אוספים כוכבים לפני שהם נעלמים, ויורים בעורבים.','Catch the falling stars before the shadow crows take them!']],
  9:[['🌙','הנכד של Avram, Kobi, נאבק לילה שלם עם שליח, ולא ויתר. בבוקר קיבל שם חדש: Isra-el.','Your name will be Isra-el, because you fought and you won.'],['🕯️','לו היו שנים־עשר בנים, שנים־עשר אורות. צללים נשלחו לכבות אותם.','Twelve sons, twelve lights. Light them all together!']],
  10:[['👴','Mosh, כבר זקן, שלח שנים־עשר מרגלים לראות את ארץ האור.','Go and see the Land of Light. Is it good? Are the people strong?'],['👣','הם חזרו. כל אחד אומר משהו אחר. מקשיבים לכולם ובוחרים אחרי מי ללכת.','Listen to all of them, and choose whom to follow.']],
  11:[['🌊','Josh הוביל את כולם אל הנהר הגדול. המים עמוקים וזורמים.','The river is deep. But when we step in, something will happen.'],['🧱','צריך לקחת שתים־עשרה אבנים מקרקעית הנהר, אחת לכל שבט, לפני שהמים חוזרים.','Take twelve stones from the river, quickly!']],
  12:[['🏰','מעבר לנהר עומדת עיר הצל, מוקפת חומות גבוהות. קשתים עומדים עליהן.','The Walls of Shadow are too high to climb.','grabb'],['🤫','Josh: "מקיפים את החומות שבע פעמים, בשקט מוחלט. בלי לירות! אחרי זה תוקעים בשופר."','Go around the walls seven times. Quietly! Then blow the shofar.']],
  13:[['⛺','אחרי הניצחון הגדול, Josh שלח את הצבא לעיר קטנה. "זה יהיה קל," אמרו.','This one is easy. Attack!']],
  14:[['👑','חמישה מלכי צל התאחדו כדי לכבות את ארץ האור.','Five Shadow Kings! We will put out your light forever!','grabb'],['☀️','הקרב יהיה ארוך, והיום קצר. אם השמש תשקע לפני שתנצחו, הצללים יברחו בחושך.','Defeat them before the sun goes down!']]});
function finale2(){const s=ST();s.done2=1;save();P.badges.landoflight=1;addGems(40,'ארץ האור','Land of Light');burst('🌅 Land of Light!');
  setTimeout(()=>{cut([['🌅','ארץ האור מוארת. שנים־עשר הדגלים מתנופפים יחד.','The Land of Light shines. Twelve banners, one family.'],['🌍','"והייתם אור לעמים": האור שלכם מגיע עכשיו לכל העולמות.','Your light will shine for all the worlds!'],
    ['📜','סוף המערכה השנייה. בקרוב: השופטים, המלכים, ומה שעוד לא סופר…','The end of the second part. Coming soon: the Judges and the Kings…']],()=>{leaveLegend();let n=0;const iv=setInterval(()=>{if(++n>14){clearInterval(iv);return}const a=Math.random()*Math.PI*2;fxBurst(Math.cos(a)*6,6+Math.random()*3,Math.sin(a)*6,pick(TRIBES).c,40,4)},300)})},1200)}

/* ---------- Mosh, objectives and the Book ---------- */
const _talkMoshP=talkMosh;talkMosh=function(){const s=ST();if(s.ch<8)return _talkMoshP();placePortal();
  if(s.ch>14){moshSay('The Twelve Lights are home. Shapeland is shining. But the story is not over…','שנים־עשר האורות בבית, וארץ הצורות זורחת. אבל הסיפור עוד לא נגמר… 🌅','<button class="btn" data-a="book">📜 הספר</button><button class="btn ghost" data-a="tribes">🕯️ השבט שלי</button>');return}
  if(s.ch===8&&!s.act2seen){s.act2seen=1;save();moshSay("Before me, before all of us, there was a wanderer. His name was Avram. Come, I will show you where our story really began.",'לפניי, לפני כולנו, היה נודד. קראו לו Avram. בואי, אראה לך איפה הסיפור שלנו באמת התחיל. המערכה השנייה: ההבטחה ⭐','<button class="btn sun" data-a="lgportal">🌀 לשער</button>');return}
  moshSay(`The next trial: ${CHAPTERS[s.ch].en}. Go through the portal.`,`המבחן הבא: ${CHAPTERS[s.ch].he}. נכנסים בשער ליד הגביש 🌀`,'<button class="btn sun" data-a="lgportal">🌀 לשער</button><button class="btn ghost" data-a="tribes">🕯️ השבט שלי</button>')};
const _objP=objective;objective=function(){const s=ST();if(s.ch>14)return'🌅 המערכה השנייה הושלמה!';if(s.ch>=8)return`🌀 ${CHAPTERS[s.ch].em} ${CHAPTERS[s.ch].he}`;return _objP()};
const _umP=updateMoshMark;updateMoshMark=function(){_umP();if(MOSH&&ST().ch>=8)MOSH.userData.mk.visible=ST().ch<=14&&!ST().act2seen};
const _bookP=openBook;openBook=function(){_bookP();const s=ST();if(s.ch<8)return;const c=$('#sheet .chaps');if(!c)return;const t=myTribe();
  c.insertAdjacentHTML('afterend',`<h3>📖 ${en('Act II · The Promise')} · ${t?t.em+' '+t.he:'<button class="link" data-a="tribes">בוחרים שבט</button>'}</h3><div class="chaps">${CHAPTERS.slice(8,15).map((ch,i)=>{const n=i+8;const done=s.ch>n,cur=s.ch===n;
    return`<div class="chap ${done?'done':cur?'cur':''}"><span class="sh" style="background:${done?'#FDE047':'#E5E7EB'}">${done?'🕯️':cur?'▶':'·'}</span><b>${ch.em} ${ch.he}</b>${en(ch.en)}</div>`}).join('')}</div>
    ${t?`<p class="sub">🦉 לחכמים: לשבט שלך, ${t.he}, קראו בספר העתיק… ${s.ch>9?t.wise:'(נחשף אחרי פרק שנים־עשר האורות)'}</p>`:''}`)};

/* tidy up between trials: sky, fog, buttons */
const _cleanP=lgCleanup;lgCleanup=function(){_cleanP();shofarBtn(false);document.body.classList.remove('lgnight');if(ME.zone==='legend'){scene.fog.near=50;scene.fog.far=120;if(LGW)legendSky()}};
const _wkW=walkable;walkable=function(pt,zone){if(zone==='legend'&&LG.active&&LG.ch===12&&LG.d.walls&&!LG.d.down&&Math.hypot(pt.x-LG.d.fx,pt.z-LG.d.fz)<6.6)return false;return _wkW(pt,zone)};
