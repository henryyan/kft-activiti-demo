/**
 * 客户管理列表Javascript
 * 
 * @author 
 */
$(function() {
	// 自动根据窗口大小改变数据列表大小
	$.common.plugin.jqGrid.autoResize({
		dataGrid: '#list',
		callback: listDatas
	});
	
});

var moduleAction = 'customer/customer';
/**
 * 加载列表
 * 字段：来源名称、来源描述
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: ctx + '/js/module/customer/customer-source-data.json',
		colNames: ['来源名称', '来源描述'],
        colModel: [{
			name: 'name',
			align: 'center',
			width: 80,
			editable: true,
			edittype: 'select',
			editoptions: {
				value: {"1": "合作方客户", "2": "转介绍客户", "3": "自拓展客户"}
			},
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		},{
			name: 'description',
			editable: true,
			align: 'center',
			edittype: 'textarea',
			editoptions: {
	        	rows: 4,
				cols: 45
            }
		}],
		caption: "[客户-来源]管理列表",
		editurl: ctx + '/common/return-true.action'
	})).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
	}), 
	// edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
		width : 500,
		editCaption: '编辑',
		reloadAfterSubmit: false,
		beforeShowForm: commonBeforeShowForm,
    	beforeSubmit: beforeSubmit
	}),
	
	// add options
    $.extend($.common.plugin.jqGrid.form.add, {
		width : 500,
		addCaption: '添加',
		reloadAfterSubmit: false,
		beforeShowForm: commonBeforeShowForm,
    	beforeSubmit: beforeSubmit
	}), 
	
    // delete options
    $.extend($.common.plugin.jqGrid.form.remove, {
		url: ctx + '/common/return-true.action',
		reloadAfterSubmit: false
	}),
	
	// search optios
	$.extend($.common.plugin.jqGrid.form.search, {}), 
	
	// view options
	$.extend($.common.plugin.jqGrid.form.view, {
		beforeShowForm: function(formid) {
    		$.common.plugin.jqGrid.navGrid.showAllField(formid);
	    }
	})).jqGrid('#pager');
	
}

/**
 * 显示新增、编辑表单前处理
 * @param {Object} formid
 */
function commonBeforeShowForm(formid) {
	// 注册表单验证事件
	validatorForm();
	$('tr.FormData[id]').show();
	$('.CaptionTD').width(70);
}

/**
 * 提交表单前
 */
function beforeSubmit() {
	var valid = $("#FrmGrid_list").valid();
	return [valid, '表单有 ' + validator.numberOfInvalids() + ' 项错误，请检查！'];
}

/**
 * 表单验证
 * 
 * @return
 */
function validatorForm() {
	validator = $("#FrmGrid_list").validate({
        rules: {
			name : {
				required: true
			},
			level : {
				required: true
			},
			majorBusiness : {
				required: true
			},
			customerManager : {
				required: true
			},
			cusomerHashslinger: {
				required: true
			}
		},
        errorPlacement: $.common.plugin.validator.error,
        success: $.common.plugin.validator.success
    });
}


