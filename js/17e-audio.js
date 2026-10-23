/* Shapeland · a world by Shirel Yitzhak */
/* ===================== SOUND WORLD: steps, objects, nature, and music that is composed live ===================== */
/* Everything is synthesized in the browser. The music is written by the game while you play,
   so every melody is new. When something exciting is near, the music changes. */
if(P.music===undefined)P.music=true;
const AU={ctx:null,master:null,mus:null,fx:null,amb:null,noise:null,beds:{},on:false};
function auInit(){if(AU.ctx){if(AU.ctx.state==='suspended')AU.ctx.resume();return}
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const c=AC;AU.ctx=c;
    const comp=c.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.connect(c.destination);
    AU.master=c.createGain();AU.master.gain.value=.9;AU.master.connect(comp);
    AU.mus=c.createGain();AU.mus.gain.value=P.music?.22:0;AU.mus.connect(AU.master);
    AU.fx=c.createGain();AU.fx.gain.value=P.sound?.8:0;AU.fx.connect(AU.master);
    AU.amb=c.createGain();AU.amb.gain.value=P.sound?.5:0;AU.amb.connect(AU.master);
    const len=c.sampleRate*2,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;AU.noise=b;
    // continuous beds: waves, city hum, wind, fly whoosh
    const bed=(type,f,q)=>{const s=c.createBufferSource();s.buffer=b;s.loop=true;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q||.7;const g=c.createGain();g.gain.value=0;s.connect(fl).connect(g).connect(AU.amb);s.start();return{g,fl}};
    AU.beds={waves:bed('lowpass',520),hum:bed('lowpass',180),wind:bed('bandpass',420,.6),fly:bed('bandpass',900,.9),slime:bed('lowpass',300)};AU.on=true}catch(e){}}
['pointerdown','keydown','touchstart'].forEach(ev=>window.addEventListener(ev,auInit,{passive:true}));
document.addEventListener('visibilitychange',()=>{if(!AU.ctx)return;if(document.hidden)AU.ctx.suspend();else AU.ctx.resume()});
const auNow=()=>AU.ctx.currentTime;
function tone(f,dur,type,vol,dest,t,att,f2){if(!AU.on)return;const c=AU.ctx;t=t||auNow();const o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol||.1,t+(att||.008));g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(dest||AU.fx);o.start(t);o.stop(t+dur+.02)}
function hiss(dur,type,f,q,vol,dest,t,f2){if(!AU.on)return;const c=AU.ctx;t=t||auNow();const s=c.createBufferSource();s.buffer=AU.noise;const fl=c.createBiquadFilter();fl.type=type||'bandpass';fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+dur);fl.Q.value=q||1;
  const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol||.2,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(fl).connect(g).connect(dest||AU.fx);s.start(t,Math.random()*1.5);s.stop(t+dur+.02)}
const SND={
  step(sf){const v=.9+Math.random()*.2;if(sf==='grass')hiss(.08,'bandpass',900*v,.9,.16);else if(sf==='sand')hiss(.11,'bandpass',1500*v,.5,.13);else if(sf==='wood'){tone(150*v,.07,'sine',.12);hiss(.04,'bandpass',1300,1,.06)}
    else if(sf==='water'){hiss(.3,'lowpass',700,.7,.12,null,null,250)}else{hiss(.045,'bandpass',2600*v,2,.12);tone(190*v,.03,'square',.025)}},
  jump(){tone(260,.18,'sine',.09,null,null,.01,640);hiss(.12,'bandpass',800,1,.05,null,null,2400)},
  land(){tone(85,.12,'sine',.16);hiss(.1,'lowpass',260,.7,.14)},
  roll(){hiss(.42,'bandpass',300,1.2,.14,null,null,2200)},
  splash(){hiss(.6,'lowpass',1600,.6,.22,null,null,300);for(let i=0;i<4;i++)tone(400+Math.random()*500,.08,'sine',.04,null,auNow()+.1+i*.07,.005,900)},
  stroke(){hiss(.35,'lowpass',900,.8,.08,null,null,300)},
  whoosh(){hiss(.5,'bandpass',500,1,.14,null,null,2600)},
  scrape(){if(!AU.on)return;const t=auNow();for(let i=0;i<5;i++)hiss(.09,'bandpass',300+Math.random()*120,3,.12,null,t+i*.08);tone(70,.18,'sine',.18,null,t+.45)},
  pop(){tone(420,.08,'triangle',.1,null,null,.004,760)},
  thud(){tone(110,.15,'sine',.16);hiss(.08,'lowpass',400,.7,.1)},
  bounce(){[0,.18,.32,.42].forEach((d,i)=>tone(320-i*30,.07,'sine',.12-i*.02,null,auNow()+d))},
  kick(){hiss(.06,'lowpass',500,.7,.25);tone(140,.1,'sine',.15,null,null,.003,60)},
  sparkle(){[1568,2093,2637,3136].forEach((f,i)=>tone(f,.18,'sine',.05,null,auNow()+i*.05))},
  click(){tone(900,.03,'square',.03)},
  boing(){tone(180,.35,'sine',.16,null,null,.005,520);tone(240,.3,'triangle',.06,null,auNow()+.05,.005,90)},
  pinch(){tone(1200,.06,'square',.05);tone(900,.06,'square',.05,null,auNow()+.07)},
  bird(){if(!AU.on)return;const t=auNow();const n=2+Math.floor(Math.random()*4),b=2200+Math.random()*1600;for(let i=0;i<n;i++)tone(b+Math.random()*600,.07,'sine',.035,AU.amb,t+i*.09,.005,b*1.25)},
  gull(){tone(1300,.35,'sawtooth',.025,AU.amb,null,.02,700)},
  cricket(){if(!AU.on)return;const t=auNow();for(let i=0;i<6;i++)tone(4300,.025,'square',.012,AU.amb,t+i*.045)},
  bloop(){tone(180+Math.random()*120,.18,'sine',.06,AU.amb,null,.01,520)},
  chime(){if(!AU.on)return;const t=auNow();[0,4,7,12].forEach((s,i)=>tone(880*Math.pow(2,s/12),.6,'sine',.03,AU.amb,t+i*.12))},
  whistle(){tone(2100,.22,'square',.02,AU.amb,null,.01,2600)}};
