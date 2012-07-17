/**
 * 动态表单Javascript，负责读取表单元素、启动流程
 */
$(function() {
	$('.startup-process').button({
		icons : {
			primary: 'ui-icon-play'
		}
	}).click(showStartupProcessDialog);
});

/**
 * 打开启动流程
 */
function showStartupProcessDialog() {
	var $ele = $(this);
	$('<div/>', {
		'class': 'dynamic-form-dialog',
		title: '启动流程[' + $ele.parents('tr').find('.process-name').text() + ']',
		html: '<span class="ui-loading">正在读取表单……</span>'
	}).dialog({
		model: true,
		width: $.common.window.getClientWidth(),
		height: $.common.window.getClientHeight(),
		open: function() {
			// 获取json格式的表单数据，就是流程定义中的所有field
			readFormFields.call(this, $ele.parents('tr').find('.process-id').text());
		},
		buttons: [{
			text: '启动流程',
			click: sendStartupRequest
		}]
	});
}

/**
 * 读取表单字段
 */
function readFormFields(processDefinitionId) {
	var dialog = this;
	
	// 清空对话框内容
	$('.dynamic-form-dialog').html("<form class='dynamic-form'><table class='dynamic-form-table'></table></form>");
	
	$.getJSON(ctx + '/form/dynamic/get-start-form-field/' + processDefinitionId, function(form) {
		var trs = "";
		$.each(form.formProperties, function() {
			trs += createFieldHtml(this);
		});
		$('.dynamic-form-table').html(trs);
	});
}

var formFieldCreator = {
	string: function(prop) {
		var result = "<labe>" + prop.name + "：<input type='text' id='" + prop.id + "' name='" + prop.id + "' /></label>";
		if (prop.required === false) {
			result += "<span style='color:red'>*</span>";
		}
		return result;
	}
};

/**
 * 生成一个field的html代码
 */
function createFieldHtml(prop) {
	return formFieldCreator[prop.type.name](prop);
}

/**
 * 发送启动流程请求
 */
function sendStartupRequest() {
	
}