import * as Data from '../Data/data.js';

function abrirJanelaRenomear(UI, estado, input_nome_roleta){
    UI.janela_renomear.style.display = 'flex';
    UI.menu_options.classList.remove('show');

    input_nome_roleta.value = estado.nome_roleta.textContent;

    UI.opacidade.style.display = 'block';
}

function botaoFecharRenomear(UI, estado, input_nome_roleta, invalido){
    UI.janela_renomear.style.display = 'none';
        UI.opacidade.style.display = 'none';
        input_nome_roleta.value = '';

        if (input_nome_roleta.style.marginBottom == '0px'){
            input_nome_roleta.style.marginBottom = '40px';
            invalido.style.display = 'none';
        }
}

function renomearRoleta(UI, estado, input_nome_roleta, invalido){
    if (input_nome_roleta.value){  
        estado.elemento_atual.querySelector('#nome_completo').textContent = input_nome_roleta.value;
        const nome_exibido = estado.elemento_atual.querySelector('h3');

        nome_exibido.textContent = input_nome_roleta.value.length > 15
            ? nome_exibido.textContent = input_nome_roleta.value.slice(0,14) + "..."
            : nome_exibido.textContent = input_nome_roleta.value;

        UI.janela_renomear.style.display = 'none';
        UI.opacidade.style.display = 'none';

        if (input_nome_roleta.style.marginBottom === '0px'){
            input_nome_roleta.style.marginBottom = '40px';
            invalido.style.display = 'none';
        }
        }
    else{
        input_nome_roleta.style.marginBottom = '0px';
        invalido.style.display = 'block';
    }

    Data.salvarPastasLocal(document.querySelectorAll('.roleta'));
}

export {abrirJanelaRenomear, botaoFecharRenomear, renomearRoleta};