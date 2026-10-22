/* Shapeland · a world by Shirel Yitzhak */
/* ===================== CONNECTED WORLD: BOULEVARD, GIRLS' GARDEN, SPORTS PARK ===================== */
ZC.road=[14,-77];ZC.girls=[-10,-178];ZC.boys=[18,-178];ZC.inside=[270,0];
const EXTRA_PICK=[],DOORS=[],ZFX={balls:[],disco:[],fount:[]};
const inRoad=(x,z)=>x>11&&x<17&&z<-48&&z>-105.4;
function wbox(w,h,d,col,x,y,z,sh,o){const m=mesh(new THREE.BoxGeometry(w,h,d),o?mat(col,o):mat(col),sh);m.position.set(x,y,z);scene.add(m);return m}
function signBoard(text,bg,fg,w){const cv=document.createElement('canvas');cv.width=512;cv.height=128;const c=cv.getContext('2d');c.fillStyle=bg;c.fillRect(0,0,512,128);c.strokeStyle='#ffffff';c.lineWidth=10;c.strokeRect(5,5,502,118);
  c.fillStyle=fg;c.textAlign='center';c.textBaseline='middle';let fs=58;c.font=`700 ${fs}px Fredoka, Arial, sans-serif`;while(c.measureText(text).width>470&&fs>20){fs-=4;c.font=`700 ${fs}px Fredoka, Arial, sans-serif`}c.fillText(text,256,68);
  const g=new THREE.Group();w=w||2.4;const pl=new THREE.Mesh(new THREE.BoxGeometry(w,w/4,.08),[mat('#7C4A2D'),mat('#7C4A2D'),mat('#7C4A2D'),mat('#7C4A2D'),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(cv)}),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(cv)})]);
  pl.position.y=1.6;g.add(pl);[-1,1].forEach(s=>{const p=mesh(new THREE.CylinderGeometry(.05,.05,1.6,6),mat('#7C4A2D'));p.position.set(s*w*.4,.8,0);g.add(p)});return g}
function placeAt(g,x,z,lx,lz){g.position.set(x,0,z);if(lx!==undefined)g.lookAt(lx,0,lz);scene.add(g);return g}
function ztree(x,z,leaf,trunk){const g=new THREE.Group();const t=mesh(new THREE.CylinderGeometry(.16,.22,1.6,8),mat(trunk||'#9A6B3C'));t.position.y=.8;g.add(t);
  [[0,2,0,.95],[.45,1.7,.2,.6],[-.4,1.75,-.2,.65]].forEach(([a,b,c,r])=>{const s=mesh(new THREE.SphereGeometry(r,14,10),mat(leaf));s.position.set(a,b,c);g.add(s)});return placeAt(g,x,z)}
function lampPost(x,z,top){const g=new THREE.Group();const p=mesh(new THREE.CylinderGeometry(.06,.08,2.6,8),mat('#374151'));p.position.y=1.3;g.add(p);
  const b=mesh(new THREE.SphereGeometry(.2,12,10),new THREE.MeshStandardMaterial({color:top||'#FFF7CC',emissive:top||'#FFE38A',emissiveIntensity:.35}));b.position.y=2.7;g.add(b);return placeAt(g,x,z)}
function bench(x,z,rot,col){const g=new THREE.Group();const s=mesh(new THREE.BoxGeometry(1.6,.1,.5),mat(col||'#B07A4A'));s.position.y=.45;g.add(s);const bk=mesh(new THREE.BoxGeometry(1.6,.45,.08),mat(col||'#B07A4A'));bk.position.set(0,.75,-.22);g.add(bk);
  [-.65,.65].forEach(a=>{const l=mesh(new THREE.BoxGeometry(.08,.45,.45),mat('#4B5563'));l.position.set(a,.22,0);g.add(l)});g.rotation.y=rot||0;return placeAt(g,x,z)}
