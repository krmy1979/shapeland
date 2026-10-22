/* Shapeland · a world by Shirel Yitzhak */
/* ===================== HIDDEN LEARNING: QUESTIONS ===================== */
let USED=new Set();
function pickTier(arr,t,key){
  let c=arr.filter(x=>(x.tr===t||x.tr===t-1)&&!USED.has(key(x)));
  if(!c.length)c=arr.filter(x=>x.tr<=t&&!USED.has(key(x)));if(!c.length)c=arr.filter(x=>!USED.has(key(x)));if(!c.length)c=arr;
  const pref=c.filter(x=>x.tr===t);const x=pick(pref.length&&Math.random()<.65?pref:c);USED.add(key(x));return x}
function wordFor(t,filter){const pool=WORDS.filter(x=>!filter||filter(x));return pickTier(pool,t,x=>x.en)}
function distract(w,n,field,needEm){const pool=WORDS.filter(x=>x.en!==w.en&&x[field]!==w[field]&&(!needEm||x.em));
  const same=shuffle(pool.filter(x=>x.t===w.t)),other=shuffle(pool.filter(x=>x.t!==w.t));const out=[];
  for(const x of same.concat(other)){if(!out.some(o=>o[field]===x[field]))out.push(x);if(out.length>=n)break}return out}
function qVocab(r){const t=tierFor(r),w=wordFor(t);const mode=(!w.em||r>=6)?(Math.random()<.35?'en2he':'he2en'):'pic';
  if(mode==='pic'){const d=distract(w,3,'en');return{type:'choice',skill:'vocab',prompt:`<div class="pic">${w.em}</div><div class="sub">${en('What is this?')}</div>`,
    opts:shuffle([w,...d]).map(x=>({html:en(x.en),val:x.en})),ans:w.en,sayAfter:w.en,word:w.en,showAns:w.en}}
  if(mode==='he2en'){const d=distract(w,3,'en');return{type:'choice',skill:'vocab',prompt:`${w.em?`<div class="pic">${w.em}</div>`:''}<div class="word">${esc(w.he)}</div><div class="sub">ומה זה באנגלית?</div>`,
    opts:shuffle([w,...d]).map(x=>({html:en(x.en),val:x.en})),ans:w.en,sayAfter:w.en,word:w.en,showAns:w.en}}
  const d=distract(w,3,'he');return{type:'choice',skill:'vocab',sayFirst:w.en,prompt:`<div class="word">${en(w.en)}</div><button class="spk" data-a="sayq">🔊</button>`,
    opts:shuffle([w,...d]).map(x=>({html:esc(x.he),val:x.he})),ans:w.he,sayAfter:w.en,word:w.en,showAns:w.en+' = '+w.he}}
function qListen(r){const t=tierFor(r);
  if(r>=6){const s=pickTier(SENTS,t,x=>x.en);const others=shuffle(SENTS.filter(x=>x.en!==s.en)).slice(0,3);
    return{type:'choice',skill:'listen',sayFirst:s.en,one:true,prompt:`<button class="spk huge" data-a="sayq" aria-label="להשמיע שוב">🔊</button>`,
      opts:shuffle([s,...others]).map(x=>({html:esc(x.he),val:x.he})),ans:s.he,sayAfter:s.en,showAns:s.en}}
  const w=wordFor(t,x=>!!x.em);const d=distract(w,3,'en',true);
  return{type:'choice',skill:'listen',sayFirst:w.en,word:w.en,prompt:`<button class="spk huge" data-a="sayq" aria-label="להשמיע שוב">🔊</button>`,
    opts:shuffle([w,...d]).map(x=>({html:`<span class="pic">${x.em}</span>`,val:x.en,aria:x.he})),ans:w.en,sayAfter:w.en,showAns:w.em+' '+w.en}}
function qSpell(r){const t=tierFor(r),maxLen=3+Math.ceil(r);
  const w=wordFor(Math.min(5,t+1),x=>!x.en.includes(' ')&&x.en.length<=maxLen&&x.en.length>=3);
  const letters=w.en.split('');const dec=r>=7?2:r>=4?1:0;const abc='abcdefghiklmnoprstuwy';const extra=[];
  while(extra.length<dec){const l=pick(abc.split(''));if(!letters.includes(l))extra.push(l)}
  return{type:'build',skill:'spell',joiner:'',target:letters,tokens:shuffle(letters.concat(extra)),sayFirst:w.en,word:w.en,
    prompt:`${w.em?`<div class="pic">${w.em}</div>`:''}<div class="word">${esc(w.he)}</div><button class="spk" data-a="sayq">🔊</button>`,sayAfter:w.en,showAns:w.en}}
function qSentence(r){const s=pickTier(SENTS,tierFor(r),x=>x.en);const words=s.en.split(' ');
  const pool=['is','am','are','the','a','to','do','it'].filter(x=>!words.map(v=>v.toLowerCase()).includes(x));
  const extra=r>=8?shuffle(pool).slice(0,2):r>=5?shuffle(pool).slice(0,1):[];
  return{type:'build',skill:'sentence',joiner:' ',target:words,tokens:shuffle(words.concat(extra)),sayAfter:s.en,showAns:s.en,sayText:s.en,
    prompt:`<div class="word" style="font-size:21px">${esc(s.he)}</div><button class="spk" data-a="sayq">🔊</button>`}}
