const API_URL = "http://localhost:8080/circunferencias";
const ALUNOS_API = "http://localhost:8080/aluno";

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

    const alunoId = document.getElementById('aluno-id').value;

    const dados = {
        data: document.getElementById('data').value,
        altura: +document.getElementById('altura').value,
        peso: +document.getElementById('peso').value,
        ombro: +document.getElementById('ombro').value,
        cintura: +document.getElementById('cintura').value,
        quadril: +document.getElementById('quadril').value,
        peitoral: +document.getElementById('peitoral').value,
        abdommen: +document.getElementById('abdommen').value,

        coxaProximalEsquerda: +document.getElementById('coxaProximalEsquerda').value,
        coxaProximalDireita: +document.getElementById('coxaProximalDireita').value,
        coxaMedialEsquerda: +document.getElementById('coxaMedialEsquerda').value,
        coxaMedialDireita: +document.getElementById('coxaMedialDireita').value,
        coxaDistalEsquerda: +document.getElementById('coxaDistalEsquerda').value,
        coxaDistalDireita: +document.getElementById('coxaDistalDireita').value,

        panturrilhaEsquerda: +document.getElementById('panturrilhaEsquerda').value,
        panturrilhaDireita: +document.getElementById('panturrilhaDireita').value,

        bracoRelaxadoEsquerdo: +document.getElementById('bracoRelaxadoEsquerdo').value,
        bracoRelaxadoDireito: +document.getElementById('bracoRelaxadoDireito').value,
        bracoContraidoEsquerdo: +document.getElementById('bracoContraidoEsquerdo').value,
        bracoContraidoDireito: +document.getElementById('bracoContraidoDireito').value,

        antebraçoEsquerdo: +document.getElementById('antebraçoEsquerdo').value,
        antebraçoDireito: +document.getElementById('antebraçoDireito').value,

        aluno: { id: alunoId }
    };

    const method = avaliacaoEditandoId ? "PUT" : "POST";
    const url = avaliacaoEditandoId ? `${API_URL}/${avaliacaoEditandoId}` : API_URL;

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    alert("Avaliação salva com sucesso!");
    resetForm();
    carregarEvolucao();
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
        ["Peso", "peso"], ["Altura", "altura"], ["Ombro", "ombro"], ["Peitoral", "peitoral"],
        ["Cintura", "cintura"], ["Abdômen", "abdommen"], ["Quadril", "quadril"],
        ["Braço Relax E", "bracoRelaxadoEsquerdo"], ["Braço Relax D", "bracoRelaxadoDireito"],
        ["Braço Contr E", "bracoContraidoEsquerdo"], ["Braço Contr D", "bracoContraidoDireito"],
        ["Antebraço E", "antebraçoEsquerdo"], ["Antebraço D", "antebraçoDireito"],
        ["Coxa Prox E", "coxaProximalEsquerda"], ["Coxa Prox D", "coxaProximalDireita"],
        ["Coxa Med E", "coxaMedialEsquerda"], ["Coxa Med D", "coxaMedialDireita"],
        ["Coxa Dist E", "coxaDistalEsquerda"], ["Coxa Dist D", "coxaDistalDireita"],
        ["Panturrilha E", "panturrilhaEsquerda"], ["Panturrilha D", "panturrilhaDireita"]
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
async function editar(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const a = await response.json();

    avaliacaoEditandoId = id;

    document.getElementById('aluno-id').value = a.aluno.id;
    document.getElementById('data').value = a.data;

    Object.keys(a).forEach(k => {
        if (document.getElementById(k)) {
            document.getElementById(k).value = a[k];
        }
    });

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
    avaliacaoEditandoId = null;
    document.getElementById('circ-form').reset();
}

// =====================
// DATA
// =====================
function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR");
}
