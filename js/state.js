/* Constants, seed data, load/migrate/save (localStorage) and state helpers. */
const KEY = 'adhelper-v1', VER = 6, DEMO_PASS = 'demo-pass';
const PLATS = {
  twitter:   { max: 280,  r: [800, 450], rt: '16:9' },
  instagram: { max: 2200, r: [600, 600], rt: '1:1' },
  snap:      { r: [450, 800], rt: '9:16' },
  tiktok:    { r: [450, 800], rt: '9:16' },
  facebook:  { r: [600, 600], rt: '1:1' },
  whatsapp:  { r: [450, 800], rt: '9:16' },
  youtube:   { r: [800, 450], rt: '16:9' }
};
const STYLE_K = ['formal', 'young', 'story', 'commercial', 'short', 'kids'];
const GOAL_K = ['sales', 'launch', 'followers', 'visits'];
const CAT_K = ['general', 'decor', 'furniture', 'fashion', 'food', 'beauty', 'electronics', 'realestate', 'services', 'kids'];
const STORE_DEF = { free: 150, mid: 500, gold: 1000 };
const LANG_K = ['ar', 'en', 'zh', 'ko', 'ja', 'es', 'pt', 'fr'];
const USER_R = ['home', 'create', 'image', 'video', 'scenes', 'library', 'suggest', 'campaigns', 'plans', 'account'];
const ADMIN_R = ['a-home', 'a-users', 'a-plans', 'a-ads', 'a-sugg', 'a-errors', 'a-usage', 'a-campaigns', 'a-fin', 'a-settings'];
const ROLES = {
  'Super Admin': ADMIN_R,
  'Admin': ADMIN_R.filter(r => r !== 'a-settings'),
  'Support': ['a-home', 'a-users', 'a-ads', 'a-sugg'],
  'Finance': ['a-home', 'a-plans', 'a-fin'],
  'AI Monitor': ['a-home', 'a-errors', 'a-usage']
};
/* Social accounts. `m` is a neutral monogram shown on the icon button; `compose` exists only where the
   platform has a public link that opens a new post with the text filled in. */
const SOCIAL = {
  instagram: { n: 'Instagram', m: 'IG', home: 'https://www.instagram.com/' },
  twitter:   { n: 'X (Twitter)', m: 'X', home: 'https://x.com/', compose: x => 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(x) },
  facebook:  { n: 'Facebook', m: 'f', home: 'https://www.facebook.com/' },
  tiktok:    { n: 'TikTok', m: 'TT', home: 'https://www.tiktok.com/upload' },
  whatsapp:  { n: 'WhatsApp', m: 'WA', home: 'https://web.whatsapp.com/', compose: x => 'https://wa.me/?text=' + encodeURIComponent(x) },
  youtube:   { n: 'YouTube', m: 'YT', home: 'https://studio.youtube.com/' },
  snap:      { n: 'Snapchat', m: 'SC', home: 'https://www.snapchat.com/' }
};
const okURL = u => /^https?:\/\/[^\s]+\.[^\s]+/i.test(u);
const socialOf = u => (u && u.social) || [];
const AI_OPS = { improve: 'Groq', variants: 'Groq', titles: 'Mistral', tags: 'Mistral', image: 'Stability AI', suggest: 'Anthropic', video: 'Grok' };
const PLAN_DEF = { free: 'المجانية', mid: 'المتوسطة', gold: 'الذهبية' };

