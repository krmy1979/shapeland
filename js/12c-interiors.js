/* Shapeland · a world by Shirel Yitzhak */
/* ===================== GOING INSIDE BUILDINGS ===================== */
/* every thing inside has its English name on it. Touch it to hear the word. */
let INSIDE=null,INROOM=null,INPICK=[];
function safeClone(o){const st=[];o.traverse(x=>{st.push([x,x.userData]);x.userData={}});let c;try{c=o.clone(true)}finally{st.forEach(([x,u])=>x.userData=u)}return c}
function pb(g,w,h,d,c,x,y,z,o){const m=mesh(new THREE.BoxGeometry(w,h,d),mat(c,o));m.position.set(x,y,z);g.add(m);return m}
function pc(g,rt,rb,h,c,x,y,z,seg,o){const m=mesh(new THREE.CylinderGeometry(rt,rb,h,seg||14),mat(c,o));m.position.set(x,y,z);g.add(m);return m}
function ps(g,r,c,x,y,z,o){const m=mesh(new THREE.SphereGeometry(r,14,10),mat(c,o));m.position.set(x,y,z);g.add(m);return m}
const PROPS={
  shelf:(g,c)=>{pb(g,2,2,.5,c||'#C9A27E',0,1,-.05);[.45,1.05,1.65].forEach((y,i)=>{for(let k=0;k<5;k++)pb(g,.28,.38,.3,['#F87171','#FBBF24','#34D399','#60A5FA','#F472B6'][(k+i)%5],-.75+k*.38,y+.2,.08)})},
  fridge:g=>{pb(g,.95,2,.8,'#F1F5F9',0,1,0);pb(g,.04,.5,.06,'#94A3B8',.35,1.3,.42);pb(g,.9,.03,.02,'#CBD5E1',0,1.35,.41)},
  oven:g=>{pb(g,1.1,1,.85,'#334155',0,.5,0);pb(g,.7,.4,.02,'#F59E0B',0,.5,.43,{emissive:'#7C2D12'});[-.3,.3].forEach(x=>pc(g,.12,.12,.04,'#111827',x,1.02,0))},
  counter:(g,c)=>{pb(g,2.6,1,.8,c||'#B07A4A',0,.5,0);pb(g,2.7,.08,.9,'#F5F0E6',0,1.04,0)},
  register:g=>{pb(g,.5,.3,.4,'#1F2937',0,.15,0);pb(g,.4,.2,.05,'#86EFAC',0,.4,-.1)},
  table:(g,c)=>{pc(g,.75,.75,.08,c||'#C9A27E',0,.75,0,24);pc(g,.08,.1,.75,'#6B4F3A',0,.37,0)},
  chair:(g,c)=>{pb(g,.5,.08,.5,c||'#F59E0B',0,.48,0);pb(g,.5,.55,.08,c||'#F59E0B',0,.78,-.21);[[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]].forEach(([x,z])=>pb(g,.06,.46,.06,'#6B4F3A',x,.23,z))},
  sofa:(g,c)=>{pb(g,2,.45,.9,c||'#A78BFA',0,.3,0);pb(g,2,.6,.25,c||'#A78BFA',0,.75,-.33);[-1,1].forEach(s=>pb(g,.25,.6,.9,c||'#A78BFA',s*.95,.45,0))},
  bed:g=>{pb(g,1.6,.4,2.2,'#C9A27E',0,.25,0);pb(g,1.5,.15,2,'#FBCFE8',0,.5,.05);pb(g,1.1,.2,.4,'#FFFFFF',0,.62,-.75);pb(g,1.6,1,.1,'#C9A27E',0,.6,-1.1)},
  lamp:g=>{pc(g,.25,.3,.06,'#334155',0,.03,0);pc(g,.03,.03,1.5,'#334155',0,.78,0);pc(g,.18,.38,.4,'#FDE68A',0,1.6,0,16,{emissive:'#FDE68A',emissiveIntensity:.3})},
  plant:g=>{pc(g,.25,.2,.45,'#C2410C',0,.22,0);ps(g,.45,'#22C55E',0,.8,0);ps(g,.3,'#16A34A',.25,1.05,.1)},
  mirror:g=>{pb(g,1,1.9,.08,'#FDE68A',0,1.2,0);pb(g,.85,1.75,.02,'#CFE8FF',0,1.2,.05,{roughness:.1,emissive:'#9CC9F5',emissiveIntensity:.3})},
  rack:(g,c)=>{pc(g,.03,.03,1.8,'#9CA3AF',-.9,.9,0);pc(g,.03,.03,1.8,'#9CA3AF',.9,.9,0);const b=pc(g,.03,.03,1.8,'#9CA3AF',0,1.75,0);b.rotation.z=Math.PI/2;
    ['#F472B6','#60A5FA','#FBBF24','#34D399'].forEach((cc,i)=>{pb(g,.4,.6,.1,c||cc,-.6+i*.4,1.35,0)})},
  dress:(g,c)=>{pc(g,.05,.38,1,c||'#F472B6',0,.95,0,16);pc(g,.14,.2,.4,c||'#F472B6',0,1.6,0);ps(g,.13,'#F5F0E6',0,1.95,0);pc(g,.03,.03,.5,'#9CA3AF',0,.25,0)},
  shoes:g=>{[-.18,.18].forEach(x=>{const s=ps(g,.16,'#EF4444',x,.7,0);s.scale.set(1,.6,1.8)});pb(g,.9,.6,.5,'#E5E7EB',0,.3,0)},
  cake:g=>{pc(g,.45,.45,.3,'#FBCFE8',0,1.2,0,20);pc(g,.32,.32,.25,'#FFFFFF',0,1.47,0,20);ps(g,.07,'#EF4444',0,1.65,0)},
  bread:g=>{const b=ps(g,.22,'#C08A4A',0,1.2,0);b.scale.set(1.8,.8,1)},
  croissant:g=>{const t=mesh(new THREE.TorusGeometry(.18,.09,8,14,Math.PI*1.3),mat('#D9A15B'));t.position.y=1.15;t.rotation.x=Math.PI/2;g.add(t)},
  tank:g=>{pb(g,1.6,.9,.6,'#7DD3FC',0,1.05,0,{transparent:true,opacity:.55});pb(g,1.7,.6,.7,'#334155',0,.3,0);[[-.4,1],[.3,1.15],[0,.9]].forEach(([x,y],i)=>{const f=mesh(new THREE.ConeGeometry(.08,.22,6),mat(['#F97316','#FDE047','#F472B6'][i]));f.rotation.z=Math.PI/2;f.position.set(x,y,0);g.add(f)})},
  cage:g=>{pc(g,.45,.45,1,'#FDE68A',0,1.1,0,16,{transparent:true,opacity:.35});pc(g,.5,.5,.06,'#B45309',0,.6,0);ps(g,.14,'#38BDF8',0,1,0);pc(g,.05,.05,.6,'#6B4F3A',0,.3,0)},
  doghouse:g=>{pb(g,1,.8,1,'#F59E0B',0,.4,0);const r=mesh(new THREE.ConeGeometry(.85,.5,4),mat('#B45309'));r.rotation.y=Math.PI/4;r.position.y=1.05;g.add(r);pb(g,.4,.45,.02,'#111827',0,.3,.51)},
  fruit:g=>{pb(g,1.4,.8,.7,'#B07A4A',0,.4,0);for(let i=0;i<8;i++)ps(g,.12,['#EF4444','#FBBF24','#84CC16'][i%3],-.5+(i%4)*.33,.92,-.15+Math.floor(i/4)*.3)},
  milk:g=>{pb(g,.3,.55,.3,'#FFFFFF',0,1.2,0);pb(g,.31,.15,.31,'#3B82F6',0,1.42,0)},
  safe:g=>{pb(g,1.2,1.4,1,'#475569',0,.7,0);pc(g,.18,.18,.06,'#FBBF24',.2,.8,.52,16).rotation.x=Math.PI/2},
  coins:g=>{for(let i=0;i<4;i++)pc(g,.18,.18,.06,'#FBBF24',-.3+(i%2)*.4,1.08+Math.floor(i/2)*.07,0,16,{metalness:.6,roughness:.3})},
  painting:(g,c)=>{pb(g,1.5,1,.06,'#B45309',0,1.8,0);pb(g,1.3,.8,.02,c||'#93C5FD',0,1.8,.04);ps(g,.15,'#FDE047',.35,2,.05)},
  sink:g=>{pb(g,1,.9,.6,'#E5E7EB',0,.45,0);pc(g,.3,.25,.12,'#BFDBFE',0,.88,0);pc(g,.03,.03,.3,'#94A3B8',0,1.05,-.2)},
  salonchair:g=>{pc(g,.3,.4,.1,'#334155',0,.05,0);pc(g,.06,.06,.4,'#94A3B8',0,.3,0);pb(g,.7,.15,.6,'#EC4899',0,.55,0);pb(g,.7,.8,.15,'#EC4899',0,1,-.25)},
  dryer:g=>{pc(g,.06,.06,1.3,'#94A3B8',0,.65,0);const h=mesh(new THREE.SphereGeometry(.35,16,10,0,Math.PI*2,0,Math.PI/2),mat('#F9A8D4'));h.rotation.x=Math.PI;h.position.y=1.6;g.add(h)},
  vanity:g=>{pb(g,1.6,.8,.6,'#FFFFFF',0,.4,0);pb(g,1.3,1,.06,'#CFE8FF',0,1.4,-.25,{roughness:.1,emissive:'#9CC9F5',emissiveIntensity:.3});for(let i=0;i<5;i++)ps(g,.06,'#FEF9C3',-.6+i*.3,1.95,-.22,{emissive:'#FDE68A',emissiveIntensity:.5})},
  lipstick:(g,c)=>{pc(g,.07,.07,.25,'#FBBF24',0,1,0);pc(g,.05,.06,.14,c||'#E11D48',0,1.18,0)},
  perfume:g=>{const b=ps(g,.15,'#F0ABFC',0,1,0,{transparent:true,opacity:.8});b.scale.set(1,1.2,.8);pc(g,.04,.04,.1,'#FBBF24',0,1.22,0)},
  nailpolish:g=>{pb(g,.12,.16,.12,'#F43F5E',0,.98,0);pc(g,.03,.03,.14,'#111827',0,1.13,0)},
  dumbbell:g=>{const b=pc(g,.04,.04,.7,'#94A3B8',0,.2,0);b.rotation.z=Math.PI/2;[-.35,.35].forEach(x=>{const w=pc(g,.16,.16,.12,'#1F2937',x,.2,0);w.rotation.z=Math.PI/2})},
  wbench:g=>{pb(g,.45,.12,1.5,'#1E3A8A',0,.5,0);pb(g,.1,.45,.1,'#334155',0,.25,.5);pb(g,.1,.45,.1,'#334155',0,.25,-.5);[-.7,.7].forEach(x=>pc(g,.03,.03,1.2,'#94A3B8',x,.6,-.6))},
  treadmill:g=>{pb(g,.8,.15,1.8,'#1F2937',0,.1,0);[-.38,.38].forEach(x=>pc(g,.03,.03,1.1,'#94A3B8',x,.65,-.75));pb(g,.85,.25,.12,'#334155',0,1.25,-.8)},
  ball:(g,c)=>ps(g,.25,c||'#F97316',0,.25,0),
  scooter:(g,c)=>{pb(g,.2,.05,.9,c||'#06B6D4',0,.12,0);pc(g,.025,.025,.9,'#334155',0,.55,.4);const h=pc(g,.025,.025,.5,'#334155',0,1,.4);h.rotation.z=Math.PI/2;[-.4,.42].forEach(z=>{const w=pc(g,.08,.08,.05,'#111827',0,.08,z,12);w.rotation.z=Math.PI/2})},
  skateboard:(g,c)=>{pb(g,.25,.04,.85,c||'#F59E0B',0,.12,0);[-.3,.3].forEach(z=>[-.09,.09].forEach(x=>{const w=pc(g,.04,.04,.04,'#FDE047',x,.06,z,10);w.rotation.z=Math.PI/2}))},
  helmet:(g,c)=>{const h=mesh(new THREE.SphereGeometry(.28,16,10,0,Math.PI*2,0,Math.PI/2),mat(c||'#EF4444'));h.position.y=1.05;g.add(h);pb(g,.7,1,.5,'#E5E7EB',0,.5,0)},
  bike:g=>{[-.5,.5].forEach(z=>{const w=mesh(new THREE.TorusGeometry(.32,.04,6,18),mat('#111827'));w.rotation.y=Math.PI/2;w.position.set(0,.35,z);g.add(w)});const f=pc(g,.03,.03,1,'#22C55E',0,.6,0);f.rotation.x=Math.PI/2;pc(g,.03,.03,.5,'#22C55E',0,.8,.45)},
  toolbox:g=>{pb(g,.7,.35,.35,'#DC2626',0,.95,0);pb(g,.4,.05,.05,'#111827',0,1.2,0)},
  pegboard:g=>{pb(g,2.2,1.4,.06,'#D6B98C',0,1.6,0)},
  hammer:g=>{pb(g,.05,.45,.05,'#B45309',0,1.55,.06);pb(g,.25,.09,.09,'#475569',0,1.8,.06)},
  saw:g=>{pb(g,.5,.18,.02,'#CBD5E1',0,1.6,.06);pb(g,.14,.18,.06,'#DC2626',-.3,1.6,.06)},
  wrench:g=>{pb(g,.06,.45,.03,'#94A3B8',0,1.6,.06);const t=mesh(new THREE.TorusGeometry(.07,.025,6,12,Math.PI*1.5),mat('#94A3B8'));t.position.set(0,1.86,.06);g.add(t)},
  drill:g=>{pb(g,.35,.15,.12,'#F59E0B',0,1.7,.06);pb(g,.1,.25,.1,'#111827',-.08,1.52,.06);pc(g,.02,.02,.2,'#94A3B8',.27,1.7,.06).rotation.z=Math.PI/2},
  workbench:g=>{pb(g,2.2,.1,1,'#B07A4A',0,.9,0);[[-1,-.4],[1,-.4],[-1,.4],[1,.4]].forEach(([x,z])=>pb(g,.1,.9,.1,'#6B4F3A',x,.45,z))},
  books:g=>{pb(g,1.8,2,.45,'#92400E',0,1,0);for(let r=0;r<3;r++)for(let k=0;k<7;k++)pb(g,.18,.4,.3,['#EF4444','#3B82F6','#22C55E','#EAB308','#A855F7'][(k+r)%5],-.6+k*.2,.45+r*.6,.05)},
  tv:g=>{pb(g,1.4,.85,.08,'#111827',0,1.5,0);pb(g,1.3,.75,.02,'#38BDF8',0,1.5,.05,{emissive:'#0EA5E9',emissiveIntensity:.25});pb(g,1.2,.5,.4,'#B07A4A',0,.25,0)},
  carpet:(g,c)=>{pc(g,1.3,1.3,.03,c||'#F472B6',0,.02,0,28)},
  icecream:g=>{pb(g,1.6,1,.8,'#FFFFFF',0,.5,0);['#FBCFE8','#FDE68A','#A7F3D0','#C4B5FD'].forEach((c,i)=>pc(g,.16,.16,.08,c,-.55+i*.37,1.04,0,14))},
  popcorn:g=>{pb(g,.6,.8,.5,'#EF4444',0,1.4,0);for(let i=0;i<6;i++)ps(g,.1,'#FEF3C7',-.2+(i%3)*.2,1.85,-.05+Math.floor(i/2)*.05)},
  toy:g=>{ps(g,.3,'#C08A4A',0,.9,0);[-.2,.2].forEach(x=>ps(g,.1,'#C08A4A',x,1.15,0));ps(g,.22,'#C08A4A',0,.5,0);pb(g,.9,.3,.6,'#E5E7EB',0,.15,0)}
};
/* he = Hebrew meaning shown in the toast; on screen and in voice it is English only */
const HE={shelf:'מדף',fridge:'מקרר',oven:'תנור',counter:'דלפק',register:'קופה',table:'שולחן',chair:'כיסא',sofa:'ספה',bed:'מיטה',lamp:'מנורה',plant:'עציץ',mirror:'מראה',rack:'מתלה',dress:'שמלה',shoes:'נעליים',cake:'עוגה',bread:'לחם',
  croissant:'קרואסון',tank:'אקווריום',cage:'כלוב',doghouse:'מלונה',fruit:'פירות',milk:'חלב',safe:'כספת',coins:'מטבעות',painting:'ציור',sink:'כיור',salonchair:'כיסא מספרה',dryer:'פן',vanity:'שולחן איפור',lipstick:'שפתון',perfume:'בושם',
  nailpolish:'לק',dumbbell:'משקולת',wbench:'ספסל משקולות',treadmill:'הליכון',ball:'כדור',scooter:'קורקינט',skateboard:'סקייטבורד',helmet:'קסדה',bike:'אופניים',toolbox:'ארגז כלים',hammer:'פטיש',saw:'מסור',wrench:'מפתח ברגים',drill:'מקדחה',
  workbench:'שולחן עבודה',books:'ספרים',tv:'טלוויזיה',carpet:'שטיח',icecream:'גלידה',popcorn:'פופקורן',toy:'דובי',pegboard:'לוח כלים'};
