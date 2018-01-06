<template>
<div class="count-box" id="enroll_id"></div>
</template>

<script>
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
Exporting(Highcharts)

export default {
    name: 'EnrollCount',
    props: {
        dataTime: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            chart: null,
            title: '报名学员数',
            list: [],
            total: 0
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
            this.$http.get('/safe/statistics/adminTranslate/querySignTotalBySaleman', {
                params: {
                    year: _this.dataTime
                }
            })
            .then(function (response){
                _this.list  = response.data.data
                _this.total = response.data.total
                _this.createHighchar()
            })
        },
        createHighchar(){
            const _this = this
            this.chart = Highcharts.chart('enroll_id', {
                credits: {
                    enabled: false // 禁用版权信息
                },
                exporting: {   
                    enabled: false  // 设置导出按钮不可用    
                },
                title: {
                    text: _this.title
                },
                subtitle: {
                    text: '报名总数: ' + _this.total + '人'
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '{point.name}: <b>{point.y} 人</b><br>人数占比: <b>{point.percentage:.1f} %</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}: {point.y} 人<br>人数占比: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: '学生占比',
                    data: _this.list
                }]
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