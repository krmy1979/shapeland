/* Shapeland · a world by Shirel Yitzhak */
/* ===================== HUMAN AVATARS (boys & girls, hair salon) ===================== */
const SKINS=[['#F9DFCB','porcelain','חרסינה'],['#FFE3CC','light','בהיר'],['#F6CBA5','fair','בהיר חם'],['#EFC9A4','warm beige','בז׳ חמים'],['#E3A97F','tan','שזוף'],['#D69A6B','golden','זהוב'],
  ['#C68657','olive','זית'],['#B07A52','caramel','קרמל'],['#9A6440','brown','חום'],['#7E4E31','chestnut','ערמון'],['#6B4229','dark','כהה'],['#4A2C1A','deep','כהה עמוק']];
/* beauty: eye colors, brows, eyeshadow, blush, free lip tints, face gems */
const EYEC=[['#5B3A22','brown','חום'],['#2B1A10','dark brown','חום כהה'],['#8A6A2E','hazel','דבש'],['#3E8E5A','green','ירוק'],['#3B82C4','blue','כחול'],['#7A8A99','gray','אפור'],['#8B5CF6','violet','סגול קסום']];
const BROWS={soft:['רכות','soft brows'],straight:['ישרות','straight brows'],arch:['מקושתות','arched brows'],bold:['עבות','bold brows']};
const SHADOWS=[['#E8C9A0','champagne','שמפניה'],['#F9A8D4','pink','ורוד'],['#C4B5FD','lilac','לילך'],['#93C5FD','sky blue','תכלת'],['#86EFAC','mint','מנטה'],['#FDBA74','sunset','שקיעה'],['#FCD34D','gold','זהב'],['#B07A3A','bronze','ברונזה']];
const BLUSH=[['#FF9EB5','pink','ורוד'],['#FFB38A','peach','אפרסק'],['#F472B6','rose','ורד'],['#E0607E','berry','פטל']];
const LIPS_FREE=[['#D9877A','nude','ניוד'],['#FF8FB1','pink gloss','גלוס ורוד'],['#F59E7A','peach','אפרסק'],['#B83268','berry','פטל']];
const GEMS={star:['כוכבים','star gems','⭐',15],heart:['לבבות','heart gems','💖',15],pearl:['פנינים','pearls','🤍',18]};
/* hair colors: [hex, english, hebrew, price (0 = free)] */
const HAIRC=[['#1F1B1A','black','שחור',0],['#4A2E1F','dark brown','חום כהה',0],['#8A5530','brown','חום',0],['#E8C268','blonde','בלונד',0],['#C8562A','ginger','ג׳ינג׳י',0],
  ['#EDE6D6','platinum','פלטינה',10],['#FF7EB6','pink','ורוד',12],['#9D6BFF','purple','סגול',12],['#4DA3FF','blue','כחול',12],['#3FD3B0','mint','מנטה',12]];
/* hair styles: id -> [hebrew, english, for, price] */
const HAIRS={
  long:['ארוך וחלק','long straight','girl',0],ponytail:['קוקו','ponytail','girl',0],bob:['קארה','bob','girl',0],curly:['מתולתל','curly','girl',0],
  bun:['פקעת','bun','girl',12],bangs:['חלק עם פוני','straight with bangs','girl',0],afropuffs:['שני פאפים','afro puffs','girl',0],spacebuns:['שתי פקעות','space buns','girl',0],boxbraids:['צמות דקות','box braids','girl',0],braids:['צמות','braids','girl',15],pigtails:['שתי קוקיות','pigtails','girl',15],wavy:['גלי ארוך','wavy','girl',20],
  short:['קצר','short','boy',0],fringe:['פוני קוריאני','k-pop fringe','boy',0],side:['הצידה','side part','boy',0],curlyshort:['תלתלים','curls','boy',0],buzz:['קצוץ','buzz cut','boy',0],
  spiky:['קוצים','spiky','boy',12],messy:['פרוע','messy','boy',12],afro:['אפרו','afro','boy',15],mohawk:['מוהוק','mohawk','boy',20]};
const BOTTOMS={pants:['מכנסיים','pants'],shorts:['מכנסיים קצרים','shorts'],skirt:['חצאית','skirt'],dress:['שמלה','dress']};
const HEYES={big:['עגולות גדולות','big eyes'],doe:['עיני אייל','doe eyes'],almond:['שקדיות','almond eyes'],sparkle:['נוצצות','sparkly eyes'],happy:['שמחות','happy eyes'],dots:['קטנות','small eyes'],wink:['קריצה','wink']};
const OUTFITS={hoodie:['קפוצ׳ון','hoodie',20,'🧥'],jacket:['ג׳קט ג׳ינס','denim jacket',25,'🧥'],suit:['חליפה ועניבה','suit and tie',35,'🤵'],party:['שמלת ערב נוצצת','party dress',30,'👗'],jersey:['חולצת כדורגל','soccer jersey',20,'⚽']};
const LIPS=[['#FF5C9A','pink',8],['#E11D48','red',8],['#FF7F50','coral',8],['#A855F7','purple',10]];
const hairPrice=id=>(HAIRS[id]||[])[3]||0;const hcPrice=hex=>(HAIRC.find(x=>x[0]===hex)||[])[3]||0;
const salonOwned=k=>!k||(P.salon||[]).includes(k);
function humanCh(g,old){const girl=g!=='boy';return{kind:'human',g:girl?'girl':'boy',skin:'#F6CBA5',hair:girl?'long':'short',hc:girl?'#4A2E1F':'#1F1B1A',
  top:(old&&old.color)||(girl?'#FF8FB1':'#64A8FA'),bot:girl?'skirt':'pants',bc:girl?'#B49BFA':'#3B4A75',eyes:'big',hat:old&&['crown','cap','flower','bow'].includes(old.hat)?old.hat:'none',back:old&&old.back==='wings'?'wings':'none'}}
