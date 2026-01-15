export async function onRequest({ params, request, env }) {
  const id = params.id;
  const raw = await env.META_KV.get(id);

  if (!raw) {
    return new Response("Not found", { status: 404 });
  }

  const data = JSON.parse(raw);
  const ua = request.headers.get("user-agent") || "";

  const isBot = /facebookexternalhit|twitterbot|slackbot|discordbot|whatsapp|telegram|WhatsApp/i.test(ua);

  // Serve metadata to bots
  if (isBot) {
    return new Response(`
<!doctype html>
<html>
<head>
  <title>${escape(data.title)}</title>

  <meta property="og:title" content="${escape(data.title)}">
  <meta property="og:description" content="${escape(data.description)}">
  <meta property="og:image" content="${data.image}">
  <meta property="og:image:secure_url" content="${data.image}">
  <meta property="og:url" content="${request.url}">
  <meta property="og:type" content="article">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(data.title)}">
  <meta name="twitter:description" content="${escape(data.description)}">
  <meta name="twitter:image" content="${data.image}">
</head>
<body>
  <p>Loading…</p>
</body>
</html>
    `, {
      headers: { "content-type": "text/html" }
    });
  }

  // Humans → redirect
  return Response.redirect(data.target_url, 302);
}

function escape(str = "") {
  return str.replace(/[&<>"']/g, s =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s])
  );
}


