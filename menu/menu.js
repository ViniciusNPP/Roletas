//console.log(JSON.parse(localStorage.getItem("pastas")));
//Mostra o localStorage.

//localStorage.setItem("pastas", JSON.stringify([]));
//Limpa o localStorage

const roletas = document.getElementById('roletas');
const menu_options = document.getElementById('menu_options');
const adicionar = document.getElementById('add_roleta');
const excluir = document.getElementById('excluir');
const renomear = document.getElementById('renomear');
let elementoAtual = null;
let nome_roleta = null;
let checkmark_id = null;
let imagem_roleta = null;
let contadorRoletas = JSON.parse(localStorage.getItem('roletas'))?.length + 1 || 1;
let contadorNome = JSON.parse(localStorage.getItem('roletas'))?.length + 1 || 1;
let aberto_excluir_varios = false;

carregarRoletas();

//Função para salvar as roletas no localStorage
function salvarRoletas() {
    let roletasArray = [];
    let roletasElementos = document.querySelectorAll('.roleta');

    roletasElementos.forEach(roleta => {
        let nome = roleta.querySelector('h3').textContent;
        let nome_completo = roleta.querySelector('span').textContent;
        let img = roleta.querySelector('img').src;
        let id = roleta.id;
        let arquivos = [];

        roletasArray.push({arquivos, nome, img, nome_completo, id});

        localStorage.setItem('pastas', JSON.stringify(roletasArray));
    });
}

//Função para carregar as roletas do localStorage
function carregarRoletas() {
    let roletasSalvas = localStorage.getItem('pastas');

    if (roletasSalvas) {
        let roletasArray = JSON.parse(roletasSalvas);

        roletasArray.forEach((roleta, index) => {
            let novaRoleta = document.createElement('div');
            novaRoleta.classList.add('roleta');
            novaRoleta.id = `${roleta.id}`;

            let img = document.createElement('img');
            img.src = roleta.img;
            novaRoleta.appendChild(img);

            let nome = document.createElement('h3');
            nome.textContent = roleta.nome;
            novaRoleta.appendChild(nome);

            let nome_completo = document.createElement('span');
            nome_completo.textContent = roleta.nome_completo;
            nome_completo.classList.add('nome_completo');
            nome_completo.id = 'nome_completo';
            novaRoleta.appendChild(nome_completo);

            let checkmark = document.createElement('div');
            checkmark.classList.add('checkmark');
            checkmark.id = `checkmark-${index + 1}`;
            novaRoleta.appendChild(checkmark);

            roletas.appendChild(novaRoleta);
        });

        contadorRoletas = roletasArray.length + 1;
        contadorNome = roletasArray.length + 1;
    }
}

