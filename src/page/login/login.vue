<template>
  <el-row class="bod">
     <el-col :span="24" >
        <el-row type="flex" >
            <el-col :span="6" class="tip1 log">
              <img src="../../assets/logo.png" alt="">
            </el-col>
        </el-row>
     </el-col>
 
      <el-col :span="24">
        <el-row type='flex'>
          <el-col :span="6" class="tip2 log" >
                          <el-form :model="loginForm" status-icon :rules="loginForm" ref="loginForm" label-width="100px" class="demo-ruleForm">
            <el-row>
                <el-col :span="20">
                    <el-input class="int" type="text" v-model="loginForm.username" auto-complete="off" ></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-input class="int" type="password" v-model="loginForm.password" auto-complete="off"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-button class="int" type="primary" @click="submitForm()">登录</el-button>
                </el-col>
            </el-row>
            <el-row class="int">
                <el-col :span="10">
                    <a href="javascript:;">忘记密码</a>
                </el-col>
                <el-col :span="10">
                    <el-radio class="bear" label="false" v-model="radio" @click.native="remember">记住密码</el-radio>
                </el-col>
            </el-row>
          </el-form>
          </el-col>
        </el-row>
      </el-col>
  </el-row>

</template>

<script>
import { setCookie } from "../../js/cookie.js";
import localStorage from "../../js/localstorage.js";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      radio: true
    };
  },
  methods: {
    //提交用户信息并跳转到首页
    submitForm() {
      this.axios
        .post(
          `${this.api.getlogin}?userCode=${this.loginForm
            .username}&password=${this.loginForm.password}`
        )
        .then(res => {
          if (res.data.code == 200) {
            let tokenid = res.headers.tokenid;
            setCookie("tokenid", tokenid, 1000 * 60);
            this.$router.push("/home");
          }
        });
    },
    //用户记住密码
    remember() {
      this.radio = !this.radio;
    }
  },
  watch: {
    radio: {
      handler() {
        var _this = this;
        if (this.radio == true) {
          //不记住密码
          localStorage.remove("word");
        } else {
          //记住密码
          localStorage.set("word", this.loginForm.password);
          localStorage.set("name", this.loginForm.username);
        }
      },
      deep: true
    }
  },
  created() {
    if (localStorage.get("word") || localStorage.get("name")) {
      this.loginForm.password = localStorage.get("word");
      this.loginForm.username = localStorage.get("name");
    }
  }
};
</script>


<style lang="less" scoped>
.bod {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/backgorund.jpg");
  background-size: 100% 100%;
}
.log {
  background-color: rgba(0, 0, 0, 0.4);
}
.tip1 {
  margin: 0 auto;
  margin-top: 200px;
  text-align: center;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  img {
    width: 90px;
  }
}
.tip2 {
  margin: 0 auto;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
.int {
  margin: 10px 30px;
  width: 100%;
  height: 40px;
  .bear {
    float: right;
  }
}
</style>




