/**
 * 数据字典JavaScript 功能：数据字典的列表以及CRUD操作
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
var moduleAction  = "system-dictionary";

/**
 * 加载列表
 * 
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: moduleAction + '!list.action',
		colNames: ['', 'ID', '字典类型', '字典名称', '字典代码', '字典值','是否启用', '排序号', '备注'],
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
			name: 'id',
			hidden: true,
			editable: true
		}, {
            name: 'dictType',
			width: 60,
            align: 'center',
			editable: true,
            edittype: 'text',
            editoptions: {
	        	size :50,
	            maxlength: 100
            },
            searchoptions : {
    			sopt : $.common.plugin.jqGrid.search.text
    		},
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
        }, {
            name: 'dictName',
			width: 60,
            align: 'center',
			editable: true,
			edittype: 'text',
            editoptions: {
	        	size :50,
	            maxlength: 100
            },
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
        }, {
            name: 'dictCode',
            align: 'center',
			editable: true,
            edittype: 'text',
            editoptions: {
	        	size :50,
	            maxlength: 100
            },
            formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            },
            searchoptions : {
    			sopt : $.common.plugin.jqGrid.search.text
    		}
        }, {
            name: 'dictValue',
            align: 'center',
			editable: true,
			edittype: 'textarea',
			editoptions: {
	        	rows: 4,
				cols: 45
            },
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
        }, {
            name: 'enabled',
			width: 50,
            align: 'center',
			editable: true,
			edittype: "select",
			editoptions:{
        		value: {'true' : "是", 'false' : "否"}
        	},
        	stype : 'select',
        	searchoptions : {
        		value : {1 : '是', 0 : '否'}
        	},
			formatter : $.common.plugin.jqGrid.formatter.trueOrfalse
        }, {
            name: 'sortNumber',
			width: 50,
            align: 'center',
			editable: true,
			edittype: "text",
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
        }, {
            name: 'remark',
            align: 'center',
			width: 80,
			editable: true,
			edittype: 'textarea',
            editoptions: {
	        	rows: 4,
				cols: 45
            }
        }],
		caption: "数据字典管理",
		editurl: moduleAction + '.action',
		grouping: true,
       	groupingView : {
       		groupField : ['dictName'],
       		groupText : ['<b>{0} - {1} 项</b>']
       	},
		gridComplete: $.common.plugin.jqGrid.gridComplete('list')
	})
	).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
		
	}), 
	// edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
		width : 600,
		editCaption: '编辑数据字典',
		beforeShowForm: commonBeforeShowForm,
    	beforeSubmit: beforeSubmit
	}),
	
	// add options
    $.extend($.common.plugin.jqGrid.form.add, {
		width : 600,
		addCaption: '添加数据字典',
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
	})).jqGrid('navButtonAdd', '#pager', {
		caption: "重载字典",
		title: "重新设置内存数据字典",
	   	buttonicon: "ui-icon-arrowrefresh-1-s",
	   	onClickButton: function(){
			reloadDatadict();
	   	}
	});
       
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
			},
			dictName: {
				required: true
			},
			dictCode: {
				required: true,
				maxlength: 100,
				remote : {
					url: moduleAction + "!validateDictCode.action",
					type: "post",
					dataType:"json",
					data: {
						newId : function()	{
							return $("#id").val();
						},
						dictCode: function(){
							return $("#dictCode").val();
						}
					}
				}
			},
			dictValue: {
				required: true
			},
			sortNumber: {
				required: true,
				number: true,
				digits: true
			}
		},
		messages:{
			dictCode : {
				remote:"数据字典代码已存在，请重新输入！"
			}
		},
        errorPlacement: $.common.plugin.validator.error,
        success: $.common.plugin.validator.success
    });
}

function reloadDatadict() {
	var reloadDialog = $('<div title="重载数据字典">正在重载数据字典，请稍等……</div>').dialog({
		height: 100,
		modal: true
	});
	$.get(moduleAction + '!reload.action', function(resp){
		reloadDialog.dialog('close');
		if (resp == 'success') {
			alert('重载数据字典完毕！');
		} else {
			alert(resp);
		}
	});
}

function commonBeforeShowForm() {
	// 注册表单验证事件
    validatorForm();
	$('.CaptionTD').width(70);
}

function beforeSubmit() {
	var valid = $("#FrmGrid_list").valid();
	return [valid, '表单有 ' + validator.numberOfInvalids() + ' 项错误，请检查！'];
}
