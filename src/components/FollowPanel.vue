<template>
<div class="follow-wrapper">
    <div class="comment-search-btn" v-if="tabActiveName == 'first'" @click.stop="searchBtnHandle">
        <i class="el-icon-search"></i>
    </div>
    <el-tabs v-model="tabActiveName" type="border-card" @tab-click="tabActiveHandle">
        <el-tab-pane label="跟踪记录" name="first">
            <div class="comment-post">
                <div class="comment-input">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 5}"
                        placeholder="请输入内容..."
                        v-model="followTextVal">
                    </el-input>
                </div>
                <div class="comment-option clearFix">
                    <el-select class="fl" v-model="contact.type" placeholder="请选择联系类型">
                        <el-option
                            v-for="(item, key) in contact.list"
                            :key="key"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button class="fr" type="primary" @click.stop="submitHandle">发 表</el-button>
                    <el-date-picker class="contact-date fr"
                        v-model="remindDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="下次联系时间"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
                <transition name="comment">
                <div v-if="isRemindBox">
                    <div class="comment-input comment-remind">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 3, maxRows: 5}"
                            placeholder="请输入内容..."
                            v-model="remindText">
                        </el-input>
                    </div>
                    <div class="comment-option tr">
                        <el-button type="text" @click.stop="cancelNextHandle">取消下次提醒</el-button>
                    </div>
                </div>
                </transition>
            </div>
            <transition name="search">
            <div class="comment-search" v-if="isSearchBox">
                <div class="search-box tr">
                    <el-input
                        placeholder="请输入评论内容..."
                        prefix-icon="el-icon-search"
                        v-model="searchVal">
                    </el-input>
                    <el-button type="primary" @click.stop="searchHandle">搜 索</el-button>
                </div>
                <div class="search-up-btn" @click.stop="searchBtnHandle">
                    收起
                </div>
            </div>
            </transition>
            <div class="comment-list">
                <div class="comment-item" v-for="(item, key) in followList" :key="key">
                    <h4 class="hd">{{ getPersonalInfo.name }}</h4>
                    <div class="content">{{ item.remark }}</div>
                    <div class="control clearFix">
                        <span class="time fl">联系时间：{{ item.modify_time }}</span>
                        <span class="time fl">联系方式：{{ item.contact_type_name }}</span>
                        <div class="actions fr">
                            <a class="edit" href="javascript:;" @click.stop="EditItemHandle(item)">
                                <i class="el-icon-edit"></i> 编辑
                            </a>
                        </div>
                    </div>
                    <transition name="comment">
                    <div class="edit-box" v-if="item.isEdit">
                        <div class="edit-input">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 3}"
                                placeholder="请输编辑入内容..."
                                v-model="item.remark">
                            </el-input>
                        </div>
                        <div class="tr">
                            <el-select class="fl" v-model="item.contact_type" size="small">
                                <el-option
                                v-for="(item, key) in contact.list"
                                :key="key"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button size="small" @click.stop="cancelRemarkHandle(item)">取消</el-button>
                            <el-button size="small" @click.stop="modRemarkHandle(item)">修改</el-button>
                        </div>
                    </div>
                    </transition>
                </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="联系提醒" name="second">
            <el-table class="remind-table"
                :data="remindList"
                border
                style="width: 100%">
                <el-table-column
                    prop="content"
                    label="内容">
                </el-table-column>
                <el-table-column
                    prop="remind_date"
                    label="日期"
                    width="120">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button @click.stop="cutFinishHandle(scope.row)" type="text">{{ scope.row.finish == '1' ? '完成　' : '未完成' }}</el-button>
                        <el-button @click.stop="modRemindHandle(scope.row)" type="text">修改</el-button>
                        <el-button @click.stop="delItemHandle(scope.row.id)" type="text">删除</el-button>
                    </template>
            </el-table-column>
        </el-table>
        </el-tab-pane>
    </el-tabs>
    <el-dialog title="联系提醒" 
        :visible.sync="dialogVisible" 
        :append-to-body="true"
        :before-close="cancelRemindHandle"
        @click.stop.native="">
        <div class="remind-wrapper">
            <div class="app-form-item">
                <label class="app-form-label">联系时间</label>
                <div class="app-input-block">
                    <el-date-picker class="contact-date"
                        v-model="remind.lxdate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="联系时间"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
            </div>
            <div class="app-form-item">
                <label class="app-form-label">联系类型</label>
                <div class="app-input-block">
                    <el-select class="fl" v-model="remind.lxtype">
                        <el-option
                            v-for="(item, key) in remind.lxlist"
                            :key="key"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="app-form-item">
                <label class="app-form-label">联系信息</label>
                <div class="app-input-block">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 5}"
                        placeholder="请输入内容..."
                        v-model="remind.lxtext">
                    </el-input>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click.stop="cancelRemindHandle">取 消</el-button>
            <el-button type="primary" @click.stop="submitRemindHandle">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    name: 'FollowPanel',
    props: {
        params: Object
    },
    data(){
        return {
            itemId: this.params.itemId,
            tabActiveName: 'first', // 选项卡默认选中
            isSearchBox: false, // 是否显示搜索栏
            isRemindBox: false, // 是否显示提醒栏
            followTextVal: '', // 跟踪内容
            remindDate: '', // 提醒日期
            remindText: '', // 提醒内容
            searchVal: '', // 搜索内容
            followList: [], // 跟踪记录列表
            contact: {
                type: '', // 联系类型
                name: '', // 联系的名称
                list: []  // 联系方式数组
            },
            dialogVisible: false, // 是否显示 dialog(修改提醒组件)
            remindList: [], // 提醒列表
            remind: { // 修改提醒的数组列表
                id: '',
                lxdate: '',
                lxtype: '',
                lxlist: [],
                lxtext: ''
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now()
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'getPersonalInfo'
        ])
    },
    watch: {
        remindDate(newVal, oldVal){
            if (newVal != ''){
                this.isRemindBox = !0
            } else {
                this.isRemindBox = !1
            }
        }
    },
    methods: {
        getCommentList(curPage){
            const _this = this
            this.$http.get('/safe/track/query', {
                params: {
                    std_id: _this.params.itemId,
                    pageNum: curPage,
                    pageSize: 20,
                    keyword: _this.searchVal,
                    contact_type: _this.contact.type
                }
            })
            .then(function (response){
                // console.log(response.data)
                for (let i = 0; i < response.data.list.length; i++){
                    response.data.list[i].isEdit = !1
                }
                _this.followList = response.data.list
            })
        },
        getRemindList(){
            const _this = this
            this.$http.get('/safe/remind/query', {
                params: {
                    std_id: _this.params.itemId
                }
            })
            .then(function (response){
                // console.log(response.data)
                _this.remindList = response.data.list
            })
        },
        getContactList(){
            const _this = this
            this.$http.get('/safe/dict/showContactType', {
                params: {}
            })
            .then(function (response){
                // console.log(response.data)
                if (response.data.code == 1){
                    _this.contact.list  = response.data.result
                    _this.remind.lxlist = response.data.result
                }
            })
        },
        submitHandle(){
            const _this = this
            
            if (this.contact.type == ''){
                return _this.$message({
                    type: 'warning',
                    message: '必须选择联系类型!'
                })
            }
            if (this.followTextVal == ''){
                return _this.$message({
                    type: 'warning',
                    message: '必须输入跟踪内容!'
                })
            }

            this.$http.post('/safe/track/save', {
                std_id: _this.params.itemId,
                remark: _this.followTextVal,
                contact_type: _this.contact.type,
                remind_date: _this.remindDate,
                remind_content: _this.remindText
            })
            .then(function (response){
                // console.log(response.data)
                if (response.data.code == 1){
                    response.data.result.isEdit = !1
                    _this.followList.unshift(response.data.result)
                    _this.followTextVal = ''
                } else {
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            })
        },
        cancelNextHandle(){
            this.remindDate = ''
            this.remindText = ''
        },
        searchHandle(){
            this.getCommentList(1)
        },
        searchBtnHandle(){
            this.isSearchBox = !this.isSearchBox
        },
        EditItemHandle(item){
            item.isEdit = !item.isEdit
        },
        modRemarkHandle(item){
            const _this = this
            // console.log(item)
            this.$http.post('/safe/track/updateById', {
                id: item.id,
                contact_type: item.contact_type,
                remark: item.remark
            })
            .then(function (response){
                // console.log(response.data)
                if (response.data.code == 1){
                    _this.getCommentList(1)
                    item.isEdit = !1
                    _this.$message({
                        type: 'success',
                        message: '学员跟踪修改成功!'
                    })
                } else {
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            })
        },
        cancelRemarkHandle(item){
            this.getCommentList(1)
            item.isEdit = !1
        },
        cutFinishHandle(item){
            let tmp = item.finish == '1' ? '0' : '1'
            this.$http.get('/safe/remind/finish', {
                params: {
                    id: item.id,
                    finish: tmp
                }
            })
            .then(function (response){
                if (response.data.code == 1){
                    item.finish = tmp
                } else {
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            })
        },
        modRemindHandle(item){
            this.dialogVisible = !0

            this.remind.id = item.id
            this.remind.lxdate = item.remind_date
            this.remind.lxtype = item.contact_type
            this.remind.lxtext = item.content
        },
        delItemHandle(_id){
            const _this = this
            this.$confirm('此操作将永久删除联系提醒, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.$http.get('/safe/remind/deleteById', {
                    params: {
                        id: _id
                    }
                }).then(function (response){
                    if (response.data.code == 1){
                        _this.removeItemById(_id)
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    } else {
                        _this.$message({
                            type: 'error',
                            message: response.data.message
                        })
                    }
                })
            }).catch(() => {})
            // 绑定事件
            document.getElementsByClassName('el-message-box__wrapper')[0]
            .addEventListener('click', ev => ev.stopPropagation(), false)
        },
        cancelRemindHandle(){
            this.dialogVisible = !1
        },
        submitRemindHandle(){
            const _this = this
            if (this.remind.lxtext == ''){
                return _this.$message({
                    type: 'warning',
                    message: '必须输入联系提醒内容!'
                })
            }
            this.$http.post('/safe/remind/updateById', {
                id: _this.remind.id,
                remind_date: _this.remind.lxdate,
                remind_content: _this.remind.lxtext,
                contact_type: _this.remind.lxtype
            })
            .then(function (response){
                if (response.data.code == 1){
                    _this.dialogVisible = !1
                    // 重新加载提醒数据
                    _this.getRemindList()
                    _this.$message({
                        type: 'success',
                        message: '联系提醒修改成功!'
                    })
                } else {
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            })
        },
        removeItemById(_id){
            for (let i = 0; i < this.remindList.length; i++){
                if (this.remindList[i].id == _id){
                    this.remindList.splice(i, 1)
                    break
                }
            }
        },
        tabActiveHandle(){
            if (this.tabActiveName == 'second' && this.remindList.length == 0){
                this.getRemindList()
            }
        }
    },
    created(){
        this.getCommentList(1)
        this.getContactList()
    }
}
</script>

