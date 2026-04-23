import * as SeletorCor from '../components/seletor-cor.js';
import * as CustomItem from '../components/customização-itens.js';
import * as Util from '../components/utils.js';

export function iniciarConfigSeletor(container_seletor_cor, container_iro_picker, container_itens, dados_roleta) {
    let estado = {
        seletor_cor: null,
        seletor_aberto: false,
        rgb_ativo: true
    };
    let cor_preview_atual = null;

    //#region Funções
    function selecionarInputAtivo(ativo) {
        if (ativo) return document.querySelector('#container-input-rgb').querySelectorAll('.input-rgb');
        else return document.querySelector('#container-input-hex').querySelector('.input-hex');
    }

    //ResizeObserver
    const observador = new ResizeObserver(entries => {
        for (let entry of entries) {
            const novaLargura = entry.contentRect.width * 0.5;
            
            if (estado.seletor_aberto && estado.seletor_cor) {
                estado.seletor_cor.resize(novaLargura);
            }
        }
    });
    observador.observe(container_seletor_cor);
    //#endregion

    //#region Seletor de Cor
    //Evento de Abrir o Seletor
    container_itens.addEventListener('click', (e) => {
        const target = e.target;
        const cor_preview = target.closest('.cor-preview');
        
        //Se ainda não estiver aberto, abre o seletor
        if (cor_preview && !estado.seletor_aberto) {
            e.stopImmediatePropagation();
            cor_preview_atual = cor_preview;

            let inputs = selecionarInputAtivo(estado.rgb_ativo);
            container_seletor_cor.style.display = 'flex';
            
            estado.seletor_cor = SeletorCor.criarSeletorCor(container_seletor_cor, window.getComputedStyle(cor_preview).backgroundColor, inputs, container_iro_picker);
            estado.seletor_aberto = true;

        } 
        //Se o seletor estiver aberto e clicar em outro item, troca a cor do seletor para a cor do item clicado
        else if (cor_preview && estado.seletor_aberto) {
            cor_preview_atual = cor_preview;
            
            let cor = cor_preview.style.backgroundColor === '' ? '#ffffff' : cor_preview.style.backgroundColor;
            estado.seletor_cor.color.set(cor);
        }
    });
    //#endregion

    //#region Salvar/Cancelar
    //Botões Cancelar / Salvar e Troca de Modelo
    document.getElementById('button-cancel-color').addEventListener('click', () => {
        if (estado.seletor_aberto) {
            //Remove o seletor do HTML
            container_iro_picker.removeChild(container_iro_picker.firstChild);

            estado.seletor_aberto = false;
            container_seletor_cor.style.display = 'none';
        }
    });

    document.getElementById('button-save-color').addEventListener('click', () => {
        if (estado.seletor_aberto && cor_preview_atual) {
            //Muda a cor do preview para a cor selecionada e exclui o seletor do HTML
            cor_preview_atual.style.backgroundColor = estado.seletor_cor.color.hexString;
            container_iro_picker.removeChild(container_iro_picker.firstChild);
            
            estado.seletor_aberto = false;
            container_seletor_cor.style.display = 'none';
            
            //Altera a cor do item na roleta e a cor do texto baseado na cor do fundo
            CustomItem.alterarCor(dados_roleta.roleta, dados_roleta.props, cor_preview_atual.style.backgroundColor, cor_preview_atual.id.split("-").at(-1));
            CustomItem.Luminancia(dados_roleta.roleta, estado.seletor_cor.color.rgb, dados_roleta.props, cor_preview_atual.id.split("-").at(-1));
        }
    });
    //#endregion

    //#region Trocar modelo
    //Troca de Modelo de Cor
    document.querySelector('.changel-color-model').addEventListener('click', () => {
        const container_rgb = document.querySelector('#container-input-rgb');
        const container_hex = document.querySelector('#container-input-hex');

        if (estado.rgb_ativo) {
            container_rgb.style.display = 'none';
            container_hex.style.display = 'flex';
            estado.rgb_ativo = false;
        } else {
            container_rgb.style.display = 'flex';
            container_hex.style.display = 'none';
            estado.rgb_ativo = true;
        }

        container_iro_picker.removeChild(container_iro_picker.firstChild);
        estado.seletor_cor = SeletorCor.criarSeletorCor(container_seletor_cor, estado.seletor_cor.color.hexString, selecionarInputAtivo(estado.rgb_ativo), container_iro_picker);
    });
    //#endregion

    //#region Inputs RGB / HEX
    //Verificação dos inputs RGB
    container_seletor_cor.querySelectorAll('.input-rgb').forEach(input => {
        input.addEventListener('input', (e) => {
            let valor = e.target.value;
            if (!Util.VerficarSeNumero(valor) || parseInt(valor) > 255) {
                e.target.value = valor.slice(0, -1);
                return;
            }

            let cor_nova = valor == "" ? 0 : valor;
            const rgbString = SeletorCor.gerarStringRGB(estado.seletor_cor.color.rgb, input, cor_nova);

            container_seletor_cor.dataset.bloqueado = "true";
            estado.seletor_cor.color.set(rgbString);

            setTimeout(() => container_seletor_cor.dataset.bloqueado = "false", 20);
        });
    });

    //Verificação do input HEX
    container_seletor_cor.querySelectorAll('#input-hex').forEach(input => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length > 7) {
                e.preventDefault();
                e.target.value = e.target.value.slice(0, 7);
                return;
            }

            container_seletor_cor.dataset.bloqueado = "true";
            e.target.value.length === 7 ? estado.seletor_cor.color.set(e.target.value) : null;

            setTimeout(() => container_seletor_cor.dataset.bloqueado = "false", 20);
        });
    });
    //#endregion
}