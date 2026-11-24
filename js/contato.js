// ============================================
// FORMULÁRIO DE CONTATO — FIREBASE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const formularioContato = document.getElementById('formulario-contato');
    const contatoSucesso = document.getElementById('contato-sucesso');

    if (!formularioContato) return;

    formularioContato.addEventListener('submit', function(evento) {
        evento.preventDefault();

        const botaoEnviar = formularioContato.querySelector('button[type="submit"]');
        const textoOriginal = botaoEnviar.innerHTML;
        botaoEnviar.disabled = true;
        botaoEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        const dadosContato = {
            nome: document.getElementById('nome-contato').value.trim(),
            email: document.getElementById('email-contato').value.trim(),
            assunto: document.getElementById('assunto-contato').value,
            mensagem: document.getElementById('mensagem-contato').value.trim(),
            data: new Date().toISOString(),
            lido: false
        };

        if (!dadosContato.nome || !dadosContato.email || !dadosContato.assunto || !dadosContato.mensagem) {
            alert('Por favor, preencha todos os campos.');
            botaoEnviar.disabled = false;
            botaoEnviar.innerHTML = textoOriginal;
            return;
        }

        if (!validarEmail(dadosContato.email)) {
            alert('Por favor, insira um e-mail válido.');
            botaoEnviar.disabled = false;
            botaoEnviar.innerHTML = textoOriginal;
            return;
        }

        database.ref('mensagens').push(dadosContato)
            .then(function() {
                formularioContato.style.display = 'none';
                contatoSucesso.style.display = 'block';
                contatoSucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setTimeout(function() {
                    formularioContato.reset();
                    formularioContato.style.display = 'flex';
                    contatoSucesso.style.display = 'none';
                    botaoEnviar.disabled = false;
                    botaoEnviar.innerHTML = textoOriginal;
                }, 5000);
            })
            .catch(function(erro) {
                console.error('Erro ao salvar no Firebase:', erro);
                alert('Erro ao enviar mensagem. Tente novamente.');
                botaoEnviar.disabled = false;
                botaoEnviar.innerHTML = textoOriginal;
            });
    });

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});