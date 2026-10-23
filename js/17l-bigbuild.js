/* Shapeland · a world by Shirel Yitzhak */
/* ===================== BIG BUILDING: draw a whole room, a wall, a floor or a roof with one finger =====================
   Press on the ground, drag, let go → it is built. Height is one tap (1–6 m) and also changes what you just built.
   Pieces are stored like any shape, with the size in the shape key:
   br_W_D_H_S = room (4 walls, door on side S) · bw/bd/bn_L_H = wall (plain / door / window) · bp_H = pillar · bf_W_D = floor or roof */
const BIGRE=/^b([wpfdnr])_(\d{1,2})(?:_(\d{1,2}))?(?:_(\d{1,2}))?(?:_(\d))?$/;
function bigDims(k){const m=typeof k==='string'&&BIGRE.exec(k);if(!m)return null;const t=m[1],a=+m[2],b=+(m[3]||0),c=+(m[4]||0),s=m[5]===undefined?-1:+m[5];
  if(t==='r'&&a>=2&&a<=12&&b>=2&&b<=12&&c>=2&&c<=6&&s>=0&&s<=3)return{t:'room',W:a,D:b,H:c,S:s,area:2*(a+b)*c,h:c,sx:a+.3,sz:b+.3};
  if(m[4]!==undefined)return null;
  if('wdn'.includes(t)&&a>=(t==='w'?1:2)&&a<=12&&b>=(t==='w'?1:2)&&b<=6)return{t:'wall',v:t,L:a,H:b,area:a*b,h:b,sx:a+.3,sz:.3};
  if(t==='p'&&a>=1&&a<=8&&!m[3])return{t:'pillar',H:a,area:a,h:a,sx:.5,sz:.5};
  if(t==='f'&&a>=1&&a<=12&&b>=1&&b<=12)return{t:'floor',W:a,D:b,area:a*b,h:.25,sx:a+.3,sz:b+.3};return null}
const T_=.3,DOORH=1.8,DOORW=1;

/* ---------- shapes: a few boxes merged into one piece ---------- */
function mergeBoxes(parts){const pos=[],nor=[],uv=[],idx=[];let off=0;for(const[w,h,d,x,y,z]of parts){if(w<=.01||h<=.01||d<=.01)continue;const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);
  const P_=g.attributes.position.array;pos.push(...P_);nor.push(...g.attributes.normal.array);uv.push(...g.attributes.uv.array);for(const i of g.index.array)idx.push(i+off);off+=P_.length/3;g.dispose()}
  const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));G.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));G.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));G.setIndex(idx);return G}
/* one straight wall segment (along x when ax==='x'), optionally with a door or window in the middle → boxes + solid footprints */
function segParts(len,H,ax,cx,cz,hole){const y0=-H/2,box=(l,h,y,o)=>ax==='x'?[l,h,T_,cx+o,y,cz]:[T_,h,l,cx,y,cz+o],rect=(l,o)=>ax==='x'?[cx+o,cz,l/2,T_/2]:[cx,cz+o,T_/2,l/2];
  if(!hole||len<DOORW+.4)return{b:[box(len,H,0,0)],r:[rect(len,0)]};
  const side=(len-DOORW)/2,so=(len+DOORW)/4,b=[box(side,H,0,-so),box(side,H,0,so)],r=[rect(side,-so),rect(side,so)];
  if(hole==='d'){const dh=Math.min(DOORH,H-.2);b.push(box(DOORW,H-dh,y0+dh+(H-dh)/2,0))}
  else{const a=.8,t=Math.min(1.8,H-.2);b.push(box(DOORW,a,y0+a/2,0),box(DOORW,H-t,y0+t+(H-t)/2,0));r.push(rect(DOORW,0))}
  return{b,r}}
