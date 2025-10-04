<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div>
    <!-- 顶部导航栏 -->
    <header :class="['header', { 'header-scrolled': isScrolled || !isHome() }]">
      <div @click="GoHome" class="left-content">
        <img src="../assets/logo/logo.jpeg" alt="logo" class="logo">
        <div v-if="isScrolled || !isHome()" class="text">
          乡村特色产业标准化生产服务规范与质量评价系统
        </div>
      </div>
      <!-- 农业标准库菜单 -->
      <div class="nav-menu" v-if="!isLoginOrRegister()">
        <router-link to="/home" class="nav-link">首页</router-link>
        <router-link to="/standards-center" class="nav-link">农业标准库</router-link>

        <!-- 服务主体准入评估下拉菜单 -->
        <div class="dropdown-menu" @mouseenter="showDropdown($event)" @mouseleave="hideDropdown($event)">
          <div class="nav-link dropdown-trigger">
            <router-link to="/apply/servicer">服务主体准入</router-link>
          </div>
          <div class="dropdown-content" ref="dropdown1">
            <router-link to="/apply/servicer" class="dropdown-item">主体申请</router-link>
            <router-link to="/audit/servicer" class="dropdown-item">资格审核</router-link>
            <router-link to="/my-application" class="dropdown-item">我的申请</router-link>
          </div>
        </div>

        <!-- 服务质量评价下拉菜单 -->
        <div class="dropdown-menu" @mouseenter="showDropdown($event)" @mouseleave="hideDropdown($event)">
          <div class="nav-link dropdown-trigger">
            <router-link to="/quality-evaluation">服务质量评价</router-link>
          </div>
          <div class="dropdown-content" ref="dropdown2">
            <router-link to="/quality-evaluation/dynamic-system" class="dropdown-item">动态评价</router-link>
            <router-link to="/quality-evaluation/analysis" class="dropdown-item">指标分析</router-link>
            <router-link to="/quality-evaluation/credit-assets" class="dropdown-item">信用资产</router-link>
          </div>
        </div>

        <a href="https://www.agristd.com" target="_blank" class="nav-link" title="农标通大模型 - 如遇访问问题请稍后重试">农标通大模型</a>
        <router-link to="/help-center" class="nav-link">帮助中心</router-link>
      </div>

      <!--用户认证区域-->
      <div v-if="!isLoginOrRegister()" class="auth">
        <template v-if="isLoggedIn">
          <span class="admin-link">欢迎, {{ username }}</span>
          <a :href="getAdminPath()" target="_blank" class="admin-link">| 后台管理</a>
        </template>
        <template v-else>
          <router-link to="/login" class="auth-link"> 登录</router-link>
        </template>
      </div>
      <div v-else class="auth">
        <router-link to="/" class="auth-link">返回首页</router-link>
      </div>
    </header>

    <!-- 内容区域 -->
    <main class="main-content">
      <router-view />
    </main>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2022-2024 江西农业大学 All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router';
const user = useUserStore();
const isLoggedIn = ref(false);
const username = ref('');
const isScrolled = ref(false);
const route = useRoute();

function isLoginOrRegister() {
  const loginRegisterPaths = ['/login', '/register'];
  return loginRegisterPaths.includes(route.path);
  // 或者通过路由名称判断
  // const loginRegisterNames = ['Login', 'Register'];
  // return loginRegisterNames.includes(route.name);
}
function isHome() {
  const loginRegisterPaths = ['/home'];
  return loginRegisterPaths.includes(route.path);
}
const onScroll = () => {
  const bannerHeight = 80; // 与 banner 的高度相同
  isScrolled.value = window.scrollY > bannerHeight;
};
const router = useRouter();
const GoHome = () => {
  router.push('/home')
}

// 下拉菜单控制
let dropdownTimers = {};

const showDropdown = (event) => {
  const dropdownMenu = event.currentTarget;
  const dropdownContent = dropdownMenu.querySelector('.dropdown-content');
  
  // 清除隐藏定时器
  if (dropdownTimers[dropdownMenu]) {
    clearTimeout(dropdownTimers[dropdownMenu]);
    delete dropdownTimers[dropdownMenu];
  }
  
  // 立即显示
  dropdownContent.style.display = 'block';
  dropdownContent.style.opacity = '0';
  dropdownContent.style.transform = 'translateY(-10px)';
  
  // 使用requestAnimationFrame确保样式已应用
  requestAnimationFrame(() => {
    dropdownContent.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    dropdownContent.style.opacity = '1';
    dropdownContent.style.transform = 'translateY(0)';
  });
};

