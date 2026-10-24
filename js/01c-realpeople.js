/* Shapeland · a world by Shirel Yitzhak */
/* ===================== REAL PEOPLE: semi-realistic kids with real proportions, painted faces, real hair styles and clothes =====================
   Feet at y=0, about 1.9 tall. Head about 1/5.5 of the height. Same rig contract as human3D: userData.limbs={arms,legs,rig}. */
const RL3={tex:{}};
function rlTex(key,w,h,draw){if(RL3.tex[key])return RL3.tex[key];const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return RL3.tex[key]=t}
const RLM={};const rlMat=(hex,o)=>{const k=hex+JSON.stringify(o||{},(kk,v)=>v&&v.isTexture?v.uuid:v);return RLM[k]||(RLM[k]=new THREE.MeshStandardMaterial(Object.assign({color:hex,roughness:.6,metalness:0},o||{})))};
function rlMix(a,b,t){const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);const ch=s=>Math.round(((A>>s)&255)*(1-t)+((B>>s)&255)*t);return'#'+[16,8,0].map(s=>ch(s).toString(16).padStart(2,'0')).join('')}
/* hair: fine strands texture */
function hairTex(hex){return rlTex('hair'+hex,256,256,(x,w,h)=>{x.fillStyle=hex;x.fillRect(0,0,w,h);
  for(let i=0;i<900;i++){const px=Math.random()*w,l=.25+Math.random()*.6;x.strokeStyle=Math.random()<.35?shade(hex,.1+Math.random()*.12):shade(hex,-.3);x.globalAlpha=.18+Math.random()*.25;x.lineWidth=.6+Math.random()*1.2;
    x.beginPath();x.moveTo(px,Math.random()*h);x.bezierCurveTo(px+3,h*.3,px-3,h*.6,px+(Math.random()-.5)*6,Math.random()*h+l*h);x.stroke()}x.globalAlpha=1})}
/* hair shine band */
function hairTex2(hex){return rlTex('hair2'+hex,256,256,(x,w,h)=>{x.drawImage(hairTex(hex).image,0,0);const gr=x.createLinearGradient(0,h*.18,0,h*.42);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,240,220,.22)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,w,h)})}
/* painted face: skin shading, eye sockets, creases, brows from tiny hairs, nose shadows, real lips, blush and makeup.
   x in [-.15,.15] -> u, y in [-.17,.19] -> v */
