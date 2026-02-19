import * as Roleta from './modules/criacao-roleta.js';
import * as CustomItem from './modules/customização-itens.js';
import * as easing from './libs/easing.js';

const container = document.querySelector('.roleta-container'); //Onde a roleta é criada
const container_itens = document.querySelector('.itens-roleta'); //Container das configurações dos itens
const botao_adicionar = document.querySelector('#adicionar-item'); //Botão para adicionar itens
const config_itens = { //Dicionário para armazenar as configurações dos itens
    cor: null,
    nome: null,
    chance: null,
    container: null
};

let props = Roleta.createProps(
    ['Maçã', 'Banana', 'Abobora'],
    [5, 3, 2]
);

const roleta = Roleta.createRoleta(container, props);
//Cria os itens no items-container
props.items.forEach(item => {
    CustomItem.criarItem(container_itens, item.label, item.weight, item.value);
});

let peso_total = props.items.reduce((total, item) => total + item.weight, 0); //calcula o peso total dos itens

const ease = easing.easeOutQuad; //animação da roleta
let duration = 5000; //tempo que ficará girando

//Configurações da roleta
roleta.isInteractive = false
roleta.itemLabelRadius = 0.6;
roleta.itemLabelRadiusMax = 0.35;
roleta.itemLabelRotation = 180;
roleta.itemLabelAlign = 'center';

//Cria um novo item para a roleta
container.querySelector('.botao-roleta').addEventListener('click', () => {
    Roleta.girarRoleta(roleta, ease, duration, props, peso_total);
});

//Captura as configurações dos itens e atualiza o dicionário
container_itens.addEventListener('click', (e) => {
    const target = e.target.closest('.item');
    if (!target) return;

    config_itens.cor = window.getComputedStyle(target.querySelector('.cor-preview')).backgroundColor.match(/\d+/g);
    config_itens.nome = target.querySelector('.nome-item').value == "" ? "Item" : target.querySelector('.nome-item').value;
    config_itens.chance = target.querySelector('.chance').value == "" ? 1 : target.querySelector('.chance').value;
    config_itens.container = target;
});

//adiciona um novo item
botao_adicionar.addEventListener('click', () => {
    props = Roleta.addToProps(props, `Item ${props.items.length + 1}`, 1);
    CustomItem.criarItem(container_itens, `Item ${props.items.length}`, 1, props.items[props.items.length - 1].value);
});

//atualiza o nome do item
document.querySelectorAll('.nome-item').forEach(input => {
    input.addEventListener('input', (e) => {
        //FAZER LÓGICA PARA ATUALIZAR O LABEL DO ITEM
    });
});

//atualiza a chance do item
document.querySelectorAll('.chance').forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.target.value.length >= 3 && e.key <= "9" && e.key >= "0"){ //permite somente números e limita a 3 caracteres para não sumir no input
            e.preventDefault();
        }

        else if (e.target.value == "0"){ //Substitui o 0 por qualquer outro número que o usuário digitar
            e.target.value = e.key;
            e.preventDefault();
        }
    });

    input.addEventListener('blur', (e) => { //Se o campor for 0 ou vazio, retorna para 1
        if (e.target.value == "" || e.target.value == "0"){
            e.target.value = 1;
            //FAZER LÓGICA PARA ATUALIZAR O WEIGHT DO ITEM
        }
    });
});