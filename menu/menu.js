import * as Data from '../Data/data.js';
import * as Acao from '../Acoes/edicao.js';
import * as CM from '../Acoes/context-menu.js';
import * as Renomear from '../Acoes/renomear.js';
import * as ExcluirVarios from '../Acoes/excluir-varios.js';
import * as AlterarImagem from '../Acoes/alterar-imagem.js';

const UI = {
    pastas: document.getElementById('pastas'),
    menu_options: document.getElementById('menu_options'),
    janela_renomear: document.getElementById('janela_renomear'),
    opacidade: document.getElementById('opacidade'),
    header_excluir: document.getElementById('header_excluir'),
    janela_alterar: document.getElementById('janela_alterar'),
    adicionar: document.getElementById('add_pasta')
};

let estado = {
    ID: 1,
    contador_nome: 1,
    elemento_atual: null,
    nome_pasta: null,
    checkmark_id: null,
    imagem_pasta: null,
    aberto_excluir_varios: false
};
//#region Load
//Função para carregar as pastas do localStorage
if (UI.pastas){

    const pastas = JSON.parse(localStorage.getItem('pastas'));
    Data.carregarPastasLocal(UI.pastas, pastas);
    //console.log(Data.updateLocalStorage(pastas[0].id));
     
    if (pastas != null) {
        estado.contador_nome = pastas.length + 1;
    }
    //#endregion
    
    //#region Context Menu
    UI.pastas.addEventListener('contextmenu', function (e) {
        let pasta = e.target.closest('.pasta');
        if (!pasta) return;

        CM.contextMenu(e, UI.menu_options);

        estado.elemento_atual = pasta;
        estado.nome_pasta = pasta.querySelector('span');
        estado.imagem_pasta = pasta.querySelector('img');
        estado.checkmark_id = pasta.querySelector('div');
    });
    
    // Esconde o menu contexto ao cliclar fora
    document.addEventListener('click', function (e) {
        if (!UI.menu_options.contains(e.target)) {
            UI.menu_options.classList.remove('show');
        }
    });
    //#endregion
    
    //#region Criar Pasta
    UI.adicionar.addEventListener('click', function () {
        Acao.criarPasta(UI.pastas, estado.contador_nome, '../img/Pasta-roleta.png'); //Cria uma nova posta
        estado.contador_nome++;
    });
    //#endregion
    
    //#region Excluir pasta
    //Exclui a pasta
    UI.menu_options.querySelector('#excluir').addEventListener('click', function () {
        Acao.excluir(estado.elemento_atual, UI.pastas);

        estado.elemento_atual = null;
        estado.contador_nome--;
        UI.menu_options.classList.remove('show');
    });
    //#endregion
    
    //#region Renomear
    const input_nome_pasta = UI.janela_renomear.querySelector('#inserir');
    const invalido = UI.janela_renomear.querySelector('p');
    
    /*Abre a janela de renomear o nome*/
    UI.menu_options.querySelector('#renomear').addEventListener('click', () => {
        UI.janela_renomear.style.display = 'flex';
        UI.menu_options.classList.remove('show');
        UI.opacidade.style.display = 'block';

        input_nome_pasta.value = estado.nome_pasta.textContent;
    });

    /*Botão de fechar*/
    UI.janela_renomear.querySelector('#fechar').addEventListener('click', () => {
        Renomear.botaoFecharRenomear(input_nome_pasta, invalido);
        UI.janela_renomear.style.display = 'none';
        UI.opacidade.style.display = 'none';
        console.log("Fechado");
    });

    /*Botão de pronto*/
    UI.janela_renomear.querySelector('#pronto').addEventListener('click', () => {
        const nome_exibido = estado.elemento_atual.querySelector('h3');
        const nome_completo = estado.elemento_atual.querySelector('#nome_completo');
        Renomear.renomearPasta(input_nome_pasta, nome_exibido, nome_completo, invalido);

        if (input_nome_pasta.value){
            UI.janela_renomear.style.display = 'none';
            UI.opacidade.style.display = 'none';
        }
    });
    //#endregion
    
    //#region Excluir vários
    //Excluir vários
    const contador_excluir = UI.header_excluir.querySelector('#contador_excluir');
    let pastas_excluir = [];

    function fecharExcluirVarios(){
        const checkmark_class = UI.pastas.getElementsByClassName('checkmark');
    
        UI.header_excluir.style.opacity = '0';
        UI.header_excluir.style.height = '0px';

        for (let i = 0; i < checkmark_class.length; i++){
            checkmark_class[i].style.opacity = '0';
        }
        pastas_excluir.forEach((pasta) => {
            pasta.style.opacity = '1';
        });

        estado.aberto_excluir_varios = false;
        pastas_excluir = [];
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
        
        ExcluirVarios.excluirVarios(pastas_excluir, UI.pastas);
        fecharExcluirVarios();
    })
    //#endregion
    
    //#region clique nas pastas
    UI.pastas.addEventListener('click', (e) => {
        const pasta_atual = e.target.closest('.pasta');
        if (!pasta_atual) return;
    
        //Ir para a página das pastas
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

        AlterarImagem.aplicarAlteracaoImagem(img_alterar, mostrar_img, texto, estado.imagem_pasta);
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
export {estado};
//#endregion