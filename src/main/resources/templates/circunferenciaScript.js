const API_URL = "/circunferencias";
const ALUNOS_API = "/aluno";

let avaliacaoEditandoId = null;

// =====================
// CARREGAMENTO INICIAL
// =====================
window.onload = async () => {
    await carregarListaAlunos();
};

// =====================
// CARREGAR ALUNOS
// =====================
async function carregarListaAlunos() {
    const response = await fetch(ALUNOS_API);
    const alunos = await response.json();

    const selForm = document.getElementById('aluno-id');
    const selSearch = document.getElementById('aluno-id-search');

    selForm.innerHTML = '<option value="" disabled selected>Selecione um aluno...</option>';
    selSearch.innerHTML = '<option value="">Selecione um aluno...</option>';

    alunos.forEach(a => {
        const opt = `<option value="${a.id}">${a.nome}</option>`;
        selForm.innerHTML += opt;
        selSearch.innerHTML += opt;
    });
}

// =====================
// SALVAR / EDITAR
// =====================
document.getElementById('circ-form').addEventListener('submit', salvarCircunferencia);

async function salvarCircunferencia(event) {
    event.preventDefault();

    const id = document.getElementById('circ-id').value;
    const alunoId = document.getElementById('aluno-id').value;

    const dados = {
        data: document.getElementById('data').value,
        peso: parseFloat(document.getElementById('peso').value),
        altura: parseFloat(document.getElementById('altura').value),
        ombro: parseFloat(document.getElementById('ombro').value),
        peitoral: parseFloat(document.getElementById('peitoral').value),
        cintura: parseFloat(document.getElementById('cintura').value),
        abdommen: parseFloat(document.getElementById('abdommen').value),
        quadril: parseFloat(document.getElementById('quadril').value),
        bracoRelaxadoEsquerdo: parseFloat(document.getElementById('bracoRelaxadoEsquerdo').value),
        bracoRelaxadoDireito: parseFloat(document.getElementById('bracoRelaxadoDireito').value),
        bracoContraidoEsquerdo: parseFloat(document.getElementById('bracoContraidoEsquerdo').value),
        bracoContraidoDireito: parseFloat(document.getElementById('bracoContraidoDireito').value),
        antebraçoEsquerdo: parseFloat(document.getElementById('antebraçoEsquerdo').value),
        antebraçoDireito: parseFloat(document.getElementById('antebraçoDireito').value),
        coxaProximalEsquerda: parseFloat(document.getElementById('coxaProximalEsquerda').value),
        coxaProximalDireita: parseFloat(document.getElementById('coxaProximalDireita').value),
        coxaMedialEsquerda: parseFloat(document.getElementById('coxaMedialEsquerda').value),
        coxaMedialDireita: parseFloat(document.getElementById('coxaMedialDireita').value),
        coxaDistalEsquerda: parseFloat(document.getElementById('coxaDistalEsquerda').value),
        coxaDistalDireita: parseFloat(document.getElementById('coxaDistalDireita').value),
        panturrilhaEsquerda: parseFloat(document.getElementById('panturrilhaEsquerda').value),
        panturrilhaDireita: parseFloat(document.getElementById('panturrilhaDireita').value),
        aluno: { id: parseInt(alunoId) }
    };

    // Define se é atualização ou criação
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert(id ? "Avaliação atualizada!" : "Avaliação salva!");
            resetForm(); // Limpa o formulário e o ID oculto
            carregarEvolucao(); // Atualiza a tabela
        } else {
            alert("Erro ao salvar dados.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão com o servidor.");
    }
}

// =====================
// CARREGAR EVOLUÇÃO
// =====================
async function carregarEvolucao() {
    const alunoId = document.getElementById('aluno-id-search').value;
    if (!alunoId) return;

    const response = await fetch(`${API_URL}/aluno/${alunoId}`);
    const lista = await response.json();
    renderizarTabela(lista);
}

