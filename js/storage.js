/* Media files (generated images, videos, reference images) live in IndexedDB.
   MEDIA maps id -> object URL for display; BLOBS maps id -> Blob for re-reading. */
let DB = null;
const MEDIA = new Map(), BLOBS = new Map();

const idb = () => new Promise((ok, no) => {
  try {
    const r = indexedDB.open('adhelper-media', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('m');
    r.onsuccess = () => ok(r.result);
    r.onerror = () => no(r.error);
  } catch (e) { no(e); }
});
const tx = (mode, fn) => new Promise((ok, no) => {
  if (!DB) return ok();
  try {
    const x = DB.transaction('m', mode); fn(x.objectStore('m'));
    x.oncomplete = () => ok(); x.onerror = x.onabort = () => no(x.error);
  } catch (e) { no(e); }
});
const remember = (id, b) => { BLOBS.set(id, b); MEDIA.set(id, URL.createObjectURL(b)); };

async function mput(id, b) {
  remember(id, b);
  if (!DB) { toast(t('m_no_persist'), 1); return; }
  try { await tx('readwrite', st => st.put(b, id)); } catch (e) { toast(t('m_save_fail'), 1); }
}
function mdel(id) {
  const u = MEDIA.get(id);
  if (u) { URL.revokeObjectURL(u); MEDIA.delete(id); }
  BLOBS.delete(id);
  tx('readwrite', st => st.delete(id)).catch(() => {});
}
function mclear() {
  MEDIA.forEach(u => URL.revokeObjectURL(u)); MEDIA.clear(); BLOBS.clear();
  tx('readwrite', st => st.clear()).catch(() => {});
}
async function mload() {
  try {
    DB = await idb();
    await tx('readonly', st => {
      st.openCursor().onsuccess = e => { const c = e.target.result; if (c) { remember(c.key, c.value); c.continue(); } };
    });
  } catch (e) { DB = null; }
}

const owned = id => S.ads.some(a => mediaIds(a).includes(id)) || (S.free || []).some(f => f.media.id === id);
/* Deletes a file once neither a saved ad nor the open draft uses it. */
const orphan = id => { if (id && !owned(id) && !mediaIds(S.draft).includes(id) && !(S.freeDraft && S.freeDraft.last && S.freeDraft.last.media.id === id)) mdel(id); };

async function toBlob(u) {
  if (!u.startsWith('data:')) return (await fetch(u)).blob();
  const i = u.indexOf(','), mime = (u.slice(0, i).match(/:(.*?)(;|$)/) || [])[1] || 'image/png';
  const bin = atob(u.slice(i + 1)), arr = new Uint8Array(bin.length);
  for (let k = 0; k < bin.length; k++) arr[k] = bin.charCodeAt(k);
  return new Blob([arr], { type: mime });
}
const blobToDataURL = b => new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = () => no(r.error); r.readAsDataURL(b); });

/* An attachment as an image data URL: the image itself, or the first frame of a video.
   Kept in memory only (save() strips dataURL) and rebuilt from the stored file when needed. */
async function refData(ref) {
  if (!ref.dataURL) {
    const b = BLOBS.get(ref.id);
    if (!b) throw new Error(t('e_ref_missing'));
    ref.dataURL = ref.kind === 'vid' ? await videoFrame(b) : await blobToDataURL(b);
  }
  return ref.dataURL;
}
