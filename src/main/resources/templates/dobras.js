const API_URL = "http://localhost:8080/dobrasCutaneas";
const ALUNOS_API = "http://localhost:8080/aluno";

async function carregarListaAlunos() {
    try {
        const response = await fetch(ALUNOS_API);
        const alunos = await response.json();
        const selForm = document.getElementById('aluno-id');
        const selSearch = document.getElementById('aluno-id-search');

        const options = alunos.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
        selForm.innerHTML = '<option value="" disabled selected>Selecione um aluno...</option>' + options;
        selSearch.innerHTML = '<option value="">Selecione um aluno...</option>' + options;
    } catch (e) { console.error("Erro alunos:", e); }
}

window.onload = carregarListaAlunos;

document.getElementById('dobras-form').addEventListener('submit', salvarDobras);

async function salvarDobras(event) {
    event.preventDefault();
    const id = document.getElementById('dobras-id').value;
    const alunoId = document.getElementById('aluno-id').value;

    if (!alunoId) {
        alert("Por favor, selecione um aluno.");
        return;
    }

    const dados = {
        data: document.getElementById('data').value,
        peitoral: parseFloat(document.getElementById('peitoral').value),
        biceps: parseFloat(document.getElementById('biceps').value),
        triceps: parseFloat(document.getElementById('triceps').value),
        subescapular: parseFloat(document.getElementById('subescapular').value),
        panturrilhaMedial: parseFloat(document.getElementById('panturrilhaMedial').value),
        abdominal: parseFloat(document.getElementById('abdominal').value),
        suprailiaca: parseFloat(document.getElementById('suprailiaca').value),
        coxa: parseFloat(document.getElementById('coxa').value),
        // ADICIONE ISSO: Envia o objeto aluno com o ID para evitar o NullPointer no Java
        aluno: { id: parseInt(alunoId) }
    };

    const url = id ? `${API_URL}/${id}/aluno/${alunoId}` : `${API_URL}/aluno/${alunoId}`;
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            alert(id ? "Avaliação atualizada!" : "Avaliação salva!");
            resetForm();
            carregarEvolucao();
        } else {
            const errorData = await res.json();
            alert("Erro: " + (errorData.message || "Erro desconhecido"));
        }
    } catch (e) { 
        console.error(e);
        alert("Falha na conexão com o servidor."); 
    }
}
async function carregarEvolucao() {
    const id = document.getElementById('aluno-id-search').value;
    if (!id) return;
    const res = await fetch(`${API_URL}/aluno/${id}`);
    const lista = await res.json();
    renderizarTabela(lista);
}

function renderizarTabela(lista) {
    const container = document.getElementById('tabela-container');
    if (!lista || lista.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>Nenhuma avaliação encontrada para este aluno.</p>";
        return;
    }

    // Ordenar por data (mais antiga para mais recente)
    lista.sort((a, b) => new Date(a.data) - new Date(b.data));

    const campos = [
        ["Peitoral (mm)", "peitoral"],
        ["Abdominal (mm)", "abdominal"],
        ["Bíceps (mm)", "biceps"],
        ["Tríceps (mm)", "triceps"],
        ["Subescapular (mm)", "subescapular"],
        ["Suprailíaca (mm)", "suprailiaca"],
        ["Coxa (mm)", "coxa"],
        ["Panturrilha Medial (mm)", "panturrilhaMedial"],
        ["% Gordura", "percentualGordura"]
    ];

    let html = `<table class="evolution-table">
        <thead>
            <tr>
                <th class="param-column">Medidas</th>`;
    
    // Gerar Cabeçalho com Datas e Botões
    lista.forEach(item => {
        const dataFormatada = new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        html += `
            <th class="header-content">
                <span class="header-date">${dataFormatada}</span>
                <div class="header-actions">
                    <button class="btn-edit-header" onclick='prepararEdicao(${JSON.stringify(item)})'>Editar</button>
                    <button class="btn-delete-header" onclick="excluirDobras(${item.id})">Excluir</button>
                </div>
            </th>`;
    });
    html += `</tr></thead><tbody>`;

    // Gerar Linhas de Dados com Cálculo de Diferença
    campos.forEach(c => {
        const label = c[0];
        const chave = c[1];
        html += `<tr><td class="param-column">${label}</td>`;

        lista.forEach((item, index) => {
            let valorAtual = item[chave] || 0;
            let displayValue = valorAtual;
            
            // Adiciona símbolo de % se for o campo de gordura
            if(chave === "percentualGordura") displayValue = valorAtual.toFixed(2) + "%";

            let diffHtml = "";
            // Se não for a primeira coluna, calcula a diferença com a anterior
            if (index > 0) {
                let valorAnterior = lista[index - 1][chave] || 0;
                let diff = valorAtual - valorAnterior;
                if (diff !== 0) {
                    let classeDiff = diff > 0 ? "diff-pos" : "diff-neg";
                    let sinal = diff > 0 ? "+" : "";
                    diffHtml = `<span class="diff-text ${classeDiff}">${sinal}${diff.toFixed(1)}</span>`;
                }
            }

            html += `<td>${displayValue} ${diffHtml}</td>`;
        });
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

// Adicione também a função de excluir que não estava no seu script
async function excluirDobras(id) {
    if (!confirm("Deseja realmente excluir esta avaliação de dobras?")) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert("Excluído com sucesso!");
            carregarEvolucao();
        } else {
            alert("Erro ao excluir.");
        }
    } catch (e) {
        console.error(e);
        alert("Falha na conexão.");
    }
}

function prepararEdicao(item) {
    document.getElementById('dobras-id').value = item.id;
    document.getElementById('aluno-id').value = item.aluno.id;
    document.getElementById('data').value = item.data;
    document.getElementById('peitoral').value = item.peitoral;
    document.getElementById('biceps').value = item.biceps;
    document.getElementById('triceps').value = item.triceps;
    document.getElementById('subescapular').value = item.subescapular;
    document.getElementById('suprailiaca').value = item.suprailiaca;
    document.getElementById('abdominal').value = item.abdominal;
    document.getElementById('coxa').value = item.coxa;
    document.getElementById('panturrilhaMedial').value = item.panturrilhaMedial;
    document.getElementById('btn-cancel').style.display = "block";
}

function resetForm() {
    document.getElementById('dobras-form').reset();
    document.getElementById('dobras-id').value = "";
    document.getElementById('btn-cancel').style.display = "none";
}