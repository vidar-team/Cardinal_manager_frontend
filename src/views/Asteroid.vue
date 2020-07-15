<template>
    <div>
        <el-collapse :value="['1']">
            <el-collapse-item title="Asteroid" name="1">
                <div>{{$t('asteroid.intro')}}</div>
                <div>
                    <el-link type="primary" href="https://cardinal.ink/asteroid/" target="_blank">
                        {{$t('asteroid.docs')}}
                    </el-link>&nbsp;&nbsp;
                    <el-link type="primary" href="https://github.com/wuhan005/Asteroid" target="_blank">
                        {{$t('asteroid.github')}}
                    </el-link>
                </div>
            </el-collapse-item>
        </el-collapse>
        <br>
        <el-button type="primary" @click="setRank">{{$t('asteroid.refresh_rank')}}</el-button>
        <el-button type="primary" @click="clearAll">{{$t('asteroid.clean_all_status')}}</el-button>
        <el-button @click="easterEgg">{{$t('asteroid.send_easter_egg')}}</el-button>
        <br>
        <br>
        <el-alert
                :title="`Unity3D URL: ${baseURL}`"
                type="info"
                :closable="false">
        </el-alert>
        <br>
        <span><b>{{$t('asteroid.attack')}}</b></span>
        <el-form :inline="true" label-width="80px">
            <el-form-item :label="$t('asteroid.attacker')">
                <el-select v-model="attackForm.From" :placeholder="$t('asteroid.select')">
                    <el-option
                            v-for="team in teams"
                            :key="team.ID"
                            :label="team.Name"
                            :value="team.ID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('asteroid.attacked')">
                <el-select v-model="attackForm.To" :placeholder="$t('asteroid.select')">
                    <el-option
                            v-for="team in teams"
                            :key="team.ID"
                            :label="team.Name"
                            :value="team.ID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="attack">{{$t('asteroid.send')}}</el-button>
            </el-form-item>
        </el-form>
        <span><b>{{$t('asteroid.set_status')}}</b></span>
        <el-form :inline="true" label-width="80px">
            <el-form-item :label="$t('asteroid.team')">
                <el-select v-model="statusForm.Id" :placeholder="$t('asteroid.select')">
                    <el-option
                            v-for="team in teams"
                            :key="team.ID"
                            :label="team.Name"
                            :value="team.ID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('asteroid.status')">
                <el-select v-model="statusForm.Status" :placeholder="$t('asteroid.select')">
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
                <el-button type="primary" @click="status">{{$t('asteroid.send')}}</el-button>
            </el-form-item>
        </el-form>
        <span><b>{{$t('asteroid.clean_status')}}</b></span>
        <el-form :inline="true" label-width="80px">
            <el-form-item :label="$t('asteroid.team')">
                <el-select v-model="clearForm.Id" :placeholder="$t('asteroid.select')">
                    <el-option
                            v-for="team in teams"
                            :key="team.ID"
                            :label="team.Name"
                            :value="team.ID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="clear">{{$t('asteroid.send')}}</el-button>
            </el-form-item>
        </el-form>
        <span><b>{{$t('asteroid.set_round')}}</b></span>
        <el-form :inline="true" label-width="80px">
            <el-form-item :label="$t('asteroid.round')">
                <el-input-number v-model="roundForm.Round" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="round">{{$t('asteroid.send')}}</el-button>
            </el-form-item>
        </el-form>
        <span><b>{{$t('asteroid.set_time')}}</b></span>
        <el-form :inline="true" label-width="80px">
            <el-form-item :label="$t('asteroid.time')">
                <el-input-number v-model="timeForm.Time" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="time">{{$t('asteroid.send')}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Asteroid",
        data: () => ({
            baseURL: `ws://${location.host}/api/asteroid`,
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
            // this.getStatus()
        },
        methods: {
            // getStatus() {
            //     this.utils.GET('/manager/asteroid/status').then(res => {
            //         console.log(res)
            //     }).catch(err => {
            //         this.$message.error(err);
            //     })
            // },

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