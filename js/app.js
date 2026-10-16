/* Boot, navigation, rendering, actions and events. Loaded last. */
let VID = { busy: false, status: '' }, FREE = { busy: false, status: '' }, WMP = null, WMCTX = null;
const inFrame = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();

function toast(m, bad) {
  const el = $('#toast'); el.textContent = m; el.className = 'note ' + (bad ? 'err' : 'ok'); el.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, bad ? 6500 : 2800);
}
let PLAY = null;
function scStop() { if (PLAY) { clearTimeout(PLAY.t); cancelAnimationFrame(PLAY.raf); PLAY = null; } const v = document.querySelector('#stage video'); if (v) v.pause(); }
let modalOk = null;
function modal(title, body, ok, okLabel, danger) {
  modalOk = ok;
  const m = $('#modal');
  m.innerHTML = `<div class="box" role="dialog" aria-modal="true"><h2>${title}</h2><div style="display:flex;flex-direction:column;gap:12px">${body}</div><div class="row"><button class="btn ${danger ? 'd' : 'p'}" data-act="mok">${okLabel || t('confirm')}</button><button class="btn" data-act="mclose">${t('cancel')}</button></div></div>`;
  m.hidden = false;
  const f = m.querySelector('input,select,textarea,button'); if (f) f.focus();
}

function guard(r) {
  if (!V[r]) r = 'home';
  if (PUBLIC_R.includes(r)) { const c = co(), has = { about: c.companyTagline.trim(), terms: c.showLegal && c.termsText.trim(), privacy: c.showLegal && c.privacyText.trim() }[r]; if (has) return r; r = 'home'; }
  if (USER_R.includes(r) && !cur()) return 'login';
  if (ADMIN_R.includes(r)) { if (!cur()) return 'login'; if (!isAdmin()) return 'home'; if (!allowed(r)) return 'a-home'; }
  return r;
}
function go(r) { scStop(); T = { err: '', msg: '' }; S.route = guard(r); save(); render(); window.scrollTo(0, 0); }

