//Retorna uma array de dicionários com os dados das pastas salvas no localStorage
//id_pasta: usado para aceessar uma pasta específica
//dentro_da_pasta: se true, acessa as roletas dentro da pasta especificada por id_pasta
//id_roleta: acessar uma roleta específica dentro da pasta
//#region Read
function readLocalStorage(id_pasta = null, dentro_da_pasta = false, id_roleta = null){
    let data =  JSON.parse(localStorage.getItem('pastas')); //Pega todas as pastas do localStorage
    data = id_pasta ? data.find(p => p.id === id_pasta) : data; //Se id_pasta != null/undefined, pega a pasta específica

    if (dentro_da_pasta && id_pasta){
        const roletas = data.dentro;
        const roleta = id_roleta ? roletas.find(r => r.id === id_roleta) : roletas; //Se id_roleta != null/undefined, pega a roleta específica

        return roleta;
    }
    return data;
}
//#endregion

//Autualiza os dados de uma pasta/roleta no localStorage
//elemento: elemento HTML da pasta/roleta que foi alterada
//id_pasta: id da pasta que foi alterada
//dentro_da_pasta: se a pasta/roleta está dentro de uma pasta
//id_roleta: id da roleta que foi alterada (necessário apenas se dentro_da_pasta for true)
//#region Update
function updateLocalStorage(elemento, id_pasta, dentro_da_pasta = false, id_roleta = null){
    let pastas = readLocalStorage(); //Todos os dados do localStorage
    let data = readLocalStorage(id_pasta, dentro_da_pasta, id_roleta); //Pega somente 1 pasta/roleta do localStorage

    //Faz a atualização dos dados conforme o que foi alterado
    Object.keys(data).forEach(key => {
        switch (key){
            case 'nome': 
                data.nome = elemento.querySelector('h3').textContent;
                break;
            case 'nome_completo':
                data.nome_completo = elemento.querySelector('span').textContent;
                break;
            case 'img':
                data.img = elemento.querySelector('.foto').src;
                break;
            case 'id':
                data.id = elemento.id;
                break;
        }
    });

    //Atualiza o elemento no localStorage
    if (!dentro_da_pasta){
        pastas = pastas.map(p => {
            return p.id === data.id ? data : p;
        });
    }
    else {
        const index = pastas.findIndex(p => p.id === id_pasta); //acha o index da pasta em que a roleta está
        if (index !== -1){
            pastas[index].dentro = pastas[index].dentro.map(r => { //mapeia as roletas dentro da pasta específica
                return r.id === data.id ? data : r;
            });
        }
    }
    localStorage.setItem('pastas', JSON.stringify(pastas));
}
//#endregion

//Remove uma pasta/roleta do localStorage
//id_pasta: id da pasta que será removida
//dentro_da_pasta: se a pasta/roleta está dentro de uma pasta
//id_roleta: id da roleta que será removida (necessário apenas se dentro_da_pasta for true)
//#region Delete
function deleteLocalStorage(id_pasta, dentro_da_pasta = false, id_roleta = null){
    let pastas = readLocalStorage(); //Todos os dados do localStorage
    let data = readLocalStorage(id_pasta, dentro_da_pasta, id_roleta); //Pega somente 1 pasta/roleta do localStorage

    //Remove o elemento do localStorage
    if (!dentro_da_pasta){
        pastas = pastas.filter(p => p.id !== data.id); //filtra os elementos que não são o elemento a ser removido
    }
    else {
        const index = pastas.findIndex(p => p.id === id_pasta);//acha a pasta em que está o elemento a ser removido
        if (index !== -1) { //-1 significa que não encontrou a pasta
            pastas[index].dentro = pastas[index].dentro.filter(d => d.id !== data.id); //filtra os elementos que não são o elemento a ser removido dentro da pasta
        }
    }

    localStorage.setItem('pastas', JSON.stringify(pastas));
}
//#endregion

//Cria uma nova pasta/roleta no localStorage
//nome_container: id do container onde a pasta/roleta foi criada ('pastas' ou 'roletas')
//dentro_da_pasta: se a pasta/roleta foi criada dentro de uma pasta
//id_pasta: id da pasta onde a roleta foi criada (necessário apenas se dentro_da_pasta for true)
//#region Create
function createLocalStorage(nome_container, dentro_da_pasta = false, id_pasta = null){
    let pastas = readLocalStorage() || []; //Pega todas as pastas do localStorage ou inicia array vazio
    const elem = document.getElementById(nome_container).lastElementChild; //Pega o container de pastas/roletas

    //Captura os elementos do último elemento criado
    let nome, nome_completo, img, id;
    nome = elem.querySelector('h3').textContent;
    nome_completo = elem.querySelector('span').textContent;
    img = elem.querySelector('.foto').src;
    id = elem.id;

    //Adiciona uma pasta no array de pastas no localStorage
    if (!dentro_da_pasta){
        pastas.push({dentro: [], nome, img, nome_completo, id});//Adiciona a nova pasta na array de pastas
    }

    //Adiciona uma roleta dentro de uma pasta específica (dentro_da_pasta = true e id_pasta != null)
    else {
        const index = pastas.findIndex(p => p.id === id_pasta); //Acha o índice da pasta específica
        if (index !== -1) {
            pastas[index].dentro.push({nome, img, nome_completo, id});//Atualiza a pasta específica dentro da array de pastas
        }
    }   
    
    localStorage.setItem('pastas', JSON.stringify(pastas));//Salva no localStorage
}
//#endregion

//Constroi as pastas salvas no localStorage
function carregarPastasLocal(document, pastas){
    if (pastas){
        
        pastas.forEach((pasta) => {
            
            document.innerHTML += `
                <div class="pasta" id="${pasta.id}">
                    <img src="${pasta.img}" class="foto">
                    <h3>${pasta.nome}</h3>
                    <div class="checkmark" id="checkmark-${pasta.id}" style="opacity: 0"></div>
                    <span class="nome_completo" id="nome_completo">${pasta.nome_completo}</span>
                </div>
            `;
        });
    }
}

//Constroi as roletas salvas no localStorage
function carregarRoletasLocal(document, roletas){
    if (roletas){
        
        roletas.forEach((roleta) => {
            
            document.innerHTML += `
            <div class="roleta" id="${roleta.id}">
                
                <img src="${roleta.img}" class="foto">
                <h3>${roleta.nome}</h3>
                <div class="menu_roleta" id="menu_roleta">
                    <div class="container_editar container" id="container_editar">
                        <img class="editar_roleta" src="img/Pen.png">
                    </div>
                    <div class="container_excluir container" id="container_excluir">
                        <img class="excluir_roleta" src="img/Trash.png">
                    </div>
                </div>
                <div class="checkmark" id="${roleta.id}" style="opacity: 0"></div>
                <span class="nome_completo" id="nome_completo">${roleta.nome_completo}</span>

            </div>
            `
        });
    }
}

export { carregarPastasLocal, carregarRoletasLocal, updateLocalStorage, createLocalStorage, deleteLocalStorage };