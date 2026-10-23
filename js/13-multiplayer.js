/* Shapeland · a world by Shirel Yitzhak */
/* ===================== MULTIPLAYER ===================== */
const NET={room:null,state:'off',peers:[],myPeer:null,avatars:new Map(),names:new Map(),race:null};
const INVITED=new Set(),VISITORS=new Set(),VADDED=new Map();
let VISIT=null;// {host,hostPeer,name,house,defs,mine:Set,pending}
const HBUF={};
const sanitizeCh=c=>{const o={};if(!c||typeof c!=='object')return P.ch;if(c.kind==='human')return sanitizeHuman(c);for(const k of['shape','pat','eyes','mouth','ears','back','hat']){const ok=CH[k].map(x=>x[0]);o[k]=ok.includes(c[k])?c[k]:ok[0]}
  o.color=COLORS.map(x=>x[0]).includes(c.color)?c.color:'#FF8FB1';o.w=clamp(+c.w||1,.7,1.3);o.h=clamp(+c.h||1,.7,1.3);return o};
const nameOf=p=>String((p&&p.presence&&p.presence.n)||'חבר/ה').slice(0,14);
const peerByKey=k=>NET.peers.find(p=>!p.sameTab&&(p.presence||{}).k===k);
async function connect(){
  NET.state='connecting';renderFriends();
  try{
    let r;
    if(window.CLOUD&&window.CLOUD.on){if(!CLOUD.user||!CLOUD.gid){NET.state='solo';renderFriends();if(CLOUD.user&&!CLOUD.gid)toast('עוד אין קבוצה. בכפתור 👫 פותחים קבוצה ומזמינים חברים');return}r=cloudRoom(CLOUD.gid)}
    else{if(!window.claude||!window.claude.use){NET.state='solo';renderFriends();return}
      const ns=await window.claude.use('room');if(!ns){NET.state='solo';renderFriends();return}r=await ns.join('sl-'+P.code)}
    NET.room=r;NET.state='on';
    r.onPeers(ch=>{NET.peers=ch.peers.filter(p=>p.kind==='viewer');const me=ch.peers.find(p=>p.sameTab);if(me)NET.myPeer=me.peer;
      NET.peers.forEach(p=>{if(p.presence&&typeof p.presence.k==='string')NET.names.set(p.presence.k,nameOf(p))});
      if(ch.joined.some(p=>!p.sameTab))sendAllPieces();
      ch.left.forEach(p=>{const a=NET.avatars.get(p.peer);if(a){scene.remove(a.obj);NET.avatars.delete(p.peer)}INVITED.delete(p.peer);VISITORS.delete(p.peer);
        if(VISIT&&p.peer===VISIT.hostPeer){toast('המארחת יצאה מהמשחק, חוזרים לאי');leaveVisit()}});
      syncAvatars();renderFriends();renderExteriors();updatePlotSigns();if(PANEL==='team'&&(ch.joined.length||ch.left.length))openTeam(true)});
    r.onConnection(c=>{NET.state=c?'on':'connecting';renderFriends()});
    r.on('piece',m=>{if(m.sameTab)return;const d=m.data||{};if(typeof d.o!=='string'||d.o===P.key||d.o.length>20)return;const city=d.zn==='city';const p=cleanPiece(d.p,city?33:R);if(!p)return;
      if(city){const k=d.o+'|c';if(!OTHC.has(k))OTHC.set(k,new Map());OTHC.get(k).set(p.id,p);addPieceObj(p,k,'city');sfx.pop();return}
      if(!OTHERS.has(d.o))OTHERS.set(d.o,new Map());OTHERS.get(d.o).set(p.id,p);addPieceObj(p,d.o,'island');sfx.pop();checkTeam()});
    r.on('del',m=>{if(m.sameTab)return;const d=m.data||{};if(typeof d.o!=='string'||typeof d.id!=='string')return;const k=d.zn==='city'?d.o+'|c':d.o;const mp=(d.zn==='city'?OTHC:OTHERS).get(k);if(mp)mp.delete(d.id);removePieceObj(k+':'+d.id)});
    r.on('pieces',m=>{if(m.sameTab)return;const d=m.data||{};if(typeof d.o!=='string'||d.o===P.key||d.o.length>20||!Array.isArray(d.list))return;const city=d.zn==='city';const k=city?d.o+'|c':d.o;const M=city?OTHC:OTHERS;
      if(!M.has(k))M.set(k,new Map());const mp=M.get(k);
      d.list.slice(0,80).forEach(x=>{const p=cleanPiece(x,city?33:R);if(p&&!mp.has(p.id)){mp.set(p.id,p);addPieceObj(p,k,city?'city':'island')}});if(!city)checkTeam()});
    r.on('wave',m=>{if(m.sameTab)return;const d=m.data||{};if(d.to!==NET.myPeer)return;const who=String(d.from||'חבר/ה').slice(0,14);
      const em=['👋','🎉','⭐','💖'].includes(d.e)?d.e:'👋';burst(em);toast(`${who} שלח/ה לך ${em}`);say(d.e==='💖'?'You are awesome!':'Hi there!')});
    r.on('race',m=>{if(!$('#title').hidden)return;const d=m.data||{};if(typeof d.id!=='string'||!isFinite(d.seed))return;startRace(d.id,d.seed,clamp(+d.r||3,1,10),String(d.by||'').slice(0,14))});
    r.on('score',m=>{if(m.sameTab)return;const d=m.data||{};if(!NET.race||d.id!==NET.race.id)return;NET.race.scores.set(m.peer,{n:String(d.n||'').slice(0,14),s:clamp(+d.s||0,0,2000)});if(PZ&&PZ.race)renderRace()});
    // house visits
    r.on('knock',m=>{if(m.sameTab)return;const d=m.data||{};if(d.to!==NET.myPeer)return;const who=String(d.from||'חבר/ה').slice(0,14);sfx.door();
      PANEL='knock';PANEL_DATA=m.peer;sheet(`<div class="npchead"><div class="face" style="background:#FDE68A">🚪</div><div class="grow"><h2>${en('Knock knock!')}</h2><p class="sub">${esc(who)} עומד/ת ליד הדלת של הבית שלך</p></div></div>
        <div class="row"><button class="btn" data-a="invite" data-p="${esc(m.peer)}">🔑 ${en('Come in!')}</button><button class="btn ghost" data-a="close">${en('Not now')}</button></div>`);say('Knock knock! Someone is at your door!')});
    r.on('invite',m=>{if(m.sameTab||!$('#title').hidden)return;const d=m.data||{};if(d.to!==NET.myPeer||typeof d.h!=='string')return;const who=String(d.from||'חבר/ה').slice(0,14);sfx.door();
      PANEL='invite';PANEL_DATA={h:d.h,peer:m.peer,who};sheet(`<div class="npchead"><div class="face" style="background:#FDE68A">🔑</div><div class="grow"><h2>הזמנה!</h2><p class="sub">${esc(who)} מזמין/ה אותך לבית שלו/ה</p></div></div>
        <div class="bubble">${en(`${who} invites you to visit! Do you want to come?`)}</div><div class="row"><button class="btn" data-a="accept">${en("Yes, let's go!")} 🏠</button><button class="btn ghost" data-a="close">${en('Maybe later')}</button></div>`);say('You are invited! Do you want to come?')});
    r.on('enter',m=>{if(m.sameTab)return;const d=m.data||{};if(d.to!==NET.myPeer||d.h!==P.key||!INVITED.has(m.peer))return;VISITORS.add(m.peer);sendHouse(m.peer);toast('🏠 '+nameOf(NET.peers.find(p=>p.peer===m.peer))+' נכנס/ה לבית!')});
    r.on('hdata',m=>{if(m.sameTab)return;const d=m.data||{};if(!VISIT||d.h!==VISIT.host||m.peer!==VISIT.hostPeer)return;if(d.to!==NET.myPeer&&d.to!=='*')return;
      if(typeof d.seq!=='string'||!(d.n>0&&d.n<40)||typeof d.c!=='string')return;const b=HBUF[d.seq]=HBUF[d.seq]||{n:d.n,parts:[]};b.parts[d.i]=d.c;
      if(b.parts.filter(x=>x!==undefined).length===b.n){delete HBUF[d.seq];try{applyVisit(JSON.parse(b.parts.join('')))}catch(e){}}});
    r.on('hedit',m=>{if(m.sameTab)return;const d=m.data||{};if(!VISIT||!VISIT.house||d.h!==VISIT.host||m.peer!==VISIT.hostPeer)return;
      if(d.op==='add'){const p=cleanPiece(d.p,8,VISIT.defs);if(!p)return;VISIT.house.pieces.push(p);addPieceObj(p,'V','visit',VISIT.defs);sfx.pop()}
      if(d.op==='del'&&typeof d.id==='string'){VISIT.house.pieces=VISIT.house.pieces.filter(x=>x.id!==d.id);removePieceObj('V:'+d.id)}});
    r.on('hreq',m=>{if(m.sameTab)return;const d=m.data||{};if(d.h!==P.key||!VISITORS.has(m.peer))return;
      if(d.op==='add'){if(P.house.pieces.length>=250)return;const p=cleanPiece(d.p,7.5);if(!p||p.s==='item')return;p.id=uid6();P.house.pieces.push(p);
        if(!VADDED.has(m.peer))VADDED.set(m.peer,new Set());VADDED.get(m.peer).add(p.id);addPieceObj(p,'H','home',P.furn);save();emit('hedit',{h:P.key,op:'add',p:pack(p)});emit('hack',{to:m.peer,id:p.id})}
      if(d.op==='del'&&typeof d.id==='string'&&VADDED.get(m.peer)&&VADDED.get(m.peer).has(d.id)){P.house.pieces=P.house.pieces.filter(x=>x.id!==d.id);removePieceObj('H:'+d.id);save();emit('hedit',{h:P.key,op:'del',id:d.id})}});
    r.on('hack',m=>{if(m.sameTab)return;const d=m.data||{};if(VISIT&&d.to===NET.myPeer&&m.peer===VISIT.hostPeer&&typeof d.id==='string')VISIT.mine.add(d.id)});
    pushPresence(true);setTimeout(sendAllPieces,700);renderFriends();renderExteriors();
  }catch(e){NET.state='solo';renderFriends()}
}
let lastPres=0;
function localPos(){const[cx,cz]=ZC[ME.zone]||[0,0];return[+(ME.pos.x-cx).toFixed(2),+(ME.pos.z-cz).toFixed(2)]}
function pushPresence(force){if(!NET.room)return;const t=performance.now();if(!force&&t-lastPres<120)return;lastPres=t;const[x,z]=localPos();
  const zone=ME.zone==='home'?'house':ME.zone==='visit'?'house':ME.zone,host=ME.zone==='home'?P.key:ME.zone==='visit'&&VISIT?VISIT.host:ME.zone==='inside'&&INSIDE?INSIDE.id:null;
  NET.room.presence({n:P.name||'שחקן/ית',k:P.key,lv:level(),pc:P.pieces.length+P.cpieces.length,ch:P.ch,hc:P.house.color,pet:P.pet,pl:P.plots,zone,host,x,z,y:ME.y>.3?Math.round(ME.y*10)/10:0}).catch(()=>{})}
