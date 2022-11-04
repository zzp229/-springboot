<template>
    <div ref="parent" class="gamemap">  <!--ref产生关联-->
        <!--搜索mdn，可以有canvas的用法,还可以搜很多前端标签-->
        <canvas ref="canvas"></canvas>   <!--创建画布，游戏写到画布里面-->
    </div>
</template>

<script>

import { GameMap } from '@/assets/scripts/GameMap';      //把创建的游戏对象引入
import { ref, onMounted } from 'vue'   //要创建游戏对象先把canvas引入进来, onMounted是挂栽完需要执行哪些操作

export default {
    setup() {
        let parent = ref(null); //vue里面定义变量要ref
        let canvas = ref(null);

        //onMounted是挂栽完需要执行哪些操作
        onMounted(() => {
            //创建对象
            new GameMap(canvas.value.getContext('2d'), parent.value)    //在vue取变量值要.value
        });

        return {
            parent, //这样设置好后才能在template里面用
            canvas
        }
    }
}

</script>

<style scoped>
div.gamemap {
    width: 100%;    /*设置和父元素等长*/
    height: 100%;
    display: flex;  /*居中*/
    justify-content: center;    /*水平居中*/
    align-items: center;    /*竖直居中*/
}
</style>
