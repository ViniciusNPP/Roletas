import * as Edicao from '../Acoes/edicao.js';
import * as CM from '../Acoes/context-menu.js';
import * as Renomear from '../Acoes/renomear.js';
import * as ExcluirVarios from '../Acoes/excluir-varios.js';
import * as Data from '../Data/data.js';

const UI = {
    roletas: document.getElementById('roletas'),
    menu_options: document.getElementById('menu_options'),
    adicionar: document.getElementById('add_roleta'),
    opacidade: document.getElementById('opacidade'),
    janela_renomear: document.getElementById('janela_renomear'),
    header_excluir: document.getElementById('header_excluir')
}

let estado = {
    contador_nome: 1,
    elemento_atual: null,
    nome_roleta: null,
    aberto_excluir_varios: false,
    checkmark_id: null
}

const pastas = JSON.parse(localStorage.getItem('pastas')) || [];
const param = new URLSearchParams(window.location.search);
const id_pasta = param.get("id");
const pasta_atual =  pastas.find(pasta => pasta.id === id_pasta);

//Carrega as roletas do localStorage
 if (pasta_atual.dentro.length != 0){
    Data.carregarRoletasLocal(UI.roletas, pasta_atual.dentro);
 }

 //#region Context Menu
//Abre o context-menu
UI.roletas.addEventListener('contextmenu', function(e) {
    let roleta = e.target.closest('.roleta');
    if (!roleta) return;

    CM.contextMenu(e, UI.menu_options);

    estado.elemento_atual = roleta;
    estado.nome_roleta = roleta.querySelector('span');
    estado.checkmark_id = roleta.querySelector('.checkmark');
});

// Esconde o menu contexto ao cliclar fora
document.addEventListener('click', function(e) {
    if (!UI.menu_options.contains(e.target)) {
        UI.menu_options.classList.remove('show');
    }
});
//#endregion

//#region Criar Roleta
//Cria uma nova roleta
UI.adicionar.addEventListener('click', function(){
    if (estado.aberto_excluir_varios) return;
    
    Edicao.criarRoleta(UI.roletas, estado.contador_nome, '../img/roleta2.png');
    Data.createLocalStorage('roletas', true, id_pasta);

    estado.contador_nome++;
});
//#endregion

//#region Excluir vários
const contador_excluir = UI.header_excluir.querySelector('#contador_excluir');
let roletas_excluir = [];

function fecharExcluirVarios(){
    const checkmark_class = UI.roletas.getElementsByClassName('checkmark');

    UI.header_excluir.style.opacity = '0';
    UI.header_excluir.style.height = '0px';

    for (let i = 0; i < checkmark_class.length; i++){
        checkmark_class[i].style.opacity = '0';
    }
    roletas_excluir.forEach((roleta) => {
        roleta.style.opacity = '1';
    });

    estado.aberto_excluir_varios = false;
    roletas_excluir = [];
}

function abrirExcluirVarios(){
    UI.header_excluir.style.opacity = '1';
    UI.header_excluir.style.height = '100px';
    UI.menu_options.classList.remove('show');

    estado.checkmark_id.style.opacity = '1';
    estado.elemento_atual.style.opacity = '0.5';
    estado.aberto_excluir_varios = true;
    
    contador_excluir.textContent = `${roletas_excluir.length}`;
}

//Mostrar o menu de excluir vários
UI.menu_options.querySelector('#excluir_varios').addEventListener('click', () => {
    roletas_excluir.push(estado.elemento_atual);
    abrirExcluirVarios();
});

//Fechar o menu de excluir vários
UI.header_excluir.querySelector('#fechar_excluir').addEventListener('click', () => {
    fecharExcluirVarios();
});

//Excluir as roletas selecionadas
UI.header_excluir.querySelector('#excluir_roletas').addEventListener('click', () => {
    estado.contador_nome -= roletas_excluir.length;
    UI.aberto_excluir_varios = false;
    
    ExcluirVarios.excluirVarios(roletas_excluir, UI.roletas, false);
    roletas_excluir.forEach(roleta => {
        Data.deleteLocalStorage(id_pasta, true, roleta.id);
    });
    
    fecharExcluirVarios();
});
//#endregion

//#region Clique nas roletas
UI.roletas.addEventListener('click', (e)=> {
    if (!e.target.closest('.roleta')) return;

    const roleta = e.target.closest('.roleta');
    estado.elemento_atual = roleta;
    estado.nome_roleta = roleta.querySelector('span');

    if (estado.aberto_excluir_varios){
        ExcluirVarios.verificarSelecao(estado.elemento_atual, roletas_excluir, estado.aberto_excluir_varios); //verifica se é valido selecionar/desselecionar a roleta
        if (roletas_excluir.length === 0 && estado.aberto_excluir_varios){ //fecha o HUD de excluir vários se não tiver mais pastas selecionadas
            fecharExcluirVarios();
        }
        return;
    }

    //#region Excluir
    //Exclui a roleta ao clicar no botao de excluir
    else if (e.target.closest('.container_excluir')){
        Edicao.excluir(roleta, UI.roletas, false);
        Data.deleteLocalStorage(id_pasta, true, roleta.id);

        estado.contador_nome--;
        return;
    }
    //#endregion

    //#region Renomear
    //Renomeia a roleta ao clicar no botao de renomear
    else if (e.target.closest('.container_editar')){
        //Abrir menu de renomear
        const input_nome_roleta = UI.janela_renomear.querySelector('#inserir');
        const invalido = UI.janela_renomear.querySelector('p');

        UI.janela_renomear.style.display = 'flex';
        UI.menu_options.classList.remove('show');
        UI.opacidade.style.display = 'block';

        input_nome_roleta.value = estado.nome_roleta.textContent;

        //Fechar menu de renomear
        UI.janela_renomear.querySelector('#fechar').onclick = function(){
            Renomear.botaoFecharRenomear(input_nome_roleta, invalido);
            UI.janela_renomear.style.display = 'none';
            UI.opacidade.style.display = 'none';
            
            return;
        }

        //Renomear roleta
        UI.janela_renomear.querySelector('#pronto').onclick = function(){
            const nome_exibido = estado.elemento_atual.querySelector('h3');
            const nome_completo = estado.elemento_atual.querySelector('#nome_completo');
            
            Renomear.renomearPasta(input_nome_roleta, nome_exibido, nome_completo, invalido);
    
            if (input_nome_roleta.value){
                UI.janela_renomear.style.display = 'none';
                UI.opacidade.style.display = 'none';

                Data.updateLocalStorage(estado.elemento_atual, id_pasta, true, estado.elemento_atual.id);
            }
            return;
        }
    }
    //#endregion
    window.location.href = `/roleta/roleta.html?id=${estado.elemento_atual.id}`;
    //#region Entrar na roleta
    
    //#endregion
});
//#endregion

//#region Selecionar todos
UI.menu_options.querySelector('#selecionar_todos').addEventListener('click', () => {
    if (estado.aberto_excluir_varios) return;
    
    abrirExcluirVarios();
    UI.roletas.querySelectorAll(".roleta").forEach(roleta => {
        ExcluirVarios.selecionarPasta(roleta.querySelector('.checkmark'), roleta, roletas_excluir);
    });
    contador_excluir.textContent = roletas_excluir.length;
});
//#endregion