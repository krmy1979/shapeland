/* Shapeland · a world by Shirel Yitzhak */
/* ===================== REAL PEOPLE (prototype): semi-realistic kids with real proportions, faces, hair and clothes =====================
   Feet at y=0, about 1.9 tall. Head about 1/5.5 of the height. Same rig contract as human3D: userData.limbs={arms,legs,rig}. */
const RL3={tex:{}};
function rlTex(key,w,h,draw){if(RL3.tex[key])return RL3.tex[key];const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;if(renderer&&renderer.outputEncoding)t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return RL3.tex[key]=t}
const rlMat=(hex,o)=>new THREE.MeshStandardMaterial(Object.assign({color:hex,roughness:.6,metalness:0},o||{}));
function rlMix(a,b,t){const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);const ch=s=>Math.round(((A>>s)&255)*(1-t)+((B>>s)&255)*t);return'#'+[16,8,0].map(s=>ch(s).toString(16).padStart(2,'0')).join('')}
/* hair: fine strands texture */
function hairTex(hex){return rlTex('hair'+hex,256,256,(x,w,h)=>{x.fillStyle=hex;x.fillRect(0,0,w,h);
  for(let i=0;i<900;i++){const px=Math.random()*w,l=.25+Math.random()*.6;x.strokeStyle=Math.random()<.35?shade(hex,.1+Math.random()*.12):shade(hex,-.3);x.globalAlpha=.18+Math.random()*.25;x.lineWidth=.6+Math.random()*1.2;
    x.beginPath();x.moveTo(px,Math.random()*h);x.bezierCurveTo(px+3,h*.3,px-3,h*.6,px+(Math.random()-.5)*6,Math.random()*h+l*h);x.stroke()}x.globalAlpha=1})}
function hairMat(hex){const m=rlMat('#FFFFFF',{map:hairTex(hex),roughness:.45,side:THREE.DoubleSide});return m}
/* clothes textures */
function denimTex(hex){return rlTex('den'+hex,128,128,(x,w,h)=>{x.fillStyle=hex;x.fillRect(0,0,w,h);for(let i=-h;i<w;i+=3){x.strokeStyle=shade(hex,.12);x.globalAlpha=.35;x.beginPath();x.moveTo(i,h);x.lineTo(i+h,0);x.stroke()}
  for(let i=0;i<500;i++){x.fillStyle=Math.random()<.5?'#FFFFFF':'#000000';x.globalAlpha=.05;x.fillRect(Math.random()*w,Math.random()*h,2,1)}x.globalAlpha=1})}
function shirtTex(hex,style){return rlTex('sh'+hex+style,512,256,(x,w,h)=>{x.fillStyle=hex;x.fillRect(0,0,w,h);
  if(style==='plaid'){const d=shade(hex,-.35),l=shade(hex,.35);x.globalAlpha=.45;for(let i=0;i<w;i+=32){x.fillStyle=d;x.fillRect(i,0,10,h);x.fillStyle=l;x.fillRect(i+18,0,3,h)}for(let j=0;j<h;j+=32){x.fillStyle=d;x.fillRect(0,j,w,10);x.fillStyle=l;x.fillRect(0,j+18,w,3)}x.globalAlpha=1}
  if(style==='button'||style==='plaid'){const p=shade(hex,-.12);x.fillStyle=p;x.fillRect(0,0,7,h);x.fillRect(w-7,0,7,h);x.strokeStyle=shade(hex,-.3);x.lineWidth=1;x.beginPath();x.moveTo(7,0);x.lineTo(7,h);x.moveTo(w-7,0);x.lineTo(w-7,h);x.stroke();
    for(let j=30;j<h-20;j+=38){x.fillStyle='#F5F5F4';x.beginPath();x.arc(0,j,5,0,7);x.fill();x.beginPath();x.arc(w,j,5,0,7);x.fill()}
    x.strokeStyle=shade(hex,-.25);x.strokeRect(w*.1,h*.52,40,36)}
  if(style==='stripe'){x.fillStyle='#FFFFFF';x.globalAlpha=.8;for(let j=0;j<h;j+=26)x.fillRect(0,j,w,9);x.globalAlpha=1}})}
