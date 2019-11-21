'use strict'

require('./index.css');
require('../common/nav-simple/index.js');
var _mm = require('util/mm.js');

$(function(){
	// 通过浏览器地址栏获取参数，然后拼接成class，再把class选择器丢进
	// $()里面进行元素标签选择，结果是一个【jQuery对象】
	var type = _mm.getUrlParam('type') || 'default',
		$element = $('.' + type + '-success');
	// 显示对应的提示元素
	$element.show();
})