/* Shapeland · a world by Shirel Yitzhak */
/* ===================== ASHKELON-STYLE CITY ===================== */
const CX=ZC.city[0],CZ=ZC.city[1];
const CITYPICK=[];
function cbox(w,h,d,col,x,y,z,sh,o){const m=mesh(new THREE.BoxGeometry(w,h,d),o?mat(col,o):mat(col),sh);m.position.set(CX+x,y,CZ+z);scene.add(m);return m}
const cityGround=cbox(56,.5,50,'#A7D99A',4,-.25,0,false);CITYPICK.push(cityGround);
cbox(56,4,50,'#B98A5E',4,-2.6,0,false);
CITYPICK.push(cbox(9,.06,50,'#F4DFA8',-19.5,.03,0,false));
CITYPICK.push(cbox(2,.07,50,'#E7D9C1',-14,.035,0,false));
[-10,14].forEach(x=>{CITYPICK.push(cbox(4,.05,50,'#4B5563',x,.03,0,false));for(let z=-23;z<=23;z+=3)cbox(.15,.06,1.2,'#FDE68A',x,.04,z,false)});
CITYPICK.push(cbox(20,.05,4,'#4B5563',2,.03,0,false));for(let x=-6;x<=10;x+=3)cbox(1.2,.06,.15,'#FDE68A',x,.04,0,false);
const CROSS=[{x:-10,z:8},{x:14,z:10}];
CROSS.forEach((c,id)=>{for(let i=0;i<6;i++){const s=cbox(.42,.07,2.4,'#FFFFFF',c.x-1.6+i*.64,.045,c.z,false);s.userData.cross=id;CITYPICK.push(s)}});
const LIGHTS=CROSS.map((c,id)=>{const g=new THREE.Group();const pole=mesh(new THREE.CylinderGeometry(.07,.07,2.6,8),mat('#374151'));pole.position.y=1.3;g.add(pole);
  const box=mesh(new THREE.BoxGeometry(.45,.9,.35),mat('#1F2937'));box.position.y=2.75;g.add(box);
  const red=new THREE.Mesh(new THREE.SphereGeometry(.15,12,10),new THREE.MeshStandardMaterial({color:'#7F1D1D',emissive:'#000000'}));red.position.set(0,2.95,.18);g.add(red);
  const green=new THREE.Mesh(new THREE.SphereGeometry(.15,12,10),new THREE.MeshStandardMaterial({color:'#14532D',emissive:'#000000'}));green.position.set(0,2.55,.18);g.add(green);
  g.position.set(CX+c.x-2.7,0,CZ+c.z+1.4);g.lookAt(CX+c.x,0,CZ+c.z+1.4);scene.add(g);return{red,green}});
let PEDGREEN=false;
function setLights(on){PEDGREEN=on;LIGHTS.forEach(l=>{l.red.material.emissive.set(on?'#000000':'#FF2D2D');l.green.material.emissive.set(on?'#22FF66':'#000000')})}
setLights(false);
// marina + boats + Sea Tower
CITYPICK.push(cbox(8,.07,10,'#3AA3D9',-19.5,.05,-19,false,{roughness:.15}));
cbox(6,.16,.8,'#A47148',-19,.12,-16.5,true);cbox(.8,.16,6,'#A47148',-16,.12,-19.5,true);
function boat(x,z,c,r){const g=new THREE.Group();const hull=mesh(new THREE.BoxGeometry(1.1,.45,2.6),mat(c));hull.position.y=.3;g.add(hull);
  const deck=mesh(new THREE.BoxGeometry(.9,.08,2.2),mat('#F5F0E6'));deck.position.y=.55;g.add(deck);
  const mast=mesh(new THREE.CylinderGeometry(.04,.04,2.2,6),mat('#E5E7EB'));mast.position.y=1.6;g.add(mast);
  const sail=mesh(new THREE.ConeGeometry(.7,1.8,3),mat('#FFFFFF'));sail.scale.set(1,1,.08);sail.position.set(.25,1.65,0);g.add(sail);
  g.position.set(CX+x,0,CZ+z);g.rotation.y=r;scene.add(g);return g}
