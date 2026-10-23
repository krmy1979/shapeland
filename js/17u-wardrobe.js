/* Shapeland · a world by Shirel Yitzhak */
/* ===================== ART STEP 4 · THE WARDROBE OF LIGHT: capes and wings =====================
   Capes and wings that flow behind you — earned on the legend's road, a few bought with gems. Friends see them too.
   Flying (Shirel's power) shows glowing wings even when none are worn. */
const COS={
  capes:{
    wanderer:{he:'גלימת הנודד',en:"Wanderer's Cape",c:'#8B6B4A',t:'#D6B38A',how:'חינם',free:1},
    tribe:{he:'גלימת השבט',en:'Tribe Cape',c:null,t:'#FDE68A',how:'בוחרים שבט (פרק 9)',ok:()=>!!ST().tribe},
    dawn:{he:'גלימת השחר',en:'Dawn Cape',c:'#F59E0B',t:'#FEF3C7',glow:1,how:'30 ✨ אור, או מסיימים את המערכה הראשונה',ok:()=>ST().light>=30||ST().done1},
    stars:{he:'גלימת הכוכבים',en:'Starry Cape',c:'#1E3A8A',t:'#FDE047',stars:1,how:'מסיימים את פרק ההבטחה (8)',ok:()=>ST().ch>8},
    flame:{he:'גלימת האש',en:'Flame Cape',c:'#B91C1C',t:'#FDBA74',glow:1,how:'משיגים את האש של גדעון',ok:()=>!!(ST().arm||{}).fire},
    sea:{he:'גלימת הים',en:'Sea Cape',c:'#0E7490',t:'#A5F3FC',price:40},
    royal:{he:'גלימת המלכות',en:'Royal Cape',c:'#5B21B6',t:'#FACC15',price:80}},
  wings:{
    none:{he:'בלי כנפיים',en:'No wings',free:1},
    dove:{he:'כנפי היונה',en:'Dove Wings',c:'#FFFFFF',how:'מסיימים את המערכה הראשונה',ok:()=>ST().done1,price:150},
    light:{he:'כנפי האור',en:'Wings of Light',c:'#FDE047',glow:1,how:'מסיימים את המערכה השנייה',ok:()=>ST().done2,price:200},
    ember:{he:'כנפי הגחלים',en:'Ember Wings',c:'#F97316',glow:1,how:'משיגים את האש של גדעון',ok:()=>!!(ST().arm||{}).fire}}};
function cosState(){P.cos=P.cos||{cape:'wanderer',wings:'none',own:[]};P.cos.own=P.cos.own||[];return P.cos}
const cosHas=(kind,id)=>{const it=COS[kind][id];if(!it)return false;return!!(it.free||(it.ok&&it.ok())||cosState().own.includes(kind+':'+id))};
function capeColor(id){const it=COS.capes[id];if(id==='tribe'){const t=typeof myTribe==='function'&&myTribe();return t?t.c:'#64748B'}return it?it.c:'#8B6B4A'}

/* ---------- making a cape and wings ---------- */
const CAPETEX={};
function capeTex(id){const key=id+(id==='tribe'?(ST().tribe||''):'');if(CAPETEX[key])return CAPETEX[key];const it=COS.capes[id]||COS.capes.wanderer;const col=capeColor(id);
  const t=canvasTex(128,160,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,col);g.addColorStop(1,lerpC(col,'#000000',.3));c.fillStyle=g;c.fillRect(0,0,w,h);
    c.fillStyle=it.t;c.fillRect(0,h-12,w,8);c.fillRect(0,0,w,6);c.globalAlpha=.25;for(let x=8;x<w;x+=18){c.fillStyle='#000';c.fillRect(x,6,2,h-18)}c.globalAlpha=1;
    if(it.stars){for(let i=0;i<26;i++){c.fillStyle=i%5?'#FFFFFF':it.t;c.beginPath();c.arc(Math.random()*w,10+Math.random()*(h-30),i%5?1.4:2.6,0,7);c.fill()}}
    if(id==='tribe'){const tr=typeof myTribe==='function'&&myTribe();if(tr){c.font='46px serif';c.textAlign='center';c.textBaseline='middle';c.fillText(tr.em,w/2,h*.45)}}});CAPETEX[key]=t;return t}