function zbuilding(b){const g=new THREE.Group();const body=mesh(new THREE.BoxGeometry(5,3.4,3.8),mat(b.color));body.position.y=1.7;g.add(body);
  if(b.flat){const r=mesh(new THREE.BoxGeometry(5.4,.35,4.2),mat(b.roof));r.position.y=3.55;g.add(r)}
  else{const roof=mesh(new THREE.ConeGeometry(3.8,1.7,4),mat(b.roof));roof.rotation.y=Math.PI/4;roof.scale.set(1,1,.8);roof.position.y=4.25;g.add(roof)}
  const aw=new THREE.Mesh(new THREE.BoxGeometry(5.2,.12,1.1),new THREE.MeshStandardMaterial({map:awningTex(b.roof)}));aw.position.set(0,2.55,2.35);aw.rotation.x=.25;aw.castShadow=true;g.add(aw);
  const door=mesh(new THREE.BoxGeometry(1.2,2,.1),mat(b.door||'#FFFFFF'));door.position.set(0,1,1.92);g.add(door);
  const knob=mesh(new THREE.SphereGeometry(.06,8,6),mat('#FFC531'));knob.position.set(.4,1,1.99);g.add(knob);
  [-1.65,1.65].forEach(x=>{const w=mesh(new THREE.BoxGeometry(1,.9,.08),mat('#BFE3FF',{roughness:.15}));w.position.set(x,1.75,1.92);g.add(w)});
  const lb=label(b.en+' '+b.em,'#FFFFFF','#1D2A48',.55);lb.position.y=5.6;g.add(lb);
  g.position.set(b.x,0,b.z);g.lookAt(b.fx,0,b.fz);rootify(g);g.userData.bld=b.id;scene.add(g);BLDG.push(g);
  const dx=b.fx-b.x,dz=b.fz-b.z,dl=Math.hypot(dx,dz);DOORS.push({id:b.id,zone:b.zone,x:b.x+dx/dl*2.3,z:b.z+dz/dl*2.3,ox:b.x+dx/dl*3.6,oz:b.z+dz/dl*3.6});return g}
// town buildings get doors too
BUILDINGS.forEach(b=>{const[cx,cz]=ZC.town;const x=cx+b.x,z=cz+b.z,dx=cx-x,dz=cz-z,dl=Math.hypot(dx,dz);DOORS.push({id:b.id,zone:'town',x:x+dx/dl*2.1,z:z+dz/dl*2.1,ox:x+dx/dl*3.4,oz:z+dz/dl*3.4})});
DOORS.push({id:'mall',zone:'city',x:CX+17.8,z:CZ-14,ox:CX+16.5,oz:CZ-14});

/* ---- Ben Gurion Boulevard: walk from Town to Ashkelon ---- */
(()=>{const r=wbox(6,.5,57.4,'#D6D3D1',14,-.25,-76.7,false);EXTRA_PICK.push(r);wbox(6,4,57.4,'#B98A5E',14,-2.6,-76.7,false);
  EXTRA_PICK.push(wbox(2.6,.05,57.4,'#4B5563',14,.03,-76.7,false));for(let z=-52;z>-104;z-=3)wbox(.15,.06,1.2,'#FDE68A',14,.04,z,false);
  for(let z=-56;z>-104;z-=8){palm(11.6-CX,z-CZ);palm(16.4-CX,z-4-CZ)}
  for(let z=-60;z>-104;z-=12)lampPost(16.6,z);
  placeAt(signBoard('Ashkelon ↓  ·  Town ↑','#1D4ED8','#FFFFFF',3),11.6,-62,14,-62);
  placeAt(signBoard('Ben Gurion Blvd','#065F46','#FFFFFF',2.8),16.4,-90,14,-90)})();

