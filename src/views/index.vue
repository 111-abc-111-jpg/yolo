<script setup lang="ts">
import {
    Management,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom,
    Bell
} from '@element-plus/icons-vue';
import { useUserInfoStore } from '@/stores/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useTokenStore } from '@/stores/token';
import { ref } from 'vue';
import { useRouter } from 'vue-router';



const mockUserInfo = {
    name: '111',       
    email: '1234567890@qq.com',
    nickname: '547',
    phone: '1234567890',
    avatarUrl: '@/assets/a.png'
};


const userInfoStore = useUserInfoStore();
const tokenStore = useTokenStore();
const router = useRouter();

// 头像
tokenStore.setAvatarUrl('/src/assets/a.png')


const getUserInfo = () => {
    userInfoStore.info = mockUserInfo;
};
getUserInfo();

// Handle 下拉
const handleCommand = (command: string) => {
    if (command === 'logout') {
        ElMessageBox.confirm(
            '你确认退出登录吗？',
            '温馨提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(() => {
                userInfoStore.info = {
                    name: '',
                    email: '',
                    nickname: '',
                    phone: ''
                }; 
                tokenStore.token = '';
                router.push('/login');
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消退出',
                });
            });
    } else {
        router.push('/user/' + command);
    }
};
</script>

<template>
    <el-container class="layout-container">
        <!-- 左菜单 -->
        <el-aside width="200px">
            
            <el-menu active-text-color="white" background-color="#768aa5" text-color="#fff" router>
                <el-menu-item index="/echar/ech" class="el-aside__white">
                    <el-icon><Crop /></el-icon>
                    <span>实时告警</span>
                </el-menu-item>
                <el-menu-item index="/warn/warn">
                    <el-icon><Bell /></el-icon>
                    <span>告警查询</span>
                </el-menu-item>
                <el-menu-item index="/board/board">
                    <el-icon><Management /></el-icon>
                    <span>管理</span>
                    <span></span>
                </el-menu-item>

                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><UserFilled /></el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon><User /></el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/password">
                        <el-icon><EditPen /></el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
                
            </el-menu>
        </el-aside>

        <!-- 右边 -->
        <el-container>
            <!-- Header -->
            <el-header>
                <div>当前用户：<strong>{{ userInfoStore.info.nickname }}</strong></div>
                <div style="font-size: 20px;">YoLo算法盒子</div>
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="tokenStore.avatarUrl" />
                        <el-icon><CaretBottom /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>

            <!-- Main content -->
            <el-main>
                <router-view></router-view>
            </el-main>

            <!-- Footer -->
            <el-footer>YoLo算法盒子</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #768aa5;

        &__logo {
            height: 120px;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-aside__white{
        margin-top: 0px;
    }
    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666666;
    }
}
</style>