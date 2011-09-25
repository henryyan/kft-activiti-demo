/**
 * 用户管理列表Javascript
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

var moduleAction = 'account/account';
var levels = {"一般客户" : "1", "高级客户": "2", "VIP客户": "3", "VVIP客户": "4", "VVVIP客户": "5"};

/**
 * 加载列表
 * 字段： 工号、姓名、性别、级别、授信额度、入职时间、入职地点、联系电话
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: ctx + '/js/module/account/account-outterperson-data.json',
		colNames: ['工号', '姓名', '性别', '级别', '授信额度', '入职时间','入职地点', '联系电话'],
        colModel: [{
			name: 'number',
			align: 'center',
			width: 80,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'name',
			width: 80,
			editable: true
		}, {
			name: 'sex',
			editable: true,
			edittype: 'select',
			editoptions: {
				value: {"1": "男", "2": "女"}
			},
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		},{
			name: 'level',
			width: 50,
			align: 'center',
			editable: true,
			edittype: 'select',
			editoptions: {
				value: {"1": "一般客户", "2": "高级客户", "3": "VIP客户", "4": "VVIP客户", "5": "VVVIP客户"}
			},
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            },
			formatter: function(cellvalue, optinos, rowObject) {
				if (cellvalue) {
					if (!isNaN(levels[cellvalue])) {
						cellvalue = levels[cellvalue];
					}
					return "<img src='" + ctx + "/images/icons/level/" + cellvalue + ".gif' />";
				} else {
					return "";
				}
			}
		}, {
			name: 'authority',
			editable: true
		},{
			name: 'workdate',
			hidden: true,
			editable: true
		},{
			name: 'phone',
			hidden: true,
			editable: true,
			edittype: 'text'
		},{
			name: 'address',
			editable: true,
			hidden: true,
			edittype: 'textarea',
			editoptions: {
				cols: 19
			}
		}],
		caption: "[用户-外部人员]管理列表",
		editurl: ctx + '/common/return-true.action',
		gridComplete: function() {
			$('.affix').unbind('click').click(function() {
				var srcEle = this;
				var customerName = $('#' + $(srcEle).attr('rowId')).find('td:eq(3)').text();
				$('#affixTemplate').dialog({
					title: '编制文档附件',
					open: function() {
						$('.weboffice').click(function() {
							var backUrl  = location.href;
							var openurl = ctx + '/common/activex/iweboffice/DocumentEdit.jsp?FileType=.doc&UserName=aa&backUrl=' + backUrl;
							window.open(openurl,"", "left=50,top=50,height=550, width=1020, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no");
						});
					}
				});
			});
		},
		subGrid: true,
		subGridRowExpanded: function(subgrid_id, row_id){
			var rowNumberCounter = 1;
			var subgrid_table_id, pager_id;
			subgrid_table_id = subgrid_id+"_t";
			pager_id = "p_"+subgrid_table_id;
			$("#"+subgrid_id).html("<table id='"+subgrid_table_id+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div>");
			$("#"+subgrid_table_id).jqGrid({
				url: ctx + "/js/module/account/account-person-trace-data.json",
				datatype: "json", 
				colNames: ['序号', '沟通时间', '沟通方式', '沟通内容', '沟通结果'], 
				colModel: [{
					name: 'rowNumber',
					width: 20,
					align: 'center',
					formatter: function() {
						return rowNumberCounter++;
					}
				}, {
					name: 'traceTime',
					editable: true,
					editoptions: {
						dataInit: function(elem) {
							$(elem).addClass('Wdate').attr('readonly', true).focus(function() {
			    				WdatePicker({
									dateFmt:'yyyy-MM-dd HH:mm'
								});
			    			});
						}
					},
					width: 70,
					formoptions: {
		            	elmsuffix: $.common.plugin.jqGrid.form.must
		            }
				}, {
					name: 'interosculateWay',
					width: 100,
					editable: true,
					formoptions: {
		            	elmsuffix: $.common.plugin.jqGrid.form.must
		            }
				}, {
					name: 'traceContent',
					editable: true,
					edittype: 'textarea',
					editoptions: {
						rows: 5,
						dataInit: function(elem) {
							$(elem).val($.common.code.htmlDecode($(elem).val()));
						}
					},
					formatter: function(cellvalue) {
						if (cellvalue) {
							return $.common.code.htmlEncode(cellvalue);
						}
						return "";
					},
					formoptions: {
		            	elmsuffix: $.common.plugin.jqGrid.form.must
		            }
				}, {
					name: 'traceResult',
					editable: true,
					edittype: 'textarea',
					editoptions: {
						rows: 5,
						dataInit: function(elem) {
							$(elem).val($.common.code.htmlDecode($(elem).val()));
						}
					},
					formatter: function(cellvalue) {
						if (cellvalue) {
							return $.common.code.htmlEncode(cellvalue);
						}
						return "";
					},
					formoptions: {
		            	elmsuffix: $.common.plugin.jqGrid.form.must
		            }
				}],
				caption: '客户跟踪记录',
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
				reloadAfterSubmit: false
			});
		}
	})).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
	}), 
	// edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
		width : 500,
		editCaption: '编辑用户',
		reloadAfterSubmit: false,
		beforeShowForm: commonBeforeShowForm,
    	beforeSubmit: beforeSubmit
	}),
	
	// add options
    $.extend($.common.plugin.jqGrid.form.add, {
		width : 500,
		addCaption: '添加用户',
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
