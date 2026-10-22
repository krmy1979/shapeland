/* Shapeland · a world by Shirel Yitzhak */
/* ===================== 3D SETUP ===================== */
const stage=$('#stage');
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#9FD6FF');scene.fog=new THREE.Fog('#9FD6FF',50,120);
const camera=new THREE.PerspectiveCamera(50,1,.1,300);camera.position.set(0,13,21);
const controls=new THREE.OrbitControls(camera,renderer.domElement);controls.target.set(0,0,2);controls.enableDamping=true;controls.dampingFactor=.12;
controls.maxPolarAngle=1.38;controls.minDistance=3;controls.maxDistance=42;controls.enablePan=false;
scene.add(new THREE.HemisphereLight('#FFFFFF','#6FAE5C',.75));
const sun=new THREE.DirectionalLight('#FFF6E5',.95);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20,near:1,far:80});sun.shadow.camera.updateProjectionMatrix();scene.add(sun);scene.add(sun.target);
const MATS={};function mat(hex,o){const k=hex+(o?JSON.stringify(o):'');if(!MATS[k])MATS[k]=new THREE.MeshStandardMaterial(Object.assign({color:hex,roughness:.5,metalness:.04},o||{}));return MATS[k]}
function mesh(geo,m,sh){const x=new THREE.Mesh(geo,m);x.castShadow=sh!==false;x.receiveShadow=true;return x}
const R=14,TR=15.5;
const water=new THREE.Mesh(new THREE.PlaneGeometry(700,700),new THREE.MeshStandardMaterial({color:'#4FB3E8',roughness:.25,metalness:.1}));water.rotation.x=-Math.PI/2;water.position.y=-1.6;scene.add(water);
function islandBase(cx,cz,r,top){const g=mesh(new THREE.CylinderGeometry(r+1,r+1,.5,64),mat(top),false);g.position.set(cx,-.25,cz);scene.add(g);
  const d=mesh(new THREE.CylinderGeometry(r+1,r*.6,5,64),mat('#B98A5E'),false);d.position.set(cx,-3,cz);scene.add(d);
  const s=mesh(new THREE.TorusGeometry(r+.9,.45,8,64),mat('#F4DFA8'),false);s.rotation.x=Math.PI/2;s.position.set(cx,-.35,cz);scene.add(s);return g}
const ground=islandBase(0,0,R,'#7CCF6A');ground.userData.walk='island';
const townGround=islandBase(0,-46,TR,'#9BD48A');townGround.userData.walk='town';
const plaza=mesh(new THREE.CylinderGeometry(9.5,9.5,.06,48),mat('#EADFC9'),false);plaza.position.set(0,.03,-46);plaza.userData.walk='town';scene.add(plaza);
const bridge=(()=>{const g=new THREE.Group();const deck=mesh(new THREE.BoxGeometry(2.8,.25,20),mat('#B7865A'));deck.position.set(0,-.05,-23);deck.userData.walk='bridge';g.add(deck);
  for(let z=-32;z<=-14;z+=1.2){const pl=mesh(new THREE.BoxGeometry(2.8,.04,.12),mat('#8B5E3C'),false);pl.position.set(0,.09,z);g.add(pl)}
  [-1.35,1.35].forEach(x=>{const rail=mesh(new THREE.BoxGeometry(.12,.12,20),mat('#8B5E3C'));rail.position.set(x,.6,-23);g.add(rail);
    for(let z=-32.5;z<=-13.5;z+=2.5){const post=mesh(new THREE.CylinderGeometry(.07,.07,.65,6),mat('#8B5E3C'));post.position.set(x,.3,z);g.add(post)}});scene.add(g);return deck})();
function tree(x,z,s){const g=new THREE.Group();const t=mesh(new THREE.CylinderGeometry(.18,.25,1.2,8),mat('#8B5A2B'));t.position.y=.6;g.add(t);
  const c1=mesh(new THREE.SphereGeometry(.9,12,10),mat('#3FA34D'));c1.position.y=1.6;g.add(c1);const c2=mesh(new THREE.SphereGeometry(.6,12,10),mat('#56BC5E'));c2.position.set(.35,2.2,.1);g.add(c2);
  g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g)}
[[-12,-6,1.1],[-11,-9,.8],[12,-8,1],[-13.4,5,.9],[13.3,4.6,.8],[-6,-12,1],[6,-12.2,.9],[13,8,.8],[-13,8,.9]].forEach(a=>tree(...a));
[[-13,-40,1],[13,-40,.9],[-14,-50,.8],[14,-52,1],[0,-60,.9],[-9,-58,.8],[10,-59,.9]].forEach(a=>tree(...a));

