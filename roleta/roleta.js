import {Wheel} from 'https://cdn.jsdelivr.net/npm/spin-wheel@5.0.2/dist/spin-wheel-esm.js';
import * as easing from './libs/easing.js';

//Cria os items na roleta
const props = {
    items: [
        {
            label: 'maçã',
        },
        {
            label: 'banana'
        },
        {
            label: 'abacaxi'
        }
    ]
};

//Cria a roleta em algum lugar do DOOM
const container = document.querySelector('.roleta-container');
const roleta = new Wheel(container, props);
roleta.isInteractive = false;

console.log(roleta.items)