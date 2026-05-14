import * as CustomItem from '../components/customização-itens.js';
import * as Roleta from '../components/roleta-config.js';
import * as Util from '../components/utils.js';

export function iniciarEventosItens(container_itens, botao_adicionar, dados_roleta) {
    //dados_roleta contém { roleta, props, peso_total }

    const container_pai = container_itens.parentElement;
    const input_add = container_pai.querySelector("#add-item-texto");
    //#region Adicionar / Remover
    //Adcionar item
    botao_adicionar.addEventListener('click', () => {
        if (!input_add.classList.contains('escondido')) return; //Não permite criar items apertando o botão caso o outro modo esteja aberto
        
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

    //#region Trocar modo adicionar
    container_pai.querySelector('#mudar-formato-add').addEventListener('click', (e) => {
        //Esconde e mostra os dois modos de adicionar itens
        input_add.classList.toggle('escondido');
        container_itens.classList.toggle('escondido');

        const add_item_texto = container_pai.querySelector('#add-item-texto');
        //Verifica se o modo foi trocado para input via texto ou se está voltando para o modo normal
        //Se for para o modo de texto, passar os itens atuais para o input
        //Se for para o modo normal, pegar os itens do input e criar os itens na roleta
        if (container_itens.classList.contains('escondido')) {
            add_item_texto.value = ""; //Limpa o input

            //Dicionário com os dados
            const dados_input = {
                nomes: dados_roleta.props.items.map(item => item.label),
                chances: dados_roleta.props.items.map(item => item.weight)
            }

            //Adiciona os dados no input
            for (const [key, value] of dados_input.nomes.entries()){
                add_item_texto.value += `${value}; ${dados_input.chances[key]}\n`;
            }
        }
        else {
            const items = input_add.value.split("\n");
            let itens_novos = {
                nomes: [],
                chances: []
            }

            //Valida os dados do input e os separa em nomes e chances
            items.forEach(it => {
                const item_dividido = it.split(";");
                if (item_dividido[0] === "" || !item_dividido[1]) return; //caso o formato do item seja inválido, ele é ignorado

                //Se tiver caracter proibido o substitui por " "
                if (Util.VerficarCaracterProibido(item_dividido[0])) {
                    item_dividido[0] = Util.SubstituirCaracteresProibidos(item_dividido[0]);
                }
                
                //Verifica se a chance é um número e válido, se não for definine 1
                if (item_dividido[1].trim() === "" || !Util.VerficarSeNumero(item_dividido[1])) item_dividido[1] = "1";
                else if (item_dividido[1].length > 3) {
                    //Limita a 3 caracteres
                    item_dividido[1] = item_dividido[1].trim().slice(0, 3);
                }
                
                itens_novos.nomes.push(item_dividido[0]);
                itens_novos.chances.push(item_dividido[1]);
            });

            //Adiciona os itens novos e altera os itens antigos
            for (const [key, value] of itens_novos.nomes.entries()) {
                //Altera os itens já existentes
                if (dados_roleta.props.items[key]) {
                    //Verifica se os dados são diferentes para evitar alterações desnecessárias
                    if (dados_roleta.props.items[key].label !== value){
                        CustomItem.alterarNome(dados_roleta.roleta, dados_roleta.props, value, dados_roleta.props.items[key].value, container_itens);
                    }
                    if (dados_roleta.props.items[key].weight !== parseInt(itens_novos.chances[key])){
                        CustomItem.alterarChance(dados_roleta.roleta, dados_roleta.props, parseInt(itens_novos.chances[key]), dados_roleta.props.items[key].value, container_itens);
                    }
                }
                //Adiciona os itens novos
                else {
                    dados_roleta.props = Roleta.addToProps(dados_roleta.props, value, parseInt(itens_novos.chances[key]), Util.gerarId()); //atualiza os props com o novo item
                    CustomItem.adicionarItem(dados_roleta.roleta, dados_roleta.props, container_itens, false, dados_roleta.props.items[key]); //adiciona o novo item na roleta
                    dados_roleta.peso_total += parseInt(itens_novos.chances[key]); //atualiza o peso total
                }
            }
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