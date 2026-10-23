/* Shapeland · a world by Shirel Yitzhak */
/* ===================== BUILDER'S KIT: hands, ghost preview, auto-align, tape measure, undo, stand on what you build ===================== */
/* Like real building: walk to a block, lift it with your hands, carry it, see exactly where it will land, put it down.
   Blocks are solid: climb on them and keep building up. */
const STANDABLE=new Set(['box','cylinder','arch','donut','heart','star','diamond','cloud','moon','item']);
const BK={carry:null,ghost:null,grid:null,step:0,undo:[],measure:[],mline:null,hint:0};
const pkind=m=>{const p=pieceData(m)||{};return m.userData.item?'item':p.s};
/* full footprint for a piece (box), cached like pieceCol */
const _pc=pieceCol;pieceCol=function(m){const c=_pc(m);if(c.hx===undefined){_bb.setFromObject(m);c.hx=(_bb.max.x-_bb.min.x)/2;c.hz=(_bb.max.z-_bb.min.z)/2}return c};
/* standing on blocks */
const _floorAt2=floorAt;floorAt=function(x,z){const f=_floorAt2(x,z);if(f.swim)return f;let best=null;
  for(const m of OBJ.values()){if(m===BK.carry||m.userData.grow)continue;if(!STANDABLE.has(pkind(m)))continue;const c=pieceCol(m);const px=m.position.x+c.cx,pz=m.position.z+c.cz;
    if(Math.abs(x-px)<c.hx-.05&&Math.abs(z-pz)<c.hz-.05&&c.top>f.h&&(!best||c.top>best.top))best={top:c.top,m}}
  if(best)return{h:best.top,swim:null,lava:false,piece:best.m};return f};
/* small blocks are steps, not walls */


/* ---------- where would a piece land? (auto-align to the grid of its own size, on top of what is there) ---------- */
function gridStep(m){if(BK.step)return BK.step;const p=pieceData(m)||{};if(m.userData.item)return .5;return({small:.6,medium:1,big:1.6})[p.sz]||1}
function landingFor(m){const c=pieceCol(m);const a=ME.obj?ME.obj.rotation.y:0;const fx=Math.sin(a),fz=Math.cos(a);const d=Math.max(c.hx,c.hz)+ME_R+.35;
  const zn=m.userData.zone;const[cx,cz]=ZC[zn];const st=gridStep(m);const snap=v=>Math.round(v/st)*st;
  let lx=snap(ME.pos.x+fx*d-cx),lz=snap(ME.pos.z+fz*d-cz);const wx=cx+lx,wz=cz+lz;
  let sup=zn==='home'||zn==='visit'?0:0;let on=null;
  for(const o of OBJ.values()){if(o===m||o.userData.zone!==zn||o.userData.grow)continue;const oc=pieceCol(o);const ox=o.position.x+oc.cx,oz=o.position.z+oc.cz;
    if(Math.abs(wx-ox)<oc.hx+c.hx-.08&&Math.abs(wz-oz)<oc.hz+c.hz-.08&&oc.top>sup){sup=oc.top;on=o}}
  const h=c.top-c.bottom;const p=pieceData(m)||{};const y=m.userData.item?sup:sup+h/2;
  const pl=zn==='city'?PLOTSC.find(q=>q.id===p.plot):null;
  const ok=zn==='island'?Math.hypot(lx,lz)<R-.4:zn==='home'?Math.hypot(lx,lz)<11.8:zn==='work'?Math.abs(lx)<1.4&&Math.abs(lz)<1.4:zn==='city'?!!pl&&Math.abs(lx-pl.x)<pl.w/2-.2&&Math.abs(lz-pl.z)<pl.d/2-.2:false;
  return{lx,lz,wx,wz,y,ok:ok&&y<12,on}}
/* ---------- lift & carry ---------- */
function nearestOwnPiece(){let best=null,bd=1.9;const a=ME.obj?ME.obj.rotation.y:0;const fx=Math.sin(a),fz=Math.cos(a);
  for(const m of OBJ.values()){if(!pieceStore(m.userData)||m.userData.grow)continue;const c=pieceCol(m);const px=m.position.x+c.cx,pz=m.position.z+c.cz;
    const dx=px-ME.pos.x,dz=pz-ME.pos.z,d=Math.hypot(dx,dz)-Math.max(c.hx,c.hz);if(d>bd)continue;if(c.bottom>ME.y+1.6||c.top<ME.y-.2)continue;
    const facing=Math.hypot(dx,dz)<.9||(dx*fx+dz*fz)/(Math.hypot(dx,dz)||1)>.3;if(!facing)continue;
    // not if something sits on it
    let loaded=false;for(const o of OBJ.values()){if(o===m||o.userData.zone!==m.userData.zone)continue;const oc=pieceCol(o);if(oc.bottom>=c.top-.15&&oc.bottom<=c.top+.2&&Math.abs(o.position.x+oc.cx-px)<c.hx+oc.hx-.1&&Math.abs(o.position.z+oc.cz-pz)<c.hz+oc.hz-.1){loaded=true;break}}
    if(loaded)continue;bd=d;best=m}return best}