const fX=x=>(x/.3+.5)*512,fY=y=>(1-(y+.17)/.36)*512,fS=d=>d/.3*512;
function faceTex(ch){const girl=ch.g!=='boy';const key='face'+JSON.stringify([ch.skin,ch.hc,ch.lip,ch.sh,ch.liner,ch.blc,ch.frk,girl,ch.bro,ch.glit]);
  return rlTex(key,512,512,(x,w,h)=>{const S=ch.skin,D=shade(S,-.22),DD=shade(S,-.4),L=shade(S,.12);
    const rg=(cx,cy,r,col,a,sy)=>{x.save();x.translate(fX(cx),fY(cy));x.scale(1,sy||1);const g=x.createRadialGradient(0,0,0,0,0,fS(r));g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');x.globalAlpha=a;x.fillStyle=g;x.beginPath();x.arc(0,0,fS(r),0,7);x.fill();x.restore()};
    x.fillStyle=S;x.fillRect(0,0,w,h);
    /* gentle 3D shading: forehead light, jaw and temples darker */
    rg(0,.09,.09,L,.55,.8);rg(0,-.03,.06,L,.35);[-1,1].forEach(s=>{rg(s*.13,.03,.06,D,.35,1.6);rg(s*.1,-.12,.07,D,.35)});rg(0,-.175,.1,D,.35,.6);
    [-1,1].forEach(s=>{const ex=s*.052;
      rg(ex,.022,.042,D,.42,.7);rg(ex+s*.012,.04,.03,DD,.18,.6);/* eye socket */
      if(ch.sh&&ch.sh!=='none')rg(ex+s*.004,.032,.036,ch.sh,.75,.55);
      x.strokeStyle=DD;x.globalAlpha=.45;x.lineWidth=2.2;x.beginPath();x.moveTo(fX(ex-s*.022),fY(.03));x.quadraticCurveTo(fX(ex),fY(.047),fX(ex+s*.026),fY(.03));x.stroke();/* lid crease */
      x.globalAlpha=.25;x.lineWidth=1.6;x.beginPath();x.moveTo(fX(ex-s*.02),fY(-.008));x.quadraticCurveTo(fX(ex),fY(-.018),fX(ex+s*.024),fY(-.006));x.stroke();/* lower lid */
      if(ch.liner){x.globalAlpha=.95;x.strokeStyle='#120A06';x.lineWidth=4;x.beginPath();x.moveTo(fX(ex+s*.024),fY(.016));x.lineTo(fX(ex+s*.04),fY(.03));x.stroke()}
      /* brows: many little hairs */
      const bc=shade(ch.hc||'#3A2A20',-.05),th=ch.bro==='bold'?1.6:girl?.95:1.3,peak=ch.bro==='straight'?.002:ch.bro==='arch'?.014:.009;
      x.strokeStyle=bc;for(let i=0;i<70;i++){const t=Math.random(),bx=s*(.022+t*.058),by=.052+Math.sin(Math.min(1,t*1.4)*Math.PI*.8)*peak-(t>.75?(t-.75)*.03:0)+(Math.random()-.5)*.006*th*(1-t*.5);
        x.globalAlpha=.35+Math.random()*.45;x.lineWidth=1+Math.random()*.9;x.beginPath();x.moveTo(fX(bx),fY(by-.003));x.lineTo(fX(bx+s*.006),fY(by+.003+t*.001));x.stroke()}
      /* cheeks */
      rg(s*.074,-.045,.045,ch.blc&&ch.blc!=='none'?ch.blc:(girl?'#F08A9A':'#E59A8C'),girl?.2:.12,.75);
      if(ch.frk){x.fillStyle=shade(S,-.35);for(let i=0;i<22;i++){x.globalAlpha=.35+Math.random()*.4;x.beginPath();x.arc(fX(s*(.03+Math.random()*.07)),fY(-.02-Math.random()*.04),1+Math.random()*1.4,0,7);x.fill()}}});
    x.globalAlpha=1;
    /* nose: side shadows, nostrils, tip light */
    [-1,1].forEach(s=>{rg(s*.016,-.015,.016,D,.4,2.4);x.fillStyle=DD;x.globalAlpha=.7;x.beginPath();x.ellipse(fX(s*.0115),fY(-.052),fS(.0055),fS(.003),s*.4,0,7);x.fill()});
    x.globalAlpha=1;rg(0,-.04,.012,L,.5);rg(0,-.062,.012,D,.35,.7);/* philtrum */
    /* lips */
    const LC=ch.lip&&ch.lip!=='none'?ch.lip:rlMix(S,'#C2566A',girl?.55:.4),y0=-.078;
    x.fillStyle=LC;x.beginPath();x.moveTo(fX(-.03),fY(y0));x.quadraticCurveTo(fX(-.016),fY(y0+.012),fX(-.005),fY(y0+.009));x.quadraticCurveTo(fX(0),fY(y0+.006),fX(.005),fY(y0+.009));
    x.quadraticCurveTo(fX(.016),fY(y0+.012),fX(.03),fY(y0));x.quadraticCurveTo(fX(.017),fY(y0-.022),fX(0),fY(y0-.022));x.quadraticCurveTo(fX(-.017),fY(y0-.022),fX(-.03),fY(y0));x.fill();
    const lg=x.createLinearGradient(0,fY(y0+.012),0,fY(y0-.022));lg.addColorStop(0,shade(LC,-.18));lg.addColorStop(.35,'rgba(0,0,0,0)');lg.addColorStop(.75,'rgba(255,255,255,.12)');lg.addColorStop(1,shade(LC,-.2));x.fillStyle=lg;x.fill();
    x.strokeStyle=shade(LC,-.5);x.lineWidth=2.2;x.globalAlpha=.85;x.beginPath();x.moveTo(fX(-.03),fY(y0+.001));x.quadraticCurveTo(fX(-.012),fY(y0-.004),fX(0),fY(y0-.001));x.quadraticCurveTo(fX(.012),fY(y0-.004),fX(.03),fY(y0+.001));x.stroke();
    x.globalAlpha=.4;x.fillStyle='#FFFFFF';x.beginPath();x.ellipse(fX(.006),fY(y0-.013),fS(.008),fS(.0025),0,0,7);x.fill();x.globalAlpha=1;
    rg(0,-.112,.02,D,.3,.6)/* under lip */
    if(ch.glit){[-1,1].forEach(s=>{for(let i=0;i<14;i++){const gx=s*(.06+Math.random()*.045),gy=-.01-Math.random()*.045;x.fillStyle=i%3?'#FDE68A':'#FFFFFF';x.globalAlpha=.9;x.beginPath();x.arc(fX(gx),fY(gy),1.2+Math.random()*1.6,0,7);x.fill()}});x.globalAlpha=1}})}
function curlTex(hex){return rlTex('curl'+hex,256,256,(x,w,h)=>{x.fillStyle=hex;x.fillRect(0,0,w,h);for(let i=0;i<700;i++){x.strokeStyle=Math.random()<.4?shade(hex,.16):shade(hex,-.32);x.globalAlpha=.35+Math.random()*.3;x.lineWidth=1+Math.random();
  x.beginPath();x.arc(Math.random()*w,Math.random()*h,3+Math.random()*5,Math.random()*6,Math.random()*6+3);x.stroke()}x.globalAlpha=1})}
function curlMat(hex){return rlMat('#FFFFFF',{map:curlTex(hex),roughness:.75,side:THREE.DoubleSide})}
function irisTex(hex){return rlTex('iris'+hex,128,128,(x,w,h)=>{x.fillStyle='#FBFAF7';x.fillRect(0,0,w,h);const c=w/2;const g=x.createRadialGradient(c,c,8,c,c,62);g.addColorStop(0,shade(hex,.25));g.addColorStop(.75,hex);g.addColorStop(.92,shade(hex,-.45));g.addColorStop(1,'#1A120C');
  x.fillStyle=g;x.beginPath();x.arc(c,c,62,0,7);x.fill();for(let i=0;i<90;i++){const a=Math.random()*7;x.strokeStyle=Math.random()<.5?shade(hex,.35):shade(hex,-.35);x.globalAlpha=.35;x.lineWidth=1.2;x.beginPath();x.moveTo(c+Math.cos(a)*24,c+Math.sin(a)*24);x.lineTo(c+Math.cos(a)*58,c+Math.sin(a)*58);x.stroke()}
  x.globalAlpha=1;x.fillStyle='#0B0705';x.beginPath();x.arc(c,c,25,0,7);x.fill()})}
function hairMat(hex){const m=rlMat('#FFFFFF',{map:hairTex2(hex),roughness:.42,side:THREE.DoubleSide});return m}
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
function taper(pts,r0,r1,m,o){o=o||{};const cv=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2])));const N=Math.min(o.seg||18,18),R=Math.min(o.rad||8,8);const fr=cv.computeFrenetFrames(N,false);const pos=[],uv=[],idx=[];
  for(let i=0;i<=N;i++){const t=i/N,c=cv.getPointAt(t);const rr=(r0+(r1-r0)*t)*(o.prof?o.prof(t):1);const n=fr.normals[i],b=fr.binormals[i];
    for(let j=0;j<=R;j++){const a=j/R*Math.PI*2,sx=Math.cos(a)*rr*(o.sx||1),sy=Math.sin(a)*rr*(o.sy||1);pos.push(c.x+n.x*sx+b.x*sy,c.y+n.y*sx+b.y*sy,c.z+n.z*sx+b.z*sy);uv.push(j/R*(o.ur||1),t*(o.vr||2))}}
  for(let i=0;i<N;i++)for(let j=0;j<R;j++){const a=i*(R+1)+j,b=a+R+1;idx.push(a,b,a+1,b,b+1,a+1)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return mesh(g,m)}
