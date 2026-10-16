/* Admin dashboard pages. */
function fin() {
  const now = new Date(), same = (d, k) => { const x = new Date(d); return x.getFullYear() === now.getFullYear() && (k === 'y' || x.getMonth() === now.getMonth()) && (k !== 'd' || x.getDate() === now.getDate()); };
  const sum = k => S.payments.filter(p => same(p.date, k)).reduce((a, p) => a + p.amount, 0), mp = S.payments.filter(p => same(p.date, 'm'));
  const month = sum('m'), texts = S.users.reduce((a, u) => a + u.used.analyses, 0), images = S.users.reduce((a, u) => a + u.used.images, 0);
  const or = texts * .02, imgCost = images * .15, stripe = mp.reduce((a, p) => a + p.amount * .029 + 1, 0);
  return { today: sum('d'), month, year: sum('y'), subs: S.users.filter(u => planOf(u).price > 0).length, images, or, imgCost, stripe, net: month - or - imgCost - stripe, perUser: S.users.length ? (or + imgCost) / S.users.length : 0 };
}
const NAV_U = [['home', 'home'], ['create', 'plus'], ['image', 'image'], ['video', 'video'], ['scenes', 'film'], ['library', 'lib'], ['suggest', 'msg'], ['campaigns', 'book'], ['plans', 'card'], ['account', 'gear']];
const NAV_A = [['a-home', 'home'], ['a-users', 'users'], ['a-plans', 'card'], ['a-ads', 'lib'], ['a-sugg', 'msg'], ['a-errors', 'bug'], ['a-usage', 'chart'], ['a-campaigns', 'book'], ['a-fin', 'chart'], ['a-settings', 'gear']];
const roleBadge = u => u.adminRole ? `<span class="pill ${u.isAdmin ? 'ok' : 'm'}">${esc(u.adminRole)}${u.isAdmin ? '' : ' · ' + t('stopped')}</span>` : `<span class="sub">${t('no_l')}</span>`;
const permsText = u => { const r = [...new Set([...(ROLES[u.adminRole] || []), ...(u.permissions || [])])]; return r.length >= ADMIN_R.length ? t('all_pages') : r.map(x => t('nav_' + x)).join(L() === 'ar' ? '، ' : ', '); };

V['a-home'] = () => {
  const f = fin(), open = S.errors.filter(e => e.status === 'open'), fresh = S.suggestions.filter(s => s.status === 'new');
  const stats = [['s_users', S.users.length], ['s_ads', S.ads.length], ['s_imgs', f.images], ['s_sugg', S.suggestions.length], ['s_openerr', open.length], ['s_subs', f.subs], ['f_today', sar(f.today)], ['f_month', sar(f.month)]];
  return `<div class="head"><h1>${t('a_home_t')}</h1><span class="sub">${fdate(new Date())}</span></div>
 <div class="panel"><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr))">${stats.map(([l, v]) => `<div class="stat"><b>${v}</b><span>${t(l)}</span></div>`).join('')}</div></div>
 <div class="cols"><div class="panel"><h2>${t('err_attn')}</h2>${open.map(e => `<div class="kv"><span>${esc(e.title)}</span><span class="pill err">${t('est_open')}</span></div>`).join('') || `<p class="sub">${t('no_open_err')}</p>`}${allowed('a-errors') ? `<button class="btn s" data-go="a-errors" style="align-self:start">${t('open_errs')}</button>` : ''}</div>
 <div class="panel"><h2>${t('new_sugg')}</h2>${fresh.map(s => `<div class="kv"><span dir="auto">${esc(s.text)}</span><b>${s.score}/5</b></div>`).join('') || `<p class="sub">${t('no_new_sugg')}</p>`}${allowed('a-sugg') ? `<button class="btn s" data-go="a-sugg" style="align-self:start">${t('open_sugg')}</button>` : ''}</div></div>`;
};

