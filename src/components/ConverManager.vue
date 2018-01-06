<template>
<div class="hchar-wrapper">
    <div class="count-top">
        <h4>统计条件<span>统计全校招生人数及转化率</span></h4>
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
    <ConverCount :dataTime="dataTime"></ConverCount>
    <div class="count-resault">
        <StudentCount :dataTime="dataTime"></StudentCount>
        <EnrollCount :dataTime="dataTime"></EnrollCount>
    </div>
</div>
</template>

<script>
import ConverCount from 'components/count/ConverCount.vue'
import StudentCount from 'components/count/StudentCount.vue'
import EnrollCount from 'components/count/EnrollCount.vue'

export default {
    name: 'ConverManager',
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
        ConverCount,
        StudentCount,
        EnrollCount
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

.count-resault {
    display: flex;
    margin-top: 15px;
}
.count-resault .count-box {
    flex: 1;
}
</style>