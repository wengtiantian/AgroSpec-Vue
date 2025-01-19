import request from '@/utils/request'

// 查询评价列表
export function listReviews(query) {
  return request({
    url: '/system/reviews/list',
    method: 'get',
    params: query
  })
}

// 查询评价详细
export function getReviews(id) {
  return request({
    url: '/system/reviews/' + id,
    method: 'get'
  })
}

// 新增评价
export function addReviews(data) {
  return request({
    url: '/system/reviews',
    method: 'post',
    data: data
  })
}

export function addbyproducter(data) {
  return request({
    url: '/system/reviews/addbyproducter',
    method: 'post',
    data: data
  })
}
// 修改评价
export function updateReviews(data) {
  return request({
    url: '/system/reviews',
    method: 'put',
    data: data
  })
}

// 删除评价
export function delReviews(id) {
  return request({
    url: '/system/reviews/' + id,
    method: 'delete'
  })
}