let S, T = { err: '', msg: '' };
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rid = p => p + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
const ago = d => new Date(Date.now() - d * 864e5).toISOString();
const enc = new TextEncoder();
const opts = (keys, pre) => Object.fromEntries(keys.map(k => [k, t(pre + k)]));
const fdate = d => new Date(d).toLocaleDateString(L() === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const sar = n => (Math.round(n * 100) / 100).toLocaleString('en-US') + ' ' + t('sar');

const byId = (arr, id) => arr.find(x => x.id === id);
const cur = () => S.users.find(u => u.id === S.uid);
const planOf = u => byId(S.plans, u.plan) || S.plans[0];
const planName = p => PLAN_DEF[p.id] === p.name ? t('plan_' + p.id) : p.name;
const left = (u, k) => Math.max(0, (planOf(u)[k] || 0) + (k === 'ads' ? u.bonus : 0) + ((u.extra || {})[k] || 0) - (u.used[k] || 0));
const uname = id => (byId(S.users, id) || { name: t('deleted') }).name;

/* Admin rights are read from the signed-in user; there is no separate admin session. */
const isAdmin = () => { const u = cur(); return !!(u && u.isAdmin && u.adminRole); };
const allowed = r => { const u = cur(); return isAdmin() && ((ROLES[u.adminRole] || []).includes(r) || (u.permissions || []).includes(r)); };
const isLastSuper = u => u.isAdmin && u.adminRole === 'Super Admin' && S.users.filter(x => x.isAdmin && x.adminRole === 'Super Admin').length === 1;

const mediaObjs = a => [a.img, a.vid, ...(a.refs || []), ...((a.scenes && a.scenes.items) || [])].filter(m => m && m.id);
const mediaIds = a => [...new Set(mediaObjs(a).map(m => m.id))];
const calcBytes = a => {
  const sizes = new Map(); mediaObjs(a).forEach(m => sizes.set(m.id, m.size || 0));
  return [...sizes.values()].reduce((n, v) => n + v, 0)
    + enc.encode(JSON.stringify([a.text, a.titles, a.tags, a.variants || 0, a.refNote || '', a.scenes ? [a.scenes.script, a.scenes.items.map(i => i.cap)] : 0])).length;
};
const adBytes = a => a.bytes != null ? a.bytes : calcBytes(a);
const usedBytes = u => {
  let n = S.ads.filter(a => a.uid === u.id).reduce((n, a) => n + adBytes(a), 0);
  if (S.draft && u.id === S.uid) { const seen = new Set(); mediaObjs(S.draft).forEach(m => { if (!seen.has(m.id) && !owned(m.id)) { seen.add(m.id); n += m.size || 0; } }); }
  return n;
};
const limitMB = u => (u.storageMB != null ? u.storageMB : (planOf(u).storage ?? 50)) + ((u.extra || {}).storage || 0);
const fmtMB = b => { const m = b / 1048576; return m.toFixed(m < 10 ? 2 : 1); };
const fmtSize = b => b < 1048576 ? (b / 1024).toFixed(1) + ' ' + t('kb') : fmtMB(b) + ' ' + t('mb');

const newUser = o => ({ id: rid('U'), name: '', email: '', phone: '', plan: 'free', joined: new Date().toISOString(), used: { ads: 0, images: 0, analyses: 0, vidSecs: 0 }, bonus: 0, extra: {}, storageMB: null, isAdmin: false, adminRole: null, permissions: [], ...o });
const newScenes = () => ({ total: 10, script: '', items: [] });
const defaultAddons = () => [
  { id: 'ad-st', name: 'مساحة إضافية', kind: 'storage', mode: 'unit', amount: 50, price: 8, active: true },
  { id: 'ad-im', name: '10 صور إضافية', kind: 'images', mode: 'pack', amount: 10, price: 10, active: true },
  { id: 'ad-vd', name: 'ثواني فيديو إضافية', kind: 'vidSecs', mode: 'unit', amount: 10, price: 7, active: true }
];
const ADDON_K = ['storage', 'images', 'vidSecs', 'ads', 'analyses'];
const newDraft = () => ({ product: '', audience: '', platform: 'instagram', style: 'young', goal: 'sales', lang: 'ar', out: {}, img: null, vid: null, refs: [], refNote: '', category: 'general', shareTo: '', imgDesc: '', vidDesc: '', vidSec: null, scenes: newScenes(), editId: null });
/* Company identity. Everything here is edited from Admin > Settings > Company; empty fields are simply not shown. */
const defaultCompany = () => ({
  nameAr: 'شركة منطاد للتقنية', nameEn: 'Mentad Technology Company', brandAr: 'منطاد للتقنية', brandEn: 'Mentad',
  productAr: 'استوديو تصميم وتسويق', productEn: 'Design & Marketing Studio',
  logo: DEFAULT_LOGO, footerLogo: DEFAULT_LOGO, iconStyle: 'gradient-m',
  crNumber: '', vatNumber: '', emailGeneral: '', emailSupport: '', emailLegal: '', phone: '', address: '', footerNote: '',
  companyTagline: '', aboutLead: 'شركة سعودية تبني أدوات ذكية للعالم العربي.',
  aboutText: 'منطاد للتقنية شركة سعودية تعمل على تطوير حلول تقنية بالعربية. منصة استوديو تصميم وتسويق هي إحدى منتجاتها.',
  termsText: '', privacyText: '', footerLinks: [], showLegal: false
});
const PUBLIC_R = ['about', 'terms', 'privacy'];
const co = () => S.settings.company;
const coName = () => (L() === 'ar' ? co().nameAr : co().nameEn) || co().nameAr;
const coBrand = () => (L() === 'ar' ? co().brandAr : co().brandEn) || co().brandAr;
const appName = () => (L() === 'ar' ? co().productAr : co().productEn) || co().productAr;
/* A logo value may be an uploaded image (data URL), an https link, or SVG code. SVG code is shown as an image, never run. */
const logoSrc = v => {
  v = String(v || '').trim();
  if (/^<svg[\s>]/i.test(v)) return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(v);
  return /^(data:image\/|https:\/\/)/i.test(v) ? v : DEFAULT_LOGO;
};
/* Header icon: a rounded square with the brand gradient and a white M. Inline SVG, under 1 KB.
   The two stops take their colour from --m1/--m2, which are slightly lighter in dark mode. */
const M_ICON = '<svg xmlns="http://www.w3.org/2000/svg" class="mico" width="32" height="32" viewBox="0 0 32 32" role="img" aria-label="M"><defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="s1" stop-color="#F26A0F"/><stop offset="1" class="s2" stop-color="#1B8FBF"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#mg)"/><text x="16" y="16.5" text-anchor="middle" dominant-baseline="central" font-family="Alexandria,Arial,sans-serif" font-weight="700" font-size="19" fill="#fff">M</text></svg>';
const iconIsM = () => co().iconStyle !== 'logo';
const defaultSettings = () => ({ mailFrom: 'no-reply@example.com', mailName: 'استوديو الإعلانات', orBase: 'https://openrouter.ai/api/v1', orKey: '', orLive: false, txtModel: 'google/gemini-2.5-flash', imgModel: 'google/gemini-2.5-flash-image', vidModel: 'x-ai/grok-imagine-video', vidSec: 6, vidEndpoint: '/videos', stripeLive: false, currency: 'SAR', twofa: true, lockAfter: 5, campaigns: false, dashHome: 'a-home', uiLang: 'ar', theme: 'auto', socIcons: {}, company: defaultCompany(), brand: { primary: '#1b8fbf', accent: '#f26a0f', dark: false, v: 2 } });

function seed() {
  const plans = [
    { id: 'free', name: PLAN_DEF.free, price: 0, ads: 5, images: 3, analyses: 5, vidSecs: 0, storage: STORE_DEF.free, active: true },
    { id: 'mid', name: PLAN_DEF.mid, price: 29, ads: 50, images: 20, analyses: 30, vidSecs: 30, storage: STORE_DEF.mid, active: true },
    { id: 'gold', name: PLAN_DEF.gold, price: 99, ads: 200, images: 100, analyses: 120, vidSecs: 150, storage: STORE_DEF.gold, deep: true, active: true }
  ];
  const U = (name, email, plan, d, used, extra) => newUser({ name, email, plan, joined: ago(d), used: { vidSecs: 0, ...used }, ...extra });
  const users = [
    U('عبدالله', 'demo@example.com', 'free', 12, { ads: 3, images: 2, analyses: 2 }),
    U('نورة', 'noura@example.com', 'gold', 95, { ads: 64, images: 31, analyses: 40 }),
    U('فهد', 'fahad@example.com', 'mid', 61, { ads: 22, images: 9, analyses: 14 }),
    U('سارة', 'sara@example.com', 'mid', 33, { ads: 17, images: 6, analyses: 11 }),
    U('خالد', 'khalid@example.com', 'free', 8, { ads: 4, images: 1, analyses: 3 }),
    U('ريم', 'reem@example.com', 'gold', 0, { ads: 2, images: 1, analyses: 2 }),
    U('المالك', 'owner@example.com', 'free', 120, { ads: 0, images: 0, analyses: 0 }, { isAdmin: true, adminRole: 'Super Admin' })
  ];
  const mk = (u, product, audience, platform, style, goal, d, seedN) => {
    const o = { id: rid('A'), uid: u.id, product, audience, platform, style, goal, lang: 'ar', date: ago(d), variants: null, vid: null, refs: [], refNote: '', category: 'general', scenes: null };
    o.text = gen(style, o); o.titles = genTitles(o); o.tags = genTags(o);
    o.img = seedN ? { seed: seedN, desc: genDesc(o) } : null; o.bytes = calcBytes(o);
    return o;
  };
  const ads = [
    mk(users[0], 'قهوة مختصة محمّصة طازجة', 'محبّي القهوة في الرياض', 'instagram', 'story', 'sales', 1, 7),
    mk(users[0], 'اشتراك شهري للقهوة', 'الموظفين المشغولين', 'twitter', 'short', 'launch', 4, 0),
    mk(users[0], 'دورة تحضير القهوة', 'المبتدئين', 'tiktok', 'young', 'followers', 9, 12),
    mk(users[1], 'عطور شرقية فاخرة', 'عشّاق العطور', 'snap', 'commercial', 'sales', 2, 5),
    mk(users[2], 'تطبيق توصيل وجبات صحية', 'الرياضيين', 'instagram', 'formal', 'visits', 6, 9),
    mk(users[3], 'حقائب جلدية يدوية', 'السيدات العاملات', 'twitter', 'commercial', 'launch', 15, 0)
  ];
  const payments = [];
  users.forEach(u => {
    const p = plans.find(x => x.id === u.plan); if (!p.price) return;
    const days = Math.round((Date.now() - new Date(u.joined)) / 864e5);
    for (let d = days; d >= 0; d -= 30) payments.push({ uid: u.id, amount: p.price, date: ago(d) });
  });
  const sg = (u, text, d, status) => ({ id: rid('S'), uid: u.id, text, date: ago(d), status, ...analyze(text) });
  const er = (title, desc, ai, fix, status, d) => ({ id: rid('E'), title, desc, ai, fix, status, date: ago(d) });
  return {
    v: VER, route: 'home', uid: users[0].id, plans, addons: defaultAddons(), users, ads, payments, cancels: 1,
    aiLog: [['improve', 0, 0], ['image', 0, 1], ['titles', 1, 1], ['variants', 2, 2], ['suggest', 1, 3], ['image', 3, 4]].map(([op, u, d]) => ({ uid: users[u].id, op, m: '', date: ago(d) })),
    suggestions: [
      sg(users[1], 'أتمنى إضافة دعم لمنصة لينكدإن مع قوالب إعلانات مخصصة للشركات والوظائف.', 3, 'new'),
      sg(users[2], 'تحسين جودة الصور المولّدة وإتاحة اختيار ألوان العلامة التجارية قبل التوليد.', 7, 'accepted'),
      sg(users[4], 'تطبيق جميل', 10, 'rejected')
    ],
    errors: [
      er('فشل توليد الصورة', 'انتهت مهلة طلب توليد الصورة بعد 30 ثانية لدى 3 مستخدمين.', 'السبب المرجّح ازدحام مزوّد الصور في وقت الذروة.', 'إعادة المحاولة تلقائياً مرتين ورفع المهلة إلى 60 ثانية.', 'open', 0),
      er('فشل إشعار الدفع', 'لم يصل إشعار Stripe لتجديد اشتراك واحد، فبقيت الباقة على حالها.', 'توقيع الإشعار لم يُطابق المفتاح السري بعد تغييره.', 'تحديث مفتاح توقيع الإشعارات في إعدادات الدفع ثم إعادة إرسال الإشعار.', 'open', 1),
      er('تجاوز حد الباقة', 'تمكّن مستخدم من حفظ إعلان سادس في الباقة المجانية.', 'التحقق من الحد يتم في الواجهة فقط وليس في الخادم.', 'إضافة تحقق من الحد في الخادم قبل الحفظ.', 'sent', 3),
      er('بريد مكرر عند التسجيل', 'رسالة الخطأ لم تظهر عند إدخال بريد مسجّل مسبقاً بأحرف كبيرة.', 'المقارنة حسّاسة لحالة الأحرف.', 'توحيد البريد إلى أحرف صغيرة قبل المقارنة.', 'fixed', 5)
    ],
    settings: defaultSettings(),
    filt: { date: 'all', plat: 'all', style: 'all' },
    draft: newDraft()
  };
}

/* v3 -> v4: admins become users, new settings, cached ad sizes.
   v4 -> v5: video quota in seconds, add-ons, scenes.
   v5 -> v6: several attachments (images and video), product type, larger default storage. Anything older than v3 is reseeded. */
function migrate(o) {
  if (!o || typeof o !== 'object' || !o.v || o.v < 3 || !Array.isArray(o.users) || !o.settings) return null;
  if (o.v === 3) {
    o.users.forEach(u => {
      u.isAdmin = !!u.isAdmin; u.adminRole = u.adminRole || null; u.permissions = u.permissions || [];
      if (u.storageMB === undefined) u.storageMB = null;
      if (u.used.videos == null) u.used.videos = 0;
    });
    (o.admins || []).forEach(a => {
      const email = String(a.email || '').toLowerCase(); if (!email) return;
      let u = o.users.find(x => x.email === email);
      if (!u) { u = newUser({ name: email.split('@')[0], email }); o.users.push(u); }
      u.adminRole = ROLES[a.role] ? a.role : 'Admin'; u.isAdmin = a.active !== false;
    });
    if (!o.users.some(u => u.isAdmin && u.adminRole === 'Super Admin')) {
      let u = o.users.find(x => x.email === 'owner@example.com');
      if (!u) { u = newUser({ name: 'المالك', email: 'owner@example.com' }); o.users.push(u); }
      u.isAdmin = true; u.adminRole = 'Super Admin';
    }
    delete o.admins; delete o.admin; delete o.adminRole;
    o.plans.forEach(p => { if (p.storage == null) p.storage = { free: 50, mid: 150, gold: 250 }[p.id] || 100; });
    o.settings = { ...defaultSettings(), ...o.settings };
    ['orModel', 'imgProvider', 'imgQuality', 'video'].forEach(k => delete o.settings[k]);
    (o.suggestions || []).forEach(s => { Object.assign(s, analyze(s.text)); delete s.note; });
    o.draft = { ...newDraft(), ...(o.draft || {}) };
    o.ads.forEach(a => { a.refImg = a.refImg || null; a.refNote = a.refNote || ''; a.bytes = calcBytes(a); });
    o.aiLog = o.aiLog || [];
    if (o.route === 'a-login') o.route = 'login';
    o.v = 4;
  }
  if (o.v === 4) {
    o.plans.forEach(p => { if (p.vidSecs == null) p.vidSecs = (p.videos || 0) * 15; delete p.videos; });
    o.users.forEach(u => { if (u.used.vidSecs == null) u.used.vidSecs = (u.used.videos || 0) * 6; delete u.used.videos; u.extra = u.extra || {}; });
    o.addons = o.addons || defaultAddons();
    o.draft = { ...newDraft(), ...(o.draft || {}) };
    o.ads.forEach(a => { if (a.scenes === undefined) a.scenes = null; });
    if (o.settings.mailName === 'مساعد الإعلانات') o.settings.mailName = 'استوديو الإعلانات';
    o.settings.vidSec = Math.min(15, Math.max(6, +o.settings.vidSec || 6));
    if (o.route === 'a-login') o.route = 'login';
    o.v = 5;
  }
  if (o.v === 5) {
    const conv = x => { x.refs = x.refs || (x.refImg ? [{ id: x.refImg.id, size: x.refImg.size, name: x.refImg.name, kind: 'img' }] : []); delete x.refImg; x.category = x.category || 'general'; };
    o.draft = { ...newDraft(), ...(o.draft || {}) }; conv(o.draft);
    o.ads.forEach(a => { conv(a); a.bytes = calcBytes(a); });
    o.plans.forEach(p => { if (STORE_DEF[p.id] && p.storage === { free: 50, mid: 150, gold: 250 }[p.id]) p.storage = STORE_DEF[p.id]; });
    o.v = 6;
  }
  return o.v === VER ? o : null;
}

function loadState() {
  let o = null;
  try { o = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  S = migrate(o) || seed();
  S.settings.company = { ...defaultCompany(), ...(S.settings.company || {}) };
  S.settings.brand = { primary: '', accent: '', dark: false, ...(S.settings.brand || {}) };
  /* v2: the day theme uses the identity colours by default (once; a later reset to the original palette is kept). */
  if (!S.settings.brand.v) { if (!S.settings.brand.primary && !S.settings.brand.accent) Object.assign(S.settings.brand, { primary: '#1b8fbf', accent: '#f26a0f', dark: false }); S.settings.brand.v = 2; }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S, (k, v) => k === 'dataURL' ? undefined : v)); }
  catch (e) { if (e && e.name === 'QuotaExceededError') toast(t('m_ls_full'), 1); }
}

/* Passwords: seeded demo accounts use DEMO_PASS; sign-ups store a salted SHA-256 hash. */
async function sha(x) {
  try {
    const b = await crypto.subtle.digest('SHA-256', enc.encode(x));
    return [...new Uint8Array(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    let h = 2166136261; for (const c of x) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); }
    return 'f' + (h >>> 0).toString(16);
  }
}
const checkPass = async (u, pass) => u.pw ? (await sha(u.pw.s + pass)) === u.pw.h : pass === DEMO_PASS;
