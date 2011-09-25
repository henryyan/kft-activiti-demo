/**
 * 已完成管理列表Javascript
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
 * 字段：
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: ctx + '/js/module/policy/policy-group-done.json',
		colNames: ['保单编号', '集团名称', '法人代表', '企业性质', '创建时间', '公司地址', '联系人', '手机号码', '投保日期', '生效日期', '结束日期', '邮箱','通知'],
		colModel: [{
			name: 'policyNum',
			align: 'center',
			width: 80,
			editable: true
		}, {
			name: 'companyName',
			align: 'center',
			width: 90,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'cpaMan',
			align: 'center',
			width: 60,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'cpaProperty',
			align: 'center',
			width: 60,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'bulidDate',
			align: 'center',
			width: 80,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'address',
			align: 'center',
			width: 80,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		},{
			name: 'contact',
			align: 'center',
			width: 90,
			hidden: true,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'phone',
			align: 'center',
			width: 80,
			editable: true,
			editoptions: {
				dataInit: function(elem) {
					$(elem).addClass('Wdate').attr('readonly', true).focus(function() {
	    				WdatePicker();
	    			});
				}
			}
		},{
			name: 'insureDate',
			align: 'center',
			width: 60
		},{
			name: 'effectiveDate',
			align: 'center',
			width: 80,
			editable: true,
			editoptions: {
				dataInit: function(elem) {
					$(elem).addClass('Wdate').attr('readonly', 

true).focus(function() {
	    				WdatePicker();
	    			});
				}
			}
		}, {
			name: 'invalidationDate',
			align: 'center',
			width: 80,
			editable: true,
			editoptions: {
				dataInit: function(elem) {
					$(elem).addClass('Wdate').attr('readonly', 

true).focus(function() {
	    				WdatePicker();
	    			});
				}
			}
		},{
			name: 'email',
			align: 'center',
			hidden: true,
			editable: true
		},{
			name: 'notify',
			width: 50,
			align: 'center',
			formatter: function() {
				return "<button class='ui-button-notext notify'></button>";
			}
		}],
		caption: "已完成保单列表",
		editurl: ctx + '/common/return-true.action',
		gridComplete: function() {
			$('.affix').unbind('click').click(function() {
				var srcEle = this;
				var customerName = $('#' + $(srcEle).attr('rowId')).find('td:eq(3)').text();
				$('#affixTemplate').dialog({
					title: '[' + customerName + ']投保方案相关附件'
				});
			});
			
			$('.notify').button({
				icons: {primary: 'ui-icon-mail-closed'}
			}).click(function() {
				$(this).parent().html("<img src='" + ctx + "/images/tip/ok.gif'/>");
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
				url: ctx + "/js/module/scheme/scheme-group-subgrid-data.json",
				datatype: "json", 
				colNames: ['序号', '险种', '保险金额', '保费询价', '保费报价'], 
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
						value: {"太平团体定期寿险": "太平团体定期寿险", "永泰团体年金保险（万能型）": "永泰团体年金保险（万能型）", "团体医疗险": "团体医疗险"}
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
				}, {
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
				}],
				caption: '[车险]-投保方案',
				cellEdit: true,
				cellurl: ctx + '/common/return-true.action',
				editurl: ctx + '/common/return-true.action',
				rowNum:20, 
				pager: pager_id, 
				height: '100%',
				width: $("#"+subgrid_table_id).parent().width() * 0.6
			}).jqGrid('navGrid',"#" + pager_id, $.extend($.common.plugin.jqGrid.pager, {
				add: false,
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
		add: false,
		edit: false,
		del: false
	}), 
	// edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
		width : 500,
		editCaption: '编辑保单',
		reloadAfterSubmit: false,
		beforeShowForm: commonBeforeShowForm,
    	beforeSubmit: beforeSubmit
	}),
	
	// add options
    $.extend($.common.plugin.jqGrid.form.add, {
		width : 500,
		addCaption: '添加保单',
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
