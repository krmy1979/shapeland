/* Shapeland · a world by Shirel Yitzhak */
/* ===================== A SOLID WORLD: bump, push, talk, move what you built, feel every hit ===================== */
const ME_R=.35;let SOL=null;
function yawOf(o){const v=new THREE.Vector3(0,0,1).applyQuaternion(o.quaternion);return Math.atan2(v.x,v.z)}
function addBox(x,z,w,d,yaw,top){SOL.push({t:'box',x,z,hx:w/2,hz:d/2,c:Math.cos(yaw),s:Math.sin(yaw),top:top||9})}
function addCir(x,z,r,top){SOL.push({t:'cir',x,z,r,top:top||9})}
function buildColliders(){SOL=[];const town=new Set(BUILDINGS.map(b=>b.id));
  BLDG.forEach(g=>{g.updateMatrixWorld(true);const big=!town.has(g.userData.bld);addBox(g.position.x,g.position.z,big?5:4.4,big?3.8:3.4,yawOf(g),big?4:3.6)});
  if(typeof MALL!=='undefined'){MALL.updateMatrixWorld(true);addBox(MALL.position.x,MALL.position.z,12,8,yawOf(MALL),6)}
  if(typeof SCHOOL!=='undefined'){SCHOOL.updateMatrixWorld(true);addBox(SCHOOL.position.x,SCHOOL.position.z,10,6,yawOf(SCHOOL),4.4)}
  if(typeof TOWER!=='undefined')addCir(TOWER.position.x,TOWER.position.z,1.45,9);
  addCir(ZC.town[0],ZC.town[1],2.05,.7);addCir(-10,-180,2.25,.7);addCir(-21.5,-128,.95,4);addCir(56.5,-163,2.6,4);addCir(40,-195.5,1.3,9.6);
  PLATS.push({x0:-21.8,x1:-16.2,z0:-187.8,z1:-182.2,top:.5,stage:1})}
const TALKERS=()=>{const a=[];Object.entries(NPCOBJ).forEach(([id,g])=>{if(g.visible!==false)a.push({g,name:(NPCS.find(n=>n.id===id)||{}).name||id,go:()=>talkTo(id)})});
  WALKERS.forEach((w,i)=>a.push({g:w.g,name:w.name,walker:w,go:()=>talkWalker(i)}));
  EXTRA_PICK.concat(INPICK).forEach(o=>{if(o.userData&&o.userData.talker&&o.visible!==false)a.push({g:o,name:o.userData.talker,go:()=>o.userData.zact(o)})});return a};
/* own pieces you are allowed to push or move */
function pieceStore(u){if(!u||!u.piece)return null;if(u.zone==='island'&&u.scope===P.key)return P.pieces;if(u.zone==='home'&&u.scope==='H')return P.house.pieces;
  if(u.zone==='city'&&u.scope===P.key+'|c')return P.cpieces;if(u.zone==='work'&&u.scope==='W')return P.ws;return null}
function pieceData(m){const st=pieceStore(m.userData);return st?st.find(p=>p.id===m.userData.id):null}
const _bb=new THREE.Box3();
function pieceCol(m){const u=m.userData;if(u.col&&!u.grow)return u.col;_bb.setFromObject(m);const hx=(_bb.max.x-_bb.min.x)/2,hz=(_bb.max.z-_bb.min.z)/2;
  const c={r:Math.max(.2,Math.min(hx,hz)*.9+Math.abs(hx-hz)*.5),top:_bb.max.y,bottom:_bb.min.y,cx:(_bb.max.x+_bb.min.x)/2-m.position.x,cz:(_bb.max.z+_bb.min.z)/2-m.position.z};if(!u.grow)u.col=c;return c}
