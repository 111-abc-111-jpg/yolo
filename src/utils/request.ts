// 定制请求的实例
import { useTokenStore } from '@/stores/token';
import { ElMessage } from 'element-plus';
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/router';

// 定义一个变量, 记录公共的前缀 baseURL
const baseURL = '';
const instance = axios.create({ baseURL });

// 添加请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (err) => {
    // 如果请求错误做什么
    return Promise.reject(err);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (result: AxiosResponse) => {
    // 判断响应 code 是否为 200，表示成功返回数据
    if (result.data.code === 200) {
      return result.data;
    }

    // 根据不同的错误 code 处理
    switch (result.data.code) {
      case 11401:
        ElMessage.error('通道状态不能为空');
        break;
      case 11402:
        ElMessage.error('RTSP地址不能为空');
        break;
      case 11403:
        ElMessage.error('通道名称不能为空');
        break;
      case 11404:
        ElMessage.error('通道名称已经存在');
        break;
      case 11405:
        ElMessage.error('无效的JSON格式');
        break;
      case 11406:
        ElMessage.error('算法类型不能为空');
        break;
      case 11407:
        ElMessage.error('开关状态不能为空');
        break;
      case 11408:
        ElMessage.error('灵敏度不能为空');
        break;
      case 11409:
        ElMessage.error('上报频率不能为空');
        break;
      default:
        ElMessage.error(result.data.msg || '服务离线');
    }

    return Promise.reject(result.data);
  },
  (err) => {
    // 判断响应状态码是否为 402，无权访问
    if (err.response?.status === 402) {
      ElMessage.error('无权查看此内容');
      return null;
    }

    // 如果状态码为 401，表示未登录，跳转到登录页
    if (err.response?.status === 401) {
      ElMessage.error('请先登录！');
      router.push('/login');
    } else {
      // 其他错误，统一处理
      ElMessage.error('服务离线');
    }

    return Promise.reject(err); // 返回失败的状态
  }
);

export default instance;