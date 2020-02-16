<template>
    <div>
        <el-button type="primary" @click="newTeamDialogVisible = true">添加队伍</el-button>
        <el-table :data="teamList" style="width: 100%" stripe>
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column width="80" prop="Logo" label="Logo">
                <template slot-scope="scope">
                    <el-image style="width: 50px; height: 50px" :src="utils.baseURL + '/uploads/' + scope.row.Logo"
                              fit="fill"/>
                </template>
            </el-table-column>

            <el-table-column prop="Name" label="队伍名"/>
            <el-table-column prop="Score" label="分数"/>
            <el-table-column width="300" prop="SecretKey" label="Token"/>
            <el-table-column prop="CreatedAt" label="创建时间"/>
            <el-table-column prop="UpdatedAt" label="更新时间"/>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="()=>{editTeamForm = JSON.parse(JSON.stringify(scope.row)); editTeamDialogVisible = true}">
                        编辑
                    </el-button>

                    <el-popconfirm
                            confirmButtonText='确定删除'
                            cancelButtonText='取消'
                            icon="el-icon-info"
                            iconColor="red"
                            title="您确定删除这支队伍吗？"
                            @onConfirm="handleDelete(scope.row)"
                    >
                        <el-button size="mini" type="danger" slot="reference">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加队伍 -->
        <el-dialog title="添加队伍" :visible.sync="newTeamDialogVisible">
            <el-button @click="newTeamForm.push({Name: '',Logo: ''})">新增队伍</el-button>
            <el-divider/>
            <div v-for="(item, index) in newTeamForm" v-bind:key="index">
                <el-row :gutter="20">
                    <el-form :model="item" label-width="80px">
                        <el-button type="danger" icon="el-icon-delete" circle @click="newTeamForm.splice(index, 1)"/>
                        <el-col :span="10">
                            <el-form-item label="队伍名">
                                <el-input v-model="item.Name"/>
                                <el-input v-model="item.Logo" size="mini" placeholder="图片 URL"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="队伍 Logo">
                                <el-upload name="picture" :action="utils.baseURL + '/manager/uploadPicture'"
                                           :headers="{'Authorization': token}"
                                           :on-success="(response) => {newTeamForm[index].Logo = response.data}">
                                    <el-button size="small" type="primary">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传 jpg/png/gif 文件</div>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>
            <el-button type="primary" @click="onNewTeams">添加队伍</el-button>
        </el-dialog>

        <!-- 修改队伍 -->
        <el-dialog title="修改队伍" :visible.sync="editTeamDialogVisible">
            <el-form label-width="80px">
                <el-form-item label="队伍名">
                    <el-input v-model="editTeamForm.Name"/>
                    <el-input v-model="editTeamForm.Logo" size="mini" placeholder="图片 URL"/>
                </el-form-item>
                <el-form-item label="队伍 Logo">
                    <el-upload name="picture" :action="utils.baseURL + '/manager/uploadPicture'"
                               :headers="{'Authorization': token}"
                               :on-success="(response) => {editTeamForm.Logo = response.data}">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传 jpg/png/gif 文件</div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onEditTeam">修改队伍</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Team",
        data: () => ({
            teamList: [],
            newTeamDialogVisible: false,
            editTeamDialogVisible: false,

            token: localStorage.getItem('token'),

            newTeamForm: [{
                Name: '',
                Logo: '',
            }],

            editTeamForm: {
                Name: '',
                Logo: '',
            }
        }),

        mounted() {
            this.getTeams()
        },

        methods: {
            getTeams() {
                this.utils.GET("/manager/teams").then(res => {
                    this.teamList = res
                }).catch(err => this.$message.error(err))
            },

            onNewTeams() {
                this.utils.POST('/manager/teams', this.newTeamForm).then(res => {
                    this.newTeamDialogVisible = false
                    this.getTeams()
                    const h = this.$createElement;
                    var password = [h('p', null, '请保存队伍密码')]
                    res.forEach(item => {
                        password.push(h('p', null, "账号：" + item.Name + "  密码：" + item.Password))
                    })

                    this.$alert(h('p', null, password), '队伍密码', {
                        confirmButtonText: '我已确认保存'
                    });
                }).catch(err => this.$message({message: err, type: 'error'}))
            },

            onEditTeam() {
                this.utils.PUT('/manager/team', this.editTeamForm).then(res => {
                    this.editTeamDialogVisible = false
                    this.getTeams()
                    this.$message.success(res)
                }).catch(err => this.$message({message: err, type: 'error'}))
            },

            handleDelete(row) {
                this.utils.DELETE("/manager/team?id=" + row.ID).then(res => {
                    this.$message({
                        message: res,
                        type: 'success'
                    });
                    this.getTeams()
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            }
        },
    }
</script>

<style scoped>

</style>