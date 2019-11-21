'use strict'

require('./index.css');
require('@/common/nav-simple/index.js');
require('node_modules/font-awesome/css/font-awesome.min.css');
var _user = require('service/user-service.js');
var _mm = require('util/mm.js');

// 错误提示的对象
var formError = {
    show: function(errMsg) {
        $('.error-item').show().find('.err-msg').text(errMsg);
    },
    hide: function() {
        $('.error-item').hide().find('.err-msg').text('');
    }
}

var page = {
    init: function() {
        this.bindEvent()
    },
    // 绑定事件的函数
    bindEvent: function() {
        var _this = this
            // 登录按钮的点击
        $('#submit').click(function() {
                _this.submit()
            })
            // 如果按下回车键，也进行提交
        $('.user-content').keyup(function(e) {
            // keyCode === 13
            if (e.keyCode === 13) {
                _this.submit()
            }
        })

    },
    // 提交表单的函数
    submit: function() {
        var _this = this
            // 从表单上获取的实际数据
        var formData = {
            username: $.trim($('#username').val()),
            password: $.trim($('#password').val())
        };
        console.log("name = ", formData.username)
        console.log("password = ", formData.password)
            // 表单验证结果
        var validateResult = _this.formValiDate(formData);
        console.log('validateResult.status = ', validateResult.status);
        // 如果前端验证成功
        if (validateResult.status) {
            console.log("表单前端验证成功,继续服务端验证...");
            // 提交数据到服务器
            _user.login(formData, function() {
                window.location.href = _mm.getUrlParam('redirect') || './index.html'
                    // window.location.href = './index.html'
            }, function(errMsg) {
                //错误提示
                formError.show(errMsg);
            });
        } else {
            //前端验证失败
            formError.show(validateResult.msg);
        }
    },
    /*isNullOrTrue: function(){
    	// 将_mm.getUrlParam('redirect')的结果进行强制转化成Boolean类型：true或者false
    	var isNull = Boolean(_mm.getUrlParam('redirect'))
    	// 如果为true，则说明参数存在
    	if (isNull) {
    		return _mm.getUrlParam('redirect')
    	}else{
    		return false
    		// return null 也行
    	}
    },*/
    // 【前端】表单验证函数的开发
    formValiDate: function(formData) {
        // 空的结果对象
        var result = {
            status: false,
            msg: ''
        };
        // 验证用户名
        if (!_mm.validate(formData.username, 'require')) {
            result.msg = '用户名不能为空';
            return result;
        }
        // 验证密码
        if (!_mm.validate(formData.password, 'require')) {
            result.msg = '密码不能为空';
            return result;
        }
        // 如果通过验证，则返回正确的提示
        result.status = true;
        result.msg = '验证通过';
        // 返回验证的结果对象
        return result;
    }
};
//函数的自执行
$(function() {
    page.init();
});