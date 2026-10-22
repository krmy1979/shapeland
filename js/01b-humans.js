/* Shapeland · a world by Shirel Yitzhak */
/* ===================== HUMAN AVATARS (boys & girls, hair salon) ===================== */
const SKINS=[['#FFE3CC','light'],['#F6CBA5','fair'],['#E3A97F','tan'],['#C68657','olive'],['#9A6440','brown'],['#6B4229','dark']];
/* hair colors: [hex, english, hebrew, price (0 = free)] */
const HAIRC=[['#1F1B1A','black','שחור',0],['#4A2E1F','dark brown','חום כהה',0],['#8A5530','brown','חום',0],['#E8C268','blonde','בלונד',0],['#C8562A','ginger','ג׳ינג׳י',0],
  ['#EDE6D6','platinum','פלטינה',10],['#FF7EB6','pink','ורוד',12],['#9D6BFF','purple','סגול',12],['#4DA3FF','blue','כחול',12],['#3FD3B0','mint','מנטה',12]];
/* hair styles: id -> [hebrew, english, for, price] */
const HAIRS={
  long:['ארוך וחלק','long straight','girl',0],ponytail:['קוקו','ponytail','girl',0],bob:['קארה','bob','girl',0],curly:['מתולתל','curly','girl',0],
  bun:['פקעת','bun','girl',12],braids:['צמות','braids','girl',15],pigtails:['שתי קוקיות','pigtails','girl',15],wavy:['גלי ארוך','wavy','girl',20],
  short:['קצר','short','boy',0],side:['הצידה','side part','boy',0],curlyshort:['תלתלים','curls','boy',0],buzz:['קצוץ','buzz cut','boy',0],
  spiky:['קוצים','spiky','boy',12],messy:['פרוע','messy','boy',12],afro:['אפרו','afro','boy',15],mohawk:['מוהוק','mohawk','boy',20]};
const BOTTOMS={pants:['מכנסיים','pants'],shorts:['מכנסיים קצרים','shorts'],skirt:['חצאית','skirt'],dress:['שמלה','dress']};
const HEYES={big:['עיניים גדולות','big eyes'],happy:['שמחות','happy eyes'],dots:['קטנות','small eyes'],wink:['קריצה','wink']};
const hairPrice=id=>(HAIRS[id]||[])[3]||0;const hcPrice=hex=>(HAIRC.find(x=>x[0]===hex)||[])[3]||0;
const salonOwned=k=>!k||(P.salon||[]).includes(k);
function humanCh(g,old){const girl=g!=='boy';return{kind:'human',g:girl?'girl':'boy',skin:'#F6CBA5',hair:girl?'long':'short',hc:girl?'#4A2E1F':'#1F1B1A',
  top:(old&&old.color)||(girl?'#FF8FB1':'#64A8FA'),bot:girl?'skirt':'pants',bc:girl?'#B49BFA':'#3B4A75',eyes:'big',hat:old&&['crown','cap','flower','bow'].includes(old.hat)?old.hat:'none',back:old&&old.back==='wings'?'wings':'none'}}
function sanitizeHuman(c){const d=humanCh(c.g);const hex=v=>typeof v==='string'&&/^#[0-9A-Fa-f]{6}$/.test(v);
  return{kind:'human',g:c.g==='boy'?'boy':'girl',skin:SKINS.some(x=>x[0]===c.skin)?c.skin:d.skin,hair:HAIRS[c.hair]?c.hair:d.hair,hc:HAIRC.some(x=>x[0]===c.hc)?c.hc:d.hc,
    top:hex(c.top)?c.top:d.top,bot:BOTTOMS[c.bot]?c.bot:d.bot,bc:hex(c.bc)?c.bc:d.bc,eyes:HEYES[c.eyes]?c.eyes:'big',
    hat:['none','crown','cap','flower','bow'].includes(c.hat)?c.hat:'none',back:['none','wings'].includes(c.back)?c.back:'none'}}

