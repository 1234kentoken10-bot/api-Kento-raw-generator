export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json();
    const title = String(body.title || "untitled");
    const content = String(body.content || "");
    const language = String(body.language || "txt");

    if (!content.trim()) {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
    const now = Date.now();

    await env.PASTES.put(
      id,
      JSON.stringify({
        id,
        title,
        language,
        content,
        createdAt: now
      }),
      {
        metadata: { createdAt: now }
      }
    );

    const origin = new URL(request.url).origin;
    const viewUrl = `${origin}/p/${id}`;
    const rawUrl = `${origin}/raw/${id}`;

    return new Response(JSON.stringify({ id, viewUrl, rawUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}
