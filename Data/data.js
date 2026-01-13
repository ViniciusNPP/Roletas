function salvarPastasLocal(id_pasta, elementos, dentro_da_pasta=false){
    const pastas = JSON.parse(localStorage.getItem('pastas')) || [];
    //const roleta = dentro_da_pasta && pastas != [] ? pastas.find(p => p.id === id_pasta).roletas : null;
    
    let roletas_array = [];
    let nome, nome_completo, img, id, roletas;

    elementos.forEach(elem => {
        if (pastas == []){
            nome = elem.querySelector('h3').textContent;
            nome_completo = elem.querySelector('span').textContent;
            img = elem.querySelector('.foto').src;
            id = elem.id;
            roletas = dentro_da_pasta ? null : [];
        } 
        else {
            const pastaExistente = pastas.find(pasta => pasta.id === elem.id);
            if (pastaExistente) {
                nome = pastaExistente.nome !== elem.querySelector('h3').textContent ?
                    elem.querySelector('h3').textContent : 
                    pastaExistente.nome

                nome_completo = pastaExistente.nome_completo !== elem.querySelector('span').textContent ?
                    elem.querySelector('span').textContent :
                    pastaExistente.nome_completo

                img = pastaExistente.img !== elem.querySelector('img').src ?
                    elem.querySelector('img').src :
                    pastaExistente.img

                id = pastaExistente.id
                roletas = pastaExistente.roletas;
                
            }
        }

        roletas_array.push({roletas, nome, img, nome_completo, id});
    });
    
    localStorage.setItem('pastas', JSON.stringify(roletas_array));
}

function carregarPastasLocal(document, pastas){
    if (pastas){
        
        pastas.forEach((roleta, index) => {
            
            document.innerHTML += `
                <div class="roleta" id="${roleta.id}">
                    <img src="${roleta.img}" class="foto">
                    <h3>${roleta.nome}</h3>
                    <div class="checkmark" id="checkmark-${index + 1}" style="opacity: 0"></div>
                    <span class="nome_completo" id="nome_completo">${roleta.nome_completo}</span>
                </div>
            `;
        });
    }
}

function salvarRoletaLocal(){

}

function carregarRoletaLocal(){

}

//CRAIR UMA FUNÇÃO SOMENTE PARA EXCLUIR ELEMENTOS DO LOCAL STORAGE

export { salvarPastasLocal, carregarPastasLocal, salvarRoletaLocal, carregarRoletaLocal };