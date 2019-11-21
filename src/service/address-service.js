'use strict'

var _mm = require('util/mm.js');

var _address = {
	// 1、获取地址列表
	getAddressList: function(resolve, reject){
		_mm.request({
			url: _mm.getServerUrl('/shipping/list.do'),
			data: {
				pageSize: 15
			},
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 2、新建收件人地址
	save: function(addressInfo, resolve, reject){
		_mm.request({
			url: _mm.getServerUrl('/shipping/add.do'),
			data: addressInfo,
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 3、更新收件人地址
	update: function(addressInfo, resolve, reject){
		_mm.request({
			url: _mm.getServerUrl('/shipping/update.do'),
			data: addressInfo,
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 4、获取单条收件人地址信息
	getAddress: function(shippingId, resolve, reject){
		_mm.request({
			url: _mm.getServerUrl('/shipping/select.do'),
			data: {
				shippingId: shippingId
			},
			method: 'POST',
			success: resolve,
			error: reject
		})
	},
	// 5、删除单条收件人地址信息
	deleteAddress: function(shippingId, resolve, reject){
		_mm.request({
			url: _mm.getServerUrl('/shipping/del.do'),
			data: {
				shippingId: shippingId
			},
			method: 'POST',
			success: resolve,
			error: reject
		})
	}
}

module.exports = _address;