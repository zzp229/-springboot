<template>
  <div>
  <div>Bot呢称:{{ bot_name }}</div>  
  <div>Bot战力:{{bot_rating}}</div>
  </div>
  <router-view></router-view>
</template>

<script>
import $ from 'jquery';   //将后端取得回来
import {ref} from 'vue';    //定义呢称

export default {
  name: "App",    //对象
  setup: () => {    //整个函数的入口
    let bot_name = ref("");   //定义变量
    let bot_rating = ref("");

    $.ajax({    //访问后端
      url:"http://127.0.0.1:3000/pk/getbotinfo/",
      type: "get",    //请求
      success: resp => {
        bot_name.value = resp.name;   //给值给到bot_name和bot_rating
        bot_rating.value = resp.rating;
      }
    });

    return {
      bot_name,
      bot_rating
    }
  }
}
</script>

<!--style写css-->
<style>
body {
  background-image: url("@/assets/background3.svg");  /*这里是背景图片*/
  background-size: cover;
}
</style>