const BOATS=[boat(-21.6,-20.5,'#EF4444',.1),boat(-17.8,-22.4,'#3B82F6',-.15),boat(-21,-23.2,'#F59E0B',.3)];
const TOWER=(()=>{const g=new THREE.Group();const t=mesh(new THREE.CylinderGeometry(1.1,1.4,7,24),mat('#FFFFFF'));t.position.y=3.5;g.add(t);
  [1.6,3.6,5.6].forEach(y=>{const r=mesh(new THREE.CylinderGeometry(1.32-y*.03,1.36-y*.03,.7,24),mat('#EF4444'));r.position.y=y;g.add(r)});
  const top=mesh(new THREE.CylinderGeometry(.9,.9,1,16),mat('#BFE3FF',{roughness:.1}));top.position.y=7.5;g.add(top);const roof=mesh(new THREE.ConeGeometry(1.2,1,16),mat('#EF4444'));roof.position.y=8.5;g.add(roof);
  const door=mesh(new THREE.BoxGeometry(.8,1.4,.1),mat('#7C4A2D'));door.position.set(0,.7,1.3);g.add(door);
  const lb=label('Sea Tower 🔐','#1D2A48','#FFFFFF',.5);lb.position.y=9.6;g.add(lb);g.position.set(CX-13.2,0,CZ-19.5);g.lookAt(CX,0,CZ-19.5);rootify(g);g.userData.escape=true;scene.add(g);return g})();
// National park with ancient columns
CITYPICK.push(cbox(14,.06,11,'#E8D3A6',1,.03,18.5,false));
[[-4,15,2.4],[-2,15,1.6],[0,15,2.4],[2,15,1.1],[4,15,2.4],[-4,22,2],[4,22,1.4]].forEach(([x,z,h])=>{const c=mesh(new THREE.CylinderGeometry(.33,.38,h,14),mat('#F1E4C3'));c.position.set(CX+x,h/2,CZ+z);scene.add(c);
  if(h>2){const cap=mesh(new THREE.BoxGeometry(.9,.2,.9),mat('#E8D7AE'));cap.position.set(CX+x,h+.1,CZ+z);scene.add(cap)}});
(()=>{const f=mesh(new THREE.CylinderGeometry(.33,.33,2.2,14),mat('#E8D7AE'));f.rotation.z=Math.PI/2;f.rotation.y=.5;f.position.set(CX+2,.33,CZ+19.5);scene.add(f);
  cbox(3,1.1,.5,'#D9C29A',-1,.55,22.5,true);cbox(.5,.8,2.4,'#D9C29A',6,.4,20,true);
  const arch=mesh(new THREE.TorusGeometry(1.3,.25,8,20,Math.PI),mat('#E8D7AE'));arch.position.set(CX-3,1.4,CZ+19);scene.add(arch);
  [[-4.3,19],[-1.7,19]].forEach(([x,z])=>{const p=mesh(new THREE.BoxGeometry(.5,1.4,.5),mat('#E8D7AE'));p.position.set(CX+x,.7,CZ+z);scene.add(p)});
  const lb=label('National Park 🏛️','#FFFFFF','#1D2A48',.5);lb.position.set(CX+1,3.6,CZ+13.5);scene.add(lb)})();
function palm(x,z){const g=new THREE.Group();const t=mesh(new THREE.CylinderGeometry(.12,.18,3,8),mat('#9A6B3C'));t.position.y=1.5;t.rotation.z=.06;g.add(t);
  for(let i=0;i<6;i++){const l=mesh(new THREE.ConeGeometry(.28,1.8,6),mat('#2F9E44'));l.position.set(Math.cos(i)*.6,3,Math.sin(i)*.6);l.rotation.set(Math.sin(i)*1.2,0,-Math.cos(i)*1.2);g.add(l)}
  g.position.set(CX+x,0,CZ+z);scene.add(g)}