//Impede do menu padrão aparecer quando clicarmos com o botão direito
//contextmenu = menu padrão
//(e) = Evento com mouse
roletas.addEventListener('contextmenu', function(e) {
    
    if (e.target.classList.contains('roleta') || e.target.parentNode.classList.contains('roleta')){
        
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

    if (e.target.classList.contains('roleta')){
        elementoAtual = e.target;

        nome_roleta = e.target.querySelector('span');
        imagem_roleta = e.target.querySelector('img');
        checkmark_id = e.target.querySelector('div');
    }
    else{
        elementoAtual = document.getElementById(e.target.parentNode.id);

        nome_roleta = e.target.parentNode.querySelector('span');
        imagem_roleta = e.target.parentNode.querySelector('img');
        checkmark_id = e.target.parentNode.querySelector('div');
    }

});

// Esconde o menu contexto ao cliclar fora
document.addEventListener('click', function(e) {
    if (!menu_options.contains(e.target)) {
        menu_options.classList.remove('show');
    }
});

adicionar.addEventListener('click', function(){
    
    //Cria uma variável para armazenar o novo elemento div
    //Depois adiciona nessa variável o nome da classe e do id
    const novaRoleta = document.createElement('div');
    novaRoleta.classList.add('roleta');
    novaRoleta.id = `roleta-${contadorRoletas++}`;

    //Cria variável para imagem e adiciona nela a imagem e a adiciona na novaRoleta
    const img = document.createElement('img');
    img.src = 'img/roleta2.png';
    novaRoleta.appendChild(img);

    //Cria uma variável para o texto, adiciona o texto nela e a adiciona na novaRoleta
    const nome = document.createElement('h3');
    nome.textContent = `Roleta ${contadorNome++}`;
    novaRoleta.appendChild(nome);

    const nome_completo = document.createElement('span');
    nome_completo.classList.add('nome_completo');
    nome_completo.id = 'nome_completo';
    nome_completo.textContent = nome.textContent;
    novaRoleta.appendChild(nome_completo);

    const checkmark = document.createElement('div');
    checkmark.classList.add('checkmark');
    checkmark.id = `checkmark-${contadorRoletas-1}`;
    novaRoleta.appendChild(checkmark);

    //Atribuindo a novaRoleta no div de roletas.
    roletas.appendChild(novaRoleta);

    salvarRoletas();

    //Animação para quando clicar no botão.
    adicionar.style.transform = 'scale(1)';
    setTimeout(() => {
        adicionar.style.transform = 'scale(1.05)';
    }, 80)

    if(aberto_excluir_varios){
        fecharExcluirVarios();
    }

});

//Exclui a roleta
excluir.addEventListener('click', function(){
    if (elementoAtual){
        roletas.removeChild(elementoAtual);
        elementoAtual = null;
        contadorNome--;
        menu_options.classList.remove('show');

        salvarRoletas();

    }
    if(aberto_excluir_varios){
        fecharExcluirVarios();
    }
});

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

    input_nome_roleta.value = nome_roleta.textContent;

    opacidade.style.display = 'block';

    if (aberto_excluir_varios){
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

        nome_span = elementoAtual.querySelector('span');
        nome_span.textContent = input_nome_roleta.value;

        nome_exibido = elementoAtual.querySelector('h3');

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

    salvarRoletas();
});

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

    checkmark_id.style.opacity = '1';
    elementoAtual.style.opacity = '0.5';

    pastas_excluir.push(elementoAtual);
    contador_pastas++;
    contador_excluir.textContent = `${contador_pastas}`;
    
    aberto_excluir_varios = true;
    elementoAtual.dataset.clicked = "true";

});

fechar_excluir.addEventListener('click', () => {
    fecharExcluirVarios();
});

excluir_pastas.addEventListener('click', () => {
    pastas_excluir.forEach((pasta) => {
        pasta.remove();
        contadorNome--;

    });
    fecharExcluirVarios();
    salvarRoletas();
})

roletas.addEventListener('click', (e) => {
    elementoAtual = e.target.classList.contains('roleta') ? e.target : e.target.parentNode;

    if (aberto_excluir_varios && (e.target.classList.contains('roleta') || e.target.parentNode?.classList.contains('roleta'))) {
        
        if (!elementoAtual.dataset.clicked || elementoAtual.dataset.clicked === "false") {
            // Seleciona
            elementoAtual.querySelector('.checkmark').style.opacity = '1';
            elementoAtual.style.opacity = '0.5';
            elementoAtual.dataset.clicked = "true";
            pastas_excluir.push(elementoAtual);
            contador_pastas++;
        } else {
            // Desseleciona
            elementoAtual.querySelector('.checkmark').style.opacity = '0';
            elementoAtual.style.opacity = '1';
            elementoAtual.dataset.clicked = "false";
            const index = pastas_excluir.indexOf(elementoAtual);
            if (index > -1) pastas_excluir.splice(index, 1);
            contador_pastas--;
        }
        
        contador_excluir.textContent = contador_pastas;
        if (contador_pastas === 0) fecharExcluirVarios();
    }
    //Ir para a página das roletas
    else if (!aberto_excluir_varios && (e.target.closest('.roleta'))){
        console.log(elementoAtual);
        window.location.href = `/dentro da pasta/roletas.html?id=${elementoAtual.id}`;
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
    aberto_excluir_varios = false;
}

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

    imagem_roleta.src = img_alterar;
    mostrar_img.style.backgroundImage = 'none';
    texto.style.display = 'flex';

    salvarRoletas();
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