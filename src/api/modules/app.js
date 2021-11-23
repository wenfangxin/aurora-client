import request from '../../utils/request';
import {defaultConfig} from "@/config";

export default {
    getQiNiuToken(){
        return request.get("/permissions/getQiNiuToken")
    },
    upload(data){
        return request.post(defaultConfig.uploadUrl,data)
    }
}