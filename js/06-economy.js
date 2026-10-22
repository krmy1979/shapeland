/* Shapeland · a world by Shirel Yitzhak */
/* ===================== ECONOMY ===================== */
function addXp(n){const b=level();P.xp+=n;if(level()>b){setTimeout(()=>{burst('LEVEL '+level()+'!');sfx.win();say('Level up! Level '+level()+'!')},400)}renderHud()}
function addGems(n,he,enw){P.gems=Math.max(0,P.gems+n);if(he)logm(he,enw,n);renderHud()}
function logm(he,enw,a){P.log.unshift({he,en:enw,a});P.log=P.log.slice(0,25);save()}
const islandTax=()=>Math.max(2,Math.ceil((P.pieces.length+P.house.pieces.length+P.cpieces.length)/15));
function adventure(){P.adv++;const ev=[];
  if(P.savings>0){const g=Math.round(P.savings*.02*100)/100;if(g>0){P.savings+=g;ev.push(`+${fmt(g)} 💎 ריבית`);logm('ריבית מהבנק','Interest',g)}}
  if(P.loan&&P.loan.left>0){const pay=P.loan.pay;let a=Math.min(P.gems,pay);P.gems-=a;let rest=pay-a;if(rest>0)P.savings=Math.max(0,P.savings-rest);P.loan.left--;ev.push(`−${pay} 💎 תשלום הלוואה`);logm('תשלום הלוואה ('+(5-P.loan.left)+'/5)','Loan payment',-pay);if(!P.loan.left){P.loan=null;setTimeout(()=>{burst('🏦 PAID!');say('Your loan is paid. Well done!')},2600)}}
  if(P.adv%5===0){const tax=islandTax();let pay=Math.min(P.gems,tax);P.gems-=pay;let rest=tax-pay;if(rest>0){P.savings=Math.max(0,P.savings-rest)}
    ev.push(`−${tax} 💎 חשבונות הבית`);logm('חשבונות הבית (מים וחשמל)','Bills',-tax)}
  save();renderHud();if(ev.length)setTimeout(()=>toast('🐻 '+ev.join(' · ')),1800)}
