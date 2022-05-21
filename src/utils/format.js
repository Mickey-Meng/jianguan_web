/**
 * 处理单个数据空字段
 * @param {Object} data
 */
const handleNull = function(data) {
	for (let i in data) {
		if (data[i] == null) {
			data[i] == '--';
		}
	}
	return data;
}

/**
 * 处理列表数据空字段
 * @param {Object} list
 */
const handleListNull = function(list) {
	list.forEach(item => {
		item = handleNull(item);
	})
	return list;
}

/**
 * 适配下拉选择项
 * @param {Object} list
 * @param {Object} labelField
 * @param {Object} valueField
 */
const convertOptions = function(list, labelField, valueField) {
	let result = [];
	labelField = labelField || 'desc';
	valueField = valueField || 'code';
	list.forEach(item => {
		result.push({
			label: item[labelField],
			value: item[valueField],
		})
	});
	return result;
}

/**
 * 格式化时间
 * @param {Object} inputTime
 */
const formatDateTime = function(inputTime) {
	var date = inputTime ? new Date(inputTime) : new Date();
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + ' ' + h + ':' + minute + ':' + second;
}

/**
 * 格式化日期
 * @param {Object} inputTime
 */
const formatDate = function(inputTime) {
	var date = inputTime ? new Date(inputTime) : new Date();
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d;
}

/**
 * 获取页面参数
 * @param {Object} variable
 */
const getQueryVariable = function() {
	var query = window.location.hash.split('?')[1];
	var result={};
	if(query){
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			result[pair[0]]=decodeURIComponent(pair[1]);
		}
	}
	return result;
}

/**
 * 组装项目相关信息
 */
const createProjectInfo=function(list){
	let buildCompany='';
	let supervisionUnit='';
	list.forEach(item=>{
		if(item['typecode']=='sgdw'){
			buildCompany+=item['name']+'、'
		}
		if(item['typecode']=='jldw'){
			supervisionUnit+=item['name']+'、'
		}
	})
	return {
		buildCompany:buildCompany,
		supervisionUnit:supervisionUnit
	}
}
export {
	handleNull,
	handleListNull,
	convertOptions,
	formatDateTime,
	formatDate,
	getQueryVariable,
	createProjectInfo
}
