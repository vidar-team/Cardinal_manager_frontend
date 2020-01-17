<template>
    <div id="app">
        <el-container>
            <el-header style="padding: 0;">
                <Header/>
            </el-header>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import Header from "./components/Header";

    export default {
        name: 'app',
        components: {
            Header
        }
    }
</script>

<style>
    body {
        margin: 0px;
    }
</style>