/* nicer versions of the old sounds */
sfx.place=()=>{if(AU.on)SND.pop();else blip(520,.09,'triangle')};
sfx.door=()=>{if(!AU.on)return blip(392,.1,'triangle');tone(120,.35,'sawtooth',.03,null,null,.05,90);tone(392,.1,'triangle',.08,null,auNow()+.15);tone(523,.15,'triangle',.08,null,auNow()+.26)};
const _jumpBlip=blip;
/* hook object sounds into building */
const _placeItem=placeItem;placeItem=function(...a){const n=OBJ.size;const r=_placeItem.apply(this,a);if(OBJ.size>n)SND.scrape();return r};
const _place=place;place=function(...a){const n=OBJ.size;const r=_place.apply(this,a);if(OBJ.size>n){const s=SEL.s;if(s==='ball')SND.bounce();else SND.pop()}return r};
const _erase=erase;erase=function(...a){const r=_erase.apply(this,a);SND.whoosh();return r};
const _kickBall=kickBall;kickBall=function(){_kickBall();SND.kick()};
const _danceParty=danceParty;danceParty=function(){_danceParty();SND.sparkle()};

/* ===================== the live composer ===================== */
const THEMES={
  island:{bpm:104,root:60,mode:[0,2,4,5,7,9,11],prog:[0,4,5,3],lead:'triangle',bell:false,drums:1},
  town:{bpm:112,root:62,mode:[0,2,4,5,7,9,10],prog:[0,6,3,0],lead:'square',bell:false,drums:1},
  road:{bpm:112,root:62,mode:[0,2,4,5,7,9,10],prog:[0,6,3,0],lead:'square',bell:false,drums:1},
  city:{bpm:98,root:57,mode:[0,2,3,5,7,9,10],prog:[0,3,0,6],lead:'triangle',bell:false,drums:2},
  girls:{bpm:116,root:65,mode:[0,2,4,6,7,9,11],prog:[0,1,0,4],lead:'sine',bell:true,drums:1},
  boys:{bpm:128,root:67,mode:[0,2,4,5,7,9,11],prog:[0,3,4,3],lead:'square',bell:false,drums:2},
  adv:{bpm:120,root:64,mode:[0,3,5,7,10,12,15],prog:[0,5,6,0],lead:'triangle',bell:false,drums:2,pent:true},
  inside:{bpm:90,root:63,mode:[0,2,4,5,7,9,11],prog:[0,2,3,4],lead:'sine',bell:true,drums:0},
  home:{bpm:92,root:60,mode:[0,2,4,5,7,9,11],prog:[0,5,3,4],lead:'sine',bell:true,drums:0},
  visit:{bpm:92,root:60,mode:[0,2,4,5,7,9,11],prog:[0,5,3,4],lead:'sine',bell:true,drums:0},
  work:{bpm:100,root:62,mode:[0,2,4,5,7,9,11],prog:[0,3,4,0],lead:'triangle',bell:false,drums:1},
  sky:{bpm:84,root:67,mode:[0,2,4,6,7,9,11],prog:[0,1,4,0],lead:'sine',bell:true,drums:0}};
