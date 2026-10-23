/* Shapeland · a world by Shirel Yitzhak */
/* ===================== CREATURES OF DARKNESS IN THE OPEN WORLD =====================
   From the very first minutes: shadows roam the island, the town and Ashkelon. Grumblers steal gems and run away,
   Shades chase you, Mess-Goo knocks over what you built. Every few minutes a Shadow Raid: the sky darkens and a wave attacks.
   Fight with ✨ light and every tool from the Armory. Nobody gets hurt for real: at zero hearts you are just knocked back home. */
const RAID={ents:[],fx:[],objs:[],shots:[],hp:5,inv:0,cd:0,spawnT:6,raidT:75,on:false,raid:0,left:0,earned:0,stolen:0,kills:0};
const RZ=['island','town','city','girls','boys','adv','road'];
const raidOK=()=>!P.raidsOff&&RZ.includes(ME.zone)&&!LG.active&&$('#title').hidden&&!$('#hudBot').hidden;
function rAdd(o){scene.add(o);RAID.objs.push(o);return o}
function rRemove(e){e.dead=true;scene.remove(e.g);const i=RAID.objs.indexOf(e.g);if(i>=0)RAID.objs.splice(i,1)}
function spawnSpot(min,max){for(let i=0;i<14;i++){const a=Math.random()*Math.PI*2,r=min+Math.random()*(max-min);const x=ME.pos.x+Math.cos(a)*r,z=ME.pos.z+Math.sin(a)*r;if(zoneAt(x,z)===ME.zone&&walkable({x,z},ME.zone))return[x,z]}return null}
function rLabel(g,txt,bg){const lb=label(txt,bg||'#1C1917','#FFFFFF',.3);lb.position.y=1.5;g.add(lb);return lb}
/* creatures */
function rShade(x,z){const g=new THREE.Group();const b=mesh(new THREE.ConeGeometry(.5,1.5,8),mat('#1E1B4B'));b.position.y=.75;g.add(b);const h=mesh(new THREE.SphereGeometry(.3,10,8),mat('#312E81'));h.position.y=1.65;g.add(h);
  [-1,1].forEach(k=>{const e=mesh(new THREE.SphereGeometry(.06,6,4),mat('#F87171',{emissive:'#EF4444',emissiveIntensity:1}));e.position.set(k*.11,1.7,.26);g.add(e)});rLabel(g,'Shade 👤','#312E81').position.y=2.2;g.position.set(x,0,z);rAdd(g);
  return{g,body:b,kind:'shade',shootable:true,r:.8,aimY:1,hp:2,stun:0,zone:ME.zone,hit(){this.hp--;flash(this.body,'#1E1B4B');if(this.hp<=0)rKill(this,1)},
    up(dt){if(this.stun>0){this.stun-=dt;return}const dx=ME.pos.x-this.g.position.x,dz=ME.pos.z-this.g.position.z,d=Math.hypot(dx,dz)||1;const sp=d<14?2.1+RAID.raid*.3:.6;if(d>.9){this.g.position.x+=dx/d*sp*dt;this.g.position.z+=dz/d*sp*dt}this.g.rotation.y=Math.atan2(dx,dz);
      if(d<1&&ME.y<.8)raidHurt('🗡️',dx,dz,d)}}}
