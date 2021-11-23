import {createI18n} from "vue-i18n/index";
import en from './en.js'
import zh from './zh-cn.js'
import store from '@/store'
// 导入element-plus中英文语言包

const messages = {
    en: {
        ...en
    },
    zh: {
        ...zh
    }
}
const i18n = createI18n({
    globalInjection: true,    //可以在html 中使用$t()
    locale:store.state.app.locale, // 语言标识，设置默认语言中文,
    messages
})

export default i18n