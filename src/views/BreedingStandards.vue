<template>
    <div class="plantation-standards-page">
      <!-- 顶部横幅 -->
      <div class="banner">
        <div class="banner-left">
          <img src="@/assets/logo/logo.jpeg" class="logo" alt="logo" />
          <span class="system-title">乡村特色产业标准化生产服务规范与质量评价系统</span>
        </div>
        <el-button class="home-btn" type="primary" @click="goHome">返回首页</el-button>
      </div>
      <!-- 中心内容 -->
      <div class="center-content">
        <div class="content-title" style="text-align: center;">养殖标准库</div>
        <!-- 查询表单 -->
        <el-form :inline="true" :model="query" class="filter-form" @submit.native.prevent>
          <el-form-item label="标准名称">
            <el-input v-model="query.standard_name" placeholder="请输入标准名称" clearable />
          </el-form-item>
          <el-form-item label="标准编号">
            <el-input v-model="query.standard_code" placeholder="请输入标准编号" clearable />
          </el-form-item>
          <el-form-item label="发布机构">
            <el-input v-model="query.issuing_agency" placeholder="请输入发布机构" clearable />
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="query.publish_date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              clearable
            />
          </el-form-item>
          <el-button type="primary" class="search-button" @click="fetchList">查询</el-button>
          <el-button class="search-button" @click="resetQuery">重置</el-button>
        </el-form>
  
        <!-- 数据表格 -->
        <el-table
          :data="tableData"
          style="width: 100%"
          stripe
          highlight-current-row
          class="custom-table"
        >
          <el-table-column prop="id" label="序号" width="60" align="center" />
          <el-table-column prop="fileNumber" label="标准编号" align="center" />
          <el-table-column prop="fileName" label="标准名称" align="center" />
          <el-table-column prop="issuingAgency" label="发布单位" align="center" />
          <el-table-column prop="author" label="起草人" align="center" />
          <el-table-column prop="issueDate" label="发布时间" align="center" />
          <el-table-column prop="effectiveDate" label="实施时间" align="center" />
          <el-table-column label="操作" width="120" align="center">
            <template #default="scope">
              <el-button size="mini" type="success" @click="viewDetail(scope.row)">在线预览</el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :total="total"
          :page-size="query.pageSize"
          :current-page="query.pageNum"
          @current-change="handlePageChange"
          class="pagination"
        />
      </div>
      <div class="footer">
        Copyright © 2022-2024 江西农业大学 All Rights Reserved.
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { listStandards } from '@/api/base/standards'
  
  const router = useRouter()
  const provinceList = ref([
    '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'
  ])
  
  const query = reactive({
    standard_name: '',
    standard_code: '',
    issuing_agency: '',
    publish_date: [],
    pageNum: 1,
    pageSize: 10
  })
  
  const tableData = ref([])
  const total = ref(0)
  
  function fetchList() {
    const params = {
      fileName: query.standard_name,
      fileNumber: query.standard_code,
      issuingAgency: query.issuing_agency,
      standardDomain: '1',  // 养殖标准的字典值是1
      pageNum: query.pageNum,
      pageSize: query.pageSize
    }
    
    // 添加日期范围查询
    if (query.publish_date && query.publish_date.length === 2) {
      params.params = {
        beginIssueDate: query.publish_date[0],
        endIssueDate: query.publish_date[1]
      }
    }
    listStandards(params).then(res => {
      tableData.value = res.rows
      total.value = res.total
    }).catch(() => {
      ElMessage.error('获取数据失败')
    })
  }
  
  function resetQuery() {
    query.standard_name = ''
    query.standard_code = ''
    query.issuing_agency = ''
    query.publish_date = []
    query.pageNum = 1
    fetchList()
  }
  
  function handlePageChange(page) {
    query.pageNum = page
    fetchList()
  }
  
  function viewDetail(row) {
    // fileNumber 是标准文件的发布编号，不是文件路径
    // attachments 字段才是文件附件路径
    if (row.attachments) {
      const base = import.meta.env.VITE_APP_BASE_API || '/dev-api'
      const url = row.attachments.startsWith('http') ? row.attachments : `${base}${row.attachments}`;
      window.open(url, '_blank');
    } else {
      ElMessage.warning('未找到对应的文件');
    }
  }
  
  function goHome() {
    router.push('/home')
  }
  
  onMounted(() => {
    fetchList()
  })
  </script>
  
  <style scoped>
  .plantation-standards-page {
    font-family: 'Arial', sans-serif;
    background: #f7f8fa;
    min-height: 100vh;
    padding-bottom: 40px; /* 防止内容被footer遮挡 */
  }
  .banner {
    width: 100%;
    height: 90px;
    background: linear-gradient(90deg, #4cbf81 0%, #48a3e0 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 40px;
  }
  .banner-left {
    display: flex;
    align-items: center;
  }
  .logo {
    height: 60px;
    margin-right: 18px;
    border-radius: 10px;
    background: #fff;
    padding: 4px;
  }
  .system-title {
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 2px;
    white-space: nowrap;
  }
  .home-btn {
    font-size: 16px;
    border-radius: 20px;
    height: 40px;
    margin-left: 20px;
  }
  .center-content {
    width: 60%;
    margin: 30px auto 0 auto;
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
    padding: 32px 32px 24px 32px;
  }
  .filter-form {
    margin-bottom: 20px;
    text-align: left;
  }
  .search-button {
    width: 120px;
    height: 40px;
    border-radius: 20px;
    margin-left: 10px;
  }
  .custom-table :deep(.el-table__body-wrapper) {
    border-radius: 12px;
  }
  .custom-table :deep(.el-table__row) {
    transition: background 0.2s;
  }
  .custom-table :deep(.el-table__row:hover) {
    background: #f0faff !important;
  }
  .custom-table :deep(.el-table__cell) {
    border-bottom: none !important;
  }
  .custom-table :deep(.el-table) {
    border: none !important;
  }
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: var(--el-color-success, #67c23a);
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
    color: #fff;
    z-index: 100;
    border-radius: 0;
  }
  .content-title {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    text-align: left;
    margin-bottom: 18px;
    margin-top: 0;
    letter-spacing: 2px;
  }
  </style>