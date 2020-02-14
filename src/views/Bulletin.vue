<template>
    <div>
        <el-button type="primary" @click="newBulletinDialogVisible = true">发布公告</el-button>
        <el-table :data="bulletinList" style="width: 100%" stripe>
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column prop="Title" label="标题"/>
            <el-table-column prop="Content" label="内容"/>
            <el-table-column prop="CreatedAt" label="创建时间"/>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="()=>{editBulletinForm = JSON.parse(JSON.stringify(scope.row)); editBulletinDialogVisible = true}">编辑
                    </el-button>

                    <el-popconfirm
                            confirmButtonText='确定删除'
                            cancelButtonText='取消'
                            icon="el-icon-info"
                            iconColor="red"
                            title="您确定删除这条公告吗？"
                            @onConfirm="handleDelete(scope.row.ID)"
                    >
                        <el-button size="mini" type="danger" slot="reference">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 发布公告 -->
        <el-dialog title="发布公告" :visible.sync="newBulletinDialogVisible">
            <el-form :model="newBulletinForm" label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="newBulletinForm.Title"/>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input type="textarea" :rows="3" placeholder="请输入公告内容" v-model="newBulletinForm.Content"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="onNewBulletin">发布</el-button>
        </el-dialog>

        <!-- 编辑公告 -->
        <el-dialog title="编辑公告" :visible.sync="editBulletinDialogVisible">
            <el-form :model="editBulletinForm" label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="editBulletinForm.Title"/>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input type="textarea" :rows="3" placeholder="请输入公告内容" v-model="editBulletinForm.Content"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="handleEdit">修改公告</el-button>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Bulletin",
        data: () => ({
            newBulletinDialogVisible: false,
            editBulletinDialogVisible: false,

            bulletinList: null,
            editBulletinForm: {
                Title: '',
                Content: ''
            },
            newBulletinForm: {
                Title: '',
                Content: ''
            },
        }),
        mounted() {
            this.getBulletin()
        },
        methods: {
            getBulletin() {
                this.utils.GET('/manager/bulletins').then(res => {
                    this.bulletinList = res
                }).catch(err => this.$message({message: err, type: 'error'}))
            },

            onNewBulletin(){
                this.utils.POST('/manager/bulletin', this.newBulletinForm).then(res => {
                    this.newBulletinDialogVisible = false
                    this.newBulletinForm = {
                        Title: '',
                        Content: ''
                    }
                    this.$message({message: res, type: 'success'})
                    this.getBulletin()
                }).catch(err => this.$message({message: err, type: 'error'}))
            },

            handleEdit() {
                this.utils.PUT('/manager/bulletin', this.editBulletinForm).then(res => {
                    this.editBulletinDialogVisible = false
                    this.$message({message: res, type: 'success'})
                    this.getBulletin()
                }).catch(err => this.$message({message: err, type: 'error'}))
            },

            handleDelete(id) {
                this.utils.DELETE('/manager/bulletin?id=' + id).then(res => {
                    this.$message({message: res, type: 'success'})
                    this.getBulletin()
                }).catch(err => this.$message({message: err, type: 'error'}))
            }
        }
    }
</script>

<style scoped>

</style>