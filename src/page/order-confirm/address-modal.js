'use strict'

var _mm = require('util/mm.js');
var _address = require('service/address-service.js');
var templateAddressModal = require('./address-modal.string');
var _cities = require('util/cities/index.js');

var addressModal = {
	//显示函数
	show: function(option){
		//option的绑定
		this.option = option;
		this.option.data = option.data || {};
		this.$modalWrap = $('.modal-wrap');
		// 渲染页面
		this.loadModal();
		// 绑定事件
		this.bindEvent();
	},
	// 关闭弹窗
	hide: function(){
		this.$modalWrap.empty();
	},
	// 加载模型
	loadModal: function(){
		var addressModalHtml = _mm.renderHtml(templateAddressModal, {
			isUpdate: this.option.isUpdate,
			data: this.option.data
		})
		this.$modalWrap.html(addressModalHtml)
		// 加载省份信息
		this.loadProvince();
	},
	// 事件绑定
	bindEvent: function(){
		var _this = this
		// 省份和城市的二级联动
		this.$modalWrap.find('#receiver-province').change(function(){
			var selectedProvince = $(this).val();
			_this.loadCities(selectedProvince);
		})

		// 提交收货地址
		this.$modalWrap.find('.address-btn').click(function(){
			// 获取用户地址信息
			var receiverInfo = _this.getReceiverInfo(),
				isUpdate = _this.option.isUpdate;
			// 使用新地址，且验证通过
			if (!isUpdate && receiverInfo.status) {
				_address.save(receiverInfo.data, function(res){
					_mm.successTips('地址添加成功');
					//隐藏窗口
					_this.hide();
					typeof _this.option.onSuccess === 'function' &&
						_this.option.onSuccess(res)
				}, function(errMsg){
					_mm.errorTips(errMsg);
				})
				// 如果是更新地址，且验证通过
			}else if (isUpdate && receiverInfo.status) {
				_address.update(receiverInfo.data, function(res){
					_mm.successTips('地址修改成功');
					//隐藏窗口
					_this.hide();
					typeof _this.option.onSuccess === 'function' &&
						_this.option.onSuccess(res)
				}, function(errMsg){
					_mm.errorTips(errMsg);
				})
			}else{
				// 验证不通过
				_mm.errorTips(receiverInfo.errMsg || '好像哪里不对了!')
			}
		})
		// ==============
		// 为了保证点击modal内容区的时候不关闭弹窗
		this.$modalWrap.find('.modal-container').click(function(e){
			// 阻止冒泡
			e.stopPropagation();
		})
		// 点击叉号❎或者蒙版区域，关闭弹窗
		this.$modalWrap.find('.close').click(function(){
			//隐藏窗口
			_this.hide();
		})
	},
	// 加载省份信息
	loadProvince: function(){
		var provinces = _cities.getProvinces() || [],
			$provinceSelect = this.$modalWrap.find('#receiver-province');
		$provinceSelect.html(this.getSelectOption(provinces))

		// 如果是更新地址，并且有省份信息，那么需要做【省份】的回填
		if (this.option.isUpdate && this.option.data.receiverProvince) {
			$provinceSelect.val(this.option.data.receiverProvince);
			// 加载城市
			this.loadCities(this.option.data.receiverProvince);
		}
	},
	// 获取select框的option选项，输入Array，得到HTML
	getSelectOption: function(optionArray){
		var html = '<option>请选择</option>';
		for (var i = 0, length = optionArray.length; i < length; i++) {
			html += '<option value="' + optionArray[i] + '">' + optionArray[i] + '</option>'
		}
		return html;
	},
	// 加载城市信息
	loadCities: function(provinceName){
		var cities = _cities.getCities(provinceName) || [],
			$citySelect = this.$modalWrap.find('#receiver-city');
		//console.log(cities.length)
		$citySelect.html(this.getSelectOption(cities));
		//console.log($citySelect)
		// 如果是更新地址，并且有城市信息，那么需要做【城市的回填】
		if (this.option.isUpdate && this.option.data.receiverCity) {
			$citySelect.val(this.option.data.receiverCity)
		}
	},
	// 得到用户信息
	getReceiverInfo: function(){
		var receiverInfo = {},
			result = {
				status: false
			};
		//trim目的是处理掉空格，选择框不需要trim，输入框需要加trim
		receiverInfo.receiverName = $.trim(this.$modalWrap.find('#receiver-name').val())
		receiverInfo.receiverProvince = this.$modalWrap.find('#receiver-province').val()
		receiverInfo.receiverCity = this.$modalWrap.find('#receiver-city').val()
		receiverInfo.receiverAddress = $.trim(this.$modalWrap.find('#receiver-address').val())
		receiverInfo.receiverPhone = $.trim(this.$modalWrap.find('#receiver-phone').val())
		receiverInfo.receiverZip = $.trim(this.$modalWrap.find('#receiver-zip').val())
		
		// 如果是更新地址，则必须要有个id
		if (this.option.isUpdate) {
			receiverInfo.id = this.$modalWrap.find('#receiver-id').val();
		}
		//验证
		if (!receiverInfo.receiverName) {
			result.errMsg = '请输入收件人姓名:'
		}else if (!receiverInfo.receiverProvince) {
			result.errMsg = '请输入收件人所在省份:'
		}else if (!receiverInfo.receiverCity) {
			result.errMsg = '请输入收件人所在城市:'
		}else if (!receiverInfo.receiverAddress) {
			result.errMsg = '请输入收件人详细地址:'
		}else if (!receiverInfo.receiverPhone) {
			result.errMsg = '请输入收件人电话号码:'
			//【注意】邮政编码不能大于6位数
		}else if (receiverInfo.receiverZip.length !== 6) {
			result.errMsg = '请输入6位数字的邮政编码:'
		}else{
			result.status = true;
			// 数据封存到data中
			result.data = receiverInfo;
		}
		return result;
	}
}

module.exports = addressModal;
