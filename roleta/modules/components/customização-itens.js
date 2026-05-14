import * as Roleta from './roleta-config.js';
import * as Util from './utils.js';

export function criarItem(div, nome, chance, id_item) {
    if (div) {
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

export function alterarNome(roleta, props, nome_novo, id, container_items) {
    const item = props.items.find(item => item.value === id);
    if (item) {
        item.label = nome_novo;
    }

    const input = container_items.querySelector(`#nome-item-${id}`);
    input.setAttribute('value', nome_novo);

    roleta.init(props); //Reinicializa a roleta para atualizar os nomes dos itens
    Roleta.aplicarConfigRoleta(roleta);
}

export function alterarChance(roleta, props, chance_nova, id, container_items) {
    const item = props.items.find(item => item.value === id);
    if (item) {
        item.weight = chance_nova;
    }

    const input = container_items.querySelector(`#chance-item-${id}`);
    input.setAttribute('value', chance_nova);

    roleta.init(props); //Reinicializa a roleta para atualizar as chances dos itens
    Roleta.aplicarConfigRoleta(roleta);
}

export function excluirItem(roleta, props, container, id) {
    props.items = props.items.filter(item => item.value !== id); //Remove o item do array de itens

    container.remove();

    roleta.init(props); //Reinicializa a roleta para atualizar os itens
    Roleta.aplicarConfigRoleta(roleta);
}

export function Luminancia(roleta, obj_rgb, props, id) {
    const item = props.items.find(item => item.value === id);
    if (item) {
        let { r, g, b } = obj_rgb;
        let luminancia = (r * 0.299) + (g * 0.587) + (b * 0.114)
        
        luminancia > 128 ? item.labelColor = '#000000' : item.labelColor = '#ffffff';
        roleta.init(props);
        Roleta.aplicarConfigRoleta(roleta);
    }
}

export function alterarCor(roleta, props, cor_nova, id) {
    const item = props.items.find(item => item.value === id);
    if (item) {
        item.backgroundColor = cor_nova;
    }

    roleta.init(props); //Reinicializa a roleta para atualizar as cores dos itens
    Roleta.aplicarConfigRoleta(roleta);
}

export function adicionarItem(roleta, props, container, gerar_item_automatico = true, item_novo = null) {
    if (gerar_item_automatico) {
        props = Roleta.addToProps(props, `Item ${props.items.length + 1}`, 1, Util.gerarId());
        criarItem(container, `Item ${props.items.length}`, 1, props.items[props.items.length - 1].value);
    }
    else {
        if (!item_novo) throw new Error("Item novo não fornecido"); //Lança um erro caso não tenha passado o item novo
        criarItem(container, item_novo.label, item_novo.weight, item_novo.value);
    }
    

    roleta.init(props);
    Roleta.aplicarConfigRoleta(roleta);
}

export function addMultItems(roleta, props, container, items) {

}