/* Canvas poster (the no-server fallback image), image URLs and reference-image helpers. */
const imgCache = new Map();
const loadImg = url => new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => no(new Error('image')); im.src = url; });

/* Draws the fallback poster. With a reference image it becomes the background under a dark layer. */
function drawPoster(o, bg) {
  const [w, h] = PLATS[o.platform].r, c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d'), s = (o.img && o.img.seed) || 1, kid = o.style === 'kids', m = Math.min(w, h) * .1;
  if (bg) {
    const k = Math.max(w / bg.width, h / bg.height);
    x.drawImage(bg, (w - bg.width * k) / 2, (h - bg.height * k) / 2, bg.width * k, bg.height * k);
    x.fillStyle = 'rgba(8,18,28,.55)'; x.fillRect(0, 0, w, h);
  } else {
    const pal = [['#8FD4F7', '#C9BBEE'], ['#BFE7FB', '#9BDCC8'], ['#D6CCF3', '#8CCDF3'], ['#A8E3D2', '#B9A9E6']][s % 4].slice();
    if (kid) { pal[0] = ['#FFD86B', '#8FE0C2', '#9AD4FF'][s % 3]; pal[1] = ['#FF9EC4', '#FFC27A', '#C7A6FF'][s % 3]; }
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, pal[0]); g.addColorStop(1, pal[1]);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(255,255,255,.28)';
    for (let i = 0; i < (kid ? 12 : 5); i++) { x.beginPath(); x.arc((s * 37 * (i + 1)) % w, (s * 61 * (i + 2)) % h, 40 + (s * (i + 3)) % 120, 0, 7); x.fill(); }
    x.fillStyle = 'rgba(255,255,255,.86)'; x.beginPath(); x.roundRect(m, h * .3, w - 2 * m, h * .4, 22); x.fill();
  }
  x.direction = 'rtl'; x.textAlign = 'center'; x.fillStyle = bg ? '#FFFFFF' : '#22384A';
  const fs = Math.round(w * .075);
  x.font = `700 ${fs}px Alexandria,"IBM Plex Sans Arabic",Tahoma,sans-serif`;
  const lines = []; let l = '';
  for (const wd of o.product.trim().split(/\s+/)) {
    const tr = l ? l + ' ' + wd : wd;
    if (x.measureText(tr).width > w - 2 * m - 40 && l) { lines.push(l); l = wd; } else l = tr;
  }
  lines.push(l);
  const ls = lines.slice(0, 3), y0 = h * .5 - (ls.length - 1) * fs * .7 - fs * .2;
  ls.forEach((tx, i) => x.fillText(tx, w / 2, y0 + i * fs * 1.4));
  x.font = `500 ${Math.round(fs * .42)}px "IBM Plex Sans Arabic",Tahoma,sans-serif`;
  x.fillStyle = bg ? 'rgba(255,255,255,.88)' : '#4A6276';
  x.fillText(ctaOf(o).replace(/[.。]$/, ''), w / 2, h * .7 - 18, w - 2 * m - 30);
  return c.toDataURL('image/jpeg', .85);
}

function imgURL(o) {
  if (!o || !o.img) return '';
  if (o.img.id && MEDIA.has(o.img.id)) return MEDIA.get(o.img.id);
  if (o.img.data) return o.img.data;
  const k = [o.product, o.platform, o.img.seed, o.goal, o.style, o.lang].join('|');
  if (!imgCache.has(k)) imgCache.set(k, drawPoster(o, null));
  return imgCache.get(k);
}
const vidURL = o => (o && o.vid && MEDIA.get(o.vid.id)) || '';
/* First frame of a video file as a JPEG data URL (the form image and video models accept). */
function videoFrame(blob, max = 1280) {
  return new Promise((ok, no) => {
    const url = URL.createObjectURL(blob), v = document.createElement('video');
    const done = (f, x) => { clearTimeout(timer); URL.revokeObjectURL(url); f(x); };
    const timer = setTimeout(() => done(no, new Error(t('e_frame'))), 10000);
    v.muted = true; v.playsInline = true; v.preload = 'auto';
    v.onloadeddata = () => { try { v.currentTime = Math.min(0.1, (v.duration || 1) / 2); } catch (e) { done(no, e); } };
    v.onseeked = () => {
      try {
        const k = Math.min(1, max / Math.max(v.videoWidth, v.videoHeight)), c = document.createElement('canvas');
        c.width = Math.round(v.videoWidth * k); c.height = Math.round(v.videoHeight * k);
        c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
        done(ok, c.toDataURL('image/jpeg', .86));
      } catch (e) { done(no, e); }
    };
    v.onerror = () => done(no, new Error(t('e_frame')));
    v.src = url;
  });
}

/* Reference uploads are downscaled so they stay small in storage and in API requests. */
async function shrinkFile(file, max = 1600) {
  try {
    const url = URL.createObjectURL(file), im = await loadImg(url); URL.revokeObjectURL(url);
    const k = Math.min(1, max / Math.max(im.width, im.height));
    if (k === 1 && file.size < 1500000) return file;
    const c = document.createElement('canvas');
    c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
    c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
    return await new Promise(ok => c.toBlob(b => ok(b || file), 'image/jpeg', .88));
  } catch (e) { return file; }
}
