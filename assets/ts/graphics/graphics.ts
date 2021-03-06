import { SPRITESHEET, TILE_SIZE } from "../misc/constants";
import { CHEATSHEET } from "./spritesheet.cheatsheet";

/**
 * Tipo para guardar um Sprite
 */
export type Sprite = {
    name: string,
    sprite: ImageBitmap
};

/**
 * Classe para lidar com os gráficos 
 * do editor de level
 */
export default class Graphics {

    /**
     * Array contendo os sprites do tipo wall
     * 
     * @access public static
     */
    public static wall = new Array<Sprite>();

    /**
     * Array contendo os sprites do tipo wallAnim
     * 
     * @access public static
     */
    public static wallAnim = new Array<Sprite>();

    /**
     * Array contendo os sprites do tipo floor
     * 
     * @access public static
     */
    public static floor = new Array<Sprite>();

    /**
     * Array contendo os sprites do tipo interactable
     * 
     * @access public static
     */
    public static interactable = new Array<Sprite>();

    /**
     * Array contendo os sprites do tipo interactableAnim
     * 
     * @access public static
     */
    public static interactableAnim = new Array<Sprite>();

    /**
     * Array contendo os sprites do tipo doors
     * 
     * @access public static
     */
    public static doors = new Array<Sprite>();

    /**
     * Array contendo os sprites do tipo weapon
     * 
     * @access public static
     */
    public static weapon = new Array<Sprite>();

    /**
     * Array contendo os sprites do tipo potion
     * 
     * @access public static
     */
    public static potion = new Array<Sprite>();

    /**
     * Array contendo os sprites do tipo enemy
     * 
     * @access public static
     */
    public static enemy = new Array<Sprite>();

    /**
     * Sprite que identifica o player
     * 
     * @access public static
     */
    public static player: Sprite;

    /**
     * Imagem do grid para ser usado de
     * background
     * 
     * @access public static
     */
    public static grid: HTMLImageElement;

