import request from '@/utils/request.js'

// 查询地区(es_regions)列表
export function listRegion(query) {
  return request({
    url: '/base/region/list',
    method: 'get',
    params: query
  })
}

// 查询地区(es_regions)详细
export function getRegion(id) {
  return request({
    url: '/base/region/' + id,
    method: 'get'
  })
}

// 新增地区(es_regions)
export function addRegion(data) {
  return request({
    url: '/base/region',
    method: 'post',
    data: data
  })
}

// 修改地区(es_regions)
export function updateRegion(data) {
  return request({
    url: '/base/region',
    method: 'put',
    data: data
  })
}

// 删除地区(es_regions)
export function delRegion(id) {
  return request({
    url: '/base/region/' + id,
    method: 'delete'
  })
}
