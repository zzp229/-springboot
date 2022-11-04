<!-- components的文件要两个大写 -->
<!-- 三部分：html->js->css -->
<!-- Bootstrap-美化 -->
<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">      <!--light可以换成dark-->
  <div class="container">     <!--：-fluid 变宽-->
    <router-link class="navbar-brand" :to="{name: 'home'}">King of Bots</router-link>   <!--用vue自带的标签，不用每点一次就刷新-->
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <!--<router-link class="nav-link" :to="{name: 'pk_index'}">对战</router-link>     没有实现聚焦变亮-->
          <router-link :class="route_name == 'pk_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'pk_index'}">对战</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="route_name == 'record_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'record_index'}">对局列表</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="route_name == 'ranklist_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'ranklist_index'}">排行榜</router-link>
        </li>
      </ul>

      <ul class="navbar-nav">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            ooxx
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDrapdown" >
            <li>
                <router-link class="dropdown-item" :to="{name: 'user_bot_index'}">我的bot</router-link>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">退出</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
//这里是难点
import { useRoute } from 'vue-router';  //从router获取api
import { computed } from 'vue';     //这个函数可以计算

export default {
    setup() {
        const route = useRoute();
        let route_name = computed(() => route.name)     //这是一个函数
        return {
            route_name
        }
    }
}
</script>

<style scoped>      /*防止组件乱掉*/

</style>