const lathe=(pts,m,seg,ps,pl)=>mesh(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),seg||40,ps||0,pl||Math.PI*2),m);
const rell=(r,sx,sy,sz,m,x,y,z)=>{const o=mesh(new THREE.SphereGeometry(r,14,10),m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);return o};
const cyl=(r0,r1,h,m,y)=>{const o=mesh(new THREE.CylinderGeometry(r0,r1,h,12),m);o.position.y=y;return o};

/* ---------- clothes catalogue (all free in the mirror; the shops still sell the special outfits) ---------- */
const TOPS={tee:['חולצת טי','t-shirt'],blouse:['חולצה עם שרוולים תפוחים','blouse'],button:['חולצה מכופתרת','button shirt'],plaid:['חולצה משובצת','plaid shirt'],stripe:['חולצת פסים','striped shirt'],hoodie:['סווטשירט עם כובע','hoodie']};
const JACKETS={none:['בלי ג׳קט','no jacket'],denim:['ג׳קט ג׳ינס','denim jacket','#7FA3D6',1],black:['ג׳קט שחור','black jacket','#1F2937'],leather:['ג׳קט עור חום','brown leather jacket','#6B3F22'],
  pink:['ג׳קט ורוד','pink jacket','#F9A8D4'],white:['ג׳קט לבן','white jacket','#F5F5F4'],green:['ג׳קט ירוק','green jacket','#3F6B4E'],blazer:['בלייזר כחול','navy blazer','#1E3A5F']};
const SHOES=[['#F5F5F4','white sneakers','סניקרס לבנות'],['#1F2937','black shoes','נעליים שחורות'],['#EC4899','pink shoes','נעליים ורודות'],['#DC2626','red shoes','נעליים אדומות'],['#7C4A2D','brown boots','מגפיים חומות'],['#3B82F6','blue sneakers','סניקרס כחולות'],['#FACC15','gold shoes','נעליים זהובות']];
const DENIM=[['#3B5B8C','blue jeans','ג׳ינס כחול'],['#1E2B45','dark jeans','ג׳ינס כהה'],['#8DA9D4','light jeans','ג׳ינס בהיר'],['#2B2B2E','black jeans','ג׳ינס שחור'],['#F5F5F4','white jeans','ג׳ינס לבן']];
BOTTOMS.jeans=['ג׳ינס','jeans'];
Object.assign(HAIRS,{ponyup:['קוקו גבוה','high ponytail','girl',0],longfront:['שיער קדימה בצד','hair over one shoulder','girl',0],frontboth:['שיער קדימה משני הצדדים','hair in front','girl',0],
  frenchbraid:['צמה צרפתית','french braid','girl',0],highbun:['גולגול גבוה','high bun','girl',0]});
const _sanHumanR=sanitizeHuman;sanitizeHuman=function(c){const r=_sanHumanR(c||{});const hex=v=>typeof v==='string'&&/^#[0-9A-Fa-f]{6}$/.test(v);
  r.ts=TOPS[c.ts]?c.ts:'tee';r.sl=c.sl==='long'?'long':'short';r.jk=JACKETS[c.jk]?c.jk:'none';r.shc=SHOES.some(x=>x[0]===c.shc)?c.shc:'#F5F5F4';if(r.bot==='jeans'&&!hex(c.bc))r.bc='#3B5B8C';return r};

