const API_URL = "http://localhost:8080/aluno";

document.getElementById('aluno-form').addEventListener('submit', salvarAluno);

function renderizarTabela(alunos) {
    const tbody = document.getElementById('aluno-table-body');
    tbody.innerHTML = "";

    if (!Array.isArray(alunos)) return;

    alunos.forEach(a => {
        tbody.innerHTML += `
            <tr>
                <td>${a.id}</td>
                <td>${a.nome}</td>
                <td>${a.idade}</td>
                <td>${a.sexo}</td>
                <td>
                    <button class="btn-edit" onclick="prepararEdicao(${a.id}, '${a.nome}', ${a.idade}, '${a.sexo}')">Editar</button>
                    <button class="btn-delete" onclick="excluirAluno(${a.id})">Excluir</button>
                    <button onclick="verAvaliacoes(${a.id})" style="background-color: #007bff; color: white;">Avaliações</button>
                </td>
            </tr>
        `;
    });
}

function verAvaliacoes(id) {
    // Redireciona para a página de circunferências passando o ID na URL
    window.location.href = `circunferencias.html?alunoId=${id}`;
}

// Lista apenas quando o botão for clicado
async function listarTodos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao buscar dados");
        const alunos = await response.json();
        renderizarTabela(alunos);
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar com o servidor.");
    }
}

async function buscarPorNome() {
    const nome = document.getElementById('search-name').value;
    if (!nome) return alert("Digite um nome para buscar");

    try {
        const response = await fetch(`${API_URL}/nome/${nome}`);
        if (!response.ok) throw new Error("Aluno não encontrado");
        const aluno = await response.json();
        renderizarTabela([aluno]); // Envolve em array para a tabela processar
    } catch (error) {
        alert(error.message);
    }
}

async function salvarAluno(event) {
    event.preventDefault();

    const id = document.getElementById('aluno-id').value;
    const alunoData = {
        nome: document.getElementById('nome').value,
        idade: parseInt(document.getElementById('idade').value),
        sexo: document.getElementById('sexo').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alunoData)
        });

        if (response.ok) {
            alert(id ? "Aluno atualizado!" : "Aluno cadastrado!");
            resetForm();
            listarTodos(); // Atualiza a tabela após salvar
        } else {
            alert("Erro ao salvar aluno. Verifique os campos.");
        }
    } catch (error) {
        console.error("Erro:", error);
    }
}

async function excluirAluno(id) {
    if (!confirm("Deseja realmente excluir este aluno?")) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, { 
            method: 'DELETE' 
        });

        if (response.ok) {
            alert("Aluno excluído com sucesso!");
            listarTodos(); 
        } else {
            // Aqui capturamos o JSON do seu GlobalExceptionHandler
            const errorData = await response.json(); 
            // 'errorData.message' é o campo do seu model ErrorMessage
            alert("Erro: " + (errorData.message || "Não foi possível excluir."));
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Erro crítico: O servidor está fora do ar ou houve um erro de rede.");
    }
}

function renderizarTabela(alunos) {
    const tbody = document.getElementById('aluno-table-body');
    tbody.innerHTML = "";

    if (!Array.isArray(alunos)) return;

    alunos.forEach(a => {
        tbody.innerHTML += `
            <tr>
                <td>${a.id}</td>
                <td>${a.nome}</td>
                <td>${a.idade}</td>
                <td>${a.sexo}</td>
                <td>
                    <button class="btn-edit" onclick="prepararEdicao(${a.id}, '${a.nome}', ${a.idade}, '${a.sexo}')">Editar</button>
                    <button class="btn-delete" onclick="excluirAluno(${a.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function prepararEdicao(id, nome, idade, sexo) {
    document.getElementById('aluno-id').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('idade').value = idade;
    document.getElementById('sexo').value = sexo;

    document.getElementById('form-title').innerText = "Editar Aluno";
    document.getElementById('btn-cancel').style.display = "inline";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('aluno-form').reset();
    document.getElementById('aluno-id').value = "";
    document.getElementById('form-title').innerText = "Cadastrar Aluno";
    document.getElementById('btn-cancel').style.display = "none";
}