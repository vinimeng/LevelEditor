import Spritesheet, { Sprite } from "../graphics/graphics";
import Game from "../game/game";

/**
 * Classe para lidar com alguns elementos HTML
 */
export default class HTML {
    /**
     * Guarda elemento que mostra os FPS
     * @access public
     */
    public spanFPS: HTMLSpanElement;

    /**
     * Guarda botão de créditos
     * @access public
     */
    public btnCredits: HTMLButtonElement;

    /**
     * Guarda modal dos créditos
     * @access public
     */
    public modalCredits: HTMLDivElement;

    /**
     * Guarda botão que mostra/esconde FPS
     * @access public
     */
    public btnToggleFPS: HTMLButtonElement;

    /**
     * Guarda div onde os elementos arrastáveis
     * são colocados
     * @access public
     */
    public elements: HTMLDivElement;

    /**
     * Guarda a escala de renderização do canvas
     * @access public
     */
    private scale: number;

    /**
     * Construtor da classe HTML
     * 
     * @param scale 
     */
    constructor(scale: number) {
        this.spanFPS = document.getElementById('fpsCounter') as HTMLSpanElement;
        this.btnCredits = document.getElementById('btnCredits') as HTMLButtonElement;
        this.modalCredits = document.getElementById('modalCredits') as HTMLDivElement;
        this.btnToggleFPS = document.getElementById('toggleFPS') as HTMLButtonElement;
        this.elements = document.getElementById('elements') as HTMLDivElement;

        this.scale = scale;

        this.spanFPS.style.display = 'none';
        this.modalCredits.style.display = 'none';

        this.initializeEvents();
    }

    /**
     * Inicializa eventos de
     * alguns elementos HTML
     */
    private initializeEvents() {
        /**
         * Adiciona função ao clicar no botão dos créditos,
         * para mostrar/esconder modal de créditos
         */
        this.btnCredits.addEventListener('click', () => {
            if(this.modalCredits.style.display === 'none') {
                this.modalCredits.style.display = 'block';
            } else {
                this.modalCredits.style.display = 'none';
            }
        });

        /**
         * Adiciona função ao clicar no botão ToggleFPS,
         * para mostrar/esconder FPS
         */
        this.btnToggleFPS.addEventListener('click', () => {
            if(this.spanFPS.style.display === 'block') {
                this.spanFPS.style.display = 'none';
            } else {
                this.spanFPS.style.display = 'block';
            }
        });
    }

