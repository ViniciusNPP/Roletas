import * as CustomItem from '../components/customização-itens.js';
import * as Util from '../components/utils.js';

export function iniciarEventosItens(container_itens, botao_adicionar, dados_roleta) {
    //dados_roleta contém { roleta, props, peso_total }

    //#region Adicionar / Remover
    //Adcionar item
    botao_adicionar.addEventListener('click', () => {
        CustomItem.adicionarItem(dados_roleta.roleta, dados_roleta.props, container_itens);
        dados_roleta.peso_total += 1;
    });

    //Excluir Item
    container_itens.addEventListener('click', (e) => {
        const target = e.target;
        const container = target.closest('.item');
        if (!container) return;

        const btn_excluir = target.closest('.excluir-item');
        const seletor_cor_aberto = document.querySelector('#container-color-picker').childElementCount == 0;
        
        if (btn_excluir && seletor_cor_aberto) {
            if (dados_roleta.props.items.length <= 2) return;

            const id_item = container.id.split("-")[1];
            CustomItem.excluirItem(dados_roleta.roleta, dados_roleta.props, container, id_item);
        }
    });
    //#endregion

    //#region Validações Inputs
    //Evento Keydown (Validações de digitação)
    container_itens.addEventListener('keydown', (e) => {
        const target = e.target;
        const isNome = target.classList.contains('nome-item');
        const isChance = target.classList.contains('chance');

        if (!isNome && !isChance) return;

        if (e.key === "Enter") {
            target.blur();
            return;
        }

        if (isChance) {
            if (Util.VerficarCaracterProibido(e.key) && Util.VerficarSeNumero(e.key)) e.preventDefault();
        }

        if (isNome) {
            if (Util.VerficarCaracterProibido(e.key)) e.preventDefault();
        }
    });
    //#endregion
    //#region Correções Inputs
    container_itens.addEventListener('input', (e) => {
        const target = e.target;
        let value = target.value;

        if (target.classList.contains('chance')) {
            if (value.length > 3) target.value = value.slice(0, 3);
        }
    })
    //#endregion

    //#region Alterar Roleta
    //Evento Blur (Salvar alterações na roleta)
    container_itens.addEventListener('blur', (e) => {
        const target = e.target;
        const container = target.closest('.item');
        if (!container) return;

        let value = target.value;
        const id_item = container.id.split("-")[1]; //captura o id
        const todos_zero = new Set(value).values().next().value == "0"; //verifica se todos os valores do input sõa zeros

        if (target.classList.contains('chance')) {
            if (value === "" || todos_zero) {
                target.value = 1;
                value = 1;
            }

            const chance_velha = dados_roleta.props.items.find(item => item.value == id_item).weight;
            if (chance_velha == target.value) return;

            CustomItem.alterarChance(dados_roleta.roleta, dados_roleta.props, parseInt(value), id_item, container_itens);
            dados_roleta.peso_total += parseInt(value) - parseInt(chance_velha);
        }

        if (target.classList.contains('nome-item')) {
            const nome_antigo = dados_roleta.props.items.find(item => item.value == id_item).label;
            if (value === "") {
                target.value = nome_antigo;
                return;
            }
            if (value === nome_antigo) return;

            const novo_nome = value.length > 20 ? value.slice(0, 18) + "..." : value;
            CustomItem.alterarNome(dados_roleta.roleta, dados_roleta.props, novo_nome, id_item, container_itens);
        }
    }, true);
    //#endregion
}