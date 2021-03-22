import Game from './game/game';

document.addEventListener("DOMContentLoaded", () => {
    const mapWidth = window.localStorage.getItem('mapWidth') as string;
    const mapHeight = window.localStorage.getItem('mapHeight') as string;
    const elements = window.localStorage.getItem('elements') as string;
    const chooseResolution = document.getElementById('chooseResolution') as HTMLDivElement;
    const unsavedData = document.getElementById('unsavedData') as HTMLDivElement;
    const divCanvas = document.getElementById('divCanvas') as HTMLCanvasElement;
    const btnCredits = document.getElementById('btnCredits') as HTMLButtonElement;
    const btnSaveMap = document.getElementById('btnSaveMap') as HTMLButtonElement;

    if (mapWidth && mapHeight && elements) {
        unsavedData.style.display = 'block';
    } else {
        chooseResolution.style.display = 'block';
    }

    document.getElementById('btnUnsavedDataYes')?.addEventListener('click', () => {
        btnCredits.style.display = 'block';
        btnSaveMap.style.display = 'block';
        unsavedData.style.display = 'none';
        divCanvas.style.display = 'flex';
        new Game(parseInt(mapWidth), parseInt(mapHeight), elements).main();
    });

    document.getElementById('btnUnsavedDataNo')?.addEventListener('click', () => {
        unsavedData.style.display = 'none';
        chooseResolution.style.display = 'block';
    });

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
