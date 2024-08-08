import request from '@/utils/request'

// 查询服务主体审核列表
export function listProcess(query) {
  return request({
    url: '/system/process/list',
    method: 'get',
    params: query
  })
}

// 查询服务主体审核列表
export function listAll(query) {
  return request({
    url: '/system/process/listAll',
    method: 'get',
    params: query
  })
}

// 查询服务主体审核详细
export function getProcess(id) {
  return request({
    url: '/system/process/' + id,
    method: 'get'
  })
}

// 新增服务主体审核
export function addProcess(data) {
  return request({
    url: '/system/process',
    method: 'post',
    data: data
  })
}

// 新增服务主体审核
export function submit(data) {
  return request({
    url: '/system/process/submit',
    method: 'post',
    data: data
  })
}

// 修改服务主体审核
export function updateProcess(data) {
  return request({
    url: '/system/process',
    method: 'put',
    data: data
  })
}

// 删除服务主体审核
export function delProcess(id) {
  return request({
    url: '/system/process/' + id,
    method: 'delete'
  })
}
