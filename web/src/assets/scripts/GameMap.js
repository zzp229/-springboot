import { AcGameObject } from "./AcGameObject";	//如果导入地对象有default的就不用大括号
import { Snake } from "./Snake";
import { Wall } from "./Wall";

export class GameMap extends AcGameObject { //给别人用，继承AcGameObject
    constructor(ctx, parent) {     //画布的元素，用来动态塑造画布的长宽
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;     //L是地图一个单位的长度

        //定义地图格子数
        this.rows = 13;
        this.cols = 14; //增加1撞车的时候好处理

        this.inner_walls_count = 20;
        this.walls = [];

        this.snakes = [
            new Snake({id: 0, color: "#4876EC", r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: "#F94848", r: 1, c: this.cols - 2 }, this),
        ];

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
                if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) continue;
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)   //不能覆盖左上角和右上角
                    continue;

                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
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

    add_listening_events() {
        this.ctx.canvas.focus();

        const [snake0, snake1] = this.snakes;   //把蛇取出
        this.ctx.canvas.addEventListener("keydown", e => {
            if ( e.key === 'w') snake0.set_direction(0);
            else if (e.key === 'd') snake0.set_direction(1);
            else if (e.key === 's') snake0.set_direction(2);
            else if (e.key === 'a') snake0.set_direction(3);
            else if (e.key === 'ArrowUp') snake1.set_direction(0);
            else if (e.key === 'ArrowRight') snake1.set_direction(1);
            else if (e.key === 'ArrowDown') snake1.set_direction(2);
            else if (e.key === 'ArrowLeft') snake1.set_direction(3);
        })
    }

    //给一千次机会建立墙
    start() { 
        for (let i = 0; i < 1000; i ++ ) 
            if (this.create_walls())
                break;

        this.add_listening_events();
    }

    //每一帧都计算地图的边长
    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows)); //求最大方格长度
        this.ctx.canvas.width = this.L * this.cols; //长和宽
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready() { //判断两条蛇是否都准备好下一回合了
        for (const snake of this.snakes) {
            if (snake.status != "idle") return false;
            if (snake.direction === -1) return false;   //判断相等要三个等号
        }
        return true;
    }

    next_step() {
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    check_valid(cell) { //检测蛇是否能走
        for ( const wall of this.walls ) {  //判断蛇是否撞墙
            if ( wall.r === cell.r && wall.c === cell.c)
                return false;
        }

        for (const snake of this.snakes) {  //判断有没有撞到身体
            let k = snake.cells.length;
            if ( !snake.check_tail_increasing() ) { //蛇为前进就不会撞到
                k --;
            }
            for ( let i = 0; i < k; i ++ ) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c)    //表示撞了
                    return false;
            }
        }
        return true;    //没撞就
    }

    update() {  //每一帧都执行
        this.update_size(); 
        if ( this.check_ready()) {
            this.next_step();
        }
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