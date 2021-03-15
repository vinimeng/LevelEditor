export default class Element {

    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public id: string;
    public type: string;
    private sprite: ImageBitmap;

    constructor(
        x: number,
        y: number, 
        width: number, 
        height: number, 
        id: string, 
        type: string, 
        sprite: ImageBitmap
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = id;
        this.type = type;
        this.sprite = sprite;
    }

    public tick() {

    }

    public render(context2D: CanvasRenderingContext2D) {
        context2D.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}