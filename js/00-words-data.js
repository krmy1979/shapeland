/* Shapeland · a world by Shirel Yitzhak */
window.addEventListener('error',e=>{const t=document.getElementById('toast');if(t){t.textContent='אופס, משהו השתבש: '+(e.message||'');t.hidden=false}});
const WORDS=`house|בית|🏠|home|1
door|דלת|🚪|home|1
bed|מיטה|🛏️|home|1
chair|כיסא|🪑|home|1
window|חלון|🪟|home|1
key|מפתח|🔑|home|1
light|מנורה|💡|home|1
sofa|ספה|🛋️|home|1
bath|אמבטיה|🛁|home|1
clock|שעון|⏰|home|1
plant|עציץ|🪴|home|1
book|ספר|📖|home|1
box|קופסה|📦|home|1
toilet|שירותים|🚽|home|2
mirror|מראה|🪞|home|2
candle|נר|🕯️|home|2
broom|מטאטא|🧹|home|2
basket|סל|🧺|home|2
wall|קיר|🧱|home|2
table|שולחן||home|1
fridge|מקרר||home|2
roof|גג||home|2
stairs|מדרגות||home|3
ceiling|תקרה||home|3
furniture|רהיטים||home|4
mother|אמא|👩|family|1
father|אבא|👨|family|1
baby|תינוק|👶|family|1
sister|אחות|👧|family|1
brother|אח|👦|family|1
grandmother|סבתא|👵|family|2
grandfather|סבא|👴|family|2
family|משפחה|👨‍👩‍👧|family|1
friend|חבר/ה|🧑‍🤝‍🧑|family|1
parents|הורים||family|2
cousin|בן או בת דוד||family|3
neighbor|שכן/ה||family|3
apple|תפוח|🍎|food|1
banana|בננה|🍌|food|1
bread|לחם|🍞|food|1
milk|חלב|🥛|food|1
egg|ביצה|🥚|food|1
cheese|גבינה|🧀|food|1
pizza|פיצה|🍕|food|1
cake|עוגה|🍰|food|1
orange|תפוז|🍊|food|1
water|מים|💧|food|1
carrot|גזר|🥕|food|2
tomato|עגבנייה|🍅|food|2
cucumber|מלפפון|🥒|food|2
grapes|ענבים|🍇|food|2
soup|מרק|🍲|food|2
salad|סלט|🥗|food|2
chicken|עוף|🍗|food|2
rice|אורז|🍚|food|2
honey|דבש|🍯|food|2
breakfast|ארוחת בוקר|🥞|food|3
vegetables|ירקות|🥦|food|3
delicious|טעים|😋|food|3
dinner|ארוחת ערב||food|3
money|כסף|💰|shop|1
shop|חנות|🏪|shop|2
price|מחיר|🏷️|shop|2
cart|עגלה|🛒|shop|2
bag|שקית|🛍️|shop|2
expensive|יקר|💎|shop|3
receipt|קבלה|🧾|shop|3
cheap|זול||shop|3
discount|הנחה||shop|4
customer|לקוח/ה||shop|4
cashier|קופאי/ת||shop|4
hand|יד|✋|body|1
foot|כף רגל|🦶|body|1
eye|עין|👁️|body|1
ear|אוזן|👂|body|1
nose|אף|👃|body|1
mouth|פה|👄|body|1
leg|רגל|🦵|body|1
heart|לב|❤️|body|1
head|ראש||body|1
tooth|שן|🦷|body|2
arm|זרוע|💪|body|2
finger|אצבע|☝️|body|2
hair|שיער|💇|body|2
shoulder|כתף||body|3
knee|ברך||body|3
shirt|חולצה|👕|clothes|1
dress|שמלה|👗|clothes|1
shoes|נעליים|👟|clothes|1
hat|כובע|🧢|clothes|1
pants|מכנסיים|👖|clothes|1
socks|גרביים|🧦|clothes|2
coat|מעיל|🧥|clothes|2
glasses|משקפיים|👓|clothes|2
scarf|צעיף|🧣|clothes|2
gloves|כפפות|🧤|clothes|2
umbrella|מטרייה|☂️|clothes|2
ring|טבעת|💍|clothes|3
pajamas|פיג'מה||clothes|3
car|מכונית|🚗|city|1
bus|אוטובוס|🚌|city|1
train|רכבת|🚆|city|1
bicycle|אופניים|🚲|city|1
school|בית ספר|🏫|school|1
hospital|בית חולים|🏥|city|2
park|פארק|🏞️|city|2
bank|בנק|🏦|city|2
police|משטרה|🚓|city|2
beach|חוף ים|🏖️|city|2
map|מפה|🗺️|city|2
street|רחוב||city|2
airport|שדה תעופה|✈️|city|3
bridge|גשר|🌉|city|3
library|ספרייה||city|3
restaurant|מסעדה||city|3
pharmacy|בית מרקחת|💊|city|4
neighborhood|שכונה||city|4
crosswalk|מעבר חצייה||city|5
happy|שמח/ה|😀|feelings|1
sad|עצוב/ה|😢|feelings|1
angry|כועס/ת|😠|feelings|2
tired|עייף/ה|😴|feelings|2
scared|מפחד/ת|😨|feelings|2
hungry|רעב/ה|🤤|feelings|2
surprised|מופתע/ת|😮|feelings|3
bored|משועמם/ת|😐|feelings|3
excited|נרגש/ת|🤩|feelings|3
brave|אמיץ/ה|🦁|feelings|3
kind|נחמד/ה ואדיב/ה||feelings|3
nervous|לחוץ/ה|😬|feelings|4
worried|מודאג/ת|😟|feelings|4
proud|גאה||feelings|4
grateful|אסיר/ת תודה|🙏|feelings|5
lonely|בודד/ה||feelings|5
confident|בטוח/ה בעצמי||feelings|5
teacher|מורה|🧑‍🏫|work|2
doctor|רופא/ה|🧑‍⚕️|work|2
cook|טבח/ית|🧑‍🍳|work|2
builder|בנאי/ת|👷|work|2
job|עבודה|💼|work|2
farmer|חקלאי/ת|🧑‍🌾|work|3
firefighter|כבאי/ת|🧑‍🚒|work|3
pilot|טייס/ת|🧑‍✈️|work|3
artist|אמן/ית|🧑‍🎨|work|3
office|משרד|🏢|work|3
nurse|אח/ות||work|3
scientist|מדען/ית|🧑‍🔬|work|4
programmer|מתכנת/ת|🧑‍💻|work|4
engineer|מהנדס/ת||work|5
coin|מטבע|🪙|money|1
wallet|ארנק|👛|money|2
spend|לבזבז|💸|money|3
save|לחסוך|🐷|money|3
savings|חיסכון||money|4
salary|משכורת||money|4
earn|להרוויח||money|4
bill|חשבון לתשלום||money|4
credit card|כרטיס אשראי|💳|money|4
budget|תקציב||money|5
rent|שכר דירה||money|5
interest|ריבית||money|5
loan|הלוואה||money|5
tax|מס||money|5
invest|להשקיע|📈|money|5
pencil|עיפרון|✏️|school|1
backpack|תיק גב|🎒|school|1
ruler|סרגל|📏|school|2
scissors|מספריים|✂️|school|2
computer|מחשב|💻|school|2
class|כיתה||school|2
test|מבחן|📝|school|3
homework|שיעורי בית||school|3
question|שאלה|❓|school|3
answer|תשובה||school|3
sun|שמש|☀️|nature|1
moon|ירח|🌙|nature|1
star|כוכב|⭐|nature|1
tree|עץ|🌳|nature|1
flower|פרח|🌸|nature|1
cat|חתול|🐱|nature|1
dog|כלב|🐶|nature|1
bird|ציפור|🐦|nature|1
fish|דג|🐟|nature|1
rain|גשם|🌧️|nature|2
snow|שלג|❄️|nature|2
cloud|ענן|☁️|nature|2
sea|ים|🌊|nature|2
horse|סוס|🐴|nature|2
rabbit|ארנב|🐰|nature|2
rainbow|קשת|🌈|nature|2
mountain|הר|⛰️|nature|3
butterfly|פרפר|🦋|nature|3
weather|מזג אוויר||nature|4
environment|סביבה||nature|5`.split('\n').map(l=>{const[en,he,em,t,tr]=l.split('|');return{en,he,em,t,tr:+tr}});

