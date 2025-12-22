import * as Data from '../Data/data.js';
import * as Acao from '../Acoes/acoes.js';
import * as CM from '../Acoes/context-menu.js';
import * as Renomear from '../Acoes/renomear.js';
import * as ExcluirVarios from '../Acoes/excluir-varios.js';
//console.log(JSON.parse(localStorage.getItem("pastas")));
//Mostra o localStorage.

//localStorage.setItem("pastas", JSON.stringify([]));
//Limpa o localStorage

const UI = {
    roletas: document.getElementById('roletas'),
    menu_options: document.getElementById('menu_options'),
    janela_renomear: document.getElementById('janela_renomear'),
    opacidade: document.getElementById('opacidade'),
    header_excluir: document.getElementById('header_excluir'),
    janela_alterar: document.getElementById('janela_alterar'),
    adicionar: document.getElementById('add_roleta')
};

let estado = {
    ID: 1,
    contador_nome: 1,
    elemento_atual: null,
    nome_roleta: null,
    checkmark_id: null,
    imagem_roleta: null,
    aberto_excluir_varios: false
};

//#region Load
//Função para carregar as roletas do localStorage
const pastas = JSON.parse(localStorage.getItem('pastas'));
Data.carregarPastasLocal(UI.roletas, pastas);

//MUDAR LOGICA DOS IDS E CONTADORES           
if (pastas != null){
    estado.ID = pastas.length + 1;
    estado.contador_nome = pastas.length + 1;
}
//#endregion

//#region Context Menu
UI.roletas.addEventListener('contextmenu', function(e) {
    CM.contextMenu(e, UI.menu_options, estado);
});

// Esconde o menu contexto ao cliclar fora
document.addEventListener('click', function(e) {
    if (!UI.menu_options.contains(e.target)) {
        UI.menu_options.classList.remove('show');     
    }
});
//#endregion

//#region Criar Roleta
UI.adicionar.addEventListener('click', function(){
    Acao.criarPasta(UI, estado, 'menu/img/roleta2.png'); //Cria uma nova posta
});
//#endregion

//#region Excluir roleta
//Exclui a roleta
UI.menu_options.querySelector('#excluir').addEventListener('click', function(){
    Acao.excluirPasta(UI, estado);
});
//#endregion

//#region Renomear
const input_nome_roleta = UI.janela_renomear.querySelector('#inserir');
const invalido = UI.janela_renomear.querySelector('p');

/*Abre a janela de renomear o nome*/
UI.menu_options.querySelector('#renomear').addEventListener('click', () => {
    Renomear.abrirJanelaRenomear(UI, estado, input_nome_roleta);

    /*Botão de fechar*/
    UI.janela_renomear.querySelector('#fechar').addEventListener('click', () => {
        Renomear.botaoFecharRenomear(UI, estado, input_nome_roleta, invalido);
    });

    /*Botão de pronto*/
    UI.janela_renomear.querySelector('#pronto').addEventListener('click', () => {
        Renomear.renomearRoleta(UI, estado, input_nome_roleta, invalido);
    });
});
//#endregion

//#region Excluir vários
//Excluir vários
const contador_excluir = UI.header_excluir.querySelector('#contador_excluir');
let pastas_excluir = [];

//Mostrar o menu de excluir vários
UI.menu_options.querySelector('#excluir_varios').addEventListener('click', () => {
    ExcluirVarios.abrirExcluirVarios(pastas_excluir, contador_excluir);
});

UI.header_excluir.querySelector('#fechar_excluir').addEventListener('click', () => {
    ExcluirVarios.fecharExcluirVarios(pastas_excluir);
});

UI.header_excluir.querySelector('#excluir_pastas').addEventListener('click', () => {
    ExcluirVarios.excluirVarios(pastas_excluir);
})
//#endregion

//#region clique nas pastas
UI.roletas.addEventListener('click', (e) => {
    const pasta_atual = e.target.classList.contains('roleta') ? e.target : e.target.closest('.roleta');

    if (!pasta_atual) return;

    ExcluirVarios.verificarSelecao(pasta_atual, pastas_excluir);
    //Ir para a página das roletas
    if (!estado.aberto_excluir_varios) {
        window.location.href = `/dentro da pasta/roletas.html?id=${pasta_atual.id}`;
    }
});
//#endregion

//#region Alterar Imagem
//Janela de alterar imagem
const mostrar_img = UI.janela_alterar.querySelector('#alterar_img');
const input_img = UI.janela_alterar.querySelector('#enviar_img');
const texto = UI.janela_alterar.querySelector('#texto_alterar');
let img_alterar = null;

UI.menu_options.querySelector('#botao_imagem').addEventListener('click', () => {
    UI.janela_alterar.style.display = 'flex';
    UI.opacidade.style.display = 'block';
    UI.menu_options.classList.remove('show');
});

UI.janela_alterar.querySelector('#mudar_img').addEventListener('click', () => {
    UI.janela_alterar.style.display = 'none';
    UI.opacidade.style.display = 'none';

    estado.imagem_roleta.src = img_alterar;
    mostrar_img.style.backgroundImage = 'none';
    texto.style.display = 'flex';

    Data.salvarPastasLocal(document.querySelectorAll('.roleta'));
});

UI.janela_alterar.querySelector('#fechar_img').addEventListener('click', () => {
    UI.janela_alterar.style.display = 'none';
    UI.opacidade.style.display = 'none';
    mostrar_img.style.backgroundImage = 'none';
    texto.style.display = 'flex';
});

input_img.addEventListener('change', () => {
    const img = input_img.files[0];

    if (img){
        const leitor = new FileReader();

        leitor.onload = (e) => {
            mostrar_img.style.backgroundImage = `url('${e.target.result}')`;
            img_alterar = `${e.target.result}`;
        }

        leitor.readAsDataURL(img);
        
        texto.style.display = 'none';
    }
    
});

export { UI, estado };
//#endregion