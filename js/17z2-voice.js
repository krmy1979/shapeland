/* Shapeland · a world by Shirel Yitzhak */
/* ===================== HEBREW READ-ALOUD: for kids who can't read yet =====================
   With read-aloud on, the game speaks its Hebrew in a Hebrew voice:
   - every window that opens: its title and its explanation (then the English, as before)
   - messages (toast), the opening lines and the goal pill
   - press and hold any button for half a second: it says what the button does, without pressing it
   - a 🔊 button in every window reads all of it again, including the answer choices
   Kid-friendly speech: emojis are dropped, and "את/ה", "יכול/ה" are read in the player's own gender.
   On by default when the device has a Hebrew voice. Switch it in Settings or on the title screen. */
const RD={voice:null,last:'',lastT:0,heT:0,hold:null,eat:0};
function rdVoices(){try{const vs=speechSynthesis.getVoices();const he=vs.filter(v=>/^(he|iw)/i.test(v.lang));
  RD.voice=he.find(v=>/Natural|Online|Google|Neural/i.test(v.name))||he[0]||null;RD.checked=vs.length>0}catch(e){}return RD.voice}
try{rdVoices();speechSynthesis.addEventListener('voiceschanged',()=>{rdVoices();rdDefault();rdTitleBtn()})}catch(e){}
const rdOn=()=>!!P.readHe&&('speechSynthesis' in window);
function rdDefault(){if(P.readHe===undefined&&RD.voice){P.readHe=true;save();rdTitleBtn()}}
rdDefault();
/* text → something a speech voice reads naturally to a child */
function rdClean(t){const girl=!P.ch||P.ch.g!=='boy';
  return String(t||'').replace(/💎/g,' יהלומים ').replace(/✨/g,' ')
    .replace(/את\/ה/g,girl?'את':'אתה')
    .replace(/([֐-׿]+)\/ה(?![֐-׿])/g,(m,w)=>girl?w+'ה':w)
    .replace(/([֐-׿]+)\/ות(?![֐-׿])/g,(m,w)=>girl?w.replace(/ים$/,'')+'ות':w)
    .replace(/[\/·•|]/g,', ').replace(/[←→➤⤴↻⟲⟳＋－]/g,' ')
    .replace(/\p{Extended_Pictographic}|️|‍|[\u{1F1E6}-\u{1F1FF}]/gu,'')
    .replace(/\s*([,.!?:])\s*(?=[,.!?:])/g,'').replace(/\s+/g,' ').trim()}
/* Hebrew only: drop the English parts (they get their own English voice) */
function rdHebrewOf(el){if(!el)return'';const c=el.cloneNode(true);c.querySelectorAll('.en,[dir="ltr"],.lvbar,svg,img,script,style,.spk,.rd').forEach(x=>x.remove());return c.textContent}
function heSay(text,opt){opt=opt||{};if(!rdOn())return;const t=rdClean(text);if(!t||!/[֐-׿]/.test(t))return;
  const now=Date.now();if(t===RD.last&&now-RD.lastT<2500&&!opt.force)return;RD.last=t;RD.lastT=now;
  try{if(opt.cancel!==false)speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t.slice(0,320));u.lang='he-IL';u.rate=opt.rate||.95;u.pitch=1.05;if(RD.voice)u.voice=RD.voice;
    RD.heT=now;speechSynthesis.speak(u)}catch(e){}}