function bigParts(d){if(d.t==='wall')return segParts(d.sx,d.H,'x',0,0,d.v==='w'?null:d.v);
  if(d.t==='room'){const X=d.sx,Z=d.sz,b=[],r=[];const add=s=>{b.push(...s.b);r.push(...s.r)};
    add(segParts(X,d.H,'x',0,(Z-T_)/2,d.S===0?'d':null));add(segParts(X,d.H,'x',0,-(Z-T_)/2,d.S===1?'d':null));
    add(segParts(Z-2*T_,d.H,'z',(X-T_)/2,0,d.S===2?'d':null));add(segParts(Z-2*T_,d.H,'z',-(X-T_)/2,0,d.S===3?'d':null));return{b,r}}
  return{b:[[d.sx,d.h,d.sz,0,0,0]],r:[[0,0,d.sx/2,d.sz/2]]}}
const RECTS={};
const _geoBig=geo;geo=function(k){if(!GEO[k]){const d=bigDims(k);if(d){const P_=bigParts(d);GEO[k]=d.t==='floor'||d.t==='pillar'?new THREE.BoxGeometry(d.sx,d.h,d.sz):mergeBoxes(P_.b);RECTS[k]=P_.r;HEIGHT[k]=d.h;STANDABLE.add(k)}}return _geoBig(k)};
const _cleanBig=cleanPiece;cleanPiece=function(d,bound,defs){if(Array.isArray(d)&&bigDims(d[1])){const r=_cleanBig([d[0],'box',...d.slice(2)],bound,defs);if(r)r.s=d[1];return r}return _cleanBig(d,bound,defs)};
const EDGES={},EDGEM=new THREE.LineBasicMaterial({color:'#1D2A48',transparent:true,opacity:.35});
const _addBig=addPieceObj;addPieceObj=function(p,scope,zone,defs){const m=_addBig(p,scope,zone,defs);if(m&&bigDims(p.s)){Object.assign(m.userData,{big:1,bk:p.s,br:p.r||0});
    if(!EDGES[p.s])EDGES[p.s]=new THREE.EdgesGeometry(geo(p.s));const e=new THREE.LineSegments(EDGES[p.s],EDGEM);e.raycast=()=>{};m.add(e)}return m};
/* footprints in world space (walls of a room only, so the inside is free to walk in; a door is a gap) */
function bigRects(m){const r=RECTS[m.userData.bk]||(geo(m.userData.bk),RECTS[m.userData.bk])||[];const t=m.userData.br===2;
  return r.map(([x,z,hx,hz])=>t?[m.position.x+z,m.position.z-x,hz,hx]:[m.position.x+x,m.position.z+z,hx,hz])}
function bigHit(m,x,z,y,R0){return bigRects(m).some(([cx,cz,hx,hz])=>Math.abs(x-cx)<hx+R0&&Math.abs(z-cz)<hz+R0)}
function onBig(m,x,z){return bigRects(m).some(([cx,cz,hx,hz])=>Math.abs(x-cx)<hx-.02&&Math.abs(z-cz)<hz-.02)}
/* true size even while it is still growing in */
function colOf(o){const d=o.userData.big&&bigDims(o.userData.bk);if(!d)return pieceCol(o);const t=o.userData.br===2;return{top:o.position.y+d.h/2,bottom:o.position.y-d.h/2,cx:0,cz:0,hx:(t?d.sz:d.sx)/2,hz:(t?d.sx:d.sz)/2}}
const _massBig=pieceMass;pieceMass=function(m){return m&&m.userData.big?60:_massBig(m)};

/* ---------- state ---------- */
Object.assign(BK,{big:'room',bigA:null,wh:2,wv:'w',mark:null,gh:null,drag:null,last:null});
const BIGK={room:['🏠','חדר','room'],wall:['🧱','קיר','wall'],floor:['⬜','רצפה / גג','floor'],pillar:['🏛️','עמוד','pillar']};
function bigClear(){BK.bigA=null;BK.drag=null;if(BK.mark)scene.remove(BK.mark);BK.mark=null;if(BK.gh){scene.remove(BK.gh);BK.gh=null}const l=$('#bigLabel');if(l)l.hidden=true}
function bigHint(){const k=BK.big;if(BK.bigA)return k==='room'||k==='floor'?'📍 עכשיו נוגעים בפינה השנייה':'📍 עכשיו נוגעים איפה שהקיר נגמר';
  return{room:'👆 גוררים אצבע על הקרקע מפינה לפינה, והחדר נבנה עם דלת',wall:'👆 גוררים אצבע על הקרקע לאורך הקיר',floor:'👆 גוררים מפינה לפינה · נוגעים בחדר כדי לשים עליו גג',pillar:'👆 נוגעים איפה לשים עמוד'}[k]}
