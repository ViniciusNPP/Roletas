import * as Util from '../components/utils.js';
import * as easing from '../../libs/easing.js';
import { aplicarConfigRoleta } from '../components/roleta-config.js';

export let CONFIG_GL = {
    configs:
    {
        duration: 5000,
        easeMode: easing.easeOutQuad,
        isInteractive: false,
        isElimitade: false,
        isUpperCase: false,
        isMuted: false,
        showHistory: false
    },
    data: {
        paletDefault: [],
        paletCustom: [],
        paletRecomend: []
    }
}

const seletor_animacoes = document.querySelector("#input-animacao-roleta");
//#region Animações
//Cria as opções do select de animações
export function iniciarOpcoesAnimacoes() {
    const nomes_animacoes = Object.keys(easing).reverse();

    seletor_animacoes.innerHTML = nomes_animacoes.map(nome => {
        return `<option value="${nome}">${nome}</option>`;
    }).join('');

    seletor_animacoes.value = "easeOutQuad";
}

//Muda a CONFIG_GL quando mudar o valor do select de animações
seletor_animacoes.addEventListener('change', (e) => {
    CONFIG_GL.configs.easeMode = easing[seletor_animacoes.value];
});
//#endregion

const input_velocidade = document.querySelector("#input-velocidade-roleta");
//#region Duração
//Coloca o primeiro valor para input_velocidade
input_velocidade.value = CONFIG_GL.configs.duration / 1000;

input_velocidade.addEventListener('keydown', (e) => {
    //Lista de teclas proibidas que o tipo "number" aceita por padrão
    const teclasProibidas = ['+', '-', 'e', 'E', ',', '.'];
    const value = Util.VerficarSeNumero(e.key) ? parseInt(`${input_velocidade.value}${e.key}`) : "";

    if (teclasProibidas.includes(e.key)) {
        e.preventDefault();
    }

    if (value > 20 || value === 0) {
        e.preventDefault();
    }
});

input_velocidade.addEventListener('change', (e) => {
    CONFIG_GL.configs.duration = e.target.value * 1000;
});
//#endregion

const checkbox_interagir = document.querySelector("#checkbox-interagir-roleta")
//#region Interagir
//Se iniciar errado corrige o checkbox_interagir
if (CONFIG_GL.configs.isInteractive && !checkbox_interagir.checked) {
    checkbox_interagir.checked = true
}
else if (!CONFIG_GL.configs.isInteractive && checkbox_interagir.checked) {
    checkbox_interagir.checked = false
}

//Muda a configuração de CONFIG_GL.config.isInteractive para True ou False
checkbox_interagir.addEventListener('change', (e) => {
    CONFIG_GL.configs.isInteractive ? CONFIG_GL.configs.isInteractive = false : CONFIG_GL.configs.isInteractive = true;
    //console.log("Valor CONFIG_GL: ",CONFIG_GL.configs.isInteractive,"\nValor: ",e.target.checked);
    aplicarConfigRoleta();
});
//#endregion
