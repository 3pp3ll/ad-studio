/* Text templates (the fallback used with no connection) and the real OpenRouter calls. */
const CTA = { sales: 'اطلبه الآن قبل نفاد الكمية.', launch: 'متوفر الآن لأول مرة، كن من أوائل المجرّبين.', followers: 'تابعنا ليصلك كل جديد.', visits: 'زر موقعنا واكتشف المزيد.' };
const GTAG = { sales: '#عروض', launch: '#جديد', followers: '#تابعونا', visits: '#اكتشف' };
const PLAT_AR = { twitter: 'تويتر', instagram: 'إنستغرام', snap: 'سناب', tiktok: 'تيك توك', facebook: 'فيسبوك', whatsapp: 'واتساب', youtube: 'يوتيوب' };
const STYLE_AR = { formal: 'رسمي', young: 'شبابي', story: 'قصصي', commercial: 'تجاري', short: 'مختصر', kids: 'أطفال' };
const GOAL_AR = { sales: 'زيادة مبيعات', launch: 'إطلاق منتج', followers: 'زيادة متابعين', visits: 'زيارات' };
const CAT_AR = { general: '', decor: 'ديكور', furniture: 'أثاث', fashion: 'أزياء وملابس', food: 'مطاعم وأغذية', beauty: 'عطور وتجميل', electronics: 'إلكترونيات', realestate: 'عقار', services: 'خدمات', kids: 'منتجات أطفال' };
const LANG_AR = { ar: 'العربية', en: 'الإنجليزية', zh: 'الصينية', ko: 'الكورية', ja: 'اليابانية', es: 'الإسبانية', pt: 'البرتغالية', fr: 'الفرنسية' };
const TX = {
  en: { t: (p, a, c) => `${p}, made for ${a}. ${c}`, k: (p, a, c) => `Hey kids! 🎈 ${p} is here to make your day more fun. A lovely pick for ${a}. ${c}`, cta: { sales: 'Order now while stocks last.', launch: 'Available now for the first time.', followers: 'Follow us for more.', visits: 'Visit our website to learn more.' }, ti: (p, a) => [`${p}: what ${a} have been waiting for`, `Why choose ${p}?`] },
  zh: { t: (p, a, c) => `${p}，专为${a}打造。${c}`, k: (p, a, c) => `小朋友们好！🎈 ${p}来啦，让每一天更有趣。送给${a}的贴心之选。${c}`, cta: { sales: '立即订购，售完即止。', launch: '现已首次上市。', followers: '关注我们，获取最新动态。', visits: '访问我们的网站了解更多。' }, ti: (p, a) => [`${p}：${a}的理想之选`, `为什么选择${p}？`] },
  ko: { t: (p, a, c) => `${p}, ${a}을(를) 위해 준비했습니다. ${c}`, k: (p, a, c) => `어린이 친구들 안녕! 🎈 ${p}와(과) 함께 더 신나는 하루를 보내요. ${a}에게 딱 맞는 선택. ${c}`, cta: { sales: '지금 주문하세요. 재고 소진 시 종료됩니다.', launch: '지금 처음으로 만나보세요.', followers: '팔로우하고 새 소식을 받아보세요.', visits: '웹사이트에서 더 알아보세요.' }, ti: (p, a) => [`${p}: ${a}을(를) 위한 선택`, `왜 ${p}일까요?`] },
  ja: { t: (p, a, c) => `${p}、${a}のためにご用意しました。${c}`, k: (p, a, c) => `みんな、こんにちは！🎈 ${p}で毎日をもっと楽しくしよう。${a}にぴったりです。${c}`, cta: { sales: '今すぐご注文ください。在庫限りです。', launch: 'ついに新登場。', followers: 'フォローして最新情報をチェック。', visits: '詳しくはウェブサイトへ。' }, ti: (p, a) => [`${p}：${a}のための一品`, `なぜ${p}なのか？`] },
  es: { t: (p, a, c) => `${p}, pensado para ${a}. ${c}`, k: (p, a, c) => `¡Hola, peques! 🎈 ${p} llega para hacer tu día más divertido. Una elección ideal para ${a}. ${c}`, cta: { sales: 'Pídelo ahora, hasta agotar existencias.', launch: 'Disponible ahora por primera vez.', followers: 'Síguenos para no perderte nada.', visits: 'Visita nuestra web y descubre más.' }, ti: (p, a) => [`${p}: lo que ${a} estaba esperando`, `¿Por qué elegir ${p}?`] },
  pt: { t: (p, a, c) => `${p}, feito para ${a}. ${c}`, k: (p, a, c) => `Olá, criançada! 🎈 ${p} chegou para deixar o seu dia mais divertido. Uma ótima escolha para ${a}. ${c}`, cta: { sales: 'Peça já, enquanto durar o estoque.', launch: 'Disponível agora pela primeira vez.', followers: 'Siga-nos para ficar por dentro.', visits: 'Visite o nosso site e saiba mais.' }, ti: (p, a) => [`${p}: o que ${a} esperava`, `Por que escolher ${p}?`] },
  fr: { t: (p, a, c) => `${p}, pensé pour ${a}. ${c}`, k: (p, a, c) => `Coucou les enfants ! 🎈 ${p} arrive pour rendre vos journées plus amusantes. Un choix idéal pour ${a}. ${c}`, cta: { sales: 'Commandez maintenant, dans la limite des stocks.', launch: 'Disponible dès maintenant pour la première fois.', followers: 'Suivez-nous pour ne rien manquer.', visits: 'Visitez notre site pour en savoir plus.' }, ti: (p, a) => [`${p} : ce que ${a} attendait`, `Pourquoi choisir ${p} ?`] }
};
const lg = d => LANG_K.includes(d.lang) ? d.lang : 'ar';
const ctaOf = d => lg(d) === 'ar' ? CTA[d.goal] : TX[lg(d)].cta[d.goal];

