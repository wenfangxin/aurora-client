import request from '../../utils/request';


export default {
    login(params) {
        return request.post('/login', params)
    },
    getUserData() {
        return request.get("/permissions/getUserData")
    },
    getMenuRouter() {
        return request.get("/permissions/getMenuRouter")
    },
    getMenuList() {
        return request.get("/permissions/getMenuList")
    },
    addMenuRouter(params) {
        return request.post("/permissions/addMenuRouter", params)
    },
    getSingleMenu(params) {
        return request.get("/permissions/GetSingleMenuRouter", {params})
    },
    updateMenuRouter(data) {
        return request.post("/permissions/updateMenuRouter", data)
    },
    deleteMenuRouter(params) {
        return request.get("/permissions/deleteMenuRouter", {params})
    },
    createRole(data) {
        return request.post("/permissions/createRole", data)
    },
    getRolesList(params) {
        return request.get("/permissions/getRolesList", {params})
    },
    updateRole(data) {
        return request.post("/permissions/updateRole", data)
    },
    deleteRole(params) {
        return request.get("/permissions/deleteRole", {params})
    },
    createUser(data) {
        return request.post("/permissions/createUser", data)
    },
    getUserList(params) {
        return request.get("/permissions/getUserList", {params})
    },
    updateUser(data) {
        return request.post("/permissions/updateUser", data)
    },
    updateUserState(data) {
        return request.post("/permissions/updateUserState", data)
    },
    deleteUser(params) {
        return request.get("/permissions/deleteUser", {params})
    },
    queryUser(data) {
        return request.post("/permissions/queryUser", data)
    },
    getApiList(params) {
        return request.get("/permissions/getApiList", {params})
    },
    createApi(data) {
        return request.post("/permissions/createApi", data)
    },
    deleteApi(data) {
        return request.post("/permissions/deleteApi", data)
    },
    updateApi(data) {
        return request.post("/permissions/updateApi", data)
    }

}
