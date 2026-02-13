import { excluir } from "./edicao.js";

function excluirVarios(pastas_excluir, div, save = true) {
    pastas_excluir.forEach((elem) => {
        excluir(elem, div, save);
        elem.remove();
    });
}

function desselecionarPasta(checkmark, pasta_atual, pastas_excluir) {
    checkmark.style.opacity = '0';
    pasta_atual.style.opacity = '1';
    const index = pastas_excluir.indexOf(pasta_atual);
    if (index > -1) pastas_excluir.splice(index, 1);
}

function selecionarPasta(checkmark, pasta_atual, pastas_excluir) {
    checkmark.style.opacity = '1';
    pasta_atual.style.opacity = '0.5';
    pastas_excluir.push(pasta_atual);
}

function verificarSelecao(pasta_atual, pastas_excluir, aberto) {
    const checkmark = pasta_atual.querySelector('.checkmark');

    if (aberto) {
        if (checkmark.style.opacity === '0') {
            selecionarPasta(checkmark, pasta_atual, pastas_excluir);
        } else {
            desselecionarPasta(checkmark, pasta_atual, pastas_excluir);
        }

        contador_excluir.textContent = pastas_excluir.length;
    }
}

export { excluirVarios, verificarSelecao, selecionarPasta };