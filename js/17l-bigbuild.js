/* Shapeland · a world by Shirel Yitzhak */
/* ===================== BIG BUILDING: whole walls, pillars, floors and roofs =====================
   A wall is "drawn" with two taps (start → end) and its length is measured in meters.
   Pieces are stored like any shape, with the size in the shape key:
   bw_L_H = wall (length L, height H) · bp_H = pillar (height H) · bf_W_D = floor / roof (W × D) */
const BIGRE=/^b([wpf])_(\d{1,2})(?:_(\d{1,2}))?$/;
function bigDims(k){const m=typeof k==='string'&&BIGRE.exec(k);if(!m)return null;const a=+m[2],b=+(m[3]||0);
  if(m[1]==='w'&&a>=1&&a<=12&&b>=1&&b<=6)return{t:'wall',L:a,H:b,area:a*b,h:b,sx:a+.3,sz:.3};
  if(m[1]==='p'&&a>=1&&a<=8&&!m[3])return{t:'pillar',H:a,area:a,h:a,sx:.5,sz:.5};
  if(m[1]==='f'&&a>=1&&a<=10&&b>=1&&b<=10)return{t:'floor',W:a,D:b,area:a*b,h:.25,sx:a+.3,sz:b+.3};return null}
const BIGT=.3;
/* geometry: registered on demand so hOf, shapeMesh and standing all work as for any shape */
const _geoBig=geo;geo=function(k){if(!GEO[k]){const d=bigDims(k);if(d){const g=new THREE.BoxGeometry(d.sx,d.h,d.sz);GEO[k]=g;HEIGHT[k]=d.h;STANDABLE.add(k)}}return _geoBig(k)};
const _cleanBig=cleanPiece;cleanPiece=function(d,bound,defs){if(Array.isArray(d)&&bigDims(d[1])){const r=_cleanBig([d[0],'box',...d.slice(2)],bound,defs);if(r)r.s=d[1];return r}return _cleanBig(d,bound,defs)};
const _addBig=addPieceObj;addPieceObj=function(p,scope,zone,defs){const m=_addBig(p,scope,zone,defs);if(m&&bigDims(p.s))m.userData.big=1;return m};
const _massBig=pieceMass;pieceMass=function(m){return m&&m.userData.big?60:_massBig(m)};

/* ---------- state & UI ---------- */
Object.assign(BK,{big:null,bigA:null,wh:2,ph:3,mark:null,gh:null});
const BIGK={wall:['🧱','קיר','wall'],pillar:['🏛️','עמוד','pillar'],floor:['⬜','רצפה / גג','floor']};
function bigClear(){BK.bigA=null;[BK.mark,BK.gh].forEach(o=>{if(o)scene.remove(o)});BK.mark=null;if(BK.gh){BK.gh.geometry.dispose();BK.gh=null}const l=$('#bigLabel');if(l)l.hidden=true}
function bigHint(){const k=BK.big;if(k==='pillar')return'👆 נוגעים איפה לשים את העמוד';
  if(k==='wall')return BK.bigA?'📍 עכשיו נוגעים איפה שהקיר נגמר':'👆 נוגעים איפה שהקיר מתחיל. נוגעים על קיר כדי לבנות קומה מעליו';
  return BK.bigA?'📍 עכשיו נוגעים בפינה השנייה':'👆 רצפה: שתי פינות על הקרקע · גג: שתי פינות על הקירות'}