V['a-users'] = () => `<div class="head"><h1>${t('users_t')}</h1><span class="sub">${t('n_users', { n: S.users.length })}</span></div>
 <div class="panel"><div class="scroll"><table><thead><tr><th>UserID</th><th>${t('th_name')}</th><th>${t('f_email')}</th><th>${t('th_plan')}</th><th>${t('th_store')}</th><th>${t('th_admin')}</th><th>${t('th_joined')}</th><th>${t('th_actions')}</th></tr></thead><tbody>
 ${S.users.map(u => `<tr><td class="n" dir="ltr">${u.id}</td><td>${esc(u.name)}</td><td dir="ltr">${esc(u.email)}</td>
 <td><span class="pill">${esc(planName(planOf(u)))}</span>${u.bonus ? ` <button class="pill ok" title="${t('bonus_edit')}" data-act="ubonusedit" data-id="${u.id}">+${u.bonus}</button>` : ''}</td>
 <td class="n"><button class="link" title="${t('store_edit')}" data-act="ustore" data-id="${u.id}">${fmtMB(usedBytes(u))} / ${limitMB(u)} ${t('mb')}</button></td>
 <td>${roleBadge(u)}</td><td class="n">${fdate(u.joined)}</td>
 <td><div class="row" style="flex-wrap:nowrap"><button class="btn s" data-act="uedit" data-id="${u.id}">${t('b_edit')}</button><button class="btn s" data-act="uplan" data-id="${u.id}">${t('b_upgrade')}</button><button class="btn s v" data-act="ubonus" data-id="${u.id}">${t('b_reward')}</button><button class="btn s" data-act="uadmin" data-id="${u.id}">${t(u.adminRole ? 'b_role' : 'b_mkadmin')}</button><button class="btn s d" data-act="udel" data-id="${u.id}">${t('b_del')}</button></div></td></tr>`).join('')}</tbody></table></div></div>`;

V['a-plans'] = () => `<div class="head"><h1>${t('plansadm_t')}</h1><button class="btn p" data-act="padd">${ic('plus')} ${t('b_addplan')}</button></div>
 <div class="panel"><div class="scroll"><table><thead><tr><th>${t('th_planname')}</th><th>${t('th_price')}</th><th>${t('th_ads')}</th><th>${t('th_imgs')}</th><th>${t('th_an')}</th><th>${t('th_vids')}</th><th>${t('th_storemb')}</th><th>${t('th_subs')}</th><th>${t('th_status')}</th><th></th></tr></thead><tbody>
 ${S.plans.map(p => { const n = S.users.filter(u => u.plan === p.id).length; return `<tr><td><input id="pl-${p.id}-name" data-pl="${p.id}" data-k="name" value="${esc(p.name)}" style="width:110px" aria-label="${t('th_planname')}"></td>
 ${['price', 'ads', 'images', 'analyses', 'vidSecs', 'storage'].map(k => `<td><input id="pl-${p.id}-${k}" type="number" min="0" dir="ltr" data-pl="${p.id}" data-k="${k}" value="${p[k]}" aria-label="${k}"></td>`).join('')}
 <td class="n"><button class="link" data-act="psubs" data-id="${p.id}">${t('n_subs', { n })}</button></td><td><span class="pill ${p.active ? 'ok' : 'm'}">${t(p.active ? 'active' : 'stopped')}</span></td>
 <td><button class="btn s ${p.active ? 'd' : ''}" data-act="ptoggle" data-id="${p.id}" ${p.id === 'free' ? 'disabled' : ''}>${t(p.active ? 'b_stop' : 'b_activate')}</button></td></tr>`; }).join('')}</tbody></table></div>
 <p class="sub">${t('plans_saved_note')}</p></div>
 <div class="panel"><div class="row" style="justify-content:space-between"><h2>${t('addons_t')}</h2><button class="btn s p" data-act="addonadd">${ic('plus')} ${t('addon_add')}</button></div>
 <div class="scroll"><table><thead><tr><th>${t('th_name')}</th><th>${t('addon_kind')}</th><th>${t('addon_mode')}</th><th>${t('addon_amount')}</th><th>${t('th_price')}</th><th>${t('th_status')}</th><th></th></tr></thead><tbody>
 ${S.addons.map((a, i) => `<tr><td><input id="ao-${a.id}-n" data-m="addons.${i}.name" value="${esc(a.name)}" style="width:170px" aria-label="${t('th_name')}"></td>
 <td>${sel('ao-' + a.id + '-k', 'addons.' + i + '.kind', opts(ADDON_K, 'ak_'), a.kind)}</td>
 <td>${sel('ao-' + a.id + '-m', 'addons.' + i + '.mode', opts(['pack', 'unit'], 'am_'), a.mode === 'unit' ? 'unit' : 'pack')}</td>
 <td><input id="ao-${a.id}-a" type="number" min="1" dir="ltr" data-m="addons.${i}.amount" value="${a.amount}" aria-label="${t('addon_amount')}"></td>
 <td><input id="ao-${a.id}-p" type="number" min="0" dir="ltr" data-m="addons.${i}.price" value="${a.price}" aria-label="${t('th_price')}"></td>
 <td><span class="pill ${a.active ? 'ok' : 'm'}">${t(a.active ? 'active' : 'stopped')}</span></td>
 <td><div class="row" style="flex-wrap:nowrap"><button class="btn s" data-act="addontoggle" data-i="${i}">${t(a.active ? 'b_stop' : 'b_activate')}</button><button class="btn s d" data-act="addondel" data-i="${i}">${t('b_del')}</button></div></td></tr>`).join('')}</tbody></table></div>
 <p class="sub">${t('addons_note')}</p></div>`;

