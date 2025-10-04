<template>
  <div class="register">
    <el-form ref="registerRef" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">注册-乡村特色产业标准化生产服务规范与质量评价系统</h3>
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" type="text" size="large" auto-complete="off" placeholder="用户账号">
          <template #prefix><el-icon class="el-input__icon"><User /></el-icon></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="registerForm.password" type="password" size="large" auto-complete="off" placeholder="用户密码"
          @keyup.enter="handleRegister">
          <template #prefix><el-icon class="el-input__icon"><Lock /></el-icon></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input v-model="registerForm.confirmPassword" type="password" size="large" auto-complete="off"
          placeholder="确认密码" @keyup.enter="handleRegister">
          <template #prefix><el-icon class="el-input__icon"><Lock /></el-icon></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input size="large" v-model="registerForm.code" auto-complete="off" placeholder="图形验证码" style="width: 63%"
          @keyup.enter="handleRegister">
          <template #prefix><el-icon class="el-input__icon"><MessageBox /></el-icon></template>
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img" />
        </div>
      </el-form-item>

      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="large" type="primary" style="width:100%;" @click.prevent="handleRegister">
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div style="float: right;">
          <router-link class="link-type" :to="'/login'">使用已有账户登录</router-link>
        </div>
      </el-form-item>
      
      <!-- 用户协议提示 -->
      <div class="agreement-tip">
        点击注册，即表示您同意<a href="#" class="agreement-link">用户注册协议</a>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getCurrentInstance } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { User, Lock, MessageBox } from '@element-plus/icons-vue';
import { getCodeImg, register } from "@/api/login";

const router = useRouter();
const { proxy } = getCurrentInstance();

const registerForm = ref({
  username: "",
  password: "",
  confirmPassword: "",
  code: "",
  uuid: "",
  roleKey: "people"
});

const equalToPassword = (rule, value, callback) => {
  if (registerForm.value.password !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const registerRules = {
  username: [
    { required: true, trigger: "blur", message: "请输入您的账号" },
    { min: 2, max: 20, message: "用户账号长度必须介于 2 和 20 之间", trigger: "blur" }
  ],
  password: [
    { required: true, trigger: "blur", message: "请输入您的密码" },
    { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" },
    { pattern: /^[^<>'"|\\]+$/, message: "不能包含非法字符：< > \" ' \\ |", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, trigger: "blur", message: "请再次输入您的密码" },
    { required: true, validator: equalToPassword, trigger: "blur" }
  ],
  code: [{ required: true, trigger: "change", message: "请输入图形验证码" }]
};

const codeUrl = ref("");
const loading = ref(false);
const captchaEnabled = ref(true);

function handleRegister() {
  proxy.$refs.registerRef.validate(valid => {
    if (valid) {
      loading.value = true;
      const payload = {
        username: registerForm.value.username,
        password: registerForm.value.password,
        code: registerForm.value.code,
        uuid: registerForm.value.uuid,
        roleKey: registerForm.value.roleKey
      };
      register(payload).then(res => {
        const username = registerForm.value.username;
        ElMessageBox.alert("<font color='red'>恭喜你，您的账号 " + username + " 注册成功！</font>", "系统提示", {
          dangerouslyUseHTMLString: true,
          type: "success",
        }).then(() => {
          router.push("/login");
        }).catch(() => { });
      }).catch(err => {
        loading.value = false;
        const errorMsg = err.msg || err.message || '注册失败，请重试';
        ElMessage.error(errorMsg);
        if (captchaEnabled.value) {
          getCode();
        }
      });
    }
  });
}

function getCode() {
  getCodeImg().then(res => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      registerForm.value.uuid = res.uuid;
    }
  });
}

getCode();
</script>

<style lang='scss' scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("../assets/images/loginbg.jpeg");
  background-size: cover;
}

.title {
  margin: 0px auto 35px auto;
  text-align: center;
  color: #707070;
  font-size: 22px;
}

.register-form {
  background: rgba($color: #fff, $alpha: 0.8);
  width: 500px;
  padding: 35px 35px 15px 35px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  .el-input {
    height: 45px;

    input {
      height: 45px;
      font-size: 16px;
    }
  }

  .input-icon {
    height: 44px;
    width: 16px;
    margin-left: 0px;
  }
}

.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.register-code {
  width: 33%;
  height: 45px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.register-code-img {
  height: 45px;
  padding-left: 12px;
}

.link-type {
  color: #409eff;
  font-size: 14px;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

.agreement-tip {
  text-align: center;
  font-size: 12px;
  color: #909399;
  margin-top: 15px;
  line-height: 1.5;
}

.agreement-link {
  color: #409eff;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}
</style>

