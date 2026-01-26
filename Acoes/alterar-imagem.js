import { updateLocalStorage } from '../Data/data.js';

function alterarImagem(input_img, mostrar_img, texto) {
    return new Promise((resolve) => {
        const imgFile = input_img.files[0];
        
        if (imgFile) {
            const leitor = new FileReader();
            //Essa parte foi feita totalmente por IA, pois ainda estou aprendendo a mexer com imagens em JS
            leitor.onload = (e) => {
                const img_aux = new Image();
                img_aux.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // 1. Definimos um tamanho máximo fixo (ex: 300px)
                    // Isso garante que qualquer imagem vire uma miniatura leve
                    const MAX_DIM = 210;
                    canvas.width = MAX_DIM;
                    canvas.height = MAX_DIM;

                    // 2. Limpamos e desenhamos a imagem redimensionada
                    ctx.fillStyle = "#080029"; 
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // O drawImage com 5 parâmetros faz o redimensionamento automático
                    ctx.drawImage(img_aux, 0, 0, MAX_DIM, MAX_DIM);

                    // 3. Convertemos para JPEG com qualidade 0.7
                    // É MUITO mais leve que o PNG original para o LocalStorage
                    const resultado_comprimido = canvas.toDataURL('image/jpeg', 0.7);

                    // 4. Atualizamos a interface
                    texto.style.display = 'none';
                    mostrar_img.style.backgroundImage = `url('${resultado_comprimido}')`;

                    // 5. Finalizamos a Promise com a imagem leve
                    resolve(resultado_comprimido);
                };
                img_aux.src = e.target.result;
            };
            leitor.readAsDataURL(imgFile);
        }
    })
}

function aplicarAlteracaoImagem(img_alterar, mostrar_img, texto, arquivo) {
    if (img_alterar) {
        arquivo.src = img_alterar;
    }

    mostrar_img.style.backgroundImage = 'none';
    texto.style.display = 'flex';

    updateLocalStorage(arquivo.parentElement, arquivo.parentElement.id);
}

export { alterarImagem, aplicarAlteracaoImagem };