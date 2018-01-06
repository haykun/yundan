<template>
<div>
    <el-form :model="ruleForm2" status-icon ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="身份证" prop="identity">
            <el-input type="text" v-model="ruleForm2.identity" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
            <el-input type="text" v-model="ruleForm2.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证类型" prop="identityType">
            <el-select v-model="ruleForm2.identityType" placeholder="请选择身份证类型" class="select">
                <el-option label="1" value="1"></el-option> 
                <el-option label="0" value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="管理员类型" prop="isSuperAdmin">
            <el-select v-model="ruleForm2.isSuperAdmin" placeholder="请选择管理员类型" class="select">
                <el-option label="1" value="1"></el-option>
                <el-option label="0" value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
            <el-select v-model="ruleForm2.sex" placeholder="请选择性别" class="select">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
            <el-select v-model="ruleForm2.status" placeholder="请选择用户状态" class="select">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="用户编码" prop="userCode">
            <el-input v-model.number="ruleForm2.userCode"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
            <el-input v-model.number="ruleForm2.userName"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
            <el-select v-model="ruleForm2.userType" placeholder="请选择用户状态" class="select">
                <el-option label="person" value="1"></el-option>
                <el-option label="pilotPerson" value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
        </el-form-item>
    </el-form>
</div>

</template>

<script>
export default {
  props: ["getuserlist"],
  data() {
    return {
      //表单信息
      ruleForm2: {
        identity: "",
        phone: "",
        identityType: "1",
        isSuperAdmin: "1",
        sex: "1",
        status: "1",
        userCode: "",
        userName: "",
        userType: "1"
      }
    };
  },
  methods: {
    //提交用户数据
    submitForm(formName) {
      //查询用户是否确定添加用户
      this.$confirm("是否确定添加用户", "新增用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //发送ajax请求渲染数据
          this.$refs[formName].validate(valid => {
            if (valid) {
              let _this = this;
              this.axios.post(_this.api.adduser, _this.ruleForm2).then(res => {
                if (res.data.code == 200) {
                  this.getuserlist();
                  this.$message({ type: "success", message: "添加成功!" });
                  this.$store.state.adduserVisible = !this.$store.state
                    .adduserVisible;
                } else {
                  this.$message({ type: "info", message: "添加失败!" });
                  this.$store.state.adduserVisible = !this.$store.state
                    .adduserVisible;
                }
              });
            } else {
              return false;
            }
          });
        })
        .catch(() => {
          this.$message({ type: "info", message: "取消添加" });
          return;
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
/* 设置下拉框的样式 */
.select {
  width: 100%;
}
</style>