const PNAME={salonchair:'salon chair',dryer:'hair dryer',vanity:'makeup table',nailpolish:'nail polish',wbench:'weight bench',tank:'fish tank',cage:'bird cage',fruit:'fruit',coins:'coins',toolbox:'toolbox',workbench:'workbench',icecream:'ice cream',tv:'TV',toy:'teddy bear',pegboard:'tool wall',register:'cash register'};
/* rooms: wall, floor, host (x,z,ch,name,line,act), props [kind, x, z, rotY, color] */
const SHOPS_IN={
 furniture:{en:'Furniture Store',wall:'#FEF3C7',floor:'#D6B98C',host:{name:'Mr. Wood',ch:{g:'boy',hair:'side',hc:'#8A5530',top:'#B45309',bot:'pants',bc:'#3B4A75'},line:'Welcome! Look around. Touch anything to learn its name.',act:()=>openStore('furniture')},
  props:[['sofa',-4.5,-3.5],['table',-1.5,-1.5],['chair',-.5,-1.5,-1.5],['bed',4.5,-3],['lamp',2.4,-4],['plant',6.3,-4.3],['shelf',-6.3,-4.4],['carpet',-1.5,-1.5],['tv',-1.5,-4.7]]},
 clothes:{en:'Clothes Shop',wall:'#FCE7F3',floor:'#FFFFFF',host:{name:'Rosa',ch:{g:'girl',hair:'wavy',hc:'#1F1B1A',top:'#F472B6',bot:'skirt',bc:'#1D2A48'},line:'Hello! Do you like our new clothes?',act:()=>openStore('clothes')},
  props:[['rack',-4.5,-4],['rack',-1,-4,0,'#A78BFA'],['dress',2.5,-4],['dress',4,-4,0,'#60A5FA'],['mirror',6.5,-2,-Math.PI/2],['shoes',-6.2,-1,Math.PI/2]]},
 pets:{en:'Pet Shop',wall:'#DCFCE7',floor:'#E7E5E4',host:{name:'Noa',ch:{g:'girl',hair:'ponytail',hc:'#E8C268',top:'#34D399',bot:'pants',bc:'#4F7CC2'},line:'Hi! Our animals need a home. Look at the fish!',act:()=>openStore('pets')},
  props:[['tank',-4,-4.3],['cage',-.5,-4.3],['doghouse',3,-3.8],['ball',4.5,-2,0,'#EF4444'],['plant',6.3,-4.3]]},
 market:{en:'Market',wall:'#DBEAFE',floor:'#F1F5F9',host:{name:'Mrs. Kim',ch:{g:'girl',hair:'bun',hc:'#1F1B1A',top:'#60A5FA',bot:'dress',bc:'#60A5FA'},line:'Welcome to the market! We have fruit, milk and bread.',act:()=>openMarket()},
  props:[['shelf',-4.5,-4.4],['shelf',-1.8,-4.4,0,'#E5E7EB'],['fridge',1.2,-4.4],['fridge',2.3,-4.4],['fruit',5,-3.5],['milk',5,-1.6],['bread',5.5,-1.6]]},
 bakery:{en:'Bakery',wall:'#FFEDD5',floor:'#E7D3B8',host:{name:'Baker Ben',ch:{g:'boy',hair:'short',hc:'#4A2E1F',top:'#FFFFFF',bot:'pants',bc:'#B45309'},line:'Mmm! Smell the fresh bread. Do you want to work in the bakery?',act:()=>openJob('baker')},
  props:[['oven',-4.5,-4.3],['oven',-3.2,-4.3],['table',1.5,-2],['cake',1.5,-2],['bread',-1,-1.6],['table',-1,-1.6],['croissant',3.6,-1.6],['table',3.6,-1.6],['shelf',5.5,-4.4,0,'#FDBA74']]},
 bank:{en:'Bear Bank',wall:'#EDE9FE',floor:'#E5E7EB',host:{name:'Mr. Bear',bear:true,line:'Welcome to Bear Bank! Save your gems and they grow.',act:()=>openBank(true)},
  props:[['safe',-5,-4.3],['coins',-1,-1.6],['table',-1,-1.6,0,'#E5E7EB'],['painting',3,-4.9,0,'#C4B5FD'],['plant',6.3,-4.3],['chair',3.5,-1.5]]},
 mall:{en:'Ashkelon Mall',wall:'#E0E7FF',floor:'#F8FAFC',host:{name:'Info Desk',ch:{g:'girl',hair:'bob',hc:'#8A5530',top:'#EE4F7C',bot:'pants',bc:'#1D2A48'},line:'Welcome to Ashkelon Mall! Meet your friends here.',act:()=>openMall()},
  props:[['icecream',-4.5,-4.2],['popcorn',-1.5,-4.4],['toy',1.3,-4.2],['shoes',4,-4.2],['plant',6.3,-4.3],['carpet',0,0,0,'#C7D2FE'],['tv',6.4,-1,-Math.PI/2]],wide:true},
 salon:{en:'Beauty Salon',wall:'#FCE7F3',floor:'#FFFFFF',host:{name:'Lily',ch:{g:'girl',hair:'curly',hc:'#FF7EB6',top:'#EC4899',bot:'skirt',bc:'#FFFFFF'},line:'Hi! Do you want a new hairstyle? I can teach you!',act:()=>openSalon()},
  props:[['salonchair',-4.5,-3],['mirror',-4.5,-4.85],['salonchair',-1.5,-3],['mirror',-1.5,-4.85],['dryer',1.8,-4],['sink',4.2,-4.3],['shelf',6.4,-2,-Math.PI/2,'#F9A8D4']]},
 makeup:{en:'Makeup Studio',wall:'#FAE8FF',floor:'#FDF4FF',host:{name:'Bella Rose',ch:{g:'girl',hair:'long',hc:'#E8C268',top:'#C026D3',bot:'dress',bc:'#C026D3',lip:'#E11D48',lash:1},line:'Welcome to the Makeup Studio! Want a makeup lesson?',act:()=>openMakeup()},
  props:[['vanity',-4,-4.4],['lipstick',-1,-1.6,0,'#E11D48'],['perfume',-.4,-1.6],['nailpolish',.2,-1.6],['table',-.4,-1.6,0,'#FFFFFF'],['mirror',3,-4.85],['plant',6.3,-4.3]]},
 boutique:{en:'Fashion Boutique',wall:'#FFE4E6',floor:'#FFFFFF',host:{name:'Maya',ch:{g:'girl',hair:'braids',hc:'#4A2E1F',skin:'#9A6440',top:'#E11D48',bot:'skirt',bc:'#FBCFE8'},line:'Hello! Everything here is so pretty. Take a look!',act:()=>openStore('clothes')},
  props:[['dress',-5,-4],['dress',-3.6,-4,0,'#A855F7'],['dress',-2.2,-4,0,'#FDE047'],['rack',1.5,-4.2],['shoes',4.5,-4],['mirror',6.5,-2,-Math.PI/2]]},
 gym:{en:'Power Gym',wall:'#DBEAFE',floor:'#94A3B8',host:{name:'Coach Max',ch:{g:'boy',hair:'buzz',hc:'#1F1B1A',skin:'#C68657',top:'#1E3A8A',bot:'shorts',bc:'#111827'},line:'Hey champ! Ready to get strong? Let us work out!',act:()=>openGym()},
  props:[['treadmill',-5,-3.5],['treadmill',-3.4,-3.5],['wbench',-.5,-3.5],['dumbbell',1.6,-2.2],['dumbbell',2.4,-2.2],['ball',4,-2,0,'#F97316'],['mirror',4.5,-4.85]]},
 rides:{en:'Scooter Shop',wall:'#CFFAFE',floor:'#E2E8F0',host:{name:'Zack',ch:{g:'boy',hair:'messy',hc:'#C8562A',top:'#0E7490',bot:'pants',bc:'#1D2A48',hat:'cap'},line:'Yo! Want something fast? We have scooters and skateboards!',act:()=>openRides()},
  props:[['scooter',-4.5,-3.5],['scooter',-3.5,-3.5,0,'#EC4899'],['skateboard',-1.5,-3.5],['bike',1.5,-3.5,Math.PI/2],['helmet',4.5,-4,0,'#EF4444'],['helmet',5.6,-4,0,'#3B82F6']]},
 tools:{en:'Tools Workshop',wall:'#E2E8F0',floor:'#D6B98C',host:{name:'Mr. Fix',ch:{g:'boy',hair:'short',hc:'#4A2E1F',skin:'#E3A97F',top:'#1D4ED8',bot:'pants',bc:'#334155',hat:'cap'},line:'Hello! I fix things. Do you want to help me today?',act:()=>openTools()},
  props:[['pegboard',-2,-4.95],['hammer',-2.8,-4.9],['saw',-2,-4.9],['wrench',-1.3,-4.9],['drill',-.6,-4.9],['workbench',-2,-3.6],['toolbox',-2,-3.6],['shelf',4.5,-4.4,0,'#94A3B8']]}};