function rGrum(x,z){const g=new THREE.Group();const b=mesh(new THREE.SphereGeometry(.45,12,10),mat('#57534E'));b.position.y=.5;g.add(b);const br=mesh(new THREE.BoxGeometry(.55,.08,.1),mat('#1C1917'));br.position.set(0,.75,.38);br.rotation.z=.15;g.add(br);
  [-1,1].forEach(k=>{const e=mesh(new THREE.SphereGeometry(.08,8,6),mat('#FDE047',{emissive:'#FACC15',emissiveIntensity:.8}));e.position.set(k*.16,.62,.4);g.add(e)});const lb=rLabel(g,'Grumbler 😠');g.position.set(x,0,z);rAdd(g);
  return{g,body:b,lb,kind:'grum',shootable:true,r:.8,aimY:.6,stun:0,has:0,t:0,zone:ME.zone,
    hit(){if(this.has){this.has=0;P.gems+=2;renderHud();floatText('💎 +2 החזרת!','#86EFAC');say('You got the gem back!')}rKill(this,1)},
    up(dt){if(this.stun>0){this.stun-=dt;return}this.t+=dt;const dx=ME.pos.x-this.g.position.x,dz=ME.pos.z-this.g.position.z,d=Math.hypot(dx,dz)||1;
      if(this.has){this.g.position.x-=dx/d*3*dt;this.g.position.z-=dz/d*3*dt;this.g.rotation.y=Math.atan2(-dx,-dz);if(this.t>12||d>26){RAID.stolen++;toast('😠 ה־Grumbler ברח עם היהלום שלך…');rRemove(this)}return}
      const sp=d<16?2.5:.7;this.g.position.x+=dx/d*sp*dt;this.g.position.z+=dz/d*sp*dt;this.g.rotation.y=Math.atan2(dx,dz);this.g.position.y=Math.abs(Math.sin(LG.t+this.t*9))*.12;
      if(d<.95&&ME.y<.8&&P.gems>0){P.gems--;renderHud();this.has=1;this.t=0;this.g.remove(this.lb);this.lb=rLabel(this.g,'😠 💎 Mine!','#B91C1C');toast('😠 Grumbler חטף לך 💎! יורים בו כדי להחזיר');if(AU.on)tone(300,.15,'sawtooth',.05)}}}}
function rGoo(x,z){const g=new THREE.Group();const b=mesh(new THREE.SphereGeometry(.45,12,10),mat('#7C3AED',{transparent:true,opacity:.85,emissive:'#4C1D95',emissiveIntensity:.4}));b.position.y=.4;b.scale.y=.75;g.add(b);
  [-1,1].forEach(k=>{const e=mesh(new THREE.SphereGeometry(.07,6,4),mat('#111827'));e.position.set(k*.14,.5,.36);g.add(e)});rLabel(g,'Mess-Goo 👾','#6D28D9').position.y=1.2;g.position.set(x,0,z);rAdd(g);
  return{g,body:b,kind:'goo',shootable:true,r:.7,aimY:.4,hp:2,stun:0,zone:ME.zone,tgt:null,
    hit(){this.hp--;flash(this.body,'#7C3AED');if(this.hp<=0)rKill(this,1)},
    up(dt){if(this.stun>0){this.stun-=dt;return}if(!this.tgt||!OBJ.has(this.tgt.userData.key))this.tgt=myPieceNear(this.g.position);const tx=this.tgt?this.tgt.position.x:ME.pos.x,tz=this.tgt?this.tgt.position.z:ME.pos.z;
      const dx=tx-this.g.position.x,dz=tz-this.g.position.z,d=Math.hypot(dx,dz)||1;this.g.position.x+=dx/d*1.6*dt;this.g.position.z+=dz/d*1.6*dt;this.body.scale.y=.7+Math.abs(Math.sin(LG.t*6+this.g.position.x))*.2;
      if(this.tgt&&d<1.2){messUp(this.tgt);this.tgt=null}else if(!this.tgt&&Math.hypot(ME.pos.x-this.g.position.x,ME.pos.z-this.g.position.z)<.9&&ME.y<.5)raidHurt('👾',dx,dz,d)}}}
