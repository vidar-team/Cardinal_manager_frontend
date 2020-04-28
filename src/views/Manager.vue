<template>
    <div>
        <el-button type="primary" @click="newManagerDialogVisible = true">{{$t('manager.add')}}</el-button>
        <el-table :data="managerList" style="width: 100%" stripe>
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column prop="Name" :label="$t('manager.account')"/>
            <el-table-column prop="IsCheck" :label="$t('manager.is_check')">
                <template slot-scope="scope">{{scope.row.IsCheck}}</template>
            </el-table-column>
            <el-table-column prop="Token" :label="$t('manager.token')"/>
            <el-table-column :label="$t('general.operate')" width="300">
                <template slot-scope="scope">
                    <el-button size="mini" v-if="scope.row.Token !== token"
                               @click="refreshToken(scope.row.ID)">{{$t('manager.refresh_token')}}
                    </el-button>
                    <el-button size="mini" disabled v-else>{{$t('manager.refresh_token')}}</el-button>
                    <el-button size="mini" v-if="!scope.row.IsCheck" type="warning" @click="editPassword(scope.row.ID)">
                        {{$t('manager.change_password')}}
                    </el-button>
                    <el-button size="mini" type="danger" @click="deleteManager(scope.row.ID)">
                        {{$t('manager.delete')}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- New account -->
        <el-dialog :title="$t('manager.add')" :visible.sync="newManagerDialogVisible">
            <el-form :model="newManagerForm" label-width="120px">
                <el-form-item>
                    <el-checkbox v-model="newManagerForm.IsCheck">{{$t('manager.is_check')}}</el-checkbox>
                </el-form-item>
                <el-form-item :label="$t('manager.account')">
                    <el-input v-model="newManagerForm.Name"/>
                </el-form-item>
                <el-form-item v-if="!newManagerForm.IsCheck" :label="$t('manager.password')">
                    <el-input v-model="newManagerForm.Password"/>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="onNewManager">{{$t('manager.add')}}</el-button>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Manager",

        data: () => ({
            token: localStorage.getItem('managerToken'),
            newManagerDialogVisible: false,
            managerList: null,

            newManagerForm: {
                Name: '',
                Password: '',
                IsCheck: false,
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
                        Password: '',
                        IsCheck: false,
                    }
                    this.$message.success(res)
                    this.getManager()
                }).catch(err => this.$message.error(err))
            },

            editPassword(id) {
                this.$confirm(this.$i18n.t('manager.change_password_confirm'), this.$i18n.t('manager.confirm'), {
                    confirmButtonText: this.$i18n.t('general.apply'),
                    cancelButtonText: this.$i18n.t('general.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.utils.GET('/manager/manager/changePassword?id=' + id).then(res => {
                        this.$alert(res, this.$i18n.t('manager.new_password'), {
                            confirmButtonText: this.$i18n.t('manager.save_confirm')
                        });
                    }).catch(err => this.$message.error(err))
                }).catch(() => {
                })
            },

            deleteManager(id) {
                this.$confirm(this.$i18n.t('manager.delete_account_confirm'), this.$i18n.t('manager.confirm'), {
                    confirmButtonText: this.$i18n.t('general.apply'),
                    cancelButtonText: this.$i18n.t('general.cancel'),
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
                this.$confirm(this.$i18n.t('manager.refresh_token_confirm'), this.$i18n.t('manager.confirm'), {
                    confirmButtonText: this.$i18n.t('general.apply'),
                    cancelButtonText: this.$i18n.t('general.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.utils.GET('/manager/manager/token?id=' + id).then(res => {
                        this.getManager()
                        this.$alert(res, this.$i18n.t('manager.new_token'), {
                            confirmButtonText: this.$i18n.t('manager.save_confirm')
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