<script setup lang="ts">
import {
  Edit,
  Delete,
  Plus,
  Search,
  Setting
} from '@element-plus/icons-vue';

import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import {
  getChannel,//获取通道
  // addChannel, // 新增通道
  updateChannel, // 更新通道
  // deleteChannel, // 删除通道
  rebootChannel, //重启通道
  resetAlgorithm,//重启算法配置
  updateAlgorithm, //更新算法
  getAlgorithm,
  resetAllAlgorithm, //重置所有算法
} from '@/api/api'; // 从 api 引入相应接口函数

interface Test {
  id: number;
  channel_name: string;
  car_switch_status: string;
  rtsp_url: string;
  status: string;
  sensitivity: string;
  updatetime: string

}
const TestList = ref<Test[]>();
const selectedRows = ref<any[]>([]);
const getModuleInfo = async () => {
  try {
    getChannel().then(res=>{
      console.log(res);
      TestList.value  = res.data
    });

    // ElMessage.success('修改通道信息成功');
    // visibleDrawer.value = false;
    // clearRegisterData();
    // getTestModules();
  } catch (error) {
    ElMessage.error('修改通道信息失败');
  }
};
getModuleInfo();
// 列表数据模型
// const TestList = ref<Test[]>([
//   { id: 1, channelName: 'ID_2232312', car_switch_status: '人数统计', rtsp_url: '1', status: '在线', time :'2024-10-01' ,sensitivity: '3' },
//   { id: 2, channelName: 'ID_2232312', car_switch_status: '火焰检测', rtsp_url: '2', status: '未配置', time :'2024-10-01' ,sensitivity: '3' },
//   { id: 3, channelName: 'ID_2232312', car_switch_status: '人数统计', rtsp_url: '3', status: '在线', time :'2024-10-01' ,sensitivity: '3' },
//   { id: 4, channelName: 'ID_2232312', car_switch_status: '火焰检测', rtsp_url: '4', status: '在线', time :'2024-10-01' ,sensitivity: '3' },
//   { id: 5, channelName: 'ID_2232312', car_switch_status: '人数统计', rtsp_url: '5', status: '未配置', time :'2024-10-01' ,sensitivity: '3' },
//   { id: 6, channelName: 'ID_2232312', car_switch_status: '火焰检测', rtsp_url: '6', status: '在线', time :'2024-10-01' ,sensitivity: '3' }
// ]);
//重启通道
const restartModule = ()=>{
    console.log();
    if(selectedRows.value.length > 0){
      for (const i in selectedRows.value) {

        rebootChannel(selectedRows.value[i].id).then(res=>{
          if(res.code == 200){
            ElMessage.success(res.msg);
            getModuleInfo()
          }else{
            ElMessage.error(res.msg);
          }
        });

      }

    }else{
      ElMessage.error('请选择通道');
    }

}
//选中
const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val;
};



//重启配置
const restartConfig = ()=>{
  if(selectedRows.value.length > 0){
    for (const i in selectedRows.value) {

      resetAlgorithm(selectedRows.value[i].id).then(res=>{
        if(res.code == 200){
          ElMessage.success(res.msg);
          getModuleInfo()
        }else{
          ElMessage.error(res.msg);
        }
      });

    }

  }else{
    ElMessage.error('请选择通道');
  }

}

// 分页数据模型
// const pageNum = ref(1);
// const total = ref(0);
// const pageSize = ref(5);

// 搜索条件
// const algorithmName = ref('');
// const channelName = ref('');
// const sensitivity = ref('');
// const status = ref('');

// 当每页条数发生变化时调用
// const onSizeChange = (size: number) => {
//   pageSize.value = size;
//   getTestModules();
// };

// 当页码发生变化时调用
// const onCurrentChange = (num: number) => {
//   pageNum.value = num;
//   getTestModules();
// };

// 获取 BIPV 列表 (模拟筛选功能)
// const getTestModules = async () => {
//   // 这里根据实际 API 进行调用
//   // 假设从后端获取通道数据
//   let filteredList = TestList.value.filter(item => {
//     return (!algorithmName.value || item.algorithmName.includes(algorithmName.value)) &&
//            (!sensitivity.value || item.sensitivity.includes(sensitivity.value)) &&
//            (!status.value || item.status === status.value) &&
//            (!channelName.value || item.channelName === channelName.value);
//   });
  
//   total.value = filteredList.length;
//   return filteredList.slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value);
// };

// 清空搜索表单
// const resetForm = () => {
//   algorithmName.value = "";
//   sensitivity.value = "";
//   status.value = "";
//   channelName.value = "";
//   getTestModules();
// };

