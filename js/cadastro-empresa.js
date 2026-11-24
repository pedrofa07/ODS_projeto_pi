// ============================================
// CADASTRO DE EMPRESA — FIREBASE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formulario-cadastro-empresa');
    const sucesso = document.getElementById('cadastro-sucesso');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const botao = form.querySelector('button[type="submit"]');
        const textoOriginal = botao.innerHTML;
        botao.disabled = true;
        botao.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        const novaEmpresa = {
            nome: document.getElementById('nome-empresa').value.trim(),
            endereco: document.getElementById('endereco-empresa').value.trim(),
            bairro: document.getElementById('bairro-empresa').value.trim(),
            telefone: document.getElementById('telefone-empresa').value.trim(),
            email: document.getElementById('email-empresa').value.trim(),
            instagram: document.getElementById('instagram-empresa').value.trim(),
            cnpj: document.getElementById('cnpj-empresa').value.trim(),
            aprovado: false,
            dataCadastro: new Date().toISOString()
        };

        if (!novaEmpresa.nome || !novaEmpresa.endereco || !novaEmpresa.bairro ||
            !novaEmpresa.telefone || !novaEmpresa.email || !novaEmpresa.cnpj) {
            alert('Preencha todos os campos obrigatórios (*).');
            botao.disabled = false;
            botao.innerHTML = textoOriginal;
            return;
        }

        database.ref('empresas').push(novaEmpresa)
            .then(function() {
                form.style.display = 'none';
                sucesso.style.display = 'block';
            })
            .catch(function(erro) {
                console.error('Erro ao salvar no Firebase:', erro);
                alert('Erro ao enviar cadastro. Tente novamente.');
                botao.disabled = false;
                botao.innerHTML = textoOriginal;
            });
    });
});