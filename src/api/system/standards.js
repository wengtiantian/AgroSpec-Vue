import request from '@/utils/request'

// 查询标准管理列表
export function listStandards(query) {
  return request({
    url: '/system/standards/list',
    method: 'get',
    params: query
  })
}

// 查询标准管理详细
export function getStandards(id) {
  return request({
    url: '/system/standards/' + id,
    method: 'get'
  })
}

// 新增标准管理
export function addStandards(data) {
  return request({
    url: '/system/standards',
    method: 'post',
    data: data
  })
}

// 修改标准管理
export function updateStandards(data) {
  return request({
    url: '/system/standards',
    method: 'put',
    data: data
  })
}

// 删除标准管理
export function delStandards(id) {
  return request({
    url: '/system/standards/' + id,
    method: 'delete'
  })
}
