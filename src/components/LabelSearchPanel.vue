<template>
<div class="label-search-panel">
    <div class="label-wrapper">
        <el-tag v-for="(item, key) in labelList" :class="{selected: item.state}" :key="key"
            @click.stop.native="clickHandle(key)">
            {{ item.value }}
        </el-tag>
    </div>
</div>
</template>

<script>
export default {
    name: 'LabelSearchPanel',
    props: {
        params: {
            type: Array,
            default (){
                return []
            }
        }
    },
    data(){
        return {
            labelList: []
        }
    },
    created(){
        this.getLabelList()
    },
    methods: {
        getLabelList(){
            const _this = this
            this.$http.get('/safe/tag/query', {
                params: {}
            })
            .then(function (response){
                for (let i = 0; i < response.data.length; i++){
                    response.data[i].state = !1
                }
                _this.labelList = response.data
            })
        },
        clickHandle(index){
            this.labelList[index].state = !this.labelList[index].state
            this.params.splice(0)
            for (let i = 0; i < this.labelList.length; i++){
                if (this.labelList[i].state){
                    this.params.push(this.labelList[i])
                }
            }
            this.$emit('searchEvent', 'search')
        }
    }
}
</script>

<style>
.label-search-panel {
    padding: 12px 15px 10px;
}
.label-wrapper {
    min-width: 300px;
}
.label-wrapper .el-tag {
    margin: 0 2px 5px;
    cursor: pointer;
}
.label-wrapper .el-tag.selected {
    background: #409eff;
    color: #fff;
}
</style>