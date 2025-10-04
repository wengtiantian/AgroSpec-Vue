import path from 'path'

export default function createSvgIcon(isBuild) {
    // 临时禁用 SVG 图标插件以避免启动错误
    // 可以在解决依赖问题后重新启用
    return null
    
    // 原始代码:
    // return createSvgIconsPlugin({
    //     iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
    //     symbolId: 'icon-[dir]-[name]',
    //     svgoOptions: isBuild
    // })
}