const lastRoom=()=>{const L=BK.last&&OBJ.get(BK.last.key);return L&&L.userData.bk.startsWith('br_')&&!roofOn(L)?L:null};
function roofOn(m){const c=colOf(m);for(const o of OBJ.values()){if(o===m||!o.userData.big||o.userData.zone!==m.userData.zone)continue;const oc=colOf(o);if(Math.abs(oc.bottom-c.top)<.05&&Math.abs(o.position.x-m.position.x)<.3&&Math.abs(o.position.z-m.position.z)<.3)return o}return null}

/* ---------- tray: a slim bar while building, the full picker on demand ---------- */
const _renderTrayBig=renderTray;renderTray=function(){
  if(BK.lastS2!==undefined&&SEL.s!==BK.lastS2){BK.big=null;bigClear()}BK.lastS2=SEL.s;
  _renderTrayBig();const t=$('#tray');if(!t||MODE!=='build'||!BUILDZ.includes(ME.zone)||t.hidden)return;
  const kinds=`<div class="kinds" role="group" aria-label="מה בונים">${Object.entries(BIGK).map(([k,v])=>`<button class="kind" data-a="bigk" data-v="${k}" aria-pressed="${BK.big===k}">${v[0]} ${v[1]}</button>`).join('')}<button class="kind" data-a="bigk" data-v="" aria-pressed="${!BK.big}">🧩 צורות קטנות</button></div>`;
  if(!BK.big){if(BK.trayOpen){const h=t.querySelector('.pickhead');if(h)h.insertAdjacentHTML('afterend',kinds)}else{const pb=t.querySelector('.pickbar');if(pb)pb.insertAdjacentHTML('afterend',kinds.replace('class="kinds"','class="kinds slim"'))}return}
  const v=BIGK[BK.big],col=COLS[SEL.c][0];
  const hts=BK.big==='floor'?'':`<div class="hts" role="group" aria-label="גובה"><span>גובה</span>${[1,2,3,4,5,6].map(n=>`<button class="ht" data-a="bigh" data-v="${n}" aria-pressed="${BK.wh===n}" ${BK.big==='room'&&n<2?'disabled':''}>${n}</button>`).join('')}<span>מ׳</span></div>`;
  const roof=lastRoom()?'<button class="btn mini" data-a="bigroof">⛺ לשים גג</button>':'';
  const undo='<button class="btn mini ghost" data-a="bkundo" aria-label="ביטול פעולה">↩️</button>';
  if(!BK.trayOpen){t.classList.add('mini');t.innerHTML=`<div class="pickbar"><button class="pickchip" data-a="bktray" aria-label="לבחור מה בונים"><span class="em">${v[0]}</span><b>${v[1]}</b><span class="dot" style="background:${col}"></span><span class="open">החלפה ▴</span></button>${roof}${undo}${BK.bigA?'<button class="btn mini ghost" data-a="bigcancel" aria-label="ביטול נקודה">✖</button>':''}</div>${hts}<span class="sub">${bigHint()}</span>`;return}
  t.classList.remove('mini');
  const wv=BK.big==='wall'?`<div class="kinds" role="group" aria-label="סוג קיר">${[['w','▬ רגיל'],['d','🚪 עם דלת'],['n','🪟 עם חלון']].map(([k,l])=>`<button class="kind" data-a="bigwv" data-v="${k}" aria-pressed="${BK.wv===k}">${l}</button>`).join('')}</div>`:'';
  t.innerHTML=`<div class="pickhead"><b>${v[0]} בונים ${v[1]}</b><button class="btn mini" data-a="bktray" aria-label="סגירה">✓ סגור ▾</button></div>${kinds}${wv}
    <div class="scroll" role="group" aria-label="צבעים">${Object.entries(COLS).map(([k,c])=>`<button class="col" style="background:${c[0]}" data-a="sel" data-k="c" data-v="${k}" aria-pressed="${SEL.c===k}" aria-label="${k}"></button>`).join('')}</div>
    ${hts}<div class="belt">${undo}<span class="sub">${bigHint()} · כל מ״ר = ½ 💎</span></div>`};
