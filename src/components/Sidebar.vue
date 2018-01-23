<template>
    <el-menu :router="true" 
        :default-active="defaultSelected" 
        :default-openeds="[parentDepth]" 
        class="el-menu-vertical-demo app-sidebar" 
        background-color="#273240" 
        text-color="#fff" 
        active-text-color="#ffd04b">
            <el-submenu v-for="(val, key) in list" :index="val.depth">
                <template slot="title">
                    <i :class="val.iconName"></i>
                    <span>{{ val.title }}</span>
                </template>
                <el-menu-item v-for="(item, index) in val.list" :index="item.link">
                    {{ item.title }}
                </el-menu-item>
            </el-submenu>
        </el-menu>
</template>

<script>
import {getLocationHash} from 'common/js/tools'

export default {
    name: 'Sidebar',
    data(){
        return {
            list: [],
            iconArr: ['menu', 'location', 'share', 'message', 'setting'],
            defaultSelected: '',
            parentDepth: ''
        }
    },
    created(){
        this.defaultSelected = getLocationHash()
        this.getMenuList((arr) => {
            this.list = arr
            for (let i = 0; i < this.list.length; i++){
                this.list[i].iconName = 'el-icon-' + this.iconArr[i]
            }
            this.iterFunc(this.list, '')
            this.findParDepth(this.list, this.defaultSelected)
        })
    },
    methods: {
        getMenuList(callback){
            const _this = this
            this.$http.get('/safe/sys/menu', {
                params: {}
            })
            .then(function (response){
                // console.log(response.data.list)
                callback && callback(response.data.list)
            })
        },
        iterFunc(arr, str){
            for (let i = 0; i < arr.length; i++){
                arr[i].depth = str + i
                if (_.isArray(arr[i].list)){
                    this.iterFunc(arr[i].list, arr[i].depth + '-')
                }
            }
        },
        findParDepth(arr, str){
            for (let i = 0; i < arr.length; i++){
                if (arr[i].link === str){
                    this.parentDepth = arr[i].depth.slice(0, -2)
                } else {
                    if (_.isArray(arr[i].list)){
                        this.findParDepth(arr[i].list, str)
                    }
                }
            }
        }
    }
}
</script>

<style>
#app .app-sidebar {
    height: 100%;
    height: calc(100vh - 60px);
    border-right: none;
}
</style>