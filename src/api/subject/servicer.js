import request from '@/utils/request.js'

// 查询服务主体列表
export function listServicer(query) {
  return request({
    url: '/subject/servicer/list',
    method: 'get',
    params: query
  })
}

// 查询服务主体详细
export function getServicer(id) {
  return request({
    url: '/subject/servicer/' + id,
    method: 'get'
  })
}

// 新增服务主体
export function addServicer(data) {
  return request({
    url: '/subject/servicer',
    method: 'post',
    data: data
  })
}

// 修改服务主体
export function updateServicer(data) {
  return request({
    url: '/subject/servicer',
    method: 'put',
    data: data
  })
}


// 修改服务主体
export function editStatus(data) {
  return request({
    url: '/subject/servicer/editStatus',
    method: 'put',
    data: data
  })
}
// 删除服务主体
export function delServicer(id) {
  return request({
    url: '/subject/servicer/' + id,
    method: 'delete'
  })
}


// 根据 user_id 查询服务主体
export function getServicerByUserId() {
  return request({
    url: '/subject/servicer/user',
    method: 'get'
  })
}

// 根据用户ID查询服务主体（使用查询参数）
export function getServicerByUserIdParam() {
  return request({
    url: '/subject/servicer/list',
    method: 'get',
    params: {
      userId: 'current' // 或者传递实际的用户ID
    }
  })
}

// 根据当前用户查询服务主体（备用方法）
export function getCurrentUserServicer() {
  return request({
    url: '/subject/servicer/current',
    method: 'get'
  })
}