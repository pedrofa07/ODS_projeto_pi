// ============================================
// PAINEL ADMINISTRATIVO
// Login verificado diretamente no banco de dados
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // --------------------------------------------
    // REFERÊNCIAS AOS ELEMENTOS DA TELA
    // --------------------------------------------
    const telaLogin  = document.getElementById('admin-login');
    const telaPainel = document.getElementById('admin-painel');
    const formulario = document.getElementById('form-login');
    const campoLogin = document.getElementById('login-admin');
    const campoSenha = document.getElementById('senha-admin');
    const textoErro  = document.getElementById('erro-login');

    const abas         = document.querySelectorAll('.admin-tab');
    const abaMensagens = document.getElementById('tab-mensagens');
    const abaEmpresas  = document.getElementById('tab-empresas');

    // --------------------------------------------
    // LOGIN
    // Busca as credenciais no banco e compara
    // --------------------------------------------
    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();

        const loginDigitado = campoLogin.value.trim();
        const senhaDigitada = campoSenha.value;

        // Esconde erro anterior
        textoErro.style.display = 'none';

        // Mostra feedback de carregamento
        const botao = formulario.querySelector('button[type="submit"]');
        const textoOriginal = botao.innerHTML;
        botao.disabled = true;
        botao.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';

        // Lê o nó "admin" uma única vez
        database.ref('admin').once('value')
            .then(function(snapshot) {
                const credenciais = snapshot.val();

                botao.disabled = false;
                botao.innerHTML = textoOriginal;

                // Caso o nó "admin" não exista no banco
                if (!credenciais) {
                    textoErro.textContent = 'Credenciais não configuradas no banco de dados.';
                    textoErro.style.display = 'block';
                    return;
                }

                // Compara o que foi digitado com o que está no banco
                if (loginDigitado === credenciais.login && senhaDigitada === credenciais.senha) {
                    // ✅ Login correto
                    telaLogin.style.display  = 'none';
                    telaPainel.style.display = 'block';

                    campoLogin.value = '';
                    campoSenha.value = '';

                    carregarMensagens();
                    carregarEmpresas();
                } else {
                    // ❌ Login ou senha errados
                    textoErro.textContent = 'Login ou senha incorretos.';
                    textoErro.style.display = 'block';
                }
            })
            .catch(function(erro) {
                console.error('Erro ao verificar credenciais:', erro);

                botao.disabled = false;
                botao.innerHTML = textoOriginal;

                textoErro.textContent = 'Erro ao conectar. Tente novamente.';
                textoErro.style.display = 'block';
            });
    });

    // --------------------------------------------
    // SAIR
    // --------------------------------------------
    document.getElementById('btn-logout').addEventListener('click', function() {
        telaPainel.style.display = 'none';
        telaLogin.style.display  = 'block';

        campoLogin.value = '';
        campoSenha.value = '';

        textoErro.style.display = 'none';
    });

    // --------------------------------------------
    // NAVEGAÇÃO ENTRE ABAS
    // --------------------------------------------
    abas.forEach(function(aba) {
        aba.addEventListener('click', function() {
            if (this.id === 'btn-logout') return;

            abas.forEach(function(outra) {
                if (outra.id !== 'btn-logout') outra.classList.remove('ativo');
            });
            this.classList.add('ativo');

            const destino = this.dataset.tab;

            if (destino === 'mensagens') {
                abaMensagens.style.display = 'block';
                abaEmpresas.style.display  = 'none';
                carregarMensagens();
            } else if (destino === 'empresas') {
                abaMensagens.style.display = 'none';
                abaEmpresas.style.display  = 'block';
                carregarEmpresas();
            }
        });
    });

    // --------------------------------------------
    // MENSAGENS RECEBIDAS
    // --------------------------------------------
    function carregarMensagens() {
        const container = document.getElementById('lista-mensagens');
        container.innerHTML = '<p style="color:var(--cor-texto-claro);">Carregando...</p>';

        database.ref('mensagens').on('value', function(snapshot) {
            const dados = snapshot.val() || {};
            const lista = Object.keys(dados).map(function(id) {
                return Object.assign({ id: id }, dados[id]);
            });

            if (lista.length === 0) {
                container.innerHTML = '<p style="color:var(--cor-texto-claro);">Nenhuma mensagem recebida ainda.</p>';
                return;
            }

            // Mais recentes primeiro
            lista.sort(function(a, b) {
                return new Date(b.data) - new Date(a.data);
            });

            let html = '';
            lista.forEach(function(msg) {
                html += `
                    <div class="mensagem-item">
                        <div class="mensagem-dados">
                            <strong>${msg.nome}</strong>
                            <span>${msg.email}</span>
                            <span>Assunto: ${msg.assunto}</span>
                            <p>${msg.mensagem}</p>
                            <span style="font-size:0.75rem;color:var(--cor-texto-claro);">
                                ${new Date(msg.data).toLocaleString('pt-BR')}
                            </span>
                        </div>
                        <div class="mensagem-acoes">
                            <a href="mailto:${msg.email}?subject=Resposta: ${encodeURIComponent(msg.assunto)}"
                               class="btn-email">
                                <i class="fas fa-reply"></i> Responder
                            </a>
                            <button class="btn-excluir" data-id="${msg.id}">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;

            // Botões de excluir
            container.querySelectorAll('.btn-excluir').forEach(function(botao) {
                botao.addEventListener('click', function() {
                    const id = this.dataset.id;
                    if (confirm('Tem certeza que deseja excluir esta mensagem?')) {
                        database.ref('mensagens/' + id).remove()
                            .catch(function(erro) {
                                alert('Erro ao excluir: ' + erro.message);
                            });
                    }
                });
            });
        }, function(erro) {
            container.innerHTML = '<p style="color:red;">Erro ao carregar mensagens.</p>';
            console.error(erro);
        });
    }

    // --------------------------------------------
    // EMPRESAS CADASTRADAS
    // --------------------------------------------
    function carregarEmpresas() {
        const container = document.getElementById('lista-empresas-admin');
        container.innerHTML = '<p style="color:var(--cor-texto-claro);">Carregando...</p>';

        database.ref('empresas').on('value', function(snapshot) {
            const dados = snapshot.val() || {};
            const lista = Object.keys(dados).map(function(id) {
                return Object.assign({ id: id }, dados[id]);
            });

            if (lista.length === 0) {
                container.innerHTML = '<p style="color:var(--cor-texto-claro);">Nenhuma empresa cadastrada.</p>';
                return;
            }

            // Pendentes primeiro, aprovadas depois
            lista.sort(function(a, b) {
                if (a.aprovado === b.aprovado) return 0;
                return a.aprovado ? 1 : -1;
            });

            let html = '';
            lista.forEach(function(emp) {
                const status      = emp.aprovado ? 'Aprovado' : 'Pendente';
                const statusClass = emp.aprovado ? 'status-aprovado' : 'status-pendente';

                html += `
                    <div class="empresa-item">
                        <div class="empresa-dados">
                            <strong>${emp.nome}</strong>
                            <span>${emp.bairro} — ${emp.endereco}</span>
                            <span>${emp.telefone} | ${emp.email}</span>
                            ${emp.instagram ? `<span>Instagram: ${emp.instagram}</span>` : ''}
                            <span>CNPJ: ${emp.cnpj}</span>
                            <span class="${statusClass}">${status}</span>
                        </div>
                        <div class="empresa-acoes">
                            ${!emp.aprovado
                                ? `<button class="btn-aprovar" data-id="${emp.id}"><i class="fas fa-check"></i> Aprovar</button>`
                                : ''}
                            <button class="btn-editar" data-id="${emp.id}"><i class="fas fa-edit"></i> Editar</button>
                            <button class="btn-excluir" data-id="${emp.id}"><i class="fas fa-trash"></i> Excluir</button>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;

            // Botão Aprovar
            container.querySelectorAll('.btn-aprovar').forEach(function(botao) {
                botao.addEventListener('click', function() {
                    const id = this.dataset.id;
                    database.ref('empresas/' + id).update({ aprovado: true })
                        .catch(function(erro) { alert('Erro ao aprovar: ' + erro.message); });
                });
            });

            // Botão Excluir
            container.querySelectorAll('.btn-excluir').forEach(function(botao) {
                botao.addEventListener('click', function() {
                    const id = this.dataset.id;
                    if (confirm('Excluir esta empresa permanentemente?')) {
                        database.ref('empresas/' + id).remove()
                            .catch(function(erro) { alert('Erro ao excluir: ' + erro.message); });
                    }
                });
            });

            // Botão Editar
            container.querySelectorAll('.btn-editar').forEach(function(botao) {
                botao.addEventListener('click', function() {
                    const id  = this.dataset.id;
                    const emp = lista.find(function(e) { return e.id === id; });
                    if (!emp) return;

                    const novoNome = prompt('Novo nome:', emp.nome);
                    if (novoNome === null) return;

                    const atualizacoes = {
                        nome:      novoNome.trim(),
                        endereco:  (prompt('Novo endereço:', emp.endereco)         || emp.endereco).trim(),
                        bairro:    (prompt('Novo bairro:', emp.bairro)             || emp.bairro).trim(),
                        telefone:  (prompt('Novo telefone:', emp.telefone)         || emp.telefone).trim(),
                        email:     (prompt('Novo e-mail:', emp.email)              || emp.email).trim(),
                        instagram: (prompt('Novo Instagram:', emp.instagram || '') || emp.instagram || '').trim(),
                        cnpj:      (prompt('Novo CNPJ:', emp.cnpj)                 || emp.cnpj).trim()
                    };

                    database.ref('empresas/' + id).update(atualizacoes)
                        .catch(function(erro) { alert('Erro ao editar: ' + erro.message); });
                });
            });
        }, function(erro) {
            container.innerHTML = '<p style="color:red;">Erro ao carregar empresas.</p>';
            console.error(erro);
        });
    }
});