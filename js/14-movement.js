/* Shapeland · a world by Shirel Yitzhak */
/* ===================== MOVEMENT & ZONES ===================== */
function zoneAt(x,z){if(Math.hypot(x,z)<R+1)return'island';if(Math.hypot(x-ZC.town[0],z-ZC.town[1])<TR+1)return'town';if(Math.abs(x)<1.6&&z<-12&&z>-34)return'bridge';
  {const lx=x-ZC.city[0],lz=z-ZC.city[1];if(lx>-24.5&&lx<32.5&&Math.abs(lz)<25.5)return'city'}
  for(const k of['home','visit','work']){const[cx,cz]=ZC[k];if(Math.hypot(x-cx,z-cz)<14)return k}return null}
const ZNAME={city:'אשקלון',island:'האי של שיראל',town:'Shapeland Town',home:'הבית שלי',visit:'בבית של חבר/ה',work:'סדנת רהיטים'};
function setAtmos(zone){const inside=zone==='home'||zone==='visit'||zone==='work';const c=inside?'#F6E7FF':'#9FD6FF';scene.background.set(c);scene.fog.color.set(c);scene.fog.near=inside?22:50;scene.fog.far=inside?60:120;water.visible=!inside}
function teleport(zone,spot){const[cx,cz]=ZC[zone];ME.zone=zone;ME.path=[];
  const sp=spot||{island:[0,3],town:[0,11],home:[0,6.2],visit:[0,6.2],work:[0,2.4],city:[-12.5,-3.5]}[zone];ME.pos.set(cx+sp[0],0,cz+sp[1]);
  const tgx=zone==='city'?cx+sp[0]:cx,tgz=zone==='city'?cz+sp[1]:cz+(zone==='work'?0:zone==='town'?2:1);controls.target.set(tgx,0,tgz);const off={island:[0,13,20],town:[0,15,22],home:[0,13,14],visit:[0,13,14],work:[0,4.5,5.5],city:[6,15,16]}[zone];
  camera.position.set(tgx+off[0],off[1],(zone==='city'?tgz:cz)+off[2]);controls.minDistance=zone==='work'?2.5:4;setAtmos(zone);
  if(ME.obj){ME.obj.position.copy(ME.pos)}if(ME.pet)ME.pet.position.copy(ME.pos).add(new THREE.Vector3(-.9,0,.4));
  if(!['walk','build','erase','item','room','door'].includes(MODE))MODE='walk';
  if(zone==='town'&&MODE!=='walk')MODE='walk';if(zone==='city'&&!P.plots.length&&MODE!=='walk')MODE='walk';if(zone==='work')MODE='build';if((zone==='island'||zone==='visit')&&['item','room','door'].includes(MODE))MODE='walk';
  renderBar();renderTray();renderLoc();pushPresence(true);syncAvatars()}
function walkTo(pt){const from=zoneAt(ME.pos.x,ME.pos.z),to=zoneAt(pt.x,pt.z);const path=[];const iEnd=new THREE.Vector3(0,0,-12.8),tEnd=new THREE.Vector3(0,0,-31.8);
  const side=z=>z==='island'?'i':z==='town'?'t':'b';const out=z=>z==='island'||z==='town'||z==='bridge';
  if(out(from)&&out(to)&&side(from)!==side(to)){if(side(from)==='i'){path.push(iEnd);if(side(to)==='t')path.push(tEnd)}else if(side(from)==='t'){path.push(tEnd);if(side(to)==='i')path.push(iEnd)}
    else{path.push(pt.z>ME.pos.z?iEnd:tEnd)}}
  path.push(new THREE.Vector3(pt.x,0,pt.z));ME.path=path}
function walkable(pt,zone){if(zone==='island')return Math.hypot(pt.x,pt.z)<R-.3;if(zone==='town')return Math.hypot(pt.x-ZC.town[0],pt.z-ZC.town[1])<TR-.6;if(zone==='bridge')return true;
  if(zone==='home'||zone==='visit'){const[cx,cz]=ZC[zone];return Math.hypot(pt.x-cx,pt.z-cz)<12.4}
  if(zone==='city'){const lx=pt.x-CX,lz=pt.z-CZ;return lx>-23.6&&lx<31.6&&Math.abs(lz)<24.6}return false}
