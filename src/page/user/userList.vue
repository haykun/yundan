<template>
 
    <el-row>
      <el-col :span="24" style="padding:10px">
        <el-row class="titlr">
          <el-col :span="5">
            <el-breadcrumb separator="/" style="float:left;" class="title">
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/user' }">用户模块</el-breadcrumb-item>
              <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="2" style="float:right;">
            <el-button type="primary" @click="$store.state.adduserVisible = true">添加用户</el-button>
            <!-- 添加用户弹框 -->
            <el-dialog title="新增用户" :visible.sync="$store.state.adduserVisible" width="50%" :before-close="handleClose" :close-on-click-modal="false" >
              <add-user v-bind="{ getuserlist:getuserlist}"></add-user>
            </el-dialog>
            <!-- 编辑用户弹框 -->
            <el-dialog title="修改用户" :visible.sync="$store.state.reviseVisible" width="50%" :before-close="handleClose" :close-on-click-modal="false">
              <add-revise  v-bind="{ getuserlist:getuserlist }"></add-revise>
            </el-dialog>
          </el-col>
        </el-row>
      </el-col>

      <!-- 用户详情列表 -->
      <el-col :span="24">
        <el-table :data="userlist" border style="width: 100%;" @selection-change="changeUserFun">
          <el-table-column prop="id" type="selection" width="55"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"> </el-table-column>
          <el-table-column prop="email" label="邮箱" > </el-table-column>
          <el-table-column prop="identity" label="身份证号码"  ></el-table-column>
          <el-table-column prop="modifyTime" label="修改时间"  > </el-table-column>
          <el-table-column prop="phone" label="手机号码" > </el-table-column>
          <el-table-column prop="userName" label="名称" > </el-table-column>
          <el-table-column fixed="right" label="操作" >
            <template slot-scope="scope">
              <el-button type="warning"  size="small" @click.native="deleatuser(scope.row.id)" style="float:left">删除</el-button>
              <el-button type="info" size="small"  @click="revise(scope.row)"  style="float:right">编辑</el-button>
              <el-button type="info" size="small"  @click="queryUserRoleFun(scope.row)"  style="float:right">分配角色</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose">
        <!--角色组tree-->
        <el-tree
                  :data="roleTreeData"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  ref="tree"
                  :default-checked-keys=defaultCheckedKeys
                  :props="defaultProps">
                </el-tree> 
        <div class="buttons">
          <el-button @click="getCheckedKeys">通过 key 获取</el-button>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUserRoleFun">确 定</el-button>
        </span> 
      </el-dialog>
    </el-row>
    
</template>

<script>
// 引入添加用户组件
import adduser from "../../components/user/adduser.vue";
// 引入修改用户组件
import reviseUser from '../../components/user/reviseUser.vue';

let currentUpdateUserId  = "" //当前修改角色组的用户id

export default {
  data() {
    return {
        roleTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'roleName'
        },
        userlist: [],
        dialogVisible:false,
        defaultCheckedKeys:[] 
    };
  },
  methods: {
    queryUserRoleFun(row){
      currentUpdateUserId = row.id
      this.dialogVisible = true  
      let that = this;
      let params = new URLSearchParams();
      params.append("userId", row.id);
      this.axios.post(this.api.queryUserRole,params).then(res => { 
        if (res.data.code) {
          that.roleTreeData = res.data.data.customerRole;
          that.defaultCheckedKeys = res.data.data.userRole;
          console.log("that.defaultCheckedKeys = " +res.data.data.userRole)
        }
      })    
    },
    updateUserRoleFun(){
      let params = new URLSearchParams();
      params.append("userId", currentUpdateUserId);
      console.log("currentUpdateUserId = "+currentUpdateUserId)
      console.log("this.$refs.tree.getCheckedKeys() = "+this.$refs.tree.getCheckedKeys())
      params.append("roleIds",this.$refs.tree.getCheckedKeys());
      this.axios.post(this.api.updateUserRole,params).then(res => { 
        if (res.data.code) {
          that.roleTreeData = res.data.data.customerRole;
          that.defaultCheckedKeys = res.data.data.userRole;
          console.log("that.defaultCheckedKeys = " +res.data.data.userRole)
        }
      }) 

    },
    revise(main){
      this.$store.state.reviseVisible = true;
      this.$store.state.userlist = main;
    },
    //删除用户
    deleatuser(code) {
      //后台接受不到参数，报错400，可使用URLSearchParams()方法
      let param = new URLSearchParams();
      param.append("userId", code);
      this.axios.post(this.api.deleatuserthis.api.deleatuser, param).then(res => {
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
    },
    //复选框状态改变
    changeUserFun(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection.length)
      if(this.multipleSelection.length !=1 ){
        return false; 
      }
      console.log("OK")
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
    }
  },
  created() {
    // 需要默认渲染一次
    this.getuserlist();
  },
  components: {
    "add-user": adduser,
    "add-revise":reviseUser,
  }
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


 

 