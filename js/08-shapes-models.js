/* Shapeland · a world by Shirel Yitzhak */
/* ===================== SHAPES & MODELS ===================== */
function shape2D(k){const s=new THREE.Shape();
  if(k==='heart'){s.moveTo(0,-.5);s.bezierCurveTo(-.1,-.36,-.56,-.12,-.5,.16);s.bezierCurveTo(-.44,.46,-.08,.5,0,.24);s.bezierCurveTo(.08,.5,.44,.46,.5,.16);s.bezierCurveTo(.56,-.12,.1,-.36,0,-.5)}
  else if(k==='star'){for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,r=i%2?.24:.56;i?s.lineTo(Math.cos(a)*r,Math.sin(a)*r):s.moveTo(Math.cos(a)*r,Math.sin(a)*r)}}
  else if(k==='moon'){s.absarc(0,0,.5,.35*Math.PI,1.65*Math.PI,false);s.absarc(.2,0,.45,1.547*Math.PI,.453*Math.PI,true)}
  return s}
const GEO={},HEIGHT={};
function geo(k){if(GEO[k])return GEO[k];let g;
  if(k==='ball')g=new THREE.SphereGeometry(.5,24,18);else if(k==='box')g=new THREE.BoxGeometry(.96,.96,.96);
  else if(k==='cone')g=new THREE.ConeGeometry(.5,1.1,24);else if(k==='cylinder')g=new THREE.CylinderGeometry(.45,.45,1,24);
  else if(k==='pyramid'){g=new THREE.ConeGeometry(.66,1,4);g.rotateY(Math.PI/4)}else if(k==='donut')g=new THREE.TorusGeometry(.36,.15,12,28);
  else if(k==='arch')g=new THREE.TorusGeometry(.42,.14,10,24,Math.PI);else if(k==='diamond'){g=new THREE.OctahedronGeometry(.5);g.scale(1,1.25,1)}
  else if(k==='cloud'){g=new THREE.SphereGeometry(.5,16,12);g.scale(1.1,.6,.8)}
  else g=new THREE.ExtrudeGeometry(shape2D(k),{depth:.3,bevelEnabled:true,bevelThickness:.06,bevelSize:.05,bevelSegments:2,curveSegments:16});
  g.computeBoundingBox();g.center();g.computeBoundingBox();HEIGHT[k]=g.boundingBox.max.y-g.boundingBox.min.y;GEO[k]=g;return g}
function shapeMesh(k,col){const hex=COLS[col]?COLS[col][0]:col;const o={};if(k==='diamond')Object.assign(o,{metalness:.35,roughness:.18});if(k==='star'||k==='moon')Object.assign(o,{emissive:hex,emissiveIntensity:.18});
  if(k==='cloud'){const g=new THREE.Group();[[0,0,0,.5],[-.42,-.05,0,.36],[.42,-.06,0,.38],[.15,.18,.05,.34]].forEach(([x,y,z,r])=>{const m=mesh(new THREE.SphereGeometry(r,16,12),mat(hex,o));m.position.set(x,y,z);g.add(m)});return g}
  return mesh(geo(k),mat(hex,Object.keys(o).length?o:undefined))}
const hOf=(s,sz)=>(geo(s),(s==='cloud'?.8:HEIGHT[s]))*(SIZES[sz]?SIZES[sz][0]:1);
const pTop=p=>p.y+hOf(p.s,p.sz)/2;
// nonuniform part models (store furniture, pets)
function partsModel(parts){const g=new THREE.Group();parts.forEach(([s,c,x,y,z,sx,sy,sz,ry,op])=>{const m=mesh(geo(s),op?mat(c,{transparent:true,opacity:op}):mat(c));
  const b=GEO[s].boundingBox;m.scale.set(sx/(b.max.x-b.min.x),sy/(b.max.y-b.min.y),sz/(b.max.z-b.min.z));m.position.set(x,y,z);if(ry)m.rotation.y=ry;g.add(m)});return g}
// custom furniture made in the workshop: list of [s,c,sz,x,y,z,r]
function customModel(parts){const g=new THREE.Group();parts.forEach(([s,c,sz,x,y,z,r])=>{const m=shapeMesh(s,c);m.scale.setScalar(SIZES[sz][0]);m.position.set(x,y,z);m.rotation.y=(r||0)*Math.PI/4;g.add(m)});return g}
function itemModel(id,defs){if(MODELS[id])return partsModel(MODELS[id].parts);const d=defs&&defs[id];if(d)return customModel(d.parts);return partsModel([['box','#CBD5E1',0,.3,0,.6,.6,.6]])}
const itemName=(id,defs)=>MODELS[id]?id:(defs&&defs[id]?defs[id].n:'thing');
