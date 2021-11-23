//路由重组方法
import store from "../store";
import Router from "./index";
import path from "path";

//整理menuRouter格式
export const filterRouterFormat = (router) => {
    const res = []
    const metaKeys = ['keep', 'affix', 'en_title', 'title', 'icon']
    router.forEach(v => {
        let newItem = {};
        if (v.nested == 0 && v.parent_id == 0) {
            newItem = {
                id: v.id,
                path: '/',
                parent_id: v.parent_id,
                component: 'layout',
                redirect: v.redirect,
                nested: v.nested == 0 ? false : true,
                hidden:v.hidden == 0 ? false : true,
                children: [
                    {
                        path: v.path,
                        name: v.name,
                        component: v.component,
                        meta: {
                            icon: v.icon,
                            title: v.title,
                            en_title: v.en_title,
                            affix: v.affix == 0 ? false : true,
                            keep: v.keep == 0 ? false : true
                        }
                    },
                ]
            }
        } else {
            newItem['meta'] = {}
            for (const key in v) {
                newItem[key] = v[key]
                newItem['nested'] = newItem['nested'] == 0 ? false : true
                newItem['hidden'] = newItem['hidden'] == 0 ? false : true
                if (metaKeys.includes(key)) {
                    newItem['meta'][key] = v[key]
                    newItem['meta']['keep'] = newItem['meta']['keep'] == 0 ? false : true
                    newItem['meta']['affix'] = newItem['meta']['affix'] == 0 ? false : true
                    delete newItem[key]
                }
            }

            // 若遍历的当前路由存在子路由，需要对子路由进行递归遍历
            if (newItem.children && newItem.children.length) {
                newItem.children = filterRouterFormat(v.children)
            }
        }

        res.push(newItem)
    })
    return res
}


//重组路由表
export const getAsyncRoutes = (routes) => {
    const res = []
    // 定义路由中需要的自定名
    const keys = ['path', 'name', 'children', 'redirect', 'meta', 'nested']
    // 遍历路由数组去重组可用的路由
    routes.forEach(item => {
        const newItem = {};
        if (item.component) {
            if (item.component == 'layout') {
                newItem.component = (() => import(`@/${item.component}/layout.vue`));
            } else {
                newItem.component = (() => import(`@/views/${item.component}/index.vue`));
            }
        }
        for (const key in item) {
            if (keys.includes(key)) {
                newItem[key] = item[key]
            }
        }
        // 若遍历的当前路由存在子路由，需要对子路由进行递归遍历
        if (newItem.children && newItem.children.length) {
            newItem.children = getAsyncRoutes(item.children)
        }
        res.push(newItem)

    })
    // 返回处理好且可用的路由数组
    return res
}

//筛选出需要固定的tagView
const filterAffixTags = (routes, basePath = '/') => {
    let tags = []
    routes.forEach(route => {
        if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path)
            tags.push({
                fullPath: tagPath,
                path: tagPath,
                name: route.name,
                meta: {...route.meta}
            })
        }
        if (route.children) {
            const tempTags = filterAffixTags(route.children, route.path)
            if (tempTags.length >= 1) {
                tags = [...tags, ...tempTags]
            }
        }
    })
    return tags
}

//筛选需要缓存的页面
const filterKeepAlive = (routes, basePath = '/') => {
    let pages = []
    routes.forEach(route => {
        if (route.meta && route.meta.keep) {
            const pagePath = path.resolve(basePath, route.path)
            pages.push({
                fullPath: pagePath,
                path: pagePath,
                name: route.name,
                meta: {...route.meta}
            })
        }
        if (route.children) {
            const tempPages = filterKeepAlive(route.children)
            if (tempPages.length >= 1) {
                pages = [...pages, ...tempPages]
            }
        }
    })
    return pages
}


//初始化 tagView 添加到store
const initTags = async (routes) => {
    const affixTags = filterAffixTags(routes)
    for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
            await store.dispatch('app/addVisitedView', tag)
        }
    }
}

//初始化 keepAlive 添加到store
const initKeepAlive = async (routes) => {
    const pages = filterKeepAlive(routes)
    for (const tag of pages) {
        if (tag.name) {
            await store.dispatch('app/addKeepAlive', tag)
        }
    }
}


//动态路由
export const setAsyncRoutes = async () => {
    //get menu1 data
    let notFind = {
        path: '/:pathMatch(.*)',
        name: 'error-404',
        component: () => import('@/views/error/404.vue'),
    }
    let filterRouter = await store.dispatch("user/getMenu")
    let menu = getAsyncRoutes(filterRouter)
    //设置默认排在第一的为首页
    let firstMenu = {
        path:"/",
        redirect:menu[0].redirect
    }
    menu.unshift(firstMenu)
    menu.push(notFind)
    //把需要固定的tagView 添加到store里面
    await initTags(menu)
    //添加keepAlive
    await initKeepAlive(menu)
    menu.forEach(v => {
        Router.addRoute(v)
    })

}

