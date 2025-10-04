import request from '@/utils/request'

// 查询行业资讯列表
export function listNews(query) {
  return request({
    url: '/base/news/list',
    method: 'get',
    params: query
  })
}

// 查询行业资讯详细
export function getNews(id) {
  return request({
    url: '/base/news/' + id,
    method: 'get'
  })
}

// 新增行业资讯
export function addNews(data) {
  return request({
    url: '/base/news',
    method: 'post',
    data: data
  })
}

// 修改行业资讯
export function updateNews(data) {
  return request({
    url: '/base/news',
    method: 'put',
    data: data
  })
}

// 删除行业资讯
export function delNews(id) {
  return request({
    url: '/base/news/' + id,
    method: 'delete'
  })
}
