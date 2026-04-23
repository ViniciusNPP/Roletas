function gerarId() {
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

function VerficarCaracterProibido(value) {
    return caracteresProibidos.includes(value);
}

function VerficarSeNumero(value) {
    return !(Number.isNaN(Number(value)));
}

export { gerarId, VerficarCaracterProibido, VerficarSeNumero }