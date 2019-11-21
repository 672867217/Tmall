'use strict'

require('./index.css');
require('@/common/nav/index.js');
require('@/common/header/index.js');
var _mm = require('util/mm.js');
var navSide = require('@/common/nav-side/index.js');
var _user = require('service/user-service.js');
var templateIndex = require('./index.string');

// page逻辑部分
var page = {
	init: function(){
		this.onLoad();
		//加载用户信息
		this.loadUserInfo();
		this.bindEvent();
	},
	onLoad: function(){
		//初始化左侧菜单
		navSide.init({
			name: 'user-center-update'
		})
	},
	// 加载用户信息
	loadUserInfo: function(){
		var userHtml = ''
		_user.getUserInfo(function(res){
			userHtml = _mm.renderHtml(templateIndex, res);
			$('.panel-body').html(userHtml);
		}, function(errMsg){
			_mm.errorTips();
		})
	},
	// 事件绑定
	bindEvent: function(){
		var _this = this;
		var validateResult;
		$(document).on('click', '.btn-submit', function(){
			var userInfo = {
				phone: $.trim($('#phone').val()),
				email: $.trim($('#email').val()),
				question: $.trim($('#question').val()),
				answer: $.trim($('#answer').val())
			},
			// 前端字段验证
			// 表单验证结果
			validateResult =  _this.validateForm(userInfo);
			// 如果前端验证成功
			if (validateResult.status) {
				console.log("表单前端验证成功,继续服务端验证...");
				// 提交数据到服务器
				_user.updateUserInfo(userInfo, function(res, msg){
					_mm.successTips(msg);
					window.location.href = './user-result.html?type=user-center-update'
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
}

// 函数的自执行
$(function(){
	page.init();
})