var moduleAction = 'customer/customer';

/**
 * 加载列表
 * @return
 */
function listCompanyEmployeeDatas(size, companyId) {
    $("#personList").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({
			size: size,
			pager: "#personPager"
		}), {
		url: ctx + '/js/module/customer/collective/customer-collective-person-data-' + companyId + '.json',
		colNames: ['客户编码', '客户名称', '联系人', '联系电话', '联系传真',
					'地址', 'Email', '备注', '输入员'],
        colModel: [{
			name: 'code',
			align: 'center',
			width: 80,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'name',
			align: 'center',
			width: 80,
			editable: true
		}, {
			name: 'contact',
			align: 'center',
			width: 80,
			editable: true
		}, {
			name: 'phone',
			align: 'center',
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'fax',
			align: 'center',
			editable: true
		}, {
			name: 'address',
			align: 'center',
			hidden: true,
			editable: true
		}, {
			name: 'email',
			align: 'center',
			editable: true
		}, {
			name: 'remark',
			align: 'center',
			editable: true
		}, {
			name: 'putin',
			editable: true,
			align: 'center',
			edittype: 'textarea',
			editoptions: {
				cols: 19
			}
		}],
		caption: "[集体客户员工]列表",
		editurl: ctx + '/common/return-true.action',
		gridComplete:function(){
			
		}
	})).jqGrid('navGrid', '#personPager', $.extend($.common.plugin.jqGrid.pager, {
	}), 
	// edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
		width : 500,
		editCaption: '编辑客户',
		reloadAfterSubmit: false,
		beforeShowForm: commonBeforeShowForm,
    	beforeSubmit: beforeSubmit
	}),
	
	// add options
    $.extend($.common.plugin.jqGrid.form.add, {
		width : 500,
		addCaption: '添加客户',
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
	})).jqGrid('navButtonAdd', '#personPager', $.common.plugin.jqGrid.navButtonAdd.setColumns);
	
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