[[-15.6,-10],[-15.6,-2],[-15.6,10],[-15.6,22],[-6,13.6],[7.5,23],[-23,-12],[-23,24]].forEach(a=>palm(...a));
// mall
const MALL=(()=>{const g=new THREE.Group();const b=mesh(new THREE.BoxGeometry(12,6,8),mat('#E0E7FF'));b.position.y=3;g.add(b);
  const gl=mesh(new THREE.BoxGeometry(12.1,1.8,8.1),mat('#93C5FD',{roughness:.1}));gl.position.y=3.6;g.add(gl);
  const ent=mesh(new THREE.BoxGeometry(3,2.4,.2),mat('#60A5FA',{roughness:.1}));ent.position.set(0,1.2,4.05);g.add(ent);
  const lb=label('Ashkelon Mall 🛍️','#EE4F7C','#FFFFFF',.6);lb.position.y=7.4;g.add(lb);g.position.set(CX+22,0,CZ-14);g.rotation.y=-Math.PI/2;rootify(g);g.userData.mall=true;scene.add(g);return g})();
// school (generic building, real safety rules)
const SCHOOL=(()=>{const g=new THREE.Group();const b=mesh(new THREE.BoxGeometry(10,4,6),mat('#FDE68A'));b.position.y=2;g.add(b);
  const r=mesh(new THREE.BoxGeometry(10.4,.4,6.4),mat('#F97316'));r.position.y=4.2;g.add(r);
  for(let i=-3;i<=3;i+=2){const w=mesh(new THREE.BoxGeometry(1.1,.9,.08),mat('#BFE3FF',{roughness:.15}));w.position.set(i,2.6,3.02);g.add(w)}
  const d=mesh(new THREE.BoxGeometry(1.4,2,.1),mat('#2563EB'));d.position.set(0,1,3.04);g.add(d);
  const lb=label('School 🏫','#2563EB','#FFFFFF',.6);lb.position.y=5.6;g.add(lb);g.position.set(CX+24,0,CZ+15);g.rotation.y=-Math.PI/2;rootify(g);g.userData.school=true;scene.add(g);
  const slide=mesh(new THREE.BoxGeometry(.9,.1,3.2),mat('#EF4444'));slide.position.set(CX+19,1,CZ+20.5);slide.rotation.x=.55;scene.add(slide);
  const lad=mesh(new THREE.BoxGeometry(.9,2,.15),mat('#3B82F6'));lad.position.set(CX+19,1,CZ+19);scene.add(lad);
  [[17,22],[20.5,22]].forEach(([x,z])=>{const p=mesh(new THREE.CylinderGeometry(.06,.06,2.2,6),mat('#6B7280'));p.position.set(CX+x,1.1,CZ+z);scene.add(p)});
  const bar=mesh(new THREE.CylinderGeometry(.06,.06,3.5,6),mat('#6B7280'));bar.rotation.z=Math.PI/2;bar.position.set(CX+18.75,2.2,CZ+22);scene.add(bar);return g})();
// bus stops (city + town)
const BUSSTOPS={};
function busStop(id,cx,cz,x,z,rot,name){const g=new THREE.Group();[-.9,.9].forEach(px=>{const p=mesh(new THREE.CylinderGeometry(.06,.06,2.4,6),mat('#9CA3AF'));p.position.set(px,1.2,-.4);g.add(p)});
  const roof=mesh(new THREE.BoxGeometry(2.4,.12,1.2),mat('#1D4ED8'));roof.position.set(0,2.45,0);g.add(roof);const back=mesh(new THREE.BoxGeometry(2.2,1.4,.06),mat('#BFE3FF',{transparent:true,opacity:.6}));back.position.set(0,1.3,-.45);g.add(back);
  const bench=mesh(new THREE.BoxGeometry(1.8,.12,.4),mat('#A47148'));bench.position.set(0,.5,-.2);g.add(bench);
  const lb=label('🚌 '+name,'#1D4ED8','#FFFFFF',.42);lb.position.y=3.1;g.add(lb);g.position.set(cx+x,0,cz+z);g.rotation.y=rot;rootify(g);g.userData.bus=id;scene.add(g);BUSSTOPS[id]=g;return g}
