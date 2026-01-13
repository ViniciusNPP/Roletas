import * as Data from '../Data/data.js';

function alterarImagem(input_img, mostrar_img, texto) {
    return new Promise((resolve) => {
        const img = input_img.files[0];
        
        if (img) {
            const leitor = new FileReader();
    
            leitor.onload = (e) => {
                texto.style.display = 'none';

                const resultado = e.target.result;
                mostrar_img.style.backgroundImage = `url('${resultado}')`;
                resolve(resultado);
            }
            leitor.readAsDataURL(img);
        }
    })
}

function aplicarAlteracaoImagem(img_alterar, mostrar_img, texto, arquivo) {
    if (img_alterar) {
        arquivo.src = img_alterar;
    }

    mostrar_img.style.backgroundImage = 'none';
    texto.style.display = 'flex';

    Data.salvarPastasLocal(document.querySelectorAll('.roleta'));
}

export { alterarImagem, aplicarAlteracaoImagem };