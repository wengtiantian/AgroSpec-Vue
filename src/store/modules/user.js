import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      id: '',
      name: '',
      avatar: '',
      roles: [],
      permissions: []
    }),
    actions: {
      // 登录
      login(userInfo) {
        const username = userInfo.username.trim()
        const password = userInfo.password
        const code = userInfo.code
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          login(username, password, code, uuid).then(res => {
            setToken(res.token)
            this.token = res.token
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          getInfo().then(res => {
            console.log('获取用户信息响应:', res)
            
            // 检查响应数据结构
            if (!res) {
              reject(new Error('用户信息响应为空'))
              return
            }

            // 兼容不同的数据结构
            const user = res.user || res.data || res
            if (!user || typeof user !== 'object') {
              reject(new Error('用户信息数据为空或格式错误'))
              return
            }

            // 安全地获取用户信息
            let avatar = defAva
            try {
              if (user.avatar && user.avatar !== "" && user.avatar !== null) {
                if (user.avatar.startsWith('http')) {
                  avatar = user.avatar
                } else if (user.avatar.startsWith('/profile/')) {
                  // 如果是/profile/开头的路径，直接使用，不拼接VITE_APP_BASE_API
                  avatar = user.avatar
                } else {
                  // 其他情况才拼接VITE_APP_BASE_API
                  avatar = import.meta.env.VITE_APP_BASE_API + user.avatar
                }
              }
            } catch (error) {
              console.warn('处理用户头像失败，使用默认头像:', error)
              avatar = defAva
            }

            // 设置角色和权限
            if (res.roles && Array.isArray(res.roles) && res.roles.length > 0) {
              this.roles = res.roles
              this.permissions = res.permissions || []
            } else if (res.authorities && Array.isArray(res.authorities)) {
              // 兼容Spring Security的authorities字段
              this.roles = res.authorities
              this.permissions = res.permissions || []
            } else {
              this.roles = ['ROLE_DEFAULT']
              this.permissions = []
            }
            
            console.log('设置用户角色:', this.roles)
            console.log('设置用户权限:', this.permissions)

            // 设置用户基本信息
            this.id = user.userId || user.id || ''
            this.name = user.userName || user.username || user.name || ''
            this.avatar = avatar
            
            resolve(res)
          }).catch(error => {
            console.error('获取用户信息失败:', error)
            reject(error)
          })
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          logout(this.token).then(() => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            resolve()
          }).catch(error => {
            console.error('退出登录失败:', error)
            // 即使退出失败，也要清除本地数据
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            resolve() // 继续执行，不阻止用户退出
          })
        })
      }
    }
  })

export default useUserStore
