<template>
    <div>
        <el-button type="primary" @click="generateFlag">生成 Flag</el-button>
        <el-table :data="flagList" style="width: 100%" stripe>
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column width="80" prop="TeamID" label="所属队伍"/>
            <el-table-column width="80" prop="ChallengeID" label="所属题目"/>
            <el-table-column width="80" prop="GameBoxID" label="所属靶机"/>
            <el-table-column width="80" prop="Round" label="所属轮数"/>
            <el-table-column prop="Flag" label="Flag"/>
        </el-table>
        <br>
        <el-pagination  style="text-align:center" background layout="prev, pager, next" :total="total" :page-size="per" @current-change="(p)=>{page = p; getFlags()}"></el-pagination>
    </div>
</template>

<script>
    export default {
        name: "Flag",

        data: () => ({
            page: 1,
            per: 15,

            total: 0,
            flagList: []
        }),

        mounted() {
            this.getFlags()
        },

        methods: {
            getFlags() {
                this.utils.GET('/manager/flags?per=' + this.per + '&page=' + this.page).then(res => {
                    this.flagList = res.array
                    this.total = res.total
                }).catch(err => this.$message({message: err, type: 'error'}))
            },
            generateFlag() {
                this.$confirm('此操作将删除现有的 Flag 并重新生成, 是否继续?', '请确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.utils.POST('/manager/flag/generate').then(res => {
                        this.getFlags()
                        this.$message({message: res, type: 'success'})
                    }).catch(err => this.$message({message: err, type: 'error'}))
                })
            }
        }
    }
</script>

<style scoped>

</style>