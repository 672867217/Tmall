'use strict'

require('./index.css');
var _mm = require('util/mm.js');
var templatePagination = require('./index.string');

var Pagination = function(){
	var _this = this;
	this.defaultOption = {
		container : null,
		pageNum: 1, // 当前是第几页
		pageRange: 4, // 显示几个页码按钮
		onSelectPage: null
	}
	// 事件的处理
	$(document).on('click', '.pg-item', function(){
		var $this = $(this);
		// 对于active和disabled按钮点击不做处理
		if ($this.hasClass('active') || $this.hasClass('disabled')) {
			return
		}
		typeof _this.option.onSelectPage === 'function' 
			? _this.option.onSelectPage($this.data('value')) : null;

	})
}
Pagination.prototype.render = function(userOption){
	// 合并选项
	// 判断容器是否是合法的jQuery对象	
	this.option = $.extend({}, this.defaultOption, userOption);
	if(!(this.option.container instanceof jQuery)){
		return;
	}
	// 判断是否只有一页，只有一页的情况就不用显示分页效果
	if (this.option.pages <= 1) {
		return;
	}
	// 渲染分页内容
	this.option.container.html(this.getPaginationHtml());
}
Pagination.prototype.getPaginationHtml = function(){
	// 获取分页的html
	var html = '',
		option = this.option,
		pageArray = [],
		// 当前在第10页   10-4=6  6  7  8  9
		start = (option.pageNum - option.pageRange > 0) ? (option.pageNum - option.pageRange) : 1,
		// 10+4=14   假设一共是20页 pages === 20
		end = (option.pageNum + option.pageRange < option.pages) ? (option.pageNum + option.pageRange) :
			option.pages;
	// 上一页按钮的数据
	pageArray.push({
		name: '上一页',
		value: this.option.prePage,
		// 如果当前页有【上一页】那么disabled就是false
		disabled: !this.option.hasPreviousPage
	});

	// 数字按钮的处理  1  2  3
	for (var i = start; i <= end; i++) {
		pageArray.push({
			name: i,
			value: i,
			active: (i === option.pageNum)
		})
	}
	// 下一页按钮的数据
	pageArray.push({
		name: '下一页',
		value: this.option.nextPage,
		// 如果当前页有【下一页】那么disabled就是false
		disabled: !this.option.hasNextPage
	});
	// 开始渲染
	html = _mm.renderHtml(templatePagination, {
		// 其中的属性会在模板文件中的{{}}内使用
		pageArray: pageArray,
		pageNum: option.pageNum,
		pages: option.pages
	})
	// 返回html结构
	return html;
}

module.exports = Pagination;
