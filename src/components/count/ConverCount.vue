<template>
<div>
    <div class="count-box" id="conver-manager"></div>
    <p class="count-text" v-html="remark"></p>
</div>
</template>

<script>
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
Exporting(Highcharts)

export default {
    name: 'ConverCount',
    props: {
        dataTime: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            chart: null,
            title: '全校转化率',
            list: [],
            remark: ''
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
            this.$http.get('/safe/statistics/adminTranslate/queryPer', {
                params: {
                    year: _this.dataTime
                }
            })
            .then(function (response){
                // console.log(response.data)
                _this.list = response.data.series
                _this.remark = response.data.remark
                _this.createHighchar()
            })
        },
        createHighchar(){
            const _this = this
            this.chart = Highcharts.chart('conver-manager', {
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
                    text: ''
                },
                xAxis: {
                    categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                },
                yAxis: {
                    title: {
                        text: '转化率'
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