function emit(topic,data){if(NET.room&&NET.room.connected())NET.room.emit(topic,data).catch(()=>{})}
let sendQ=Promise.resolve();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function sendAllPieces(){if(!NET.room)return;const list=P.pieces.map(pack),cl=P.cpieces.map(pack);sendQ=sendQ.then(async()=>{for(let i=0;i<list.length;i+=60){emit('pieces',{o:P.key,list:list.slice(i,i+60)});await wait(260)}
  for(let i=0;i<cl.length;i+=60){emit('pieces',{o:P.key,zn:'city',list:cl.slice(i,i+60)});await wait(260)}})}
function houseData(){const used={};P.house.pieces.forEach(p=>{if(p.s==='item'&&P.furn[p.c])used[p.c]={n:P.furn[p.c].n,parts:P.furn[p.c].parts}});
  return{n:P.name,t:P.house.tiles,s:P.house.styles,d:P.house.doors,p:P.house.pieces.map(pack),m:used}}
function sendHouse(to){if(!NET.room)return;const s=JSON.stringify(houseData());const seq=uid6();const N=Math.ceil(s.length/1500);
  sendQ=sendQ.then(async()=>{for(let i=0;i<N;i++){emit('hdata',{h:P.key,to,seq,i,n:N,c:s.slice(i*1500,(i+1)*1500)});await wait(220)}})}
