<template>
<el-form :model="$store.state.userlist" status-icon ref="$store.state.userlist" label-width="100px" class="demo-ruleForm">
        <el-form-item label="身份证" prop="identity">
            <el-input type="text" v-model="$store.state.userlist.identity" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
            <el-input type="text" v-model="$store.state.userlist.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证类型" prop="identityType">
            <el-select v-model="$store.state.userlist.identityType" placeholder="请选择身份证类型" class="select">
                <el-option label="1" value="1"></el-option> 
                <el-option label="0" value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="管理员类型" prop="isSuperAdmin">
            <el-select v-model="$store.state.userlist.isSuperAdmin" placeholder="请选择管理员类型" class="select">
                <el-option label="1" value="1"></el-option>
                <el-option label="0" value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
            <el-select v-model="$store.state.userlist.sex" placeholder="请选择性别" >
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
            <el-select v-model="$store.state.userlist.status" placeholder="请选择用户状态">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="用户编码" prop="userCode">
            <el-input v-model.number="$store.state.userlist.userCode"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
            <el-input v-model.number="$store.state.userlist.userName"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
            <el-select v-model="$store.state.userlist.userType" placeholder="请选择用户状态">
                <el-option label="person" value="1"></el-option>
                <el-option label="pilotPerson" value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm($store.state.userlist)">提交</el-button>
            <el-button type="primary" @click="resetForm">取消</el-button>
        </el-form-item>
    </el-form> 
</template>

<script>
export default {
  data() {
    return {

    };
  },
  methods: {
      //修改用户信息
      submitForm(value){
          console.log(value)
      },
      //关闭弹窗
      resetForm(){
        this.$store.state.reviseVisible = false;
      }
  },
  props: ['getuserlist','userMain']
};
</script>

<style scoped>

</style>