const TENSE={mode:[0,1,3,5,7,8,10],prog:[0,1,0,6]};
const MZ={step:0,next:0,theme:'island',tense:0,motif:null,bar:0,timer:null};
const mtof=m=>440*Math.pow(2,(m-69)/12);
function scaleNote(th,deg,oct){const md=MZ.tense?TENSE.mode:th.mode;const n=md.length;const o=Math.floor(deg/n);const d=((deg%n)+n)%n;return th.root+md[d]%12+12*(o+(oct||0))+(md[d]>=12?12:0)}
function newMotif(){const m=[];let d=Math.floor(Math.random()*5);for(let i=0;i<8;i++){if(i>0&&Math.random()<.22){m.push(null);continue}d+=[-2,-1,-1,0,1,1,2,3][Math.floor(Math.random()*8)];d=clamp(d,-2,9);m.push(d)}return m}
function vary(m){return m.map(x=>x===null?(Math.random()<.4?Math.floor(Math.random()*6):null):Math.random()<.25?x+[-1,1,2][Math.floor(Math.random()*3)]:x)}
function drum(kind,t){if(kind==='k'){tone(150,.14,'sine',.35,AU.mus,t,.002,45)}else if(kind==='s'){hissTo(.12,'highpass',1800,.7,.16,t);tone(220,.06,'triangle',.07,AU.mus,t)}else{hissTo(.03,'highpass',7000,.8,.06,t)}}
function hissTo(dur,type,f,q,vol,t){hiss(dur,type,f,q,vol,AU.mus,t)}
function bell(f,t,dur,vol){tone(f,dur,'sine',vol,AU.mus,t,.004);tone(f*2.01,dur*.6,'sine',vol*.35,AU.mus,t,.004);tone(f*3.02,dur*.3,'sine',vol*.15,AU.mus,t,.004)}
function scheduleStep(i,t){if(!MZ.motif){MZ.motif=newMotif();MZ.motifB=vary(MZ.motif)}const th=THEMES[MZ.theme]||THEMES.island;const spb=60/(th.bpm+(MZ.tense?22:0))/4;const s16=i%16,bar=Math.floor(i/16);
  const prog=MZ.tense?TENSE.prog:th.prog;const chordDeg=prog[bar%prog.length];
  if(s16===0){MZ.bar=bar;if(bar%8===0||!MZ.motif){MZ.motif=newMotif();MZ.motifB=vary(MZ.motif)}
    [0,2,4].forEach((k,j)=>tone(mtof(scaleNote(th,chordDeg+k,-1)),spb*15,'triangle',.035,AU.mus,t+j*.01,.08))}
  // bass
  if(s16%8===0||(MZ.tense&&s16%2===0))tone(mtof(scaleNote(th,chordDeg,-2)),spb*(MZ.tense?1.6:3.5),'sine',MZ.tense?.16:.2,AU.mus,t,.01);
  if(!MZ.tense&&s16===12&&th.drums)tone(mtof(scaleNote(th,chordDeg+4,-2)),spb*2,'sine',.14,AU.mus,t,.01);
  // drums
  if(th.drums||MZ.tense){if(s16===0||s16===8||(th.drums>1&&s16===10))drum('k',t);if(s16===4||s16===12)drum('s',t);if(s16%2===0||MZ.tense)drum('h',t)}
  // melody (eighth notes), A A' B A form across 4 bars
  if(s16%2===0){const ph=bar%4;const m=ph===2?MZ.motifB.slice().reverse():ph===1?MZ.motifB:MZ.motif;const deg=m[(s16/2)%8];
    if(deg!==null&&deg!==undefined&&!(MZ.tense&&Math.random()<.4)){const f=mtof(scaleNote(th,deg+chordDeg%3,0));if(th.bell)bell(f,t,spb*3,.05);else tone(f,spb*1.8,th.lead,th.lead==='square'?.035:.06,AU.mus,t,.01)}}
  if(MZ.tense&&s16===14&&bar%2===1){for(let k=0;k<4;k++)drum('s',t+k*spb/2)}}
function musicTick(){if(!AU.on||!P.music||document.hidden)return;const c=AU.ctx;if(MZ.next<c.currentTime-.2)MZ.next=c.currentTime+.05;
  const th=THEMES[MZ.theme]||THEMES.island;while(MZ.next<c.currentTime+.25){scheduleStep(MZ.step,MZ.next);MZ.step++;MZ.next+=60/(th.bpm+(MZ.tense?22:0))/4}}
