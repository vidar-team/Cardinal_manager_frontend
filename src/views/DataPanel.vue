<template>
    <div>
        <el-row :gutter="12">
            <el-col :span="14">
                <el-card shadow="always" v-loading="loadingLog">
                    <div slot="header" class="clearfix">
                        <span v-if="time !== null">
                            <span v-if="time.Status === 'wait'">
                                <b>比赛未开始</b>
                            </span>
                            <span v-if="time.Status === 'on'">
                                距离第 <b>{{time.NowRound}}</b> 轮结束还有
                                <b>{{minute}} 分 {{second}} 秒</b>
                            </span>
                            <span v-if="time.Status === 'pause'">
                                <b>比赛已暂停</b>
                            </span>
                            <span v-if="time.Status === 'end'">
                                <b>比赛已结束</b>
                            </span>
                        </span>

                        <!-- Debug info -->
                        <el-popover
                                style="float: right;"
                                placement="bottom"
                                title=""
                                width="300"
                                trigger="click">
                            <p>上一轮分数零和：{{ panel.PreviousRoundScore}}
                                <el-tag size="mini" type="success" v-if="panel.PreviousRoundScore <= 0">正常</el-tag>
                                <el-tag size="mini" type="danger" v-else>非零和，请检查！</el-tag>
                            </p>
                            <p>总轮数分数零和：{{ panel.TotalScore }}
                                <el-tag size="mini" type="success" v-if="panel.TotalScore <= 0">正常</el-tag>
                                <el-tag size="mini" type="danger" v-else>非零和，请检查！</el-tag>
                            </p>
                            <el-button slot="reference" size="mini">调试信息</el-button>
                        </el-popover>
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
                    <el-table :data="rank" stripe style="width: 100%" height="530" max-height="530" size="small">
                        <el-table-column type="index" label="#" width="50"></el-table-column>
                        <el-table-column prop="TeamName" label="队伍名"></el-table-column>
                        <el-table-column prop="Score" label="分数"
                                         :formatter="(row) => utils.FormatFloat(row.Score)"></el-table-column>
                        <el-table-column v-for="(header, index) in rankHeader" v-bind:key="index" :label="header">
                            <template scope="scope">
                                {{utils.FormatFloat(scope.row.GameBoxStatus[index].Score)}}
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
            tickTimer: null,
            loadingLog: false,

            time: null,
            minute: 0,
            second: 0,

            logs: [],
            rank: [],
            rankHeader: [],
            panel: {},
        }),

        mounted() {
            this.loop()

            this.timer = setInterval(this.loop, 5000)

            this.tickTimer = setInterval(() => {
                if (this.time !== null) {
                    if (this.time['RoundRemainTime']-- <= 0) {
                        this.time.RoundRemainTime = this.time.Duration * 60
                        this.time.NowRound++
                    }
                    this.minute = Math.floor(this.time.RoundRemainTime / 60)
                    this.second = this.time.RoundRemainTime - this.minute * 60
                }
            }, 1000)
        },

        beforeDestroy() {
            clearInterval(this.timer)
            clearInterval(this.tickTimer)
        },

        methods: {
            loop() {
                this.getTime()
                this.getLogs()
                this.getRank()
                this.getPanel()
            },

            getTime() {
                this.utils.GET('/time').then(res => {
                    this.time = res
                }).catch(err => this.$message({message: err, type: 'error'}))
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