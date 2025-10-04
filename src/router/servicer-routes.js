// 服务主体相关路由配置
export const servicerRoutes = [
  {
    path: '/apply/servicer',
    component: () => import('@/layout/index.vue'),
    redirect: '/apply/servicer/index',
    name: 'ServicerApply',
    meta: {
      title: '服务主体申请',
      icon: 'document'
    },
    children: [
      {
        path: 'index',
        name: 'ServicerApplyIndex',
        component: () => import('@/views/apply/servicer/index.vue'),
        meta: {
          title: '申请管理',
          icon: 'document',
          roles: ['apply:servicer:list']
        }
      }
    ]
  },
  {
    path: '/audit/servicer',
    component: () => import('@/layout/index.vue'),
    redirect: '/audit/servicer/index',
    name: 'ServicerAudit',
    meta: {
      title: '服务主体审核',
      icon: 'edit'
    },
    children: [
      {
        path: 'index',
        name: 'ServicerAuditIndex',
        component: () => import('@/views/audit/servicer/index.vue'),
        meta: {
          title: '审核管理',
          icon: 'edit',
          roles: ['audit:servicer:list']
        }
      }
    ]
  },
  {
    path: '/manage/servicer',
    component: () => import('@/layout/index.vue'),
    redirect: '/manage/servicer/index',
    name: 'ServicerManage',
    meta: {
      title: '服务主体管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'index',
        name: 'ServicerManageIndex',
        component: () => import('@/views/manage/servicer/index.vue'),
        meta: {
          title: '主体管理',
          icon: 'peoples',
          roles: ['manage:servicer:list']
        }
      }
    ]
  }
];

// 权限配置
export const servicerPermissions = [
  // 申请相关权限
  'apply:servicer:list',     // 查看申请列表
  'apply:servicer:query',    // 查看申请详情
  'apply:servicer:add',      // 新增申请
  'apply:servicer:edit',     // 修改申请
  'apply:servicer:remove',   // 删除申请
  'apply:servicer:export',   // 导出申请
  
  // 审核相关权限
  'audit:servicer:list',     // 查看审核列表
  'audit:servicer:query',    // 查看审核详情
  'audit:servicer:approve',  // 审核通过
  'audit:servicer:reject',   // 审核拒绝
  'audit:servicer:export',   // 导出审核
  
  // 管理相关权限
  'manage:servicer:list',    // 查看管理列表
  'manage:servicer:query',   // 查看主体详情
  'manage:servicer:approve', // 准入操作
  'manage:servicer:reject',  // 取消准入
  'manage:servicer:abnormal',// 设为异常
  'manage:servicer:normal',  // 设为正常
  'manage:servicer:export'   // 导出管理
];
