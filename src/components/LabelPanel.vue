<template>
<div class="label-wrapper">
    <div class="label-list">
        <el-tag
            v-for="tag in labelList"
            :key="tag"
            closable
            @close="handleClose(tag)">
            {{ tag }}
        </el-tag>
    </div>
    <div class="label-add">
        <el-autocomplete
            class="inline-input"
            v-model="tagname"
            :fetch-suggestions="querySearch"
            placeholder="请输入标签名">
        </el-autocomplete>
        <el-button icon="el-icon-plus" @click.stop="addLabelHandle"></el-button>
    </div>
</div>
</template>

<script>
export default {
    name: 'LabelPanel',
    props: {
        // 标签名的字符串数组
        labelList: {
            type: Array,
            default: []
        }
    },
    data(){
        return {
            restaurants: [],
            tagname: ''
        }
    },
    methods: {
        getLabelList(){
            const _this = this
            this.$http.get('/safe/tag/query', {
                params: {}
            })
            .then(function (response){
                // console.log(response.data)
                _this.restaurants = response.data
            })
        },
        handleClose(tag){
            this.labelList.splice(this.labelList.indexOf(tag), 1)
        },
        querySearch(queryString, cb){
            const restaurants = this.restaurants
            const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
            cb(results)
        },
        createFilter(queryString){
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
            }
        },
        addLabelHandle(val){
            if (this.tagname == ''){
                return this.$message({
                    message: '请输入标签内容，不能添加空标签！',
                    type: 'warning'
                })
            } else if (this.labelList.indexOf(this.tagname) != -1){
                return this.$message({
                    message: '此标签已经添加过了，不能重复添加！',
                    type: 'warning'
                })
            } else {
                this.labelList.push(this.tagname)
                this.tagname = ''
            }
        }
    },
    created(){
        this.getLabelList()
    }
}
</script>

<style>
.label-wrapper {}
.label-wrapper .label-add {
    margin-top: 10px;
}
.label-wrapper .label-add .el-autocomplete {
    width: 260px;
}
.label-wrapper .label-panel-wrapper .el-tag {
    margin-right: 10px;
}
</style>