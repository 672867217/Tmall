'use strict'

var _mm = require('util/mm.js');

var _cart = {
	// 1、登出
	getCartCount: function (resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/get_cart_product_count.do'),
			// 如果没有指定POST,则默认使用GET的请求方式
			success: resolve,
			error: reject
		})
	},
	// 2、添加商品到购物车
	addToCart: function (productInfo, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/add.do'),
			data: productInfo,
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 3、获取购物车列表
	getCarList: function (resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/list.do'),
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 4、选择购物车商品
	selectProduct: function (productId, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/select.do'),
			data: {
				productId: productId
			},
			success: resolve,
			error: reject
		})
	},
	// 5、取消选择购物车商品
	unselectProduct: function (productId, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/un_select.do'),
			data: {
				productId: productId
			},
			success: resolve,
			error: reject
		})
	},
	// 6、选中购物车全部商品
	selectAllProduct: function (resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/select_all.do'),
			success: resolve,
			error: reject
		})
	},
	// 7、取消选中购物车全部商品
	unselectAllProduct: function (resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/un_select_all.do'),
			success: resolve,
			error: reject
		})
	},
	// 8、更新购物车商品数量
	updateProduct: function (productInfo, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/update.do'),
			data: productInfo,
			success: resolve,
			error: reject
		})
	},
	// 9、删除指定商品
	deleteProduct: function (productIds, resolve, reject) {
		_mm.request({
			url: _mm.getServerUrl('/cart/delete_product.do'),
			data: {
				productIds: productIds
			},
			success: resolve,
			error: reject
		})
	}
}

module.exports = _cart;