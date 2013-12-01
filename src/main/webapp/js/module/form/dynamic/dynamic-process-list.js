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
		width: 400,
		height: $.common.window.getClientHeight() / 2,
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
	$('.dynamic-form-dialog').html("<form class='dynamic-form' method='post'><table class='dynamic-form-table'></table></form>");
	var $form = $('.dynamic-form');

	// 设置表单提交id
	$form.attr('action', ctx + '/form/dynamic/start-process/' + processDefinitionId);

    // 添加隐藏域
    if ($('#processType').length == 0) {
        $('<input/>', {
            'id': 'processType',
            'name': 'processType',
            'type': 'hidden'
        }).val(processType).appendTo($form);
    }

	// 读取启动时的表单
	$.getJSON(ctx + '/form/dynamic/get-form/start/' + processDefinitionId, function(data) {
		var trs = "";
		$.each(data.form.formProperties, function() {
			var className = this.required === true ? "required" : "";
			trs += "<tr>" + createFieldHtml(data, this, className)
			if(this.required === true) {
				trs += "<span style='color:red'>*</span>";
			}
			trs += "</td></tr>";
		});

		// 添加table内容
		$('.dynamic-form-table').html(trs).find('tr').hover(function() {
			$(this).addClass('ui-state-hover');
		}, function() {
			$(this).removeClass('ui-state-hover');
		});

		// 初始化日期组件
		$form.find('.dateISO').datepicker();

		// 表单验证
		$form.validate($.extend({}, $.common.plugin.validator));
	});
}

/**
 * form对应的string/date/long/enum/boolean类型表单组件生成器
 * fp_的意思是form paremeter
 */
var formFieldCreator = {
	string: function(formData, prop, className) {
		var result = "<td width='120'>" + prop.name + "：</td><td><input type='text' id='" + prop.id + "' name='fp_" + prop.id + "' class='" + className + "' />";
		return result;
	},
	date: function(formData, prop, className) {
		var result = "<td>" + prop.name + "：</td><td><input type='text' id='" + prop.id + "' name='fp_" + prop.id + "' class='dateISO " + className + "' />";
		return result;
	},
	'enum': function(formData, prop, className) {
		console.log(prop);
		var result = "<td width='120'>" + prop.name + "：</td>";
		if(prop.writable === true) {
			result += "<td><select id='" + prop.id + "' name='fp_" + prop.id + "' class='" + className + "'>";
			//result += "<option>" + datas + "</option>";
			
			$.each(formData['enum_' + prop.id], function(k, v) {
				result += "<option value='" + k + "'>" + v + "</option>";
			});
			 
			result += "</select>";
		} else {
			result += "<td>" + prop.value;
		}
		return result;
	},
	'users': function(formData, prop, className) {
		var result = "<td width='120'>" + prop.name + "：</td><td><input type='text' id='" + prop.id + "' name='fp_" + prop.id + "' class='" + className + "' />";
		return result;
	}
};

/**
 * 生成一个field的html代码
 */

function createFieldHtml(formData, prop, className) {
	return formFieldCreator[prop.type.name](formData, prop, className);
}

/**
 * 发送启动流程请求
 */

function sendStartupRequest() {
	if($(".dynamic-form").valid()) {
		$('.dynamic-form').submit();
	}
}