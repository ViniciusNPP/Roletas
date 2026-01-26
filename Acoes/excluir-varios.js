import { excluir } from "./edicao.js";

function excluirVarios(pastas_excluir, div) {
    pastas_excluir.forEach((pasta) => {
        excluir(pasta, div);
        pasta.remove();
    });
}

function desselecionarPasta(checkmark_id, pasta_atual, pastas_excluir) {
    checkmark_id.style.opacity = '0';
    pasta_atual.style.opacity = '1';
    const index = pastas_excluir.indexOf(pasta_atual);
    if (index > -1) pastas_excluir.splice(index, 1);
}

function selecionarPasta(checkmark_id, pasta_atual, pastas_excluir) {
    checkmark_id.style.opacity = '1';
    pasta_atual.style.opacity = '0.5';
    pastas_excluir.push(pasta_atual);
}

function verificarSelecao(pasta_atual, pastas_excluir, aberto) {
    const checkmark_id = pasta_atual.querySelector('.checkmark');

    if (aberto) {
        if (checkmark_id.style.opacity === '0') {
            selecionarPasta(checkmark_id, pasta_atual, pastas_excluir);
        } else {
            desselecionarPasta(checkmark_id, pasta_atual, pastas_excluir);
        }

        contador_excluir.textContent = pastas_excluir.length;
    }
}

export { excluirVarios, verificarSelecao };