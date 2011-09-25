/**
 * 财务管理列表Javascript
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

var moduleAction = 'report/report';
/**
 * 加载列表
 * 字段：预收日期、营业处、预收形式、预收金额、费用状态、业务员、创建人
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: ctx + '/js/module/report/report-life-data.json',
		colNames: ['预收日期', '营业处', '预收形式', '预收金额', '费用状态', '业务员', '创建人'],
        colModel: [{
			name: 'prepDate',
			align: 'center',
			width: 80,
			editable: true,
			editoptions: {
				dataInit: function(elem) {
					$(elem).addClass('Wdate').attr('readonly', true).focus(function() {
	    				WdatePicker();
	    			});
				}
			},
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		},{
			name: 'business',
			editable: true,
			edittype: 'text'
		},{
			name: 'prepform',
			edittype: 'select',
			editable: true,
			editoptions: {
				value: {"1": "现金", "2": "支票", "3": "未知"}
			}
		},{
			name: 'prepmoney',
			editable: true,
			edittype: 'text'
		},{
			name: 'state',
			editable: true,
			edittype: 'select',
			editoptions: {
				value: {
					"1": "未到帐",
					"0": "已到账"
				}
			}
		},{
			name: 'operationman',
			editable: 'true',
			edittpe: 'text'
		},{
			name: 'establish',
			editable: true,
			edittype: 'text'
		}],
		caption: "[财务-寿险]管理列表",
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
	})).jqGrid('navButtonAdd','#pager', $.common.plugin.jqGrid.navButtonAdd.setColumns);
	
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