/* ---------- 3D ---------- */
function ell(r,sx,sy,sz,m,x,y,z){const o=mesh(new THREE.SphereGeometry(r,16,12),m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);return o}
function hair3D(style,H,head){const r=.355;const add=o=>{head.add(o);return o};
  const cap=(tilt,rr)=>{const m=mesh(new THREE.SphereGeometry(rr||r,26,14,0,Math.PI*2,0,Math.PI/2),H);m.rotation.x=-tilt;return add(m)};
  const back=(len,rr,sc)=>{const m=mesh(new THREE.SphereGeometry(rr||r,26,16,Math.PI,Math.PI,0,Math.PI*len),H);if(sc)m.scale.set(sc[0],sc[1],sc[2]);return add(m)};
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
    case'pigtails':cap(.34);back(.66);[-1,1].forEach(s=>{tie(s*.32,.06,-.12);const t=add(ell(.11,1,2.3,1,H,s*.42,-.12,-.12));t.rotation.z=s*.45});break;
    default:cap(.38);back(.62)}}
function human3D(ch){ch=sanitizeHuman(ch);const g=new THREE.Group();const rig=new THREE.Group();rig.position.y=.85;g.add(rig);const B=new THREE.Group();B.position.y=-.85;rig.add(B);
  const S=mat(ch.skin),T=mat(ch.top),BC=mat(ch.bc),H=mat(ch.hc),girl=ch.g==='girl';
  const legs=[],arms=[];const covered=ch.bot==='pants';
  [-1,1].forEach(s=>{const L=new THREE.Group();L.position.set(s*.12,.62,0);
    const up=mesh(new THREE.CylinderGeometry(.1,.09,.3,12),ch.bot==='skirt'||ch.bot==='dress'?S:BC);up.position.y=-.15;L.add(up);
    const lo=mesh(new THREE.CylinderGeometry(.087,.08,.28,12),covered?BC:S);lo.position.y=-.43;L.add(lo);
    const sh=ell(.1,1,.6,1.5,mat('#FFFFFF'),0,-.57,.05);L.add(sh);const so=ell(.1,1.02,.2,1.52,mat('#1D2A48'),0,-.61,.05);L.add(so);B.add(L);legs.push(L)});
  if(ch.bot==='pants'||ch.bot==='shorts'){const hp=mesh(new THREE.CylinderGeometry(.235,.23,.16,18),BC);hp.position.y=.64;B.add(hp)}
  else{const sk=mesh(new THREE.LatheGeometry([[0,.4],[.37,.4],[.33,.5],[.25,.68],[0,.72]].map(p=>new THREE.Vector2(p[0],p[1])),22),ch.bot==='dress'?T:BC);B.add(sk)}
  const torso=mesh(new THREE.LatheGeometry([[0,.6],[.225,.6],[.24,.7],girl?[.205,.84]:[.225,.84],[.25,.97],[.2,1.06],[.08,1.1],[0,1.1]].map(p=>new THREE.Vector2(p[0],p[1])),22),T);B.add(torso);
  const nk=mesh(new THREE.CylinderGeometry(.07,.08,.12,10),S);nk.position.y=1.12;B.add(nk);
  [-1,1].forEach(s=>{const A=new THREE.Group();A.position.set(s*.29,1.01,0);A.rotation.z=s*.1;
    A.add(ell(.09,1,1.45,1,T,0,-.09,0));const fa=mesh(new THREE.CylinderGeometry(.068,.062,.26,10),S);fa.position.y=-.3;A.add(fa);A.add(ell(.075,1,1.1,1,S,0,-.46,0));B.add(A);arms.push(A)});
  const head=new THREE.Group();head.position.y=1.43;B.add(head);head.add(mesh(new THREE.SphereGeometry(.34,28,20),S));
  [-1,1].forEach(s=>head.add(ell(.06,.6,1,.9,S,s*.335,-.03,0)));
  const ink=mat('#2A1B14'),W=mat('#FFFFFF');
  [-1,1].forEach(s=>{const x=s*.12;
    if(ch.eyes==='happy'||(ch.eyes==='wink'&&s>0)){const t=mesh(new THREE.TorusGeometry(.05,.016,6,12,Math.PI),ink);t.position.set(x,-.01,.315);head.add(t)}
    else if(ch.eyes==='dots'){head.add(ell(.04,1,1.2,.6,ink,x,-.01,.318))}
    else{head.add(ell(.068,1,1.18,.5,W,x,-.01,.3));head.add(ell(.05,1,1.12,.5,mat('#3B2416'),x,-.015,.322));head.add(ell(.017,1,1,1,W,x+.02,.015,.345))}
    const br=ell(.05,1.3,.3,.4,H,x,.1,.315);br.rotation.z=-s*.12;head.add(br);
    const bl=ell(.05,1.3,.75,.25,mat('#FF9EB5',{transparent:true,opacity:.55}),s*.2,-.09,.27);bl.rotation.y=s*.6;head.add(bl)});
  head.add(ell(.026,1,1,1,mat(shade(ch.skin,-.12)),0,-.06,.338));
  const mo=mesh(new THREE.TorusGeometry(.055,.013,6,12,Math.PI),mat('#B2304E'));mo.rotation.z=Math.PI;mo.position.set(0,-.12,.31);head.add(mo);
  hair3D(ch.hair,H,head);
  const T0=.37,Y=mat('#FFD54A');
  if(ch.hat==='crown'){const c=mesh(new THREE.CylinderGeometry(.19,.16,.15,6,1,true),mat('#FFC531',{metalness:.5,roughness:.3,side:THREE.DoubleSide}));c.position.y=T0+.04;head.add(c)}
  if(ch.hat==='cap'){const c=mesh(new THREE.SphereGeometry(.37,18,8,0,Math.PI*2,0,Math.PI/2),mat('#EE4F7C'));c.position.y=.02;head.add(c);const b=ell(.2,1,.12,1.1,mat('#C23560'),0,.06,.36);head.add(b)}
  if(ch.hat==='flower'){const fx=.22,fy=.24,fz=.17;head.add(ell(.05,1,1,1,Y,fx,fy,fz));for(let i=0;i<5;i++){const a=i*Math.PI*2/5;head.add(ell(.045,1,1,.6,mat('#FFFFFF'),fx+Math.cos(a)*.07,fy+Math.sin(a)*.07,fz+.01))}}
  if(ch.hat==='bow')[-1,1].forEach(s=>{const b=mesh(new THREE.ConeGeometry(.07,.15,8),mat('#EE4F7C'));b.rotation.z=s*Math.PI/2;b.position.set(.16+s*.07,.3,.06);head.add(b)});
  if(ch.back==='wings')[-1,1].forEach(s=>{const w=ell(.24,1.2,.6,.2,mat('#FFFFFF',{transparent:true,opacity:.9}),s*.25,.98,-.24);w.rotation.z=s*.5;B.add(w)});
  g.userData.h=ch.hair==='afro'||ch.hair==='mohawk'||ch.hair==='bun'?2.02:1.86;g.userData.limbs={arms,legs,rig};g.userData.head=head;return g}
