<template>
    <div style="text-align: center;">
        <el-card shadow="always" class="box-card">
            <p class="header-text">HCTF Cardinal</p>
            <el-form :model="inputForm" ref="inputForm" :rules="rules" status-icon label-width="80px">
                <el-form-item label="账号" prop="username">
                    <el-input type="text" v-model="inputForm.Name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="inputForm.Password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onLogin()">提交</el-button>
                    <el-button @click="reset()">重置</el-button>
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
                        {required: true, message: '请输入账号', trigger: 'blur'},
                    ],
                    Password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
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
                    localStorage.setItem('token', res)
                    this.$message({
                        message: '登录成功',
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