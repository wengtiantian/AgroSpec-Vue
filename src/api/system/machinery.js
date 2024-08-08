import request from '@/utils/request'

// 查询农机列表
export function listMachinery(query) {
  return request({
    url: '/system/machinery/list',
    method: 'get',
    params: query
  })
}

export function listAll() {
  return request({
    url: '/system/machinery/listAll',
    method: 'get',

  })
}

// 查询农机详细
export function getMachinery(id) {
  return request({
    url: '/system/machinery/' + id,
    method: 'get'
  })
}

// 新增农机
export function addMachinery(data) {
  return request({
    url: '/system/machinery',
    method: 'post',
    data: data
  })
}

// 修改农机
export function updateMachinery(data) {
  return request({
    url: '/system/machinery',
    method: 'put',
    data: data
  })
}

// 删除农机
export function delMachinery(id) {
  return request({
    url: '/system/machinery/' + id,
    method: 'delete'
  })
}
