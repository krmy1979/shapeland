/* Shapeland · a world by Shirel Yitzhak */
/* ===================== ART STEP 1 · THE LAND OF LIGHT =====================
   A new look for the same legend: golden-hour light, a painted sky with a low sun, a Mediterranean sea,
   olive trees and palms, Jerusalem-stone ruins, oil lamps, floating light dust, drifting clouds and birds.
   And the heart of it: the world LIGHTS UP as players do good — more ✨ means warmer light, richer colors and more flowers. */
const LOL={L:.4,target:.4,pulse:0,flowers:[],motes:null,clouds:[],birds:[],dome:null,t:0};
const facet=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.85,metalness:0,flatShading:true},o||{}));
function canvasTex(w,h,draw,rep){const cv=document.createElement('canvas');cv.width=w;cv.height=h;draw(cv.getContext('2d'),w,h);const t=new THREE.CanvasTexture(cv);if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep,rep)}return t}
const rnd01=(()=>{let s=7;return()=>{s=(s*16807)%2147483647;return s/2147483647}})();

/* ---------- renderer: filmic tone ---------- */
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;

/* ---------- the painted sky dome ---------- */
(()=>{const g=new THREE.SphereGeometry(270,32,16);const m=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,toneMapped:false,
  uniforms:{top:{value:new THREE.Color('#3E7FCF')},hor:{value:new THREE.Color('#FFD7A3')},bot:{value:new THREE.Color('#F6C98E')},sunDir:{value:new THREE.Vector3(12,14,-22).normalize()},sunCol:{value:new THREE.Color('#FFE2A8')},glow:{value:1}},
  vertexShader:'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:`uniform vec3 top,hor,bot,sunCol,sunDir;uniform float glow;varying vec3 vD;void main(){float h=vD.y;vec3 c=h>0.?mix(hor,top,pow(clamp(h*1.6,0.,1.),.7)):mix(hor,bot,clamp(-h*3.,0.,1.));
    float s=max(dot(normalize(vD),sunDir),0.);c+=sunCol*(pow(s,350.)*2.5+pow(s,12.)*.35*glow+pow(s,3.)*.12*glow);gl_FragColor=vec4(c,1.);}`});
  const d=new THREE.Mesh(g,m);d.renderOrder=-10;d.frustumCulled=false;scene.add(d);LOL.dome=d})();

/* ---------- light & palette by the world's light level ---------- */
const hemi=scene.children.find(o=>o.isHemisphereLight);
const PAL0={top:'#4F78AE',hor:'#EBCB9F',bot:'#DDBB8E',sun:'#F3DDBA',fog:'#E4CDAE',hs:'#F3E8D8',hg:'#9C8466',si:.95,sat:1},PAL1={top:'#2C6FCB',hor:'#FFC98A',bot:'#F2BC80',sun:'#FFD38C',fog:'#F7D3A6',hs:'#FFF0D2',hg:'#B88A55',si:1.35,sat:1.22};
const _c1=new THREE.Color(),_c2=new THREE.Color();const lerpC=(a,b,k)=>'#'+_c1.set(a).lerp(_c2.set(b),k).getHexString();
function worldLight(){const s=typeof ST==='function'?ST():{light:0,shards:0};return clamp(.4+(s.light||0)/70*.45+(s.shards||0)/14*.15,.4,1)}
const OUTDOOR=z=>!['home','visit','work','inside','legend'].includes(z);
function applyPalette(k){const u=LOL.dome.material.uniforms;u.top.value.set(lerpC(PAL0.top,PAL1.top,k));u.hor.value.set(lerpC(PAL0.hor,PAL1.hor,k));u.bot.value.set(lerpC(PAL0.bot,PAL1.bot,k));u.sunCol.value.set(lerpC(PAL0.sun,PAL1.sun,k));u.glow.value=.4+k*.8;
  const raid=typeof RAID!=='undefined'&&RAID.raid;if(OUTDOOR(ME.zone)){const f=raid?'#6D5A8A':lerpC(PAL0.fog,PAL1.fog,k);scene.fog.color.set(f);scene.background.set(f)}
  if(hemi){hemi.color.set(lerpC(PAL0.hs,PAL1.hs,k));hemi.groundColor.set(lerpC(PAL0.hg,PAL1.hg,k));hemi.intensity=.55+k*.25}sun.color.set(lerpC(PAL0.sun,PAL1.sun,k));sun.intensity=(PAL0.si+(PAL1.si-PAL0.si)*k)*(raid?.6:1);
  renderer.domElement.style.filter=OUTDOOR(ME.zone)?`saturate(${(PAL0.sat+(PAL1.sat-PAL0.sat)*k+LOL.pulse*.25).toFixed(2)}) brightness(${(1+LOL.pulse*.12).toFixed(2)})`:''}
const _setAtmosL=setAtmos;setAtmos=function(zone){_setAtmosL(zone);LOL.dome.visible=OUTDOOR(zone);if(OUTDOOR(zone)){scene.fog.near=60;scene.fog.far=190}applyPalette(LOL.L)};
/* every act of kindness makes the world glow a little */
if(typeof kind==='function'){const _kindL=kind;kind=function(n,why){_kindL(n,why);LOL.pulse=1;bloomAround(6+n*3)}}

/* ---------- the Mediterranean sea ---------- */
(()=>{const tex=canvasTex(256,256,(c,w,h)=>{c.fillStyle='#1FA2B8';c.fillRect(0,0,w,h);for(let i=0;i<220;i++){const x=rnd01()*w,y=rnd01()*h,r=4+rnd01()*14;c.strokeStyle=`rgba(255,255,255,${.06+rnd01()*.12})`;c.lineWidth=1+rnd01()*2;c.beginPath();c.ellipse(x,y,r,r*.45,rnd01()*3,0,Math.PI*1.4);c.stroke()}},40);
  water.material=new THREE.MeshStandardMaterial({color:'#5FD3DD',map:tex,roughness:.18,metalness:.25,transparent:true,opacity:.94});LOL.waterTex=tex;
  const foam=new THREE.Mesh(new THREE.RingGeometry(R+1.1,R+2.3,64),new THREE.MeshBasicMaterial({color:'#FFFFFF',transparent:true,opacity:.35,depthWrite:false}));foam.rotation.x=-Math.PI/2;foam.position.y=-1.5;scene.add(foam);LOL.foam=foam})();

/* ---------- the island: meadow, sandstone cliffs, a stone path ---------- */
(()=>{const grass=canvasTex(512,512,(c,w,h)=>{const g=c.createRadialGradient(w/2,h/2,40,w/2,h/2,w/2);g.addColorStop(0,'#7DBA45');g.addColorStop(1,'#5E9C36');c.fillStyle=g;c.fillRect(0,0,w,h);
    for(let i=0;i<5000;i++){const x=rnd01()*w,y=rnd01()*h;c.fillStyle=['rgba(70,110,40,.35)','rgba(180,210,110,.35)','rgba(110,150,60,.3)'][i%3];c.fillRect(x,y,2,4+rnd01()*4)}
    for(let i=0;i<70;i++){const x=rnd01()*w,y=rnd01()*h;c.fillStyle=['#F8E3A0','#FFFFFF','#E9A3C9','#F5B971'][i%4];c.beginPath();c.arc(x,y,2.2,0,7);c.fill()}},1);
  ground.material=new THREE.MeshStandardMaterial({map:grass,roughness:.95});
  const strata=canvasTex(512,128,(c,w,h)=>{const cols=['#E7C79A','#D9B07C','#EBD3AA','#C99A66','#E2BD8C'];let y=0;while(y<h){const bh=8+rnd01()*22;c.fillStyle=cols[Math.floor(rnd01()*cols.length)];c.fillRect(0,y,w,bh);y+=bh}
    for(let i=0;i<400;i++){c.fillStyle='rgba(120,80,40,.12)';c.fillRect(rnd01()*w,rnd01()*h,6,2)}},1);strata.wrapS=THREE.RepeatWrapping;strata.repeat.set(6,1);
  scene.traverse(o=>{if(o.isMesh&&o.material&&o.material.color&&o.material.color.getHexString()==='b98a5e'&&o.geometry.type==='CylinderGeometry')o.material=new THREE.MeshStandardMaterial({map:strata,roughness:.9});
    if(o.isMesh&&o.material&&o.material.color&&o.material.color.getHexString()==='f4dfa8'&&o.geometry.type==='TorusGeometry')o.material=new THREE.MeshStandardMaterial({color:'#F3DDB3',roughness:1})});
  /* a path of Jerusalem stone from the spawn to the bridge */
  const stone=facet('#EADBC0');for(let z=1.5;z>-12.5;z-=1.05){const n=2+(Math.abs(z)%2>1?1:0);for(let i=0;i<n;i++){const s=new THREE.Mesh(new THREE.CylinderGeometry(.42+rnd01()*.15,.48,.08,6),stone);s.position.set(-.55+i*.62+(rnd01()-.5)*.15,.035,z+(rnd01()-.5)*.2);s.rotation.y=rnd01()*3;s.receiveShadow=true;scene.add(s)}}})();

/* ---------- olive trees and date palms instead of lollipop trees ---------- */
function oliveTree(x,z,s){const g=new THREE.Group();const bark=facet('#7D6B57'),leaf=facet('#93A877'),leaf2=facet('#6F8A5C');
  const t1=new THREE.Mesh(new THREE.CylinderGeometry(.16,.3,1.1,6),bark);t1.position.y=.55;t1.rotation.z=.25;g.add(t1);const t2=new THREE.Mesh(new THREE.CylinderGeometry(.12,.17,.9,6),bark);t2.position.set(.28,1.35,0);t2.rotation.z=-.35;g.add(t2);
  const t3=new THREE.Mesh(new THREE.CylinderGeometry(.09,.13,.8,6),bark);t3.position.set(-.05,1.3,.15);t3.rotation.x=.4;g.add(t3);
  for(let i=0;i<9;i++){const r=.38+rnd01()*.3;const m=new THREE.Mesh(new THREE.IcosahedronGeometry(r,0),i%3?leaf:leaf2);m.position.set((rnd01()-.5)*1.5,1.75+rnd01()*.7,(rnd01()-.5)*1.3);m.scale.y=.7;m.castShadow=true;g.add(m)}
  g.children.forEach(m=>m.castShadow=true);g.position.set(x,0,z);g.scale.setScalar(s);g.rotation.y=rnd01()*6;scene.add(g);return g}
function datePalm(x,z,s){const g=new THREE.Group();const bark=facet('#A27B52'),fr=facet('#5E9B4C');let px=0,py=0;for(let i=0;i<6;i++){const seg=new THREE.Mesh(new THREE.CylinderGeometry(.14,.17,.55,6),bark);px+=.05*i;py+=.52;seg.position.set(px,py,0);seg.rotation.z=-.07*i;seg.castShadow=true;g.add(seg)}
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const lf=new THREE.Mesh(new THREE.ConeGeometry(.16,1.9,3),fr);lf.position.set(px+Math.cos(a)*.7,py+.15,Math.sin(a)*.7);lf.rotation.set(Math.sin(a)*1.1,0,-Math.cos(a)*1.1);lf.castShadow=true;g.add(lf)}
  const dates=new THREE.Mesh(new THREE.IcosahedronGeometry(.22,0),facet('#B45309'));dates.position.set(px,py-.2,0);g.add(dates);g.position.set(x,0,z);g.scale.setScalar(s);g.rotation.y=rnd01()*6;scene.add(g);return g}
(()=>{const old=[];scene.children.forEach(o=>{if(o.isGroup&&o.children.length===3&&o.children[1].isMesh&&o.children[1].material.color&&o.children[1].material.color.getHexString()==='3fa34d')old.push(o)});
  old.forEach((o,i)=>{o.visible=false;const p=o.position;if(Math.hypot(p.x,p.z)>11.5&&Math.hypot(p.x,p.z)<16)datePalm(p.x,p.z,o.scale.x*1.05);else oliveTree(p.x,p.z,o.scale.x*1.1)})})();

/* ---------- ruins, an arch and oil lamps ---------- */
(()=>{const st=facet('#EFE2C8'),st2=facet('#E3D2B2');
  const column=(x,z,h,broken)=>{const g=new THREE.Group();const base=new THREE.Mesh(new THREE.BoxGeometry(.9,.25,.9),st2);base.position.y=.12;g.add(base);const sh=new THREE.Mesh(new THREE.CylinderGeometry(.3,.33,h,10),st);sh.position.y=.25+h/2;g.add(sh);
    if(!broken){const cap=new THREE.Mesh(new THREE.BoxGeometry(.8,.22,.8),st2);cap.position.y=.25+h+.11;g.add(cap)}else{sh.rotation.z=.04}g.children.forEach(m=>{m.castShadow=true;m.receiveShadow=true});g.position.set(x,0,z);scene.add(g);return g};
  column(-12.2,-1.2,2.6,0);column(-11.6,1.4,1.5,1);column(12.4,1.3,2.2,0);column(11.4,-3.2,1.1,1);
  const lying=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,1.6,10),st);lying.rotation.z=Math.PI/2;lying.position.set(-10.6,.3,2.6);lying.castShadow=true;scene.add(lying);
  /* the arch at the bridge */
  const arch=new THREE.Group();[-1.85,1.85].forEach(x=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.8,3.2,.9),st);p.position.set(x,1.6,0);arch.add(p)});
  const top=new THREE.Mesh(new THREE.TorusGeometry(1.85,.42,6,16,Math.PI),st);top.position.y=3.15;arch.add(top);const key=new THREE.Mesh(new THREE.BoxGeometry(.5,.6,.95),st2);key.position.y=5.2;arch.add(key);
  arch.children.forEach(m=>{m.castShadow=true});arch.position.set(0,0,-12.9);scene.add(arch);
  /* oil lamps along the path, they glow more as the world lights up */
  LOL.lamps=[];[[-1.6,-2],[1.6,-2],[-1.6,-7],[1.6,-7],[-1.6,2.2],[1.6,2.2]].forEach(([x,z])=>{const g=new THREE.Group();const post=new THREE.Mesh(new THREE.CylinderGeometry(.05,.07,1.2,6),facet('#6B4F35'));post.position.y=.6;g.add(post);
    const bowl=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6,0,Math.PI*2,Math.PI/2,Math.PI/2),facet('#B45309'));bowl.position.y=1.25;bowl.rotation.x=Math.PI;g.add(bowl);
    const fl=new THREE.Mesh(new THREE.ConeGeometry(.07,.2,6),new THREE.MeshBasicMaterial({color:'#FFC24A'}));fl.position.y=1.38;g.add(fl);const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:'#FFB347',transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));gl.scale.set(1.3,1.3,1);gl.position.y=1.4;g.add(gl);
    g.position.set(x,0,z);scene.add(g);LOL.lamps.push({fl,gl})})})();
function glowTex(){if(LOL.gt)return LOL.gt;LOL.gt=canvasTex(64,64,(c,w,h)=>{const g=c.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,230,170,.55)');g.addColorStop(1,'rgba(255,200,120,0)');c.fillStyle=g;c.fillRect(0,0,w,h)});return LOL.gt}

/* ---------- flowers that bloom with the light ---------- */
(()=>{const cols=['#F472B6','#FDE047','#FFFFFF','#FB923C','#C084FC','#F87171'];const geo=new THREE.IcosahedronGeometry(.11,0);
  cols.forEach(c=>{const im=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({color:c,roughness:.6,flatShading:true}),60);im.count=0;scene.add(im);LOL.flowers.push(im)});LOL.flowerN=0;
  const m=new THREE.Matrix4();LOL.addFlower=(x,z)=>{const im=LOL.flowers[LOL.flowerN%LOL.flowers.length];if(im.count>=60)return;const s=.7+rnd01()*.6;m.makeScale(s,s,s);m.setPosition(x,.1,z);im.setMatrixAt(im.count,m);im.count++;im.instanceMatrix.needsUpdate=true;LOL.flowerN++}})();
function bloomAround(n){if(ME.zone!=='island')return;for(let i=0;i<n;i++){const a=rnd01()*Math.PI*2,r=1+rnd01()*4;const x=ME.pos.x+Math.cos(a)*r,z=ME.pos.z+Math.sin(a)*r;if(Math.hypot(x,z)<R-.6)LOL.addFlower(x,z)}}
(()=>{const n=Math.round(20+worldLight()*60);for(let i=0;i<n;i++){const a=rnd01()*Math.PI*2,r=3+rnd01()*(R-4);LOL.addFlower(Math.cos(a)*r,Math.sin(a)*r)}})();

/* ---------- light dust, clouds and birds ---------- */
(()=>{const N=180,pos=new Float32Array(N*3);for(let i=0;i<N;i++){pos[i*3]=(rnd01()-.5)*30;pos[i*3+1]=rnd01()*8;pos[i*3+2]=(rnd01()-.5)*30}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const p=new THREE.Points(g,new THREE.PointsMaterial({size:.16,map:glowTex(),color:'#FFE6A8',transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));p.frustumCulled=false;scene.add(p);LOL.motes=p;
  const ct=canvasTex(256,128,(c,w,h)=>{for(let i=0;i<9;i++){const x=40+rnd01()*176,y=60+rnd01()*30,r=26+rnd01()*30;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill()}});
  for(let i=0;i<14;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:ct,color:'#FFF4E6',transparent:true,opacity:.85,depthWrite:false,fog:false}));const a=i/14*Math.PI*2,r=150+rnd01()*70;s.position.set(Math.cos(a)*r,18+rnd01()*30,Math.sin(a)*r-40);const k=40+rnd01()*40;s.scale.set(k,k*.5,1);scene.add(s);LOL.clouds.push({s,a,r,v:.004+rnd01()*.004})}
  for(let i=0;i<6;i++){const b=new THREE.Group();[-1,1].forEach(k=>{const w=new THREE.Mesh(new THREE.ConeGeometry(.07,.6,3),new THREE.MeshBasicMaterial({color:'#3F3A36'}));w.rotation.z=k*1.3;w.position.x=k*.25;b.add(w)});scene.add(b);LOL.birds.push({b,a:rnd01()*6,r:14+rnd01()*10,h:9+rnd01()*5,sp:.25+rnd01()*.2})}})();

/* ---------- every frame ---------- */
function stepLand(dt){LOL.t+=dt;const out=OUTDOOR(ME.zone);LOL.target=worldLight();LOL.L+=(LOL.target-LOL.L)*Math.min(1,dt*.8);LOL.pulse=Math.max(0,LOL.pulse-dt*.6);
  LOL.dome.position.copy(camera.position);if(out)applyPalette(LOL.L);
  if(LOL.waterTex){LOL.waterTex.offset.x+=dt*.004;LOL.waterTex.offset.y+=dt*.002}if(LOL.foam)LOL.foam.material.opacity=.25+Math.sin(LOL.t*1.3)*.1;
  if(LOL.motes&&out){LOL.motes.position.set(ME.pos.x,0,ME.pos.z);const a=LOL.motes.geometry.attributes.position;for(let i=0;i<a.count;i++){let y=a.getY(i)+dt*(.15+(i%5)*.04);if(y>8)y=0;a.setY(i,y)}a.needsUpdate=true;LOL.motes.material.opacity=.35+LOL.L*.55}
  if(LOL.motes)LOL.motes.visible=out;LOL.clouds.forEach(c=>{c.a+=c.v*dt;c.s.position.x=Math.cos(c.a)*c.r;c.s.position.z=Math.sin(c.a)*c.r-40;c.s.visible=out});
  LOL.birds.forEach(b=>{b.a+=b.sp*dt;b.b.position.set(Math.cos(b.a)*b.r,b.h+Math.sin(b.a*3),Math.sin(b.a)*b.r-4);b.b.rotation.y=-b.a;b.b.children.forEach((w,i)=>w.rotation.z=(i?-1:1)*(1.1+Math.sin(LOL.t*9+b.a)*.4));b.b.visible=out});
  (LOL.lamps||[]).forEach((l,i)=>{const f=.85+Math.sin(LOL.t*12+i*2)*.08+Math.sin(LOL.t*7.3+i)*.05;l.fl.scale.setScalar(f);l.gl.material.opacity=(.35+LOL.L*.55)*f})}
const _stepStoryLand=stepStory;stepStory=function(dt,t){_stepStoryLand(dt,t);try{stepLand(dt)}catch(e){if(!window.__lerr){window.__lerr=1;console.warn('land',e)}}};
setAtmos(ME.zone);