function pieceMass(m){const p=pieceData(m)||{};if(m.userData.item){const big=['sofa','bed','closet','castle','tower','robot','statue'].includes(p.c);return big?3:1.6}return{small:.4,medium:1,big:2.6}[p.sz]||1}
function strength(){return 1+((P.badges&&P.badges.strong)||0)*.18+(typeof powerStrength==='function'?powerStrength():0)}
function hitTest(x,z,y){try{return hitTest0(x,z,y)}catch(e){if(!window.__herr){window.__herr=1;console.warn('hit',e)}return null}}
function hitTest0(x,z,y){if(!SOL)buildColliders();const R0=ME_R;
  for(const s of SOL){if(y>=s.top-.05)continue;if(s.t==='cir'){if(Math.hypot(x-s.x,z-s.z)<s.r+R0)return{k:'solid',s}}else{const dx=x-s.x,dz=z-s.z;const lx=dx*s.c-dz*s.s,lz=dx*s.s+dz*s.c;if(Math.abs(lx)<s.hx+R0&&Math.abs(lz)<s.hz+R0)return{k:'solid',s}}}
  if(ME.zone==='inside'&&INROOM){for(const o of INPICK){if(!o.userData||o.userData.root!==o||o===INPICK[0])continue;const wp=o.getWorldPosition(new THREE.Vector3());if(o.userData.zact&&String(o.userData.zact).includes('leaveBuilding'))continue;
      if(Math.hypot(x-wp.x,z-wp.z)<(o.userData.talker?.45:.55)+R0)return o.userData.talker?{k:'char',o}:{k:'solid'}}}
  for(const tk of TALKERS()){const p=tk.g.position;if(tk.g.parent!==scene)continue;if(Math.hypot(x-p.x,z-p.z)<.45+R0&&y<1.6)return{k:'char',tk}}
  for(const m of OBJ.values()){if(m.userData.zone!==ME.zone&&!(m.userData.zone==='island'&&ME.zone==='island'))continue;const c=pieceCol(m);if(y>=c.top-.15||c.bottom>y+1.7)continue;if(typeof BK!=='undefined'&&m===BK.carry)continue;if(typeof STANDABLE!=='undefined'&&STANDABLE.has(pkind(m))&&c.top-y<=.56)continue;
    if(m.userData.big&&typeof inDoor==='function'&&inDoor(m,x,z,y))continue;
    if(m.userData.big?(Math.abs(x-(m.position.x+c.cx))<c.hx+R0&&Math.abs(z-(m.position.z+c.cz))<c.hz+R0):Math.hypot(x-(m.position.x+c.cx),z-(m.position.z+c.cz))<c.r+R0)return{k:'piece',m,c}}
  return null}
const PUSH={t:0,m:null,dirty:new Set(),saveT:0,warnT:0};
function tryPush(m,dx,dz){const c=pieceCol(m);const p=pieceData(m);
  if(!p||c.bottom>.25){return 0}
  for(const o of OBJ.values()){if(o===m||o.userData.zone!==m.userData.zone)continue;const oc=pieceCol(o);if(oc.bottom>=c.top-.15&&oc.bottom<=c.top+.2&&Math.hypot(o.position.x+oc.cx-(m.position.x+c.cx),o.position.z+oc.cz-(m.position.z+c.cz))<c.r+oc.r-.1){if(performance.now()-PUSH.warnT>2500){PUSH.warnT=performance.now();toast('🏗️ משהו בנוי עליו, אז הוא לא זז. אפשר להזיז עם ✋')}return 0}}
  const mass=pieceMass(m),S=strength();if(mass>S*2.6){if(performance.now()-PUSH.warnT>2500){PUSH.warnT=performance.now();toast('💪 זה כבד מדי! מתאמנים בחדר הכושר (Power Gym) כדי להיות חזקים יותר');say("It's too heavy!");SND&&SND.thud()}return 0}
  const f=clamp(S/mass,.12,1);const mx=dx*f,mz=dz*f;const nx=m.position.x+mx,nz=m.position.z+mz;
  // keep the piece inside where it may be built, and away from walls and other pieces
  const[cx,cz]=ZC[m.userData.zone];const lx=nx-cx,lz=nz-cz;const zn=m.userData.zone;
  const inside=zn==='island'?Math.hypot(lx,lz)<R-.6:zn==='home'?Math.hypot(lx,lz)<11.5:zn==='work'?Math.abs(lx)<1.4&&Math.abs(lz)<1.4:zn==='city'?(()=>{const pl=PLOTSC.find(q=>q.id===p.plot);return pl?Math.abs(lx-pl.x)<pl.w/2-.2&&Math.abs(lz-pl.z)<pl.d/2-.2:false})():false;
  if(!inside)return 0;
  for(const s of SOL){if(s.t==='cir'?Math.hypot(nx-s.x,nz-s.z)<s.r+c.r:(()=>{const ddx=nx-s.x,ddz=nz-s.z;const a=ddx*s.c-ddz*s.s,b=ddx*s.s+ddz*s.c;return Math.abs(a)<s.hx+c.r&&Math.abs(b)<s.hz+c.r})())return 0}
  for(const o of OBJ.values()){if(o===m||o.userData.zone!==zn)continue;const oc=pieceCol(o);if(oc.bottom>c.top)continue;if(Math.hypot(nx+c.cx-(o.position.x+oc.cx),nz+c.cz-(o.position.z+oc.cz))<oc.r+c.r-.05)return 0}
  m.position.x=nx;m.position.z=nz;p.x=+(nx-cx).toFixed(2);p.z=+(nz-cz).toFixed(2);m.userData.col=null;PUSH.dirty.add(m);PUSH.saveT=.5;
  PUSH.t-=1/60;if(PUSH.t<=0&&AU.on){PUSH.t=.11;hiss(.13,'bandpass',(m.userData.item?260:520)/Math.sqrt(mass),2.5,.11)}
  if(Math.random()<.15)fxBurst(m.position.x,.1,m.position.z,'#D6D3D1',3,1.2);return f}
