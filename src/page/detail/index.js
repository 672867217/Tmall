'use strict'

require('./index.css');
require('@/common/nav/index.js');
require('@/common/header/index.js');
var _mm = require('util/mm.js');

var templateIndex = require('./index.string');
var _product = require('service/product-service.js');
var _cart = require('service/cart-service.js');

// page页面
var page = {
	data: {
		productId: _mm.getUrlParam('productId') || ''
	},
	init: function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad: function(){
		// 如果没有传productId，自动跳转回首页
		if (!this.data.productId) {
			_mm.goHome();
		}
		// 如果传了productId，加载商品详情页
		this.loadDetail();
	},
	bindEvent: function(){
		var _this = this;
		// 图片预览功能
		$(document).on('mouseenter', '.p-img-item', function(){
			var imageUrl = $(this).find('.p-img').attr('src')
			$('.main-img').attr('src', imageUrl)
		})
		// =============
		// count的操作
		$(document).on('click', '.p-count-btn', function(){
			var type = $(this).hasClass('plus') ? 'plus' : 'minus',
				$pCount = $('.p-count'),
				currCount = parseInt($pCount.val()),
				minCount = 1,
				maxCount = _this.data.detailInfo.stock || 1;
			if (type === 'plus') {
				$pCount.val(currCount < maxCount ? currCount + 1 : maxCount);
			}else if(type === 'minus'){
				$pCount.val(currCount > minCount ? currCount - 1 : minCount);
			}
		})
		// ==============
		// 加入购物车
		$(document).on('click', '.cart-add', function(){
			_cart.addToCart({
				productId : _this.data.productId,
				count : $('.p-count').val()
			}, function(res){
				window.location.href = './user-result.html?type=cart-add'
			}, function(errMsg){
				_mm.errorTips(errMsg);
			})
		})
	},
	// 加载商品的详细数据
	loadDetail: function(){
		var _this = this,
			html = '',
			$pageWrap = $('.page-wrap');
		$pageWrap.html('<div class="loading"></div>');	
		// 请求商品详情detail信息
		_product.getProductDetail(this.data.productId, function(res){
			console.log(res)
			// 数据的分割处理
			_this.filter(res);
			// 缓存一下res中的detail信息
			_this.data.detailInfo = res
			html = _mm.renderHtml(templateIndex, res);
			$pageWrap.html(html);
		}, function(errMsg){
			$pageWrap.html('<p class="err-tip">暂无商品详情</p>');	
		})
	},
	// 数据的分割处理
	filter: function(data){
		// 使用逗号分隔subImages，使之变成数组，并重新定义data下的subImages属性
		data.subImages = data.subImages.split(',');
	}
}

$(function() {
	page.init();
})