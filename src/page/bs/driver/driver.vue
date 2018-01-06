<template>
 
    <el-row>
      <el-col :span="24" style="padding:10px">
        <el-row class="titlr">
          <el-col :span="5">
            <el-breadcrumb separator="/" style="float:left;" class="title">
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/user' }">司机模块</el-breadcrumb-item>
              <el-breadcrumb-item>司机列表</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="2" style="float:right;">
            <el-button type="primary" @click="$store.state.adduserVisible = true">添加司机</el-button>
            <!-- 添加司机弹框 -->
            <el-dialog title="新增司机" :visible.sync="$store.state.adduserVisible" width="50%" :before-close="handleClose" :close-on-click-modal="false" >
              <add-user v-bind="{ getuserlist:getuserlist}"></add-user>
            </el-dialog>
            <!-- 编辑司机弹框 -->
            <el-dialog title="修改司机" :visible.sync="$store.state.reviseVisible" width="50%" :before-close="handleClose" :close-on-click-modal="false">
              <add-revise  v-bind="{ getuserlist:getuserlist }"></add-revise>
            </el-dialog>
          </el-col>
        </el-row>
      </el-col>

      <!-- 司机详情列表 -->
      <el-col :span="24">
        <el-table :data="userlist" border style="width: 100%;">
          <el-table-column fixed prop="driverName" label="司机姓名"> </el-table-column>
          <el-table-column prop="driverAge" label="司机年龄"> </el-table-column>
          <el-table-column prop="driverMobile" label="司机电话" > </el-table-column>
          <el-table-column prop="driverIdentityId" label="身份证号码"  ></el-table-column>
          <el-table-column prop="driver_license_type" label="驾照类型"  > </el-table-column>
          <el-table-column fixed="right" label="操作" >
            <template slot-scope="scope">
              <el-button type="warning"  size="small" @click.native="deleatuser(scope.row.id)" style="float:left">删除</el-button>
              <el-button type="info" size="small"  @click="revise(scope.row)"  style="float:right">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

</template>

<script>
// 引入添加司机组件
// import adduser from "../../../components/driver/driver.vue";
// 引入修改用户组件
// import reviseUser from '../../../components/user/reviseUser.vue';

export default {
  data() {
    return {
      userlist: [],
    };
  },
  methods: {
    revise(main){
      this.$store.state.reviseVisible = true;
      this.$store.state.userlist = main;
    },
    //删除用户
    deleatuser(code) {
      //后台接受不到参数，报错400，可使用URLSearchParams()方法
      let param = new URLSearchParams();
      param.append("userId", code);
      this.axios.post(this.api.deleatuser, param).then(res => {
        if (res.data.code == 200) {
          //默认刷新页面
          this.getuserlist();
        }
      });
    },
    //获取用户列表
    getuserlist() {
      this.axios.get(this.api.getUserList).then(res => {
        this.userlist = res.data.data.result.content;
      });
    },
    //关闭添加用户弹框
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  },
  created() {
    // 需要默认渲染一次
    this.getuserlist();
  },
  // components: {
  //   "add-user": adduser,
  //   "add-revise":reviseUser,
  // }
};
</script>

<style scoped lang="less">
/* 标题栏 */
.titlr{
  height: 40px;
  padding-left: 10px;
    .title{
    line-height: 40px;
  }
}

</style>