ACTX.bigk=d=>{BK.big=d.v||null;bigClear();if(BK.big){say(BIGK[BK.big][2]);if(BK.big==='room'&&BK.wh<2)BK.wh=2;BK.trayOpen=false}renderTray()};
ACTX.bigwv=d=>{BK.wv=d.v||'w';say(BK.wv==='d'?'door':BK.wv==='n'?'window':'wall');if(BK.wv!=='w'&&BK.wh<2)BK.wh=2;renderTray()};
ACTX.bigcancel=()=>{bigClear();renderTray()};
ACTX.bigroof=()=>{const m=lastRoom();if(m)roofFor(m)};
/* height: for the next piece, and it also changes the one you just built */
ACTX.bigh=d=>{const n=clamp(+d.v,1,6);BK.wh=n;say((NUMW[n]||n)+(n>1?' meters':' meter'));const L=BK.last&&OBJ.get(BK.last.key);
  if(L&&Date.now()-BK.last.t<90000&&!roofOn(L)){const p=pieceData(L);const d0=bigDims(p&&p.s);if(d0&&d0.t!=='floor'&&!(d0.t==='room'&&n<2)&&!((d0.v==='d'||d0.v==='n')&&n<2)&&d0.H!==n){
    const key=d0.t==='room'?`br_${d0.W}_${d0.D}_${n}_${d0.S}`:d0.t==='pillar'?'bp_'+n:`b${d0.v}_${d0.L}_${n}`;const d1=bigDims(key);const c0=Math.ceil(d0.area/2),c1=Math.ceil(d1.area/2);
    if(P.gems+c0<c1)toast(`לגובה ${n} מ׳ צריך עוד 💎${c1-c0-P.gems}`);else{const zone=L.userData.zone,[cx,cz]=ZC[zone];const bottom=p.y-d0.h/2;
      const pl={key,d:d1,x:p.x,z:p.z,r:p.r,y:+(bottom+d1.h/2).toFixed(2),cost:c1};erase(L);P.gems+=c0-1;BK.undo.pop();commitBig(pl,zone,true)}}}
  renderTray()};
const _setModeBig=setMode;setMode=function(m){if(m!=='build')bigClear();_setModeBig(m)};
const _undoBig=ACTX.bkundo;ACTX.bkundo=()=>{if(BK.bigA){bigClear();renderTray();toast('↩️ הנקודה בוטלה');return}const u=BK.undo[BK.undo.length-1];
  if(u&&u.t==='big'){BK.undo.pop();const m=OBJ.get(u.key);if(m){erase(m);P.gems+=Math.max(0,u.cost-1);save();renderHud()}BK.last=null;toast('↩️ בוטל');renderTray();return}_undoBig()};

