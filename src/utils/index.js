import {title} from "@/config/defaultSettings";
import store from "@/store"
//页面title i18n
export const getPageTitle = (meta, locale) => {
    if (!meta.title) {
        return title
    }
    if (locale == 'zh') {
        return meta.title + ' - ' + title
    }
    if (locale == 'en') {
        return meta.en_title + ' - ' + title
    }
    return title

}


export const loginOutClearData = async () => {
    //清除menuData
    store.commit("user/SET_MENU_ROUTE", [])
    store.commit("user/SET_USER_DATA", {})
    await store.dispatch("app/delAllViews")
    await store.dispatch("app/delCachedView")
}