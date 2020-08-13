<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8" :offset="7">
                <el-form label-width="200px">
                    <el-form-item v-for="(c, index) in config" v-bind:key="index" :label="$t(`config.${c.Key}`)">
                        <el-input v-if="c.Kind === 0" v-model="config[index].Value"></el-input>
                        <el-switch v-if="c.Kind === 1" v-model="config[index].Value"></el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveConfig">保存配置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Config",
        data() {
            return {
                config: [],
            }
        },
        mounted() {
            this.getAllConfig()
        },
        methods: {
            getAllConfig() {
                this.utils.GET('/manager/configs').then(res => {
                    this.config = res
                    for (let i = 0; i < this.config.length; i++) {
                        // Convert the string to boolean
                        if (this.config[i].Kind === 1) {
                            this.config[i].Value = this.config[i].Value === 'true'
                        }
                    }
                }).catch(err => this.$message.error(err))
            },
            saveConfig() {
                for (let i = 0; i < this.config.length; i++) {
                    // Convert the boolean to string
                    if (this.config[i].Kind === 1) {
                        this.config[i].Value = this.config[i].Value.toString()
                    }
                }
                this.utils.PUT('/manager/config', this.config).then(res => {
                    this.$message.success(res)
                    this.getAllConfig()
                }).catch(err => this.$message.error(err))
            }
        }
    }
</script>

<style scoped>

</style>