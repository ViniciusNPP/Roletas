import { iniciarRoleta } from './modules/core/roleta.js';
import { iniciarEventosItens } from './modules/core/lista_itens.js';
import { iniciarConfigSeletor } from './modules/components/seletor_config.js';

//DOM Elements
const container = document.querySelector('.roleta-container');
const container_itens = document.querySelector('.itens-roleta');
const botao_adicionar = document.querySelector('#adicionar-item');
const container_seletor_cor = document.querySelector('#color-picker');
const container_iro_picker = document.querySelector('#container-color-picker');

// 1. Inicia a lógica principal da Roleta (Isso devolve as variáveis importantes)
const dados_roleta = iniciarRoleta(container, container_itens);

// 2. Passa os dados da roleta para os Itens poderem editar (adicionar/excluir/alterar)
iniciarEventosItens(container_itens, botao_adicionar, dados_roleta);

// 3. Passa os dados para o Seletor de Cores funcionar
iniciarConfigSeletor(container_seletor_cor, container_iro_picker, container_itens, dados_roleta);