/* ---- Girls' Garden (pink) ---- */
const GX0=-24,GX1=4,SZ0=-201.5,SZ1=-155.5;
(()=>{const gr=wbox(GX1-GX0,.5,SZ1-SZ0,'#F7BFDB',(GX0+GX1)/2,-.25,(SZ0+SZ1)/2,false);EXTRA_PICK.push(gr);wbox(GX1-GX0,4,SZ1-SZ0,'#E9A8C6',(GX0+GX1)/2,-2.6,(SZ0+SZ1)/2,false);
  EXTRA_PICK.push(wbox(4,.05,40,'#FDE4F0',-10,.03,-178,false));EXTRA_PICK.push(wbox(22,.05,4,'#FDE4F0',-10,.03,-180,false));
  const cx=-10,cz=-180;const f=new THREE.Group();const basin=mesh(new THREE.CylinderGeometry(2,2.2,.6,32),mat('#F9A8D4'));basin.position.y=.3;f.add(basin);
  const w=mesh(new THREE.CylinderGeometry(1.8,1.8,.1,32),mat('#7DD3FC',{roughness:.1}));w.position.y=.58;f.add(w);
  const heart=new THREE.ExtrudeGeometry(shape2D('heart'),{depth:.3,bevelEnabled:true,bevelThickness:.06,bevelSize:.05,bevelSegments:2});heart.center();const hm=mesh(heart,mat('#EC4899'));hm.scale.setScalar(1.1);hm.position.y=1.9;hm.rotation.z=Math.PI;f.add(hm);ZFX.fount.push(hm);
  const col=mesh(new THREE.CylinderGeometry(.18,.25,1.1,12),mat('#FBCFE8'));col.position.y=.9;f.add(col);placeAt(f,cx,cz);
  [[-21,-162],[-21,-198],[1,-162],[1,-198],[-21,-178],[-3,-168]].forEach(([x,z])=>ztree(x,z,'#F9A8D4','#B07A4A'));
  [[-16,-165],[-4,-165],[-16,-190],[-4,-190]].forEach(([x,z])=>{for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const fl=mesh(new THREE.SphereGeometry(.18,8,6),mat(['#F472B6','#FDE047','#C084FC','#FFFFFF'][i%4]));fl.position.set(x+Math.cos(a)*.8,.25,z+Math.sin(a)*.8);scene.add(fl)}
    const st=mesh(new THREE.CylinderGeometry(.9,.9,.12,16),mat('#86EFAC'));st.position.set(x,.06,z);scene.add(st)});
  [[-13,-176,0],[-7,-176,0],[-13,-184,Math.PI],[-7,-184,Math.PI]].forEach(([x,z,r])=>bench(x,z,r,'#F9A8D4'));
  [[-15,-160],[-5,-160],[-15,-196],[-5,-196]].forEach(([x,z])=>lampPost(x,z,'#FFD1E8'));
  // entrance arch
  const ar=new THREE.Group();const a=mesh(new THREE.TorusGeometry(2.6,.22,10,26,Math.PI),mat('#EC4899'));a.position.y=1.2;ar.add(a);[-2.6,2.6].forEach(x=>{const p=mesh(new THREE.CylinderGeometry(.22,.22,1.2,10),mat('#EC4899'));p.position.set(x,.6,0);ar.add(p)});
  const lb=label("Girls' Garden 🌸",'#EC4899','#FFFFFF',.6);lb.position.y=4.5;ar.add(lb);placeAt(ar,-10,-157.5);
  placeAt(signBoard('Please smell the flowers 🌷','#FDF2F8','#BE185D',2.6),-13.5,-170,-10,-178);
  // dance stage with disco ball
  const stg=new THREE.Group();const plat=mesh(new THREE.CylinderGeometry(3,3.1,.5,32),mat('#C084FC'));plat.position.y=.25;stg.add(plat);
  const top=mesh(new THREE.CylinderGeometry(2.85,2.85,.06,32),mat('#F5D0FE'));top.position.y=.52;stg.add(top);
  const pole=mesh(new THREE.CylinderGeometry(.05,.05,3.4,6),mat('#9CA3AF'));pole.position.set(0,2.2,-2.6);stg.add(pole);const arm=mesh(new THREE.CylinderGeometry(.04,.04,2.6,6),mat('#9CA3AF'));arm.rotation.x=Math.PI/2;arm.position.set(0,3.9,-1.3);stg.add(arm);
  const db=mesh(new THREE.IcosahedronGeometry(.45,1),mat('#F5F3FF',{metalness:.3,roughness:.2,flatShading:true,emissive:'#C4B5FD',emissiveIntensity:.4}));db.position.set(0,3.4,0);stg.add(db);ZFX.disco.push(db);
  const sl=label('Dance Stage 💃','#A855F7','#FFFFFF',.5);sl.position.y=4.8;stg.add(sl);placeAt(stg,-19,-185);rootify(stg);stg.userData.zact=()=>danceParty();EXTRA_PICK.push(stg)})();
[{id:'salon',en:'Beauty Salon',em:'💇‍♀️',color:'#FBCFE8',roof:'#DB2777',door:'#FDF2F8',x:-20,z:-168,fx:-10,fz:-172},
 {id:'makeup',en:'Makeup Studio',em:'💄',color:'#F5D0FE',roof:'#A21CAF',door:'#FDF4FF',x:-14,z:-197,fx:-14,fz:-180,flat:true},
 {id:'boutique',en:'Fashion Boutique',em:'👗',color:'#FFE4E6',roof:'#E11D48',door:'#FFF1F2',x:-3,z:-197,fx:-3,fz:-180}].forEach(b=>zbuilding(Object.assign({zone:'girls'},b)));

