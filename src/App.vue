<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.el-form-item__error {
  margin-top: -12px;
  padding-top: 0px;
}
.el-form-item__label {
  font-size: 18px;
  padding: 15px 24px;
  padding-right: 0px;
}
</style>
