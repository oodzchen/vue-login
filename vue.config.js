var bodyParser = require('body-parser')

module.exports = {
  devServer: {
    before: function (app, server) {
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: true }))

      app.post('/api/sendcode', (req, res) => {
        if (req.body.phone !== '13288888888') {
          res.json({
            err_code: 1,
            err_msg: '该号码未注册',
            data: {}
          })
          return;
        }

        res.json({
          err_code: 0,
          data: true
        })
      })

      app.post('/api/login', (req, res) => {
        // ...
        if (req.body.phone !== '13288888888') {
          res.json({
            err_code: 1,
            err_msg: '该号码未注册',
            data: {}
          })
          return;
        }

        if (req.body.authcode !== '888888') {
          res.json({
            err_code: 2,
            err_msg: '验证码错误',
            data: {}
          })

          return;
        }

        res.json({
          err_code: 0,
          data: true
        })
      })
    }
  }
}