function roomProp(kind,col){const g=new THREE.Group();(PROPS[kind]||PROPS.plant)(g,col);return g}
function buildRoom(id){if(INROOM){scene.remove(INROOM);INROOM=null}INPICK=[];const R0=SHOPS_IN[id];const[cx,cz]=ZC.inside;const g=new THREE.Group();g.position.set(cx,0,cz);
  const W=R0.wide?18:15,D=11;const fl=mesh(new THREE.BoxGeometry(W,.3,D),mat(R0.floor));fl.position.set(0,-.15,0);g.add(fl);INPICK.push(fl);
  for(let i=-W/2+1;i<W/2;i+=2){const t=mesh(new THREE.BoxGeometry(.04,.01,D),mat(shade(R0.floor,-.06)));t.position.set(i,.01,0);g.add(t)}
  const back=mesh(new THREE.BoxGeometry(W,4,.3),mat(shade(R0.wall,-.1)));back.position.set(0,2,-D/2);g.add(back);
  [-1,1].forEach(s=>{const w=mesh(new THREE.BoxGeometry(.3,4,D),mat(shade(R0.wall,-.15)));w.position.set(s*W/2,2,0);g.add(w)});
  const tl=label(R0.en,'#FFFFFF','#1D2A48',.6);tl.position.set(0,4.5,-D/2);g.add(tl);
  R0.props.forEach(pr=>{const[k,x,z,r,c]=pr;const p=roomProp(k,c);p.position.set(x,0,z);p.rotation.y=r||0;const nm=pr.word||PNAME[k]||k;const lb=label(nm,'#FFFFFF','#1D2A48',.32);
    const bb=new THREE.Box3().setFromObject(p);lb.position.y=Math.max(1.2,bb.max.y+.35);p.add(lb);rootify(p);p.userData.zact=()=>sayWord(nm,(typeof CAVE_HE!=='undefined'&&CAVE_HE[nm])||HE[k]||'');g.add(p);INPICK.push(p)});
  const hz=R0.host;let hostObj;if(hz.bear){hostObj=safeClone(NPCOBJ.bear);hostObj.position.set(0,0,0);hostObj.rotation.set(0,0,0)}else hostObj=human3D(Object.assign({kind:'human',eyes:'big'},hz.ch));
  if(!hz.bear){const hl=label(hz.name,'#EE4F7C','#FFFFFF',.42);hl.position.y=2.4;hostObj.add(hl);const mk=marker('!','#EE4F7C');mk.position.y=3;hostObj.add(mk)}hostObj.position.set(3.5,0,-1);hostObj.lookAt(3.5,0,4);
  pb(g,2.4,1,.7,'#FFFFFF',3.5,.5,.2);rootify(hostObj);hostObj.userData.zact=()=>{say(hz.line);hz.act()};hostObj.userData.talker=hz.name;g.add(hostObj);INPICK.push(hostObj);
  const ex=new THREE.Group();const mt=mesh(new THREE.BoxGeometry(2.2,.05,1.1),mat('#16A34A'));mt.position.y=.03;ex.add(mt);const el=label('EXIT 🚪','#16A34A','#FFFFFF',.45);el.position.y=1.2;ex.add(el);
  ex.position.set(0,0,D/2-.7);rootify(ex);ex.userData.zact=()=>leaveBuilding();g.add(ex);INPICK.push(ex);scene.add(g);INROOM=g;INROOM.userData.D=D;INROOM.userData.W=W}
