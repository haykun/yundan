<template>
<div class="hom">
    <el-row>
      <el-col :span="24" class="hed">
        <!-- 头部导航栏 -->
        <app-header></app-header>
      </el-col>
    </el-row>

    <div class="main">
      <aside>
        <app-aside></app-aside>
      </aside>
      <section>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
      </section>
    </div>

</div>

</template>

<script>
export default {
  mounted () {
    if (!this.$store.state.isCollapse) {
      let dat = document.querySelector("aside");
      dat.style.width = 202 + "px";
    } else {
      let dat = document.querySelector("aside");
      dat.style.width = "";
    }
  }
};
</script>

<style scoped>
.hom {
  height: 100%;
  overflow: hidden;
}
/* 内容 */
.main {
  height: 100%;
  display: flex;
}
aside {
  min-width: 50px;
  height: 100%;
}
section {
  flex: 1;
  overflow-y: auto;
}

.hed {
  height: 60px;
}

showsidebar {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>