function myPieceNear(p){let best=null,bd=30;for(const m of OBJ.values()){if(m.userData.big||m.userData.item||!pieceData(m)||m.userData.zone!==ME.zone)continue;const d=Math.hypot(m.position.x-p.x,m.position.z-p.z);if(d<bd){bd=d;best=m}}return best}
function messUp(m){const p=pieceData(m);if(!p)return;const[cx,cz]=ZC[m.userData.zone];const a=Math.random()*Math.PI*2;p.x=+(p.x+Math.cos(a)*1.5).toFixed(2);p.z=+(p.z+Math.sin(a)*1.5).toFixed(2);p.y=Math.max(p.y,hOf(p.s,p.sz)/2);p.r=((p.r||0)+3)%8;
  const lim=m.userData.zone==='island'?R-.6:99;const r=Math.hypot(p.x,p.z);if(r>lim){p.x*=lim/r;p.z*=lim/r}m.position.set(cx+p.x,p.y,cz+p.z);m.rotation.y=p.r*Math.PI/4;m.userData.col=null;if(typeof syncMoved==='function')syncMoved(m);save();
  fxBurst(m.position.x,.8,m.position.z,'#7C3AED',14,1.6);if(AU.on)tone(160,.2,'square',.05);if(performance.now()-(RAID.messT||0)>6000){RAID.messT=performance.now();toast('👾 יצור חושך מבלגן את הבנייה שלך! יורים בו ✨');say('Hey! Stop messing up my building!')}}
function flash(b,c){b.material=mat('#E0E7FF');setTimeout(()=>{b.material=mat(c,c==='#7C3AED'?{transparent:true,opacity:.85,emissive:'#4C1D95',emissiveIntensity:.4}:undefined)},100)}
function rKill(e,gem){if(e.dead)return;fxBurst(e.g.position.x,1,e.g.position.z,e.kind==='goo'?'#7C3AED':'#312E81',16,2);sfx.pop();rRemove(e);RAID.kills++;RAID.earned+=gem;floatText('✨ +'+gem+' 💎');
  if(RAID.earned>=5)payRaid()}
function payRaid(){if(RAID.earned>0){addGems(RAID.earned,'ניצחון על יצורי חושך','Shadow fight');RAID.earned=0}}
/* getting hit */
function raidHurt(why,dx,dz,d){if(RAID.inv>0)return;if(LG.shieldT>0){RAID.inv=.4;floatText('🛡️ Blocked!','#93C5FD');return}RAID.hp--;RAID.inv=1.5;if(typeof shake==='function')shake(.3,.3);sfx.bad();
  const f=$('#hurtFx')||(()=>{const x=document.createElement('div');x.id='hurtFx';document.body.appendChild(x);return x})();f.classList.remove('on');void f.offsetWidth;f.classList.add('on');floatText(why,'#FCA5A5');
  const k=1/(d||1);for(let i=0;i<5;i++)tryMove(dx*k*.3,dz*k*.3);
  if(RAID.hp<=0){RAID.hp=5;toast('😵 הצללים הפילו אותך! חוזרים לנקודת ההתחלה');say('Ouch! Back to the start.');teleport(ME.zone);if(RAID.raid)endRaid(false)}raidHud()}
/* light shots in the open world */
const _fireR=fireLight;fireLight=function(){if(LG.active)return _fireR();if(!raidOK()||RAID.cd>0||!$('#sheet').hidden)return;RAID.cd=.3;let tx=null,best=12;
  for(const e of RAID.ents){if(e.dead)continue;const d=Math.hypot(e.g.position.x-ME.pos.x,e.g.position.z-ME.pos.z);if(d<best){best=d;tx=e}}const a=ME.obj?ME.obj.rotation.y:0;let dx=Math.sin(a),dz=Math.cos(a),dy=0;
  if(tx){const v=new THREE.Vector3(tx.g.position.x-ME.pos.x,(tx.aimY||.8)-(ME.y+1.1),tx.g.position.z-ME.pos.z).normalize();dx=v.x;dz=v.z;dy=v.y;if(ME.obj)ME.obj.rotation.y=Math.atan2(dx,dz)}
  const o=mesh(new THREE.SphereGeometry(.22,10,8),mat('#FEF9C3',{emissive:'#FDE047',emissiveIntensity:1}),false);o.position.set(ME.pos.x,ME.y+1.1,ME.pos.z);rAdd(o);RAID.shots.push({o,vx:dx*16,vy:dy*16,vz:dz*16,life:.85});if(AU.on)tone(880,.07,'triangle',.05,null,null,.005,1320)};
