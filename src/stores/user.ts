import { defineStore } from "pinia";
import { ref } from 'vue';

// 定义用户信息类型
interface UserInfo {
  name: string;
  email: string;
  nickname: string;  // 确保包含 nickname 字段
  phone: string;     // 确保包含 phone 字段
}

export const useUserInfoStore = defineStore('userInfo', () => {
  // 1. 定义用户信息，初始值为 UserInfo 类型的空值
  const info = ref<UserInfo>({
    name: '',
    email: '',
    nickname: '',
    phone: ''
  });

  // 2. 定义修改用户信息的方法
  const setInfo = (newInfo: UserInfo) => {
    info.value = newInfo;
  };

  // 3. 定义清空用户信息的方法
  const removeInfo = () => {
    // 清空时仍返回一个结构完整的 UserInfo 对象，避免报错
    info.value = {
      name: '',
      email: '',
      nickname: '',
      phone: ''
    };
  };

  return { info, setInfo, removeInfo };
}, {
  persist: true,  // 启用持久化
});