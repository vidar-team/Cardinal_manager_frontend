<template>
    <div>
        <el-row :gutter="12">
            <el-col :span="14">
                <el-card shadow="always" v-loading="loadingLog">
                    <div slot="header" class="clearfix">
                        <span v-if="time !== null">
                            <span v-if="time.Status === 'wait'">
                                <b>{{$t('panel.not_begin')}}</b>
                            </span>
                            <span v-if="time.Status === 'on'"
                                  v-html="$t('panel.til_round_end', { round: time.NowRound, minute: minute, second: second})">
                            </span>
                            <span v-if="time.Status === 'pause'">
                                <b>{{$t('panel.pause')}}</b>
                            </span>
                            <span v-if="time.Status === 'end'">
                                <b>{{$t('panel.end')}}</b>
                            </span>
                        </span>

                        <!-- Debug info -->
                        <el-popover
                                style="float: right;"
                                placement="bottom"
                                title=""
                                width="300"
                                trigger="click">
                            <p>{{$t('panel.previous_round_zero_title')}}{{ panel.PreviousRoundScore}}
                                <el-tag size="mini" type="success" v-if="panel.PreviousRoundScore <= 0">
                                    {{$t('panel.ok')}}
                                </el-tag>
                                <el-tag size="mini" type="danger" v-else>{{$t('panel.zero_alert')}}</el-tag>
                            </p>
                            <p>{{$t('panel.total_zero_title')}}{{ panel.TotalScore }}
                                <el-tag size="mini" type="success" v-if="panel.TotalScore <= 0">{{$t('panel.ok')}}
                                </el-tag>
                                <el-tag size="mini" type="danger" v-else>{{$t('panel.zero_alert')}}</el-tag>
                            </p>
                            <el-button slot="reference" size="mini">{{$t('panel.debug_info')}}</el-button>
                        </el-popover>
                        <el-progress v-if="time !== null"
                                     :text-inside="true"
                                     :stroke-width="17"
                                     :percentage="progressPercent"></el-progress>
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
                        <el-table-column prop="TeamName" :label="$t('panel.team')"></el-table-column>
                        <el-table-column prop="Score" :label="$t('panel.score')"
                                         :formatter="(row) => utils.FormatFloat(row.Score)"></el-table-column>
                        <el-table-column v-for="(header, index) in rankHeader" v-bind:key="index" :label="header">
                            <template scope="scope">
                                 <span :score="utils.FormatFloat(scope.row.GameBoxStatus[index].Score)"
                                       :class="statusClass(scope.row.GameBoxStatus[index].IsAttacked, scope.row.GameBoxStatus[index].IsDown)">{{utils.FormatFloat(scope.row.GameBoxStatus[index].Score)}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <br>
                    <!--                    <el-button size="mini" @click="exportRank">{{$t('panel.export_rank')}}</el-button>-->
                </el-card>
                <br>
                <el-card>
                    <el-row :gutter="20">
                        <el-col :span="6" class="panel">
                            <p class="panel-data">{{ panel.SubmitFlag }}</p>
                            <span class="panel-text">{{$t('panel.submit_flag_count')}}</span>
                        </el-col>
                        <el-col :span="6" class="panel">
                            <p class="panel-data">{{ panel.CheckDown }}</p>
                            <span class="panel-text">{{$t('panel.checkdown_count')}}</span>
                        </el-col>
                        <el-col :span="6" class="panel">
                            <p class="panel-data">{{ panel.MemAllocated }}</p>
                            <span class="panel-text">{{$t('panel.memory_allocated')}}</span>
                        </el-col>
                        <el-col :span="6" class="panel" style="border-right-width: 0;">
                            <p class="panel-data">{{ panel.NumGoroutine }}</p>
                            <span class="panel-text">{{$t('panel.goroutine_count')}}</span>
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
            },

            // exportRank() {
            //     this.getRank()
            // let content = ''
            //
            // let blob = new Blob([JSON.stringify(res)], {type: 'text/plain'})
            // let downloadElement = document.createElement("a")
            // let href = window.URL.createObjectURL(blob)
            // downloadElement.href = href
            // downloadElement.download = name
            // downloadElement.click()
            // window.URL.revokeObjectURL(href)
            // }

            statusClass(attacked, down) {
                if (attacked && down) {
                    return 'status-double'
                }
                if (attacked) {
                    return 'status-attacked'
                }
                if (down) {
                    return 'status-down'
                }
                return 'status-normal'
            }
        },

        computed: {
            progressPercent() {
                let percent = Number((((new Date().getTime() / 1000) - this.time.BeginTime) / (this.time.EndTime - this.time.BeginTime) * 100).toFixed(2))
                if (percent > 100) {
                    return 100
                }
                return percent
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

    .status-normal {
        color: green;
    }

    .status-down {
        color: orange;
    }

    .status-attacked {
        color: red;
    }

    .status-double {
        color: red;
        font-weight: 900;
    }

    .status-double::before {
        position: absolute;
        height: 30%;
        content: attr(score);
        overflow: hidden;
        color: orange;
        z-index: 999;
    }
</style>