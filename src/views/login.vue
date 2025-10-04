<template>
  <div class="login">
    <!-- 左侧资讯模块 -->
    <div class="info-box">
      <div class="info-circle">
        <h3>行业资讯</h3>
        <div class="info-list">
          <div v-if="newsLoading" class="loading-container">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>加载中..</span>
          </div>
          <ul v-else>
            <li v-for="(item, index) in currentPageItems" :key="index">
              <a :href="item.url" target="_blank" class="news-link">{{ item.title }}</a>
              <span class="news-date">{{ item.date }}</span>
            </li>
          </ul>
        </div>
        <div class="page-controls">
          <el-button link @click="prevPage" :disabled="currentPage === 0">上一页</el-button>
          <el-button link @click="nextPage" :disabled="currentPage >= totalPages - 1">下一页</el-button>
        </div>
      </div>
      <div class="more-circle">
        <router-link to="/news" class="more-link">查看更多 </router-link>
      </div>
    </div>

    <!-- 登录表单 -->
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">用户登录</h3>

      <!-- 登录方式切换选项-->
      <el-tabs v-model="loginMethod" class="login-tabs">
        <el-tab-pane label="账号密码登录" name="account">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="账号" size="large" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码" size="large" @keyup.enter="handleLogin" />
          </el-form-item>

          <el-form-item prop="code" v-if="captchaEnabled">
            <el-input v-model="loginForm.code" placeholder="图形验证码" size="large" style="width: 63%" @keyup.enter="handleLogin" />
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" class="login-code-img" />
            </div>
          </el-form-item>

          <el-form-item>
            <div style="display: flex; align-items: center; gap: 8px;">
              <el-checkbox 
                v-model="loginForm.rememberMe" 
                @change="onRememberMeChange"
                style="pointer-events: auto; cursor: pointer;"
              >
                记住密码
              </el-checkbox>
              <span class="remember-tip">下次自动填充账号密码</span>
              <el-button 
                v-if="hasSavedCredentials" 
                link 
                size="small" 
                @click="clearSavedCredentials"
                class="clear-btn"
              >
                清除
              </el-button>
            </div>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="手机验证码登录" name="phone">
          <el-form-item prop="phone">
            <el-input v-model="loginForm.phone" placeholder="手机号码" size="large" />
          </el-form-item>

          <el-form-item prop="phoneCode">
            <el-input v-model="loginForm.phoneCode" placeholder="手机验证码" size="large" style="width: 63%" @keyup.enter="handleLogin" />
            <el-button 
              type="primary" 
              size="large" 
              style="width: 33%; float: right; height: 40px;"
              :disabled="phoneCodeCountdown > 0"
              @click="sendPhoneCodeHandler"
            >
              {{ phoneCodeCountdown > 0 ? `${phoneCodeCountdown}s` : '发送验证码' }}
            </el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item>
        <el-button :loading="loading" type="primary" size="large" style="width: 100%" @click.prevent="handleLogin">
          <span v-if="!loading">登录</span>
          <span v-else>登录中..</span>
        </el-button>
      </el-form-item>
      

      <!-- 底部跳转链接 -->
      <div class="login-footer">
        <router-link class="link-type" to="/forget-password">忘记密码?</router-link>
        <router-link class="link-type" to="/register">去注册</router-link>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { getCodeImg, sendPhoneCode, phoneLogin } from '@/api/login'
import { listPublicNews } from '@/api/public'
import useUserStore from '@/store/modules/user'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'

const router = useRouter()
const userStore = useUserStore()
const loginRef = ref(null)
const loading = ref(false)
const captchaEnabled = ref(true)
const codeUrl = ref('')

// 登录方式
const loginMethod = ref('account')

// 手机验证码倒计时
const phoneCodeCountdown = ref(0)

// 检查是否有保存的凭据
const hasSavedCredentials = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  phone: '',
  phoneCode: '',
  rememberMe: false,
  code: '',
  uuid: ''
})

// 账号密码登录验证规则
const accountRules = reactive({
  username: [
    { required: true, trigger: 'blur', message: '请输入您的账号' }
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入您的密码' }
  ],
  code: [
    { required: true, trigger: 'change', message: '请输入图形验证码' }
  ]
})

