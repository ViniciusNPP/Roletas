function contextMenu(e, menu_options){

    e.preventDefault();
    menu_options.classList.remove('show');

//Mostra o menu contexto na posição do cursor
    setTimeout(() => {
        menu_options.style.left = `${e.pageX}px`;
        menu_options.style.top = `${e.pageY}px`;
        menu_options.classList.add('show');
    }, 80);

}

export {contextMenu};