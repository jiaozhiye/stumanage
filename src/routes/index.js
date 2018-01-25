// import Home from 'components/Home.vue'
// import DeptManager from 'components/DeptManager.vue'
// import EmployManager from 'components/EmployManager.vue'
// import FieldSet from 'components/FieldSet.vue'
// import StuManager from 'components/StuManager.vue?_=nocare'
// import FollowStuManager from 'components/StuManager.vue?_=follow'
// import StuPoolManager from 'components/StuManager.vue?_=pool'
// import CountManager from 'components/CountManager.vue'
// import MyConverManager from 'components/MyConverManager.vue'
// import ConverManager from 'components/ConverManager.vue'
// import PersonalSetting from 'components/PersonalSetting.vue'
// import LogManager from 'components/LogManager.vue'
// import DictManager from 'components/DictManager.vue'
// import PowerManager from 'components/PowerManager.vue'
// import ClassManager from 'components/ClassManager.vue'
// import ArticleManager from 'components/ArticleManager.vue'

const Home = () => import('components/Home.vue')
const DeptManager = () => import('components/DeptManager.vue')
const EmployManager = () => import('components/EmployManager.vue')
const FieldSet = () => import('components/FieldSet.vue')
const StuManager = () => import('components/StuManager.vue?_=nocare')
const FollowStuManager = () => import('components/StuManager.vue?_=follow')
const StuPoolManager = () => import('components/StuManager.vue?_=pool')
const StuDeptManager = () => import('components/StuManager.vue?_=dept')
const CountManager = () => import('components/CountManager.vue')
const MyConverManager = () => import('components/MyConverManager.vue')
const ConverManager = () => import('components/ConverManager.vue')
const PersonalSetting = () => import('components/PersonalSetting.vue')
const LogManager = () => import('components/LogManager.vue')
const DictManager = () => import('components/DictManager.vue')
const PowerManager = () => import('components/PowerManager.vue')
const ClassManager = () => import('components/ClassManager.vue')
const ArticleManager = () => import('components/ArticleManager.vue')

const routes = {
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/deptManager',
            component: DeptManager
        },
        {
            path: '/staffManager',
            component: EmployManager
        },
        {
            path: '/setField',
            component: FieldSet
        },
        {
            path: '/studentManager',
            component: StuManager
        },
        {
            path: '/followStdMgr',
            component: FollowStuManager
        },
        {
            path: '/saleDeptStudents',
            component: StuDeptManager
        },
        {
            path: '/studentPool',
            component: StuPoolManager
        },
        {
            path: '/stat_school',
            component: CountManager
        },
        {
            path: '/stat_admin_translate',
            component: ConverManager
        },
        {
            path: '/stat_my_translate',
            component: MyConverManager
        },
        {
            path: '/per-setting',
            component: PersonalSetting
        },
        {
            path: '/logManager',
            component: LogManager
        },
        {
            path: '/dictMgr',
            component: DictManager
        },
        {
            path: '/jobMgr',
            component: PowerManager
        },
        {
            path: '/classMgr',
            component: ClassManager
        },
        {
            path: '/arcManager',
            component: ArticleManager
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
}

export default routes