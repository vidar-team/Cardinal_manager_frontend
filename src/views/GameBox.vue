<template>
    <div>
        <el-button type="primary" @click="newGameBoxDialogVisible = true">{{$t('gamebox.publish')}}</el-button>
        <el-button type="primary" @click="testSSH" :loading="sshTesting">{{$t('gamebox.test_ssh')}}</el-button>
        <el-table :data="gameBoxList" style="width: 100%" stripe v-loading="gameBoxList === null">
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column prop="ChallengeTitle" :label="$t('gamebox.challenge')"/>
            <el-table-column prop="TeamName" :label="$t('gamebox.team')"/>
            <el-table-column prop="IP" :label="$t('gamebox.ip')"/>
            <el-table-column prop="Port" :label="$t('gamebox.port')"/>
            <el-table-column prop="Score" :label="$t('gamebox.score')"
                             :formatter="(row) => utils.FormatFloat(row.Score)"/>
            <el-table-column prop="Description" :label="$t('gamebox.description')"/>
            <el-table-column prop="IsDown" :label="$t('gamebox.down')">
                <template slot-scope="scope">{{scope.row.IsDown}}</template>
            </el-table-column>
            <el-table-column prop="IsAttacked" :label="$t('gamebox.attacked')">
                <template slot-scope="scope">{{scope.row.IsAttacked}}</template>
            </el-table-column>
            <el-table-column :label="$t('general.create_at')" width="200"
                             :formatter="(row)=>utils.FormatGoTime(row.CreatedAt)"/>
            <el-table-column :label="$t('general.operate')" width="300">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="()=>{editGameBoxForm = JSON.parse(JSON.stringify(scope.row)); editGameBoxDialogVisible = true}">
                        {{$t('general.edit')}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <br>
        <el-pagination style="text-align:center" background layout="prev, pager, next" :total="total" :page-size="per"
                       @current-change="(p)=>{page = p; getGameBoxes()}"></el-pagination>

        <!-- New GameBox -->
        <el-dialog :title="$t('gamebox.publish')" :visible.sync="newGameBoxDialogVisible">
            <el-button type="primary" @click="mutliGameBoxDialogVisible = true">{{$t('gamebox.multi')}}</el-button>
            <el-button @click="newGameBoxForm.push({
                    ChallengeID: null,
                    TeamID: null,
                    IP: '',
                    Port: '',
                    SSHPort: '',
                    SSHUser:'root',
                    SSHPassword: '',
                    Description: ''
                })">{{$t('gamebox.add')}}
            </el-button>
            <el-divider/>
            <div v-for="(item, index) in newGameBoxForm" v-bind:key="index">
                <el-row :gutter="20">
                    <el-form :model="item" label-width="130px">
                        <el-button type="danger" icon="el-icon-delete" circle @click="newGameBoxForm.splice(index, 1)"/>
                        <el-col :span="10">
                            <el-form-item :label="$t('gamebox.challenge')">
                                <el-select v-model="item.ChallengeID"
                                           :placeholder="$t('gamebox.challenge_placeholder')">
                                    <el-option
                                            v-for="challenge in challenges"
                                            :key="challenge.ID"
                                            :label="challenge.Title"
                                            :value="challenge.ID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item :label="$t('gamebox.team')">
                                <el-select v-model="item.TeamID" :placeholder="$t('gamebox.team_placeholder')">
                                    <el-option
                                            v-for="team in teams"
                                            :key="team.ID"
                                            :label="team.Name"
                                            :value="team.ID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item :label="$t('gamebox.ip')">
                                <el-input v-model="item.IP" :placeholder="$t('gamebox.ip_placeholder')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item :label="$t('gamebox.port')">
                                <el-input v-model="item.Port" :placeholder="$t('gamebox.port_placeholder')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item :label="$t('gamebox.description')">
                                <el-input type="textarea" :rows="3" :placeholder="$t('gamebox.description_placeholder')"
                                          v-model="item.Description">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item :label="$t('gamebox.ssh_port')">
                                <el-input v-model="item.SSHPort"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item :label="$t('gamebox.ssh_user')">
                                <el-input v-model="item.SSHUser"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item :label="$t('gamebox.ssh_password')">
                                <el-input v-model="item.SSHPassword"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-divider></el-divider>
                        </el-col>
                    </el-form>
                </el-row>

            </div>
            <el-button type="primary" @click="onNewGameBox">{{$t('gamebox.publish')}}</el-button>
        </el-dialog>

        <!-- Multi -->
        <el-dialog :title="$t('gamebox.multi')" :visible.sync="mutliGameBoxDialogVisible">
            <span>
                {{$t('gamebox.format')}}
                <code>[{
                    "ChallengeID": 1,
                    "TeamID": 1,
                    "IP": "",
                    "Port": "",
                    "SSHPort": "",
                    "SSHUser": "",
                    "SSHPassword": "",
                    "Description": ""
                }]</code>
            </span>
            <el-form>
                <el-form-item :label="$t('gamebox.json_string')">
                    <el-input type="textarea" v-model="mutliGameBoxJSON"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="mutliGameBoxDialogVisible = false">{{$t('general.cancel')}}</el-button>
                <el-button type="primary" @click="mutliGameBox">{{$t('general.apply')}}</el-button>
            </div>
        </el-dialog>

        <!-- Edit -->
        <el-dialog :title="$t('gamebox.edit')" :visible.sync="editGameBoxDialogVisible">
            <el-form label-width="120px">
                <el-form-item :label="$t('gamebox.challenge')">
                    {{editGameBoxForm.ChallengeTitle}}
                </el-form-item>
                <el-form-item :label="$t('gamebox.team')">
                    {{editGameBoxForm.TeamName}}
                </el-form-item>
                <el-form-item :label="$t('gamebox.ip')">
                    <el-input v-model="editGameBoxForm.IP"
                              :placeholder="$t('gamebox.ip_placeholder')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('gamebox.port')">
                    <el-input v-model="editGameBoxForm.Port"
                              :placeholder="$t('gamebox.port_placeholder')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('gamebox.description')">
                    <el-input type="textarea" :rows="3" :placeholder="$t('gamebox.description_placeholder')"
                              v-model="editGameBoxForm.Description">
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('gamebox.ssh_port')">
                    <el-input v-model="editGameBoxForm.SSHPort"></el-input>
                </el-form-item>
                <el-form-item :label="$t('gamebox.ssh_user')">
                    <el-input v-model="editGameBoxForm.SSHUser"></el-input>
                </el-form-item>
                <el-form-item :label="$t('gamebox.ssh_password')">
                    <el-input v-model="editGameBoxForm.SSHPassword"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="onEditGameBox">{{$t('gamebox.edit')}}</el-button>
        </el-dialog>

        <!-- SSH -->
        <el-dialog :title="$t('gamebox.test_ssh_fail')" :visible.sync="sshFailDialogVisible">
            <div v-html="sshFailContent"></div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="sshFailDialogVisible = false">{{$t('general.apply')}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "GameBox",
        data: () => ({
            newGameBoxDialogVisible: false,
            editGameBoxDialogVisible: false,
            mutliGameBoxDialogVisible: false,
            sshFailDialogVisible: false,
            sshTesting: false,

            gameBoxList: null,
            teams: [],
            challenges: [],

            newGameBoxForm: [],
            editGameBoxForm: {
                ChallengeTitle: '',
                TeamName: '',
                IP: '',
                Port: '',
                SSHPort: '',
                SSHUser: '',
                SSHPassword: '',
                Description: ''
            },

            mutliGameBoxJSON: '',
            sshFailContent: '',

            page: 1,
            per: 10,

            total: 0,
        }),
        async mounted() {
            await this.getTeams()
            await this.getChallenges()
            await this.getGameBoxes()
        },
        methods: {
            getGameBoxes() {
                return new Promise((resolve) => {
                    this.utils.GET(`/manager/gameboxes?page=${this.page}&per=${this.per}`).then(res => {
                        let gameBox = res.Data
                        gameBox.forEach((value, index) => {
                            gameBox[index]['ChallengeTitle'] = this.getChallengeByID(value.ChallengeID)['Title']
                            gameBox[index]['TeamName'] = this.getTeamByID(value.TeamID)['Name']
                        })
                        this.gameBoxList = gameBox
                        this.total = res.Total
                        resolve()
                    }).catch(err => {
                        this.$message.error(err);
                        resolve()
                    })
                })
            },

            getTeams() {
                return new Promise((resolve) => {
                    this.utils.GET("/manager/teams").then(res => {
                        this.teams = res
                        resolve()
                    }).catch(err => {
                        this.$message.error(err);
                        resolve()
                    })
                })
            },

            async getChallenges() {
                return new Promise((resolve) => {
                    this.utils.GET("/manager/challenges").then(res => {
                        this.challenges = res
                        resolve()
                    }).catch(err => {
                        this.$message.error(err);
                        resolve()
                    })
                })
            },

            mutliGameBox() {
                let backup = JSON.parse(JSON.stringify(this.newGameBoxForm))
                try {
                    let gameBoxes = JSON.parse(this.mutliGameBoxJSON)
                    gameBoxes.forEach((value) => {
                        this.newGameBoxForm.push({
                            ChallengeID: value.ChallengeID,
                            TeamID: value.TeamID,
                            IP: value.IP,
                            Port: value.Port,
                            SSHPort: value.SSHPort !== undefined ? value.SSHPort : '',
                            SSHUser: value.SSHUser !== undefined ? value.SSHUser : '',
                            SSHPassword: value.SSHPassword !== undefined ? value.SSHPassword : '',
                            Description: value.Description
                        })
                    })
                    this.mutliGameBoxDialogVisible = false
                    this.mutliGameBoxJSON = ''
                } catch (e) {
                    this.$message.error(this.$i18n.t('gamebox.json_parse_error'))
                    this.newGameBoxForm = backup
                }
            },

            onNewGameBox() {
                this.utils.POST('/manager/gameboxes', this.newGameBoxForm).then(res => {
                    this.newGameBoxDialogVisible = false
                    this.getGameBoxes()
                    // Clean form
                    this.newGameBoxForm = []
                    this.$message({message: res, type: 'success'})
                }).catch(err => this.$message.error(err))
            },

            onEditGameBox() {
                this.utils.PUT('/manager/gamebox', this.editGameBoxForm).then(res => {
                    this.editGameBoxDialogVisible = false
                    this.getGameBoxes()
                    this.$message.success(res)
                }).catch(err => this.$message.error(err))
            },

            getChallengeByID(id) {
                let result = null;
                this.challenges.forEach((value) => {
                    if (value.ID === id) {
                        result = value
                    }
                })
                return result
            },

            getTeamByID(id) {
                let result = null;
                this.teams.forEach((value) => {
                    if (value.ID === id) {
                        result = value
                    }
                })
                return result
            },

            testSSH() {
                this.sshTesting = true
                this.utils.GET("/manager/gameboxes/sshTest").then(res => {
                    this.sshTesting = false
                    if (res === null) {
                        return this.$message.success(this.$i18n.t("gamebox.test_ssh_success"))
                    }

                    this.sshFailContent = ''
                    res.forEach(item => {
                        this.sshFailContent += `<strong>TeamID：</strong>${item.TeamID}<br><strong>ChallengeID：</strong>${item.ChallengeID}<br><strong>GameBoxID：</strong>${item.GameBoxID}<br><strong>Error：</strong>${item.Error}<hr>`
                    })
                    this.sshFailDialogVisible = true
                })
            }
        }
    }
</script>

<style scoped>

</style>