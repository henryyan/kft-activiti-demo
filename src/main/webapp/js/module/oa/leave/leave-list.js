/**
 * 请假JavaScript
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

var validator;
var moduleAction  = "leave"; 

/**
 * 加载列表
 * 
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: moduleAction + '.action',
		colNames: ['工号', '姓名', '开始时间', '结束时间', '天数', '假种', '原因'],
        colModel: [{
			name: 'userId',
			align: 'center'
		}, {
			name: 'userName',
			align: 'center'
		}, {
			name: 'startTime',
			align: 'center',
			editable: true,
			editoptions: {
				dataInit: function(elem) {
					$(elem).addClass('Wdate').focus(function() {
	    				WdatePicker({
	                        dateFmt: "yyyy-MM-dd HH:mm:ss"
	                    });
	    			});
				}
			},
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            },
			formatter : 'date',
			formatoptions : {
				srcformat : 'Y-m-dTH:i:s',
				newformat : 'Y-m-d H:i:s'
			},
			searchoptions: {
				dataInit : function(elem) {
					$(elem).addClass('Wdate').click(WdatePicker);
				},
                sopt: $.common.plugin.jqGrid.search.date
            },
			sortable: false
		}, {
			name: 'endTime',
			align: 'center',
			editable: true,
			editoptions: {
				dataInit: function(elem) {
					$(elem).addClass('Wdate').focus(function() {
	    				WdatePicker({
	                        dateFmt: "yyyy-MM-dd HH:mm:ss"
	                    });
	    			});
				}
			},
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            },
			formatter : 'date',
			formatoptions : {
				srcformat : 'Y-m-dTH:i:s',
				newformat : 'Y-m-d H:i:s'
			},
			searchoptions: {
				dataInit : function(elem) {
					$(elem).addClass('Wdate').click(WdatePicker);
				},
                sopt: $.common.plugin.jqGrid.search.date
            },
			sortable: false
		}, {
			name: 'days',
			align: 'center',
			editable: true
		}, {
			name: 'leaveType',
			align: 'center',
			editable: true,
			edittype: 'select',
			editoptions: {
				value: ["公休", "调休", "事假", "病假", "产假", "婚假", "其他"]
			}
		}, {
			name: 'reason',
			editable: true,
			edittype: 'textarea'
		}],
		caption: "请假管理",
		editurl: moduleAction + '!save.action',
		gridComplete: $.common.plugin.jqGrid.gridComplete('list')
	})
	).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager), 
	// edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
		editCaption: '编辑请假申请',
		beforeShowForm: commonBeforeShowForm,
    	beforeSubmit: beforeSubmit
	}),
	
	// add options
    $.extend($.common.plugin.jqGrid.form.add, {
		addCaption: '添加请假申请',
		beforeShowForm: commonBeforeShowForm,
    	beforeSubmit: beforeSubmit
	}), 
	
    // delete options
    $.extend($.common.plugin.jqGrid.form.remove, {
		url: moduleAction + '!delete.action'
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
 * 表单验证
 * 
 * @return
 */
function validatorForm() {
	validator = $("#FrmGrid_list").validate({
        rules: {
			dictType: {
				required: true
			}
		},
        errorPlacement: $.common.plugin.validator.error,
        success: $.common.plugin.validator.success
    });
}

/**
 *  新增、编辑的时候使用
 */
function commonBeforeShowForm() {
	// 注册表单验证事件
    validatorForm();
	$.common.plugin.jqGrid.form.setLabelWidth({
		width: 70
	});
}

/**
 * 提交前验证表单
 */
function beforeSubmit() {
	var valid = $("#FrmGrid_list").valid();
	return [valid, '表单有 ' + validator.numberOfInvalids() + ' 项错误，请检查！'];
}