/* English after Hebrew: while Hebrew was just started, the English joins the queue instead of cutting it off */
const _sayRD=say;say=function(text,rate){if(!rdOn()||Date.now()-RD.heT>1500)return _sayRD(text,rate);
  try{const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=rate||.88;const vs=speechSynthesis.getVoices();const v=vs.find(v=>/en-US/i.test(v.lang)&&/Samantha|Google|Aria|Jenny|Female/i.test(v.name))||vs.find(v=>/^en/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}};

/* ---------- windows ---------- */
function rdSheetText(full){const s=$('#sheet .sheet-in');if(!s)return'';const parts=[];
  const h=s.querySelector('h2');if(h)parts.push(rdHebrewOf(h));
  s.querySelectorAll('p.sub,.sub,h3,.fb,.word').forEach((x,i)=>{if(full||i<2){const t=rdHebrewOf(x).trim();if(t&&!parts.includes(t))parts.push(t)}});
  if(full){const bs=[...s.querySelectorAll('button')].map(b=>rdHebrewOf(b).trim()).filter(t=>/[֐-׿]/.test(t));if(bs.length)parts.push('אפשר לבחור: '+bs.slice(0,8).join(', '))}
  return parts.filter(Boolean).join('. ')}
let rdSig='';
const _sheetRD=sheet;sheet=function(html){_sheetRD(html);const s=$('#sheet .sheet-in');if(!s)return;
  if(rdOn()&&!s.querySelector('.rd')){const b=document.createElement('button');b.className='rd';b.dataset.a='readsheet';b.setAttribute('aria-label','להקריא');b.textContent='🔊';s.appendChild(b)}
  if(!rdOn()||KEEP)return;const sig=(PANEL||'')+'|'+((s.querySelector('h2')||{}).textContent||'');if(sig===rdSig)return;rdSig=sig;
  setTimeout(()=>{if(!$('#sheet').hidden)heSay(rdSheetText(false))},30)};
const _closeRD=closeSheet;closeSheet=function(){rdSig='';return _closeRD.apply(this,arguments)};
ACTX.readsheet=()=>heSay(rdSheetText(true),{force:true});
/* ---------- messages and the opening ---------- */
const _toastRD=toast;toast=function(m){_toastRD(m);if(rdOn()&&!(typeof FT!=='undefined'&&FT.on))heSay(m,{cancel:false})};
const _pillRD=ftPill;ftPill=function(he,enl,prog){_pillRD(he,enl,prog);if(rdOn())heSay(he)};
const _cineRD=ftCine;ftCine=function(he,enl,ms){if(rdOn())heSay(he);_cineRD(he,enl,ms)};
/* in read-aloud mode the opening waits a little longer so the Hebrew line has time to be heard */
if(typeof ftCinematic==='function'){const _fcRD=ftCinematic;ftCinematic=function(){FT.gapMul=rdOn()?2.3:1;return _fcRD.apply(this,arguments)}}

/* ---------- press and hold a button to hear what it does ---------- */
const rdLabel=b=>{const al=b.getAttribute('aria-label');const t=rdHebrewOf(b).trim();return /[֐-׿]/.test(t)?t:(al||t)};
window.addEventListener('pointerdown',e=>{if(!rdOn())return;if(e.target.closest('#pad,#camBtns,#armBar'))return;const b=e.target.closest('button,[data-a],.tool');if(!b)return;clearTimeout(RD.hold);
  RD.hold=setTimeout(()=>{const l=rdLabel(b);if(!l)return;RD.eat=Date.now();b.classList.add('rdpulse');setTimeout(()=>b.classList.remove('rdpulse'),700);heSay(l,{force:true})},520)},true);
['pointerup','pointercancel','pointerleave'].forEach(t=>window.addEventListener(t,()=>clearTimeout(RD.hold),true));
window.addEventListener('click',e=>{if(Date.now()-RD.eat<600){e.stopPropagation();e.stopImmediatePropagation();e.preventDefault();RD.eat=0}},true);
window.addEventListener('contextmenu',e=>{if(rdOn()&&e.target.closest('button,[data-a]'))e.preventDefault()},true);

/* ---------- the switch: title screen + settings ---------- */
(()=>{const st=document.createElement('style');st.textContent=`
#sheet .sheet-in{position:relative}
.rd{position:absolute;top:10px;left:10px;width:44px;height:44px;border-radius:50%;border:0;background:#FDE68A;font-size:22px;box-shadow:0 3px 0 #EAB308;cursor:pointer;z-index:2}
.rd:active{transform:translateY(2px);box-shadow:0 1px 0 #EAB308}
.rdpulse{animation:rdPulse .7s ease}
@keyframes rdPulse{50%{transform:scale(1.12);box-shadow:0 0 0 8px #FDE68A99}}
#rdTitle{position:fixed;top:calc(env(safe-area-inset-top) + 12px);left:12px;z-index:30;border:0;border-radius:22px;padding:8px 14px;font:700 16px var(--f-body);background:#fffd;color:var(--ink);box-shadow:0 3px 0 #C9DCF3;cursor:pointer}
#rdTitle[aria-pressed="true"]{background:#FDE68A;box-shadow:0 3px 0 #EAB308}
`;document.head.appendChild(st)})();
function rdTitleBtn(){let b=$('#rdTitle');if(!b){b=document.createElement('button');b.id='rdTitle';b.dataset.a='readtoggle';$('#title').appendChild(b)}
  b.setAttribute('aria-pressed',String(!!P.readHe));b.textContent=P.readHe?'🔊 הקראה בעברית: פועלת':'🔇 הקראה בעברית: כבויה'}
rdTitleBtn();
ACTX.readtoggle=()=>{P.readHe=!P.readHe;save();rdTitleBtn();
  if(P.readHe){if(!rdVoices()&&RD.checked)toast('אין במכשיר הזה קול בעברית, אז ההקראה עלולה לא להישמע. בווינדוס: הגדרות ← זמן ושפה ← דיבור ← הוספת קול עברית');heSay('הקראה בעברית פועלת. לוחצים לחיצה ארוכה על כפתור כדי לשמוע מה הוא עושה',{force:true})}
  else try{speechSynthesis.cancel()}catch(e){}
  if(PANEL==='settings'){KEEP=true;openSettings();KEEP=false}};
const _settingsRD=openSettings;openSettings=function(){_settingsRD.apply(this,arguments);const row=document.querySelector('#sheet .sheet-in .row');
  if(row&&!row.querySelector('[data-a="readtoggle"]'))row.insertAdjacentHTML('afterbegin',`<button class="btn ghost mini" data-a="readtoggle">${P.readHe?'🗣️ הקראה בעברית: פועלת':'🗣️ הקראה בעברית: כבויה'}</button>`)};
/* the title screen: browsers allow speech only after a first touch, so the greeting waits for it */
window.addEventListener('pointerdown',function rdHello(e){if($('#title').hidden){window.removeEventListener('pointerdown',rdHello,true);return}
  if(!rdOn()||e.target.closest('#rdTitle'))return;window.removeEventListener('pointerdown',rdHello,true);
  if(!e.target.closest('[data-a="quickplay"],[data-a="play"]'))heSay('שלום! ברוכים הבאים לארץ הצורות. לוחצים על הכפתור הוורוד הגדול כדי לשחק')},true);