function sanitizeHuman(c){const d=humanCh(c.g);const hex=v=>typeof v==='string'&&/^#[0-9A-Fa-f]{6}$/.test(v);
  return{kind:'human',g:c.g==='boy'?'boy':'girl',skin:SKINS.some(x=>x[0]===c.skin)?c.skin:d.skin,hair:HAIRS[c.hair]?c.hair:d.hair,hc:HAIRC.some(x=>x[0]===c.hc)?c.hc:d.hc,
    top:hex(c.top)?c.top:d.top,bot:BOTTOMS[c.bot]?c.bot:d.bot,bc:hex(c.bc)?c.bc:d.bc,eyes:HEYES[c.eyes]?c.eyes:'big',
    hat:['none','crown','cap','flower','bow','helmet'].includes(c.hat)?c.hat:'none',back:['none','wings'].includes(c.back)?c.back:'none',
    lip:LIPS.some(x=>x[0]===c.lip)||LIPS_FREE.some(x=>x[0]===c.lip)?c.lip:'none',lash:c.lash?1:0,glit:c.glit?1:0,outfit:OUTFITS[c.outfit]?c.outfit:'none',
    ec:EYEC.some(x=>x[0]===c.ec)?c.ec:'#5B3A22',bro:BROWS[c.bro]?c.bro:'soft',sh:SHADOWS.some(x=>x[0]===c.sh)?c.sh:'none',liner:c.liner&&c.liner!=='0'?1:0,
    blc:c.blc==='none'||BLUSH.some(x=>x[0]===c.blc)?c.blc:'#FF9EB5',gem:GEMS[c.gem]?c.gem:'none',frk:c.frk&&c.frk!=='0'?1:0}}

/* ---------- 3D ---------- */
function ell(r,sx,sy,sz,m,x,y,z){const o=mesh(new THREE.SphereGeometry(r,16,12),m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);return o}
function hair3D(style,H,head){const r=.355;const add=o=>{head.add(o);return o};
  const cap=(tilt,rr)=>{const m=mesh(new THREE.SphereGeometry(rr||r,26,14,0,Math.PI*2,0,Math.PI/2),H);m.rotation.x=-tilt;return add(m)};
  const back=(len,rr,sc)=>{const m=mesh(new THREE.SphereGeometry(rr||r,26,16,Math.PI,Math.PI,0,Math.PI*len),H);if(sc)m.scale.set(sc[0],sc[1],sc[2]);return add(m)};
  const fringe=(len,w)=>{const m=mesh(new THREE.SphereGeometry(.366,26,10,Math.PI/2-w/2,w,0,len),H);m.material.side=THREE.DoubleSide;return add(m)};
  const tie=(x,y,z)=>add(ell(.045,1,1,1,mat('#EE4F7C'),x,y,z));
  const spike=(x,y,z,r,h)=>{const c=add(mesh(new THREE.ConeGeometry(r,h,8),H));const d=new THREE.Vector3(x,y,z).normalize();c.position.set(x,y,z).addScaledVector(d,h*.3);c.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d)};
  const onTop=(el,az,dist)=>{const e=el*Math.PI/180,a=az*Math.PI/180;return[Math.sin(a)*Math.cos(e)*dist,Math.sin(e)*dist,Math.cos(a)*Math.cos(e)*dist]};
  switch(style){
    case'buzz':cap(.5,.348);back(.6,.348);break;
    case'short':cap(.38);back(.62);break;
    case'side':cap(.38);back(.62);{const s=add(ell(.17,1.7,.5,1,H,.07,.29,.17));s.rotation.z=-.35}break;
    case'spiky':cap(.38);back(.62);[[80,0],[60,0],[60,60],[60,-60],[45,30],[45,-30],[40,0],[65,180],[70,120],[70,-120]].forEach(([e,a])=>{const[x,y,z]=onTop(e,a,.33);spike(x,y,z,.07,.22)});break;
    case'messy':cap(.38);back(.62);[[75,20],[70,-40],[55,10],[60,70],[60,-80],[50,-20],[80,160],[65,130],[65,-140]].forEach(([e,a])=>{const[x,y,z]=onTop(e,a,.34);add(ell(.1,1.1,.8,1,H,x,y,z))});break;
    case'curlyshort':cap(.4);back(.62);for(let e=25;e<=90;e+=16)for(let a=0;a<360;a+=e>80?360:28){if(e<40&&Math.abs(((a+180)%360)-180)<70)continue;const[x,y,z]=onTop(e,a,.35);add(ell(.085,1,1,1,H,x,y,z))}break;
    case'afro':add(ell(.47,1,.92,1,H,0,.12,-.16));cap(.36,.36);break;
    case'mohawk':cap(.5,.347);back(.6,.347);for(let i=0;i<7;i++){const e=(50+i*17)*Math.PI/180;spike(0,Math.sin(e)*.35,Math.cos(e)*.35,.08,.24)}break;
    case'long':cap(.32);back(.7);add(ell(.3,1.08,1.45,.45,H,0,-.3,-.2));[-1,1].forEach(s=>add(ell(.1,1,3,.8,H,s*.3,-.24,.04)));break;
    case'wavy':cap(.32);back(.7);for(let i=0;i<5;i++)[-1,0,1].forEach(c=>add(ell(.13,1,1,.8,H,c*.19+(i%2?.04:-.04),-.05-i*.13,-.27+Math.abs(c)*.06)));[-1,1].forEach(s=>{for(let i=0;i<4;i++)add(ell(.09,1,1,1,H,s*(.3+(i%2?.03:0)),-.12-i*.13,.04))});break;
    case'curly':cap(.34);back(.7);for(let y=.18;y>-.58;y-=.13){const rr=.36+(y<0?.02:0);for(let a=60;a<=300;a+=24){if((a<100||a>260)&&y>-.06)continue;const r2=Math.sqrt(Math.max(.02,rr*rr-Math.max(0,y)*Math.max(0,y)));add(ell(.1,1,1,1,H,Math.sin(a*Math.PI/180)*r2,y,Math.cos(a*Math.PI/180)*r2))}}break;
    case'ponytail':cap(.35);back(.62);tie(0,.16,-.36);{const t=add(ell(.12,1,2.8,1,H,0,-.14,-.45));t.rotation.x=.28}break;
    case'bob':cap(.3,.362);back(.78,.37,[1.06,1,1.04]);[-1,1].forEach(s=>add(ell(.12,1,1.7,1.3,H,s*.31,-.12,.04)));add(ell(.17,1.7,.42,.6,H,0,.22,.26));break;
    case'braids':cap(.32);back(.66);[-1,1].forEach(s=>{for(let i=0;i<6;i++)add(ell(.07-i*.004,1,1.1,1,H,s*(.27-i*.006),-.15-i*.09,.07+i*.015));tie(s*.24,-.66,.16)});break;
    case'bun':cap(.34);back(.66);add(ell(.16,1,1,1,H,0,.33,-.14));tie(0,.24,-.2);break;
    case'bangs':cap(.32);back(.7);add(ell(.3,1.08,1.45,.45,H,0,-.3,-.2));[-1,1].forEach(s=>add(ell(.1,1,3,.8,H,s*.3,-.24,.04)));fringe(1.17,1.9);break;
    case'fringe':cap(.38);back(.62);fringe(1.12,1.7);break;
    case'afropuffs':cap(.4,.358);back(.62,.358);[-1,1].forEach(s=>{add(ell(.19,1,1,1,H,s*.25,.33,-.06));tie(s*.18,.22,.02)});break;
    case'spacebuns':cap(.34);back(.66);fringe(1.17,1.9);[-1,1].forEach(s=>{add(ell(.13,1,1,1,H,s*.21,.34,-.04));tie(s*.15,.25,.03)});break;
    case'boxbraids':cap(.32);back(.7);for(let a=-150;a<=150;a+=30){const r2=.3,x=Math.sin(a*Math.PI/180)*r2,z=-Math.cos(a*Math.PI/180)*r2*.8;if(Math.abs(a)<40&&z>0)continue;for(let i=0;i<8;i++)add(ell(.04,1,1.25,1,H,x*(1+i*.02),-.05-i*.085,z-.04))}
      [-1,1].forEach(s=>{for(let i=0;i<7;i++)add(ell(.04,1,1.25,1,H,s*.3,-.1-i*.085,.06));add(ell(.035,1,1,1,mat('#FFC531',{metalness:.5,roughness:.3}),s*.3,-.72,.06))});break;
    case'pigtails':cap(.34);back(.66);[-1,1].forEach(s=>{tie(s*.32,.06,-.12);const t=add(ell(.11,1,2.3,1,H,s*.42,-.12,-.12));t.rotation.z=s*.45});break;
    default:cap(.38);back(.62)}}
