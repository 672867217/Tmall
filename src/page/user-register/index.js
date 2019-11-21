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
            // 注册按钮的点击
        $('#submit').click(function() {
            _this.submit()
        });
        // 如果按下回车，也进行提交
        $('.user-content').keyup(function(e) {
            // keyCode === 13
            if (e.keyCode === 13) {
                _this.submit()
            }
        })
        $(".btn-large").bind("click", function() {
                $(".user-con").show();
                $(".ks-dialog").hide();
            })
            // ==============
            // 失去焦点的时候进行username验证
        $('#username').blur(function() {
            var username = $.trim($(this).val());
            // 如果用户名为空，就直接返回，不做任何处理
            if (!username) {
                //当用户名为空的时候，将报错提示信息取消掉
                formError.hide();
                return
            }
            // 如果用户名不为空，则进行用户名的异步验证
            _user.checkUsername(username, function(res) {
                // 隐藏错误提示信息
                formError.hide();
            }, function(errMsg) {
                formError.show(errMsg);
            });
        })
    },
    // 提交表单的函数
    submit: function() {
        var _this = this
            // 从表单上获取的实际数据
        var formData = {
            username: $.trim($('#username').val()),
            password: $.trim($('#password').val()),
            passwordConfirm: $.trim($('#password-confirm').val()),
            phone: $.trim($('#phone').val()),
            email: $.trim($('#email').val()),
            question: $.trim($('#question').val()),
            answer: $.trim($('#answer').val())
        };
        // 表单验证结果
        var validateResult = _this.formValiDate(formData);
        //console.log('validateResult.status = ',validateResult.status);
        // 如果前端验证成功
        if (validateResult.status) {
            console.log("表单前端验证成功,继续服务端验证...");
            // 提交数据到服务器
            _user.register(formData, function() {
                window.location.href = './user-result.html?type=register'
            }, function(errMsg) {
                //错误提示
                formError.show(errMsg);
            });
        } else {
            //前端验证失败
            formError.show(validateResult.msg);
        }
    },
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
        // 验证密码长度
        if (formData.password.length < 6) {
            result.msg = '密码长度不能小于6位';
            return result;
        }
        // 验证两次输入的密码是否一致
        if (formData.password !== formData.passwordConfirm) {
            result.msg = '两次输入的密码不相同';
            return result;
        }
        // 验证手机号
        if (!_mm.validate(formData.phone, 'phone')) {
            result.msg = '手机号格式不正确';
            return result;
        }
        // 验证邮箱格式是否为空
        if (!_mm.validate(formData.email, 'email')) {
            result.msg = '邮箱格式不正确';
            return result;
        }
        // 验证密码提示问题
        if (!_mm.validate(formData.question, 'require')) {
            result.msg = '密码提示问题不能为空';
            return result;
        }
        // 验证密码提示问题的答案
        if (!_mm.validate(formData.answer, 'require')) {
            result.msg = '密码提示问题的答案不能为空';
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