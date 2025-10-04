import request from '@/utils/request'

// 查询养殖标准管理列表
export function listBreeding(query) {
  return request({
    url: '/support/breeding/list',
    method: 'get',
    params: query
  })
}

// 查询养殖标准管理详细
export function getBreeding(id) {
  return request({
    url: '/support/breeding/' + id,
    method: 'get'
  })
}

// 新增养殖标准管理
export function addBreeding(data) {
  return request({
    url: '/support/breeding',
    method: 'post',
    data: data
  })
}

// 修改养殖标准管理
export function updateBreeding(data) {
  return request({
    url: '/support/breeding',
    method: 'put',
    data: data
  })
}

// 删除养殖标准管理
export function delBreeding(id) {
  return request({
    url: '/support/breeding/' + id,
    method: 'delete'
  })
}