    /**
     * Cria elementos arrastáveis
     * a partir dos sprites disponíveis
     */
    public createElements() {

        const divBreakWallBefore = document.createElement('div');
        divBreakWallBefore.className = 'break';
        const spanWall = document.createElement('span');
        spanWall.innerHTML = 'Wall:'
        const divBreakWallAfter = document.createElement('div');
        divBreakWallAfter.className = 'break';
        this.elements.append(divBreakWallBefore);
        this.elements.append(spanWall);
        this.elements.append(divBreakWallAfter);
        Spritesheet.wall.forEach((sprite, index) => {
            this.appendElements(sprite, index, 'wall');
        });

        const divBreakWallAnimBefore = document.createElement('div');
        divBreakWallAnimBefore.className = 'break';
        const spanWallAnim = document.createElement('span');
        spanWallAnim.innerHTML = 'WallAnim:'
        const divBreakWallAnimAfter = document.createElement('div');
        divBreakWallAnimAfter.className = 'break';
        this.elements.append(divBreakWallAnimBefore);
        this.elements.append(spanWallAnim);
        this.elements.append(divBreakWallAnimAfter);
        Spritesheet.wallAnim.forEach((sprite, index) => {
            this.appendElements(sprite, index, 'wallAnim');
        });

        const divBreakFloorBefore = document.createElement('div');
        divBreakFloorBefore.className = 'break';
        const spanFloor = document.createElement('span');
        spanFloor.innerHTML = 'Floor:'
        const divBreakFloorAfter = document.createElement('div');
        divBreakFloorAfter.className = 'break';
        this.elements.append(divBreakFloorBefore);
        this.elements.append(spanFloor);
        this.elements.append(divBreakFloorAfter);
        Spritesheet.floor.forEach((sprite, index) => {
            this.appendElements(sprite, index, 'floor');
        });

        const divBreakInteractableBefore = document.createElement('div');
        divBreakInteractableBefore.className = 'break';
        const spanInteractable = document.createElement('span');
        spanInteractable.innerHTML = 'Interactable:'
        const divBreakInteractableAfter = document.createElement('div');
        divBreakInteractableAfter.className = 'break';
        this.elements.append(divBreakInteractableBefore);
        this.elements.append(spanInteractable);
        this.elements.append(divBreakInteractableAfter);
        Spritesheet.interactable.forEach((sprite, index) => {
            this.appendElements(sprite, index, 'interactable');
        });

        const divBreakInteractableAnimBefore = document.createElement('div');
        divBreakInteractableAnimBefore.className = 'break';
        const spanInteractableAnim = document.createElement('span');
        spanInteractableAnim.innerHTML = 'InteractableAnim:'
        const divBreakInteractableAnimAfter = document.createElement('div');
        divBreakInteractableAnimAfter.className = 'break';
        this.elements.append(divBreakInteractableAnimBefore);
        this.elements.append(spanInteractableAnim);
        this.elements.append(divBreakInteractableAnimAfter);
        Spritesheet.interactableAnim.forEach((sprite, index) => {
            this.appendElements(sprite, index, 'interactableAnim');
        });

        const divBreakDoorsBefore = document.createElement('div');
        divBreakDoorsBefore.className = 'break';
        const spanDoors = document.createElement('span');
        spanDoors.innerHTML = 'Doors:'
        const divBreakDoorsAfter = document.createElement('div');
        divBreakDoorsAfter.className = 'break';
        this.elements.append(divBreakDoorsBefore);
        this.elements.append(spanDoors);
        this.elements.append(divBreakDoorsAfter);
        Spritesheet.doors.forEach((sprite, index) => {
            this.appendElements(sprite, index, 'doors');
        });

        const divBreakWeaponBefore = document.createElement('div');
        divBreakWeaponBefore.className = 'break';
        const spanWeapon = document.createElement('span');
        spanWeapon.innerHTML = 'Weapon:'
        const divBreakWeaponAfter = document.createElement('div');
        divBreakWeaponAfter.className = 'break';
        this.elements.append(divBreakWeaponBefore);
        this.elements.append(spanWeapon);
        this.elements.append(divBreakWeaponAfter);
        Spritesheet.weapon.forEach((sprite, index) => {
            this.appendElements(sprite, index, 'weapon');
        });

        const divBreakPotionBefore = document.createElement('div');
        divBreakPotionBefore.className = 'break';
        const spanPotion = document.createElement('span');
        spanPotion.innerHTML = 'Potion:'
        const divBreakPotionAfter = document.createElement('div');
        divBreakPotionAfter.className = 'break';
        this.elements.append(divBreakPotionBefore);
        this.elements.append(spanPotion);
        this.elements.append(divBreakPotionAfter);
        Spritesheet.potion.forEach((sprite, index) => {
            this.appendElements(sprite, index, 'potion');
        });

        const divBreakEnemyBefore = document.createElement('div');
        divBreakEnemyBefore.className = 'break';
        const spanEnemy = document.createElement('span');
        spanEnemy.innerHTML = 'Enemy:'
        const divBreakEnemyAfter = document.createElement('div');
        divBreakEnemyAfter.className = 'break';
        this.elements.append(divBreakEnemyBefore);
        this.elements.append(spanEnemy);
        this.elements.append(divBreakEnemyAfter);
        Spritesheet.enemy.forEach((sprite, index) => {
            this.appendElements(sprite, index, 'enemy');
        });
        
        const divBreakPlayerBefore = document.createElement('div');
        divBreakPlayerBefore.className = 'break';
        const spanPlayer = document.createElement('span');
        spanPlayer.innerHTML = 'Player:'
        const divBreakPlayerAfter = document.createElement('div');
        divBreakPlayerAfter.className = 'break';
        this.elements.append(divBreakPlayerBefore);
        this.elements.append(spanPlayer);
        this.elements.append(divBreakPlayerAfter);
        this.appendElements(Spritesheet.player, 0, 'player');
    }

    /**
     * Adiciona elementos arrastáveis
     * a uma div visível
     * 
     * @param sprite 
     * @param index 
     * @param array 
     */
    private appendElements(sprite: Sprite, index: number, array: string) {
        const canvas = document.createElement('canvas');
        canvas.draggable = true;
        canvas.width = sprite.sprite.width * this.scale;
        canvas.height = sprite.sprite.height * this.scale;
        canvas.style.margin = '5px';
        canvas.title = sprite.name;
        canvas.id = sprite.name;
        canvas.dataset.index = '' + index;
        canvas.dataset.array = array;

        canvas.addEventListener('dragstart', (e) => {
            Game.dragged = canvas;
            Game.dragEvent = e;
        });

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.scale(this.scale, this.scale);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(sprite.sprite, 0, 0);
        this.elements.append(canvas);
    }
}
