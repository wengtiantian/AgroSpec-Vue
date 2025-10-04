import request from '@/utils/request.js'

// 查询服务主体申请列表 - 暂时使用现有的服务主体接口
export function listServicerApply(query) {
  return request({
    url: '/subject/servicer/list',
    method: 'get',
    params: query
  })
}

// 查询服务主体申请详细 - 暂时使用现有的服务主体接口
export function getServicerApply(id) {
  return request({
    url: '/subject/servicer/' + id,
    method: 'get'
  })
}

// 新增服务主体申请 - 暂时使用现有的服务主体接口
export function addServicerApply(data) {
  return request({
    url: '/subject/servicer',
    method: 'post',
    data: data
  })
}

// （废弃）旧的主体接口更新方法已移除，统一走 /apply/process

// 删除服务主体申请 - 暂时使用现有的服务主体接口
export function delServicerApply(id) {
  return request({
    url: '/subject/servicer/' + id,
    method: 'delete'
  })
}

// 审核服务主体申请 - 暂时使用现有的状态修改接口
export function auditServicerApply(data) {
  return request({
    url: '/subject/servicer/editStatus',
    method: 'put',
    data: data
  })
}

// 批量审核服务主体申请 - 暂时使用现有的状态修改接口
export function batchAuditServicerApply(data) {
  return request({
    url: '/subject/servicer/editStatus',
    method: 'put',
    data: data
  })
}

// 导出服务主体申请 - 暂时使用现有的服务主体接口
export function exportServicerApply(query) {
  return request({
    url: '/subject/servicer/export',
    method: 'get',
    params: query
  })
}

// 根据用户ID查询服务主体申请 - 暂时使用现有的服务主体接口
export function getServicerApplyByUserId() {
  return request({
    url: '/subject/servicer/user',
    method: 'get'
  })
}

// 查询当前用户的申请记录列表 - 使用申请接口
export function listMyServicerApply(query) {
  return request({
    url: '/apply/servicer/my',
    method: 'get',
    params: query
  })
}

// 提交服务主体申请
export function submitServicerApply(data) {
  return request({
    url: '/apply/process',
    method: 'post',
    data
  })
}

// 更新服务主体申请（草稿/补充材料）
export function updateServicerApply(data) {
  return request({
    url: '/apply/process',
    method: 'put',
    data
  })
}

// 审核通过（后台使用）
export function approveServicerApply(applyId) {
  return request({
    url: `/apply/process/approve/${applyId}`,
    method: 'post'
  })
}

// 审核驳回（后台使用）
export function rejectServicerApply(applyId, remark) {
  return request({
    url: `/apply/process/reject/${applyId}`,
    method: 'post',
    data: { remark }
  })
}
