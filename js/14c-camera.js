/* Shapeland · a world by Shirel Yitzhak */
/* ===================== STEADY CAMERA: follows you, never swings by itself ===================== */
/* Dragging the screen no longer spins the world. Zoom with + / − (or pinch / mouse wheel), turn with ⟲ ⟳. */
const CAM={yaw:0,pitch:.72,dist:18,wantYaw:0,wantDist:18,min:4,max:34,ty:0};
controls.enabled=false;controls.enableDamping=false;
function camFromView(){const dx=camera.position.x-controls.target.x,dy=camera.position.y-controls.target.y,dz=camera.position.z-controls.target.z;const d=Math.hypot(dx,dy,dz)||18;
  CAM.dist=CAM.wantDist=clamp(d,CAM.min,CAM.max);CAM.pitch=clamp(Math.asin(dy/d),.35,1.25);CAM.yaw=CAM.wantYaw=Math.atan2(dx,dz)}
const _teleport=teleport;teleport=function(zone,spot){_teleport(zone,spot);CAM.min=zone==='work'?2.5:zone==='inside'?5:4;CAM.max=zone==='inside'?16:34;camFromView();
  if(OUTZ.includes(zone)||zone==='inside'){CAM.dist=CAM.wantDist=clamp(Math.min(CAM.dist,zone==='inside'?11:16),CAM.min,CAM.max)}}
function zoomBy(f){CAM.wantDist=clamp(CAM.wantDist*f,CAM.min,CAM.max)}
function turnBy(a){CAM.wantYaw+=a}
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();zoomBy(e.deltaY>0?1.12:1/1.12)},{passive:false});
(()=>{let pd=0;const el=renderer.domElement;
  el.addEventListener('touchstart',e=>{if(e.touches.length===2){pd=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)}},{passive:true});
  el.addEventListener('touchmove',e=>{if(e.touches.length===2&&pd){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(d>0){zoomBy(pd/d);pd=d}e.preventDefault()}},{passive:false});
  el.addEventListener('touchend',()=>{pd=0},{passive:true})})();
(()=>{const b=document.createElement('div');b.id='camBtns';b.className='hud';b.hidden=true;b.setAttribute('dir','ltr');
  b.innerHTML=`<button class="cb" data-cam="in" aria-label="להתקרב">＋</button><button class="cb" data-cam="out" aria-label="להתרחק">－</button><button class="cb" data-cam="l" aria-label="לסובב שמאלה">⟲</button><button class="cb" data-cam="r" aria-label="לסובב ימינה">⟳</button>`;
  document.body.appendChild(b);b.addEventListener('pointerdown',e=>{const c=e.target.closest('[data-cam]');if(!c)return;e.preventDefault();e.stopPropagation();const k=c.dataset.cam;
    if(k==='in')zoomBy(1/1.25);if(k==='out')zoomBy(1.25);if(k==='l')turnBy(Math.PI/4);if(k==='r')turnBy(-Math.PI/4);if(typeof SND!=='undefined')SND.click()})})();
const _cv=new THREE.Vector3();
function stepCamera(dt){const cb=$('#camBtns');const playing=!$('#hudBot').hidden;if(cb.hidden===playing)cb.hidden=!playing;if(!ME.obj||!playing)return;
  const k=Math.min(1,dt*8);CAM.yaw+=(CAM.wantYaw-CAM.yaw)*k;CAM.dist+=(CAM.wantDist-CAM.dist)*k;
  const fy=Math.max(0,ME.y*.85);CAM.ty+=(fy-CAM.ty)*Math.min(1,dt*3);
  const tx=ME.pos.x,tz=ME.pos.z;controls.target.x+=(tx-controls.target.x)*Math.min(1,dt*6);controls.target.z+=(tz-controls.target.z)*Math.min(1,dt*6);controls.target.y=CAM.ty+.6;
  const h=Math.cos(CAM.pitch)*CAM.dist;camera.position.set(controls.target.x+Math.sin(CAM.yaw)*h,controls.target.y+Math.sin(CAM.pitch)*CAM.dist,controls.target.z+Math.cos(CAM.yaw)*h);camera.lookAt(controls.target)}
