function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function onRequest(context) {
  const { params, env } = context;
  const id = params.id;

  const paste = await env.PASTES.get(id);

  if (!paste) {
    return new Response("Not found", { status: 404, headers: { "Content-Type": "text/plain" } });
  }

  const data = JSON.parse(paste);

  const html = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(data.title)} - Kento raw</title>
    <style>
      :root {
        --bg: #090909;
        --panel: #111111;
        --panel-2: #171717;
        --text: #f5f5f5;
        --muted: #cfcfcf;
        --orange: #ff7a1a;
        --border: rgba(255,255,255,0.08);
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: Inter, "Segoe UI", sans-serif;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
        padding: 32px 20px 80px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0 24px;
        border-bottom: 1px solid var(--border);
      }
      .brand {
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .actions a {
        color: var(--orange);
        text-decoration: none;
        margin-left: 12px;
      }
      .content-box {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 22px;
        margin-top: 26px;
      }
      .title {
        margin: 0 0 10px;
        font-size: 1.8rem;
      }
      .meta {
        color: var(--muted);
        margin-bottom: 18px;
      }
      pre {
        margin: 0;
        background: var(--panel-2);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 18px;
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="header">
        <div class="brand">Kento raw</div>
        <div class="actions">
          <a href="/raw/${id}">Raw</a>
          <a href="/">New paste</a>
        </div>
      </div>

      <div class="content-box">
        <h1 class="title">${escapeHtml(data.title)}</h1>
        <div class="meta">Language: ${escapeHtml(data.language)} • ID: ${id}</div>
        <pre>${escapeHtml(data.content)}</pre>
      </div>
    </div>
  </body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}
