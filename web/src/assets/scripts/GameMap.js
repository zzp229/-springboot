import { AcGameObject } from "./AcGameObject";	//如果导入地对象有default的就不用大括号
import { Wall } from "./Wall";

export class GameMap extends AcGameObject { //给别人用，继承AcGameObject
    constructor(ctx, parent) {     //画布的元素，用来动态塑造画布的长宽
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;     //L是地图一个单位的长度

        //定义地图格子数
        this.rows = 13;
        this.cols = 13;

        this.inner_walls_count = 20;
        this.walls = [];
    }

    //算法实现是否联通
    check_connectivity(g, sx, sy, tx, ty) {
        if (sx == tx && sy == ty) return true;
        g[sx][sy] = true;

        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i ++ ) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
                return true;
        }

        return false;
    }

    create_walls() {
        const g = [];
        for (let r = 0; r < this.rows; r ++ ) {
            g[r] = [];
            for (let c = 0; c < this.cols; c ++ ) {
                g[r][c] = false;
            }
        }

        // 给四周加上障碍物
        for (let r = 0; r < this.rows; r ++ ) {
            g[r][0] = g[r][this.cols - 1] = true; 
        }

        for (let c = 0; c < this.cols; c ++ ) {
            g[0][c] = g[this.rows - 1][c] = true;
        }

        // 创建随机障碍物
        for (let i = 0; i < this.inner_walls_count / 2; i ++ ) {
            for (let j = 0; j < 1000; j ++ ) { 
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                if (g[r][c] || g[c][r]) continue;
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)   //不能覆盖左上角和右上角
                    continue;

                g[r][c] = g[c][r] = true;
                break;
            }
        }

        const copy_g = JSON.parse(JSON.stringify(g));
        if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2))
            return false;

        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }

        return true;
    }

    //给一千次机会建立墙
    start() {
        for (let i = 0; i < 1000; i ++ ) 
            if (this.create_walls())
                break;
    }

    //每一帧都计算地图的边长
    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows)); //求最大方格长度
        this.ctx.canvas.width = this.L * this.cols; //长和宽
        this.ctx.canvas.height = this.L * this.rows;
    }

    update() {  //每一帧都执行
        this.update_size(); 
        this.render();  //每帧渲染
    }

    render() {	//渲染
        const color_even = "#AAD751", color_odd = "#A2D149"; 
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if ((r + c) % 2 == 0) { //再canvas中坐标表示的方式是非常不一样的，左上角是起点，向右是x
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);  //前两个表示左下角（起点）坐标
            }
        }
    }
}