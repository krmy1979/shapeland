/* Shapeland · a world by Shirel Yitzhak */
/* ===================== BOOT ===================== */
$('#logo').innerHTML='SHAPELAND'.split('').map((c,i)=>`<span style="animation-delay:${i*.12}s;color:${['#FF8FB1','#FFB41F','#64A8FA','#8AD26C','#B49BFA','#FB9A45','#34CDB5','#F57070','#FCD045'][i]}">${c}</span>`).join('');
$('#titleAv').innerHTML=charSVG(P.ch);$('#tName').value=P.name;$('#tCode').value=P.code;
P.pieces.forEach(p=>addPieceObj(p,P.key,'island'));
for(let i=0;i<3;i++)makeChest('island');for(let i=0;i<2;i++)makeChest('town');for(let i=0;i<2;i++)makeChest('city');updatePlotSigns();
renderExteriors();
loop();
