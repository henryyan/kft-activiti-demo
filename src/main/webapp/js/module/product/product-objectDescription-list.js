/**
 * 产品管理列表Javascript
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

var moduleAction = 'product/product';

var enableValueMap = {"启用" : "true", "禁用" : "false"};

/**
 * 加载列表
 * 字段：'标的种类编号','标的种类名称'
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: ctx + '/js/module/product/product-objectDescription-data.json',
		colNames: ['标的种类编号', '标的种类名称'],
        colModel: [{
			name: 'objectNum',
			align: 'center',
			width: 80,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'objectName',
			align: 'center',
			width: 80,
			editable: true
		}],
		caption: "[产品-标的定义]管理列表",
		editurl: ctx + '/common/return-true.action',
		subGrid: true,
		subGridRowExpanded: function(subgrid_id, row_id){
			var rowNumberCounter = 1;
			var subgrid_table_id, pager_id;
			subgrid_table_id = subgrid_id+"_t";
			pager_id = "p_"+subgrid_table_id;
			$("#"+subgrid_id).html("<table id='"+subgrid_table_id+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div>");
			$("#"+subgrid_table_id).jqGrid({
				url: ctx + "/js/module/product/product-objectDescription-trace-data.json",
				datatype: "json", 
				colNames: ['序号', '标的描述', '数据类型', '标的类型'], 
				colModel: [{
					name: 'rowNumber',
					width: 10,
					align: 'center',
					formatter: function() {
						return rowNumberCounter++;
					}
				}, {
					name: 'objectDescription',
					align: 'center',
					editable: true,
					width: 70,
					align: 'center',
					formoptions: {
		            	elmsuffix: $.common.plugin.jqGrid.form.must
		            }
				}, {
					name: 'dataType',
					align: 'center',
					width: 100,
					editable: true,
					edittype: 'select',
					editoptions: {
						value:{
							"1": "文字描述",
							"2": "多选一",
							"3": "是非判断",
							"4": "日期"
						}
					},
					formoptions: {
		            	elmsuffix: $.common.plugin.jqGrid.form.must
		            }
				}, {
					name: 'remark',
					align: 'center',
					editable: true,
					edittype: 'select',
					editoptions: {
						value: {
							"0": "主标",
							"1": "副标"
						}
					}
				}],
				caption: '标信息列表',
				cellEdit: true,
				cellurl: ctx + '/common/return-true.action',
				editurl: ctx + '/common/return-true.action',
				afterEditCell: function (id, name, val, iRow, iCol){
					// Ctrl + Enter 保存
					$("#" + iRow + "_" + name).keypress(function(e) {
						if (e.ctrlKey && (e.which == 13 || e.which == 10)) {
							$('#' + subgrid_table_id).jqGrid('saveCell', iRow, iCol);
						}
					}).blur(function() { // 失去焦点自动保存
						$('#' + subgrid_table_id).jqGrid('saveCell', iRow, iCol);
					});
				},
				rowNum:20, 
				pager: pager_id, 
				height: '100%',
				width: $("#"+subgrid_table_id).parent().width() * 0.9
			}).jqGrid('navGrid',"#" + pager_id, $.extend($.common.plugin.jqGrid.pager, {
				edit: false,
				view: false
			}), {
				closeAfterEdit: true,
				reloadAfterSubmit: false
			}, {
				closeAfterEdit: true,
				reloadAfterSubmit: false,
				beforeShowForm: function(formid) {
					
					// 处理多选一的操作
					$('#dataType').change(function() {
						if ($('option:selected', this).val() == '2') {
							$('tbody tr:last', formid).after("<tr class='choose'><td colspan='3'>" + $('#chooseTemplate').html() + "</td></tr>");
							for (var i = 1; i <= parseInt($('#chooseSize').val()) ; i++) {
								$('#chooseTable tr:last').after("<tr><td align='center'>" + ($('#chooseTable tr').length - 1) + "</td><td><input  type='input' /></td></tr>");
							}
						} else {
							$('.choose').remove();
						}
					});
				}
			});
		}
	})).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
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
	})).jqGrid('navButtonAdd', '#pager', $.common.plugin.jqGrid.navButtonAdd.setColumns);
	// submit notify leader
    
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
function test(){
	alert("sss");
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
