function gerarId(){
    return `${Date.now() + (Math.random() * 1000).toFixed(0)}`
}

export {gerarId}