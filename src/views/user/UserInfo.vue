<script setup lang="ts">
import { ref } from 'vue';
import { useUserInfoStore } from '@/stores/user';
import { ElMessage } from 'element-plus';

const rules = {
    nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        {
            pattern: /^\S{2,10}$/,
            message: '昵称必须是2-10位的非空字符串',
            trigger: 'blur',
        },
    ],
    phone: [
        { required: true, message: '请输入用户电话', trigger: 'blur' },
    ],
};


const updateUserInfo = () => {
    ElMessage.success('修改成功');
    userInfoStore.info.nickname = userInfo.value.nickname;
    userInfoStore.info.phone = userInfo.value.phone;
};


const userInfoStore = useUserInfoStore();
const userInfo = ref({ ...userInfoStore.info });

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本资料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="登录名称">
                        <el-input v-model="userInfo.name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickname">
                        <el-input v-model="userInfo.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="用户电话" prop="phone">
                        <el-input v-model="userInfo.phone"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>