const hideDropdown = (event) => {
  const dropdownMenu = event.currentTarget;
  const dropdownContent = dropdownMenu.querySelector('.dropdown-content');
  
  // 设置延迟隐藏
  dropdownTimers[dropdownMenu] = setTimeout(() => {
    dropdownContent.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
    dropdownContent.style.opacity = '0';
    dropdownContent.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      dropdownContent.style.display = 'none';
    }, 150);
    
    delete dropdownTimers[dropdownMenu];
  }, 200); // 200ms延迟
};

// 根据用户角色获取后台管理路径
const getAdminPath = () => {
  console.log('当前用户角色:', user.roles);
  if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
    // 检查是否包含admin角色
    if (user.roles.includes('admin') || user.roles.includes('ROLE_ADMIN')) {
      return '/admin/dashboard'  // 超级管理员跳转到管理后台
    } else if (user.roles.includes('servicer') || user.roles.includes('ROLE_SERVICER')) {
      return '/servicer/profile'
    } else if (user.roles.includes('producter') || user.roles.includes('ROLE_PRODUCTER')) {
      return '/producter/profile'
    }
  }
  return '/index'
}

// 监听用户状态变化
watch(() => user.token, (newToken) => {
  isLoggedIn.value = !!newToken;
  if (newToken && user.name) {
    username.value = user.name;
  } else if (!newToken) {
    username.value = '';
  }
}, { immediate: true });

// 监听用户名变化
watch(() => user.name, (newName) => {
  if (newName && user.token) {
    username.value = newName;
  }
}, { immediate: true });

onMounted(() => {
  window.addEventListener('scroll', onScroll);
  if (user.token) {
    isLoggedIn.value = true;
    if (user.name) {
      username.value = user.name;
    } else {
      user.getInfo().then(() => {
        username.value = user.name;
      }).catch(error => {
        console.error('获取用户信息失败:', error);
        // 如果获取用户信息失败，清除登录状态
        isLoggedIn.value = false;
        username.value = '';
      });
    }
  }
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped>
.header-scrolled {
  background-color: rgba(255, 255, 255) !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.left-content {
  display: flex;
  align-items: center;
}
.left-content:hover {
  cursor: pointer;
}
.logo {
  height: 50px;
  margin-right: 10px;
}
.text {
  font-size: 18px;
  font-weight: bold;
  color: black;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.header-scrolled .auth-link,
.header-scrolled .admin-link,
.header-scrolled .nav-link,
.header-scrolled .dropdown-item {
  color: var(--el-color-success) !important;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: transparent;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  height: 80px;
}
.auth {
  font-size: 18px;
}
.auth-link,
.admin-link {
  margin-left: 10px;
  text-decoration: none;
  color: white;
}
.auth-link:hover,
.admin-link:hover {
  color: var(--el-color-success)
}
/* 导航菜单样式 */
.nav-menu {
  display: flex;
  justify-content: center;
  flex-grow: 1;
  gap: 20px;
}
.nav-link {
  text-decoration: none;
  color: white;
  font-size: 20px;
  padding: 5px 10px;
  transition: all 0.3s ease;
}
.nav-link:hover {
  color: var(--el-color-success);
}
.nav-link.router-link-active {
  color: var(--el-color-success);
  font-weight: bold;
}

/* 下拉菜单样式 */
.dropdown-menu {
  position: relative;
  display: inline-block;
}
.dropdown-trigger {
  cursor: pointer;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1000;
  border-radius: 4px;
  padding: 8px 0;
  margin-top: 5px;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-item {
  color: #333;
  padding: 10px 16px;
  text-decoration: none;
  display: block;
  font-size: 16px;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dropdown-item:hover {
  background-color: #f5f5f5;
  color: var(--el-color-success);
}
.dropdown-menu:hover .dropdown-trigger {
  color: var(--el-color-success);
}

.main-content {
  height: 100%;
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  background-color: var(--el-color-success);
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>