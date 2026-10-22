/* Shapeland · a world by Shirel Yitzhak */
/* ===================== GAME DATA ===================== */
const SHAPES={
 ball:{he:'כדור',pl:'balls',price:0,lvl:1},box:{he:'קובייה',pl:'boxes',price:0,lvl:1},cone:{he:'חרוט',pl:'cones',price:0,lvl:1},cylinder:{he:'גליל',pl:'cylinders',price:0,lvl:1},
 pyramid:{he:'פירמידה',pl:'pyramids',price:8,lvl:1},donut:{he:'טבעת',pl:'donuts',price:10,lvl:2},heart:{he:'לב',pl:'hearts',price:12,lvl:2},arch:{he:'קשת',pl:'arches',price:14,lvl:3},
 star:{he:'כוכב',pl:'stars',price:15,lvl:3},diamond:{he:'יהלום',pl:'diamonds',price:18,lvl:4},cloud:{he:'ענן',pl:'clouds',price:20,lvl:5},moon:{he:'ירח',pl:'moons',price:24,lvl:6}};
const ICONS={
 ball:'<circle cx="12" cy="12" r="9"/>',box:'<rect x="4" y="4" width="16" height="16" rx="2.5"/>',cone:'<path d="M12 3L20 19Q12 23 4 19Z"/>',
 cylinder:'<path d="M5 6Q12 2 19 6V18Q12 22 5 18Z"/>',pyramid:'<path d="M12 3L21 19H3Z"/>',donut:'<circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="5"/>',
 heart:'<path d="M12 21C5 15 2 11 4 7C6 3 11 4 12 8C13 4 18 3 20 7C22 11 19 15 12 21Z"/>',arch:'<path d="M3 20V13A9 9 0 0 1 21 13V20H16V13A4 4 0 0 0 8 13V20Z"/>',
 star:'<path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z"/>',diamond:'<path d="M12 2L20 12L12 22L4 12Z"/>',
 cloud:'<path d="M7 18A4 4 0 0 1 7 10A5 5 0 0 1 16 8A4.5 4.5 0 0 1 18 18Z"/>',moon:'<path d="M15 3A9 9 0 1 0 21 16A7 7 0 1 1 15 3Z"/>'};
const COLS={red:['#EF4444','אדום'],orange:['#F97316','כתום'],yellow:['#FACC15','צהוב'],green:['#22C55E','ירוק'],blue:['#3B82F6','כחול'],
 purple:['#8B5CF6','סגול'],pink:['#F472B6','ורוד'],white:['#F1F5F9','לבן'],black:['#334155','שחור'],brown:['#92400E','חום']};
