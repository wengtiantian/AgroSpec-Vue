import request from '@/utils/request'

// 查询服务主体列表
export function listServicer(query) {
  return request({
    url: '/system/servicer/list',
    method: 'get',
    params: query
  })
}

// 查询服务主体详细
export function getServicer(id) {
  return request({
    url: '/system/servicer/' + id,
    method: 'get'
  })
}

// 新增服务主体
export function addServicer(data) {
  return request({
    url: '/system/servicer',
    method: 'post',
    data: data
  })
}

// 修改服务主体
export function updateServicer(data) {
  return request({
    url: '/system/servicer',
    method: 'put',
    data: data
  })
}

// 删除服务主体
export function delServicer(id) {
  return request({
    url: '/system/servicer/' + id,
    method: 'delete'
  })
}


// 根据 user_id 查询服务主体
export function getServicerByUserId() {
  return request({
    url: '/system/servicer/user',
    method: 'get'
  })
}