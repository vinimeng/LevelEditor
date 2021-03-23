import Game from './game/game';

/**
 * Espera o DOM carregar totalmente para
 * poder realizar alguma tarefa
 */
document.addEventListener("DOMContentLoaded", () => {
    /**
     * Busca no localStorage a largura de mapa não salvo
     */
    const mapWidth = window.localStorage.getItem('mapWidth') as string;

    /**
     * Busca no localStorage a altura de mapa não salvo
     */
    const mapHeight = window.localStorage.getItem('mapHeight') as string;

    /**
     * Busca no localStorage os elementos de mapa não salvo
     */
    const elements = window.localStorage.getItem('elements') as string;

    /**
     * Guarda div com menu para criar um mapa ou carregar um mapa
     */
    const chooseResolution = document.getElementById('chooseResolution') as HTMLDivElement;

    /**
     * Guarda div com aviso de dados não salvos encontrados
     */
    const unsavedData = document.getElementById('unsavedData') as HTMLDivElement;

    /**
     * Guarda div onde o canvas está localizado
     */
    const divCanvas = document.getElementById('divCanvas') as HTMLCanvasElement;

    /**
     * Guarda botão dos créditos
     */
    const btnCredits = document.getElementById('btnCredits') as HTMLButtonElement;

    /**
     * Guarda botão de salvar mapa
     */
    const btnSaveMap = document.getElementById('btnSaveMap') as HTMLButtonElement;

    if (mapWidth && mapHeight && elements) {
        unsavedData.style.display = 'block';
    } else {
        chooseResolution.style.display = 'block';
    }

    /**
     * Se for clicado em Yes na div
     * de dados não salvos, o mapa não salvo anteriormente
     * irá ser carregado
     */
    document.getElementById('btnUnsavedDataYes')?.addEventListener('click', () => {
        btnCredits.style.display = 'block';
        btnSaveMap.style.display = 'block';
        unsavedData.style.display = 'none';
        divCanvas.style.display = 'flex';
        new Game(parseInt(mapWidth), parseInt(mapHeight), elements).main();
    });

    /**
     * Se for clicado No na div
     * de dados não salvos, o menu para criar/carregar um mapa é
     * mostrado
     */
    document.getElementById('btnUnsavedDataNo')?.addEventListener('click', () => {
        unsavedData.style.display = 'none';
        chooseResolution.style.display = 'block';
    });

    /**
     * Se for clicado Create map na div
     * de criação/carregamento de mapa, é criado um mapa
     * a partir dos inputs de width e height
     */
    document.getElementById('btnCreateMap')?.addEventListener('click', () => {
        const inputWidth = document.getElementById('width') as HTMLInputElement;
        const inputHeight = document.getElementById('height') as HTMLInputElement;
        const width = parseInt(inputWidth.value);
        const height = parseInt(inputHeight.value);
    
        if (width && height) {
            btnCredits.style.display = 'block';
            btnSaveMap.style.display = 'block';
            chooseResolution.style.display = 'none';
            divCanvas.style.display = 'flex';
            new Game(width, height).main();
        }
    });

    /**
     * Se for clicado Load map na div
     * de criação/carregamento de mapa, é criado um mapa
     * a partir do arquivo JSON feito upload
     */
    document.getElementById('btnLoadMap')?.addEventListener('click', () => {
        const inputJSON = document.getElementById('inputJSON') as HTMLInputElement;
        inputJSON.addEventListener('change', function() {
            if(this.files) {
                if(this.files[0].type === "application/json") {
                    const fr = new FileReader();
                    fr.addEventListener('load', (e) => {
                        if(e.target) {
                            const mapJSONString = e.target.result as string;
                            const mapJSON = JSON.parse(mapJSONString);
                            const width = parseInt(mapJSON.width);
                            const height = parseInt(mapJSON.height);
                            const elements = JSON.stringify(mapJSON.elements);
                            btnCredits.style.display = 'block';
                            btnSaveMap.style.display = 'block';
                            chooseResolution.style.display = 'none';
                            divCanvas.style.display = 'flex';
                            new Game(width, height, elements).main();
                        }
                    })
                    fr.readAsText(this.files[0]);
                }
            }
        });
        inputJSON.click();
    });
});
