/* Shapeland · a world by Shirel Yitzhak */
/* ===================== PROFILE ===================== */
const KEY='shapeland-v1';
function defaultHouse(){const t={};const set=(x0,x1,z0,z1,r)=>{for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)t[x+','+z]=r};
  set(-2,1,0,2,'living');set(-2,0,-3,-1,'bedroom');set(1,2,-3,-1,'kitchen');
  return{tiles:t,styles:{},doors:{'h0,3':1,'h-1,0':1,'h1,0':1},pieces:[],color:'#FDE68A'}}
function freshP(){return{name:'',code:'shirel-friends',gems:60,savings:0,xp:0,adv:0,
  sk:{vocab:3,listen:3,spell:3,sentence:3,talk:3,math:3},learned:{},owned:['ball','box','cone','cylinder'],
  ch:humanCh('girl'),salon:[],
  pieces:[],quest:null,team:0,best:0,log:[],goal:null,key:'p'+Math.random().toString(36).slice(2,9),sound:true,plots:[],cpieces:[],loan:null,badges:{safe:0,escape:0,tour:0},safeTask:false,tour:null,
  house:defaultHouse(),ws:[],furn:{},inv:{bed:1,lamp:1,plant:1},pets:[],pet:null,ward:[],pantry:{},mission:null,shifts:0}}
let P=freshP();
try{const raw=localStorage.getItem(KEY);if(raw){P=Object.assign(freshP(),JSON.parse(raw));if(!P.house||!P.house.tiles)P.house=defaultHouse();if(!P.ch||P.ch.kind!=='human')P.ch=humanCh('girl',P.ch);if(!Array.isArray(P.salon))P.salon=[];
  for(const k of['hat','back','ears','pat']){const v=P.ch[k];if(ACC[v]&&!P.ward.includes(v))P.ward.push(v)}}}catch(e){}
let saveT;function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}},200)}
