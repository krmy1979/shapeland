/* Shapeland · a world by Shirel Yitzhak */
/* ===================== PIECES ===================== */
const OBJ=new Map();
const OTHERS=new Map(),OTHC=new Map();
function zoneOffset(zone){return ZC[zone]||[0,0]}
function addPieceObj(p,scope,zone,defs){const key=scope+':'+p.id;if(OBJ.has(key))removePieceObj(key);const[cx,cz]=zoneOffset(zone);let m;
  if(p.s==='item'){m=itemModel(p.c,defs);m.position.set(cx+p.x,p.y,cz+p.z);m.rotation.y=(p.r||0)*Math.PI/4;m.userData.grow=1;m.scale.setScalar(.2)}
  else{m=shapeMesh(p.s,p.c);const sc=SIZES[p.sz][0];m.position.set(cx+p.x,p.y,cz+p.z);m.rotation.y=(p.r||0)*Math.PI/4;m.scale.setScalar(sc*.2);m.userData.grow=sc}
  rootify(m);Object.assign(m.userData,{piece:true,key,scope,id:p.id,zone,item:p.s==='item'});scene.add(m);OBJ.set(key,m);return m}
function removePieceObj(key){const m=OBJ.get(key);if(m){scene.remove(m);OBJ.delete(key)}}
function clearScope(scope){[...OBJ.keys()].forEach(k=>{if(k.startsWith(scope+':'))removePieceObj(k)})}
function allIsland(){const a=P.pieces.slice();OTHERS.forEach(m=>m.forEach(p=>a.push(p)));return a}
const CODE_RE=/^[a-z0-9][a-z0-9_.-]{0,40}$/;
function cleanPiece(d,bound,defs){if(!Array.isArray(d)||d.length<8)return null;const[id,s,c,sz,r,x,y,z]=d;
  if(typeof id!=='string'||id.length>16||!SIZES[sz])return null;
  if(s==='item'){if(typeof c!=='string'||!(MODELS[c]||(defs&&defs[c])))return null}else if(!SHAPES[s]||!COLS[c])return null;
  const n=[r,x,y,z].map(Number);if(n.some(v=>!isFinite(v)))return null;
  return{id,s,c,sz,r:clamp(Math.round(n[0]),0,7),x:clamp(n[1],-bound,bound),y:clamp(n[2],0,40),z:clamp(n[3],-bound,bound)}}
const pack=p=>[p.id,p.s,p.c,p.sz,p.r,+p.x.toFixed(2),+p.y.toFixed(2),+p.z.toFixed(2)];
function cleanParts(a){if(!Array.isArray(a))return null;const out=[];for(const q of a.slice(0,40)){if(!Array.isArray(q))continue;const[s,c,sz,x,y,z,r]=q;
  if(!SHAPES[s]||!COLS[c]||!SIZES[sz])continue;const n=[x,y,z,r].map(Number);if(n.some(v=>!isFinite(v)))continue;out.push([s,c,sz,clamp(n[0],-2,2),clamp(n[1],0,6),clamp(n[2],-2,2),clamp(Math.round(n[3]),0,7)])}return out.length?out:null}
