function contextMenu(e, menu_options, estado){
    if (e.target.classList.contains('roleta') || e.target.parentNode.classList.contains('roleta')){
        
        e.preventDefault();
        menu_options.classList.remove('show');
    
    //Mostra o menu contexto na posição do cursor
    setTimeout(() => {
        menu_options.style.left = `${e.pageX}px`;
        menu_options.style.top = `${e.pageY}px`;
        menu_options.classList.add('show');
        }, 80);

        if (e.target.classList.contains('roleta')){
            estado.elemento_atual = e.target;
            estado.nome_roleta = e.target.querySelector('span');
            estado.imagem_roleta = e.target.querySelector('img');
            estado.checkmark_id = e.target.querySelector('div');
        }
        else{
            estado.elemento_atual = document.getElementById(e.target.parentNode.id);
            estado.nome_roleta = e.target.parentNode.querySelector('span');
            estado.imagem_roleta = e.target.parentNode.querySelector('img');
            estado.checkmark_id = e.target.parentNode.querySelector('div');
        }
    }
    else{
        menu_options.classList.remove('show');
    }
}

export {contextMenu};