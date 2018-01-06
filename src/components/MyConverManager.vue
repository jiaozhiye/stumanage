<template>
<div class="hchar-wrapper">
    <div class="count-top">
        <h4>统计条件<span>统计我的招生人数及转化率</span></h4>
        <div>
            <el-date-picker
                v-model="dataTime"
                align="left"
                type="year"
                value-format="yyyy"
                placeholder="选择年份"
                :picker-options="pickerOptions">
            </el-date-picker>
        </div>
    </div>
    <div class="count-top">
        <h4>统计结果</h4>
    </div>
    <MyStudentCount :dataTime="dataTime"></MyStudentCount>
    <div style="height: 20px;"></div>
    <MyConvers :dataTime="dataTime"></MyConvers>
</div>
</template>

<script>
import MyStudentCount from 'components/count/MyStudentCount.vue'
import MyConvers from 'components/count/MyConvers.vue'

export default {
    name: 'MyConverManager',
    data(){
        return {
            dataTime: '',
            pickerOptions: {
                disabledDate(time){
                    return time.getTime() < (Date.now() - 3600 * 1000 * 24 * 365)
                }
            }
        }
    },
    components: {
        MyStudentCount,
        MyConvers
    }
}
</script>

<style>
.hchar-wrapper {}
.hchar-wrapper .count-top {
    margin-bottom: 10px;
}
.hchar-wrapper .count-top h4 {
    line-height: 30px;
    font-weight: bold;
}
.hchar-wrapper .count-top h4 span {
    font-size: 12px;
    color: #999;
    margin-left: 10px;
    font-weight: normal;
}
</style>