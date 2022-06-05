<template>
  <el-container>
    <el-header>
      <img src="../assets/back.svg" alt="" @click="goBack" />
      <span>{{ this.$route.params.name }}</span>
    </el-header>
    <el-main>
      <video class="video-play" :src="this.$route.params.url" controls="true"></video>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Video',
  methods: {
    goBack() {
      this.$router.back(-1)
    },
  },
}
</script>

<style scoped>
.el-header {
  font-size: 28px;
  text-align: left;
  line-height: 60px;
  display: flex;
  align-items: center;
}
.el-header img {
  width: 90px;
  height: 45px;
  cursor: pointer;
}
.video-play {
  height: 516px;
}
</style>