function liftPiece(){if(BK.carry)return dropPiece();const m=nearestOwnPiece();if(!m){toast('🤲 עומדים צמוד למשהו שבנית ופונים אליו');return}
  const mass=pieceMass(m),S=strength();if(mass>S*2.2){toast('💪 כבד מדי להרים! אפשר לדחוף, או להתאמן בחדר הכושר');say("It's too heavy to lift!");return}
  const p=pieceData(m);BK.carry=m;BK.from={x:p.x,y:p.y,z:p.z,r:p.r,zone:m.userData.zone,id:p.id};m.userData.col=null;SOL&&0;
  if(AU.on){tone(300,.12,'sine',.12,null,null,.01,520);hiss(.15,'bandpass',800,1,.08)}fxBurst(m.position.x,.1,m.position.z,'#E7E5E4',6,1.5);say('Lift!');makeGhost(m);updateHands();renderTray()}
function dropPiece(){const m=BK.carry;if(!m)return;const L=landingFor(m);if(!L.ok){toast('⛔ אי אפשר להניח כאן. פונים למקום אחר בתוך הגבול');if(AU.on)SND.thud();return}
  const p=pieceData(m);const prev=BK.from;m.position.set(L.wx,L.y,L.wz);p.x=+L.lx.toFixed(2);p.z=+L.lz.toFixed(2);p.y=+L.y.toFixed(2);m.userData.col=null;BK.carry=null;killGhost();
  BK.undo.push({t:'move',m,id:p.id,zone:prev.zone,prev});if(BK.undo.length>30)BK.undo.shift();syncMoved(m);
  if(AU.on){SND.thud();tone(L.on?200:120,.1,'sine',.12)}fxBurst(L.wx,L.y-.2,L.wz,'#E7E5E4',8,2);say(L.on?'On top!':'Down!');updateHands();renderTray();checkQuest&&checkQuest()}
function makeGhost(m){killGhost();const g=safeClone(m);const gm=new THREE.MeshStandardMaterial({color:'#22C55E',transparent:true,opacity:.35,depthWrite:false});
  g.traverse(o=>{if(o.isMesh){o.material=gm;o.castShadow=false}if(o.type==='Sprite')o.visible=false});g.userData={};scene.add(g);BK.ghost=g;BK.gm=gm}
function killGhost(){if(BK.ghost)scene.remove(BK.ghost);BK.ghost=null}
ACTX.bklift=()=>liftPiece();
ACTX.bkrot=()=>{const m=BK.carry||MV.sel;const p=m&&pieceData(m);if(!p)return;p.r=((p.r||0)+2)%8;m.rotation.y=p.r*Math.PI/4;m.userData.col=null;if(BK.ghost)BK.ghost.rotation.y=m.rotation.y;if(!BK.carry)syncMoved(m);if(AU.on)SND.pop()};
ACTX.bkgrid=()=>{const opts=[0,1,.5,.25];BK.step=opts[(opts.indexOf(BK.step)+1)%opts.length];toast(BK.step?`📏 רשת: ${BK.step} מטר`:'📏 רשת אוטומטית: לפי גודל הצורה (מתיישרת מושלם)');renderTray()};
ACTX.bkundo=()=>{const u=BK.undo.pop();if(!u){toast('אין מה לבטל');return}
  if(u.t==='move'){const m=u.m;const p=m&&pieceData(m);if(!p||!OBJ.has(m.userData.key)){toast('אין מה לבטל');return}const[cx,cz]=ZC[u.zone];p.x=u.prev.x;p.y=u.prev.y;p.z=u.prev.z;p.r=u.prev.r;m.position.set(cx+p.x,p.y,cz+p.z);m.rotation.y=(p.r||0)*Math.PI/4;m.userData.col=null;syncMoved(m)}
  if(u.t==='add'){const m=OBJ.get(u.key);if(m)erase(m)}if(AU.on)tone(440,.08,'triangle',.06,null,null,.005,300);toast('↩️ בוטל')};
