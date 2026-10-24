/* Shapeland · a world by Shirel Yitzhak */
/* ===================== BEAUTY: looks from around the world, eye colors, brows, makeup sets =====================
   "Looks" are a starting point only: one tap sets skin, hair, eyes and brows, then every part can be changed.
   Makeup basics (eyeshadow, liner, blush, freckles, lip tints) are free in the mirror.
   Lipsticks, mascara, glitter and face gems are bought in the Makeup Studio (money practice). */
const LOOKS=[
  ['eth','השראה אתיופית','Ethiopian look',{skin:'#7E4E31',hc:'#1F1B1A',eyes:'doe',ec:'#2B1A10',bro:'arch'},{girl:'boxbraids',boy:'curlyshort'}],
  ['eu','השראה אירופית','European look',{skin:'#FFE3CC',hc:'#E8C268',eyes:'big',ec:'#3B82C4',bro:'soft'},{girl:'long',boy:'side'}],
  ['kr','השראה קוריאנית','Korean look',{skin:'#F9DFCB',hc:'#1F1B1A',eyes:'almond',ec:'#2B1A10',bro:'straight'},{girl:'bangs',boy:'fringe'}],
  ['cn','השראה סינית','Chinese look',{skin:'#EFC9A4',hc:'#1F1B1A',eyes:'almond',ec:'#5B3A22',bro:'soft'},{girl:'spacebuns',boy:'short'}],
  ['il','השראה ישראלית','Israeli look',{skin:'#D69A6B',hc:'#4A2E1F',eyes:'big',ec:'#8A6A2E',bro:'bold'},{girl:'curly',boy:'curlyshort'}],
  ['in','השראה הודית','Indian look',{skin:'#B07A52',hc:'#1F1B1A',eyes:'doe',ec:'#2B1A10',bro:'arch'},{girl:'long',boy:'side'}],
  ['af','השראה אפריקאית','African look',{skin:'#4A2C1A',hc:'#1F1B1A',eyes:'doe',ec:'#2B1A10',bro:'bold'},{girl:'afropuffs',boy:'buzz'}],
  ['la','השראה לטינית','Latin look',{skin:'#E3A97F',hc:'#4A2E1F',eyes:'big',ec:'#5B3A22',bro:'arch'},{girl:'ponytail',boy:'short'}],
  ['gn','ג׳ינג׳י עם נמשים','ginger with freckles',{skin:'#FFE3CC',hc:'#C8562A',eyes:'sparkle',ec:'#3E8E5A',bro:'soft',frk:1},{girl:'ponytail',boy:'side'}]];
/* makeup sets: lip = [studio lipstick if owned, free tint otherwise] */
const MKSETS=[
  ['natural','🌿','טבעי','natural',{sh:'#E8C9A0',liner:0,blc:'#FFB38A',glit:0,gem:'none'},['#FF7F50','#D9877A'],{lash:1}],
  ['kpop','🌸','קיי־פופ','K-pop',{sh:'#F9A8D4',liner:0,blc:'#FF9EB5',glit:0,gem:'none',bro:'straight'},['#FF5C9A','#FF8FB1'],{lash:1}],
  ['princess','👑','נסיכה','princess',{sh:'#C4B5FD',liner:0,blc:'#FF9EB5',glit:0},['#FF5C9A','#FF8FB1'],{lash:1,gem:'pearl'}],
  ['party','✨','מסיבה','party glam',{sh:'#C4B5FD',liner:1,blc:'#F472B6',gem:'none'},['#E11D48','#B83268'],{lash:1,glit:1,gem:'star'}],
  ['festival','🌈','פסטיבל','festival',{sh:'#93C5FD',liner:1,blc:'#FFB38A'},['#A855F7','#FF8FB1'],{glit:1,gem:'heart'}],
  ['sunset','🌅','שקיעה','sunset',{sh:'#FDBA74',liner:1,blc:'#FFB38A',glit:0,gem:'none'},['#FF7F50','#F59E7A'],{lash:1}],
  ['gold','🌟','זהב','golden',{sh:'#FCD34D',liner:1,blc:'#E0607E',glit:0},['#E11D48','#B83268'],{gem:'star'}],
  ['clean','🧼','בלי איפור','no makeup',{sh:'none',liner:0,blc:'#FF9EB5',glit:0,gem:'none',lash:0,lip:'none'},null,{}]];
