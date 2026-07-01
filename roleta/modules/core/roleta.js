import * as Roleta from '../components/roleta-config.js';
import * as CustomItem from '../components/customização-itens.js';
import * as easing from '../../libs/easing.js';
import * as Util from '../components/utils.js';
import { CONFIG_GL } from './configuracoes.js';

export let DADOS_ROLETA = {
    roleta: null,
    props: null,
    peso_total: 0
};

export function iniciarRoleta(container, container_itens) {
    //Inicialização
    DADOS_ROLETA.props = Roleta.createProps();
    DADOS_ROLETA.roleta = Roleta.createRoleta(container, DADOS_ROLETA.props);

    //Cria os itens na interface e calcula o peso
    DADOS_ROLETA.props.items.forEach(item => {
        CustomItem.criarItem(container_itens, item.label, item.weight, item.value, item.backGroundColor);
    });
    DADOS_ROLETA.peso_total = DADOS_ROLETA.props.items.reduce((total, item) => total + item.weight, 0);
}

export function roletar(container) {
    //Evento de Girar
    container.querySelector('.botao-roleta').addEventListener('click', () => {
        //Configurações e animação
        const ease = CONFIG_GL.configs.easeMode;
        const duration = CONFIG_GL.configs.duration;

        Roleta.girarRoleta(DADOS_ROLETA.roleta, ease, duration, DADOS_ROLETA.props, DADOS_ROLETA.peso_total);
    });
}