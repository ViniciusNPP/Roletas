import { deleteLocalStorage, createLocalStorage } from "../Data/data.js";

//#region Pasta
function criarPasta(doc, cont, img, nome_completo = 'Pasta '){
    if (nome_completo === 'Pasta '){
        nome_completo += cont;
    }

    let id = `pasta-${Date.now()}`;
    let checkmark_id = id.replace('pasta', 'checkmark');

    doc.innerHTML += `
                <div class="pasta" id="${id}">
                    <img src="${img}" alt="" class="foto">
                    <h3>Pasta ${cont}</h3>
                    <div class="checkmark" id="${checkmark_id}" style="opacity: 0"></div>
                    <span class="nome_completo" id="nome_completo">${nome_completo}</span>
                </div>
            `;

    createLocalStorage('pastas');
}
//NAO EXCLUI QUANDO TODOS OS ELEMENTOS, DEIXA 1 PARA TRÁS
function excluir(elem, div, save=true){
    if (elem){
        div.removeChild(elem);
        
        if (save) {
            deleteLocalStorage(elem.id);
        }
    }
}
//#endregion

//#region Roleta
function criarRoleta(doc, cont, img, nome_completo = 'Pasta '){
    if (nome_completo === 'Pasta '){
        nome_completo += cont;
    }

    let id = `roleta-${Date.now()}`;
    let checkmark_id = id.replace('roleta', 'checkmark');
    
    doc.innerHTML += `
        <div class="roleta" id="${id}">
            
        <img src="${img}" class="foto">
            <h3>Pasta ${cont}</h3>
            <div class="menu_roleta" id="menu_roleta">
                <div class="container_editar container" id="container_editar">
                    <img class="editar_roleta" src="img/Pen.png">
                </div>
                <div class="container_excluir container" id="container_excluir">
                    <img class="excluir_roleta" src="img/Trash.png">
                </div>
            </div>
            <div class="checkmark" id="${checkmark_id}"></div>
            <span class="nome_completo" id="nome_completo">${nome_completo}</span>

        </div>
    `;

    createLocalStorage('roletas', true, );
}


//#endregion
export { criarPasta, excluir, criarRoleta };