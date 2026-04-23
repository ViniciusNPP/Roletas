// Importações necessárias para a roleta
import * as Roleta from '../components/roleta-config.js';
import * as CustomItem from '../components/customização-itens.js';
import * as easing from '../../libs/easing.js';

export function iniciarRoleta(container, container_itens) {
    //Inicialização
    let props = Roleta.createProps(
        ['Maçã', 'Banana', 'Abobora'],
        [5, 3, 2]
    );
    const roleta = Roleta.createRoleta(container, props);

    //Cria os itens na interface e calcula o peso
    props.items.forEach(item => {
        CustomItem.criarItem(container_itens, item.label, item.weight, item.value);
    });
    let peso_total = props.items.reduce((total, item) => total + item.weight, 0);

    //Configurações e animação
    const ease = easing.easeOutQuad;
    let duration = 5000;
    Roleta.aplicarConfigRoleta(roleta);

    //Evento de Girar
    container.querySelector('.botao-roleta').addEventListener('click', () => {
        Roleta.girarRoleta(roleta, ease, duration, props, peso_total);
    });

    //Retorna as variáveis que outros arquivos vão precisar
    return { roleta, props, peso_total };
}