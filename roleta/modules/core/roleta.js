// Importações necessárias para a roleta
import * as Roleta from '../components/roleta-config.js';
import * as CustomItem from '../components/customização-itens.js';
import * as easing from '../../libs/easing.js';

const props = Roleta.createProps();

export function iniciarRoleta(container, container_itens) {
    //Inicialização
    const roleta = Roleta.createRoleta(container, props);

    //Cria os itens na interface e calcula o peso
    props.items.forEach(item => {
        CustomItem.criarItem(container_itens, item.label, item.weight, item.value);
    });
    let peso_total = props.items.reduce((total, item) => total + item.weight, 0);

    //Retorna as variáveis que outros arquivos vão precisar
    return { roleta, props, peso_total };
}

export function roletar(dados, container) {
    //Configurações e animação
    const ease = easing.easeOutQuad;
    let duration = 5000;

    Roleta.aplicarConfigRoleta(dados.roleta);

    //Evento de Girar
    container.querySelector('.botao-roleta').addEventListener('click', () => {
        Roleta.girarRoleta(dados.roleta, ease, duration, dados.props, dados.peso_total);
    });
}