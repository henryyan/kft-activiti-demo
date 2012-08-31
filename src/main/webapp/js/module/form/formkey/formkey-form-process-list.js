/**
 * 动态表单Javascript，负责读取表单元素、启动流程
 */
$(function() {
	$('.startup-process').button({
		icons: {
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
		modal: true,
		width: $.common.window.getClientWidth() * 0.8,
		height: $.common.window.getClientHeight() * 0.9,
		open: function() {
			// 获取json格式的表单数据，就是流程定义中的所有field
			var processDefinitionId = $ele.parents('tr').find('.process-id').text();
			readForm.call(this, processDefinitionId);
		},
		buttons: [{
			text: '启动流程',
			click: sendStartupRequest
		}]
	});
}

/**
 * 读取流程启动表单
 */
function readForm(processDefinitionId) {
	var dialog = this;

	// 读取启动时的表单
	$.get(ctx + '/form/formkey/get-form/start/' + processDefinitionId, function(form) {
		// 获取的form是字符行，html格式直接显示在对话框内就可以了，然后用form包裹起来
		$(dialog).html(form).wrap("<form class='formkey-form' method='post' />");

		var $form = $('.formkey-form');

		// 设置表单action
		$form.attr('action', ctx + '/form/formkey/start-process/' + processDefinitionId);

		// 初始化日期组件
		$form.find('.datetime').datetimepicker({
	            stepMinute: 5
	        });
		$form.find('.date').datepicker();
		
		// 表单验证
		$form.validate($.extend({}, $.common.plugin.validator));
	});
}

/**
 * 提交表单
 * @return {[type]} [description]
 */
function sendStartupRequest() {
	if ($(".formkey-form").valid()) {
		$('.formkey-form').submit();
	}
}