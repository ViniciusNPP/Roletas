import * as Data from '../Data/data.js';
import * as Acao from '../Acoes/edicao.js';
import * as CM from '../Acoes/context-menu.js';
import * as Renomear from '../Acoes/renomear.js';
import * as ExcluirVarios from '../Acoes/excluir-varios.js';
import * as AlterarImagem from '../Acoes/alterar-imagem.js';
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
if (UI.roletas){

    const pastas = JSON.parse(localStorage.getItem('pastas'));
    Data.carregarPastasLocal(UI.roletas, pastas);
    
    //MUDAR LOGICA DOS IDS E CONTADORES           
    if (pastas != null) {
        estado.ID = pastas.length + 1;
        estado.contador_nome = pastas.length + 1;
    }
    //#endregion
    
    //#region Context Menu
    UI.roletas.addEventListener('contextmenu', function (e) {
        CM.contextMenu(e, UI.menu_options);
    });
    
    // Esconde o menu contexto ao cliclar fora
    document.addEventListener('click', function (e) {
        if (!UI.menu_options.contains(e.target)) {
            UI.menu_options.classList.remove('show');
        }
    });
    //#endregion
    
    //#region Criar Roleta
    UI.adicionar.addEventListener('click', function () {
        Acao.criarPasta(UI.roletas, estado.contador_nome, '../img/Pasta-roleta.png', '.roleta'); //Cria uma nova posta
        estado.contador_nome++;
    });
    //#endregion
    
    //#region Excluir roleta
    //Exclui a roleta
    UI.menu_options.querySelector('#excluir').addEventListener('click', function () {
        Acao.excluir(estado.elemento_atual, UI.roletas, '.roleta');

        estado.elemento_atual = null;
        estado.contador_nome--;
        UI.menu_options.classList.remove('show');
    });
    //#endregion
    
    //#region Renomear
    const input_nome_roleta = UI.janela_renomear.querySelector('#inserir');
    const invalido = UI.janela_renomear.querySelector('p');
    
    /*Abre a janela de renomear o nome*/
    UI.menu_options.querySelector('#renomear').addEventListener('click', () => {
        UI.janela_renomear.style.display = 'flex';
        UI.menu_options.classList.remove('show');
        UI.opacidade.style.display = 'block';

        input_nome_roleta.value = estado.nome_roleta.textContent;
    
        /*Botão de fechar*/
        UI.janela_renomear.querySelector('#fechar').addEventListener('click', () => {
            Renomear.botaoFecharRenomear(input_nome_roleta, invalido);
            UI.janela_renomear.style.display = 'none';
            UI.opacidade.style.display = 'none';
        });
    
        /*Botão de pronto*/
        UI.janela_renomear.querySelector('#pronto').addEventListener('click', () => {
            const nome_exibido = estado.elemento_atual.querySelector('h3');
            const nome_completo = estado.elemento_atual.querySelector('#nome_completo');
            Renomear.renomearRoleta(input_nome_roleta, nome_exibido, nome_completo, invalido);

            if (input_nome_roleta.value){
                UI.janela_renomear.style.display = 'none';
                UI.opacidade.style.display = 'none';
            }
        });
    });
    //#endregion
    
    //#region Excluir vários
    //Excluir vários
    const contador_excluir = UI.header_excluir.querySelector('#contador_excluir');
    let pastas_excluir = [];

    function fecharExcluirVarios(){
        const checkmark_class = UI.roletas.getElementsByClassName('checkmark');
    
        UI.header_excluir.style.opacity = '0';
        UI.header_excluir.style.height = '0px';

        for (let i = 0; i < checkmark_class.length; i++){
            checkmark_class[i].style.opacity = '0';
        }
        pastas_excluir.forEach((pasta) => {
            pasta.style.opacity = '1';
        });

        estado.aberto_excluir_varios = false;
    }

    //Mostrar o menu de excluir vários
    UI.menu_options.querySelector('#excluir_varios').addEventListener('click', () => {
        UI.header_excluir.style.opacity = '1';
        UI.header_excluir.style.height = '100px';
        UI.menu_options.classList.remove('show');

        estado.checkmark_id.style.opacity = '1';
        estado.elemento_atual.style.opacity = '0.5';
        estado.aberto_excluir_varios = true;

        pastas_excluir.push(estado.elemento_atual);
        contador_excluir.textContent = `${pastas_excluir.length}`;
    });
    
    UI.header_excluir.querySelector('#fechar_excluir').addEventListener('click', () => {
        fecharExcluirVarios();
    });
    
    UI.header_excluir.querySelector('#excluir_pastas').addEventListener('click', () => {
        estado.contador_nome -= pastas_excluir.length;
        UI.aberto_excluir_varios = false;
        
        ExcluirVarios.excluirVarios(pastas_excluir, UI.roletas, '.roleta');
    })
    //#endregion
    
    //#region clique nas pastas
    UI.roletas.addEventListener('click', (e) => {
        const pasta_atual = e.target.classList.contains('roleta') ? e.target : e.target.closest('.roleta');
        if (!pasta_atual) return;
    
        //Ir para a página das roletas
        if (!estado.aberto_excluir_varios) {
            window.location.href = `/dentro da pasta/roletas.html?id=${pasta_atual.id}`;
        }

        ExcluirVarios.verificarSelecao(pasta_atual, pastas_excluir, estado.aberto_excluir_varios); //verifica se é valido selecionar/desselecionar a pasta
        if (pastas_excluir.length === 0 && estado.aberto_excluir_varios){ //fecha o HUD de excluir vários se não tiver mais pastas selecionadas
            fecharExcluirVarios();
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

        AlterarImagem.aplicarAlteracaoImagem(img_alterar, mostrar_img, texto, estado.imagem_roleta);
    });
    
    UI.janela_alterar.querySelector('#fechar_img').addEventListener('click', () => {
        UI.janela_alterar.style.display = 'none';
        UI.opacidade.style.display = 'none';
        mostrar_img.style.backgroundImage = 'none';
        texto.style.display = 'flex';
    });
    
    input_img.addEventListener('change', async () => {
        img_alterar = await AlterarImagem.alterarImagem(input_img, mostrar_img, texto);
    });
}
export { UI, estado };
//#endregion