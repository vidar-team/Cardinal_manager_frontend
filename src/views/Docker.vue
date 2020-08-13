<template>
    <div>
        <el-button type="primary">部署题目</el-button>
        <file-select button-text="选择目录" :folder-only="true"></file-select>

        <el-button type="text" @click="dockerImageVisible = true">从镜像部署</el-button>


    </div>
</template>

<script>
    import FileSelect from "../components/FileSelect";

    export default {
        name: "Docker",
        data() {
            return {
                loading: false,
                dockerImageVisible: false,
                dockerImageText: 'wuhan005/awd_web:latest',
                dockerImageForm: {
                    User: '',
                    Image: '',
                    Tag: ''
                },
                dockerInfo: null,

                ports: [],
                treeData: [],

                teamList: []
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
            getImageData() {
                this.loading = true
                this.dockerImageForm.User = this.dockerImageText.split('/')[0]
                this.dockerImageForm.Image = this.dockerImageText.split('/')[1].split(':')[0]
                this.dockerImageForm.Tag = this.dockerImageText.split(':')[1]

                this.utils.POST('/manager/docker/findImage', this.dockerImageForm).then(res => {
                    this.loading = false
                    for (let i = 0; i < res.Ports.length; i++) {
                        this.ports.push({'from': res.Ports[i], 'to': null})
                    }
                    this.dockerInfo = res
                }).catch(err => {
                    this.$message({message: err, type: 'error'});
                    this.loading = false
                })
            }
        },
        components: {FileSelect}
    }
</script>

<style scoped>

</style>