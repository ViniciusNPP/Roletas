import * as CustomItem from './customização-itens.js';
import * as Util from './utils.js';

export function atualizarItem(dados_roleta, container_itens, items, itens_texto) {
    for (const [index, linha] of itens_texto.entries()) {

        var [nome, chance] = linha.split(";").map(parte => parte.trim()); //Separa o nome e a chance
        if (!nome) continue; //Se não tiver nome, ignora a linha
        if (!chance) chance = 1; //Se não tiver chance, define como 1

        const item_atual = items[index];
        const id_item = item_atual.value;

        //Atualiza o nome
        if (nome !== item_atual.label) {
            CustomItem.alterarNome(dados_roleta.roleta, dados_roleta.props, nome, id_item, container_itens);
        }

        //Atualiza a chance
        if (parseInt(chance) !== item_atual.weight) {
            dados_roleta.peso_total -= items[index].weight;
            CustomItem.alterarChance(dados_roleta.roleta, dados_roleta.props, parseInt(chance), id_item, container_itens);
            dados_roleta.peso_total += parseInt(chance);
        }
        //console.log("Peso total: " + dados_roleta.peso_total);
    }
}

export function adicionarItem(dados_roleta, container_itens, items, itens_texto) {
    //Pega apenas as linhas novas (assumindo que foram adicionadas no final)
    const itens_para_adicionar = [];
    //console.log("Itens texto: ", itens_texto)
    
    //Verifica se há itens que precisam ser removidos (itens que estavam na roleta mas não estão mais no input)
    items.forEach((item, index) => {
        const nome_completo = `${item.label}; ${item.weight}`;

        if (!itens_texto.includes(nome_completo)) {
            //Se o item não estiver no input, significa que foi removido
            removerItem(dados_roleta, container_itens, items, itens_texto);
        }
        else {
            itens_texto = itens_texto.filter(linha => linha !== nome_completo);
        }
    })

    //Prepara os itens para serem adicionados no props
    itens_texto.forEach(linha => {
        if (!linha.includes(";")) return; // Ignora se não tiver o separador
        let [nome, chance] = linha.split(";").map(parte => parte.trim());
        if (!nome) return; // Ignora linhas sem nome
        chance = chance ? parseInt(chance) : 1;

        // Gera os dados e coloca no array de novos itens
        itens_para_adicionar.push({
            label: nome,
            weight: chance,
            value: String(Util.gerarId())
        });

        // Atualiza o peso total da matemática da roleta
        dados_roleta.peso_total += chance;
    });

    if (itens_para_adicionar.length === 1) {
        // Adiciona um único item
        CustomItem.adicionarItem(dados_roleta.roleta, dados_roleta.props, container_itens, false, itens_para_adicionar[0]);
    }
    else if (itens_para_adicionar.length > 1) {
        // Adiciona vários itens em lote
        CustomItem.adicionarMultiplos(dados_roleta.roleta, dados_roleta.props, container_itens, itens_para_adicionar);
    }
}

export function removerItem(dados_roleta, container_itens, items, itens_texto) {
    //Lista com os nomes dos itens no input
    const nomes_no_texto = itens_texto.map(linha => {
        const partes = linha.split(";");
        return partes[0] ? partes[0].trim() : "";
    });

    //Acha os itens a serem excluídos
    const itens_apagados = items.filter(item => !nomes_no_texto.includes(item.label));
    const ids_para_excluir = [];
    const divs_para_excluir = [];

    //Executa a exclusão para cada item apagado
    itens_apagados.forEach(item_apagado => {
        dados_roleta.peso_total -= item_apagado.weight;

        //Procura a div do item removido
        const divs_itens = Array.from(container_itens.querySelectorAll('.item'));
        const div_item = divs_itens.find(div => div.id.includes(item_apagado.value));

        if (div_item) {
            ids_para_excluir.push(item_apagado.value);
            divs_para_excluir.push(div_item);
        }
    });

    if (ids_para_excluir.length > 0) {
        CustomItem.excluirItem(dados_roleta.roleta, dados_roleta.props, divs_para_excluir, ids_para_excluir);
        
    }
}