// 控制抽屉是否显示
const visibleDrawer = ref(false);
const title = ref('');
const moduleInfo = ref({
  id: 0,
  alert_type: "人数统计",
  switch_status: "关",
  sensitivity: 60,
  report_frequency: 10,
  cl_alert_type: "车辆统计",
  cl_switch_status: "关",
  cl_sensitivity: 60,
  cl_report_frequency: 10,
  sync:false,
});

const editInfo = ref<Test>();
// 清空模块信息
const clearRegisterData = () => {
  moduleInfo.value = {
    id: 0,
    alert_type: "人数统计",
    switch_status: "关",
    sensitivity: 60,
    report_frequency: 10,
    cl_alert_type: "车辆统计",
    cl_switch_status: "关",
    cl_sensitivity: 60,
    cl_report_frequency: 10,
    sync:false,
  };
};

// 编辑抽屉
const showModuleInfo = (row: Test) => {
  getAlgorithm(row.id).then(res=>{
    console.log(res);
  }).catch(()=>{
    ElMessage.error('获取配置信息失败了');
  });
  title.value = '更新算法配置';
  visibleDrawer.value = true;
  editInfo.value=row
  moduleInfo.value.id = row.id
};
//更新配置
const updateConfig = () =>{
  console.log(moduleInfo);
  const id = moduleInfo.value.id;
  const tb = moduleInfo.value.sync;
  if(tb){
    resetAllAlgorithm({
      "human_switch_status":moduleInfo.value.switch_status,
      "car_switch_status":moduleInfo.value.cl_switch_status,
      "human_report_frequency":moduleInfo.value.report_frequency,
      "car_report_frequency":moduleInfo.value.cl_report_frequency,
      "human_sensitivity":moduleInfo.value.sensitivity,
      "car_sensitivity":moduleInfo.value.cl_sensitivity
    }).then(res=>{
      if(res.code == 200){
        ElMessage.success(res.msg);
        visibleDrawer.value = false;
        getModuleInfo()
      }else{
        ElMessage.error(res.msg);
      }
    })
  }else{
    updateAlgorithm({
      "human_switch_status":moduleInfo.value.switch_status,
      "car_switch_status":moduleInfo.value.cl_switch_status,
      "human_report_frequency":moduleInfo.value.report_frequency,
      "car_report_frequency":moduleInfo.value.cl_report_frequency,
      "human_sensitivity":moduleInfo.value.sensitivity,
      "car_sensitivity":moduleInfo.value.cl_sensitivity
    },id).then(res=>{
      if(res.code == 200){
        ElMessage.success(res.msg);
        visibleDrawer.value = false;
        getModuleInfo()
      }else{
        ElMessage.error(res.msg);
      }
    })
  }


}
// 添加模块信息
// const addModuleInfo = async () => {
//   try {
//     await addChannel({
//       status: moduleInfo.value.status, 
//       rtsp_url: `rtsp://${moduleInfo.value.rtsp_url}`, 
//       channel_name: moduleInfo.value.channelName, 
//     });
//     ElMessage.success('添加通道成功');
//     visibleDrawer.value = false;
//     clearRegisterData();
//     getTestModules();
//   } catch (error) {
//     ElMessage.error('添加通道失败');
//   }
// };

// 更新模块信息
const updateModuleInfo = (data:object) => {
  // console.log(row);
  const row = data.row;
  console.log(row.channel_name);
  const id = row.id;
  updateChannel({
      channel_name: row.channel_name,
      rtsp_url: row.rtsp_url,
    },id).then(res=>{
    ElMessage.success(res.msg);
    getModuleInfo()
  });
    // visibleDrawer.value = false;

};

// 删除模块信息
// const deleteTest = (row: Test) => {
//   ElMessageBox.confirm(
//     '你确认删除该信息吗？',
//     '温馨提示',
//     {
//       confirmButtonText: '确认',
//       cancelButtonText: '取消',
//       type: 'warning',
//     }
//   )
//   .then(async () => {
//     try {
//       await deleteChannel(row.id.toString());
//       ElMessage.success('删除通道成功');
//       getTestModules();
//     } catch (error) {
//       ElMessage.error('删除通道失败');
//     }
//   })
//   .catch(() => {
//     ElMessage({
//       type: 'info',
//       message: '取消删除',
//     });
//   });
// };

</script>

