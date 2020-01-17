<template>
    <el-menu :default-active="this.$route.path" mode="horizontal" :router="true" background-color="#323232" text-color="#fff" active-text-color="#2194EC">
        <el-menu-item>HCTF</el-menu-item>
        <el-menu-item index="/">数据大屏</el-menu-item>
        <el-menu-item index="/team">队伍管理</el-menu-item>
        <el-menu-item index="/challenge">题目管理</el-menu-item>
        <el-menu-item index="/gamebox">靶机管理</el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        name: "Header"
    }
</script>

<style scoped>

</style>