/* ---------- build a real person from the saved character ---------- */
function real3D(c){c=sanitizeHuman(c);const girl=c.g!=='boy';const g=new THREE.Group();const rig=new THREE.Group();rig.position.y=1.2;g.add(rig);const B=new THREE.Group();B.position.y=-1.2;rig.add(B);
  const S=rlMat(c.skin,{roughness:.5,emissive:c.skin,emissiveIntensity:.12});
  /* outfit presets from the clothes shop */
  let ts=c.ts,top=c.top,sl=c.sl,bk=c.bot,bc=c.bc,jk=c.jk!=='none'?c.jk:null,tie=false,sparkle=false;
  if(c.outfit==='hoodie'){ts='hoodie';sl='long'}if(c.outfit==='jacket')jk='denim';if(c.outfit==='jersey')ts='stripe';
  if(c.outfit==='suit'){ts='button';top='#FFFFFF';sl='long';jk='blazer';bk='pants';bc='#1E293B';tie=true}
  if(c.outfit==='party'){bk='dress';sparkle=true}
  if(ts==='hoodie')sl='long';
  const shirtLike=ts==='button'||ts==='plaid'||ts==='stripe';
  const TM=shirtLike?rlMat('#FFFFFF',{map:shirtTex(top,ts),roughness:.75}):rlMat(top,{roughness:.8,metalness:sparkle?.3:0});
  const SL=ts==='button'?rlMat(top,{roughness:.75}):TM;
  const jeans=bk==='jeans';const BM=jeans?rlMat('#FFFFFF',{map:denimTex(bc),roughness:.85}):rlMat(bc,{roughness:.8});
  const dress=bk==='dress',skirt=bk==='skirt'||dress,longSleeve=sl==='long';
  const J=jk?(JACKETS[jk][3]?rlMat('#FFFFFF',{map:denimTex(JACKETS[jk][2]),roughness:.8,side:THREE.DoubleSide}):rlMat(JACKETS[jk][2],{roughness:jk==='leather'?.4:.75,side:THREE.DoubleSide})):null;
  const legs=[],arms=[];
  /* legs */
  [-1,1].forEach(s=>{const L=new THREE.Group();L.position.set(s*.085,.92,0);B.add(L);
    const thighM=skirt?S:BM,shinM=skirt||bk==='shorts'?S:BM;
    L.add(cyl(.086,.064,.46,thighM,-.22));if(bk==='shorts')L.add(cyl(.094,.08,.24,BM,-.11));
    L.add(rell(.063,1,1,1,shinM,0,-.44,0));const K=new THREE.Group();K.position.y=-.44;L.add(K);
    K.add(cyl(.062,.045,.4,shinM,-.2));if(jeans)K.add(cyl(.067,.058,.04,rlMat(shade(bc,-.15),{roughness:.9}),-.38));
    const boot=c.shc==='#7C4A2D';const SH=rlMat(c.shc,{roughness:c.shc==='#1F2937'?.35:.55,metalness:c.shc==='#FACC15'?.5:0});
    if(boot)K.add(cyl(.066,.06,.16,SH,-.34));
    K.add(rell(.056,1,.64,2.0,SH,0,-.43,.035));K.add(rell(.057,1.02,.2,2.02,rlMat(boot?'#3B2416':'#E7E5E4'),0,-.46,.035));
    if(c.shc==='#F5F5F4'||c.shc==='#3B82F6')K.add(rell(.02,1.6,.4,1,rlMat(shade(c.shc,-.3)),0,-.405,.07));
    legs.push(L)});
  /* hips, skirt or dress */
  if(!skirt){const hp=lathe([[0,.82],[.15,.82],[.158,.88],[.152,.96],[.143,1.02],[0,1.02]],BM,28);hp.scale.z=.8;B.add(hp);
    if(jeans||bk==='pants'){const belt=mesh(new THREE.TorusGeometry(.148,.012,6,40),rlMat('#5B3A22',{roughness:.5}));belt.rotation.x=Math.PI/2;belt.scale.set(.97,.8,1);belt.position.y=1.0;B.add(belt);B.add(rell(.018,1.3,1,.4,rlMat('#D4AF37',{metalness:.7,roughness:.3}),0,1.0,.118))}}
  else{const low=dress?.56:.66;const sk=new THREE.LatheGeometry([[0,1.05],[.15,1.05],[.17,.98],[.22,.88],[.28,low+.06],[.295,low],[0,low]].map(p=>new THREE.Vector2(p[0],p[1])),42);
    const P2=sk.attributes.position;for(let i=0;i<P2.count;i++){const x=P2.getX(i),y=P2.getY(i),z=P2.getZ(i);const t=Math.max(0,(1.0-y)/.44),a=Math.atan2(x,z);const k=1+.06*t*Math.sin(a*14);P2.setXYZ(i,x*k,y,z*k*.85)}sk.computeVertexNormals();
    B.add(mesh(sk,dress?rlMat(top,{roughness:.7,metalness:sparkle?.35:0,side:THREE.DoubleSide}):rlMat(bc,{roughness:.8,side:THREE.DoubleSide})))}
  /* torso */
  const tp=girl?[[0,.95],[.14,.95],[.145,1.0],[.122,1.1],[.13,1.2],[.152,1.28],[.155,1.34],[.148,1.39],[.11,1.435],[.055,1.46],[0,1.46]]
    :[[0,.95],[.148,.95],[.15,1.0],[.14,1.1],[.15,1.2],[.165,1.29],[.17,1.35],[.16,1.4],[.115,1.44],[.058,1.465],[0,1.465]];
  const torso=lathe(tp,dress?rlMat(top,{roughness:.7,metalness:sparkle?.35:0}):TM,32);torso.scale.z=.66;B.add(torso);
  if(ts==='button'||ts==='plaid'){[-1,1].forEach(s=>{const cl=mesh(new THREE.BoxGeometry(.075,.012,.05),SL);cl.position.set(s*.04,1.462,.045);cl.rotation.set(-.6,s*.55,s*.35);B.add(cl)})}
  if(ts==='tee'||ts==='blouse'||ts==='stripe'){const nk=mesh(new THREE.TorusGeometry(.058,.009,6,30),rlMat(shade(top,-.08),{roughness:.8}));nk.rotation.x=Math.PI/2+.25;nk.position.set(0,1.455,.012);B.add(nk)}
  if(ts==='hoodie'){B.add(rell(.11,1.25,.7,.75,TM,0,1.43,-.1));const pk=mesh(new THREE.BoxGeometry(.17,.08,.02),rlMat(shade(top,-.1),{roughness:.85}));pk.position.set(0,1.1,.1);B.add(pk);
    [-1,1].forEach(s=>{const st=cyl(.0035,.0035,.1,rlMat('#FFFFFF'),1.38);st.position.set(s*.025,1.38,.1);B.add(st)})}
  if(tie){const t1=mesh(new THREE.BoxGeometry(.034,.2,.01),rlMat('#B91C1C',{roughness:.5}));t1.position.set(0,1.32,.108);t1.rotation.x=-.12;B.add(t1);B.add(rell(.018,1.2,1,.6,rlMat('#B91C1C'),0,1.43,.08))}
  if(dress||ts==='blouse'){const sash=mesh(new THREE.TorusGeometry(.128,.016,8,40),rlMat(dress?'#FFFFFF':shade(top,-.15),{roughness:.5}));sash.rotation.x=Math.PI/2;sash.scale.set(1,.68,1);sash.position.y=1.1;B.add(sash);
    if(dress)B.add(rell(.03,1.4,.9,.5,rlMat('#FFFFFF'),0,1.1,.09))}
  /* jacket: open in front */
  if(J){const jp=tp.map(([r,y])=>[r?r+.016:0,y]);jp[0]=[0,.9];jp[1]=[.162,.9];const jkM=lathe(jp,J,32,.42,Math.PI*2-.84);jkM.scale.z=.7;B.add(jkM);
    [-1,1].forEach(s=>{const lp=mesh(new THREE.BoxGeometry(.05,.2,.012),J);lp.position.set(s*.075,1.33,.105);lp.rotation.set(-.15,0,s*.28);B.add(lp)});
    const col=mesh(new THREE.TorusGeometry(.075,.022,8,24,Math.PI*1.3),J);col.rotation.set(Math.PI/2+.5,0,Math.PI*.85);col.position.set(0,1.45,-.01);B.add(col)}
  /* neck */
  B.add(cyl(.054,.062,.14,S,1.5));
  /* arms */
  [-1,1].forEach(s=>{const A=new THREE.Group();A.position.set(s*.19,1.375,0);A.rotation.z=s*.09;B.add(A);
    const AM=J||SL,sleeved=!!J||longSleeve;
    A.add(rell(.058,1,.9,1,dress&&!J?rlMat(top,{roughness:.7,metalness:sparkle?.35:0}):AM,0,-.01,0));
    const sleeveLen=sleeved?.3:ts==='blouse'?.12:.15;
    A.add(cyl(.054,.047,.3,S,-.15));A.add(cyl(.06,.054,sleeveLen,dress&&!J?rlMat(top,{roughness:.7}):AM,-sleeveLen/2));
    if((ts==='blouse'||dress)&&!J)A.add(rell(.066,1,.75,1,dress?rlMat(top,{roughness:.7}):SL,0,-.05,0));
    const E=new THREE.Group();E.position.y=-.3;E.rotation.x=-.18;A.add(E);E.add(rell(.046,1,1,1,sleeved?AM:S,0,0,0));
    E.add(cyl(.045,.034,.26,S,-.13));if(sleeved)E.add(cyl(.05,.043,.24,AM,-.12));
    E.add(rell(.038,.46,1.1,.78,S,0,-.292,0));[-.018,-.006,.006,.018].forEach((fz,k)=>{const f=cyl(.0075,.0062,k===0||k===3?.036:.044,S,0);f.position.set(-s*.002,-.345+(k===0||k===3?.004:0),fz);f.rotation.x=-.12+fz*2;E.add(f)});
    const th=cyl(.0085,.007,.034,S,0);th.position.set(-s*.012,-.3,.028);th.rotation.set(.6,0,-s*.3);E.add(th);
    arms.push(A)});
  /* head */
  const head=new THREE.Group();head.position.y=1.7;B.add(head);
  const smooth=pp=>new THREE.SplineCurve(pp.map(p=>new THREE.Vector2(p[0],p[1]))).getPoints(28).map(v=>[Math.max(0,v.x),v.y]);
  const FT=faceTex(c);const hd=lathe(smooth([[0,-.162],[.045,-.16],[.085,-.142],[.113,-.11],[.13,-.065],[.14,-.015],[.144,.04],[.139,.1],[.12,.145],[.082,.175],[.04,.187],[0,.19]]),rlMat('#FFFFFF',{map:FT,roughness:.5,emissive:'#FFFFFF',emissiveMap:FT,emissiveIntensity:.12}),40);hd.scale.z=1.07;
  {const P3=hd.geometry.attributes.position,U=hd.geometry.attributes.uv;for(let i=0;i<P3.count;i++){const px=P3.getX(i),py=P3.getY(i),pz=P3.getZ(i);if(pz<.02)U.setXY(i,.01,.99);else U.setXY(i,px/.3+.5,(py+.17)/.36)}U.needsUpdate=true}
  head.add(hd);
  /* eyes */
  const ink=rlMat('#1C130E',{roughness:.4}),W=rlMat('#FBFAF7',{roughness:.2});
  const zf=(x,y)=>{const r=y>.04?.143-(y-.04)*.05:y>-.02?.141:.138-(-.02-y)*.6;return Math.sqrt(Math.max(.0001,r*r-x*x))*1.07};
  const ES={big:1,doe:1.08,sparkle:1.08,almond:.96,dots:.86,happy:1,wink:1}[c.eyes]||1;
  [-1,1].forEach(s=>{const ex=s*.052,ey=.012,ez=zf(ex,ey)-.016;const E=new THREE.Group();E.position.set(ex,ey,ez);E.scale.setScalar(ES);if(c.eyes==='almond')E.rotation.z=s*.12;head.add(E);
    const closed=c.eyes==='happy'||(c.eyes==='wink'&&s>0);
    E.add(rell(.024,1.1,.92,1,W,0,0,0));
    const ir=mesh(new THREE.CircleGeometry(.0152,28),rlMat('#FFFFFF',{map:irisTex(c.ec),roughness:.15}));ir.position.set(0,-.001,.0226);E.add(ir);
    const HL=rlMat('#FFFFFF',{emissive:'#FFFFFF',emissiveIntensity:.6});const hl=mesh(new THREE.CircleGeometry(.0026,10),HL);hl.position.set(.0045,.0045,.0232);E.add(hl);
    if(c.eyes==='sparkle'){const h2=mesh(new THREE.CircleGeometry(.0016,8),HL);h2.position.set(-.004,-.005,.0232);E.add(h2)}
    const lidT=closed?2.0:c.eyes==='almond'?1.3:1.18;
    const lid=mesh(new THREE.SphereGeometry(.0256,16,8,0,Math.PI*2,0,lidT),S);lid.scale.set(1.12,.95,1.02);lid.rotation.x=.2;E.add(lid);
    const lw2=mesh(new THREE.SphereGeometry(.0252,16,6,0,Math.PI*2,Math.PI-(closed?1.25:.95),closed?1.25:.95),S);lw2.scale.set(1.12,.95,1.02);lw2.rotation.x=-.25;E.add(lw2);
    const lash=mesh(new THREE.TorusGeometry(.0262,c.lash?.0042:girl?.0032:.0024,5,20,Math.PI*.95),ink);lash.scale.set(1.1,closed?.25:.7,1);lash.position.set(0,closed?-.006:0,.013);lash.rotation.set(-.12,0,Math.PI*.025+(closed?Math.PI:0));E.add(lash);
    if(girl||c.lash)for(let k=0;k<(c.lash?3:1);k++){const w=mesh(new THREE.ConeGeometry(.0026,.012,4),ink);w.position.set(s*(.028-k*.006),.01+k*.004,.008+k*.002);w.rotation.z=-s*(1.1-k*.3);E.add(w)}
    head.add(rell(.03,.42,1.05,.75,S,s*.141,-.005,-.008));
    if(c.gem!=='none'){const GM=c.gem==='pearl'?rlMat('#FFFFFF',{metalness:.3,roughness:.15}):rlMat(c.gem==='heart'?'#FF4FA3':'#FFD54A',{emissive:c.gem==='heart'?'#FF4FA3':'#FFC531',emissiveIntensity:.5,metalness:.4,roughness:.2});
      [[.09,.0,.006],[.098,-.016,.0048],[.094,-.031,.004]].forEach(([gx,gy,gr])=>{const o=c.gem==='star'?mesh(new THREE.OctahedronGeometry(gr*1.3),GM):rell(gr,1,c.gem==='heart'?.9:1,.6,GM,0,0,0);o.position.set(s*gx,gy,zf(gx,gy)+.002);head.add(o)})}});
  /* nose */
  head.add(rell(.013,1.1,2.5,.7,S,0,-.012,zf(0,-.012)-.003));head.add(rell(.0158,1.15,.92,.95,S,0,-.042,zf(0,-.042)+.002));
  [-1,1].forEach(s=>head.add(rell(.0095,1,.8,.8,S,s*.0145,-.047,zf(.0145,-.047)-.007)));
  /* hair */
  realHair(c,head);
  /* hats and accessories sit on a helper scaled like the old cartoon head, so every old hat still fits */
  const hp=new THREE.Group();hp.position.y=1.72;hp.scale.setScalar(.5);B.add(hp);realHats(c,hp);
  if(c.back==='wings')[-1,1].forEach(s=>{const w=rell(.24,1.2,.6,.2,rlMat('#FFFFFF',{transparent:true,opacity:.9}),s*.2,1.25,-.17);w.rotation.z=s*.5;B.add(w)});
  rlMerge(g);
  g.userData.h=['bun','highbun','afro','afropuffs','spacebuns','ponyup','mohawk'].includes(c.hair)||c.hat!=='none'?2.12:2.02;g.userData.limbs={arms,legs,rig};g.userData.head=hp;g.userData.real=1;return g}