/* a tube that follows a curve and gets thinner — ponytails, locks of hair, brows */
function taper(pts,r0,r1,m,o){o=o||{};const cv=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2])));const N=o.seg||30,R=o.rad||14;const fr=cv.computeFrenetFrames(N,false);const pos=[],uv=[],idx=[];
  for(let i=0;i<=N;i++){const t=i/N,c=cv.getPointAt(t);const rr=(r0+(r1-r0)*t)*(o.prof?o.prof(t):1);const n=fr.normals[i],b=fr.binormals[i];
    for(let j=0;j<=R;j++){const a=j/R*Math.PI*2,sx=Math.cos(a)*rr*(o.sx||1),sy=Math.sin(a)*rr*(o.sy||1);pos.push(c.x+n.x*sx+b.x*sy,c.y+n.y*sx+b.y*sy,c.z+n.z*sx+b.z*sy);uv.push(j/R*(o.ur||1),t*(o.vr||2))}}
  for(let i=0;i<N;i++)for(let j=0;j<R;j++){const a=i*(R+1)+j,b=a+R+1;idx.push(a,b,a+1,b,b+1,a+1)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return mesh(g,m)}
const lathe=(pts,m,seg,ps,pl)=>mesh(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),seg||40,ps||0,pl||Math.PI*2),m);
const rell=(r,sx,sy,sz,m,x,y,z)=>{const o=mesh(new THREE.SphereGeometry(r,24,18),m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);return o};
const cyl=(r0,r1,h,m,y)=>{const o=mesh(new THREE.CylinderGeometry(r0,r1,h,20),m);o.position.y=y;return o};