<template>
  <el-card class="page-container">
    <!-- <template #header>
      <div class="header">
        <span>通道管理</span>
        <div class="extra">
          <el-button type="primary" @click="title='算法配置'; visibleDrawer=true; clearRegisterData()">算法配置</el-button>
        </div>
      </div>
    </template> -->

    <!-- 搜索表单 -->
    <!-- <el-form inline>
      <el-form-item label="通道名称：" style="width: 40%">
        <el-input v-model="channelName" placeholder="请输入通道名称"></el-input>
      </el-form-item>
      <el-form-item label="灵敏度：" style="width: 40%">
        <el-input v-model="sensitivity" placeholder="请输入灵敏度"></el-input>
      </el-form-item>
      <el-form-item label="状态：" style="width: 40%">
        <el-select placeholder="请选择状态" v-model="status">
          <el-option label="在线" value="在线"></el-option>
          <el-option label="离线" value="离线"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTestModules">搜索</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form> -->

    <!-- 模块列表 -->
    <el-table :data="TestList" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="55px"></el-table-column>
      <el-table-column label="id" prop="id" width="120px"></el-table-column>
      <!-- <el-table-column label="通道名称" prop="channelName"></el-table-column> -->
      <el-table-column label="通道名称" width="250">
      <template #default="scope">
        <el-input v-model="scope.row.channel_name" @blur="updateModuleInfo(scope)" placeholder="请输入通道名称" ></el-input>
      </template>
    </el-table-column>
      <!-- <el-table-column label="灵敏度" prop="sensitivity"></el-table-column> -->
      <el-table-column label="rtsp地址" width="250">
      <template #default="scope">
        <el-input v-model="scope.row.rtsp_url" @blur="updateModuleInfo(scope)" placeholder="请输入rtsp地址"></el-input>
      </template>
    </el-table-column>
      <el-table-column label="修改时间" prop="updatetime" width="250"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-tooltip content="更新算法配置" placement="top">
            <el-button :icon="Setting" circle plain type="primary" @click="showModuleInfo(row)"></el-button>
          </el-tooltip>
          <!-- <el-tooltip content="删除" placement="top">
            <el-button :icon="Delete" circle plain type="danger" @click="deleteTest(row)"></el-button>
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页条 -->
    <!-- <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 15, 20]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end" -->
    <!-- /> -->
    <!-- 配置按钮 -->
    <div class="double-button">
      <el-button type="success" @click="restartModule">重启通道</el-button>
      <el-button type="primary" @click="restartConfig">重置配置</el-button>
    </div>
    <!-- 抽屉 -->

    <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
        <el-card style="margin-top:10px">
          <el-form :model="moduleInfo" label-width="100px">
          <el-row>
            <el-col :span="4"><div class="grid-content bg-purple-dark">{{moduleInfo.alert_type}}：</div></el-col>
            <el-col :span="20">
                <el-form-item label="开关状态：" >
                  <el-switch
                      active-text="开"
                      inactive-text	="关"
                      active-value="开"
                      inactive-value="关"
                      v-model="moduleInfo.switch_status"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="灵敏度：" >
                  <el-slider v-model="moduleInfo.sensitivity"></el-slider>
                </el-form-item>
              <el-form-item label="上报频率：" >
                <el-input placeholder="请输入数字" v-model="moduleInfo.report_frequency">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><div class="grid-content bg-purple-dark">{{moduleInfo.cl_alert_type}}：</div></el-col>
            <el-col :span="20">
                <el-form-item label="车辆统计：" >
                  <el-switch
                      active-text="开"
                      inactive-text	="关"
                      active-value="开"
                      inactive-value="关"
                      v-model="moduleInfo.cl_switch_status"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="灵敏度：" >
                  <el-slider v-model="moduleInfo.cl_sensitivity"></el-slider>
                </el-form-item>
                <el-form-item label="上报频率：" >
                  <el-input placeholder="请输入数字" v-model="moduleInfo.cl_report_frequency">
                  </el-input>
                </el-form-item>
            </el-col>
          </el-row>
            <el-checkbox v-model="moduleInfo.sync">同步到所有通道</el-checkbox>
          </el-form>


          <!-- <el-form-item label="通道名称：" >
            <el-input v-model="moduleInfo.channelName" placeholder="请输入算法名称"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="灵敏度：" >
            <el-input v-model="moduleInfo.sensitivity" placeholder="请输入灵敏度"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="状态：" >
            <el-select placeholder="请选择状态" v-model="moduleInfo.status">
              <el-option label="在线" value="在线"></el-option>
              <el-option label="未配置" value="未配置"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="updateConfig()">发布</el-button>
            <el-button type="info" @click="visibleDrawer=false">取消</el-button>
          </el-form-item>
        </el-card>

    </el-drawer>
  </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
.double-button {
  float: bottom;
  bottom: 100px;

}
</style>