function bigDimText(){return BK.big==='wall'?`גובה ${BK.wh} מ׳`:BK.big==='pillar'?`גובה ${BK.ph} מ׳`:'עובי ¼ מ׳'}
const _renderTrayBig=renderTray;renderTray=function(){
  if(BK.lastS2!==undefined&&SEL.s!==BK.lastS2){BK.big=null;bigClear()}BK.lastS2=SEL.s;
  _renderTrayBig();const t=$('#tray');if(!t||MODE!=='build'||!BUILDZ.includes(ME.zone)||t.hidden)return;
  const kinds=`<div class="kinds" role="group" aria-label="סוג בנייה"><button class="kind" data-a="bigk" data-v="" aria-pressed="${!BK.big}">🧩 צורות</button>${Object.entries(BIGK).map(([k,v])=>`<button class="kind" data-a="bigk" data-v="${k}" aria-pressed="${BK.big===k}">${v[0]} ${v[1]}</button>`).join('')}</div>`;
  const tools=`<button class="btn mini ghost" data-a="bkundo" aria-label="ביטול פעולה">↩️</button><button class="btn mini ghost ${MODE==='measure'?'on':''}" data-a="bkmeasure" aria-label="מדידה">📐</button>`;
  if(!BK.big){if(BK.trayOpen){const h=t.querySelector('.pickhead');if(h)h.insertAdjacentHTML('afterend',kinds)}return}
  const v=BIGK[BK.big],col=COLS[SEL.c][0];
  if(!BK.trayOpen){t.classList.add('mini');t.innerHTML=`<div class="pickbar"><button class="pickchip" data-a="bktray" aria-label="לבחור מה בונים"><span class="em">${v[0]}</span><b>${v[1]}</b><span class="dot" style="background:${col}"></span><span class="szl">${bigDimText()}</span><span class="open">🧩 החלפה ▴</span></button>${tools}${BK.bigA?'<button class="btn mini ghost" data-a="bigcancel" aria-label="ביטול נקודה">✖</button>':''}</div><span class="sub">${bigHint()}</span>`;return}
  t.classList.remove('mini');
  const step=BK.big==='floor'?`<span class="sub">גודל: מודדים בשתי נגיעות</span>`:`<span class="dimlbl">גובה</span><button class="sz" data-a="bigdim" data-v="-1" aria-label="נמוך יותר">−</button><b class="dimv">${BK.big==='wall'?BK.wh:BK.ph} מ׳</b><button class="sz" data-a="bigdim" data-v="1" aria-label="גבוה יותר">+</button>`;
  t.innerHTML=`<div class="pickhead"><b>${v[0]} בונים ${v[1]}</b><button class="btn mini" data-a="bktray" aria-label="סגירה">✓ סגור ▾</button></div>${kinds}
    <div class="scroll" role="group" aria-label="צבעים">${Object.entries(COLS).map(([k,c])=>`<button class="col" style="background:${c[0]}" data-a="sel" data-k="c" data-v="${k}" aria-pressed="${SEL.c===k}" aria-label="${k}"></button>`).join('')}</div>
    <div class="trow">${step}<span class="cost">כל מ״ר = ½ 💎</span></div>
    <div class="belt">${tools}<span class="sub">${bigHint()}</span></div>`};
ACTX.bigk=d=>{BK.big=d.v||null;bigClear();if(BK.big){say(BIGK[BK.big][2]);toast(BIGK[BK.big][0]+' '+bigHint())}renderTray()};
ACTX.bigdim=d=>{const k=BK.big==='wall'?'wh':'ph';BK[k]=clamp(BK[k]+(+d.v),1,k==='wh'?6:8);say((NUMW[BK[k]]||BK[k])+(BK[k]>1?' meters':' meter')+' high');renderTray()};
ACTX.bigcancel=()=>{bigClear();renderTray()};
const _setModeBig=setMode;setMode=function(m){if(m!=='build')bigClear();_setModeBig(m)};
const _undoBig=ACTX.bkundo;ACTX.bkundo=()=>{if(BK.bigA){bigClear();renderTray();toast('↩️ הנקודה בוטלה');return}const u=BK.undo[BK.undo.length-1];
  if(u&&u.t==='big'){BK.undo.pop();const m=OBJ.get(u.key);if(m){erase(m);P.gems+=Math.max(0,u.cost-1);save();renderHud()}toast('↩️ בוטל');return}_undoBig()};

