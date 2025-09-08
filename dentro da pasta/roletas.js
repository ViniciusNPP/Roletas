//console.log(JSON.parse(localStorage.getItem("roleta-10")));
//Mostra o localStorage.

//localStorage.setItem("roleta-10", JSON.stringify([]));
//Limpa o localStorage

const arquivos = document.getElementById('arquivos');
const adicionar = document.getElementById('add_arquivo');
const menu_options = document.getElementById('menu_options');
let elemento_atual = null;
let nome_arquivo = null;
let aberto_excluir_varios;
let contador_arquivo = 0;
let contador_nome = 1;

const pastas = JSON.parse(localStorage.getItem('pastas')) || [];
const param = new URLSearchParams(window.location.search);
const id_pasta = param.get("id");
let pasta_atual;

carregar_roletas();

//Função para salvar as roletas localmente
function salvar_roletas() {
    let todos_arquivos = document.querySelectorAll('.arquivo');
    
    pasta_atual = pastas.find(pasta => pasta.id === id_pasta).arquivos;
    
    pasta_atual.length = 0;
    
    todos_arquivos.forEach(arquivo => {
        let id = arquivo.id;
        let img = arquivo.querySelector('img').src;
        let nome_completo = arquivo.querySelector('span').textContent;
        let nome = arquivo.querySelector('h3').textContent;
        
        pasta_atual.push({id, img, nome_completo, nome});
    });
    localStorage.setItem('pastas', JSON.stringify(pastas));
}

//Carrega as roletas do localStorage
function carregar_roletas() {

    if (!pasta_atual){
        pasta_atual = pastas.find(pasta => pasta.id === id_pasta).arquivos;
        console.log(pasta_atual);
    }

    pasta_atual.forEach(arquivo => {
        let novo_arquivo = document.createElement('div');
        novo_arquivo.classList.add('arquivo');
        novo_arquivo.id = arquivo.id;

        let img = document.createElement('img');
        img.src = arquivo.img;
        img.classList.add('foto_roleta')
        novo_arquivo.appendChild(img);

        let nome = document.createElement('h3');
        nome.textContent = arquivo.nome;
        novo_arquivo.appendChild(nome);

        let menu_arquivo = document.createElement('div');
        menu_arquivo.classList.add('menu_arquivo');
        menu_arquivo.id = 'menu_arquivo';

        let container_renomear = document.createElement('div');
        container_renomear.classList.add('container_renomear', 'container');
        let renomear_arquivo = document.createElement('img');
        renomear_arquivo.classList.add('editar_arquivo');
        renomear_arquivo.src = 'img/Pen.png';
        container_renomear.appendChild(renomear_arquivo);
        menu_arquivo.appendChild(container_renomear);

        let container_excluir = document.createElement('div');
        container_excluir.classList.add('container_excluir', 'container');
        let excluir_arquivo = document.createElement('img');
        excluir_arquivo.classList.add('excluir_arquivo');
        excluir_arquivo.src = 'img/Trash.png';
        container_excluir.appendChild(excluir_arquivo);
        menu_arquivo.appendChild(container_excluir);

        novo_arquivo.appendChild(menu_arquivo);
        
        let nome_completo = document.createElement('span');
        nome_completo.classList.add('nome_completo');
        nome_completo.id = 'nome_completo';
        nome_completo.textContent = arquivo.nome_completo;
        novo_arquivo.appendChild(nome_completo);

        let checkmark = document.createElement('div');
        checkmark.classList.add('checkmark');
        novo_arquivo.appendChild(checkmark);

        novo_arquivo.dataset.clicked = "false";
        arquivos.appendChild(novo_arquivo);
    });
}
//Abre o context-menu
arquivos.addEventListener('contextmenu', function(e) {
    //console.log(e.target.closest('.roleta'));
    
    if (e.target.closest('.arquivo')){
        
        e.preventDefault();
        menu_options.classList.remove('show');
    
    //Mostra o menu contexto na posição do cursor
    setTimeout(() => {
        menu_options.style.left = `${e.pageX}px`;
        menu_options.style.top = `${e.pageY}px`;
        menu_options.classList.add('show');
        }, 80)
    }
    else{
        menu_options.classList.remove('show');
    }

    if (e.target.closest('.arquivo')){
        elemento_atual = e.target.closest('.arquivo');

        nome_arquivo = elemento_atual.querySelector('span');
        checkmark_id = elemento_atual.querySelector('.checkmark');
    }
});

// Esconde o menu contexto ao cliclar fora
document.addEventListener('click', function(e) {
    if (!menu_options.contains(e.target)) {
        menu_options.classList.remove('show');
    }
});

