import axios from 'axios';
import cookie from "js-cookie";
import router from "../route"
import {ElMessage} from "element-plus";
import store from "@/store"

axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = 'http://admin.joooyoo.com';

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    const token = cookie.get("token")
    if (token && token != undefined) {
        config.headers.token = token
    }
    return config
}, error => {
    return Promise.error(error);
});

//请求返回拦截，把数据返回到页面之前做些什么...
axios.interceptors.response.use(async (response) => {
    if (response.data.code&&response.data.code != 200) {
        ElMessage.closeAll()
        ElMessage.error(response.data.msg)
    }
    if (response.data.code&&response.data.code == '403') {
        await store.dispatch("user/logOut")
        return
    }
    if (response.data.code&&response.data.code == '401') {
        // await router.push("/401")
        return
    }
    return Promise.resolve(response);

}, function (error) {
    ElMessage.error("SERVER ERROR")
    return Promise.reject(error);
});

export default axios
