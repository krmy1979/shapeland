/* Shapeland · a world by Shirel Yitzhak */
/* ===================== AVATARS & PETS ===================== */
function avatar3D(ch){if(ch&&ch.kind==='human')return human3D(ch);const g=new THREE.Group();const col=ch.color,dk=shade(col,-.28),w=+ch.w||1,h=+ch.h||1;let body;
  const M=mat(col),D=mat(dk);
  if(ch.shape==='tall'){body=mesh(new THREE.SphereGeometry(.5,24,18),M);body.scale.set(.82*w,1.35*h,.82*w)}
  else if(ch.shape==='pear'){body=mesh(new THREE.LatheGeometry([[0,0],[.42,.03],[.56,.28],[.5,.5],[.36,.72],[.18,.88],[0,.92]].map(p=>new THREE.Vector2(p[0],p[1])),24),M);body.scale.set(w,h,w)}
  else if(ch.shape==='drop'){body=mesh(new THREE.LatheGeometry([[0,0],[.36,.04],[.5,.26],[.45,.52],[.28,.78],[.1,.98],[0,1.08]].map(p=>new THREE.Vector2(p[0],p[1])),24),M);body.scale.set(w,h,w)}
  else if(ch.shape==='star'){const gg=new THREE.ExtrudeGeometry(shape2D('star'),{depth:.45,bevelEnabled:true,bevelThickness:.1,bevelSize:.08,bevelSegments:3});gg.center();body=mesh(gg,M);body.scale.set(1.1*w,1.1*h,1)}
  else if(ch.shape==='cloud'){body=new THREE.Group();[[0,0,0,.48],[-.36,-.08,0,.34],[.36,-.08,0,.34],[0,.3,0,.34]].forEach(([x,y,z,r])=>{const m=mesh(new THREE.SphereGeometry(r,16,12),M);m.position.set(x,y,z);body.add(m)});body.scale.set(w,h,w)}
  else{body=mesh(new THREE.SphereGeometry(.5,24,18),M);body.scale.set(w,h,w)}
  g.add(body);const bb=new THREE.Box3().setFromObject(body);body.position.y+=.14-bb.min.y;bb.setFromObject(body);
  const topY=bb.max.y,midY=(bb.min.y+bb.max.y)/2,fz=bb.max.z-.02,side=bb.max.x,faceY=midY+(topY-midY)*.18;
  [-1,1].forEach(s=>{const f=mesh(new THREE.SphereGeometry(.13,12,8),D);f.scale.set(1,.55,1.3);f.position.set(s*.2*w,.1,.05);g.add(f);
    const arm=mesh(new THREE.SphereGeometry(.11,10,8),D);arm.scale.set(1,1.4,1);arm.position.set(s*(side+.03),midY-.05,0);g.add(arm)});
  const ex=Math.max(.14,.17*w);
  [-1,1].forEach(s=>{const x=s*ex;
    if(ch.eyes==='big'){const e=mesh(new THREE.SphereGeometry(.11,12,10),mat('#FFFFFF'));e.position.set(x,faceY,fz-.03);g.add(e);const p=mesh(new THREE.SphereGeometry(.065,10,8),mat('#1D2A48'));p.position.set(x,faceY,fz+.06);g.add(p)}
    else if(ch.eyes==='dots'){const p=mesh(new THREE.SphereGeometry(.06,10,8),mat('#1D2A48'));p.position.set(x,faceY,fz);g.add(p)}
    else{const t=mesh(new THREE.TorusGeometry(.06,.018,6,12,Math.PI),mat('#1D2A48'));t.position.set(x,faceY,fz);if(ch.eyes==='sleepy')t.rotation.z=Math.PI;g.add(t)}});
  const isT=ch.mouth==='smile'||ch.mouth==='tongue';const mo=isT?mesh(new THREE.TorusGeometry(.08,.02,6,12,Math.PI),mat('#1D2A48')):mesh(new THREE.SphereGeometry(.06,10,8),mat(ch.mouth==='open'?'#7A2440':'#1D2A48'));
  if(isT)mo.rotation.z=Math.PI;mo.position.set(0,faceY-.17,fz-.01);g.add(mo);
  const T=topY-.05,Y=mat('#FFD54A');
  if(ch.ears==='cat')[-1,1].forEach(s=>{const e=mesh(new THREE.ConeGeometry(.13,.26,4),M);e.position.set(s*.22*w,T+.08,0);e.rotation.z=-s*.25;g.add(e)});
  if(ch.ears==='bunny')[-1,1].forEach(s=>{const e=mesh(new THREE.SphereGeometry(.1,10,8),M);e.scale.set(1,3,.6);e.position.set(s*.15*w,T+.26,0);g.add(e)});
  if(ch.ears==='bear')[-1,1].forEach(s=>{const e=mesh(new THREE.SphereGeometry(.12,10,8),M);e.position.set(s*.28*w,T,0);g.add(e)});
  if(ch.ears==='antenna')[-1,1].forEach(s=>{const l=mesh(new THREE.CylinderGeometry(.015,.015,.32,6),D);l.position.set(s*.12,T+.15,0);l.rotation.z=-s*.35;g.add(l);const b=mesh(new THREE.SphereGeometry(.06,8,6),s<0?mat('#EE4F7C'):Y);b.position.set(s*.18,T+.3,0);g.add(b)});
  if(ch.ears==='horns')[-1,1].forEach(s=>{const e=mesh(new THREE.ConeGeometry(.07,.22,8),Y);e.position.set(s*.2*w,T+.08,0);e.rotation.z=-s*.4;g.add(e)});
  if(ch.ears==='unicorn'){const e=mesh(new THREE.ConeGeometry(.07,.36,10),Y);e.position.set(0,T+.15,.05);g.add(e)}
  if(ch.hat==='crown'){const c=mesh(new THREE.CylinderGeometry(.2,.17,.16,6,1,true),mat('#FFC531',{metalness:.5,roughness:.3,side:THREE.DoubleSide}));c.position.y=T+.1;g.add(c)}
  if(ch.hat==='cap'){const c=mesh(new THREE.SphereGeometry(.26,16,8,0,Math.PI*2,0,Math.PI/2),mat('#EE4F7C'));c.position.y=T-.03;g.add(c);const b=mesh(new THREE.CylinderGeometry(.18,.18,.03,16),mat('#C23560'));b.position.set(0,T-.02,.2);g.add(b)}
  if(ch.hat==='flower'){const c=mesh(new THREE.SphereGeometry(.07,8,6),Y);c.position.set(.2*w,T+.02,.05);g.add(c);for(let i=0;i<5;i++){const p=mesh(new THREE.SphereGeometry(.06,8,6),mat('#FFFFFF'));const a=i*Math.PI*2/5;p.position.set(.2*w+Math.cos(a)*.1,T+.02+Math.sin(a)*.1,.04);g.add(p)}}
  if(ch.hat==='bow')[-1,1].forEach(s=>{const b=mesh(new THREE.ConeGeometry(.08,.16,8),mat('#EE4F7C'));b.rotation.z=s*Math.PI/2;b.position.set(s*.08,T+.04,0);g.add(b)});
  if(ch.back==='wings')[-1,1].forEach(s=>{const wg=mesh(new THREE.SphereGeometry(.24,12,8),mat('#FFFFFF'));wg.scale.set(1.2,.6,.2);wg.position.set(s*(side*.6),midY+.15,-.3);wg.rotation.z=s*.5;g.add(wg)});
  if(ch.back==='tail'){const t=mesh(new THREE.TorusGeometry(.18,.05,6,12,Math.PI*1.2),D);t.position.set(0,midY-.1,-(bb.max.z)+.02);t.rotation.y=Math.PI/2;g.add(t)}
  g.userData.h=topY+.2;return g}
const ME={obj:null,pos:new THREE.Vector3(0,0,3),path:[],zone:'island',pet:null};
function rebuildMe(){if(ME.obj)scene.remove(ME.obj);ME.obj=avatar3D(P.ch);const lb=label(P.name||'Me','#EE4F7C','#FFFFFF');lb.position.y=ME.obj.userData.h+.35;ME.obj.add(lb);
  ME.obj.position.copy(ME.pos);scene.add(ME.obj);rebuildPet()}
function rebuildPet(){if(ME.pet)scene.remove(ME.pet);ME.pet=null;if(P.pet&&PETS[P.pet]){ME.pet=partsModel(PETS[P.pet].parts);ME.pet.position.copy(ME.pos).add(new THREE.Vector3(-.9,0,.4));scene.add(ME.pet)}}
