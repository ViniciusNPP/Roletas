import * as Data from '../Data/data.js';

function botaoFecharRenomear(input_nome_roleta, invalido){
    input_nome_roleta.value = '';

    if (input_nome_roleta.style.marginBottom == '0px'){
        input_nome_roleta.style.marginBottom = '40px';
        invalido.style.display = 'none';
    }
}

function renomearRoleta(input_nome_roleta, nome_exibido, nome_completo, invalido){
    if (input_nome_roleta.value){  
        nome_completo.textContent = input_nome_roleta.value;

        nome_exibido.textContent = input_nome_roleta.value.length > 15
            ? nome_exibido.textContent = input_nome_roleta.value.slice(0,14) + "..."
            : nome_exibido.textContent = input_nome_roleta.value;

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

export { botaoFecharRenomear, renomearRoleta};