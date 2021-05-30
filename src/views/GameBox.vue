<template>
  <div>
    <el-dropdown style="margin-right: 10px;" @command="(command) => {
            switch(command){
                case 'remote-gamebox': newGameBoxDialogVisible = true; return;
                case 'from-docker': dockerImageVisible = true; return;
            }
        }">
      <el-button type="primary">
        {{ $t('gamebox.publish') }}<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="remote-gamebox">{{ $t('gamebox.publish_out') }}</el-dropdown-item>
        <!--                <el-dropdown-item command="from-docker">从镜像部署靶机</el-dropdown-item>-->
      </el-dropdown-menu>
    </el-dropdown>
    <el-button @click="testAllSSH" :loading="sshTesting">{{ $t('gamebox.test_ssh') }}</el-button>
    <el-button @click="refreshFlag">{{ $t('gamebox.refresh_flag') }}</el-button>
    <el-popconfirm
        :confirm-button-text="$t('general.apply')"
        :cancel-button-text="$t('general.cancel')"
        icon="el-icon-info"
        icon-color="red"
        :title="$t('gamebox.reset_confirm')"
        @onConfirm="resetGameBox"
    >
      <el-button slot="reference" type="danger" style="margin-left: 10px;">{{ $t('gamebox.reset') }}</el-button>
    </el-popconfirm>

    <!-- Gamebox list -->
    <el-table :data="gameBoxList" style="width: 100%" stripe v-loading="gameBoxList === null">
      <el-table-column width="80" prop="ID" label="ID"/>
      <el-table-column prop="ChallengeTitle" :label="$t('gamebox.challenge')"/>
      <el-table-column prop="TeamName" :label="$t('gamebox.team')"/>
      <el-table-column prop="IP" :label="$t('gamebox.ip')"/>
      <el-table-column prop="Port" :label="$t('gamebox.port')"/>
      <el-table-column prop="Score" :label="$t('gamebox.score')"
                       :formatter="(row) => utils.FormatFloat(row.Score)"/>
      <el-table-column prop="Description" :label="$t('gamebox.description')"/>
      <el-table-column prop="IsDown" :label="$t('gamebox.down')">
        <template slot-scope="scope">{{ scope.row.IsDown }}</template>
      </el-table-column>
      <el-table-column prop="IsAttacked" :label="$t('gamebox.attacked')">
        <template slot-scope="scope">{{ scope.row.IsAttacked }}</template>
      </el-table-column>
      <el-table-column :label="$t('general.create_at')" width="200"
                       :formatter="(row)=>utils.FormatGoTime(row.CreatedAt)"/>
      <el-table-column :label="$t('general.operate')" width="300">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="()=>{editGameBoxForm = JSON.parse(JSON.stringify(scope.row)); editGameBoxDialogVisible = true}">
            {{ $t('general.edit') }}
          </el-button>
          <el-popconfirm
              :confirmButtonText="$t('general.confirm_cancel')"
              :cancelButtonText="$t('general.cancel')"
              icon="el-icon-info"
              iconColor="red"
              :title="$t('gamebox.delete_title')"
              @onConfirm="handleDelete(scope.row)"
          >
            <el-button size="mini" type="danger" slot="reference">{{ $t('general.delete') }}
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <br>
    <el-pagination style="text-align:center" background layout="prev, pager, next" :total="total" :page-size="per"
                   @current-change="(p)=>{page = p; getGameBoxes()}"></el-pagination>

    <!-- New GameBox from remote -->
    <el-dialog :title="$t('gamebox.publish')" :visible.sync="newGameBoxDialogVisible">
      <el-button type="primary" @click="mutliGameBoxDialogVisible = true">{{ $t('gamebox.multi') }}</el-button>
      <el-button @click="newGameBoxForm.push({
                    ChallengeID: null,
                    TeamID: null,
                    IP: '',
                    Port: '',
                    SSHPort: '',
                    SSHUser:'root',
                    SSHPassword: '',
                    Description: ''
                })">{{ $t('gamebox.add') }}
      </el-button>
      <el-divider/>
      <div v-for="(item, index) in newGameBoxForm" v-bind:key="index">
        <el-row :gutter="20">
          <el-form :model="item" label-width="130px">
            <el-button type="danger" icon="el-icon-delete" circle @click="newGameBoxForm.splice(index, 1)"/>
            <el-col :span="10">
              <el-form-item :label="$t('gamebox.challenge')">
                <el-select v-model="item.ChallengeID"
                           :placeholder="$t('gamebox.challenge_placeholder')">
                  <el-option
                      v-for="challenge in challenges"
                      :key="challenge.ID"
                      :label="challenge.Title"
                      :value="challenge.ID">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('gamebox.team')">
                <el-select v-model="item.TeamID" :placeholder="$t('gamebox.team_placeholder')">
                  <el-option
                      v-for="team in teams"
                      :key="team.ID"
                      :label="team.Name"
                      :value="team.ID">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('gamebox.ip')">
                <el-input v-model="item.IP" :placeholder="$t('gamebox.ip_placeholder')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('gamebox.port')">
                <el-input v-model="item.Port" :placeholder="$t('gamebox.port_placeholder')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item :label="$t('gamebox.description')">
                <el-input type="textarea" :rows="3" :placeholder="$t('gamebox.description_placeholder')"
                          v-model="item.Description">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('gamebox.ssh_port')">
                <el-input v-model="item.SSHPort"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('gamebox.ssh_user')">
                <el-input v-model="item.SSHUser"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item :label="$t('gamebox.ssh_password')">
                <el-input v-model="item.SSHPassword"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-divider></el-divider>
            </el-col>
          </el-form>
        </el-row>

      </div>
      <el-button type="primary" @click="onNewGameBox">{{ $t('gamebox.publish') }}</el-button>
    </el-dialog>

    <!-- Multi -->
    <el-dialog :title="$t('gamebox.multi')" :visible.sync="mutliGameBoxDialogVisible">
            <span>
                {{ $t('gamebox.format') }}
                <code>[{
                    "ChallengeID": 1,
                    "TeamID": 1,
                    "IP": "",
                    "Port": "",
                    "SSHPort": "",
                    "SSHUser": "",
                    "SSHPassword": "",
                    "Description": ""
                }]</code>
            </span>
      <el-form>
        <el-form-item :label="$t('gamebox.json_string')">
          <el-input type="textarea" v-model="mutliGameBoxJSON"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mutliGameBoxDialogVisible = false">{{ $t('general.cancel') }}</el-button>
        <el-button type="primary" @click="mutliGameBox">{{ $t('general.apply') }}</el-button>
      </div>
    </el-dialog>

    <!-- Edit -->
    <el-dialog :title="$t('gamebox.edit')" :visible.sync="editGameBoxDialogVisible">
      <el-form label-width="120px">
        <el-form-item :label="$t('gamebox.challenge')">
          {{ editGameBoxForm.ChallengeTitle }}
        </el-form-item>
        <el-form-item :label="$t('gamebox.team')">
          {{ editGameBoxForm.TeamName }}
        </el-form-item>
        <el-form-item :label="$t('gamebox.ip')">
          <el-input v-model="editGameBoxForm.IP"
                    :placeholder="$t('gamebox.ip_placeholder')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('gamebox.port')">
          <el-input v-model="editGameBoxForm.Port"
                    :placeholder="$t('gamebox.port_placeholder')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('gamebox.description')">
          <el-input type="textarea" :rows="3" :placeholder="$t('gamebox.description_placeholder')"
                    v-model="editGameBoxForm.Description">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('gamebox.ssh_port')">
          <el-input v-model="editGameBoxForm.SSHPort"></el-input>
        </el-form-item>
        <el-form-item :label="$t('gamebox.ssh_user')">
          <el-input v-model="editGameBoxForm.SSHUser"></el-input>
        </el-form-item>
        <el-form-item :label="$t('gamebox.ssh_password')">
          <el-input v-model="editGameBoxForm.SSHPassword"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="onEditGameBox">{{ $t('gamebox.edit') }}</el-button>
      <el-button
          @click="testGameBoxSSH(editGameBoxForm.IP, editGameBoxForm.SSHPort, editGameBoxForm.SSHUser, editGameBoxForm.SSHPassword)">
        {{ $t('gamebox.test_ssh') }}
      </el-button>
    </el-dialog>

    <!-- SSH -->
    <el-dialog :title="$t('gamebox.test_ssh_fail')" :visible.sync="sshFailDialogVisible">
      <div v-html="sshFailContent"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sshFailDialogVisible = false">{{ $t('general.apply') }}</el-button>
      </div>
    </el-dialog>

    <!-- New GameBox from docker -->
    <el-dialog title="从镜像部署题目" :visible.sync="dockerImageVisible" width="70%">
      <el-form v-loading="loadingDockerfile">
        <el-input placeholder="your_name/web_challenge:latest" v-model="dockerImageText">
          <template slot="prepend">docker pull</template>
          <el-button slot="append" icon="el-icon-search" @click="getImageData">获取镜像信息</el-button>
        </el-input>
      </el-form>
      <br>
      <div v-if="dockerInfo != null">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form :inline="true" label-width="120px">
              <!-- Challenge -->
              <el-form-item :label="$t('gamebox.challenge_placeholder')">
                <el-select v-model="dockerForm.Challenge"
                           :placeholder="$t('gamebox.challenge_placeholder')">
                  <el-option
                      v-for="challenge in challenges"
                      :key="challenge.ID"
                      :label="challenge.Title"
                      :value="challenge.ID">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="题目 IP">
                <el-input placeholder="题目 IP" v-model="dockerForm.IP"></el-input>
              </el-form-item>
              <el-form-item label="容器端口">
                <el-input placeholder="容器端口" v-model="dockerForm.ServicePort"></el-input>
              </el-form-item>
              <el-form-item label="容器 SSH 端口">
                <el-input placeholder="容器 SSH 端口" v-model="dockerForm.SSHPort"></el-input>
              </el-form-item>
              <br>
              <div style="text-align: center; color:rgba(128,128,128,0.50);">SSH 密码将自动生成</div>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form :inline="true" label-width="120px">
              <el-form-item label="root SSH 用户名">
                <el-input placeholder="root SSH 用户名" v-model="dockerForm.RootSSHName"></el-input>
              </el-form-item>
              <el-form-item label="选手 SSH 用户名">
                <el-input placeholder="选手 SSH 用户名" v-model="dockerForm.UserSSHName"></el-input>
              </el-form-item>
            </el-form>
            题目描述
            <el-input
                :rows="5"
                type="textarea"
                placeholder="请输入内容"
                v-model="dockerForm.Description">
            </el-input>
          </el-col>
        </el-row>

        <el-divider content-position="left">端口映射</el-divider>
        <!-- Ports -->
        <el-form :inline="true" label-width="30px">
          <el-form-item v-for="(port, index) in dockerForm.Ports" v-bind:key="index"
                        style="margin-bottom: 0px;">
            <el-input style="width: 180px;" placeholder="映射端口" v-model="port.Out" size="mini" :min="1"
                      :max="65535">
              <template slot="append"> -> {{ port.In }}
                <el-button icon="el-icon-error" @click="dockerForm.Ports.splice(index, 1)"></el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" label-width="30px">
          <el-form-item>
            <!-- New port input -->
            <el-input
                v-if="inputPortVisible"
                v-model="inputPortValue"
                ref="portInput"
                size="mini"
                @keyup.enter.native="inputPortConfirm"
                @blur="inputPortConfirm"
                minlength="1"
                maxlength="5"
                label="容器内端口"
            >
            </el-input>
            <el-button v-else size="mini" @click="()=>{
                            inputPortVisible = true;
                            this.$nextTick(_ => {
                              this.$refs.portInput.$refs.input.focus();
                            });
                        }">+ 添加端口
            </el-button>
          </el-form-item>
        </el-form>

        <!-- container info -->
        <el-table
            size="mini"
            :data="teams"
            stripe
            max-height="300"
            style="width: 100%">
          <el-table-column
              prop="Name"
              label="队伍名"
              width="180">
          </el-table-column>
          <el-table-column label="端口配置">
            <template slot-scope="scope">
              <el-tag
                  size="mini"
                  v-for="(port, index) in dockerForm.Ports"
                  :key="index"
                  effect="plain"
                  style="margin-right: 10px;"
              >
                {{ Number(port.Out) + scope.$index }} -> {{ port.In }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="容器名">
            <template slot-scope="scope">
              {{ dockerInfo.Name }}_{{ scope.row.Name }}
            </template>
          </el-table-column>
        </el-table>

      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dockerImageVisible = false">取 消</el-button>
        <el-button type="primary" @click="deployFromDocker">添加</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "GameBox",
  data: () => ({
    newGameBoxDialogVisible: false,
    editGameBoxDialogVisible: false,
    mutliGameBoxDialogVisible: false,
    sshFailDialogVisible: false,
    sshTesting: false,

    gameBoxList: null,
    teams: [],
    challenges: [],

    newGameBoxForm: [],
    editGameBoxForm: {
      ChallengeTitle: '',
      TeamName: '',
      IP: '',
      Port: '',
      SSHPort: '',
      SSHUser: '',
      SSHPassword: '',
      Description: ''
    },

    // Docker
    loadingDockerfile: false,
    dockerImageVisible: false,
    inputPortVisible: false,
    inputPortValue: '',
    dockerImageText: 'wuhan005/awd_web:latest',
    dockerImageForm: {      // search form
      User: '',
      Image: '',
      Tag: ''
    },
    dockerInfo: null,      // dockerfile info
    dockerForm: {
      Image: '',
      Challenge: null,
      IP: '',
      ServicePort: '',
      SSHPort: '',
      RootSSHName: '',
      UserSSHName: '',
      Description: `SSH 端口：{{ssh_port}}
SSH 账号：{{ssh_name}}
SSH 密码：{{ssh_password}}`,
      Ports: []
    },

    mutliGameBoxJSON: '',
    sshFailContent: '',

    page: 1,
    per: 10,

    total: 0,
  }),
  async mounted() {
    await this.getTeams()
    await this.getChallenges()
    await this.getGameBoxes()
  },
  methods: {
    getGameBoxes() {
      return new Promise((resolve) => {
        this.utils.GET(`/manager/gameboxes?page=${this.page}&per=${this.per}`).then(res => {
          let gameBox = res.Data
          gameBox.forEach((value, index) => {
            gameBox[index]['ChallengeTitle'] = this.getChallengeByID(value.ChallengeID)['Title']
            gameBox[index]['TeamName'] = this.getTeamByID(value.TeamID)['Name']
          })
          this.gameBoxList = gameBox
          this.total = res.Total
          resolve()
        }).catch(err => {
          this.$message.error(err);
          resolve()
        })
      })
    },

    getTeams() {
      return new Promise((resolve) => {
        this.utils.GET("/manager/teams").then(res => {
          this.teams = res
          resolve()
        }).catch(err => {
          this.$message.error(err);
          resolve()
        })
      })
    },

    async getChallenges() {
      return new Promise((resolve) => {
        this.utils.GET("/manager/challenges").then(res => {
          this.challenges = res
          resolve()
        }).catch(err => {
          this.$message.error(err);
          resolve()
        })
      })
    },

    mutliGameBox() {
      let backup = JSON.parse(JSON.stringify(this.newGameBoxForm))
      try {
        let gameBoxes = JSON.parse(this.mutliGameBoxJSON)
        gameBoxes.forEach((value) => {
          this.newGameBoxForm.push({
            ChallengeID: value.ChallengeID,
            TeamID: value.TeamID,
            IP: value.IP,
            Port: value.Port,
            SSHPort: value.SSHPort !== undefined ? value.SSHPort : '',
            SSHUser: value.SSHUser !== undefined ? value.SSHUser : '',
            SSHPassword: value.SSHPassword !== undefined ? value.SSHPassword : '',
            Description: value.Description
          })
        })
        this.mutliGameBoxDialogVisible = false
        this.mutliGameBoxJSON = ''
      } catch (e) {
        this.$message.error(this.$i18n.t('gamebox.json_parse_error'))
        this.newGameBoxForm = backup
      }
    },

    onNewGameBox() {
      this.utils.POST('/manager/gameboxes', this.newGameBoxForm).then(res => {
        this.newGameBoxDialogVisible = false
        this.getGameBoxes()
        // Clean form
        this.newGameBoxForm = []
        this.$message({message: res, type: 'success'})
      }).catch(err => this.$message.error(err))
    },

    onEditGameBox() {
      this.utils.PUT('/manager/gamebox', this.editGameBoxForm).then(res => {
        this.editGameBoxDialogVisible = false
        this.getGameBoxes()
        this.$message.success(res)
      }).catch(err => this.$message.error(err))
    },

    handleDelete(row) {
      this.utils.DELETE("/manager/gamebox?id=" + row.ID).then(res => {
        this.$message({
          message: res,
          type: 'success'
        });
        this.getGameBoxes()
      }).catch(err => this.$message({message: err, type: 'error'}))
    },

    getChallengeByID(id) {
      let result = null;
      this.challenges.forEach((value) => {
        if (value.ID === id) {
          result = value
        }
      })
      return result
    },

    getTeamByID(id) {
      let result = null;
      this.teams.forEach((value) => {
        if (value.ID === id) {
          result = value
        }
      })
      return result
    },

    getImageData() {
      this.loadingDockerfile = true
      this.dockerImageForm.User = this.dockerImageText.split('/')[0]
      this.dockerImageForm.Image = this.dockerImageText.split('/')[1].split(':')[0]
      this.dockerImageForm.Tag = this.dockerImageText.split(':')[1]

      this.utils.POST('/manager/docker/findImage', this.dockerImageForm).then(res => {
        this.loadingDockerfile = false
        // Set port
        for (let i = 0; i < res.Ports.length; i++) {
          this.dockerForm.Ports.push({In: res.Ports[i], Out: 10000 + i * 1000})
        }
        this.dockerForm.Image = res.Image
        this.dockerInfo = res
      }).catch(err => {
        this.$message({message: err, type: 'error'});
        this.loadingDockerfile = false
      })
    },

    // Add new port
    inputPortConfirm() {
      let inputValue = this.inputPortValue;
      if (inputValue) {
        this.dockerForm.Ports.push({In: inputValue, Out: 0});
      }
      this.inputPortVisible = false;
      this.inputPortValue = '';
    },

    deployFromDocker() {
      this.utils.POST('/manager/docker/deploy', this.dockerForm).then(res => {
        console.log(res)
      }).catch(err => this.$message({message: err, type: 'error'}))
    },

    testAllSSH() {
      this.sshTesting = true
      this.utils.GET("/manager/gameboxes/sshTest").then(res => {
        this.sshTesting = false
        if (res === null) {
          return this.$message.success(this.$i18n.t("gamebox.test_ssh_success"))
        }

        this.sshFailContent = ''
        res.forEach(item => {
          this.sshFailContent += `<strong>TeamID：</strong>${item.TeamID}<br><strong>ChallengeID：</strong>${item.ChallengeID}<br><strong>GameBoxID：</strong>${item.GameBoxID}<br><strong>Error：</strong>${item.Error}<hr>`
        })
        this.sshFailDialogVisible = true
      })
    },

    testGameBoxSSH(IP, Port, User, Password) {
      this.$prompt(this.$t('gamebox.input_shell_command'), '', {
        confirmButtonText: this.$t('general.apply'),
        cancelButtonText: this.$t('general.cancel'),
      }).then(({value: Command}) => {
        this.utils.POST('/manager/gameboxes/sshTest', {
          IP, Port, User, Password, Command
        }).then(res => this.$alert(res, this.$t('general.success'))
        ).catch(err => this.$alert(err, this.$t('general.fail'))
        )
      }).catch(() => {
      });
    },

    refreshFlag() {
      this.utils.GET('/manager/gameboxes/refreshFlag')
          .then(res => this.$message.success(res))
          .catch(err => this.$message.error(err))
    },

    resetGameBox() {
      this.utils.GET('/manager/gameboxes/reset')
          .then(res => this.$message.success(res))
          .catch(err => this.$message.error(err))
    }
  }
}
</script>

<style scoped>

</style>