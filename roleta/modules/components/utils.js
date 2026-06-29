export function gerarId() {
    return `${Date.now() + (Math.random() * 1000).toFixed(0)}`
}

const caracteresProibidos = [ // Lista de caracteres proibidos para nomes de itens
    "<", ">",       // Impede tags HTML (XSS)
    "/", "\\",      // Evita problemas com caminhos de diretório
    "{", "}",       // Evita confusão com objetos JSON
    "[", "]",       // Evita confusão com arrays
    "(", ")",       // Impede chamadas de função maliciosas
    "\"", "'", "`", // Evita quebra de strings no JS ou banco de dados
    ";", ":",       // Evita injeção de comandos ou problemas de formatação
    "=", "+",       // Caracteres de atribuição/operação
    "&", "|",       // Operadores lógicos
    "*",             // Caractere curinga
    ",", ".", "-", "+" // Caracteres que podem causar problemas de formatação ou validação
];

const string_caracteresProbidos = caracteresProibidos.map(c => {
    //console.log("\\" + c);
    return "\\" + c
});
const regex = new RegExp(`[${string_caracteresProbidos.join('')}]`, 'g');

export function VerficarCaracterProibido(value, desconsiderar = "") {
    //console.log("Valor: ", value)
    const caracteresProibidosFiltrados = caracteresProibidos.filter(c => c !== desconsiderar);
    
    if (value.lenght <= 1) return caracteresProibidosFiltrados.includes(value);
    
    for (let i = 0; i < value.length; i++) {
        if (caracteresProibidosFiltrados.includes(value[i])) return true;
    }
   
}

export function SubstituirCaracteresProibidos(value) {
    return value.replace(regex, " ");
}

export function VerficarSeNumero(value) {
    return !(Number.isNaN(Number(value)));
}
/**
 * 
 * @param {'default' | 'custom' | 'random' | 'off' } paleta
 */
export function GerarCor(paleta){
    if (paleta === 'default'){

    }
    else if (paleta === 'custom'){

    }
    else if (paleta === 'random'){
        //Gera uma cor aleatória
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    return 'rgb(255, 255, 255)'; // Branco como padrão
}