V['a-ads'] = () => `<div class="head"><h1>${t('adsadm_t')}</h1><span class="sub">${t('n_ads', { n: S.ads.length })}</span></div>
 <div class="panel"><div>${[...S.ads].sort((a, b) => b.date.localeCompare(a.date)).map(a => `<div class="ad">${thumb(a)}<div class="body"><div class="row"><b>${esc(uname(a.uid))}</b><span class="pill">${t('plat_' + a.platform)}</span><span class="sub">${fdate(a.date)}</span></div><p class="adtext">${esc(a.text)}</p>
 <div class="row"><button class="btn s" data-act="aedit" data-id="${a.id}">${t('b_edit')}</button><button class="btn s d" data-act="delad" data-id="${a.id}">${t('b_del')}</button></div></div></div>`).join('') || `<p class="sub">${t('no_ads_adm')}</p>`}</div></div>`;

V['a-sugg'] = () => {
  const cls = { new: 'v', accepted: 'ok', rejected: 'err' };
  return `<div class="head"><h1>${t('suggadm_t')}</h1><span class="sub">${t('n_sugg', { n: S.suggestions.length })}</span></div>
 ${S.suggestions.map(s => `<div class="panel"><div class="row" style="justify-content:space-between"><div class="row"><b>${esc(uname(s.uid))}</b><span class="sub">${fdate(s.date)}</span></div><span class="pill ${cls[s.status]}">${t(s.status === 'new' ? 'st_fresh' : 'st_' + s.status)}${s.rewarded ? ' · ' + t('rewarded') : ''}</span></div>
 <p dir="auto">${esc(s.text)}</p><div class="note info"><b>${t('ai_an')}</b> ${t('cat_l', { cat: t('cat_' + s.cat) })} ${t(s.score >= 4 ? 'note_hi' : 'note_lo')} <b>${t('rating', { n: s.score })}</b></div>
 <div class="row"><button class="btn s p" data-act="sset" data-id="${s.id}" data-v="accepted" ${s.status === 'accepted' ? 'disabled' : ''}>${t('b_accept')}</button><button class="btn s d" data-act="sset" data-id="${s.id}" data-v="rejected" ${s.status === 'rejected' ? 'disabled' : ''}>${t('b_reject')}</button><button class="btn s v" data-act="sreward" data-id="${s.id}" ${s.rewarded || s.status !== 'accepted' ? 'disabled' : ''}>${t('b_rewardowner')}</button></div></div>`).join('')}`;
};

V['a-errors'] = () => {
  const cls = { open: 'err', fixed: 'ok', sent: 'v', closed: 'm' };
  return `<div class="head"><h1>${t('err_t')}</h1><span class="sub">${t('err_count', { o: S.errors.filter(e => e.status === 'open').length, n: S.errors.length })}</span></div>
 ${S.errors.map(e => `<div class="panel"><div class="row" style="justify-content:space-between"><div class="row"><h2>${esc(e.title)}</h2><span class="sub">${fdate(e.date)}</span></div><span class="pill ${cls[e.status]}">${t('est_' + e.status)}</span></div>
 <p>${esc(e.desc)}</p><div class="note info"><b>${t('ai_an')}</b> ${esc(e.ai)}<br><b>${t('ai_fix')}</b> ${esc(e.fix)}</div>
 <div class="row"><button class="btn s p" data-act="eset" data-id="${e.id}" data-v="fixed" ${e.status === 'open' ? '' : 'disabled'}>${t('b_autofix')}</button><button class="btn s" data-act="eset" data-id="${e.id}" data-v="sent" ${e.status === 'open' ? '' : 'disabled'}>${t('b_todev')}</button><button class="btn s d" data-act="eset" data-id="${e.id}" data-v="closed" ${e.status === 'closed' ? 'disabled' : ''}>${t('b_close')}</button></div></div>`).join('')}`;
};

