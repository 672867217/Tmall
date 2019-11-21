'use strict'

require('./index.css');
require('@/common/nav/index.js');
require('@/common/header/index.js');
var _mm = require('util/mm.js');

var _order = require('service/order-service.js');
var _address = require('service/address-service.js');
var templateAddress = require('./address-list.string');
var templateProduct = require('./product-list.string');
var addressModal = require('./address-modal.js');

var page = {
	data: {
		selectedAddressId : null
	},
	// 页面的初始化
	init: function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad: function(){
		// 加载地址列表
		this.loadAddressList();
		// 加载商品清单
		this.loadProductList();
	},
	// 事件绑定
	// 先记住id，然后在加载的时候把状态回填
	bindEvent: function(){
		var _this = this;
		// 地址的选择
		$(document).on('click', '.address-item', function(){
			// 被点击的item项需要添加新的样式：红色边框
			$(this).addClass('active').siblings('.address-item').removeClass('active');
			// 必须先选择地址，先获取到id值，然后才能点击【提交按钮】
			_this.data.selectedAddressId = $(this).data('id')
		})
		// 监听数据的改变
		$(document).on('click', '.order-submit', function(){
			// 如果没有选择地址，那么这个shippingId为null
			var shippingId = _this.data.selectedAddressId;
			// 如果地址已经选择成功
			if (shippingId) {
				_order.createOrder({
					shippingId: shippingId
				}, function(res){
					//console.log(res);
					window.location.href = './payment.html?orderNumber=' + res.orderNo;
				}, function(errMsg){
					_mm.errTips(errMsg);
				})
			}
		})
		// 地址的添加
		$(document).on('click', '.address-add', function(){
			addressModal.show({
				isUpdate: false,
				onSuccess: function(){
					// 添加成功的时候要及时加载地址列表
					_this.loadAddressList();
					// 重新加载商品清单以便刷新商品列表(避免长时间加载不出商品列表)
					_this.loadProductList();
				}
			})
		})
		// ===============
		// 地址的编辑
		$(document).on('click', '.address-update', function(e){
			// 阻止事件e冒泡(这个事件就不会在删除的时候冒泡上去取消后也选中成红色框)
			e.stopPropagation();
			var shippingId = $(this).parents('.address-item').data('id');
			_address.getAddress(shippingId, function(res){
				// 如果成功，则打开modal窗口
				addressModal.show({
					isUpdate: true,
					data: res,
					onSuccess: function(){
						_this.loadAddressList();
						// 重新加载商品清单以便刷新商品列表(避免长时间加载不出商品列表)
						_this.loadProductList();
					}
				})
			}, function(errMsg){
				// 如果失败，打印错误信息
				_mm.errorTips(errMsg);
			})
		})
		// ===============
		// 地址的删除
		$(document).on('click', '.address-delete', function(e){
			// 阻止事件e冒泡(这个事件就不会在删除的时候冒泡上去取消后也选中成红色框)
			e.stopPropagation();
			var shippingId = $(this).parents('.address-item').data('id');
			if (window.confirm('确定要删除这条地址信息吗?')) {
				_address.deleteAddress(shippingId, function(res){
					// 删除地址信息后及时刷新地址列表
					_this.loadAddressList();
					// 重新加载商品清单以便刷新商品列表(避免长时间加载不出商品列表)
					_this.loadProductList();
				}, function(errMsg){
					_mm.errorTips(errMsg);
				})
			}
		})
	},
	// 加载地址列表函数
	loadAddressList: function(){
		var _this = this;
		$('.address-con').html('<div class="loading"></div>');
		// 获取地址列表
		_address.getAddressList(function(res){
			//console.log(res)

			// 加载地址列表前先对地址做一个过滤，然后再去渲染
			_this.addressFilter(res);
			var addressListHtml = _mm.renderHtml(templateAddress, res);
			$('.address-con').html(addressListHtml);
		}, function(errMsg){
			$('.address-con').html('<p class="err-tip">地址加载失败，请刷新后重试</p>');
		})
	},
	// 加载商品清单函数
	loadProductList: function(){
		var _this = this;
		$('.product-con').html('<div class="loading"></div>');
		// 获取商品列表
		_order.getProductList(function(res){
			// console.log(res)

			var productListHtml = _mm.renderHtml(templateProduct, res);
			$('.product-con').html(productListHtml);
		}, function(errMsg){
			$('.product-con').html('<p class="err-tip">商品加载失败，请刷新后重试</p>');
		})
	},
	// 处理地址列表中的选中状态
	addressFilter: function(data){
		$('.product-con').html('<div class="loading"></div>');
		// 判断是否有选中的id，如果有才需要做下面的操作
		if (this.data.selectedAddressId) {
			var selectedAddressIdFlag = false;
			for (var i = 0, length = data.list.length; i < length; i++) {
				// 如果选中的地址被遍历到了
				if (data.list[i].id === this.data.selectedAddressId) {
					// 表示该地址需要被渲染成选中
					data.list[i].isActive = true;
					// 标志位也设置为true，表示要渲染成选中状态
					selectedAddressIdFlag = true;
				}
			}
			// 如果以前选中的地址已经不在列表中了，那么将其设置为没选中
			if (!selectedAddressIdFlag) {
				this.data.selectedAddressId = null;
			}
		}
	}
}

$(function(){
	page.init();
})
