<template>
    <div>
        <el-button type="primary" @click="generateFlag">{{$t('flag.generate_flag')}}</el-button>
        <el-table :data="flagList" style="width: 100%" stripe v-loading="flagList === null">
            <el-table-column width="80" prop="ID" label="ID"/>
            <el-table-column width="80" prop="TeamID" :label="$t('flag.team')"/>
            <el-table-column width="80" prop="ChallengeID" :label="$t('flag.challenge')"/>
            <el-table-column width="80" prop="GameBoxID" :label="$t('flag.gamebox')"/>
            <el-table-column width="80" prop="Round" :label="$t('flag.round')"/>
            <el-table-column prop="Flag" :label="$t('flag.flag')"/>
        </el-table>
        <br>
        <el-pagination style="text-align:center" background layout="prev, pager, next" :total="total" :page-size="per"
                       @current-change="(p)=>{page = p; getFlags()}"></el-pagination>
    </div>
</template>

<script>
    export default {
        name: "Flag",

        data: () => ({
            page: 1,
            per: 15,

            total: 0,
            flagList: null
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
                this.$confirm(this.$i18n.t('flag.generate_flag_confirm'), this.$i18n.t('flag.confirm'), {
                    confirmButtonText: this.$i18n.t('general.apply'),
                    cancelButtonText: this.$i18n.t('general.cancel'),
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