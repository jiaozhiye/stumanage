<template>
<div class="dragTips">
    <label class="text">
        <i v-if="params.ismust">*</i>
        <em>{{ params.title }}</em>
    </label>
    <div class="text-field">
        <el-checkbox-group v-model="params.val">
            <el-checkbox v-for="(item, key) in params.checks" 
                :label="item.label" :key="key">
                {{ item.label }}
            </el-checkbox>
        </el-checkbox-group>
    </div>
</div>
</template>

<script>
export default {
    name: 'CheckboxField',
    props: {
        params: {
            type: Object,
            default (){
                return {
                    name: 'CheckboxField',
                    title: '复选框',
                    msg: '请选择...',
                    checks: [
                        {label: '备选项1'},
                        {label: '备选项2'}
                    ],
                    ismust: true,
                    val: []
                }
            }
        }
    },
    data(){
        return {}
    }
}
</script>

<style>

</style>