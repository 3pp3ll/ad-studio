/* Cloudflare Worker proxy: the app calls this URL, the Worker adds the OpenRouter key
   from its environment and forwards the request. The key never reaches the browser. */
const UPSTREAM = 'https://openrouter.ai/api/v1';
const ALLOWED = [/^\/chat\/completions$/, /^\/videos(\/[\w-]+(\/content)?)?$/];

export default {
  async fetch(req, env) {
    const allow = env.ALLOWED_ORIGIN || '*', origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': allow,
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Vary': 'Origin'
    };
    const fail = (status, message) => new Response(JSON.stringify({ error: { message } }), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (allow !== '*' && origin !== allow) return fail(403, 'Origin not allowed');
    const url = new URL(req.url);
    if (!['GET', 'POST'].includes(req.method) || !ALLOWED.some(r => r.test(url.pathname))) return fail(404, 'Not found');
    if (!env.OPENROUTER_KEY) return fail(500, 'OPENROUTER_KEY is not set on the Worker');

    const up = await fetch(UPSTREAM + url.pathname + url.search, {
      method: req.method,
      headers: { 'Authorization': `Bearer ${env.OPENROUTER_KEY}`, 'Content-Type': 'application/json' },
      body: req.method === 'POST' ? req.body : undefined
    });
    const headers = new Headers(cors);
    headers.set('Content-Type', up.headers.get('Content-Type') || 'application/json');
    return new Response(up.body, { status: up.status, headers });
  }
};