function realHats(c,head){const T0=.37,Y=rlMat('#FFD54A');
  if(c.hat==='crown'){const cr=mesh(new THREE.CylinderGeometry(.19,.16,.15,6,1,true),rlMat('#FFC531',{metalness:.5,roughness:.3,side:THREE.DoubleSide}));cr.position.y=T0+.04;head.add(cr)}
  if(c.hat==='cap'){const cp=mesh(new THREE.SphereGeometry(.37,18,8,0,Math.PI*2,0,Math.PI/2),rlMat('#EE4F7C'));cp.position.y=.02;head.add(cp);head.add(rell(.2,1,.12,1.1,rlMat('#C23560'),0,.06,.36))}
  if(c.hat==='helmet'){const hm=mesh(new THREE.SphereGeometry(.4,18,10,0,Math.PI*2,0,Math.PI/2),rlMat('#EF4444'));hm.position.y=.04;head.add(hm);head.add(rell(.06,3,.4,1,rlMat('#FFFFFF'),0,.36,.05))}
  if(c.hat==='flower'){const fx=.24,fy=.26,fz=.17;head.add(rell(.05,1,1,1,Y,fx,fy,fz));for(let i=0;i<5;i++){const a=i*Math.PI*2/5;head.add(rell(.045,1,1,.6,rlMat('#FFFFFF'),fx+Math.cos(a)*.07,fy+Math.sin(a)*.07,fz+.01))}}
  if(c.hat==='bow')[-1,1].forEach(s=>{const b=mesh(new THREE.ConeGeometry(.07,.15,8),rlMat('#EE4F7C'));b.rotation.z=s*Math.PI/2;b.position.set(.18+s*.07,.32,.06);head.add(b)})}

