/* Shapeland · a world by Shirel Yitzhak */
/* ===================== INTERACTION ===================== */
let MODE='walk',SEL={s:'ball',c:'red',sz:'medium',r:0,item:null,room:'living',paint:'floor'};
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();let down=null;
renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,t:performance.now()}});
renderer.domElement.addEventListener('pointerup',e=>{if(!down)return;const d=Math.hypot(e.clientX-down.x,e.clientY-down.y),dt=performance.now()-down.t;down=null;if(d<9&&dt<450)tap(e)});
function pickTargets(){const t=[ground,townGround,plaza,bridge,LOTS.home,LOTS.visit,LOTS.work,SIGN,FLAG,...Object.values(NPCOBJ),...BLDG,...CHESTS.filter(c=>c.visible),...[...EXT.values()].map(e=>e.g),...OBJ.values()];
  if(HOUSEG.home)t.push(HOUSEG.home);if(HOUSEG.visit)t.push(HOUSEG.visit);
  t.push(...CITYPICK,TOWER,MALL,SCHOOL,...Object.values(BUSSTOPS),...Object.values(PLOTOBJ).map(p=>p.g),...WALKERS.map(w=>w.g));return t}
function tap(e){const rc=renderer.domElement.getBoundingClientRect();ndc.set(((e.clientX-rc.left)/rc.width)*2-1,-((e.clientY-rc.top)/rc.height)*2+1);ray.setFromCamera(ndc,camera);
  const hits=ray.intersectObjects(pickTargets(),true).filter(h=>h.object.type!=='Sprite'||h.object.userData.root);if(!hits.length)return;const h=hits[0];const obj=h.object,root=obj.userData.root||obj;const u=root.userData||{};
  if(u.npc){talkTo(u.npc);return}if(u.chest){openChest(root);return}if(u.sign){openTeam();return}if(u.race){openArena();return}if(u.bld){openBuilding(u.bld);return}
  if(u.house){houseDoor(u.house);return}
  if(u.escape){openEscape();return}if(u.mall){openMall();return}if(u.school){openSam();return}if(u.bus){openBus(u.bus);return}if(u.walker!==undefined){talkWalker(u.walker);return}
  if(u.plot&&(obj.type==='Sprite'||(MODE!=='walk'&&!(P.plots.includes(u.plot)&&['build','erase'].includes(MODE))))){openPlot(u.plot);return}
  if(obj.userData.cross!==undefined&&MODE==='walk'){crossTap(obj.userData.cross,h.point);return}
  const zone=zoneAt(h.point.x,h.point.z);
  if(MODE==='door'){if(obj.userData.wall&&obj.userData.zone==='home')toggleDoor(obj.userData.edge);else toast('בעזרת הכלי הזה נוגעים בקיר כדי לפתוח או לסגור דלת');return}
  if(MODE==='room'){if(zone==='home')paintTile(h.point);return}
  if(MODE==='erase'){if(u.piece)erase(root);else toast('נוגעים בצורה או ברהיט כדי להסיר');return}
  if(MODE==='build'){place(h,root,zone);return}
  if(MODE==='item'){placeItem(h,root,zone);return}
  if(zone&&walkable(h.point,zone))walkTo(h.point)}
function surfaceNormal(h){return h.face?h.face.normal.clone().transformDirection(h.object.matrixWorld):new THREE.Vector3(0,1,0)}
function place(h,root,zone){
  if(zone==='town'||zone==='bridge'){toast('בעיירה לא בונים, רק מבקרים 🙂');return}if(!zone)return;
  let cplot=null;if(zone==='city'){cplot=plotAt(h.point.x-CX,h.point.z-CZ);if(!cplot||!P.plots.includes(cplot.id)){toast('באשקלון בונים רק על מגרש שקנית. Dana מוכרת מגרשים 🏡');if(cplot)openPlot(cplot.id);return}}
  if(!P.owned.includes(SEL.s)){openShop(SEL.s);return}
  const store=zone==='island'?P.pieces:zone==='home'?P.house.pieces:zone==='work'?P.ws:zone==='city'?P.cpieces:null;
  if(store&&store.length>=(zone==='work'?40:zone==='home'?250:300)){toast('הגעת למקסימום צורות כאן. אפשר למחוק כמה כדי לבנות עוד');return}
  const cost=SEL.sz==='big'?2:1;if(P.gems<cost){toast('אין מספיק 💎. אפשר להרוויח במשימות, בתיבות האוצר או בעבודה בעיירה');sfx.bad();return}
  const[cx,cz]=ZC[zone];const snapS=zone==='work'?.25:.5;const snap=v=>Math.round(v/snapS)*snapS;const ht=hOf(SEL.s,SEL.sz);const n=surfaceNormal(h);let x,y,z;
  if(n.y>.6){x=snap(h.point.x-cx);z=snap(h.point.z-cz);y=h.point.y+ht/2}
  else{x=snap(h.point.x-cx+n.x*.5*SIZES[SEL.sz][0]);z=snap(h.point.z-cz+n.z*.5*SIZES[SEL.sz][0]);y=Math.max(ht/2,h.point.y)}
  if(zone==='city'&&(Math.abs(x-cplot.x)>cplot.w/2-.2||Math.abs(z-cplot.z)>cplot.d/2-.2)){toast('בונים בתוך הגבולות של המגרש');return}
  const lim=zone==='island'?R-.2:zone==='work'?1.4:zone==='city'?99:9;if(Math.hypot(x,z)>lim&&zone!=='work'||zone==='work'&&(Math.abs(x)>1.4||Math.abs(z)>1.4)){toast(zone==='work'?'בונים על השולחן של הסדנה':'זה כבר מחוץ לגבול');return}
  const p={id:uid6(),s:SEL.s,c:SEL.c,sz:SEL.sz,r:SEL.r,x,y:+y.toFixed(2),z,ts:Date.now()};
  P.gems-=cost;sfx.place();
  if(zone==='visit'){if(!VISIT){return}emit('hreq',{h:VISIT.host,op:'add',p:pack(p)});renderHud();save();return}
  if(cplot)p.plot=cplot.id;store.push(p);const scope=zone==='island'?P.key:zone==='home'?'H':zone==='city'?P.key+'|c':'W';addPieceObj(p,scope,zone,P.furn);
  if(zone==='island')emit('piece',{o:P.key,p:pack(p)});if(zone==='city')emit('piece',{o:P.key,zn:'city',p:pack(p)});if(zone==='home'&&VISITORS.size)emit('hedit',{h:P.key,op:'add',p:pack(p)});
  save();renderHud();checkQuest();if(zone==='island'){checkTeam();pushPresence(true)}}
