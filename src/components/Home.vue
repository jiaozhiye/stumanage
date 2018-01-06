<template>
<div class="app-welcome">
    <div class="welcome-box">
        <h4 class="title">消息提醒</h4>
        <div class="content">
            <div class="box-card">
                <ul>
                    <li v-for="(item, key) in infoList" :key="key">
                        <h5>{{ item.content  }}</h5>
                        <span>{{ item.create_time  }}</span>
                    </li>
                </ul>
                <dl v-if="infoList.length == 0">暂无提醒...</dl>
            </div>
            <el-pagination
                layout="prev, pager, next"
                :small="true"
                :total="infoList.total"
                @current-change="handleCurrentChangeInfo">
            </el-pagination>
        </div>
    </div>
    <div class="welcome-box">
        <h4 class="title">跟踪提醒</h4>
        <div class="content">
            <div class="box-card">
                <ul>
                    <li v-for="(item, key) in followList" :key="key">
                        <h5>学生姓名：{{ item.student_name  }}，提醒内容：{{ item.content  }}</h5>
                        <p>
                            <el-button @click.stop="completeHandle(item)" type="text">
                                {{ item.finish == '1' ? '完成　' : '未完成' }}
                            </el-button>
                        </p>
                        <span>{{ item.remind_date  }}</span>
                    </li>
                </ul>
                <dl v-if="followList.length == 0">暂无提醒...</dl>
            </div>
            <el-pagination
                layout="prev, pager, next"
                :small="true"
                :total="followList.total"
                @current-change="handleCurrentChangeFollow">
            </el-pagination>
        </div>
    </div>
    <div class="welcome-box">
        <h4 class="title">数据概览</h4>
        <div class="content count-wrapper">
            <MyStudentCount :dataTime="dataTime"></MyStudentCount>
            <MyConvers :dataTime="dataTime"></MyConvers>
        </div>
    </div>
</div>
</template>

<script>
import MyStudentCount from 'components/count/MyStudentCount.vue'
import MyConvers from 'components/count/MyConvers.vue'

export default {
    name: 'Home',
    data(){
        return {
            infoList: [],
            followList: [],
            dataTime: ''
        }
    },
    methods: {
        getMsgList(curPage){
            const _this = this
            this.$http.get('/safe/message', {
                params: {
                    pageNum: curPage,
                    pageSize: 5
                }
            })
            .then(function (response){
                // console.log(response.data)
                _this.infoList = response.data.data.list
                _this.infoList.total = response.data.data.totalRow
            })
        },
        getFollowList(curPage){
            const _this = this
            this.$http.get('/safe/remind/queryRemind', {
                params: {
                    pageNum: curPage,
                    pageSize: 5
                }
            })
            .then(function (response){
                // console.log(response.data)
                _this.followList = response.data.list
                _this.followList.total = response.data.totalRow
            })
        },
        completeHandle(item){
            let tmp = item.finish == '1' ? '0' : '1'
            const _this = this
            this.$http.get('/safe/remind/finish', {
                params: {
                    id: item.id,
                    finish: tmp
                }
            })
            .then(function (response){
                if (response.data.code == 1){
                    // item.finish = tmp
                    _this.$message({
                        type: 'success',
                        message: '此条跟踪记录处理完成！'
                    })
                    _this.getFollowList(1)
                } else {
                    _this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            })
        },
        handleCurrentChangeInfo(index){
            this.getMsgList(index)
        },
        handleCurrentChangeFollow(index){
            this.getFollowList(index)
        }
    },
    created(){
        this.getMsgList(1)
        this.getFollowList(1)
    },
    components: {
        MyStudentCount,
        MyConvers
    }
}
</script>

<style>
.welcome-title {
    text-align: center;
    font-size: 30px;
    padding-top: 50px;
}
.welcome-box {
    background: #fff;
    border: 1px solid #ddd;
    margin-bottom: 15px;
}
.welcome-box .title {
    height: 42px;
    line-height: 42px;
    padding-left: 12px;
    border-bottom: 1px solid #ddd;
}
.welcome-box .content {
    padding: 12px 0;
    overflow: hidden;
}
.welcome-box .count-wrapper {
    display: flex;
}
.welcome-box .count-wrapper > div {
    flex: 1;
}

.welcome-box .box-card {}
.welcome-box .box-card ul li {
    line-height: 18px;
    padding: 10px 12px;
    display: flex;
}
.welcome-box .box-card ul li h5 {
    flex: 1;
}
.welcome-box .box-card ul li p {
    width: 80px;
}
.welcome-box .box-card ul li p button {
    padding: 0;
}
.welcome-box .box-card ul li span {
    width: 150px;
    color: #409EFF;
}
.box-card dl {
    line-height: 18px;
    padding: 10px 12px;
    text-align: center;
}
</style>