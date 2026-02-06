import {Wheel} from 'https://cdn.jsdelivr.net/npm/spin-wheel@5.0.2/dist/spin-wheel-esm.js';
import * as easing from './libs/easing.js';

let girando = false;
//Cria os items na roleta
const props = {
    items: [
        {
            label: 'maçã',
            weight: 3
        },
        {
            label: 'banana',
            weight: 2
        },
        {
            label: 'abacaxi',
            weight: 1
        }
    ],
    onRest: (e) => { //lança o evento quando a roleta está parada
        console.log("Vencedor: ", props.items[e.currentIndex].label + "!!!");
        girando = false;
    }
};

//Cria a roleta em algum lugar do DOOM
const container = document.querySelector('.roleta-container');
const roleta = new Wheel(container, props);
const peso_total = props.items.reduce((total, item) => total + item.weight, 0); //calcula o peso total dos itens

//Configurações da roleta
roleta.isInteractive = false
roleta.itemLabelRadius = 0.6;
roleta.itemLabelRadiusMax = 0.35;
roleta.itemLabelRotation = 180;
roleta.itemLabelAlign = 'center';

function sorteio(peso, items){
    let random = Math.random() * peso; //Sorteia um número aleatório onde o máximo é o peso total

    for(let i = 0; i < items.length; i++){
        if (random < items[i].weight){ //Se random for menor que weight, significa que o item foi sorteado
            return i;
        }
        random -= items[i].weight; //Senão subtrai o weight do item do random
    }
}

const ease = easing.easeOutQuad; //animação da roleta
const duration = 5000; //tempo que ficará girando

async function girarRoleta() {
    let index_item = sorteio(peso_total, props.items); //sorteio do item
    roleta.spinToItem(index_item, duration, false, 5, 1, ease);
}

container.querySelector('.botao-roleta').addEventListener('click', () => {
    if (!girando){
        girarRoleta();
        girando = true;
    }
});