/**
 * Classe para instanciar elementos
 * que formaram o mapa
 */
export default class Element {

    /**
     * Coordenada x
     * 
     * @access public
     */
    public x: number;

    /**
     * Coordenada y
     * 
     * @access public
     */
    public y: number;

    /**
     * Largura
     * 
     * @access public
     */
    public width: number;

    /**
     * Altura
     * 
     * @access public
     */
    public height: number;

    /**
     * Identificação do sprite
     * 
     * @access public
     */
    public id: string;

    /**
     * Tipo de sprite
     * 
     * @access public
     */
    public type: string;

    /**
     * Se deve ser renderização com transparência
     * 
     * @access public
     */
    public drawWithHalfOpacity: boolean;

    /**
     * Sprite
     * 
     * @access public
     */
    private sprite: ImageBitmap;

    /**
     * Índice no array de sprites
     * 
     * @access public
     */
    public index: number;

    /**
     * Construtor da classe Element
     * 
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     * @param id 
     * @param type 
     * @param sprite 
     * @param index 
     */
    constructor(
        x: number,
        y: number, 
        width: number, 
        height: number, 
        id: string, 
        type: string, 
        sprite: ImageBitmap,
        index: number
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = id;
        this.type = type;
        this.sprite = sprite;
        this.index = index;
        this.drawWithHalfOpacity = false;
    }

    /**
     * Lógica executada pelo elemento
     * a cada tick (frame)
     */
    public tick() {

    }

    /**
     * Renderização do elemento feita
     * a cada frame
     * 
     * @param context2D
     */
    public render(context2D: CanvasRenderingContext2D) {
        if(this.drawWithHalfOpacity) {
            context2D.globalAlpha = 0.5;
            context2D.drawImage(this.sprite, this.x, this.y, this.width, this.height);
            context2D.globalAlpha = 1;
        } else {
            context2D.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }        
    }
}
