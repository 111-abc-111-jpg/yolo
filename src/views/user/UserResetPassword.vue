<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 定义 userInfo 数据结构类型
interface UserInfo {
    lowPassWord: string;
    newPassWord: string;
    rePassWord: string;
}

// 初始化用户密码信息
const userInfo = ref<UserInfo>({
    lowPassWord: '',
    newPassWord: '',
    rePassWord: ''
});

// 清空用户密码输入
const clearRegisterData = (): void => {
    userInfo.value = {
        lowPassWord: '',
        newPassWord: '',
        rePassWord: ''
    };
};

// 验证确认密码和新密码是否一致
const rePasswordValid = (rule: any, value: string, callback: (error?: Error) => void): void => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== userInfo.value.newPassWord) {
        callback(new Error('两次密码不一致'));
    } else {
        callback();
    }
};

// 模拟密码更新逻辑
const updatePWD = (): void => {
    const storedPassword = localStorage.getItem('password20240921');
    
    if (userInfo.value.lowPassWord !== storedPassword) {
        ElMessage.error('旧密码不正确');
        return;
    }
    
    if (userInfo.value.newPassWord === userInfo.value.rePassWord) {
        localStorage.setItem('password20240921', userInfo.value.newPassWord); // 更新密码
        
        ElMessage.success('密码修改成功');
        clearRegisterData(); // 清空表单
    } else {
        ElMessage.error('两次输入的密码不一致');
    }
};

// 表单验证规则
const rules = {
    newPassWord: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度必须为5~16位', trigger: 'blur' }
    ],
    rePassWord: [
        { required: true, validator: rePasswordValid, trigger: 'blur' }
    ]
};
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>修改密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="旧密码">
                        <el-input v-model="userInfo.lowPassWord" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassWord">
                        <el-input v-model="userInfo.newPassWord" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="rePassWord">
                        <el-input v-model="userInfo.rePassWord" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatePWD">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>