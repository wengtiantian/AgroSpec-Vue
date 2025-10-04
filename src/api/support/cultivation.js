import request from '@/utils/request'

// 查询种植标准管理列表
export function listCultivation(query) {
  return request({
    url: '/support/cultivation/list',
    method: 'get',
    params: query
  })
}

// 查询种植标准管理详细
export function getCultivation(id) {
  return request({
    url: '/support/cultivation/' + id,
    method: 'get'
  })
}

// 新增种植标准管理
export function addCultivation(data) {
  return request({
    url: '/support/cultivation',
    method: 'post',
    data: data
  })
}

// 修改种植标准管理
export function updateCultivation(data) {
  return request({
    url: '/support/cultivation',
    method: 'put',
    data: data
  })
}

// 删除种植标准管理
export function delCultivation(id) {
  return request({
    url: '/support/cultivation/' + id,
    method: 'delete'
  })
}


export function listAll() {
  return request({
    url: '/support/machinery/listAll',
    method: 'get',

  })
}

