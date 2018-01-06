<template>
<div>
    <div class="count-box" id="my-student-count"></div>
    <p class="count-text" v-html="remark"></p>
</div>
</template>

<script>
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
Exporting(Highcharts)

export default {
    name: 'MyStudentCount',
    props: {
        dataTime: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            chart: null,
            title: '我的入库和报名学员',
            list: [],
            remark: '',
            rkTotal: 0,
            zhTotal: 0
        }
    },
    watch: {
        dataTime(){
            this.getCountInfo()
        }
    },
    methods: {
        getCountInfo(){
            const _this = this
            this.$http.get('/safe/statistics/myTranslate', {
                params: {
                    year: _this.dataTime
                }
            })
            .then(function (response){
                _this.list = response.data.series
                _this.remark = response.data.remark
                _this.rkTotal = response.data.inputTotal
                _this.zhTotal = response.data.signTotal
                // setTimeout(() => {
                    _this.createHighchar()
                // }, 200)
            })
        },
        createHighchar(){
            const _this = this
            this.chart = Highcharts.chart('my-student-count', {
                credits:{
                    enabled: false // 禁用版权信息
                },
                exporting: {   
                    enabled: false  // 设置导出按钮不可用    
                },
                chart: {
                    type: 'line'
                },
                title: {
                    text: _this.title
                },
                subtitle: {
                    text: '入库总数: '+ _this.rkTotal +' 人, 转化总数: '+ _this.zhTotal +' 人'
                },
                xAxis: {
                    categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                },
                yAxis: {
                    title: {
                        text: '学员数量'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true // 开启数据标签
                        },
                        enableMouseTracking: true
                    }
                },
                series: _this.list
            })
        }
    },
    created(){
        this.getCountInfo()
    },
    destroyed(){
        this.chart.destroy()
    }
}
</script>

<style>
</style>