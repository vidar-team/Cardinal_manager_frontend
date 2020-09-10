<template>
    <div>
        <el-button type="primary" @click="imageListVisible = true">镜像列表</el-button>
        <el-button type="primary" @click="dockerImageVisible = true">拉取镜像</el-button>
        <!--        <file-select button-text="选择目录" :folder-only="true"></file-select>-->

        <!-- Pull Image -->
        <el-dialog title="从镜像部署题目" :visible.sync="dockerImageVisible" width="50%">
            <el-form v-loading="loadingDockerfile">
                <el-input placeholder="your_name/web_challenge:latest" v-model="dockerImageText">
                    <template slot="prepend">docker pull</template>
                    <el-button slot="append" icon="el-icon-search" @click="getImageData">获取镜像信息</el-button>
                </el-input>
            </el-form>
            <div v-if="imageInfo !== null">
                <br>
                <b>镜像名</b> {{imageInfo.Image}} <br>
                <b>架构</b> {{imageInfo.Architecture}} <br>
                <b>SHA</b> {{imageInfo.Digest}} <br>
                <b>端口</b>
                <el-tag v-for="(port, index) in imageInfo.Ports" v-bind:key="index"> {{port}}</el-tag>
                <br> <br>
                <el-button type="primary" @click="pullImage" v-if="imageInfo !== null">拉取镜像</el-button>
            </div>
            <br>
            <div class="output" v-if="taskLogVisible">
                <div class="output-content" v-loading="loadingMessageList">
                    <table class="output-lines">
                        <tbody class="output-tbody" ref="outputTableBody">
                        <tr v-for="(line, index) in messageList" v-bind:key="index">
                            <td class="ol-pos">{{index+1}}</td>
                            <td class="ol-html">{{line}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </el-dialog>

        <!-- Image List -->
        <el-dialog title="镜像列表" :visible.sync="imageListVisible" width="800px">
            <el-table
                    :data="images"
                    border
                    size="mini"
                    :stripe="true"
                    style="width: 100%">
                <el-table-column
                        fixed
                        label="镜像名"
                        width="150">
                    <template slot-scope="scope">
                        <b>{{scope.row.RepoTags[0]}}</b>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed
                        label="大小"
                        width="150">
                    <template slot-scope="scope">
                        {{fileSize(scope.row.Size)}}
                    </template>
                </el-table-column>
                <el-table-column
                        fixed
                        label="SHA"
                        width="350">
                    <template slot-scope="scope">
                        {{scope.row.Id.substr(7)}} <!-- Remove sha256: -->
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button plain type="danger" size="mini" @click="deleteImage(scope.row.Id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dockerImageVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- Container List -->
        <el-table
                :data="containers"
                border
                size="mini"
                :stripe="true"
                style="width: 100%">
            <el-table-column
                    fixed
                    label="容器名"
                    width="150">
                <template slot-scope="scope">
                    <b>{{scope.row.Names[0].substr(1)}}</b> <!-- Remove the / -->
                </template>
            </el-table-column>
            <el-table-column
                    label="状态"
                    width="100">
                <template slot-scope="scope">
                    <div v-if="scope.row.State === 'running'">
                        <el-tag type="success">{{scope.row.State}}</el-tag>
                    </div>
                    <div v-else>
                        <el-tag type="info">{{scope.row.State}}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="关联靶机"
                    width="200">
                <template>
                    <el-button type="text"></el-button>
                </template>
            </el-table-column>
            <el-table-column
                    label="镜像名"
                    width="250">
                <template slot-scope="scope">
                    {{scope.row.Image}}
                </template>
            </el-table-column>
            <el-table-column
                    label="端口信息"
                    width="250">
                <template slot-scope="scope">
                    <div v-if="scope.row.Ports.length === 0">
                        -
                    </div>
                    <div v-else>
                        <div v-for="(item, index) in scope.row.Ports" v-bind:key="index">
                            {{item.PrivatePort}}
                            <span v-if="item['PublicPort'] !== undefined">
                            -> {{item.PublicPort}}
                        </span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="说明"
                    width="200">
                <template slot-scope="scope">
                    {{scope.row.Status}}
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                <template slot-scope="scope">
                    <div v-if="scope.row.State === 'running'">
                        <el-button plain type="warning" size="mini" @click="stopContainer(scope.row.Id)">停止</el-button>
                    </div>
                    <div v-else>
                        <el-button plain type="success" size="mini" @click="startContainer(scope.row.Id)">开启</el-button>
                        <el-button plain type="danger" size="mini" @click="deleteContainer(scope.row.Id)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>


    </div>
</template>

<script>
    // import FileSelect from "../components/FileSelect";
    import Humanize from 'humanize-plus';

    export default {
        name: "Docker",
        data() {
            return {
                loading: false,
                // list
                containers: [],
                images: [],

                loadingDockerfile: false,
                dockerImageVisible: false,
                imageListVisible: false,
                dockerImageText: 'wuhan005/awd_web:latest',
                dockerImageForm: {
                    User: '',
                    ImageName: '',
                    Tag: ''
                },
                imageInfo: null,

                ports: [],
                treeData: [],

                teamList: [],

                // task log
                taskLogVisible: false,
                loadingMessageList: true,
                messageList: [],
            }
        },

        mounted() {
            this.getTeams()
            this.getImageList()
            this.getContainerList()
        },
        methods: {
            getTeams() {
                this.utils.GET("/manager/teams").then(res => {
                    this.teamList = res
                }).catch(err => this.$message.error(err))
            },

            getContainerList() {
                this.utils.GET('/manager/docker/containers').then(res => {
                    this.containers = res
                }).catch(err => this.$message.error(err))
            },

            getImageList() {
                this.utils.GET('/manager/docker/images').then(res => {
                    this.images = res
                }).catch(err => this.$message.error(err))
            },

            getImageData() {
                this.loadingDockerfile = true
                this.dockerImageForm.User = this.dockerImageText.split('/')[0]
                this.dockerImageForm.ImageName = this.dockerImageText.split('/')[1].split(':')[0]
                this.dockerImageForm.Tag = this.dockerImageText.split(':')[1]

                this.utils.POST('/manager/docker/image/find', this.dockerImageForm).then(res => {
                    this.loadingDockerfile = false
                    for (let i = 0; i < res.Ports.length; i++) {
                        this.ports.push({'from': res.Ports[i], 'to': null})
                    }
                    this.imageInfo = res
                }).catch(err => {
                    this.$message({message: err, type: 'error'});
                    this.loadingDockerfile = false
                })
            },

            pullImage() {
                this.utils.POST('/manager/docker/image/pull', {
                    Image: this.imageInfo.Image,
                }).then(res => {
                    this.loadingMessageList = true

                    let id = res
                    this.messageList = []
                    const events = new EventSource(`${this.utils.baseURL}/livelog/${id}`);

                    events.onopen = () => {
                        this.taskLogVisible = true
                    }

                    events.addEventListener("message", (event) => {
                        this.loadingMessageList = false

                        // Handler the message
                        let data = JSON.parse(event.data)
                        let type = data.Type
                        let message = data.Message
                        if (type === 'end') {
                            this.$message.success("拉取完成！")
                            this.getImageList() // Refresh the image list.
                            events.close()
                        } else {
                            this.messageList.push(`${message.status} ${message.error} ${message.progress}`)
                        }

                        this.$refs.outputTableBody.scrollTop = this.$refs.outputTableBody.scrollHeight
                    })

                    events.addEventListener("eof", () => {
                        events.close()
                    })

                    events.onerror = () => {
                        this.loadingMessageList = true
                        this.messageList = []
                        this.taskLogVisible = false
                    }
                }).catch(err => {
                    this.$message({message: err, type: 'error'});
                })
            },

            deleteImage(imageId) {
                this.utils.DELETE(`/manager/docker/image?imageId=${imageId}`).then(res => {
                    this.$message.success(res)
                    this.getImageList()
                }).catch(err => {
                    this.$message({message: err, type: 'error'});
                })
            },

            startContainer(containerId) {
                this.utils.POST('/manager/docker/container/start', {
                    ContainerId: containerId
                }).then(res => {
                    this.$message.success(res)
                    this.getContainerList()
                }).catch(err => this.$message.error(err))
            },

            stopContainer(containerId) {
                this.utils.POST('/manager/docker/container/stop', {
                    ContainerId: containerId
                }).then(res => {
                    this.$message.success(res)
                    this.getContainerList()
                }).catch(err => this.$message.error(err))
            },

            deleteContainer(containerId) {
                this.utils.DELETE(`/manager/docker/container?containerId=${containerId}`).then(res => {
                    this.$message.success(res)
                    this.getContainerList()
                }).catch(err => this.$message.error(err))
            },

            fileSize(size) {
                return Humanize.fileSize(size)
            }
        },
        // components: {FileSelect}
    }
</script>

<style scoped>
    .output {
        color: #fff;
        font-size: 12px;
        font-family: Menlo, Courier, monospace;
        font-weight: 300;
        background-color: #1e375a;
        border-radius: 6px;
        -webkit-box-shadow: 0 0 8px 1px #e8eaed;
        box-shadow: 0 0 8px 1px #e8eaed;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 0;
    }

    .output-content {
        padding: 15px 0;
    }

    .output-lines {
        width: 100%;
        line-height: 19px;
        border-collapse: collapse;
        border-spacing: 0;
    }

    .output-tbody {
        display: inline-block;
        width: 100%;
        overflow: auto;
        max-height: 400px;
    }

    .ol-pos {
        padding: 0 10px 0 15px;
        color: #8c96a1;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        white-space: nowrap;
        width: 1px;
    }

    .ol-html {
        word-break: break-word;
        white-space: pre-wrap;
        padding-right: 15px;
    }
</style>