V['a-usage'] = () => {
  const by = {}; S.aiLog.forEach(l => { const m = l.m || AI_OPS[l.op]; by[m] = (by[m] || 0) + 1; });
  return `<div class="head"><div><h1>${t('nav_a-usage')}</h1><p class="sub">${t('usage_sub')}</p></div></div>
 <div class="panel"><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr))">${Object.entries(by).map(([m, n]) => `<div class="stat"><b>${n}</b><span dir="ltr">${esc(m)}</span></div>`).join('')}</div></div>
 <div class="panel"><div class="scroll"><table><thead><tr><th>${t('f_date')}</th><th>${t('th_user')}</th><th>${t('th_op')}</th><th>${t('th_model')}</th></tr></thead><tbody>${S.aiLog.slice(0, 60).map(l => `<tr><td class="n">${fdate(l.date)}</td><td>${esc(uname(l.uid))}</td><td>${t('op_' + l.op)}</td><td dir="ltr">${esc(l.m || AI_OPS[l.op])}</td></tr>`).join('')}</tbody></table></div></div>`;
};

V['a-campaigns'] = () => `<div class="head"><h1>${t('campadm_t')}</h1><span class="pill v">${t('soon')}</span></div>
 <p class="note info">${t('campadm_note')}</p>
 <div class="panel soon" aria-hidden="true"><h2>${t('camp_users')}</h2><div class="kv"><span>${t('camp_none')}</span><span class="pill m">0</span></div><div class="row"><button class="btn" tabindex="-1">${t('camp_an')}</button><button class="btn" tabindex="-1">${t('camp_plans')}</button></div></div>`;

V['a-fin'] = () => {
  const f = fin(), kv = (l, v, c = '') => `<div class="kv ${c}"><span>${t(l)}</span><b>${v}</b></div>`;
  return `<div class="head"><div><h1>${t('nav_a-fin')}</h1><p class="sub">${t('fin_sub')}</p></div></div>
 <div class="panel"><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">${[['f_today', f.today], ['f_month', f.month], ['f_year', f.year], ['f_net', f.net]].map(([l, v]) => `<div class="stat"><b>${sar(v)}</b><span>${t(l)}</span></div>`).join('')}</div></div>
 <div class="cols"><div class="panel"><h2>${t('fin_subs')}</h2>${kv('paid_subs', f.subs)}${kv('cancels', S.cancels)}${kv('avg_cost', sar(f.perUser))}</div>
 <div class="panel"><h2>${t('net_calc')}</h2>${kv('rev_month', sar(f.month))}${kv('c_or', '− ' + sar(f.or))}${kv('c_stripe', '− ' + sar(f.stripe))}${kv('c_img', '− ' + sar(f.imgCost))}${kv('c_vid', '− ' + sar(0))}${kv('net', sar(f.net), 'total')}</div></div>`;
};