function gen(style, d) {
  const p = d.product.trim(), a = d.audience.trim(), c = ctaOf(d);
  if (lg(d) !== 'ar') { const X = TX[lg(d)]; return (style === 'kids' ? X.k : X.t)(p, a, c); }
  return {
    formal: `نقدّم لكم ${p}، خياراً موثوقاً صُمّم خصيصاً لـ${a}. نلتزم بجودة ثابتة وخدمة تليق بثقتكم. ${c}`,
    young: `${a}، هذا لكم! ${p} وصل وبيغيّر يومكم ✨ جرّبوه وخبّرونا رأيكم. ${c}`,
    story: `بدأت الحكاية بسؤال بسيط: ما الذي يحتاجه ${a} فعلاً؟ بعد تجارب كثيرة جاء الجواب: ${p}. واليوم حان دورك لتكمل الحكاية. ${c}`,
    commercial: `${p} الآن بين يديك. جودة عالية وقيمة حقيقية مقابل ما تدفعه، لـ${a} تحديداً. ${c}`,
    short: `${p}. لـ${a}. ${c}`,
    kids: `مرحباً يا أبطال! 🎈 ${p} هنا ليملأ يومكم مرحاً وألواناً. اختيار جميل لـ${a}. ${c}`
  }[style];
}
const genTitles = d => lg(d) !== 'ar' ? TX[lg(d)].ti(d.product.trim(), d.audience.trim()) : [
  `${d.product}: ما كان ينقص ${d.audience}`, `لماذا يختار ${d.audience} ${d.product}؟`, `${d.product} بطريقة لم تجرّبها من قبل`,
  { sales: 'عرض لفترة محدودة', launch: 'وصل أخيراً', followers: 'انضم إلى مجتمعنا', visits: 'اكتشف المزيد على موقعنا' }[d.goal] + `: ${d.product}`];
const tag = s => '#' + s.trim().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, '_');
const genTags = d => lg(d) !== 'ar' ? [...new Set([tag(d.product), tag(d.audience), '#ad'])]
  : [...new Set([tag(d.product), tag(d.audience), GTAG[d.goal], '#' + PLAT_AR[d.platform].replace(' ', '_'), '#إعلان'])];
const genDesc = d => `صورة إعلانية بنسبة ${PLATS[d.platform].rt} لمنصة ${PLAT_AR[d.platform]} تُبرز «${d.product}» ${d.style === 'kids' ? 'برسوم كرتونية مرحة وألوان زاهية وشخصيات لطيفة مناسبة للأطفال' : 'بألوان هادئة وخلفية نظيفة'}، موجّهة إلى ${d.audience}.`;
const genVidDesc = d => `مقطع إعلاني قصير لـ«${d.product}» موجّه إلى ${d.audience}: ${d.style === 'kids' ? 'رسوم متحركة مرحة بألوان زاهية وشخصيات لطيفة مناسبة للأطفال' : 'لقطات قريبة للمنتج، ألوان فاتحة هادئة، وحركة كاميرا ناعمة'}.`;

/* Local stand-in for the AI review of a suggestion. */
function analyze(x) {
  const k = [['صور', 'img'], ['image', 'img'], ['باق', 'plans'], ['plan', 'plans'], ['منص', 'plat'], ['platform', 'plat'], ['حمل', 'camp'], ['campaign', 'camp'], ['سرع', 'perf'], ['fast', 'perf']].find(p => x.toLowerCase().includes(p[0]));
  return { cat: k ? k[1] : 'gen', score: Math.min(5, 2 + (x.length > 40) + (x.length > 90) + (k ? 1 : 0)) };
}

