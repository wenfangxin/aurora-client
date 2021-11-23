import variables from "../../assets/css/element.scss"
import {fixedHeader, locale, pageRefresh, sidebarLogo, tagsView, uniqueOpened} from '@/config/defaultSettings'
import cookie from "js-cookie";
import api from "@/api";
import {filterRouterFormat} from "@/route/setRoute";

let lang = cookie.get('lang')
export default {
    namespaced: true,
    state: {
        qiNiuToken:"",
        collapse: false,   //是否展开菜单栏
        menuIcon: 'icon-zhedie1', // 收缩菜单的图标
        theme:variables.theme,  //默认主题色
        device: 'desktop',
        locale: lang === undefined ? locale : lang,
        fixedHeader: fixedHeader,
        sidebarLogo: sidebarLogo,
        tagsView: tagsView,
        showSettings: false,
        pageRefresh: pageRefresh,
        uniqueOpened: uniqueOpened,
        visitedViews: [], //tagView
        keepAliveViews: [] //缓存的页面
    },
    mutations: {
        //打开设置
        SET_SHOW_SETTINGS: (state, data) => {
            state.showSettings = data
        },
        //当前的语言
        SET_LOCALE: (state, data) => {
            state.locale = data
        },
        //修改展开菜单栏状态
        SET_COLLAPSE: (state, data) => {
            state.collapse = data;
        },
        //修改展开的icon
        SET_MENU_ICON: (state, data) => {
            state.menuIcon = data;
        },
        //设置
        CHANGE_SETTING: (state, {key, value}) => {
            if (state.hasOwnProperty(key)) {
                state[key] = value
                if (value) {
                    localStorage.setItem(key, '1')
                } else {
                    localStorage.setItem(key, '0')
                }
            }
        },
        //添加tagView
        ADD_VISITED_VIEW: (state, view) => {
            if (state.visitedViews.some(v => v.path === view.path)) return
            if (!view.meta.title) {
                return;
            }
            state.visitedViews.push(
                Object.assign({}, view, {
                    title: view.meta.title || 'no-name'
                })
            )
        },
        //删除缓存的访问tagView
        DEL_VISITED_VIEW: (state, view) => {
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.path === view.path) {
                    state.visitedViews.splice(i, 1)
                    break
                }
            }
        },
        //关闭其他
        DEL_OTHERS_VISITED_VIEWS: (state, view) => {
            state.visitedViews = state.visitedViews.filter(v => {
                return v.meta.affix || v.path === view.path
            })
        },
        //关闭所有
        DEL_ALL_VISITED_VIEWS: state => {
            // keep affix tags
            const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
            state.visitedViews = affixTags
        },
        //添加需要缓存的页面
        ADD_KEEP_ALIVE: (state, view) => {
            if (state.keepAliveViews.includes(view.name)) return
            if (view.meta.keep) {
                state.keepAliveViews.push(view.name)
            }
        },
        DEL_KEEP_ALIVE: (state, view) => {
            const index = state.keepAliveViews.indexOf(view)
            index > -1 && state.keepAliveViews.splice(index, 1)
        },
        TOGGLE_DEVICE: (state, device) => {
            state.device = device
        },
        SET_QI_NIU_TOKEN:(state,token)=>{
            state.qiNiuToken = token
        }


    },
    getters: {},
    actions: {
        changeLanguage({commit}, data) {
            commit('SET_LOCALE', data)
            cookie.set('lang', data)
        },
        changeShowSettings({commit}, data) {
            commit('SET_SHOW_SETTINGS', data)
        },
        changeSetting({commit}, data) {
            commit('CHANGE_SETTING', data)
        },
        addView({dispatch}, view) {
            dispatch('addVisitedView', view)
        },
        addVisitedView({commit}, view) {
            commit('ADD_VISITED_VIEW', view)
        },
        delView({dispatch, state}, view) {
            return new Promise(resolve => {
                dispatch('delVisitedView', view)
                resolve({
                    visitedViews: [...state.visitedViews],
                })
            })
        },
        delVisitedView({commit, state}, view) {
            return new Promise(resolve => {
                commit('DEL_VISITED_VIEW', view)
                resolve([...state.visitedViews])
            })
        },
        delOthersViews({dispatch, state}, view) {
            return new Promise(resolve => {
                dispatch('delOthersVisitedViews', view)
                resolve({
                    visitedViews: [...state.visitedViews],
                })
            })
        },
        delOthersVisitedViews({commit, state}, view) {
            return new Promise(resolve => {
                commit('DEL_OTHERS_VISITED_VIEWS', view)
                resolve([...state.visitedViews])
            })
        },
        delAllViews({dispatch, state}, view) {
            return new Promise(resolve => {
                dispatch('delAllVisitedViews', view)
                resolve({
                    visitedViews: [...state.visitedViews],
                })
            })
        },
        delAllVisitedViews({commit, state}) {
            return new Promise(resolve => {
                commit('DEL_ALL_VISITED_VIEWS')
                resolve([...state.visitedViews])
            })
        },
        addKeepAlive({commit}, view) {
            commit('ADD_KEEP_ALIVE', view)
        },
        delCachedView({commit, state}, view) {
            return new Promise(resolve => {
                commit('DEL_KEEP_ALIVE', view)
                resolve([...state.keepAliveViews])
            })
        },
        toggleDevice({ commit }, device) {
            commit('TOGGLE_DEVICE', device)
        },
        getQiNiuToken({commit}){
            return new Promise((resolve, reject) => {
                api.app.getQiNiuToken().then(res=>{
                    commit("SET_QI_NIU_TOKEN", res.data.data)
                    resolve()
                }).catch((err)=>{
                    reject(err)
                })
            })
        }

    }
}