const SENTS=`I am happy|אני שמח/ה|1
This is my house|זה הבית שלי|1
I like pizza|אני אוהב/ת פיצה|1
The cat is small|החתול קטן|1
I have a dog|יש לי כלב|1
She is my sister|היא אחותי|1
Can I have some water?|אפשר לקבל קצת מים?|2
Where is the bathroom?|איפה השירותים?|2
My name is Maya|קוראים לי מאיה|2
How much is this?|כמה זה עולה?|2
It is raining today|יורד גשם היום|2
We are going to the park|אנחנו הולכים לפארק|2
I want to buy a new bag|אני רוצה לקנות תיק חדש|3
Can you help me please?|אפשר לעזור לי בבקשה?|3
I don't understand the question|אני לא מבין/ה את השאלה|3
Let's build a house together|בואו נבנה בית ביחד|3
My favorite color is blue|הצבע האהוב עליי הוא כחול|3
I usually wake up at seven|בדרך כלל אני מתעורר/ת בשבע|3
I am saving money for a bike|אני חוסך/ת כסף לאופניים|4
Could you speak more slowly?|אפשר לדבר יותר לאט?|4
Yesterday I went to the beach with my family|אתמול הלכתי לחוף עם המשפחה שלי|4
If it rains we will stay home|אם ירד גשם נישאר בבית|4
This shirt is cheaper than that one|החולצה הזאת זולה יותר מההיא|4
I have been learning English for two years|אני לומד/ת אנגלית כבר שנתיים|5
We should spend less than we earn|כדאי להוציא פחות ממה שמרוויחים|5
Would you like to join our team?|רוצה להצטרף לקבוצה שלנו?|5
I would rather save than spend|אני מעדיף/ה לחסוך מאשר לבזבז|5
Before you buy something compare the prices|לפני שקונים משהו משווים מחירים|5`.split('\n').map(l=>{const[en,he,tr]=l.split('|');return{en,he,tr:+tr}});

