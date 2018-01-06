export default {
    TextField: {
        name: 'TextField',
        title: '单行文本',
        msg: '请输入...',
        ismust: true,
        val: ''
    },
    TextareaField: {
        name: 'TextareaField',
        title: '多行文本',
        msg: '请输入...',
        ismust: true,
        val: ''
    },
    SelectField: {
        name: 'SelectField',
        title: '下拉菜单',
        msg: '请选择...',
        options: [],
        ismust: true,
        val: ''
    },
    RadioField: {
        name: 'RadioField',
        title: '单选按钮',
        msg: '请选择...',
        radios: [
            {label: '备选项1'},
            {label: '备选项2'}
        ],
        ismust: true,
        val: '备选项1'
    },
    CheckboxField: {
        name: 'CheckboxField',
        title: '复选框',
        msg: '请选择...',
        checks: [
            {label: '备选项1'},
            {label: '备选项2'}
        ],
        ismust: true,
        val: []
    },
    DateField: {
        name: 'DateField',
        title: '日期',
        msg: '请选择...',
        ismust: true,
        val: ''
    }
}