function syncMoved(m){const p=pieceData(m);if(!p)return;const z=m.userData.zone;
  if(z==='island')emit('piece',{o:P.key,p:pack(p)});else if(z==='city')emit('piece',{o:P.key,zn:'city',p:pack(p)});else if(z==='home'&&VISITORS.size)sendHouse('*');save()}
/* the solid version of moving */
tryMove=function(dx,dz){const zone=ME.zone;const y=ME.y;
  const ok=(x,z)=>{_np.set(x,0,z);const zz=zoneAt(x,z);if(!zz)return false;
    if(!OUTZ.includes(zone)&&zone!=='bridge'&&zz!==zone)return false;if(OUTZ.includes(zone)&&!OUTZ.includes(zz)&&zz!=='bridge')return false;
    const f=floorAt(x,z);const up=f.h-ME.y;if(up>.55&&!(ME.swim&&up<1.6)&&!ME.flying&&!f.piece)return false;if(!walkable(_np,zz))return false;
    const h=hitTest(x,z,y);if(!h)return true;
    if(h.k==='piece'&&!ME.flying&&!ME.swim){const st=pieceStore(h.m.userData);if(st){let f2=0;try{f2=tryPush(h.m,dx,dz)}catch(e){f2=0};if(f2>0){PUSH.scale=f2;return'push'}}else bumpNote('piece',h.m)}
    if(h.k==='char')bump(h.tk||null,h.o||null);if(h.k==='solid'&&Math.hypot(dx,dz)>.04)bumpWall();return false};
  let nx=ME.pos.x+dx,nz=ME.pos.z+dz;PUSH.scale=1;let r=ok(nx,nz);
  if(r==='push'){nx=ME.pos.x+dx*PUSH.scale;nz=ME.pos.z+dz*PUSH.scale;if(hitTest(nx,nz,y))return false}
  else if(!r){if(ok(ME.pos.x+dx,ME.pos.z)===true){nz=ME.pos.z}else if(ok(ME.pos.x,ME.pos.z+dz)===true){nx=ME.pos.x}else return false}
  const mx=nx-ME.pos.x,mz=nz-ME.pos.z;ME.pos.x=nx;ME.pos.z=nz;camera.position.x+=mx;camera.position.z+=mz;controls.target.x+=mx;controls.target.z+=mz;
  const zz=zoneAt(ME.pos.x,ME.pos.z);if(OUTZ.includes(zz)&&zz!==ME.zone){ME.zone=zz;renderLoc();renderBar();renderTray();pushPresence(true)}checkDoors();return true};
function solidBlock(x,z){const h=hitTest(x,z,ME.y);return h&&h.k!=='piece'?h:(h&&h.k==='piece'?h:null)}
let bumpT=0,wallT=0;
function bump(tk,o){if(performance.now()-bumpT<1800)return;bumpT=performance.now();const nm=tk?tk.name:(o&&o.userData.talker)||'';
  say(pick(['Oops! Excuse me!','Hi there!','Sorry!','Hello!']));if(AU.on)tone(330,.08,'sine',.08);
  if(tk&&tk.walker){tk.walker.pause=3}const g=tk?tk.g:o;if(g){const a=Math.atan2(ME.pos.x-g.position.x,ME.pos.z-g.position.z);g.userData.faceT=1.2;g.userData.faceA=a}TALK.flash=1.5}
