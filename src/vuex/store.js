import Vue from 'vue'
import Vuex from 'vuex'
import {getCookie} from '../js/cookie.js'
Vue.use(Vuex)

const state = {
  username:'',
  //控制添加用户弹框
  adduserVisible:false,
  reviseVisible:false,
  //控制侧边栏伸缩
  isCollapse:false,
  userlist:''
}

const mutations = {
  //判断用户是否登录
  islogin(){
    if(!getCookie('tokenid')){
      this.$router.push('/')
    }
  }
}


export default new Vuex.Store({
  state,
  mutations
})
