<template>
  <el-container>
    <el-header>视频列表</el-header>
    <el-main
      ><el-row :gutter="20">
        <el-col v-for="(item, index) in videosMeta" :key="index" :span="8"
          ><div class="grid-content bg-purple">{{ item.objName }} <el-button @click="deleteFile(item)">删除</el-button> <video class="video-prev" :src="item.url" controls="true"></video></div
        ></el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form el-form :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item label="bucketName:" prop="bucketName">
                <!-- 选择器 -->
                <el-select v-model="ruleForm.bucketName" placeholder=""> <el-option v-for="(item, index) in bucketNames" :key="index" :value="item"> </el-option> </el-select>
              </el-form-item>
              <el-form-item prop="file">
                <!-- 上传组件，支持拖拽上传 -->
                <el-upload class="upload-demo" drag action="#" :show-file-list="true" :http-request="uploadHttpRequest" :file-list="fileList" :on-change="handleUploadChange" multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <!-- 进度条，显示上传进度 -->
                  <el-progress v-show="show" :percentage="percent"></el-progress> </el-upload
              ></el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
let Minio = require('minio')
const stream = require('stream')
let axios = require('axios')
export default {
  name: 'Home',
  data() {
    return {
      minioClient: new Minio.Client({
        endPoint: '10.166.210.64',
        port: 9000,
        useSSL: false,
        accessKey: 'minioadmin',
        secretKey: 'minioadmin',
      }),
      show: false,
      bucketNames: [],
      videosMeta: [],
      fileList: [],
      percent: 0,
      selectedBucket: '',
      ruleForm: {
        bucketName: '',
        file: '',
      },
      rules: {
        bucketName: [
          {
            required: true,
            message: '请选择要上传的Bucket',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  async created() {
    let vm = this
    this.minioClient.listBuckets(function (err, buckets) {
      if (err) return console.log(err)
      buckets.forEach((e) => {
        // get the name of bucket
        vm.bucketNames.push(e.name)
        // list the objects of this bucket
        let stream = vm.minioClient.listObjects(e.name, '', true)

        stream.on('data', function (obj) {
          let meta = new Object()
          meta.bucketName = e.name
          // get the name of the objects
          meta.objName = obj.name

          // get the URL of the objects to play the videos
          vm.minioClient.presignedUrl('GET', e.name, obj.name, 24 * 60 * 60, function (err, presignedUrl) {
            if (err) return console.log(err)
            // record the object url
            meta.url = presignedUrl
            vm.videosMeta.push(meta)
          })
        })
        stream.on('error', function (err) {
          console.log(err)
        })
      })
    })
  },
  methods: {
    // 限制文件上传的个数只有一个，获取上传列表的最后一个
    handleUploadChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择的文件
      }
    },
    // 覆盖element的默认上传文件
    uploadHttpRequest(data) {
      let vm = this
      let file = data.file

      // 获取文件类型及大小
      const fileName = file.name

      // 将文件转换为minio可接收的格式
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = (e) => {
        // 定义流
        const bufferStream = new stream.PassThrough()
        // 将buffer写入
        bufferStream.end(Buffer.from(e.target.result))
        vm.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            // 上传
            this.show = true

            vm.minioClient.presignedPutObject(vm.ruleForm.bucketName, fileName, 24 * 60 * 60, function (err, presignedUrl) {
              if (err) return console.log(err)
              let config = {
                headers: { 'Content-Type': file.type }, // 指定上传文件类型
                onUploadProgress: (progressEvent) => {
                  // 显示上传进度
                  if (progressEvent.lengthComputable) {
                    let complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0
                    vm.percent = complete
                    if (complete >= 100) {
                      vm.show = false
                      vm.percent = 0 // 重新置0
                    }
                  }
                },
              } //添加请求头
              axios
                .put(presignedUrl, file, config)
                .then(() => {
                  vm.$message({
                    type: 'success',
                    message: '上传成功!',
                  })
                  location.reload()
                })
                .catch(function (error) {
                  vm.$message.error(error)
                })
            })
          } else {
            console.log('error')
            return false
          }
        })
      }
    },
    deleteFile(e) {
      let vm = this
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          vm.minioClient.removeObject(e.bucketName, e.objName, function (err) {
            if (err) {
              return console.log('Unable to remove object', err)
            }
            console.log('Removed the object')
            vm.$message({
              type: 'success',
              message: '删除成功!',
            })
            location.reload()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
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
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
  margin: 10px 0px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  height: 285px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-select {
  padding: 15px 0px;
}

.video-prev {
  width: 400px;
  height: 200px;
}
.el-button {
  margin: 10px 10px;
  padding: 8px 20px;
}
.el-form-item {
  margin-bottom: 10px;
}
.el-form-item__error {
  margin-top: -12px;
  padding-top: 0px;
}
.el-form-item label {
  font-size: 18px;
  padding: 15px 24px;
  padding-right: 0px;
}
</style>
