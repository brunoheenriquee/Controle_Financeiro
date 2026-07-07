export default {
  async fetch(request, env, ctx) {
    try {
      if (!env || !env.__STATIC_CONTENT) {
        return new Response(JSON.stringify({ error: 'Static assets not bound', detail: 'env.__STATIC_CONTENT is not defined. Ensure site bucket is populated and wrangler.toml has site.bucket set to ./dist and that dist was created during build.' }), {
          status: 500,
          headers: { 'content-type': 'application/json' }
        });
      }

      // Delegate to the built-in static assets binding
      return env.__STATIC_CONTENT.fetch(request);
    } catch (err) {
      const body = {
        error: 'Worker exception',
        message: err && err.message ? err.message : String(err),
        hint: 'Check that the site was built (npm run build) and dist/ is present, and that wrangler.toml site.bucket points to ./dist.'
      };
      return new Response(JSON.stringify(body), { status: 500, headers: { 'content-type': 'application/json' } });
    }
  }
};
