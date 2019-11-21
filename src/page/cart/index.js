'use strict'

require('./index.css');
require('@/common/header/index.js');
var nav = require('@/common/nav/index.js');
var _mm = require('util/mm.js');
var _cart = require('service/cart-service.js');
var templateIndex = require('./index.string');

var page = {
	myData: {
		//这个空myData不要删除
	},
	init: function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad: function(){
		this.loadCart();
	},
	bindEvent: function(){
		var _this = this;
		// 商品的选择 / 取消选择
		$(document).on('click', '.cart-select', function(){
			var $this = $(this),
				productId = $this.parents('.cart-table').data('product-id');
			// 选中
			if($this.is(':checked')){
				_cart.selectProduct(productId, function(res){
					// 如果成功
					_this.renderCart(res);
				}, function(errMsg){
					_this.showCartError();
				})
			}else{
				// 取消选中
				_cart.unselectProduct(productId, function(res){
					_this.renderCart(res);
				}, function(errMsg){
					_this.showCartError();
				})
			}
		})
		// =================
		// 商品的全选  / 取消全选功能
		$(document).on('click', '.cart-select-all', function(){
			var $this = $(this);
			// 全选
			if ($this.is(':checked')) {
				_cart.selectAllProduct(function(res){
					_this.renderCart(res);
				}, function(errMsg){
					
					_this.showCartError();
				})
			}else{
				// 取消全选
				_cart.unselectAllProduct(function(res){
					_this.renderCart(res);
				}, function(errMsg){
					_this.showCartError();
				})
			}
		})
		//================
		// 商品数量的变化
		$(document).on('click', '.count-btn', function(){
			var $this = $(this),
				$pCount = $this.siblings('.count-input'),
				currCount = parseInt($pCount.val()),
				type = $this.hasClass('plus') ? 'plus' : 'minus',
				productId = $this.parents('.cart-table').data('product-id'),
				minCount = 1,
				maxCount = $pCount.data('max'),
				newCount = 0;
			if (type === 'plus') {
				if (currCount >= maxCount) {
					_mm.errorTips('该商品数量已经达到上限!');
					return;
				}
				newCount = currCount + 1
			}else if (type === 'minus') {
				if (currCount <= minCount) {
					return;
				}
				newCount = currCount - 1
			}
			// =============
			// 更新购物车数量
			_cart.updateProduct({
				productId: productId,
				count: newCount
			}, function(res){
				_this.renderCart(res);
			}, function(errMsg){
				_this.showCartError();
			})
		})
		// ================
		// 删除单个商品
		$(document).on('click', '.cart-delete', function(){
			if (window.confirm('确认要删除该商品?')) {
				var productId = $(this).parents('.cart-table').data('product-id');
				_this.deleteCartProduct(productId);
			}
		})
		//================
		// 删除选中的商品
		$(document).on('click', '.delete-selected', function(){
			if (window.confirm('确认要删除该商品?')) {
				var arrProductIds = [],
					// 找到所有被勾选的勾选框，返回的是个数组
					$selectedItem = $('.cart-select:checked')
				// 循环查找选中的productIds
				for(var i = 0, iLength = $selectedItem.length; i < iLength; i++) {
					// 循环获取productId值，并将其存放在arrProductIds数组中
					arrProductIds.push($($selectedItem[i]).parents('.cart-table').data('product-id'))
				}
				if (arrProductIds.length) {
					// join是连接的意思。[1,2,3,4,5]    1,2,3,4,5
					_this.deleteCartProduct(arrProductIds.join(','));
				}else{
					_mm.errorTips('您还没有选中要删除的商品');
				}
			}
		})
		//================
		// 提交购物车
		$(document).on('click', '.btn-submit', function(){
			// 总价大于0，就可以进行提交
			if (_this.myData.carInfo && _this.myData.carInfo.cartTotalPrice > 0) {
				window.location.href = './order-confirm.html';
			}else{
				_mm.errorTips('请选择商品后再提交!');
			}
		})
	},
	// 加载购物车信息
	loadCart: function(){
		var _this = this;
		// 获取购物车列表
		_cart.getCarList(function(res){
			console.log(res)
			_this.renderCart(res);
		}, function(errMsg){
			_this.showCartError();
		})
	},
	// 渲染购物车
	renderCart: function(data){
		// 数据的判空
		this.filter(data);
		// 缓存购物车信息
		this.myData.carInfo = data;
		// 生成HTML结构
		var carHtml = _mm.renderHtml(templateIndex, data);
		// 把html结构挂载到容器中
		$('.page-wrap').html(carHtml);
		// 通知导航的购物车更新数量
		nav.loadCartCount();
	},
	// 数据匹配
	filter: function(data){
		// 临时在data中定义了一个notEmpty的属性
		data.notEmpty = !!data.cartProductVoList.length
	},
	// 显示错误信息
	showCartError: function(){
		$('.page-wrap').html('<p classs="err-tip">哪里不对了<p>');
	},
	// 删除购物车商品,支持批量删除
	// arrProductIds数组用逗号进行分割就会得到productIds
	deleteCartProduct: function(productIds){
		var _this = this;
		_cart.deleteProduct(productIds, function(res){
			_this.renderCart(res);
		}, function(errMsg){
			_this.showCartError();
		})
	}
}

$(function(){
	page.init();
})