function sayWord(w,he){say(w);toast(`🔊 ${w}${he?' · '+he:''}`);if(!P.learned[w])addXp(1);P.learned[w]=(P.learned[w]||0)+1;save()}
function enterBuilding(id){if(!SHOPS_IN[id]){openBuilding(id);return}const d=DOORS.find(x=>x.id===id);INSIDE={id,zone:d?d.zone:ME.zone,ox:d?d.ox:ME.pos.x,oz:d?d.oz:ME.pos.z};
  buildRoom(id);teleport('inside',[0,3.6]);sfx.door();const R0=SHOPS_IN[id];setTimeout(()=>say(R0.host.line),400);toast(`🚪 ${R0.en} · נוגעים בדברים כדי לשמוע איך קוראים להם`)}
function leaveBuilding(){if(!INSIDE)return;const o=INSIDE;INSIDE=null;const[cx,cz]=ZC[o.zone];teleport(o.zone,[o.ox-cx,o.oz-cz]);sfx.door();if(INROOM){scene.remove(INROOM);INROOM=null;INPICK=[]}}
function insideWalkable(pt){if(!INROOM)return false;const[cx,cz]=ZC.inside;const W=INROOM.userData.W,D=INROOM.userData.D;return Math.abs(pt.x-cx)<W/2-.6&&pt.z-cz>-D/2+.6&&pt.z-cz<D/2-.3}
function checkDoors(){if(ME.zone==='inside'){if(INROOM&&ME.pos.z-ZC.inside[1]>INROOM.userData.D/2-.5)leaveBuilding();return}
  for(const d of DOORS){if(d.zone!==ME.zone)continue;if(Math.hypot(ME.pos.x-d.x,ME.pos.z-d.z)<.8){if(d.lock&&d.lock()){if(!d.warned||performance.now()-d.warned>4000){d.warned=performance.now();toast('🔒 הדלת נעולה. 🦉 הינשוף החכם יודע איך לפתוח');say('The door is locked.')}return}enterBuilding(d.id);return}}}