// =====================
// RENDERIZAR TABELA (TODOS OS CAMPOS)
// =====================
function renderizarTabela(lista) {
    const container = document.getElementById('tabela-container');
    if (!lista || lista.length === 0) {
        container.innerHTML = "<p>Nenhuma avaliação cadastrada.</p>";
        return;
    }

    // 1. Ordenar por data
    lista.sort((a, b) => new Date(a.data) - new Date(b.data));

    // 2. Mapeamento de campos (Título amigável vs Nome no Banco)
    const campos = [
        ["Peso", "peso"], ["Altura", "altura"],["IMC", "imc"], ["Ombro", "ombro"], ["Peitoral", "peitoral"],
        ["Cintura", "cintura"], ["Abdômen", "abdommen"], ["Quadril", "quadril"],
        ["Braço Relaxado Esquerdo", "bracoRelaxadoEsquerdo"], ["Braço Relaxado Direito", "bracoRelaxadoDireito"],
        ["Braço Contraído Esquerdo", "bracoContraidoEsquerdo"], ["Braço Contraído Direito", "bracoContraidoDireito"],
        ["Antebraço Esquerdo", "antebraçoEsquerdo"], ["Antebraço Direito", "antebraçoDireito"],
        ["Coxa Proximal Esquerda", "coxaProximalEsquerda"], ["Coxa Proximal Direita", "coxaProximalDireita"],
        ["Coxa Medial Esquerda", "coxaMedialEsquerda"], ["Coxa Medial Direita", "coxaMedialDireita"],
        ["Coxa Distal Esquerda", "coxaDistalEsquerda"], ["Coxa Distal Direita", "coxaDistalDireita"],
        ["Panturrilha Esquerda", "panturrilhaEsquerda"], ["Panturrilha Direita", "panturrilhaDireita"]
    ];

    let html = `<table class="evolution-table"><thead><tr><th class="param-column">Medidas</th>`;

    // Montar Cabeçalho com Datas e Botões
    lista.forEach(item => {
        const dataFmt = new Date(item.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
        html += `
            <th>
                <div class="header-content">
                    <span class="header-date">${dataFmt}</span>
                    <div class="header-actions">
                        <button class="btn-edit-header" onclick='prepararEdicao(${JSON.stringify(item)})'>Editar</button>
                        <button class="btn-delete-header" onclick="excluir(${item.id})">Excluir</button>
                    </div>
                </div>
            </th>`;
    });
    html += `</tr></thead><tbody>`;

    // Montar Linhas de Medidas (Verticalmente)
    campos.forEach(campo => {
        html += `<tr><td class="param-column">${campo[0]}</td>`;
        
        lista.forEach((aval, index) => {
            let valorAtual = aval[campo[1]];
            let diffHtml = "";

            // Lógica de Diferença (comparando com a avaliação anterior)
            if (index > 0) {
                let valorAnterior = lista[index - 1][campo[1]];
                let diff = (valorAtual - valorAnterior).toFixed(1);
                if (diff != 0) {
                    let classe = diff > 0 ? "diff-pos" : "diff-neg";
                    diffHtml = `<span class="diff-text ${classe}">${diff > 0 ? '+' : ''}${diff}</span>`;
                }
            }

            html += `<td>
                        <div class="value-container">
                            ${valorAtual} ${diffHtml}
                        </div>
                     </td>`;
        });
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

// =====================
// EDITAR
// =====================
function prepararEdicao(item) {
    // 1. Preenche o ID oculto para o script saber que é uma edição
    document.getElementById('circ-id').value = item.id;

    // 2. Muda o título do formulário para dar feedback visual
    document.getElementById('form-title').textContent = "Editando Avaliação";

    // 3. Preenche os campos básicos
    document.getElementById('aluno-id').value = item.aluno.id;
    document.getElementById('data').value = item.data;
    document.getElementById('peso').value = item.peso;
    document.getElementById('altura').value = item.altura;

    // 4. Preenche as medidas de tronco
    document.getElementById('ombro').value = item.ombro;
    document.getElementById('peitoral').value = item.peitoral;
    document.getElementById('cintura').value = item.cintura;
    document.getElementById('abdommen').value = item.abdommen;
    document.getElementById('quadril').value = item.quadril;

    // 5. Preenche membros superiores
    document.getElementById('bracoRelaxadoEsquerdo').value = item.bracoRelaxadoEsquerdo;
    document.getElementById('bracoRelaxadoDireito').value = item.bracoRelaxadoDireito;
    document.getElementById('bracoContraidoEsquerdo').value = item.bracoContraidoEsquerdo;
    document.getElementById('bracoContraidoDireito').value = item.bracoContraidoDireito;
    document.getElementById('antebraçoEsquerdo').value = item.antebraçoEsquerdo;
    document.getElementById('antebraçoDireito').value = item.antebraçoDireito;

    // 6. Preenche membros inferiores
    document.getElementById('coxaProximalEsquerda').value = item.coxaProximalEsquerda;
    document.getElementById('coxaProximalDireita').value = item.coxaProximalDireita;
    document.getElementById('coxaMedialEsquerda').value = item.coxaMedialEsquerda;
    document.getElementById('coxaMedialDireita').value = item.coxaMedialDireita;
    document.getElementById('coxaDistalEsquerda').value = item.coxaDistalEsquerda;
    document.getElementById('coxaDistalDireita').value = item.coxaDistalDireita;
    document.getElementById('panturrilhaEsquerda').value = item.panturrilhaEsquerda;
    document.getElementById('panturrilhaDireita').value = item.panturrilhaDireita;

    // 7. Mostra o botão de cancelar (opcional, mas recomendado)
    const btnCancel = document.getElementById('btn-cancel');
    if (btnCancel) btnCancel.style.display = "inline-block";

    // 8. Rola a tela para o topo para o usuário ver o formulário preenchido
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =====================
// EXCLUIR
// =====================
async function excluir(id) {
    if (!confirm("Deseja excluir esta avaliação?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    carregarEvolucao();
}

// =====================
// RESET
// =====================
function resetForm() {
    document.getElementById('circ-form').reset();
    document.getElementById('circ-id').value = "";
    document.getElementById('form-title').textContent = "Nova Avaliação";
    
    const btnCancel = document.getElementById('btn-cancel');
    if (btnCancel) btnCancel.style.display = "none";
}

// =====================
// DATA
// =====================
function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR");
}