function bumpWall(){if(performance.now()-wallT<900)return;wallT=performance.now();if(AU.on)tone(90,.08,'sine',.08)}
function bumpNote(kind,m){if(performance.now()-PUSH.warnT<3000)return;PUSH.warnT=performance.now();toast('🧱 את מה שחברים בנו אי אפשר להזיז');if(AU.on)tone(110,.08,'sine',.08)}

/* ---------- 💬 talk button when someone is close ---------- */
const TALK={el:null,tk:null,flash:0};
(()=>{const b=document.createElement('button');b.id='talkBtn';b.className='talkbtn';b.hidden=true;document.body.appendChild(b);TALK.el=b;
  b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(TALK.tk){TALK.tk.go();if(AU.on)SND.click()}})})();
function stepTalk(){const playing=!$('#hudBot').hidden;let best=null,bd=2.4;if(playing&&$('#sheet').hidden&&ME.obj){for(const tk of TALKERS()){if(tk.g.parent!==scene&&!(INROOM&&tk.g.parent===INROOM))continue;const p=tk.g.getWorldPosition(_np);const d=Math.hypot(ME.pos.x-p.x,ME.pos.z-p.z);if(d<bd){bd=d;best=tk}}}
  TALK.tk=best;const el=TALK.el;if(!best){if(!el.hidden)el.hidden=true;return}const txt=`💬 ${best.name}`;if(el.textContent!==txt)el.textContent=txt;if(el.hidden)el.hidden=false}

/* ---------- ✋ move mode: pick up what you built and put it anywhere ---------- */
const MV={sel:null,ring:null,drag:false,start:null};
(()=>{const r=mesh(new THREE.TorusGeometry(.7,.06,8,32),mat('#EE4F7C',{emissive:'#EE4F7C',emissiveIntensity:.6}),false);r.rotation.x=Math.PI/2;r.visible=false;scene.add(r);MV.ring=r})();
function mvSelect(m){if(MV.sel&&MV.sel!==m&&MV.sel.userData.liftY!==undefined){if(m===null&&MV.sel.position.y>MV.sel.userData.liftY+.2)MV.sel.position.y=MV.sel.userData.liftY;delete MV.sel.userData.liftY}MV.sel=m;MV.ring.visible=!!m;if(m){const c=pieceCol(m);MV.ring.scale.setScalar(Math.max(.6,c.r+.25));if(AU.on){SND.pop();tone(660,.08,'sine',.06)}say(m.userData.item?'Move it!':'Pick it up!')}renderTray()}
function mvPlace(m,x,z){const p=pieceData(m);if(!p)return false;const[cx,cz]=ZC[m.userData.zone];const lx=+(x-cx).toFixed(2),lz=+(z-cz).toFixed(2);const zn=m.userData.zone;
  const ok=zn==='island'?Math.hypot(lx,lz)<R-.4:zn==='home'?Math.hypot(lx,lz)<11.8:zn==='work'?Math.abs(lx)<1.4&&Math.abs(lz)<1.4:zn==='city'?(()=>{const pl=PLOTSC.find(q=>q.id===p.plot);return pl&&Math.abs(lx-pl.x)<pl.w/2-.2&&Math.abs(lz-pl.z)<pl.d/2-.2})():false;
  if(!ok){toast(zn==='city'?'מזיזים רק בתוך המגרש שלך':'זה כבר מחוץ לגבול');return false}
  m.position.x=cx+lx;m.position.z=cz+lz;p.x=lx;p.z=lz;m.userData.col=null;return true}