V['a-settings'] = () => {
  const s = S.settings, admins = S.users.filter(u => u.adminRole);
  const ck = (id, m, l, extra = '') => `<label class="row"><input type="checkbox" id="${id}" data-m="${m}" ${extra} ${m.split('.').reduce((o, k) => o[k], S) ? 'checked' : ''}> ${t(l)}</label>`;
  const inp = (id, m, v, extra = '') => `<input id="${id}" dir="ltr" data-m="${m}" value="${esc(v)}" ${extra}>`;
  return `<div class="head"><h1>${t('set_t')}</h1></div>
 <div class="panel"><div class="row" style="justify-content:space-between"><h2>${t('or_t')}</h2><span class="pill ${aiOn() ? 'ok' : 'm'}">${t(aiOn() ? 'on_l' : 'off_l')}</span></div>
 <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
 ${fld(t('f_apiurl'), inp('st-ob', 'settings.orBase', s.orBase))}
 ${fld(t('f_apikey'), inp('st-ok', 'settings.orKey', s.orKey, 'type="password" autocomplete="off" placeholder="sk-or-..."'))}
 ${fld(t('f_txtmodel'), inp('st-tm', 'settings.txtModel', s.txtModel))}
 ${fld(t('f_imgmodel'), inp('st-im', 'settings.imgModel', s.imgModel))}
 ${fld(t('f_vidmodel'), inp('st-vm', 'settings.vidModel', s.vidModel))}
 ${fld(t('f_videp'), inp('st-ve', 'settings.vidEndpoint', s.vidEndpoint))}
 ${fld(t('f_vidsec'), inp('st-vs', 'settings.vidSec', s.vidSec, 'type="number" min="6" max="15"'))}</div>
 ${ck('st-ol', 'settings.orLive', 'or_live', 'data-re')}
 <div class="row"><button class="btn" data-act="ortest">${t('b_test')}</button></div>
 <p class="sub">${t('or_note')}</p></div>
 <div class="cols"><div class="panel"><h2>${t('mail_t')}</h2>${fld(t('f_mailname'), `<input id="st-mn" data-m="settings.mailName" value="${esc(s.mailName)}">`)}${fld(t('f_mailfrom'), inp('st-mf', 'settings.mailFrom', s.mailFrom))}</div>
 <div class="panel"><h2>${t('pay_t')}</h2>${ck('st-sl', 'settings.stripeLive', 'stripe_live')}${fld(t('f_currency'), sel('st-cu', 'settings.currency', { SAR: t('cur_sar'), USD: t('cur_usd') }, s.currency))}</div>
 <div class="panel"><h2>${t('camp_set')}</h2>${ck('st-cp', 'settings.campaigns', 'camp_show')}<p class="sub">${t('camp_set_note')}</p></div>
 <div class="panel"><h2>${t('dash_t')}</h2>${fld(t('f_dashhome'), sel('st-dh', 'settings.dashHome', Object.fromEntries(NAV_A.map(n => [n[0], t('nav_' + n[0])])), s.dashHome))}</div>
 <div class="panel"><h2>${t('sec_t')}</h2>${ck('st-2f', 'settings.twofa', 'twofa')}${fld(t('f_lock'), inp('st-la', 'settings.lockAfter', s.lockAfter, 'type="number" min="1"'))}</div></div>
 <div class="panel"><div class="row" style="justify-content:space-between"><h2>${t('admins_t')}</h2><button class="btn s p" data-act="adadd">${t('b_addadmin')}</button></div>
 <div class="scroll"><table><thead><tr><th>${t('th_name')}</th><th>${t('f_email')}</th><th>${t('th_role')}</th><th>${t('th_perms')}</th><th>${t('th_status')}</th><th></th></tr></thead><tbody>${admins.map(u => `<tr><td>${esc(u.name)}</td><td dir="ltr">${esc(u.email)}</td><td>${esc(u.adminRole)}</td><td>${permsText(u)}</td><td><span class="pill ${u.isAdmin ? 'ok' : 'm'}">${t(u.isAdmin ? 'active' : 'stopped')}</span></td>
 <td><div class="row" style="flex-wrap:nowrap"><button class="btn s" data-act="uadmin" data-id="${u.id}">${t('b_perms')}</button><button class="btn s ${u.isAdmin ? 'd' : ''}" data-act="adtoggle" data-id="${u.id}" ${isLastSuper(u) ? 'disabled' : ''}>${t(u.isAdmin ? 'b_stop' : 'b_activate')}</button></div></td></tr>`).join('')}</tbody></table></div></div>
 ${(() => {
   const c = s.company, b = s.brand || {}, f = (k, l, extra = '') => fld(t(l), `<input id="co-${k}" data-m="settings.company.${k}" value="${esc(c[k] || '')}" ${extra}>`), ta = (k, l, extra = '') => fld(t(l), `<textarea id="co-${k}" dir="auto" data-m="settings.company.${k}" ${extra}>${esc(c[k] || '')}</textarea>`);
   const logoBox = (k, l) => `<div class="socup"><span class="sub">${t(l)}</span><span class="ico" aria-hidden="true"><img src="${esc(logoSrc(c[k]))}" alt=""></span><div class="row"><label class="btn s">${t('co_upload')}<input class="vh" id="lg-${k}" type="file" accept="image/*" data-logo="${k}"></label><button class="btn s" data-act="logoreset" data-k="${k}">${t('co_default')}</button></div>${fld(t('co_logo_code'), `<textarea id="co-${k}" dir="ltr" style="min-height:56px" data-logotext="${k}">${/^data:/.test(c[k] || '') ? '' : esc(c[k] || '')}</textarea>`)}</div>`;
   return `<div class="panel"><h2>${t('co_t')}</h2><p class="sub">${t('co_note')}</p>
 <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">${f('nameAr', 'co_nameAr')}${f('nameEn', 'co_nameEn', 'dir="ltr"')}${f('brandAr', 'co_brandAr')}${f('brandEn', 'co_brandEn', 'dir="ltr"')}${f('productAr', 'co_productAr')}${f('productEn', 'co_productEn', 'dir="ltr"')}</div>
 <div><span class="sub">${t('co_icon')}</span><div class="row"><button class="btn" data-act="iconstyle" data-v="gradient-m" aria-pressed="${c.iconStyle !== 'logo'}">${M_ICON} ${t('co_icon_m')}</button><button class="btn" data-act="iconstyle" data-v="logo" aria-pressed="${c.iconStyle === 'logo'}"><img src="${esc(logoSrc(c.logo))}" alt="" width="32" height="32" style="object-fit:contain"> ${t('co_icon_logo')}</button></div></div>
 <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${logoBox('logo', 'co_logo')}${logoBox('footerLogo', 'co_flogo')}</div>
 <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">${f('crNumber', 'co_cr', 'dir="ltr"')}${f('vatNumber', 'co_vat', 'dir="ltr"')}${f('emailGeneral', 'co_email', 'dir="ltr" type="email"')}${f('emailSupport', 'co_esupport', 'dir="ltr" type="email"')}${f('emailLegal', 'co_elegal', 'dir="ltr" type="email"')}${f('phone', 'co_phone', 'dir="ltr" type="tel"')}${f('address', 'co_address')}${f('companyTagline', 'co_tagline')}</div>
 ${f('aboutLead', 'co_aboutlead')}${ta('aboutText', 'co_about')}${ta('footerNote', 'co_fnote', 'style="min-height:56px"')}
 ${fld(t('co_links'), `<textarea id="co-links" dir="ltr" style="min-height:56px" data-links>${esc((c.footerLinks || []).length ? JSON.stringify(c.footerLinks) : '')}</textarea>`)}
 ${ta('termsText', 'co_terms', 'data-legal')}${ta('privacyText', 'co_privacy', 'data-legal')}
 <label class="row"><input type="checkbox" id="co-legal" data-m="settings.company.showLegal" ${c.showLegal ? 'checked' : ''}> ${t('co_showlegal')}</label></div>
 <div class="panel"><h2>${t('brand_t')}</h2>
 <div class="row">${fld(t('brand_primary'), `<input id="br-p" type="color" style="width:72px;padding:2px;height:40px" data-m="settings.brand.primary" value="${/^#[0-9a-f]{6}$/i.test(b.primary || '') ? b.primary : '#56b9f0'}">`)}${fld(t('brand_accent'), `<input id="br-a" type="color" style="width:72px;padding:2px;height:40px" data-m="settings.brand.accent" value="${/^#[0-9a-f]{6}$/i.test(b.accent || '') ? b.accent : '#b8a9e3'}">`)}
 <button class="btn" data-act="brandpreset">${t('brand_logo')}</button><button class="btn" data-act="brandreset">${t('co_default')}</button></div>
 <label class="row"><input type="checkbox" id="br-dark" data-m="settings.brand.dark" ${b.dark ? 'checked' : ''}> ${t('brand_dark')}</label>
 <div class="row"><button class="btn p" tabindex="-1">${t('brand_sample')}</button><span class="pill">${t('brand_sample')}</span><span class="pill v">${t('brand_sample')}</span></div>
 <p class="sub">${t('brand_note')}</p>
 <h3 style="margin-top:14px">${t('bg_t')}</h3>
 <div class="row" role="group" aria-label="${esc(t('bg_t'))}">${['none', 'balloon', 'waves', 'soft', 'custom'].filter(k => k !== 'custom' || b.bgImg).map(k => `<button class="btn s${(b.bg || 'none') === k ? ' p' : ''}" data-act="bgset" data-v="${k}" aria-pressed="${(b.bg || 'none') === k}">${t('bg_' + k)}</button>`).join('')}<label class="btn s">${t('co_upload')}<input class="vh" id="bg-up" type="file" accept="image/*" data-bgup></label></div>
 <p class="sub">${t('bg_note')}</p></div>`; })()}
 <div class="panel"><h2>${t('socic_t')}</h2>
 <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">${Object.keys(SOCIAL).map(k => { const has = !!(s.socIcons || {})[k]; return `<div class="socup"><span class="ico" aria-hidden="true">${socIcon(k)}</span><span class="sub" dir="ltr">${SOCIAL[k].n}</span><div class="row"><label class="btn s">${t('socic_up')}<input class="vh" id="si-${k}" type="file" accept="image/*" data-socicon="${k}"></label>${has ? `<button class="btn s d" data-act="socicondel" data-k="${k}">${t('b_del')}</button>` : ''}</div></div>`; }).join('')}</div>
 <p class="sub">${t('socic_note')}</p></div>
 <button class="btn d" data-act="reset" style="align-self:start">${t('b_reset')}</button>`;
};
