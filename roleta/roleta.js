import * as Roleta from './modules/roleta-config.js';
import * as CustomItem from './modules/customização-itens.js';
import * as easing from './libs/easing.js';

//#region VARIÁVEIS GLOBAIS
const container = document.querySelector('.roleta-container'); //Onde a roleta é criada
const container_itens = document.querySelector('.itens-roleta'); //Container das configurações dos itens
const botao_adicionar = document.querySelector('#adicionar-item'); //Botão para adicionar itens
const config_itens = { //Dicionário para armazenar as configurações dos itens
    cor: null,
    nome: null,
    chance: null,
    container: null
};
// Lista de caracteres proibidos para nomes de itens
const caracteresProibidos = [
    "<", ">",       // Impede tags HTML (XSS)
    "/", "\\",      // Evita problemas com caminhos de diretório
    "{", "}",       // Evita confusão com objetos JSON
    "[", "]",       // Evita confusão com arrays
    "(", ")",       // Impede chamadas de função maliciosas
    "\"", "'", "`", // Evita quebra de strings no JS ou banco de dados
    ";", ":",       // Evita injeção de comandos ou problemas de formatação
    "=", "+",       // Caracteres de atribuição/operação
    "&", "|",       // Operadores lógicos
    "*",             // Caractere curinga
    ",", ".", "-", "+" // Caracteres que podem causar problemas de formatação ou validação
];

let props = Roleta.createProps(
    ['Maçã', 'Banana', 'Abobora'],
    [5, 3, 2]
);
const roleta = Roleta.createRoleta(container, props);
//#endregion

//#region CONFIG. PADRÕES DA ROLETA
//Cria os itens no items-container
props.items.forEach(item => {
    CustomItem.criarItem(container_itens, item.label, item.weight, item.value);
});

let peso_total = props.items.reduce((total, item) => total + item.weight, 0); //calcula o peso total dos itens

const ease = easing.easeOutQuad; //animação da roleta
let duration = 5000; //tempo que ficará girando

//Configurações da roleta
Roleta.aplicarConfigRoleta(roleta);
//#endregion

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

//#region CHANCE ITEM
//atualiza a chance do item
document.querySelectorAll('.chance').forEach(input => {
    input.addEventListener('keydown', (e) => {
        const teclas_inválidas = caracteresProibidos.includes(e.key);
        const e_numero = e.key >= "0" && e.key <= "9";
        
        if (teclas_inválidas || (e_numero && e.target.value.length >= 3)){ //permite somente números e limita a 3 caracteres para não sumir no input
            e.preventDefault();
        }

        else if (e.target.value == "0"){ //Substitui o 0 por qualquer outro número que o usuário digitar
            e.target.value = e.key;
            e.preventDefault();
        }

        else if (e.key == "Enter"){
            e.target.blur(); //Simula o evento de sair do campo para atualizar o weight do item
        }
    });

    input.addEventListener('blur', (e) => { //Evento para toda vez que sair do campo; Se o campo for 0 ou vazio, retorna para 1
        if (e.target.value == "" || e.target.value == "0"){
            e.target.value = 1;
            
        }
        const chance_velha = props.items.find(item => item.value == e.target.closest('.item').id.split("-")[1]).weight; //Encontra a chance antiga do item
        if (chance_velha == e.target.value) return; //Se a chance for igual a antiga, não precisa atualizar

        CustomItem.alterarChance(roleta, props, parseInt(e.target.value), config_itens.container.id.split("-")[1]); //atualiza o weight do item para 1
        peso_total += parseInt(e.target.value) - parseInt(chance_velha); //atualiza o peso total da roleta
        
        Roleta.aplicarConfigRoleta(roleta); //Reaplica as configurações, pois ela perde as configurações personalizadas após o init
    });
});
//#endregion

//#region NOME ITEM
document.querySelectorAll('.nome-item').forEach(input => {
    input.addEventListener('keydown', (e) => {
        const teclas_inválidas = caracteresProibidos.includes(e.key);
        const tamanho_maximo = 20;

        if (e.key == "Enter"){
            e.target.blur();
            return;
        }
        
        if (teclas_inválidas || (e.target.value.length >= tamanho_maximo && e.key.length == 1)) e.preventDefault();
    });

    input.addEventListener('blur', (e) => {
        const container_id = e.target.closest('.item').id; //evitar usar o config_items aqui por acontecer primeiro que o 'click'
        const id_item = container_id.split("-")[1];
        const nome_antigo = props.items.find(item => item.value == id_item).label; //Encontra o nome antigo do item para retornar caso o campo fique vazio

        if (e.target.value == ""){
            e.target.value = nome_antigo;
            return;
        }
        else if (e.target.value == nome_antigo) return; //Se o nome for igual ao antigo, não precisa atualizar
        CustomItem.alterarNome(roleta, props, e.target.value, id_item);

        Roleta.aplicarConfigRoleta(roleta); //Reaplica as configurações, pois ela perde as configurações personalizadas após o init
    });
});
//#endregion

//#region EXCLUIR ITEM
document.querySelectorAll('.excluir-item').forEach(botao => {
    botao.addEventListener('click', (e) => {
        if(props.items.length == 2) return; //impede do usuário excluir caso haja somente 2 items

        const id_item = e.target.closest('.item').id.split("-")[1];
        CustomItem.excluirItem(roleta, props, id_item);
        e.target.closest('.item').remove();

        Roleta.aplicarConfigRoleta(roleta); //Reaplica as configurações, pois ela perde as configurações personalizadas após o init
    });
});
//#endregion