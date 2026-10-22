/* Shapeland · a world by Shirel Yitzhak */
/* ===================== JOYSTICK, JUMP, RUN, ROLL ===================== */
const PAD={x:0,y:0,run:false,jump:false,roll:false,keys:new Set(),shift:false};
ME.y=0;ME.vy=0;ME.rollT=0;ME.rollDir=new THREE.Vector3();
(function buildPad(){const el=document.createElement('div');el.id='pad';el.className='hud';el.hidden=true;el.setAttribute('dir','ltr');
  el.innerHTML=`<div class="joy" id="joy" aria-label="ג׳ויסטיק תנועה" role="application"><div class="knob" id="knob"></div></div>
  <div class="acts"><button class="act run" id="bRun" aria-pressed="false" aria-label="ריצה">🏃<small>ריצה</small></button>
    <button class="act roll" id="bRoll" aria-label="גלגול">🌀<small>גלגול</small></button>
    <button class="act jump" id="bJump" aria-label="קפיצה">⤴<small>קפיצה</small></button></div>`;
  document.body.appendChild(el);
  const joy=el.querySelector('#joy'),knob=el.querySelector('#knob');let pid=null;
  const setFrom=e=>{const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,max=r.width/2-14;let dx=e.clientX-cx,dy=e.clientY-cy;const d=Math.hypot(dx,dy);if(d>max){dx*=max/d;dy*=max/d}
    knob.style.transform=`translate(${dx}px,${dy}px)`;PAD.x=dx/max;PAD.y=dy/max};
  joy.addEventListener('pointerdown',e=>{pid=e.pointerId;joy.setPointerCapture(pid);joy.classList.add('on');setFrom(e);e.preventDefault()});
  joy.addEventListener('pointermove',e=>{if(e.pointerId===pid)setFrom(e)});
  const end=e=>{if(e.pointerId!==pid)return;pid=null;PAD.x=PAD.y=0;knob.style.transform='';joy.classList.remove('on')};
  joy.addEventListener('pointerup',end);joy.addEventListener('pointercancel',end);
  const tapBtn=(id,fn)=>el.querySelector(id).addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();fn()});
  tapBtn('#bJump',()=>PAD.jump=true);tapBtn('#bRoll',()=>PAD.roll=true);
  tapBtn('#bRun',()=>{PAD.run=!PAD.run;el.querySelector('#bRun').setAttribute('aria-pressed',PAD.run);if(PAD.run)toast('🏃 מצב ריצה')});
  const hb=$('#hudBot');const fit=()=>el.style.setProperty('--padb',(hb.hidden?10:hb.offsetHeight+18)+'px');
  if(window.ResizeObserver)new ResizeObserver(fit).observe(hb);fit();setInterval(fit,1500)})();
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'||t.isContentEditable)};
const KMAP={ArrowUp:'u',KeyW:'u',ArrowDown:'d',KeyS:'d',ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r'};
window.addEventListener('keydown',e=>{if(typing(e)||$('#hudBot').hidden)return;if(KMAP[e.code]){PAD.keys.add(KMAP[e.code]);e.preventDefault()}
  if(e.code==='Space'){PAD.jump=true;e.preventDefault()}if(e.code==='ShiftLeft'||e.code==='ShiftRight')PAD.shift=true;if(e.code==='KeyQ'||e.code==='KeyE')PAD.roll=true});
window.addEventListener('keyup',e=>{if(KMAP[e.code])PAD.keys.delete(KMAP[e.code]);if(e.code==='ShiftLeft'||e.code==='ShiftRight')PAD.shift=false});
window.addEventListener('blur',()=>{PAD.keys.clear();PAD.shift=false});
const _f=new THREE.Vector3(),_r=new THREE.Vector3(),_mv=new THREE.Vector3(),_np=new THREE.Vector3();
function tryMove(dx,dz){const zone=ME.zone;const ok=(x,z)=>{_np.set(x,0,z);const zz=zoneAt(x,z);if(!zz)return false;
    if(!OUTZ.includes(zone)&&zone!=='bridge'&&zz!==zone)return false;if(OUTZ.includes(zone)&&!OUTZ.includes(zz)&&zz!=='bridge')return false;return walkable(_np,zz)};
  let nx=ME.pos.x+dx,nz=ME.pos.z+dz;if(!ok(nx,nz)){if(ok(ME.pos.x+dx,ME.pos.z)){nz=ME.pos.z}else if(ok(ME.pos.x,ME.pos.z+dz)){nx=ME.pos.x}else return false}
  const mx=nx-ME.pos.x,mz=nz-ME.pos.z;ME.pos.x=nx;ME.pos.z=nz;camera.position.x+=mx;camera.position.z+=mz;controls.target.x+=mx;controls.target.z+=mz;
  const z=zoneAt(ME.pos.x,ME.pos.z);if(OUTZ.includes(z)&&z!==ME.zone){ME.zone=z;renderLoc();renderBar();renderTray();pushPresence(true)}checkDoors();return true}
function controlStep(dt){const out={moving:false,run:false};const pad=$('#pad');const playing=!$('#hudBot').hidden;if(pad.hidden===playing)pad.hidden=!playing;
  if(!playing)return out;const busy=!$('#sheet').hidden;
  let ix=PAD.x,iy=PAD.y;if(PAD.keys.size){ix=(PAD.keys.has('r')?1:0)-(PAD.keys.has('l')?1:0);iy=(PAD.keys.has('d')?1:0)-(PAD.keys.has('u')?1:0)}
  const mag=Math.min(1,Math.hypot(ix,iy));const grounded=ME.y<=0.001;
  if(busy){ix=iy=0;PAD.jump=PAD.roll=false}
  /* jump */
  if(PAD.jump){PAD.jump=false;if(grounded&&ME.rollT<=0){ME.vy=7.2;blip(520,.08,'sine',.04);setTimeout(()=>blip(700,.08,'sine',.035),70)}}
  ME.vy-=20*dt;ME.y=Math.max(0,ME.y+ME.vy*dt);if(ME.y===0)ME.vy=0;
  /* direction relative to camera */
  _f.set(controls.target.x-camera.position.x,0,controls.target.z-camera.position.z).normalize();_r.set(-_f.z,0,_f.x);
  _mv.set(0,0,0);if(mag>.12){_mv.addScaledVector(_f,-iy).addScaledVector(_r,ix);if(_mv.lengthSq()>0)_mv.normalize()}
  /* roll */
  if(PAD.roll){PAD.roll=false;if(ME.rollT<=0&&grounded){ME.rollT=.55;ME.rollDir.set(Math.sin(ME.obj.rotation.y),0,Math.cos(ME.obj.rotation.y));if(_mv.lengthSq())ME.rollDir.copy(_mv);blip(300,.15,'triangle',.05)}}
  const rig=ME.obj.userData.limbs&&ME.obj.userData.limbs.rig;
  if(ME.rollT>0){ME.rollT-=dt;const k=1-Math.max(0,ME.rollT)/.55;if(rig){rig.rotation.x=k*Math.PI*2;rig.position.y=.85-Math.sin(k*Math.PI)*.35}
    ME.path=[];tryMove(ME.rollDir.x*9*dt,ME.rollDir.z*9*dt);ME.obj.rotation.y=Math.atan2(ME.rollDir.x,ME.rollDir.z);if(ME.rollT<=0&&rig){rig.rotation.x=0;rig.position.y=.85}
    pushPresence();out.moving=true;out.roll=true;return out}
  if(_mv.lengthSq()>0){ME.path=[];const run=PAD.run||PAD.shift;const sp=(P.riding?10.5:run?8.2:4.6)*Math.max(.45,mag);tryMove(_mv.x*sp*dt,_mv.z*sp*dt);
    const want=Math.atan2(_mv.x,_mv.z);let d=want-ME.obj.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));ME.obj.rotation.y+=d*Math.min(1,dt*14);
    pushPresence();out.moving=true;out.run=run}
  return out}