function cleanHouse(o){if(!o||typeof o!=='object')return null;const h={tiles:{},styles:{},doors:{},pieces:[]};const defs={};
  if(o.m&&typeof o.m==='object')Object.entries(o.m).slice(0,30).forEach(([k,v])=>{if(/^cf_[a-z0-9]{3,12}$/.test(k)&&v){const parts=cleanParts(v.parts);if(parts)defs[k]={n:String(v.n||'thing').replace(/[^\x20-\x7E]/g,'').slice(0,20)||'thing',parts}}});
  if(o.t&&typeof o.t==='object')Object.entries(o.t).forEach(([k,v])=>{if(/^-?\d,-?\d$/.test(k)&&ROOMS[v]){const[x,z]=k.split(',').map(Number);if(x>=-5&&x<=4&&z>=-5&&z<=4)h.tiles[k]=v}});
  const pv=Object.values(PAINTS);if(o.s&&typeof o.s==='object')Object.entries(o.s).forEach(([k,v])=>{if(ROOMS[k]&&v){h.styles[k]={};if(pv.includes(v.floor))h.styles[k].floor=v.floor;if(pv.includes(v.wall))h.styles[k].wall=v.wall}});
  if(o.d&&typeof o.d==='object')Object.keys(o.d).forEach(k=>{if(/^[vh]-?\d,-?\d$/.test(k))h.doors[k]=1});
  if(Array.isArray(o.p))o.p.slice(0,260).forEach(x=>{const p=cleanPiece(x,8,defs);if(p)h.pieces.push(p)});
  return{house:h,defs,name:String(o.n||'').slice(0,14)}}
