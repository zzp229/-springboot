export class Cell {
    constructor(r, c) {
        this.r = r;
        this.c = c;
        this.x = c + 0.5;   //canvas坐标有点特殊需要转换一下
        this.y = r + 0.5;
    }
}