// 手机验证码登录验证规则
const phoneRules = reactive({
  phone: [
    { required: true, trigger: 'blur', message: '请输入手机号码' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  phoneCode: [
    { required: true, trigger: 'blur', message: '请输入手机验证码' },
    { len: 6, message: '验证码长度应为6位', trigger: 'blur' }
  ]
})

// 当前使用的验证规则（动态切换）
const loginRules = computed(() => {
  return loginMethod.value === 'account' ? accountRules : phoneRules
})

// 监听验证码启用状态变化，动态设置验证码字段
watch(captchaEnabled, (enabled) => {
  if (loginMethod.value === 'account') {
    accountRules.code[0].required = enabled
  }
})

// 默认资讯数据
const defaultNewsData = [
  {
    title: '政府工作报告',
    url: 'https://www.gov.cn/yaowen/liebiao/202503/content_7013163.htm',
    date: '2025-03-12'
  },
  {
    title: '中共中央 国务院印发《乡村全面振兴规划（2024-2027年）',
    url: 'https://www.gov.cn/gongbao/2025/issue_11846/202502/content_7002798.html',
    date: '2025-01-22'
  },
  {
    title: '扶持新型农业经营主体和服务主体提升发展三年攻坚行动相关措施工作指导',
    url: 'https://hzjjs.moa.gov.cn/gzdt/202502/t20250220_6470233.htm',
    date: '2025-02-20'
  },
  {
    title: '2025年中央财政强农惠农富农政策清单（农业农村部）',
    url: 'https://www.moa.gov.cn/xw/zxfb/202503/t20250318_6471961.htm',
    date: '2025-03-18'
  },
  {
    title: '云南石林推动特色产业规模化种植标准化生产品牌化发展',
    url: 'https://www.xuexi.cn/local/normalTemplate.html?itemId=9365221952836632462',
    date: '2024-09-08'
  },
  {
    title: '乡村特色产业带经济向"可持续发展"而生',
    url: 'https://www.moa.gov.cn/xw/qg/202409/t20240925_6463302.htm',
    date: '2024-09-25'
  },
  {
    title: '湖北夷陵烟草：探索特色产业标准化示范绘就乡村振兴新画卷',
    url: 'http://hb.people.com.cn/n2/2023/1118/c192237-40645406.html',
    date: '2023-11-18'
  },
  {
    title: '农业标准化生产实施方案（2022-2025年）',
    url: 'http://big5.www.gov.cn/gate/big5/www.gov.cn/zhengce/zhengceku/2022-09/25/5711798/files/289a062404684f488706dba130fa4e8d.pdf',
    date: '2022-09-16'
  }
]

// 资讯列表数据
const newsList = ref([])
const newsLoading = ref(false)

// 分页相关
const currentPage = ref(0)
const pageSize = 5
const totalPages = computed(() => Math.ceil(newsList.value.length / pageSize))
const currentPageItems = computed(() => {
  const start = currentPage.value * pageSize
  return newsList.value.slice(start, start + pageSize)
})

// 获取资讯列表
const getNewsList = async () => {
  try {
    newsLoading.value = true
    const response = await listPublicNews({
      pageNum: 1,
      pageSize: 20, // 获取更多数据用于分页显示
      orderByColumn: 'publishDate',
      isAsc: 'desc' // 按发布日期倒序排列
    })
    
    if (response && response.rows && response.rows.length > 0) {
      // 转换数据格式以适配模板
      newsList.value = response.rows.map(item => ({
        title: item.title,
        url: item.url,
        date: item.publishDate ? item.publishDate.split(' ')[0] : '' // 只取日期部分
      }))
      console.log('成功获取资讯数据:', newsList.value.length, )
    } else {
      // API返回空数据，使用默认数据
      console.log('API返回空数据，使用默认资讯数据')
      newsList.value = [...defaultNewsData]
    }
  } catch (error) {
    console.error('获取资讯列表失败:', error)
    console.log('使用默认资讯数据')
      // API调用失败，使用默认数据
    newsList.value = [...defaultNewsData]
  } finally {
    newsLoading.value = false
  }
}

// 翻页方法
const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

// 发送手机验证码
const sendPhoneCodeHandler = () => {
  if (!loginForm.phone) {
    ElMessage.warning("请先输入手机号码");
    return;
  }
  
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(loginForm.phone)) {
    ElMessage.warning("请输入正确的手机号码");
    return;
  }
  
  // 调用发送手机验证码的API
  sendPhoneCode(loginForm.phone).then(res => {
    ElMessage.success("验证码已发送");
    startCountdown();
  }).catch(err => {
    ElMessage.error("验证码发送失败，请重试");
  });
}

// 开始倒计时
const startCountdown = () => {
  phoneCodeCountdown.value = 60;
  const timer = setInterval(() => {
    phoneCodeCountdown.value--;
    if (phoneCodeCountdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
}

// 处理登录
const handleLogin = () => {
  loginRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      console.log('开始登录，登录方式:', loginMethod.value)
      console.log('登录表单数据:', loginForm)
      
      if (loginMethod.value === 'account') {
        // 账号密码登录
        if (loginForm.rememberMe) {
          try {
            // 保存用户信息到Cookie，设30天过期
            Cookies.set('username', loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(loginForm.password), { expires: 30 })
            Cookies.set('rememberMe', 'true', { expires: 30 })
            console.log('用户信息已保存到Cookie')
          } catch (error) {
            console.error('保存用户信息到Cookie失败:', error)
            ElMessage.warning('记住密码功能暂时不可用')
          }
        } else {
          // 清除保存的用户信息
          Cookies.remove('username')
          Cookies.remove('password')
          Cookies.remove('rememberMe')
          console.log('已清除保存的用户信息')
        }
        
        // 调用登录接口
        userStore.login(loginForm).then(() => {
          console.log('登录成功')
          // 登录成功后立即获取用户信息
          return userStore.getInfo()
        }).then(() => {
          console.log('用户信息获取成功')
          router.push({ path: '/' })
        }).catch((error) => {
          console.error('登录失败:', error)
          ElMessage.error('登录失败: ' + (error.message || '未知错误'))
          loading.value = false
          if (captchaEnabled.value) {
            // 重新获取验证码
            setTimeout(() => {
              getCode()
            }, 500)
          }
        })
      } else {
        // 手机验证码登录
        console.log('使用手机验证码登录')
        phoneLogin(loginForm.phone, loginForm.phoneCode).then(() => {
          console.log('手机登录成功')
          router.push({ path: '/' })
        }).catch((error) => {
          console.error('手机登录失败:', error)
          ElMessage.error('登录失败: ' + (error.message || '未知错误'))
          loading.value = false
        })
      }
    } else {
      console.log('表单验证失败')
      console.log('当前登录方式:', loginMethod.value)
      console.log('当前验证规则:', loginRules.value)
      console.log('当前表单数据:', loginForm)
      console.log('验证码是否启用?', captchaEnabled.value)
      ElMessage.warning('请检查输入信息是否完整')
    }
  })
}

// 获取验证码
const getCode = () => {
  getCodeImg().then(res => {
    console.log('验证码API响应:', res)
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled
    if (captchaEnabled.value) {
      // 检查返回的图片数据
      const imgData = res.img || res.data || res.image
      if (imgData) {
        codeUrl.value = 'data:image/gif;base64,' + imgData
        loginForm.uuid = res.uuid
      } else {
          console.error('验证码图片数据为空?', res)
        ElMessage.error('获取验证码失败，请重试')
        captchaEnabled.value = false
      }
    }
    // 更新账号密码登录的验证码字段验证规则
    accountRules.code[0].required = captchaEnabled.value
  }).catch(error => {
    console.error('获取验证码失败?', error)
    ElMessage.error('获取验证码失败，请检查网络连接')
    captchaEnabled.value = false
  })
}

// 从cookie获取保存的用户信息
const getCookie = () => {
  try {
    const username = Cookies.get('username')
    const password = Cookies.get('password')
    const rememberMe = Cookies.get('rememberMe')
    
    if (username) {
      loginForm.username = username
    }
    
    if (password && rememberMe === 'true') {
      try {
        const decryptedPassword = decrypt(password)
        if (decryptedPassword) {
          loginForm.password = decryptedPassword
          loginForm.rememberMe = true
          hasSavedCredentials.value = true
        }
      } catch (error) {
        console.warn('密码解密失败，可能是加密方式已更改?', error)
        // 清除无效的密码Cookie
        Cookies.remove('password')
        Cookies.remove('rememberMe')
        loginForm.rememberMe = false
        hasSavedCredentials.value = false
      }
    } else {
      loginForm.rememberMe = false
      hasSavedCredentials.value = false
    }
  } catch (error) {
    console.error('读取Cookie失败:', error)
    loginForm.rememberMe = false
    hasSavedCredentials.value = false
  }
}

// 清除保存的凭据
const clearSavedCredentials = () => {
  try {
    Cookies.remove('username')
    Cookies.remove('password')
    Cookies.remove('rememberMe')
    loginForm.username = ''
    loginForm.password = ''
    loginForm.rememberMe = false
    hasSavedCredentials.value = false
    ElMessage.success('已清除保存的登录信息')
  } catch (error) {
    console.error('清除保存的凭据失败?', error)
    ElMessage.error('清除失败，请重试')
  }
}

// 复选框状态变化监听
const onRememberMeChange = (value) => {
  console.log('记住密码状态改变?', value)
}


// 初始化
getCode()
getCookie()
getNewsList()
</script>

<style scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  padding: 0 80px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #cbd5e1 70%, #94a3b8 100%);
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
}

