const titleInput = document.getElementById("title");
const languageInput = document.getElementById("language");
const contentInput = document.getElementById("content");
const createBtn = document.getElementById("createBtn");
const clearBtn = document.getElementById("clearBtn");
const statusEl = document.getElementById("status");
const viewUrlInput = document.getElementById("viewUrl");
const rawUrlInput = document.getElementById("rawUrl");
const openView = document.getElementById("openView");
const openRaw = document.getElementById("openRaw");

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.style.color = isError ? "#ff7a7a" : "#ff9f52";
}

async function createPaste() {
  const title = titleInput.value.trim() || "untitled";
  const content = contentInput.value;
  const language = languageInput.value;

  if (!content.trim()) {
    setStatus("Please enter some content", true);
    return;
  }

  setStatus("Creating...");
  
  try {
    const res = await fetch("/api/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, language })
    });

    if (!res.ok) {
      throw new Error("Failed to create paste");
    }

    const data = await res.json();

    viewUrlInput.value = data.viewUrl;
    rawUrlInput.value = data.rawUrl;
    openView.href = data.viewUrl;
    openRaw.href = data.rawUrl;

    setStatus("Paste created");
  } catch (error) {
    console.error(error);
    setStatus("Create failed", true);
  }
}

clearBtn.addEventListener("click", () => {
  titleInput.value = "";
  contentInput.value = "";
  languageInput.value = "txt";
  setStatus("Ready");
});

createBtn.addEventListener("click", createPaste);

document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const target = document.getElementById(btn.dataset.copy);
    if (!target.value) return;

    try {
      await navigator.clipboard.writeText(target.value);
      setStatus("Copied");
    } catch {
      setStatus("Copy failed", true);
    }
  });
});
