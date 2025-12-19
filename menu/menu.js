import * as Data from '../Data/data.js';
import * as Acao from '../Acoes/acoes.js';
//console.log(JSON.parse(localStorage.getItem("pastas")));
//Mostra o localStorage.

//localStorage.setItem("pastas", JSON.stringify([]));
//Limpa o localStorage

const roletas = document.getElementById('roletas');
const menu_options = document.getElementById('menu_options');
const adicionar = document.getElementById('add_roleta');
const excluir = document.getElementById('excluir');
const renomear = document.getElementById('renomear');
let estado = {
    ID: 1,
    contador_nome: 1,
    elementoAtual: null,
    nome_roleta: null,
    checkmark_id: null,
    imagem_roleta: null,
    aberto_excluir_varios: false
};

//#region Load
//Função para carregar as roletas do localStorage
const pastas = JSON.parse(localStorage.getItem('pastas'));
Data.carregarPastasLocal(roletas, pastas);

if (pastas != null){
    estado.ID = pastas.length + 1;
    estado.contador_nome = pastas.length + 1;
}
//#endregion

//#region Context Menu
roletas.addEventListener('contextmenu', function(e) {
    
    //Atribuindo os valores retornados da função contextMenu para as variáveis
    let dados = Acao.contextMenu(e, menu_options);
    estado.elementoAtual = dados.elementoAtual;
    estado.nome_roleta = dados.nome_roleta;
    estado.imagem_roleta = dados.imagem_roleta;
    estado.checkmark_id = dados.checkmark_id;

});

// Esconde o menu contexto ao cliclar fora
document.addEventListener('click', function(e) {
    if (!menu_options.contains(e.target)) {
        menu_options.classList.remove('show');
    }
});
//#endregion

//#region Criar Roleta
adicionar.addEventListener('click', function(){
    
    console.log(estado.ID);
    Acao.criarPasta(roletas, estado, 'img/roleta2.png'); //Cria a a nova posta
    Data.salvarPastasLocal(document.querySelectorAll('.roleta')); //Salva a nova pasta no localStorage

    //Animação para quando clicar no botão.
    adicionar.style.transform = 'scale(1)';
    setTimeout(() => {
        adicionar.style.transform = 'scale(1.05)';
    }, 80)

    if(estado.aberto_excluir_varios){
        fecharExcluirVarios();
    }

});
//#endregion

//#region Excluir roleta
//Exclui a roleta
excluir.addEventListener('click', function(){
    Acao.excluirPasta(roletas, estado);
    
    menu_options.classList.remove('show');
    Data.salvarPastasLocal(document.querySelectorAll('.roleta'));

    if(estado.aberto_excluir_varios) fecharExcluirVarios();
});
//#endregion

//#region Renomear
const janela_renomear = document.getElementById('janela_renomear');
const opacidade = document.getElementById('opacidade');
const fechar = document.getElementById('fechar');
const pronto = document.getElementById('pronto');
const input_nome_roleta = document.getElementById('inserir');
const invalido = janela_renomear.querySelector('p');
let nome_exibido;
let nome_span;

/*Abre a janela de renomear o nome*/
renomear.addEventListener('click', () => {
    janela_renomear.style.display = 'flex';
    menu_options.classList.remove('show');
    input_nome_roleta.placeholder = 'Nome';

    input_nome_roleta.value = estado.nome_roleta.textContent;

    opacidade.style.display = 'block';

    if (estado.aberto_excluir_varios){
        fecharExcluirVarios();
    }
});

/*Botão de fechar*/
fechar.addEventListener('click', () => {
    janela_renomear.style.display = 'none';
    opacidade.style.display = 'none';
    input_nome_roleta.value = '';

    if (input_nome_roleta.style.marginBottom == '0px'){
        input_nome_roleta.style.marginBottom = '40px';
        invalido.style.display = 'none';
    }
});

/*Botão de pronto*/
pronto.addEventListener('click', () => {
    if (input_nome_roleta.value){

        nome_span = estado.elementoAtual.querySelector('span');
        nome_span.textContent = input_nome_roleta.value;

        nome_exibido = estado.elementoAtual.querySelector('h3');

        if (input_nome_roleta.value.length > 15){
            nome_exibido.textContent = input_nome_roleta.value.slice(0,14) + "...";
        }
        
        else {
            nome_exibido.textContent = nome_span.textContent;
        }

        janela_renomear.style.display = 'none';
        opacidade.style.display = 'none';

        if (input_nome_roleta.style.marginBottom === '0px'){
            input_nome_roleta.style.marginBottom = '40px';
            invalido.style.display = 'none';
        }
    }
    else{
        input_nome_roleta.style.marginBottom = '0px';
        invalido.style.display = 'block';
    }

    input_nome_roleta.value = '';

    Data.salvarPastasLocal(document.querySelectorAll('.roleta'));
});
//#endregion

