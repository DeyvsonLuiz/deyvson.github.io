/* =========================
   CONFIG
   ========================= */
const MIN_PLAYERS = 3;
const MAX_PLAYERS = 6;
const STORAGE_KEY = "players_state_v1";

/* =========================
   HELPERS
   ========================= */
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBg() {
    // cor agradável (HSL)
    const h = randInt(0, 360);
    const s = randInt(65, 85);
    const l = randInt(55, 70);
    return `hsl(${h} ${s}% ${l}%)`;
}

function uid() {
    return `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function savePlayers(players) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

function loadPlayers() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) return null;
        return data;
    } catch {
        return null;
    }
}

function createPlayerDefault(index) {
    return {
        id: uid(),
        name: `JOGADOR ${index + 1}`,
        gender: index % 2 === 0 ? "M" : "F", // alterna só para variar
        bg: randomBg(),
        nivel: 1,
        bonus: 1,
        penalty: 0,       // 0 ou negativo
        buffNote: "",
        debuffNote: ""
    };
}

/* =========================
   STATE
   ========================= */
let players = loadPlayers();

if (!players || players.length < MIN_PLAYERS) {
    players = Array.from({ length: MIN_PLAYERS }, (_, i) => createPlayerDefault(i));
    savePlayers(players);
}

// garante limites
if (players.length > MAX_PLAYERS) {
    players = players.slice(0, MAX_PLAYERS);
    savePlayers(players);
}

/* =========================
   DOM
   ========================= */
const playersContainer = document.getElementById("playersContainer");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const playersInfo = document.getElementById("playersInfo");

/* Modal */
const overlay = document.getElementById("overlay");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const modalBack = document.getElementById("modalBack");

let modalPlayerId = null;
let modalType = null; // "buff" | "debuff"

/* =========================
   RENDER
   ========================= */
function updateTopbar() {
    playersInfo.textContent = `${players.length}/${MAX_PLAYERS} jogadores`;
    addPlayerBtn.disabled = players.length >= MAX_PLAYERS;
}

function totalOf(p) {
    return p.nivel + p.bonus + p.penalty;
}

function render() {
    updateTopbar();

    playersContainer.innerHTML = players.map(p => {
        const total = totalOf(p);
        const totalPulse = p.penalty < 0 ? "danger-pulse" : "";

        const genderIcon = p.gender === "M" ? "fa-mars" : "fa-venus";

        // esconder X se estiver no mínimo
        const canRemove = players.length > MIN_PLAYERS;
        const closeStyle = canRemove ? "" : "style=\"visibility:hidden\"";

        return `
        <div class="card" data-player-id="${p.id}" style="--card-bg:${p.bg}">
            <div class="left-box">
                <div class="name" data-action="edit-name">${p.name}</div>
                <button class="gender" type="button" data-action="toggle-gender" aria-label="Alternar gênero">
                    <i class="fa-solid ${genderIcon}"></i>
                </button>
            </div>

            <div class="center-box">
    <div class="stats-fixed">

        <!-- NÍVEL -->
        <div class="stat-vertical">
            <div class="stat-title">NÍVEL</div>
            <div class="stat-value" data-role="nivel-value">${p.nivel}</div>
            <div class="stat-controls">
                <button type="button" data-action="nivel-plus">+</button>
                <button type="button" data-action="nivel-minus">−</button>
            </div>
        </div>

        <!-- BÔNUS -->
        <div class="stat-vertical">
            <div class="stat-title">BÔNUS</div>
            <div class="stat-value" data-role="bonus-value">${p.bonus}</div>
            <div class="stat-controls">
                <button type="button" data-action="bonus-plus">+</button>
                <button type="button" data-action="bonus-minus">−</button>
            </div>
        </div>

        <!-- TOTAL -->
        <div class="stat-vertical total">
            <div class="stat-title">TOTAL</div>
            <div class="stat-value ${totalPulse}" data-role="total-value">${total}</div>
        </div>

    </div>

    <div class="buff-row">
        <button type="button" class="buff-btn" data-action="open-buff">BUFF</button>
        <button type="button" class="buff-btn" data-action="open-debuff">DEBUFF</button>
    </div>
</div>


            <div class="right-box">
                <button class="close" type="button" data-action="remove-player" aria-label="Remover jogador" ${closeStyle}>✕</button>

                <!-- BATALHA OCULTA POR ENQUANTO -->
                <button class="battle" type="button" aria-label="Batalha">
                    <i class="fa-solid fa-swords"></i>
                    <span>BATALHA</span>
                </button>
            </div>
        </div>
        `;
    }).join("");
}

render();

/* =========================
   PLAYER MUTATIONS
   ========================= */
function findPlayer(id) {
    return players.find(p => p.id === id);
}

function persistAndRerender() {
    savePlayers(players);
    render();
}

function addPlayer() {
    if (players.length >= MAX_PLAYERS) return;
    players.push(createPlayerDefault(players.length));
    persistAndRerender();
}

function removePlayer(id) {
    if (players.length <= MIN_PLAYERS) return;

    const p = findPlayer(id);
    if (!p) return;

    const ok = window.confirm(`Deseja realmente remover ${p.name}?`);
    if (!ok) return;

    players = players.filter(x => x.id !== id);

    // garante mínimo (segurança)
    while (players.length < MIN_PLAYERS) {
        players.push(createPlayerDefault(players.length));
    }

    persistAndRerender();
}

/* =========================
   NAME EDIT (INLINE)
   ========================= */
function startEditName(cardEl, player) {
    const nameEl = cardEl.querySelector(".name");
    if (!nameEl) return;

    const input = document.createElement("input");
    input.className = "name-input";
    input.value = player.name;

    // substitui visualmente
    nameEl.replaceWith(input);
    input.focus();
    input.select();

    function commit() {
        const newName = input.value.trim() || player.name;
        player.name = newName;
        persistAndRerender();
    }

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") persistAndRerender();
    });

    input.addEventListener("blur", commit);
}

/* =========================
   MODAL (BUFF/DEBUFF)
   ========================= */
function openOverlay() {
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
}

function closeOverlay() {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    modalPlayerId = null;
    modalType = null;
}

function renderBuffModal(p) {
    modalTitle.textContent = `BUFF - ${p.name}`;
    modalBody.innerHTML = `
        <textarea class="note-area" id="buffNote"
            placeholder="Digite aqui seus BUFFs... (não será perdido até você apagar)"></textarea>
    `;

    const textarea = document.getElementById("buffNote");
    textarea.value = p.buffNote || "";

    textarea.addEventListener("input", () => {
        p.buffNote = textarea.value;
        savePlayers(players);
    });

    setTimeout(() => textarea.focus(), 0);
}

function renderDebuffModal(p) {
    modalTitle.textContent = `DEBUFF - ${p.name}`;
    modalBody.innerHTML = `
        <textarea class="note-area" id="debuffNote"
            placeholder="Digite aqui seus DEBUFFs... (não será perdido até você apagar)"></textarea>

        <button type="button" class="penalty-toggle" id="penaltyToggle">PENALIDADE</button>

        <div class="penalty-panel" id="penaltyPanel">
            <div class="penalty-line">
                <button type="button" class="penalty-btn" id="penPlus">+</button>
                <div class="penalty-value" id="penValue">${p.penalty}</div>
                <button type="button" class="penalty-btn" id="penMinus">−</button>
                <button type="button" class="penalty-btn" id="penZero" title="Zerar">0</button>
            </div>
        </div>
    `;

    // notas
    const textarea = document.getElementById("debuffNote");
    textarea.value = p.debuffNote || "";
    textarea.addEventListener("input", () => {
        p.debuffNote = textarea.value;
        savePlayers(players);
    });

    // penalidade
    const toggleBtn = document.getElementById("penaltyToggle");
    const panel = document.getElementById("penaltyPanel");
    const penValue = document.getElementById("penValue");
    const plus = document.getElementById("penPlus");
    const minus = document.getElementById("penMinus");
    const zero = document.getElementById("penZero");

    toggleBtn.addEventListener("click", () => panel.classList.toggle("active"));

    function updatePenaltyButtons() {
        // regra: penalidade NÃO pode ultrapassar 0
        // se está 0, esconde "+"
        plus.style.display = p.penalty === 0 ? "none" : "inline-block";
    }

    function setPenalty(newVal) {
        if (newVal > 0) newVal = 0; // trava em 0
        p.penalty = newVal;
        penValue.textContent = p.penalty;
        savePlayers(players);
        // atualiza TOTAL na tela principal
        render();
        updatePenaltyButtons();
    }

    plus.addEventListener("click", () => setPenalty(p.penalty + 1));   // só aparece quando < 0
    minus.addEventListener("click", () => setPenalty(p.penalty - 1));  // sempre permite ir mais negativo
    zero.addEventListener("click", () => setPenalty(0));

    updatePenaltyButtons();
    setTimeout(() => textarea.focus(), 0);
}

/* =========================
   EVENTS
   ========================= */
addPlayerBtn.addEventListener("click", addPlayer);

playersContainer.addEventListener("click", (e) => {
    const cardEl = e.target.closest(".card");
    if (!cardEl) return;

    const playerId = cardEl.dataset.playerId;
    const p = findPlayer(playerId);
    if (!p) return;

    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;

    const action = actionEl.dataset.action;

    // Remover jogador
    if (action === "remove-player") {
        removePlayer(playerId);
        return;
    }

    // Editar nome
    if (action === "edit-name") {
        startEditName(cardEl, p);
        return;
    }

    // Alternar gênero
    if (action === "toggle-gender") {
        p.gender = p.gender === "M" ? "F" : "M";
        persistAndRerender();
        return;
    }

    // Nível 1..9
    if (action === "nivel-plus") {
        p.nivel = clamp(p.nivel + 1, 1, 9);
        persistAndRerender();
        return;
    }
    if (action === "nivel-minus") {
        p.nivel = clamp(p.nivel - 1, 1, 9);
        persistAndRerender();
        return;
    }

    // Bônus >= 0
    if (action === "bonus-plus") {
        p.bonus = p.bonus + 1;
        persistAndRerender();
        return;
    }
    if (action === "bonus-minus") {
        p.bonus = Math.max(0, p.bonus - 1);
        persistAndRerender();
        return;
    }

    // Modal BUFF/DEBUFF
    if (action === "open-buff") {
        modalPlayerId = playerId;
        modalType = "buff";
        renderBuffModal(p);
        openOverlay();
        return;
    }
    if (action === "open-debuff") {
        modalPlayerId = playerId;
        modalType = "debuff";
        renderDebuffModal(p);
        openOverlay();
        return;
    }
});

/* Modal close */
modalClose.addEventListener("click", closeOverlay);
modalBack.addEventListener("click", closeOverlay);

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) closeOverlay();
});