const mkOwn=id=>(P.makeup||[]).includes(id);
function refreshAv(){save();KEEP=true;openAvatar();if(!$('#title').hidden)$('#titleAv').innerHTML=charSVG(P.ch)}
ACTX.look=d=>{const L=LOOKS.find(x=>x[0]===d.v);if(!L)return;const girl=P.ch.g==='girl';Object.assign(P.ch,{frk:0},L[3],{hair:L[4][girl?'girl':'boy']});
  say(L[2]);sfx.coin&&sfx.coin();toast('✨ זו רק נקודת התחלה: אפשר לשנות כל דבר למטה');refreshAv()};
ACTX.mkset=d=>{const M=MKSETS.find(x=>x[0]===d.v);if(!M)return;const c=P.ch;Object.assign(c,M[4]);
  if(M[5])c.lip=mkOwn('lip:'+M[5][0])?M[5][0]:M[5][1];const miss=[];
  Object.entries(M[6]).forEach(([k,v])=>{const id=k==='gem'?'gem:'+v:k;if(!v||mkOwn(id))c[k]=v;else miss.push(k==='gem'?GEMS[v][2]:k==='lash'?'🖌️':'✨')});
  say(M[3]+' makeup');burst('💄');toast(miss.length?`💄 ${M[2]}! עם ${miss.join(' ')} מ־Makeup Studio זה יהיה מושלם`:`💄 ${M[2]}!`);refreshAv()};
