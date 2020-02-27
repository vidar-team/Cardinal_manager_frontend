<template>
    <el-menu :default-active="this.$route.path" mode="horizontal" :router="true" background-color="#323232"
             text-color="#fff" active-text-color="#2194EC">
        <el-menu-item>{{ base.Title }}</el-menu-item>
        <el-menu-item index="/">数据大屏</el-menu-item>
        <el-menu-item index="/team">队伍管理</el-menu-item>
        <el-menu-item index="/challenge">题目管理</el-menu-item>
        <el-menu-item index="/gamebox">靶机管理</el-menu-item>
        <el-menu-item index="/flag">Flag 管理</el-menu-item>
        <el-menu-item index="/bulletin">公告管理</el-menu-item>
        <el-menu-item index="/manager">账号管理</el-menu-item>
        <el-menu-item v-if="$route.name !== 'Login'" index="" @click="onLogout">登出</el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        name: "Header",

        data: () => ({
            base: {
                Title: ''
            },
        }),

        created() {
            this.utils.GET('/base').then(res => {
                this.base = res
            }).catch(err => this.$message.error(err))
        },

        methods: {
            onLogout() {
                this.utils.GET('/manager/logout').then(res => {
                    this.$message.success(res)
                    localStorage.removeItem('token')
                    this.$router.push('/login')
                }).catch(err => this.$message.error(err))
            }
        },
    }
</script>

<style scoped>

</style>