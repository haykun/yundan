<template>


      <el-menu  text-color="#fff" active-text-color="#ffd04b" :collapse="$store.state.isCollapse" :default-active="defaultActive" theme="dark" router class="uld">

        <div class="but2">
          <el-button v-model="$store.state.isCollapse" @click.native="slidelay" class="but"> 
            <span v-if="$store.state.isCollapse">展开</span> 
            <span v-if="!$store.state.isCollapse">收缩</span>
          </el-button>
        </div>

        <el-submenu v-for="(item,index) in onenav" v-bind:key="item.nodeCode"  @click.native="gettwonav(item.nodeCode,index)" :index='item.id+""' class="twonav">      
            <template slot="title"><i class="el-icon-location"></i><span>{{ item.nodeName  }}</span></template>
            <!-- 请求渲染数据有延迟 -->
            <!-- <div > -->
              <el-menu-item class="twonavv" v-for="(info,val) in twonav1[index]" :key="info.activeUrl" :index="info.activeUrl">{{ info.nodeName }} </el-menu-item>
            <!-- </div> -->
        </el-submenu>
      </el-menu>

</template>

<script>
export default {
  data() {
    return {
      onenav: [],
      twonav1: {},
    };
  },
  methods: {
    //获取一级导航栏
    getonenav() {
      this.axios.get(this.api.getOneNav).then(res => {
        let nav = res.data.data.result;
        for (var i = 0; i < nav.length; i++) {
          var j = i + 1;
          nav[i].id = j;
        }
        this.onenav = nav;
      });
    },
    //获取二级导航栏
    gettwonav(id, index) {
      this.axios.get(`${this.api.getOneNav}?parentNodeCode=${id}`).then(res => {
        //通过添加一个对象来渲染数据
        let data = res.data.data.result;
        //在修改定义好的数据时，要是用vue中封装好的修改数据的方法视图才会及时更新
        this.$set(this.twonav1,index,data)
      });
    },
    //通过点击来伸缩侧边导航栏
    slidelay(){
      this.$store.state.isCollapse = !this.$store.state.isCollapse;
      if(!this.$store.state.isCollapse){
        let dat = document.querySelector('aside');
        dat.style.width = 202 + 'px';
      }else{
        let dat = document.querySelector('aside');
        dat.style.width = '';
      }
    }
  },
  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    this.getonenav();
  }
};
</script>



<style scoped lang="less">
  el-menu-item{
    border-bottom: 1px solid #ccc;
  }
  .toggle{
    background-color: #545c64;
    width: 100%;
    height: 100%;
  }

//设置伸缩按钮的样式
.but{
  background-color:  #545c64;
  border :none;
  width: 100%;
  color: #fff;
}
.but2 :hover{
  background-color: #909399;
}
.uld{
  height: 100%;
  background-color:#545c64;
}

.asid{
  height: 100%;
}

/* 二级导航栏样式 */
.twonav{
  background-color: #545c64;
}
.twonav :hover{
  background-color: #909399;
}
 .twonavv{
   background-color: #545c64;
 }
</style>
