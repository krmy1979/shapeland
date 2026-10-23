/* Shapeland · a world by Shirel Yitzhak */
/* ===================== FREE LOOK: drag the screen to turn and tilt the camera =====================
   One finger (or the mouse) dragged on the world turns left/right and tilts up/down — all the way to the horizon.
   The camera moves ONLY while you drag; it never swings by itself. Two fingers still pinch to zoom. A tap is still a tap. */
(()=>{const el=renderer.domElement;const pts=new Map();let drag=null;
  const buildDraw=()=>MODE==='build'&&typeof BK!=='undefined'&&BK.big&&BK.big!=='pillar';
  el.addEventListener('pointerdown',e=>{pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size>1){drag=null;return}if(e.pointerType==='mouse'&&e.button!==0)return;if(buildDraw())return;
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false}});
  el.addEventListener('pointermove',e=>{if(pts.has(e.pointerId))pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(!drag||drag.id!==e.pointerId||pts.size>1)return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.hypot(dx,dy)<10)return;drag.moved=true;drag.x=e.clientX;drag.y=e.clientY;
    const sens=e.pointerType==='mouse'?.006:.009;CAM.wantYaw-=dx*sens;CAM.yaw-=dx*sens;CAM.pitch=clamp(CAM.pitch+dy*sens*.8,.06,1.35)});
  const up=e=>{pts.delete(e.pointerId);if(drag&&drag.id===e.pointerId)drag=null};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')up(e)});
  /* looking at the horizon: keep the camera above the ground when tilted low */
  const _stepCamD=stepCamera;stepCamera=function(dt){_stepCamD(dt);const fy=(typeof floorAt==='function'?0:0)+.5;if(camera.position.y<fy+.4){camera.position.y=fy+.4;camera.lookAt(controls.target)}}})();
