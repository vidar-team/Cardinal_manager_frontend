<template>
    <div>
        <el-button type="primary" @click="newTeamDialogVisible = true">{{$t('team.add')}}</el-button>
        <el-table :data="teamList" style="width: 100%" stripe v-loading="teamList === null">
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column width="80" prop="Logo" :label="$t('team.logo')">
                <template slot-scope="scope">
                    <el-image style="width: 50px; height: 50px" :src="utils.baseURL + '/uploads/' + scope.row.Logo"
                              fit="fill"/>
                </template>
            </el-table-column>

            <el-table-column prop="Name" :label="$t('team.team_name')"/>
            <el-table-column prop="Score" :label="$t('team.score')" :formatter="(row) => utils.FormatFloat(row.Score)"/>
            <el-table-column width="300" prop="SecretKey" label="Token"/>
            <el-table-column :label="$t('general.create_at')" width="200"
                             :formatter="(row)=>utils.FormatGoTime(row.CreatedAt)"/>
            <el-table-column :label="$t('general.update_at')" width="200"
                             :formatter="(row)=>utils.FormatGoTime(row.UpdatedAt)"/>
            <el-table-column :label="$t('general.operate')">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="()=>{editTeamForm = JSON.parse(JSON.stringify(scope.row)); editTeamDialogVisible = true}">
                        {{$t('general.edit')}}
                    </el-button>

                    <el-popconfirm
                            :confirmButtonText="$t('general.confirm_cancel')"
                            :cancelButtonText="$t('general.cancel')"
                            icon="el-icon-info"
                            iconColor="red"
                            :title="$t('team.delete_confirm')"
                            @onConfirm="handleDelete(scope.row)"
                    >
                        <el-button size="mini" type="danger" slot="reference">{{$t('general.delete')}}</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- New team -->
        <el-dialog :title="$t('team.add')" :visible.sync="newTeamDialogVisible">
            <el-button @click="newTeamForm.push({Name: '',Logo: ''})">{{$t('team.new')}}</el-button>
            <el-divider/>
            <div v-for="(item, index) in newTeamForm" v-bind:key="index">
                <el-row :gutter="20">
                    <el-form :model="item" label-width="80px">
                        <el-button type="danger" icon="el-icon-delete" circle @click="newTeamForm.splice(index, 1)"/>
                        <el-col :span="10">
                            <el-form-item :label="$t('team.team_name')">
                                <el-input v-model="item.Name"/>
                                <el-input v-model="item.Logo" size="mini" :placeholder="$t('team.picture_url')"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item :label="$t('team.team_logo')">
                                <el-upload name="picture" :action="utils.baseURL + '/manager/uploadPicture'"
                                           :headers="{'Authorization': token}"
                                           :on-success="(response) => {newTeamForm[index].Logo = response.data}">
                                    <el-button size="small" type="primary">{{$t('team.upload')}}</el-button>
                                    <div slot="tip" class="el-upload__tip">{{$t('team.file_limit')}}</div>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>
            <el-button type="primary" @click="onNewTeams">{{$t('team.add')}}</el-button>
        </el-dialog>

        <!-- Edit team -->
        <el-dialog :title="$t('team.edit')" :visible.sync="editTeamDialogVisible">
            <el-form label-width="80px">
                <el-form-item :label="$t('team.team_name')">
                    <el-input v-model="editTeamForm.Name"/>
                    <el-input v-model="editTeamForm.Logo" size="mini" :placeholder="$t('team.picture_url')"/>
                </el-form-item>
                <el-form-item :label="$t('team.team_logo')">
                    <el-upload name="picture" :action="utils.baseURL + '/manager/uploadPicture'"
                               :headers="{'Authorization': token}"
                               :on-success="(response) => {editTeamForm.Logo = response.data}">
                        <el-button size="small" type="primary">{{$t('team.upload')}}</el-button>
                        <div slot="tip" class="el-upload__tip">{{$t('team.file_limit')}}</div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onEditTeam">{{$t('team.edit')}}</el-button>
                    <el-popconfirm
                            :title="$t('team.reset_password_confirm')"
                            :confirmButtonText="$t('general.apply')"
                            :cancelButtonText="$t('general.cancel')"
                            @onConfirm="onResetPassword(editTeamForm.ID)"
                    >
                        <el-button slot="reference">{{$t('team.reset_password')}}</el-button>
                    </el-popconfirm>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Team",
        data: () => ({
            teamList: null,
            newTeamDialogVisible: false,
            editTeamDialogVisible: false,

            token: localStorage.getItem('managerToken'),

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
                    // Clean form
                    this.newTeamForm = [{
                        Name: '',
                        Logo: '',
                    }]

                    const h = this.$createElement;
                    var password = [h('p', null, this.$i18n.t('team.save_password'))]
                    res.forEach(item => {
                        password.push(h('p', null, this.$i18n.t('team.account_detail', {
                            Name: item.Name,
                            Password: item.Password
                        })))
                    })

                    this.$alert(h('p', null, password), this.$i18n.t('team.team_password'), {
                        confirmButtonText: this.$i18n.t('team.save_confirm')
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

            onResetPassword(teamID) {
                this.utils.POST('/manager/team/resetPassword', {
                    ID: teamID
                }).then(res => {
                    this.editTeamDialogVisible = false
                    this.$alert(res, this.$i18n.t('team.new_password'), {
                        confirmButtonText: this.$i18n.t('general.apply')
                    })
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