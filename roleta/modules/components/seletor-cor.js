function PreencherRGB(obj_rgb, inputs_rgb){
    inputs_rgb.forEach((input, index) => {
        input.value = Object.values(obj_rgb)[index];
    });
}

function PreencherHex(cor_hex, input_hex) {
    input_hex.value = cor_hex;
}

function gerarStringRGB(objt_rgb, input, nova_cor) {
    let {r, g, b} = objt_rgb;

    if (input.id === 'input-rgb-red') r = nova_cor;
    else if (input.id === 'input-rgb-green') g = nova_cor;
    else if (input.id === 'input-rgb-blue') b = nova_cor;

    return `rgb(${r}, ${g}, ${b})`;
}

function criarSeletorCor(container, initial_color, inputs, color_picker) {
    if (color_picker.childNodes.length > 0) color_picker.removeChild(color_picker.firstChild);
    let seletor_cor = new iro.ColorPicker(color_picker, {
        width: container.offsetWidth,
        color: initial_color,
        layoutDirection: 'horizontal',
        layout: [
            {
                component: iro.ui.Box,
            },
            {
                component: iro.ui.Slider,
                options: {
                    sliderType: 'hue'
                }
            },
        ]
    });

    if (inputs.length === undefined) PreencherHex(seletor_cor.color.hexString, inputs);
    else PreencherRGB(seletor_cor.color.rgb, inputs);
    container.style.border = 'solid 4px ' + seletor_cor.color.hexString;

    seletor_cor.on('color:change', (color) => {
        if (container.dataset.bloqueado === 'true') return;
        
        if (inputs.length === undefined) PreencherHex(seletor_cor.color.hexString, inputs);
        else PreencherRGB(seletor_cor.color.rgb, inputs);

        container.style.border = 'solid 4px ' + color.hexString;
    });

    return seletor_cor;
}

export { criarSeletorCor, gerarStringRGB }