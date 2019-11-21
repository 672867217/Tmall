var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
var str = new Buffer('aHR0cDovL3Rlc3QuaGFwcHltbWFsbC5jb20v', 'base64');
var getHtmlConfig = function(name,title)
{
	return{
		template:'./src/view/'+ name +'.html',
		filename:'view/'+name+'.html',
		inject:true,
		title:title,
		hash:true,
		chunks:['common',name]
	}
};
var config = {
	entry:{
		'index':'./src/page/index/index.js',
		'list':'./src/page/list/index.js',
		'user-login':'./src/page/user-login/index.js',
		'common':['./src/page/common/index.js'],
		'user-result':'./src/page/user-result/index.js',
		'user-center':'./src/page/user-center/index.js',
		'user-center-update':'./src/page/user-center-update/index.js',
		'user-register':'./src/page/user-register/index.js',
		'user-pass-update':'./src/page/user-pass-update/index.js',
		'user-pass-reset':'./src/page/user-pass-reset/index.js',
		'detail':'./src/page/detail/index.js',
		'cart':'./src/page/cart/index.js',
		'order-confirm': './src/page/order-confirm/index.js',
		'payment': './src/page/payment/index.js',
		'order-list': './src/page/order-list/index.js',
		'order-detail': './src/page/order-detail/index.js',
	},
	output:{
		path: path.resolve(__dirname,'dist'),
		publicPath:'/dist',
		filename:'js/[name].js'
	},
	externals:
	{
		'jquery' : 'window.jquery'
	},
	/*optimization:{
		//抽取公共模块的对象
		splitChunks:{
			//缓存组
			cacheGroups:{
				//表示公共的模块
				commons:
				{
					name:'base',
					chunks:"initial",
					//最小两个文件有公共内容才提取
					minChunks:2,
					minSize:0
				}
			}
		}
	},*/
	module:{
		rules:[
			{
				test:/\.css$/,
				loader:ExtractTextPlugin.extract({
					fallback:"style-loader",
					use:"css-loader"
				})
			},
			{
				test:/\.(gif|png|jpg|woff|svg|eot|ttf).??.*$/,
				loader:"url-loader?limit=100&name=resource/[name].[ext]"
			},
			{
				test:/\.string$/,
				loader:"html-loader"
			}
		]
	},
	plugins:[
		new ExtractTextPlugin("css/[name].css"),
		new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
		new HtmlWebpackPlugin(getHtmlConfig('list','商品展示')),
		new HtmlWebpackPlugin(getHtmlConfig('user-login','用户登录')),
		new HtmlWebpackPlugin(getHtmlConfig('user-result','操作结果')),
		new HtmlWebpackPlugin(getHtmlConfig('user-center','个人中心')),
		new HtmlWebpackPlugin(getHtmlConfig('user-center-update','修改个人信息')),
		new HtmlWebpackPlugin(getHtmlConfig('user-register','用户注册')),
		new HtmlWebpackPlugin(getHtmlConfig('user-pass-update','修改密码')),
		new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset','找回密码')),
		new HtmlWebpackPlugin(getHtmlConfig('detail','商品详情')),
		new HtmlWebpackPlugin(getHtmlConfig('cart','购物车')),
		new HtmlWebpackPlugin(getHtmlConfig('order-confirm', '订单确认')),
		new HtmlWebpackPlugin(getHtmlConfig('payment', '支付页面')),
		new HtmlWebpackPlugin(getHtmlConfig('order-list', '订单列表')),
		new HtmlWebpackPlugin(getHtmlConfig('order-detail', '订单详情'))
	],
	resolve:{
		alias:{
			util : path.resolve(__dirname , 'src/util') ,
			service : path.resolve(__dirname , 'src/service') ,
			'@': path.resolve(__dirname , 'src/page') ,
			node_modules : path.resolve(__dirname , 'node_modules') 
		}
	},
	devServer:{
		port : 8088,
		inline : true,
		//配置代理实现跨域
		//当访问local host：8088/**/*.do的时候就跳转到
		//【网络接口】+**/*.do
		proxy : {
			"**/*.do" :{
				target : str.toString(),
				changeOrigin : true
			}
		}
	}
}
if('dev' === WEBPACK_ENV)
{
	config.entry.common.push('webpack-dev-server/client?http://localhost:8080');
}
module.exports = config;