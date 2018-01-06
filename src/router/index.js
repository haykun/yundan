import Vue from 'vue';
import Router from 'vue-router';
import Login from '../page/login/login';
import Home from '../page/home/home.vue';
import UserList from '../page/user/userList.vue';
import RoleList from '../page/bs/user/roleList.vue';
import MenuList from '../page/bs/user/menuList.vue';
import ConsumerList from '../page/bs/user/customerList.vue'
import TaskCategory from '../page/bs/resource/taskCategory.vue'
import UsualAddress from '../page/bs/address/address.vue';
import DriverList from '../page/bs/driver/driver.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path:'/home',
      name:'Home',
      component:Home,
      children:[{
        path:'/user',
        name:'UserList',
        component:UserList,
        meta: ['用户列表']
      },
      {
        path:'/order',
        name:'RoleList',
        component:RoleList,
        meta:['角色列表']
      },
      {
        path:'/menu',
        name:'MenuList',
        component:MenuList,
        meta:['权限列表']
      },
      {
        path:'/customerOrg/getPageCustomerOrg',
        name:'ConsumerList',
        component:ConsumerList,
        meta:['客户列表']
      },

      
      // 以下是二级菜单
      {
        path:'/resource/taskcategory',
        name:'TaskCategory',
        component:TaskCategory,
        meta:['运单分类管理']
      },
      {
        path: '/address',
        name: 'UsualAddress',
        component: UsualAddress,
        meta: ['常用地址管理']
      },
      {
        path: '/driverlist',
        name: 'DriverList',
        component: DriverList,
        meta: ['司机列表']
      }
    ]
    }
  ]
})
