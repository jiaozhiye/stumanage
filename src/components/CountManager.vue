<template>
<div class="hchar-wrapper">
    <div class="count-top">
        <h4>统计条件<span>新入库学生的学校和专业统计</span></h4>
        <div>
            <el-date-picker
                v-model="dataTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
            </el-date-picker>
        </div>
    </div>
    <div class="count-top">
        <h4>统计结果</h4>
    </div>
    <div class="count-resault">
        <SchoolCount :dataTime="dataTime"></SchoolCount>
        <MajorCount :dataTime="dataTime"></MajorCount>
    </div>
</div>
</template>

<script>
import SchoolCount from 'components/count/SchoolCount.vue'
import MajorCount from 'components/count/MajorCount.vue'

export default {
    name: 'CountManager',
    data(){
        return {
            dataTime: [],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一个月',
                    onClick(picker){
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                        onClick(picker){
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近六个月',
                        onClick(picker){
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
                        picker.$emit('pick', [start, end])
                    }
                },
                {
                    text: '最近一年',
                        onClick(picker){
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 360)
                        picker.$emit('pick', [start, end])
                    }
                }]
            }
        }
    },
    components: {
        SchoolCount,
        MajorCount
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
}
.count-resault > .count-box {
    flex: 1;
}
</style>