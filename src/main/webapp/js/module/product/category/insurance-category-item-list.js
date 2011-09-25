/**
 * 项目列表Javascript
 * 
 * @author 
 */
$(function() {
	// 自动根据窗口大小改变数据列表大小
	$.common.plugin.jqGrid.autoResize({
		dataGrid: '#itemList',
		gridContainer: '#itemListContainer',
		callback: listDatas
	});
});

var moduleAction = 'customer/customer';
/**
 * 加载列表
 * 字段：项目编号、项目名称、保费费率（卖）、保费费率（买）、代理费率、业务员佣金比例、管理费率、是否主险
 * @return
 */
function listDatas(size) {
	var gridHeight = $('#RightPane').height() - $('#subCategoryContainer').height();
	size.height = gridHeight - 81;
	size.width += 5;
    $("#itemList").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size, pager: '#itemPager'}), {
		url: ctx + '/js/common/empty.json',
		//url: ctx + '/js/module/product/category/insurance-category-item-data-12.json',
		colNames: ['', '项目编号', '项目名称', '保费费率(卖)', '保费费率(买)', '代理费率', '业务员佣金比例', '管理费率', '是否主险'],
        colModel: [{
			name: 'myac',
			width:60,
			fixed:true,
			sortable:false,
			resize:false,
			formatter:'actions',
			formatoptions:{keys:true}
		}, {
			name: 'itemCode',
			editable: true
		}, {
			name: 'itemName',
			editable: true
		}, {
			name: 'itemRate1',
			editable: true
		}, {
			name: 'itemRate2',
			editable: true
		}, {
			name: 'itemRate3',
			editable: true
		}, {
			name: 'itemRate4',
			editable: true
		}, {
			name: 'itemRate5',
			editable: true
		}, {
			name: 'isMajor',
			editable: true,
			edittype: 'select',
			editoptions: {
				value: {"是": "是", "否": "否"}
			}
		}],
		caption: "[保险项目]列表",
		editurl: ctx + '/common/return-true.action'
	})).jqGrid('navGrid', '#itemPager', $.extend($.common.plugin.jqGrid.pager, {
		edit: false,
		del: false
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
	}));
	
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