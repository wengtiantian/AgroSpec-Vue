import request from '@/utils/request'

// 查询服务主体列表
export function listServicer(query) {
    return request({
        url: '/public/servicer/list',
        method: 'get',
        params: query
    })
}
// 查询标准管理列表
export function listStandards(query) {
    return request({
        url: '/public/standards/list',
        method: 'get',
        params: query
    })
}


// 查询服务主体详细
export function getServicer(id) {
    return request({
        url: '/public/servicer/' + id,
        method: 'get'
    })
}

// 查询标准管理详细
export function getStandards(id) {
    return request({
        url: '/public/standards/' + id,
        method: 'get'
    })
}