busStop('beach',CX,CZ,-12.5,-6,Math.PI/2,'Beach Stop');busStop('mall',CX,CZ,17,-6,-Math.PI/2,'Mall Stop');busStop('town',ZC.town[0],ZC.town[1],5.5,12.5,Math.PI,'Bus to Ashkelon');
(()=>{const w=label('Ashkelon 🌊','#0E8795','#FFFFFF',.8);w.position.set(CX-7,4.6,CZ-6);scene.add(w)})();
// land plots
const PLOTSC=[{id:'beach1',en:'Beach Villa',he:'וילה על החוף',x:-19.5,z:6,w:6,d:6,price:140},{id:'beach2',en:'Sea Breeze',he:'בריזה מהים',x:-19.5,z:15,w:6,d:6,price:120},
 {id:'center1',en:'Park Corner',he:'פינת הפארק',x:-3,z:-9,w:6,d:6,price:80},{id:'center2',en:'Sunny Street',he:'רחוב שמשי',x:5,z:-9,w:6,d:6,price:80},
 {id:'east1',en:'Quiet Lane',he:'סמטה שקטה',x:24,z:-1,w:6,d:5,price:60},{id:'east2',en:'Garden Lot',he:'מגרש עם גינה',x:24,z:6,w:6,d:5,price:40}];
const PLOTOBJ={};
PLOTSC.forEach(pl=>{const g=new THREE.Group();const gr=mesh(new THREE.BoxGeometry(pl.w,.05,pl.d),mat('#C7EBB8'),false);gr.position.y=.03;g.add(gr);
  [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([a,b])=>{const p=mesh(new THREE.CylinderGeometry(.07,.07,.6,6),mat('#FFFFFF'));p.position.set(a*pl.w/2,.3,b*pl.d/2);g.add(p)});
  g.position.set(CX+pl.x,0,CZ+pl.z);rootify(g);g.userData.plot=pl.id;scene.add(g);PLOTOBJ[pl.id]={g,sign:null,text:''}});
function plotOwner(id){if(P.plots.includes(id))return{me:true,name:P.name||'את/ה'};const p=NET.peers.find(x=>!x.sameTab&&Array.isArray((x.presence||{}).pl)&&x.presence.pl.includes(id));return p?{me:false,name:nameOf(p)}:null}
function updatePlotSigns(){PLOTSC.forEach(pl=>{const o=plotOwner(pl.id);const text=o?(o.me?'🏡 ':'')+o.name+"'s land":'For Sale · 💎'+pl.price;const po=PLOTOBJ[pl.id];if(po.text===text)return;
  if(po.sign)po.g.remove(po.sign);const s=label(text,o?(o.me?'#EE4F7C':'#1D2A48'):'#FFB41F',o?'#FFFFFF':'#5E3B00',.42);s.position.set(0,1.6,pl.d/2);s.userData.root=po.g;po.g.add(s);po.sign=s;po.text=text})}
const plotAt=(lx,lz)=>PLOTSC.find(pl=>Math.abs(lx-pl.x)<=pl.w/2&&Math.abs(lz-pl.z)<=pl.d/2);
// cars
const CARS=[];
function car(col,lane,dir,road,z0){const g=new THREE.Group();const body=mesh(new THREE.BoxGeometry(1.5,.6,2.6),mat(col));body.position.y=.5;g.add(body);
  const cab=mesh(new THREE.BoxGeometry(1.25,.5,1.3),mat('#BFE3FF',{roughness:.15}));cab.position.set(0,1.02,-.15);g.add(cab);
  [[-.75,.85],[.75,.85],[-.75,-.85],[.75,-.85]].forEach(([x,z])=>{const w=mesh(new THREE.CylinderGeometry(.28,.28,.2,12),mat('#111827'));w.rotation.z=Math.PI/2;w.position.set(x,.28,z);g.add(w)});
  g.position.set(CX+lane,0,CZ+z0);g.rotation.y=dir>0?0:Math.PI;scene.add(g);CARS.push({g,dir,cw:road===-10?CROSS[0].z:CROSS[1].z,speed:4+Math.random()*1.5})}
