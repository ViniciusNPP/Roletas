const canvas = document.getElementById('roleta');
const ctx = canvas.getContext('2d');

// Lista de itens com seus respectivos pesos
const itens = [
    { nome: "Banana", peso: 20 },
    { nome: "Maçã", peso: 30 },
    { nome: "Beterraba", peso: 50 },
    { nome: "Cenoura", peso: 10 },
    { nome: "Laranja", peso: 40 },
    { nome: "Uva", peso: 25 },
];

// Função para desenhar a roleta
function desenharRoleta(itens) {
    const pesoTotal = itens.reduce((soma, item) => soma + item.peso, 0);
    let anguloAtual = 0;
    let corAnterior = [];

    itens.forEach(item => {
        const anguloItem = (item.peso / pesoTotal) * (2 * Math.PI); // ângulo proporcional
        ctx.beginPath();
        ctx.moveTo(400, 400); // centro do canvas
        ctx.arc(400, 400, 300, anguloAtual, anguloAtual + anguloItem);
        ctx.closePath();
        
        // Cor aleatória para cada item
        let cor
        
        while (true) {
            
            cor = `hsl(${Math.random() * 360}, 70%, 60%)`;
            let válido = 0;
            let corPrincipal = parseInt(cor.split('hsl(')[1].split(',')[0]);
            
            corAnterior.forEach(cores => {
                let outraCor = parseInt(cores.split('hsl(')[1].split(',')[0])

                if (Math.abs(corPrincipal - outraCor) < 5) {
                    válido += 1;
                }
            });

            if (válido == 0) {
                break;
            }
        }
        ctx.fillStyle = cor;
        ctx.fill();

        let textoX = 400 + Math.cos(anguloAtual + anguloItem / 2) * 100;
        let textoY = 400 + Math.sin(anguloAtual + anguloItem / 2) * 100;

        // Rotaciona o texto para que fique alinhado com o arco
        ctx.save(); // Salva o estado do contexto
        ctx.translate(textoX, textoY); // Muda o ponto de origem para o texto
        ctx.rotate(anguloAtual + anguloItem / 2); // Rotaciona de acordo com a fatia
        ctx.fillStyle = 'black'; // Cor do texto
        ctx.font = '20px Arial'; // Define a fonte e o tamanho
        ctx.fillText(item.nome, -ctx.measureText(item.nome).width / 2, 0); // Desenha o texto
        ctx.restore(); // Restaura o estado anterior do contexto
        
        // Atualiza o ângulo para o próximo item
        anguloAtual += anguloItem;
        corAnterior.push(cor);
    });
}

desenharRoleta(itens);

//Girando a roleta
const container = document.getElementById('container');
const botao = document.getElementById('spinBtn');

let angle = 0;
let spinning = false;
let startTime;
let speed = 100; // graus por frame

function girar(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) / 1000; // segundos

    if (elapsed < 5) {
        angle += speed;
        speed *= 0.993; // desacelera
        canvas.style.transform = `rotate(${angle}deg)`;
        requestAnimationFrame(girar);
    } else {
        spinning = false;
        speed = 10; // reseta pra próxima vez

        // Calcula o item selecionado
        const anguloFinal = (angle % 360 + 360) % 360; // Ângulo final entre 0 e 360
        const pesoTotal = itens.reduce((soma, item) => soma + item.peso, 0);
        let anguloAtual = 0;

        for (const item of itens) {
            const anguloItem = (item.peso / pesoTotal) * 360; // Ângulo proporcional
            if (anguloFinal >= anguloAtual && anguloFinal < anguloAtual + anguloItem) {
                exibirResultado(item.nome);
                break;
            }
            anguloAtual += anguloItem;
        }
    }
}

botao.addEventListener('click', () => {
    if (!spinning) {
        spinning = true;
        startTime = null;
        speed = 10;
        requestAnimationFrame(girar);
    }
});

function exibirResultado(nome) {
    const resultado = document.getElementById('resultado');
    const itemSelecionado = document.getElementById('itemSelecionado');
    itemSelecionado.textContent = `Item selecionado: ${nome}`;
    resultado.classList.remove('oculto');
}

// Fecha o resultado ao clicar no botão
document.getElementById('fecharResultado').addEventListener('click', () => {
    document.getElementById('resultado').classList.add('oculto');
});