function makeCape(id){const it=COS.capes[id]||COS.capes.wanderer;const geo=new THREE.PlaneGeometry(.62,.82,4,8);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i),x=p.getX(i);p.setZ(i,-Math.pow((.41-y)/.82,1.6)*.18-Math.abs(x)*.12);p.setX(i,x*(1+(.41-y)*.35))}geo.computeVertexNormals();
  const m=new THREE.MeshStandardMaterial({map:capeTex(id),side:THREE.DoubleSide,roughness:.8,emissive:it.glow?capeColor(id):'#000000',emissiveIntensity:it.glow?.25:0});const cape=new THREE.Mesh(geo,m);cape.castShadow=true;
  const piv=new THREE.Group();cape.position.y=-.41;piv.add(cape);piv.position.set(0,.2,-.22);piv.rotation.x=.12;piv.userData.cape=1;return piv}
function makeWings(id){const it=COS.wings[id];if(!it||id==='none')return null;const g=new THREE.Group();const sh=new THREE.Shape();sh.moveTo(0,0);sh.bezierCurveTo(.25,.35,.6,.55,.95,.5);sh.bezierCurveTo(.8,.3,.75,.15,.85,.02);sh.bezierCurveTo(.6,-.05,.45,-.25,.5,-.45);sh.bezierCurveTo(.3,-.3,.12,-.15,0,0);
  const geo=new THREE.ShapeGeometry(sh,12);const m=new THREE.MeshStandardMaterial({color:it.c,side:THREE.DoubleSide,roughness:.5,transparent:true,opacity:.92,emissive:it.glow?it.c:'#000000',emissiveIntensity:it.glow?.6:0});
  [-1,1].forEach(s=>{const piv=new THREE.Group();const w=new THREE.Mesh(geo,m);w.scale.set(s,1,1);piv.add(w);piv.position.set(s*.06,.15,-.2);piv.rotation.y=s*-.5;piv.userData.side=s;g.add(piv)});g.userData.wings=1;return g}
function dressUp(o,cs){if(!o||!o.userData.limbs)return;const rig=o.userData.limbs.rig;rig.children.filter(c=>c.userData.cape||c.userData.wings).forEach(c=>rig.remove(c));
  if(cs&&cs.c&&COS.capes[cs.c]){rig.add(makeCape(cs.c))}if(cs&&cs.w&&COS.wings[cs.w]&&cs.w!=='none'){const w=makeWings(cs.w);if(w)rig.add(w)}o.userData.cs=JSON.stringify(cs||{})}
function myCs(){const s=cosState();return{c:cosHas('capes',s.cape)?s.cape:'wanderer',w:cosHas('wings',s.wings)?s.wings:'none',tr:ST().tribe||''}}
const _rebuildMeW=rebuildMe;rebuildMe=function(){_rebuildMeW();dressUp(ME.obj,myCs())};
/* friends see your cape and wings */
(function patchCos(){setInterval(()=>{if(!NET.room||NET.room.__cos)return;const r=NET.room;const orig=r.presence.bind(r);r.presence=patch=>orig(Object.assign({},patch,{cs:myCs()}));r.__cos=1;pushPresence(true)},1000)})();

/* ---------- animation: capes flow, wings flap ---------- */
let _lastPos=null,_tempWings=null;
function animCos(o,speed,t,flying){if(!o||!o.userData.limbs)return;const rig=o.userData.limbs.rig;rig.children.forEach(c=>{if(c.userData.cape){const tgt=.12+Math.min(.9,speed*.18)+Math.sin(t*6+o.id)*.04*(1+speed*.3);c.rotation.x+=(tgt-c.rotation.x)*.15}
  if(c.userData.wings)c.children.forEach(p=>{const s=p.userData.side;p.rotation.y=s*(-.5-(flying?Math.sin(t*10)*.6:Math.sin(t*2)*.08))})})}
