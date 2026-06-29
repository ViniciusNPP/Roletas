import * as Util from '../components/utils.js';
import * as easing from '../../libs/easing.js';

export var CONFIG_GL = {
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
    dates: {
        paletDefault: [],
        paletCustom: [],
        paletRecomend: []
    }
}

//Cria as opções do select de animações
const seletor_animacoes = document.querySelector("#input-animacao-roleta");

export function iniciarOpcoesAnimacoes(){
    const nomes_animacoes = Object.keys(easing);

    seletor_animacoes.innerHTML = nomes_animacoes.map(nome => {
        return `<option value="${nome}">${nome}</option>`;
    }).join('');

    seletor_animacoes.value = "easeOutQuad";
}

//Muda a CONFIG_GL quando mudar o valor do select de animações
seletor_animacoes.addEventListener('change', (e) => {
    CONFIG_GL.configs.easeMode = easing[seletor_animacoes.value];
});

//Mudança de valor na velocidade da roleta
const input_velocidade = document.querySelector("#input-velocidade-roleta");
//Coloca o primeiro valor para input_velocidade
input_velocidade.value = CONFIG_GL.configs.duration / 1000;

input_velocidade.addEventListener('keydown', (e) => {
    //Lista de teclas proibidas que o tipo "number" aceita por padrão
    const teclasProibidas = ['+', '-', 'e', 'E', ',', '.'];
    const value = Util.VerficarSeNumero(e.key) ? parseInt(`${input_velocidade.value}${e.key}`) : "";

    if (teclasProibidas.includes(e.key)) {
        e.preventDefault();
    }

    if (value > 20 || value === 0){
        e.preventDefault();
    }
});

input_velocidade.addEventListener('change', (e) => {
    CONFIG_GL.configs.duration = e.target.value * 1000;
});