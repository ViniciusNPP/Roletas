const botao = document.getElementById('botao'),
botao_2 = document.getElementById('botao-adap'),
lootbox = document.getElementById('lootbox'),
items = document.querySelectorAll('.item'),
gira = document.querySelector('.gira-gira'),
adap = document.querySelector('.adaptavel'),
width = items[0].offsetWidth;

let itens = [{
    nome: 'Abacaxi',
    peso: 1
}, 
{
    nome :'Banana',
    peso: 4
},
{
    nome :'Maçã',
    peso: 8
}]

let peso = itens.map(i => i.peso),
pesoTotal = peso.reduce((a, b) => a + b, 0);

//Evento principal
botao.addEventListener('click', () =>{
    let rand = Math.random() * pesoTotal,
    itemSorteado = escolherItem(rand);
    
    listItens(lootbox, itemSorteado.index);
    roletar(itemSorteado);
    roletar_CSS();
});

botao_2.addEventListener('click', () => {
    let sorteado = sorteio_width();
    sorteado.children.style.backgroundColor = "red";

    console.log(`Sorteado: ${sorteado.children.textContent}`);
});

//Função que retorna o item sorteado
function escolherItem(rand){
    for(let i in itens){
        if (rand < itens[i].peso){
            return {
                index: itens.indexOf(itens[i]),
                nome: itens[i].nome
            };
        }
        rand -= itens[i].peso;
    }
}

//Função que cria os itens na roleta
function listItens(lootbox, chosen){
    
    //Limpa o lootbox para preencher ele denovo
    Array.from(lootbox.children).forEach(i => {
            lootbox.removeChild(i);
    });

    const width = 23;

    //Cria itens para mostrar durante o giro
    for (let i = 0; i < width; i++){
        let escolhido = escolherItem(Math.random() * pesoTotal),
        item = document.createElement('div');
        item.className = "item";
        item.textContent = items[escolhido.index].textContent;
        lootbox.appendChild(item);
    }

    lootbox.children[width - 2].textContent = items[chosen].textContent;
}

//Função que vai dar o efeito de aceleração e desaceleração
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

//Função que faz a animação de roletar
function roletar(itemSorteado){
    const finalX = -(lootbox.children.length * width) + 300;

    let start = null,
    duration = 3000;

    function animate(tempoAtual){
        if(!start) start = tempoAtual;
        let progress = (tempoAtual - start) / duration;

        if (progress > 1) progress = 1;

        let eased = easeOutCubic(progress),
        posicaoAtual = eased * finalX;

        lootbox.style.transform = 'translateX(' + posicaoAtual + 'px)';

        if (progress < 1){
            requestAnimationFrame(animate);
        } else {
            console.log('Item sorteado: ' + itemSorteado.nome);
        }
    }

    requestAnimationFrame(animate);
}

//Faz o triangulo girar.
function roletar_CSS(){
    const rounds = 3,
    duration = 3,
    finalPos = -Math.round(Math.random() * 100)/100 - rounds;

    //reset do rotate
    gira.style.transform = `rotate(0turn)`;
    gira.style.transition = `transform 0s`;

    requestAnimationFrame(() => {
        gira.style.transform = `rotate(${finalPos}turn)`;
        gira.style.transition = `transform ${duration}s ease-out`;
    });

    console.log("FINALPOS = ", finalPos);
}

//Sorteia baseado no width.
function sorteio_width(){
    const widths = [];

    for (let child of adap.children){
        widths.push(child.offsetWidth);
        child.style.backgroundColor = "transparent";
    }

    const widths_somados = widths.reduce((a,b) => a + b, 0);
    let rand = Math.floor(Math.random() * widths_somados);
    
    for (let i = 0; i < widths.length; i++) {
        if (rand <= widths[i]) {
            return {
                children: adap.children[i],
                width: widths[i]
            }
        }
        rand -= widths[i];
    }
}