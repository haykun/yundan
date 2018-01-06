// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from './router';
import App from './page/App.vue';

// 引入第三方包
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import VueRouter from 'vue-router'

import 'iview/dist/styles/iview.css';
import iView from 'iview';

//引入自己封装的配置文件
import common from './components/common/common.js'
import './css/reset.css'
import apiConfig from './js/apiConfig.js'
import store from './vuex/store.js'


Vue.config.productionTip = false;

// 手动启用第三方插件
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(iView);

//手动启用自己封装的配置文件
Vue.use(common);                    //封装的公共组件

//扩展实例成员
Vue.prototype.axios = axios;         //axios插件
Vue.prototype.api = apiConfig;       //请求地址的配置

//引入cookie的操作方法
import {getCookie} from "./js/cookie.js";


//  在拦截器中添加tokenid
axios.interceptors.request.use(
  config => {
    // 这里写死一个token，然后在这里从cookie中获取到token的值
    var token = getCookie('tokenid')
    if (token) {
      // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
      config.headers.tokenId = token;
    }
    return config
  },
  error => {
    return Promise.reject(error)
  });



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
