/* Shapeland · a world by Shirel Yitzhak */
/* ===================== HUD ===================== */
function renderHud(){const L=level(),a=lvlXp(L),b=lvlXp(L+1);
  $('#meChip').innerHTML=`${charSVG(P.ch)}<div><b>${esc(P.name||'שחקן/ית')}</b><small>Level ${L}</small><div class="lvbar"><i style="width:${Math.round((P.xp-a)/(b-a)*100)}%"></i></div></div>`;
  $('#gemPill').textContent='💎 '+fmt(P.gems);renderQuestChip();if(['build','item'].includes(MODE))renderTray()}
function renderLoc(){$('#locChip').innerHTML=`📍 ${ME.zone==='visit'&&VISIT?'בבית של '+esc(VISIT.name||'חבר/ה'):esc(ME.zone==='inside'&&INSIDE&&SHOPS_IN[INSIDE.id]?SHOPS_IN[INSIDE.id].en:(ZNAME[ME.zone]||''))} · 🗺️`}
function renderQuestChip(){const q=P.quest;const el=$('#questChip');let h='';
  if(q){const[d,n]=questProgress(q);h+=`<button class="quest" data-a="questinfo"><span>🎯</span><span class="en">${esc(q.short)}</span><b>${d}/${n}</b></button>`}
  if(P.tour)h+=`<button class="quest" data-a="tourinfo" style="margin-top:6px;background:#FDE68A"><span>🧳</span><span class="en">Take Tom to the ${esc(P.tour.dest)}</span></button>`;
  if(P.safeTask)h+=`<button class="quest" data-a="saminfo" style="margin-top:6px;background:#C7D2FE;box-shadow:0 3px 0 #818CF8;color:var(--ink)"><span>🚦</span><span class="en">Cross safely!</span></button>`;
  if(P.mission)h+=`<button class="quest" data-a="mission" style="margin-top:6px;background:#BFE3FF;box-shadow:0 3px 0 #7FB8E8;color:var(--ink)"><span>🛒</span><span class="en">${esc(P.mission.short)}</span></button>`;el.innerHTML=h}
let friendsSig='';
function renderFriends(){const el=$('#friends');let h='';
  if(NET.state==='on'){const others=NET.peers.filter(p=>!p.sameTab);
    const gl=window.CLOUD&&CLOUD.gname?esc(CLOUD.gname):en(P.code);h+=`<span class="net">${others.length?`${others.length+1} מחוברים · ${gl}`:`רק את/ה כאן · ${gl}`}</span>`;
    h+=others.slice(0,6).map(p=>{const pr=p.presence||{};const where=pr.zone==='city'?'באשקלון':pr.zone==='town'?'בעיירה':pr.zone==='house'?(pr.host===P.key?'אצלך בבית':'בבית'):pr.zone==='work'?'בסדנה':'באי';
      return`<button class="fr" data-a="friend" data-p="${esc(p.peer)}"><span class="dot"></span>${charSVG(sanitizeCh(pr.ch))}<span>${esc(nameOf(p))} <span class="where">${where}</span></span></button>`}).join('')}
  else if(NET.state==='connecting')h=`<span class="net">מתחבר לחבורה…</span>`;
  else if(NET.state==='solo')h=`<span class="net">משחק לבד כרגע</span>`;
  if(window.CLOUD&&CLOUD.user){const n=Object.keys(CLOUD.invites||{}).length;h=`<button class="frbtn" data-a="friends">👫 חברים${n?` <b class="badge">${n}</b>`:''}</button>`+h}
  if(h!==friendsSig){friendsSig=h;el.innerHTML=h}}
function shapeIcon(k,color){return`<svg viewBox="0 0 24 24" fill="${color}" style="color:${color}">${ICONS[k]}</svg>`}
const TOOLS={walk:['🚶','הליכה'],build:['🧱','בנייה'],item:['🛋️','רהיטים'],room:['🏗️','חדרים'],door:['🚪','דלתות'],erase:['🧽','הסרה']};
function renderBar(){const z=ME.zone;const modes=z==='city'?(P.plots.length?['walk','build','erase']:['walk']):z==='town'?['walk']:z==='home'?['walk','build','item','room','door','erase']:z==='work'?['build','erase']:['walk','build','erase'];
  let h=modes.map(m=>`<button class="tool" data-a="mode" data-v="${m}" aria-pressed="${MODE===m}"><span>${TOOLS[m][0]}</span>${TOOLS[m][1]}</button>`).join('');
  if(z==='home')h+=`<button class="tool go" data-a="goto" data-v="work"><span>🛠️</span>סדנה</button>`;
  if(z==='work')h+=`<button class="tool go" data-a="savefurn"><span>💾</span>לשמור רהיט</button><button class="tool" data-a="goto" data-v="home"><span>🏠</span>הבית</button>`;
  if(z==='home'||z==='visit')h+=`<button class="tool" data-a="goto" data-v="island"><span>🌳</span>החוצה</button>`;
  h+=`<button class="tool" data-a="map"><span>🗺️</span>מפה</button><button class="tool" data-a="arena"><span>🏆</span>תחרות</button><button class="tool" data-a="settings"><span>⚙️</span>עוד</button>`;
  $('#bar').innerHTML=h}