/* fewer draw calls: inside every group, meshes that share a material become one mesh */
function rlMerge(root){const groups=[];root.traverse(o=>{if(o.isGroup||o===root)groups.push(o)});
  groups.forEach(gr=>{const by={};gr.children.slice().forEach(m=>{if(!m.isMesh||m.children.length||m.material.transparent)return;(by[m.material.uuid]=by[m.material.uuid]||[]).push(m)});
    Object.values(by).forEach(list=>{if(list.length<2)return;const pos=[],nor=[],uv=[];
      list.forEach(m=>{m.updateMatrix();let ge=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();ge.applyMatrix4(m.matrix);
        const P=ge.attributes.position,N=ge.attributes.normal,U=ge.attributes.uv;for(let i=0;i<P.count;i++){pos.push(P.getX(i),P.getY(i),P.getZ(i));if(N)nor.push(N.getX(i),N.getY(i),N.getZ(i));else nor.push(0,1,0);if(U)uv.push(U.getX(i),U.getY(i));else uv.push(0,0)}
        gr.remove(m);m.geometry.dispose();ge.dispose()});
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
      gr.add(mesh(geo,list[0].material))})})}

/* one seamless hair shell: hairline high on the forehead, lower at the sides, lowest at the back */
function hairShell(r,front,side,back,sc,yo,m,part){const NU=40,NV=14,pos=[],uv=[],idx=[];
  for(let i=0;i<=NU;i++){const phi=i/NU*Math.PI*2;let d=Math.abs(((phi-Math.PI/2)+Math.PI*3)%(Math.PI*2)-Math.PI);/* 0 = front, pi = back */
    const tm=d<Math.PI/2?front+(side-front)*(1-Math.cos(d))/1:side+(back-side)*(1-Math.cos(d-Math.PI/2));
    for(let j=0;j<=NV;j++){const th=j/NV*tm;let rr=r*(1+.04*Math.sin(th)*(d/Math.PI));if(part&&d<.5&&j>NV*.4)rr*=1+.02*(1-d/.5);
      pos.push(-rr*Math.cos(phi)*Math.sin(th)*sc[0],rr*Math.cos(th)*sc[1]+yo,rr*Math.sin(phi)*Math.sin(th)*sc[2]);uv.push(i/NU*3,j/NV)}}
  for(let i=0;i<NU;i++)for(let j=0;j<NV;j++){const a=i*(NV+1)+j,b=a+NV+1;idx.push(a,a+1,b,b,a+1,b+1)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return mesh(g,m)}
/* ---------- hair styles ---------- */
function realHair(c,head){const H=hairMat(c.hc),CU=curlMat(c.hc),TIE=rlMat(c.g==='boy'?'#1F2937':'#EC4899',{roughness:.5});const add=o=>{head.add(o);return o};
  const top=(f,sd,bk,r)=>add(hairShell(r||.172,f||.95,sd||1.55,bk||2.25,[.98,1.06,1.08],.018,H,1));
  const lock=(pts,r0,r1,o,m)=>add(taper(pts,r0,r1,m||H,Object.assign({sy:.55,vr:3},o||{})));
  const tie=(x,y,z,r)=>{const t=add(mesh(new THREE.TorusGeometry(r||.026,.009,8,20),TIE));t.position.set(x,y,z);t.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),new THREE.Vector3(x,y,z).normalize());return t};
  /* the back curtain of long hair; len = how far down, wave = curls in it */
  const curtain=(len,width,wave)=>{const n=Math.round(6*width);for(let i=-n;i<=n;i++){const x=i*.022,zb=-.14-.02*Math.cos(i/n*1.4);const w=k=>wave?Math.sin(k*2.2+i)*.018:0;
      lock([[x,.06,zb+.03],[x*1.15+w(1),-.12,zb-.02],[x*1.15+w(2),-.12-len*.45,zb],[x*1.05+w(3),-.12-len,zb+.02]],.034,.02,{sy:.5})}};
  /* a lock at the side: front=true brings it forward over the shoulder */
  const side=(s,front,len,wave)=>{const w=k=>wave?Math.sin(k*2.4)*.016:0;
    if(front){lock([[s*.12,.08,.06],[s*.15+w(1),-.05,.06],[s*.16,-.2,.11],[s*.13+w(2),-.2-len*.5,.14],[s*.11,-.2-len,.13]],.045,.02,{sy:.5,prof:t=>1+.3*Math.sin(Math.PI*t)});
      lock([[s*.1,.1,.09],[s*.135,-.04,.1],[s*.14,-.18,.13],[s*.115,-.18-len*.6,.15]],.03,.014,{sy:.5})}
    else lock([[s*.13,.06,-.02],[s*.155+w(1),-.1,-.05],[s*.15,-.1-len*.5,-.07],[s*.13+w(2),-.1-len,-.07]],.036,.018,{sy:.6})};
  const fringe=(n,len)=>{for(let i=-n*2;i<=n*2;i++){const x=i*.0125;lock([[x*.7,.17,.1],[x*.95,.125,.15],[x*1.02,.115-len,.156]],.02,.014,{sy:.42,seg:10,rad:8})}};
  const sweep=(dir)=>lock([[-dir*.1,.135,.1],[-dir*.03,.165,.125],[dir*.05,.165,.115],[dir*.11,.13,.09]],.03,.022,{sy:.55,seg:16});
  const bun=(x,y,z,r)=>{const b=add(rell(r,1,.92,1,H,x,y,z));return b};
  const braid=(pts,r)=>{const cv=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2])));const n=Math.round(cv.getLength()/(r*1.3));
    for(let i=0;i<=n;i++){const t=i/n,p=cv.getPointAt(t),tg=cv.getTangentAt(t);const rr=r*(1-t*.35);const o=add(rell(rr,1.15,1.35,.85,H,p.x+(i%2?.3:-.3)*rr,p.y,p.z));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),tg);o.rotateY(i%2?.5:-.5)}return cv.getPointAt(1)};
  const curls=(list,r)=>list.forEach(([x,y,z])=>add(rell(r,1,1,1,CU,x,y,z)));
  const ring=(y0,y1,r,step,skipFront)=>{const out=[];for(let y=y0;y>=y1;y-=step){for(let a=0;a<360;a+=24){const A=a*Math.PI/180,x=Math.sin(A)*r,z=Math.cos(A)*r;if(skipFront&&z>-.01)continue;out.push([x,y,z-.02])}}return out};
  switch(c.hair){
    /* girls */
    case'long':top(.95,1.62,2.35);curtain(.42,1);side(-1,0,.36);side(1,0,.36);break;
    case'wavy':top(.95,1.62,2.35);curtain(.44,1,1);side(-1,0,.36,1);side(1,0,.36,1);break;
    case'longfront':top(.95,1.62,2.35);curtain(.42,1);side(1,1,.28);side(-1,0,.36);lock([[-.02,.17,.1],[-.07,.13,.13],[-.11,.07,.125]],.03,.012,{sy:.4});break;
    case'frontboth':top(.95,1.62,2.35);curtain(.4,.75);side(1,1,.28);side(-1,1,.28);break;
    case'bangs':top(.95,1.62,2.35);curtain(.42,1);side(-1,0,.36);side(1,0,.36);fringe(4,.04);break;
    case'ponytail':top(.95,1.5,2.05);tie(0,-.03,-.168);lock([[0,-.03,-.17],[0,-.12,-.205],[0,-.28,-.2],[0,-.44,-.17]],.045,.012,{sy:1,prof:t=>.8+.4*Math.sin(Math.PI*Math.min(1,t*1.3))});break;
    case'ponyup':top(.95,1.5,1.85);tie(0,.17,-.1);lock([[0,.17,-.11],[0,.26,-.17],[0,.2,-.27],[0,.0,-.29],[0,-.22,-.25],[.015,-.4,-.2]],.05,.01,{sy:1,prof:t=>.8+.5*Math.sin(Math.PI*Math.min(1,t*1.3))});
      [-1,1].forEach(s=>lock([[s*.11,.1,.1],[s*.135,.0,.09],[s*.13,-.1,.06]],.012,.004,{sy:.6}));break;
    case'bob':add(hairShell(.18,.95,2.2,2.25,[1.05,1.06,1.1],.012,H,1));fringe(3,.02);break;
    case'curly':top(.95,1.6,2.2);curls(ring(.02,-.34,.17,.06,1),.042);curls(ring(.12,.02,.165,.07,1),.04);break;
    case'bun':top(.95,1.5,1.9);bun(0,.12,-.15,.07);tie(0,.09,-.11,.03);break;
    case'highbun':top(.95,1.5,1.85);bun(0,.21,-.06,.075);tie(0,.17,-.05,.032);break;
    case'braids':top(.95,1.5,2.0);[-1,1].forEach(s=>{const e=braid([[s*.11,-.02,-.1],[s*.14,-.14,-.03],[s*.13,-.3,.08],[s*.12,-.44,.11]],.024);add(rell(.012,1,1,1,TIE,e.x,e.y-.012,e.z))});break;
    case'frenchbraid':top(.95,1.5,1.95);{const e=braid([[0,.14,-.15],[0,-.02,-.19],[0,-.22,-.19],[0,-.44,-.16]],.032);add(rell(.014,1,1,1,TIE,e.x,e.y-.014,e.z))}break;
    case'pigtails':top(.95,1.5,1.95);[-1,1].forEach(s=>{tie(s*.15,.05,-.09);lock([[s*.15,.05,-.09],[s*.24,.0,-.1],[s*.27,-.16,-.08],[s*.24,-.3,-.05]],.045,.012,{sy:1})});break;
    case'afropuffs':top(.9,1.4,1.9);[-1,1].forEach(s=>{add(rell(.095,1,.95,1,CU,s*.14,.15,-.04));tie(s*.09,.12,-.03,.03)});break;
    case'spacebuns':top(.95,1.5,1.9);fringe(3,.03);[-1,1].forEach(s=>{bun(s*.1,.17,-.03,.058);tie(s*.075,.13,-.02,.025)});break;
    case'boxbraids':top(.95,1.62,2.2);for(let a=-160;a<=160;a+=16){const A=a*Math.PI/180,x=Math.sin(A)*.15,z=-Math.cos(A)*.14;if(Math.abs(a)<70)continue;
        lock([[x,.04,z],[x*1.12,-.15,z*1.12],[x*1.1,-.35,z*1.05],[x,-.5,z]],.012,.01,{sy:1,rad:6,seg:16})}
      for(let i=-6;i<=6;i++){const x=i*.022;lock([[x,.05,-.15],[x*1.15,-.2,-.17],[x*1.1,-.5,-.15]],.012,.01,{sy:1,rad:6,seg:16})}break;
    /* boys */
    case'short':top(.9,1.35,1.95);sweep(1);break;
    case'fringe':top(.95,1.35,1.95);fringe(4,.05);break;
    case'side':top(.88,1.35,1.95);lock([[.1,.14,.1],[.02,.175,.13],[-.07,.165,.12],[-.13,.12,.08]],.034,.02,{sy:.55,seg:16});break;
    case'curlyshort':top(.95,1.35,1.95);curls(ring(.18,.04,.15,.045,0).map(([x,y,z])=>[x*(1-(y-.04)*2),y+.02,z*(1-(y-.04)*2)]),.032);break;
    case'buzz':add(hairShell(.162,.88,1.3,1.9,[.98,1.06,1.08],.018,rlMat('#FFFFFF',{map:hairTex(c.hc),roughness:.8,side:THREE.DoubleSide}),0));break;
    case'spiky':top(.9,1.35,1.95);for(let i=0;i<9;i++){const a=(i/9)*Math.PI*2,x=Math.sin(a)*.08,z=Math.cos(a)*.08;lock([[x,.17,z],[x*1.3,.24,z*1.3+.02]],.03,.004,{sy:1,seg:6,rad:8})}break;
    case'messy':top(.9,1.35,1.95);for(let i=0;i<10;i++){const a=i*.7,x=Math.sin(a)*.1,z=Math.cos(a)*.1;lock([[x,.17,z],[x*1.4,.2,z*1.4],[x*1.7,.16,z*1.7]],.026,.008,{sy:.6,seg:8})}break;
    case'afro':add(rell(.215,1,.88,.9,CU,0,.075,-.07));top(.92,1.4,1.95,.168);break;
    case'mohawk':add(hairShell(.158,.88,1.3,1.9,[.98,1.06,1.08],.016,rlMat(shade(c.hc,-.1),{roughness:.9}),0));for(let i=0;i<7;i++){const e=(55+i*16)*Math.PI/180;lock([[0,Math.sin(e)*.17,Math.cos(e)*.17],[0,Math.sin(e)*.27,Math.cos(e)*.27]],.035,.006,{sy:.35,sx:1,seg:6})}break;
    default:top(.95,1.5,2.1)}}

/* every person in the world (me, friends, shopkeepers, story heroes) is now a real person */
human3D=function(ch){return real3D(ch)};