function qTalk(r){const d=pickTier(DIALOGS,tierFor(r),x=>x.npc);const hide=r>=7;
  return{type:'choice',skill:'talk',talk:true,sayFirst:d.npc,one:true,note:d.note,
    prompt:`<div class="bubble" style="width:100%;text-align:start">${hide?`<span id="npcTxt" hidden>${en(d.npc)}</span><span id="npcHid">🎧 …</span>`:en(d.npc)}</div>
      <div class="row" style="justify-content:center"><button class="spk" data-a="sayq">🔊</button>${hide?'<button class="btn ghost mini" data-a="reveal">👀</button>':''}<button class="btn ghost mini" data-a="hint">💡</button></div>
      <div class="hint" id="hintTxt" hidden>${esc(d.hn)}</div>`,
    opts:shuffle([d.c,...d.w]).map(x=>({html:en(x),val:x})),ans:d.c,sayAfter:d.c,showAns:d.c,heAns:d.hc}}
function qMath(r){const d=clamp(Math.round(r),1,10);let e,h='',a;const fruit=pick(WORDS.filter(x=>x.t==='food'&&x.em&&x.tr===1));
  if(d===1){const x=rnd(1,10),y=rnd(1,10);a=x+y;e=`${x} + ${y} = ?`}
  else if(d===2){const x=rnd(10,60),y=rnd(1,x);if(Math.random()<.5){a=x+y;e=`${x} + ${y} = ?`}else{a=x-y;e=`${x} − ${y} = ?`}}
  else if(d===3){const x=rnd(2,5),y=rnd(2,10);a=x*y;e=`${x} × ${y} = ?`}
  else if(d===4){const p=rnd(2,9),n=rnd(2,6);a=p*n;e=`One ${fruit.en} costs ${p} gems. How much do ${nw(n)} cost?`;h=`${fruit.em} אחד עולה ${p}. כמה עולים ${n}?`}
  else if(d===5){const b=rnd(2,10),q=rnd(2,10);a=q;e=`${b*q} ÷ ${b} = ?`}
  else if(d===6){const p=rnd(3,19),pay=p<10?10:20;a=pay-p;e=`You buy ${fruit.en} for ${p} gems and pay ${pay}. What is your change?`;h=`קונים ${fruit.em} ב־${p} ומשלמים ${pay}. כמה עודף?`}
  else if(d===7){const x=rnd(3,9),y=rnd(3,9);a=x*y;e=`A room is ${x} meters long and ${y} meters wide. What is the area?`;h=`חדר ${x} על ${y} מטר. מה השטח?`}
  else if(d===8){const p=pick([40,60,80,100,120,200]),pc=pick([10,20,25,50]);a=p-p*pc/100;e=`A bike costs ${p}. Today there is ${pc}% off. What is the new price?`;h=`אופניים ב־${p} עם הנחה של ${pc}%. מה המחיר?`}
  else if(d===9){const s=pick([100,200,500,1000]),pc=pick([5,10]);a=s+s*pc/100;e=`You save ${s} in the bank with ${pc}% interest a year. How much after one year?`;h=`חוסכים ${s} בריבית ${pc}% לשנה. כמה אחרי שנה?`}
  else{const s=pick([1200,1500,2000]),rent=pick([500,600,700]),food=pick([300,350,400]);a=s-rent-food;e=`Salary ${s}. Rent ${rent}. Food ${food}. How much is left?`;h=`משכורת ${s}, שכר דירה ${rent}, אוכל ${food}. כמה נשאר?`}
  return{type:'choice',skill:'math',sayText:/[a-z]/i.test(e)?e:null,prompt:`<div class="word en" dir="ltr" style="font-size:${e.length>20?20:34}px;line-height:1.35">${esc(e)}</div>${h?`<button class="btn ghost mini" data-a="hint">💡</button><div class="hint" id="hintTxt" hidden>${esc(h)}</div>`:''}`,
    opts:numOpts(a),ans:String(a),showAns:fmt(a)}}
function numOpts(a){const step=a>=100?pick([10,20,5]):a>=20?pick([1,2,5,10]):1;const set=new Set([a]);let k=1;
  while(set.size<4){const v=a+(Math.random()<.5?-1:1)*step*rnd(1,3)*k;if(v>=0)set.add(v);k++;if(k>30)set.add(a+set.size*7)}
  return shuffle([...set]).map(v=>({html:`<span class="en" dir="ltr">${fmt(v)}</span>`,val:String(v)}))}
function makeQ(type,r){if(type==='vocab')return qVocab(r);if(type==='listen')return qListen(r);if(type==='spell')return qSpell(r);
  if(type==='sentence')return qSentence(r);if(type==='talk')return qTalk(r);return qMath(r)}
function learnResult(skill,ok,word){P.sk[skill]=clamp(P.sk[skill]+(ok?.35:-.35),1,10);if(ok&&word)P.learned[word]=(P.learned[word]||0)+1;save()}
const listEn=arr=>arr.length<2?arr[0]:arr.slice(0,-1).join(', ')+' and '+arr[arr.length-1];
