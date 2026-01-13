import { salvarPastasLocal } from "../Data/data.js";

//#region Pasta
function criarPasta(doc, cont, img, save, nome_completo = 'Roleta '){
    if (nome_completo === 'Roleta '){
        nome_completo += cont;
    }

    let id = `roleta-${Date.now()}`;
    let checkmark_id = id.replace('roleta', 'checkmark');

    doc.innerHTML += `
                <div class="roleta" id="${id}">
                    <img src="${img}" alt="">
                    <h3>Roleta ${cont}</h3>
                    <div class="checkmark" id="${checkmark_id}" style="opacity: 0"></div>
                    <span class="nome_completo" id="nome_completo">${nome_completo}</span>
                </div>
            `;

    salvarPastasLocal(document.querySelectorAll(save));
}
//NAO EXCLUI QUANDO TODOS OS ELEMENTOS, DEIXA 1 PARA TRÁS
function excluir(elem, div, save){
    if (elem){
        div.removeChild(elem);
    }
    salvarPastasLocal(document.querySelectorAll(save));
}
//#endregion

//#region Roleta
function criarRoleta(doc, cont, img, nome_completo = 'Roleta '){
    if (nome_completo === 'Roleta '){
        nome_completo += cont;
    }

    let id = `arquivo-${Date.now()}`;
    let checkmark_id = id.replace('arquivo', 'checkmark');
    
    doc.innerHTML += `
        <div class="arquivo" id="${id}">
            <img src="${img}" class="foto_roleta">
            <h3>Roleta ${cont}</h3>
            <div class="menu_arquivo" id="menu_arquivo">
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
}


//#endregion
export { criarPasta, excluir, criarRoleta };