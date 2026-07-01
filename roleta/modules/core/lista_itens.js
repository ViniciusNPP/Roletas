import * as CustomItem from '../components/customização-itens.js';
import * as Util from '../components/utils.js';
import * as InputText from '../components/input-by-text.js';
import { DADOS_ROLETA } from './roleta.js';

export function iniciarEventosItens(container_itens, botao_adicionar) {
    //console.log("Roleta: ", DADOS_ROLETA.roleta)

    const container_pai = container_itens.parentElement;
    const input_add = container_pai.querySelector("#add-item-texto");

    //#region Adicionar / Remover
    //Adcionar item
    botao_adicionar.addEventListener('click', () => {
        if (!input_add.classList.contains('escondido')) return; //Não permite criar items apertando o botão caso o outro modo esteja aberto

        CustomItem.adicionarItem(DADOS_ROLETA.roleta, DADOS_ROLETA.props, container_itens);
        DADOS_ROLETA.peso_total += 1;
    });

    //Excluir Item
    container_itens.addEventListener('click', (e) => {
        const target = e.target;
        const container = target.closest('.item');
        if (!container) return;

        const btn_excluir = target.closest('.excluir-item');
        const seletor_cor_aberto = document.querySelector('#container-color-picker').childElementCount == 0;

        if (btn_excluir && seletor_cor_aberto) {
            if (DADADOS_ROLETA.props.items.length <= 2) return;

            const id_item = container.id.split("-")[1];
            CustomItem.excluirItem(DADADOS_ROLETA.roleta, DADOS_ROLETA.props, container, id_item);
        }
    });
    //#endregion

    //#region Trocar modo adicionar
    container_pai.querySelector('#mudar-formato-add').addEventListener('click', (e) => {
        //Esconde e mostra os dois modos de adicionar itens
        input_add.classList.toggle('escondido');
        container_itens.classList.toggle('escondido');

        //Verifica se o modo foi trocado para input via texto ou se está voltando para o modo normal
        //Se for para o modo de texto, passar os itens atuais para o input
        //Se for para o modo normal, pegar os itens do input e criar os itens na roleta
        if (container_itens.classList.contains('escondido')) {
            input_add.value = ""; //Limpa o input

            //Dicionário com os dados
            const dados_input = {
                nomes: DADOS_ROLETA.props.items.map(item => item.label),
                chances: DADOS_ROLETA.props.items.map(item => item.weight)
            }

            //Adiciona os dados no input
            for (const [key, value] of dados_input.nomes.entries()) {
                input_add.value += `${value}; ${dados_input.chances[key]}\n`;
            }
        }
    });
    //#endregion
    //#region Digitos text input
    input_add; addEventListener('input', (e) => {
        const itens_texto = e.target.value.split("\n").filter(linha => linha.trim() !== ""); //Pega cada linha do input, removendo as linhas vazias
        const items = DADOS_ROLETA.props.items;

        if (itens_texto.length < 2) return;
        //Se o tamanho for igual ao props.items, significa que editou os itens e não adicionou/removeu
        //Necessário apenas atualizar os itens
        //console.log("Itens no input: " + itens_texto.length);
        //console.log("Itens na roleta: " + items.length);
        if (itens_texto.length == items.length) {
            //console.log("Atualizando itens");
            InputText.atualizarItem(DADADOS_ROLETA, container_itens, items, itens_texto);
            return;
        }
        //Se for maior, significa que um item foi adicionado
        else if (itens_texto.length > items.length) {
            //console.log("Adicionando itens");
            InputText.adicionarItem(DADADOS_ROLETA, container_itens, items, itens_texto);
            return;
        }

        //Se for menor, significa que um item foi removido
        else if (itens_texto.length < items.length) {
            InputText.removerItem(DADADOS_ROLETA, container_itens, items, itens_texto);
            return;
        }
    });
    //#endregion
    //#region Validação text input
    input_add.addEventListener('keydown', (e) => {
        if (Util.VerficarCaracterProibido(e.key, ";")) e.preventDefault();
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

    //#region Atualuzar Dados
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

            const chance_velha = DADOS_ROLETA.props.items.find(item => item.value == id_item).weight;
            if (chance_velha == target.value) return;

            CustomItem.alterarChance(DADADOS_ROLETA.roleta, DADOS_ROLETA.props, parseInt(value), id_item, container_itens);
            DADOS_ROLETA.peso_total += parseInt(value) - parseInt(chance_velha);
        }

        if (target.classList.contains('nome-item')) {
            const nome_antigo = DADOS_ROLETA.props.items.find(item => item.value == id_item).label;
            if (value === "") {
                target.value = nome_antigo;
                return;
            }
            if (value === nome_antigo) return;

            const novo_nome = value.length > 20 ? value.slice(0, 18) + "..." : value;
            CustomItem.alterarNome(DADADOS_ROLETA.roleta, DADOS_ROLETA.props, novo_nome, id_item, container_itens);
        }
    }, true);
    //#endregion
}