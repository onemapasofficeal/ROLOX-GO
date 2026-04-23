const BASE = "https://onemapasofficeal.github.io/html-roblox-comunides-games/";

// ── Carrega info do usuário ───────────────────────────
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  const tab = tabs[0];

  // Tenta pegar username do localStorage da aba ativa
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({
        username:    localStorage.getItem("rolox_username") || "",
        displayname: localStorage.getItem("rolox_displayname") || "",
        id:          localStorage.getItem("rolox_id") || ""
      })
    });
    const data = results?.[0]?.result;
    if (data?.username) {
      document.getElementById("userName").textContent = data.displayname || data.username;
      document.getElementById("userId").textContent   = "@" + data.username;
      // Avatar
      if (data.id && parseInt(data.id) > 0) {
        fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${data.id}&size=150x150&format=Png`)
          .then(r => r.json())
          .then(j => {
            const url = j.data?.[0]?.imageUrl;
            if (url) document.getElementById("avatarImg").src = url;
          }).catch(() => {});
      }
    } else {
      document.getElementById("userName").textContent = "Não logado";
    }
  } catch {
    document.getElementById("userName").textContent = "—";
  }
});

// ── Botão Home ────────────────────────────────────────
document.getElementById("btnHome").href = BASE + "home.html";

// ── Substituir ícones manualmente ────────────────────
document.getElementById("btnReplace").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
  document.getElementById("status").textContent = "✅ Ícones substituídos!";
  setTimeout(() => document.getElementById("status").textContent = "Rolox Extension v1.0.0", 2000);
});

// ── Toggle extensão ───────────────────────────────────
let enabled = true;
document.getElementById("btnToggle").addEventListener("click", () => {
  enabled = !enabled;
  document.getElementById("btnToggle").textContent = enabled ? "✅ Extensão ativa" : "⏸ Extensão pausada";
  chrome.storage.local.set({ rolox_enabled: enabled });
});

// Carrega estado
chrome.storage.local.get("rolox_enabled", (data) => {
  enabled = data.rolox_enabled !== false;
  document.getElementById("btnToggle").textContent = enabled ? "✅ Extensão ativa" : "⏸ Extensão pausada";
});
