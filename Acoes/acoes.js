import { salvarPastasLocal } from "../Data/data.js";

function criarPasta(UI, estado, img, nome_completo = 'Roleta '){
    if (nome_completo === 'Roleta '){
        nome_completo += estado.contador_nome;
    }

    UI.roletas.innerHTML += `
                <div class="roleta" id="roleta-${estado.ID}">
                    <img src="${img}" alt="">
                    <h3>Roleta ${estado.contador_nome}</h3>
                    <div class="checkmark" id="checkmark-${estado.ID}" style="opacity: 0"></div>
                    <span class="nome_completo" id="nome_completo">${nome_completo}</span>
                </div>
            `;
    estado.ID++;
    estado.contador_nome++;

    //Animação para quando clicar no botão.
    UI.adicionar.style.transform = 'scale(1)';
    setTimeout(() => {
        UI.adicionar.style.transform = 'scale(1.05)';
    }, 80);

    salvarPastasLocal(document.querySelectorAll('.roleta'));
}

function excluirPasta(UI, estado){
    if (estado.elemento_atual){
        UI.roletas.removeChild(estado.elemento_atual);
        estado.elemento_atual = null;
        estado.contador_nome--;
    }

    UI.menu_options.classList.remove('show');
    salvarPastasLocal(document.querySelectorAll('.roleta'));
}

export { criarPasta, excluirPasta };