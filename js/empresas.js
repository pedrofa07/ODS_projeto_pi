// ============================================
// EMPRESAS (público) — FIREBASE + WhatsApp
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const gradeEmpresas = document.getElementById('grade-empresas');
    const buscaInput = document.getElementById('busca-empresas');
    const vazio = document.getElementById('empresas-vazio');

    if (!gradeEmpresas) return;

    let todasEmpresas = [];

    // Converte telefone em link de WhatsApp
    function gerarLinkWhatsApp(telefone) {
        const numeros = (telefone || '').replace(/\D/g, '');
        const numeroCompleto = numeros.startsWith('55') ? numeros : '55' + numeros;
        return 'https://wa.me/' + numeroCompleto;
    }

    // Renderiza os cartões
    function renderizar(empresas) {
        gradeEmpresas.innerHTML = '';

        if (empresas.length === 0) {
            vazio.style.display = 'block';
            gradeEmpresas.style.display = 'none';
            return;
        }
        vazio.style.display = 'none';
        gradeEmpresas.style.display = 'grid';

        empresas.forEach(function(emp) {
            const card = document.createElement('div');
            card.className = 'empresas__cartao';
            card.innerHTML = `
                <div class="empresas__cabecalho-cartao">
                    <div class="empresas__avatar">${emp.nome.substring(0, 2).toUpperCase()}</div>
                    <div class="empresas__info-cabecalho">
                        <h3 class="empresas__nome">${emp.nome}</h3>
                        <span class="empresas__localizacao"><i class="fas fa-map-marker-alt"></i> ${emp.bairro}</span>
                    </div>
                </div>
                <p class="empresas__descricao-cartao"><strong>Endereço:</strong> ${emp.endereco}</p>
                <div class="empresas__contato-cartao">
                    <a href="${gerarLinkWhatsApp(emp.telefone)}" target="_blank" rel="noopener"
                       class="empresas__link-contato empresas__link-whatsapp"
                       title="Conversar no WhatsApp">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                    <a href="mailto:${emp.email}" class="empresas__link-contato">
                        <i class="fas fa-envelope"></i> Email
                    </a>
                    ${emp.instagram
                        ? `<a href="https://instagram.com/${emp.instagram.replace('@','')}"
                              target="_blank" rel="noopener" class="empresas__link-contato">
                              <i class="fab fa-instagram"></i> Instagram
                           </a>`
                        : ''}
                </div>
            `;
            gradeEmpresas.appendChild(card);
        });
    }

    // Filtro de busca
    function filtrar() {
        const termo = buscaInput.value.toLowerCase().trim();
        if (!termo) {
            renderizar(todasEmpresas);
            return;
        }
        const filtradas = todasEmpresas.filter(function(emp) {
            return emp.nome.toLowerCase().includes(termo) ||
                   emp.bairro.toLowerCase().includes(termo);
        });
        renderizar(filtradas);
    }

    buscaInput.addEventListener('input', filtrar);

    // Carrega empresas do Firebase (tempo real)
    database.ref('empresas').on('value', function(snapshot) {
        const dados = snapshot.val() || {};
        const lista = Object.keys(dados).map(function(id) {
            return Object.assign({ id: id }, dados[id]);
        });
        todasEmpresas = lista.filter(function(emp) { return emp.aprovado === true; });
        filtrar();
    }, function(erro) {
        console.error('Erro ao carregar empresas:', erro);
        vazio.style.display = 'block';
        vazio.innerHTML = '<p style="color:red;">Erro ao carregar empresas. Verifique sua conexão.</p>';
    });
});