/* ---- Sports Park (blue) ---- */
const BX0=4,BX1=32;
(()=>{const gr=wbox(BX1-BX0,.5,SZ1-SZ0,'#A7CBF5',(BX0+BX1)/2,-.25,(SZ0+SZ1)/2,false);EXTRA_PICK.push(gr);wbox(BX1-BX0,4,SZ1-SZ0,'#93C5FD',(BX0+BX1)/2,-2.6,(SZ0+SZ1)/2,false);
  EXTRA_PICK.push(wbox(4,.05,40,'#E0EDFF',18,.03,-178,false));
  // soccer field
  const fx=24,fz=-168;EXTRA_PICK.push(wbox(13,.06,8.5,'#22A35A',fx,.04,fz,false));
  [[0,0,13,.08],[0,0,.08,8.5]].forEach(([x,z,w,d])=>wbox(w,.07,d,'#FFFFFF',fx+x,.05,fz+z,false));
  const ring=mesh(new THREE.TorusGeometry(1.2,.05,6,30),mat('#FFFFFF'));ring.rotation.x=Math.PI/2;ring.position.set(fx,.08,fz);scene.add(ring);
  [-1,1].forEach(s=>{const gl=new THREE.Group();[-1.3,1.3].forEach(z=>{const p=mesh(new THREE.CylinderGeometry(.06,.06,1.4,8),mat('#FFFFFF'));p.position.set(0,.7,z);gl.add(p)});
    const cb=mesh(new THREE.CylinderGeometry(.06,.06,2.6,8),mat('#FFFFFF'));cb.rotation.x=Math.PI/2;cb.position.y=1.4;gl.add(cb);
    const net=mesh(new THREE.BoxGeometry(.7,1.4,2.6),mat('#FFFFFF',{transparent:true,opacity:.25}));net.position.set(s*.35,.7,0);gl.add(net);gl.position.set(fx+s*6.3,0,fz);scene.add(gl)});
  const ball=mesh(new THREE.SphereGeometry(.28,16,12),mat('#FFFFFF'));[[0,.28,0],[.2,.1,.16],[-.2,.1,.16],[0,.1,-.25]].forEach(([x,y,z])=>{const s=mesh(new THREE.SphereGeometry(.09,8,6),mat('#111827'));s.position.set(x*.9,y*.9-.05,z*.9);ball.add(s)});
  ball.position.set(fx,.28,fz);scene.add(ball);rootify(ball);ball.userData.zact=()=>kickBall();EXTRA_PICK.push(ball);ZFX.balls.push({m:ball,vx:0,vz:0,cx:fx,cz:fz});
  const lb=label('Soccer ⚽ tap the ball!','#16A34A','#FFFFFF',.45);lb.position.set(fx,3,fz-4.6);scene.add(lb);
  // skate park ramps
  [[9,-185,0],[9,-191,Math.PI]].forEach(([x,z,r])=>{const rp=mesh(new THREE.CylinderGeometry(2,2,4,20,1,true,0,Math.PI/2),mat('#94A3B8',{side:THREE.DoubleSide}));rp.rotation.set(0,r,Math.PI/2);rp.position.set(x,2,z);scene.add(rp)});
  const sk=label('Skate Park 🛹','#334155','#FFFFFF',.45);sk.position.set(9,3.4,-188);scene.add(sk);
  // basketball hoop
  const hp=new THREE.Group();const post=mesh(new THREE.CylinderGeometry(.09,.09,3.2,8),mat('#374151'));post.position.y=1.6;hp.add(post);const bb=mesh(new THREE.BoxGeometry(1.4,.9,.06),mat('#FFFFFF'));bb.position.set(0,3.2,.3);hp.add(bb);
  const rim=mesh(new THREE.TorusGeometry(.3,.03,6,18),mat('#F97316'));rim.rotation.x=Math.PI/2;rim.position.set(0,2.95,.65);hp.add(rim);placeAt(hp,8,-166,8,-160);
  [[30,-198],[30,-160],[6,-198],[18,-196]].forEach(([x,z])=>ztree(x,z,'#4ADE80'));
  [[14,-174,Math.PI/2],[14,-182,Math.PI/2]].forEach(([x,z,r])=>bench(x,z,r,'#60A5FA'));
  [[22,-160],[12,-160],[22,-196],[12,-200]].forEach(([x,z])=>lampPost(x,z,'#DBEAFE'));
  const ar=new THREE.Group();const a=mesh(new THREE.TorusGeometry(2.6,.22,10,26,Math.PI),mat('#2563EB'));a.position.y=1.2;ar.add(a);[-2.6,2.6].forEach(x=>{const p=mesh(new THREE.CylinderGeometry(.22,.22,1.2,10),mat('#2563EB'));p.position.set(x,.6,0);ar.add(p)});
  const al=label('Sports Park ⚽','#2563EB','#FFFFFF',.6);al.position.y=4.5;ar.add(al);placeAt(ar,18,-157.5);
  placeAt(signBoard('No bikes on the grass 🚫🚲','#EFF6FF','#1D4ED8',2.6),15.5,-170,18,-178)})();