function human3D(ch){ch=sanitizeHuman(ch);const g=new THREE.Group();const rig=new THREE.Group();rig.position.y=.85;g.add(rig);const B=new THREE.Group();B.position.y=-.85;rig.add(B);
  const S=mat(ch.skin),T=mat(ch.top),BC=mat(ch.bc),H=mat(ch.hc),girl=ch.g==='girl';
  const legs=[],arms=[];const covered=ch.bot==='pants';
  [-1,1].forEach(s=>{const L=new THREE.Group();L.position.set(s*.12,.62,0);
    const up=mesh(new THREE.CylinderGeometry(.1,.09,.3,12),ch.bot==='skirt'||ch.bot==='dress'?S:BC);up.position.y=-.15;L.add(up);
    const lo=mesh(new THREE.CylinderGeometry(.087,.08,.28,12),covered?BC:S);lo.position.y=-.43;L.add(lo);
    const sh=ell(.1,1,.6,1.5,mat('#FFFFFF'),0,-.57,.05);L.add(sh);const so=ell(.1,1.02,.2,1.52,mat('#1D2A48'),0,-.61,.05);L.add(so);B.add(L);legs.push(L)});
  if(ch.outfit==='party'){const gw=mesh(new THREE.LatheGeometry([[0,.12],[.5,.12],[.44,.3],[.3,.6],[.22,.72],[0,.74]].map(p=>new THREE.Vector2(p[0],p[1])),26),mat(ch.top,{metalness:.35,roughness:.3}));B.add(gw)}
  else if(ch.bot==='pants'||ch.bot==='shorts'){const hp=mesh(new THREE.CylinderGeometry(.235,.23,.16,18),BC);hp.position.y=.64;B.add(hp)}
  else{const sk=mesh(new THREE.LatheGeometry([[0,.4],[.37,.4],[.33,.5],[.25,.68],[0,.72]].map(p=>new THREE.Vector2(p[0],p[1])),22),ch.bot==='dress'?T:BC);B.add(sk)}
  const torso=mesh(new THREE.LatheGeometry([[0,.6],[.225,.6],[.24,.7],girl?[.205,.84]:[.225,.84],[.25,.97],[.2,1.06],[.08,1.1],[0,1.1]].map(p=>new THREE.Vector2(p[0],p[1])),22),T);B.add(torso);
  const nk=mesh(new THREE.CylinderGeometry(.07,.08,.12,10),S);nk.position.y=1.12;B.add(nk);
  if(ch.outfit==='hoodie'){B.add(ell(.2,1.35,.75,1,T,0,1.12,-.19));B.add(ell(.14,1.3,.6,.3,mat(shade(ch.top,-.15)),0,.78,.22));[-1,1].forEach(s=>B.add(ell(.012,1,8,1,mat('#FFFFFF'),s*.05,.98,.25)))}
  if(ch.outfit==='jacket'||ch.outfit==='suit'){const J=mat(ch.outfit==='suit'?'#1F2937':'#4F7CC2');[-1,1].forEach(s=>{const pnl=mesh(new THREE.BoxGeometry(.17,.46,.04),J);pnl.position.set(s*.15,.84,.235);pnl.rotation.y=s*.25;B.add(pnl)});
    [-1,1].forEach(s=>B.add(ell(.1,1,1.2,1.05,J,s*.29,.93,0)));
    if(ch.outfit==='suit'){const tie=mesh(new THREE.BoxGeometry(.07,.32,.02),mat('#DC2626'));tie.position.set(0,.88,.255);B.add(tie);B.add(ell(.05,1,.7,.5,mat('#DC2626'),0,1.04,.24))}}
  if(ch.outfit==='jersey'){const band=mesh(new THREE.CylinderGeometry(.252,.25,.09,22),mat('#FFFFFF'));band.position.y=.93;B.add(band)}
  [-1,1].forEach(s=>{const A=new THREE.Group();A.position.set(s*.29,1.01,0);A.rotation.z=s*.1;
    A.add(ell(.09,1,1.45,1,T,0,-.09,0));const fa=mesh(new THREE.CylinderGeometry(.068,.062,.26,10),S);fa.position.y=-.3;A.add(fa);A.add(ell(.075,1,1.1,1,S,0,-.46,0));B.add(A);arms.push(A)});
  const head=new THREE.Group();head.position.y=1.43;B.add(head);head.add(mesh(new THREE.SphereGeometry(.34,28,20),S));
  [-1,1].forEach(s=>head.add(ell(.06,.6,1,.9,S,s*.335,-.03,0)));
  const ink=mat('#2A1B14'),W=mat('#FFFFFF'),IR=mat(ch.ec,{roughness:.25}),PU=mat('#120A06');
  const on=(x,y,d)=>Math.sqrt(Math.max(0,.34*.34-x*x-y*y))+(d||0);
  const ES={big:[.068,1.15],doe:[.074,1.22],almond:[.07,.8],sparkle:[.074,1.2]};
  [-1,1].forEach(s=>{const x=s*.12;
    if(ch.sh!=='none'){const e=ell(.072,1.3,.6,.25,mat(ch.sh,{transparent:true,opacity:.8}),x+s*.008,.045,on(x,.045,-.012));e.rotation.z=-s*.14;head.add(e)}
    if(ch.eyes==='happy'||(ch.eyes==='wink'&&s>0)){const t=mesh(new THREE.TorusGeometry(.05,.016,6,12,Math.PI),ink);t.position.set(x,-.01,.315);head.add(t)}
    else if(ch.eyes==='dots'){head.add(ell(.04,1,1.2,.6,ink,x,-.01,.318))}
    else{const[r,ys]=ES[ch.eyes]||ES.big;const ey=new THREE.Group();ey.position.set(x,-.01,0);if(ch.eyes==='almond')ey.rotation.z=s*.16;head.add(ey);
      ey.add(ell(r,1,ys,.5,W,0,0,.3));ey.add(ell(r*.8,1,ch.eyes==='almond'?1:1.08,.5,IR,0,-.004,.317));ey.add(ell(r*.4,1,1.08,.5,PU,0,-.004,.328));
      ey.add(ell(r*.26,1,1,1,W,r*.3,r*.34,.343));ey.add(ell(r*.12,1,1,1,W,-r*.28,-r*.3,.343));if(ch.eyes==='sparkle'){ey.add(ell(r*.14,1,1,1,W,r*.06,-r*.45,.343));ey.add(ell(r*.1,1,1,1,W,-r*.4,r*.3,.343))}
      const lid=mesh(new THREE.TorusGeometry(r*1.02,ch.liner?.013:.008,5,16,Math.PI*.92),ink);lid.scale.set(1,ys*.97,1);lid.rotation.z=Math.PI*.04;lid.position.set(0,0,.318);ey.add(lid);
      if(ch.liner){const w=mesh(new THREE.ConeGeometry(.011,.05,4),ink);w.position.set(s*r*1.08,r*ys*.32,.316);w.rotation.z=-s*1.05;ey.add(w)}}
    const BW={soft:[.05,1.3,.28,-.12,.1],straight:[.054,1.42,.3,0,.095],arch:[.05,1.35,.28,-.24,.104],bold:[.056,1.4,.44,-.1,.1]}[ch.bro]||[.05,1.3,.28,-.12,.1];
    const br=ell(BW[0],BW[1],BW[2],.4,H,x,BW[4],.315);br.rotation.z=s*BW[3];head.add(br);
    if(ch.blc!=='none'){const bl=ell(.05,1.3,.75,.25,mat(ch.blc,{transparent:true,opacity:.5}),s*.2,-.09,.27);bl.rotation.y=s*.6;head.add(bl)}
    if(ch.frk){const FM=mat(shade(ch.skin,-.32));[[.07,-.06],[.1,-.075],[.13,-.06],[.085,-.095],[.115,-.1],[.05,-.08]].forEach(([fx,fy])=>head.add(ell(.008,1,1,.4,FM,s*fx,fy,on(s*fx,fy,.001))))}
    if(ch.gem!=='none'){const GM=ch.gem==='pearl'?mat('#FFFFFF',{metalness:.3,roughness:.15}):mat(ch.gem==='heart'?'#FF4FA3':'#FFD54A',{emissive:ch.gem==='heart'?'#FF4FA3':'#FFC531',emissiveIntensity:.5,metalness:.4,roughness:.2});
      [[.205,-.025,.016],[.215,-.065,.012],[.2,-.1,.01]].forEach(([gx,gy,gr])=>{const o=ch.gem==='star'?mesh(new THREE.OctahedronGeometry(gr*1.3),GM):ell(gr,1,ch.gem==='heart'?.9:1,.6,GM,0,0,0);o.position.set(s*gx,gy,on(gx,gy,.004));head.add(o)})}});
  head.add(ell(.026,1,1,1,mat(shade(ch.skin,-.12)),0,-.06,.338));
  if(ch.lash)[-1,1].forEach(s=>{const lx=s*.12;for(let k=0;k<=2;k++){const l=mesh(new THREE.ConeGeometry(.008,.045,4),ink);l.position.set(lx+s*(.025+k*.022),.05-k*.012,.31);l.rotation.z=-s*(.5+k*.35);head.add(l)}});
  if(ch.glit)[-1,1].forEach(s=>[[0,0],[.04,.04],[-.03,.05]].forEach(([a,b])=>head.add(ell(.012,1,1,.4,mat('#FDE047',{emissive:'#FDE047',emissiveIntensity:.6}),s*(.2+a),-.07+b,.285))));
  const LM=ch.lip!=='none'?mat(ch.lip,{roughness:.25,metalness:.05}):null;
  const mo=mesh(new THREE.TorusGeometry(.055,LM?.017:.013,6,12,Math.PI),LM||mat('#B2304E'));mo.rotation.z=Math.PI;mo.position.set(0,-.12,.31);head.add(mo);
  if(LM){head.add(ell(.034,1.35,.5,.45,LM,0,-.168,on(0,-.168,-.008)));head.add(ell(.008,1.6,.6,.5,mat('#FFFFFF',{transparent:true,opacity:.6}),.012,-.168,on(0,-.168,.006)))}
  hair3D(ch.hair,H,head);
  const T0=.37,Y=mat('#FFD54A');
  if(ch.hat==='crown'){const c=mesh(new THREE.CylinderGeometry(.19,.16,.15,6,1,true),mat('#FFC531',{metalness:.5,roughness:.3,side:THREE.DoubleSide}));c.position.y=T0+.04;head.add(c)}
  if(ch.hat==='cap'){const c=mesh(new THREE.SphereGeometry(.37,18,8,0,Math.PI*2,0,Math.PI/2),mat('#EE4F7C'));c.position.y=.02;head.add(c);const b=ell(.2,1,.12,1.1,mat('#C23560'),0,.06,.36);head.add(b)}
  if(ch.hat==='helmet'){const hm=mesh(new THREE.SphereGeometry(.4,18,10,0,Math.PI*2,0,Math.PI/2),mat('#EF4444'));hm.position.y=.04;head.add(hm);head.add(ell(.06,3,.4,1,mat('#FFFFFF'),0,.36,.05))}
  if(ch.hat==='flower'){const fx=.22,fy=.24,fz=.17;head.add(ell(.05,1,1,1,Y,fx,fy,fz));for(let i=0;i<5;i++){const a=i*Math.PI*2/5;head.add(ell(.045,1,1,.6,mat('#FFFFFF'),fx+Math.cos(a)*.07,fy+Math.sin(a)*.07,fz+.01))}}
  if(ch.hat==='bow')[-1,1].forEach(s=>{const b=mesh(new THREE.ConeGeometry(.07,.15,8),mat('#EE4F7C'));b.rotation.z=s*Math.PI/2;b.position.set(.16+s*.07,.3,.06);head.add(b)});
  if(ch.back==='wings')[-1,1].forEach(s=>{const w=ell(.24,1.2,.6,.2,mat('#FFFFFF',{transparent:true,opacity:.9}),s*.25,.98,-.24);w.rotation.z=s*.5;B.add(w)});
  g.userData.h=['afro','mohawk','bun','afropuffs','spacebuns'].includes(ch.hair)?2.02:1.86;g.userData.limbs={arms,legs,rig};g.userData.head=head;return g}
