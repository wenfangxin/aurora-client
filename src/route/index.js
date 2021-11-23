import {createRouter, createWebHashHistory} from 'vue-router'
import NProgress from 'nprogress' // 引入nprogress插件 页面跳转出现在浏览器顶部的进度条
import 'nprogress/nprogress.css' // 这个nprogress样式必须引入
import cookie from "js-cookie";
import store from '../store'
import {setAsyncRoutes} from "./setRoute";
import {getPageTitle, loginOutClearData} from "@/utils";

NProgress.configure({easing: 'ease', speed: 100, showSpinner: false})
const Layout = () => import("../layout/layout")
let routes = [
    {
        path: '/redirect',
        name: "redirect",
        component: Layout,
        children: [
            {
                name: 'redirect',
                component: () => import("@/views/redirect/index.vue"),
                path: '/redirect',
            },
        ]
    },
    {
        name: 'login',
        path: '/login',
        component: () => import("@/views/login/index.vue")
    },
    {
        path: '/401',
        name: 'error-401',
        component: () => import('@/views/error/401.vue'),
    }
]


const Router = createRouter({
    history: createWebHashHistory(),
    routes,
})


/**
 * 路由权限校验
 */
Router.beforeEach(async (to, from, next) => {
    document.title = getPageTitle(to.meta, store.state.app.locale)
    NProgress.start()
    if (cookie.get('token') && cookie.get('token') !== 'undefined') { //判断本地是否存在access_token
        //如果本地 存在 token 则 不允许直接跳转到登录页面
        if (to.fullPath === "/login") {
            next();
            await Router.push(from.fullPath)
        } else {
            //缓存访问过的路由
            if (store.state.app.tagsView) {
                await store.dispatch("app/addView", to)
            }
            if (store.state.user.menuRoute.length === 0) {
                await setAsyncRoutes()
                next({...to, replace: true})
            } else {
                next()
            }
        }

    } else {
        await loginOutClearData()
        if (to.path === '/login') {
            next()
        } else {
            next(`/login`)
        }
    }
});

//路由结束后 进度条关闭
Router.afterEach(() => {
    NProgress.done()
})


export default Router