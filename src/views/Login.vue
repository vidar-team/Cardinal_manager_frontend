<template>
    <div style="text-align: center;">
        <el-card shadow="always" class="box-card">
            <p class="header-text">Cardinal</p>
            <el-form :model="inputForm" ref="inputForm" :rules="rules" status-icon label-width="80px">
                <el-form-item :label="$t('login.account')" prop="username">
                    <el-input type="text" v-model="inputForm.Name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label="$t('login.password')" prop="password">
                    <el-input type="password" v-model="inputForm.Password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onLogin()">{{$t('login.login')}}</el-button>
                    <el-button @click="reset()">{{$t('login.reset')}}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                rules: {
                    Name: [
                        {required: true, message: this.$i18n.t('login.empty_account'), trigger: 'blur'},
                    ],
                    Password: [
                        {required: true, message: this.$i18n.t('login.empty_password'), trigger: 'blur'}
                    ],
                },

                inputForm: {
                    Name: '',
                    Password: ''
                }
            }
        },
        methods: {
            onLogin() {
                this.$refs['inputForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                });

                this.utils.POST('/manager/login', this.inputForm).then(res => {
                    localStorage.setItem('managerToken', res)
                    this.$message({
                        message: this.$i18n.t('login.success'),
                        type: 'success'
                    });
                    this.$router.push('/')
                }).catch(err => this.$message.error(err))
            },

            reset() {
                this.inputForm = {
                    Name: '',
                    Password: ''
                }
            }
        }
    }
</script>

<style scoped>
    .box-card {
        margin: 0 auto;
        width: 500px;
        text-align: center;
    }

    .header-text {
        font-size: 30px;
        font-weight: lighter;
    }
</style>