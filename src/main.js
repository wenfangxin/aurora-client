import {createApp} from 'vue'
import App from './App.vue'
import Router from "./route";
import Store from './store'
import "../src/assets/css/common.css"
import "../src/assets/css/media.scss"
import ElementPlus from 'element-plus'
import "./assets/css/element.scss"
import Moment from "moment"
import 'moment/locale/zh-cn'
import api from "./api"
import i18n from "@/language";


const app = createApp(App)
app.config.globalProperties.$moment = Moment
app.config.globalProperties.$api = api


app.use(ElementPlus,{
    size:'small'
})
app.use(Router)
app.use(Store)
app.use(i18n)
app.mount('#app')
