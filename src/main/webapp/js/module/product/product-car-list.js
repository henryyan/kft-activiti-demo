/**
 * 产品管理列表Javascript
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

var moduleAction = 'product/product';

var enableValueMap = {"启用" : "true", "禁用" : "false"};

/**
 * 加载列表
 *字段： 产品名称、产品描述、保险公司、保险公司编号、已启用、手续费比率（%）、险种类别名称、生效日期
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: ctx + '/js/module/product/product-car-data.json',
		colNames: [' ', '产品名称', '产品描述', '保险公司', '保险公司编号', '已启用', '手续费比率(%)', '险种类别名称', '生效日期'],
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
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'description',
			editable: true,
			edittype: 'textarea',
			editoptions: {
				cols: 19
			},
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'insuranceCom',
			align: 'center',
			editable: true,
			width: 80,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'insuranceComNumber',
			editable: true,
			width: 70,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'enable',
			align: 'center',
			editable: true,
			width: 50,
			edittype: 'select',
			editoptions: {
				value: {"true": "启用", "false": "禁用"}
			},
			formatter: function(cellvalue) {
				if (cellvalue) {
					if (cellvalue != 'true' && cellvalue != 'false') {
						cellvalue = enableValueMap[cellvalue];
					}
					if (cellvalue == 'true') {
						return "<img src='" + ctx + "/images/tip/ok.gif' />";
					} else {
						return "<img src='" + ctx + "/images/tip/err.gif' />";
					}
				}
				return "";
			}
		}, {
			name: 'poundageRate',
			editable: true,
			width: 70,
			align: 'right',
			formatter: 'number',
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'insuranceType',
			editable: true,
			width: 60,
			align: 'center',
			edittype: 'select',
			editoptions: {
				value: {"car": "车险"}
			},
			formatter: function(cellvalue){
				if (cellvalue) {
					return "<img src='" + ctx + "/images/product/" + cellvalue.replace("车险", "car") + ".png' />";
				}
				return "";
			}
		}, {
			name: 'effectiveDate',
			editable: true,
			width: 60,
			align: 'center',
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
		}],
		caption: "[产品-车险]列表",
		editurl: ctx + '/common/return-true.action'
	})).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
		edit: false,
		del: false
	}), 
	// edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
		width : 500,
		editCaption: '编辑产品',
		reloadAfterSubmit: false,
		beforeShowForm: commonBeforeShowForm,
    	beforeSubmit: beforeSubmit
	}),
	
	// add options
    $.extend($.common.plugin.jqGrid.form.add, {
		width : 500,
		addCaption: '添加产品',
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
			description : {
				required: true
			},
			insuranceCom : {
				required: true
			},
			insuranceComNumber : {
				required: true
			},
			poundageRate: {
				required: true,
				number: true
			},
			effectiveDate: {
				required: true
			}
		},
        errorPlacement: $.common.plugin.validator.error,
        success: $.common.plugin.validator.success
    });
}
