import cookie from 'js-cookie';
import { menuRoute} from "@/config";
import api from "@/api"
import {filterRouterFormat} from "@/route/setRoute";
import Router from "@/route/index";
import {loginOutClearData} from "@/utils";
export default {
    namespaced: true,
    state: {
        userId: cookie.get('userId'),
        token: cookie.get('token'),
        roleKey:cookie.get('roleKey'),
        userInfoData:{},
        menuRoute: []
    },
    mutations: {
        //修改token
        SET_TOKEN(state, data) {
            state.token = data;
        },
        //修改userId
        SET_USER_ID(state, data) {
            state.userId = data;
        },
        //修改menuData
        SET_MENU_ROUTE(state, data) {
            state.menuRoute = data;
        },
        SET_USER_DATA(state,data){
            state.userInfoData = data
        }
    },
    actions: {
        //用户登录
        userLogin({commit}, data) {
            return new Promise((resolve, reject) => {
                api.user.login(data).then(res => {
                    resolve(res.data)
                    if (res.data.code === 200){
                        cookie.set('token', res.data.data.token);
                        cookie.set('userId', res.data.data.user_id);
                        cookie.set('roleKey', res.data.data.role_key);
                    }
                })
            })
        },
        getUserData({commit,state}){
            return new Promise((resolve, reject) => {
                api.user.getUserData().then(res=>{
                    if (res.data.code === 200){
                        commit("SET_USER_DATA",res.data.data)
                        resolve()
                    }
                })
            })
        },
        //退出登录
        logOut({commit}) {
            return new Promise((resolve, reject) => {
                cookie.remove('token')
                Router.push({
                    path: '/login'
                }).then( async res => {
                   await loginOutClearData()
                })
                resolve();
            })
        },
        //获取菜单
        getMenu({commit}) {
            return new Promise((resolve, reject) => {
                api.user.getMenuRouter().then(res=>{
                    let menu = filterRouterFormat(res.data.data)
                    commit("SET_MENU_ROUTE", menu)
                    resolve(menu)
                }).catch((err)=>{
                    reject(err)
                })
            })
        }
    },
    getters: {}
}