/* armory tools outside the Realm: run them against the world's creatures */
const _useArmR=useArm;useArm=function(k){if(LG.active)return _useArmR(k);if(!raidOK())return;const sv={ents:LG.ents,fx:LG.fx,objs:LG.objs,active:LG.active,ch:LG.ch,d:LG.d};
  Object.assign(LG,{ents:RAID.ents,fx:RAID.fx,objs:RAID.objs,active:true,ch:0,d:{}});try{_useArmR(k)}finally{Object.assign(LG,sv)}};

const _armBarR=armBar;armBar=function(){_armBarR();const b=$('#armBar');if(!b||LG.active)return;const show=raidOK()&&RAID.ents.length>0;const ks=Object.keys(ARM).filter(k=>armLv(k)>0);if(!show||!ks.length){b.hidden=true;return}b.hidden=false;
  const sig=ks.join(',');if(b.dataset.sig!==sig){b.dataset.sig=sig;b.innerHTML=ks.map(k=>`<button class="arm" data-arm="${k}" aria-label="${ARM[k].he}"><span>${ARM[k].em}</span><i></i></button>`).join('')}
  ks.forEach(k=>{const el=b.querySelector(`[data-arm="${k}"] i`);const c=ARMCD[k]||0;if(el)el.style.background=c>0?`conic-gradient(rgba(29,42,72,.6) ${c/ARM[k].cd*360}deg,transparent 0)`:'transparent'})};
const _lightBtnR=lightBtn;lightBtn=function(){_lightBtnR();const b=$('#bLight');if(b&&!LG.active)b.hidden=!(raidOK()&&RAID.ents.length>0)};
const _dangerR=dangerNow;dangerNow=function(){return _dangerR()||(raidOK()&&(RAID.raid>0||RAID.ents.some(e=>!e.dead&&Math.hypot(e.g.position.x-ME.pos.x,e.g.position.z-ME.pos.z)<8)))?1:0};
/* raids */
function startRaid(){RAID.raid=1;RAID.left=60;RAID.hp=5;document.body.classList.add('raid');const n=Math.min(10,4+Math.floor(level()/2));for(let i=0;i<n;i++)setTimeout(()=>{if(!RAID.raid||!raidOK())return;spawnOne(true)},i*700);
  if(AU.on){[0,250,500].forEach(t=>setTimeout(()=>tone(392,.18,'square',.06),t))}toast('⚠️ פלישת צללים! מגינים על '+(ZNAME[ME.zone]||'המקום')+'!');say('Shadow raid! Defend your world!');burst('⚠️ Shadow Raid!')}
function endRaid(win){if(!RAID.raid)return;RAID.raid=0;document.body.classList.remove('raid');payRaid();RAID.raidT=150+Math.random()*90;
  if(win){addGems(10,'הדפת פלישת צללים','Raid defended');addXp(25);if(typeof kind==='function')kind(2,'הגנת על העולם');sfx.win();burst('🏆 '+en('Raid defeated!'));say('You defended your world!')}
  else{toast('🌫️ הצללים נסוגו… הם יחזרו');RAID.ents.forEach(e=>rRemove(e));RAID.ents=[]}raidHud()}
function spawnOne(raid){const sp=spawnSpot(raid?6:7,raid?12:14);if(!sp)return;const ownPieces=ME.zone==='island'&&[...OBJ.values()].some(m=>pieceData(m)&&!m.userData.item&&!m.userData.big);
  const r=Math.random();const e=r<.38?rShade(...sp):r<.68?rGrum(...sp):(ownPieces?rGoo(...sp):rShade(...sp));RAID.ents.push(e);fxBurst(sp[0],1,sp[1],'#4C1D95',12,1.8)}
function raidHud(){let h=$('#raidHud');if(!h){h=document.createElement('div');h.id='raidHud';document.body.appendChild(h)}const n=RAID.ents.filter(e=>!e.dead).length;const show=raidOK()&&(RAID.raid||n>0);h.hidden=!show;if(!show)return;
  h.innerHTML=`${RAID.raid?`<b>⚠️ ${en('Shadow Raid')}</b><span>⏳ ${Math.ceil(RAID.left)}</span>`:'<b>👾 יצורי חושך בסביבה</b>'}<span>👾 ${n}</span><span class="hp">${'❤️'.repeat(RAID.hp)}${'🖤'.repeat(5-RAID.hp)}</span>`}
