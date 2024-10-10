<template>
  <el-row type="flex" class="row-bg">
    <el-col :span="12">
      <video
        ref="videoPlayer"
        width="750"
        height="400"
        controls
        @ended="handleVideoEnd"
      ></video>
    </el-col>
    <el-col :span="12" class="wrapper">
      <el-card class="heritage-table-container">
        <div slot="header">实时监控</div>
        <el-table :data="cameraList" style="width: 100%">
          <el-table-column label="序号" prop="cam_id" width="80">
            <template #default="{ $index }">
              <span>{{ $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="摄像头" prop="name"></el-table-column>
          <el-table-column label="通道状态" prop="status">
            <template #default="{ row }">
              <span :class="{'status-online': row.status === '在线', 'status-offline': row.status === '离线'}">
                {{ row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="详细信息">
            <template #default="scope">
            <el-popover placement="right" :width="180" trigger="click" ref="popover">
              <ul>
                  <li v-for="(value, key) in scope.row" :key="key" :style="{width: '100px'}">
                    {{ key }}: {{ value }}
                  </li>
                </ul>
              <template #reference>
                <el-icon color="#409efc" :size="20" style="margin-left: 18px;">
                  <Warning />
                </el-icon>
              </template>
            </el-popover>
          </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col>
      <!-- 模块列表 -->
    <div style="width: auto; height: 450px;">
      <el-col v-for="item in state.tableData.records" :key="item" style="width: 200px; margin: 10px; margin-bottom: 10px; float: left;">
        <el-card style="width: 200px;">
          <img :src="`${item}`" alt="图片" class="image" style="width: 150px; height: 130px;"/>
          <div style="text-align: center;">
            <div>人数统计</div>
            <div>2024-09-01 03:30:00</div>
          </div>
        </el-card>
      </el-col>
    </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { Camera, Warning } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { ElTable, ElTableColumn, ElCard, ElRow, ElCol, ElDialog, ElFormItem, ElForm } from 'element-plus';

const videoPlayer = ref<HTMLVideoElement | null>(null);
const currentVideoIndex = ref(0);
const cameraDetails = reactive({
  name: '',
  status: '',
  alert_type: '',
  rtsp_url: '',
  switch_status: false,
  sensitivity: 0,
  report_frequency: 0,
});
const dialogVisible = ref(false);


// // 表格数据
// const cameraList = ref([
//   { id: 1, cam_name: '摄像头1', channel_status: '在线' },
//   { id: 2, cam_name: '摄像头2', channel_status: '离线' },
//   { id: 3, cam_name: '摄像头3', channel_status: '在线' },
// ]);
// const fetchCameraList = async () => {
//   try {
//     const response = await axios.get('/api/cam/get_form');
//     if (response.data.code === 200) {
//       console.log(response);
//       cameraList.value = response.data.cam_info;
//     } else {
//       console.error(`获取摄像头数据失败: ${response.data.msg}`);
//     }
//   } catch (error) {
//     console.error(`请求失败: ${error}`);
//   }
// };

// const tablelist = reactive({
  
//     id:'',
//     name:'',
//     status:'',
  
// });
const cameraList = ref([]);
const fetchCameraList = (async () => {
  try {
    const response = await axios.get<{ code: number; msg: string; info:any;id:number;name:string;status:string }>('/api/cam/get_form', {
    });
    if (response.data.code === 200 ) {
      console.log(response);
      // tablelist.id = response.data.info.id;
      // tablelist.name = response.data.info.name;
      // tablelist.status = response.data.info.status;
      cameraList.value = response.data.info;
    } else {
      console.error(`获取图片数据失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
});



const fetchVideo = async () => {
  try {
    const response = await axios.get('/api/cam/get_video');
    if (response.data.code === 200) {
      if (videoPlayer.value) {
        videoPlayer.value.src = response.data.camera_info[0].file;
        videoPlayer.value.play().catch((error) => {
          console.error(`播放视频失败: ${error}`);
        });
      }
    } else {
      console.error(`获取视频数据失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
};

const selectVideo = async (id:number) => {
  try {
    const response = await axios.get(`/api/cam/get_video/${id}`);
    if (response.data.code === 200 && response.data.camera_info[0].file) {
      if (videoPlayer.value) {
        videoPlayer.value.src = response.data.camera_info[0].file;
        videoPlayer.value.play().catch((error) => {
          console.error(`播放视频失败: ${error}`);
        });
      }
    } else {
      console.error(`获取视频数据失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
};

const handleVideoEnd = () => {
  if (currentVideoIndex.value < cameraList.value.length - 1) {
    selectVideo(++currentVideoIndex.value);
  } else {
    if (videoPlayer.value) {
      videoPlayer.value.pause();
    }
  }
};

// const showDetails = async (id:number) => {
//   try {
//     const response = await axios.get(`/api/cam/get_detailedform`);
//     if (response.data.code === 200) {
//       const details = response.data.channel_s_data.find((item:any) => item.id === id);
//       if (details) {
//         cameraDetails.value = details;
//         dialogVisible.value = true;
//       } else {
//         console.error(`未找到摄像头详细信息: ${id}`);
//       }
//     } else {
//       console.error(`获取摄像头详细信息失败: ${response.data.msg}`);
//     }
//   } catch (error) {
//     console.error(`请求失败: ${error}`);
//   }
// };

const showDetails1 = ref([]);
const showDetails = (async () => {
  try {
    const response = await axios.get<{ code: number; msg: string; algorithms_data:any;id:number;car_report_frequency:string;human_alert_type:string;car_alert_type:string;human_switch_status:string }>('/api/cam/get_detailedform', {
    });
    if (response.data.code === 200 ) {
      console.log(response);
      showDetails1.value = response.data.algorithms_data;
    } else {
      console.error(`获取图片数据失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
});

// // 统计数据数组
// const statisticsData = ref([
//   { src: 'people1.png', type: '人数统计', time: '2023-10-09 07:55' },
//   { src: 'people2.png', type: '人数统计', time: '2023-10-09 07:56' },
//   { src: 'people3.png', type: '人数统计', time: '2023-10-09 07:57' },
//   { src: 'people4.png', type: '人数统计', time: '2023-10-11 09:01' },
//   { src: 'car1.png', type: '车辆统计', time: '2023-09-10 10:03' },
// ]);


const state = reactive({
  tableData: {
    records: [],
  },
});

const getTableData = (async () => {
  try {
    const response = await axios.get<{ code: number; msg: string; imgs_data:any }>('/api/cam/get_img', {
    });
    if (response.data.code === 200 ) {
      console.log(response);
      state.tableData.records = response.data.imgs_data[0];
    } else {
      console.error(`获取图片数据失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
});

onMounted(async () => {
  await fetchCameraList();
  await fetchVideo();
  getTableData();
  showDetails();
});
</script>

<style lang="scss" scoped>
.row-bg {
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  padding-left: 0px;
  float: left;
  justify-items: right; 
  align-items: center;
}

.heritage-table-container {
  margin: 20px;
  float: right;
  height: 400px;
}

.el-table {
  margin-top: 5px;
  margin-bottom: 10px;
  float: right;
}

.statistics-row {
  padding: 20px;
  max-width: auto;
  margin: auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap; /* 允许盒子换行 */
  gap: 10px; /* 设置盒子之间的间隔 */
  justify-content: space-between; /* 均匀分布盒子 */
}
.statistic-box {
  flex: 1; 
  min-width: 160px; 
  padding: 10px;
  border: 1px solid #e7e7e7; 
  background-color: #f9f9f9; 
}

.statistics h1 {
  text-align: center;
}

/* 添加在线和离线状态样式 */
.status-online {
  padding: 2px 8px;
  color: #fff;
  background-color: #aee1b0; /* 绿色背景 */
  border-radius: 4px;
}

.status-offline {
  padding: 2px 8px;
  color: #fff;
  background-color: #eecbc8; /* 红色背景 */
  border-radius: 4px;
}
</style>