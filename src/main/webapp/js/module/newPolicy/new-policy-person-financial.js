/**
 * 客户管理列表Javascript
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

var moduleAction = 'customer/customer';

/**
 * 加载列表
 * 字段：客户编码、客户名称、客户来源、联系人、联系电话、联系传真、地址、Email、是否大客户、潜在客户、备注、输入员、编制文档
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: ctx + '/js/module/newPolicy/new-policy-person-financial.json',
		colNames: ['客户姓名', '客户编码','投保单号','客户性别','手机号','地址','邮箱','审核','投保方案'],
        colModel: [{
			name: 'name',
			align: 'center',
			width: 80,
			editable: true
		},{
			name: 'code',
			align: 'center',
			width: 80,
			editable: true
		}, {
        	name: 'number',
            align: 'center',
            width: 80,
            editable: true
        },{
        	name: 'sex',
            align: 'center',
            width:80,
            editable: true
        }, {
        	name: 'phone',
			align: 'center',
			width: 80,
			editable: true
        },{
        	name: 'address',
			align: 'center',
			width: 80,
			editable: true
        },{
        	name: 'email',
			align: 'center',
			width: 80,
			editable: true
        },{
        	name: 'status',
			width: 60,
			align: 'center',
			formatter: function(cellvalue, options, rowObject) {
				if (cellvalue == 'toVerify') {
					if(role == 'businessManager'){
						return "<button class='confirm'></button>" + "<button class='negative'></button>";
					}else if(role == 'businessMan'){
						return "审核中";
					}
					return "";
				} else if (cellvalue == 'verifyTrue') {
					if(role == 'businessManager' || role == 'businessMan'){
						return "<img src='" + ctx + "/images/tip/ok.gif'/>";
					}
					return "";
				} else if(cellvalue == 'verifyFalse'){
					if(role == 'businessManager' || role == 'businessMan'){
						return "<img src='" + ctx + "/images/tip/err.gif'/>";
					}
					return "";
				}else {
					if(role == 'businessMan'){
						return "<button class='toVerify'></button>";
					}
					return "";
				}
			}
        },{
			name: 'scheme',
			width: 70,
			align: 'center',
			formatter: function(cellvalue, options, rowObject) {
				if (!isNaN(cellvalue) && cellvalue > 0) {
					return "<a href='#' class='affix' rowId='" + options.rowId + "'>" + cellvalue + "个</a>";
				} else {
					return "";
				}
			}
		}],
		caption: "[新保-财险-个人]管理列表",
		editurl: ctx + '/common/return-true.action',
		gridComplete: function() {
			$('.affix').unbind('click').click(function() {
				var srcEle = this;
				var customerName = $('#' + $(srcEle).attr('rowId')).find('td:eq(3)').text();
				$('#affixTemplate').dialog({
					title: '文档附件',
					open: function() {
						$('.weboffice').click(function() {
							var backUrl  = location.href;
							var openurl = ctx + '/common/activex/iweboffice/DocumentEdit.jsp?FileType=.doc&UserName=aa&backUrl=' + backUrl;
							window.open(openurl,"", "left=50,top=50,height=550, width=1020, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no");
						});
					}
				});
			});
			
			$(".toVerify").button({
				icons: {primary: 'ui-icon-mail-closed',secondary:'ui-icon-person'}
			}).addClass('ui-button-notext-secondary').click(toVerify);
			
			$(".confirm").button({
				icons: {primary: 'ui-icon-check'}
			}).addClass('ui-button-notext').click(confirm);
			
			$(".negative").button({
				icons: {primary: 'ui-icon-closethick'}
			}).addClass('ui-button-notext').click(negative);
			
			$('#add_list').unbind('click').click(showDetailDialog);
			
			$('#edit_list').unbind('click').click(function() {
				var selRowId = $("#list").jqGrid('getGridParam','selrow');
				if (selRowId) {
					showDetailDialog();
				} else {
					alert('请先选择记录！');
				}
			});
			
			$('#view_list').unbind('click').click(showDetailDialog);
			
			verifyRole();
		},
		subGrid: false,
		subGridRowExpanded: function(subgrid_id, row_id){
			var rowNumberCounter = 1;
			var subgrid_table_id, pager_id;
			subgrid_table_id = subgrid_id+"_t";
			pager_id = "p_"+subgrid_table_id;
			$("#"+subgrid_id).html("<table id='"+subgrid_table_id+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div>");
			$("#"+subgrid_table_id).jqGrid({
				url: ctx + "/js/module/customer/customer-person-trace-data.json",
				datatype: "json", 
				colNames: ['序号', '沟通时间', '沟通方式', '沟通内容', '沟通结果','复核人','与会者'], 
				colModel: [{
					name: 'rowNumber',
					width: 20,
					align: 'center',
					formatter: function() {
						return rowNumberCounter++;
					}
				}, {
					name: 'traceTime',
					align: 'center',
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
					align: 'center',
					formoptions: {
		            	elmsuffix: $.common.plugin.jqGrid.form.must
		            }
				}, {
					name: 'interosculateWay',
					align: 'center',
					width: 100,
					editable: true,
					formoptions: {
		            	elmsuffix: $.common.plugin.jqGrid.form.must
		            }
				}, {
					name: 'traceContent',
					align: 'center',
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
					align: 'center',
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
				},{
					name: 'fuheren',
					align: 'center',
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
				},{
					name: 'yuhuiren',
					align: 'center',
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

/**
 * 身份验证
 */