const DIALOGS=`🧒|Hi! How are you?|I'm fine, thank you!|I am a banana.|Goodbye yesterday.|היי! מה שלומך?|אני בסדר, תודה!|1|
👧|What is your name?|My name is Noa.|I am seven apples.|Yes, please.|איך קוראים לך?|קוראים לי נועה.|1|
🧑‍🍳|Do you like pizza?|Yes, I love it!|It is a blue door.|I am a bus.|את/ה אוהב/ת פיצה?|כן, אני מת/ה על זה!|1|
👵|How old are you?|I am ten years old.|I am fine.|It is Monday.|בן/בת כמה את/ה?|אני בן/בת עשר.|2|
🧑‍💼|Can I help you?|Yes, I want a bottle of water.|No, I am a cat.|Help is red.|אפשר לעזור לך?|כן, אני רוצה בקבוק מים.|2|
👦|Where do you live?|I live near the sea.|I live a sandwich.|Live is good.|איפה את/ה גר/ה?|אני גר/ה ליד הים.|2|
👧|Do you want to play with me?|Sure! Let's play together.|Play is a table.|I am Tuesday.|רוצה לשחק איתי?|בטח! בואו נשחק ביחד.|2|
🧑‍💼|That will be fifteen shekels.|Here you go. Can I get a receipt?|I am fifteen years old.|Shekels are green.|זה יעלה חמישה עשר שקלים.|בבקשה. אפשר לקבל קבלה?|3|
🧑‍🏫|What did you do yesterday?|I went to the park with my friends.|I go to park tomorrow yesterday.|Yes, it is yesterday.|מה עשית אתמול?|הלכתי לפארק עם החברים שלי.|3|
🧳|Excuse me, where is the library?|Go straight and turn left.|The library is hungry.|I like libraries very much.|סליחה, איפה הספרייה?|ללכת ישר ולפנות שמאלה.|3|
👩|You look sad. What happened?|I lost my favorite pencil.|Happened is a big word.|I am a pencil.|נראה שאת/ה עצוב/ה. מה קרה?|איבדתי את העיפרון האהוב עליי.|3|
🧑‍🍳|What would you like to eat?|I would like pasta, please.|I would like a chair to eat.|Eat is good for me.|מה תרצה/י לאכול?|אני רוצה פסטה, בבקשה.|3|
🧑‍🏫|What do you want to be when you grow up?|I want to be a doctor because I like helping people.|I grow up yesterday.|I want to be a Tuesday.|מה את/ה רוצה להיות כשתגדל/י?|אני רוצה להיות רופא/ה כי אני אוהב/ת לעזור לאנשים.|4|
☎️|Hi, can I speak to your dad?|Sorry, he isn't home. Can I take a message?|My dad is a phone.|Yes, speak to the door.|היי, אפשר לדבר עם אבא שלך?|סליחה, הוא לא בבית. אפשר למסור לו הודעה?|4|
👦|I'm sorry, I broke your toy.|It's okay, accidents happen.|Thank you for breaking it!|Toy is broken happy.|סליחה, שברתי לך את הצעצוע.|זה בסדר, תאונות קורות.|4|
👧|Should we buy the expensive bike or save money?|Let's save for a few more weeks and compare prices.|Bike is money.|I expensive the bike.|לקנות את האופניים היקרים או לחסוך?|בואו נחסוך עוד כמה שבועות ונשווה מחירים.|4|
🧑‍💼|Your job pays three hundred shekels a week. How will you plan your money?|I'll save some, pay my bills, and spend the rest wisely.|I will spend all of it today!|Money plan is week.|העבודה משלמת 300 ש"ח בשבוע. איך תתכנן/י את הכסף?|אחסוך חלק, אשלם חשבונות ואוציא את השאר בחוכמה.|5|באנגלית "I will spend all of it today" זה משפט תקין, אבל לבזבז הכל ביום אחד זו החלטה לא חכמה.
👩‍🏫|Our team needs someone to lead the project. Any ideas?|I can organize the tasks and make sure everyone has a part.|Project is lead ideas.|No, I'm not.|הקבוצה צריכה מישהו שיוביל את הפרויקט. רעיונות?|אני יכול/ה לארגן את המשימות ולדאוג שלכל אחד יהיה תפקיד.|5|
🧑‍💼|The store gave you too much change by mistake. What do you do?|I tell the cashier and give the extra money back.|I keep it and run away.|Change is mistake money.|החנות נתנה לך יותר מדי עודף בטעות. מה עושים?|אומרים לקופאי/ת ומחזירים את הכסף העודף.|5|"I keep it and run away" זו אנגלית תקינה, אבל זה לא הוגן. התשובה הטובה היא להחזיר.
👧|I feel nervous about the test tomorrow.|Don't worry, let's study together tonight.|Good, be nervous!|Test is tomorrow nervous.|אני לחוצה מהמבחן מחר.|אל תדאגי, בואי נלמד ביחד הערב.|5|`.split('\n').map(l=>{const[f,npc,c,w1,w2,hn,hc,tr,note]=l.split('|');return{f,npc,c,w:[w1,w2],hn,hc,tr:+tr,note}});

