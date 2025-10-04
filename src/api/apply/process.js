import request from '@/utils/request'

// 查询服务主体审核列表
export function listProcess(query) {
  return request({
    url: '/apply/process/list',
    method: 'get',
    params: query
  })
}

// 查询服务主体审核详细
export function getProcess(id) {
  return request({
    url: '/apply/process/' + id,
    method: 'get'
  })
}

// 新增服务主体审核
export function addProcess(data) {
  return request({
    url: '/apply/process',
    method: 'post',
    data: data
  })
}

// 修改服务主体审核
export function updateProcess(data) {
  return request({
    url: '/apply/process',
    method: 'put',
    data: data
  })
}

// 删除服务主体审核
export function delProcess(id) {
  return request({
    url: '/apply/process/' + id,
    method: 'delete'
  })
}