/* remember new pieces so they can be undone */
const _placeU=place;place=function(...a){const before=new Set(OBJ.keys());const r=_placeU.apply(this,a);for(const k of OBJ.keys())if(!before.has(k)){BK.undo.push({t:'add',key:k});if(BK.undo.length>30)BK.undo.shift()}return r};

/* ---------- tape measure ---------- */
ACTX.bkmeasure=()=>{if(MODE==='measure'){setMode(BK.prevMode||'walk');return}BK.prevMode=MODE;setMode('measure');BK.measure=[];toast('📐 נוגעים בשתי נקודות כדי למדוד את המרחק ביניהן')};
function clearMeasure(){if(BK.mline)scene.remove(BK.mline);BK.mline=null}
function measureTap(e){const rc=_rnd.getBoundingClientRect();_ndc.set(((e.clientX-rc.left)/rc.width)*2-1,-((e.clientY-rc.top)/rc.height)*2+1);_ray.setFromCamera(_ndc,camera);
  const hits=_ray.intersectObjects(pickTargets(),true);const pt=hits.length?hits[0].point.clone():_ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),0),new THREE.Vector3());if(!pt)return;
  if(BK.measure.length>=2){BK.measure=[];clearMeasure()}BK.measure.push(pt);if(AU.on)tone(880,.05,'square',.04);
  if(BK.measure.length===1){clearMeasure();const g=new THREE.Group();const d=mesh(new THREE.SphereGeometry(.12,10,8),mat('#F59E0B',{emissive:'#F59E0B',emissiveIntensity:.6}),false);d.position.copy(pt);g.add(d);scene.add(g);BK.mline=g;return}
  const[a,b]=BK.measure;const len=a.distanceTo(b);const g=BK.mline||new THREE.Group();const d2=mesh(new THREE.SphereGeometry(.12,10,8),mat('#F59E0B',{emissive:'#F59E0B',emissiveIntensity:.6}),false);d2.position.copy(b);g.add(d2);
  const t=mesh(new THREE.CylinderGeometry(.04,.04,len,6),mat('#FACC15',{emissive:'#EAB308',emissiveIntensity:.5}),false);t.position.copy(a).add(b).multiplyScalar(.5);t.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());g.add(t);
  const m=Math.round(len*10)/10;const lb=label(`📐 ${m} m`,'#F59E0B','#FFFFFF',.5);lb.position.copy(t.position).add(new THREE.Vector3(0,.6,0));g.add(lb);if(!BK.mline){scene.add(g);BK.mline=g}
  const whole=Math.floor(m),dec=Math.round((m-whole)*10);say(`${NUMW20[whole]||whole}${dec?' point '+NUMW20[dec]:''} meters`);toast(`📐 ${m} מטר`)}
const _tapB=tap;tap=function(e){if(MODE==='measure'){measureTap(e);return}if(BK.carry){dropPiece();return}_tapB(e)};
const _setModeB=setMode;setMode=function(m){if(m!=='measure'){clearMeasure();BK.measure=[]}_setModeB(m)};

/* ---------- tool belt in the tray, and a 🤲 button by the joystick ---------- */
const BUILDZ=['island','home','city','work'];
const _renderTrayB=renderTray;renderTray=function(){_renderTrayB();const t=$('#tray');if(!t||MODE!=='build'||!BUILDZ.includes(ME.zone))return;
  if(!t.querySelector('.belt'))t.insertAdjacentHTML('beforeend',`<div class="belt"><button class="btn mini ghost" data-a="bkundo">↩️ ביטול פעולה</button><button class="btn mini ghost ${MODE==='measure'?'on':''}" data-a="bkmeasure">📐 למדוד</button><span class="sub">👆 נוגעים בקרקע, על צורה (לבנות מעליה) או בצד שלה (לבנות לידה)</span></div>`)};
