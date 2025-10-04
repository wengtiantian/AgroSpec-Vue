import { createWebHistory, createRouter } from 'vue-router'
/* Layout */
import Layout from '@/layout'
import ServiceSubjectDetail from '../views/ServiceSubjectDetail.vue';
import ServiceStandardDetail from '../views/ServiceStandardDetail.vue';
import OnlineReading from '../views/OnlineReading.vue';
import SearchResult from '../views/SearchResult.vue';
import SearchResultSubject from '../views/SearchResultSubject.vue';
import AdminDashboard from '../views/admin/dashboard.vue';
import DefaultIndex from '../views/Dashboard-index.vue';
import PlantationStandards from '../views/PlantationStandards.vue';
/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
 noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
 icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
 breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
 activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
 }
 */

// 公共路由——让所有用户都可以访问
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },

  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },



  {
    path: '/',
    component: () => import('@/layout/DefaultLayout.vue'), // 使用布局组件
    hidden: true,
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/login'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/register'),
      },
      {
        path: '/service-subject',
        name: 'ServiceSubjectDetail',
        component: ServiceSubjectDetail
      },
      {
        path: '/service-standard',
        name: 'ServiceStandardDetail',
        component: ServiceStandardDetail
      },
      {
        path: '/online-reading',
        name: 'OnlineReading',
        component: OnlineReading,
      },
      {
        path: '/search-result',
        name: 'SearchResult',
        component: SearchResult,
      },
      {
        path: '/search-result-subject',
        name: 'SearchResultSubject',
        component: SearchResultSubject,
      },
      {
        path: '/news',
        name: 'News',
        component: () => import('@/views/base/news/index'),
      },
      // 服务主体申请页面
      {
        path: '/apply/servicer',
        name: 'ServicerApply',
        component: () => import('@/views/apply/servicer/index'),
        meta: { title: '服务主体申请' },
        hidden: true,
      },
      // 服务主体审核页面
      {
        path: '/audit/servicer',
        name: 'ServicerAudit',
        component: () => import('@/views/audit/servicer/index'),
        meta: { title: '服务主体审核' },
        hidden: true,
      },
      // 我的申请页面
      {
        path: '/my-application',
        name: 'MyApplication',
        component: () => import('@/views/my-application/index'),
        meta: { title: '我的申请' },
        hidden: true,
      },

    ],
  },

  {
    path: '/index',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/Dashboard-index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard'}
      }
    ],
    
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/plantation-standards',
    name: 'PlantationStandards',
    component: () => import('@/views/PlantationStandards'),
    meta: { title: '种植标准库' },
    hidden: true,
  },
  {
    path: '/breeding-standards',
    name: 'BreedingStandards',
    component: () => import('@/views/BreedingStandards'),
    meta: { title: '养殖标准库' },
    hidden: true,
  },
  {
    path: '/quality-evaluation/dynamic-system',
    name: 'DynamicReview',
    component: () => import('@/views/quality-evaluation/DynamicReview'),
    meta: { title: '动态评价系统'},
    hidden: true,
  },
  {
    path: '/standards-center',
    name: 'StandardsCenter',
    component: () => import('@/views/StandardsCenter'),
    meta: { title: '农业标准库' },
    hidden: true,
  },
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  },
  {
    path: '/servicer',
    component: Layout,
    roles: ['servicer'],
    children:[
      {
        path: 'profile',
        component: () => import('@/views/subject/servicer_mess/profile'),
        name: 'Profile1',
        meta: { title: '主体中心', icon: 'user', activeMenu: '/servicer/profile' }
      }
    ]
  },
  {
    path: '/producter',
    component: Layout,
    roles: ['producter'],
    children:[
      {
        path: 'profile',
        component: () => import('@/views/subject/producter_mess/profile'),
        name: 'Profile2',
        meta: { title: '主体中心', icon: 'user', activeMenu: '/producter/profile' }
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    roles: ['admin'],
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/admin/dashboard'),
        name: 'AdminDashboard',
        meta: { title: '超级管理', icon: 'dashboard', activeMenu: '/admin/dashboard' }
      }
    ]
  },
  {
    path: '/base/reviews',
    component: Layout,
    roles: ['admin','common'],
    children: [
      {
        path: '',
        component: () => import('@/views/base/reviews/index'),
        name: 'BaseReviews',
        meta: { title: '评论管理', icon: 'reviews', activeMenu: '/base/reviews' }
      }
    ]
  },
  
]
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});

export default router;

