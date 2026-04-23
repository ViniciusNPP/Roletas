import * as Roleta from './roleta-config.js';
import * as Util from './utils.js';

function criarItem(div, nome, chance, id_item) {
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

function alterarNome(roleta, props, nome_novo, id) {
    const item = props.items.find(item => item.value === id);
    if (item) {
        item.label = nome_novo;
    }

    roleta.init(props); //Reinicializa a roleta para atualizar os nomes dos itens
    Roleta.aplicarConfigRoleta(roleta);
}

function alterarChance(roleta, props, chance_nova, id) {
    const item = props.items.find(item => item.value === id);
    if (item) {
        item.weight = chance_nova;
    }

    roleta.init(props); //Reinicializa a roleta para atualizar as chances dos itens
    Roleta.aplicarConfigRoleta(roleta);
}

function excluirItem(roleta, props, container, id) {
    props.items = props.items.filter(item => item.value !== id); //Remove o item do array de itens

    container.remove();

    roleta.init(props); //Reinicializa a roleta para atualizar os itens
    Roleta.aplicarConfigRoleta(roleta);
}

function Luminancia(roleta, obj_rgb, props, id) {
    const item = props.items.find(item => item.value === id);
    if (item) {
        let { r, g, b } = obj_rgb;
        let luminancia = (r * 0.299) + (g * 0.587) + (b * 0.114)
        
        luminancia > 128 ? item.labelColor = '#000000' : item.labelColor = '#ffffff';
        roleta.init(props);
        Roleta.aplicarConfigRoleta(roleta);
    }
}

function alterarCor(roleta, props, cor_nova, id) {
    const item = props.items.find(item => item.value === id);
    if (item) {
        item.backgroundColor = cor_nova;
    }

    roleta.init(props); //Reinicializa a roleta para atualizar as cores dos itens
    Roleta.aplicarConfigRoleta(roleta);
}

function adicionarItem(roleta, props, container) {
    props = Roleta.addToProps(props, `Item ${props.items.length + 1}`, 1, Util.gerarId());
    criarItem(container, `Item ${props.items.length}`, 1, props.items[props.items.length - 1].value);

    roleta.init(props);
    Roleta.aplicarConfigRoleta(roleta);
}

export { criarItem, alterarCor, alterarNome, alterarChance, excluirItem, adicionarItem, Luminancia }