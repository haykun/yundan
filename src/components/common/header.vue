<template>

    <el-menu :default-active="activeIndex" class="el-menu-demo" router mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-row>
            <el-col class="ind1" :span="2"><el-menu-item index="/home"><img src="../../assets/logohome.png" alt=""></el-menu-item></el-col>
            <el-col :span="2"><el-menu-item index="/home">消息管理</el-menu-item></el-col>
            <el-col :span="2"><el-menu-item index="/home">运单管理</el-menu-item></el-col>
            <el-col :span="2"><el-menu-item index="/home">报表管理</el-menu-item></el-col>
            <el-col :span="2"><el-menu-item index="/home">参数管理</el-menu-item></el-col>
        </el-row>
    </el-menu>

</template>

<script>
export default {
  data () {
      return {
          activeIndex:''
      }
  }
}
</script>

<style scoped lang="less">
el-menu{
    max-height: 60px;
}
.ind1 img{
    width: 100%;
}
</style>

