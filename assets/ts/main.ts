import Spritesheet from './graphics/spritesheet';
import { GameState } from './misc/constants';
import HTML from './misc/html';
import Element from './world/element';

export type DiffMouseCoord = {
    diffX: number,
    diffY: number
};

export default class Game {
    public static elements = new Array<Element>();
    public static dragged: HTMLCanvasElement;
    public static canvasDragged: Element | null;
    public static mouseDown: DiffMouseCoord | null;
    public static dragEvent: DragEvent;
    public static scale: number;
    public static WIDTH: number;
    public static HEIGHT: number;
    public spritesheet: Spritesheet;
    public state: GameState;
    private isRunning: boolean;
    private appDiv : HTMLDivElement;
    private canvas: HTMLCanvasElement;
    private context2D: CanvasRenderingContext2D;
    private html: HTML;

    constructor(width: number, height: number) {
        Game.WIDTH = width;
        Game.HEIGHT = height;
        
        this.spritesheet = new Spritesheet();

        this.appDiv = document.getElementById('app') as HTMLDivElement;
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        Game.scale = this.determineScale();
        this.state = GameState.PLAY;

        this.html = new HTML(Game.scale);

        this.isRunning = false;

        Game.canvasDragged = null;
        Game.mouseDown = null;
    }

    public async main() {
        await this.loadAssets();
        this.html.createElements();
        this.initializeEvents();
        this.adjustCanvas();
        this.drawBackground();
        this.run();
    }

    private tick() {
        for(let i = 0; i < Game.elements.length; i ++) {
            Game.elements[i].tick();
        }
    }

    private render() {
        this.drawBackground();
        for(let i = 0; i < Game.elements.length; i ++) {
            Game.elements[i].render(this.context2D);
        }
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
        this.canvas.width = Game.WIDTH * Game.scale;
        this.canvas.height = Game.HEIGHT * Game.scale;
        this.context2D.scale(Game.scale, Game.scale);
        this.context2D.imageSmoothingEnabled = false;
    }

    private drawBackground() {
        this.context2D.fillStyle = 'black';
        this.context2D.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);
        this.context2D.drawImage(Spritesheet.grid, 0, 0, Game.WIDTH, Game.HEIGHT);
    }

    private determineScale() {
        const divWidth = this.appDiv.offsetWidth;
        const divHeight = this.appDiv.offsetHeight;

        let finalScale = divWidth / Game.WIDTH;

        if(finalScale >= 1) {
            finalScale = Math.floor(finalScale);
            if(Game.WIDTH * finalScale > divWidth
                || Game.HEIGHT * finalScale > divHeight) {
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
            Game.scale = this.determineScale();
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
            const x = Math.round((e.offsetX - Game.dragEvent.clientX + Game.dragged.offsetLeft) / Game.scale);
            const y = Math.round((e.offsetY - Game.dragEvent.clientY + Game.dragged.offsetTop - scrollTop) / Game.scale);

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
        this.canvas.addEventListener('mousedown', (e) => {
            const mouseX = e.offsetX / Game.scale;
            const mouseY = e.offsetY / Game.scale;

            for(let i = Game.elements.length - 1; i >= 0; i--) {
                const element = Game.elements[i];
                const x = element.x;
                const y = element.y;
                const outerX = element.x + element.width;
                const outerY = element.y + element.height;

                if(
                    (mouseX >= x && mouseX <= outerX) &&
                    (mouseY >= y && mouseY <= outerY)
                ) {
                    Game.canvasDragged = element;
                    Game.mouseDown = {diffX: x - mouseX, diffY: y - mouseY};
                    element.drawWithOpacity = true;
                    break;
                }
            }
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if(Game.mouseDown) {
                const mouseX = (e.offsetX / Game.scale) + Game.mouseDown.diffX;
                const mouseY = (e.offsetY / Game.scale) + Game.mouseDown.diffY;
                if(Game.canvasDragged) {
                    Game.canvasDragged.x = mouseX;
                    Game.canvasDragged.y = mouseY;
                }
            }
        });
        this.canvas.addEventListener('mouseup', (e) => {
            if(Game.mouseDown) {
                const mouseX = (e.offsetX / Game.scale) + Game.mouseDown.diffX;
                const mouseY = (e.offsetY / Game.scale) + Game.mouseDown.diffY;
                if(Game.canvasDragged) {
                    Game.canvasDragged.x = mouseX;
                    Game.canvasDragged.y = mouseY;
                    Game.canvasDragged.drawWithOpacity = false;
                    Game.mouseDown = null;
                    Game.canvasDragged = null;
                }
            }
        });
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const mouseX = e.offsetX / Game.scale;
            const mouseY = e.offsetY / Game.scale;

            for(let i = Game.elements.length - 1; i >= 0; i--) {
                const element = Game.elements[i];
                const x = element.x;
                const y = element.y;
                const outerX = element.x + element.width;
                const outerY = element.y + element.height;

                if(
                    (mouseX >= x && mouseX <= outerX) &&
                    (mouseY >= y && mouseY <= outerY)
                ) {
                    Game.elements.splice(i, 1);
                    break;
                }
            }
        });
    }

    private async loadAssets() {
        await this.spritesheet.loadSprites();
    }
}

document.getElementById('btnCreateMap')?.addEventListener('click', () => {
    const btnCredits = document.getElementById('btnCredits') as HTMLButtonElement;
    const divInputs = document.getElementById('chooseResolution') as HTMLDivElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const inputWidth = document.getElementById('width') as HTMLInputElement;
    const inputHeight = document.getElementById('height') as HTMLInputElement;
    const width = parseInt(inputWidth.value);
    const height = parseInt(inputHeight.value);

    if(width && height) {
        btnCredits.style.display = 'block';
        divInputs.style.display = 'none';
        canvas.style.display = 'block';
        new Game(width, height).main();
    }
});
