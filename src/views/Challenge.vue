<template>
    <div>
        <el-button type="primary" @click="newChallengeDialogVisible = true">添加Challenge</el-button>
        <el-table :data="challengeList" style="width: 100%" stripe>
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column prop="Title" label="题目名"/>
            <el-table-column prop="BaseScore" label="基础分数"/>
            <el-table-column prop="Visible" label="是否可见">
                <template slot-scope="scope">{{scope.row.Visible}}</template>
            </el-table-column>
            <el-table-column prop="CreatedAt" label="创建时间"/>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-popconfirm :title="'您确定要设置该题目状态为' + (scope.row.Visible ? '不':'') +'公开吗？'"
                                   @onConfirm="handleVisible(scope.row.ID, !scope.row.Visible)">
                        <el-button plain size="mini" slot="reference">设置为<span v-if="scope.row.Visible">不</span>可见
                        </el-button>
                    </el-popconfirm>
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-popconfirm
                            confirmButtonText='确定删除'
                            cancelButtonText='取消'
                            icon="el-icon-info"
                            iconColor="red"
                            title="您确定删除这个题目吗？"
                            @onConfirm="handleDelete(scope.row)"
                    >
                        <el-button size="mini" type="danger" slot="reference">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加 Challenge -->
        <el-dialog title="添加 Challenge" :visible.sync="newChallengeDialogVisible">
            <el-form :model="newChallengeForm" label-width="80px">
                <el-form-item label="题目名">
                    <el-input v-model="newChallengeForm.Title"/>
                </el-form-item>
                <el-form-item label="基础分数">
                    <el-input-number v-model="newChallengeForm.BaseScore" :min="1"/>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="onNewChallenge">添加题目</el-button>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Challenge",
        data() {
            return {
                challengeList: [],
                newChallengeDialogVisible: false,

                newChallengeForm: {
                    Title: '',
                    BaseScore: 1000,
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
                }).catch(err => this.$message.error(err))
            },

            onNewChallenge() {
                this.utils.POST('/manager/challenge', this.newChallengeForm).then(res => {
                    this.newChallengeDialogVisible = false
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