<template>
    <div>
        <el-drawer
                :visible.sync="taskVisible"
                direction="rtl"
                :with-header="false">
            <div style="padding: 20px;">
                <el-page-header @back="taskVisible = false" content="任务队列"
                                style="margin-bottom: 20px;"></el-page-header>
                <div v-for="(num, id) in taskList" :key="id" @click="showTaskLog(id)">
                    <el-card>
                        {{id}}
                    </el-card>
                </div>
            </div>
        </el-drawer>
        <el-dialog title="任务日志" :visible.sync="taskLogVisible">
            <div class="output">
                <div class="output-content" v-loading="loadingMessageList">
                    <table class="output-lines">
                        <tbody class="output-tbody" ref="outputTableBody">
                        <tr v-for="(line, index) in messageList" v-bind:key="index">
                            <td class="ol-pos">{{index+1}}</td>
                            <td class="ol-html">{{line.Message}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {Base64} from 'js-base64';

    export default {
        name: "TaskView",

        props: {
            visible: Boolean
        },

        data() {
            return {
                taskList: null,
                taskLogVisible: false,
                loadingMessageList: true,
                messageList: []
            }
        },

        computed: {
            taskVisible: {
                get() {
                    this.getTasks()
                    return this.visible
                },
                set() {
                    this.getTasks()
                    this.$emit('visibleChange', !this.visible)
                }
            }
        },

        methods: {
            getTasks() {
                this.utils.GET('/manager/tasks').then(res => {
                    this.taskList = res
                }).catch(err => this.$message({message: err, type: 'error'}))
            },

            showTaskLog(id) {
                this.loadingMessageList = true
                this.messageList = []
                this.taskLogVisible = true
                const events = new EventSource(`${this.utils.baseURL}/task/log?taskID=${id}`);

                events.onopen = () => {
                    this.loadingMessageList = false
                }

                events.addEventListener("message", (event) => {
                    this.$refs.outputTableBody.scrollTop = this.$refs.outputTableBody.scrollHeight
                    let data = JSON.parse(Base64.decode(event.data));
                    this.messageList.push(data)
                })

                events.addEventListener("eof", () => {
                    events.close()
                    this.getTasks()
                })

                events.onerror = () => {
                    this.loadingMessageList = true
                    this.messageList = []
                    this.taskLogVisible = false
                    this.getTasks()
                }
            }
        },
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
        max-height: 500px;
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