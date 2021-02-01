<template>
  <div>
    <!--        <TaskView :visible="taskVisible" @visibleChange="(val) => {taskVisible = val}"></TaskView>-->
    <el-menu :default-active="this.$route.path" mode="horizontal" :router="true" background-color="#323232"
             text-color="#fff" active-text-color="#2194EC">
      <el-menu-item>{{ base.Title }}</el-menu-item>
      <el-menu-item index="/">{{ $t('header.panel') }}</el-menu-item>
      <el-menu-item index="/team">{{ $t('header.team') }}</el-menu-item>
      <el-menu-item index="/challenge">{{ $t('header.challenge') }}</el-menu-item>
      <el-menu-item index="/gamebox">{{ $t('header.gamebox') }}</el-menu-item>
      <!--            <el-menu-item index="/docker">{{$t('header.docker')}}</el-menu-item>-->
      <el-menu-item index="/flag">{{ $t('header.flag') }}</el-menu-item>
      <el-menu-item index="/bulletin">{{ $t('header.bulletin') }}</el-menu-item>
      <el-menu-item index="/asteroid">{{ $t('header.asteroid') }}</el-menu-item>
      <el-menu-item index="/webhook">{{ $t('header.webhook') }}</el-menu-item>
      <el-menu-item index="/config">{{ $t('header.config') }}</el-menu-item>
      <el-menu-item index="/manager">{{ $t('header.manager') }}</el-menu-item>
      <el-menu-item v-if="$route.name !== 'Login'" index="" @click="onLogout">{{ $t('header.logout') }}
      </el-menu-item>
      <el-menu-item index="">
        <el-dropdown @command="(lang) => this.$i18n.locale = lang" class="height: 100%;">
                    <span>
                        {{ $i18n.locale }}
                    </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(lang, index) in $i18n.availableLocales" v-bind:key="index"
                              :command="lang">{{ lang }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>
      <!--            <el-menu-item style="float: right;">-->
      <!--                <el-badge :value="200" :max="99" class="badge">-->
      <!--                    <el-button plain size="small" style="margin-top: -20px;" @click="taskVisible = true">任务队列-->
      <!--                    </el-button>-->
      <!--                </el-badge>-->
      <!--            </el-menu-item>-->
    </el-menu>
  </div>
</template>

<script>
// import TaskView from "./TaskView";

export default {
  name: "Header",
  // components: {TaskView},
  data: () => ({
    base: {
      Title: ''
    },
    taskVisible: false,
  }),

  created() {
    this.utils.GET('/base').then(res => {
      this.base = res
      this.setLanguage()
    }).catch(err => this.$message.error(err))
  },

  methods: {
    setLanguage() {
      this.$i18n.locale = this.base.Language
    },

    onLogout() {
      this.utils.GET('/manager/logout').then(res => {
        this.$message.success(res)
        localStorage.removeItem('managerToken')
        this.$router.push('/login')
      }).catch(err => this.$message.error(err))
    },
  },
}
</script>

<style scoped>
.badge {
  margin-top: 10px;
  margin-right: 30px;
}
</style>