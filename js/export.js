/* Exports built in the browser: ZIP package, PowerPoint file, and invoices. */

/* ---------- ZIP (stored, no compression) ---------- */
const CRC_T = (() => { const tb = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; tb[n] = c >>> 0; } return tb; })();
const crc32 = u8 => { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = CRC_T[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
/* files: [{ name, data: Uint8Array | string }] */
function zipBlob(files, type = 'application/zip') {
  const parts = [], central = []; let off = 0;
  const now = new Date(), dt = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate(), tm = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  for (const f of files) {
    const data = typeof f.data === 'string' ? enc.encode(f.data) : f.data, name = enc.encode(f.name), crc = crc32(data);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(10, tm, true); h.setUint16(12, dt, true);
    h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true);
    parts.push(h.buffer, name, data);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(12, tm, true); c.setUint16(14, dt, true);
    c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true); c.setUint32(42, off, true);
    central.push(c.buffer, name);
    off += 30 + name.length + data.length;
  }
  const csize = central.reduce((n, p) => n + p.byteLength, 0), e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, csize, true); e.setUint32(16, off, true);
  return new Blob([...parts, ...central, e.buffer], { type });
}
/* Saves a file to the device. Inside an embedded preview downloads are blocked, so it only explains. */
function dl(blob, name) {
  if (inFrame) { toast(t('m_dl_frame'), 1); return false; }
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  return true;
}

/* ---------- an ad's full content ---------- */
const vidExt = b => /webm/.test(b.type) ? 'webm' : /quicktime/.test(b.type) ? 'mov' : 'mp4';
async function toJpeg(url, max = 1920) {
  const im = await loadImg(url), k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas');
  c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
  const b = await new Promise(ok => c.toBlob(ok, 'image/jpeg', .9));
  return { u8: new Uint8Array(await b.arrayBuffer()), w: c.width, h: c.height };
}
/* Every image (as JPEG) and video that belongs to the ad, each file once. */
async function adAssets(a) {
  const imgs = [], vids = [], seen = new Set();
  const addImg = async (url, name, label) => { try { imgs.push({ name, label, ...(await toJpeg(url)) }); } catch (e) {} };
  const addVid = async (id, name, label) => { const b = BLOBS.get(id); if (b) vids.push({ name: name + '.' + vidExt(b), label, u8: new Uint8Array(await b.arrayBuffer()) }); };
  if (a.img) { if (a.img.id) seen.add(a.img.id); await addImg(imgURL(a), 'ad-image.jpg', t('x_img')); }
  if (a.vid && a.vid.id) { seen.add(a.vid.id); await addVid(a.vid.id, 'ad-video', t('x_vid')); }
  let n = 0;
  for (const r of a.refs || []) { if (seen.has(r.id) || !MEDIA.get(r.id)) continue; seen.add(r.id); n++; if (r.kind === 'vid') await addVid(r.id, 'attachment-' + n, t('ref_label') + ' ' + n); else await addImg(MEDIA.get(r.id), `attachment-${n}.jpg`, t('ref_label') + ' ' + n); }
  n = 0;
  for (const s of (a.scenes && a.scenes.items) || []) { n++; if (seen.has(s.id) || !MEDIA.get(s.id)) continue; seen.add(s.id); if (s.kind === 'vid') await addVid(s.id, 'scene-' + n, t('sc_clip') + ' ' + n); else await addImg(MEDIA.get(s.id), `scene-${n}.jpg`, t('sc_image') + ' ' + n); }
  return { imgs, vids };
}
function adText(a) {
  const L1 = [t('f_product') + ': ' + a.product, t('f_audience') + ': ' + a.audience, t('f_platform') + ': ' + t('plat_' + a.platform), t('f_style') + ': ' + t('style_' + a.style), t('f_date') + ': ' + fdate(a.date), '', '== ' + t('sec_text') + ' ==', a.text];
  if (a.variants && a.variants.length) L1.push('', '== ' + t('sec_variants') + ' ==', ...a.variants.map(v => `[${t('style_' + v.s)}] ${v.t}`));
  if (a.titles && a.titles.length) L1.push('', '== ' + t('sec_titles') + ' ==', ...a.titles);
  if (a.tags && a.tags.length) L1.push('', '== ' + t('sec_tags') + ' ==', a.tags.join(' '));
  if (a.scenes) { L1.push('', '== ' + t('nav_scenes') + ' ==', ...a.scenes.items.map((s, i) => `${i + 1}. ${s.dur}s ${s.cap || ''}`)); if (a.scenes.script) L1.push('', t('f_script') + ':', a.scenes.script); }
  return L1.join('\r\n');
}
async function exportZip(a) {
  const { imgs, vids } = await adAssets(a);
  return dl(zipBlob([{ name: 'ad.txt', data: '﻿' + adText(a) }, ...imgs.map(f => ({ name: f.name, data: f.u8 })), ...vids.map(f => ({ name: f.name, data: f.u8 }))]), `ad-${a.id}.zip`);
}