function renderTray(){const t=$('#tray');const show=['build','item','room','door'].includes(MODE)&&ME.zone!=='town'&&!(ME.zone==='city'&&!P.plots.length);t.hidden=!show;if(!show)return;
  if(MODE==='build'){t.innerHTML=`<div class="scroll" role="group" aria-label="צורות">${Object.keys(SHAPES).map(k=>{const own=P.owned.includes(k);
      return`<button class="shp ${own?'':'lock'}" data-a="sel" data-k="s" data-v="${k}" aria-pressed="${SEL.s===k}" aria-label="${SHAPES[k].he}">${shapeIcon(k,own?COLS[SEL.c][0]:'#A9B6CC')}${en(k)}</button>`}).join('')}</div>
    <div class="scroll" role="group" aria-label="צבעים">${Object.entries(COLS).map(([k,v])=>`<button class="col" style="background:${v[0]}" data-a="sel" data-k="c" data-v="${k}" aria-pressed="${SEL.c===k}" aria-label="${k}"></button>`).join('')}</div>
    <div class="trow">${Object.keys(SIZES).map(k=>`<button class="sz en" data-a="sel" data-k="sz" data-v="${k}" aria-pressed="${SEL.sz===k}">${k}</button>`).join('')}
      <button class="sz" data-a="rot" aria-label="סיבוב">↻</button><span class="cost">💎1 · ${en('big')} 💎2</span></div>`;return}
  if(MODE==='item'){const inv=Object.entries(P.inv).filter(([k,n])=>n>0&&(MODELS[k]||P.furn[k]));if(inv.length&&!inv.some(([k])=>k===SEL.item))SEL.item=inv[0][0];
    t.innerHTML=inv.length?`<div class="scroll">${inv.map(([k,n])=>`<button class="shp" data-a="selitem" data-v="${esc(k)}" aria-pressed="${SEL.item===k}"><span class="n">${n}</span><span class="em">${MODELS[k]?MODELS[k].em:'🛠️'}</span>${en(itemName(k,P.furn))}</button>`).join('')}</div>
      <div class="trow"><button class="sz" data-a="rot">↻ סיבוב</button><span class="cost">נוגעים ברצפה כדי להציב</span></div>`
      :`<p class="tip">אין רהיטים במלאי. קונים ב־${en('Furniture Store')} בעיירה, או בונים בסדנה 🛠️</p>`;return}
  if(MODE==='room'){t.innerHTML=`<div class="scroll">${Object.entries(ROOMS).map(([k,v])=>`<button class="shp" data-a="selroom" data-v="${k}" aria-pressed="${SEL.room===k}"><span class="em" style="width:26px;height:26px;border-radius:8px;background:${roomStyle(P.house,k).floor};display:block;margin:2px"></span>${en(v.en)}</button>`).join('')}
      <button class="shp" data-a="selroom" data-v="erase" aria-pressed="${SEL.room==='erase'}"><span class="em">❌</span>${en('remove')}</button></div>
    ${SEL.room!=='erase'?`<div class="trow"><button class="sz" data-a="paintmode" data-v="floor" aria-pressed="${SEL.paint==='floor'}">${en('floor')}</button><button class="sz" data-a="paintmode" data-v="wall" aria-pressed="${SEL.paint==='wall'}">${en('wall')}</button>
      <div class="scroll" style="flex:1">${Object.entries(PAINTS).map(([k,v])=>`<button class="col" style="background:${v}" data-a="paint" data-v="${k}" aria-label="${k}"></button>`).join('')}</div></div>`:''}
    <p class="tip">נוגעים במשבצות כדי לצייר ${SEL.room==='erase'?'מחיקה':'חדר: '+ROOMS[SEL.room].he}</p>`;return}
  if(MODE==='door')t.innerHTML=`<p class="tip">נוגעים בקיר כדי להפוך אותו ל־${en('door')} 🚪, ובדלת כדי לסגור אותה. צבע הבית מבחוץ:</p><div class="scroll" style="justify-content:center">${['#FDE68A','#FBCFE8','#BFDBFE','#BBF7D0','#DDD6FE','#FED7AA','#FFFFFF','#FCA5A5'].map(c=>`<button class="col" style="background:${c}" data-a="hcolor" data-v="${c}" aria-pressed="${P.house.color===c}"></button>`).join('')}</div>`}
