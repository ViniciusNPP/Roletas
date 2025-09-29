const botao = document.getElementById('botao'),
lootbox = document.getElementById('lootbox'),
items = document.querySelectorAll('.item'),
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
})

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

    for (let i = 0; i < width; i++){
        let escolhido = escolherItem(Math.random() * pesoTotal),
        item = document.createElement('div');
        item.className = "item";
        item.textContent = items[escolhido.index].textContent;
        lootbox.appendChild(item);
    }

    lootbox.children[21].textContent = items[chosen].textContent;
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