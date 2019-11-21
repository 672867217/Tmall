'use strict'

require('./index.css');
require('@/common/nav/index.js');
require('@/common/header/index.js');
var navSide = require('@/common/nav-side/index.js');
var _mm = require('util/mm.js');
var _order = require('service/order-service.js');
var templateIndex = require('./index.string');

var page = {
	data: {
		orderNumber: _mm.getUrlParam('orderNumber')
	},
	init: function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad: function(){
		// 初始化左侧菜单
		navSide.init({
			name: 'order-detail'
		});
		// 加载detail数据
		this.loadDetail();
	},
	// 加载数据
	loadDetail: function(){
		var _this = this,
			orderDetailHtml = '',
			$content = $('.content');
		$content.html('<div class="loading"></div>');
		//获取商品订单详情
		_order.getOrderDetail(this.data.orderNumber, function(res){
			console.log(res)
			// 信息的过滤
			_this.dataFilter(res);
			orderDetailHtml = _mm.renderHtml(templateIndex, res);
			$content.html(orderDetailHtml);
		}, function(errMsg){
			// 请求失败
			$content.html('<p class="err-tip">' + errMsg + '</p>');
		})
	},
	bindEvent: function(){
		var _this = this;
		$(document).on('click', '.order-cancel', function(){
			if (window.confirm('确实要取消订单吗?')) {
				_order.cancelOrder(_this.data.orderNumber, function(res){
					_mm.successTips('该订单取消成功!');
					// 重新加载订单信息,更新状态
					_this.loadDetail();
				}, function(errMsg){
					_mm.errorTips(errMsg);
				});
			}
		})
	},
	// 数据的适配
	dataFilter: function(data){
		data.needPay = data.status == 10;
		data.isCancleable = data.status == 10;
	}
}

$(function(){
	page.init();
})