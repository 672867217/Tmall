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
	},
	onLoad: function(){
		//初始化左侧菜单
		navSide.init({
			name: 'use-center'
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
	}
}

$(function(){
	page.init();
})
