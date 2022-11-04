<template>
    <div class="container content-field">     <!--自定义大小的容器-->
        <div class="card">
            <div class="card-body">
                <slot></slot>       <!--填充的内容放到slot里面-->
            </div>
        </div>
    </div>
</template>



<script>
</script>



<style scoped>
div.content-field {
    margin-top: 20px;
}
</style>