function stepCos(dt,t){if(!ME.obj)return;const sp=_lastPos?Math.hypot(ME.pos.x-_lastPos.x,ME.pos.z-_lastPos.z)/Math.max(dt,.001):0;_lastPos={x:ME.pos.x,z:ME.pos.z};
  const flying=typeof PW!=='undefined'&&PW.active&&ME.y>.5;const rig=ME.obj.userData.limbs&&ME.obj.userData.limbs.rig;
  if(rig){const has=rig.children.some(c=>c.userData.wings);if(flying&&!has&&!_tempWings){_tempWings=makeWings('light');rig.add(_tempWings)}if(!flying&&_tempWings){rig.remove(_tempWings);_tempWings=null}}
  animCos(ME.obj,sp,t,flying||ME.y>.6);
  if(typeof NET!=='undefined'&&NET.avatars)NET.avatars.forEach((a,peer)=>{const p=NET.peers.find(x=>x.peer===peer);const cs=p&&p.presence&&p.presence.cs;const sig=JSON.stringify(cs||{});if(cs&&a.obj.userData.cs!==sig){const ok={c:COS.capes[cs.c]?cs.c:'wanderer',w:COS.wings[cs.w]?cs.w:'none'};dressUp(a.obj,ok)}animCos(a.obj,1,t,false)})}
const _stepStoryW=stepStory;stepStory=function(dt,t){_stepStoryW(dt,t);try{stepCos(dt,t)}catch(e){if(!window.__werr){window.__werr=1;console.warn('cos',e)}}};

/* ---------- the wardrobe ---------- */
ACTX.wardrobe=()=>openWardrobe();ACTX.cosequip=d=>{const[kind,id]=d.v.split(':');if(!cosHas(kind,id))return;const s=cosState();if(kind==='capes')s.cape=id;else s.wings=id;save();rebuildMe();pushPresence(true);sfx.coin();say(COS[kind][id].en);openWardrobe()};
ACTX.cosbuy=d=>{const[kind,id]=d.v.split(':');const it=COS[kind][id];if(!it||!it.price||cosHas(kind,id))return;if(P.gems<it.price){toast(`חסרים ${it.price-P.gems} 💎`);sfx.bad();return}P.gems-=it.price;logm('ארון האור: '+it.he,'Wardrobe',-it.price);cosState().own.push(kind+':'+id);save();renderHud();sfx.win();burst('✨ '+it.he);ACTX.cosequip({v:d.v})};
function openWardrobe(){PANEL='wardrobe';const s=cosState();const card=(kind,id,it)=>{const has=cosHas(kind,id),on=(kind==='capes'?s.cape:s.wings)===id;const col=kind==='capes'?capeColor(id):(it.c||'#E5E7EB');
  return`<div class="cosc ${on?'on':''} ${has?'':'locked'}"><span class="sw" style="background:${id==='none'?'#F1F5F9':col};${it.glow?`box-shadow:0 0 14px ${col}`:''}">${kind==='wings'?(id==='none'?'—':'🕊️'):(id==='tribe'&&typeof myTribe==='function'&&myTribe()?myTribe().em:'')}</span><b>${it.he}</b>${en(it.en)}
    ${has?(on?'<span class="ok">✓ לבוש</span>':`<button class="btn mini sun" data-a="cosequip" data-v="${kind}:${id}">${en('Wear')}</button>`):`<small>🔒 ${it.how||''}</small>${it.price?`<button class="btn mini gem" data-a="cosbuy" data-v="${kind}:${id}">💎 ${it.price}</button>`:''}`}</div>`};
  sheet(`<div class="npchead"><div class="face" style="background:#FEF3C7">🧥</div><div class="grow"><h2>${en('Wardrobe of Light')}</h2><p class="sub">ארון האור · גלימות וכנפיים שמשיגים בדרך</p></div>${gemTag()}</div>
  <h3>🧥 גלימות</h3><div class="coss">${Object.entries(COS.capes).map(([id,it])=>card('capes',id,it)).join('')}</div>
  <h3>🕊️ כנפיים</h3><div class="coss">${Object.entries(COS.wings).map(([id,it])=>card('wings',id,it)).join('')}</div>
  <p class="sub">כשעפים, כנפי אור מופיעות לבד. חברים רואים את הגלימה והכנפיים שלך.</p><button class="btn ghost" data-a="close">סגירה</button>`)}
const _openArmW=openArmory;openArmory=function(){_openArmW();const h=$('#sheet .npchead');if(h)h.insertAdjacentHTML('afterend','<div class="row"><button class="btn mini" data-a="wardrobe">🧥 ארון האור: גלימות וכנפיים</button></div>')};
const _setW=openSettings;openSettings=function(){_setW();const h=$('#sheet h2');if(h)h.insertAdjacentHTML('afterend','<div class="row"><button class="btn mini" data-a="wardrobe">🧥 ארון האור</button></div>')};
if(ME.obj)dressUp(ME.obj,myCs());
