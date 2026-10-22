/* Shapeland · a world by Shirel Yitzhak */
/* ===================== MOVEMENT & ZONES ===================== */
const OUTZ=['island','town','road','city','girls','boys','adv'];
function zoneAt(x,z){if(Math.abs(x-ZC.inside[0])<12&&Math.abs(z-ZC.inside[1])<10)return'inside';if(Math.hypot(x,z)<R+1)return'island';if(Math.hypot(x-ZC.town[0],z-ZC.town[1])<TR+1)return'town';if(Math.abs(x)<1.6&&z<-12&&z>-34)return'bridge';
  if(typeof inRoad==='function'&&inRoad(x,z))return'road';
  {const lx=x-ZC.city[0],lz=z-ZC.city[1];if(lx>-46.5&&lx<32.5&&lz>-25.5&&lz<25.5)return'city'}
  if(z<=-155.5&&z>-201.5){if(x>-24&&x<=4)return'girls';if(x>4&&x<32)return'boys';if(x>=32&&x<60)return'adv'}
  for(const k of['home','visit','work']){const[cx,cz]=ZC[k];if(Math.hypot(x-cx,z-cz)<14)return k}return null}
const ZNAME={adv:'פארק ההרפתקאות 🌿',road:'שדרות בן גוריון',girls:'גן הבנות 🌸',boys:'פארק הספורט ⚽',inside:'בפנים 🚪',city:'אשקלון',island:'האי של שיראל',town:'Shapeland Town',home:'הבית שלי',visit:'בבית של חבר/ה',work:'סדנת רהיטים'};
function setAtmos(zone){const inside=zone==='home'||zone==='visit'||zone==='work'||zone==='inside';const c=inside?'#F6E7FF':'#9FD6FF';scene.background.set(c);scene.fog.color.set(c);scene.fog.near=inside?22:50;scene.fog.far=inside?60:120;water.visible=!inside}
function teleport(zone,spot){const[cx,cz]=ZC[zone];ME.zone=zone;ME.path=[];
  const sp=spot||{island:[0,3],town:[0,11],home:[0,6.2],visit:[0,6.2],work:[0,2.4],city:[-12.5,-3.5],road:[0,0],girls:[0,18],boys:[0,18],adv:[-9,10],inside:[0,3.6]}[zone];ME.pos.set(cx+sp[0],0,cz+sp[1]);
  const follow=OUTZ.includes(zone)||zone==='inside';const tgx=follow?ME.pos.x:cx,tgz=follow?ME.pos.z:cz+(zone==='work'?0:1);controls.target.set(tgx,0,tgz);const off={island:[0,13,17],town:[0,14,18],home:[0,13,14],visit:[0,13,14],work:[0,4.5,5.5],city:[6,15,16],road:[0,14,16],girls:[0,14,17],boys:[0,14,17],adv:[0,13,16],inside:[0,7,9.5]}[zone];
  camera.position.set(tgx+off[0],off[1],tgz+off[2]);controls.minDistance=zone==='work'?2.5:4;setAtmos(zone);
  if(ME.obj){ME.obj.position.copy(ME.pos)}if(ME.pet)ME.pet.position.copy(ME.pos).add(new THREE.Vector3(-.9,0,.4));
  if(!['walk','build','erase','item','room','door'].includes(MODE))MODE='walk';
  if(['town','road','girls','boys','adv','inside'].includes(zone)&&MODE!=='walk')MODE='walk';if(zone!=='inside'&&INROOM&&!INSIDE){scene.remove(INROOM);INROOM=null;INPICK=[]}if(zone==='city'&&!P.plots.length&&MODE!=='walk')MODE='walk';if(zone==='work')MODE='build';if((zone==='island'||zone==='visit')&&['item','room','door'].includes(MODE))MODE='walk';
  renderBar();renderTray();renderLoc();pushPresence(true);syncAvatars()}
const LV={island:0,bridge:.5,town:1,road:1.5,city:2,girls:3,boys:3,adv:3};
function walkTo(pt){const from=zoneAt(ME.pos.x,ME.pos.z),to=zoneAt(pt.x,pt.z);const path=[];
  if(from in LV&&to in LV&&LV[from]!==LV[to]){const a=LV[from],b=LV[to];const gx=clamp(a<b?pt.x:ME.pos.x,-22,30);
    const W=[[.25,0,-12.8],[.75,0,-31.8],[1.25,14,-52],[1.75,14,-104],[2.5,gx,-155.5]];
    const seq=a<b?W.filter(w=>w[0]>a&&w[0]<b):W.filter(w=>w[0]<a&&w[0]>b).reverse();seq.forEach(w=>path.push(new THREE.Vector3(w[1],0,w[2])))}
  path.push(new THREE.Vector3(pt.x,0,pt.z));ME.path=path}
function walkable(pt,zone){if(zone==='island')return Math.hypot(pt.x,pt.z)<R-.3;if(zone==='town')return Math.hypot(pt.x-ZC.town[0],pt.z-ZC.town[1])<TR-.6||inRoad(pt.x,pt.z);if(zone==='bridge')return true;
  if(zone==='road')return true;if(zone==='inside')return insideWalkable(pt);if(zone==='girls'||zone==='boys'||zone==='adv')return pt.x>-23.4&&pt.x<59.4&&pt.z<-155.4&&pt.z>-200.9;
  if(zone==='home'||zone==='visit'){const[cx,cz]=ZC[zone];return Math.hypot(pt.x-cx,pt.z-cz)<12.4}
  if(zone==='city'){const lx=pt.x-CX,lz=pt.z-CZ;return(lx>-45.6&&lx<31.6&&lz>-25.6&&lz<24.6)||inRoad(pt.x,pt.z)}return false}