const SIZES={small:[.6,'קטן'],medium:[1,'בינוני'],big:[1.6,'גדול']};
const NUMW=['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
const ROOMS={living:{en:'living room',he:'סלון',floor:'#E9C893',wall:'#FFE4B5'},bedroom:{en:'bedroom',he:'חדר שינה',floor:'#C9A27E',wall:'#FAD4E4'},
 kitchen:{en:'kitchen',he:'מטבח',floor:'#E5E7EB',wall:'#D1FAE5'},bathroom:{en:'bathroom',he:'חדר רחצה',floor:'#BFDBFE',wall:'#E0F2FE'},
 playroom:{en:'playroom',he:'חדר משחקים',floor:'#FDE68A',wall:'#EDE9FE'},hallway:{en:'hallway',he:'מסדרון',floor:'#D6D3D1',wall:'#F5F5F4'},
 garden:{en:'garden',he:'גינה',floor:'#86D97B',wall:null}};
const PAINTS={cream:'#FFF4DC',peach:'#FFD6B8',rose:'#FAD4E4',lavender:'#E4DAFF','sky blue':'#CFE8FF',mint:'#D1FAE5',lemon:'#FFF3A6',wood:'#C9A27E',gray:'#D6D3D1',white:'#FFFFFF',navy:'#3B4A75',grass:'#86D97B'};
const W='#A47148',WD='#7C4A2D',WH='#FFFFFF';
// part: [shape,color,x,y,z,sx,sy,sz,rotY]
const MODELS={
 bed:{he:'מיטה',em:'🛏️',price:30,lvl:1,parts:[['box',W,0,.18,0,1.25,.36,2],['box',WH,0,.42,.05,1.15,.14,1.8],['box','#F9A8D4',0,.51,.35,1.18,.06,1.1],['box',WH,0,.54,-.65,.6,.14,.35],['box',WD,0,.5,-.98,1.3,.9,.12]]},
 sofa:{he:'ספה',em:'🛋️',price:28,lvl:1,parts:[['box','#2DD4BF',0,.22,0,1.5,.36,.7],['box','#14B8A6',0,.62,-.28,1.5,.5,.16],['box','#14B8A6',-.72,.4,0,.16,.45,.7],['box','#14B8A6',.72,.4,0,.16,.45,.7],['box','#99F6E4',-.35,.45,.05,.62,.1,.55],['box','#99F6E4',.35,.45,.05,.62,.1,.55]]},
 table:{he:'שולחן',em:'🍽️',price:18,lvl:1,parts:[['box',W,0,.72,0,1.15,.08,.78],...[[-1,-1],[-1,1],[1,-1],[1,1]].map(([a,b])=>['cylinder',WD,a*.47,.35,b*.3,.12,.7,.12])]},
 chair:{he:'כיסא',em:'🪑',price:10,lvl:1,parts:[['box',W,0,.45,0,.5,.07,.5],['box',W,0,.74,-.22,.5,.55,.07],...[[-1,-1],[-1,1],[1,-1],[1,1]].map(([a,b])=>['cylinder',WD,a*.2,.22,b*.2,.08,.45,.08])]},
 lamp:{he:'מנורה',em:'💡',price:9,lvl:1,parts:[['cylinder','#334155',0,.03,0,.6,.06,.6],['cylinder','#334155',0,.6,0,.06,1.1,.06],['cone','#FDE68A',0,1.3,0,.75,.45,.75]]},
 rug:{he:'שטיח',em:'🟣',price:8,lvl:1,parts:[['cylinder','#F472B6',0,.01,0,2,.02,2],['cylinder','#FBCFE8',0,.02,0,1.3,.02,1.3]]},
 plant:{he:'עציץ',em:'🪴',price:6,lvl:1,parts:[['cylinder','#C2410C',0,.2,0,.5,.4,.5],['ball','#22C55E',0,.72,0,.7,.7,.7],['ball','#4ADE80',.2,1.02,.1,.42,.42,.42]]},
 bookshelf:{he:'כוננית ספרים',em:'📚',price:22,lvl:1,parts:[['box',W,0,.8,0,1,1.6,.35],...[.42,.9,1.36].flatMap((y,j)=>[-.33,-.11,.11,.33].map((x,i)=>['box',['#EF4444','#3B82F6','#FACC15','#22C55E','#8B5CF6','#F97316'][(i+j*2)%6],x,y,.16,.17,.32,.08]))]},
 desk:{he:'שולחן כתיבה',em:'💻',price:24,lvl:2,parts:[['box',W,0,.74,0,1.2,.07,.6],['box',W,-.56,.37,0,.07,.74,.6],['box',W,.56,.37,0,.07,.74,.6],['box','#9CA3AF',0,.79,.05,.45,.03,.3],['box','#9CA3AF',0,.94,-.12,.45,.3,.02],['box','#60A5FA',0,.94,-.105,.4,.25,.01]]},
 wardrobe:{he:'ארון בגדים',em:'🚪',price:34,lvl:2,parts:[['box','#D6B38A',0,.95,0,1.1,1.9,.55],['box',WD,0,.95,.28,.02,1.8,.01],['ball','#FCD34D',-.08,1,.29,.07,.07,.07],['ball','#FCD34D',.08,1,.29,.07,.07,.07]]},
 tv:{he:'טלוויזיה',em:'📺',price:40,lvl:2,parts:[['box','#334155',0,.18,0,1,.35,.4],['box','#111827',0,.72,0,1.1,.65,.06],['box','#60A5FA',0,.72,.035,.98,.53,.02]]},
 fridge:{he:'מקרר',em:'🧊',price:35,lvl:2,parts:[['box',WH,0,.85,0,.75,1.7,.7],['box','#CBD5E1',0,1.15,.355,.76,.03,.01],['box','#94A3B8',.28,1.45,.37,.04,.3,.03],['box','#94A3B8',.28,.75,.37,.04,.4,.03]]},
 stove:{he:'כיריים',em:'🍳',price:30,lvl:2,parts:[['box',WH,0,.43,0,.8,.85,.7],['box','#1F2937',0,.87,0,.8,.04,.7],...[[-1,-1],[-1,1],[1,-1],[1,1]].map(([a,b])=>['cylinder','#6B7280',a*.2,.9,b*.16,.3,.02,.3]),['box','#374151',0,.4,.36,.6,.4,.02]]},
 bathtub:{he:'אמבטיה',em:'🛁',price:32,lvl:2,parts:[['box',WH,0,.28,0,1.5,.55,.8],['box','#7DD3FC',0,.52,0,1.35,.04,.65],['ball','#FACC15',.3,.6,0,.18,.15,.18]]},
 toilet:{he:'אסלה',em:'🚽',price:20,lvl:2,parts:[['cylinder',WH,0,.22,.05,.9,.45,.9],['box',WH,0,.55,-.3,.5,.5,.2],['cylinder','#E5E7EB',0,.46,.05,.85,.03,.85]]},
 teddy:{he:'דובי',em:'🧸',price:14,lvl:1,parts:[['ball','#B45309',0,.28,0,.5,.55,.45],['ball','#B45309',0,.68,0,.38,.38,.38],['ball','#B45309',-.14,.85,0,.13,.13,.13],['ball','#B45309',.14,.85,0,.13,.13,.13],['ball','#FDE68A',0,.64,.17,.15,.12,.1]]},
 aquarium:{he:'אקווריום',em:'🐠',price:55,lvl:3,parts:[['box',WD,0,.25,0,1.1,.5,.45],['box','#7DD3FC',0,.8,0,1.05,.6,.42,0,.55],['ball','#F97316',.15,.8,0,.2,.13,.08],['ball','#FACC15',-.2,.7,.05,.15,.1,.06],['box','#22C55E',-.35,.62,0,.05,.25,.05]]},
 piano:{he:'פסנתר',em:'🎹',price:70,lvl:4,parts:[['box','#111827',0,.55,0,1.4,.8,.55],['box',WH,0,.97,.16,1.3,.04,.18],['box','#111827',0,1.15,-.2,1.4,.4,.12],...[[-1],[1]].map(([a])=>['cylinder','#111827',a*.6,.1,.18,.1,.2,.1])]},
 trampoline:{he:'טרמפולינה',em:'🤸',price:45,lvl:3,parts:[['cylinder','#1F2937',0,.4,0,2.4,.05,2.4],['cylinder','#3B82F6',0,.38,0,2.6,.06,2.6],...[0,1,2,3].map(i=>['cylinder','#94A3B8',Math.cos(i*1.57)*1,.19,Math.sin(i*1.57)*1,.08,.38,.08])]},
 castle:{he:'טירת צעצוע',em:'🏰',price:60,lvl:5,parts:[['box','#E5E7EB',0,.35,0,1,.7,1],...[[-1,-1],[-1,1],[1,-1],[1,1]].flatMap(([a,b])=>[['cylinder','#E5E7EB',a*.5,.5,b*.5,.35,1,.35],['cone','#F472B6',a*.5,1.18,b*.5,.4,.4,.4]])]}};
const PETS={
 chick:{he:'אפרוח',em:'🐥',price:30,lvl:1,parts:[['ball','#FACC15',0,.22,0,.42,.42,.42],['ball','#FACC15',0,.5,.05,.3,.3,.3],['ball','#F97316',0,.5,.2,.1,.06,.1],['ball','#1D2A48',-.07,.55,.16,.05,.05,.05],['ball','#1D2A48',.07,.55,.16,.05,.05,.05]]},
 bunny:{he:'ארנב',em:'🐰',price:50,lvl:1,parts:[['ball',WH,0,.22,0,.45,.45,.5],['ball',WH,0,.52,.18,.34,.34,.34],['ball',WH,-.08,.85,.15,.1,.36,.06],['ball',WH,.08,.85,.15,.1,.36,.06],['ball','#F9A8D4',0,.5,.35,.06,.05,.05],['ball','#1D2A48',-.08,.57,.33,.05,.05,.05],['ball','#1D2A48',.08,.57,.33,.05,.05,.05],['ball',WH,0,.25,-.27,.15,.15,.15]]},
 cat:{he:'חתול',em:'🐱',price:60,lvl:1,parts:[['ball','#FB923C',0,.25,0,.5,.4,.7],['ball','#FB923C',0,.5,.32,.38,.36,.36],['cone','#FB923C',-.11,.72,.32,.16,.16,.16],['cone','#FB923C',.11,.72,.32,.16,.16,.16],['cylinder','#FB923C',0,.45,-.38,.08,.45,.08],['ball','#1D2A48',-.08,.53,.49,.05,.05,.05],['ball','#1D2A48',.08,.53,.49,.05,.05,.05]]},
 dog:{he:'כלב',em:'🐶',price:80,lvl:2,parts:[['ball','#A16207',0,.28,0,.55,.45,.75],['ball','#A16207',0,.56,.35,.4,.38,.4],['ball','#713F12',-.2,.58,.33,.1,.25,.12],['ball','#713F12',.2,.58,.33,.1,.25,.12],['ball','#1D2A48',0,.54,.56,.08,.06,.06],['ball','#1D2A48',-.08,.62,.52,.05,.05,.05],['ball','#1D2A48',.08,.62,.52,.05,.05,.05],['cylinder','#A16207',0,.45,-.42,.07,.35,.07]]},
 panda:{he:'פנדה',em:'🐼',price:120,lvl:4,parts:[['ball',WH,0,.3,0,.6,.55,.6],['ball',WH,0,.72,.1,.45,.42,.42],['ball','#111827',-.17,.92,.08,.14,.14,.1],['ball','#111827',.17,.92,.08,.14,.14,.1],['ball','#111827',-.09,.75,.3,.1,.12,.05],['ball','#111827',.09,.75,.3,.1,.12,.05],['ball','#111827',0,.66,.32,.06,.04,.04]]},
 dragon:{he:'דרקון',em:'🐉',price:160,lvl:6,parts:[['ball','#22C55E',0,.32,0,.55,.5,.75],['ball','#22C55E',0,.68,.35,.4,.38,.4],['cone','#FACC15',-.1,.92,.33,.1,.22,.1],['cone','#FACC15',.1,.92,.33,.1,.22,.1],['ball','#86EFAC',-.35,.55,-.05,.4,.08,.3],['ball','#86EFAC',.35,.55,-.05,.4,.08,.3],['cone','#16A34A',0,.32,-.5,.15,.35,.15],['ball','#1D2A48',-.1,.74,.53,.05,.05,.05],['ball','#1D2A48',.1,.74,.53,.05,.05,.05]]}};
const ACC={cap:['hat',15,'🧢'],flower:['hat',12,'🌸'],bow:['hat',12,'🎀'],crown:['hat',30,'👑'],tail:['back',20,'🦊'],wings:['back',45,'🦋'],antenna:['ears',15,'📡'],horns:['ears',20,'🐂'],unicorn:['ears',35,'🦄'],spots:['pat',10,'🔵'],stripes:['pat',10,'〰️']};
const GOODS=['apple','banana','bread','milk','egg','cheese','orange','carrot','tomato','cucumber','grapes','honey','rice','chicken','pizza','cake','soup','salad'].map((en,i)=>{const w=WORDS.find(x=>x.en===en);return{en,he:w.he,em:w.em,tr:w.tr,price:1+(i*7%5)+w.tr}});
const UNC={bread:['a loaf of bread','loaves of bread'],milk:['a bottle of milk','bottles of milk'],cheese:['a piece of cheese','pieces of cheese'],honey:['a jar of honey','jars of honey'],rice:['a bag of rice','bags of rice'],soup:['a bowl of soup','bowls of soup'],grapes:['a bunch of grapes','bunches of grapes'],tomato:['a tomato','tomatoes']};
const goodPh=(en,q)=>q===1?(UNC[en]?UNC[en][0]:(/^[aeiou]/.test(en)?'an ':'a ')+en):nw(q)+' '+(UNC[en]?UNC[en][1]:en+'s');
const PASTRY=[['bread','🍞','loaf of bread','loaves of bread'],['cake','🍰','cake','cakes'],['cookie','🍪','cookie','cookies'],['croissant','🥐','croissant','croissants'],['cupcake','🧁','cupcake','cupcakes'],['donut','🍩','donut','donuts'],['pie','🥧','pie','pies']];
const FURN_WORDS=['chair','table','bed','lamp','sofa','shelf','desk','closet','bench','tower','castle','robot','tree','rocket','statue','swing','flower pot','snowman'];
const BUILDINGS=[
 {id:'furniture',en:'Furniture Store',he:'חנות רהיטים',color:'#F59E0B',roof:'#B45309',x:-8,z:5},
 {id:'clothes',en:'Clothes Shop',he:'חנות בגדים',color:'#F472B6',roof:'#BE185D',x:8,z:5},
 {id:'pets',en:'Pet Shop',he:'חנות חיות',color:'#34D399',roof:'#047857',x:-10,z:-5},
 {id:'market',en:'Market',he:'מכולת',color:'#60A5FA',roof:'#1D4ED8',x:10,z:-5},
 {id:'bakery',en:'Bakery',he:'מאפייה',color:'#FDBA74',roof:'#C2410C',x:-4,z:-11},
 {id:'bank',en:'Bear Bank',he:'הבנק',color:'#A78BFA',roof:'#6D28D9',x:5,z:-11}];
const ZC={island:[0,0],town:[0,-46],home:[90,0],visit:[180,0],work:[-90,0],city:[0,-130]};
const NPCS=[
 {id:'bella',name:'Bella',role:'הבנאית',face:'👷‍♀️',color:'#FB923C',hat:'#FACC15',zone:'island',x:-7,z:-5},
 {id:'leo',name:'Leo',role:'חנות הצורות',face:'🧙',color:'#8B5CF6',hat:'#F472B6',zone:'island',x:7,z:-5},
 {id:'mia',name:'Mia',role:'החברה מהפארק',face:'👧',color:'#F472B6',hat:'#FFFFFF',zone:'town',x:-3,z:2},
 {id:'kim',name:'Mrs. Kim',role:'רשימת קניות',face:'👩‍🍳',color:'#60A5FA',hat:'#FFFFFF',zone:'town',x:12.5,z:-1.5},
 {id:'bear',name:'Mr. Bear',role:'הבנק',face:'🐻',color:'#A16207',hat:'#1D2A48',zone:'town',x:7.5,z:-8},
 {id:'dana',name:'Dana',role:'מתווכת קרקעות',face:'👩‍💼',color:'#10B981',hat:'#FFFFFF',zone:'city',x:1,z:-4.4},
 {id:'tom',name:'Tom',role:'תייר שהלך לאיבוד',face:'🧳',color:'#F59E0B',hat:'#FDE68A',zone:'city',x:-13,z:1},
 {id:'sam',name:'Officer Sam',role:'שוטר התנועה',face:'👮',color:'#1E40AF',hat:'#1E3A8A',zone:'city',x:11.8,z:12.6}];
const TEAM=[
 {en:'Make a rainbow! Build one piece of each color: red, orange, yellow, green, blue and purple.',he:'קשת בענן: לפחות חלק אחד מכל צבע — אדום, כתום, צהוב, ירוק, כחול וסגול.',prog:a=>[['red','orange','yellow','green','blue','purple'].filter(c=>a.some(p=>p.c===c)).length,6]},
 {en:'Reach the clouds! Build something higher than six meters.',he:'להגיע לעננים: לבנות משהו שהקצה שלו גבוה מ־6 מטר.',prog:a=>[Math.min(6,Math.floor(Math.max(0,...a.map(pTop)))),6]},
 {en:'Party time! The village needs fifteen balls.',he:'מסיבה! הכפר צריך 15 כדורים.',prog:a=>[Math.min(15,a.filter(p=>p.s==='ball').length),15]},
 {en:'Plant a garden: ten green pieces and five pink pieces.',he:'גינה: 10 חלקים ירוקים ו־5 ורודים.',prog:a=>[Math.min(10,a.filter(p=>p.c==='green').length)+Math.min(5,a.filter(p=>p.c==='pink').length),15]},
 {en:'Build forty pieces together on the island.',he:'לבנות ביחד 40 חלקים על האי.',prog:a=>[Math.min(40,a.length),40]},
 {en:'Hearts for everyone! Build ten hearts.',he:'לבבות לכולם! 10 לבבות.',prog:a=>[Math.min(10,a.filter(p=>p.s==='heart').length),10]},
 {en:'A star sky: eight stars up high, above three meters.',he:'שמיים של כוכבים: 8 כוכבים מעל 3 מטר.',prog:a=>[Math.min(8,a.filter(p=>p.s==='star'&&p.y>3).length),8]},
 {en:'A giant castle: one hundred pieces on the island!',he:'טירה ענקית: 100 חלקים על האי!',prog:a=>[Math.min(100,a.length),100]}];
