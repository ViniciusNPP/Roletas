function salvarPastasLocal(roleta_elementos){
    let roletasArray = [];

    roleta_elementos.forEach(roleta => {
        let nome = roleta.querySelector('h3').textContent;
        let nome_completo = roleta.querySelector('span').textContent;
        let img = roleta.querySelector('img').src;
        let id = roleta.id;
        let roletas = [];

        roletasArray.push({roletas, nome, img, nome_completo, id});

        localStorage.setItem('pastas', JSON.stringify(roletasArray));
    });
}

function carregarPastasLocal(document, pastas){
    if (pastas){
        
        pastas.forEach((roleta, index) => {
            
            document.innerHTML += `
                <div class="roleta" id="${roleta.id}">
                    <img src="${roleta.img}" alt="">
                    <h3>${roleta.nome}</h3>
                    <div class="checkmark" id="checkmark-${index + 1}"></div>
                    <span class="nome_completo" id="nome_completo">${roleta.nome_completo}</span>
                </div>
            `;
        });
    }
}

function excluirPasta(){

}

export { salvarPastasLocal, carregarPastasLocal, excluirPasta };