/* ---------- PowerPoint (.pptx is a ZIP of XML parts) ---------- */
const xe = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
const NS = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';
const XH = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n', RT = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/', CT = 'application/vnd.openxmlformats-officedocument.';
const rels = list => XH + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${list.map(([id, type, target]) => `<Relationship Id="${id}" Type="${RT}${type}" Target="${target}"/>`).join('')}</Relationships>`;
const GRP = '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>';
const SW = 12192000, SH = 6858000;
function pptxText(id, x, y, cx, cy, text, sz, bold, rtl, color = '2E3947') {
  const paras = String(text || '').split(/\r?\n/).map(l => `<a:p><a:pPr algn="${rtl ? 'r' : 'l'}" rtl="${rtl ? 1 : 0}"/><a:r><a:rPr lang="${rtl ? 'ar-SA' : 'en-US'}" sz="${sz}" b="${bold ? 1 : 0}"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="Arial"/><a:cs typeface="Arial"/></a:rPr><a:t>${xe(l)}</a:t></a:r></a:p>`).join('');
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="Text ${id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr><p:txBody><a:bodyPr wrap="square" rtlCol="${rtl ? 1 : 0}" anchor="t"><a:normAutofit/></a:bodyPr><a:lstStyle/>${paras}</p:txBody></p:sp>`;
}
function pptxPic(id, rid, w, h) {
  const bw = SW - 1400000, bh = SH - 1900000, k = Math.min(bw / w, bh / h), cx = Math.round(w * k), cy = Math.round(h * k);
  return `<p:pic><p:nvPicPr><p:cNvPr id="${id}" name="Picture ${id}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="${Math.round((SW - cx) / 2)}" y="${1500000 + Math.round((bh - cy) / 2)}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>`;
}
const THEME = XH + `<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Studio"><a:themeElements><a:clrScheme name="Studio"><a:dk1><a:srgbClr val="2E3947"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="0F6FA8"/></a:dk2><a:lt2><a:srgbClr val="F4F7FA"/></a:lt2><a:accent1><a:srgbClr val="56B9F0"/></a:accent1><a:accent2><a:srgbClr val="B8A9E3"/></a:accent2><a:accent3><a:srgbClr val="3FBF9A"/></a:accent3><a:accent4><a:srgbClr val="D9686B"/></a:accent4><a:accent5><a:srgbClr val="6753AE"/></a:accent5><a:accent6><a:srgbClr val="687588"/></a:accent6><a:hlink><a:srgbClr val="0F6FA8"/></a:hlink><a:folHlink><a:srgbClr val="6753AE"/></a:folHlink></a:clrScheme><a:fontScheme name="Studio"><a:majorFont><a:latin typeface="Arial"/><a:ea typeface=""/><a:cs typeface="Arial"/></a:majorFont><a:minorFont><a:latin typeface="Arial"/><a:ea typeface=""/><a:cs typeface="Arial"/></a:minorFont></a:fontScheme><a:fmtScheme name="Studio"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="12700"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="19050"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>`;
const MASTER = XH + `<p:sldMaster ${NS}><p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree>${GRP}</p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>`;
const LAYOUT = XH + `<p:sldLayout ${NS} type="blank" preserve="1"><p:cSld name="Blank"><p:spTree>${GRP}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`;

