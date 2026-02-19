import {Wheel} from 'https://cdn.jsdelivr.net/npm/spin-wheel@5.0.2/dist/spin-wheel-esm.js';

let girando = false;
let props = {
    items: [
        /*
        {
            label: 'Item 1',
            weight: 1,
            value: 'id-do-item'
        }
        */
    ],
    onRest: (e) => { //lança o evento quando a roleta está parada
        console.log("Vencedor: ", props.items[e.currentIndex].label + "!!!");
        girando = false;
    }
}

function getProps(){
    return props;
}

function createProps(lista_itens = ['item 1', 'item 2'], pesos = [1, 1]){
    for (let i = 0; i < lista_itens.length; i++){
        props.items.push({
            label: lista_itens[i],
            weight: pesos[i],
            value: `${Date.now() + (Math.random() * 1000).toFixed(0)}` //gera um id único para cada item
        });
    }
    return props;
}

function addToProps(prop, item, peso){
    prop.items.push({
        label: item,
        weight: peso,
        value: `${Date.now() + (Math.random() * 1000).toFixed(0)}`
    });
    return prop;
}

function deleteProps(itens_id){
    if (Array.isArray(itens_id) && itens_id.length > 0) {
        props.items = props.items.filter(item => !itens_id.includes(item.value));
        return props;
    } else {
        return props;
    }
}

function updateProps(lista_itens = [{item: 'item 1', peso: 1, id: null}]){
    for (let i = 0; i < lista_itens.length; i++) {
        if (lista_itens[i].id === null) break;
        
        const item = props.items.find(item => item.value === lista_itens[i].id);
        if (item) {
            item.label = lista_itens[i].item;
            item.weight = lista_itens[i].peso;
        }
    }
    return props;
}

function createRoleta(container, props){
    const roleta = new Wheel(container, props);
    return roleta;
}

function sorteio(peso, items){
    let random = Math.random() * peso; //Sorteia um número aleatório onde o máximo é o peso total

    for(let i = 0; i < items.length; i++){
        if (random < items[i].weight){ //Se random for menor que weight, significa que o item foi sorteado
            return i;
        }
        random -= items[i].weight; //Senão subtrai o weight do item do random
    }
}

async function girarRoleta(roleta, ease, duration, props, peso_total) {
    if (!girando){
        girando = true;
        
        let index_item = sorteio(peso_total, props.items); //sorteio do item
        roleta.spinToItem(index_item, duration, false, 5, 1, ease);
    }
}

export {createProps, addToProps, deleteProps, updateProps, getProps, createRoleta, girarRoleta};