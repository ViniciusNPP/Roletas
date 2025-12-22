import { salvarPastasLocal } from "../Data/data.js";
import { UI , estado } from "../menu/menu.js";

function abrirExcluirVarios(pastas_excluir, contador_excluir) {
    UI.header_excluir.style.opacity = '1';
    UI.header_excluir.style.height = '100px';
    UI.menu_options.classList.remove('show');

    estado.checkmark_id.style.opacity = '1';
    estado.elemento_atual.style.opacity = '0.5';
    estado.aberto_excluir_varios = true;

    pastas_excluir.push(estado.elemento_atual);
    contador_excluir.textContent = `${pastas_excluir.length}`;
}

function fecharExcluirVarios(pastas_excluir){
    const checkmark_class = UI.roletas.getElementsByClassName('checkmark');
    
    UI.header_excluir.style.opacity = '0';
    UI.header_excluir.style.height = '0px';

    for (let i = 0; i < checkmark_class.length; i++){
        checkmark_class[i].style.opacity = '0';
    }
    pastas_excluir.forEach((pasta) => {
        pasta.style.opacity = '1';
    });

    estado.aberto_excluir_varios = false;
}

function excluirVarios(pastas_excluir) {
    pastas_excluir.forEach((pasta) => {
        pasta.remove();
        estado.contador_nome--;
    });
    UI.aberto_excluir_varios = false;

    salvarPastasLocal(document.querySelectorAll('.roleta'));
    fecharExcluirVarios(pastas_excluir);
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

function verificarSelecao(pasta_atual, pastas_excluir) {
    const checkmark_id = pasta_atual.querySelector('.checkmark');

    if (estado.aberto_excluir_varios) {
        if (checkmark_id.style.opacity === '0') {
            selecionarPasta(checkmark_id, pasta_atual, pastas_excluir);
        } else {
            desselecionarPasta(checkmark_id, pasta_atual, pastas_excluir);
        }

        contador_excluir.textContent = pastas_excluir.length;
        if (pastas_excluir.length === 0) fecharExcluirVarios(pastas_excluir);
    }
}

export { abrirExcluirVarios, excluirVarios, desselecionarPasta, selecionarPasta, verificarSelecao, fecharExcluirVarios };