import * as Edicao from '../Acoes/edicao.js';
import * as CM from '../Acoes/context-menu.js';
import * as Renomear from '../Acoes/renomear.js';
import * as Data from '../Data/data.js';

const UI = {
    roletas: document.getElementById('roletas'),
    menu_options: document.getElementById('menu_options'),
    adicionar: document.getElementById('add_roleta')
}

let estado = {
    ID: 1,
    elemento_atual: null,
    nome_roleta: null,
    contador_nome: 1,
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

//#region Clique nas roletas
UI.roletas.addEventListener('click', (e)=> {
    if (!e.target.closest('.roleta')) return;

    const roleta = e.target.closest('.roleta');
    //#region Excluir
    //Exclui a roleta ao clicar no botao de excluir
    if (e.target.closest('.container_excluir') && !estado.aberto_excluir_varios){
        Edicao.excluir(roleta, UI.roletas, false);
        Data.deleteLocalStorage(id_pasta, true, roleta.id);

        estado.contador_nome--;
    }
    //#endregion

    //#region Renomear
    //Renomeia a roleta ao clicar no botao de renomear
    else if (e.target.closest('.container_editar') && !estado.aberto_excluir_varios){
        //FAZER LOGICA DE RENOMEAR
    }
    //#endregion
})
//#endregion
/*Exclui ou Renomea arquivo*/
UI.roletas.addEventListener('click', (e) => {
    if (estado.aberto_excluir_varios) return;
    
    /* if (e.target.closest('.container_excluir')){
        let excluir = e.target.closest('.container_excluir');
        estado.elemento_atual = excluir.closest('.roleta');

        UI.roletas.removeChild(estado.elemento_atual);

        estado.contador_nome--;
        
        salvar_roletas();
    } */

    else if (e.target.closest('.container_renomear')){
        let renomear = e.target.closest('.container_renomear');
        estado.elemento_atual = renomear.closest('.roleta');

        janela_renomear.style.display = 'flex';
        input_nome_arquivo.placeholder = 'Nome';
        opacidade.style.display = 'block';
        
        estado.nome_roleta = estado.elemento_atual.querySelector('span');
        input_nome_arquivo.value = estado.nome_roleta.textContent;
    }
    
});
/*Abre a janela de renomear o nome*/
const janela_renomear = document.getElementById('janela_renomear');
const opacidade = document.getElementById('opacidade');
const fechar = document.getElementById('fechar');
const pronto = document.getElementById('pronto');
const input_nome_arquivo = document.getElementById('inserir');
const invalido = janela_renomear.querySelector('p');
let nome_exibido;
let nome_span;

/*Botão de fechar*/
fechar.addEventListener('click', () => {
    janela_renomear.style.display = 'none';
    opacidade.style.display = 'none';
    input_nome_arquivo.value = '';

    if (input_nome_arquivo.style.marginBottom == '0px'){
        input_nome_arquivo.style.marginBottom = '40px';
        invalido.style.display = 'none';
    }
    estado.elemento_atual = null;
    //if (aberto_excluir_varios) fecharExcluirVarios();
});

/*Nomes para testar a parte de renomear arquivo
coisa muito grandequeeuesperoquealcanceos44dígitiosparaoiffuncionar
coisamuitograndequeeuesperoquealcanceos44dígitiosparaoif funcionar
coisa muito grande que eu espero que alcance os 44 dígitios para o if funcionar
*/

/*Botão de pronto*/
pronto.addEventListener('click', () => {
    //console.log(input_nome_arquivo.value);
    if (input_nome_arquivo.value){
        
        //console.log(elemento_atual);
        nome_span = estado.elemento_atual.querySelector('.nome_completo');
        nome_span.textContent = input_nome_arquivo.value;

        nome_exibido = estado.elemento_atual.querySelector('h3');

        let stop = 44;
        if (nome_span.textContent.length > stop){
            let palavras = nome_span.textContent.split(" ");

            let nomeModificado = palavras.map(palavra => {
                if (palavra.length > 13){
                    return palavra.slice(0,11)+".";
                }
                else {
                    return palavra
                }
            });

            nomeModificado = nomeModificado.join(" ");

            if(nomeModificado.length > stop){
                nome_exibido.textContent = nomeModificado.slice(0,stop-3) + "...";
            }
            else {
                nome_exibido.textContent = nomeModificado;
            }
        }
        else {
            nome_exibido.textContent = nome_span.textContent;
        }

        janela_renomear.style.display = 'none';
        opacidade.style.display = 'none';
        invalido.style.display = 'none';
        input_nome_arquivo.style.marginBottom = '40px'
    }
    else{
        input_nome_arquivo.style.marginBottom = '0px';
        invalido.style.display = 'block';
    }

    input_nome_arquivo.value = '';
    salvar_roletas();
});

//Excluir vários
const excluir_varios = document.getElementById('excluir_varios');
const header_excluir = document.getElementById('header_excluir');
const fechar_excluir = document.getElementById('fechar_excluir');
const excluir_arquivos = document.getElementById('excluir_roletas');
const texto_selecionado = document.getElementById('texto_selecionado');
const contador_excluir = document.getElementById('contador_excluir');
let contador_arquivos = 0;
let arquivos_excluir = [];

excluir_varios.addEventListener('click', () => {
    header_excluir.style.opacity = '1';
    header_excluir.style.height = '100px';
    UI.menu_options.classList.remove('show');

    estado.elemento_atual.querySelector('.checkmark').style.opacity = '1';
    estado.elemento_atual.style.opacity = '0.5';

    arquivos_excluir.push(estado.elemento_atual);
    contador_arquivos++;
    contador_excluir.textContent = `${contador_arquivos}`;
    
    let temp = UI.roletas.querySelectorAll('.roleta');
    temp.forEach((arquivo) => {
        arquivo.dataset.clicked = "false";
    });
    
    estado.aberto_excluir_varios = true;
    estado.elemento_atual.dataset.clicked = "true";
    estado.elemento_atual.querySelector('.checkmark').style.opacity = '1';
});

fechar_excluir.addEventListener('click', () => {
    fecharExcluirVarios();
});

excluir_arquivos.addEventListener('click', () => {
    arquivos_excluir.forEach((arquivo) => {
        arquivo.remove();
        estado.contador_nome--;
    });
    fecharExcluirVarios();
    salvar_roletas();
})

UI.roletas.addEventListener('click', (e) => {
    estado.elemento_atual = e.target.closest('.roleta');

    if (estado.aberto_excluir_varios && (e.target.closest('.roleta'))) {
        
        if (estado.elemento_atual.dataset.clicked === "false") {
            // Seleciona
            estado.elemento_atual.querySelector('.checkmark').style.opacity = '1';
            estado.elemento_atual.style.opacity = '0.5';
            estado.elemento_atual.dataset.clicked = "true";

            arquivos_excluir.push(estado.elemento_atual);
            contador_arquivos++;
        } else {
            // Desseleciona
            estado.elemento_atual.querySelector('.checkmark').style.opacity = '0';
            estado.elemento_atual.style.opacity = '1';
            estado.elemento_atual.dataset.clicked = "false";

            let index = arquivos_excluir.indexOf(estado.elemento_atual);
            if (index > -1) arquivos_excluir.splice(index, 1);
            contador_arquivos--;
        }
        
        contador_excluir.textContent = contador_arquivos;
        if (contador_arquivos === 0) fecharExcluirVarios();
    }
});

function fecharExcluirVarios(){
    header_excluir.style.opacity = '0';
    header_excluir.style.height = '0px';

    arquivos_excluir.forEach((pasta) => {
        pasta.style.opacity = '1';
        pasta.querySelector('.checkmark').style.opacity = '0';
        pasta.dataset.clicked = "false";
    });

    arquivos_excluir = [];
    contador_arquivos = 0;
    estado.aberto_excluir_varios = false;
}

//Seleciona todos
const selecionar_todos = document.getElementById('selecionar_todos');

selecionar_todos.addEventListener('click', () => {
    let todas_arquivos = UI.roletas.querySelectorAll(".roleta");
    
    header_excluir.style.opacity = '1';
    header_excluir.style.height = '100px';
    UI.menu_options.classList.remove('show');

    todas_arquivos.forEach(arquivo => {
        if (arquivo.dataset.clicked === "false"){
            arquivo.querySelector(".checkmark").style.opacity = '1';
            arquivo.dataset.clicked = "true";
            arquivo.style.opacity = '0.5';
            
            arquivos_excluir.push(arquivo);
            contador_arquivos++;
        }
    });
    contador_excluir.textContent = contador_arquivos;
    estado.aberto_excluir_varios = true;
});