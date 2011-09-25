/**
 * 保单管理列表Javascript
 * 
 * @author HenryYan
 */
$(function() {
	// 自动根据窗口大小改变数据列表大小
	$.common.plugin.jqGrid.autoResize({
		dataGrid: '#list',
		toolbar: [true, 'top'],
		callback: listDatas
	});
	
});

/**
 * 加载列表
 * 字段： 保单编号、车主姓名、性别、年龄、车牌号、注册登记日期、行使城市、购车时间、车价（万）、生效日期、结束日期、联系人、手机、Email
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: ctx + '/js/module/policy/policy-groupFinancial-import.json',
		colNames: [' ', '保单编号', '企业名称', '法人代表', '企业性质', '成立时间', '员工人数', '以何种价值投保', '保险金额',  '生效日期', '结束日期', '联系方式', 'Email'],
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
			name: 'policyNumber',
			align: 'center',
			width: 100
		}, {
			name: 'cpaName',
			align: 'center',
			width: 60,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'cpaMan',
			align: 'center',
			width: 60,
			editable: true
		}, {
			name: 'cpaProperty',
			align: 'center',
			width: 60,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'buildDate',
			align: 'center',
			width: 80,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'headcount',
			align: 'center',
			width: 80
		},{
			name: 'insurePrice',
			align: 'center',
			width: 80,
			editable: true
		},{
			name: 'insureMoney',
			align: 'center',
			width: 80,
			editable: true
		}, {
			name: 'effectiveDate',
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
		}, {
			name: 'invalidationDate',
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
		}, {
			name: 'mobilePhone',
			width: 90,
			hidden: true,
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
		}],
		toolbar: [true, 'top'],
		caption: "[企业-财险]保单录入",
		editurl: ctx + '/common/return-true.action',
		gridComplete: function() {
			$('.affix').unbind('click').click(function() {
				var srcEle = this;
				var customerName = $('#' + $(srcEle).attr('rowId')).find('td:eq(3)').text();
				$('#affixTemplate').dialog({
					title: '[' + customerName + ']投保方案相关附件'
				});
			});
			
			$('#t_list').html("<button id='importPolicy'>从投保方案导入</button>");
			$('#importPolicy').button({
				icons: {primary: 'ui-icon-arrowthick-1-e'}
			}).click(importPolicy);
			
			if (!$('body').data('loaded')) {
				$('#1').hide();
			}
			
		},
		subGrid: true,
		subGridRowExpanded: function(subgrid_id, row_id){
			var rowNumberCounter = 1;
			var subgrid_table_id, pager_id;
			subgrid_table_id = subgrid_id+"_t";
			pager_id = "p_"+subgrid_table_id;
			$("#"+subgrid_id).html("<table id='"+subgrid_table_id+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div>");
			$("#"+subgrid_table_id).jqGrid({
				url: ctx + "/js/module/scheme/scheme-financial-subgrid-data.json",
				datatype: "json", 
				colNames: ['序号', '险种', '保险金额', '保费保费询价', '保费保费报价'], 
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
		add: true,
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

/**
 * 导入保单
 */
function importPolicy() {
	$('#importTemplate').dialog({
		modal: true,
		position: 'top',
		height: document.documentElement.clientHeight - 50,
		width: $('body').width() * 0.9,
		open: function() {

			showSchemeCarList({
				width: $('#importTemplate').width(),
				height: '100%'
			});
		},
		buttons: [{
			text: '导入',
			click: function() {
				$(this).dialog('close');
				$('#1').show();
			}
		}, {
			text: '关闭',
			click: function() {
				$(this).dialog('close');
			}
		}]
	});
}

/**
 * 投保列表
 * @param {Object} size
 */
function showSchemeCarList(size) {
	$("#scheme-list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({
			size: size,
			pager: 'scheme-pager'
		}), {
		url: ctx + '/js/module/scheme/scheme-groupFinancial-data.json',
		colNames: ['企业名称', '法人代表', '企业性质', '成立时间', '员工人数', '以何种价值投保', '保险金额', '联系方式', 'Email', '相关文件'],
        colModel: [{
			name: 'cpaName',
			align: 'center',
			width: 60,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'cpaMan',
			align: 'center',
			width: 60
		}, {
			name: 'cpaProperty',
			align: 'center',
			width: 80
		},{
			name: 'bulidDate',
			align: 'center',
			width: 60,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'headCount',
			align: 'center',
			width: 80,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'insurePrice',
			align: 'center',
			width: 80,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'insureMoney',
			width: 60,
			align: 'center'
		},{
			name: 'mobilePhone',
			width: 90,
			align: 'center',
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'email',
			align: 'center',
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
		}],
		caption: "[车险]-投保方案列表",
		editurl: ctx + '/common/return-true.action',
		gridComplete: function() {
			$('.affix').unbind('click').click(function() {
				var srcEle = this;
				var customerName = $('#' + $(srcEle).attr('rowId')).find('td:eq(3)').text();
				$('#affixTemplate').dialog({
					title: '[' + customerName + ']投保方案相关附件'
				});
			});
			$('.markPotential').button({
				icons: {primary: 'ui-icon-document'}
			}).addClass('ui-button-notext').click(function(){
				$('#carDesc').dialog({
					buttons:{确定: function(){
						$(this).dialog('close');
					}}
					
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
				colNames: ['序号', '险种', '保险金额', '保费保费询价', '保费保费报价'], 
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
				caption: '投保险种列表',
				rowNum:20, 
				pager: pager_id, 
				height: '100%',
				width: $("#"+subgrid_table_id).parent().width() * 0.9
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
	}));
}