/* labels */
function label(text,bg,fg,scale){const cv=document.createElement('canvas');const c=cv.getContext('2d');c.font='600 40px Fredoka, Arial, sans-serif';
  const w=Math.ceil(c.measureText(text).width)+44;cv.width=w;cv.height=64;c.font='600 40px Fredoka, Arial, sans-serif';
  c.fillStyle=bg||'rgba(255,255,255,.92)';c.beginPath();if(c.roundRect)c.roundRect(0,0,w,64,32);else c.rect(0,0,w,64);c.fill();
  c.fillStyle=fg||'#1D2A48';c.textAlign='center';c.textBaseline='middle';c.fillText(text,w/2,34);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),depthTest:false}));const k=scale||.42;s.scale.set(w/64*k,k,1);s.renderOrder=10;return s}
function marker(ch,bg){const cv=document.createElement('canvas');cv.width=cv.height=128;const c=cv.getContext('2d');c.fillStyle=bg;c.beginPath();c.arc(64,64,56,0,7);c.fill();
  c.lineWidth=8;c.strokeStyle='#fff';c.stroke();c.font='700 72px Fredoka, Arial';c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.fillText(ch,64,70);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),depthTest:false}));s.scale.set(.7,.7,1);s.renderOrder=11;return s}
function rootify(g){g.traverse(o=>o.userData.root=g);return g}

/* Shirel's sign */
const SIGN=(()=>{const g=new THREE.Group();const wood=mat('#9A6A3C');
  [-2.4,2.4].forEach(x=>{const p=mesh(new THREE.CylinderGeometry(.14,.16,2.6,8),wood);p.position.set(x,1.3,0);g.add(p)});
  const cv=document.createElement('canvas');cv.width=1024;cv.height=340;const tex=new THREE.CanvasTexture(cv);
  const draw=()=>{const c=cv.getContext('2d');const gr=c.createLinearGradient(0,0,0,340);gr.addColorStop(0,'#C88D55');gr.addColorStop(1,'#A86F3E');c.fillStyle=gr;c.fillRect(0,0,1024,340);
    c.strokeStyle='rgba(90,50,20,.35)';c.lineWidth=3;for(let y=40;y<340;y+=56){c.beginPath();c.moveTo(0,y);c.bezierCurveTo(300,y+8,700,y-8,1024,y);c.stroke()}
    c.strokeStyle='#FFE7B0';c.lineWidth=8;c.strokeRect(18,18,988,304);
    c.fillStyle='#FFF3D6';c.textAlign='center';c.font='600 46px Fredoka, Arial, sans-serif';c.fillText('WELCOME TO',512,92);
    c.font='700 112px "Dancing Script", "Brush Script MT", cursive';c.fillStyle='#FFFFFF';c.shadowColor='rgba(60,30,10,.45)';c.shadowOffsetY=5;c.fillText("Shirel Yitzhak's",512,206);
    c.shadowColor='transparent';c.font='700 58px Fredoka, Arial, sans-serif';c.fillStyle='#FFD34D';c.fillText('✦  W O R L D  ✦',512,288);tex.needsUpdate=true};
  draw();try{Promise.all([document.fonts.load('700 112px "Dancing Script"'),document.fonts.load('600 46px Fredoka')]).then(draw)}catch(e){}
  const board=new THREE.Mesh(new THREE.BoxGeometry(5.6,1.9,.22),[wood,wood,wood,wood,new THREE.MeshStandardMaterial({map:tex,roughness:.7}),wood]);
  board.position.y=2.3;board.castShadow=true;g.add(board);
  const star=mesh(new THREE.OctahedronGeometry(.32),mat('#FFD34D',{metalness:.4,roughness:.25,emissive:'#7a5a00'}));star.position.y=3.6;g.add(star);
  g.position.set(0,0,-10.2);scene.add(rootify(g));g.userData.sign=true;g.userData.spin=star;return g})();
const FLAG=(()=>{const g=new THREE.Group();const pole=mesh(new THREE.CylinderGeometry(.08,.08,3.2,8),mat('#E5E7EB'));pole.position.y=1.6;g.add(pole);
  const cv=document.createElement('canvas');cv.width=cv.height=64;const c=cv.getContext('2d');for(let i=0;i<4;i++)for(let j=0;j<4;j++){c.fillStyle=(i+j)%2?'#1D2A48':'#FFFFFF';c.fillRect(i*16,j*16,16,16)}
  const f=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.9,8,1),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(cv),side:THREE.DoubleSide}));f.position.set(.72,2.7,0);g.add(f);
  const lb=label('Race ⚡','#FFB41F');lb.position.y=3.6;g.add(lb);g.position.set(0,0,11.5);scene.add(rootify(g));g.userData.race=true;g.userData.flag=f;return g})();

