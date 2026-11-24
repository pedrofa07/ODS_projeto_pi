document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // CALCULADORA
    // ============================================
    const formularioCalculadora = document.getElementById('formulario-calculadora');
    const secaoResultados = document.getElementById('secao-resultados');
    const divFormulario = document.getElementById('calculadora-formulario');
    const btnVoltar = document.getElementById('btn-voltar-calculadora');

    function mostrarFormulario() {
        divFormulario.style.display = 'block';
        secaoResultados.style.display = 'none';
        document.querySelector('.calculadora-principal').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function mostrarResultados() {
        divFormulario.style.display = 'none';
        secaoResultados.style.display = 'block';
        secaoResultados.scrollIntoView({ behavior: 'smooth', block: 'start' });
        secaoResultados.classList.add('animado-aparecer');
    }

    if (btnVoltar) {
        btnVoltar.addEventListener('click', mostrarFormulario);
    }

    if (formularioCalculadora) {
        formularioCalculadora.addEventListener('submit', function(evento) {
            evento.preventDefault();

            const valorConta = parseFloat(document.getElementById('valor-conta').value);
            const custoSistema = parseFloat(document.getElementById('custo-sistema').value);
            const economiaPercentual = parseInt(document.getElementById('economia-percentual').value);

            if (valorConta <= 0 || custoSistema <= 0) {
                alert('Por favor, insira valores válidos maiores que zero.');
                return;
            }

            const economiaMensal = valorConta * (economiaPercentual / 100);
            const paybackMeses = custoSistema / economiaMensal;
            const paybackAnos = paybackMeses / 12;
            const economia5Anos = economiaMensal * 12 * 5;
            const economia10Anos = economiaMensal * 12 * 10;

            document.getElementById('resultado-payback').textContent = Math.round(paybackMeses);
            document.getElementById('resultado-economia-mensal').textContent = formatarMoeda(economiaMensal);
            document.getElementById('resultado-economia-5-anos').textContent = formatarMoeda(economia5Anos);
            document.getElementById('resultado-economia-10-anos').textContent = formatarMoeda(economia10Anos);

            const analiseDiv = document.getElementById('resultado-analise');
            let analiseHTML = '';
            if (paybackAnos <= 3) {
                analiseHTML = `
                    <p><strong>🌟 Excelente investimento!</strong></p>
                    <p>Seu sistema se pagará em aproximadamente <strong>${paybackAnos.toFixed(1)} anos</strong>, 
                    o que é considerado um ótimo retorno. Após esse período, você terá energia praticamente 
                    gratuita por mais de 20 anos.</p>
                    <p>Com a economia mensal de <strong>${formatarMoeda(economiaMensal)}</strong>, 
                    em 5 anos você terá economizado <strong>${formatarMoeda(economia5Anos)}</strong>.</p>
                `;
            } else if (paybackAnos <= 5) {
                analiseHTML = `
                    <p><strong>👍 Bom investimento!</strong></p>
                    <p>Seu sistema se pagará em aproximadamente <strong>${paybackAnos.toFixed(1)} anos</strong>. 
                    Considerando que os sistemas solares têm vida útil de 25 anos ou mais, você terá cerca de 
                    <strong>${(25 - paybackAnos).toFixed(1)} anos</strong> de economia líquida.</p>
                    <p>Economia mensal estimada: <strong>${formatarMoeda(economiaMensal)}</strong></p>
                `;
            } else if (paybackAnos <= 7) {
                analiseHTML = `
                    <p><strong>💡 Investimento viável</strong></p>
                    <p>Seu sistema se pagará em aproximadamente <strong>${paybackAnos.toFixed(1)} anos</strong>. 
                    Embora o retorno seja mais longo, ainda é um investimento que vale a pena, considerando 
                    a vida útil do sistema e os benefícios ambientais.</p>
                    <p>Em 10 anos, sua economia acumulada será de <strong>${formatarMoeda(economia10Anos)}</strong>.</p>
                `;
            } else {
                analiseHTML = `
                    <p><strong>📊 Análise detalhada</strong></p>
                    <p>O payback estimado é de <strong>${paybackAnos.toFixed(1)} anos</strong>. 
                    Recomendamos buscar orçamentos de diferentes empresas para encontrar 
                    melhores condições. Considere também linhas de financiamento com juros reduzidos.</p>
                    <p>Consulte nosso diretório de empresas locais para comparar preços e condições.</p>
                `;
            }
            analiseDiv.innerHTML = analiseHTML;

            mostrarResultados();
        });
    }

    function formatarMoeda(valor) {
        return 'R$ ' + valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const inputsNumericos = document.querySelectorAll('#valor-conta, #custo-sistema');
    inputsNumericos.forEach(input => {
        input.addEventListener('blur', function() {
            const valor = parseFloat(this.value);
            if (!isNaN(valor) && valor > 0) {
                this.value = valor.toFixed(2);
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const destino = this.getAttribute('href');
            if (destino === '#') return;
            const elementoDestino = document.querySelector(destino);
            if (elementoDestino) {
                e.preventDefault();
                const posicao = elementoDestino.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: posicao, behavior: 'smooth' });
            }
        });
    });
});