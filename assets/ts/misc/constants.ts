export const GAME_WIDTH = 320;
export const GAME_HEIGHT = 180;
export const SPRITESHEET = './assets/img/spritesheet.png';
export const TILE_SIZE = 16;
export enum GameState {
    INITIALIZING,
    MAINMENU,
    PLAY,
    CUTSCENE,
    PAUSEMENU,
    ENDING
};