/* ---------- planning: where it goes and how big it is ---------- */
const capOf=(h,root)=>root&&root.userData&&root.userData.piece?colOf(root).top:h.point.y;
function planBig(kind,A,bx,bz,cap,zone){const[cx,cz]=ZC[zone];let key,x,z,r=0;const H=BK.wh;
  if(kind==='pillar'){key='bp_'+H;x=A.x;z=A.z}
  else if(kind==='wall'){const dx=bx-A.x,dz=bz-A.z;const alongX=Math.abs(dx)>=Math.abs(dz);const L=clamp(Math.round(Math.abs(alongX?dx:dz)),1,12);key='b'+(BK.wv!=='w'&&L>=2&&H>=2?BK.wv:'w')+'_'+L+'_'+H;
    if(alongX){x=A.x+(Math.sign(dx)||1)*L/2;z=A.z}else{x=A.x;z=A.z+(Math.sign(dz)||1)*L/2;r=2}}
  else{const mn=kind==='room'?2:1;const W=clamp(Math.round(Math.abs(bx-A.x)),mn,12),D=clamp(Math.round(Math.abs(bz-A.z)),mn,12);x=A.x+(Math.sign(bx-A.x)||1)*W/2;z=A.z+(Math.sign(bz-A.z)||1)*D/2;
    if(kind==='room'){const vx=(ME.pos.x-cx-x)/W,vz=(ME.pos.z-cz-z)/D;const S=Math.abs(vz)>=Math.abs(vx)?(vz>=0?0:1):(vx>=0?2:3);key=`br_${W}_${D}_${Math.max(2,H)}_${S}`}else key='bf_'+W+'_'+D}
  const d=bigDims(key);const hx=r===2?d.sz/2:d.sx/2,hz=r===2?d.sx/2:d.sz/2;
  // what it stands on: pieces under its footprint that are not higher than where the finger touched
  let sup=0;for(const o of OBJ.values()){if(o.userData.zone!==zone||(o.userData.grow&&!o.userData.big)||o===BK.carry)continue;const oc=colOf(o);if(oc.top>cap+.08||oc.top<=sup)continue;
    const ox=Math.min(cx+x+hx,o.position.x+oc.cx+oc.hx)-Math.max(cx+x-hx,o.position.x+oc.cx-oc.hx),oz=Math.min(cz+z+hz,o.position.z+oc.cz+oc.hz)-Math.max(cz+z-hz,o.position.z+oc.cz-oc.hz);
    const ok=kind==='floor'||kind==='room'?ox>.1&&oz>.1:kind==='pillar'?ox>.2&&oz>.2:(r===2?oz>.35&&ox>.2:ox>.35&&oz>.2);if(ok)sup=oc.top}
  return{key,d,x:+x.toFixed(2),z:+z.toFixed(2),y:+(sup+d.h/2).toFixed(2),r,hx,hz,cost:Math.ceil(d.area/2)}}
function bigInside(pl,zone){const c=[[pl.x-pl.hx,pl.z-pl.hz],[pl.x+pl.hx,pl.z-pl.hz],[pl.x-pl.hx,pl.z+pl.hz],[pl.x+pl.hx,pl.z+pl.hz]];
  if(zone==='island')return c.every(([a,b])=>Math.hypot(a,b)<R-.1);if(zone==='home')return c.every(([a,b])=>Math.hypot(a,b)<10);
  if(zone==='city'){const cp=plotAt(pl.x,pl.z);return!!cp&&P.plots.includes(cp.id)&&c.every(([a,b])=>Math.abs(a-cp.x)<=cp.w/2&&Math.abs(b-cp.z)<=cp.d/2)}return false}
function bigText(pl){const d=pl.d;return d.t==='room'?`🏠 ${d.W} × ${d.D} מ׳ · גובה ${d.H}`:d.t==='wall'?`📏 ${d.L} מ׳ × גובה ${d.H} = ${d.area} מ״ר`:d.t==='floor'?`📏 ${d.W} × ${d.D} = ${d.area} מ״ר`:`📏 עמוד בגובה ${d.H} מ׳`}
const BUILDOK=z=>['island','home','city'].includes(z);
function whereOk(zone,point){if(zone==='work'){toast('על השולחן בסדנה בונים עם צורות קטנות 🙂');return false}
  if(!BUILDOK(zone)){toast('בונים באי, בבית או במגרש שלך');return false}
  if(zone==='city'){const cp=plotAt(point.x-ZC.city[0],point.z-ZC.city[1]);if(!cp||!P.plots.includes(cp.id)){toast('באשקלון בונים רק על מגרש שקנית. Dana מוכרת מגרשים 🏡');return false}}return true}

