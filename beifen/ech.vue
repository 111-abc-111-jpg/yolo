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
          <el-table-column label="通道状态" prop="channel_status"></el-table-column>
          <el-table-column label="详细信息">
            <template #default="{ row }">
              <el-tooltip class="item" effect="dark" content="点击查看详细信息" placement="top">
                <span @click="showDetails(row)">详情</span>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col>
      <div class="statistics-row">
        <div class="statistic-box" v-for="(item, index) in statisticsData" :key="index">
          <img :src="`/images/${item.src}`" alt="图片" class="image" style="width: 150px; height: 130px;"/>
          <div>{{ item.type }}</div>
          <p>时间: {{ item.time }}</p>
        </div>
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
import {getList} from '@/api/api'
import { ElTable, ElTableColumn, ElCard, ElRow, ElCol, ElTooltip, ElDialog, ElFormItem, ElForm } from 'element-plus';

// 定义视频播放组件的状态
const videoPlayer = ref(null);
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

//表格数据
const cameraList=ref([])

//获取表格数据
const getList=async ()=>{
  let res= await getList()
  console.log("获取产品列表",res)
}

// 选择视频
const selectVideo = (index: number) => {
  currentVideoIndex.value = index;
  videoPlayer.value.src = `/media/videos/${index + 1}.mp4`;
  videoPlayer.value.play();
};

// 视频播放结束处理
const handleVideoEnd = () => {
  if (currentVideoIndex.value < cameraList.value.length - 1) {
    selectVideo(currentVideoIndex.value + 1);
  } else {
    videoPlayer.value.pause();
  }
};

// 显示详细信息
const showDetails = (camera:any) => {
  Object.assign(cameraDetails, camera);
  dialogVisible.value = true;
};

// 统计数据数组
const statisticsData = ref([
  { src: 'people1.png', type: '人数统计', time: '2023-10-09 07:55' },
  { src: 'people2.png', type: '人数统计', time: '2023-10-09 07:56' },
  { src: 'people3.png', type: '人数统计', time: '2023-10-09 07:57' },
  { src: 'people4.png', type: '人数统计', time: '2023-10-11 09:01' },
  { src: 'car1.png', type: '车辆统计', time: '2023-09-10 10:03' },
]);


// 获取统计数据
const fetchStatistics = async () => {
  try {
    const response = await axios.get('/api/cam/get_camera');
    console.log(response)
    if (response.data && Array.isArray(response.data)) {
      statisticsData.value = response.data;
    } else {
      console.error('统计数据获取失败: 数据格式不正确');
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
};

// 在组件挂载时获取统计数据
onMounted(() => {
  fetchStatistics();
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
</style>





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
          <el-table-column label="通道状态" prop="channel_status"></el-table-column>
          <el-table-column label="详细信息">
            <template #default="{ row }">
              <el-tooltip class="item" effect="dark" content="点击查看详细信息" placement="top">
                <span @click="showDetails(row.id)">详情</span>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col>
      <div class="statistics-row">
        <div class="statistic-box" v-for="(item, index) in statisticsData" :key="index">
          <img :src="`/images/${item.src}`" alt="图片" class="image" style="width: 150px; height: 130px;"/>
          <div>{{ item.type }}</div>
          <p>时间: {{ item.time }}</p>
        </div>
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

//表格数据
const cameraList=ref([])

// 获取摄像头列表数据
onMounted(async () => {
  try {
    const response = await axios.get<{ code: number; camera_info: Camera[]; msg: string }>('/api/cam/get_form/1');
    if (response.data.code === 200 && response.data.camera_info) {
      cameraList.value = response.data.camera_info;
    } else {
      console.error(`获取摄像头数据失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
});


// 获取视频数据
const fetchVideo = async () => {
  try {
    const response = await axios.get<{ code: number; video_url: string; msg: string }>('/api/cam/get_video/1');
    if (response.data.code === 200 && response.data.video_url) {
      videoPlayer.value.src = response.data.video_url;
      videoPlayer.value?.play();
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
const selectVideo = async (index: number) => {
  const camera = cameraList.value[index];
  currentVideoIndex.value = index;
  try {
    const response = await axios.get(`/api/cam/get_video/1`);
    if (response.data.code === 200 && response.data.video_url) {
      videoPlayer.value.src = response.data.video_url;
      videoPlayer.value.play();
    } else {
      console.error(`获取视频数据失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
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


// 获取统计数据
const fetchStatistics = async () => {
  try {
    const response = await axios.get('/api/cam/get_img/1}');
    console.log(response);
    if (response.data && Array.isArray(response.data)) {
      statisticsData.value = response.data.map(item => ({
        src: item.img_url,
        type: item.type,
        time: item.time
      }));
    } else {
      console.error('统计数据获取失败: 数据格式不正确');
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
};

// 获取图片数据
const fetchImage = async (cam_id: number) => {
  try {
    const response = await axios.get(`/api/cam/get_img/1`);
    if (response.data.code === 200 && response.data.img_url) {
      const images = response.data.img_url.map(url => ({ src: url, type: '图片', time: 'N/A' }));
      statisticsData.value = statisticsData.value.concat(images);
    } else {
      console.error(`获取图片数据失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
};

// 在组件挂载时获取统计数据
onMounted(async () => {
  fetchStatistics();
  if (cameraList.value.length > 0) {
    fetchVideo(cameraList.value[1].id); // 假设默认获取第一个摄像头的视频
    fetchImage(cameraList.value[1].id); // 假设默认获取第一个摄像头的图片
  }
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
</style>