function verifyRole(){
	if(role == 'systemManager'){
		
	} else if(role == 'martMan'){
		
	} else if(role == 'businessManager'){
		$(".markPotential").hide();
		$(".notifyLeader").hide();
	} else if(role == 'businessMan'){
		$(".markPotential").hide();
		$(".notifyLeader").hide();
	} else{
		$(".markPotential").hide();
		$(".notifyLeader").hide();
	}
}

/**
 * 新增/编辑对话框
 */
function showDetailDialog() {
	var theButton = $(this);
	var theTd = $(this).parent('td');
	$("#insure").dialog({
		title:'填写保单',
		width:900,
		modal: true,
		height:document.documentElement.clientHeight - 15,
		align: 'center',
		open: function(event, ui){
			$(".financialRisk").show();
			$("#insure input").val("");
			$(".date").datepicker();
			autoCompleteForm();
		},
		buttons:{
			确认:function(){
				$(theButton).remove();
				$(theTd).text("已投保");
				$(this).dialog("close");
			},
			取消:function(){
				$(this).dialog("close");
			}
		}
	});
}

/**
 * 表单自动填充
 */
function autoCompleteForm(){
	var names = [
	    "李一",
	    "李二",
	    "李三",
	    "李四",
	    "李五",
	    "李六"
	    ];
	var liyi = {
		"李一":{
			code:"999",
			number:"1930491",
			sex:"男",
			phone:"13304958606",
			address:"李家村1号",
			email:"liyi@gmail.com"
		}
	};
	var lier = {
		"李二":{
			code:"888",
			number:"1930491",
			sex:"女",
			phone:"13304953306",
			address:"李家村2号",
			email:"lier@gmail.com"
		}
	};
	var lisan = {
		"李三":{
			code:"777",
			number:"1930491",
			sex:"男",
			phone:"13304958080",
			address:"李家村3号",
			email:"lisan@gmail.com"
		}
	};
	var lisi = {
		"李四":{
			code:"666",
			number:"1930491",
			sex:"女",
			phone:"13304959000",
			address:"李家村4号",
			email:"lisi@gmail.com"
		}
	};
	$("#name").autocomplete({
		source: names,
		select: function(event, ui) {
			var personName = ui.item.value;
			$("#name1").val(personName);
			if(personName == '李一'){
				var personInfo = liyi[personName];
			 	$.each(personInfo, function(i, v) {
			 		$('#' + i).val(v);
			 		$('.' + i).val(v);
			 	});
			}else if(personName == '李二'){
				var personInfo = lier[personName];
			 	$.each(personInfo, function(i, v) {
			 		$('#' + i).val(v);
			 		$('.' + i).val(v);
			 	});
			}else if(personName == '李三'){
				var personInfo = lisan[personName];
			 	$.each(personInfo, function(i, v) {
			 		$('#' + i).val(v);
			 		$('.' + i).val(v);
			 	});
			}else if(personName == '李四'){
				var personInfo = lisi[personName];
			 	$.each(personInfo, function(i, v) {
			 		$('#' + i).val(v);
			 		$('.' + i).val(v);
			 	});
			}else{
				
			}
		}
	});
}

/**
 * 提交审核
 * */
function toVerify(){
	var theButton = $(this);
	var theTd = $(this).parent('td');
	$('<div/>', {
		align:'center',
		title:'请确认',
		html: '确认要提交审核么？'
	}).dialog({
		buttons:{
			确认:function(){
				$(theButton).remove();
				$(theTd).append("审核中");
				$(this).dialog("close");
			},
			取消:function(){
				$(this).dialog("close");
			}
		}
	});
}

/**
 * 审核通过
 */
function confirm() {
	var theButton = $(this);
	var theTd = $(this).parent('td');
	$('<div/>', {
		align:'center',
		title:'请确认',
		html: '确认要通过审核么？'
	}).dialog({
		buttons:{
			确认:function(){
				$(theTd).find("button").remove();
				$(theTd).append("<img src='" + ctx + "/images/tip/ok.gif'/>");
				$(this).dialog("close");
			},
			取消:function(){
				$(this).dialog("close");
			}
		}
	});
}

/**
 * 审核不通过
 * */
function negative() {
	var theButton = $(this);
	var theTd = $(this).parent('td');
	$('#unVerifyTemplate').dialog({
		buttons:{
			确认:function(){
				$(theTd).find("button").remove();
				$(theTd).append("<img src='" + ctx + "/images/tip/err.gif'/>");
				$(this).dialog("close");
			},
			取消:function(){
				$(this).dialog("close");
			}
		}
	});
}

/**
 * 保险类型级联
 */
function selectCompany(){
	if($(".insuranceCompany").val() == "太平洋保险公司"){
		$(".riskType").html("<option>太保财产综合险 </option>");
	}else if($(".insuranceCompany").val() == "平安保险公司"){
		$(".riskType").html("<option>平安财产基本险  </option>");
	}else{
		
	}
}