car('#EF4444',-11,1,-10,-20);car('#FACC15',-9,-1,-10,15);car('#3B82F6',13,1,14,0);car('#10B981',15,-1,14,-12);
// people walking in the street (game characters only)
const WALKERS=[];const WNAMES=['Lily','Ben','Omar','Sara','Max'];
const WPATHS=[[[-14,-12],[-14,23]],[[-7.3,-21],[-7.3,-3.3],[11.3,-3.3],[11.3,-21]],[[16.6,-22],[16.6,23]],[[-4.5,14],[6.5,14],[6.5,23],[-4.5,23]],[[-14.6,23],[-14.6,-12]]];
WPATHS.forEach((path,i)=>{const girl=i%2===1||i===4;const ch=Object.assign(humanCh(girl?'girl':'boy'),{skin:SKINS[(i*2+1)%SKINS.length][0],hair:pick(Object.keys(HAIRS).filter(k=>HAIRS[k][2]===(girl?'girl':'boy'))),hc:HAIRC[(i*3)%HAIRC.length][0],top:COLORS[(i*2+1)%COLORS.length][0],eyes:pick(['big','happy'])});
  const g=avatar3D(ch);const lb=label(WNAMES[i],'#FFFFFF','#1D2A48',.36);lb.position.y=g.userData.h+.3;g.add(lb);g.position.set(CX+path[0][0],0,CZ+path[0][1]);rootify(g);g.userData.walker=i;scene.add(g);WALKERS.push({g,path,i:1,ch,name:WNAMES[i],pause:0})});
const ANCHORS={beach:[-19,0],marina:[-19,-18],'national park':[1,18],mall:[17,-14],school:[19,15]};
const CITY_CHESTS=[[-1,20.5],[6,16.5],[-12.5,14],[18.5,-3],[9,-20],[-4,-21],[8.5,6],[-6,6]];
const SAFETY=[
 ['The light is red. What do you do?','I stop and wait for the green light.','I run across very fast.','I close my eyes and go.','הרמזור אדום. מה עושים?','עוצרים ומחכים לאור ירוק.'],
 ['Where is the best place to cross the street?','At the crosswalk, with a grown-up if I can.','Between two parked cars.','Anywhere, if I am quick.','איפה הכי טוב לחצות את הכביש?','במעבר חצייה, ועם מבוגר אם אפשר.'],
 ['Before you cross, what do you do?','I look left, right, and left again.','I look at my phone.','I just start walking.','מה עושים לפני שחוצים?','מסתכלים שמאלה, ימינה ושוב שמאלה.'],
 ['A stranger in a car asks you to come with him. What do you do?','I say NO, walk away fast, and tell a grown-up I trust.','I get in the car to be polite.','I go with him if he has candy.','זר ברכב מבקש שתבוא/י איתו. מה עושים?','אומרים לא, מתרחקים מהר ומספרים למבוגר שסומכים עליו.'],
 ['You are lost in the mall. What do you do?','I stay calm and ask a security guard or a cashier for help.','I leave the mall alone.','I hide in a store.','הלכת לאיבוד בקניון. מה עושים?','נשארים רגועים ומבקשים עזרה ממאבטח או מקופאי/ת.'],
 ['Someone online asks for your address. What do you do?','I do not tell, and I tell my parents.','I send it to be friendly.','I send a photo of my house.','מישהו ברשת מבקש את הכתובת שלך. מה עושים?','לא מגלים, ומספרים להורים.'],
 ['You are at the beach. Where do you swim?','Only where the lifeguard can see me.','Far away, where nobody is.','At night, when it is quiet.','איפה שוחים בחוף?','רק במקום שהמציל/ה רואה אותי.'],
 ['You ride your bike. What do you wear?','I wear a helmet.','I wear sunglasses only.','Nothing special.','רוכבים על אופניים. מה לובשים?','קסדה!']].map(([npc,c,w1,w2,hn,hc])=>({npc,c,w:[w1,w2],hn,hc}));
function qSafety(){const d=pick(SAFETY);return{type:'choice',skill:'talk',talk:true,sayFirst:d.npc,one:true,
  prompt:`<div class="bubble" style="width:100%;text-align:start">${en(d.npc)}</div><div class="row" style="justify-content:center"><button class="spk" data-a="sayq">🔊</button><button class="btn ghost mini" data-a="hint">💡</button></div><div class="hint" id="hintTxt" hidden>${esc(d.hn)}</div>`,
  opts:shuffle([d.c,...d.w]).map(x=>({html:en(x),val:x})),ans:d.c,sayAfter:d.c,showAns:d.c,heAns:d.hc}}
