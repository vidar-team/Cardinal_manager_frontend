<template>
    <div>
        <el-button type="primary" @click="newGameBoxDialogVisible = true">添加GameBox</el-button>
        <el-table :data="gameBoxList" style="width: 100%" stripe v-loading="gameBoxList === null">
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column prop="ChallengeTitle" label="题目名"/>
            <el-table-column prop="TeamName" label="所属队伍"/>
            <el-table-column prop="IP" label="IP"/>
            <el-table-column prop="Port" label="端口"/>
            <el-table-column prop="Score" label="分数"/>
            <el-table-column prop="Description" label="题目介绍"/>
            <el-table-column prop="IsDown" label="Down">
                <template slot-scope="scope">{{scope.row.IsDown}}</template>
            </el-table-column>
            <el-table-column prop="IsAttacked" label="被攻陷">
                <template slot-scope="scope">{{scope.row.IsAttacked}}</template>
            </el-table-column>
            <el-table-column label="创建时间" width="200" :formatter="(row)=>utils.FormatGoTime(row.CreatedAt)"/>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="()=>{editGameBoxForm = JSON.parse(JSON.stringify(scope.row)); editGameBoxDialogVisible = true}">
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加 GameBox -->
        <el-dialog title="添加 GameBox" :visible.sync="newGameBoxDialogVisible">
            <el-button type="primary" @click="mutliGameBoxDialogVisible = true">批量添加</el-button>
            <el-button @click="newGameBoxForm.push({
                    ChallengeID: null,
                    TeamID: null,
                    IP: '',
                    Port: '',
                    Description: ''
                })">新增 GameBox
            </el-button>
            <el-divider/>
            <div v-for="(item, index) in newGameBoxForm" v-bind:key="index">
                <el-row :gutter="20">
                    <el-form :model="item" label-width="120px">
                        <el-button type="danger" icon="el-icon-delete" circle @click="newGameBoxForm.splice(index, 1)"/>
                        <el-col :span="10">
                            <el-form-item label="题目 Challenge">
                                <el-select v-model="item.ChallengeID" placeholder="请选择题目">
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
                            <el-form-item label="队伍 Team">
                                <el-select v-model="item.TeamID" placeholder="请选择队伍">
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
                            <el-form-item label="IP">
                                <el-input v-model="item.IP" placeholder="请输入题目 IP"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="Port">
                                <el-input v-model="item.Port" placeholder="请输入题目端口"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="题目描述">
                                <el-input type="textarea" :rows="3" placeholder="请输入题目描述" v-model="item.Description">
                                </el-input>
                            </el-form-item>
                            <el-divider></el-divider>
                        </el-col>
                    </el-form>
                </el-row>

            </div>
            <el-button type="primary" @click="onNewGameBox">添加 GameBox</el-button>
        </el-dialog>

        <!-- 批量添加 -->
        <el-dialog title="批量添加" :visible.sync="mutliGameBoxDialogVisible">
            <span>
                格式
                <code>[{
                    "ChallengeID": 1,
                    "TeamID": 1,
                    "IP": "",
                    "Port": "",
                    "Description": ""
                }]</code>
            </span>
            <el-form>
                <el-form-item label="JSON 字符串">
                    <el-input type="textarea" v-model="mutliGameBoxJSON"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="mutliGameBoxDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="mutliGameBox">确定</el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="修改 GameBox" :visible.sync="editGameBoxDialogVisible">
            <el-form label-width="120px" v-if="editGameBoxDialogVisible">
                <el-col :span="10">
                    <el-form-item label="题目 Challenge">
                        {{editGameBoxForm.ChallengeTitle}}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="队伍 Team">
                        {{editGameBoxForm.TeamName}}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="IP">
                        <el-input v-model="editGameBoxForm.IP" placeholder="请输入题目 IP"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="Port">
                        <el-input v-model="editGameBoxForm.Port" placeholder="请输入题目端口"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="20">
                    <el-form-item label="题目描述">
                        <el-input type="textarea" :rows="3" placeholder="请输入题目描述" v-model="editGameBoxForm.Description">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-form>
            <el-button type="primary" @click="onEditGameBox">修改 GameBox</el-button>
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

            gameBoxList: null,
            teams: [],
            challenges: [],

            newGameBoxForm: [],
            editGameBoxForm: null,

            mutliGameBoxJSON: '',

        }),
        async mounted() {
            await this.getTeams()
            await this.getChallenges()
            await this.getGameBoxes()
        },
        methods: {
            getGameBoxes() {
                return new Promise((resolve) => {
                    this.utils.GET("/manager/gameboxes?page=1&per=15").then(res => {
                        let gameBox = res.Data
                        gameBox.forEach((value, index) => {
                            gameBox[index]['ChallengeTitle'] = this.getChallengeByID(value.ChallengeID)['Title']
                            gameBox[index]['TeamName'] = this.getTeamByID(value.TeamID)['Name']
                        })
                        this.gameBoxList = gameBox
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
                            Description: value.Description
                        })
                    })
                    this.mutliGameBoxDialogVisible = false
                    this.mutliGameBoxJSON = ''
                } catch (e) {
                    this.$message.error('JSON 解析失败！')
                    this.newGameBoxForm = backup
                }
            },

            onNewGameBox() {
                this.utils.POST('/manager/gameboxes', this.newGameBoxForm).then(res => {
                    this.newGameBoxDialogVisible = false
                    this.getGameBoxes()
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
        }
    }
</script>

<style scoped>

</style>