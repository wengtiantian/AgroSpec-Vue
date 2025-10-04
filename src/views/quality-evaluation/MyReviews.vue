<template>
    <div class="my-reviews-page">
      <h2>我的评价记录</h2>
      <el-table :data="reviewList" v-loading="loading" style="margin-top: 24px;">
        <el-table-column prop="content" label="评价内容" min-width="200"/>
        <el-table-column prop="servicerName" label="服务主体" min-width="120"/>
        <el-table-column prop="SQdim" label="服务维度" :formatter="formatSQdim" min-width="90"/>
        <el-table-column prop="SenScore" label="情感分" min-width="80"/>
        <el-table-column prop="rating" label="评分" min-width="70"/>
        <el-table-column prop="create_time" label="评价时间" :formatter="formatDate" min-width="140"/>
        <el-table-column prop="attachments" label="附件" min-width="100">
          <template #default="scope">
            <el-link v-for="(file, idx) in scope.row.attachments" :key="idx" :href="file" target="_blank">附件{{idx+1}}</el-link>
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
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import useUserStore from '@/store/modules/user'
  import { listReviews } from '@/api/base/reviews'
  
  const userStore = useUserStore()
  const reviewList = ref([])
  const loading = ref(false)
  const total = ref(0)
  const query = reactive({
    pageNum: 1,
    pageSize: 10
  })
  const SQdimMap = ['有形性', '可靠性', '响应性', '保证性', '移情性']
  
  function formatSQdim(row) {
    return SQdimMap[row.SQdim] ?? row.SQdim
  }
  function formatDate(row) {
    if (!row.create_time) return ''
    const d = new Date(row.create_time)
    return d.toLocaleString()
  }
  
  async function fetchReviews() {
    loading.value = true
    try {
      const res = await listReviews({
        userId: userStore.id,
          pageNum: query.pageNum,
          pageSize: query.pageSize
      })
      console.log('Reviews response:', res)
      if (res.code === 200) {
        reviewList.value = res.rows || []
        total.value = res.total || 0
      } else {
        ElMessage.error(res.msg || '获取评价记录失败')
      }
    } catch (e) {
      console.error('Error:', e)
      ElMessage.error('获取评价记录失败')
    } finally {
      loading.value = false
    }
  }
  
  function handlePageChange(page) {
    query.pageNum = page
    fetchReviews()
  }
  
  onMounted(() => {
    fetchReviews()
  })
  </script>
  
  <style scoped>
  .my-reviews-page {
    max-width: 1000px;
    margin: 40px auto;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
    padding: 32px 32px 24px 32px;
  }
  h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 18px;
    color: #333;
  }
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
  </style>