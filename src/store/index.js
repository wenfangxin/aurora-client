import {createStore} from 'vuex'
import app from './modules/app'
import user from './modules/user'

const Store = createStore({
    state: {},
    mutations: {},
    actions: {
    },
    modules: {
        app,
        user
    }
})
export default Store
