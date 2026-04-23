// ── Rolox Content Script ──────────────────────────────
// Substitui ícones e favicon do Roblox pelo logo do Rolox
// e adiciona botão "Abrir no Rolox" nas páginas de jogos.

const ROLOX_ICON = chrome.runtime.getURL("icons/roblox-rolox.png");
const ROLOX_BASE = "https://onemapasofficeal.github.io/html-roblox-comunides-games/";

// ── 1. Substitui favicon ─────────────────────────────
function replaceFavicon() {
  const links = document.querySelectorAll("link[rel*='icon']");
  links.forEach(l => { l.href = ROLOX_ICON; });

  // Cria se não existir
  if (links.length === 0) {
    const link = document.createElement("link");
    link.rel  = "icon";
    link.href = ROLOX_ICON;
    document.head.appendChild(link);
  }
}

// ── 2. Substitui logo do Roblox na navbar ────────────
function replaceLogo() {
  // Logo principal (SVG ou img com "roblox" no src/alt)
  document.querySelectorAll("img").forEach(img => {
    const src = (img.src || "").toLowerCase();
    const alt = (img.alt || "").toLowerCase();
    if (src.includes("roblox-logo") || alt === "roblox" || src.includes("logo")) {
      img.src   = ROLOX_ICON;
      img.style.objectFit = "contain";
    }
  });

  // SVG logos
  document.querySelectorAll("svg[aria-label='Roblox'], svg.logo").forEach(svg => {
    const img = document.createElement("img");
    img.src    = ROLOX_ICON;
    img.width  = 32;
    img.height = 32;
    img.style.objectFit = "contain";
    svg.replaceWith(img);
  });
}

// ── 3. Adiciona botão "Abrir no Rolox" nas páginas de jogo ──
function addRoloxButton() {
  // Página de jogo: /games/PLACEID
  const match = window.location.pathname.match(/\/games\/(\d+)/);
  if (!match) return;

  const placeId = match[1];
  const gameName = document.title.replace(" - Roblox", "").trim();

  // Evita duplicar
  if (document.getElementById("rolox-btn")) return;

  // Encontra o botão "Jogar" do Roblox
  const playBtn = document.querySelector("[data-testid='game-detail-play-btn'], .btn-primary-md, button[class*='play']");
  if (!playBtn) return;

  const btn = document.createElement("a");
  btn.id   = "rolox-btn";
  btn.href = `${ROLOX_BASE}?name_app=${encodeURIComponent(gameName)}&id_map=${placeId}&name_username=${encodeURIComponent(getRoloxUser())}&data_and_horario=${Date.now()}`;
  btn.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #00a2ff;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    padding: 8px 18px;
    border-radius: 6px;
    text-decoration: none;
    margin-left: 8px;
    cursor: pointer;
    vertical-align: middle;
  `;
  btn.innerHTML = `<img src="${ROLOX_ICON}" width="18" height="18" style="border-radius:3px"/> Abrir no Rolox`;
  btn.title = "Abrir este jogo no Rolox";

  playBtn.parentNode?.insertBefore(btn, playBtn.nextSibling);
}

// ── 4. Adiciona badge "Rolox" no título da página ────
function addTitleBadge() {
  if (!document.title.includes("[Rolox]"))
    document.title = "[Rolox] " + document.title;
}

// ── 5. Helper: pega username salvo ───────────────────
function getRoloxUser() {
  return localStorage.getItem("rolox_username") || "";
}

// ── Executa ──────────────────────────────────────────
function run() {
  replaceFavicon();
  replaceLogo();
  addRoloxButton();
  addTitleBadge();
}

run();

// Observer para SPAs (Roblox usa React)
const observer = new MutationObserver(() => {
  replaceLogo();
  addRoloxButton();
});
observer.observe(document.body, { childList: true, subtree: true });
