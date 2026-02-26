import * as Roleta from './modules/roleta-config.js';
import * as CustomItem from './modules/customização-itens.js';
import * as Util from './modules/utils.js';
import * as easing from './libs/easing.js';

//#region VARIÁVEIS GLOBAIS
const container = document.querySelector('.roleta-container'); //Onde a roleta é criada
const container_itens = document.querySelector('.itens-roleta'); //Container das configurações dos itens
const botao_adicionar = document.querySelector('#adicionar-item'); //Botão para adicionar itens
const caracteresProibidos = [ // Lista de caracteres proibidos para nomes de itens
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

let seletor_aberto = false;
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

//#region GIRAR ROLETA 
//Cria um novo item para a roleta
container.querySelector('.botao-roleta').addEventListener('click', () => {
    Roleta.girarRoleta(roleta, ease, duration, props, peso_total);
});
//#endregion

//adiciona um novo item
//#region ADICIONAR ITEM
botao_adicionar.addEventListener('click', () => {
    CustomItem.adicionarItem(roleta, props, container_itens);
    peso_total += 1;
});
//#endregion

//#region CLICK
container_itens.addEventListener('click', (e) => {
    const target = e.target;
    const container = target.closest('.item');
    if (!container) return;

    // 1. Ação de Excluir Item
    const btnExcluir = target.closest('.excluir-item');
    if (btnExcluir) {
        if (props.items.length <= 2) return; // Segurança: mínimo de 2 itens

        const id_item = container.id.split("-")[1];
        CustomItem.excluirItem(roleta, props, container, id_item);
        return;
    }

    // 2. Ação de Abrir Seletor de Cor (Preview)
    const corPreview = target.closest('.cor-preview');
    if (corPreview && !seletor_aberto) {
        var colorPicker = new iro.ColorPicker(corPreview, {
            width: 150,
            color: '#f00'
        });
        seletor_aberto = true;
    }
});
//#endregion

//#region KEYDOWN
container_itens.addEventListener('keydown', (e) => {
    const target = e.target;
    const isNome = target.classList.contains('nome-item');
    const isChance = target.classList.contains('chance');

    if (!isNome && !isChance) return;

    // Atalho comum: Enter faz o blur
    if (e.key === "Enter") {
        target.blur();
        return;
    }

    // Lógica para CHANCE
    if (isChance) {
        const teclas_invalidas = caracteresProibidos.includes(e.key);
        const e_numero = e.key >= "0" && e.key <= "9";
        
        // Bloqueia caracteres proibidos ou estouro de tamanho (3 dígitos)
        if (teclas_invalidas || (e_numero && target.value.length >= 3)) {
            e.preventDefault();
        }
        // Substitui o 0 inicial pelo novo número
        else if (target.value === "0" && e_numero) {
            target.value = e.key;
            e.preventDefault();
        }
    }

    // Lógica para NOME
    if (isNome) {
        const tamanho_maximo = 20;
        const teclas_invalidas = caracteresProibidos.includes(e.key);
        // Bloqueia se atingir limite e não for tecla de controle (e.key.length === 1)
        if (teclas_invalidas || (target.value.length >= tamanho_maximo && e.key.length === 1)) {
            e.preventDefault();
        }
    }
});
//#endregion

//#region BLUR
container_itens.addEventListener('blur', (e) => {
    const target = e.target;
    const container = target.closest('.item');
    if (!container) return;

    const id_item = container.id.split("-")[1];

    // 1. Validação de CHANCE no Blur
    if (target.classList.contains('chance')) {
        if (target.value === "" || target.value === "0") {
            target.value = 1;
        }

        const chance_velha = props.items.find(item => item.value == id_item).weight;
        if (chance_velha == target.value) return;

        CustomItem.alterarChance(roleta, props, parseInt(target.value), id_item);
        peso_total += parseInt(target.value) - parseInt(chance_velha);
        Roleta.aplicarConfigRoleta(roleta);
    }

    // 2. Validação de NOME no Blur
    if (target.classList.contains('nome-item')) {
        const nome_antigo = props.items.find(item => item.value == id_item).label;

        if (target.value === "") {
            target.value = nome_antigo;
            return;
        }
        
        if (target.value === nome_antigo) return;

        CustomItem.alterarNome(roleta, props, target.value, id_item);
        Roleta.aplicarConfigRoleta(roleta);
    }
}, true); // O 'true' é vital aqui para o blur funcionar via delegação
//#endregion