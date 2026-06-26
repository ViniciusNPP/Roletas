import * as Roleta from './roleta-config.js';
import * as Util from './utils.js';

export function criarItem(div, nome, chance, id_item, cor = Util.GerarCor('off')) {
    if (div) {
        div.innerHTML += `
        <div class="item" id="item-${id_item}">
          
          <div id="cor-preview-${id_item}" class="cor-preview" style="background-color: ${cor}"></div>
          <input id="nome-item-${id_item}" class="nome-item" autocomplete="off" value="${nome}"></input>    
          <input type="number" id="chance-item-${id_item}" class="chance" autocomplete="off" value="${chance}" min=1 max=999></input>
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
    //Se passar um array de id, excluirá vários itens, senão excluirá um item
    if (Array.isArray(id)){
        //Verifica se o container é um array do mesmo tamanho que od id
        if (Array.from(container).length <= 1 || Array.from(container).length < id.length) throw new Error("Quantidade de containers inválido");
        
        id.forEach((id_item, index) => {
            props.items = props.items.filter(item => item.value !== id_item); //Remove o item do array de itens
            container[index].remove();
        });
    }
    else 
    {
        props.items = props.items.filter(item => item.value !== id); //Remove o item do array de itens
        container.remove();
    }

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
    const obj_rgb = (() => {
        if (cor_nova.includes('rgb')) {
            const rgb = cor_nova.match(/\d+/g).map(Number);
            return { r: rgb[0], g: rgb[1], b: rgb[2] };
        } else {
            return {r: 255, g: 255, b: 255};
        }
    })

    if (item) {
        item.backgroundColor = cor_nova;
    }

    Luminancia(roleta, obj_rgb(), props, id);
}

export function adicionarItem(roleta, props, container, gerar_item_automatico = true, item_novo = null, cor = Util.GerarCor('random')) {
    //console.log("Adicionando item...");
    if (gerar_item_automatico) {
        //console.log("Gerando item automático...");
        props = Roleta.addToProps(props, `Item ${props.items.length + 1}`, 1, Util.gerarId());
        criarItem(container, `Item ${props.items.length}`, 1, props.items[props.items.length - 1].value);
        
        container.querySelector(`#cor-preview-${props.items[props.items.length - 1].value}`).style.backgroundColor = cor; //Atualiza a cor do preview do item adicionado
        alterarCor(roleta, props, cor, props.items[props.items.length - 1].value); //Atualiza a cor do item adicionado
    }
    else {
        console.log("Adicionando via texto...");
        if (!item_novo) throw new Error("Item novo não fornecido"); //Lança um erro caso não tenha passado o item novo
        props = Roleta.addToProps(props, item_novo.label, item_novo.weight, item_novo.value);
        criarItem(container, item_novo.label, item_novo.weight, item_novo.value);

        container.querySelector(`#cor-preview-${item_novo.value}`).style.backgroundColor = cor;
        alterarCor(roleta, props, cor, item_novo.value);
    }

    roleta.init(props);
    Roleta.aplicarConfigRoleta(roleta);
}

export function adicionarMultiplos(roleta, props, container, novos_itens, cores) {
    if (!Array.isArray(novos_itens) || novos_itens.length === 0) return;
    if (!cores) cores = novos_itens.map(() => Util.GerarCor('random'));

    novos_itens.forEach((item, index) => {
        props = Roleta.addToProps(props, item.label, item.weight, item.value);
        criarItem(container, item.label, item.weight, item.value);

        container.querySelector(`#cor-preview-${item.value}`).style.backgroundColor = cores[index];
        alterarCor(roleta, props, cores[index], item.value);
    });

    roleta.init(props);
    Roleta.aplicarConfigRoleta(roleta);
}