//编写自己的公共组件库
import HeaderCompontent from './header.vue'
import AsideCompontent from './aside.vue'
export default {
    install(Vue) {
        Vue.component('app-header',HeaderCompontent),
        Vue.component('app-aside',AsideCompontent)
    }
};