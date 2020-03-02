<template>
    <div>
        <el-button type="primary" @click="newBulletinDialogVisible = true">{{$t('bulletin.publish')}}</el-button>
        <el-table :data="bulletinList" style="width: 100%" stripe v-loading="bulletinList === null">
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column prop="Title" :label="$t('bulletin.title')"/>
            <el-table-column prop="Content" :label="$t('bulletin.content')"/>
            <el-table-column :label="$t('general.create_at')" width="200"
                             :formatter="(row)=>utils.FormatGoTime(row.CreatedAt)"/>
            <el-table-column :label="$t('general.operate')" width="300">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="()=>{editBulletinForm = JSON.parse(JSON.stringify(scope.row)); editBulletinDialogVisible = true}">
                        {{$t('general.edit')}}
                    </el-button>

                    <el-popconfirm
                            :confirmButtonText="$t('general.confirm_cancel')"
                            :cancelButtonText="$t('general.cancel')"
                            icon="el-icon-info"
                            iconColor="red"
                            :title="$t('bulletin.delete_title')"
                            @onConfirm="handleDelete(scope.row.ID)"
                    >
                        <el-button size="mini" type="danger" slot="reference">{{$t('general.delete')}}</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- Publish bulletin -->
        <el-dialog :title="$t('bulletin.publish')" :visible.sync="newBulletinDialogVisible">
            <el-form :model="newBulletinForm" label-width="80px">
                <el-form-item :label="$t('bulletin.title')">
                    <el-input v-model="newBulletinForm.Title"/>
                </el-form-item>
                <el-form-item :label="$t('bulletin.content')">
                    <el-input type="textarea" :rows="3" :placeholder="$t('bulletin.content_placeholder')"
                              v-model="newBulletinForm.Content"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="onNewBulletin">{{$t('bulletin.publish')}}</el-button>
        </el-dialog>

        <!-- Edit bulletin -->
        <el-dialog :title="$t('bulletin.edit')" :visible.sync="editBulletinDialogVisible">
            <el-form :model="editBulletinForm" label-width="80px">
                <el-form-item :label="$t('bulletin.title')">
                    <el-input v-model="editBulletinForm.Title"/>
                </el-form-item>
                <el-form-item :label="$t('bulletin.content')">
                    <el-input type="textarea" :rows="3" :placeholder="$t('bulletin.content_placeholder')"
                              v-model="editBulletinForm.Content"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="handleEdit">{{$t('bulletin.edit')}}</el-button>
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

            onNewBulletin() {
                this.utils.POST('/manager/bulletin', this.newBulletinForm).then(res => {
                    this.newBulletinDialogVisible = false
                    // Clean form.
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