/* Shapeland · a world by Shirel Yitzhak */
/* ===================== UTILS ===================== */
const $=s=>document.querySelector(s);
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>(Math.round(n*100)/100).toLocaleString('he-IL',{maximumFractionDigits:2});
const level=()=>Math.floor(Math.sqrt(P.xp/40))+1;
const lvlXp=L=>(L-1)*(L-1)*40;
const tierFor=r=>clamp(Math.round(r/2),1,5);
const en=t=>`<span class="en" dir="ltr">${esc(t)}</span>`;
const spName=()=>/^[\x20-\x7E]+$/.test(P.name||'')?P.name:'friend';
const avgSkill=()=>Object.values(P.sk).reduce((a,b)=>a+b,0)/6;
const nw=n=>NUMW[n]||String(n);
const uid6=()=>Math.random().toString(36).slice(2,10);
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2800)}
function burst(html){const b=$('#burst');b.innerHTML=`<div>${html}</div>`;b.hidden=false;setTimeout(()=>b.hidden=true,1600)}
let voice=null;
function say(text,rate){try{if(!('speechSynthesis' in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=rate||.88;
  if(!voice){const vs=speechSynthesis.getVoices();voice=vs.find(v=>/en-US/i.test(v.lang)&&/Samantha|Google|Aria|Jenny|Female/i.test(v.name))||vs.find(v=>/^en/i.test(v.lang))||null}
  if(voice)u.voice=voice;speechSynthesis.speak(u)}catch(e){}}
try{speechSynthesis.onvoiceschanged=()=>{voice=null}}catch(e){}
let AC=null;
function blip(f,d,type,vol){if(!P.sound)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.value=f;
  g.gain.setValueAtTime(vol||.08,AC.currentTime);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+(d||.12));o.connect(g).connect(AC.destination);o.start();o.stop(AC.currentTime+(d||.12))}catch(e){}}
const sfx={place:()=>blip(520,.09,'triangle'),pop:()=>blip(300,.1,'square',.04),coin:()=>{blip(880,.08);setTimeout(()=>blip(1320,.12),70)},
  win:()=>[523,659,784,1046].forEach((f,i)=>setTimeout(()=>blip(f,.15,'triangle'),i*90)),bad:()=>blip(180,.18,'sawtooth',.04),door:()=>{blip(392,.1,'triangle');setTimeout(()=>blip(523,.15,'triangle'),110)}};