//#region Excluir vários
//Excluir vários
const excluir_varios = document.getElementById('excluir_varios');
const header_excluir = document.getElementById('header_excluir');
const fechar_excluir = document.getElementById('fechar_excluir');
const excluir_pastas = document.getElementById('excluir_pastas');
const texto_selecionado = document.getElementById('texto_selecionado');
const contador_excluir = document.getElementById('contador_excluir');
const checkmark_class = document.getElementsByClassName('checkmark');
let contador_pastas = 0;
let pastas_excluir = [];

excluir_varios.addEventListener('click', () => {
    header_excluir.style.opacity = '1';
    header_excluir.style.height = '100px';
    menu_options.classList.remove('show');

    estado.checkmark_id.style.opacity = '1';
    estado.elementoAtual.style.opacity = '0.5';

    pastas_excluir.push(estado.elementoAtual);
    contador_pastas++;
    contador_excluir.textContent = `${contador_pastas}`;
    
    estado.aberto_excluir_varios = true;
    estado.elementoAtual.dataset.clicked = "true";

});

fechar_excluir.addEventListener('click', () => {
    fecharExcluirVarios();
});

excluir_pastas.addEventListener('click', () => {
    pastas_excluir.forEach((pasta) => {
        pasta.remove();
        estado.contador_nome--;

    });
    fecharExcluirVarios();
    Data.salvarPastasLocal(document.querySelectorAll('.roleta'));
})

roletas.addEventListener('click', (e) => {
    estado.elementoAtual = e.target.classList.contains('roleta') ? e.target : e.target.parentNode;

    if (estado.aberto_excluir_varios && (e.target.classList.contains('roleta') || e.target.parentNode?.classList.contains('roleta'))) {
        
        if (!estado.elementoAtual.dataset.clicked || estado.elementoAtual.dataset.clicked === "false") {
            // Seleciona
            estado.elementoAtual.querySelector('.checkmark').style.opacity = '1';
            estado.elementoAtual.style.opacity = '0.5';
            estado.elementoAtual.dataset.clicked = "true";
            pastas_excluir.push(estado.elementoAtual);
            contador_pastas++;
        } else {
            // Desseleciona
            estado.elementoAtual.querySelector('.checkmark').style.opacity = '0';
            estado.elementoAtual.style.opacity = '1';
            estado.elementoAtual.dataset.clicked = "false";
            const index = pastas_excluir.indexOf(estado.elementoAtual);
            if (index > -1) pastas_excluir.splice(index, 1);
            contador_pastas--;
        }
        
        contador_excluir.textContent = contador_pastas;
        if (contador_pastas === 0) fecharExcluirVarios();
    }
    //Ir para a página das roletas
    else if (!estado.aberto_excluir_varios && (e.target.closest('.roleta'))){
        console.log(estado.elementoAtual);
        window.location.href = `/dentro da pasta/roletas.html?id=${estado.elementoAtual.id}`;
    }
});

function fecharExcluirVarios(){
    header_excluir.style.opacity = '0';
    header_excluir.style.height = '0px';

    for (let i = 0; i < checkmark_class.length; i++){
        checkmark_class[i].style.opacity = '0';
    }
    pastas_excluir.forEach((pasta) => {
        pasta.style.opacity = '1';
        pasta.dataset.clicked = "false";
        console.log(pasta.dataset.clicked);
    });

    pastas_excluir = [];
    contador_pastas = 0;
    estado.aberto_excluir_varios = false;
}
//#endregion

//#region Alterar Imagem
//Janela de alterar imagem
const botao_img = document.getElementById('botao_imagem');
const pronto_alterar = document.getElementById('mudar_img');
const fechar_alterar = document.getElementById('fechar_img');
const janela_alterar = document.getElementById('janela_alterar');
const mostrar_img = document.getElementById('alterar_img');
const input_img = document.getElementById('enviar_img');
const texto = document.getElementById('texto_alterar');
let img_alterar = null;

botao_img.addEventListener('click', () => {
    janela_alterar.style.display = 'flex';
    opacidade.style.display = 'block';
    menu_options.classList.remove('show');
});

pronto_alterar.addEventListener('click', () => {
    janela_alterar.style.display = 'none';
    opacidade.style.display = 'none';

    estado.imagem_roleta.src = img_alterar;
    mostrar_img.style.backgroundImage = 'none';
    texto.style.display = 'flex';

    Data.salvarPastasLocal(document.querySelectorAll('.roleta'));
});

fechar_alterar.addEventListener('click', () => {
    janela_alterar.style.display = 'none';
    opacidade.style.display = 'none';
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
    
})
//#endregion