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
                    <el-table
                            :data="rank"
                            stripe
                            style="width: 100%"
                            height="530"
                            max-height="530"
                            size="small">
                        <el-table-column
                                type="index"
                                label="#"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                prop="TeamName"
                                label="队伍名"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="Score"
                                label="分数">
                        </el-table-column>
                        <el-table-column v-for="(header, index) in rankHeader" v-bind:key="index" :label="header">
                            <template scope="scope">
                                {{scope.row.GameBoxStatus[index].Score}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <br>
                <el-card>
                    <el-row :gutter="20">
                        <el-col :span="6" class="panel">
                            <p class="panel-data">{{ panel.SubmitFlag }}</p>
                            <span class="panel-text">正确提交 Flag</span>
                        </el-col>
                        <el-col :span="6" class="panel">
                            <p class="panel-data">{{ panel.CheckDown }}</p>
                            <span class="panel-text">CheckDown 次数</span>
                        </el-col>
                        <el-col :span="6" class="panel">
                            <p class="panel-data">{{ panel.MemAllocated }}</p>
                            <span class="panel-text">占用内存</span>
                        </el-col>
                        <el-col :span="6" class="panel" style="border-right-width: 0;">
                            <p class="panel-data">{{ panel.NumGoroutine }}</p>
                            <span class="panel-text">Goroutine 数</span>
                        </el-col>
                    </el-row>
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
            rank: [],
            rankHeader: [],
            panel: {},
        }),

        mounted() {
            this.loop()
            this.timer = setInterval(() => {
                this.loop()
            }, 5000)
        },

        beforeDestroy() {
            clearInterval(this.timer)
        },

        methods: {
            loop() {
                this.getLogs()
                this.getRank()
                this.getPanel()
            },
            getLogs() {
                this.loadingLog = true
                this.utils.GET('/manager/logs').then(res => {
                    this.logs = res
                    this.loadingLog = false
                }).catch(err => this.$message({message: err, type: 'error'}))
            },

            getRank() {
                this.utils.GET('/manager/rank').then(res => {
                    this.rank = res.Rank
                    this.rankHeader = res.Title
                }).catch(err => this.$message({message: err, type: 'error'}))
            },

            getPanel() {
                this.utils.GET('/manager/panel').then(res => {
                    this.panel = res
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

    .system-log-warning {
        color: orange;
    }

    .system-log-important {
        color: red;
    }

    .panel {
        border: 0 solid #bbbbbb;
        border-right-width: 1px;
        text-align: center;
    }

    .panel-data {
        text-align: center;
        font-size: 30px;
        color: #409EFF;
    }

    .panel-text {
        text-align: center;
        color: #3f3f3f;
        font-size: 15px;
    }
</style>