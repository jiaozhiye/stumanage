<template>
<div class="add-student-panel">
    <h4 class="form-group-apart"><i class="icon el-icon-edit-outline"></i>学员的分配</h4>
    <div class="app-form-item">
        <label class="app-form-label"><i>*</i>所有者</label>
        <div class="app-input-block">
            <el-tree
                :data="tree.list"
                show-checkbox
                node-key="id"
                ref="tree"
                highlight-current
                :default-expanded-keys="tree.expandedKeys"
                :default-checked-keys="tree.checkedKeys"
                :props="defaultProps">
            </el-tree>
        </div>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
export default {
    name: 'AllotStudentPanel',
    props: {
        params: Object
    },
    data(){
        return {
            studentIds: this.params.studentIds, // 学员ID数组
            form: {
                owner: '',
            },
            tree: {
                list: [],
                expandedKeys: [], // 展开
                checkedKeys: [],  // 选中
            },
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    created(){
        const _this = this
        this.getTreeList(function(){
            _this.tree.checkedKeys  = _this.params.checkedKeys
            _this.tree.expandedKeys = _this.params.expandedKeys
        })
    },
    methods: {
        getTreeList(callback){
            const _this = this
            this.$http.get('/safe/staff/tree', {
                params: {}
            })
            .then(function (response){
                // console.log(response.data)
                _this.tree.list = response.data.result
                callback && callback()
            })
        },
        getCheckedKeys(){
            this.form.owner = this.$refs.tree.getCheckedKeys().join(',')
        },
        submitHandle(){
            const _this = this
            this.insertInfo(function(){
                _this.$emit('reloadEvent', 'reload')
                _this.closePanelHandle()
            })
        },
        insertInfo(callback){
            this.getCheckedKeys()
            if (this.form.owner == ''){
                return this.$message({
                    type: 'error',
                    message: '必须要选择这少一个所有者!'
                })
            }
            const _this = this
            this.$http.post('/safe/student/modifyOwnerByStudentId', {
                student_id: _this.studentIds,
                owner_id: _this.form.owner.split(',')
            })
            .then(function (response){
                // console.log(response.data)
                if (response.data.code == 1){
                    _this.$message({
                        type: 'success',
                        message: '所有者分配成功!'
                    })
                    callback && callback()
                } else {
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            })
        },
        closePanelHandle(){
            this.params.isPlay = false
        }
    }
}
</script>

<style>
.add-student-panel {
    padding: 30px 40px 20px 20px;
}
</style>