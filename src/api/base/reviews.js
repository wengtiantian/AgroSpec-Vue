import request from '@/utils/request'
import axios from 'axios'

// 查询评论管理列表
export function listReviews(query) {
  return request({
    url: '/base/reviews/list',
    method: 'get',
    params: query
  })
}

// 查询评论管理详细
export function getReviews(id) {
  return request({
    url: '/base/reviews/' + id,
    method: 'get'
  })
}

// 新增评论管理
export function addReviews(data) {
  return request({
    url: '/base/reviews',
    method: 'post',
    data: data
  })
}

// 修改评论管理
export function updateReviews(data) {
  return request({
    url: '/base/reviews',
    method: 'put',
    data: data
  })
}

// 删除评论管理
export function delReviews(id) {
  return request({
    url: '/base/reviews/' + id,
    method: 'delete'
  })
}

export function addbyproducter(data) {
  return request({
    url: '/base/reviews/addbyproducter',
    method: 'post',
    data: data
  })
}

// 获取服务主体统计信息
export function getServicerStats(servicerId) {
  return request({
    url: '/base/reviews/servicer/' + servicerId + '/stats',
    method: 'get'
  })
}

async function fetchServicerStats(servicerId) {
  try {
    const res = await axios.get('http://47.92.95.129:9898/api/v1/sq/SQbusiness', {
      params: { servicer_id: servicerId }
    })
    if (res.data && res.data.code === 0) {
      const data = res.data
      // 评分数据
      scoreData.value = {
        有形性: data.TangiSc,
        可靠性: data.ReliSc,
        响应性: data.ResponSc,
        保证性: data.AssuranceSc,
        移情性: data.EmpathySc,
        总分: data.TotalSc
      }
      // 评论列表
      reviewList.value = data.data || []
      // 图表链接
      chartUrls.pareto = `http://47.92.95.129:9898/media/Pareto_chart/${servicerId}.jpg`
      chartUrls.wordcloud = `http://47.92.95.129:9898/media/WordCloud/${servicerId}.jpg`
      chartUrls.bars = `http://47.92.95.129:9898/media/Bars/${servicerId}.jpg`
      chartUrls.radar = `http://47.92.95.129:9898/media/Radar/${servicerId}.jpg`
    } else {
      throw new Error(res.data?.msg || '获取服务主体统计信息失败')
    }
  } catch (e) {
    ElMessage.error(e.message || '获取服务主体统计信息失败')
  }
}