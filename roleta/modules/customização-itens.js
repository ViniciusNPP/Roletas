const valors_invalidos = ["%", "$", ".", ",", "+", ";", ":", "!", "?", "(", ")", "[", "]", "{", "}", "|", "\\", "/", "*", "&", "^", "%", "$", "#", "@", "~", "`"];

function criarItem(div, nome, chance, id_item){
    if (div){
        div.innerHTML += `
        <div class="item" id="item-${id_item}">
          
          <div id="cor-preview-${id_item}" class="cor-preview"></div>
          <input id="nome-item-${id_item}" class="nome-item" autocomplete="off" value="${nome}"></input>    
          <input type="number" id="chance-item-${id_item}" class="chance" autocomplete="off" value="${chance}"></input>
          <img class="excluir-item" id="excluir-item" src="../img/Trash.png"></img>
          
        </div>
        `
    }
}

function alterarCor(){

}

function alterarNome(roleta, props, nome_novo, id){
    const item = props.items.find(item => item.value === id);
    if (item){
        item.label = nome_novo;
    }

    roleta.init(props); //Reinicializa a roleta para atualizar os nomes dos itens
}

function alterarChance(roleta, props, chance_nova, id){
    const item = props.items.find(item => item.value === id);
    if (item){
        item.weight = chance_nova;
    }
    
    roleta.init(props); //Reinicializa a roleta para atualizar as chances dos itens
}

function excluirItem(roleta, props, id){
    props.items = props.items.filter(item => item.value !== id); //Remove o item do array de itens
    roleta.init(props); //Reinicializa a roleta para atualizar os itens
}

function adicionarItem(){

}

export { criarItem, alterarCor, alterarNome, alterarChance, excluirItem, adicionarItem }