ACTX.bset=d=>{P.ch[d.k]=d.v;say(d.t||'');refreshAv()};
/* the mirror (avatar panel): looks at the top, eyes & brows, full makeup table */
const _openAvatarB=openAvatar;openAvatar=function(){_openAvatarB();const c=sanitizeHuman(P.ch);const box=document.querySelector('#sheet .sheet-in');if(!box)return;
  const secEl=t=>[...box.querySelectorAll('h3')].find(h=>h.textContent.startsWith(t));const wrap=h=>h&&h.parentElement;
  const sec=(h,body,note)=>`<div style="display:flex;flex-direction:column;gap:6px"><h3>${h}</h3>${note?`<p class="sub">${note}</p>`:''}<div class="chips">${body}</div></div>`;
  const pr=(k,v)=>`aria-pressed="${String(c[k])===String(v)}"`;
  const swb=(k,list,none)=>(none?`<button class="sw" style="background:#F6CBA5" data-a="bset" data-k="${k}" data-v="none" data-t="none" ${pr(k,'none')} aria-label="בלי">∅</button>`:'')+
    list.map(([v,e,he])=>`<button class="sw" style="background:${v}" data-a="bset" data-k="${k}" data-v="${v}" data-t="${e}" ${pr(k,v)} aria-label="${he||e}"></button>`).join('');
  /* 1) looks from around the world, with a tiny portrait of how it would look on me */
  const girl=c.g==='girl';
  const looks=LOOKS.map(([id,he,e,f,h])=>`<button class="ochip lookc" data-a="look" data-v="${id}" style="flex-direction:column;padding:4px 6px"><span style="width:68px;height:66px;display:block">${charSVG(Object.assign({},c,{frk:0},f,{hair:h[girl?'girl':'boy']})).replace('viewBox="0 -14 200 248"','viewBox="18 -18 164 158" style="width:68px;height:66px;max-width:none;max-height:none"')}</span><b style="font-size:.78em">${he}</b>${en(e)}</button>`).join('');
  const sk=wrap(secEl('צבע עור'));if(sk)sk.insertAdjacentHTML('beforebegin',sec('🌍 מראות מכל העולם',looks,'בוחרים מראה ואז משנים מה שרוצים: עור, שיער, עיניים ואיפור'));
  /* 2) eye color + brows right after the eye shapes */
  const ey=wrap(secEl('עיניים'));if(ey)ey.insertAdjacentHTML('afterend',sec('צבע עיניים 👁️',swb('ec',EYEC))+sec('גבות',Object.entries(BROWS).map(([v,[he,e]])=>`<button class="ochip" data-a="bset" data-k="bro" data-v="${v}" data-t="${e}" ${pr('bro',v)}>${he}${en(e)}</button>`).join('')));
  /* 3) the full makeup table replaces the small makeup row */
  const old=wrap(secEl('איפור'));
  const lipsOwned=LIPS.filter(([col])=>mkOwn('lip:'+col));
  const lipRow=`<button class="sw" style="background:#F6CBA5" data-a="bset" data-k="lip" data-v="none" data-t="no lipstick" ${pr('lip','none')} aria-label="בלי">∅</button>`+[...LIPS_FREE,...lipsOwned.map(([v,n])=>[v,n+' lipstick'])].map(([v,e,he])=>`<button class="sw" style="background:${v}" data-a="bset" data-k="lip" data-v="${v}" data-t="${e}" ${pr('lip',v)} aria-label="${he||e}"></button>`).join('');
  const tog=(k,em,he,e)=>`<button class="ochip" data-a="mktog" data-v="${k}" aria-pressed="${!!c[k]}">${em} ${he}${en(e)}</button>`;
  const gemsOwned=Object.entries(GEMS).filter(([k])=>mkOwn('gem:'+k));
  let mk=`<div class="mkbox" style="display:flex;flex-direction:column;gap:8px;background:linear-gradient(135deg,#FFF1F7,#F5F0FF);border-radius:18px;padding:10px">
    <h3>💄 סטים של איפור</h3><div class="chips">${MKSETS.map(([id,em,he,e])=>`<button class="ochip" data-a="mkset" data-v="${id}">${em} ${he}${en(e)}</button>`).join('')}</div>
    <h3>צללית לעיניים</h3><div class="chips">${swb('sh',SHADOWS,1)}</div>
    <h3>סומק</h3><div class="chips">${swb('blc',BLUSH,1)}</div>
    <h3>שפתיים</h3><div class="chips">${lipRow}</div>
    <div class="chips">${tog('liner','✒️','אייליינר','eyeliner')}${tog('frk','🟤','נמשים','freckles')}${mkOwn('lash')?tog('lash','🖌️','מסקרה','mascara'):''}${mkOwn('glit')?tog('glit','✨','נצנצים','glitter'):''}</div>
    ${gemsOwned.length?`<h3>אבני חן לפנים</h3><div class="chips"><button class="ochip" data-a="bset" data-k="gem" data-v="none" ${pr('gem','none')}>∅${en('no gems')}</button>${gemsOwned.map(([k,[he,e,em]])=>`<button class="ochip" data-a="bset" data-k="gem" data-v="${k}" data-t="${e}" ${pr('gem',k)}>${em} ${he}${en(e)}</button>`).join('')}</div>`:''}
    <p class="sub">שפתונים מיוחדים, מסקרה, נצנצים ואבני חן לפנים קונים ב־Makeup Studio בגן הבנות 🌸</p></div>`;
  if(old)old.outerHTML=mk;else{const done=box.querySelector('[data-a="avdone"]');if(done)done.insertAdjacentHTML('beforebegin',mk)}};
/* the studio sells face gems too */
const _openMakeupB=openMakeup;openMakeup=function(){_openMakeupB();const g=document.querySelector('#sheet .goods');if(!g)return;
  g.insertAdjacentHTML('beforeend',Object.entries(GEMS).map(([k,[he,e,em,p]])=>{const o=mkOwn('gem:'+k);return`<button class="good ${o?'lock':''}" data-a="buymk" data-v="gem:${k}"><span class="em">${em}</span>${he}${en(e)}<span class="pr">${o?'✓ יש לך':'💎 '+p}</span></button>`}).join(''))};
const _buymkB=ACTX.buymk;ACTX.buymk=d=>{if(!String(d.v).startsWith('gem:'))return _buymkB(d);if(mkOwn(d.v))return;const k=d.v.slice(4),G=GEMS[k];if(!G)return;
  if(P.gems<G[3]){toast(`חסרים ${fmt(G[3]-P.gems)} 💎`);sfx.bad();return}P.gems-=G[3];P.makeup.push(d.v);logm('סטודיו איפור','Makeup',-G[3]);
  P.ch.gem=k;save();rebuildMe();renderHud();sfx.coin();burst(G[2]);say('Face gems! So shiny!');KEEP=true;openMakeup()};