/* ch: {g, skin, hc, hair, ec, lip, top:{kind,col}, bot:{kind,col}, jacket:{col}|null, shoe} */
function real3D(ch){const girl=ch.g!=='boy';const g=new THREE.Group();const rig=new THREE.Group();rig.position.y=.92;g.add(rig);const B=new THREE.Group();B.position.y=-.92;rig.add(B);
  const S=rlMat(ch.skin,{roughness:.5,emissive:ch.skin,emissiveIntensity:.12});
  const top=ch.top||{kind:'tee',col:'#F9A8D4'},bot=ch.bot||{kind:'jeans',col:'#3B5B8C'};
  const TM=top.kind==='button'||top.kind==='plaid'||top.kind==='stripe'?rlMat('#FFFFFF',{map:shirtTex(top.col,top.kind),roughness:.75}):rlMat(top.col,{roughness:.8});
  const SL=top.kind==='button'||top.kind==='plaid'?rlMat(top.kind==='plaid'?'#FFFFFF':top.col,top.kind==='plaid'?{map:shirtTex(top.col,'plaid'),roughness:.75}:{roughness:.75}):TM;
  const BM=bot.kind==='jeans'?rlMat('#FFFFFF',{map:denimTex(bot.col),roughness:.85}):rlMat(bot.col,{roughness:.8});
  const dress=bot.kind==='dress',skirt=bot.kind==='skirt'||dress,longSleeve=top.sleeve==='long';
  /* legs */
  const legs=[],arms=[];
  [-1,1].forEach(s=>{const L=new THREE.Group();L.position.set(s*.085,.92,0);B.add(L);
    const thighM=skirt?S:BM,shinM=skirt||bot.kind==='shorts'?S:BM;
    L.add(cyl(.086,.064,.46,thighM,-.22));if(bot.kind==='shorts'){L.add(cyl(.094,.08,.24,BM,-.11))}
    L.add(rell(.063,1,1,1,shinM,0,-.44,0));const K=new THREE.Group();K.position.y=-.44;L.add(K);
    K.add(cyl(.062,.045,.4,shinM,-.2));if(bot.kind==='jeans')K.add(cyl(.067,.058,.04,rlMat(shade(bot.col,-.15),{roughness:.9}),-.38));
    const SH=rlMat(ch.shoe||'#F5F5F4',{roughness:.5});const shoe=rell(.056,1,.64,2.0,SH,0,-.43,.035);K.add(shoe);const sole=rell(.057,1.02,.2,2.02,rlMat('#E7E5E4'),0,-.46,.035);K.add(sole);
    if(!girl||ch.shoe!=='#1F2937')K.add(rell(.02,1.6,.4,1,rlMat(shade(ch.shoe||'#F5F5F4',-.3)),0,-.405,.07));
    legs.push(L)});
  /* hips / skirt / dress */
  if(!skirt){{const hp=lathe([[0,.82],[.15,.82],[.158,.88],[.152,.96],[.143,1.02],[0,1.02]],BM,48);hp.scale.z=.8;B.add(hp)}
    if(bot.kind==='jeans'){const belt=mesh(new THREE.TorusGeometry(.148,.012,6,40),rlMat('#5B3A22',{roughness:.5}));belt.rotation.x=Math.PI/2;belt.scale.set(.97,.8,1);belt.position.y=1.0;B.add(belt);B.add(rell(.018,1.3,1,.4,rlMat('#D4AF37',{metalness:.7,roughness:.3}),0,1.0,.118))}}
  else{const sk=new THREE.LatheGeometry([[0,1.05],[.15,1.05],[.17,.98],[.22,.85],[.29,.62],[.305,.56],[0,.56]].map(p=>new THREE.Vector2(p[0],p[1])),64);
    const P2=sk.attributes.position;for(let i=0;i<P2.count;i++){const x=P2.getX(i),y=P2.getY(i),z=P2.getZ(i);const t=Math.max(0,(1.0-y)/.44),a=Math.atan2(x,z);const k=1+.06*t*Math.sin(a*14);P2.setXYZ(i,x*k,y,z*k*.85)}sk.computeVertexNormals();
    const SKM=dress?TM.clone():BM;SKM.side=THREE.DoubleSide;B.add(mesh(sk,SKM))}
  /* torso */
  const tp=girl?[[0,.95],[.14,.95],[.145,1.0],[.122,1.1],[.13,1.2],[.152,1.28],[.155,1.34],[.148,1.39],[.11,1.435],[.055,1.46],[0,1.46]]
    :[[0,.95],[.148,.95],[.15,1.0],[.14,1.1],[.15,1.2],[.165,1.29],[.17,1.35],[.16,1.4],[.115,1.44],[.058,1.465],[0,1.465]];
  const torso=lathe(tp,TM,48);torso.scale.z=.66;B.add(torso);
  if(top.kind==='button'||top.kind==='plaid'){[-1,1].forEach(s=>{const c=mesh(new THREE.BoxGeometry(.075,.012,.05),SL);c.position.set(s*.04,1.462,.045);c.rotation.set(-.6,s*.55,s*.35);B.add(c)})}
  if(top.kind==='tee'||top.kind==='blouse'){const nk=mesh(new THREE.TorusGeometry(.058,.009,6,30),rlMat(shade(top.col,-.08),{roughness:.8}));nk.rotation.x=Math.PI/2+.25;nk.position.set(0,1.455,.012);B.add(nk)}
  if(dress||top.kind==='blouse'){const sash=mesh(new THREE.TorusGeometry(.128,.016,8,40),rlMat(ch.sash||'#FFFFFF',{roughness:.5}));sash.rotation.x=Math.PI/2;sash.scale.set(1,.68,1);sash.position.y=1.1;B.add(sash);
    if(dress){const bw=rell(.03,1.4,.9,.5,rlMat(ch.sash||'#FFFFFF'),0,1.1,.09);B.add(bw)}}
  /* jacket: open in front */
  if(ch.jacket){const J=rlMat(ch.jacket.col,{roughness:.7,side:THREE.DoubleSide,map:ch.jacket.denim?denimTex(ch.jacket.col):null});if(ch.jacket.denim)J.color.set('#FFFFFF');
    const jp=tp.map(([r,y])=>[r?r+.016:0,y]);jp[0]=[0,.9];jp[1]=[.162,.9];const jk=lathe(jp,J,48,.42,Math.PI*2-.84);jk.scale.z=.7;B.add(jk);
    [-1,1].forEach(s=>{const lp=mesh(new THREE.BoxGeometry(.05,.2,.012),J);lp.position.set(s*.075,1.33,.105);lp.rotation.set(-.15,0,s*.28);B.add(lp)});
    const col=mesh(new THREE.TorusGeometry(.075,.022,8,24,Math.PI*1.3),J);col.rotation.set(Math.PI/2+.5,0,Math.PI*-.15+Math.PI);col.position.set(0,1.45,-.01);B.add(col)}
  /* neck */
  B.add(cyl(.054,.062,.14,S,1.5));
  /* arms */
  [-1,1].forEach(s=>{const A=new THREE.Group();A.position.set(s*.19,1.375,0);A.rotation.z=s*.09;B.add(A);
    const AM=ch.jacket?rlMat(ch.jacket.col,{roughness:.7,map:ch.jacket.denim?denimTex(ch.jacket.col):null,color:ch.jacket.denim?'#FFFFFF':ch.jacket.col}):SL;
    A.add(rell(.058,1,.9,1,ch.jacket?AM:SL,0,-.01,0));
    const sleeveLen=ch.jacket||longSleeve?.3:top.kind==='blouse'?.12:.15;
    A.add(cyl(.054,.047,.3,S,-.15));A.add(cyl(.06,.054,sleeveLen,ch.jacket?AM:SL,-sleeveLen/2));
    if(top.kind==='blouse'&&!ch.jacket)A.add(rell(.066,1,.75,1,SL,0,-.05,0));
    const E=new THREE.Group();E.position.y=-.3;E.rotation.x=-.18;A.add(E);E.add(rell(.046,1,1,1,ch.jacket||longSleeve?(ch.jacket?AM:SL):S,0,0,0));
    E.add(cyl(.045,.034,.26,S,-.13));if(ch.jacket||longSleeve){E.add(cyl(.05,.043,.24,ch.jacket?AM:SL,-.12))}
    const hand=rell(.04,.72,1.25,.45,S,0,-.3,0);hand.rotation.y=s*.25;E.add(hand);const th=rell(.014,1,1.8,1,S,-s*.006,-.285,.02);th.rotation.x=.5;E.add(th);
    arms.push(A)});
  /* head */
  const head=new THREE.Group();head.position.y=1.7;B.add(head);
  const hd=lathe([[0,-.162],[.045,-.16],[.085,-.142],[.113,-.11],[.13,-.065],[.14,-.015],[.144,.04],[.139,.1],[.12,.145],[.082,.175],[.04,.187],[0,.19]],S,48);hd.scale.z=1.07;head.add(hd);
  /* face */
  const ink=rlMat('#1C130E',{roughness:.4}),W=rlMat('#FBFAF7',{roughness:.2}),IR=rlMat(ch.ec||'#5B3A22',{roughness:.2}),PU=rlMat('#0B0705',{roughness:.1});
  const zf=(x,y)=>{const r=y>.04?.143-(y-.04)*.05:y>-.02?.141:.138-(-.02-y)*.6;return Math.sqrt(Math.max(.0001,r*r-x*x))*1.07};
  [-1,1].forEach(s=>{const ex=s*.052,ey=.012,ez=zf(ex,ey)-.016;
    head.add(rell(.024,1.1,.92,1,W,ex,ey,ez));
    const ir=mesh(new THREE.CircleGeometry(.0152,28),IR);ir.position.set(ex,ey-.001,ez+.0226);head.add(ir);
    const pu=mesh(new THREE.CircleGeometry(.0068,16),PU);pu.position.set(ex,ey-.001,ez+.0229);head.add(pu);
    const hl=mesh(new THREE.CircleGeometry(.0026,10),rlMat('#FFFFFF',{emissive:'#FFFFFF',emissiveIntensity:.6}));hl.position.set(ex+.0045,ey+.0045,ez+.0232);head.add(hl);
    const lid=mesh(new THREE.SphereGeometry(.0256,20,10,0,Math.PI*2,0,1.02),S);lid.scale.set(1.12,.95,1.02);lid.position.set(ex,ey,ez);lid.rotation.x=.3;head.add(lid);
    const lash=mesh(new THREE.TorusGeometry(.0262,girl?.0032:.0024,5,20,Math.PI*.95),ink);lash.scale.set(1.1,.7,1);lash.position.set(ex,ey+.003,ez+.012);lash.rotation.set(-.2,0,Math.PI*.025);head.add(lash);
    if(girl){const w=mesh(new THREE.ConeGeometry(.0028,.012,4),ink);w.position.set(ex+s*.028,ey+.01,ez+.008);w.rotation.z=-s*1.1;head.add(w)}
    
    const by=.052,BRM=rlMat(shade(ch.hc,-.1),{roughness:.8});head.add(taper([[s*.024,by,zf(.024,by)+.001],[s*.05,by+.009,zf(.05,by)+.002],[s*.078,by+.002,zf(.078,by)]],girl?.0055:.0075,girl?.0025:.004,BRM,{seg:10,rad:6,sy:.5}));
    head.add(rell(.03,.42,1.05,.75,S,s*.141,-.005,-.008));
    if(girl||ch.blush){const bl=rell(.026,1.3,.8,.3,rlMat(ch.blushC||'#F08A9A',{transparent:true,opacity:.28}),s*.07,-.04,zf(.07,-.04)-.004);bl.rotation.y=s*.5;head.add(bl)}});
  /* nose */
  head.add(rell(.014,.8,2.3,1,S,0,-.008,zf(0,-.008)-.004));head.add(rell(.017,1.15,.95,1,S,0,-.042,zf(0,-.042)+.0));
  [-1,1].forEach(s=>head.add(rell(.011,1,.85,1,S,s*.016,-.046,zf(.016,-.046)-.006)));
  /* lips */
  const LC=ch.lip||rlMix(ch.skin,'#C2566A',girl?.55:.4),LM=rlMat(LC,{roughness:.35});
  const mz=zf(0,-.08);const up=rell(.027,1.05,.32,.5,LM,0,-.075,mz-.005);head.add(up);const lw=rell(.024,1,.45,.55,LM,0,-.089,mz-.006);head.add(lw);
  const ml=mesh(new THREE.TorusGeometry(.026,.0017,4,20,Math.PI*.9),rlMat(shade(LC,-.45)));ml.scale.set(1,.3,1);ml.rotation.z=Math.PI*1.05;ml.position.set(0,-.0765,mz+.007);head.add(ml);
  /* hair */
  realHair(ch,head);
  g.userData.h=2.02;g.userData.limbs={arms,legs,rig};g.userData.head=head;return g}

