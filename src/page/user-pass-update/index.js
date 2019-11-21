'use strict'

require('./index.css');
require('@/common/nav/index.js');
require('@/common/header/index.js');
var _mm = require('util/mm.js');
var navSide = require('@/common/nav-side/index.js');
var _user = require('service/user-service.js');

// page逻辑部分
var page = {
	init: function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad: function(){
		//初始化左侧菜单
		navSide.init({
			name: 'user-pass-update'
		})
	},
	// 事件绑定
	bindEvent: function(){
		var _this = this;
		var validateResult;
		$(document).on('click', '.btn-submit', function(){
			var userInfo = {
				password: $.trim($('#password').val()),
				passwordNew: $.trim($('#password-new').val()),
				passwordConfirm: $.trim($('#password-confirm').val()),
			}
			// 前端字段验证
			// 表单验证结果
			validateResult =  _this.validateForm(userInfo);
			// 如果前端验证成功
			if (validateResult.status) {
				// 更改用户密码
				_user.updatePassword({
					passwordOld: userInfo.password,
					passwordNew: userInfo.passwordNew
				}, function(res, msg){
					_mm.successTips(msg);
					window.location.href = './user-result.html?type=user-pass-update'
				},function(errMsg){
					_mm.errorTips(errMsg);
				});
			}else{
				_mm.errorTips(validateResult.msg);
			}
		})
	},
	validateForm: function(formData){
		// 空的结果对象
		var result = {
			status: false,
			msg: ''
		};
		//验证原密码是否为空
		if (!_mm.validate(formData.password, 'require')){
			result.msg = '原密码不能为空';
			return result;
		}
		//验证新密码长度
		if (!formData.passwordNew || formData.passwordNew.length < 6){
			result.msg = '密码长度不能少于6位';
			return result;
		}
		//验证两次输入的密码是否一致
		if (formData.passwordNew !== formData.passwordConfirm) {
			result.msg = '两次输入的密码不一致';
			return result;
		}
		// 如果通过验证，则返回正确的提示
		result.status = true;
		result.msg = '验证通过';
		// 返回验证的结果对象
		return result;
	}
}

// 函数的自执行
$(function(){
	page.init();
})