/* ---------- building it ---------- */
function commitBig(pl,zone,quiet){
  if(!bigInside(pl,zone)){toast(zone==='city'?'בונים בתוך הגבולות של המגרש':'זה יוצא מחוץ לגבול. גוררים קצר יותר');sfx.bad();return null}
  const store=zone==='island'?P.pieces:zone==='home'?P.house.pieces:P.cpieces;if(store.length>=(zone==='home'?250:300)){toast('הגעת למקסימום חלקים כאן. אפשר למחוק כמה כדי לבנות עוד');return null}
  if(P.gems<pl.cost){toast(`${bigText(pl)} · צריך 💎${pl.cost} ויש לך 💎${P.gems}. בונים קטן יותר, או מרוויחים עוד 💎`);sfx.bad();return null}
  const p={id:uid6(),s:pl.key,c:SEL.c,sz:'medium',r:pl.r,x:pl.x,y:pl.y,z:pl.z,ts:Date.now()};P.gems-=pl.cost;
  if(zone==='city'){const cp=plotAt(pl.x,pl.z);if(cp)p.plot=cp.id}
  store.push(p);const scope=zone==='island'?P.key:zone==='home'?'H':P.key+'|c';const m=addPieceObj(p,scope,zone,P.furn);
  if(zone==='island')emit('piece',{o:P.key,p:pack(p)});if(zone==='city')emit('piece',{o:P.key,zn:'city',p:pack(p)});if(zone==='home'&&VISITORS.size)emit('hedit',{h:P.key,op:'add',p:pack(p)});
  BK.undo.push({t:'big',key:m.userData.key,cost:pl.cost});if(BK.undo.length>30)BK.undo.shift();BK.last={key:m.userData.key,t:Date.now()};
  const d=pl.d,[cx,cz]=ZC[zone];floatText(bigText(pl)+` · 💎${pl.cost}`,'#FDE047');
  if(!quiet)say(d.t==='room'?`A ${NUMW[d.W]||d.W} by ${NUMW[d.D]||d.D} room!`:d.t==='wall'?`${NUMW[d.L]||d.L} meter wall!`:d.t==='floor'?`${NUMW[d.W]||d.W} by ${NUMW[d.D]||d.D}!`:'Pillar!');
  sfx.place();if(AU.on&&SND.thud)SND.thud();if(typeof fxBurst==='function')fxBurst(cx+pl.x,pl.y-d.h/2+.1,cz+pl.z,'#E7E5E4',12,2.2);if(typeof shake==='function'&&d.t==='room')shake(.15);
  bigClear();save();renderHud();renderTray();checkQuest();if(zone==='island'){checkTeam();pushPresence(true)}return m}
function roofFor(room){const d=bigDims(room.userData.bk),zone=room.userData.zone,[cx,cz]=ZC[zone];const key='bf_'+d.W+'_'+d.D;const dd=bigDims(key);
  const pl={key,d:dd,x:+(room.position.x-cx).toFixed(2),z:+(room.position.z-cz).toFixed(2),y:+(colOf(room).top+dd.h/2).toFixed(2),r:0,hx:dd.sx/2,hz:dd.sz/2,cost:Math.ceil(dd.area/2)};
  if(commitBig(pl,zone,true))say('A roof!')}
/* a tap: pillar right away; otherwise first tap = start point, second tap = end (for those who prefer tapping) */
function placeBig(h,root,zone){if(!whereOk(zone,h.point))return;
  const[cx,cz]=ZC[zone];const lx=Math.round(h.point.x-cx),lz=Math.round(h.point.z-cz);const cap=capOf(h,root);
  if(BK.big==='floor'&&root&&root.userData&&root.userData.big&&String(root.userData.bk).startsWith('br_')&&!roofOn(root)){bigClear();roofFor(root);return}
  if(BK.big==='pillar'){commitBig(planBig('pillar',{x:lx,z:lz,cap},lx,lz,cap,zone),zone);return}
  if(!BK.bigA||BK.bigA.zone!==zone){bigClear();BK.bigA={x:lx,z:lz,cap,zone};
    const mk=mesh(new THREE.CylinderGeometry(.12,.12,1.2,12),mat('#FACC15',{emissive:'#FACC15',emissiveIntensity:.4}),false);mk.position.set(cx+lx,Math.max(0,cap)+.6,cz+lz);scene.add(mk);BK.mark=mk;
    if(AU.on)tone(660,.08,'triangle',.08);renderTray();return}
  const A=BK.bigA;commitBig(planBig(BK.big,A,lx,lz,Math.max(A.cap,cap),zone),zone)}