function mvCommit(){const m=MV.sel;if(!m)return;syncMoved(m);if(AU.on){SND.thud()}fxBurst(m.position.x,.1,m.position.z,'#E7E5E4',8,2)}
const _rnd=renderer.domElement,_ray=new THREE.Raycaster(),_ndc=new THREE.Vector2(),_gp=new THREE.Plane(new THREE.Vector3(0,1,0),0),_hit=new THREE.Vector3();
function groundAt(e){const rc=_rnd.getBoundingClientRect();_ndc.set(((e.clientX-rc.left)/rc.width)*2-1,-((e.clientY-rc.top)/rc.height)*2+1);_ray.setFromCamera(_ndc,camera);_gp.constant=-(MV.sel?Math.max(0,MV.sel.position.y-pieceCol(MV.sel).top+ (pieceCol(MV.sel).top-pieceCol(MV.sel).bottom)/2):0);return _ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),0),_hit)}
function moveTap(root,h){if(MV.sel&&root===MV.sel){mvSelect(null);return}
  if(!MV.sel){if(root&&root.userData&&root.userData.piece){if(!pieceStore(root.userData)){toast('🧱 אפשר להזיז רק מה שבנית בעצמך');return}mvSelect(root);toast('👆 עכשיו נוגעים איפה לשים: על הקרקע, על צורה או ליד צורה');return}
    toast('👆 נוגעים במשהו שבנית כדי להרים אותו');return}
  const m=MV.sel,p=pieceData(m);if(!p)return;const zn=m.userData.zone;const A=alignedSpot(h,root&&root.userData&&root.userData.piece?root:null,zn,p.s==='item'?'box':p.s,p.sz,m);
  const[cx,cz]=ZC[zn];const prev={x:p.x,y:p.y,z:p.z,r:p.r};const ox=m.position.x,oz=m.position.z,oy=m.position.y;
  m.position.y=-50;if(!mvPlace(m,cx+A.x,cz+A.z)){m.position.y=oy;return}delete m.userData.liftY;m.position.y=A.y;p.y=+A.y.toFixed(2);p.x=+A.x.toFixed(2);p.z=+A.z.toFixed(2);m.userData.col=null;
  if(typeof BK!=='undefined'){BK.undo.push({t:'move',m,id:p.id,zone:zn,prev});if(BK.undo.length>30)BK.undo.shift()}mvCommit();mvSelect(null)}
ACTX.mvrot=()=>{const m=MV.sel,p=m&&pieceData(m);if(!p)return;p.r=((p.r||0)+1)%8;m.rotation.y=p.r*Math.PI/4;m.userData.col=null;syncMoved(m);if(AU.on)SND.pop()};
ACTX.mvup=d=>{const m=MV.sel,p=m&&pieceData(m);if(!p)return;const dy=d.v==='up'?.25:-.25;const c=pieceCol(m);const half=(c.top-c.bottom)/2;const minY=m.userData.item?0:half;
  p.y=+clamp(p.y+dy,minY,8).toFixed(2);m.position.y=p.y;m.userData.col=null;syncMoved(m);if(AU.on)tone(d.v==='up'?700:400,.07,'sine',.06)};
ACTX.mvdone=()=>{mvSelect(null);setMode(ME.zone==='work'?'build':'walk')};
const _setMode=setMode;setMode=function(m){if(m!=='move'&&MV.sel)mvSelect(null);_setMode(m);if(m==='move')toast('✋ נוגעים בצורה שבנית כדי להרים אותה, ואז נוגעים איפה לשים')};
const _renderTray=renderTray;renderTray=function(){_renderTray();const t=$('#tray');if(MODE!=='move'||!t)return;t.hidden=false;
  t.innerHTML=MV.sel?`<p class="sub" style="margin:0;text-align:center">👆 נוגעים איפה לשים אותה: על הקרקע, על צורה (מעליה) או בצד של צורה (לידה)</p><div class="row" style="justify-content:center"><button class="btn mini" data-a="mvrot">🔄 לסובב</button><button class="btn mini ghost" data-a="mvcancel">✖ לבטל</button></div>`
    :`<p class="sub" style="margin:0;text-align:center">✋ נוגעים בצורה שבנית כדי להרים אותה</p><div class="row" style="justify-content:center"><button class="btn mini ghost" data-a="bkundo">↩️ ביטול פעולה</button></div>`};
ACTX.mvcancel=()=>mvSelect(null);
const _renderBar=renderBar;renderBar=function(){_renderBar();const bar=$('#bar');if(!bar||bar.querySelector('[data-v="move"]'))return;const b=bar.querySelector('[data-v="build"]');if(!b||ME.zone==='visit')return;
  b.insertAdjacentHTML('afterend',`<button class="tool" data-a="mode" data-v="move" aria-pressed="${MODE==='move'}"><span>✋</span>להזיז</button>`)};
TOOLS.move=['✋','להזיז'];
const _tap=tap;tap=function(e){if(MODE==='move'){const rc=_rnd.getBoundingClientRect();_ndc.set(((e.clientX-rc.left)/rc.width)*2-1,-((e.clientY-rc.top)/rc.height)*2+1);_ray.setFromCamera(_ndc,camera);
  const hits=_ray.intersectObjects(pickTargets(),true).filter(x=>!MV.sel||!(x.object.userData.root===MV.sel||x.object===MV.sel));const hh=hits[0];const root=hh?(hh.object.userData.root||hh.object):null;
  if(!MV.sel&&!(root&&root.userData&&root.userData.piece)){const all=_ray.intersectObjects([...OBJ.values()],true);if(all.length){const r2=all[0].object.userData.root||all[0].object;moveTap(r2,all[0]);return}}
  if(MV.sel&&!hh){toast('נוגעים על הקרקע או על צורה');return}moveTap(root,hh);return}_tap(e)};

