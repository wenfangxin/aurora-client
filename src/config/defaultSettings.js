module.exports =  {
    //project name
    title: 'Aurora Admin',

    //是否固定页面 header
    fixedHeader: is('fixedHeader'),

    //是否展示侧边栏logo
    sidebarLogo: is('sidebarLogo'),

    //是否启用 tagsView
    tagsView: is('tagsView'),

    //是否显示页面刷新按钮
    pageRefresh: is('pageRefresh'),

    //是否只保持一个子菜单的展开
    uniqueOpened: is('uniqueOpened'),

    //默认语言
    locale:'zh'

}

function is(key) {
    if (window.localStorage.getItem(key) == null) return true

    if (window.localStorage.getItem(key) == '0') return false

    if (window.localStorage.getItem(key) == '1') return true

}
