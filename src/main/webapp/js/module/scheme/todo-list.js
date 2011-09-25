/**
 * 待办管理列表Javascript
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
		colNames: ['车主姓名', '性别', '年龄', '车牌号', '注册登记日期', '行驶城市', '购车时间', '车价(万)', '联系人', '手机', 'Email', '相关文件', '当前节点', '审核'],
        colModel: [{
			name: 'name',
			align: 'center',
			width: 60
		}, {
			name: 'sex',
			align: 'center',
			width: 60,
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
			width: 60,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'carNumber',
			align: 'center',
			width: 80,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'registeDate',
			align: 'center',
			width: 80,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'driveCity',
			width: 60,
			align: 'center',
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'buyCarDate',
			align: 'center',
			width: 80,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'carPrice',
			width: 70,
			formatter: 'number',
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'contact',
			hidden: true,
			width: 60,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'mobilePhone',
			width: 90,
			hidden: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'email',
			hidden: true,
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
			name: 'activity',
			width: 100,
			align: 'center'
		}, {
			name: 'verify',
			width: 50,
			align: 'center',
			formatter: function(cellvalue, options, rowObject) {
				if (cellvalue == 'true') {
					return "<img src='" + ctx + "/images/tip/ok.gif'/>";
				} else if (cellvalue == 'false') {
					return "<img src='" + ctx + "/images/tip/err.gif'/>";
				} else {
					return "<button class='ui-button-notext verify' title='审核投保方案' rowId='" + options.rowId + "'></button>";
				}
			}
		}],
		caption: "待办任务列表",
		editurl: ctx + '/common/return-true.action',
		gridComplete: function() {
			$('.affix').unbind('click').click(function() {
				var srcEle = this;
				var customerName = $('#' + $(srcEle).attr('rowId')).find('td:eq(3)').text();
				$('#affixTemplate').dialog({
					title: '[' + customerName + ']投保方案相关附件'
				});
			});
			
			$('.verify').button({
		        icons: { primary: 'ui-icon-check' }
		    }).unbind('click').click(verify);
			
		}
	})).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
		add: false,
		edit: false,
		del: false
	}), 
	// edit options
    {},
	
	// add options
    {}, 
	
    // delete options
    {},
	
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
 * 审核
 */
function verify() {
	var srcEle = this;
	var rowId = $(srcEle).attr('rowId');
	var activity = $('#list').jqGrid('getCell', rowId, 13);
	$('#todoTemplate').dialog({
		modal: true,
		position: 'top',
		title: '投保方案审核-[' + activity + ']',
		width: $('body').width() * 0.7,
		open: function() {
			$('#' + rowId + ' td').each(function() {
				var filedId = $(this).attr('aria-describedby').split('_')[1];
				$('#' + filedId).html($(this).html());
			});
			
			$('#verify-table td').filter(function() {
				return !$(this).hasClass('label-bold')
			}).css({'textAlign': 'left'});
			
			// 按钮图标
			$.common.plugin.jqui.dialog.button.setIcons({
				通过: {primary: 'ui-icon-check'},
				不通过: {primary: 'ui-icon-close'}
			});
			
			// 投保列表
			showSchemeList(activity);
			if (activity != '投保方案审批') {
				$("#verify-scheme-list").jqGrid('showCol', ['askPrice', 'qauotedPrice']);
			}
		},
		buttons: [{
			text: "通过",
			click: function() {
				verifyOk(rowId);
			}
		}, {
			text: "不通过",
			click: function() {
				verifyFail(rowId);
			}
		}]
	});
}

/**
 * 审核通过
 */
function verifyOk(rowId) {
	$('#todoTemplate').dialog('close');
	$('#' + rowId + ' td[aria-describedby=list_verify]').html("<img src='" + ctx + "/images/tip/ok.gif'/>");
}

/**
 * 审核不通过
 */
function verifyFail(rowId) {
	if ($('#verify-fail-idea').is(':visible')) {
		if ($('#verify-fail-idea textarea').val() == '') {
			$('#verify-fail-idea .ui-state-highlight').show().find('.ui-info-content').text('请填写审核不通过的意见！');
		} else {
			$('#todoTemplate').dialog('close');
			$('#' + rowId + ' td[aria-describedby=list_verify]').html("<img src='" + ctx + "/images/tip/err.gif'/>");
		}		
	} else {
		$('#verify-fail-idea').slideDown();
	}
}

/**
 * 投保险种列表
 */
function showSchemeList(activity) {
	var rowNumberCounter = 1;
	$("#verify-scheme-list").jqGrid({
		url: ctx + "/js/module/scheme/scheme-car-subgrid-data.json",
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
			hidden: true,
			editable: true,
			formatter: 'number',
			formatoptions: {
				thousandsSeparator: ","
			}
		}, {
			name: 'qauotedPrice',
			hidden: true,
			editable: true,
			formatter: 'number',
			formatoptions: {
				thousandsSeparator: ","
			}
		}],
		caption: '投保险种列表',
		rowNum:20, 
		pager: '#verify-scheme-pager', 
		height: '100%'
	});
}
