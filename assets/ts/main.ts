import Spritesheet from './graphics/spritesheet';
import { GameState, HEIGHT, TILE_SIZE, WIDTH } from './misc/constants';
import HTML from './misc/html';
import Element from './world/element';

export default class Game {
    public static elements = new Array<Element>();
    public static dragged: HTMLCanvasElement;
    public static dragEvent: DragEvent;
    public spritesheet: Spritesheet;
    public scale: number;
    public state: GameState;
    private isRunning: boolean;
    private appDiv : HTMLDivElement;
    private canvas: HTMLCanvasElement;
    private context2D: CanvasRenderingContext2D;
    private html: HTML;

    constructor() {
        this.spritesheet = new Spritesheet();

        this.appDiv = document.getElementById('app') as HTMLDivElement;
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.scale = this.determineScale();
        this.state = GameState.PLAY;

        this.html = new HTML(this.scale);

        this.isRunning = false;
    }

    public async main() {
        await this.loadAssets();
        this.html.createElements();
        this.initializeEvents();
        this.adjustCanvas();
        this.run();
    }

    private tick() {
        Game.elements.forEach((element, index) => {
            element.tick();
        });
    }

    private render() {
        Game.elements.forEach((element, index) => {
            element.render(this.context2D);
        });
    }

    private run() {
        let self = this;
        let frames = 0;
        let last = 0;

        function loop(now: number) {
            self.tick();
            self.render();
            
            if(self.html.spanFPS.style.display === 'block') {
                frames++;
                if(now - last > 1000) {
                    self.html.spanFPS.innerText = `${frames}fps`;
                    frames = 0;
                    last = now;
                }
            }

            if(self.isRunning) {
                window.requestAnimationFrame(loop);
            }
        }
        
        this.isRunning = true;
        window.requestAnimationFrame(loop);
    }

    private adjustCanvas() {
        this.canvas.width = WIDTH * this.scale;
        this.canvas.height = HEIGHT * this.scale;
        this.context2D.fillStyle = 'black';
        this.context2D.fillRect(0, 0, WIDTH * this.scale, HEIGHT * this.scale);
        this.context2D.scale(this.scale, this.scale);
        this.context2D.imageSmoothingEnabled = false;
    }

    private determineScale() {
        const divWidth = this.appDiv.offsetWidth;
        const divHeight = this.appDiv.offsetHeight;

        let finalScale = divWidth / WIDTH;

        if(finalScale >= 1) {
            finalScale = Math.floor(finalScale);
            if(WIDTH * finalScale > divWidth
                || HEIGHT * finalScale > divHeight) {
                finalScale = finalScale - 1;
            }
        } 
        
        if(finalScale < 1 && finalScale >= 0.75) {
            finalScale = 0.75;
        } else if (finalScale < 0.75 && finalScale >= 0.5) {
            finalScale = 0.5;
        } else if (finalScale < 0.5) {
            finalScale = 0.25;
        }

        return finalScale;
    }

    private initializeEvents() {
        window.addEventListener('resize', () => {
            this.scale = this.determineScale();
            this.adjustCanvas();
        });
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            return false;
        });
        this.canvas.addEventListener('drop', (e) => {
            const sprtIndex = Number(Game.dragged.dataset.index);
            const sprtArray = String(Game.dragged.dataset.array);
            const scrollTop = Game.dragged.parentElement ? Game.dragged.parentElement.scrollTop : 0;
            const x = (e.offsetX - Game.dragEvent.clientX + Game.dragged.offsetLeft) / this.scale;
            const y = (e.offsetY - Game.dragEvent.clientY + Game.dragged.offsetTop - scrollTop) / this.scale;

            switch(sprtArray) {
                case 'wall':
                    const nameW = Spritesheet.wall[sprtIndex].name;
                    const sprtW = Spritesheet.wall[sprtIndex].sprite;
                    Game.elements.push(new Element(x, y, sprtW.width, sprtW.height, nameW, 'wall', sprtW));
                    break;
                case 'floor':
                    const nameF = Spritesheet.floor[sprtIndex].name;
                    const sprtF = Spritesheet.floor[sprtIndex].sprite;
                    Game.elements.push(new Element(x, y, sprtF.width, sprtF.height, nameF, 'floor', sprtF));
                    break;
                case 'interactable':
                    const nameI = Spritesheet.interactable[sprtIndex].name;
                    const sprtI = Spritesheet.interactable[sprtIndex].sprite;
                    Game.elements.push(new Element(x, y, sprtI.width, sprtI.height, nameI, 'interactable', sprtI));
                    break;
                case 'interactableAnim':
                    const nameIA = Spritesheet.interactableAnim[sprtIndex].name;
                    const sprtIA = Spritesheet.interactableAnim[sprtIndex].sprite;
                    Game.elements.push(new Element(x, y, sprtIA.width, sprtIA.height, nameIA, 'interactableAnim', sprtIA));
                    break;
                case 'doors':
                    const nameD = Spritesheet.doors[sprtIndex].name;
                    const sprtD = Spritesheet.doors[sprtIndex].sprite;
                    Game.elements.push(new Element(x, y, sprtD.width, sprtD.height, nameD, 'doors', sprtD));
                    break;
                case 'weapon':
                    const nameWe = Spritesheet.weapon[sprtIndex].name;
                    const sprtWe = Spritesheet.weapon[sprtIndex].sprite;
                    Game.elements.push(new Element(x, y, sprtWe.width, sprtWe.height, nameWe, 'weapon', sprtWe));
                    break;
                case 'potion':
                    const nameP = Spritesheet.potion[sprtIndex].name;
                    const sprtP = Spritesheet.potion[sprtIndex].sprite;
                    Game.elements.push(new Element(x, y, sprtP.width, sprtP.height, nameP, 'potion', sprtP));
                    break;
                case 'enemy':
                    const nameE = Spritesheet.enemy[sprtIndex].name;
                    const sprtE = Spritesheet.enemy[sprtIndex].sprite;
                    Game.elements.push(new Element(x, y, sprtE.width, sprtE.height, nameE, 'enemy', sprtE));
                    break;
                case 'player':
                    const namePl = Spritesheet.player.name;
                    const sprtPl = Spritesheet.player.sprite;
                    Game.elements.push(new Element(x, y, sprtPl.width, sprtPl.height, namePl, 'enemy', sprtPl));
                    break;
            }
        });
    }

    private async loadAssets() {
        await this.spritesheet.loadSprites();
    }
}

const game = new Game();
game.main();
