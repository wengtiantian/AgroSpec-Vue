import request from '@/utils/request.js'

// 查询农机列表
export function listMachinery(query) {
  return request({
    url: '/support/machinery/list',
    method: 'get',
    params: query
  })
}

export function listAll() {
  return request({
    url: '/support/machinery/listAll',
    method: 'get',

  })
}

// 查询农机详细
export function getMachinery(id) {
  return request({
    url: '/support/machinery/' + id,
    method: 'get'
  })
}

// 新增农机
export function addMachinery(data) {
  return request({
    url: '/support/machinery',
    method: 'post',
    data: data
  })
}

// 修改农机
export function updateMachinery(data) {
  return request({
    url: '/support/machinery',
    method: 'put',
    data: data
  })
}

// 删除农机
export function delMachinery(id) {
  return request({
    url: '/support/machinery/' + id,
    method: 'delete'
  })
}
