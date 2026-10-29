export async function onRequest(context) {
  const { params, env } = context;
  const id = params.id;

  const paste = await env.PASTES.get(id);

  if (!paste) {
    return new Response("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const data = JSON.parse(paste);

  return new Response(data.content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
