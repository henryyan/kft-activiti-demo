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
		width: 400,
		title: '办理任务[' + tname + ']',
		open: function() {
			readFormFields.call(this, taskId);
		},
		buttons: [{
			text: '提交',
			click: function() {
				$('.dynamic-form').submit();
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
 * 读取表单字段
 */
function readFormFields(taskId) {
	var dialog = this;

	// 清空对话框内容
	$(dialog).html("<form class='dynamic-form' method='post'><table class='dynamic-form-table'></table></form>");
	var $form = $('.dynamic-form');

	// 设置表单提交id
	$form.attr('action', ctx + '/form/dynamic/task/complete/' + taskId);

    // 添加隐藏域
    if ($('#processType').length == 0) {
        $('<input/>', {
            'id': 'processType',
            'name': 'processType',
            'type': 'hidden'
        }).val(processType).appendTo($form);
    }

	// 读取启动时的表单
	$.getJSON(ctx + '/form/dynamic/get-form/task/' + taskId, function(datas) {
		var trs = "";
		$.each(datas.taskFormData.formProperties, function() {
			var className = this.required === true ? "required" : "";
			this.value = this.value ? this.value : "";
			trs += "<tr>" + createFieldHtml(this, datas, className)
			if (this.required === true) {
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
		$form.find('.date').datepicker();

		// 表单验证
		$form.validate($.extend({}, $.common.plugin.validator));
	});
}

/**
 * form对应的string/date/long/enum/boolean类型表单组件生成器
 * fp_的意思是form paremeter
 */
var formFieldCreator = {
	'string': function(prop, datas, className) {
		var result = "<td width='120'>" + prop.name + "：</td>";
		if (prop.writable === true) {
			result += "<td><input type='text' id='" + prop.id + "' name='fp_" + prop.id + "' class='" + className + "' value='" + prop.value + "' />";
		} else {
			result += "<td>" + prop.value;
		}
		return result;
	},
	'date': function(prop, datas, className) {
		var result = "<td width='120'>" + prop.name + "：</td>";
		if (prop.writable === true) {
			result += "<td><input type='text' id='" + prop.id + "' name='fp_" + prop.id + "' class='date " + className + "' value='" + prop.value + "'/>";
		} else {
			result += "<td>" + prop.value;
		}
		return result;
	},
	'enum': function(prop, datas, className) {
		var result = "<td width='120'>" + prop.name + "：</td>";
		if (prop.writable === true) {
			result += "<td><select id='" + prop.id + "' name='fp_" + prop.id + "' class='" + className + "'>";
			$.each(datas[prop.id], function(k, v) {
				result += "<option value='" + k + "'>" + v + "</option>";
			});
			result += "</select>";
		} else {
			result += "<td>" + prop.value;
		}
		return result;
	},
	'users': function(prop, datas, className) {
		var result = "<td width='120'>" + prop.name + "：</td>";
		if (prop.writable === true) {
			result += "<td><input type='text' id='" + prop.id + "' name='fp_" + prop.id + "' class='" + className + "' value='" + prop.value + "' />";
		} else {
			result += "<td>" + prop.value;
		}
		return result;
	}
};

/**
 * 生成一个field的html代码
 */
function createFieldHtml(prop, className) {
	return formFieldCreator[prop.type.name](prop, className);
}