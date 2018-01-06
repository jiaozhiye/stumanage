/**
 * @Author: Jzy
 * @Date: 2017/12/12
 * @Last Modified by: Jzy
 * @Last Modified time: 2017/12/12
 */
import Vue from 'vue'
import VeeValidate, {Validator} from 'vee-validate'

import zh from 'vee-validate/dist/locale/zh_CN'
Validator.addLocale(zh)
Vue.use(VeeValidate, {locale: 'zh_CN'})

// 自定义validate
const dictionary = {
    zh_CN: {
       messages: {
         required: (field)=> field + '不能为空.'
       },
       attributes:{
         account: '账号',
         username: '用户名',
         password: '密码',
         pername: '姓名',
         phone: '手机号',
         email: '邮箱',
         deptname: '部门名称',
         deptdesc: '部门描述',
         stuname: '学生姓名',
         sfzh: '身份证号',
         studesc: '学生扩展描述',
         dataname: '数据名称',
         order: '排序值',
         postname: '职务名称'
       }
   }
}
 
Validator.updateDictionary(dictionary)

Validator.extend('spechar', {
    messages: {
      zh_CN: field => field + '不能是特殊字符'
    },
    validate: value => {
      return /^[^`~!@#\$%\^\&\*\(\)_\+<>\?:\{\},\.\\\/;'\[\]]+$/.test(value)
    }
})

Validator.extend('phone', {
    messages: {
      zh_CN: field => field + '必须是11位号码.'
    },
    validate: value => {
      return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
    }
})