/* ---------- OpenRouter ---------- */
/* Live when switched on and either a key is set (direct) or the API URL points at your own proxy. */
const aiOn = () => { const s = S.settings; return !!(s.orLive && (s.orKey || !/openrouter\.ai/i.test(s.orBase))); };
const apiBase = () => S.settings.orBase.replace(/\/+$/, '');
const via = u => /^https?:/.test(u) ? u.replace(/^https?:\/\/openrouter\.ai\/api\/v1/i, apiBase()) : apiBase() + u;
const authHeader = () => S.settings.orKey ? { Authorization: 'Bearer ' + S.settings.orKey } : {};
let nBusy = 0;
const busy = v => { nBusy += v ? 1 : -1; const b = $('#busy'); b.textContent = t('busy'); b.hidden = nBusy <= 0; };
const logAI = op => {
  const st = S.settings, m = aiOn() ? ({ image: st.imgModel, video: st.vidModel, suggest: '' }[op] ?? st.txtModel) : '';
  S.aiLog.unshift({ uid: S.uid, op, m, date: new Date().toISOString() });
  if (S.aiLog.length > 200) S.aiLog.pop();
};

async function orFetch(path, body) {
  let r;
  try {
    r = await fetch(via(path), { method: body ? 'POST' : 'GET', headers: { ...authHeader(), ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
  } catch (e) { throw new Error(t('e_net')); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j.error && (j.error.message || j.error)) || ('HTTP ' + r.status));
  return j;
}

/* Returns the model's text, or null so the caller falls back to the template. */
async function ask(prompt) {
  if (!aiOn()) return null;
  busy(1);
  try {
    const j = await orFetch('/chat/completions', { model: S.settings.txtModel, messages: [
      { role: 'system', content: 'أنت كاتب إعلانات محترف متعدد اللغات. اكتب الناتج باللغة المطلوبة فقط، وأجب بالمطلوب دون مقدمات أو شرح.' },
      { role: 'user', content: prompt }] });
    return (j.choices[0].message.content || '').trim() || null;
  } catch (e) { toast(t('m_or_fail', { e: e.message }), 1); return null; }
  finally { busy(0); }
}
const brief = d => `المنتج/الخدمة: ${d.product}\n${CAT_AR[d.category] ? `نوع المنتج: ${CAT_AR[d.category]}\n` : ''}الجمهور المستهدف: ${d.audience}\nالمنصة: ${PLAT_AR[d.platform]}${PLATS[d.platform].max ? ` (الحد ${PLATS[d.platform].max} حرفاً)` : ''}\nالهدف: ${GOAL_AR[d.goal]}\nلغة الناتج: ${LANG_AR[lg(d)]} (اكتب الناتج كله بهذه اللغة)${d.style === 'kids' ? '\nالمحتوى موجّه للأطفال: لغة بسيطة ومرحة وآمنة ومناسبة لأعمارهم.' : ''}`;
const adPrompt = (style, d) => `اكتب نص إعلان واحداً بأسلوب ${STYLE_AR[style]}.\n${brief(d)}`;

/* Decor design: the product type is decor or furniture and there are attachments to build on. */
const decorMode = d => (d.category === 'decor' || d.category === 'furniture') && (d.refs || []).length > 0;
const decorPrompt = d => `صمّم ${d.category === 'furniture' ? 'تأثيثاً' : 'ديكوراً داخلياً'} واقعياً للمساحة الظاهرة في الصور المرفقة. حافظ على أبعاد المكان والجدران والأبواب والنوافذ وزاوية التصوير كما هي، وأضف ${d.category === 'furniture' ? 'الأثاث المناسب' : 'الأثاث والإضاءة والإكسسوارات المناسبة'} بحيث يظهر الناتج كصورة حقيقية ملتقطة للمكان نفسه بعد تجهيزه.\nالمطلوب: ${d.imgDesc || d.product}\nالجمهور: ${d.audience}`;
async function refImages(d, max = 4) {
  const out = [];
  for (const r of (d.refs || []).slice(0, max)) { try { out.push(await refData(r)); } catch (e) {} }
  return out;
}

/* Image: text-only, or text + the attachments (video attachments go as their first frame). Returns a Blob. */
async function aiImage(d) {
  const imgs = await refImages(d);
  const prompt = decorMode(d) && imgs.length ? `${decorPrompt(d)}\nنسبة الأبعاد ${PLATS[d.platform].rt}.`
    : `${d.imgDesc || genDesc(d)}\nنسبة الأبعاد ${PLATS[d.platform].rt}. نص الإعلان للاستلهام: ${d.out.text || gen(d.style, d)}`;
  const content = imgs.length
    ? [{ type: 'text', text: (d.refNote ? d.refNote + '\n' : '') + prompt }, ...imgs.map(url => ({ type: 'image_url', image_url: { url } }))]
    : prompt;
  const j = await orFetch('/chat/completions', { model: S.settings.imgModel, modalities: ['image', 'text'], messages: [{ role: 'user', content }] });
  const im = j.choices && j.choices[0].message.images, u = im && im[0] && im[0].image_url && im[0].image_url.url;
  if (!u) throw new Error(t('e_no_image'));
  return toBlob(u);
}

/* Free design: the description goes to the image model as written. */
/* A short request becomes one precise English prompt; words that must appear stay in their own language and spelling, in quotes. */
const FREE_SYS = 'You turn a short user request into one precise prompt for an AI {k} generation model. Write the prompt in English. Keep the user\'s intent exactly and add concrete details: subject, composition, style, colours, lighting{v}. If the request needs words, a brand name or a logo, use only the name the user gave; put every word that must appear in double quotes in its original language and script (Arabic stays in Arabic script), say it must be spelled exactly as written, large and legible, and that no other text may appear anywhere. If no words are needed, say: no text, no letters. For a logo: a clean flat vector-style mark with the name, centered on a plain white background, no mockup, no extra symbols. Reply with the prompt only.';
async function freePrompt(p, kind) {
  if (!aiOn()) return p;
  try {
    const j = await orFetch('/chat/completions', { model: S.settings.txtModel, messages: [{ role: 'system', content: FREE_SYS.replace('{k}', kind === 'vid' ? 'video' : 'image').replace('{v}', kind === 'vid' ? ', camera movement and motion' : '') }, { role: 'user', content: p }] });
    return ((j.choices[0].message.content || '').trim() || p) + (kind === 'vid' ? '' : '\nUser request (for reference): ' + p);
  } catch (e) { return p; }
}
async function aiFreeImage(prompt) {
  const j = await orFetch('/chat/completions', { model: S.settings.freeImgModel || S.settings.imgModel, modalities: ['image', 'text'], messages: [{ role: 'user', content: prompt }] });
  const im = j.choices && j.choices[0].message.images, u = im && im[0] && im[0].image_url && im[0].image_url.url;
  if (!u) throw new Error(t('e_no_image'));
  return toBlob(u);
}

/* Video: async job. The first frame is the designed still (decor mode) or the first attachment;
   if the model refuses the frame, retry text-only. */
async function aiVideo(d, onStatus, secs, firstFrame) {
  const st = S.settings, ep = st.vidEndpoint || '/videos', hasRef = (d.refs || []).length > 0;
  const script = d.scenes && d.scenes.script ? '\nالحوار المنطوق في المقطع: ' + d.scenes.script.trim() : '';
  const lead = firstFrame ? 'مقطع واقعي كأنه مصوَّر داخل هذا المكان بعد تجهيزه كما في الصورة: حركة كاميرا هادئة تستعرض الأثاث والتفاصيل دون تغيير تصميم المكان.\n' : '';
  const body = { model: st.vidModel, prompt: (lead + (hasRef && d.refNote ? d.refNote + '\n' : '') + (d.vidDesc || (firstFrame ? '' : genVidDesc(d))) + script).trim(), duration: secs, aspect_ratio: PLATS[d.platform].rt, resolution: '720p' };
  let j = null, frame = firstFrame;
  if (!frame && hasRef) { try { frame = await refData(d.refs[0]); } catch (e) {} }
  if (frame) {
    try { j = await orFetch(ep, { ...body, frame_images: [{ type: 'image_url', image_url: { url: frame }, frame_type: 'first_frame' }] }); }
    catch (e) { toast(t('m_ref_vid_fail'), 1); }
  }
  if (!j) j = await orFetch(ep, body);
  const purl = j.polling_url || (ep + '/' + j.id);
  let n = 0;
  while (j.status !== 'completed') {
    if (j.status === 'failed') throw new Error((j.error && (j.error.message || j.error)) || t('e_vid_failed'));
    if (++n > 90) throw new Error(t('e_vid_timeout'));
    onStatus(t('m_vid_wait'));
    await new Promise(r => setTimeout(r, 5000));
    j = await orFetch(purl);
  }
  const r = await fetch(via(j.unsigned_urls[0]), { headers: authHeader() });
  if (!r.ok) throw new Error(t('e_vid_dl'));
  return r.blob();
}