/* NPCs */
const NPCOBJ={};
NPCS.forEach(n=>{const g=new THREE.Group();const b=mesh(new THREE.SphereGeometry(.62,24,18),mat(n.color));b.scale.set(1,1.2,1);b.position.y=.85;g.add(b);
  [-1,1].forEach(s=>{const e=mesh(new THREE.SphereGeometry(.13,12,10),mat('#FFFFFF'));e.position.set(s*.22,1.1,.52);g.add(e);const p=mesh(new THREE.SphereGeometry(.07,10,8),mat('#1D2A48'));p.position.set(s*.22,1.1,.63);g.add(p)});
  const smile=mesh(new THREE.TorusGeometry(.12,.03,6,14,Math.PI),mat('#1D2A48'));smile.rotation.z=Math.PI;smile.position.set(0,.88,.6);g.add(smile);
  if(n.id==='bella'){const h=mesh(new THREE.SphereGeometry(.45,18,10,0,Math.PI*2,0,Math.PI/2),mat(n.hat));h.position.y=1.42;g.add(h);const br=mesh(new THREE.CylinderGeometry(.55,.55,.06,18),mat(n.hat));br.position.y=1.42;g.add(br)}
  if(n.id==='leo'){const h=mesh(new THREE.ConeGeometry(.42,1.1,16),mat(n.hat));h.position.y=1.95;h.rotation.z=.15;g.add(h)}
  if(n.id==='mia')[-1,1].forEach(s=>{const bw=mesh(new THREE.ConeGeometry(.16,.3,10),mat('#FFFFFF'));bw.rotation.z=s*Math.PI/2;bw.position.set(s*.17,1.6,0);g.add(bw)});
  if(n.id==='kim'){const h=mesh(new THREE.CylinderGeometry(.32,.26,.45,16),mat('#FFFFFF'));h.position.y=1.68;g.add(h);const top=mesh(new THREE.SphereGeometry(.36,14,10),mat('#FFFFFF'));top.position.y=1.95;top.scale.y=.6;g.add(top)}
  if(n.id==='tom'){const h=mesh(new THREE.CylinderGeometry(.62,.62,.04,18),mat(n.hat));h.position.y=1.45;g.add(h);const c=mesh(new THREE.CylinderGeometry(.32,.36,.3,16),mat(n.hat));c.position.y=1.6;g.add(c)}
  if(n.id==='sam'){const c=mesh(new THREE.CylinderGeometry(.42,.36,.3,16),mat(n.hat));c.position.y=1.55;g.add(c);const br=mesh(new THREE.BoxGeometry(.5,.04,.25),mat('#111827'));br.position.set(0,1.42,.42);g.add(br)}
  if(n.id==='dana'){const b=mesh(new THREE.BoxGeometry(.35,.28,.12),mat('#7C4A2D'));b.position.set(.62,.7,.1);g.add(b)}
  if(n.id==='bear'){[-1,1].forEach(s=>{const ear=mesh(new THREE.SphereGeometry(.2,12,10),mat(n.color));ear.position.set(s*.4,1.5,0);g.add(ear)});const h=mesh(new THREE.CylinderGeometry(.3,.3,.4,16),mat(n.hat));h.position.y=1.7;g.add(h)}
  const lb=label(n.name);lb.position.y=2.75;g.add(lb);const mk=marker('!','#EE4F7C');mk.position.y=3.35;g.add(mk);
  const[cx,cz]=ZC[n.zone];g.position.set(cx+n.x,0,cz+n.z);g.lookAt(cx,0,cz+(n.zone==='island'?2:0));rootify(g);g.userData.npc=n.id;g.userData.mk=mk;scene.add(g);NPCOBJ[n.id]=g});

