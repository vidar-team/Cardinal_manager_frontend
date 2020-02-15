<template>
    <div>
        <el-button type="primary" @click="newManagerDialogVisible = true">添加管理员账号</el-button>
        <el-table :data="managerList" style="width: 100%" stripe>
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column prop="Name" label="账号"/>
            <el-table-column prop="Token" label="Token"/>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="mini" v-if="scope.row.Token !== token"
                               @click="refreshToken(scope.row.ID)">刷新 Token
                    </el-button>
                    <el-button size="mini" disabled v-else>刷新 Token</el-button>
                    <el-button size="mini" type="warning" @click="editPassword(scope.row.ID)">
                        修改密码
                    </el-button>
                    <el-button size="mini" type="danger" @click="deleteManager(scope.row.ID)">
                        删除账号
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加账号 -->
        <el-dialog title="添加管理员账号" :visible.sync="newManagerDialogVisible">
            <el-form :model="newManagerForm" label-width="80px">
                <el-form-item label="账号">
                    <el-input v-model="newManagerForm.Name"/>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="newManagerForm.Password"/>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="onNewManager">添加账号</el-button>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Manager",

        data: () => ({
            token: localStorage.getItem('token'),
            newManagerDialogVisible: false,
            managerList: null,

            newManagerForm: {
                Name: '',
                Password: ''
            },
        }),

        mounted() {
            this.getManager()
        },

        methods: {
            getManager() {
                this.utils.GET('/manager/managers').then(res => {
                    this.managerList = res
                }).catch(err => this.$message.error(err))
            },

            onNewManager() {
                this.utils.POST('/manager/manager', this.newManagerForm).then(res => {
                    this.newManagerDialogVisible = false
                    this.newManagerForm = {
                        Name: '',
                        Password: ''
                    }
                    this.$message.success(res)
                    this.getManager()
                }).catch(err => this.$message.error(err))
            },

            editPassword(id){
                this.$confirm('此操作将修改该管理员密码，是否继续?', '请确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.utils.GET('/manager/manager/changePassword?id=' + id).then(res => {
                        this.$alert(res, '新的密码', {
                            confirmButtonText: '我已确认保存'
                        });
                    }).catch(err => this.$message.error(err))
                }).catch(() => {
                })
            },

            deleteManager(id){
                this.$confirm('此操作将删除该管理员账号, 是否继续?', '请确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.utils.DELETE('/manager/manager?id=' + id).then(res => {
                        this.getManager()
                        this.$message.success(res)
                    }).catch(err => this.$message.error(err))
                }).catch(() => {
                })
            },

            refreshToken(id) {
                this.$confirm('此操作将刷新当前账号的 Token，会使得登录状态失效, 是否继续?', '请确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.utils.GET('/manager/manager/token?id=' + id).then(res => {
                        this.getManager()
                        this.$alert(res, '新的 Token', {
                            confirmButtonText: '我已确认保存'
                        });
                    }).catch(err => this.$message.error(err))
                }).catch(() => {
                })
            }
        }
    }
</script>

<style scoped>

</style>