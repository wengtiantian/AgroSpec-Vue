<template>
    <div class="nmyy_xq_tab">
      <el-form class="layui-form" id="dataform" :model="formData" ref="dataform" label-position="left">
        
        <!-- 基本信息 -->
        <h2 style="text-align: center; padding: 15px 0;">基本信息</h2>
        <el-table :data="basicInfo">
          <el-table-column prop="label" label="项目"></el-table-column>
          <el-table-column prop="value" label="内容"></el-table-column>
        </el-table>
        
        
      </el-form>
    </div>
  </template>
  
  <script setup>

  import { onMounted, ref } from 'vue';
  import { getServicerByUserId } from '@/api/system/servicer'
  import * as echarts from 'echarts';

  const score=ref(4.2);


  
      // 基本信息数据
      const basicInfo = ref([
  { label: '农户姓名', value: '1' },
  { label: '手机号', value: '18383570390' },
  { label: '身份证号码', value: '326584563215648456' },
  { label: '土地确权证号', value: '1563251235' },
  { label: '土地确权证书', value: '' }, // URL for image
  { label: '承包合同', value: '' },       // URL for image
  { label: '营业执照', value: '' },       // URL for image
  { label: '所在区域', value: '江西省南昌市东湖区公园街道民德路社区居委会' }
]);
  




      function fetchServicerByUserId() {
      getServicerByUserId().then(response => {
        console.log(response.data)
      }).catch(error => {
        console.error('Failed to fetch servicer:', error)
      })
    }
      fetchServicerByUserId()
    
  
      // 返回操作
      const goBack = () => {
        // 返回逻辑
      };


  </script>
  
  <style>
  .nmyy_xq_tab{
    width: 80%;
    margin: 0 auto;
  }
  /* 可以根据需要添加样式 */
  .pie{
    height: 300px;
    width: 50%;

  }
  .chart{
    display: flex;
  }
  </style>
  