const CH={
 shape:[['round','עגול','round'],['tall','גבוה','tall'],['pear','אגס','pear'],['cloud','ענן','cloud'],['star','כוכב','star'],['drop','טיפה','drop']],
 pat:[['plain','חלק','plain'],['spots','נקודות','spots'],['stripes','פסים','stripes']],
 eyes:[['big','עיניים גדולות','big eyes'],['dots','נקודות','dot eyes'],['happy','שמחות','happy eyes'],['sleepy','ישנוניות','sleepy eyes']],
 mouth:[['smile','חיוך','smile'],['open','פה פתוח','open mouth'],['tongue','לשון','tongue'],['wow','מופתע','surprised']],
 ears:[['none','בלי','no ears'],['cat','חתול','cat ears'],['bunny','ארנב','bunny ears'],['bear','דובי','bear ears'],['antenna','אנטנות','antennas'],['horns','קרניים','horns'],['unicorn','חד־קרן','unicorn horn']],
 back:[['none','בלי','nothing'],['wings','כנפיים','wings'],['tail','זנב','tail']],
 hat:[['none','בלי','no hat'],['crown','כתר','crown'],['cap','כובע','cap'],['flower','פרח','flower'],['bow','פפיון','bow']]};
const COLORS=[['#FF8FB1','pink'],['#B49BFA','purple'],['#64A8FA','blue'],['#34CDB5','turquoise'],['#8AD26C','green'],['#FCD045','yellow'],['#FB9A45','orange'],['#F57070','red'],['#B08968','brown']];
