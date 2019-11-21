'use strict'
var Hogan = require('hogan.js');

var conf = {
	serverHost : ''
}
//$ <==> jquery  这里的ajax方法是jquery自带的方法
var _mm = {
	// 数据请求的方法
	request : function(param){
		// 保存this,防止this指针指向不明
		var _this = this;
		$.ajax({
			type : param.method || 'get',
			url  : param.url || '',
			dataType : param.type || 'json',
			data: param.data || '',
			// 请求成功  返回的状态码200
			success : function(res){
				// 请求成功
				if (0 === res.status) {
					typeof param.success === 'function' && param.success(res.data, res.msg);
				}else if (10 === res.status) {
					// 没有登录状态，统一去登录
					_this.doLogin();
				}else if (1 === res.status) {
					// 报错
					typeof param.error === 'function' && param.error(res.msg);
				}
			},
			// 返回404  503
			error : function(err){
			   typeof param.error === 'function' && param.error(err.statusText);
			}
		});
	},
	// 统一跳转到登录页面
	// encodeURIComponent函数做了编码处理，解码的时候用decodeURIComponent
	doLogin: function(){
		window.location.href = './user-login.html?redirect=' + 
		encodeURIComponent(window.location.href);
	},
	// 获取服务器地址
	getServerUrl: function(path){
		return conf.serverHost + path;
	},
	// 获取url参数
	// www.baidu.com/product/list?keyword=xxx&&page=1
	// 在上面的URL地址中获取xxx或者数字1
	getUrlParam: function(name){
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
		var result = window.location.search.substr(1).match(reg);
		//decodeURIComponent对encodeURIComponent编码的字符串进行解码
		return result ? decodeURIComponent(result[2]) : null;
	},
	// 渲染HTML模板函数
	renderHtml: function(htmlTemplate, data){
		//Hogan编译模板
		var template = Hogan.compile(htmlTemplate);
		//Hogan渲染模板
		var result = template.render(data);
		// 将渲染的结果对象返回
		return result;
	},
	// 成功提示
	successTips: function(msg){
		alert(msg || '操作成功');
	},
	// 错误提示
	errorTips: function(msg){
		alert(msg || '哪里不对了!');
	},
	// 【前端】字段的验证，支持非空，邮箱、手机的判断
	validate: function(value, type){
		var value = $.trim(value);
		// 非空验证
		// 比如：密码提示的问题不能为空
		if ('require' === type) {
			// 将value值强转成Boolean类型的数据
			return !!value;
		}
		// 手机号验证
		if ('phone' === type) {
			return /^1\d{10}$/.test(value);
		}
		// 邮箱格式验证
		if ('email' === type) {
			return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
		}
	},
	// 跳回主页
	goHome: function(){
		window.location.href = './index.html';
	}
};
module.exports = _mm;













