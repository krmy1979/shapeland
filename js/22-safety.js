/* OrKeepers · safety: name filter (nicknames, group names) + safety reminders for kids.
   Used by the game (index.html) and by the parents' area (parent.html). No dependencies. */
(function (G) {
  /* מילים שנחסמות כמילה שלמה (קצרות, כדי לא לחסום מילים תמימות שמכילות אותן) */
  const WORDS = [
    'זין', 'כוס', 'כוסית', 'זונה', 'זונות', 'שרמוטה', 'שרמוטות', 'מניאק', 'מניאקים', 'חרא', 'מזדיין', 'תזדיין', 'זיון',
    'דביל', 'מפגר', 'מפגרת', 'אידיוט', 'אידיוטית', 'מטומטם', 'מטומטמת', 'סקס', 'פורנו', 'נאצי',
    'ass', 'dick', 'cock', 'tit', 'tits', 'sex', 'porn', 'nazi', 'kys', 'fag',
  ];
  /* מחרוזות שנחסמות גם בתוך מילה (חזקות וארוכות מספיק) */
  const PARTS = [
    'שרמוט', 'בןזונה', 'בתזונה', 'כוסאמ', 'כוסעמ', 'יאמניאק', 'מזדיי', 'תזדיי', 'לךתזד',
    'fuck', 'shit', 'bitch', 'cunt', 'pussy', 'whore', 'slut', 'nigg', 'asshole', 'penis', 'vagina', 'rape', 'killyou', 'idiot', 'stupid',
  ];
  const LEET = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i' };
  const norm = s => String(s || '').toLowerCase().normalize('NFKC')
    .replace(/[֑-ׇ]/g, '')                       /* ניקוד */
    .replace(/[ךםןףץ]/g, c => ({ 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' })[c]);
  const deleet = s => s.replace(/[013457@$!]/g, c => LEET[c]);

  /* בודק שם: { ok, reason } */
  function checkName(raw) {
    const s = String(raw || '').trim();
    if (!s) return { ok: false, reason: 'צריך לכתוב שם' };
    const digits = (s.match(/\d/g) || []).length;
    if (digits >= 5) return { ok: false, reason: 'בלי מספרים ארוכים בשם – לא משתפים מספרי טלפון 🛡️' };
    if (/@|https?:|www\.|\.(com|co|il|net|org|io)\b|t\.me|wa\.me|instagram|tiktok|snap|whatsapp|וואטסאפ|ווטסאפ|אינסטגרם|טיקטוק/i.test(s))
      return { ok: false, reason: 'בלי קישורים, מיילים או רשתות חברתיות בשם 🛡️' };
    const n = norm(s);
    const words = n.split(/[^a-zא-ת0-9@$!]+/).filter(Boolean);
    const joined = deleet(n.replace(/[^a-zא-ת0-9@$!]+/g, ''));
    const squeezed = joined.replace(/(.)\1+/g, '$1');
    const bad = words.some(w => WORDS.includes(w) || WORDS.includes(deleet(w))) ||
      PARTS.some(p => { const q = norm(p); return joined.includes(q) || squeezed.includes(q.replace(/(.)\1+/g, '$1')); });
    if (bad) return { ok: false, reason: 'השם הזה לא מתאים למשחק. בוחרים שם נחמד 🙂' };
    return { ok: true, text: s.slice(0, 24) };
  }
  /* לתצוגה של שמות שמגיעים מאחרים: אם לא תקין – שם ניטרלי */
  function safeName(raw, fallback) {
    const r = checkName(raw);
    return r.ok ? r.text : (fallback || 'חבר/ה');
  }

  /* תזכורת בטיחות קצרה (HTML) */
  const SAFETY_HTML = `<div class="box safety" dir="rtl" style="background:#EAF6FF;border:2px solid #9FD6FF;border-radius:16px;padding:10px 12px;text-align:right">
    <b>🛡️ כללי הזהב של שומרי האור</b>
    <ul style="margin:6px 0 0;padding-right:18px;line-height:1.6">
      <li>לא משתפים שם מלא, כתובת, בית ספר או מספר טלפון.</li>
      <li>נותנים את קוד החבר רק לחברים שמכירים באמת.</li>
      <li>אם מישהו מציק או משהו מרגיש לא נעים – מספרים להורים מיד.</li>
      <li>שומרי אור מתנהגים יפה: בונים יחד, עוזרים ומפרגנים.</li>
    </ul></div>`;

  /* פעם ביום, כשנכנסים לקבוצה עם חברים: חלון תזכורת שצריך ללחוץ עליו */
  function maybeDailyReminder() {
    let key = 'ok-safety-' + new Date().toISOString().slice(0, 10), seen = false;
    try { seen = localStorage.getItem(key) === '1'; } catch (e) {}
    if (seen || document.getElementById('safetyModal')) return;
    const d = document.createElement('div');
    d.id = 'safetyModal';
    d.setAttribute('role', 'dialog'); d.dir = 'rtl';
    d.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(20,26,74,.55);display:flex;align-items:center;justify-content:center;padding:16px';
    d.innerHTML = `<div style="background:#fff;border-radius:22px;max-width:420px;width:100%;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,.25);font-family:inherit">
      ${SAFETY_HTML}
      <button id="safetyOk" class="btn" style="margin-top:12px;width:100%;font-size:20px">הבנתי, יאללה לשחק! ✨</button></div>`;
    document.body.appendChild(d);
    document.getElementById('safetyOk').onclick = () => { try { localStorage.setItem(key, '1'); } catch (e) {} d.remove(); };
  }

  G.SAFE = { checkName, safeName, SAFETY_HTML, maybeDailyReminder };
})(window);
