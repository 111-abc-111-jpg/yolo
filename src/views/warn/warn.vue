<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>告警查询</span>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form>
      <el-form-item label=" " style="width: 20%;">
        <el-select placeholder="请选择通道" v-model="state.tableData.param.channel_type" prop="channel_type">
          <el-option label="通道一" value="通道一"></el-option>
          <el-option label="通道二" value="通道二"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label=" " style="width: 20%;">
        <el-select placeholder="请选择告警类型" v-model="state.tableData.param.alert_type" prop="sale_rt_type">
          <el-option label="人数统计" value="人数统计"></el-option>
          <el-option label="车辆统计" value="车辆统计"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item style="margin-left: 10px;">
        <div class="demo-datetime-picker">
          <div class="block">
            <el-date-picker
              v-model="state.tableData.param.start_datetime"
              prop="start_datetime"
              type="datetime"
              placeholder="请选择起始日期"
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item style="margin-left: 10px;">
        <div class="demo-datetime-picker">
          <div class="block">
            <el-date-picker
              v-model="state.tableData.param.end_datetime"
              prop="end_datetime"
              type="datetime"
              placeholder="请选择终止日期"
            />
          </div>
        </div>
      </el-form-item>
    </el-form>
    <el-form style="height: 80px; margin-left: 13px;">
      <el-button type="primary" @click="searchDocument">
        <el-icon><Search /></el-icon>
        查询记录
      </el-button>

      <el-button @click="open">
        <el-icon><DeleteFilled /></el-icon>
        删除记录
      </el-button>
      <el-button @click="confirmAndDownload">
        <el-icon><UploadFilled /></el-icon>
        导出记录
      </el-button>
    </el-form>

    <!-- 图片 -->
    <!-- 模块列表 -->
    <div style="width: auto; height: 300px;">
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
    <!-- 分页条 -->
    <el-pagination
      @size-change="onHandleSizeChange"
      @current-change="onHandleCurrentChange"
      :pager-count="5"
      :page-sizes="[7,6,5]"
      v-model:current-page="state.tableData.param.page.current"
      v-model:page-size="state.tableData.param.page.size"
      layout="total,  prev, pager, next, jumper"
      :total="state.tableData.length"
      style="background-color: transparent;margin-left: 450px;"
    >
    </el-pagination>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { Search, DeleteFilled, UploadFilled } from '@element-plus/icons-vue';
import axios from 'axios';
// 查询图片
const state = reactive({
    tableData: {
      records: [],
      length: 4,
      param: {
        page: {
        current: 1,
        size: 10,
        },
        channel_type: "通道一",
        alert_type: "人数统计",
        start_datetime: "2024-09-01 01:30:00",
        end_datetime :"2024-09-01 04:00:00",
      },
    },
  });
const getTableData = (async () => {
  try {
    const response = await axios.get<{ code: number; msg: string; f_urls:any }>('/api/img/query_img', {
      params: state.tableData.param
    });
    if (response.data.code === 200 ) {
      console.log(response)
      state.tableData.records = response.data.f_urls;
    } else {
      console.error(`获取图片数据失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
  }
});
getTableData();
// 查询按钮
function searchDocument() {
  getTableData();
}
// 下载打包接口
const downloadFile = async () => {
  try {
    const response = await axios.get<{ code: number; msg: string; f_urls:any }>('/api/img/download_filtered_images_zip', {
      params: state.tableData.param
    });
    // 创建一个 URL 对象
    const url = window.URL.createObjectURL(new Blob([response.data]));
    // 创建一个链接元素
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '文件名'); // 设置下载的文件名
    // 触发下载
    document.body.appendChild(link);
    link.click();
    // 清理
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('下载文件失败:', error);
  }
};
const value2 = ref('');
// 删除按钮
const open = () => {
  ElMessageBox.confirm(
    `通道：${state.tableData.param.channel_type}; 告警类型：${state.tableData.param.alert_type}; 时间范围：全部 ;`,
    '是否删除满足如下条件的记录？',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }
  ).then(() => {
    ElMessage({
      type: 'success',
      message: '成功删除',
    });
    state.tableData.param.channel_type = '';
    state.tableData.param.alert_type = '';
    value2.value = '';
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除',
    });
  });
};
// 导出按钮
const confirmAndDownload = () => {
  ElMessageBox.confirm(
    `确定要导出满足条件的记录吗？`,
    '确认下载', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }
  ).then(() => {
    downloadFile();
  }).catch(() => {
    // 用户取消操作
    ElMessage({
      type: 'info',
      message: '取消下载',
    });
  });
};
 // 分页改变
 const onHandleSizeChange = (val: any) => {
    state.tableData.param.page.current = val;
  };
  // 分页改变
  const onHandleCurrentChange = (val: any) => {
    state.tableData.param.page.size = val;
  };
</script>

<style scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-form {
  display: flex;
  flex-wrap: wrap;
}
.image {
  width: 150px;
  height: 130px;
}
.block {
  padding: 0px 5px;
  text-align: center;
}
.demo-datetime-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-datetime-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-datetime-picker .block:last-child {
  border-right: none;
}
.el-form ,.el-form--default,.el-form--label-right {
  height: 80px;
}
</style>