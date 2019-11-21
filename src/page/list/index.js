require('./index.css');
require('@/common/nav/index.js');
require('@/common/header/index.js');
var _mm = require('util/mm.js');

var templateIndex = require('./index.string');
var _product = require('service/product-service.js');
var Pagination = require('util/pagination/index.js');


var page = {
	data: {
		listParam: {
			keyword: _mm.getUrlParam('keyword') || '',
			categoryId: _mm.getUrlParam('categoryId') || '',
			orderBy: _mm.getUrlParam('orderBy') || 'default',
			pageNum: _mm.getUrlParam('pageNum') || 1, //当前在第几页，默认是1
			pageSize: _mm.getUrlParam('pageSize') || 5 // 每页显示5条数据
		}
	},
	// 初始化
	init: function(){
		this.onLoad();
		this.bindEvent();
	},
	// 加载数据
	onLoad: function(){
		//首次加载列表
		this.loadList();
	},
	// 事件绑定
	bindEvent: function(){
		var _this = this
		// 如果点击的是默认排序
		$('.sort-item').click(function(){
			// 缓存变量
			var $this = $(this);
			// 每次点击之后，都应该将页数初始化为1
			_this.data.listParam.pageNum = 1;
			// 点击默认排序
			if ($this.data('type') === 'default') {
				// 已经是active样式
				if ($this.hasClass('active')) {
					return;
				}else{
					$this.addClass('active').siblings('.sort-item').removeClass('active asc desc');
					_this.data.listParam.orderBy = 'default';
				}
				// 如果点击的是价格排序
			}else if ($this.data('type') === 'price') {
				$this.addClass('active');
				// 升序和降序的处理
				if (!$this.hasClass('asc')) {
					$this.addClass('active').siblings('.sort-item')
						.removeClass('active asc desc');
					$this.addClass('asc').removeClass('desc');
					// 价格升序
					_this.data.listParam.orderBy = 'price_asc';
				}else{
					$this.addClass('desc').removeClass('asc');
					// 价格降序
					_this.data.listParam.orderBy = 'price_desc';
				}
			}
			// 如果有排序的选择，然后再次重新加载列表
			_this.loadList();
		})
	},
	// 加载list数据
	loadList: function(){
		var _this = this,
		listhtml = '',
		listParam = this.data.listParam,
		$pListCon = $('.p-list-con'); // 找到容器
		$pListCon.html('<div class="loading"></div>');

		//因为keyword和categoryId是共存的，但是我们只需要一个即可
		// 删除参数中不必要的字段
		// delete关键字需要在【非严格模式】下执行，严格模式下报错
		listParam.categoryId ? (delete listParam.keyword) : (delete listParam.categoryId);

		// 请求接口   其中res是服务器响应给我们的信息对象
		_product.getProductList(listParam, function(res){
			// 数组长度为5
			console.log(res.list) 
			//console.log(res.list.length) 
			// 先对数据进行处理，然后再进行渲染
			// 对不同的Bug的处理分开在两个循环中执行，避免数组长度变化带来的循环次数的问题
			// 这体现了“高内聚，低耦合”的编程思想
			for(var i = 0; i < res.list.length; i++){
				// 添加正则表达式，对非图片后缀的脏数据进行删除
				// 如果mainImage的值为空，那么也将无法匹配成功，也会被删除
				// 所以下面的正则处理也可以解决mainImage为空的情况
				if (!(/\.(gif|png|jpg|jpeg).??.*$/.test(res.list[i].mainImage))){
					// 不建议采取暴力删除的方式进行处理
					//res.list.splice(i, 1);
					res.list[i].mainImage = "3701d6e4-ef69-498e-842f-853facb41224.jpeg";
				}
			}
			// 如果采用暴力删除的方式进行处理，那么当数组元素被部分删除之后，数组长度变成了4
			// 如果继续循环5次的话，会因为有一个空元素而导致数组元素的访问越界
			// 从而报mainImage属性找不到的错误❌，所以分开在两个循环中去做不同的处理
			// 即便不采用暴力删除的方式进行处理，为了降低代码的耦合度，也最好分开处理
			//console.log(res.list.length)
			for(var i = 0; i < res.list.length; i++){
				// 0  1  2  3  4   
				// 0  1  3  4
				// 对所有的mainImage的字符串进行左斜杠的分割，结果一定是个数组
				// 如果这个数组的长度为1，则表示是正常的图片名称；如果数组长度大于1，则说明带/
				// 如果mainImage的字符串中含有/，那么我们如下处理一下，比如：
				// mainImage: "http://img.happymmall.com/1bc8b355-a937-4227-8921-e13ae2c2198a.jpg"
				var resultArr = res.list[i].mainImage.split('/')
				// 如果数组的长度不为1，则表示是不正常的mainImage(带左斜杠/)
				if (resultArr.length > 1) {
					// 那么就取最后一个目标数组元素，并且用它重新定义mainImage
					res.list[i].mainImage = resultArr[resultArr.length - 1]
				}
			}
			// 默认加载分页信息
			_this.loadPagination({
				hasPreviousPage : res.hasPreviousPage,
				prePage : res.prePage,
				hasNextPage : res.hasNextPage,
				nextPage : res.nextPage,
				pageNum : res.pageNum,
				pages : res.pages
			})
			//================
			// 渲染页面
			listhtml = _mm.renderHtml(templateIndex, {
				list: res.list
			});
			// 等加载完毕的时候，覆盖掉
			$pListCon.html(listhtml);
		}, function(errMsg){
			_mm.errorTips(errMsg);
		});
	},
	// 加载分页信息
	loadPagination: function(pageInfo){
		var _this = this;
		this.pagination ? '' : (this.pagination = new Pagination());
		this.pagination.render($.extend({}, pageInfo, {
			container: $('.pagination'),
			// 监听到有选择页面以后才执行
			onSelectPage: function(pageNum){
				_this.data.listParam.pageNum = pageNum;
				// 再次加载相应的页面
				_this.loadList();
			}
		}))
	}
}

$(function(){
	page.init();
})