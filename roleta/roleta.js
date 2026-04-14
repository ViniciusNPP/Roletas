import * as Roleta from './modules/roleta-config.js';
import * as CustomItem from './modules/customização-itens.js';
import * as Util from './modules/utils.js';
import * as easing from './libs/easing.js';

/*
 LINK DAS BIBLIOTECAS DE FORA USADOS:
    spin-whell by CrazyTim: https://github.com/CrazyTim/spin-wheel?tab=readme-ov-file
    iro.js by jaames: https://github.com/jaames/iro.js?tab=readme-ov-file
    easing-utils by AndrewRayCode: https://github.com/AndrewRayCode/easing-utils?tab=readme-ov-file
 */

//#region VARIÁVEIS GLOBAIS
const container = document.querySelector('.roleta-container'); //Onde a roleta é criada
const container_itens = document.querySelector('.itens-roleta'); //Container das configurações dos itens
const botao_adicionar = document.querySelector('#adicionar-item'); //Botão para adicionar itens
const container_seletor_cor = document.querySelector('#color-picker');
let estado = {
    cor_antiga: null,
    seletor_cor: null,
    seletor_aberto: false,
    rgb_atualizado_manual: false
}

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

let cor_preview;
const container_iro_picker = document.querySelector('#container-color-picker');
//#region CLICK
container_itens.addEventListener('click', (e) => {
    const target = e.target;
    const container = target.closest('.item');
    if (!container) return;

    //Ação de Excluir Item
    const btn_excluir = target.closest('.excluir-item');
    if (btn_excluir) {
        if (props.items.length <= 2) return; // Segurança: mínimo de 2 itens

        const id_item = container.id.split("-")[1];
        CustomItem.excluirItem(roleta, props, container, id_item);
        return;
    }

    //Ação de Abrir Seletor de Cor (Preview)
    cor_preview = target.closest('.cor-preview');
    const inputs_rgb = document.querySelector('#container-input-rgb').querySelectorAll('.input-rgb');

    if (cor_preview && !estado.seletor_aberto) {
        e.stopImmediatePropagation();
        container_seletor_cor.style.display = 'flex';

        estado.seletor_cor = new iro.ColorPicker(container_iro_picker, {
            width: container_seletor_cor.offsetWidth * 0.5,
            color: cor_preview.style.backgroundColor,
            layoutDirection: 'horizontal',
            layout: [
                {
                    component: iro.ui.Box,
                },
                {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'hue'
                    }
                },
            ]
        });
        Util.PreencherRGB(estado.seletor_cor.color.rgb, inputs_rgb);
        container_seletor_cor.style.border = 'solid 4px ' + estado.seletor_cor.color.hexString;

        estado.seletor_cor.on('color:change', (color) => {
            if (!estado.rgb_atualizado_manual) {
                Util.PreencherRGB(color.rgb, inputs_rgb);
            }
            container_seletor_cor.style.border = 'solid 4px ' + color.hexString;
        });

        estado.seletor_aberto = true;
        estado.cor_antiga = cor_preview.style.backgroundColor;
    }
    else if (cor_preview && estado.seletor_aberto) {
        estado.seletor_cor.color.set(cor_preview.style.backgroundColor);
        Util.PreencherRGB(estado.seletor_cor.color.rgb, inputs_rgb);
        container_seletor_cor.style.border = 'solid 4px ' + estado.seletor_cor.color.hexString;
    }
});
//#region CLICK BOTÕES
document.getElementById('button-cancel-color').addEventListener('click', () => {
    if (estado.seletor_aberto) {
        container_iro_picker.removeChild(container_iro_picker.firstChild);

        estado.seletor_aberto = false;
        container_seletor_cor.style.display = 'none';
    }
});

document.getElementById('button-save-color').addEventListener('click', () => {
    if (estado.seletor_aberto) {
        cor_preview.style.backgroundColor = estado.seletor_cor.color.hexString;
        container_iro_picker.removeChild(container_iro_picker.firstChild);

        estado.seletor_aberto = false;
        container_seletor_cor.style.display = 'none';
    }
});
//#endregion
//#endregion

//#region KEYDOWN ITENS
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
        const e_numero = Util.VerficarSeNumero(e.key);
        const teclas_invalidas = Util.VerficarCaracterProibido(e.key);

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
        const teclas_invalidas = Util.VerficarCaracterProibido(e.key);
        // Bloqueia se atingir limite e não for tecla de controle (e.key.length === 1)
        if (teclas_invalidas || (target.value.length >= tamanho_maximo && e.key.length === 1)) {
            e.preventDefault();
        }
    }
});
//#endregion
//#region KEYDOWN SELETOR DE COR
container_seletor_cor.querySelectorAll('.input-rgb').forEach(input => {
    input.addEventListener('keydown', (e) => {
        let digito = Util.VerficarSeNumero(e.key) ? e.key : '';
        let numero_atual = input.value + digito;
        let r, g, b;
        let rgbString = 'rgb(255, 0, 0';

        if (Util.VerficarSeNumero(e.key) && e.key !== " " && input.value.length < 3) {
            if (parseInt(numero_atual) > 255) {
                e.preventDefault();
                return;
            }

            input.id === 'input-rgb-red' ? r = numero_atual : r = estado.seletor_cor.color.rgb.r;
            input.id === 'input-rgb-green' ? g = numero_atual : g = estado.seletor_cor.color.rgb.g;
            input.id === 'input-rgb-blue' ? b = numero_atual : b = estado.seletor_cor.color.rgb.b;
            rgbString = `rgb(${r}, ${g}, ${b})`;
            estado.rgb_atualizado_manual = true;

            estado.seletor_cor.color.set(rgbString);
        }

        else if (e.key.length > 1) {

            numero_atual = input.value.replace(/.$/, '');
            input.id === 'input-rgb-red' ? r = numero_atual : r = estado.seletor_cor.color.rgb.r;
            input.id === 'input-rgb-green' ? g = numero_atual : g = estado.seletor_cor.color.rgb.g;
            input.id === 'input-rgb-blue' ? b = numero_atual : b = estado.seletor_cor.color.rgb.b;
            rgbString = `rgb(${r}, ${g}, ${b})`;
            estado.rgb_atualizado_manual = true;

            estado.seletor_cor.color.set(rgbString);
            return;
        }

        if (!Util.VerficarSeNumero(e.key) || Util.VerficarCaracterProibido(e.key) || e.key === " " || input.value.length >= 3) {
            e.preventDefault();
        }
    });
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