function animLimbs(o,t,moving,speed){const L=o&&o.userData.limbs;if(!L)return;const sw=moving?Math.sin(t*(speed||10))*.7:0;
  L.legs[0].rotation.x=sw;L.legs[1].rotation.x=-sw;L.arms[0].rotation.x=-sw*.8;L.arms[1].rotation.x=sw*.8}

/* ---------- SVG portrait ---------- */
function humanSVG(c){c=sanitizeHuman(c);const id='hc'+(++uid),H=c.hc,S=c.skin,dk=shade(S,-.14),girl=c.g==='girl',hx=100,hy=78;
  let backH='',frontH='',extra='';
  const bangs={side:'M44 70 Q58 38 124 52 Q146 58 156 72 L160 0 L40 0Z',short:'M44 64 Q70 44 100 50 Q132 44 156 64 L160 0 L40 0Z',buzz:'M46 56 Q100 34 154 56 L160 0 L40 0Z',
    straight:'M44 68 Q100 58 156 68 L160 0 L40 0Z',swept:'M46 74 Q66 40 106 50 Q134 56 156 76 L160 0 L40 0Z',afro:'M46 62 Q100 44 154 62 L160 0 L40 0Z'};
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
  const eye=(x,s)=>c.eyes==='happy'||(c.eyes==='wink'&&s>0)?`<path d="M${x-8} 86 Q${x} 76 ${x+8} 86" stroke="#2A1B14" stroke-width="4" fill="none" stroke-linecap="round"/>`
    :c.eyes==='dots'?`<circle cx="${x}" cy="84" r="5" fill="#2A1B14"/>`:`<ellipse cx="${x}" cy="84" rx="8" ry="10" fill="#3B2416"/><circle cx="${x+3}" cy="80" r="3" fill="#FFFFFF"/>`;
  const face=`${eye(82,-1)}${eye(118,1)}<path d="M74 70 Q82 66 90 70" stroke="${H}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M110 70 Q118 66 126 70" stroke="${H}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="70" cy="100" rx="8" ry="5" fill="#FF9EB5" opacity=".55"/><ellipse cx="130" cy="100" rx="8" ry="5" fill="#FF9EB5" opacity=".55"/><path d="M90 104 Q100 114 110 104" stroke="#B2304E" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  let hat='';const t=hy-50;
  if(c.hat==='crown')hat=`<path d="M76 ${t+8} L76 ${t-18} L88 ${t-6} L100 ${t-22} L112 ${t-6} L124 ${t-18} L124 ${t+8}Z" fill="#FFC531" stroke="#E0A800" stroke-width="2"/>`;
  if(c.hat==='cap')hat=`<path d="M48 ${t+30} Q50 ${t-6} 100 ${t-6} Q150 ${t-6} 152 ${t+30}Z" fill="#EE4F7C"/><path d="M100 ${t+28} L170 ${t+30} Q170 ${t+38} 100 ${t+36}Z" fill="#C23560"/>`;
  if(c.hat==='flower')hat=[0,72,144,216,288].map(a=>`<circle cx="${(136+11*Math.cos(a*Math.PI/180)).toFixed(1)}" cy="${(t+16+11*Math.sin(a*Math.PI/180)).toFixed(1)}" r="8" fill="#FFFFFF" stroke="#FFC2D3" stroke-width="2"/>`).join('')+`<circle cx="136" cy="${t+16}" r="7" fill="#FFC531"/>`;
  if(c.hat==='bow')hat=`<g fill="#EE4F7C"><polygon points="128,${t+14} 108,${t+2} 108,${t+26}"/><polygon points="128,${t+14} 148,${t+2} 148,${t+26}"/></g><circle cx="128" cy="${t+14}" r="6" fill="#C23560"/>`;
  const wings=c.back==='wings'?`<g fill="#FFFFFF" stroke="#E3E9F7" stroke-width="3"><ellipse cx="54" cy="150" rx="30" ry="17" transform="rotate(-28 54 150)"/><ellipse cx="146" cy="150" rx="30" ry="17" transform="rotate(28 146 150)"/></g>`:'';
  return`<svg viewBox="0 -14 200 248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="הדמות">${wings}<g fill="${H}">${backH}</g>${legs}${arms}${body}<rect x="91" y="118" width="18" height="16" rx="6" fill="${dk}"/>
    <circle cx="48" cy="${hy+4}" r="8" fill="${S}"/><circle cx="152" cy="${hy+4}" r="8" fill="${S}"/><circle cx="${hx}" cy="${hy}" r="50" fill="${S}"/>${frontH}${extra}${face}${hat}</svg>`}
