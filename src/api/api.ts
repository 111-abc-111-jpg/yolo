import request from '@/utils/request';

// 通道参数类型
interface ChannelParams {
  status: string;
  rtsp_url: string;
  channel_name: string;
  id: number;
  updatetime: string;
}

// 新增通道接口
// export const addChannel = (params: ChannelParams): Promise<{ code: number; msg: string }> => {
//   return request.post('/api/channel/add_channel', params);
// };



// 算法配置参数类型
interface AlgorithmParams {
  alert_typ: string;
  switch_statu: string;
  sensitivity: string;
  report_frequency: string;
}

// 新增算法配置接口
// export const addAlgorithm = (params: AlgorithmParams): Promise<{ code: number; msg: string }> => {
//   return request.post('/api/channel/add_algorithm', params);
// };
//获取通道
export const getChannel = (): Promise<{ code: number; msg: string }> => {
  return request.get('/api/channel/get_channel');
};



// 更新通道参数类型
interface UpdateChannelParams {
  channel_name: string;
  rtsp_url: string;
}

// 更新通道接口
export const updateChannel = (params: UpdateChannelParams,id:Number): Promise<{ code: number; msg: string }> => {
  return request.post('/api/channel/update_channel?id='+id, params);
};



// 更新算法配置参数类型
interface UpdateAlgorithmParams {
  car_switch_status: string;
  car_sensitivity: Number;
  car_report_frequency: Number;
  human_switch_status: string;
  human_sensitivity: Number;
  human_report_frequency: Number;

}

// 更新算法配置接口
export const updateAlgorithm = (params: UpdateAlgorithmParams,id:Number): Promise<{ code: number; msg: string }> => {
  return request.post('/api/channel/update_algorithm?id='+id, params);
};

// 获取算法配置接口
export const getAlgorithm = (id:Number): Promise<{ code: number; msg: string }> => {
  return request.get('/api/cam/get_algorithm?id='+id);
};

// 重启通道接口（重启通道）
export const rebootChannel = (channelId: string): Promise<{ code: number; msg: string }> => {
  return request.get('/api/channel/reboot_channel?id='+channelId);
};


// 重启算法配置接口
export const resetAlgorithm = (algorithmId: string): Promise<{ code: number; msg: string }> => {
  return request.get('/api/channel/reset_algorithm?id='+algorithmId );
};


// 重置所有算法配置参数类型
interface ResetAllAlgorithmParams {
  // alert_type: string;
  // switch_status: string;
  // sensitivity: string;
  car_switch_status: string;
  car_sensitivity: Number;
  car_report_frequency: Number;
  human_switch_status: string;
  human_sensitivity: Number;
  human_report_frequency: Number;
}

// 重置所有算法配置接口（重置配置）
export const resetAllAlgorithm = (params: ResetAllAlgorithmParams): Promise<{ code: number; msg: string }> => {
  return request.post('/api/channel/reset_all_algorithm', params);
};


// 删除通道接口
// export const deleteChannel = (channelId: string): Promise<{ code: number; msg: string }> => {
//   return request.delete(`/channel/delete_channel`, { params: { id: channelId } });
// };


// 删除算法配置接口
// export const deleteAlgorithm = (algorithmId: string): Promise<{ code: number; msg: string }> => {
//   return request.delete(`/channel/delete_algorithm`, { params: { id: algorithmId } });
// };

// 表格
export interface Camera {
  id: number;
  cam_name: string;
  channel_status: string;
}

//统计数据
export interface StatisticData {
  src: string;
  type: string;
  time: string;
}