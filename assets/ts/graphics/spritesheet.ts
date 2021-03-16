import Game from "../main";
import { SPRITESHEET, TILE_SIZE } from "../misc/constants";
import { SPRITESCOORD } from "./spritesheet.cheatsheet";

export type Sprite = {
    name: string,
    sprite: ImageBitmap
};

export default class Spritesheet {
    public static wall = new Array<Sprite>();
    public static floor = new Array<Sprite>();
    public static interactable = new Array<Sprite>();
    public static interactableAnim = new Array<Sprite>();
    public static doors = new Array<Sprite>();
    public static weapon = new Array<Sprite>();
    public static potion = new Array<Sprite>();
    public static enemy = new Array<Sprite>();
    public static player: Sprite;
    public static grid: HTMLImageElement;

    public async loadSprites() {
        const spritesheet = await this.setSpritesheet();

        Spritesheet.grid = await this.setGrid();

        let sprite = await this.cutSprite(spritesheet, SPRITESCOORD.player[0], SPRITESCOORD.player[1], SPRITESCOORD.player[2], SPRITESCOORD.player[3]);
        Spritesheet.player = {
            name: 'player',
            sprite: sprite
        };
        for(const spriteName in SPRITESCOORD.wall) {
            const spriteCoord = SPRITESCOORD.wall[spriteName] as Array<number>;
            const sprt = await this.cutSprite(spritesheet, spriteCoord[0], spriteCoord[1], spriteCoord[2], spriteCoord[3]);
            const wall = {
                name: spriteName,
                sprite: sprt
            };
            Spritesheet.wall.push(wall);
        }
        for(const spriteName in SPRITESCOORD.floor) {
            const spriteCoord = SPRITESCOORD.floor[spriteName] as Array<number>;
            const sprt = await this.cutSprite(spritesheet, spriteCoord[0], spriteCoord[1], spriteCoord[2], spriteCoord[3]);
            const floor = {
                name: spriteName,
                sprite: sprt
            };
            Spritesheet.floor.push(floor);
        }
        for(const spriteName in SPRITESCOORD.interactable) {
            const spriteCoord = SPRITESCOORD.interactable[spriteName] as Array<number>;
            const sprt = await this.cutSprite(spritesheet, spriteCoord[0], spriteCoord[1], spriteCoord[2], spriteCoord[3]);
            const interactable = {
                name: spriteName,
                sprite: sprt
            };
            Spritesheet.interactable.push(interactable);
        }
        for(const spriteName in SPRITESCOORD.interactable_anim) {
            const spriteCoord = SPRITESCOORD.interactable_anim[spriteName] as Array<number>;
            const sprt = await this.cutSprite(spritesheet, spriteCoord[0], spriteCoord[1], spriteCoord[2], spriteCoord[3]);
            const interactableAnim = {
                name: spriteName,
                sprite: sprt
            };
            Spritesheet.interactableAnim.push(interactableAnim);
        }
        for(const spriteName in SPRITESCOORD.doors) {
            const spriteCoord = SPRITESCOORD.doors[spriteName] as Array<number>;
            const sprt = await this.cutSprite(spritesheet, spriteCoord[0], spriteCoord[1], spriteCoord[2], spriteCoord[3]);
            const doors = {
                name: spriteName,
                sprite: sprt
            };
            Spritesheet.doors.push(doors);
        }
        for(const spriteName in SPRITESCOORD.weapon) {
            const spriteCoord = SPRITESCOORD.weapon[spriteName] as Array<number>;
            const sprt = await this.cutSprite(spritesheet, spriteCoord[0], spriteCoord[1], spriteCoord[2], spriteCoord[3]);
            const weapon = {
                name: spriteName,
                sprite: sprt
            };
            Spritesheet.weapon.push(weapon);
        }
        for(const spriteName in SPRITESCOORD.potion) {
            const spriteCoord = SPRITESCOORD.potion[spriteName] as Array<number>;
            const sprt = await this.cutSprite(spritesheet, spriteCoord[0], spriteCoord[1], spriteCoord[2], spriteCoord[3]);
            const potion = {
                name: spriteName,
                sprite: sprt
            };
            Spritesheet.potion.push(potion);
        }
        for(const spriteName in SPRITESCOORD.enemy) {
            const spriteCoord = SPRITESCOORD.enemy[spriteName] as Array<number>;
            const sprt = await this.cutSprite(spritesheet, spriteCoord[0], spriteCoord[1], spriteCoord[2], spriteCoord[3]);
            const enemy = {
                name: spriteName,
                sprite: sprt
            };
            Spritesheet.enemy.push(enemy);
        }
    }

    private setSpritesheet() : Promise<HTMLImageElement> {
        const spritesheet = document.createElement('img');
        return new Promise((resolve, reject) => {
            spritesheet.onload = () => resolve(spritesheet);
            spritesheet.onerror = reject;
            spritesheet.src = SPRITESHEET;
        });
    }

    private setGrid() : Promise<HTMLImageElement> {
        const img = document.createElement('img');
        const size = TILE_SIZE * Game.scale;
        const svg = new Blob([
            `
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                    <pattern id="grid" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
                        <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="rgba(187, 128, 130, 0.4)" stroke-width="1"/>
                    </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)"/>
                </svg>
            `
        ], {type: 'image/svg+xml;charset=utf-8'});
        const url = window.URL.createObjectURL(svg);
        return new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    private cutSprite(spritesheet: HTMLImageElement, x: number, y: number, width: number, height: number) {
        return createImageBitmap(spritesheet, x, y, width, height);
    }
}
