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
            <div v-if="!isLoginOrRegister()" class="auth">
                <template v-if="isLoggedIn">
                    <span class="admin-link">欢迎, {{ username }}</span>
                    <router-link to="/index" class="admin-link">后台管理</router-link>
                </template>
                <template v-else>
                    <router-link to="/login" class="auth-link"> 登录</router-link>
                    <router-link to="/register" class="auth-link"> 注册</router-link>
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
            <span>Copyright © 2018-2024 江西农业大学 All Rights Reserved.</span>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import useUserStore from '@/store/modules/user'
import { useRouter } from 'vue-router';

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




onMounted(() => {
    window.addEventListener('scroll', onScroll);
    if (user.token) {
        isLoggedIn.value = true;
        if (user.name) {
            username.value = user.name;
        } else {
            user.getInfo().then(() => {
                username.value = user.name;

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
.header-scrolled .admin-link {
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
    z-index: 99999;
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
  