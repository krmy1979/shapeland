/* Shapeland · a world by Shirel Yitzhak */
/* ===================== LOOK UPGRADE: a cleaner, brighter, livelier picture =====================
   1. Less clutter: about 90 name labels float in the world. Now only the nearby ones show, fading softly with distance.
      Quest markers (! and ?) stay visible from afar, since they show where to go.
   2. Livelier colors: a light color grade (saturation and contrast), turned off by itself on weak devices.
   3. "That's me!": the player gets a dark cartoon outline and a glowing ring under the feet, so they're easy to find in a crowd.
   4. A bouncy character: stretches when jumping up and squashes on landing, with a puff of dust.
   5. A closer camera for the first walk: the world feels big and near, and it can still be zoomed out. */
const LOOK={labels:[],scan:0,prevAir:false,squash:0,ring:null,outlined:null};

/* ---------- 2. livelier colors ---------- */
function lookGrade(){const low=typeof FUN!=='undefined'&&FUN.lowered>=1;renderer.domElement.style.filter=low?'':'saturate(1.22) contrast(1.06) brightness(1.02)'}
lookGrade();

/* ---------- 1. labels that show only near you ---------- */
function lookScan(){LOOK.labels=[];scene.traverse(o=>{if(o.isSprite&&o.material&&o.material.depthTest===false&&o.scale.y>0&&o.scale.x/o.scale.y>1.6){if(o.userData.lkBase===undefined)o.userData.lkBase=o.material.opacity;LOOK.labels.push(o)}})}
const _lv=new THREE.Vector3();
function lookLabels(){if(!ME.obj)return;const px=ME.pos.x,pz=ME.pos.z;const near=ME.zone==='inside'?6:7,far=ME.zone==='inside'?10:12;
  for(const s of LOOK.labels){if(!s.parent)continue;s.getWorldPosition(_lv);const d=Math.hypot(_lv.x-px,_lv.z-pz);
    const k=d<=near?1:d>=far?0:1-(d-near)/(far-near);s.material.opacity=(s.userData.lkBase||1)*k;s.material.transparent=true;s.visible=k>0.02}}

/* ---------- 3. "that's me": outline + ring ---------- */
const OUTLINE_MAT=new THREE.MeshBasicMaterial({color:'#2A2140',side:THREE.BackSide});
OUTLINE_MAT.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed += normalize(normal) * 0.019;')};
function lookOutline(obj){if(!obj||LOOK.outlined===obj)return;LOOK.outlined=obj;const add=[];
  obj.traverse(o=>{if(!o.isMesh||o.userData.isOutline||!o.geometry||!o.geometry.attributes.normal)return;const m=[].concat(o.material)[0];if(!m||m.transparent||o.isSkinnedMesh)return;
    o.geometry.computeBoundingSphere();if(o.geometry.boundingSphere&&o.geometry.boundingSphere.radius<.035)return;add.push(o)});
  add.forEach(o=>{const h=new THREE.Mesh(o.geometry,OUTLINE_MAT);h.userData.isOutline=true;h.castShadow=false;h.receiveShadow=false;h.raycast=()=>{};h.renderOrder=-1;o.add(h)})}
function lookRing(){if(LOOK.ring)return LOOK.ring;const g=new THREE.Group();
  const r=new THREE.Mesh(new THREE.RingGeometry(.42,.56,40),new THREE.MeshBasicMaterial({color:'#FF6FA5',transparent:true,opacity:.75,depthWrite:false,side:THREE.DoubleSide}));r.rotation.x=-Math.PI/2;g.add(r);
  const glow=new THREE.Mesh(new THREE.CircleGeometry(.62,40),new THREE.MeshBasicMaterial({color:'#FFC2D9',transparent:true,opacity:.28,depthWrite:false,blending:THREE.AdditiveBlending}));glow.rotation.x=-Math.PI/2;glow.position.y=-.005;g.add(glow);
  g.renderOrder=2;g.raycast=()=>{};scene.add(g);g.userData.r=r;g.userData.glow=glow;return LOOK.ring=g}

/* ---------- 4. bouncy character + landing dust ---------- */
function lookDust(x,y,z){if(typeof fxBurst==='function')fxBurst(x,y+.05,z,'#F5E6C8',9,1.6)}
function lookBounce(dt){const o=ME.obj;if(!o)return;const air=!!ME.air;if(!air)LOOK.gy=ME.y;
  if(LOOK.prevAir&&!air&&!ME.swim&&!ME.flying){LOOK.squash=1;lookDust(ME.pos.x,ME.y,ME.pos.z)}LOOK.prevAir=air;
  LOOK.squash=Math.max(0,LOOK.squash-dt*5);let sy=1,sxz=1;
  if(air&&!ME.flying&&ME.vy>1.5){sy=1.09;sxz=.95}
  if(LOOK.squash>0){const k=Math.sin(LOOK.squash*Math.PI)*.16;sy=1-k;sxz=1+k*.6}
  o.scale.y+=(sy-o.scale.y)*Math.min(1,dt*18);const nx=o.scale.x+(sxz-o.scale.x)*Math.min(1,dt*18);o.scale.x=nx;o.scale.z=nx}

/* ---------- 5. a closer camera for the first walk ---------- */
if(typeof CAM!=='undefined'&&!P.lookCam){const once=setInterval(()=>{if(!$('#title').hidden||!ME.obj)return;clearInterval(once);P.lookCam=1;save();CAM.wantDist=Math.min(CAM.wantDist,12.5)},500)}

/* ---------- the loop ---------- */
let lookT=0;
const _stepBL=stepBuilder;stepBuilder=function(dt,t){_stepBL(dt,t);try{
  if($('#title').hidden&&ME.obj){LOOK.scan-=dt;if(LOOK.scan<=0){LOOK.scan=3;lookScan();lookGrade()}lookLabels();lookOutline(ME.obj);lookBounce(dt);
    const g=lookRing();const show=ME.zone!=='inside'&&!(typeof FT!=='undefined'&&FT.cine);g.visible=show;
    if(show){g.position.set(ME.pos.x,(LOOK.gy||0)+.04,ME.pos.z);
      const p=1+.08*Math.sin(t*3.2);g.userData.r.scale.setScalar(p);g.userData.glow.material.opacity=.2+.1*Math.sin(t*3.2)}}
}catch(e){}};
