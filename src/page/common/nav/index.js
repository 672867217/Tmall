'use strict'

require('./index.css');
var _mm = require('util/mm.js');
var _user = require('service/user-service.js');
var _cart = require('service/cart-service.js');

var nav = {
	// 初始化方法
	init: function(){
		this.bindEvent();
		this.loadUserInfo();
		this.loadCartCount();
		//返回nav对象本身，保证给module.exports的还是nav对象
		return this;
	},
	// 绑定事件的方法
	bindEvent: function(){
		// 点击登录按钮
		$('.js-login').click(function(){
			// 跳转到登录页
			_mm.doLogin();
		})
		// 点击注册按钮
		$('.js-register').click(function(){
			window.location.href = './user-register.html'
		})
		// 点击退出按钮(需要请求后端)
		$('.js-logout').click(function(){
			_user.logout(function(res){
				//刷新页面
				window.location.reload();
			}, function(errMsg){
				//错误提示
				_mm.errorTips(errMsg);
			});
		})
	},
	// 加载用户信息
	loadUserInfo: function(){
		_user.checkLogin(function(res){
			$('.user.not-login').hide().siblings('.user.login').show()
				.find('.username').text(res.username)
			//
		}, function(errMsg){
			//do nothing！
		});
	},
	// 加载购物车数量
	loadCartCount: function(){
		_cart.getCartCount(function(res){
			$('.nav .cart-count').text(res || 0);
		}, function(errMsg){
			// 如果出错，直接设置为0
			$('.nav .cart-count').text(0);
		});
	}
}

module.exports = nav.init();