/* ---------- feel it: shake, particles, a tiny freeze on big hits ---------- */
const FX=[];let SHAKE={t:0,a:0};window.HITSTOP=0;
function shake(a,t){SHAKE.a=Math.max(SHAKE.a,a);SHAKE.t=Math.max(SHAKE.t,t||.25)}
function hitStop(ms){window.HITSTOP=Math.max(window.HITSTOP,ms/1000)}
function fxBurst(x,y,z,color,n,sp){for(let i=0;i<(n||10);i++){const s=mesh(new THREE.SphereGeometry(.07+Math.random()*.06,6,4),mat(color,{transparent:true,opacity:.95}),false);s.position.set(x,y,z);scene.add(s);
  const a=Math.random()*Math.PI*2,v=(sp||3)*(.5+Math.random());FX.push({s,vx:Math.cos(a)*v,vz:Math.sin(a)*v,vy:2+Math.random()*3,life:.6+Math.random()*.3})}}
function floatText(txt,color){const d=document.createElement('div');d.className='floattxt';d.textContent=txt;d.style.color=color||'#FDE047';document.body.appendChild(d);setTimeout(()=>d.remove(),900)}
let fallV=0,phyInit=false;
function stepPhysics(dt,t){if(!phyInit){phyInit=true;buildColliders()}
  FX.forEach(f=>{f.life-=dt;f.vy-=12*dt;f.s.position.x+=f.vx*dt;f.s.position.y=Math.max(.02,f.s.position.y+f.vy*dt);f.s.position.z+=f.vz*dt;f.s.material.opacity=Math.max(0,f.life*1.4);if(f.life<=0)scene.remove(f.s)});
  for(let i=FX.length-1;i>=0;i--)if(FX[i].life<=0)FX.splice(i,1);
  if(SHAKE.t>0){SHAKE.t-=dt;const k=SHAKE.a*Math.max(0,SHAKE.t)*4;camera.position.x+=(Math.random()-.5)*k;camera.position.y+=(Math.random()-.5)*k}
  if(window.HITSTOP>0)window.HITSTOP-=dt/.15;
  // big landings shake the ground
  if(ME.air){fallV=Math.min(fallV,ME.vy)}else{if(fallV<-10){shake(.35,.3);fxBurst(ME.pos.x,.1,ME.pos.z,'#E7E5E4',12,2.5);if(AU.on)tone(60,.25,'sine',.25)}fallV=0}
  if(PUSH.saveT>0){PUSH.saveT-=dt;if(PUSH.saveT<=0){PUSH.dirty.forEach(syncMoved);PUSH.dirty.clear()}}
  if(MV.sel){if(MV.sel.userData.liftY===undefined)MV.sel.userData.liftY=MV.sel.position.y;MV.sel.position.y=MV.sel.userData.liftY+.35+Math.sin(t*5)*.08;const c=pieceCol(MV.sel);MV.ring.position.set(MV.sel.position.x+c.cx,Math.max(.05,c.bottom+.03),MV.sel.position.z+c.cz);MV.ring.rotation.z=t*2;if(!OBJ.has(MV.sel.userData.key))mvSelect(null)}
  // characters turn to look at you after a bump
  TALKERS().forEach(tk=>{const g=tk.g;if(g.userData.faceT>0){g.userData.faceT-=dt;g.rotation.y+=(g.userData.faceA-g.rotation.y)*.2}});
  stepTalk()}
/* hook the juice into existing moments */
const _slimeSplash=slimeSplash;slimeSplash=function(){_slimeSplash();shake(.4,.35);fxBurst(ME.pos.x,.3,ME.pos.z,'#84CC16',16,3)};
const _addGemsFx=addGems;addGems=function(n,he,enw){_addGemsFx(n,he,enw);if(n>0&&ME.obj){fxBurst(ME.pos.x,ME.y+1.6,ME.pos.z,'#FACC15',Math.min(18,4+n),1.6);floatText('+'+n+' 💎')}};