/* Town buildings + fountain */
const BLDG=[];
function awningTex(c1){const cv=document.createElement('canvas');cv.width=128;cv.height=32;const c=cv.getContext('2d');for(let i=0;i<8;i++){c.fillStyle=i%2?'#FFFFFF':c1;c.fillRect(i*16,0,16,32)}return new THREE.CanvasTexture(cv)}
BUILDINGS.forEach(b=>{const g=new THREE.Group();const body=mesh(new THREE.BoxGeometry(4.4,3,3.4),mat(b.color));body.position.y=1.5;g.add(body);
  const roof=mesh(new THREE.ConeGeometry(3.4,1.6,4),mat(b.roof));roof.rotation.y=Math.PI/4;roof.scale.set(1,1,.8);roof.position.y=3.8;g.add(roof);
  const aw=new THREE.Mesh(new THREE.BoxGeometry(4.6,.12,1.1),new THREE.MeshStandardMaterial({map:awningTex(b.roof)}));aw.position.set(0,2.35,2.1);aw.rotation.x=.25;aw.castShadow=true;g.add(aw);
  const door=mesh(new THREE.BoxGeometry(1.1,1.8,.1),mat('#5B3A1E'));door.position.set(0,.9,1.72);g.add(door);
  [-1.45,1.45].forEach(x=>{const w=mesh(new THREE.BoxGeometry(.9,.8,.08),mat('#BFE3FF',{roughness:.15}));w.position.set(x,1.55,1.72);g.add(w)});
  const lb=label(b.en,'#FFFFFF','#1D2A48',.55);lb.position.y=5.2;g.add(lb);
  const[cx,cz]=ZC.town;g.position.set(cx+b.x,0,cz+b.z);g.lookAt(cx,0,cz);rootify(g);g.userData.bld=b.id;scene.add(g);BLDG.push(g)});
(()=>{const[cx,cz]=ZC.town;const f=new THREE.Group();const basin=mesh(new THREE.CylinderGeometry(1.8,2,.6,32),mat('#CBD5E1'));basin.position.y=.3;f.add(basin);
  const wat=mesh(new THREE.CylinderGeometry(1.6,1.6,.05,32),mat('#60C4F0',{roughness:.1}),false);wat.position.y=.58;f.add(wat);
  const col=mesh(new THREE.CylinderGeometry(.25,.35,1.6,16),mat('#E2E8F0'));col.position.y=1.1;f.add(col);const top=mesh(new THREE.SphereGeometry(.45,16,10),mat('#60C4F0',{roughness:.1,transparent:true,opacity:.8}));top.position.y=2;f.add(top);
  f.position.set(cx,0,cz);scene.add(f);
  const welcome=label('Shapeland Town','#1D2A48','#FFFFFF',.6);welcome.position.set(cx,3.2,cz+13);scene.add(welcome)})();

/* chests */
const CHESTS=[];
function makeChest(zone){const g=new THREE.Group();const base=mesh(new THREE.BoxGeometry(.9,.55,.6),mat('#B45309'));base.position.y=.28;g.add(base);
  const lid=mesh(new THREE.CylinderGeometry(.3,.3,.9,16,1,false,0,Math.PI),mat('#D97706'));lid.rotation.z=Math.PI/2;lid.position.y=.56;g.add(lid);
  const band=mesh(new THREE.BoxGeometry(.12,.62,.64),mat('#FCD34D',{metalness:.5,roughness:.3}));band.position.y=.35;g.add(band);
  const mk=marker('?','#19B8C9');mk.position.y=1.4;g.add(mk);rootify(g);g.userData.chest=true;g.userData.mk=mk;g.userData.zone=zone;scene.add(g);CHESTS.push(g);placeChest(g);return g}
function placeChest(g){const z=g.userData.zone,[cx,cz]=ZC[z],rad=z==='island'?12.5:13.5;
  if(z==='city'){const used=CHESTS.filter(c=>c!==g&&c.visible&&c.userData.zone==='city').map(c=>Math.round(c.position.x-cx)+','+Math.round(c.position.z-cz));const sp=pick(CITY_CHESTS.filter(p=>!used.includes(Math.round(p[0])+','+Math.round(p[1]))));g.position.set(cx+sp[0],0,cz+sp[1]);g.visible=true;return}
  for(let i=0;i<50;i++){const a=Math.random()*Math.PI*2,d=4+Math.random()*(rad-4);const x=Math.cos(a)*d,zz=Math.sin(a)*d;
    const okN=NPCS.every(n=>n.zone!==z||Math.hypot(n.x-x,n.z-zz)>2.5),okB=z!=='town'||BUILDINGS.every(b=>Math.hypot(b.x-x,b.z-zz)>3.6)&&Math.hypot(x,zz)>2.6;
    const okI=z!=='island'||(Math.hypot(x,zz+10.2)>3&&Math.hypot(x,zz-11.5)>2&&Math.abs(x)>1.8||zz>-9)&&P.pieces.every(p=>Math.hypot(p.x-x,p.z-zz)>1.2)&&PLOTS.every(([px,pz])=>Math.hypot(px-x,pz-zz)>2.6);
    if(okN&&okB&&okI){g.position.set(cx+x,0,cz+zz);g.rotation.y=Math.random()*6;break}}g.visible=true}
