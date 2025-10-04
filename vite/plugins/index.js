import vue from '@vitejs/plugin-vue'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'

export default function createVitePlugins(viteEnv, isBuild = false) {
    const vitePlugins = [vue()]
    vitePlugins.push(createAutoImport())
	vitePlugins.push(createSetupExtend())
    
    // 只有当 createSvgIcon 返回有效插件时才添加
    const svgIconPlugin = createSvgIcon(isBuild)
    if (svgIconPlugin) {
        vitePlugins.push(svgIconPlugin)
    }
    
	isBuild && vitePlugins.push(...createCompression(viteEnv))
    return vitePlugins
}
