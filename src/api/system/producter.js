import request from '@/utils/request'

// 查询生产主体管理列表
export function listProducter(query) {
  return request({
    url: '/system/producter/list',
    method: 'get',
    params: query
  })
}

// 查询生产主体管理详细
export function getProducter(id) {
  return request({
    url: '/system/producter/' + id,
    method: 'get'
  })
}

// 新增生产主体管理
export function addProducter(data) {
  return request({
    url: '/system/producter',
    method: 'post',
    data: data
  })
}

// 修改生产主体管理
export function updateProducter(data) {
  return request({
    url: '/system/producter',
    method: 'put',
    data: data
  })
}

// 删除生产主体管理
export function delProducter(id) {
  return request({
    url: '/system/producter/' + id,
    method: 'delete'
  })
}
