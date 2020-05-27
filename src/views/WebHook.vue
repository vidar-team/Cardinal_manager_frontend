<template>
    <div>
        <el-button type="primary" @click="newWebHookDialogVisible = true">{{$t('webhook.add')}}</el-button>
        <el-table :data="webHookList" style="width: 100%" stripe v-loading="isLoading">
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column prop="URL" :label="$t('webhook.url')"/>
            <el-table-column prop="Type" :label="$t('webhook.type')">
                <template slot-scope="scope">{{typeOptions[scope.row.Type]}}</template>
            </el-table-column>
            <el-table-column prop="Token" :label="$t('webhook.token')"/>
            <el-table-column width="120" prop="Retry" :label="$t('webhook.retry')"/>
            <el-table-column width="120" prop="Timeout" :label="$t('webhook.timeout')"/>
            <el-table-column :label="$t('general.operate')" width="300">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="()=>{editWebHookForm = JSON.parse(JSON.stringify(scope.row)); editWebHookDialogVisible = true}">
                        {{$t('general.edit')}}
                    </el-button>
                    <el-popconfirm
                            :confirmButtonText="$t('general.confirm_cancel')"
                            :cancelButtonText="$t('general.cancel')"
                            icon="el-icon-info"
                            iconColor="red"
                            :title="$t('webhook.delete_title')"
                            @onConfirm="handleDelete(scope.row)"
                    >
                        <el-button size="mini" type="danger" slot="reference">{{$t('general.delete')}}
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- New WebHook -->
        <el-dialog :title="$t('webhook.add')" :visible.sync="newWebHookDialogVisible">
            <el-form :model="newWebHookForm" label-width="120px">
                <el-form-item :label="$t('webhook.url')">
                    <el-input v-model="newWebHookForm.URL"/>
                </el-form-item>
                <el-form-item :label="$t('webhook.type')">
                    <el-select v-model="newWebHookForm.Type" :placeholder="$t('webhook.please_select')">
                        <el-option
                                v-for="(label, value) in typeOptions"
                                :key="value"
                                :label="label"
                                :value="value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('webhook.token')">
                    <el-input v-model="newWebHookForm.Token"/>
                    <p>{{$t('webhook.token_tips')}}</p>
                </el-form-item>
                <el-form-item :label="$t('webhook.retry')">
                    <el-input-number v-model="newWebHookForm.Retry" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('webhook.timeout')">
                    <el-input-number v-model="newWebHookForm.Timeout" :min="0"></el-input-number>
                    <p>{{$t('webhook.timeout_tips')}}</p>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="onNewWebHook">{{$t('webhook.publish')}}</el-button>
        </el-dialog>

        <!-- Edit WebHook -->
        <el-dialog :title="$t('webhook.edit')" :visible.sync="editWebHookDialogVisible">
            <el-form :model="editWebHookForm" label-width="120px">
                <el-form-item :label="$t('webhook.url')">
                    <el-input v-model="editWebHookForm.URL"/>
                </el-form-item>
                <el-form-item :label="$t('webhook.type')">
                    <el-select v-model="editWebHookForm.Type" :placeholder="$t('webhook.please_select')">
                        <el-option
                                v-for="(label, value) in typeOptions"
                                :key="value"
                                :label="label"
                                :value="value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('webhook.token')">
                    <el-input v-model="editWebHookForm.Token"/>
                    <p>{{$t('webhook.token_tips')}}</p>
                </el-form-item>
                <el-form-item :label="$t('webhook.retry')">
                    <el-input-number v-model="editWebHookForm.Retry" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('webhook.timeout')">
                    <el-input-number v-model="editWebHookForm.Timeout" :min="0"></el-input-number>
                    <p>{{$t('webhook.timeout_tips')}}</p>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="onEditWebHook">{{$t('webhook.edit')}}</el-button>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "WebHook",

        data() {
            return {
                webHookList: [],
                isLoading: true,

                newWebHookDialogVisible: false,
                editWebHookDialogVisible: false,

                newWebHookForm: {
                    URL: '',
                    Type: '',
                    Token: '',
                    Retry: 0,
                    Timeout: 0,
                },
                editWebHookForm: {},

                typeOptions: {
                    'any': this.$i18n.t('webhook.type_any'),
                    'new_round': this.$i18n.t('webhook.type_new_round'),
                    'submit_flag': this.$i18n.t('webhook.type_submit_flag'),
                    'game_begin': this.$i18n.t('webhook.type_game_begin'),
                    'game_pause': this.$i18n.t('webhook.type_game_pause'),
                    'game_end': this.$i18n.t('webhook.type_game_end')

                }
            }
        },

        mounted() {
            this.getWebHooks()
        },

        methods: {
            getWebHooks() {
                this.utils.GET("/manager/webhooks").then(res => {
                    this.webHookList = res
                    this.isLoading = false
                }).catch(err => this.$message.error(err))
            },

            onNewWebHook() {
                this.utils.POST('/manager/webhook', this.newWebHookForm).then(res => {
                    this.$message.success(res)
                    this.newWebHookDialogVisible = false
                    this.newWebHookForm = {
                        URL: '',
                        Type: '',
                        Token: '',
                        Retry: 0,
                        Timeout: 0,
                    }
                    this.getWebHooks()
                }).catch(err => {
                    this.$message.error(err)
                })
            },

            onEditWebHook() {
                this.utils.PUT('/manager/webhook', this.editWebHookForm).then(res => {
                    this.$message.success(res)
                    this.editWebHookDialogVisible = false
                    this.getWebHooks()
                }).catch(err => {
                    this.$message.error(err)
                })
            },

            handleDelete(row) {
                this.utils.DELETE("/manager/webhook?id=" + row.ID).then(res => {
                    this.$message({
                        message: res,
                        type: 'success'
                    });
                    this.getWebHooks()
                }).catch(err => this.$message({message: err, type: 'error'}))
            },
        }
    }
</script>

<style scoped>

</style>