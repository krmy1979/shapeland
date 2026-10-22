/* Shapeland · a world by Shirel Yitzhak */
let uid=0;
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;
  const f=c=>Math.round(amt<0?c*(1+amt):c+(255-c)*amt);return'#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('')}

/* ===================== CHARACTER SVG ===================== */
function charSVG(c){
  const id='pt'+(++uid),col=c.color,dk=shade(col,-.28),lt=shade(col,.45),ink='#1D2A48';
  const w=+c.w,h=+c.h,cx=100,cy=128;
  let body='',top,bot,side,fy=cy-8*h;
  const fill=c.pat==='plain'?col:`url(#${id})`;
  if(c.shape==='round'){const rx=55*w,ry=55*h;body=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;top=cy-ry;bot=cy+ry;side=rx}
  else if(c.shape==='tall'){const rx=42*w,ry=68*h;body=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;top=cy-ry;bot=cy+ry;side=rx;fy=cy-20*h}
  else if(c.shape==='pear'){const rx=56*w,ry=60*h;body=`<path fill="${fill}" d="M${cx},${cy-ry} C${cx+rx*.62},${cy-ry} ${cx+rx*.5},${cy-ry*.2} ${cx+rx},${cy+ry*.4} C${cx+rx*1.05},${cy+ry*1.15} ${cx-rx*1.05},${cy+ry*1.15} ${cx-rx},${cy+ry*.4} C${cx-rx*.5},${cy-ry*.2} ${cx-rx*.62},${cy-ry} ${cx},${cy-ry}Z"/>`;top=cy-ry;bot=cy+ry*.98;side=rx*.95;fy=cy-14*h}
  else if(c.shape==='cloud'){body=`<g fill="${fill}"><ellipse cx="${cx}" cy="${cy+8*h}" rx="${54*w}" ry="${46*h}"/><circle cx="${cx-26*w}" cy="${cy-24*h}" r="${28*Math.min(w,h)}"/><circle cx="${cx+24*w}" cy="${cy-28*h}" r="${30*Math.min(w,h)}"/><circle cx="${cx}" cy="${cy-38*h}" r="${26*Math.min(w,h)}"/></g>`;top=cy-62*h;bot=cy+54*h;side=54*w;fy=cy-4*h}
  else if(c.shape==='star'){let p=[];for(let k=0;k<10;k++){const a=(-90+36*k)*Math.PI/180,R=k%2?34:62;p.push(`${(cx+R*w*Math.cos(a)).toFixed(1)},${(cy+6+R*h*Math.sin(a)).toFixed(1)}`)}
    body=`<polygon points="${p.join(' ')}" fill="${fill}" stroke="${col}" stroke-width="16" stroke-linejoin="round"/>`;top=cy+6-70*h;bot=cy+6+58*h;side=50*w;fy=cy+2}
  else{const rx=54*w,ry=56*h;body=`<path fill="${fill}" d="M${cx},${cy-ry*1.18} C${cx+rx*1.15},${cy-ry*.1} ${cx+rx},${cy+ry} ${cx},${cy+ry} C${cx-rx},${cy+ry} ${cx-rx*1.15},${cy-ry*.1} ${cx},${cy-ry*1.18}Z"/>`;top=cy-ry*1.1;bot=cy+ry;side=rx*.92;fy=cy+4*h}
  const pat=c.pat==='spots'?`<pattern id="${id}" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="${col}"/><circle cx="7" cy="7" r="5" fill="${lt}"/><circle cx="20" cy="19" r="3.5" fill="${lt}"/></pattern>`
    :c.pat==='stripes'?`<pattern id="${id}" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><rect width="18" height="18" fill="${col}"/><rect width="7" height="18" fill="${lt}"/></pattern>`:'';
  let back='';
  if(c.back==='wings')back+=`<g fill="#FFFFFF" stroke="${lt}" stroke-width="3"><ellipse cx="${cx-side-8}" cy="${cy-18}" rx="30" ry="17" transform="rotate(-28 ${cx-side-8} ${cy-18})"/><ellipse cx="${cx+side+8}" cy="${cy-18}" rx="30" ry="17" transform="rotate(28 ${cx+side+8} ${cy-18})"/></g>`;
  if(c.back==='tail')back+=`<path d="M${cx+side*.7},${bot-18} q42,-6 36,-48" stroke="${dk}" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="${cx+side*.7+36}" cy="${bot-66}" r="10" fill="${lt}"/>`;
  const t=top;
  if(c.ears==='cat')back+=`<g fill="${col}" stroke="${col}" stroke-width="8" stroke-linejoin="round"><polygon points="${cx-34*w},${t+22} ${cx-40*w},${t-20} ${cx-8*w},${t+8}"/><polygon points="${cx+34*w},${t+22} ${cx+40*w},${t-20} ${cx+8*w},${t+8}"/></g><g fill="#FF9FB6"><polygon points="${cx-32*w},${t+14} ${cx-36*w},${t-8} ${cx-18*w},${t+8}"/><polygon points="${cx+32*w},${t+14} ${cx+36*w},${t-8} ${cx+18*w},${t+8}"/></g>`;
  if(c.ears==='bunny')back+=`<g><ellipse cx="${cx-20*w}" cy="${t-26}" rx="13" ry="36" fill="${col}"/><ellipse cx="${cx+20*w}" cy="${t-26}" rx="13" ry="36" fill="${col}"/><ellipse cx="${cx-20*w}" cy="${t-24}" rx="6" ry="25" fill="#FF9FB6"/><ellipse cx="${cx+20*w}" cy="${t-24}" rx="6" ry="25" fill="#FF9FB6"/></g>`;
  if(c.ears==='bear')back+=`<g><circle cx="${cx-36*w}" cy="${t+12}" r="17" fill="${col}"/><circle cx="${cx+36*w}" cy="${t+12}" r="17" fill="${col}"/><circle cx="${cx-36*w}" cy="${t+12}" r="8" fill="${dk}"/><circle cx="${cx+36*w}" cy="${t+12}" r="8" fill="${dk}"/></g>`;
  if(c.ears==='antenna')back+=`<g stroke="${dk}" stroke-width="4" stroke-linecap="round"><line x1="${cx-14}" y1="${t+12}" x2="${cx-30}" y2="${t-30}"/><line x1="${cx+14}" y1="${t+12}" x2="${cx+30}" y2="${t-30}"/></g><circle cx="${cx-30}" cy="${t-32}" r="8" fill="#EE4F7C"/><circle cx="${cx+30}" cy="${t-32}" r="8" fill="#FFB41F"/>`;
  if(c.ears==='horns')back+=`<g fill="#F4D27A" stroke="#D8A93A" stroke-width="2" stroke-linejoin="round"><path d="M${cx-30*w},${t+14} q-14,-26 2,-40 q4,22 16,34z"/><path d="M${cx+30*w},${t+14} q14,-26 -2,-40 q-4,22 -16,34z"/></g>`;
  if(c.ears==='unicorn')back+=`<polygon points="${cx-11},${t+10} ${cx+11},${t+10} ${cx},${t-40}" fill="#FFD54A" stroke="#E5A81E" stroke-width="2" stroke-linejoin="round"/><g stroke="#E5A81E" stroke-width="2"><line x1="${cx-7}" y1="${t-2}" x2="${cx+7}" y2="${t-8}"/><line x1="${cx-4}" y1="${t-16}" x2="${cx+4}" y2="${t-20}"/></g>`;
  const arms=`<ellipse cx="${cx-side-2}" cy="${cy+12*h}" rx="11" ry="16" fill="${dk}"/><ellipse cx="${cx+side+2}" cy="${cy+12*h}" rx="11" ry="16" fill="${dk}"/>`;
  const feet=`<ellipse cx="${cx-22*w}" cy="${bot}" rx="17" ry="9" fill="${dk}"/><ellipse cx="${cx+22*w}" cy="${bot}" rx="17" ry="9" fill="${dk}"/>`;
  const ex=Math.max(15,19*w);let eyes='';
  for(const s of[-1,1]){const x=cx+s*ex;
    if(c.eyes==='big')eyes+=`<circle cx="${x}" cy="${fy}" r="11" fill="#fff" stroke="${ink}" stroke-width="1.5"/><circle cx="${x+1}" cy="${fy+1}" r="6.5" fill="${ink}"/><circle cx="${x+3.5}" cy="${fy-2}" r="2.4" fill="#fff"/>`;
    else if(c.eyes==='dots')eyes+=`<circle cx="${x}" cy="${fy}" r="5.5" fill="${ink}"/>`;
    else if(c.eyes==='happy')eyes+=`<path d="M${x-7},${fy+3} Q${x},${fy-7} ${x+7},${fy+3}" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    else eyes+=`<path d="M${x-8},${fy} Q${x},${fy+6} ${x+8},${fy}" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;}
  const cheeks=`<circle cx="${cx-ex-13}" cy="${fy+14}" r="7" fill="#FF7E98" opacity=".5"/><circle cx="${cx+ex+13}" cy="${fy+14}" r="7" fill="#FF7E98" opacity=".5"/>`;
  const my=fy+21;let mouth='';
  if(c.mouth==='smile')mouth=`<path d="M${cx-10},${my} Q${cx},${my+10} ${cx+10},${my}" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  else if(c.mouth==='open')mouth=`<ellipse cx="${cx}" cy="${my+3}" rx="9" ry="7" fill="#7A2440"/><ellipse cx="${cx}" cy="${my+7}" rx="5" ry="2.6" fill="#FF8FA3"/>`;
  else if(c.mouth==='tongue')mouth=`<path d="M${cx-10},${my} Q${cx},${my+10} ${cx+10},${my}" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="${cx+3}" cy="${my+8}" rx="5" ry="6" fill="#FF7E98"/>`;
  else mouth=`<circle cx="${cx}" cy="${my+3}" r="5.5" fill="${ink}"/>`;
  let hat='';
  if(c.hat==='crown')hat=`<polygon points="${cx-24},${t+8} ${cx-28},${t-20} ${cx-13},${t-6} ${cx},${t-26} ${cx+13},${t-6} ${cx+28},${t-20} ${cx+24},${t+8}" fill="#FFC531" stroke="#D99A00" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${cx}" cy="${t-2}" r="4" fill="#EE4F7C"/>`;
  if(c.hat==='cap')hat=`<path d="M${cx-30},${t+12} A30 26 0 0 1 ${cx+30},${t+12}Z" fill="#EE4F7C"/><ellipse cx="${cx-26}" cy="${t+12}" rx="22" ry="6" fill="#C23560"/><circle cx="${cx}" cy="${t-13}" r="4" fill="#fff"/>`;
  if(c.hat==='flower'){const fx=cx+side*.42,fy2=t+10;hat=[0,72,144,216,288].map(a=>`<circle cx="${(fx+11*Math.cos(a*Math.PI/180)).toFixed(1)}" cy="${(fy2+11*Math.sin(a*Math.PI/180)).toFixed(1)}" r="8" fill="#FFFFFF" stroke="#FFC2D3" stroke-width="2"/>`).join('')+`<circle cx="${fx}" cy="${fy2}" r="7" fill="#FFC531"/>`}
  if(c.hat==='bow')hat=`<g fill="#EE4F7C"><polygon points="${cx},${t+6} ${cx-24},${t-8} ${cx-24},${t+20}"/><polygon points="${cx},${t+6} ${cx+24},${t-8} ${cx+24},${t+20}"/></g><circle cx="${cx}" cy="${t+6}" r="6" fill="#C23560"/>`;
  return `<svg viewBox="0 -14 200 248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="הדמות"><defs>${pat}</defs>${back}${arms}${feet}${body}${cheeks}${eyes}${mouth}${hat}</svg>`;
}
