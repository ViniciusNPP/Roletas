function contextMenu(e, menu_options){
    let nome_roleta;
    let imagem_roleta;
    let checkmark_id;
    let elementoAtual;
    
    if (e.target.classList.contains('roleta') || e.target.parentNode.classList.contains('roleta')){
        
        e.preventDefault();
        menu_options.classList.remove('show');
    
    //Mostra o menu contexto na posição do cursor
    setTimeout(() => {
        menu_options.style.left = `${e.pageX}px`;
        menu_options.style.top = `${e.pageY}px`;
        menu_options.classList.add('show');
        }, 80)
    }
    else{
        menu_options.classList.remove('show');
    }

    if (e.target.classList.contains('roleta')){
        elementoAtual = e.target;

        nome_roleta = e.target.querySelector('span');
        imagem_roleta = e.target.querySelector('img');
        checkmark_id = e.target.querySelector('div');
    }
    else{
        elementoAtual = document.getElementById(e.target.parentNode.id);

        nome_roleta = e.target.parentNode.querySelector('span');
        imagem_roleta = e.target.parentNode.querySelector('img');
        checkmark_id = e.target.parentNode.querySelector('div');
    }

    return {elementoAtual, nome_roleta, imagem_roleta, checkmark_id};
}

function criarPasta(div, estado, img, nome_completo = 'Roleta '){
    if (nome_completo === 'Roleta '){
        nome_completo += estado.contador_nome;
    }

    div.innerHTML += `
                <div class="roleta" id="roleta-${estado.ID}">
                    <img src="${img}" alt="">
                    <h3>Roleta ${estado.contador_nome}</h3>
                    <div class="checkmark" id="checkmark-${estado.ID}"></div>
                    <span class="nome_completo" id="nome_completo">${nome_completo}</span>
                </div>
            `;
    estado.ID++;
    estado.contador_nome++;
}

function excluirPasta(div, estado){
    if (estado.elementoAtual){
        div.removeChild(estado.elementoAtual);
        estado.elementoAtual = null;
        estado.contador_nome--;
    }
}

export { contextMenu, criarPasta, excluirPasta };