// ============================================
// MOSTRAR LINK "ADMIN" APENAS QUANDO LOGADO
// Compartilha a mesma chave de sessão do admin.js
// ============================================
(function () {
    const CHAVE_SESSAO = 'brightenergy_admin_sessao';

    function sessaoValida() {
        try {
            const raw = localStorage.getItem(CHAVE_SESSAO);
            if (!raw) return false;
            const dados = JSON.parse(raw);
            if (dados.expiraEm && Date.now() > dados.expiraEm) {
                localStorage.removeItem(CHAVE_SESSAO);
                return false;
            }
            return true;
        } catch {
            localStorage.removeItem(CHAVE_SESSAO);
            return false;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (!sessaoValida()) return;

        // Mostra o <li> do Admin no menu principal
        const item = document.getElementById('menu-admin-item');
        if (item) {
            item.style.display = '';       // remove o display:none
            item.classList.add('menu-admin-visivel');
        }

        // Opcional: adiciona um badge "você está logado" no painel do admin
        // (não necessário para o menu público)
    });
})();