function placeItem(h,root,zone){if(zone!=='home'){toast('רהיטים מציבים בבית שלך');return}const id=SEL.item;if(!id||!(P.inv[id]>0)){toast('בוחרים רהיט מהמגש למטה');return}
  if(P.house.pieces.length>=250){toast('הבית מלא! אפשר להסיר כמה דברים');return}
  const[cx,cz]=ZC.home;const n=surfaceNormal(h);const snap=v=>Math.round(v/.25)*.25;const x=snap(h.point.x-cx),z=snap(h.point.z-cz);const y=n.y>.6?+h.point.y.toFixed(2):.12;
  const p={id:uid6(),s:'item',c:id,sz:'medium',r:SEL.r,x,y,z};P.inv[id]--;P.house.pieces.push(p);addPieceObj(p,'H','home',P.furn);sfx.place();say(itemName(id,P.furn));
  if(VISITORS.size)sendHouse('*');save();renderTray()}
function erase(root){const u=root.userData;
  if(u.zone==='island'){if(u.scope!==P.key){toast('את הבנייה של החברים אי אפשר למחוק 🙂');return}const i=P.pieces.findIndex(p=>p.id===u.id);if(i<0)return;P.pieces.splice(i,1);removePieceObj(u.key);P.gems+=1;emit('del',{o:P.key,id:u.id})}
  else if(u.zone==='home'){const i=P.house.pieces.findIndex(p=>p.id===u.id);if(i<0)return;const p=P.house.pieces[i];P.house.pieces.splice(i,1);removePieceObj(u.key);
    if(p.s==='item'){P.inv[p.c]=(P.inv[p.c]||0)+1;renderTray()}else P.gems+=1;if(VISITORS.size)emit('hedit',{h:P.key,op:'del',id:u.id})}
  else if(u.zone==='city'){if(u.scope!==P.key+'|c'){toast('את הבנייה של החברים אי אפשר למחוק 🙂');return}const i=P.cpieces.findIndex(p=>p.id===u.id);if(i<0)return;P.cpieces.splice(i,1);removePieceObj(u.key);P.gems+=1;emit('del',{o:P.key,zn:'city',id:u.id})}
  else if(u.zone==='work'){const i=P.ws.findIndex(p=>p.id===u.id);if(i<0)return;P.ws.splice(i,1);removePieceObj(u.key);P.gems+=1}
  else if(u.zone==='visit'){if(!VISIT||!VISIT.mine.has(u.id)){toast('בבית של חברה אפשר להסיר רק מה שבנית בעצמך');return}emit('hreq',{h:VISIT.host,op:'del',id:u.id});P.gems+=1}
  sfx.pop();save();renderHud();checkQuest()}
function paintTile(pt){const[cx,cz]=ZC.home;const x=Math.floor((pt.x-cx)/TILE),z=Math.floor((pt.z-cz)/TILE);if(x<-5||x>4||z<-5||z>4){toast('זה מחוץ למגרש של הבית');return}
  const k=x+','+z;if(SEL.room==='erase'){if(!P.house.tiles[k])return;delete P.house.tiles[k]}else{if(Object.keys(P.house.tiles).length>=100&&!P.house.tiles[k]){toast('הבית הגיע לגודל המקסימלי');return}P.house.tiles[k]=SEL.room}
  sfx.place();houseChanged()}
function toggleDoor(edge){if(P.house.doors[edge])delete P.house.doors[edge];else P.house.doors[edge]=1;sfx.door();say(P.house.doors[edge]?'Door!':'Wall!');houseChanged()}
function houseDoor(k){if(k===P.key){teleport('home');sfx.door();say('Welcome home, '+spName()+'!');return}
  if(VISIT&&VISIT.host===k&&VISIT.house){teleport('visit');return}
  const p=peerByKey(k);if(!p){toast('החבר/ה לא מחובר/ת כרגע');return}
  PANEL='door';PANEL_DATA=p;sheet(`<div class="npchead"><div class="face" style="background:#FDE68A">🏠</div><div class="grow"><h2>הבית של ${esc(nameOf(p))}</h2><p class="sub">נכנסים רק בהזמנה</p></div></div>
    <div class="row"><button class="btn" data-a="knock">🚪 ${en('Knock knock')}</button><button class="btn ghost" data-a="close">סגירה</button></div>`)}
