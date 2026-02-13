function botaoFecharRenomear(input_nome_pasta, invalido){
    input_nome_pasta.value = '';

    if (input_nome_pasta.style.marginBottom == '0px'){
        input_nome_pasta.style.marginBottom = '40px';
        invalido.style.display = 'none';
    }
}

function renomearPasta(input_nome_pasta, nome_exibido, nome_completo, invalido){
    if (input_nome_pasta.value){  
        nome_completo.textContent = input_nome_pasta.value;

        nome_exibido.textContent = input_nome_pasta.value.length > 15
            ? nome_exibido.textContent = input_nome_pasta.value.slice(0,14) + "..."
            : nome_exibido.textContent = input_nome_pasta.value;

        if (input_nome_pasta.style.marginBottom === '0px'){
            input_nome_pasta.style.marginBottom = '40px';
            invalido.style.display = 'none';
        }
        }
    else{
        input_nome_pasta.style.marginBottom = '0px';
        invalido.style.display = 'block';
    }
}

export { botaoFecharRenomear, renomearPasta};