.login::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('@/assets/images/loginbg.jpeg') no-repeat center center;
  background-size: cover;
  opacity: 0.3;
  z-index: 0;
}

.login::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: backgroundMove 20s linear infinite;
  z-index: 1;
}

@keyframes backgroundMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* 资讯框样式*/
.info-box {
  position: relative;
  width: 480px;
  height: 480px;
  z-index: 10;
}

.info-circle {
  position: relative;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  padding: 50px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-align: center;
  z-index: 3;
  animation: float 4s ease-in-out infinite;
  transition: all 0.3s ease;
}

.info-circle:hover {
  transform: translateY(-10px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.more-circle {
  position: absolute;
  bottom: -40px;
  right: -40px;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8));
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  z-index: 2;
  animation: float 3.5s ease-in-out infinite;
  animation-delay: 0.8s;
  transition: all 0.3s ease;
}

.more-circle:hover {
  transform: scale(1.05) translateY(-5px);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-8px) rotate(1deg);
  }
  50% {
    transform: translateY(-20px) rotate(0deg);
  }
  75% {
    transform: translateY(-8px) rotate(-1deg);
  }
}

.more-link {
  color: rgba(255, 255, 255, 0.95);
  font-size: 18px;
  text-decoration: none;
  font-weight: 600;
  writing-mode: vertical-lr;
  letter-spacing: 8px;
  padding: 25px;
  margin-right: 25px;
  margin-bottom: 25px;
  transition: all 0.3s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.more-link:hover {
  color: #ffffff;
  transform: scale(1.1);
  text-shadow: 0 4px 12px rgba(255, 255, 255, 0.4);
}

.info-circle h3 {
  margin-bottom: 30px;
  color: #1e293b;
  font-size: 28px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-list {
  height: 260px;
  overflow: hidden;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  font-size: 14px;
}

.loading-container .el-icon {
  font-size: 20px;
  margin-bottom: 8px;
}

.info-list ul {
  padding: 0;
  list-style: none;
  margin: 0;
}

.info-list ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #ebeef5;
}

.info-list ul li:last-child {
  border-bottom: none;
}

.news-link {
  color: #475569;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 15px;
  display: inline-block;
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
}

.news-link:hover {
  color: #1e293b;
  transform: translateX(5px);
  text-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.news-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.3s ease;
}

.news-link:hover::after {
  width: 100%;
}

.news-date {
  color: #64748b;
  font-size: 13px;
  margin-left: 10px;
  font-weight: 500;
}

.page-controls {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.page-controls .el-button {
  padding: 8px 20px;
  font-size: 15px;
  color: #475569;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.page-controls .el-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.95);
  color: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.page-controls .el-button:disabled {
  color: #94a3b8;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.4);
}

/* 登录表单样式 */
.login-form {
  width: 450px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.95);
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
}

.login-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  border-radius: 20px;
  z-index: -1;
}

.login-form:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.login-form .title {
  text-align: center;
  margin-bottom: 35px;
  color: #1e293b;
  font-size: 32px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8);
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.login-form .title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

/* 登录选项卡样�?*/
.login-tabs {
  margin-bottom: 30px;
}

.login-tabs :deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
}