function stepRaids(dt){const ok=raidOK();Object.keys(ARMCD).forEach(k=>{if(!LG.active)ARMCD[k]=Math.max(0,ARMCD[k]-dt)});if(!LG.active&&LG.shieldT>0){LG.shieldT-=dt;if(LG.bubble){LG.bubble.position.set(ME.pos.x,ME.y+1,ME.pos.z);LG.bubble.visible=LG.shieldT>0}}
  RAID.ents.forEach(e=>{if(!e.dead&&(e.zone!==ME.zone||!ok)){rRemove(e)}});RAID.ents=RAID.ents.filter(e=>!e.dead);
  if(!ok||!$('#sheet').hidden){if(RAID.raid&&!ok)endRaid(false);raidHud();lightBtn();armBar();return}
  RAID.t=(RAID.t||0)+dt;RAID.cd=Math.max(0,RAID.cd-dt);RAID.inv=Math.max(0,RAID.inv-dt);
  for(let i=RAID.shots.length-1;i>=0;i--){const s=RAID.shots[i];s.life-=dt;s.o.position.x+=s.vx*dt;s.o.position.y+=s.vy*dt;s.o.position.z+=s.vz*dt;let hit=null;
    for(const e of RAID.ents){if(e.dead)continue;if(Math.hypot(s.o.position.x-e.g.position.x,s.o.position.z-e.g.position.z)<(e.r||.8)&&Math.abs(s.o.position.y-(e.aimY||.8))<1.3){hit=e;break}}
    if(hit){hit.hit();fxBurst(s.o.position.x,s.o.position.y,s.o.position.z,'#FDE047',8,1.4)}if(hit||s.life<=0){scene.remove(s.o);RAID.shots.splice(i,1)}}
  RAID.ents.forEach(e=>{if(!e.dead)e.up(dt)});RAID.fx=RAID.fx.filter(f=>{const k=f.up(dt);if(!k&&f.o&&f.o.parent)scene.remove(f.o);return k});
  if(RAID.raid){RAID.left-=dt;if(RAID.ents.filter(e=>!e.dead).length===0&&RAID.left<57)endRaid(true);else if(RAID.left<=0)endRaid(false)}
  else{RAID.spawnT-=dt;const cap=Math.min(4,1+Math.floor(level()/2));if(RAID.spawnT<=0){RAID.spawnT=16+Math.random()*10;if(RAID.ents.length<cap)spawnOne(false)}
    RAID.raidT-=dt;if(RAID.raidT<=0&&RAID.t>40)startRaid()}
  raidHud();lightBtn();armBar()}
const _stepStoryR=stepStory;stepStory=function(dt,t){_stepStoryR(dt,t);try{stepRaids(dt)}catch(e){if(!window.__rerr){window.__rerr=1;console.warn('raid',e)}}};
window.addEventListener('keydown',e=>{if(LG.active||!raidOK()||(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName))||e.repeat)return;if(e.code==='KeyF')fireLight();const m={Digit1:'shield',Digit2:'sling',Digit3:'fire',Digit4:'wind',Digit5:'water',Digit6:'elec',Digit7:'str'}[e.code];if(m&&armLv(m)>0)useArm(m)});
/* parents can switch the creatures off */
const _raidOK0=raidOK;
const _setR=openSettings;openSettings=function(){_setR();const h=$('#sheet h2');if(h)h.insertAdjacentHTML('afterend',`<div class="row"><button class="btn ghost mini" data-a="raidtog">${P.raidsOff?'👾 יצורי חושך: כבויים':'👾 יצורי חושך: פעילים'}</button></div>`)};
ACTX.raidtog=()=>{P.raidsOff=!P.raidsOff;save();if(P.raidsOff){RAID.ents.forEach(e=>rRemove(e));RAID.ents=[];endRaid(false)}openSettings()};