/* Slides: cover, ad text, headlines/hashtags/variants, then one slide per image. Videos are listed, not embedded. */
async function exportPptx(a) {
  const { imgs, vids } = await adAssets(a), rtl = lg(a) === 'ar', slides = [];
  const head = title => pptxText(2, 700000, 420000, SW - 1400000, 900000, title, 2800, true, L() === 'ar', '0F6FA8');
  slides.push({ xml: pptxText(2, 700000, 2100000, SW - 1400000, 1500000, a.product, 4800, true, rtl) + pptxText(3, 700000, 3700000, SW - 1400000, 900000, [t('plat_' + a.platform), t('style_' + a.style), fdate(a.date)].join(' · '), 2000, false, L() === 'ar', '687588') + pptxText(4, 700000, 5700000, SW - 1400000, 500000, appName(), 1400, false, L() === 'ar', '687588') });
  slides.push({ xml: head(t('sec_text')) + pptxText(3, 700000, 1500000, SW - 1400000, 4700000, a.text, 2400, false, rtl) });
  const extra = [];
  if (a.titles && a.titles.length) extra.push(t('sec_titles') + ':', ...a.titles.map(x => '• ' + x), '');
  if (a.tags && a.tags.length) extra.push(t('sec_tags') + ':', a.tags.join(' '), '');
  if (extra.length) slides.push({ xml: head(t('sec_titles') + ' · ' + t('sec_tags')) + pptxText(3, 700000, 1500000, SW - 1400000, 4700000, extra.join('\n'), 2000, false, rtl) });
  if (a.variants && a.variants.length) slides.push({ xml: head(t('sec_variants')) + pptxText(3, 700000, 1500000, SW - 1400000, 4700000, a.variants.map(v => `${t('style_' + v.s)}: ${v.t}`).join('\n\n'), 1800, false, rtl) });
  if (a.scenes && (a.scenes.items.length || a.scenes.script)) slides.push({ xml: head(t('nav_scenes')) + pptxText(3, 700000, 1500000, SW - 1400000, 4700000, [...a.scenes.items.map((s, i) => `${i + 1}. ${t('n_sec', { n: s.dur })}${s.cap ? ' · ' + s.cap : ''}`), ...(a.scenes.script ? ['', t('f_script') + ':', a.scenes.script] : [])].join('\n'), 1800, false, L() === 'ar') });
  imgs.forEach((im, i) => slides.push({ xml: head(im.label) + pptxPic(3, 'rId2', im.w, im.h), img: i }));
  if (vids.length) slides.push({ xml: head(t('x_vids')) + pptxText(3, 700000, 1500000, SW - 1400000, 4700000, [t('x_vids_note'), '', ...vids.map(v => '• ' + v.label + ' (' + v.name + ')')].join('\n'), 2000, false, L() === 'ar') });

  const files = [
    { name: '[Content_Types].xml', data: XH + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/ppt/presentation.xml" ContentType="${CT}presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="${CT}presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="${CT}presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="${CT}theme+xml"/>${slides.map((s, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="${CT}presentationml.slide+xml"/>`).join('')}</Types>` },
    { name: '_rels/.rels', data: rels([['rId1', 'officeDocument', 'ppt/presentation.xml']]) },
    { name: 'ppt/presentation.xml', data: XH + `<p:presentation ${NS}><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>${slides.map((s, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 3}"/>`).join('')}</p:sldIdLst><p:sldSz cx="${SW}" cy="${SH}"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>` },
    { name: 'ppt/_rels/presentation.xml.rels', data: rels([['rId1', 'slideMaster', 'slideMasters/slideMaster1.xml'], ['rId2', 'theme', 'theme/theme1.xml'], ...slides.map((s, i) => ['rId' + (i + 3), 'slide', `slides/slide${i + 1}.xml`])]) },
    { name: 'ppt/theme/theme1.xml', data: THEME },
    { name: 'ppt/slideMasters/slideMaster1.xml', data: MASTER },
    { name: 'ppt/slideMasters/_rels/slideMaster1.xml.rels', data: rels([['rId1', 'slideLayout', '../slideLayouts/slideLayout1.xml'], ['rId2', 'theme', '../theme/theme1.xml']]) },
    { name: 'ppt/slideLayouts/slideLayout1.xml', data: LAYOUT },
    { name: 'ppt/slideLayouts/_rels/slideLayout1.xml.rels', data: rels([['rId1', 'slideMaster', '../slideMasters/slideMaster1.xml']]) }
  ];
  slides.forEach((s, i) => {
    files.push({ name: `ppt/slides/slide${i + 1}.xml`, data: XH + `<p:sld ${NS}><p:cSld><p:spTree>${GRP}${s.xml}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>` });
    files.push({ name: `ppt/slides/_rels/slide${i + 1}.xml.rels`, data: rels([['rId1', 'slideLayout', '../slideLayouts/slideLayout1.xml'], ...(s.img != null ? [['rId2', 'image', `../media/image${s.img + 1}.jpeg`]] : [])]) });
  });
  imgs.forEach((im, i) => files.push({ name: `ppt/media/image${i + 1}.jpeg`, data: im.u8 }));
  return dl(zipBlob(files, CT + 'presentationml.presentation'), `ad-${a.id}.pptx`);
}

/* ---------- add-on cart and invoices ---------- */
let CART = {}, LASTINV = null;
/* pack: the input is a number of bundles. unit: the input is the amount itself, priced per step. */
function cartLine(a) {
  const v = Math.max(0, +CART[a.id] || 0), unit = a.mode === 'unit', step = Math.max(1, +a.amount || 1);
  const packs = unit ? Math.ceil(v / step) : Math.floor(v);
  return { packs, amount: unit ? packs * step : packs * step, total: packs * (+a.price || 0) };
}
const cartTotal = () => S.addons.filter(a => a.active).reduce((n, a) => n + cartLine(a).total, 0);
function mkInvoice(u, items) {
  S.invSeq = (S.invSeq || 0) + 1; S.invoices = S.invoices || [];
  const inv = { id: rid('IN'), no: 'INV-' + String(S.invSeq).padStart(5, '0'), uid: u.id, name: u.name, email: u.email, date: new Date().toISOString(), items, total: items.reduce((n, i) => n + i.total, 0), sim: !S.settings.stripeLive };
  S.invoices.unshift(inv); LASTINV = inv.id;
  return inv;
}
const invoiceBody = inv => `<div class="inv"><div class="row" style="justify-content:space-between"><b>${esc(appName())}</b><span dir="ltr">${inv.no}</span></div>
 <div class="sub">${fdate(inv.date)} · ${esc(inv.name)} · <span dir="ltr">${esc(inv.email)}</span></div>
 ${inv.items.map(i => `<div class="kv"><span>${esc(i.name)}${i.detail ? ` <span class="sub">${esc(i.detail)}</span>` : ''}</span><b>${sar(i.total)}</b></div>`).join('')}
 <div class="kv total"><span>${t('inv_total')}</span><b>${sar(inv.total)}</b></div>
 <p class="sub">${t('inv_sim')}</p></div>`;
function invoiceFile(inv) {
  const css = 'body{font-family:Tahoma,Arial,sans-serif;max-width:640px;margin:40px auto;padding:0 20px;color:#2e3947;line-height:1.8}.row{display:flex;justify-content:space-between;gap:12px;font-size:1.2rem}.kv{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #e1e7ee}.total{font-size:1.15rem;border-bottom:0}.sub{color:#687588;font-size:.9rem}';
  return new Blob([`<!DOCTYPE html><html lang="${L()}" dir="${L() === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="UTF-8"><title>${inv.no}</title><style>${css}</style></head><body>${invoiceBody(inv)}</body></html>`], { type: 'text/html' });
}