.login-tabs :deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
  font-size: 16px;
  height: 45px;
  line-height: 45px;
  color: #64748b;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin: 0 2px;
}

.login-tabs :deep(.el-tabs__item.is-active) {
  background: rgba(255, 255, 255, 0.8);
  color: #1e293b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.login-tabs :deep(.el-tabs__active-bar) {
  display: none;
}

.login-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

/* 表单控件美化 */
.login-form :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: rgba(100, 116, 139, 0.4);
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.05),
    0 0 0 3px rgba(59, 130, 246, 0.1);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.05),
    0 0 0 3px rgba(59, 130, 246, 0.2);
}

.login-form :deep(.el-input__inner) {
  color: #1e293b;
  background: transparent;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: #94a3b8;
}

.login-form :deep(.el-checkbox__label) {
  color: #475569;
}

.login-form :deep(.el-checkbox__inner) {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(148, 163, 184, 0.4);
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.login-form :deep(.el-checkbox__inner:hover) {
  border-color: #3b82f6;
}

.login-form :deep(.el-checkbox__inner.is-checked) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.login-form :deep(.el-checkbox__inner.is-checked::after) {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 6px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.login-form :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.login-form :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 6px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* 确保复选框的勾选状态正确显�?*/
.login-form :deep(.el-checkbox.is-checked .el-checkbox__inner) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.login-form :deep(.el-checkbox.is-checked .el-checkbox__inner::after) {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 6px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* 确保复选框输入框的样式 */
.login-form :deep(.el-checkbox__input) {
  position: relative;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  outline: none;
  cursor: pointer;
}

.login-form :deep(.el-checkbox__input .el-checkbox__inner) {
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  background-color: #fff;
  z-index: 1;
  transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}

/* 记住密码相关样式 */
.remember-tip {
  font-size: 12px;
  color: #94a3b8;
  font-style: italic;
  transition: color 0.3s ease;
  margin-left: 8px;
}

.clear-btn {
  margin-left: 8px;
  font-size: 12px;
  color: #f56565;
  padding: 4px 8px;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  color: #e53e3e;
  background: rgba(245, 101, 101, 0.1);
  border-radius: 4px;
}

.login-form :deep(.el-button--primary) {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  height: 48px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-form :deep(.el-button--primary::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.login-form :deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.login-form :deep(.el-button--primary:hover::before) {
  left: 100%;
}

.login-form :deep(.el-button--primary:active) {
  transform: translateY(0);
}

/* 验证码样�?*/
.login-code {
  width: 33%;
  height: 40px;
  float: right;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.login-code-img:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 底部跳转按钮样式 */
.login-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.link-type {
  color: #64748b;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 12px;
  border-radius: 8px;
}

.link-type:hover {
  color: #1e293b;
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 响应式设�?*/
@media (max-width: 1200px) {
  .login {
    padding: 0 60px;
  }
  
  .info-box {
    width: 420px;
    height: 420px;
  }
  
  .info-circle {
    width: 420px;
    height: 420px;
    padding: 40px;
  }
  
  .more-circle {
    width: 240px;
    height: 240px;
    bottom: -35px;
    right: -35px;
  }
}

@media (max-width: 992px) {
  .login {
    flex-direction: column;
    justify-content: center;
    padding: 40px;
    gap: 40px;
  }
  
  .info-box {
    width: 380px;
    height: 380px;
  }
  
  .info-circle {
    width: 380px;
    height: 380px;
    padding: 35px;
  }
  
  .more-circle {
    width: 200px;
    height: 200px;
    bottom: -25px;
    right: -25px;
  }
  
  .login-form {
    width: 420px;
  }
}

@media (max-width: 768px) {
  .login {
    padding: 20px;
  }
  
  .info-box {
    width: 320px;
    height: 320px;
  }
  
  .info-circle {
    width: 320px;
    height: 320px;
    padding: 25px;
  }
  
  .info-circle h3 {
    font-size: 22px;
    margin-bottom: 20px;
  }
  
  .more-circle {
    width: 160px;
    height: 160px;
    bottom: -20px;
    right: -20px;
  }
  
  .more-link {
    font-size: 14px;
    letter-spacing: 4px;
    padding: 15px;
    margin-right: 15px;
    margin-bottom: 15px;
  }
  
  .login-form {
    width: 100%;
    max-width: 380px;
    padding: 30px 25px;
  }
  
  .login-form .title {
    font-size: 26px;
  }
  
  .news-link {
    font-size: 14px;
  }
  
  .info-list {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .login {
    padding: 15px;
  }
  
  .info-box {
    width: 280px;
    height: 280px;
  }
  
  .info-circle {
    width: 280px;
    height: 280px;
    padding: 20px;
  }
  
  .info-circle h3 {
    font-size: 18px;
    margin-bottom: 15px;
  }
  
  .more-circle {
    width: 120px;
    height: 120px;
    bottom: -15px;
    right: -15px;
  }
  
  .more-link {
    font-size: 12px;
    letter-spacing: 2px;
    padding: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  
  .login-form {
    padding: 25px 20px;
  }
  
  .login-form .title {
    font-size: 22px;
  }
  
  .news-link {
    font-size: 13px;
    max-width: 75%;
  }
  
  .news-date {
    font-size: 12px;
  }
  
  .info-list {
    height: 160px;
  }
  
  .page-controls {
    gap: 15px;
  }
  
  .page-controls .el-button {
    padding: 6px 15px;
    font-size: 14px;
  }
}
</style>


