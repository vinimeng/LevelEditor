/**
 * Largura do jogo.
 * É por essa largura que se basea o cálculo
 * de escala
 */
export const GAME_WIDTH = 320;

/**
 * Altura do jogo
 */
export const GAME_HEIGHT = 180;

/**
 * Caminho para o spritesheet
 */
export const SPRITESHEET = './assets/img/spritesheet.png';

/**
 * Tamanho dos tiles que compõem o
 * mapa
 */
export const TILE_SIZE = 16;

/**
 * Enum com os possíveis estados
 * do jogo
 */
export enum GameState {
    INITIALIZING,
    MAINMENU,
    PLAY,
    CUTSCENE,
    PAUSEMENU,
    ENDING
};