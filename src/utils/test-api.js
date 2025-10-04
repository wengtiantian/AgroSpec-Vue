// 测试API连接的简单工具
import axios from 'axios'

export function testApiConnection() {
  console.log('测试API连接...')
  
  // 测试后端连接
  axios.get('http://localhost:8080/captchaImage')
    .then(response => {
      console.log('✅ 后端API连接成功:', response.data)
    })
    .catch(error => {
      console.error('❌ 后端API连接失败:', error.message)
      console.log('请确保后端服务运行在 http://localhost:8080')
    })
  
  // 测试前端代理
  axios.get('/dev-api/captchaImage')
    .then(response => {
      console.log('✅ 前端代理连接成功:', response.data)
    })
    .catch(error => {
      console.error('❌ 前端代理连接失败:', error.message)
    })
}

