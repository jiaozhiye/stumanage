<template>
<div class="stuManager-wrapper">
    <div class="student-top">
        <el-button class="fl" @click.stop="addStudentHandle">新增学员</el-button>
        <el-dropdown class="fl" placement="top-start" trigger="click">
            <el-button>
                操 作 <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.stop.native="allotStudentHandle">分配学员</el-dropdown-item>
                <el-dropdown-item @click.stop.native="sendStuPoolHandle">退回学员池</el-dropdown-item>
                <el-dropdown-item @click.stop.native="importHandle">导入操作</el-dropdown-item>
                <el-dropdown-item @click.stop.native="exportHandle">导出操作</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <ul class="fr">
            <el-menu class="app-dropdown fl" mode="horizontal">
                <el-submenu index="1">
                    <template slot="title">标签</template>
                    <LabelSearchPanel :params="search.labels" @searchEvent="searchHandle"></LabelSearchPanel>
                </el-submenu>
            </el-menu>
            <el-select class="fl" v-model="search.statusId" @change="searchHandle" placeholder="请选择状态">
                <el-option
                    v-for="(item, key) in statusList"
                    :key="key"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select class="fl" v-model="search.schoolId" @change="searchHandle" placeholder="请选择学校">
                <el-option
                    v-for="(item, key) in schoolList"
                    :key="key"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-input class="fl" placeholder="姓名/拼音头/电话/qq" prefix-icon="el-icon-search"
                v-model="search.searchVal" @keyup.enter.native="searchHandle">
            </el-input>
        </ul>
    </div>
    <div class="student-list">
        <el-table :data="list" border tooltip-effect="dark" style="width:100%"
            v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" fixed></el-table-column>
            <el-table-column prop="name" label="姓名" width="100" sortable></el-table-column>
            <el-table-column prop="gender" label="性别" width="50"></el-table-column>
            <el-table-column label="手机号" width="130">
                <el-tooltip placement="top" slot-scope="scope">
                    <div slot="content" style="font-size:24px">{{ scope.row.phone | formatPhone }}</div>
                    <span>{{ scope.row.phone }}</span>
                </el-tooltip>
            </el-table-column>
            <el-table-column prop="school_name" label="学校" width="200"></el-table-column>
            <el-table-column prop="speciality_name" label="专业" width="200"></el-table-column>
            <el-table-column prop="school_year" label="入学时间" width="120" sortable></el-table-column>
            <el-table-column prop="class" label="班级" width="100"></el-table-column>
            <el-table-column prop="status_name" label="状态" width="100" sortable></el-table-column>
            <el-table-column prop="source_name" label="来源" width="100"></el-table-column>
            <el-table-column prop="owner_name" label="所有者" width="120"></el-table-column>
            <el-table-column label="标签" width="400">
                <template slot-scope="scope">
                    <el-tag size="medium" v-for="tag in scope.row.tag_name" :key="tag" :type="getTagStyle()">
                        {{ tag }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250" fixed="right">
                <template slot-scope="scope">
                    <el-button @click.stop="dialogHandle(scope.row)" type="text">标签</el-button>
                    <el-button @click.stop="followHandle(scope.row)" type="text">{{ scope.row.follow == '1' ? '关注　' : '非关注' }}</el-button>
                    <el-button @click.stop="trackHandle(scope.row.id)" type="text">跟踪</el-button>
                    <el-button @click.stop="modItemHandle(scope.row.id)" type="text">修改</el-button>
                    <el-button @click.stop="delItemHandle(scope.row.id)" type="text">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next, jumper"
            :total="list.total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <Extract :params="addStudentExtract">
        <AddStudentPanel :params="addStudentExtract" @reloadEvent="reloadGetData"></AddStudentPanel>
    </Extract>
    <Extract :params="modStudentExtract">
        <ModStudentPanel :params="modStudentExtract" @reloadEvent="reloadGetData"></ModStudentPanel>
    </Extract>
    <el-dialog title="添加标签" 
        :visible.sync="dialogTagVisible" 
        :before-close="cancelTagHandle"
        :append-to-body="true">
        <LabelPanel :label-list="stuTagList"></LabelPanel>
        <span slot="footer" class="dialog-footer">
            <el-button @click.stop="cancelTagHandle">取 消</el-button>
            <el-button type="primary" @click.stop="submitTagHandle">确 定</el-button>
        </span>
    </el-dialog>
    <Extract :params="allotStudentExtract">
        <AllotStudentPanel :params="allotStudentExtract" @reloadEvent="reloadGetData"></AllotStudentPanel>
    </Extract>
    <Extract :params="followStudentExtract">
        <FollowPanel :params="followStudentExtract"></FollowPanel>
    </Extract>
    <el-dialog
        title="提示"
        :visible.sync="dialogFileVisible"
        width="30%"
        :append-to-body="true">
        <component v-bind:is="currentView" :params="search"></component>
    </el-dialog>
</div>
</template>

<script>
import Extract from './Extract.vue'
import AddStudentPanel from './AddStudentPanel.vue'
import ModStudentPanel from './ModStudentPanel.vue'
import LabelSearchPanel from './LabelSearchPanel.vue'
import LabelPanel from './LabelPanel.vue'
import AllotStudentPanel from './AllotStudentPanel.vue'
import FollowPanel from './FollowPanel.vue'
import ImportPanel from './ImportPanel.vue'
import ExportPanel from './ExportPanel.vue'
import {cloneObj, getRandom, getLocationHash} from 'common/js/tools'

export default {
    name: 'StuManager',
    data(){
        return {
            hashSite: '', // 页面 hash 地址
            list: [], // 数据列表
            curPageIndex: 1, // 当前页码
            curItemId: '', // 当前选中数据的 ID
            statusList: [],
            schoolList: [],
            stuTagList: [],
            copyTagList: [], // 复制标签数组，以便撤销操作
            search: {
                labels: [],
                statusId: '',
                schoolId: '',
                searchVal: ''
            },
            dialogTagVisible: false, // 标签检索组件
            dialogFileVisible: false, // 导入导出组件
            loading: false,
            currentView: 'ImportPanel',
            addStudentExtract: {
                isPlay: false,
                promptTitle: '新增学员'
            },
            modStudentExtract: {
                isPlay: false,
                promptTitle: '修改学员信息'
            },
            allotStudentExtract: {
                isPlay: false,
                promptTitle: '分配学员',
                checkedKeys: [],
                expandedKeys: [],
                studentIds: []
            },
            followStudentExtract: {
                isPlay: false,
                promptTitle: '跟踪学员'
            }
        }
    },
    methods: {
        addStudentHandle(){
            this.addStudentExtract.isPlay = !0
        },
        allotStudentHandle(){
            if (this.allotStudentExtract.studentIds.length == 0){
                return this.$message({
                    type: 'warning',
                    message: '请先选择学员，然后再进行分配!'
                })
            }
            this.allotStudentExtract.isPlay = !0
            // 隐藏其他组件
            this.addStudentExtract.isPlay = !1
            this.modStudentExtract.isPlay = !1
        },
        sendStuPoolHandle(){
            if (this.allotStudentExtract.studentIds.length == 0){
                return this.$message({
                    type: 'warning',
                    message: '请先选择学员，然后再退回学员池!'
                })
            }
            const _this = this
            this.$confirm('把该学员退回学员池, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.$http.get('/safe/student/backPool', {
                    params: {
                        ids: _this.allotStudentExtract.studentIds
                    }
                })
                .then(function (response){
                    if (response.data.code == 1){
                        _this.$message({
                            type: 'success',
                            message: '退回学员池成功!'
                        })
                    } else {
                        _this.$message({
                            type: 'error',
                            message: response.data.message
                        })
                    }
                })
            }).catch(() => {})
        },
        modItemHandle(_id){
            this.modStudentExtract.isPlay = !0
            this.modStudentExtract.itemId = _id
        },
        delItemHandle(_id){
            const _this = this
            this.$confirm('此操作将永久删除该学员, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.$http.get('/safe/student/deleteById', {
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
        },
        dialogHandle(item){
            this.curItemId = item.id
            this.dialogTagVisible = !0
            this.stuTagList = item.tag_name
            // 复制一份原始数据
            this.copyTagList = cloneObj(item.tag_name)
        },
        submitTagHandle(){
            this.dialogTagVisible = !1
            const _this = this
            this.$http.get('/safe/student/modifyTag', {
                params: {
                    id: _this.curItemId,
                    tags: _this.stuTagList.join(',')
                }
            })
            .then(function (response){
                if (response.data.code == 1){
                    _this.$message({
                        type: 'success',
                        message: '标签添加成功!'
                    })
                } else {
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            })
        },
        cancelTagHandle(){
            this.dialogTagVisible = !1
            for (let i = 0; i < this.list.length; i++){
                if (this.list[i].id == this.curItemId){
                    // 撤销标签的操作
                    this.list[i].tag_name = this.copyTagList
                    break
                }
            }
        },
        followHandle(item){
            let tmp = item.follow == '1' ? '0' : '1'
            this.$http.get('/safe/student/follow', {
                params: {
                    id: item.id,
                    follow: tmp
                }
            })
            .then(function (response){
                if (response.data.code == 1){
                    item.follow = tmp
                } else {
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            })
        },
        trackHandle(_id){
            this.followStudentExtract.isPlay = !0
            this.followStudentExtract.itemId = _id
        },
        getStudentList(curPage, callback){
            const _this = this
            
            if (typeof curPage == 'undefined'){
                curPage = this.curPageIndex
            }
            
            // 我的学员、我的关注学员 接口地址
            let _url = '/safe/student/query'
            
            let _tags = []
            for (let i = 0; i < this.search.labels.length; i++){
                _tags[i] = this.search.labels[i].value
            }
            // 参数对象
            let _params = {
                pageNum: curPage,
                pageSize: 10,
                keyword: this.search.searchVal,
                status: this.search.statusId,
                school: this.search.schoolId,
                tags: _tags.join(',')
            }

            // 我的关注学员追加的查询条件
            if (this.hashSite == 'followStdMgr'){
                _params.follow = 1
            }

            // 学员池 的接口地址
            if (this.hashSite == 'studentPool'){
                _url = '/safe/student/adminQuery'
            }

            // 部门学员 的接口地址
            if (this.hashSite == 'saleDeptStudents'){
                _url = '/safe/student/mgrQuery'
            }

            this.loading = !0
            
            this.$http.get(_url, {
                params: _params
            })
            .then(function (response){
                // console.log(response.data.list)
                if (response.data.code == -1){
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
                _this.list = response.data.list || []
                _this.list.total = response.data.totalRow || 0
                _this.loading = !1
                callback && callback()
            })
            .catch(function (error){
                _this.loading = !1
            })
        },
        getInfoList(url, listname){
            const _this = this
            this.$http.get(url, {
                params: {}
            })
            .then(function (response){
                // console.log(response.data)
                if (response.data.code == 1){
                    _this[listname] = response.data.result
                }
            })
        },
        handleSelectionChange(arr){
            // console.log(arr)
            let _arr1 = [], _arr2 = []
            this.allotStudentExtract.studentIds.splice(0)
            for (let i = 0; i < arr.length; i++){
                for (let k = 0; k < arr[i].owner_id_array.length; k++){
                    _arr1.push(arr[i].owner_id_array[k].id)
                    _arr2.push(arr[i].owner_id_array[k].pid)
                }
                this.allotStudentExtract.studentIds.push(arr[i].id)
            }
            this.allotStudentExtract.checkedKeys  = _.uniq(_arr1)
            this.allotStudentExtract.expandedKeys = _.uniq(_arr2)
        },
        handleCurrentChange(index){
            this.curPageIndex = index
            this.getStudentList(index)
        },
        reloadGetData(res){
            if (res == 'reload'){
                this.getStudentList(this.curPageIndex)
            }
        },
        searchHandle(){
            this.getStudentList(1)
        },
        getTagStyle(){
            let _arr = ['', 'success', 'warning', 'danger']
            return _arr[getRandom(0, 3)]
        },
        importHandle(){
            this.currentView = 'ImportPanel'
            this.dialogFileVisible = !0
        },
        exportHandle(){
            this.currentView = 'ExportPanel'
            this.dialogFileVisible = !0
        },
        removeItemById(_id){
            for (let i = 0; i < this.list.length; i++){
                if (this.list[i].id == _id){
                    this.list.splice(i, 1)
                    break
                }
            }
        }
    },
    filters: {
        formatPhone(input){
            if (input.length == 11){
                return input.slice(0, 3) + ' ' + input.slice(3, 7) + ' ' + input.slice(7)
            }
            return input
        }
    },
    created(){
        this.hashSite = getLocationHash()
        this.getStudentList(this.curPageIndex)
        this.getInfoList('/safe/dict/showSchool', 'schoolList')
        this.getInfoList('/safe/dict/showStudentStatus', 'statusList')
    },
    components: {
        Extract,
        AddStudentPanel,
        ModStudentPanel,
        AllotStudentPanel,
        LabelSearchPanel,
        LabelPanel,
        FollowPanel,
        ImportPanel,
        ExportPanel
    }
}
</script>

<style>
.stuManager-wrapper {}

.student-top {
    height: 40px;
}
.student-top > ul {
    height: 40px;
}
.student-top > ul > .el-input {
    width: 220px;
}
.student-top > ul > .el-select:nth-of-type(1) {
    width: 140px;
    margin-right: 10px;
}
.student-top > ul > .el-select:nth-of-type(2) {
    width: 180px;
    margin-right: 10px;
}
.student-top .el-dropdown {
    margin-left: 10px;
}

/* 标签搜索样式 */
.student-top .app-dropdown {
    height: 38px;
    border: 1px solid #d8dce5;
    border-radius: 4px;
    background: #fff;
    margin-right: 10px;
}
.student-top .app-dropdown:hover {
    border-color: #b4bccc;
}
.student-top .app-dropdown .el-submenu__title {
    height: 38px;
    line-height: 38px; 
    border-radius: 4px;
}
.student-top .app-dropdown .el-menu {
    top: 45px;
    border-radius: 4px;
}


.student-list {
    margin-top: 20px;
}
.student-list .el-table__body td {
    padding: 5px 0;
}
.student-list .el-tag {
    margin-right: 4px;
}
.student-list .el-tag:last-child {
    margin-right: 0;
}
</style>