/* one seamless hair shell: hairline high on the forehead, lower at the sides, lowest at the back */
function hairShell(r,front,side,back,sc,yo,m,part){const NU=64,NV=22,pos=[],uv=[],idx=[];
  for(let i=0;i<=NU;i++){const phi=i/NU*Math.PI*2;let d=Math.abs(((phi-Math.PI/2)+Math.PI*3)%(Math.PI*2)-Math.PI);/* 0 = front, pi = back */
    const tm=d<Math.PI/2?front+(side-front)*(1-Math.cos(d))/1:side+(back-side)*(1-Math.cos(d-Math.PI/2));
    for(let j=0;j<=NV;j++){const th=j/NV*tm;let rr=r*(1+.04*Math.sin(th)*(d/Math.PI));if(part&&d<.5&&j>NV*.4)rr*=1+.02*(1-d/.5);
      pos.push(-rr*Math.cos(phi)*Math.sin(th)*sc[0],rr*Math.cos(th)*sc[1]+yo,rr*Math.sin(phi)*Math.sin(th)*sc[2]);uv.push(i/NU*3,j/NV)}}
  for(let i=0;i<NU;i++)for(let j=0;j<NV;j++){const a=i*(NV+1)+j,b=a+NV+1;idx.push(a,a+1,b,b,a+1,b+1)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return mesh(g,m)}
function realHair(ch,head){const H=hairMat(ch.hc);const add=o=>{head.add(o);return o};const style=ch.hair;
  const shell=(r,th0,th1,ps,pl,sc,yo)=>{const m=mesh(new THREE.SphereGeometry(r,48,24,ps,pl,th0,th1-th0),H);m.scale.set(sc[0],sc[1],sc[2]);m.position.y=yo||0;return add(m)};
  const top=(f,sd,bk)=>add(hairShell(.172,f||.95,sd||1.55,bk||2.25,[.98,1.06,1.08],.018,H,1));
  const backC=()=>0;
  const lock=(pts,r0,r1,o)=>add(taper(pts,r0,r1,H,Object.assign({sy:.55,vr:3},o||{})));
  if(style==='ponyup'){top(.95,1.5,1.85);
    add(rell(.03,1,1,1,rlMat(ch.tie||'#EC4899'),0,.17,-.1)).scale.set(1.2,.6,1.2);
    lock([[0,.17,-.11],[0,.26,-.17],[0,.2,-.27],[0,.0,-.29],[0,-.22,-.25],[.015,-.4,-.2]],.05,.01,{sy:1,prof:t=>.8+.5*Math.sin(Math.PI*Math.min(1,t*1.3))});
    [-1,1].forEach(s=>lock([[s*.11,.1,.1],[s*.135,.0,.09],[s*.13,-.1,.06]],.012,.004,{sy:.6}))}
  else if(style==='longfront'){top(.95,1.62,2.35);
    for(let i=-6;i<=6;i++){const x=i*.022,zb=-.14-.02*Math.cos(i/6*1.4);lock([[x,.06,zb+.03],[x*1.15,-.12,zb-.02],[x*1.15,-.35,zb],[x*1.05,-.52,zb+.02]],.034,.02,{sy:.5})}
    [-1,1].forEach(s=>lock([[s*.13,.06,-.02],[s*.155,-.1,-.05],[s*.15,-.3,-.07],[s*.13,-.46,-.07]],.036,.018,{sy:.6}))
    lock([[.12,.08,.06],[.15,-.05,.06],[.16,-.2,.11],[.13,-.36,.14],[.11,-.48,.13]],.045,.02,{sy:.5,prof:t=>1+.3*Math.sin(Math.PI*t)});
    lock([[.1,.1,.09],[.135,-.04,.1],[.14,-.18,.13],[.115,-.33,.15]],.03,.014,{sy:.5});
    lock([[-.12,.08,.05],[-.15,-.05,.02],[-.15,-.2,-.03],[-.13,-.35,-.06]],.04,.02,{sy:.5});
    lock([[-.02,.17,.1],[-.07,.13,.13],[-.11,.07,.125]],.03,.012,{sy:.4})}
  else if(style==='boyshort'){top(.9,1.35,1.95);lock([[-.1,.135,.1],[-.03,.165,.125],[.05,.165,.115],[.11,.13,.09]],.03,.022,{sy:.55,seg:16})}
  else if(style==='boycurly'){top(.95,1.35,1.95);
    for(let e=20;e<=85;e+=13)for(let a=0;a<360;a+=360/Math.max(1,Math.round(Math.cos(e*Math.PI/180)*14))){const E=e*Math.PI/180,A=a*Math.PI/180;const r=.168;const x=Math.sin(A)*Math.cos(E)*r,y=Math.sin(E)*r*1.1+.03,z=Math.cos(A)*Math.cos(E)*r*1.1;
      if(z>.07&&y<.12)continue;add(rell(.028,1,.85,1,H,x,y,z))}}}
