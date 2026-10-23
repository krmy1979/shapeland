/* Shapeland · a world by Shirel Yitzhak */
/* ===================== LOOP ===================== */
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
window.addEventListener('resize',resize);resize();
const clock=new THREE.Clock();const tmpV=new THREE.Vector3();
function loop(){const dt=Math.min(clock.getDelta(),.05)*(window.HITSTOP>0?.15:1),t=clock.elapsedTime;
  let mv0=null;if(ME.obj){const mv=controlStep(dt);mv0=mv;let moving=mv.moving;const tgt=mv.moving?null:ME.path[0];if(tgt){const dx=tgt.x-ME.pos.x,dz=tgt.z-ME.pos.z,dist=Math.hypot(dx,dz);
      if(dist<.08){ME.path.shift();const z=zoneAt(ME.pos.x,ME.pos.z);if(z&&z!==ME.zone&&OUTZ.includes(z)){ME.zone=z;renderLoc();renderBar();renderTray()}}
      else{moving=true;const st=Math.min(dist,4.6*dt);const sb=typeof hitTest==='function'?hitTest(ME.pos.x+dx/dist*st,ME.pos.z+dz/dist*st,ME.y):null;if(sb&&sb.k!=='piece'){if(sb.k==='char')bump(sb.tk||null,sb.o||null);ME.path=[]}else if(sb&&sb.k==='piece'){if(!tryMove(dx/dist*st,dz/dist*st))ME.path=[]}else{ME.pos.x+=dx/dist*st;ME.pos.z+=dz/dist*st}ME.obj.rotation.y=Math.atan2(dx,dz);pushPresence();
        const z=zoneAt(ME.pos.x,ME.pos.z);if(OUTZ.includes(z)&&z!==ME.zone){ME.zone=z;renderLoc();renderBar();renderTray()}if(!ME.path.length||dist<.3)checkDoors()}
      controls.target.lerp(tmpV.set(ME.pos.x,0,ME.pos.z),.05)}
    const human=!!ME.obj.userData.limbs;ME.obj.position.y=ME.y+(moving&&!ME.air&&!ME.swim&&!mv.roll?Math.abs(Math.sin(t*(mv.run?15:11)))*(human?.05:.12):0);
    if(!mv.roll)animLimbs(ME.obj,t,moving&&!ME.air&&!P.riding&&!ME.swim,mv.run?15:10);if(ME.flying){}else if(ME.swim&&human){const L=ME.obj.userData.limbs;L.arms[0].rotation.x=t*6;L.arms[1].rotation.x=t*6+Math.PI;L.legs[0].rotation.x=Math.sin(t*12)*.3;L.legs[1].rotation.x=-Math.sin(t*12)*.3}
    else if(ME.air&&human&&!ME.glide){const L=ME.obj.userData.limbs;L.arms[0].rotation.x=L.arms[1].rotation.x=-2.6;L.legs[0].rotation.x=.5;L.legs[1].rotation.x=-.3}
    ME.obj.position.x=ME.pos.x;ME.obj.position.z=ME.pos.z;
    if(ME.pet){const bx=ME.pos.x-Math.sin(ME.obj.rotation.y)*.9+Math.cos(ME.obj.rotation.y)*.6,bz=ME.pos.z-Math.cos(ME.obj.rotation.y)*.9-Math.sin(ME.obj.rotation.y)*.6;
      const dx=bx-ME.pet.position.x,dz=bz-ME.pet.position.z;const dd=Math.hypot(dx,dz);if(dd>12){ME.pet.position.set(bx,0,bz)}else if(dd>.05){ME.pet.position.x+=dx*.08;ME.pet.position.z+=dz*.08;ME.pet.rotation.y=Math.atan2(dx,dz);ME.pet.position.y=Math.abs(Math.sin(t*14))*.08}else ME.pet.position.y=0}}
  sun.position.set(controls.target.x+12,24,controls.target.z+10);sun.target.position.copy(controls.target);
  NET.avatars.forEach(a=>{if(a.tx==null||!a.obj.visible)return;const o=a.obj,dx=a.tx-o.position.x,dz=a.tz-o.position.z,dd=Math.hypot(dx,dz);if(dd>.03){o.position.x+=dx*.15;o.position.z+=dz*.15;o.rotation.y=Math.atan2(dx,dz);o.position.y=(a.ty||0)+(a.ty?0:Math.abs(Math.sin(t*12))*(o.userData.limbs?.05:.1));animLimbs(o,t,!a.ty)}else{o.position.y+=((a.ty||0)-o.position.y)*.2;animLimbs(o,t,false)}});
  OBJ.forEach(m=>{const g=m.userData.grow;if(g){const s=m.scale.x+(g-m.scale.x)*.25;m.scale.setScalar(s);if(Math.abs(g-s)<.01){m.scale.setScalar(g);m.userData.grow=0}}});
  Object.values(NPCOBJ).forEach((g,i)=>{g.userData.mk.position.y=3.35+Math.sin(t*3+i)*.12;if(g.userData.limbs)g.children[0].scale.y=1+Math.sin(t*2+i)*.015;else g.children[0].scale.y=1.2+Math.sin(t*2+i)*.025});
  CHESTS.forEach((c,i)=>{c.userData.mk.position.y=1.4+Math.sin(t*3+i*2)*.1});
  SIGN.userData.spin.rotation.y=t*1.5;const fp=FLAG.userData.flag.geometry.attributes.position;for(let i=0;i<fp.count;i++){const x=fp.getX(i);fp.setZ(i,Math.sin(x*4+t*5)*.08*(x+.7))}fp.needsUpdate=true;
  const pgr=(t%12)>7.5;if(pgr!==PEDGREEN)setLights(pgr);
  CARS.forEach(c=>{let z=c.g.position.z-CZ;const stop=PEDGREEN&&((c.dir>0&&z>c.cw-3.4&&z<c.cw-1.6)||(c.dir<0&&z<c.cw+3.4&&z>c.cw+1.6));if(!stop){z+=c.dir*c.speed*dt;if(z>24.5)z=-24.5;if(z<-24.5)z=24.5}c.g.position.z=CZ+z});
  WALKERS.forEach(w=>{if(w.pause>0){w.pause-=dt;w.g.position.y=0;animLimbs(w.g,t,false);return}animLimbs(w.g,t+w.i,true,8);const tg=w.path[w.i];const dx=CX+tg[0]-w.g.position.x,dz=CZ+tg[1]-w.g.position.z,dd=Math.hypot(dx,dz);
    if(dd<.1)w.i=(w.i+1)%w.path.length;else{const st=Math.min(dd,1.3*dt);w.g.position.x+=dx/dd*st;w.g.position.z+=dz/dd*st;w.g.rotation.y=Math.atan2(dx,dz);w.g.position.y=Math.abs(Math.sin(t*9+w.i))*.04}});
  BOATS.forEach((b,i)=>{b.position.y=Math.sin(t*1.5+i)*.06;b.rotation.z=Math.sin(t*1.2+i)*.05});
  if(P.tour&&ME.zone==='city'&&ME.obj){const tm=NPCOBJ.tom,ry=ME.obj.rotation.y;const bx=ME.pos.x-Math.sin(ry)*1.5,bz=ME.pos.z-Math.cos(ry)*1.5;const dx=bx-tm.position.x,dz=bz-tm.position.z,dd=Math.hypot(dx,dz);
    if(dd>.15){tm.position.x+=dx*.06;tm.position.z+=dz*.06;tm.rotation.y=Math.atan2(dx,dz)}const a=ANCHORS[P.tour.dest];if(a&&Math.hypot(ME.pos.x-CX-a[0],ME.pos.z-CZ-a[1])<5.5)tourDone()}
  try{stepZones(dt,t);stepAdventure(dt,t);stepExplorer(dt,t)}catch(e){if(!window.__lerr2){window.__lerr2=1;console.warn('zones',e)}}
  water.position.y=-1.6+Math.sin(t*.8)*.05;
  for(const f of[()=>stepPowers(dt,t),()=>stepAction(dt,t),()=>stepPhysics(dt,t),()=>stepElements(dt,t),()=>stepHeroes(dt,t),()=>stepAudio(dt,mv0),()=>stepCamera(dt)]){try{f()}catch(e){if(!window.__lerr){window.__lerr=1;console.warn('step',e)}}}renderer.render(scene,camera);requestAnimationFrame(loop)}
