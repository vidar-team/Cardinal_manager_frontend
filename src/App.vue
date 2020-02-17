<template>
    <div id="app">
        <el-container>
            <el-header style="padding: 0;">
                <Header/>
            </el-header>
            <el-main>
                <router-view/>
            </el-main>
            <el-footer>
                <Footer/>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import Header from "./components/Header";
    import Footer from "./components/Footer";

    export default {
        name: 'app',
        components: {
            Footer,
            Header
        }
    }
</script>

<style>
    body {
        margin: 0px;
    }
</style>
