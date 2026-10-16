/* User-facing pages. Each V[route]() returns the page HTML. */
const V = {};
const IC = {
  home: 'M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z', plus: 'M12 5v14M5 12h14',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4', video: 'M4 6h11v12H4zM15 10l5-3v10l-5-3', lib: 'M4 6h16M4 12h16M4 18h10',
  msg: 'M4 5h16v11H9l-5 4z', book: 'M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h12', card: 'M3 6h18v12H3zM3 10h18',
  users: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2.5 19a5.5 5.5 0 0 1 11 0M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4.5 5',
  bug: 'M12 8a4 4 0 0 1 4 4v3a4 4 0 0 1-8 0v-3a4 4 0 0 1 4-4zM9.5 5l1 3M14.5 5l-1 3M4 13h4M16 13h4', chart: 'M4 4v16h16M8 16v-5M12 16V8M16 16v-9',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z',
  clip: 'M20 11l-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5',
  broom: 'M14 3l7 7M13 5l6 6-3.5 3.5-6-6zM9.5 8.5L3.5 14c.8 3.8 3.4 6 7.5 6.5l5-6M6.5 13.5l4 4M9 11l4 4',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3',
  share: 'M16 6l-4-3-4 3M12 3v12M6 11H5v9h14v-9h-1',
  wand: 'M5 19L15 9M14 4v3M12.5 5.5h3M19 8v3M17.5 9.5h3M19 15v2M18 16h2', dl: 'M12 4v11M8 11l4 4 4-4M5 19h14',
  mark: 'M7 4h10v16l-5-4-5 4z', trash: 'M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13',
  film: 'M4 5h16v14H4zM8 5v14M16 5v14M4 9h4M4 15h4M16 9h4M16 15h4',
  moon: 'M20 14a8 8 0 1 1-10-10 6.5 6.5 0 0 0 10 10z', auto: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 3v18M12 7l5 0M12 12l8 0M12 17l5 0'
};
const ic = n => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="${IC[n]}"/></svg>`;
const fld = (label, html) => `<label class="f">${label}${html}</label>`;
const sel = (id, m, obj, val, extra = '') => `<select id="${id}" data-m="${m}" ${extra}>${Object.entries(obj).map(([k, v]) => `<option value="${k}" ${k === val ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select>`;
const errBox = () => T.err ? `<p class="note err" role="alert">${esc(T.err)}</p>` : '';
const msgBox = () => T.msg ? `<p class="note ok" role="status">${esc(T.msg)}</p>` : '';
const thumb = a => a.img ? `<img src="${imgURL(a)}" alt="${esc(t('alt_adimg', { p: a.product }))}">` : `<div class="thumb">${t('no_img_s')}</div>`;
const adMeta = a => `<div class="row">${a.category && a.category !== 'general' && CAT_K.includes(a.category) ? `<span class="pill m">${t('pc_' + a.category)}</span>` : ''}<span class="pill">${t('plat_' + a.platform)}</span><span class="pill v">${t('style_' + a.style)}</span>${lg(a) !== 'ar' ? `<span class="pill m" dir="ltr">${lg(a).toUpperCase()}</span>` : ''}<span class="sub">${fdate(a.date)}</span></div>`;
const storageBox = u => {
  const us = usedBytes(u), lim = limitMB(u), pc = lim ? Math.min(100, us / (lim * 1048576) * 100) : 100;
  return `<div class="store"><div class="row" style="justify-content:space-between"><span class="sub">${t('storage')}</span><b>${t('st_of', { used: fmtMB(us), lim })}</b></div><div class="bar"><i style="width:${us ? Math.max(pc, 1) : 0}%" class="${pc >= 90 ? 'full' : ''}"></i></div></div>`;
};
/* Attachments (images and video), shared by the image and video pages. */
const refBlock = d => `<div class="ref"><span class="sub">${t('ref_t')}</span>
 ${d.refs.length ? `<div class="media">${d.refs.map((r, i) => `<figure class="reftag">${MEDIA.get(r.id) ? (r.kind === 'vid' ? `<video class="thumb84" muted playsinline preload="metadata" src="${MEDIA.get(r.id)}"></video>` : `<img class="thumb84" src="${MEDIA.get(r.id)}" alt="${esc(r.name || t('ref_label'))}">`) : `<div class="thumb">${t('sc_missing')}</div>`}<figcaption><button class="pill err" data-act="refdrop" data-i="${i}" title="${t('ref_remove')}" aria-label="${t('ref_remove')}">×</button></figcaption></figure>`).join('')}</div><span class="sub">${t('ref_count', { n: d.refs.length, size: fmtSize(d.refs.reduce((n, r) => n + r.size, 0)) })}</span>` : ''}
 ${d.refs.length < 6 ? `<label class="btn" style="align-self:start">${ic('clip')} ${t('ref_attach')}<input class="vh" id="rf-file" type="file" accept="image/*,video/*" multiple data-ref></label>` : ''}
 ${fld(t('f_refnote'), `<textarea id="rf-note" dir="auto" data-m="draft.refNote" style="min-height:64px">${esc(d.refNote || '')}</textarea>`)}</div>`;
/* Generate button. With a decor/furniture product and attachments it becomes "Design decor". */
const genCta = (act, icon, label, off) => { const dm = decorMode(S.draft); return `<div class="cta"><button class="btn p" data-act="${act}" ${off ? 'disabled' : ''}>${ic(icon)} ${dm ? t('b_decor') : label}</button>${dm ? `<span class="sub">${t('by_refs')}</span>` : ''}</div>`; };
const catSel = (id, d) => fld(t('f_category'), sel(id, 'draft.category', opts(CAT_K, 'pc_'), CAT_K.includes(d.category) ? d.category : 'general', 'data-re'));
/* Platform icon: an uploaded icon (admin settings), else assets/social/<key>.svg if the site ships one, else the platform name. */
const socIcon = k => { const up = (S.settings.socIcons || {})[k]; return up ? `<img src="${up}" alt="">` : `<img hidden src="assets/social/${k}.svg" alt="" onload="this.hidden=false;this.nextElementSibling.hidden=true"><span>${SOCIAL[k].n}</span>`; };
/* Clears the working draft so the screen is ready for a new ad (saved ads stay in the library). */
const clearBtn = () => `<button class="ico sm" data-act="clear" title="${t('clear')}" aria-label="${t('clear')}">${ic('broom')}</button>`;
/* Where the ad will be posted: the chosen platform's account, or one of the user's custom accounts. */
const shareSel = d => { const cs = socialOf(cur()).filter(a => a.key === 'custom'); return cs.length ? fld(t('f_shareto'), sel('sh-to', 'draft.shareTo', { '': t('plat_' + d.platform), ...Object.fromEntries(cs.map(a => [a.id, a.name])) }, cs.some(a => a.id === d.shareTo) ? d.shareTo : '')) : ''; };
/* Product, audience and platform: the same draft fields as the create page, so the pages stay linked. */
const baseFields = d => `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">${fld(t('f_product'), `<input id="bx-product" data-m="draft.product" value="${esc(d.product)}">`)}${fld(t('f_audience'), `<input id="bx-aud" data-m="draft.audience" value="${esc(d.audience)}">`)}${catSel('bx-cat', d)}${fld(t('f_platform'), sel('bx-plat', 'draft.platform', opts(Object.keys(PLATS), 'plat_'), d.platform, 'data-re'))}</div>`;

V.signup = () => `<div class="auth panel"><h1>${t('signup_t')}</h1><p class="sub">${t('signup_sub')}</p>${errBox()}
 <form data-form="signup" class="panel" style="padding:0" novalidate>
 ${fld(t('f_name'), '<input id="su-name" name="name" autocomplete="name">')}
 ${fld(t('f_email'), '<input id="su-email" name="email" type="email" dir="ltr" autocomplete="email">')}
 ${fld(t('f_pass'), `<input id="su-pass" name="pass" type="password" dir="ltr" autocomplete="new-password"><span>${t('pass_hint')}</span>`)}
 ${fld(t('f_phone'), '<input id="su-phone" name="phone" type="tel" dir="ltr" autocomplete="tel">')}
 <button class="btn p big">${t('signup_t')}</button></form>
 <p class="sub">${t('have_acc')} <button class="link" data-go="login">${t('login_t')}</button></p></div>`;

V.login = () => `<div class="auth panel"><h1>${t('login_t')}</h1>${errBox()}${msgBox()}
 <form data-form="login" class="panel" style="padding:0" novalidate>
 ${fld(t('f_email'), '<input id="li-email" name="email" type="email" dir="ltr" autocomplete="email">')}
 ${fld(t('f_pass'), '<input id="li-pass" name="pass" type="password" dir="ltr" autocomplete="current-password">')}
 <button class="btn p big">${t('login_t')}</button></form>
 <div class="row"><button class="link" data-act="forgot">${t('forgot')}</button><button class="link" data-go="signup">${t('new_acc')}</button></div>
 <p class="note info">${t('login_hint')}</p></div>`;

V.home = () => {
  const u = cur(), p = planOf(u), ads = S.ads.filter(a => a.uid === u.id).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const stat = (k, l) => `<div class="stat"><b>${left(u, k)}</b><span>${t(l)}</span></div>`;
  return `<div class="head"><div><h1>${t('hello', { name: esc(u.name) })}</h1><p class="sub">${t('acc_no')} <span dir="ltr">${u.id}</span></p></div></div>
 <div class="panel"><div class="row" style="justify-content:space-between"><h2>${t('cur_plan', { plan: esc(planName(p)) })}</h2><button class="btn s" data-go="plans">${t('change_plan')}</button></div>
 <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr))">${stat('ads', 'ads_left')}${stat('images', 'imgs_left')}${stat('analyses', 'an_left')}${stat('vidSecs', 'vids_left')}</div>${storageBox(u)}</div>
 <button class="btn p big" data-act="newad">${ic('plus')} ${t('new_ad')}</button>
 <section class="panel"><div class="row" style="justify-content:space-between"><h2>${t('recent_ads')}</h2><button class="btn s" data-go="library">${t('all_ads')}</button></div>
 <div>${ads.length ? ads.map(a => `<div class="ad">${thumb(a)}<div class="body">${adMeta(a)}<p class="adtext">${esc(a.text)}</p></div></div>`).join('') : `<p class="sub">${t('no_ads')}</p>`}</div></section>
 <button class="btn v" data-go="suggest" style="align-self:start">${ic('msg')} ${t('nav_suggest')}</button>`;
};

V.create = () => {
  const d = S.draft, o = d.out, u = cur(), pl = PLATS[d.platform], n = (o.text || '').length;
  return `<div class="head"><h1>${t(d.editId ? 'edit_t' : 'create_t')}</h1><div class="row">${clearBtn()}<span class="pill v">${t('an_avail', { n: left(u, 'analyses') })}</span></div></div>
 <div class="cols"><div class="panel">${errBox()}
 ${fld(t('f_product'), `<input id="cr-product" data-m="draft.product" value="${esc(d.product)}">`)}
 ${fld(t('f_audience'), `<input id="cr-aud" data-m="draft.audience" value="${esc(d.audience)}">`)}
 <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr))">${catSel('cr-cat', d)}${fld(t('f_platform'), sel('cr-plat', 'draft.platform', opts(Object.keys(PLATS), 'plat_'), d.platform, 'data-re'))}${fld(t('f_style'), sel('cr-style', 'draft.style', opts(STYLE_K, 'style_'), d.style))}${fld(t('f_goal'), sel('cr-goal', 'draft.goal', opts(GOAL_K, 'goal_'), d.goal))}${fld(t('f_lang'), sel('cr-lang', 'draft.lang', opts(LANG_K, 'lang_'), lg(d), 'data-re'))}${shareSel(d)}</div>
 ${lg(d) !== 'ar' && !aiOn() ? `<p class="sub">${t('tpl_note')}</p>` : ''}
 <div class="row"><button class="btn p" data-act="improve">${t('b_improve')}</button><button class="btn" data-act="variants">${t('b_variants')}</button><button class="btn" data-act="titles">${t('b_titles')}</button><button class="btn" data-act="tags">${t('b_tags')}</button><button class="btn v" data-act="toimage">${ic('image')} ${t('b_toimage')}</button><button class="btn v" data-go="video">${ic('video')} ${t('nav_video')}</button><button class="btn v" data-go="scenes">${ic('film')} ${t('nav_scenes')}</button></div></div>
 <div class="panel"><h2>${t('results')}</h2><div class="out">
 ${o.text ? `<div><h3>${t('r_text')}</h3><textarea id="cr-text" dir="auto" data-m="draft.out.text" aria-label="${t('f_adtext')}">${esc(o.text)}</textarea><p class="sub">${pl.max ? t('chars_of', { n, max: pl.max, plat: t('plat_' + d.platform) }) : t('chars', { n })}${pl.max && n > pl.max ? ` · <span class="pill err">${t('over_limit')}</span>` : ''}</p></div>` : ''}
 ${o.variants ? `<div><h3>${t('sec_variants')}</h3>${o.variants.map((v, i) => `<p><span class="pill v">${t('style_' + v.s)}</span> ${esc(v.t)} <button class="link" data-act="usevar" data-i="${i}">${t('use_it')}</button></p>`).join('')}</div>` : ''}
 ${o.titles ? `<div><h3>${t('sec_titles')}</h3><ul>${o.titles.map(x => `<li dir="auto">${esc(x)}</li>`).join('')}</ul></div>` : ''}
 ${o.tags ? `<div><h3>${t('sec_tags')}</h3><p>${o.tags.map(x => esc(x)).join(' ')}</p></div>` : ''}
 ${d.img ? `<div><h3>${t('r_image')}</h3><img class="shot" style="max-height:220px" src="${imgURL(d)}" alt="${esc(t('alt_adimg', { p: d.product }))}"></div>` : ''}
 ${!o.text && !o.variants && !o.titles && !o.tags ? `<p class="sub">${t('r_empty')}</p>` : ''}</div>
 <div class="row"><button class="btn p" data-act="savead">${t('b_save')}</button><button class="btn v" data-act="share" ${d.out.text ? '' : 'disabled'}>${ic('share')} ${t('b_share')}</button><button class="btn" data-act="saveimg" ${d.img ? '' : 'disabled'}>${t('b_saveimg')}</button><button class="btn" data-act="dlimg" ${d.img ? '' : 'disabled'}>${t('b_dlimg')}</button></div></div></div>`;
};

V.image = () => {
  const d = S.draft, u = cur();
  return `<div class="head"><div><h1>${t('image_t')}</h1><p class="sub">${t('ratio', { plat: t('plat_' + d.platform), rt: PLATS[d.platform].rt })}</p></div><div class="row">${clearBtn()}<span class="pill v">${t('imgs_avail', { n: left(u, 'images') })}</span></div></div>
 <div class="cols"><div class="panel">${errBox()}
 ${baseFields(d)}
 ${fld(t('f_adtext'), `<textarea id="im-text" dir="auto" data-m="draft.out.text">${esc(d.out.text || '')}</textarea>`)}
 ${fld(t('f_imgdesc'), `<textarea id="im-desc" dir="auto" data-m="draft.imgDesc">${esc(d.imgDesc || '')}</textarea>`)}
 ${refBlock(d)}
 <div class="row" style="align-items:flex-start">${genCta('genimg', 'image', t('b_genimg'), false)}<button class="btn" data-go="create">${t('b_back')}</button></div></div>
 <div class="panel"><h2>${t('out_image')}</h2>${d.img ? `<img class="shot" src="${imgURL(d)}" alt="${esc(t('alt_adimg', { p: d.product }))}">` : `<p class="sub">${t('no_image')}</p>`}
 <div class="row"><button class="btn p" data-act="saveimg" ${d.img ? '' : 'disabled'}>${t('b_saveimg')}</button><button class="btn" data-act="dlimg" ${d.img ? '' : 'disabled'}>${t('b_dlimg')}</button></div></div></div>`;
};

const vidLen = d => Math.min(15, Math.max(6, +d.vidSec || +S.settings.vidSec || 6));
const scriptField = d => fld(t('f_script'), `<textarea id="sc-script" dir="auto" data-m="draft.scenes.script" style="min-height:72px">${esc(d.scenes.script || '')}</textarea>`);

V.video = () => {
  const d = S.draft, u = cur(), lens = {}; for (let i = 6; i <= 15; i++) lens[i] = t('n_sec', { n: i });
  return `<div class="head"><div><h1>${t('nav_video')}</h1><p class="sub">${t('ratio', { plat: t('plat_' + d.platform), rt: PLATS[d.platform].rt })}</p></div><div class="row">${clearBtn()}<span class="pill v">${t('vids_avail', { n: left(u, 'vidSecs') })}</span></div></div>
 ${aiOn() ? '' : `<p class="note info">${t('need_or')}</p>`}
 <div class="cols"><div class="panel">${errBox()}
 ${baseFields(d)}
 ${fld(t('f_vidlen'), sel('vd-len', 'draft.vidSec', lens, String(vidLen(d))))}
 ${fld(t('f_viddesc'), `<textarea id="vd-desc" dir="auto" data-m="draft.vidDesc">${esc(d.vidDesc || '')}</textarea>`)}
 ${scriptField(d)}
 ${refBlock(d)}
 <div class="row" style="align-items:flex-start">${genCta('genvid', 'video', t('nav_video'), !aiOn() || VID.busy)}<button class="btn" data-go="create">${t('b_back')}</button></div>
 ${VID.busy ? `<p class="note info" role="status">${esc(VID.status)}</p>` : ''}</div>
 <div class="panel"><h2>${t('out_video')}</h2>${vidURL(d) ? `<video class="shot" controls playsinline src="${vidURL(d)}"></video><a class="btn" style="align-self:start" href="${vidURL(d)}" download="ad-video.mp4">${t('b_dlvid')}</a><p class="sub">${t('vid_saved', { size: fmtSize(d.vid.size) })}</p>` : `<p class="sub">${t('no_video')}</p>`}</div></div>`;
};

/* Scenes: order images and clips, set each one's seconds and caption, then preview the cut in the page. */
V.scenes = () => {
  const d = S.draft, sc = d.scenes, [w, h] = PLATS[d.platform].r, sum = sc.items.reduce((n, i) => n + (+i.dur || 0), 0), tot = {};
  for (let i = 6; i <= 15; i++) tot[i] = t('n_sec', { n: i });
  const first = sc.items.find(i => MEDIA.get(i.id));
  const row = (it, i) => `<div class="ad">${MEDIA.get(it.id) ? (it.kind === 'vid' ? `<video class="thumb84" muted playsinline preload="metadata" src="${MEDIA.get(it.id)}"></video>` : `<img src="${MEDIA.get(it.id)}" alt="">`) : `<div class="thumb">${t('sc_missing')}</div>`}
 <div class="body"><div class="row"><span class="pill ${it.kind === 'vid' ? 'v' : ''}">${t(it.kind === 'vid' ? 'sc_clip' : 'sc_image')} ${i + 1}</span><span class="sub" dir="auto">${esc(it.name || '')}</span></div>
 <div class="grid" style="grid-template-columns:110px minmax(0,1fr)">${fld(t('sc_dur'), `<input id="sc-d-${i}" type="number" min="1" max="15" dir="ltr" data-m="draft.scenes.items.${i}.dur" data-re value="${it.dur}">`)}${fld(t('sc_cap'), `<input id="sc-c-${i}" dir="auto" data-m="draft.scenes.items.${i}.cap" value="${esc(it.cap || '')}">`)}</div>
 <div class="row"><button class="btn s" data-act="scmove" data-i="${i}" data-by="-1" ${i ? '' : 'disabled'}>${t('sc_up')}</button><button class="btn s" data-act="scmove" data-i="${i}" data-by="1" ${i < sc.items.length - 1 ? '' : 'disabled'}>${t('sc_down')}</button><button class="btn s d" data-act="scdel" data-i="${i}">${t('b_del')}</button></div></div></div>`;
  return `<div class="head"><div><h1>${t('nav_scenes')}</h1><p class="sub">${t('ratio', { plat: t('plat_' + d.platform), rt: PLATS[d.platform].rt })}</p></div><div class="row">${clearBtn()}<span class="pill ${sc.items.length && sum === +sc.total ? 'ok' : 'm'}">${t('sc_sum', { sum, total: sc.total })}</span></div></div>
 <div class="cols"><div class="panel">${errBox()}
 ${baseFields(d)}
 ${fld(t('sc_total'), sel('sc-total', 'draft.scenes.total', tot, String(sc.total), 'data-re'))}
 <div class="row"><label class="btn">${ic('plus')} ${t('sc_add')}<input class="vh" id="sc-file" type="file" accept="image/*,video/*" multiple data-scene></label>
 ${d.img && d.img.id ? `<button class="btn" data-act="scadd" data-src="img">${t('sc_add_img')}</button>` : ''}${vidURL(d) ? `<button class="btn" data-act="scadd" data-src="vid">${t('sc_add_vid')}</button>` : ''}
 <button class="btn" data-act="scfit" ${sc.items.length ? '' : 'disabled'}>${t('sc_fit')}</button></div>
 <div>${sc.items.length ? sc.items.map(row).join('') : `<p class="sub">${t('sc_none')}</p>`}</div>
 ${scriptField(d)}
 <div class="row"><button class="btn p" data-act="scsave">${t('sc_save')}</button></div></div>
 <div class="panel"><h2>${t('sc_preview')}</h2>
 <div class="stage" id="stage" style="aspect-ratio:${w}/${h};max-width:min(100%,${Math.round(460 * w / h)}px)">${first ? (first.kind === 'vid' ? `<video muted playsinline preload="metadata" src="${MEDIA.get(first.id)}"></video>` : `<img src="${MEDIA.get(first.id)}" alt="">`) : `<span>${t('sc_stage_empty')}</span>`}</div>
 <div class="bar"><i id="stagebar" style="width:0"></i></div>
 <div class="row"><button class="btn p" data-act="scplay" ${sc.items.length ? '' : 'disabled'}>${t('sc_play')}</button><button class="btn" data-act="scstop">${t('sc_stop')}</button></div>
 <p class="sub">${t('sc_note')}</p></div></div>`;
};

/* Free design: one description, an image or a video, the logo added in the corner. */
const freeMedia = (it, cls = 'shot') => { const src = MEDIA.get(it.media.id); return !src ? `<div class="thumb">${t('sc_missing')}</div>` : it.kind === 'vid' ? `<video class="${cls}" controls playsinline preload="metadata" src="${src}#t=0.1"></video>` : `<img class="${cls}" src="${src}" alt="${esc(it.prompt)}">`; };
const icoAct = (act, id, icon, label, extra = '') => `<button class="ico sm" data-act="${act}" data-id="${id}" title="${esc(label)}" aria-label="${esc(label)}" ${extra}>${ic(icon)}</button>`;
V.free = () => {
  const u = cur(), f = S.freeDraft, l = f.last, mine = freeOf(u).sort((a, b) => b.date.localeCompare(a.date)), secs = Math.min(15, Math.max(6, +S.settings.vidSec || 6));
  return `<div class="head"><div><h1>${t('nav_free')}</h1><p class="sub">${t('fr_sub')}</p></div><div class="row"><span class="pill v">${t('imgs_avail', { n: left(u, 'images') })}</span><span class="pill v">${t('vids_avail', { n: left(u, 'vidSecs') })}</span></div></div>
 <p class="note info">${t('fr_note', { brand: esc(coBrand()) })}<br><span class="sub">${t('fr_note2')}</span></p>
 <div class="cols"><div class="panel">${errBox()}
 ${fld(t('fr_prompt'), `<textarea id="fr-prompt" dir="auto" data-m="freeDraft.prompt" style="min-height:150px">${esc(f.prompt || '')}</textarea>`)}
 <div class="row wmrow" role="group" aria-label="${esc(t('fr_wm'))}"><b>${t('fr_wm')}</b>${[['logo', '✅'], ['none', '❌']].map(([k, sym]) => `<label class="wmopt"><span aria-hidden="true">${sym}</span><input type="checkbox" id="fr-wm-${k}" data-wm="${k}" ${(f.wm || 'none') === k ? 'checked' : ''} aria-label="${esc(t('fr_wm_' + k, { brand: coBrand() }))}"></label>`).join('')}</div>
 <div class="row"><button class="btn p" data-act="freeimg" ${FREE.busy ? 'disabled' : ''}>${ic('image')} ${t('fr_genimg')}</button><button class="btn v" data-act="freevid" ${!aiOn() || FREE.busy ? 'disabled' : ''}>${ic('video')} ${t('fr_genvid')}</button></div>
 ${FREE.busy ? `<p class="note info" role="status">${esc(FREE.status)}</p>` : ''}
 <p class="sub">${aiOn() ? t('fr_vidinfo', { n: secs }) + ' ' + t('fr_model', { m: esc(S.settings.freeImgModel || S.settings.imgModel) }) : t('fr_offline')}</p></div>
 <div class="panel"><h2>${t('results')}</h2>${l ? `${freeMedia(l)}${l.wmPending ? `<p class="note info">${t('fr_wm_pending')}</p><button class="btn v" style="align-self:start" data-act="freewm" ${FREE.busy ? 'disabled' : ''}>${ic('wand')} ${t('fr_wm_add')}</button>` : ''}
 <div class="row"><button class="btn p" data-act="freedl" data-id="last">${ic('dl')} ${t('fr_dl')}</button><button class="btn" data-act="freesave" ${l.saved ? 'disabled' : ''}>${ic('mark')} ${t(l.saved ? 'fr_saved' : 'fr_save')}</button></div>
 <div class="row">${icoAct('freeexp', 'last', 'share', t('fr_exp'))}<span class="sub">${t('fr_exp')}</span></div>` : `<p class="sub">${t('fr_empty')}</p>`}</div></div>
 <h2>${t('fr_lib')}</h2>
 ${mine.length ? `<div class="grid frlib" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">${mine.map(it => `<article class="panel" style="gap:8px">${freeMedia(it, 'shot')}<p class="sub" dir="auto" style="margin:0;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${esc(it.prompt)}</p>
 <div class="row" style="justify-content:space-between"><span class="sub">${fdate(it.date)} · ${fmtSize(it.media.size)}</span><span class="row">${icoAct('freedl', it.id, 'dl', t('fr_dl'))}${icoAct('freeexp', it.id, 'share', t('fr_exp'))}${icoAct('freedel', it.id, 'trash', t('b_del'))}</span></div></article>`).join('')}</div>` : `<div class="panel"><p class="sub">${t('fr_lib_empty')}</p></div>`}`;
};

V.library = () => {
  const u = cur(), f = S.filt, days = { all: 1e9, today: 1, week: 7, month: 30 }[f.date];
  const ads = S.ads.filter(a => a.uid === u.id && (f.plat === 'all' || a.platform === f.plat) && (f.style === 'all' || a.style === f.style) && (Date.now() - new Date(a.date)) < days * 864e5).sort((a, b) => b.date.localeCompare(a.date));
  const card = a => `<article class="panel"><div class="row" style="justify-content:space-between"><h2 dir="auto">${esc(a.product)}</h2><span class="sub">${fmtSize(adBytes(a))}</span></div>${adMeta(a)}
 <div><h3>${t('sec_text')}</h3><p class="adtext">${esc(a.text)}</p></div>
 ${a.variants && a.variants.length ? `<div><h3>${t('sec_variants')}</h3>${a.variants.map(v => `<p class="adtext"><span class="pill v">${t('style_' + v.s)}</span> ${esc(v.t)}</p>`).join('')}</div>` : ''}
 ${a.titles && a.titles.length ? `<div><h3>${t('sec_titles')}</h3><ul>${a.titles.map(x => `<li dir="auto">${esc(x)}</li>`).join('')}</ul></div>` : ''}
 ${a.tags && a.tags.length ? `<div><h3>${t('sec_tags')}</h3><p class="adtext">${a.tags.map(x => esc(x)).join(' ')}</p></div>` : ''}
 ${a.img || a.vid || (a.refs || []).length ? `<div><h3>${t('sec_media')}</h3><div class="media">${a.img ? `<img src="${imgURL(a)}" alt="${esc(t('alt_adimg', { p: a.product }))}">` : ''}${vidURL(a) ? `<video controls playsinline preload="metadata" src="${vidURL(a)}"></video>` : a.vid ? `<p class="sub">${t('vid_missing')}</p>` : ''}${(a.refs || []).filter(r => MEDIA.get(r.id)).map(r => `<figure class="reftag">${r.kind === 'vid' ? `<video class="thumb84" muted playsinline preload="metadata" src="${MEDIA.get(r.id)}"></video>` : `<img class="thumb84" src="${MEDIA.get(r.id)}" alt="${t('ref_label')}">`}<figcaption class="pill m">${t('ref_label')}</figcaption></figure>`).join('')}</div>${a.refNote ? `<p class="sub" dir="auto">${t('ref_label')}: ${esc(a.refNote)}</p>` : ''}</div>` : ''}
 ${a.scenes && (a.scenes.items.length || a.scenes.script) ? `<div><h3>${t('nav_scenes')}</h3><p class="sub">${t('sc_lib', { n: a.scenes.items.length, s: a.scenes.items.reduce((n, i) => n + (+i.dur || 0), 0) })}</p>${a.scenes.script ? `<p class="adtext">${esc(a.scenes.script)}</p>` : ''}</div>` : ''}
 <div class="row"><button class="btn s" data-act="editad" data-id="${a.id}">${t('b_editad')}</button><button class="btn s v" data-act="sharemenu" data-id="${a.id}">${ic('share')} ${t('b_share')}</button><button class="btn s d" data-act="delad" data-id="${a.id}">${t('b_delad')}</button></div></article>`;
  return `<div class="head"><h1>${t('nav_library')}</h1><span class="sub">${t('n_ads', { n: ads.length })}</span></div>
 <div class="panel">${storageBox(u)}<p class="sub">${t('lib_note')}</p></div>
 <div class="row">${fld(t('f_date'), sel('lb-date', 'filt.date', opts(['all', 'today', 'week', 'month'], 'd_'), f.date, 'data-re'))}${fld(t('f_platform'), sel('lb-plat', 'filt.plat', { all: t('p_all'), ...opts(Object.keys(PLATS), 'plat_') }, f.plat, 'data-re'))}${fld(t('f_adtype'), sel('lb-style', 'filt.style', { all: t('s_all'), ...opts(STYLE_K, 'style_') }, f.style, 'data-re'))}</div>
 ${ads.length ? ads.map(card).join('') : `<div class="panel"><p class="sub">${t('lib_empty')}</p></div>`}`;
};

V.suggest = () => {
  const mine = S.suggestions.filter(s => s.uid === S.uid), cls = { new: 'v', accepted: 'ok', rejected: 'err' };
  return `<div class="head"><h1>${t('nav_suggest')}</h1></div><div class="panel">${msgBox()}${errBox()}
 ${fld(t('f_sug'), '<textarea id="sg-text" dir="auto"></textarea>')}
 <button class="btn p" data-act="sendsugg" style="align-self:start">${t('b_send')}</button>
 <p class="sub">${t('sug_note')}</p></div>
 ${mine.length ? `<div class="panel"><h2>${t('sug_prev')}</h2>${mine.map(s => `<div class="kv"><span dir="auto">${esc(s.text)}</span><span class="pill ${cls[s.status]}">${t('st_' + s.status)}${s.rewarded ? ' · ' + t('rewarded') : ''}</span></div>`).join('')}</div>` : ''}`;
};

V.campaigns = () => `<div class="head"><h1>${t('camp_t')}</h1><span class="pill v">${t('soon')}</span></div>
 <p class="note info">${t('camp_note')}</p>
 <div class="panel soon" aria-hidden="true"><div class="row" style="justify-content:space-between"><h2>${t('camp_list')}</h2><button class="btn p" tabindex="-1">${ic('plus')} ${t('camp_add')}</button></div>
 <div class="kv"><span>${t('camp1')}</span><span class="pill m">${t('draft_l')}</span></div><div class="kv"><span>${t('camp2')}</span><span class="pill m">${t('draft_l')}</span></div>
 <div class="row"><button class="btn" tabindex="-1">${t('camp_an')}</button><button class="btn" tabindex="-1">${t('camp_plan')}</button><button class="btn" tabindex="-1">${t('camp_link')}</button></div></div>
 <button class="btn" disabled style="align-self:start">${t('soon')}</button>`;

V.plans = () => {
  const u = cur();
  return `<div class="head"><div><h1>${t('nav_plans')}</h1><p class="sub">${t('plans_sub')}</p></div></div>
 <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">${S.plans.filter(p => p.active || p.id === u.plan).map(p => `<div class="plan ${p.id === u.plan ? 'cur' : ''}"><div class="row" style="justify-content:space-between"><h2>${t('plan_x', { name: esc(planName(p)) })}</h2>${p.id === u.plan ? `<span class="pill">${t('your_plan')}</span>` : ''}</div>
 <div class="price">${p.price ? sar(p.price) + `<span class="sub" style="font-size:.85rem;font-weight:400"> / ${t('per_month')}</span>` : t('free')}</div>
 <ul><li>${t('n_ad', { n: p.ads })}</li><li>${t('n_img', { n: p.images })}</li><li>${t('n_an', { n: p.analyses })}</li>${p.vidSecs ? `<li>${t('n_vid', { n: p.vidSecs })}</li>` : ''}<li>${t('n_mb', { n: p.storage })}</li>${p.deep ? `<li>${t('deep')}</li>` : ''}</ul>
 <button class="btn ${p.id === u.plan ? '' : 'p'}" data-act="subscribe" data-id="${p.id}" ${p.id === u.plan ? 'disabled' : ''}>${t(p.id === u.plan ? 'subscribed' : 'subscribe')}</button></div>`).join('')}</div>
 ${S.addons.some(a => a.active) ? `<h2>${t('addons_t')}</h2>
 <div class="panel">${S.addons.filter(a => a.active).map(a => { const unit = a.mode === 'unit', l = cartLine(a); return `<div class="kv" style="align-items:center;flex-wrap:wrap"><div style="min-width:0"><b dir="auto">${esc(a.name)}</b><div class="sub">${t(unit ? 'ao_per' : 'ao_pack', { amt: a.amount, unit: t('unit_' + a.kind), price: sar(a.price) })}</div></div>
 <div class="row"><label class="row sub" for="ct-${a.id}">${t(unit ? 'ao_need' : 'ao_count')}<input id="ct-${a.id}" type="number" min="0" step="${unit ? a.amount : 1}" dir="ltr" style="width:96px" data-cart="${a.id}" value="${+CART[a.id] || 0}">${unit ? t('unit_' + a.kind) : ''}</label><b id="ct-l-${a.id}" style="min-width:84px;text-align:end">${sar(l.total)}</b></div></div>`; }).join('')}
 <div class="kv total"><span>${t('inv_total')}</span><b id="cart-total">${sar(cartTotal())}</b></div>
 <button class="btn p" id="cart-pay" data-act="cartpay" style="align-self:start" ${cartTotal() > 0 ? '' : 'disabled'}>${t('ao_pay')}</button></div>` : ''}
 ${LASTINV && byId(S.invoices || [], LASTINV) ? `<p class="note ok row" role="status">${t('paid_ok')} <button class="ico sm" data-act="invshow" data-id="${LASTINV}" title="${t('inv_export')}" aria-label="${t('inv_export')}">${ic('receipt')}</button></p>` : ''}
 ${Object.values(u.extra || {}).some(Boolean) ? `<p class="sub">${t('extra_have')} ${ADDON_K.filter(k => (u.extra || {})[k]).map(k => `+${u.extra[k]} ${t('unit_' + k)}`).join(L() === 'ar' ? '، ' : ', ')}</p>` : ''}
 ${(S.invoices || []).some(v => v.uid === u.id) ? `<div class="panel"><h2>${t('inv_mine')}</h2>${(S.invoices || []).filter(v => v.uid === u.id).slice(0, 12).map(v => `<div class="kv" style="align-items:center"><span><span dir="ltr">${v.no}</span> <span class="sub">${fdate(v.date)}</span></span><span class="row"><b>${sar(v.total)}</b><button class="ico sm" data-act="invshow" data-id="${v.id}" title="${t('inv_export')}" aria-label="${t('inv_export')} ${v.no}">${ic('receipt')}</button></span></div>`).join('')}</div>` : ''}
 <p class="sub">${t('pay_note')}</p>`;
};

V.account = () => {
  const u = cur(), i = S.users.indexOf(u), th = S.settings.theme, soc = socialOf(u);
  const thBtn = (v, icon) => `<button class="ico" data-act="theme" data-v="${v}" aria-pressed="${th === v}" title="${t('theme_' + v)}" aria-label="${t('theme_' + v)}">${ic(icon)}</button>`;
  const socBtn = k => { const a = soc.find(x => x.key === k); return `<button class="ico" data-act="socedit" data-k="${k}" aria-pressed="${!!a}" title="${SOCIAL[k].n}" aria-label="${SOCIAL[k].n}${a ? ' · ' + t('linked') : ''}">${socIcon(k)}</button>`; };
  return `<div class="head"><div><h1>${t('nav_account')}</h1><p class="sub">${t('acc_no')} <span dir="ltr">${u.id}</span> · ${esc(planName(planOf(u)))}</p></div></div>
 <div class="cols"><div class="panel"><h2>${t('acc_profile')}</h2>
 ${fld(t('f_name'), `<input id="ac-name" data-m="users.${i}.name" value="${esc(u.name)}" autocomplete="name">`)}
 ${fld(t('f_phone'), `<input id="ac-phone" dir="ltr" type="tel" data-m="users.${i}.phone" value="${esc(u.phone || '')}" autocomplete="tel">`)}
 ${fld(t('f_email'), `<input id="ac-email" dir="ltr" value="${esc(u.email)}" disabled>`)}
 <form data-form="chpass" class="panel" style="padding:0" novalidate><h3>${t('pw_t')}</h3>${errBox()}${msgBox()}
 ${fld(t('pw_cur'), '<input id="pw-cur" name="cur" type="password" dir="ltr" autocomplete="current-password">')}
 ${fld(t('pw_new'), `<input id="pw-new" name="pass" type="password" dir="ltr" autocomplete="new-password"><span>${t('pass_hint')}</span>`)}
 <button class="btn" style="align-self:start">${t('pw_save')}</button></form></div>
 <div class="panel"><h2>${t('theme')}</h2><div class="row">${thBtn('auto', 'auto')}${thBtn('light', 'sun')}${thBtn('dark', 'moon')}</div></div></div>
 <div class="panel"><h2>${t('soc_t')}</h2>
 <div class="row">${Object.keys(SOCIAL).map(socBtn).join('')}${soc.filter(a => a.key === 'custom').map(a => `<button class="ico" data-act="socedit" data-id="${a.id}" aria-pressed="true" title="${esc(a.name)}" aria-label="${esc(a.name)}"><span dir="auto">${esc(a.name)}</span></button>`).join('')}<button class="ico add" data-act="socadd" title="${t('soc_add')}" aria-label="${t('soc_add')}">${ic('plus')}</button></div>
 <p class="sub">${t('soc_note')}</p></div>`;
};

/* Company pages. Their text comes from the company settings; each exists only once its text is filled in. */
const prose = (title, body) => `<div class="head"><h1>${title}</h1></div><div class="panel prose">${body}</div>${cur() ? '' : `<button class="btn" style="align-self:start" data-go="login">${t('login_t')}</button>`}`;
V.about = () => { const c = co(); return prose(t('about_t'), `${c.aboutLead.trim() ? `<p class="lead" dir="auto">${esc(c.aboutLead)}</p>` : ''}${c.companyTagline.trim() ? `<p dir="auto"><b>${esc(c.companyTagline)}</b></p>` : ''}${c.aboutText.trim() ? `<p dir="auto">${esc(c.aboutText)}</p>` : ''}`); };
V.terms = () => prose(t('terms_t'), `<p dir="auto">${esc(co().termsText)}</p>`);
V.privacy = () => prose(t('privacy_t'), `<p dir="auto">${esc(co().privacyText)}</p>`);
