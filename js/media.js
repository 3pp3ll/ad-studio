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

/* ---------- free design: the logo watermark ---------- */
const wmLogo = () => loadImg(logoSrc(co().logo));
/* Logo in the bottom corner, about 11% of the short side, with a soft shadow so it reads on light and dark pictures. */
function drawMark(x, w, h, lg) {
  const s = Math.round(Math.min(w, h) * .11), m = Math.round(Math.min(w, h) * .035), k = s / Math.max(lg.width, lg.height);
  x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = Math.max(2, s * .1); x.globalAlpha = .92;
  x.drawImage(lg, w - m - lg.width * k, h - m - lg.height * k, lg.width * k, lg.height * k); x.restore();
}
async function markImage(blob) {
  const lg = await wmLogo(), url = URL.createObjectURL(blob);
  try {
    const im = await loadImg(url), c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
    const x = c.getContext('2d'); x.drawImage(im, 0, 0); drawMark(x, c.width, c.height, lg);
    return await new Promise(ok => c.toBlob(ok, 'image/jpeg', .92));
  } finally { URL.revokeObjectURL(url); }
}
/* Re-records the clip through a canvas with the logo on top. Plays muted; the sound is taken from the element's own stream where the browser offers one. */
async function markVideo(blob, onStatus) {
  const type = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find(m => window.MediaRecorder && MediaRecorder.isTypeSupported(m));
  if (!type || !HTMLCanvasElement.prototype.captureStream) throw new Error('unsupported');
  const lg = await wmLogo(), url = URL.createObjectURL(blob), v = document.createElement('video');
  v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = url;
  try {
    await new Promise((ok, no) => { v.onloadeddata = ok; v.onerror = () => no(new Error('load')); });
    const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight;
    const x = c.getContext('2d'), draw = () => { x.drawImage(v, 0, 0, c.width, c.height); drawMark(x, c.width, c.height, lg); };
    const src = v.captureStream ? v.captureStream() : v.mozCaptureStream ? v.mozCaptureStream() : null;
    /* Start once so the element's tracks exist, then rewind and record from the first frame. */
    await v.play(); v.pause(); v.currentTime = 0; await new Promise(ok => { v.onseeked = ok; });
    draw();
    const out = new MediaStream([...c.captureStream(30).getVideoTracks(), ...(src ? src.getAudioTracks() : [])]);
    const rec = new MediaRecorder(out, { mimeType: type, videoBitsPerSecond: 6e6 }), parts = [];
    rec.ondataavailable = e => { if (e.data.size) parts.push(e.data); };
    const done = new Promise(ok => { rec.onstop = ok; });
    let on = true;
    const loop = () => { if (!on) return; draw(); v.requestVideoFrameCallback ? v.requestVideoFrameCallback(loop) : requestAnimationFrame(loop); };
    rec.start(500); await v.play(); loop();
    const total = v.duration || 15, tick = setInterval(() => onStatus && onStatus(Math.min(99, Math.round(100 * v.currentTime / total))), 500);
    await new Promise((ok, no) => { v.onended = ok; setTimeout(() => no(new Error('timeout')), (total * 3 + 15) * 1000); });
    on = false; clearInterval(tick); draw(); rec.stop(); await done;
    return new Blob(parts, { type: type.split(';')[0] });
  } finally { v.pause(); v.removeAttribute('src'); URL.revokeObjectURL(url); }
}
/* Without the OpenRouter link: a plain brand card carrying the description, for trying the page. */
function freePoster(text) {
  const c = document.createElement('canvas'), W = 1080; c.width = c.height = W;
  const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, W, W), b = S.settings.brand || {};
  g.addColorStop(0, b.primary || '#1b8fbf'); g.addColorStop(1, b.accent || '#f26a0f');
  x.fillStyle = g; x.fillRect(0, 0, W, W);
  const ar = /[؀-ۿ]/.test(text); x.direction = ar ? 'rtl' : 'ltr'; x.textAlign = 'center'; x.fillStyle = '#fff';
  x.font = '600 58px "IBM Plex Sans Arabic", Tahoma, sans-serif';
  const words = text.split(/\s+/), lines = []; let ln = '';
  for (const w of words) { const tl = ln ? ln + ' ' + w : w; if (x.measureText(tl).width > W * .78 && ln) { lines.push(ln); ln = w; } else ln = tl; }
  if (ln) lines.push(ln);
  const shown = lines.slice(0, 8), lh = 84, y0 = W / 2 - (shown.length - 1) * lh / 2;
  shown.forEach((l, i) => x.fillText(i === 7 && lines.length > 8 ? l + '…' : l, W / 2, y0 + i * lh + 20));
  return c.toDataURL('image/png');
}
