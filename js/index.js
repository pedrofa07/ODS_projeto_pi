// ============================================
// INDEX.JS - ANIMAÇÕES E COMPORTAMENTOS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // ANIMAÇÃO DE CONTADOR DE ESTATÍSTICAS
    // ============================================
    const numerosEstatisticas = document.querySelectorAll('.estatisticas__numero');
    
    function animarContador(elemento) {
        const alvo = parseInt(elemento.getAttribute('data-alvo'));
        const duracao = 2000;
        const intervalo = 30;
        const passos = duracao / intervalo;
        let atual = 0;
        const incremento = alvo / passos;
        
        const contador = setInterval(() => {
            atual += incremento;
            if (atual >= alvo) {
                atual = alvo;
                clearInterval(contador);
            }
            elemento.textContent = Math.round(atual);
        }, intervalo);
    }
    
    if (numerosEstatisticas.length > 0) {
        const observadorEstatisticas = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    animarContador(entrada.target);
                    observadorEstatisticas.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.5 });
        
        numerosEstatisticas.forEach(numero => {
            observadorEstatisticas.observe(numero);
        });
    }
    
    // ============================================
    // ANIMAÇÃO DE SCROLL PARA BENEFÍCIOS
    // ============================================
    const cartoesBeneficios = document.querySelectorAll('.beneficios__cartao');
    
    if (cartoesBeneficios.length > 0) {
        const observadorBeneficios = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada, indice) => {
                if (entrada.isIntersecting) {
                    setTimeout(() => {
                        entrada.target.style.opacity = '1';
                        entrada.target.style.transform = 'translateY(0)';
                        entrada.target.style.transition = 'all 0.6s ease';
                    }, indice * 150);
                    observadorBeneficios.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.2 });
        
        cartoesBeneficios.forEach(cartao => {
            cartao.style.opacity = '0';
            cartao.style.transform = 'translateY(30px)';
            observadorBeneficios.observe(cartao);
        });
    }
    
    // ============================================
    // FAQ - ACORDEÃO
    // ============================================
    const itensFAQ = document.querySelectorAll('.faq__item');
    
    itensFAQ.forEach(item => {
        const pergunta = item.querySelector('.faq__pergunta');
        
        pergunta.addEventListener('click', () => {
            const estaAtivo = item.classList.contains('faq__item--ativo');
            
            itensFAQ.forEach(outroItem => {
                outroItem.classList.remove('faq__item--ativo');
                outroItem.querySelector('.faq__pergunta').setAttribute('aria-expanded', 'false');
            });
            
            if (!estaAtivo) {
                item.classList.add('faq__item--ativo');
                pergunta.setAttribute('aria-expanded', 'true');
            }
        });
    });
    
    // ============================================
    // SCROLL SUAVE PARA LINKS INTERNOS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const destino = this.getAttribute('href');
            if (destino === '#') return;
            
            const elementoDestino = document.querySelector(destino);
            if (elementoDestino) {
                e.preventDefault();
                const posicao = elementoDestino.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: posicao,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // EFEITO DE HEADER AO ROLAR
    // ============================================
    const navegacao = document.querySelector('.navegacao');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navegacao.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            navegacao.style.boxShadow = 'none';
        }
    });
    
    // ============================================
    // ANIMAÇÃO DE ENTRADA PARA ELEMENTOS VISÍVEIS
    // ============================================
    const elementosAnimados = document.querySelectorAll('[data-animacao]');
    
    if (elementosAnimados.length > 0) {
        const observadorAnimacao = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('animado-aparecer');
                    observadorAnimacao.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.2 });
        
        elementosAnimados.forEach(elemento => {
            observadorAnimacao.observe(elemento);
        });
    }
});