/* one rule for where a piece goes: on the ground on a grid of its own size, exactly on top of a piece, or exactly beside it */
function alignedSpot(h,root,zone,s,sz,self){const[cx,cz]=ZC[zone];const w=SIZES[sz]?SIZES[sz][0]:1;let half=w/2,hh=hOf(s,sz)/2;const isItem=self&&self.userData.item;
  if(self){const sc=pieceCol(self);half=Math.max(sc.hx,sc.hz);hh=(sc.top-sc.bottom)/2}const lift=v=>isItem?v:v+hh;
  if(root&&root.userData&&root.userData.piece&&root!==self){const c=pieceCol(root);const bx=root.position.x+c.cx,bz=root.position.z+c.cz;const n=surfaceNormal(h);
    if(n.y>.6)return{x:bx-cx,z:bz-cz,y:lift(c.top)};
    if(Math.abs(n.x)>=Math.abs(n.z)){const sg=Math.sign(n.x)||1;return{x:bx-cx+sg*(c.hx+half),z:bz-cz,y:lift(c.bottom)}}
    const sg=Math.sign(n.z)||1;return{x:bx-cx,z:bz-cz+sg*(c.hz+half),y:lift(c.bottom)}}
  const g=BK.step||w;const x=Math.round((h.point.x-cx)/g)*g,z=Math.round((h.point.z-cz)/g)*g;let sup=0;
  for(const o of OBJ.values()){if(o===self||o.userData.zone!==zone||o.userData.grow)continue;const oc=pieceCol(o);if(Math.abs(cx+x-(o.position.x+oc.cx))<oc.hx+half-.06&&Math.abs(cz+z-(o.position.z+oc.cz))<oc.hz+half-.06&&oc.top>sup)sup=oc.top}
  return{x,z,y:lift(sup)}}
function updateHands(){const acts=document.querySelector('#pad .acts');if(!acts)return;let b=$('#bHands');if(!b){b=document.createElement('button');b.id='bHands';b.className='act hands';acts.appendChild(b);
    b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();liftPiece()})}
  const show=!!BK.carry||(BUILDZ.includes(ME.zone)&&!!BK.near&&!['build','move','erase','item'].includes(MODE));b.hidden=!show;b.innerHTML=BK.carry?'⬇️<small>להניח</small>':'🤲<small>להרים</small>';b.classList.toggle('on',!!BK.carry)}
window.addEventListener('keydown',e=>{if(e.code==='KeyE'&&!e.repeat&&!$('#hudBot').hidden&&!(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName)))liftPiece()});
/* grid on the ground while building */
(()=>{const g=new THREE.GridHelper(12,24,'#FFFFFF','#FFFFFF');g.material.transparent=true;g.material.opacity=.35;g.visible=false;scene.add(g);BK.grid=g})();
function stepBuilder(dt,t){BK.hint-=dt;if(BK.hint<=0){BK.hint=.3;const n=BK.carry?null:(BUILDZ.includes(ME.zone)&&$('#sheet').hidden?nearestOwnPiece():null);if(!!n!==!!BK.near){BK.near=n;updateHands()}BK.near=n}
  const m=BK.carry;if(m){const a=ME.obj.rotation.y;const c=pieceCol(m);const h=c.top-c.bottom;m.position.set(ME.pos.x+Math.sin(a)*(ME_R+.25+Math.max(c.hx,c.hz)*.6),ME.y+1.25+h*.15+Math.sin(t*6)*.03,ME.pos.z+Math.cos(a)*(ME_R+.25+Math.max(c.hx,c.hz)*.6));
    const L=ME.obj.userData.limbs;if(L){L.arms[0].rotation.x=L.arms[1].rotation.x=-1.4}
    if(BK.ghost){const G=landingFor(m);BK.ghost.position.set(G.wx,G.y,G.wz);BK.ghost.rotation.y=m.rotation.y;BK.gm.color.set(G.ok?'#22C55E':'#EF4444')}}
  const show=(MODE==='build'||MODE==='move'||!!m)&&BUILDZ.includes(ME.zone);BK.grid.visible=show;if(show){const st=BK.step||(m?gridStep(m):1);const[cx,cz]=ZC[ME.zone];const sx=cx+Math.round((ME.pos.x-cx)/st)*st,sz=cz+Math.round((ME.pos.z-cz)/st)*st;BK.grid.position.set(sx,(ME.y||0)+.02,sz);BK.grid.scale.setScalar(st*2)}}
/* leaving a build zone while carrying puts the piece back */
const _teleportB=teleport;teleport=function(z,s){if(BK.carry){const m=BK.carry,p=pieceData(m),f=BK.from;if(p){const[cx,cz]=ZC[f.zone];p.x=f.x;p.y=f.y;p.z=f.z;m.position.set(cx+p.x,p.y,cz+p.z)}BK.carry=null;killGhost();updateHands()}_teleportB(z,s)};

/* tidy screen while building: only the joystick and jump stay */
setInterval(()=>{const b=['build','move','erase','item','room','door','measure'].includes(MODE)&&!$('#hudBot').hidden;document.body.classList.toggle('building',b)},300);
