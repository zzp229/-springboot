<template>
  <NavBar />    <!--导航栏-->
  <router-view></router-view>   <!--会自动根据网址来变，对应router这个文件夹（index.js里面来定义）-->
</template>



<script>
import NavBar from './components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"   //bootstrap导入css
import "bootstrap/dist/js/bootstrap"    //bootstrap导入js

export default {
  components: { NavBar },
  component: {
    NavBar
  }
}
</script>



<!--style写css-->
<style>
body {
  /*背景图片*/
  background-image: linear-gradient(  /*实现图变暗文字不会变暗*/
            rgba(135, 129, 129, 0.721),
            rgba(240, 8, 8, 0.6)
          ),
          url("../src/assets/images/background3.svg");  /*这里是背景图片*/  /*@默认是src目录，没有的时候就要从本文件爬到图片位置*/
  background-size: cover;
  height:100vh;     /*让图片拉满整个屏幕 */
}
</style>