/* ---------- planning: where the piece goes and how big it is ---------- */
const capOf=(h,root)=>root&&root.userData&&root.userData.piece?pieceCol(root).top:h.point.y;
function planBig(kind,A,bx,bz,cap,zone){const[cx,cz]=ZC[zone];let key,x,z,r=0;
  if(kind==='pillar'){key='bp_'+BK.ph;x=A.x;z=A.z}
  else if(kind==='wall'){const dx=bx-A.x,dz=bz-A.z;const alongX=Math.abs(dx)>=Math.abs(dz);const L=clamp(Math.round(Math.abs(alongX?dx:dz)),1,12);key='bw_'+L+'_'+BK.wh;
    if(alongX){x=A.x+(Math.sign(dx)||1)*L/2;z=A.z}else{x=A.x;z=A.z+(Math.sign(dz)||1)*L/2;r=2}}
  else{const W=clamp(Math.round(Math.abs(bx-A.x)),1,10),D=clamp(Math.round(Math.abs(bz-A.z)),1,10);key='bf_'+W+'_'+D;x=A.x+(Math.sign(bx-A.x)||1)*W/2;z=A.z+(Math.sign(bz-A.z)||1)*D/2}
  const d=bigDims(key);const hx=r===2?d.sz/2:d.sx/2,hz=r===2?d.sx/2:d.sz/2;
  // what it stands on: pieces under its footprint that are not higher than where we touched
  let sup=0;for(const o of OBJ.values()){if(o.userData.zone!==zone||o.userData.grow||o===BK.carry)continue;const oc=pieceCol(o);if(oc.top>cap+.08||oc.top<=sup)continue;
    const ox=Math.min(cx+x+hx,o.position.x+oc.cx+oc.hx)-Math.max(cx+x-hx,o.position.x+oc.cx-oc.hx),oz=Math.min(cz+z+hz,o.position.z+oc.cz+oc.hz)-Math.max(cz+z-hz,o.position.z+oc.cz-oc.hz);
    const ok=kind==='floor'?ox>.1&&oz>.1:kind==='pillar'?ox>.2&&oz>.2:(r===2?oz>.35&&ox>.2:ox>.35&&oz>.2);if(ok)sup=oc.top}
  return{key,d,x:+x.toFixed(2),z:+z.toFixed(2),y:+(sup+d.h/2).toFixed(2),r,hx,hz,cost:Math.ceil(d.area/2)}}
function bigInside(pl,zone,cplot){const c=[[pl.x-pl.hx,pl.z-pl.hz],[pl.x+pl.hx,pl.z-pl.hz],[pl.x-pl.hx,pl.z+pl.hz],[pl.x+pl.hx,pl.z+pl.hz]];
  if(zone==='island')return c.every(([a,b])=>Math.hypot(a,b)<R-.1);if(zone==='home')return c.every(([a,b])=>Math.hypot(a,b)<10);
  if(zone==='city')return!!cplot&&c.every(([a,b])=>Math.abs(a-cplot.x)<=cplot.w/2&&Math.abs(b-cplot.z)<=cplot.d/2);return false}
function bigText(pl){const d=pl.d;return d.t==='wall'?`📏 ${d.L} מ׳ × גובה ${d.H} = ${d.area} מ״ר`:d.t==='floor'?`📏 ${d.W} × ${d.D} = ${d.area} מ״ר`:`📏 עמוד בגובה ${d.H} מ׳`}

