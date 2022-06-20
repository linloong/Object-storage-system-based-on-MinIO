<template>
  <el-container>
    <el-header>
      <img src="../assets/back.svg" alt="" @click="goBack" />
      <span>{{ this.$route.params.name }}</span>
    </el-header>
    <el-main>
      <video class="video-play" :src="this.$route.params.url" controls="true"></video>
      <el-popover class="popover" placement="top-start" trigger="hover">
        <img id="qrcode" :src="qrImg" />
        <el-button slot="reference">分享视频</el-button>
      </el-popover>
    </el-main>
  </el-container>
</template>

<script>
let QRCode = require('qrcode')
export default {
  name: 'Video',
  data() {
    return {
      qrImg: '',
    }
  },
  created() {
    this.makeCode()
  },
  methods: {
    goBack() {
      this.$router.back(-1)
    },
    makeCode() {
      let vm = this
      QRCode.toDataURL(this.$route.params.url, function (err, url) {
        vm.qrImg = url
      })
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
.el-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.video-play {
  margin: 0 auto;
  width: 923px;
  height: 516px;
}
.popover {
  margin-left: 200px;
  margin-top: 20px;
}
#qrcode {
  width: 160px;
  height: 160px;
  margin-top: 15px;
}
</style>
