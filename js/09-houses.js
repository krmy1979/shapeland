/* Shapeland · a world by Shirel Yitzhak */
/* ===================== HOUSES ===================== */
const TILE=1.5;
const PLOTS=[[-10.5,3],[10.5,3],[-6.5,9],[6.5,9],[-11.5,-2.5],[11.5,-2.5]];
const LOTS={home:null,visit:null,work:null};
function makeLot(zone){const[cx,cz]=ZC[zone];const g=new THREE.Group();
  if(zone==='work'){const base=mesh(new THREE.CylinderGeometry(6,6,.4,32),mat('#E8D5B7'),false);base.position.set(cx,-.2,cz);g.add(base);
    const bench=mesh(new THREE.BoxGeometry(3,.3,3),mat('#C08A55'));bench.position.set(cx,-.15,cz);bench.userData.lot='work';g.add(bench);
    const grid=new THREE.GridHelper(3,12,'#8B5E3C','#A47148');grid.position.set(cx,.01,cz);g.add(grid);
    const lb=label('Workshop 🛠️','#1D2A48','#FFFFFF',.5);lb.position.set(cx,2.6,cz-1.8);g.add(lb);scene.add(g);LOTS.work=bench;return}
  const yard=mesh(new THREE.CylinderGeometry(13,13,.5,48),mat('#9ED68F'),false);yard.position.set(cx,-.25,cz);yard.userData.lot=zone;g.add(yard);
  const dirt=mesh(new THREE.CylinderGeometry(13,8,4,48),mat('#B98A5E'),false);dirt.position.set(cx,-2.5,cz);g.add(dirt);
  [[-10,-7],[10,-6],[-9,8],[9,8.5]].forEach(([x,z])=>tree(cx+x,cz+z,.9));scene.add(g);LOTS[zone]=yard}
['home','visit','work'].forEach(makeLot);
const HOUSEG={home:null,visit:null};
function roomStyle(house,r){const s=(house.styles||{})[r]||{};return{floor:s.floor||ROOMS[r].floor,wall:s.wall!==undefined?s.wall:ROOMS[r].wall}}
function renderHouse(zone,house){if(HOUSEG[zone])scene.remove(HOUSEG[zone]);const[cx,cz]=ZC[zone];const g=new THREE.Group();const T=house.tiles||{};
  const fGeo=new THREE.BoxGeometry(TILE,.12,TILE);
  Object.entries(T).forEach(([k,r])=>{const[x,z]=k.split(',').map(Number);const st=roomStyle(house,r);const f=mesh(fGeo,mat(st.floor),false);f.position.set(cx+(x+.5)*TILE,.06,cz+(z+.5)*TILE);
    f.userData={floor:true,zone,tx:x,tz:z};g.add(f);
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dz])=>{const nb=T[(x+dx)+','+(z+dz)];if(nb===r)return;
      const edge=dx?('v'+(dx>0?x+1:x)+','+z):('h'+x+','+(dz>0?z+1:z));const open=house.doors&&house.doors[edge];
      const ex=cx+(x+.5+dx*.5)*TILE-dx*.05,ez=cz+(z+.5+dz*.5)*TILE-dz*.05;
      if(r==='garden'){if(nb)return;const fence=mesh(new THREE.BoxGeometry(dx?.08:TILE,.45,dx?TILE:.08),mat('#FFFFFF'));fence.position.set(ex,.35,ez);fence.userData={wall:true,edge,zone};g.add(fence);return}
      if(open){const th=mesh(new THREE.BoxGeometry(dx?.12:TILE*.6,.03,dx?TILE*.6:.12),mat('#8B5E3C'),false);th.position.set(ex,.13,ez);th.userData={wall:true,edge,zone,door:true};g.add(th);
        [-1,1].forEach(s=>{const post=mesh(new THREE.BoxGeometry(dx?.09:.22,1.5,dx?.22:.09),mat(st.wall||'#FFFFFF'));post.position.set(ex+(dx?0:s*TILE*.39),.75,ez+(dx?s*TILE*.39:0));post.userData={wall:true,edge,zone};g.add(post)});return}
      const wl=mesh(new THREE.BoxGeometry(dx?.09:TILE,1.5,dx?TILE:.09),mat(st.wall||'#FFFFFF'));wl.position.set(ex,.75,ez);wl.userData={wall:true,edge,zone};g.add(wl)})});
  scene.add(g);HOUSEG[zone]=g}
/* exteriors on the island */
const EXT=new Map();
function houseExterior(color,name){const g=new THREE.Group();const body=mesh(new THREE.BoxGeometry(2.6,1.9,2.2),mat(color));body.position.y=.95;g.add(body);
  const roof=mesh(new THREE.ConeGeometry(2.2,1.3,4),mat('#E2554F'));roof.rotation.y=Math.PI/4;roof.scale.set(1,1,.85);roof.position.y=2.55;g.add(roof);
  const door=mesh(new THREE.BoxGeometry(.6,1.1,.08),mat('#7C4A2D'));door.position.set(0,.55,1.12);g.add(door);
  const knob=mesh(new THREE.SphereGeometry(.05,8,6),mat('#FCD34D'));knob.position.set(.18,.55,1.17);g.add(knob);
  [-.85,.85].forEach(x=>{const w=mesh(new THREE.BoxGeometry(.55,.5,.06),mat('#BFE3FF',{roughness:.15}));w.position.set(x,1.15,1.12);g.add(w)});
  const ch=mesh(new THREE.BoxGeometry(.3,.6,.3),mat('#9CA3AF'));ch.position.set(.6,2.8,-.3);g.add(ch);
  const lb=label(name,'#FFFFFF','#1D2A48',.38);lb.position.y=3.6;g.add(lb);return rootify(g)}
function plotKeys(){const keys=new Set([P.key]);if(NET.room)NET.peers.forEach(p=>{const k=(p.presence||{}).k;if(typeof k==='string'&&k.length<20)keys.add(k)});return[...keys].sort()}
function renderExteriors(){const keys=plotKeys().slice(0,PLOTS.length);
  EXT.forEach((v,k)=>{if(!keys.includes(k)){scene.remove(v.g);EXT.delete(k)}});
  keys.forEach((k,i)=>{const me=k===P.key;const peer=me?null:NET.peers.find(p=>(p.presence||{}).k===k);const pr=peer?peer.presence:{};
    const color=me?P.house.color:(/^#[0-9A-Fa-f]{6}$/.test(pr.hc||'')?pr.hc:'#FDE68A');const name=(me?(P.name||'My'):nameOf(peer))+"'s house";const sig=color+name+i;
    let e=EXT.get(k);if(!e||e.sig!==sig){if(e)scene.remove(e.g);const g=houseExterior(color,me?'🏠 '+name:name);const[px,pz]=PLOTS[i];g.position.set(px,0,pz);g.lookAt(0,0,0);g.userData.house=k;scene.add(g);EXT.set(k,{g,sig})}})}
