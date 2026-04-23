import * as CustomItem from '../components/customização-itens.js';
import * as Util from '../components/utils.js';

export function iniciarEventosItens(container_itens, botao_adicionar, dados_roleta) {
    //dados_roleta contém { roleta, props, peso_total } que vieram do arquivo roleta.js

    //#region Adicionar / Remover
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
        if (btn_excluir) {
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
            const e_numero = Util.VerficarSeNumero(e.key);
            const teclas_invalidas = Util.VerficarCaracterProibido(e.key);

            if (teclas_invalidas || (e_numero && target.value.length >= 3)) {
                e.preventDefault();
            } else if (target.value === "0" && e_numero) {
                target.value = e.key;
                e.preventDefault();
            }
        }

        if (isNome) {
            const tamanho_maximo = 20;
            const teclas_invalidas = Util.VerficarCaracterProibido(e.key);
            if (teclas_invalidas || (target.value.length >= tamanho_maximo && e.key.length === 1)) {
                e.preventDefault();
            }
        }
    });
    //#endregion

    //#region Salvar alterações
    //Evento Blur (Salvar alterações na roleta)
    container_itens.addEventListener('blur', (e) => {
        const target = e.target;
        const container = target.closest('.item');
        if (!container) return;

        const id_item = container.id.split("-")[1];

        if (target.classList.contains('chance')) {
            if (target.value === "" || target.value === "0") target.value = 1;

            const chance_velha = dados_roleta.props.items.find(item => item.value == id_item).weight;
            if (chance_velha == target.value) return;

            CustomItem.alterarChance(dados_roleta.roleta, dados_roleta.props, parseInt(target.value), id_item);
            dados_roleta.peso_total += parseInt(target.value) - parseInt(chance_velha);
        }

        if (target.classList.contains('nome-item')) {
            const nome_antigo = dados_roleta.props.items.find(item => item.value == id_item).label;
            if (target.value === "") {
                target.value = nome_antigo;
                return;
            }
            if (target.value === nome_antigo) return;
            CustomItem.alterarNome(dados_roleta.roleta, dados_roleta.props, target.value, id_item);
        }
    }, true);
    //#endregion
}