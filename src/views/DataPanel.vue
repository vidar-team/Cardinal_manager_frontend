<template>
    <div>
        <el-row :gutter="12">
            <el-col :span="14">
                <el-card shadow="always" v-loading="loadingLog">
                    <div slot="header" class="clearfix">
                        <span>系统日志</span>
                    </div>
                    <div class="system-log">
                        <div v-for="(log, index) in logs" v-bind:key="index">
                            <div class="system-log-body">
                                <span class="system-log-time">[{{ utils.FormatGoTime(log.CreatedAt) }}]</span>
                                <span :class="'system-log-'+['normal', 'warning', 'important'][log.Level]">
                                    [{{['NORMAL', 'WARNING', 'IMPORTANT'][log.Level]}}]
                                </span>
                                <span class="system-log-message">{{ log.Content }}</span>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="10">
                <el-card shadow="always">
                    数据
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "DataPanel",

        data: () => ({
            timer: null,
            loadingLog: false,

            startID: 0,
            logs: [],
        }),

        mounted() {
            this.getLogs()
            this.timer = setInterval(this.getLogs, 5000)
        },

        beforeDestroy() {
            clearInterval(this.timer)
        },

        methods: {
            getLogs() {
                this.loadingLog = true
                this.utils.GET('/manager/logs').then(res => {
                    this.logs = res
                    this.loadingLog = false
                }).catch(err => this.$message({message: err, type: 'error'}))
            }
        }
    }
</script>

<style scoped>
    .system-log {
        font-family: Consolas, "Noto Sans CJK SC Regular", "Microsoft YaHei UI Light",
        monospace;
    }

    .system-log-time {
        color: #aaa;
    }
    .system-log-normal {
        color: #aaa;
    }
    .system-log-warning{
        color: orange;
    }
    .system-log-important {
        color: red;
    }
</style>