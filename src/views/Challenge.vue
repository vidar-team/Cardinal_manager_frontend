<template>
    <div>
        <el-button type="primary" @click="newChallengeDialogVisible = true">{{$t('challenge.new')}}</el-button>
        <el-table :data="challengeList" style="width: 100%" stripe v-loading="isLoading">
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column prop="Title" :label="$t('challenge.title')"/>
            <el-table-column prop="BaseScore" :label="$t('challenge.base_score')"/>
            <el-table-column prop="Visible" :label="$t('challenge.visible')">
                <template slot-scope="scope">{{scope.row.Visible}}</template>
            </el-table-column>
            <el-table-column prop="AutoRefreshFlag" :label="$t('challenge.auto_refresh_flag')">
                <template slot-scope="scope">{{scope.row.AutoRefreshFlag}}</template>
            </el-table-column>
            <el-table-column prop="Command" :label="$t('challenge.command')"/>
            <el-table-column :label="$t('general.create_at')" width="200"
                             :formatter="(row)=>utils.FormatGoTime(row.CreatedAt)"/>
            <el-table-column :label="$t('general.operate')" width="300">
                <template slot-scope="scope">
                    <el-popconfirm
                            :title="scope.row.Visible ? $t('challenge.invisible_title') : $t('challenge.visible_title')"
                            @onConfirm="handleVisible(scope.row.ID, !scope.row.Visible)">
                        <el-button plain size="mini" slot="reference">{{$t('challenge.set_visible')}}</el-button>
                    </el-popconfirm>
                    <el-button
                            size="mini"
                            @click="()=>{editChallengeForm = JSON.parse(JSON.stringify(scope.row)); editChallengeDialogVisible = true}">
                        {{$t('general.edit')}}
                    </el-button>
                    <el-popconfirm
                            :confirmButtonText="$t('general.confirm_cancel')"
                            :cancelButtonText="$t('general.cancel')"
                            icon="el-icon-info"
                            iconColor="red"
                            :title="$t('challenge.delete_title')"
                            @onConfirm="handleDelete(scope.row)"
                    >
                        <el-button size="mini" type="danger" slot="reference">{{$t('general.delete')}}
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- New Challenge -->
        <el-dialog :title="$t('challenge.publish')" :visible.sync="newChallengeDialogVisible">
            <el-form :model="newChallengeForm" label-width="120px">
                <el-form-item :label="$t('challenge.title')">
                    <el-input v-model="newChallengeForm.Title"/>
                </el-form-item>
                <el-form-item :label="$t('challenge.base_score')">
                    <el-input-number v-model="newChallengeForm.BaseScore" :min="1"/>
                </el-form-item>
                <el-form-item :label="$t('challenge.auto_refresh_flag')">
                    <el-switch v-model="newChallengeForm.AutoRefreshFlag"></el-switch>
                </el-form-item>
                <el-form-item :label="$t('challenge.command')" v-if="newChallengeForm.AutoRefreshFlag">
                    <el-input v-model="newChallengeForm.Command"/>
                    <span>{{$t('challenge.flag_placeholder')}}<code v-pre>{{FLAG}}</code></span>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="onNewChallenge">{{$t('challenge.publish')}}</el-button>
        </el-dialog>

        <!-- Edit Challenge -->
        <el-dialog :title="$t('challenge.edit')" :visible.sync="editChallengeDialogVisible">
            <el-form :model="editChallengeForm" label-width="120px">
                <el-form-item :label="$t('challenge.title')">
                    <el-input v-model="editChallengeForm.Title"/>
                </el-form-item>
                <el-form-item :label="$t('challenge.base_score')">
                    <el-input-number v-model="editChallengeForm.BaseScore" :min="1"/>
                </el-form-item>
                <el-form-item :label="$t('challenge.auto_refresh_flag')">
                    <el-switch v-model="editChallengeForm.AutoRefreshFlag"></el-switch>
                </el-form-item>
                <el-form-item :label="$t('challenge.command')" v-if="editChallengeForm.AutoRefreshFlag">
                    <el-input v-model="editChallengeForm.Command"/>
                    <span>{{$t('challenge.flag_placeholder')}}<code v-pre>{{FLAG}}</code></span>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="onEditChallenge">{{$t('challenge.edit')}}</el-button>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Challenge",
        data() {
            return {
                isLoading: true,
                challengeList: null,
                newChallengeDialogVisible: false,
                editChallengeDialogVisible: false,

                newChallengeForm: {
                    Title: '',
                    BaseScore: 1000,
                    AutoRefreshFlag: false,
                    Command: 'echo {{FLAG}} > /flag',
                },

                editChallengeForm: {
                    Title: '',
                    BaseScore: 1000,
                    AutoRefreshFlag: false,
                    Command: '',
                },
            }
        },

        mounted() {
            this.getChallenges()
        },

        methods: {
            getChallenges() {
                this.utils.GET("/manager/challenges").then(res => {
                    this.challengeList = res
                    this.isLoading = false
                }).catch(err => this.$message.error(err))
            },

            onNewChallenge() {
                this.utils.POST('/manager/challenge', this.newChallengeForm).then(res => {
                    this.newChallengeDialogVisible = false
                    // 清空表单
                    this.newChallengeForm = {
                        Title: '',
                        BaseScore: 1000,
                        AutoRefreshFlag: false,
                        Command: 'echo {{FLAG}} > /flag',
                    }
                    this.getChallenges()
                    this.$message({message: res, type: 'success'})
                }).catch(err => this.$message({message: err, type: 'error'}))
            },

            onEditChallenge() {
                this.utils.PUT('/manager/challenge', this.editChallengeForm).then(res => {
                    this.editChallengeDialogVisible = false
                    this.getChallenges()
                    this.$message({message: res, type: 'success'})
                }).catch(err => this.$message({message: err, type: 'error'}))
            },

            handleDelete(row) {
                this.utils.DELETE("/manager/challenge?id=" + row.ID).then(res => {
                    this.$message({
                        message: res,
                        type: 'success'
                    });
                    this.getChallenges()
                }).catch(err => this.$message({message: err, type: 'error'}))
            },

            handleVisible(id, visible) {
                this.utils.POST("/manager/challenge/visible", {
                    ID: id,
                    Visible: visible
                }).then(res => {
                    this.$message({
                        message: res,
                        type: 'success'
                    });
                    this.getChallenges()
                }).catch(err => this.$message({message: err, type: 'error'}))
            }
        }
    }
</script>

<style scoped>

</style>