function animLimbs(o,t,moving,speed){const L=o&&o.userData.limbs;if(!L)return;const sw=moving?Math.sin(t*(speed||10))*.7:0;
  L.legs[0].rotation.x=sw;L.legs[1].rotation.x=-sw;L.arms[0].rotation.x=-sw*.8;L.arms[1].rotation.x=sw*.8}

/* ---------- SVG portrait ---------- */
function humanSVG(c){c=sanitizeHuman(c);const id='hc'+(++uid),H=c.hc,S=c.skin,dk=shade(S,-.14),girl=c.g==='girl',hx=100,hy=78;
  let backH='',frontH='',extra='';
  const bangs={side:'M44 70 Q58 38 124 52 Q146 58 156 72 L160 0 L40 0Z',short:'M44 64 Q70 44 100 50 Q132 44 156 64 L160 0 L40 0Z',buzz:'M46 56 Q100 34 154 56 L160 0 L40 0Z',
    straight:'M44 68 Q100 58 156 68 L160 0 L40 0Z',swept:'M46 74 Q66 40 106 50 Q134 56 156 76 L160 0 L40 0Z',afro:'M46 62 Q100 44 154 62 L160 0 L40 0Z',blunt:'M44 63 Q100 66 156 63 L160 0 L40 0Z',fringe:'M44 68 Q60 60 76 67 Q90 61 104 66 Q120 60 134 66 Q146 61 156 70 L160 0 L40 0Z'};
  let bang='swept';
  switch(c.hair){
    case'long':backH=`<path d="M44 78 Q44 22 100 22 Q156 22 156 78 L160 176 Q100 188 40 176Z"/>`;break;
    case'wavy':backH=`<path d="M44 78 Q44 22 100 22 Q156 22 156 78 Q166 100 154 120 Q168 142 154 160 Q160 178 140 182 Q120 192 100 184 Q80 192 60 182 Q40 178 46 160 Q32 142 46 120 Q34 100 44 78Z"/>`;break;
    case'curly':backH=[[46,60],[154,60],[40,90],[160,90],[42,120],[158,120],[48,148],[152,148],[62,168],[138,168],[82,176],[118,176],[100,178],[60,34],[140,34],[100,24]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="22"/>`).join('');break;
    case'ponytail':backH=`<circle cx="${hx}" cy="${hy-4}" r="53"/><ellipse cx="156" cy="112" rx="17" ry="44" transform="rotate(-14 156 112)"/>`;extra=`<circle cx="148" cy="66" r="6" fill="#EE4F7C"/>`;break;
    case'bob':backH=`<path d="M42 80 Q42 22 100 22 Q158 22 158 80 L160 128 Q130 136 118 126 L82 126 Q70 136 40 128Z"/>`;bang='straight';break;
    case'braids':backH=`<circle cx="${hx}" cy="${hy-4}" r="53"/>`;extra=[-1,1].map(s=>[0,1,2,3,4].map(i=>`<ellipse cx="${100+s*(52-i)}" cy="${118+i*16}" rx="${10-i*.6}" ry="10" fill="${H}"/>`).join('')+`<circle cx="${100+s*47}" cy="196" r="6" fill="#EE4F7C"/>`).join('');break;
    case'bun':backH=`<circle cx="${hx}" cy="${hy-4}" r="53"/><circle cx="100" cy="22" r="22"/>`;break;
    case'pigtails':backH=`<circle cx="${hx}" cy="${hy-4}" r="53"/><ellipse cx="38" cy="108" rx="16" ry="34" transform="rotate(18 38 108)"/><ellipse cx="162" cy="108" rx="16" ry="34" transform="rotate(-18 162 108)"/>`;extra=`<circle cx="50" cy="74" r="6" fill="#EE4F7C"/><circle cx="150" cy="74" r="6" fill="#EE4F7C"/>`;break;
    case'afro':backH=`<circle cx="100" cy="66" r="68"/>`;bang='afro';break;
    case'bangs':backH=`<path d="M44 78 Q44 22 100 22 Q156 22 156 78 L160 176 Q100 188 40 176Z"/>`;bang='blunt';break;
    case'fringe':backH=`<circle cx="${hx}" cy="${hy-4}" r="53"/>`;bang='fringe';break;
    case'afropuffs':backH=`<circle cx="${hx}" cy="${hy-3}" r="52.5"/><circle cx="50" cy="30" r="29"/><circle cx="150" cy="30" r="29"/>`;bang='afro';extra=`<rect x="64" y="42" width="12" height="7" rx="3" fill="#EE4F7C" transform="rotate(40 70 45)"/><rect x="124" y="42" width="12" height="7" rx="3" fill="#EE4F7C" transform="rotate(-40 130 45)"/>`;break;
    case'spacebuns':backH=`<circle cx="${hx}" cy="${hy-4}" r="53"/><circle cx="60" cy="28" r="21"/><circle cx="140" cy="28" r="21"/>`;bang='blunt';extra=`<circle cx="74" cy="40" r="5" fill="#EE4F7C"/><circle cx="126" cy="40" r="5" fill="#EE4F7C"/>`;break;
    case'boxbraids':backH=`<path d="M44 78 Q44 22 100 22 Q156 22 156 78 L156 120 L44 120Z"/>`;extra=[-1,1].map(s=>[0,1,2,3].map(j=>{const bx=100+s*(44+j*4.5);return Array.from({length:8},(_,i)=>`<ellipse cx="${bx}" cy="${100+i*12}" rx="4.6" ry="7" fill="${H}" stroke="${shade(H,-.25)}" stroke-width=".8"/>`).join('')+`<circle cx="${bx}" cy="${100+8*12}" r="3" fill="#FFC531"/>`}).join('')).join('');break;
    case'buzz':backH=`<circle cx="${hx}" cy="${hy-2}" r="51.5"/>`;bang='buzz';break;
    case'mohawk':backH=`<circle cx="${hx}" cy="${hy-2}" r="51.5"/>`;bang='buzz';extra=`<path d="M90 34 L94 6 L100 22 L106 4 L110 34Z" fill="${H}"/>`;break;
    case'spiky':backH=`<circle cx="${hx}" cy="${hy-4}" r="53"/>`;bang='short';extra=`<path d="M52 44 L48 14 L70 32 L76 4 L92 26 L104 0 L114 26 L130 6 L134 32 L154 18 L150 46Z" fill="${H}"/>`;break;
    case'messy':backH=`<circle cx="${hx}" cy="${hy-4}" r="53"/>`;bang='side';extra=[[60,32],[84,22],[110,20],[136,30],[150,46]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="13" fill="${H}"/>`).join('');break;
    case'curlyshort':backH=`<circle cx="${hx}" cy="${hy-4}" r="53"/>`;bang='short';extra=Array.from({length:11},(_,i)=>{const a=(200+i*14)*Math.PI/180;return`<circle cx="${(100+Math.cos(a)*50).toFixed(1)}" cy="${(76+Math.sin(a)*50).toFixed(1)}" r="12" fill="${H}"/>`}).join('');break;
    case'side':backH=`<circle cx="${hx}" cy="${hy-4}" r="53"/>`;bang='side';break;
    default:backH=`<circle cx="${hx}" cy="${hy-4}" r="53"/>`;bang='short'}
  frontH=`<clipPath id="${id}"><circle cx="${hx}" cy="${hy}" r="51"/></clipPath><path clip-path="url(#${id})" fill="${H}" d="${bangs[bang]}"/>`;
  const dress=c.bot==='dress',skirt=c.bot==='skirt'||dress,pants=c.bot==='pants';
  const legs=[-1,1].map(s=>`<rect x="${100+s*14-9}" y="184" width="18" height="${pants?40:40}" rx="8" fill="${pants?c.bc:S}"/>${c.bot==='shorts'?`<rect x="${100+s*14-10}" y="182" width="20" height="18" rx="6" fill="${c.bc}"/>`:''}<ellipse cx="${100+s*15}" cy="226" rx="15" ry="8" fill="#FFFFFF" stroke="#1D2A48" stroke-width="3"/>`).join('');
  const body=`<path d="M70 140 Q70 130 84 128 L116 128 Q130 130 130 140 L${girl?127:131} 192 L${girl?73:69} 192Z" fill="${c.top}"/>`+(skirt?`<path d="M72 176 L128 176 L142 206 Q100 214 58 206Z" fill="${dress?c.top:c.bc}"/>`:pants||c.bot==='shorts'?`<rect x="70" y="178" width="60" height="16" rx="6" fill="${c.bc}"/>`:'');
  const arms=[-1,1].map(s=>`<rect x="${100+s*36-9}" y="134" width="18" height="52" rx="9" fill="${S}" transform="rotate(${s*-8} ${100+s*36} 134)"/><rect x="${100+s*36-10}" y="132" width="20" height="24" rx="9" fill="${c.top}" transform="rotate(${s*-8} ${100+s*36} 134)"/>`).join('');
  const ink='#2A1B14',LC=c.lip!=='none'?c.lip:null,mx=x=>200-x;
  const lashes='';
  const glit=c.glit?[[66,96],[72,104],[62,104],[134,96],[128,104],[138,104]].map(([x,y])=>`<path d="M${x} ${y-4}l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2z" fill="#FDE047"/>`).join(''):'';
  const shadow=c.sh!=='none'?[82,118].map(x=>`<ellipse cx="${x}" cy="77" rx="13.5" ry="8.5" fill="${c.sh}" opacity=".75"/>`).join(''):'';
  const freck=c.frk?[[72,96],[77,100],[67,100],[74,104],[80,95]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.4" fill="${shade(S,-.32)}"/><circle cx="${mx(x)}" cy="${y}" r="1.4" fill="${shade(S,-.32)}"/>`).join(''):'';
  const gem1=(x,y,r)=>c.gem==='star'?`<path d="M${x} ${y-r}l${r*.3} ${r*.7} ${r*.7} ${r*.3}-${r*.7} ${r*.3}-${r*.3} ${r*.7}-${r*.3}-${r*.7}-${r*.7}-${r*.3} ${r*.7}-${r*.3}z" fill="#FFD54A" stroke="#E0A800" stroke-width=".6"/>`
    :c.gem==='heart'?`<path d="M${x} ${y+r*.8}C${x-r*1.4} ${y-r*.2} ${x-r*.6} ${y-r*1.2} ${x} ${y-r*.3}C${x+r*.6} ${y-r*1.2} ${x+r*1.4} ${y-r*.2} ${x} ${y+r*.8}z" fill="#FF4FA3"/>`
    :`<circle cx="${x}" cy="${y}" r="${r*.55}" fill="#FFFFFF" stroke="#E5E7EB" stroke-width=".8"/><circle cx="${x-r*.18}" cy="${y-r*.18}" r="${r*.18}" fill="#FFFFFF"/>`;
  const gems=c.gem!=='none'?[[60,93,4.5],[57,100,3.6],[61,106,3]].map(([x,y,r])=>gem1(x,y,r)+gem1(mx(x),y,r)).join(''):'';
  const ES={big:[8.5,10],doe:[9.5,11],sparkle:[9.5,11]};
  const eye=(x,s)=>{if(c.eyes==='happy'||(c.eyes==='wink'&&s>0))return`<path d="M${x-8} 86 Q${x} 76 ${x+8} 86" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    if(c.eyes==='dots')return`<circle cx="${x}" cy="84" r="5" fill="${ink}"/>`;
    const cid=id+'e'+(s>0?'r':'l');let shape,lid,ir,cy=85,ow,lash='';
    if(c.eyes==='almond'){const o=x+s*11.5,i=x-s*10.5;shape=`<path d="M${i} 87 Q${x-s*2} 73 ${o} 81 Q${x+s*2} 96 ${i} 87Z"/>`;lid=`M${i} 87 Q${x-s*2} 73 ${o} 81`;ir=7.4;cy=85;ow=[o,81]}
    else{const[rx,ry]=ES[c.eyes]||ES.big;shape=`<ellipse cx="${x}" cy="84" rx="${rx}" ry="${ry}"/>`;lid=`M${x-rx-.5} 85 A${rx+.5} ${ry+.5} 0 0 1 ${x+rx+.5} 85`;ir=rx*.86;cy=85;ow=[x+s*(rx+.5),82];
      if(c.lash)lash=[.25,.5,.78].map(t=>{const a=t*Math.PI/2,px=x+s*(rx+.4)*Math.cos(a),py=84-(ry+.4)*Math.sin(a);return`M${px.toFixed(1)} ${py.toFixed(1)} l${(s*Math.cos(a)*4.5).toFixed(1)} ${(-Math.sin(a)*4.5-1).toFixed(1)}`}).join(' ')}
    const hl=`<circle cx="${x+ir*.35}" cy="${cy-ir*.42}" r="${ir*.32}" fill="#FFFFFF"/><circle cx="${x-ir*.32}" cy="${cy+ir*.38}" r="${ir*.15}" fill="#FFFFFF"/>`+(c.eyes==='sparkle'?`<path d="M${x-ir*.4} ${cy-ir*.6}l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z" fill="#FFFFFF"/><circle cx="${x+ir*.1}" cy="${cy+ir*.55}" r="${ir*.12}" fill="#FFFFFF"/>`:'');
    return`<clipPath id="${cid}">${shape}</clipPath><g fill="#FFFFFF">${shape}</g><g clip-path="url(#${cid})"><circle cx="${x}" cy="${cy}" r="${ir}" fill="${c.ec}"/><circle cx="${x}" cy="${cy}" r="${ir*.62}" fill="${shade(c.ec,-.35)}" opacity=".55"/><circle cx="${x}" cy="${cy}" r="${ir*.42}" fill="#120A06"/>${hl}</g>
      <path d="${lid}" stroke="${ink}" stroke-width="${c.liner?3.6:2.4}" fill="none" stroke-linecap="round"/>${c.liner?`<path d="M${ow[0]} ${ow[1]} l${s*6} -5" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`:''}${c.lash&&!lash?`<path d="M${ow[0]} ${ow[1]} l${s*4} -3 M${ow[0]-s*3} ${ow[1]-3} l${s*3} -4" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`:''}${lash?`<path d="${lash}" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`:''}`};
  const BR={soft:['M74 70 Q82 66 90 70',3.5],straight:['M74 69 L90 68',4.2],arch:['M74 71 Q83 62 90 68.5',3.5],bold:['M73 70 Q82 64.5 91 70',5.6]}[c.bro]||['M74 70 Q82 66 90 70',3.5];
  const brow=d=>`<path d="${d}" stroke="${H}" stroke-width="${BR[1]}" fill="none" stroke-linecap="round"/>`;
  const mirror=d=>d.replace(/(-?[\d.]+) (-?[\d.]+)/g,(m,a,b)=>`${200-+a} ${b}`);
  const blush=c.blc!=='none'?`<ellipse cx="70" cy="100" rx="8.5" ry="5" fill="${c.blc}" opacity=".55"/><ellipse cx="130" cy="100" rx="8.5" ry="5" fill="${c.blc}" opacity=".55"/>`:'';
  const mouth=LC?`<path d="M89 105 Q94 101.5 100 104 Q106 101.5 111 105 Q106 114.5 100 114.5 Q94 114.5 89 105Z" fill="${LC}"/><path d="M90 105.4 Q100 108.5 110 105.4" stroke="${shade(LC,-.3)}" stroke-width="1.3" fill="none" stroke-linecap="round"/><ellipse cx="103.5" cy="110.8" rx="3.2" ry="1.3" fill="#FFFFFF" opacity=".55"/>`
    :`<path d="M90 104 Q100 114 110 104" stroke="#B2304E" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const face=`${shadow}${eye(82,-1)}${eye(118,1)}${brow(BR[0])}${brow(mirror(BR[0]))}${blush}${freck}${mouth}${lashes}${glit}${gems}`;
  let hat='';const t=hy-50;
  if(c.hat==='crown')hat=`<path d="M76 ${t+8} L76 ${t-18} L88 ${t-6} L100 ${t-22} L112 ${t-6} L124 ${t-18} L124 ${t+8}Z" fill="#FFC531" stroke="#E0A800" stroke-width="2"/>`;
  if(c.hat==='cap')hat=`<path d="M48 ${t+30} Q50 ${t-6} 100 ${t-6} Q150 ${t-6} 152 ${t+30}Z" fill="#EE4F7C"/><path d="M100 ${t+28} L170 ${t+30} Q170 ${t+38} 100 ${t+36}Z" fill="#C23560"/>`;
  if(c.hat==='helmet')hat=`<path d="M46 ${t+34} Q46 ${t-10} 100 ${t-10} Q154 ${t-10} 154 ${t+34}Z" fill="#EF4444"/><rect x="92" y="${t-8}" width="16" height="30" rx="6" fill="#FFFFFF" opacity=".8"/>`;
  if(c.hat==='flower')hat=[0,72,144,216,288].map(a=>`<circle cx="${(136+11*Math.cos(a*Math.PI/180)).toFixed(1)}" cy="${(t+16+11*Math.sin(a*Math.PI/180)).toFixed(1)}" r="8" fill="#FFFFFF" stroke="#FFC2D3" stroke-width="2"/>`).join('')+`<circle cx="136" cy="${t+16}" r="7" fill="#FFC531"/>`;
  if(c.hat==='bow')hat=`<g fill="#EE4F7C"><polygon points="128,${t+14} 108,${t+2} 108,${t+26}"/><polygon points="128,${t+14} 148,${t+2} 148,${t+26}"/></g><circle cx="128" cy="${t+14}" r="6" fill="#C23560"/>`;
  let outfit='';const of=c.outfit;
  if(of==='party')outfit=`<path d="M74 170 L126 170 L150 214 Q100 224 50 214Z" fill="${c.top}" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="2 6"/>`;
  if(of==='hoodie')outfit=`<path d="M78 134 Q100 120 122 134 L118 140 Q100 130 82 140Z" fill="${shade(c.top,-.15)}"/><rect x="84" y="160" width="32" height="16" rx="6" fill="${shade(c.top,-.15)}"/>`;
  if(of==='jacket'||of==='suit'){const J=of==='suit'?'#1F2937':'#4F7CC2';outfit=`<path d="M70 140 Q70 130 84 128 L96 128 L92 190 L70 192Z" fill="${J}"/><path d="M130 140 Q130 130 116 128 L104 128 L108 190 L130 192Z" fill="${J}"/>`+(of==='suit'?`<path d="M96 130 L104 130 L102 136 L106 168 L100 176 L94 168 L98 136Z" fill="#DC2626"/>`:'')}
  if(of==='jersey')outfit=`<rect x="71" y="150" width="58" height="9" fill="#FFFFFF"/><text x="100" y="182" font-size="18" font-weight="700" text-anchor="middle" fill="#FFFFFF" font-family="Arial">10</text>`;
  const wings=c.back==='wings'?`<g fill="#FFFFFF" stroke="#E3E9F7" stroke-width="3"><ellipse cx="54" cy="150" rx="30" ry="17" transform="rotate(-28 54 150)"/><ellipse cx="146" cy="150" rx="30" ry="17" transform="rotate(28 146 150)"/></g>`:'';
  return`<svg viewBox="0 -14 200 248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="הדמות">${wings}<g fill="${H}">${backH}</g>${legs}${arms}${body}${outfit}<rect x="91" y="118" width="18" height="16" rx="6" fill="${dk}"/>
    <circle cx="48" cy="${hy+4}" r="8" fill="${S}"/><circle cx="152" cy="${hy+4}" r="8" fill="${S}"/><circle cx="${hx}" cy="${hy}" r="50" fill="${S}"/>${frontH}${extra}${face}${hat}</svg>`}
