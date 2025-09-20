const sorteio = document.getElementById('sorteio'),
botao = document.getElementById('botao');

let itens = [{
    nome: 'Mamão',
    peso: 1
}, 
{
    nome :'Banana',
    peso: 4
},
{
    nome :'Pera',
    peso: 8
}]

let peso = itens.map(i => i.peso),
pesototal = peso.reduce((a, b) => a + b, 0);

botao.addEventListener('click', () =>{
    let rand = Math.random() * 11;
    roletar(rand);
})

function roletar(rand){
    for(let i in itens){
        if (rand < itens[i].peso){
            return sorteio.innerHTML = itens[i].nome;
        }
        rand -= itens[i].peso;
    }
}