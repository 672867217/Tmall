'use strict'

var _mm = require('util/mm.js');

var product = {
	// 1、获取商品列表
	getProductList: function(listParam, resolve, reject){
		_mm.request({
			// 获取商品列表
			url: _mm.getServerUrl('/product/list.do'),
			data: listParam,
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 2、获取商品详情信息
	getProductDetail: function(productId, resolve, reject){
		_mm.request({
			// 获取商品列表
			url: _mm.getServerUrl('/product/detail.do'),
			data: {
				productId : productId
			},
			method: 'POST',
			success: resolve,
			error: reject
		})
	}
}

module.exports = product;