<style>
.follow-wrapper {
    margin: 15px;
    position: relative;
}

/* 跟踪记录操作栏 */
.comment-search-btn {
    position: absolute;
    right: 18px;
    top: 10px;
    z-index:9;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}
.comment-search:hover {
    color: #409eff;
}
.comment-post {
    padding-bottom: 15px;
    position: relative;
}
.comment-input {}
.comment-remind {
    margin-top: 15px;
}
.comment-option {
    padding-top: 15px;
}
.comment-option .contact-date {
    margin-right: 15px;
}
.comment-search {
    height: 96px;
    overflow: hidden;
}
.comment-search::before {
    content: '';
    display: block;
    width: 100%;
    height: 0;
    border-top: 1px solid #dedede;
}
.comment-search .search-box {
    margin-top: 15px;
}
.comment-search .search-box .el-input {
    width: 200px;
    margin-right: 10px;
}
.comment-search .search-up-btn {
    text-align: center;
    cursor: pointer;
    margin-top: 15px;
    line-height: 24px;
    border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
    background: #fafafa;
}

/* 跟踪记录列表栏 */
.comment-list {}
.comment-item {
    padding: 10px 18px;
    border-top: 1px dashed #dedede;
    position: relative;
}
.comment-item:hover {
    background: #f7fdff;
}
.comment-item:last-of-type {
    border-bottom: none;
}
.comment-item .hd {
    height: 20px;
    line-height: 20px;
    color: #409eff;
}
.comment-item .content {
    word-wrap: break-word;
    word-break: break-all;
    line-height: 24px;
}
.comment-item .control {
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    margin-top: 4px;
}
.comment-item .control .time {
    color: #bbb;
    margin-right: 20px;
}
.comment-item .actions .edit {
    font-size: 14px;
    color: #8899a6;
}
.comment-item .actions .edit:hover {
    color: #409eff;
}
.comment-item .edit-box {
    background-color: #f2f2f2;
    min-height: 100px;
    padding-bottom: 10px;
    margin-top: 5px;
}
.comment-item .edit-box .edit-input {
    padding: 10px;
}
.comment-item .edit-box .tr {
    padding: 0 10px;
}



/* 联系提醒列表 */
.remind-table .el-table__body-wrapper {
    overflow-x: hidden;
}
.remind-table .el-button {
    padding: 0;
}

/* 跟踪记录元素切换动画样式 */
.comment-enter-active, .comment-leave-active {
    -webkit-transition: all .4s ease;
    transition: all .4s ease;
}
.comment-enter, .comment-leave-to {
    opacity: 0
}

.search-enter-active, .search-leave-active {
    -webkit-transition: all .4s ease;
    transition: all .4s ease;
}
.search-enter, .search-leave-to {
    height: 0;
}
.search-enter-to, .search-leav {
    height: 96px;
}
</style>