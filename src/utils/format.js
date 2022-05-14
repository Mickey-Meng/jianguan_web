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

export {
	handleNull,
	handleListNull,
	convertOptions
}
