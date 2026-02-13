import * as Roleta from './modules/criacao-roleta.js';
import * as easing from './libs/easing.js';

const container = document.querySelector('.roleta-container');

const props = Roleta.createProps(
    ['Maçã', 'Banana', 'Abobora'],
    [5, 3, 2]
);
const roleta = Roleta.createRoleta(container, props);
const peso_total = props.items.reduce((total, item) => total + item.weight, 0); //calcula o peso total dos itens

const ease = easing.easeOutQuad; //animação da roleta
const duration = 5000; //tempo que ficará girando

//Configurações da roleta
roleta.isInteractive = false
roleta.itemLabelRadius = 0.6;
roleta.itemLabelRadiusMax = 0.35;
roleta.itemLabelRotation = 180;
roleta.itemLabelAlign = 'center';

container.querySelector('.botao-roleta').addEventListener('click', () => {
    Roleta.girarRoleta(roleta, ease, duration, props, peso_total);
});