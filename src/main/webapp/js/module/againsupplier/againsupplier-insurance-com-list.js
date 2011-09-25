/**
 * 供应商管理列表Javascript
 * 
 * @author HenryYan
 */
$(function() {
	// 自动根据窗口大小改变数据列表大小
	$.common.plugin.jqGrid.autoResize({
		dataGrid: '#list',
		callback: listDatas
	});
	
});

var moduleAction = 'againsupplier/againsupplier';

var enableValueMap = {"启用" : "true", "禁用" : "false"};

/**
 * 加载列表
 * 字段： 公司名称、公司代码、公司类型、联络人、地址、电话号码、传真号码、手机号码、电子邮件、备注
 * @return
 */
function listDatas(size) {    
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: ctx + '/js/module/againsupplier/againsupplier-insurance-com-data.json',
		colNames: [' ', '公司名称', '公司代码', '公司类型', '联络人', '地址', '电话号码', '传真号码', '手机号码', '电子邮件', '备注'],
        colModel: [{
			name: 'options',
			width: 60,
			fixed: true,
			sortable: false,
			resize: false,
			formatter: 'actions',
			formatoptions: { keys:true },
			search: false
		}, {
			name: 'name',
			align: 'center',
			width: 80,
			editable: true
		}, {
			name: 'code',
			width: 60,
			editable: true
		}, {
			name: 'type',
			align: 'center',
			width: 80,
			editable: true,
			edittype: 'select',
			editoptions: {
				value: {"保险公司": "保险公司"}
			},
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'contact',
			editable: true,
			width: 70,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'address',
			align: 'center',
			hidden: true,
			editable: true,
			edittype: 'textarea'
		}, {
			name: 'phone',
			hidden: true,
			editable: true
		}, {
			name: 'fax',
			hidden: true,
			editable: true
		}, {
			name: 'mobilePhone',
			width: 90,
			editable: true
		}, {
			name: 'email',
			editable: true,
			formatter: 'email'
		}, {
			name: 'remark',
			editable: true,
			edittype: 'textarea'
		}],
		caption: "[供应商-再保险公司]管理列表",
		editurl: ctx + '/common/return-true.action'
	})).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
		edit: false,
		del: false
	}), 
	// edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
		width : 500,
		editCaption: '编辑供应商',
		reloadAfterSubmit: false,
		beforeShowForm: commonBeforeShowForm,
    	beforeSubmit: beforeSubmit
	}),
	
	// add options
    $.extend($.common.plugin.jqGrid.form.add, {
		width : 500,
		addCaption: '添加供应商',
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
	})).jqGrid('navButtonAdd', '#pager', $.common.plugin.jqGrid.navButtonAdd.setColumns)
		.jqGrid('navButtonAdd', '#pager', {
			caption : "Excel",
			title : "导出为Excel",
			buttonicon : "ui-icon-document"
		});
	
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
			contact : {
				required: true
			},
			email: {
				email: true
			}
		},
        errorPlacement: $.common.plugin.validator.error,
        success: $.common.plugin.validator.success
    });
}