[{id:'gym',en:'Power Gym',em:'🏋️',color:'#BFDBFE',roof:'#1E3A8A',door:'#EFF6FF',x:27,z:-195,fx:22,fz:-180,flat:true},
 {id:'rides',en:'Scooter Shop',em:'🛴',color:'#A5F3FC',roof:'#0E7490',door:'#ECFEFF',x:18.5,z:-198,fx:18.5,fz:-180},
 {id:'tools',en:'Tools Workshop',em:'🧰',color:'#E2E8F0',roof:'#1D4ED8',door:'#F8FAFC',x:28,z:-182,fx:18,fz:-182}].forEach(b=>zbuilding(Object.assign({zone:'boys'},b)));
/* ---- Friends Gate between the two parks ---- */
(()=>{const g=new THREE.Group();const cols=['#EF4444','#F59E0B','#FDE047','#22C55E','#3B82F6','#A855F7'];cols.forEach((c,i)=>{const a=mesh(new THREE.TorusGeometry(3-i*.18,.09,8,30,Math.PI),mat(c));a.position.y=.4;g.add(a)});
  const lb=label('Friends Gate 🌈','#FFFFFF','#1D2A48',.55);lb.position.y=4.2;g.add(lb);g.position.set(4,0,-178);g.rotation.y=Math.PI/2;scene.add(g)})();

/* ---- fun: soccer, dance ---- */
let lastGoal=0;
function kickBall(){const b=ZFX.balls[0];const dx=b.m.position.x-ME.pos.x,dz=b.m.position.z-ME.pos.z,d=Math.hypot(dx,dz)||1;
  if(d>6){walkTo(new THREE.Vector3(b.m.position.x-dx/d*1.2,0,b.m.position.z-dz/d*1.2));say('Go to the ball!');return}
  const sp=9+Math.random()*3;b.vx=dx/d*sp;b.vz=dz/d*sp;b.vy=3;blip(180,.12,'square',.06);say(pick(['Kick!','Nice kick!','Pass!','Shoot!']))}
function stepBalls(dt,t){ZFX.balls.forEach(b=>{const m=b.m;if(!b.vx&&!b.vz&&!b.vy)return;m.position.x+=b.vx*dt;m.position.z+=b.vz*dt;b.vy=(b.vy||0)-14*dt;m.position.y=Math.max(.28,m.position.y+b.vy*dt);if(m.position.y<=.28)b.vy=0;
  b.vx*=.985;b.vz*=.985;m.rotation.x+=b.vz*dt*2;m.rotation.z-=b.vx*dt*2;
  const lx=m.position.x-b.cx,lz=m.position.z-b.cz;if(Math.abs(lx)>6.3&&Math.abs(lz)<1.3&&performance.now()-lastGoal>2500){lastGoal=performance.now();burst('⚽ GOAL!');sfx.win();say('Goal! Great shot!');addGems(2,'גול בפארק הספורט','Goal');b.vx=b.vz=0;setTimeout(()=>m.position.set(b.cx,.28,b.cz),900);return}
  if(Math.abs(lx)>6.4){b.vx*=-.6;m.position.x=b.cx+Math.sign(lx)*6.4}if(Math.abs(lz)>4.1){b.vz*=-.6;m.position.z=b.cz+Math.sign(lz)*4.1}
  if(Math.abs(b.vx)+Math.abs(b.vz)<.15){b.vx=b.vz=0}})}
let DANCE=0;
function danceParty(){const d=Math.hypot(ME.pos.x+19,ME.pos.z+185);if(d>5){walkTo(new THREE.Vector3(-19,0,-183));say("Let's dance!");setTimeout(()=>{if(Math.hypot(ME.pos.x+19,ME.pos.z+185)<5)danceParty()},2200);return}
  DANCE=2.6;const notes=[523,659,784,659,523,784,880,784];notes.forEach((f,i)=>setTimeout(()=>blip(f,.15,'triangle',.05),i*150));burst('💃 🕺');say(pick(['Dance party!','Let us dance!','Move your feet!','Spin around!']));addXp(3)}
function stepZones(dt,t){stepBalls(dt,t);ZFX.disco.forEach(d=>d.rotation.y=t*1.2);ZFX.fount.forEach(h=>h.rotation.y=Math.sin(t*1.2)*.5);
  if(DANCE>0&&ME.obj){DANCE-=dt;ME.obj.rotation.y+=dt*7;const L=ME.obj.userData.limbs;if(L){L.arms[0].rotation.z=-2.4+Math.sin(t*10)*.4;L.arms[1].rotation.z=2.4-Math.sin(t*10)*.4}
    if(DANCE<=0&&L){L.arms[0].rotation.z=-.1;L.arms[1].rotation.z=.1}}}