const _placeBig=place;place=function(h,root,zone){if(MODE==='build'&&BK.trayOpen){BK.trayOpen=false;renderTray()}if(BK.big)return placeBig(h,root,zone);return _placeBig(h,root,zone)};

/* ---------- press, drag, let go ---------- */
const BIGGM=new THREE.MeshStandardMaterial({color:'#FACC15',transparent:true,opacity:.5,depthWrite:false});
function rayAt(e){const rc=renderer.domElement.getBoundingClientRect();ndc.set(((e.clientX-rc.left)/rc.width)*2-1,-((e.clientY-rc.top)/rc.height)*2+1);ray.setFromCamera(ndc,camera);
  const hs=ray.intersectObjects(pickTargets(),true);return hs.length?hs[0]:null}
function showPlan(pl,zone,bad){const[cx,cz]=ZC[zone];if(!BK.gh){BK.gh=new THREE.Mesh(geo(pl.key),BIGGM);scene.add(BK.gh)}BK.gh.geometry=geo(pl.key);BK.gh.position.set(cx+pl.x,pl.y,cz+pl.z);BK.gh.rotation.y=pl.r*Math.PI/4;
  BIGGM.color.set(bad?'#EF4444':'#FACC15');let l=$('#bigLabel');if(!l){l=document.createElement('div');l.id='bigLabel';document.body.appendChild(l)}l.hidden=false;l.textContent=bigText(pl)+` · 💎${pl.cost}`}
function planAt(e,A){const h=rayAt(e);if(!h)return null;const zone=A.zone,[cx,cz]=ZC[zone];const root=h.object.userData.root||h.object;
  return planBig(BK.big,A,Math.round(h.point.x-cx),Math.round(h.point.z-cz),Math.max(A.cap,capOf(h,root)),zone)}
const CV=renderer.domElement;
CV.addEventListener('pointerdown',e=>{if(MODE!=='build'||!BK.big||BK.big==='pillar'||!e.isPrimary||(e.pointerType==='mouse'&&e.button!==0))return;const h=rayAt(e);if(!h)return;
  const root=h.object.userData.root||h.object;if(root.userData&&root.userData.big&&BK.big==='floor'&&String(root.userData.bk).startsWith('br_'))return;
  const zone=zoneAt(h.point.x,h.point.z);if(!BUILDOK(zone))return;const[cx,cz]=ZC[zone];
  BK.drag={x0:e.clientX,y0:e.clientY,A:{x:Math.round(h.point.x-cx),z:Math.round(h.point.z-cz),cap:capOf(h,root),zone},moved:false,pl:null}});
CV.addEventListener('pointermove',e=>{
  if(BK.drag){const D=BK.drag;if(!D.moved&&Math.hypot(e.clientX-D.x0,e.clientY-D.y0)<12)return;if(!D.moved){D.moved=true;if(BK.trayOpen){BK.trayOpen=false;renderTray()}if(AU.on)tone(520,.05,'triangle',.05)}
    const pl=planAt(e,D.A);if(pl){if(!D.pl||D.pl.key!==pl.key||D.pl.x!==pl.x||D.pl.z!==pl.z){if(AU.on&&D.pl)tone(300+pl.d.h*60+(pl.d.L||pl.d.W||0)*25,.03,'square',.025)}D.pl=pl;showPlan(pl,D.A.zone,!bigInside(pl,D.A.zone)||P.gems<pl.cost)}return}
  if(BK.bigA&&MODE==='build'&&BK.big){const pl=planAt(e,BK.bigA);if(pl)showPlan(pl,BK.bigA.zone,!bigInside(pl,BK.bigA.zone)||P.gems<pl.cost)}});
const endDrag=e=>{const D=BK.drag;BK.drag=null;if(!D||!D.moved)return;const pl=(e&&planAt(e,D.A))||D.pl;if(pl){if(!whereOk(D.A.zone,{x:ZC[D.A.zone][0]+pl.x,z:ZC[D.A.zone][1]+pl.z}))return bigClear();commitBig(pl,D.A.zone)}else bigClear()};
CV.addEventListener('pointerup',endDrag);CV.addEventListener('pointercancel',()=>{BK.drag=null;bigClear()});
