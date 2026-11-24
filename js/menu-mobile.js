// MENU RESPONSIVO — BrightEnergy
document.addEventListener('DOMContentLoaded', function () {
    const botao = document.getElementById('botao-menu-mobile');
    const menu = document.getElementById('menu-principal');

    if (!botao || !menu) return;

    const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';

    // Cria uma camada escura atrás do menu sem exigir HTML extra em cada página.
    let overlay = document.getElementById('menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'menu-overlay';
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    function fecharMenu() {
        botao.classList.remove('navegacao__menu-mobile--ativo');
        menu.classList.remove('navegacao__menu--aberto');
        overlay.classList.remove('menu-overlay--visivel');
        document.body.classList.remove('menu-aberto');
        botao.setAttribute('aria-expanded', 'false');
        botao.setAttribute('aria-label', 'Abrir menu');
    }

    function abrirMenu() {
        botao.classList.add('navegacao__menu-mobile--ativo');
        menu.classList.add('navegacao__menu--aberto');
        overlay.classList.add('menu-overlay--visivel');
        document.body.classList.add('menu-aberto');
        botao.setAttribute('aria-expanded', 'true');
        botao.setAttribute('aria-label', 'Fechar menu');
    }

    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-controls', 'menu-principal');

    botao.addEventListener('click', function () {
        menu.classList.contains('navegacao__menu--aberto') ? fecharMenu() : abrirMenu();
    });

    overlay.addEventListener('click', fecharMenu);

    menu.querySelectorAll('.navegacao__link').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href && href.split('#')[0] === paginaAtual) {
            link.classList.add('navegacao__link--ativo');
        }

        link.addEventListener('click', fecharMenu);
    });

    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape') fecharMenu();
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 900) fecharMenu();
    });
});