/* Brand colours chosen in the admin settings, turned into the theme tokens for light and dark. */
const hex3 = h => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ''); return m ? [0, 2, 4].map(i => parseInt(m[1].substr(i, 2), 16)) : null; };
const mixc = (a, b, k) => '#' + a.map((v, i) => Math.round(v * (1 - k) + b[i] * k).toString(16).padStart(2, '0')).join('');
const lum = c => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
/* WCAG contrast, used to keep white button text readable on the chosen colour. */
const relL = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
const contrast = (a, b) => { const x = relL(a), y = relL(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
/* Brand colours from the settings become theme tokens: always for the day theme, and for the night theme when "dark" is on. */
function brandCSS() {
  const b = S.settings.brand || {}, p = hex3(b.primary), a = hex3(b.accent), W = [255, 255, 255], K = [0, 0, 0], D = [18, 23, 30], INK = [10, 43, 64];
  if (!p && !a) return '';
  let lt = '', dk = '';
  if (p) {
    let bg = p, k = 0;
    const white = contrast(p, W) >= 3;
    while (white && contrast(bg, W) < 4.5 && k < .6) { k += .02; bg = hex3(mixc(p, K, k)); }
    lt += `--primary:${mixc(bg, W, 0)};--primary-ink:${mixc(p, K, .38)};--primary-soft:${mixc(p, W, .88)};--on-primary:${white ? '#FFFFFF' : '#0A2B40'};`;
    dk += `--primary:${mixc(p, W, .12)};--primary-ink:${mixc(p, W, .5)};--primary-soft:${mixc(p, D, .78)};--on-primary:${lum(p) > .5 ? '#07202F' : '#FFFFFF'};`;
  }
  if (a) { lt += `--violet:${mixc(a, W, 0)};--violet-ink:${mixc(a, K, .3)};--violet-soft:${mixc(a, W, .88)};`; dk += `--violet:${mixc(a, W, .1)};--violet-ink:${mixc(a, W, .45)};--violet-soft:${mixc(a, D, .8)};`; }
  return `:root{${lt}}` + (b.dark ? `@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){${dk}}}:root[data-theme="dark"]{${dk}}` : '');
}
/* Day page tones: the page colour, cards and fields. 'white' keeps the original look. */
const PAGE_TONES = { mist: { page: '#EDF2F6', surface: '#FFFFFF', bg: '#FAFCFD', line: '#DCE4EB' }, sand: { page: '#F5F1EA', surface: '#FFFDF9', bg: '#FFFFFF', line: '#E6DFD3' } };
/* Day-theme background: drawn on a fixed layer behind the page so it stays put on phones too. Never in the night theme. */
function bgCSS() {
  const b = S.settings.brand || {}, veil = a => `linear-gradient(rgba(255,255,255,${a}),rgba(255,255,255,${a}))`;
  const side = document.documentElement.dir === 'rtl' ? 'left' : 'right';
  const v = {
    balloon: `background:url(${BG_BALLOON}) no-repeat ${side} 20px bottom 16px/min(34vw,300px) auto`,
    waves: `background:${veil(.35)},url(${BG_WAVES}) center/100% 100% no-repeat`,
    soft: 'background:linear-gradient(135deg,#EAF5FB 0%,#FBFCFD 50%,#FDEFE6 100%)',
    custom: b.bgImg ? `background:${veil(.3)},url("${b.bgImg}") center/cover no-repeat` : ''
  }[b.bg];
  const tone = PAGE_TONES[b.page], day = x => `@media (prefers-color-scheme:light){:root:not([data-theme="dark"]){${x}}}:root[data-theme="light"]{${x}}`;
  const tc = tone ? day(Object.entries(tone).map(([k, c]) => `--${k}:${c}`).join(';')) : '';
  if (!v) return tc;
  return tc + `html:not([data-theme="dark"]) body::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;${v}}@media (prefers-color-scheme:dark){html:not([data-theme="light"]) body::before{display:none}}`;
}
function applyChrome() {
  const de = document.documentElement, th = S.settings.theme;
  de.lang = L(); de.dir = L() === 'ar' ? 'rtl' : 'ltr';
  if (th === 'light' || th === 'dark') de.dataset.theme = th; else delete de.dataset.theme;
  document.title = appName();
  let st = document.getElementById('brand-css'); if (!st) { st = document.createElement('style'); st.id = 'brand-css'; document.head.appendChild(st); }
  const css = brandCSS() + bgCSS(); if (st.textContent !== css) st.textContent = css;
  let ico = document.querySelector('link[rel="icon"]'); if (!ico) { ico = document.createElement('link'); ico.rel = 'icon'; document.head.appendChild(ico); }
  const src = iconIsM() ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(M_ICON) : logoSrc(co().logo); if (ico.getAttribute('href') !== src) ico.setAttribute('href', src);
}
/* Footer: logo, company name and the product line. Every other line appears only when its setting is filled in. */
function footerHTML() {
  const c = co(), links = [], info = [], mail = (l, v) => `${t(l)}: <a class="link" dir="ltr" href="mailto:${esc(v)}">${esc(v)}</a>`;
  if (c.crNumber.trim()) info.push(`${t('f_cr')} <span dir="ltr">${esc(c.crNumber)}</span>`);
  if (c.vatNumber.trim()) info.push(`${t('f_vat')} <span dir="ltr">${esc(c.vatNumber)}</span>`);
  if (c.emailGeneral.trim()) info.push(mail('contact', c.emailGeneral.trim()));
  if (c.emailSupport.trim()) info.push(mail('support_l', c.emailSupport.trim()));
  if (c.emailLegal.trim()) info.push(mail('legal_l', c.emailLegal.trim()));
  if (c.phone.trim()) info.push(`<span dir="ltr">${esc(c.phone)}</span>`);
  if (c.address.trim()) info.push(`<span dir="auto">${esc(c.address)}</span>`);
  if (c.companyTagline.trim()) links.push(`<button class="link" data-go="about">${t('about_t')}</button>`);
  if (c.showLegal && c.termsText.trim()) links.push(`<button class="link" data-go="terms">${t('terms_t')}</button>`);
  if (c.showLegal && c.privacyText.trim()) links.push(`<button class="link" data-go="privacy">${t('privacy_t')}</button>`);
  (c.footerLinks || []).filter(l => l && l.label && /^https:\/\//i.test(l.href || '')).forEach(l => links.push(`<a class="link" href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>`));
  return `<div class="row"><img src="${esc(logoSrc(c.footerLogo || c.logo))}" alt="" width="40" height="40"><b>${esc(coName())}</b></div>
 ${c.companyTagline.trim() ? `<span class="sub" dir="auto">${esc(c.companyTagline)}</span>` : ''}
 <span class="sub">${t('foot_copy', { product: esc(appName()), year: new Date().getFullYear() })}</span>
 ${info.length ? `<div class="row sub">${info.map(x => `<span>${x}</span>`).join('')}</div>` : ''}
 ${c.footerNote.trim() ? `<span class="sub" dir="auto">${esc(c.footerNote)}</span>` : ''}
 ${links.length ? `<div class="row">${links.join('')}</div>` : ''}`;
}
/* Day/night: the header button flips between light and dark (from Auto it flips away from what the device shows). */
const isDark = () => S.settings.theme === 'dark' || (S.settings.theme !== 'light' && !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches));
function renderChrome() {
  applyChrome();
  const r = S.route, adminMode = r.startsWith('a-'), authPage = r === 'signup' || r === 'login', u = cur();
  $('#top').innerHTML = `<div class="brand">${iconIsM() ? M_ICON : `<img src="${esc(logoSrc(co().logo))}" alt="" width="32" height="32">`}<span class="co">${esc(coBrand())}</span><span class="sep" aria-hidden="true">|</span><span>${esc(appName())}</span></div>
 ${isAdmin() && !authPage ? `<div class="seg" role="group" aria-label="${t('seg_label')}"><button aria-pressed="${!adminMode}" data-go="home">${t('seg_user')}</button><button aria-pressed="${adminMode}" data-go="${allowed(S.settings.dashHome) ? S.settings.dashHome : 'a-home'}">${t('seg_admin')}</button></div>` : ''}
 <button class="btn s" data-act="lang" title="${t('switch_lang')}" aria-label="${t('switch_lang')}">${ic('globe')} <span dir="ltr">${L() === 'ar' ? 'AR<span class="dim">/EN</span>' : '<span class="dim">AR/</span>EN'}</span></button>
 <button class="btn s" data-act="daynight" title="${t(isDark() ? 'theme_light' : 'theme_dark')}" aria-label="${t(isDark() ? 'theme_light' : 'theme_dark')}">${ic(isDark() ? 'sun' : 'moon')}</button>
 <div class="who">${u && !authPage ? `<span>${esc(u.name)} · ${esc(adminMode ? u.adminRole : planName(planOf(u)))}</span>${adminMode ? '' : `<button class="btn s" data-go="account">${t('my_acc')}</button>`}<button class="btn s" data-act="logout">${t('logout')}</button>` : ''}</div>`;
  const ft = $('#foot'); ft.hidden = authPage; ft.innerHTML = authPage ? '' : footerHTML();
}
function render() {
  S.route = guard(S.route);
  renderChrome();
  const r = S.route, adminMode = r.startsWith('a-'), authPage = r === 'signup' || r === 'login' || (PUBLIC_R.includes(r) && !cur());
  $('#shell').classList.toggle('solo', authPage);
  $('#nav').hidden = authPage;
  $('#nav').setAttribute('aria-label', t('nav_label'));
  $('#nav').innerHTML = (adminMode ? NAV_A.filter(n => allowed(n[0])) : NAV_U).map(([k, i]) => `<button data-go="${k}" ${k === r ? 'aria-current="page"' : ''}>${ic(i)}${t('nav_' + k)}${k === 'campaigns' || k === 'a-campaigns' ? ` <span class="pill v">${t('soon')}</span>` : ''}</button>`).join('');
  $('#view').innerHTML = V[r]();
  const on = $('#nav [aria-current]'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

/* ---------- quota, storage and saving ---------- */
const needDraft = () => { const d = S.draft; if (!d.product.trim() || !d.audience.trim()) { T.err = t('e_need_draft'); render(); return false; } T.err = ''; return true; };
const quotaModal = k => modal(t('quota_t'), `<p>${t('quota_body', { what: t('quota_' + k), plan: esc(planName(planOf(cur()))) })}</p>`, () => { go('plans'); }, t('b_upgrade_plan'));
const spend = k => { const u = cur(); if (left(u, k) <= 0) { quotaModal(k); return false; } u.used[k]++; return true; };
const adData = d => ({ product: d.product, audience: d.audience, platform: d.platform, style: d.style, goal: d.goal, lang: lg(d), text: d.out.text, titles: d.out.titles || genTitles(d), tags: d.out.tags || genTags(d), variants: d.out.variants || null, img: d.img || null, vid: d.vid || null, refs: (d.refs || []).map(r => ({ id: r.id, size: r.size, name: r.name, kind: r.kind })), refNote: d.refNote || '', category: d.category || 'general', scenes: d.scenes && (d.scenes.items.length || d.scenes.script) ? { total: +d.scenes.total, script: d.scenes.script || '', items: d.scenes.items.map(i => ({ ...i })) } : null });
const draftAd = () => S.draft.editId && byId(S.ads, S.draft.editId);
const canSave = () => { if (draftAd() || left(cur(), 'ads') > 0) return true; quotaModal('ads'); return false; };
const canStore = () => {
  const u = cur();
  if (usedBytes(u) < limitMB(u) * 1048576) return true;
  modal(t('full_t'), `<p>${t('full_body', { used: fmtMB(usedBytes(u)), lim: limitMB(u) })}</p>`, () => { go('plans'); }, t('b_upgrade_plan'));
  return false;
};
/* Writes the draft into its ad (creating it on first save) and deletes media the ad no longer uses. */
function autosave() {
  const d = S.draft;
  if (!d.out.text) d.out.text = gen(d.style, d);
  const a = draftAd(), data = adData(d);
  if (a) {
    const old = mediaIds(a);
    Object.assign(a, data); a.bytes = calcBytes(a);
    const now = mediaIds(a); old.filter(i => !now.includes(i)).forEach(mdel);
  } else {
    if (left(cur(), 'ads') <= 0) return false;
    cur().used.ads++;
    const n = { id: rid('A'), uid: S.uid, date: new Date().toISOString(), ...data }; n.bytes = calcBytes(n);
    S.ads.push(n); d.editId = n.id;
  }
  save(); return true;
}
const num = (id, min = 0) => Math.max(min, Math.floor(+$(id).value || 0));

/* Free design helpers. The latest result stays on the page until it is replaced; saving copies it into the library. */
const freeItem = id => { const l = S.freeDraft.last; return id === 'last' ? (l && l.saved && byId(S.free, l.saved)) || l : byId(S.free, id); };
const freeName = (it, b) => `${(co().brandEn || 'mentad').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${it.kind === 'vid' ? 'video' : 'image'}-${it.date.slice(0, 10)}.${/mp4/.test(b.type) ? 'mp4' : /webm/.test(b.type) ? 'webm' : /png/.test(b.type) ? 'png' : 'jpg'}`;
const normTags = s => (s || '').split(/[\s,،]+/).filter(Boolean).map(w => w.startsWith('#') ? w : '#' + w).join(' ');
async function freeLast(kind, prompt, blob, wm) {
  const f = S.freeDraft, old = f.last, id = rid('M');
  await mput(id, blob);
  f.last = { kind, prompt, wm: !!wm, media: { id, size: blob.size, mime: blob.type }, date: new Date().toISOString(), saved: null };
  if (old && !old.saved) orphan(old.media.id);
  if (WMP && WMP.id !== id) { wmFree(WMP.P); WMP = null; }
}

/* ---------- actions (data-act) ---------- */
const A = {
  mclose() { $('#modal').hidden = true; modalOk = null; },
  mok() { const f = modalOk; if (f && f() === false) return; A.mclose(); save(); render(); },
  logout() { S.uid = null; go('login'); },
  lang() { S.settings.uiLang = L() === 'ar' ? 'en' : 'ar'; save(); render(); },
  theme(d) { const o = ['auto', 'light', 'dark']; S.settings.theme = d && o.includes(d.v) ? d.v : o[(o.indexOf(S.settings.theme) + 1) % 3]; save(); render(); },
  forgot() { const e = $('#li-email').value.trim(); T = e ? { err: '', msg: t('forgot_msg', { e }) } : { err: t('e_email_first'), msg: '' }; render(); },

  newad() { const d = S.draft, old = mediaIds(d); S.draft = { ...newDraft(), platform: d.platform, style: d.style, goal: d.goal, lang: lg(d) }; old.forEach(orphan); go('create'); },
  clear() { const d = S.draft, old = mediaIds(d); S.draft = { ...newDraft(), platform: d.platform, style: d.style, goal: d.goal, lang: lg(d), category: d.category || 'general' }; old.forEach(orphan); T = { err: '', msg: '' }; save(); render(); toast(t('m_cleared')); },
  /* Share: copy the ad text, then offer a real link to the platform (a filled-in post where the platform allows it). */
  share(x) {
    const ad = x && x.id ? byId(S.ads, x.id) : null, d = S.draft;
    const text = ad ? ad.text : d.out.text, tags = ad ? ad.tags : d.out.tags, plat = ad ? ad.platform : d.platform;
    if (!text) return;
    const full = text + (tags && tags.length ? '\n' + tags.join(' ') : ''), soc = socialOf(cur());
    const custom = !ad && d.shareTo ? soc.find(a => a.id === d.shareTo) : null, acc = custom || soc.find(a => a.key === plat), def = SOCIAL[plat] || {};
    const name = custom ? custom.name : (def.n || t('plat_' + plat));
    const url = custom ? custom.url : def.compose ? def.compose(full) : (acc ? acc.url : def.home);
    let copied = true;
    try { navigator.clipboard.writeText(full).catch(() => {}); } catch (e) { copied = false; }
    modal(t('share_t', { name: esc(name) }), `<p>${t(copied ? 'share_copied' : 'share_copy')}</p><textarea id="sh-text" dir="auto" readonly style="min-height:110px">${esc(full)}</textarea>
 <p class="sub">${t(!custom && def.compose ? 'share_filled' : 'share_paste')} ${t('share_media')}</p>${!acc && !def.compose ? `<p class="sub">${t('share_noacc')}</p>` : ''}
 <a class="btn p" style="align-self:start" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${ic('share')} ${t('share_open', { name: esc(name) })}</a>`, () => {}, t('done'));
    const ta = $('#sh-text'); if (ta && !copied) { ta.focus(); ta.select(); }
  },
  /* social accounts (account settings) */
  socedit(x) {
    const u = cur(); u.social = socialOf(u);
    const a = x.id ? u.social.find(v => v.id === x.id) : u.social.find(v => v.key === x.k), custom = a ? a.key === 'custom' : false, title = custom ? esc(a.name) : SOCIAL[x.k].n;
    modal(title, (custom ? fld(t('soc_name'), `<input id="m-sn" value="${esc(a.name)}">`) : '') + fld(t('soc_url'), `<input id="m-su" dir="ltr" type="url" value="${esc(a ? a.url : '')}">`) + `<p class="sub">${t('soc_url_note')}</p>${a ? `<button class="btn d" style="align-self:start" data-act="socdel" data-id="${a.id}">${t('soc_del')}</button>` : ''}`, () => {
      const url = $('#m-su').value.trim();
      if (!okURL(url)) { toast(t('e_url'), 1); return false; }
      if (a) { a.url = url; if (custom) a.name = $('#m-sn').value.trim() || a.name; } else u.social.push({ id: rid('SO'), key: x.k, name: SOCIAL[x.k].n, url });
      toast(t('m_soc_saved'));
    }, t('save_l'));
  },
  socadd() {
    const u = cur(); u.social = socialOf(u);
    modal(t('soc_add'), fld(t('soc_name'), '<input id="m-sn">') + fld(t('soc_url'), '<input id="m-su" dir="ltr" type="url">') + `<p class="sub">${t('soc_url_note')}</p>`, () => {
      const name = $('#m-sn').value.trim(), url = $('#m-su').value.trim();
      if (!name) { toast(t('e_soc_name'), 1); return false; }
      if (!okURL(url)) { toast(t('e_url'), 1); return false; }
      u.social.push({ id: rid('SO'), key: 'custom', name, url }); toast(t('m_soc_saved'));
    }, t('add_l'));
  },
  socdel(x) { const u = cur(); u.social = socialOf(u).filter(a => a.id !== x.id); if (S.draft.shareTo === x.id) S.draft.shareTo = ''; A.mclose(); save(); render(); toast(t('m_soc_deleted')); },
  async improve() { if (!needDraft() || !canSave() || !spend('analyses')) return; logAI('improve'); const d = S.draft; d.out.text = await ask(adPrompt(d.style, d)) || gen(d.style, d); autosave(); render(); },
  async variants() {
    if (!needDraft() || !canSave() || !spend('analyses')) return; logAI('variants');
    const d = S.draft;
    d.out.variants = await Promise.all(STYLE_K.filter(s => s !== d.style).slice(0, 3).map(async s => ({ s, t: await ask(adPrompt(s, d)) || gen(s, d) })));
    autosave(); render();
  },
  async titles() {
    if (!needDraft()) return; logAI('titles');
    const d = S.draft, x = await ask('اقترح 4 عناوين جذابة لهذا الإعلان، كل عنوان في سطر مستقل وبلا ترقيم.\n' + brief(d));
    const l = x ? x.split('\n').map(v => v.replace(/^[\s\-*•\d.)]+/, '').trim()).filter(Boolean).slice(0, 6) : [];
    d.out.titles = l.length ? l : genTitles(d);
    if (draftAd()) autosave(); save(); render();
  },
  async tags() {
    if (!needDraft()) return; logAI('tags');
    const d = S.draft, x = await ask('اقترح 6 هاشتاقات مناسبة لهذا الإعلان في سطر واحد تفصل بينها مسافات.\n' + brief(d)), m = x && x.match(/#[^\s#،,]+/g);
    d.out.tags = m && m.length ? m : genTags(d);
    if (draftAd()) autosave(); save(); render();
  },
  usevar(d) { const v = S.draft.out.variants[+d.i]; S.draft.out.text = v.t; S.draft.style = v.s; if (draftAd()) autosave(); save(); render(); toast(t('m_var_used')); },
  toimage() { if (needDraft()) go('image'); },

  async refpick(files) {
    const d = S.draft; let added = 0;
    for (const f of [...(files || [])]) {
      const vid = f.type.startsWith('video/');
      if (!vid && !f.type.startsWith('image/')) { toast(t('m_ref_type'), 1); continue; }
      if (d.refs.length >= 6) { toast(t('ref_max'), 1); break; }
      if (!canStore()) break;
      const u = cur();
      if (vid && usedBytes(u) + f.size > limitMB(u) * 1048576) { toast(t('sc_big'), 1); continue; }
      const b = vid ? f : await shrinkFile(f), id = rid('M');
      await mput(id, b);
      d.refs.push({ id, size: b.size, name: f.name, kind: vid ? 'vid' : 'img' }); added++;
    }
    if (added && draftAd()) autosave();
    save(); render();
  },
  refdrop(x) { const d = S.draft, old = d.refs.splice(+x.i || 0, 1)[0]; if (draftAd()) autosave(); else if (old) orphan(old.id); save(); render(); },

  /* The image quota is charged only when a usable image was produced: a real one, or the poster when no link is set. */
  async genimg() {
    if (!needDraft() || !canStore() || !canSave()) return;
    const u = cur(), d = S.draft, live = aiOn();
    if (left(u, 'images') <= 0) { quotaModal('images'); return; }
    if (!d.out.text) d.out.text = gen(d.style, d);
    const meta = { seed: 1 + Math.floor(Math.random() * 97), desc: d.imgDesc || genDesc(d) };
    let blob = null, real = false;
    if (live) { busy(1); try { blob = await aiImage(d); real = true; } catch (e) { toast(t('m_img_fail', { e: e.message }), 1); } finally { busy(0); } }
    if (!blob) {
      const bg = d.refs.length ? await refData(d.refs[0]).then(loadImg).catch(() => null) : null;
      blob = await toBlob(drawPoster({ ...d, img: meta }, bg));
    }
    const id = rid('M'); await mput(id, blob);
    d.img = { ...meta, id, size: blob.size, real };
    const charged = real || !live;
    if (charged) { u.used.images++; logAI('image'); }
    autosave(); render();
    if (charged) toast(t('m_img_ok'));
  },
  async genvid() {
    if (!needDraft()) return;
    if (!aiOn()) { toast(t('m_vid_need'), 1); return; }
    const u = cur(), d = S.draft;
    const secs = vidLen(d);
    if (left(u, 'vidSecs') < secs) { quotaModal('vidSecs'); return; }
    const decor = decorMode(d);
    if (decor && left(u, 'images') <= 0) { quotaModal('images'); return; }
    if (!canStore() || !canSave()) return;
    VID = { busy: true, status: t('m_vid_sent') }; render();
    try {
      /* Decor: first design a still on the attachments (saved as the ad image), then film from it. */
      let first = null;
      if (decor) {
        VID.status = t('m_decor_step'); render();
        const ib = await aiImage(d), iid = rid('M');
        await mput(iid, ib);
        d.img = { seed: 1, desc: d.imgDesc || d.product, id: iid, size: ib.size, real: true };
        u.used.images++; logAI('image'); autosave();
        first = await blobToDataURL(ib);
      }
      const b = await aiVideo(d, s => { VID.status = s; if (S.route === 'video') render(); }, secs, first), id = rid('M');
      await mput(id, b);
      d.vid = { id, size: b.size }; VID = { busy: false, status: '' };
      u.used.vidSecs += secs; logAI('video'); autosave(); toast(t('m_vid_ok'));
    } catch (e) { VID.busy = false; toast(t('m_vid_fail', { e: e.message }), 1); }
    if (S.route === 'video') render();
  },
  /* ---------- free design ---------- */
  freewmset(d) { S.freeDraft.wm = d.v === 'logo' ? 'logo' : 'none'; save(); render(); },
  async freeimg() {
    const f = S.freeDraft, p = (f.prompt || '').trim(), u = cur(), wm = f.wm === 'logo';
    if (!p) { T.err = t('e_need_prompt'); render(); return; } T.err = '';
    if (left(u, 'images') <= 0) { quotaModal('images'); return; }
    if (!canStore()) return;
    const live = aiOn(); let blob = null;
    busy(1);
    try {
      if (live) { try { blob = await aiFreeImage(await freePrompt(p, 'img')); } catch (e) { toast(t('m_img_fail', { e: e.message }), 1); return; } }
      else blob = await toBlob(freePoster(p));
      if (wm) { try { blob = await markImage(blob); } catch (e) { toast(t('m_wm_fail'), 1); } }
      await freeLast('img', p, blob, wm);
      u.used.images++; logAI('image'); toast(t('m_img_ok'));
    } finally { busy(0); save(); render(); }
  },
  async freevid() {
    const f = S.freeDraft, p = (f.prompt || '').trim(), u = cur(), secs = Math.min(15, Math.max(6, +S.settings.vidSec || 6)), wm = f.wm === 'logo';
    if (!p) { T.err = t('e_need_prompt'); render(); return; } T.err = '';
    if (!aiOn()) { toast(t('m_vid_need'), 1); return; }
    if (left(u, 'vidSecs') < secs) { quotaModal('vidSecs'); return; }
    if (!canStore()) return;
    const show = s => { FREE.status = s; if (S.route === 'free') render(); };
    FREE = { busy: true, status: t('m_vid_prep') }; render();
    try {
      let b = await aiVideo({ platform: 'tiktok', vidDesc: await freePrompt(p, 'vid'), refs: [], scenes: null }, show, secs, null), pend = false;
      u.used.vidSecs += secs; logAI('video'); save();
      if (wm) {
        show(t('m_wm_vid', { n: 0 }));
        try {
          const P = await wmPrep(b);
          if (P.needTap) { pend = true; await freeLast('vid', p, b, false); S.freeDraft.last.wmPending = true; WMP = { id: S.freeDraft.last.media.id, P }; }
          else { b = await wmRecord(P, n => show(t('m_wm_vid', { n }))); wmFree(P); }
        } catch (e) { toast(t('m_wm_fail'), 1); }
      }
      if (!pend) await freeLast('vid', p, b, wm);
      toast(t(pend ? 'm_wm_tap' : 'm_vid_ok'));
    } catch (e) { toast(t('m_vid_fail', { e: e.message }), 1); }
    FREE = { busy: false, status: '' }; save(); if (S.route === 'free') render();
  },
  /* Safari: the logo is burned in from this tap so the clip keeps its sound. Everything before wmRecord's play() runs inside the tap. */
  freewm() {
    const l = S.freeDraft.last; if (!l || !l.wmPending || FREE.busy) return;
    if (!WMP || WMP.id !== l.media.id) {
      const b = BLOBS.get(l.media.id); if (!b) return;
      FREE = { busy: true, status: t('m_wm_vid', { n: 0 }) }; render();
      wmPrep(b).then(P => { WMP = { id: l.media.id, P }; toast(t('m_wm_again')); }).catch(() => toast(t('m_wm_fail'), 1)).finally(() => { FREE = { busy: false, status: '' }; render(); });
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    try { if (AC && !WMCTX) WMCTX = new AC(); if (WMCTX && WMCTX.state !== 'running') WMCTX.resume(); } catch (e) { WMCTX = null; }
    const P = WMP.P, show = n => { FREE.status = t('m_wm_vid', { n }); if (S.route === 'free') render(); };
    let job;
    try { job = wmRecord(P, show, WMCTX); } catch (e) { toast(t('m_wm_fail'), 1); return; }
    FREE = { busy: true, status: t('m_wm_vid', { n: 0 }) }; render();
    job.then(async b => {
      wmFree(P); WMP = null;
      const saved = l.saved && byId(S.free, l.saved);
      await freeLast('vid', l.prompt, b, true);
      if (saved) { orphan(saved.media.id); saved.media = { ...S.freeDraft.last.media }; S.freeDraft.last.saved = saved.id; }
      toast(t('m_vid_ok'));
    }).catch(() => toast(t('m_wm_fail'), 1)).finally(() => { FREE = { busy: false, status: '' }; save(); render(); });
  },
  freedl(d) { const it = freeItem(d.id), b = it && BLOBS.get(it.media.id); if (!b) { toast(t('e_ref_missing'), 1); return; } if (dl(b, freeName(it, b))) toast(t('fr_dl_ok')); },
  freesave() {
    const l = S.freeDraft.last; if (!l || l.saved) return;
    const it = { id: rid('F'), uid: S.uid, kind: l.kind, prompt: l.prompt, wm: !!l.wm, media: { ...l.media }, date: l.date, caption: l.caption || '', tags: l.tags || '' };
    S.free.push(it); l.saved = it.id; save(); render(); toast(t('m_fr_saved'));
  },
  freedel(d) {
    modal(t('fr_del_t'), `<p>${t('fr_del_b')}</p>`, () => {
      const it = byId(S.free, d.id); if (!it) return;
      S.free = S.free.filter(x => x.id !== it.id);
      const l = S.freeDraft.last; if (l && l.saved === it.id) l.saved = null;
      orphan(it.media.id);
    }, t('b_del'), 1);
  },
  freeexp(d) {
    const it = freeItem(d.id); if (!it) return;
    const soc = socialOf(cur()), o = { ...Object.fromEntries(Object.keys(SOCIAL).map(k => [k, SOCIAL[k].n])), ...Object.fromEntries(soc.filter(a => a.key === 'custom').map(a => [a.id, a.name])) };
    modal(t('fr_exp'), `${it.kind === 'vid' ? '' : `<img src="${MEDIA.get(it.media.id) || ''}" alt="" style="max-height:140px;border-radius:10px;align-self:center">`}
 ${fld(t('fx_plat'), `<select id="m-fp">${Object.entries(o).map(([k, v]) => `<option value="${esc(k)}" ${k === it.plat ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select>`)}
 ${fld(t('fx_cap'), `<textarea id="m-fc" dir="auto" style="min-height:90px">${esc(it.caption || '')}</textarea>`)}
 ${fld(t('fx_tags'), `<input id="m-ft" dir="auto" value="${esc(it.tags || '')}">`)}
 ${aiOn() ? `<button class="btn s" style="align-self:start" data-act="freesug" data-id="${d.id}">${ic('wand')} ${t('fx_sug')}</button>` : ''}
 <button class="btn p" style="align-self:start" data-act="freepost" data-id="${d.id}">${ic('share')} ${t('fx_post')}</button>
 <p class="sub">${t('fx_note')}</p>`, () => { const x = freeItem(d.id); if (x) { x.plat = $('#m-fp').value; x.caption = $('#m-fc').value.trim(); x.tags = normTags($('#m-ft').value); } }, t('done'));
  },
  async freesug(d) {
    const it = freeItem(d.id); if (!it) return;
    const k = $('#m-fp').value, plat = (SOCIAL[k] || {}).n || $('#m-fp').selectedOptions[0].textContent;
    const r = await ask(`اكتب وصفاً قصيراً جذاباً لمنشور على ${plat} يرافق ${it.kind === 'vid' ? 'مقطع فيديو' : 'صورة'} موضوعها: ${it.prompt}
اكتب الوصف بلغة الموضوع نفسه، ثم في السطر الأخير من 3 إلى 6 هاشتاقات مناسبة فقط.`);
    if (!r || !$('#m-fc')) return;
    const lines = r.split('\n').map(s => s.trim()).filter(Boolean), tagLine = lines.length > 1 && /^#/.test(lines[lines.length - 1]) ? lines.pop() : '';
    $('#m-fc').value = lines.join('\n'); if (tagLine) $('#m-ft').value = normTags(tagLine);
  },
  /* Phone: the share sheet with the file and the text. Computer: the file downloads and the platform opens; the text is copied either way. */
  freepost(d) {
    const it = freeItem(d.id), b = it && BLOBS.get(it.media.id); if (!b) { toast(t('e_ref_missing'), 1); return; }
    const k = $('#m-fp').value, cap = $('#m-fc').value.trim(), tags = normTags($('#m-ft').value), text = [cap, tags].filter(Boolean).join('\n');
    Object.assign(it, { plat: k, caption: cap, tags }); save();
    const file = new File([b], freeName(it, b), { type: b.type || it.media.mime });
    try { if (text) navigator.clipboard.writeText(text).catch(() => {}); } catch (e) {}
    if (navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], text }).catch(() => {}); return; }
    const soc = socialOf(cur()), acc = soc.find(a => a.id === k) || soc.find(a => a.key === k), def = SOCIAL[k] || {};
    const url = acc && acc.key === 'custom' ? acc.url : def.compose && text ? def.compose(text) : acc ? acc.url : def.home;
    if (url) window.open(url, '_blank', 'noopener');
    if (dl(file, file.name)) toast(t('fx_desk'));
  },
  async ortest() {
    if (!aiOn() && !S.settings.orKey) { toast(t('m_need_key'), 1); return; }
    busy(1);
    try { await orFetch('/chat/completions', { model: S.settings.txtModel, max_tokens: 5, messages: [{ role: 'user', content: 'ping' }] }); toast(t('m_test_ok')); }
    catch (e) { toast(t('m_test_fail', { e: e.message }), 1); } finally { busy(0); }
  },
  /* scenes */
  async scfiles(files) {
    const d = S.draft, sc = d.scenes;
    for (const f of [...files]) {
      const vid = f.type.startsWith('video/');
      if (!vid && !f.type.startsWith('image/')) { toast(t('sc_type'), 1); continue; }
      if (sc.items.length >= 8) { toast(t('sc_max'), 1); break; }
      const u = cur();
      if (!canStore()) break;
      if (vid && usedBytes(u) + f.size > limitMB(u) * 1048576) { toast(t('sc_big'), 1); continue; }
      const b = vid ? f : await shrinkFile(f), id = rid('M');
      await mput(id, b);
      sc.items.push({ id, size: b.size, kind: vid ? 'vid' : 'img', dur: vid ? 4 : 3, cap: '', name: f.name });
    }
    if (draftAd()) autosave(); save(); render();
  },
  scadd(d) { const dr = S.draft, m = d.src === 'vid' ? dr.vid : dr.img; if (!m || !m.id) return; if (dr.scenes.items.length >= 8) { toast(t('sc_max'), 1); return; } dr.scenes.items.push({ id: m.id, size: m.size, kind: d.src === 'vid' ? 'vid' : 'img', dur: d.src === 'vid' ? 4 : 3, cap: '', name: t(d.src === 'vid' ? 'sc_from_vid' : 'sc_from_img') }); if (draftAd()) autosave(); save(); render(); },
  scdel(d) { const it = S.draft.scenes.items.splice(+d.i, 1)[0]; if (draftAd()) autosave(); else if (it) orphan(it.id); save(); render(); },
  scmove(d) { const a = S.draft.scenes.items, i = +d.i, j = i + +d.by; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; if (draftAd()) autosave(); save(); render(); },
  /* Splits the chosen total evenly across the scenes, in whole seconds. */
  scfit() { const sc = S.draft.scenes, n = sc.items.length; if (!n) return; const base = Math.max(1, Math.floor(sc.total / n)); let extra = Math.max(0, sc.total - base * n); sc.items.forEach(i => { i.dur = base + (extra-- > 0 ? 1 : 0); }); if (draftAd()) autosave(); save(); render(); },
  scsave() { if (!needDraft() || !canSave()) return; autosave(); render(); toast(t('m_saved')); },
  scstop() { scStop(); },
  scplay() {
    scStop();
    const items = S.draft.scenes.items.filter(i => MEDIA.get(i.id) && +i.dur > 0), st = $('#stage'), bar = $('#stagebar');
    if (!items.length || !st) { toast(t('sc_none'), 1); return; }
    const total = items.reduce((n, i) => n + +i.dur, 0), t0 = performance.now();
    PLAY = {};
    const tick = () => { if (!PLAY) return; const e = (performance.now() - t0) / 1000; bar.style.width = Math.min(100, e / total * 100) + '%'; if (e < total) PLAY.raf = requestAnimationFrame(tick); };
    const show = k => {
      if (!PLAY) return;
      if (k >= items.length) { PLAY = null; bar.style.width = '100%'; const v = st.querySelector('video'); if (v) v.pause(); return; }
      const it = items[k], u = MEDIA.get(it.id);
      st.innerHTML = (it.kind === 'vid' ? `<video src="${u}" autoplay playsinline loop></video>` : `<img class="kb" style="animation-duration:${+it.dur}s" src="${u}" alt="">`) + (it.cap ? `<div class="cap" dir="auto">${esc(it.cap)}</div>` : '');
      PLAY.t = setTimeout(() => show(k + 1), +it.dur * 1000);
    };
    tick(); show(0);
  },

  /* add-ons */
  /* Pay for the chosen add-ons (simulated), credit them, and issue an invoice. */
  cartpay() {
    const u = cur(), lines = S.addons.filter(a => a.active).map(a => ({ a, l: cartLine(a) })).filter(x => x.l.total > 0 || x.l.amount > 0).filter(x => x.l.packs > 0), total = cartTotal();
    if (!lines.length) return;
    modal(t('ao_pay'), lines.map(x => `<div class="kv"><span dir="auto">${esc(x.a.name)} <span class="sub">+${x.l.amount} ${t('unit_' + x.a.kind)}</span></span><b>${sar(x.l.total)}</b></div>`).join('') + `<div class="kv total"><span>${t('inv_total')}</span><b>${sar(total)}</b></div><p class="note info">${t('sub_note')}</p>`, () => {
      u.extra = u.extra || {};
      lines.forEach(x => { u.extra[x.a.kind] = (u.extra[x.a.kind] || 0) + x.l.amount; });
      S.payments.push({ uid: u.id, amount: total, date: new Date().toISOString() });
      mkInvoice(u, lines.map(x => ({ name: x.a.name, detail: `+${x.l.amount} ${t('unit_' + x.a.kind)}`, total: x.l.total })));
      CART = {}; toast(t('m_addon_ok'));
    }, t('sim_pay'));
  },
  invshow(d) { const inv = byId(S.invoices || [], d.id); if (!inv) return; modal(t('inv_t'), invoiceBody(inv) + `<button class="btn" style="align-self:start" data-act="invdl" data-id="${inv.id}">${ic('receipt')} ${t('inv_export')}</button>`, () => {}, t('done')); },
  invdl(d) { const inv = byId(S.invoices || [], d.id); if (inv && dl(invoiceFile(inv), inv.no + '.html')) toast(t('m_exported')); },
  /* Library share menu: post to the platform, or export the whole ad. */
  sharemenu(d) {
    const a = byId(S.ads, d.id); if (!a) return;
    const mail = 'mailto:?subject=' + encodeURIComponent(a.product) + '&body=' + encodeURIComponent((a.text + (a.tags && a.tags.length ? '\n' + a.tags.join(' ') : '')).slice(0, 1500));
    modal(t('b_share') + ': ' + esc(a.product), `<div class="row"><button class="btn p" data-act="share" data-id="${a.id}">${ic('share')} ${t('sm_post', { plat: t('plat_' + a.platform) })}</button></div>
 <h3>${t('sm_export')}</h3>
 <div class="row"><button class="btn" data-act="expzip" data-id="${a.id}">${t('sm_zip')}</button><button class="btn" data-act="exppptx" data-id="${a.id}">${t('sm_pptx')}</button></div>
 <div class="row"><a class="btn" href="${esc(mail)}">${t('sm_mail')}</a><a class="btn" href="https://drive.google.com/drive/my-drive" target="_blank" rel="noopener noreferrer">${t('sm_drive')}</a></div>
 <p class="sub">${t('sm_note')}</p>`, () => {}, t('done'));
  },
  async expzip(d) { const a = byId(S.ads, d.id); if (!a) return; busy(1); try { if (await exportZip(a)) toast(t('m_exported')); } catch (e) { toast(t('m_export_fail'), 1); } finally { busy(0); } },
  async exppptx(d) { const a = byId(S.ads, d.id); if (!a) return; busy(1); try { if (await exportPptx(a)) toast(t('m_exported')); } catch (e) { toast(t('m_export_fail'), 1); } finally { busy(0); } },
  async socicon(k, file) {
    if (!file || !file.type.startsWith('image/')) { toast(t('m_ref_type'), 1); return; }
    try {
      const url = URL.createObjectURL(file), im = await loadImg(url); URL.revokeObjectURL(url);
      const c = document.createElement('canvas'), z = 96, r = Math.min(z / im.width, z / im.height); c.width = c.height = z;
      c.getContext('2d').drawImage(im, (z - im.width * r) / 2, (z - im.height * r) / 2, im.width * r, im.height * r);
      S.settings.socIcons = S.settings.socIcons || {}; S.settings.socIcons[k] = c.toDataURL('image/png');
      save(); render(); toast(t('m_saved_edit'));
    } catch (e) { toast(t('m_export_fail'), 1); }
  },
  async logoup(k, file) {
    if (!file || !file.type.startsWith('image/')) { toast(t('m_ref_type'), 1); return; }
    try {
      if (/svg/.test(file.type)) co()[k] = await file.text();
      else {
        const url = URL.createObjectURL(file), im = await loadImg(url); URL.revokeObjectURL(url);
        const r = Math.min(1, 256 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * r); c.height = Math.round(im.height * r);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); co()[k] = c.toDataURL('image/png');
      }
      save(); render(); toast(t('m_saved_edit'));
    } catch (e) { toast(t('m_export_fail'), 1); }
  },
  daynight() { S.settings.theme = isDark() ? 'light' : 'dark'; save(); render(); },
  iconstyle(d) { co().iconStyle = d.v === 'logo' ? 'logo' : 'gradient-m'; save(); render(); },
  logoreset(d) { co()[d.k] = DEFAULT_LOGO; save(); render(); },
  brandpreset() { S.settings.brand = { ...S.settings.brand, primary: '#1b8fbf', accent: '#f26a0f' }; save(); render(); },
  pageset(d) { S.settings.brand.page = d.v; save(); render(); },
  bgset(d) { S.settings.brand.bg = d.v; save(); render(); },
  async bgup(file) {
    if (!file || !file.type.startsWith('image/')) { toast(t('m_ref_type'), 1); return; }
    try {
      const url = URL.createObjectURL(file), im = await loadImg(url); URL.revokeObjectURL(url);
      const r = Math.min(1, 1600 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * r); c.height = Math.round(im.height * r);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      Object.assign(S.settings.brand, { bg: 'custom', bgImg: c.toDataURL('image/jpeg', .82) }); save(); render(); toast(t('m_saved_edit'));
    } catch (e) { toast(t('m_export_fail'), 1); }
  },
  brandreset() { S.settings.brand = { ...S.settings.brand, primary: '', accent: '' }; save(); render(); },
  socicondel(d) { if (S.settings.socIcons) delete S.settings.socIcons[d.k]; save(); render(); },
  addonadd() { S.addons.push({ id: rid('AO'), name: t('addon_new'), kind: 'images', mode: 'pack', amount: 10, price: 10, active: true }); save(); render(); },
  addontoggle(d) { const a = S.addons[+d.i]; a.active = !a.active; save(); render(); },
  addondel(d) { S.addons.splice(+d.i, 1); save(); render(); },

  saveimg() { if (S.draft.img) A.savead(); },
  dlimg() {
    const url = imgURL(S.draft);
    if (!inFrame) { const a = document.createElement('a'); a.href = url; a.download = 'ad-image.jpg'; document.body.appendChild(a); a.click(); a.remove(); toast(t('m_dl_ok')); return; }
    modal(t('b_dlimg'), `<img class="shot" style="max-height:300px" src="${url}" alt=""><p class="sub">${t('dl_note')}</p>`, () => {}, t('done'));
  },
  savead() { if (!needDraft() || !canSave()) return; autosave(); render(); toast(t('m_saved')); },
  editad(d) {
    const a = byId(S.ads, d.id), old = mediaIds(S.draft);
    S.draft = { ...newDraft(), product: a.product, audience: a.audience, platform: a.platform, style: a.style, goal: a.goal, lang: lg(a), out: { text: a.text, titles: a.titles, tags: a.tags, ...(a.variants ? { variants: a.variants } : {}) }, img: a.img, vid: a.vid || null, refs: (a.refs || []).map(r => ({ ...r })), category: a.category || 'general', refNote: a.refNote || '', imgDesc: a.img ? a.img.desc || '' : '', scenes: a.scenes ? { total: a.scenes.total, script: a.scenes.script, items: a.scenes.items.map(i => ({ ...i })) } : newScenes(), editId: a.id };
    old.forEach(orphan); go('create');
  },
  delad(d) {
    modal(t('del_ad_t'), `<p>${t('del_ad_b')}</p>`, () => {
      const a = byId(S.ads, d.id); if (a) mediaIds(a).forEach(mdel);
      if (S.draft.editId === d.id) S.draft = newDraft();
      S.ads = S.ads.filter(x => x.id !== d.id); toast(t('m_ad_deleted'));
    }, t('b_del'), 1);
  },
  sendsugg() {
    const x = $('#sg-text').value.trim();
    if (x.length < 5) { T = { err: t('e_sug'), msg: '' }; return render(); }
    logAI('suggest');
    S.suggestions.unshift({ id: rid('S'), uid: S.uid, text: x, date: new Date().toISOString(), status: 'new', ...analyze(x) });
    T = { err: '', msg: t('m_sug_ok') }; save(); render();
  },
  subscribe(d) {
    const p = byId(S.plans, d.id), u = cur();
    modal(t('sub_t', { plan: esc(planName(p)) }), p.price ? `<p>${t('sub_amount', { amt: sar(p.price) })}</p><p class="note info">${t('sub_note')}</p>` : `<p>${t('sub_free')}</p>`, () => {
      if (p.price) S.payments.push({ uid: u.id, amount: p.price, date: new Date().toISOString() }); else S.cancels++;
      if (p.price) mkInvoice(u, [{ name: t('plan_x', { name: planName(p) }), detail: t('per_month'), total: p.price }]);
      u.plan = p.id; toast(t('m_now_plan', { plan: planName(p) }));
    }, p.price ? t('sim_pay') : t('confirm'));
  },

  /* admin: users */
  uedit(d) {
    const u = byId(S.users, d.id);
    modal(t('eu_t'), fld(t('th_name'), `<input id="m-name" value="${esc(u.name)}">`) + fld(t('f_email'), `<input id="m-email" dir="ltr" value="${esc(u.email)}">`)
      + fld(t('f_storemb_opt'), `<input id="m-st" type="number" min="0" dir="ltr" value="${u.storageMB != null ? u.storageMB : ''}" placeholder="${planOf(u).storage}">`)
      + fld(t('f_bonus'), `<input id="m-bn" type="number" min="0" dir="ltr" value="${u.bonus}">`), () => {
      const e = $('#m-email').value.trim().toLowerCase();
      if (S.users.some(x => x.id !== u.id && x.email === e)) { toast(t('e_email_other'), 1); return false; }
      u.name = $('#m-name').value.trim() || u.name; u.email = e || u.email;
      const v = $('#m-st').value.trim(); u.storageMB = v === '' ? null : Math.max(0, +v || 0); u.bonus = num('#m-bn');
    }, t('save_l'));
  },
  uplan(d) { const u = byId(S.users, d.id); modal(t('up_t', { name: esc(u.name) }), fld(t('th_plan'), `<select id="m-plan">${S.plans.map(p => `<option value="${p.id}" ${p.id === u.plan ? 'selected' : ''}>${esc(planName(p))}</option>`).join('')}</select>`), () => { u.plan = $('#m-plan').value; toast(t('m_plan_changed')); }, t('save_l')); },
  ubonus(d) { const u = byId(S.users, d.id); u.bonus += 5; save(); render(); toast(t('m_bonus_added', { name: u.name })); },
  ubonusedit(d) { const u = byId(S.users, d.id); modal(t('bonus_t', { name: esc(u.name) }), fld(t('f_bonus_n'), `<input id="m-bn" type="number" min="0" dir="ltr" value="${u.bonus}">`) + `<p class="sub">${t('bonus_zero')}</p>`, () => { u.bonus = num('#m-bn'); toast(t(u.bonus ? 'm_bonus_set' : 'm_bonus_clear')); }, t('save_l')); },
  ustore(d) {
    const u = byId(S.users, d.id);
    modal(t('store_t', { name: esc(u.name) }), fld(t('f_storemb'), `<input id="m-st" type="number" min="0" dir="ltr" value="${u.storageMB != null ? u.storageMB : ''}" placeholder="${planOf(u).storage}">`) + `<p class="sub">${t('store_note', { used: fmtMB(usedBytes(u)), plan: planOf(u).storage })}</p>`, () => {
      const v = $('#m-st').value.trim(); u.storageMB = v === '' ? null : Math.max(0, +v || 0); toast(t('m_store_set'));
    }, t('save_l'));
  },
  /* Promote, change role, grant extra pages, or remove admin rights. The last Super Admin is protected. */
  uadmin(d) {
    const u = byId(S.users, d.id), role = u.adminRole || '';
    modal(t('adm_t', { name: esc(u.name) }), fld(t('th_role'), `<select id="m-role"><option value="">${t('role_none')}</option>${Object.keys(ROLES).map(r => `<option ${r === role ? 'selected' : ''}>${r}</option>`).join('')}</select>`)
      + `<div><span class="sub">${t('extra_pages')}</span><div class="checks">${ADMIN_R.filter(r => r !== 'a-home').map(r => `<label class="row"><input type="checkbox" name="m-perm" value="${r}" ${(u.permissions || []).includes(r) ? 'checked' : ''}> ${t('nav_' + r)}</label>`).join('')}</div></div>`, () => {
      const nr = $('#m-role').value;
      if (isLastSuper(u) && nr !== 'Super Admin') { toast(t('e_last_super'), 1); return false; }
      if (!nr) { u.isAdmin = false; u.adminRole = null; u.permissions = []; }
      else { u.adminRole = nr; if (!role) u.isAdmin = true; u.permissions = [...document.querySelectorAll('#modal input[name="m-perm"]:checked')].map(x => x.value); }
      toast(t('m_role_set'));
    }, t('save_l'));
  },
  udel(d) {
    const u = byId(S.users, d.id);
    if (isLastSuper(u)) { toast(t('e_last_super'), 1); return; }
    modal(t('delu_t'), `<p>${t('delu_b', { name: esc(u.name) })}</p>`, () => {
      S.ads.filter(a => a.uid === u.id).forEach(a => mediaIds(a).forEach(mdel));
      freeOf(u).forEach(f => mdel(f.media.id)); S.free = S.free.filter(f => f.uid !== u.id);
      S.users = S.users.filter(x => x.id !== u.id); S.ads = S.ads.filter(a => a.uid !== u.id);
      if (S.uid === u.id) S.uid = null;
    }, t('b_del'), 1);
  },

  /* admin: plans, ads, suggestions, errors */
  padd() { modal(t('b_addplan'), fld(t('th_planname'), '<input id="m-pn">') + fld(t('f_planprice'), '<input id="m-pp" type="number" min="0" dir="ltr" value="79">'), () => { const n = $('#m-pn').value.trim(); if (!n) { toast(t('e_planname'), 1); return false; } S.plans.push({ id: rid('P'), name: n, price: +$('#m-pp').value || 0, ads: 100, images: 40, analyses: 60, vidSecs: 60, storage: 100, active: true }); }, t('add_l')); },
  ptoggle(d) { const p = byId(S.plans, d.id); p.active = !p.active; save(); render(); },
  psubs(d) { const p = byId(S.plans, d.id), l = S.users.filter(u => u.plan === p.id); modal(t('plansubs_t', { name: esc(planName(p)) }), l.map(u => `<div class="kv"><span>${esc(u.name)}</span><span dir="ltr" class="sub">${esc(u.email)}</span></div>`).join('') || `<p class="sub">${t('no_subs')}</p>`, () => {}, t('done')); },
  aedit(d) { const a = byId(S.ads, d.id); modal(t('editad_t'), `<textarea id="m-text" dir="auto" aria-label="${t('f_adtext')}">${esc(a.text)}</textarea>`, () => { a.text = $('#m-text').value.trim() || a.text; a.bytes = calcBytes(a); }, t('save_l')); },
  sset(d) {
    const s = byId(S.suggestions, d.id), u = byId(S.users, s.uid); s.status = d.v;
    if (d.v === 'accepted' && !s.rewarded) { s.rewarded = true; if (u) u.bonus += 5; toast(t('m_sug_accept')); }
    save(); render();
  },
  sreward(d) { const s = byId(S.suggestions, d.id), u = byId(S.users, s.uid); s.rewarded = true; if (u) u.bonus += 5; save(); render(); toast(t('m_reward_given')); },
  eset(d) { byId(S.errors, d.id).status = d.v; save(); render(); toast(t('m_e_' + d.v)); },

  /* admin: accounts and reset */
  adadd() {
    const list = S.users.filter(u => !u.adminRole);
    if (!list.length) { toast(t('e_no_users'), 1); return; }
    modal(t('b_addadmin'), fld(t('th_user'), `<select id="m-au">${list.map(u => `<option value="${u.id}">${esc(u.name)} · ${esc(u.email)}</option>`).join('')}</select>`) + fld(t('th_role'), `<select id="m-ar">${Object.keys(ROLES).map(r => `<option ${r === 'Support' ? 'selected' : ''}>${r}</option>`).join('')}</select>`), () => { const u = byId(S.users, $('#m-au').value); u.isAdmin = true; u.adminRole = $('#m-ar').value; u.permissions = []; toast(t('m_role_set')); }, t('add_l'));
  },
  adtoggle(d) { const u = byId(S.users, d.id); if (isLastSuper(u)) { toast(t('e_last_super'), 1); return; } u.isAdmin = !u.isAdmin; save(); render(); },
  reset() {
    modal(t('reset_t'), `<p>${t('reset_b')}</p>`, () => {
      const keep = { uiLang: S.settings.uiLang, theme: S.settings.theme, socIcons: S.settings.socIcons || {}, company: S.settings.company, brand: S.settings.brand };
      CART = {}; LASTINV = null;
      mclear(); imgCache.clear(); S = seed(); Object.assign(S.settings, keep);
      S.uid = S.users.find(u => u.isAdmin).id; S.route = 'a-home';
    }, t('b_resetok'), 1);
  }
};

/* ---------- forms (data-form) ---------- */
const F = {
  async signup(f) {
    const name = f.name.value.trim(), email = f.email.value.trim().toLowerCase(), pass = f.pass.value;
    if (!name) T.err = t('e_name');
    else if (!/^\S+@\S+\.\S+$/.test(email)) T.err = t('e_email');
    else if (S.users.some(u => u.email === email)) T.err = t('e_email_used');
    else if (!(pass.length >= 8 && /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /\d/.test(pass) && /[^A-Za-z0-9]/.test(pass))) T.err = t('e_pass');
    else {
      const s = rid('s'), u = newUser({ name, email, phone: f.phone.value.trim(), pw: { s, h: await sha(s + pass) } });
      S.users.push(u); S.uid = u.id; return go('home');
    }
    render();
  },
  async chpass(f) {
    const u = cur(), pass = f.pass.value;
    if (!(await checkPass(u, f.cur.value))) T = { err: t('pw_wrong'), msg: '' };
    else if (!(pass.length >= 8 && /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /\d/.test(pass) && /[^A-Za-z0-9]/.test(pass))) T = { err: t('e_pass'), msg: '' };
    else { const s = rid('s'); u.pw = { s, h: await sha(s + pass) }; T = { err: '', msg: t('pw_done') }; save(); }
    render();
  },
  async login(f) {
    const u = S.users.find(u => u.email === f.email.value.trim().toLowerCase());
    T.msg = '';
    if (!u || !(await checkPass(u, f.pass.value))) { T.err = t('e_login'); return render(); }
    S.uid = u.id; go('home');
  }
};

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g) return go(g.dataset.go);
  const a = e.target.closest('[data-act]');
  if (a && !a.disabled && A[a.dataset.act]) A[a.dataset.act](a.dataset);
  else if (e.target.id === 'modal') A.mclose();
});
document.addEventListener('submit', e => { e.preventDefault(); const n = e.target.dataset.form; if (F[n]) F[n](e.target); });
/* Escape closes the dialog; Tab stays inside it. */
document.addEventListener('keydown', e => {
  const m = $('#modal'); if (m.hidden) return;
  if (e.key === 'Escape') return A.mclose();
  if (e.key !== 'Tab') return;
  const f = [...m.querySelectorAll('button,input,select,textarea,a[href]')].filter(x => !x.disabled); if (!f.length) return;
  const first = f[0], last = f[f.length - 1], act = document.activeElement;
  if (!m.contains(act)) { e.preventDefault(); first.focus(); }
  else if (e.shiftKey && act === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && act === last) { e.preventDefault(); first.focus(); }
});
function bind(e) {
  const el = e.target;
  if (el.dataset.ref !== undefined) { if (e.type === 'change') A.refpick(el.files); return; }
  if ('bgup' in el.dataset) { if (e.type === 'change') A.bgup(el.files[0]); return; }
  if (el.dataset.logo) { if (e.type === 'change') A.logoup(el.dataset.logo, el.files[0]); return; }
  if (el.dataset.logotext) { if (e.type === 'change') { const v = el.value.trim(); if (v && !/^(<svg[\s>]|https:\/\/)/i.test(v)) { toast(t('e_logo'), 1); return; } co()[el.dataset.logotext] = v || DEFAULT_LOGO; save(); render(); } return; }
  if (el.dataset.links !== undefined) {
    if (e.type !== 'change') return;
    const v = el.value.trim(); let arr = [];
    if (v) { try { arr = JSON.parse(v); } catch (x) { arr = null; } }
    if (!Array.isArray(arr) || arr.some(l => !l || typeof l.label !== 'string' || !/^https:\/\//i.test(l.href || ''))) { toast(t('e_links'), 1); return; }
    co().footerLinks = arr.map(l => ({ label: l.label, href: l.href })); save(); renderChrome(); toast(t('m_saved_edit')); return;
  }
  if (el.dataset.socicon) { if (e.type === 'change') A.socicon(el.dataset.socicon, el.files[0]); return; }
  if (el.dataset.cart) {
    CART[el.dataset.cart] = Math.max(0, +el.value || 0);
    const a = byId(S.addons, el.dataset.cart), ln = $('#ct-l-' + el.dataset.cart);
    if (a && ln) ln.textContent = sar(cartLine(a).total);
    $('#cart-total').textContent = sar(cartTotal()); $('#cart-pay').disabled = cartTotal() <= 0;
    return;
  }
  if (el.dataset.scene !== undefined) { if (e.type === 'change') A.scfiles(el.files); return; }
  if (el.dataset.m) {
    const ks = el.dataset.m.split('.'), last = ks.pop(), o = ks.reduce((o, k) => o[k], S);
    o[last] = el.type === 'checkbox' ? el.checked : el.type === 'number' ? +el.value : el.value;
    if (el.dataset.legal !== undefined && el.value.trim()) co().showLegal = true;
    save();
    if (/^settings\.(company|brand)\./.test(el.dataset.m)) { renderChrome(); if (el.dataset.legal !== undefined) { const cb = $('#co-legal'); if (cb) cb.checked = co().showLegal; } }
    if (el.dataset.re !== undefined && (e.type === 'change' || el.type === 'checkbox')) render();
  } else if (el.dataset.pl && e.type === 'change') {
    const p = byId(S.plans, el.dataset.pl), k = el.dataset.k;
    p[k] = k === 'name' ? (el.value.trim() || p.name) : Math.max(0, +el.value || 0);
    save(); toast(t('m_saved_edit'));
  }
}
document.addEventListener('input', e => { if (e.target.type !== 'checkbox' && e.target.tagName !== 'SELECT') bind(e); });
document.addEventListener('change', e => { const el = e.target; if (el.type === 'checkbox' || el.tagName === 'SELECT' || el.dataset.pl || el.dataset.ref !== undefined || el.dataset.scene !== undefined || el.dataset.re !== undefined || el.dataset.socicon || el.dataset.logo || el.dataset.bgup !== undefined || el.dataset.logotext || el.dataset.links !== undefined) bind(e); });

/* ---------- boot ---------- */
loadState();
const hash = location.hash.slice(1); if (V[hash]) S.route = hash;
render();
mload().then(() => { if (MEDIA.size) render(); });
try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (S.settings.theme === 'auto') renderChrome(); }); } catch (e) {}
/* Installable app: register the offline worker when served over https (not from a file or an embedded preview). */
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost') && !inFrame) { try { navigator.serviceWorker.register('sw.js').catch(() => {}); } catch (e) {} }
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { imgCache.clear(); render(); });
