'use strict'

require('./index.css');

var _mm = require('util/mm.js');
var templateIndex = require('./index.string');

// 侧边导航
var navSide = {
	option: {
		name: '',
		// 待动态渲染的项
		navList: [
			{
				name: 'user-center',
				desc: '个人中心',
				href: './user-center.html'
			},
			{
				name: 'order-list',
				desc: '我的订单',
				href: './order-list.html'
			},
			{
				name: 'user-pass-update',
				desc: '修改密码',
				href: './user-pass-update.html'
			},
			{
				name: 'about',
				desc: '关于TMALL',
				href: './about.html'
			}
		]
	},
	// 初始化方法
	init: function(option){
		$.extend(this.option, option);
		// 开始渲染
		this.renderNav();
	},
	// 渲染导航菜单(要判断哪一项是active的)
	renderNav: function(){
		for (var i = 0, iLength = this.option.navList.length; i < iLength; i++) {
			if (this.option.navList[i].name === this.option.name) {
				//临时添加isActive属性
				this.option.navList[i].isActive = true;
			}
		}
		// 渲染list数据
		var navHtml = _mm.renderHtml(templateIndex, {
			navList: this.option.navList
		})
		// 把渲染出的HTML结构放到ul标签下
		$('.nav-side').html(navHtml);
	}
}

module.exports = navSide;
