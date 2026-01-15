export async function onRequestPost({ request, env }) {
  const form = await request.formData();

  const data = {
    target_url: form.get("target_url"),
    title: form.get("title"),
    description: form.get("description"),
    image: form.get("image"),
  };

  // Simple ID (you can improve later)
  const id = crypto.randomUUID().slice(0, 8);

  await env.META_KV.put(id, JSON.stringify(data));

  return Response.redirect(
    new URL(`/success.html?id=${id}`, request.url),
    302
  );
}
