/* Shapeland · a world by Shirel Yitzhak */
/* ===================== REAL PEOPLE · portraits and the new wardrobe in the mirror =====================
   Portraits (the mirror, the title screen, friends lists) are small renders of the real 3D person, so the picture always matches the game. */
const RPORT={r:null,sc:null,cache:new Map()};
function realPortrait(c,mode){c=sanitizeHuman(c);mode=mode||'full';const key=mode+JSON.stringify(c);let url=RPORT.cache.get(key);
  if(!url){try{if(!RPORT.r){const cv=document.createElement('canvas');RPORT.r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true});
        RPORT.r.outputEncoding=renderer.outputEncoding;RPORT.r.toneMapping=renderer.toneMapping;RPORT.r.toneMappingExposure=renderer.toneMappingExposure;
        const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight('#FFFFFF','#B9A48A',.8));const d=new THREE.DirectionalLight('#FFF4E6',.95);d.position.set(2,3,5);sc.add(d);const f=new THREE.DirectionalLight('#CFE0FF',.35);f.position.set(-3,2,2);sc.add(f);RPORT.sc=sc}
      const face=mode==='face',W=face?220:240,Hh=face?220:300;RPORT.r.setSize(W,Hh,false);
      const o=real3D(c);o.rotation.y=face?.12:.22;RPORT.sc.add(o);
      const cam=new THREE.PerspectiveCamera(26,W/Hh,.05,20);if(face){cam.position.set(0,1.69,1.32);cam.lookAt(0,1.67,0)}else{cam.position.set(0,1.05,4.9);cam.lookAt(0,1.02,0)}
      RPORT.r.render(RPORT.sc,cam);url=RPORT.r.domElement.toDataURL('image/png');RPORT.sc.remove(o);o.traverse(m=>{if(m.isMesh)m.geometry.dispose()});
      if(RPORT.cache.size>80)RPORT.cache.delete(RPORT.cache.keys().next().value);RPORT.cache.set(key,url)}catch(e){return humanSVG(c)}}
  return mode==='raw'?url:`<img src="${url}" alt="" draggable="false" style="width:100%;height:100%;object-fit:contain;display:block">`}
/* full body for big pictures, a face for the little round ones (CSS picks) */
const _charSVGR=charSVG;charSVG=function(c){if(c&&c.kind==='human'){const f=realPortrait(c,'full'),h=realPortrait(c,'face');return`<span class="rpw"><span class="rpf">${f}</span><span class="rph">${h}</span></span>`}return _charSVGR.apply(this,arguments)};
(()=>{const st=document.createElement('style');st.textContent=`.rpw{display:block;flex:none}.rpw>span{display:block;width:100%;height:100%}.rpw .rph{display:none}
.chip .rpw,.fr .rpw,.shp .rpw,.npchead .face .rpw,.ochip .rpw,.pickchip .rpw{border-radius:50%;overflow:hidden;background:var(--soft)}
.chip .rpw .rpf,.fr .rpw .rpf,.shp .rpw .rpf,.npchead .face .rpw .rpf,.ochip .rpw .rpf,.pickchip .rpw .rpf{display:none}
.chip .rpw .rph,.fr .rpw .rph,.shp .rpw .rph,.npchead .face .rpw .rph,.ochip .rpw .rph,.pickchip .rpw .rph{display:block}
.chip .rpw{width:38px;height:38px}.fr .rpw,.shp .rpw{width:28px;height:28px}.npchead .face .rpw{width:50px;height:50px}.ochip .rpw{width:30px;height:30px}.pickchip .rpw{width:24px;height:24px}
.preview .rpw{width:min(190px,48vw);height:min(238px,60vw)}.preview.small .rpw{width:min(130px,34vw);height:min(163px,42vw)}.opt.lopt .rpw{width:70px;height:88px}.clue .rpw{width:56px;height:70px}`;document.head.appendChild(st)})();

/* the mirror: clothes styles, jackets, shoes, jeans colors */
const _openAvatarR=openAvatar;openAvatar=function(){if(P.ch.bot==='jeans'&&!DENIM.some(x=>x[0]===P.ch.bc)){P.ch.bc='#3B5B8C';save()}_openAvatarR();const c=sanitizeHuman(P.ch);const box=document.querySelector('#sheet .sheet-in');if(!box)return;
  const hEl=t=>[...box.querySelectorAll('h3')].find(h=>h.textContent.trim().startsWith(t));
  const sec=(h,body)=>`<div style="display:flex;flex-direction:column;gap:6px"><h3>${h}</h3><div class="chips">${body}</div></div>`;
  const pr=(k,v)=>`aria-pressed="${String(c[k])===String(v)}"`;
  const chip=(k,v,he,e,pre)=>`<button class="ochip" data-a="bset" data-k="${k}" data-v="${v}" data-t="${e}" ${pr(k,v)}>${pre||''}${he}${en(e)}</button>`;
  const sw=(k,list)=>list.map(([v,e,he])=>`<button class="sw" style="background:${v}" data-a="bset" data-k="${k}" data-v="${v}" data-t="${e}" ${pr(k,v)} aria-label="${he||e}"></button>`).join('');
  /* jeans get denim colors instead of the plain pants colors */
  if(c.bot==='jeans'){const h=hEl('צבע המכנסיים');if(h)h.parentElement.outerHTML=sec('צבע הג׳ינס 👖',sw('bc',DENIM))}
  const bottom=hEl('למטה');const anchor=bottom&&bottom.parentElement;
  let h=sec('סגנון החולצה 👕',Object.entries(TOPS).map(([v,[he,e]])=>chip('ts',v,he,e)).join(''));
  if(c.ts!=='hoodie')h+=sec('שרוולים',chip('sl','short','קצרים','short sleeves')+chip('sl','long','ארוכים','long sleeves'));
  h+=sec('ג׳קט 🧥',Object.entries(JACKETS).map(([v,[he,e,col]])=>chip('jk',v,he,e,col?`<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${col};border:1px solid #0002;margin-inline-end:4px;vertical-align:middle"></span>`:'')).join(''));
  h+=sec('נעליים 👟',sw('shc',SHOES));
  if(anchor)anchor.insertAdjacentHTML('afterend',h)};
