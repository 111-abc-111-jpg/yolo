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
        <el-table-column label="摄像头" prop="cam_name"></el-table-column>
        <el-table-column label="通道状态" prop="channel_status">
          <template #default="{ row }">
            <span :class="{'status-online': row.channel_status === '在线', 'status-offline': row.channel_status === '离线'}">
              {{ row.channel_status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="播放视频">
          <template #default="{ row }">
            <el-button @click="selectVideo(row.id)">播放</el-button>
          </template>
        </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col>
      <div style="width: auto; height: 450px;">
  <el-col
    v-for="(item, index) in state.tableData.records"
    :key="index"
    style="width: 200px; margin: 10px; margin-bottom: 10px; float: left;"
  >
    <el-card style="width: 200px;">
      <img
        :src="`/images/${item}`"
        alt="图片"
        class="image"
        style="width: 150px; height: 130px;"
      />
      <div style="text-align: center;">
        <div>人数统计</div>
        <div>2024-09-01 03:30:00</div>
      </div>
    </el-card>
  </el-col>
</div>
    </el-col>
    <el-dialog title="摄像头详细信息" :visible.sync="dialogVisible">
      <el-form label-width="120px">
        <el-form-item label="摄像头名称">
          {{ cameraDetails.name }}
        </el-form-item>
        <el-form-item label="状态">
          {{ cameraDetails.status }}
        </el-form-item>
        <el-form-item label="告警类型">
          {{ cameraDetails.alert_type }}
        </el-form-item>
        <el-form-item label="RTSP URL">
          {{ cameraDetails.rtsp_url }}
        </el-form-item>
        <el-form-item label="开关状态">
          {{ cameraDetails.switch_status ? '开启' : '关闭' }}
        </el-form-item>
        <el-form-item label="灵敏度">
          {{ cameraDetails.sensitivity }}
        </el-form-item>
        <el-form-item label="报告频率">
          {{ cameraDetails.report_frequency }}
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import {Camera} from '@/api/api'
import { ElTable, ElTableColumn, ElCard, ElRow, ElCol, ElTooltip, ElDialog, ElFormItem, ElForm } from 'element-plus';

// 定义视频播放组件的状态
const videoPlayer = ref();
const currentVideoIndex = ref(0);

// 定义摄像头详细信息的状态
const cameraDetails = reactive({
  name: '',
  status: '',
  alert_type: '',
  rtsp_url: '',
  switch_status: false,
  sensitivity: 0,
  report_frequency: 0
});

// 定义详细信息对话框的可见性
const dialogVisible = ref(false);

// 表格数据
const cameraList = ref([
  { id: 1, cam_name: '摄像头1', channel_status: '在线' },
  { id: 2, cam_name: '摄像头2', channel_status: '离线' },
  { id: 3, cam_name: '摄像头3', channel_status: '在线' },
]);

// 获取摄像头列表数据
const fetchCameraList = async () => {
  try {
    const response = await axios.get('/api/cam/get_form/1');
    if (response.data.code === 200) {
      cameraList.value = response.data.cam_info;
      console.log(response);
    } else {
      console.error(`获取摄像头数据失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
};


// 获取视频数据
const fetchVideo = async () => {
  try {
    const response = await axios.get('/api/cam/get_video/1');
    if (response.data.code === 200) {
      videoPlayer.value = response.data.video_url;
      // 确保在用户交互之后播放视频
      if (videoPlayer.value) {
        videoPlayer.value.play().catch((error:any) => {
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

// // 选择视频
// const selectVideo = (index: number) => {
//   currentVideoIndex.value = index;
//   videoPlayer.value.src = `/media/videos/${index + 1}.mp4`;
//   videoPlayer.value.play();
// };

// 选择视频
const selectVideo = async (cam_id: number) => {
  try {
    const response = await axios.get(`/api/cam/get_video/1`);
    if (response.data.code === 200 && response.data.video_url) {
      videoPlayer.value.src = response.data.video_url;
      playVideo(); 
    } else {
      console.error(`获取视频数据失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
};
// 播放视频
const playVideo = () => {
  if (videoPlayer.value) {
    videoPlayer.value.play().catch((error:any) => {
      console.error(`播放视频失败: ${error}`);
    });
  }
};
// 视频播放结束处理
const handleVideoEnd = () => {
  if (currentVideoIndex.value < cameraList.value.length - 1) {
    selectVideo(++currentVideoIndex.value);
  } else {
    videoPlayer.value.pause();
  }
};

// // 显示详细信息
// const showDetails = (camera:any) => {
//   Object.assign(cameraDetails, camera);
//   dialogVisible.value = true;
// };

// 显示详细信息，并从后端获取数据
const showDetails = async (cam_id: number) => {
  try {
    const response = await axios.get(`/api/cam/get_form/1`);
    if (response.data.code === 200) {
      cameraDetails.value = response.data.camera_info;
      dialogVisible.value = true;
      console.log(response);
    } else {
      console.error(`获取摄像头详细信息失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
};

// 统计数据数组
const statisticsData = ref([
  { src: 'people1.png', type: '人数统计', time: '2023-10-09 07:55' },
  { src: 'people2.png', type: '人数统计', time: '2023-10-09 07:56' },
  { src: 'people3.png', type: '人数统计', time: '2023-10-09 07:57' },
  { src: 'people4.png', type: '人数统计', time: '2023-10-11 09:01' },
  { src: 'car1.png', type: '车辆统计', time: '2023-09-10 10:03' },
]);

const state = reactive({
    tableData: {
      records: [],
      length: 0,
      param: {
        channel_type: "通道一",
        alert_type: "人数统计",
        start_datetime: "2024-09-01 01:30:00",
        end_datetime :"2024-09-01 04:00:00",
      },
    },
  });
const getTableData = (async () => {
  try {
    const response = await axios.get<{ code: number; msg: string; f_urls:any }>('/api/cam/get_img', {
      params: state.tableData.param
    });
    if (response.data.code === 200 ) {
      console.log(response)
      state.tableData.records = response.data.f_urls
    } else {
      console.error(`获取图片数据失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
});
getTableData();

// 在组件挂载时获取统计数据
onMounted(async () => {
  await fetchCameraList();
  await fetchVideo();
  await fetchImage();
});

const state = reactive({
  tableData: {
    records: [],
    param: {
      channel_type: "通道一",
      alert_type: "人数统计",
      start_datetime: "2024-09-01 01:30:00",
      end_datetime: "2024-09-01 04:00:00",
    },
  },
});

const getTableData = async () => {
  try {
    const response = await axios.get('/api/img/query_img', {
      params: state.tableData.param,
    });
    if (response.data.code === 200) {
      // 只获取前五个图片的URL
      state.tableData.records = response.data.f_urls.slice(0, 5);
    } else {
      console.error(`获取图片数据失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
};

getTableData();
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