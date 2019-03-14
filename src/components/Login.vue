<template>
  <v-container>
    <v-card>
      <v-card-text>作为测试用的手机号位 13288888888，短信验证码为888888。其他手机号均为未注册号码，其他验证码均为错误验证码。</v-card-text>
    </v-card>
    <v-form ref="form">
      <v-input>
        <v-text-field 
          ref="phoneInput"
          v-model="phone"
          type="number"
          :rules="phoneRules"
          required
          validate-on-blur
          label="手机号"></v-text-field>
      </v-input>
      <v-input>
        <v-text-field 
          v-model="authcode"
          type="number"
          :rules="authcodeRules"
          required
          validate-on-blur
          label="输入6位短信验证码"></v-text-field>
        <v-btn 
          :disabled="codeSent" 
          color="primary" 
          @click="sendCode"
          slot="append">{{codeBtnText}}</v-btn>
      </v-input>
      <v-btn 
        block 
        color="primary"
        @click="submitLogin">登录</v-btn>
    </v-form>

    <v-snackbar 
      top
      v-model="snackbar"
      :color="snackColor"
      :timeout="snackTimeout">{{snackText}}</v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      phone: '',
      authcode: '',
      phoneRules: [
        v => !!v || '请输入手机号',
        v => (v && v.trim().length === 11) || '请输入正确的手机号'
      ],
      authcodeRules: [
        v => !!v || '请输入短信验证码',
        v => (v && v.trim().length === 6) || '请输入正确的短信验证码'
      ],
      codeSent: false,
      timeCount: 60,
      timer: null,
      codeBtnText: '获取短信验证码',
      snackbar: false,
      snackText: '',
      snackColor: 'error',
      snackTimeout: 3000
    }
  },
  methods: {
    sendCode () {
      this.$refs.phoneInput.focus()
      setTimeout(() => {
        this.$refs.phoneInput.blur()
      }, 0)
      if (!this.validatePhone()) return
      
      this.codeSent = true
      this.countSecond()

      // 使用mock接口
      axios.post('/api/sendcode', {
        phone: this.phone
      }).then(res => {
        if (!res.data.err_code) {
          console.log('短信已发送', res.data)
        } else {
          console.log('发送失败：', res.data.err_msg)
          this.resetCount()
          
          this.snackColor = 'error'
          this.snackText = res.data.err_msg
          this.snackbar = true
          setTimeout(() => {
            this.snackText = ''
          }, this.snackTimeout)
        }
      }).catch(err => {
        if (err) throw err
      })
    },
    validatePhone () {
      return this.phoneRules.every(handler => {
        return handler.call(this, this.phone) === true
      })
    },
    countSecond () {
      if (this.timeCount <= 0) {
        this.resetCount()
        return
      }

      this.codeBtnText = `${this.timeCount}秒后可重发`
      this.timer = setTimeout(() => {
        this.timeCount--
        this.countSecond()
      }, 1000)
    },
    resetCount () {
      clearTimeout(this.timer)
      this.codeSent = false
      this.codeBtnText = `重新获取短信验证码`

      this.$nextTick(() => {
        this.timeCount = 60
      })
    },
    submitLogin () {
      if (!this.$refs.form.validate()) return

      // 使用mock接口
      axios.post('/api/login', {
        phone: this.phone,
        authcode: this.authcode
      }).then(res => {
        if (!res.data.err_code) {
          console.log('登录成功', res.data)
          this.$router.push('/hello')
        } else {
          console.log('登录失败： ', res.data.err_msg)
          this.snackColor = 'error'
          this.snackText = res.data.err_msg
          this.snackbar = true
          setTimeout(() => {
            this.snackText = ''
          }, this.snackTimeout)
        }
      }).catch(err => {
        if (err) throw err
      })
    }
  }
}
</script>