    /**
     * Carrega os sprite e os separa
     * conforme seu tipo em arrays
     * 
     * @param scale 
     */
    public async loadGraphics(scale: number) {
        const spritesheet = await this.setSpritesheet();

        Graphics.grid = await this.createGridImage(scale);

        let sprite = await this.cutSprite(
            spritesheet, 
            CHEATSHEET.player[0], 
            CHEATSHEET.player[1], 
            CHEATSHEET.player[2], 
            CHEATSHEET.player[3]
        );
        Graphics.player = {
            name: 'player',
            sprite: sprite
        };

        for(const spriteName in CHEATSHEET.wall) {
            const spriteCoord = CHEATSHEET.wall[spriteName] as Array<number>;
            const sprt = await this.cutSprite(
                spritesheet, 
                spriteCoord[0], 
                spriteCoord[1], 
                spriteCoord[2], 
                spriteCoord[3]
            );
            const wall = {
                name: spriteName,
                sprite: sprt
            };
            Graphics.wall.push(wall);
        }
        for(const spriteName in CHEATSHEET.wall_anim) {
            const spriteCoord = CHEATSHEET.wall_anim[spriteName] as Array<number>;
            const sprt = await this.cutSprite(
                spritesheet, 
                spriteCoord[0], 
                spriteCoord[1], 
                spriteCoord[2], 
                spriteCoord[3]
            );
            const wall = {
                name: spriteName,
                sprite: sprt
            };
            Graphics.wallAnim.push(wall);
        }
        for(const spriteName in CHEATSHEET.floor) {
            const spriteCoord = CHEATSHEET.floor[spriteName] as Array<number>;
            const sprt = await this.cutSprite(
                spritesheet, 
                spriteCoord[0], 
                spriteCoord[1], 
                spriteCoord[2], 
                spriteCoord[3]
            );
            const floor = {
                name: spriteName,
                sprite: sprt
            };
            Graphics.floor.push(floor);
        }
        for(const spriteName in CHEATSHEET.interactable) {
            const spriteCoord = CHEATSHEET.interactable[spriteName] as Array<number>;
            const sprt = await this.cutSprite(
                spritesheet, 
                spriteCoord[0], 
                spriteCoord[1], 
                spriteCoord[2], 
                spriteCoord[3]
            );
            const interactable = {
                name: spriteName,
                sprite: sprt
            };
            Graphics.interactable.push(interactable);
        }
        for(const spriteName in CHEATSHEET.interactable_anim) {
            const spriteCoord = CHEATSHEET.interactable_anim[spriteName] as Array<number>;
            const sprt = await this.cutSprite(
                spritesheet, 
                spriteCoord[0], 
                spriteCoord[1], 
                spriteCoord[2], 
                spriteCoord[3]
            );
            const interactableAnim = {
                name: spriteName,
                sprite: sprt
            };
            Graphics.interactableAnim.push(interactableAnim);
        }
        for(const spriteName in CHEATSHEET.doors) {
            const spriteCoord = CHEATSHEET.doors[spriteName] as Array<number>;
            const sprt = await this.cutSprite(
                spritesheet, 
                spriteCoord[0], 
                spriteCoord[1], 
                spriteCoord[2], 
                spriteCoord[3]
            );
            const doors = {
                name: spriteName,
                sprite: sprt
            };
            Graphics.doors.push(doors);
        }
        for(const spriteName in CHEATSHEET.weapon) {
            const spriteCoord = CHEATSHEET.weapon[spriteName] as Array<number>;
            const sprt = await this.cutSprite(
                spritesheet, 
                spriteCoord[0], 
                spriteCoord[1], 
                spriteCoord[2], 
                spriteCoord[3]
            );
            const weapon = {
                name: spriteName,
                sprite: sprt
            };
            Graphics.weapon.push(weapon);
        }
        for(const spriteName in CHEATSHEET.potion) {
            const spriteCoord = CHEATSHEET.potion[spriteName] as Array<number>;
            const sprt = await this.cutSprite(
                spritesheet, 
                spriteCoord[0], 
                spriteCoord[1], 
                spriteCoord[2], 
                spriteCoord[3]
            );
            const potion = {
                name: spriteName,
                sprite: sprt
            };
            Graphics.potion.push(potion);
        }
        for(const spriteName in CHEATSHEET.enemy) {
            const spriteCoord = CHEATSHEET.enemy[spriteName] as Array<number>;
            const sprt = await this.cutSprite(
                spritesheet, 
                spriteCoord[0], 
                spriteCoord[1], 
                spriteCoord[2], 
                spriteCoord[3]
            );
            const enemy = {
                name: spriteName,
                sprite: sprt
            };
            Graphics.enemy.push(enemy);
        }
    }

    /**
     * Carrega spritesheet base,
     * de onde irão sair os sprites
     * 
     * @returns Promise
     */
    private setSpritesheet() : Promise<HTMLImageElement> {
        const spritesheet = document.createElement('img');
        return new Promise((resolve, reject) => {
            spritesheet.onload = () => resolve(spritesheet);
            spritesheet.onerror = reject;
            spritesheet.src = SPRITESHEET;
        });
    }

    /**
     * Cria imagem de um grid dinâmicamente
     * 
     * @param scale 
     * @returns Promise
     */
    private createGridImage(scale: number) : Promise<HTMLImageElement> {
        const img = document.createElement('img');
        const size = TILE_SIZE * scale;
        const color = 'rgba(187, 128, 130, 0.4)';
        const svg = new Blob([`
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
                        <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${color}" stroke-width="${scale}" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)"/>
            </svg>
        `], {type: 'image/svg+xml;charset=utf-8'});
        const url = window.URL.createObjectURL(svg);
        return new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    /**
     * Corta sprite do spritesheet
     * 
     * @param spritesheet 
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     * @returns Promise
     */
    private cutSprite(spritesheet: HTMLImageElement, x: number, y: number, width: number, height: number) {
        return createImageBitmap(spritesheet, x, y, width, height);
    }
}
