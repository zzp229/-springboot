//这是游戏的基类
const AC_GAME_OBJECTS = [];

export class AcGameObject {     //export出去，因为其它文件引用的时候引用这个类
    constructor() {     //构造函数
        AC_GAME_OBJECTS.push(this);
        this.timedelta = 0; //这一帧和上一帧的时间间隔
        this.has_called_start = false;  //记录有没有执行过
    }

    start() {   //只执行一次
    }

    update() {      //每一帧执行一次，除第一帧

    }

    on_destroy() {  //删除前执行

    }

    destroy() {     //从数组里面删除
        this.on_destroy();      //删除前调用

        for (let i in AC_GAME_OBJECTS) {
            const obj = AC_GAME_OBJECTS[i];     //把当前页面取出来
            if (obj === this) {     //obj等于当前页面就删掉
                AC_GAME_OBJECTS.splice(i);
                break;
            }
        }
    }
}

let last_timestamp; //上一次执行的时刻
//不断地循环
const step = timestamp => {     //传入当前函数执行的时刻
    for (let obj of AC_GAME_OBJECTS) {
        if (!obj.has_called_start) {    //没有执行过就执行(start只执行一次)
            obj.has_called_start = true;
            obj.start();
        } else {
            obj.timedelta = timestamp - last_timestamp;  //计算这次和上一次的时间间隔
            obj.update();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(step)     //自己调用自己
}

requestAnimationFrame (step)    //下一次浏览器渲染前执行一遍