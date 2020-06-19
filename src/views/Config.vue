<template>
    <div>
        <el-form label-width="80px">
            <el-form-item :label="$t('config.title')">
                <el-input v-model="config.Title"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveConfig">保存配置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Config",
        data() {
            return {
                config: {},
            }
        },
        mounted() {
            this.getConfig()
        },
        methods: {
            getConfig() {
                this.utils.GET('/manager/config').then(res => {
                    this.config = res
                }).catch(err => this.$message.error(err))
            },
            saveConfig() {
                this.utils.PUT('/manager/config', this.config).then(res => {
                    this.$message.success(res)
                }).catch(err => this.$message.error(err))
            }
        }
    }
</script>

<style scoped>

</style>