/* ---------- placing ---------- */
function placeBig(h,root,zone){
  if(zone==='work'){toast('על השולחן בסדנה בונים עם צורות קטנות 🙂');return}
  if(!['island','home','city'].includes(zone)){toast('קירות גדולים בונים באי, בבית או במגרש שלך');return}
  const[cx,cz]=ZC[zone];const g=1;const lx=Math.round((h.point.x-cx)/g)*g,lz=Math.round((h.point.z-cz)/g)*g;const cap=capOf(h,root);
  let cplot=null;if(zone==='city'){cplot=plotAt(h.point.x-cx,h.point.z-cz);if(!cplot||!P.plots.includes(cplot.id)){toast('באשקלון בונים רק על מגרש שקנית. Dana מוכרת מגרשים 🏡');return}}
  if(BK.big!=='pillar'&&(!BK.bigA||BK.bigA.zone!==zone)){bigClear();BK.bigA={x:lx,z:lz,cap,zone};
    const mk=mesh(new THREE.CylinderGeometry(.12,.12,1.2,12),mat('#FACC15',{emissive:'#FACC15',emissiveIntensity:.4}),false);mk.position.set(cx+lx,Math.max(0,cap)+.6,cz+lz);scene.add(mk);BK.mark=mk;
    if(AU.on)tone(660,.08,'triangle',.08);say(BK.big==='wall'?'Start here!':'First corner!');renderTray();return}
  const A=BK.big==='pillar'?{x:lx,z:lz,cap}:BK.bigA;const pl=planBig(BK.big,A,lx,lz,Math.max(A.cap,cap),zone);
  if(!bigInside(pl,zone,cplot||(zone==='city'?plotAt(A.x,A.z):null))){toast(zone==='city'?'בונים בתוך הגבולות של המגרש':'זה יוצא מחוץ לגבול. מודדים קצר יותר');return}
  const store=zone==='island'?P.pieces:zone==='home'?P.house.pieces:P.cpieces;if(store.length>=(zone==='home'?250:300)){toast('הגעת למקסימום חלקים כאן. אפשר למחוק כמה כדי לבנות עוד');return}
  if(P.gems<pl.cost){toast(`${bigText(pl)} · צריך 💎${pl.cost} ויש לך 💎${P.gems}. מודדים קטן יותר, או מרוויחים עוד 💎`);sfx.bad();return}
  const p={id:uid6(),s:pl.key,c:SEL.c,sz:'medium',r:pl.r,x:pl.x,y:pl.y,z:pl.z,ts:Date.now()};P.gems-=pl.cost;sfx.place();
  if(zone==='city'){const cp=plotAt(pl.x,pl.z);if(cp)p.plot=cp.id}
  store.push(p);const scope=zone==='island'?P.key:zone==='home'?'H':P.key+'|c';const m=addPieceObj(p,scope,zone,P.furn);
  if(zone==='island')emit('piece',{o:P.key,p:pack(p)});if(zone==='city')emit('piece',{o:P.key,zn:'city',p:pack(p)});if(zone==='home'&&VISITORS.size)emit('hedit',{h:P.key,op:'add',p:pack(p)});
  BK.undo.push({t:'big',key:m.userData.key,cost:pl.cost});if(BK.undo.length>30)BK.undo.shift();
  const d=pl.d;floatText(bigText(pl)+` · 💎${pl.cost}`,'#FDE047');say(d.t==='wall'?`${NUMW[d.L]||d.L} meter wall!`:d.t==='floor'?`${NUMW[d.W]||d.W} by ${NUMW[d.D]||d.D}!`:'Pillar!');
  if(AU.on&&SND.thud)SND.thud();if(typeof fxBurst==='function')fxBurst(cx+pl.x,pl.y-d.h/2+.1,cz+pl.z,'#E7E5E4',10,2);
  bigClear();save();renderHud();renderTray();checkQuest();if(zone==='island'){checkTeam();pushPresence(true)}}
const _placeBig=place;place=function(h,root,zone){if(MODE==='build'&&BK.trayOpen){BK.trayOpen=false;renderTray()}if(BK.big)return placeBig(h,root,zone);return _placeBig(h,root,zone)};

/* ---------- live preview while measuring (mouse, or a finger dragging) ---------- */
const BIGGM=new THREE.MeshStandardMaterial({color:'#FACC15',transparent:true,opacity:.45,depthWrite:false});
renderer.domElement.addEventListener('pointermove',e=>{if(!BK.bigA||MODE!=='build'||!BK.big)return;const rc=renderer.domElement.getBoundingClientRect();
  ndc.set(((e.clientX-rc.left)/rc.width)*2-1,-((e.clientY-rc.top)/rc.height)*2+1);ray.setFromCamera(ndc,camera);const hs=ray.intersectObjects(pickTargets(),true);if(!hs.length)return;
  const h=hs[0],zone=BK.bigA.zone,[cx,cz]=ZC[zone];const root=h.object.userData.root||h.object;const pl=planBig(BK.big,BK.bigA,Math.round(h.point.x-cx),Math.round(h.point.z-cz),Math.max(BK.bigA.cap,capOf(h,root)),zone);
  if(BK.gh)BK.gh.geometry.dispose();else{BK.gh=new THREE.Mesh(new THREE.BufferGeometry(),BIGGM);scene.add(BK.gh)}
  BK.gh.geometry=new THREE.BoxGeometry(pl.d.sx,pl.d.h,pl.d.sz);BK.gh.position.set(cx+pl.x,pl.y,cz+pl.z);BK.gh.rotation.y=pl.r*Math.PI/4;
  let l=$('#bigLabel');if(!l){l=document.createElement('div');l.id='bigLabel';document.body.appendChild(l)}l.hidden=false;l.textContent=bigText(pl)+` · 💎${pl.cost}`});
