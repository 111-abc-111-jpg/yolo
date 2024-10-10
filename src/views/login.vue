<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter()

// 登录表单数据
const loginData = ref({
  username: '',
  password: '',
});

// 注册表单数据
const registerData = ref({
  username: '',
  password: '',
  confirmPassword: '',
});

// 登录
const login = async () => {
  try {
    const response = await axios.post('/api/Users/login', {
      account: loginData.value.username,
      password: loginData.value.password,
    });
    if (response.data.code === 200) {
      ElMessage.success('登录成功');
      router.push('/index');
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('登录请求失败 ' );
  }
};

/// 注册
const register = async () => {
  try {
    // 确保两次输入的密码一致
    if (registerData.value.password !== registerData.value.confirmPassword) {
      ElMessage.error('两次输入的密码不一致');
      return;
    }
    
    const response = await axios.post('/api/Users/register', {
      account: registerData.value.username,
      password_1: registerData.value.password,
      password_2: registerData.value.confirmPassword,
    });
    
    if (response.data.code === 200) {
      ElMessage.success('注册成功');
      router.push('/login');
    } else {
      ElMessage.error(`注册失败: ${response.data.msg}`);
    }
  } catch (error) {
    ElMessage.error(`注册请求失败`);
  }
};

// 退出登录
const logout = async () => {
  try {
    const response = await axios.get('/api/Users/logout');
    if (response.data.code === 200) {
      ElMessage.success('退出成功');
      router.push('/login');
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('退出请求失败 ' );
  }
};

// 切换登录/注册视图
const isLoginView = ref(true);
const toggleView = () => {
  isLoginView.value = !isLoginView.value;
};

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '用户名的长度必须为3~16位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '密码长度必须为5~16位', trigger: 'blur' }
  ]
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '用户名的长度必须为3~16位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '密码长度必须为5~16位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: (error?: Error) => void) => {
        if (value !== registerData.value.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};
</script>

<template>
  <div class="login-register-page">
   
    <el-row type="flex" class="form" justify="center" align="middle">
      <el-col :span="18">
        <el-form v-if="isLoginView" ref="loginForm" size="large" autocomplete="off" :model="loginData" :rules="loginRules">
          <h1>YoLo算法盒子</h1>
          <el-form-item>
            <h2>登录</h2>
          </el-form-item>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginData.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginData.password"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="rember">
              <el-checkbox>记住我</el-checkbox>
              <el-link type="primary" :underline="false" @click="toggleView" class="rember-register">注册</el-link>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
          </el-form-item>
        </el-form>
  
        <el-form v-else ref="registerForm" size="large" autocomplete="off" :model="registerData" :rules="registerRules">
          <h1>YoLo算法盒子</h1>
          <el-form-item>
            <h2>注册</h2>
          </el-form-item>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input :prefix-icon="Lock" type="password" placeholder="请确认密码" v-model="registerData.confirmPassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-link type="primary" :underline="false" @click="toggleView">返回登录</el-link>
          </el-form-item>
          <el-form-item>
            <el-button class="button" type="primary" auto-insert-space @click="register">注册</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.login-register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff;
  background: url('@/assets/b.jpg') no-repeat center center / cover;
  
  .form {
    width: 100%;
    max-width: 500px;
  }

  .button {
    width: 100%;
  }

  .rember {
    display: flex;
    justify-content: space-between;
  }
  .rember-register {
    margin-left: 280px;
  }
}
</style>