function applyVisit(o){const c=cleanHouse(o);if(!c||!VISIT)return;VISIT.house=c.house;VISIT.defs=c.defs;VISIT.name=c.name||VISIT.name;
  renderHouse('visit',c.house);clearScope('V');c.house.pieces.forEach(p=>addPieceObj(p,'V','visit',c.defs));
  if(VISIT.pending){VISIT.pending=false;teleport('visit');sfx.door();say('Welcome to my house!')}}
function leaveVisit(){VISIT=null;clearScope('V');if(HOUSEG.visit){scene.remove(HOUSEG.visit);HOUSEG.visit=null}if(ME.zone==='visit')teleport('island')}
function houseChanged(){renderHouse('home',P.house);save();if(VISITORS.size)sendHouse('*')}
function syncAvatars(){NET.peers.forEach(p=>{if(p.sameTab)return;const pr=p.presence||{};const ch=sanitizeCh(pr.ch);const pet=PETS[pr.pet]?pr.pet:null;const sig=JSON.stringify(ch)+nameOf(p)+pet;
  let a=NET.avatars.get(p.peer);if(!a||a.sig!==sig){if(a)scene.remove(a.obj);const o=avatar3D(ch);const lb=label(nameOf(p)+(p.isMe?' (גם את/ה)':''),'#1D2A48','#FFFFFF');lb.position.y=o.userData.h+.35;o.add(lb);
    if(pet){const pm=partsModel(PETS[pet].parts);pm.position.set(-.9,0,-.3);o.add(pm)}scene.add(o);a={obj:o,sig};NET.avatars.set(p.peer,a);a.first=true}
  let center=null;const z=pr.zone;
  if(['island','town','bridge','city','road','girls','boys','adv','legend'].includes(z))center=ZC[z==='bridge'?'island':z];
  else if(z==='inside'){if(INSIDE&&pr.host===INSIDE.id)center=ZC.inside}
  else if(z==='house'){if(pr.host===P.key)center=ZC.home;else if(VISIT&&pr.host===VISIT.host)center=ZC.visit}
  a.obj.visible=!!center;a.ty=+pr.y||0;if(center){a.tx=center[0]+clamp(+pr.x||0,-40,40);a.tz=center[1]+clamp(+pr.z||0,-40,40);if(a.first||a.lastCenter!==center){a.obj.position.set(a.tx,0,a.tz);a.first=false;a.lastCenter=center}}})}
