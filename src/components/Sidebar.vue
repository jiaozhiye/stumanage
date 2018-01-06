<template>
    <el-menu :default-active="defaultSelected" :router="true" class="el-menu-vertical-demo app-sidebar" background-color="#273240" text-color="#fff" active-text-color="#ffd04b">
      <el-submenu v-for="(val, key) in list" :index="(key + 1).toString()">
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
export default {
    name: 'Sidebar',
    data(){
        return {
            list: [],
            iconArr: ['menu', 'location', 'share', 'message', 'setting'],
            defaultSelected: 'home'
        }
    },
    created(){
        this.getMenuList()
    },
    methods: {
        getMenuList(){
            const _this = this
            this.$http.get('/safe/sys/menu', {
                params: {}
            })
            .then(function (response){
                // console.log(response.data.list)
                for (let i = 0; i < response.data.list.length; i++){
                    response.data.list[i].iconName = 'el-icon-' + _this.iconArr[i]
                }
                _this.list = response.data.list
            })
            .catch(function (error){
                console.log(error)
            })
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