export default class Element {

    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public id: string;
    public type: string;
    public drawWithHalfOpacity: boolean;
    private sprite: ImageBitmap;
    public index: number;

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

    public tick() {

    }

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
