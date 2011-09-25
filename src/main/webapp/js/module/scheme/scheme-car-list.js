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

/**
 * 加载列表
 * 
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: ctx + '/js/module/scheme/scheme-car-data.json',
		colNames: [' ', '车主姓名', '性别', '年龄', '车牌号', '注册登记日期', '行驶城市', '购车时间', '车价(万)', '联系人', '手机', 'Email', '相关文件', '提交'],
        colModel: [{
			name: 'options',
			width: 80,
			fixed: true,
			sortable: false,
			resize: false,
			formatter: 'actions',
			formatoptions: { keys:true },
			search: false
		}, {
			name: 'name',
			align: 'center',
			width: 60,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'sex',
			align: 'center',
			width: 50,
			editable: true,
			edittype: 'select',
			editoptions: {
				value: {"male": "男", "female": "女"}
			},
			formatter: function(cellvalue, options, rowObject) {
				cellvalue = cellvalue.replace('男', 'male').replace('女', 'female');
				if (cellvalue.match(/(male|female)/)) {
					return "<img src='" + ctx + "/images/icons/user/user_" + cellvalue + ".png' />";
				}
			},
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'age',
			align: 'center',
			width: 50,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'carNumber',
			align: 'center',
			width: 80,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'registeDate',
			align: 'center',
			width: 80,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'driveCity',
			width: 60,
			align: 'center',
			editable: true,
			edittype: 'select',
			editoptions: {
				value: {"上海": "上海", "北京": "北京", "广州": "广州", "杭州": "杭州"}
			},
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'buyCarDate',
			align: 'center',
			editable: true,
			width: 80,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'carPrice',
			editable: true,
			width: 70,
			formatter: 'number',
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'contact',
			width: 60,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'mobilePhone',
			width: 90,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'email',
			hidden: true,
			editable: true,
			formatter: 'email',
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'affix',
			width: 50,
			align: 'center',
			formatter: function(cellvalue, options, rowObject) {
				if (!isNaN(cellvalue) && cellvalue > 0) {
					return "<a href='#' class='affix' rowId='" + options.rowId + "'>" + cellvalue + "个</a>";
				} else {
					return "";
				}
			}
		}, {
			name: 'submited',
			width: 30
		}],
		multiselect: true,
		caption: "[车险]-投保方案列表",
		editurl: ctx + '/common/return-true.action',
		gridComplete: function() {
			$('.affix').unbind('click').click(function() {
				var srcEle = this;
				var customerName = $('#' + $(srcEle).attr('rowId')).find('td:eq(3)').text();
				$('#affixTemplate').dialog({
					title: '[' + customerName + ']投保方案相关附件',
					open: function() {
						$('.weboffice').click(function() {
							var backUrl  = location.href;
							var openurl = ctx + '/common/activex/iweboffice/DocumentEdit.jsp?FileType=.doc&UserName=aa&backUrl=' + backUrl;
							window.open(openurl,"", "left=50,top=50,height=550, width=1020, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no");
						});
					}
				});
			});
			
			// 提交审核
			$('td[aria-describedby=list_options]').each(function() {
				$('.ui-inline-del', this).after("<div onmouseout='$(this).removeClass(\"ui-state-hover\");' onmouseover='$(this).addClass(\"ui-state-hover\");' class='ui-pg-div ui-inline-del' style='float:left;margin-left:5px;' title='提交审核'><span class='ui-icon ui-icon-check'></span></div>");
				$('.ui-icon-check', this).click(function() {
					var rowId = $(this).parents('tr').attr('id');
					$('#' + rowId + ' td[aria-describedby=list_submited]').html("<img src='" + ctx + "/images/tip/ok.gif'/>");
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
				url: ctx + "/js/module/scheme/scheme-car-subgrid-data.json",
				datatype: "json", 
				colNames: ['序号', '险种', '保险金额'/*, '保费询价', '保费报价'*/], 
				colModel: [{
					name: 'rowNumber',
					width: 40,
					align: 'center',
					formatter: function() {
						return rowNumberCounter++;
					}
				}, {
					name: 'type',
					editable: true,
					edittype: 'select',
					editoptions: {
						value: {"车辆损失险": "车辆损失险", "商业第三者责任险": "商业第三者责任险", "全车盗抢险": "全车盗抢险", "司机座位责任险" : "司机座位责任险"}
					}
				}, {
					name: 'total',
					editable: true,
					formatter: 'number',
					formatoptions: {
						thousandsSeparator: ","
					},
					formoptions: {
		            	elmsuffix: $.common.plugin.jqGrid.form.must
		            }
				}/*, {
					name: 'askPrice',
					editable: true,
					formatter: 'number',
					formatoptions: {
						thousandsSeparator: ","
					}
				}, {
					name: 'qauotedPrice',
					editable: true,
					formatter: 'number',
					formatoptions: {
						thousandsSeparator: ","
					}
				}*/],
				caption: '投保险种列表',
				cellEdit: true,
				cellurl: ctx + '/common/return-true.action',
				editurl: ctx + '/common/return-true.action',
				rowNum:20, 
				pager: pager_id, 
				height: '100%',
				width: $("#"+subgrid_table_id).parent().width() * 0.3
			}).jqGrid('navGrid',"#" + pager_id, $.extend($.common.plugin.jqGrid.pager, {
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
		edit: false,
		del: false
	}), 
	// edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
		width : 500,
		editCaption: '编辑投保方案',
		reloadAfterSubmit: false,
		beforeShowForm: commonBeforeShowForm,
    	beforeSubmit: beforeSubmit
	}),
	
	// add options
    $.extend($.common.plugin.jqGrid.form.add, {
		width : 500,
		addCaption: '添加投保方案',
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
			caption : "提交审核",
			title: "批量提交审核",
			buttonicon : "ui-icon-check",
			onClickButton: function() {
				var chks = $.common.plugin.jqGrid.checkbox.getChecked('list');
				$(chks).each(function() {
					var rowId = $(this).parents('tr').attr('id');
					$('#' + rowId + ' td[aria-describedby=list_submited]').html("<img src='" + ctx + "/images/tip/ok.gif'/>");
				});
			}
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
			age : {
				required: true,
				number: true
			},
			carNumber : {
				required: true
			},
			registeDate : {
				required: true
			},
			buyCarDate: {
				required: true
			},
			carPrice: {
				required: true,
				number: true
			},
			contact: {
				required: true
			},
			mobilePhone: {
				required: true
			},
			email: {
				required: true,
				email: true
			}
		},
        errorPlacement: $.common.plugin.validator.error,
        success: $.common.plugin.validator.success
    });
}