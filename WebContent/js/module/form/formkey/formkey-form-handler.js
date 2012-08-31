/**
 * 动态Form办理功能
 */
$(function() {
	
	$('.handle').click(handle);
	
});

/**
 * 打开办理对话框
 */
function handle() {
	var $ele = $(this);
	
	// 当前节点的英文名称
	var tkey = $(this).attr('tkey');
	
	// 当前节点的中文名称
	var tname = $(this).attr('tname');
	
	// 任务ID
	var taskId = $(this).attr('tid');
	
	$('#handleTemplate').html('').dialog({
		modal: true,
		width: $.common.window.getClientWidth() * 0.8,
		height: $.common.window.getClientHeight() * 0.9,
		title: '办理任务[' + tname + ']',
		open: function() {
			readForm.call(this, taskId);
		},
		buttons: [{
			text: '提交',
			click: function() {
				$('.formkey-form').submit();
			}
		}, {
			text: '关闭',
			click: function() {
				$(this).dialog('close');
			}
		}]
	});
}


/**
 * 读取任务表单
 */
function readForm(taskId) {
	var dialog = this;

	// 读取启动时的表单
	$.get(ctx + '/form/formkey/get-form/task/' + taskId, function(form) {
		// 获取的form是字符行，html格式直接显示在对话框内就可以了，然后用form包裹起来
		$(dialog).html(form).wrap("<form class='formkey-form' method='post' />");

		var $form = $('.formkey-form');

		// 设置表单action
		$form.attr('action', ctx + '/form/formkey/task/complete/' + taskId);

		// 初始化日期组件
		$form.find('.datetime').datetimepicker({
	            stepMinute: 5
	        });
		$form.find('.date').datepicker();
		
		// 表单验证
		$form.validate($.extend({}, $.common.plugin.validator));
	});
}