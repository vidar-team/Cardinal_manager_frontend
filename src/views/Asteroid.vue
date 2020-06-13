<template>
    <div>
        <el-collapse :value="['1']">
            <el-collapse-item title="Asteroid" name="1">
                <div>Asteroid 是使用 Unity3D 开发的一款 AWD 3D 实时大屏，后端已与 Cardinal 平台深度整合。</div>
                <div>
                    <el-link type="primary" href="https://cardinal.ink/asteroid/" target="_blank">使用文档</el-link>&nbsp;&nbsp;
                    <el-link type="primary" href="https://github.com/wuhan005/Asteroid" target="_blank">GitHub 链接
                    </el-link>
                </div>
            </el-collapse-item>
        </el-collapse>
        <br>
        <el-button type="primary" @click="setRank">刷新队伍信息</el-button>
        <el-button type="primary" @click="clearAll">清除所有队伍状态</el-button>
        <el-button @click="easterEgg">发送陨石彩蛋</el-button>
        <br>
        <br>
        <el-alert
                :title="`Unity3D URL: ${baseURL}`"
                type="info"
                :closable="false">
        </el-alert>
        <br>
        <span><b>攻击</b></span>
        <el-form :inline="true" label-width="80px">
            <el-form-item label="攻击方">
                <el-select v-model="attackForm.From" placeholder="请选择">
                    <el-option
                            v-for="team in teams"
                            :key="team.ID"
                            :label="team.Name"
                            :value="team.ID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="被攻击方">
                <el-select v-model="attackForm.To" placeholder="请选择">
                    <el-option
                            v-for="team in teams"
                            :key="team.ID"
                            :label="team.Name"
                            :value="team.ID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="attack">发送</el-button>
            </el-form-item>
        </el-form>
        <span><b>设置状态</b></span>
        <el-form :inline="true" label-width="80px">
            <el-form-item label="队伍">
                <el-select v-model="statusForm.Id" placeholder="请选择">
                    <el-option
                            v-for="team in teams"
                            :key="team.ID"
                            :label="team.Name"
                            :value="team.ID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="statusForm.Status" placeholder="请选择">
                    <el-option
                            key="down"
                            label="Check Down"
                            value="down">
                    </el-option>
                    <el-option
                            key="attacked"
                            label="Attacked"
                            value="attacked">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="status">发送</el-button>
            </el-form-item>
        </el-form>
        <span><b>清除队伍状态</b></span>
        <el-form :inline="true" label-width="80px">
            <el-form-item label="队伍">
                <el-select v-model="clearForm.Id" placeholder="请选择">
                    <el-option
                            v-for="team in teams"
                            :key="team.ID"
                            :label="team.Name"
                            :value="team.ID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="clear">发送</el-button>
            </el-form-item>
        </el-form>
        <span><b>设置轮数</b></span>
        <el-form :inline="true" label-width="80px">
            <el-form-item label="轮数">
                <el-input-number v-model="roundForm.Round" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="round">发送</el-button>
            </el-form-item>
        </el-form>
        <span><b>设置剩余时间</b></span>
        <el-form :inline="true" label-width="80px">
            <el-form-item label="剩余时间">
                <el-input-number v-model="timeForm.Time" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="time">发送</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Asteroid",
        data: () => ({
            baseURL: `ws://${location.host}/asteroid`,
            teams: [],

            attackForm: {
                From: null,
                To: null,
            },

            statusForm: {
                Id: null,
                Status: null,
            },

            clearForm: {
                Id: null
            },

            roundForm: {
                Round: null,
            },

            timeForm: {
                Time: null,
            }
        }),

        mounted() {
            this.getTeams()
            this.getTime()
        },
        methods: {
            setRank() {
                this.utils.POST('/manager/asteroid/rank').then(res => {
                    this.$message.success(res)
                }).catch(err => {
                    this.$message.error(err);
                })
            },

            clearAll() {
                this.utils.POST('/manager/asteroid/clearAll').then(res => {
                    this.$message.success(res)
                }).catch(err => {
                    this.$message.error(err);
                })
            },

            easterEgg() {
                this.utils.POST('/manager/asteroid/easterEgg').then(res => {
                    this.$message.success(res)
                }).catch(err => {
                    this.$message.error(err);
                })
            },

            attack() {
                this.utils.POST('/manager/asteroid/attack', this.attackForm).then(res => {
                    this.$message.success(res)
                }).catch(err => {
                    this.$message.error(err);
                })
            },

            status() {
                this.utils.POST('/manager/asteroid/status', this.statusForm).then(res => {
                    this.$message.success(res)
                }).catch(err => {
                    this.$message.error(err);
                })
            },

            clear() {
                this.utils.POST('/manager/asteroid/clear', this.clearForm).then(res => {
                    this.$message.success(res)
                }).catch(err => {
                    this.$message.error(err);
                })
            },

            round() {
                this.utils.POST('/manager/asteroid/round', this.roundForm).then(res => {
                    this.$message.success(res)
                }).catch(err => {
                    this.$message.error(err);
                })
            },

            time() {
                this.utils.POST('/manager/asteroid/time', this.timeForm).then(res => {
                    this.$message.success(res)
                }).catch(err => {
                    this.$message.error(err);
                })
            },

            getTeams() {
                this.utils.GET('/manager/teams').then(res => {
                    this.teams = res
                }).catch(err => {
                    this.$message.error(err);
                })
            },

            getTime() {
                this.utils.GET('/time').then(res => {
                    this.roundForm.Round = res.NowRound
                    this.timeForm.Time = res.RoundRemainTime
                }).catch(err => this.$message({message: err, type: 'error'}))
            },

        }
    }
</script>

<style scoped>

</style>