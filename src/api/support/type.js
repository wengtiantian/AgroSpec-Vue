import request from '@/utils/request.js'

// 查询服务类型管理列表
export function listType(query) {
  return request({
    url: '/support/type/list',
    method: 'get',
    params: query
  })
}

// 查询服务类型管理详细
export function getType(id) {
  return request({
    url: '/support/type/' + id,
    method: 'get'
  })
}

// 新增服务类型管理
export function addType(data) {
  return request({
    url: '/support/type',
    method: 'post',
    data: data
  })
}

// 修改服务类型管理
export function updateType(data) {
  return request({
    url: '/support/type',
    method: 'put',
    data: data
  })
}

// 删除服务类型管理
export function delType(id) {
  return request({
    url: '/support/type/' + id,
    method: 'delete'
  })
}
