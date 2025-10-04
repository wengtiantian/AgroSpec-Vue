//前端权限控制方案，结合了路由守卫、动态路由加载和状态管理
import router from './router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isHttp } from '@/utils/validate'
import { isRelogin } from '@/utils/request'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'

// 配置NProgress不显示旋转动画
NProgress.configure({ showSpinner: false });

// 定义不需要登录就可以访问的路由路径
const whiteList = ['/login', '/register', '/home', '/service-subject', '/service-standard', '/online-reading', '/search-result', '/search-result-subject', '/standards-center', '/plantation-standards', '/breeding-standards', '/news'];

// 全局前置守卫
router.beforeEach((to, from, next) => {
  NProgress.start() // 开始进度条
  if (getToken()) { // 检查是否存在toke
    // 设置页面标题，如果没有meta.title则使用默认标题
    if (to.meta.title) {
      useSettingsStore().setTitle(to.meta.title)
    } else {
      useSettingsStore().setTitle('乡村特色产业标准化生产服务规范与质量评价系统')
    }
    /* has token*/
    if (to.path === '/login') {
      // 如果已登录却访问登录页，跳转到首页
      next({ path: '/' })
      NProgress.done()
    } else if (whiteList.indexOf(to.path) !== -1) {
      // 如果在白名单中，直接放行
      next()
      } else {
        // 需要权限验证的路由
        const userStore = useUserStore()
        if (!userStore.roles || userStore.roles.length === 0) {
          isRelogin.show = true
          // 判断当前用户是否已拉取完user_info信息
          userStore.getInfo().then(() => {
            isRelogin.show = false
            console.log('用户信息获取成功，角色:', userStore.roles)
            
            // 检查用户是否有访问权限
            if (to.path.startsWith('/admin') && !userStore.roles.includes('admin') && !userStore.roles.includes('ROLE_ADMIN')) {
              ElMessage.error('您没有访问后台管理的权限')
              next({ path: '/' })
              return
            }
            
            usePermissionStore().generateRoutes().then(accessRoutes => {
              // 根据roles权限生成可访问的路由表
              accessRoutes.forEach(route => {
                if (!isHttp(route.path)) {
                  router.addRoute(route) // 动态添加可访问路由表
                  // console.log('所有路由：', router.getRoutes());
                }
              })
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            }).catch(err => {
              console.error('生成路由失败:', err)
              ElMessage.error('获取路由信息失败，请重新登录')
              userStore.logOut().then(() => {
                next({ path: '/login' })
              })
            })
          }).catch(err => {
            isRelogin.show = false
            console.error('获取用户信息失败:', err)
            ElMessage.error('获取用户信息失败，请检查网络连接或联系管理员')
            userStore.logOut().then(() => {
              next({ path: '/login' })
            })
          })
        } else {
          // 已有角色信息，检查访问权限
          if (to.path.startsWith('/admin') && !userStore.roles.includes('admin') && !userStore.roles.includes('ROLE_ADMIN')) {
            ElMessage.error('您没有访问后台管理的权限')
            next({ path: '/' })
            return
          }
          next()
        }
      }
  } else {
    // 没有token
    // 设置页面标题，如果没有meta.title则使用默认标题
    if (to.meta.title) {
      useSettingsStore().setTitle(to.meta.title)
    } else {
      useSettingsStore().setTitle('乡村特色产业标准化生产服务规范与质量评价系统')
    }
    
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
