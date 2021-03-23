import Graphics from '../graphics/graphics';
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE } from '../misc/constants';
import HTML from '../misc/html';
import Element from './element';

/**
 * Tipo para guardar a diferença de distância
 * entre mouse e o sprite que está sendo arrastado
 */
export type DiffMouseCoord = {
    diffX: number,
    diffY: number
};

/**
 * Classe principal do editor de level,
 * se baseia na classe do game para qual
 * serve como editor de level
 */
export default class Game {
    
    /**
     * Guarda o elemento que foi arrastado
     * a partir da lista de elementos possíveis
     * 
     * @access public static
     */
    public static dragged: HTMLCanvasElement;

    /**
     * Guarda o evento de arrasto
     * para o elemento arrastado
     * 
     * @see Game.dragged
     * @access public static
     */
    public static dragEvent: DragEvent;

    /**
     * Guarda elemento que foi arrastado
     * dentro do canvas
     * 
     * @access private
     */
    private draggedCanvasElement: Element | null;

    /**
     * Indica se o mouse está pressionado,
     * guarda a diferença de distância entre
     * o elemento arrastado e a posição do mouse
     * 
     * @access private
     */
    private mouseDown: DiffMouseCoord | null;

    /**
     * Array que guarda todos os elementos
     * utilizados na construção de um mapa
     * 
     * @access private
     */
    private elements: Array<Element>;

    /**
     * Guarda a largura do mapa a ser criado
     * 
     * @access private
     */
    private mapWidth: number;

    /**
     * Guarda a altura do mapa a ser criado
     * 
     * @access private
     */
    private mapHeight: number;

    /**
     * Guarda instância da classe que carrega
     * os gráficos utilizados
     * 
     * @access private
     */
    private graphics: Graphics;

    /**
     * Guarda a escala com qual
     * o canvas deve ser multiplicado
     * 
     * @access private
     */
    private scale: number;

    /**
     * Identifica se o editor de level está rodando
     * 
     * @access private
     */
    private isRunning: boolean;

    /**
     * Guarda a div onde se encontra a div do canvas,
     * tem seu tamanho utilizado para calcular a escala
     * 
     * @access private
     */
    private appDiv: HTMLDivElement;

    /**
     * Guarda a div onde se encontra o canvas
     * 
     * @access private
     */
    private divCanvas: HTMLDivElement;

    /**
     * Guarda o canvas
     * 
     * @access private
     */
    private canvas: HTMLCanvasElement;

    /**
     * Guarda o contexto 2D do canvas
     * 
     * @access private
     */
    private context2D: CanvasRenderingContext2D;

    /**
     * Guarda instância da classe que lida com eventos
     * de alguns elementos HTML
     * 
     * @access private
     */
    private html: HTML;

    /**
     * Indica se está sendo carregado um mapa salvo anteriormente
     * 
     * @access private
     */
    private savedData: string | null;

    /**
     * Guarda o botão para salvar um mapa
     * 
     * @access private
     */
    private btnSaveMap: HTMLButtonElement;

    /**
     * Guarda o checkbox que indica se ao arrastar
     * um elemento, ele deve se guiar pelo grid
     * 
     * @access private
     */
    private snapToGrid: HTMLInputElement;

    /**
     * Construtor da classe Game
     * 
     * @param mapWidth
     * @param mapHeight 
     * @param savedData 
     */
    constructor(mapWidth: number = 0, mapHeight: number = 0, savedData: string | null = null) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        window.localStorage.setItem('mapWidth', String(this.mapWidth));
        window.localStorage.setItem('mapHeight', String(this.mapHeight));

        this.elements = new Array<Element>();
        this.graphics = new Graphics();
        this.savedData = savedData;
        this.isRunning = false;
        this.draggedCanvasElement = null;
        this.mouseDown = null;
        
        this.appDiv = document.getElementById('app') as HTMLDivElement;
        this.divCanvas = document.getElementById('divCanvas') as HTMLDivElement;
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.btnSaveMap = document.getElementById('btnSaveMap') as HTMLButtonElement;
        this.snapToGrid = document.getElementById('snapToGrid') as HTMLInputElement;