//Cria uma nova roleta
adicionar.addEventListener('click', function(){
    if (aberto_excluir_varios) return;
    
    let novo_arquivo = document.createElement('div');
    novo_arquivo.classList.add('arquivo');
    novo_arquivo.id = `arquivo-${Date.now()}`;

    let img = document.createElement('img');
    img.src = 'img/roleta2.png';
    img.classList.add('foto_roleta')
    novo_arquivo.appendChild(img);

    let nome = document.createElement('h3');
    nome.textContent = `Arquivo ${contador_nome++}`;
    novo_arquivo.appendChild(nome);

    let menu_arquivo = document.createElement('div');
    menu_arquivo.classList.add('menu_arquivo');
    menu_arquivo.id = 'menu_arquivo';

    let container_renomear = document.createElement('div');
    container_renomear.classList.add('container_renomear', 'container');
    let renomear_arquivo = document.createElement('img');
    renomear_arquivo.classList.add('editar_arquivo');
    renomear_arquivo.src = 'img/Pen.png';
    container_renomear.appendChild(renomear_arquivo);
    menu_arquivo.appendChild(container_renomear);

    let container_excluir = document.createElement('div');
    container_excluir.classList.add('container_excluir', 'container');
    let excluir_arquivo = document.createElement('img');
    excluir_arquivo.classList.add('excluir_arquivo');
    excluir_arquivo.src = 'img/Trash.png';
    container_excluir.appendChild(excluir_arquivo);
    menu_arquivo.appendChild(container_excluir);

    novo_arquivo.appendChild(menu_arquivo);
    
    let nome_completo = document.createElement('span');
    nome_completo.classList.add('nome_completo');
    nome_completo.id = 'nome_completo';
    nome_completo.textContent = nome.textContent;
    novo_arquivo.appendChild(nome_completo);

    let checkmark = document.createElement('div');
    checkmark.classList.add('checkmark');
    novo_arquivo.appendChild(checkmark);

    novo_arquivo.dataset.clicked = "false";
    arquivos.appendChild(novo_arquivo);
    salvar_roletas();
});

/*Exclui ou Renomea arquivo*/
arquivos.addEventListener('click', (e) => {
    if (aberto_excluir_varios) return;
    
    if (e.target.closest('.container_excluir')){
        let excluir = e.target.closest('.container_excluir');
        elemento_atual = excluir.closest('.arquivo');

        arquivos.removeChild(elemento_atual);

        contador_nome--;
        
        salvar_roletas();
    }

    else if (e.target.closest('.container_renomear')){
        let renomear = e.target.closest('.container_renomear');
        elemento_atual = renomear.closest('.arquivo');

        janela_renomear.style.display = 'flex';
        input_nome_arquivo.placeholder = 'Nome';
        opacidade.style.display = 'block';
        
        nome_arquivo = elemento_atual.querySelector('span');
        input_nome_arquivo.value = nome_arquivo.textContent;
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
    elemento_atual = null;
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
        nome_span = elemento_atual.querySelector('.nome_completo');
        nome_span.textContent = input_nome_arquivo.value;

        nome_exibido = elemento_atual.querySelector('h3');

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
const excluir_arquivos = document.getElementById('excluir_arquivos');
const texto_selecionado = document.getElementById('texto_selecionado');
const contador_excluir = document.getElementById('contador_excluir');
let contador_arquivos = 0;
let arquivos_excluir = [];

excluir_varios.addEventListener('click', () => {
    header_excluir.style.opacity = '1';
    header_excluir.style.height = '100px';
    menu_options.classList.remove('show');

    elemento_atual.querySelector('.checkmark').style.opacity = '1';
    elemento_atual.style.opacity = '0.5';

    arquivos_excluir.push(elemento_atual);
    contador_arquivos++;
    contador_excluir.textContent = `${contador_arquivos}`;
    
    let temp = arquivos.querySelectorAll('.arquivo');
    temp.forEach((arquivo) => {
        arquivo.dataset.clicked = "false";
    });
    
    aberto_excluir_varios = true;
    elemento_atual.dataset.clicked = "true";
    elemento_atual.querySelector('.checkmark').style.opacity = '1';
});

fechar_excluir.addEventListener('click', () => {
    fecharExcluirVarios();
});

excluir_arquivos.addEventListener('click', () => {
    arquivos_excluir.forEach((arquivo) => {
        arquivo.remove();
        contador_nome--;
    });
    fecharExcluirVarios();
    salvar_roletas();
})

arquivos.addEventListener('click', (e) => {
    elemento_atual = e.target.closest('.arquivo');

    if (aberto_excluir_varios && (e.target.closest('.arquivo'))) {
        
        if (elemento_atual.dataset.clicked === "false") {
            // Seleciona
            elemento_atual.querySelector('.checkmark').style.opacity = '1';
            elemento_atual.style.opacity = '0.5';
            elemento_atual.dataset.clicked = "true";

            arquivos_excluir.push(elemento_atual);
            contador_arquivos++;
        } else {
            // Desseleciona
            elemento_atual.querySelector('.checkmark').style.opacity = '0';
            elemento_atual.style.opacity = '1';
            elemento_atual.dataset.clicked = "false";

            let index = arquivos_excluir.indexOf(elemento_atual);
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
    aberto_excluir_varios = false;
}

//Seleciona todos
const selecionar_todos = document.getElementById('selecionar_todos');

selecionar_todos.addEventListener('click', () => {
    let todas_arquivos = arquivos.querySelectorAll(".arquivo");
    
    header_excluir.style.opacity = '1';
    header_excluir.style.height = '100px';
    menu_options.classList.remove('show');

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
    aberto_excluir_varios = true;
});