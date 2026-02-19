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

function alterarNome(){

}

function alterarChance(texto){
    if (!texto.includes(valors_invalidos)){ //verifica se o texto não contém caracteres inválidos
        const chance = parseInt(texto);
        
        if (!isNaN(chance) || chance > 0){ //verifica se o texto é um número, se é maior que 0 e se tem menos de 4 caracteres (para não sumir no input)
            //FAZER A LÓGICA PARA ATUALIZAR A CHANCE DO ITEM
            return chance;
        }
        else if (isNaN(chance)) return texto.slice(0, -1);//Corta a parte inválida do texto
        else if (chance <= 0) return "1"; //Retorna o valor padrão
    }
    return texto.slice(0, -1);
}

function excluirItem(){

}

function adicionarItem(){

}

export { criarItem, alterarCor, alterarNome, alterarChance, excluirItem, adicionarItem }