        this.scale = this.determineScale();
        this.html = new HTML(this.scale);
    }

    /**
     * Carrega assets
     * Cria elementos para poderem ser arrastado
     * Carrega mapa salvo (caso exista)
     * Inicializa eventos
     * Ajusta o canvas
     * Inicia o loop
     */
    public async main() {
        await this.loadAssets();
        this.html.createElements();
        if (this.savedData) {
            this.loadSavedData(this.savedData);
        }
        this.initializeEvents();
        this.adjustCanvas();
        this.drawBackground();
        this.run();
    }

    /**
     * Lógica executada a cada tick (frame)
     */
    private tick() {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].tick();
        }
    }

    /**
     * Renderização executada a cada frame
     */
    private render() {
        this.drawBackground();
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].render(this.context2D);
        }
    }

    /**
     * Função para inicializar o loop principal
     */
    private run() {
        let self = this;
        let frames = 0;
        let last = 0;

        /**
         * Loop principal,
         * é executado a cada nova call para
         * redesenhar a tela feita pelo navegador
         * (cerca do refresh rate do monitor)
         * 
         * @param now 
         */
        function loop(now: number) {
            self.tick();
            self.render();

            if (self.html.spanFPS.style.display === 'block') {
                frames++;
                if (now - last > 1000) {
                    self.html.spanFPS.innerText = `${frames}fps`;
                    frames = 0;
                    last = now;
                }
            }

            if (self.isRunning) {
                window.requestAnimationFrame(loop);
            }
        }

        this.isRunning = true;
        window.requestAnimationFrame(loop);
    }

    /**
     * Ajusta a largura, altura, escala e
     * desabilitar filtro de smoothing
     * do canvas
     */
    private adjustCanvas() {
        this.divCanvas.style.width = (GAME_WIDTH * this.scale) + 'px';
        this.divCanvas.style.height = (GAME_HEIGHT * this.scale) + 'px';
        this.canvas.width = this.mapWidth * this.scale;
        this.canvas.height = this.mapHeight * this.scale;
        this.context2D.scale(this.scale, this.scale);
        this.context2D.imageSmoothingEnabled = false;
    }

    /**
     * Desenha o fundo preto e
     * as linhas de grid no canvas
     */
    private drawBackground() {
        this.context2D.fillStyle = 'black';
        this.context2D.fillRect(0, 0, this.mapWidth, this.mapHeight);
        this.context2D.drawImage(Graphics.grid, 0, 0, this.mapWidth, this.mapHeight);
    }

    /**
     * Determina a escala de renderização do
     * canvas a partir do tamanho da div pai
     * 
     * @returns number
     */
    private determineScale() {
        const divWidth = this.appDiv.offsetWidth;
        const divHeight = this.appDiv.offsetHeight;

        let finalScale = divWidth / GAME_WIDTH;

        if (finalScale >= 1) {
            finalScale = Math.floor(finalScale);
            
            if (
                GAME_WIDTH * finalScale > divWidth ||
                GAME_HEIGHT * finalScale > divHeight
            ) {
                finalScale = finalScale - 1;
            }
        }

        if (finalScale < 1 && finalScale >= 0.75) {
            finalScale = 0.75;
        } else if (finalScale < 0.75 && finalScale >= 0.5) {
            finalScale = 0.5;
        } else if (finalScale < 0.5) {
            finalScale = 0.25;
        }

        return finalScale;
    }

    /**
     * Inicializa eventos relacionados ao canvas
     */
    private initializeEvents() {
        /**
         * Reajusta a escala e o tamanho do canvas
         * caso o navegador seja redimensionado
         */
        window.addEventListener('resize', () => {
            this.scale = this.determineScale();
            this.adjustCanvas();
        });

        /**
         * Cancela a ação padrão do evento dragover
         * para que possa ser possível largar elementos
         * arrastados no canvas
         */
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            return false;
        });

        /**
         * Associa handler com o evento drop do canvas
         */
        this.canvas.addEventListener('drop', (e) => {
            this.dropEventHandler(e);
        });

        /**
         * Associa handler com o evento mousedown do canvas
         */
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouseDownEventHandler(e);
        });

        /**
         * Associa handler com o evento mousemove do canvas
         */
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouseMoveEventHandler(e);
        });

        /**
         * Associa handler com o evento mouseup do canvas
         */
        this.canvas.addEventListener('mouseup', (e) => {
            this.mouseUpEventHandler(e);
        });

        /**
         * Associa handler com o evento contextmenu (botão
         * direito do mouse) do canvas
         */
        this.canvas.addEventListener('contextmenu', (e) => {
            this.contextMenuEventHandler(e);
        });

        /**
         * Associa handler com o evento click do botão
         * para salvar mapa
         */
        this.btnSaveMap.addEventListener('click', () => {
            this.saveMap();
        });

        /**
         * Define que a cada 30 segundos
         * será salvo no localStorage o que estiver
         * feito até o momento, evitando perdas por motivos
         * externos
         */
        window.setInterval(() => {
            window.localStorage.setItem('elements', JSON.stringify(this.elements));
        }, 30000);
    }

    /**
     * Carrega assets
     */
    private async loadAssets() {
        await this.graphics.loadGraphics(this.scale);
    }

    /**
     * Handler do evento drop do canvas.
     * Ao ser largado um elemento no canvas,
     * essa função verifica qual elemento que é
     * e qual posição ele foi largado, adicionando
     * ao canvas um elemento de sprite igual
     * 
     * @param e 
     */
    private dropEventHandler(e: DragEvent) {
        const sprtIndex = Number(Game.dragged.dataset.index);
        const sprtArray = String(Game.dragged.dataset.array);
        const scrollTop = Game.dragged.parentElement ? Game.dragged.parentElement.scrollTop : 0;
        let x = Math.round((e.offsetX - Game.dragEvent.clientX + Game.dragged.offsetLeft) / this.scale);
        let y = Math.round((e.offsetY - Game.dragEvent.clientY + Game.dragged.offsetTop - scrollTop) / this.scale);

        if (this.snapToGrid.checked) {
            x = TILE_SIZE * Math.round(x / TILE_SIZE);
            y = TILE_SIZE * Math.round(y / TILE_SIZE);
        }

        switch (sprtArray) {
            case 'wall':
                const nameW = Graphics.wall[sprtIndex].name;
                const sprtW = Graphics.wall[sprtIndex].sprite;
                this.elements.push(new Element(x, y, sprtW.width, sprtW.height, nameW, sprtArray, sprtW, sprtIndex));
                break;
            case 'wallAnim':
                const nameWA = Graphics.wallAnim[sprtIndex].name;
                const sprtWA = Graphics.wallAnim[sprtIndex].sprite;
                this.elements.push(new Element(x, y, sprtWA.width, sprtWA.height, nameWA, sprtArray, sprtWA, sprtIndex));
                break;
            case 'floor':
                const nameF = Graphics.floor[sprtIndex].name;
                const sprtF = Graphics.floor[sprtIndex].sprite;
                this.elements.push(new Element(x, y, sprtF.width, sprtF.height, nameF, sprtArray, sprtF, sprtIndex));
                break;
            case 'interactable':
                const nameI = Graphics.interactable[sprtIndex].name;
                const sprtI = Graphics.interactable[sprtIndex].sprite;
                this.elements.push(new Element(x, y, sprtI.width, sprtI.height, nameI, sprtArray, sprtI, sprtIndex));
                break;
            case 'interactableAnim':
                const nameIA = Graphics.interactableAnim[sprtIndex].name;
                const sprtIA = Graphics.interactableAnim[sprtIndex].sprite;
                this.elements.push(new Element(x, y, sprtIA.width, sprtIA.height, nameIA, sprtArray, sprtIA, sprtIndex));
                break;
            case 'doors':
                const nameD = Graphics.doors[sprtIndex].name;
                const sprtD = Graphics.doors[sprtIndex].sprite;
                this.elements.push(new Element(x, y, sprtD.width, sprtD.height, nameD, sprtArray, sprtD, sprtIndex));
                break;
            case 'weapon':
                const nameWe = Graphics.weapon[sprtIndex].name;
                const sprtWe = Graphics.weapon[sprtIndex].sprite;
                this.elements.push(new Element(x, y, sprtWe.width, sprtWe.height, nameWe,sprtArray, sprtWe, sprtIndex));
                break;
            case 'potion':
                const nameP = Graphics.potion[sprtIndex].name;
                const sprtP = Graphics.potion[sprtIndex].sprite;
                this.elements.push(new Element(x, y, sprtP.width, sprtP.height, nameP, sprtArray, sprtP, sprtIndex));
                break;
            case 'enemy':
                const nameE = Graphics.enemy[sprtIndex].name;
                const sprtE = Graphics.enemy[sprtIndex].sprite;
                this.elements.push(new Element(x, y, sprtE.width, sprtE.height, nameE, sprtArray, sprtE, sprtIndex));
                break;
            case 'player':
                const namePl = Graphics.player.name;
                const sprtPl = Graphics.player.sprite;
                this.elements.push(new Element(x, y, sprtPl.width, sprtPl.height, namePl, sprtArray, sprtPl, sprtIndex));
                break;
        }
    }

    /**
     * Handler do evento mousedown do canvas.
     * Verifica se o mouse foi clicado em cima de
     * algum elemento do canvas, se for, guarda esse
     * elemento e a diferença da posição do mouse e
     * desse elemento
     * 
     * @param e 
     */
    private mouseDownEventHandler(e: MouseEvent) {
        const mouseX = e.offsetX / this.scale;
        const mouseY = e.offsetY / this.scale;

        for (let i = this.elements.length - 1; i >= 0; i--) {
            const element = this.elements[i];
            const x = element.x;
            const y = element.y;
            const outerX = element.x + element.width;
            const outerY = element.y + element.height;

            if (
                (mouseX >= x && mouseX <= outerX) &&
                (mouseY >= y && mouseY <= outerY)
            ) {
                this.draggedCanvasElement = element;
                this.mouseDown = { diffX: x - mouseX, diffY: y - mouseY };
                element.drawWithHalfOpacity = true;
                break;
            }
        }
    }

    /**
     * Handler do evento mousemove do canvas.
     * Movimento o elemento que está sendo
     * arrastado junto as coordenadas do mouse,
     * dando a sensação de arrasto
     * 
     * @param e 
     */
    private mouseMoveEventHandler(e: MouseEvent) {
        if (this.mouseDown) {
            const mouseX = (e.offsetX / this.scale) + this.mouseDown.diffX;
            const mouseY = (e.offsetY / this.scale) + this.mouseDown.diffY;
            if (this.draggedCanvasElement) {
                this.draggedCanvasElement.x = mouseX;
                this.draggedCanvasElement.y = mouseY;
            }
        }
    }

    /**
     * Handler do evento mousemove do canvas.
     * Posiciona elemento que estava sendo arrastado
     * na coordenada em que o mouse deixou de ser
     * clicado
     * 
     * @param e 
     */
    private mouseUpEventHandler(e: MouseEvent) {
        if (this.mouseDown) {
            let mouseX = (e.offsetX / this.scale) + this.mouseDown.diffX;
            let mouseY = (e.offsetY / this.scale) + this.mouseDown.diffY;

            if (this.snapToGrid.checked) {
                mouseX = TILE_SIZE * Math.round(mouseX / TILE_SIZE);
                mouseY = TILE_SIZE * Math.round(mouseY / TILE_SIZE);
            }

            if (this.draggedCanvasElement) {
                this.draggedCanvasElement.x = mouseX;
                this.draggedCanvasElement.y = mouseY;
                this.draggedCanvasElement.drawWithHalfOpacity = false;
                this.mouseDown = null;
                this.draggedCanvasElement = null;
            }
        }
    }

    /**
     * Handler do evento contextmenu do canvas.
     * Verifica se o botão direito do mouse
     * foi clicado em cima de algum elemento, se
     * tiver sido, apaga esse elemento
     * 
     * @param e 
     */
    private contextMenuEventHandler(e: MouseEvent) {
        e.preventDefault();
        const mouseX = e.offsetX / this.scale;
        const mouseY = e.offsetY / this.scale;

        for (let i = this.elements.length - 1; i >= 0; i--) {
            const element = this.elements[i];
            const outerX = element.x + element.width;
            const outerY = element.y + element.height;

            if (
                (mouseX >= element.x && mouseX <= outerX) &&
                (mouseY >= element.y && mouseY <= outerY)
            ) {
                this.elements.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Carrega os dados salvos de um mapa
     * e cria os elementos na coordenadas
     * especificadas
     * 
     * @param savedData
     */
    private loadSavedData(savedData: string) {
        let json = JSON.parse(savedData);
        for (let element in json) {
            switch (String(json[element].type)) {
                case 'wall':
                    this.elements.push(new Element(
                        parseInt(json[element].x),
                        parseInt(json[element].y),
                        parseInt(json[element].width),
                        parseInt(json[element].height),
                        String(json[element].id),
                        String(json[element].type),
                        Graphics.wall[parseInt(json[element].index)].sprite,
                        parseInt(json[element].index)
                    ));
                    break;
                case 'wallAnim':
                    this.elements.push(new Element(
                        parseInt(json[element].x),
                        parseInt(json[element].y),
                        parseInt(json[element].width),
                        parseInt(json[element].height),
                        String(json[element].id),
                        String(json[element].type),
                        Graphics.wallAnim[parseInt(json[element].index)].sprite,
                        parseInt(json[element].index)
                    ));
                    break;
                case 'floor':
                    this.elements.push(new Element(
                        parseInt(json[element].x),
                        parseInt(json[element].y),
                        parseInt(json[element].width),
                        parseInt(json[element].height),
                        String(json[element].id),
                        String(json[element].type),
                        Graphics.floor[parseInt(json[element].index)].sprite,
                        parseInt(json[element].index)
                    ));
                    break;
                case 'interactable':
                    this.elements.push(new Element(
                        parseInt(json[element].x),
                        parseInt(json[element].y),
                        parseInt(json[element].width),
                        parseInt(json[element].height),
                        String(json[element].id),
                        String(json[element].type),
                        Graphics.interactable[parseInt(json[element].index)].sprite,
                        parseInt(json[element].index)
                    ));
                    break;
                case 'interactableAnim':
                    this.elements.push(new Element(
                        parseInt(json[element].x),
                        parseInt(json[element].y),
                        parseInt(json[element].width),
                        parseInt(json[element].height),
                        String(json[element].id),
                        String(json[element].type),
                        Graphics.interactableAnim[parseInt(json[element].index)].sprite,
                        parseInt(json[element].index)
                    ));
                    break;
                case 'doors':
                    this.elements.push(new Element(
                        parseInt(json[element].x),
                        parseInt(json[element].y),
                        parseInt(json[element].width),
                        parseInt(json[element].height),
                        String(json[element].id),
                        String(json[element].type),
                        Graphics.doors[parseInt(json[element].index)].sprite,
                        parseInt(json[element].index)
                    ));
                    break;
                case 'weapon':
                    this.elements.push(new Element(
                        parseInt(json[element].x),
                        parseInt(json[element].y),
                        parseInt(json[element].width),
                        parseInt(json[element].height),
                        String(json[element].id),
                        String(json[element].type),
                        Graphics.weapon[parseInt(json[element].index)].sprite,
                        parseInt(json[element].index)
                    ));
                    break;
                case 'potion':
                    this.elements.push(new Element(
                        parseInt(json[element].x),
                        parseInt(json[element].y),
                        parseInt(json[element].width),
                        parseInt(json[element].height),
                        String(json[element].id),
                        String(json[element].type),
                        Graphics.potion[parseInt(json[element].index)].sprite,
                        parseInt(json[element].index)
                    ));
                    break;
                case 'enemy':
                    this.elements.push(new Element(
                        parseInt(json[element].x),
                        parseInt(json[element].y),
                        parseInt(json[element].width),
                        parseInt(json[element].height),
                        String(json[element].id),
                        String(json[element].type),
                        Graphics.enemy[parseInt(json[element].index)].sprite,
                        parseInt(json[element].index)
                    ));
                    break;
                case 'player':
                    this.elements.push(new Element(
                        parseInt(json[element].x),
                        parseInt(json[element].y),
                        parseInt(json[element].width),
                        parseInt(json[element].height),
                        String(json[element].id),
                        String(json[element].type),
                        Graphics.player.sprite,
                        parseInt(json[element].index)
                    ));
                    break;
            }
        }
    }

    /**
     * Cria JSON com informações do mapa
     * a ser salvo e disponibiliza JSON para
     * download
     */
    private saveMap() {
        window.localStorage.clear();

        const mapJSON = {
            'width': this.mapWidth,
            'height': this.mapHeight,
            'elements': this.elements
        };

        const blob = new Blob([JSON.stringify(mapJSON)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'map.json');
        a.click();
    }
}
