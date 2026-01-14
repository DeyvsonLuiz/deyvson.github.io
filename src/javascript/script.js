document.querySelectorAll(".card").forEach(card => {

    const statBoxes = card.querySelectorAll(".stat-box");

    const nivelBox = statBoxes[0];
    const bonusBox = statBoxes[1];
    const totalBox = statBoxes[2];

    const nivelValue = nivelBox.querySelector(".value");
    const bonusValue = bonusBox.querySelector(".value");
    const totalValue = totalBox.querySelector(".value");

    const nivelBtns = nivelBox.querySelectorAll(".controls button");
    const bonusBtns = bonusBox.querySelectorAll(".controls button");

    function atualizarTotal() {
        const nivel = parseInt(nivelValue.textContent, 10);
        const bonus = parseInt(bonusValue.textContent, 10);
        totalValue.textContent = nivel + bonus;
    }

    /* ===== NÍVEL (1 a 9) ===== */
    nivelBtns[0].addEventListener("click", () => {
        let valor = parseInt(nivelValue.textContent, 10);
        if (valor < 9) {
            nivelValue.textContent = valor + 1;
            atualizarTotal();
        }
    });

    nivelBtns[1].addEventListener("click", () => {
        let valor = parseInt(nivelValue.textContent, 10);
        if (valor > 1) {
            nivelValue.textContent = valor - 1;
            atualizarTotal();
        }
    });

    /* ===== BÔNUS (mínimo 0) ===== */
    bonusBtns[0].addEventListener("click", () => {
        bonusValue.textContent = parseInt(bonusValue.textContent, 10) + 1;
        atualizarTotal();
    });

    bonusBtns[1].addEventListener("click", () => {
        let valor = parseInt(bonusValue.textContent, 10);
        if (valor > 0) {
            bonusValue.textContent = valor - 1;
            atualizarTotal();
        }
    });

    atualizarTotal();
});

/* ===== TELA BUFF/DEBUFF (OVERLAY) ===== */
const overlay = document.getElementById("overlay");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const modalBack = document.getElementById("modalBack");

function abrirTela(tipo) {
    if (tipo === "buff") {
        modalTitle.textContent = "BUFF";
        modalBody.innerHTML = `
            <p><strong>Tela BUFF</strong></p>
            <p>Aqui você vai adicionar/selecionar os buffs (depois fazemos as ações).</p>
        `;
    } else {
        modalTitle.textContent = "DEBUFF";
        modalBody.innerHTML = `
            <p><strong>Tela DEBUFF</strong></p>
            <p>Aqui você vai adicionar/selecionar os debuffs (depois fazemos as ações).</p>
        `;
    }

    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
}

function fecharTela() {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
}

document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (btn) abrirTela(btn.dataset.open);
});

modalClose.addEventListener("click", fecharTela);
modalBack.addEventListener("click", fecharTela);

/* Clique fora do modal fecha */
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) fecharTela();
});

/* ESC fecha */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
        fecharTela();
    }
});