setInterval(musicTick,50);
function setMusic(on){P.music=on;save();if(AU.mus)AU.mus.gain.setTargetAtTime(on?.22:0,auNow(),.3)}
ACTX.music=()=>{setMusic(!P.music);openSettings()};
const _openSettings=openSettings;openSettings=function(){_openSettings();const row=document.querySelector('#sheet .sheet-in .row');if(row)row.insertAdjacentHTML('beforeend',`<button class="btn ghost mini" data-a="music">${P.music?'🎵 מוזיקה פועלת':'🎵 מוזיקה כבויה'}</button>`)};
const _sndToggle=ACTX.sound;

/* ===================== per frame: steps, nature, tension ===================== */
const AS={stepT:0,wasAir:false,wasSwim:false,flyOn:false,ambT:{},prevY:0};
function surface(){if(ME.swim)return'water';const z=ME.zone;if(z==='inside'||z==='home'||z==='visit'||z==='work')return'wood';if(ME.y>.15)return'wood';
  if(z==='island'||z==='adv')return'grass';if(z==='city'&&ME.pos.x<CX-14.5)return'sand';return'stone'}
function dangerNow(){if(EXM||PANEL==='gate'&&EXM)return 1;if(typeof RUN!=='undefined'&&RUN)return 1;
  if(ME.zone==='adv'&&CREAT.some(c=>c.kind==='slime'&&Math.hypot(ME.pos.x-c.g.position.x,ME.pos.z-c.g.position.z)<6))return 1;
  if(ME.zone==='city'&&ME.pos.x<CX-14&&CREAT.some(c=>c.kind==='crab'&&Math.hypot(ME.pos.x-c.g.position.x,ME.pos.z-c.g.position.z)<5))return 1;
  if(PANEL==='gym'&&GYM)return 1;return 0}
function stepAudio(dt,mv){if(!AU.on)return;const t=auNow();
  const sky=ME.y>4&&ME.zone==='island'?'sky':null;const want=sky||ME.zone||'island';if(want!==MZ.theme){MZ.theme=want;MZ.motif=null}
  const tz=dangerNow();if(tz!==MZ.tense){MZ.tense=tz;MZ.motif=null;if(tz)tone(110,.6,'sawtooth',.05,AU.mus,null,.05,70)}
  // steps
  if(mv&&mv.moving&&!ME.air&&!mv.roll&&!P.riding){AS.stepT-=dt;if(AS.stepT<=0){AS.stepT=ME.swim?.6:mv.run?.24:.36;if(ME.swim)SND.stroke();else SND.step(surface())}}else AS.stepT=Math.min(AS.stepT,.05);
  if(P.riding&&mv&&mv.moving){AS.rideT=(AS.rideT||0)-dt;if(AS.rideT<=0){AS.rideT=.12;hiss(.12,'bandpass',600+Math.random()*200,2,.03)}}
  if(AS.wasAir&&!ME.air&&!ME.swim)SND.land();if(!AS.wasSwim&&ME.swim)SND.splash();if(!AS.wasAir&&ME.air&&ME.vy>3)SND.jump();
  if(mv&&mv.roll&&!AS.rolling)SND.roll();AS.rolling=!!(mv&&mv.roll);AS.wasAir=ME.air;AS.wasSwim=ME.swim;
  // nature beds
  const B=AU.beds,set=(b,v)=>b.g.gain.setTargetAtTime(v,t,.4);
  const sea=ME.zone==='city'?clamp((CX-8-ME.pos.x)/16,0,1):0;set(B.waves,(sea*.5+(ME.swim?.3:0))*(1+Math.sin(t*.35)*.35));B.waves.fl.frequency.setTargetAtTime(380+Math.sin(t*.35)*180,t,.5);
  set(B.hum,['city','road','town'].includes(ME.zone)&&sea<.5?.18:0);set(B.wind,clamp((ME.y-2)/6,0,1)*.5+(ME.zone==='adv'?.05:0));
  set(B.fly,ME.flying?.35:0);set(B.slime,ME.zone==='adv'?.12:0);
  // random nature sounds
  const r=(k,every,fn)=>{AS.ambT[k]=(AS.ambT[k]??Math.random()*every)-dt;if(AS.ambT[k]<=0){AS.ambT[k]=every*(.5+Math.random());fn()}};
  if(['island','town','girls','adv','road'].includes(ME.zone))r('bird',4,SND.bird);
  if(sea>.3)r('gull',7,SND.gull);if(ME.zone==='adv'){r('cr',2.5,SND.cricket);r('bl',1.4,SND.bloop)}if(ME.zone==='girls')r('ch',9,SND.chime);if(ME.zone==='boys')r('wh',11,SND.whistle)}
/* volume follows the existing sound switch */
setInterval(()=>{if(AU.fx){AU.fx.gain.value=P.sound?.8:0;AU.amb.gain.value=P.sound?.5:0}},500);
