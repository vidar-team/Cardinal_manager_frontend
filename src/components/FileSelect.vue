<template>
    <div>
        <el-button type="primary" @click="selectFileDialogVisible = true">{{buttonText}}</el-button>
        <el-dialog title="选择文件" :visible.sync="selectFileDialogVisible" :modal="false">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="(folder, key) in baseDir.split('/')" v-bind:key="key">
                    <el-button type="text"
                               @click="()=>{
                                   baseDir = key === 0 ? '/' : baseDir.split('/').slice(0, key+1).join('/');
                                   getDir();
                               }">
                        {{key === 0 ? '/' : folder}}
                    </el-button>
                </el-breadcrumb-item>
                <el-button style="float: right;" icon="el-icon-refresh-left" size="small" @click="getDir()"></el-button>
            </el-breadcrumb>

            <el-table
                    v-loading="loading"
                    :data="files"
                    max-height="400"
                    style="width: 100%"
                    @row-click="(row, column, event) => {
                        if(row.IsDir){getDir(row.Name)}
                    }"
            >
                <el-table-column
                        prop="Name"
                        label="文件名"
                        width="180">
                    <template slot-scope="scope">
                        <i class="el-icon-folder" v-if="scope.row.IsDir"></i>
                        <i class="el-icon-document" v-else></i>
                        {{ scope.row.Name }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="Size"
                        label="文件大小"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="ModTime"
                        label="修改日期">
                    <template slot-scope="scope">
                        {{ utils.TimeStamp2String(scope.row.ModTime) }}
                    </template>
                </el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer">
                <el-button @click="selectFileDialogVisible = false">取 消</el-button>
                <el-button type="primary">选择</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import qs from 'qs'

    export default {
        name: "FileSelect",
        props: {
            buttonText: {
                type: String,
                default: 'Select...'
            },
            hidden: {
                type: Boolean,
                default: false,
            },
            folderOnly: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                loading: true,
                selectFileDialogVisible: false,

                baseDir: '',
                files: []
            }
        },

        mounted() {
            this.getDir()
        },
        methods: {
            getDir(folder = '') {
                this.loading = true
                let query = {
                    path: this.baseDir,
                    folder: folder,
                    hidden: this.hidden,
                    folderOnly: this.folderOnly
                }
                this.utils.GET('/manager/dir?' + qs.stringify(query)).then(res => {
                    this.baseDir = res.path
                    this.files = res.files
                    this.loading = false
                }).catch(err => {
                    this.$message({message: err, type: 'error'})
                    this.loading = false
                })
            },
        }
    }
</script>

<style scoped>

</style>