// --- VARIÁVEIS DO DOM ---
const formCliente = document.getElementById('form-cliente');
const tabelaClientes = document.getElementById('tabela-clientes');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputId = document.getElementById('cliente-id');
const btnSalvar = document.getElementById('btn-salvar');

// --- FUNÇÕES DE ARMAZENAMENTO (localStorage) ---

/**
 * Carrega a lista de clientes do localStorage.
 * @returns {Array<Object>} Um array de objetos clientes.
 */
function getClientes() {
    const clientesJson = localStorage.getItem('clientes');
    return clientesJson ? JSON.parse(clientesJson) : [];
}

/**
 * Salva a lista de clientes atualizada no localStorage.
 * @param {Array<Object>} clientes - O array de clientes a ser salvo.
 */
function salvarClientes(clientes) {
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

// --- FUNÇÕES DE RENDERIZAÇÃO E MANIPULAÇÃO DO DOM ---

/**
 * Renderiza (desenha) a lista de clientes na tabela.
 */
function renderizarClientes() {
    const clientes = getClientes();
    tabelaClientes.innerHTML = ''; // Limpa o corpo da tabela

    clientes.forEach(cliente => {
        const row = tabelaClientes.insertRow();
        
        row.insertCell().textContent = cliente.id;
        row.insertCell().textContent = cliente.nome;
        row.insertCell().textContent = cliente.email;
        
        const cellAcoes = row.insertCell();
        
        // Botão Editar
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.classList.add('btn-editar');
        btnEditar.onclick = () => carregarParaEdicao(cliente.id);
        cellAcoes.appendChild(btnEditar);

        // Botão Excluir
        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.classList.add('btn-excluir');
        btnExcluir.onclick = () => excluirCliente(cliente.id);
        cellAcoes.appendChild(btnExcluir);
    });
}

/**
 * Carrega os dados de um cliente específico para o formulário de edição.
 * @param {number} id - O ID do cliente a ser editado.
 */
function carregarParaEdicao(id) {
    const clientes = getClientes();
    const cliente = clientes.find(c => c.id === id);

    if (cliente) {
        inputId.value = cliente.id;
        inputNome.value = cliente.nome;
        inputEmail.value = cliente.email;
        btnSalvar.textContent = 'Atualizar Cliente'; // Altera o texto do botão
    }
}

// --- FUNÇÕES DE CRUD ---

/**
 * Adiciona um novo cliente ou atualiza um existente.
 * @param {Event} event - O evento de submissão do formulário.
 */
function adicionarOuAtualizar(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const id = inputId.value ? parseInt(inputId.value) : null;
    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();

    if (!nome || !email) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    let clientes = getClientes();

    if (id) {
        // Lógica de Atualização
        clientes = clientes.map(c => 
            c.id === id ? { id, nome, email } : c
        );
    } else {
        // Lógica de Criação
        const novoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
        const novoCliente = { id: novoId, nome, email };
        clientes.push(novoCliente);
    }

    salvarClientes(clientes);
    limparFormulario();
    renderizarClientes();
}

/**
 * Remove um cliente da lista pelo ID.
 * @param {number} id - O ID do cliente a ser excluído.
 */
function excluirCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        let clientes = getClientes();
        clientes = clientes.filter(cliente => cliente.id !== id);
        salvarClientes(clientes);
        renderizarClientes();
    }
}

/**
 * Limpa o formulário após a submissão ou atualização.
 */
function limparFormulario() {
    formCliente.reset(); // Limpa todos os campos
    inputId.value = '';  // Garante que o ID de edição seja limpo
    btnSalvar.textContent = 'Salvar Cliente'; // Restaura o texto do botão
}

// --- INICIALIZAÇÃO ---

// 1. Adiciona o listener de evento para a submissão do formulário
formCliente.addEventListener('submit', adicionarOuAtualizar);

// 2. Carrega a lista de clientes ao iniciar a página
document.addEventListener('DOMContentLoaded', renderizarClientes);