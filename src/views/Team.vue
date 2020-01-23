<template>
    <div>
        <el-button type="primary" @click="newTeamDialogVisible = true">添加队伍</el-button>
        <el-table :data="teamList" style="width: 100%" stripe>
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column prop="Name" label="队伍名"/>
            <el-table-column prop="Score" label="分数"/>
            <el-table-column prop="SecretKey" label="Token"/>
            <el-table-column prop="CreatedAt" label="创建时间"/>
            <el-table-column prop="UpdatedAt" label="更新时间"/>
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
                                           :on-success="(response, file, fileList) => uploadSuccess(response, index)">
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

    </div>
</template>

<script>
    export default {
        name: "Team",
        data() {
            return {
                teamList: [],
                newTeamDialogVisible: false,
                editTeamDialogVisible: false,

                token: localStorage.getItem('token'),

                newTeamForm: [{
                    Name: '',
                    Logo: '',
                }],
            }
        },

        mounted() {
            this.getTeams()
        },

        methods: {
            getTeams() {
                this.utils.GET("/manager/teams").then(res => {
                    this.teamList = res
                }).catch(err => this.$message.error(err))
            },

            uploadSuccess(response, index) {
                this.newTeamForm[index].Logo = response.data
            },

            onNewTeams() {
                this.utils.POST('/manager/teams', this.newTeamForm).then(res => {
                    this.newTeamDialogVisible = false
                    const h = this.$createElement;
                    var password = [h('p', null, '请保存队伍密码')]
                    res.forEach(item => {
                        password.push(h('p', null, "账号：" + item.Name + "  密码：" + item.Password))
                    })

                    this.$alert(h('p', null, password), '队伍密码', {
                        confirmButtonText: '我已确认保存'
                    });
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