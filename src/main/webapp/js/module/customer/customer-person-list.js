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
		url: ctx + '/js/module/customer/customer-person-data.json',
		colNames: ['客户编码', '客户名称', '客户来源', '联系人', '联系电话', '联系传真',
					'地址', 'Email', '是否大客户', '潜在客户', '投保','备注', '输入员','编制文档'],
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
			name: 'source',
			align: 'center',
			width: 80,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'contact',
			align: 'center',
			width: 80,
			editable: true
		}, {
			name: 'phone',
			align: 'center',
			width: 120,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'fax',
			align: 'center',
			width: 120,
			editable: true
		}, {
			name: 'address',
			align: 'center',
			editable: true
		}, {
			name: 'email',
			align: 'center',
			editable: true
		}, {
            name: 'isBigCustomer',
            align: 'center',
            width: 120,
            editable: true,
            edittype: 'select',
            editoptions: {
	            value:{
	            	'true':'是',
	            	'false':'否'
	            }
	        },
	        formatter: function(cellvalue, options, rowObject) {
        		if(cellvalue == true || cellvalue == 'true'){
        			return " 是 "+" <button class='notifyLeader'></button> ";
        		}else{
        			return " 否 ";
        		}
        	}
        },{
        	name: 'potential',
            align: 'center',
            width: 80,
            editable: true,
	        formatter: function(cellvalue, options, rowObject) {
        		if(cellvalue == '' || cellvalue == null ){
        			return "<button class='markPotential'></button> ";
        		}else{
        			return "<img class='potentialed' src='" + ctx + "/images/product/person.png' title='" + rowObject.potential + "'/>";
        		}
        	}
        },{
        	name: 'insure',
            align: 'center',
            width:80,
            editable: true,
	        formatter: function(cellvalue, options, rowObject) {
        		if(cellvalue == 'true' || cellvalue == true ){
        			return "已投保";
        		}else{
        			return "<button class='insureButton'></button>";
        		}
        	}
        },{
			name: 'remark',
			align: 'center',
			hidden:true,
			edittype: 'textarea',
			editable: true,
			editoptions: {
				cols: 19
			}
		}, {
			name: 'putin',
			editable: true,
			align: 'center'
		},{
			name: 'documents',
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
		caption: "[客户-个人]管理列表",
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
			
			$('.insureButton').button({
				icons: {primary: 'ui-icon-document'}
			}).addClass('ui-button-notext').click(fillInsureInfo);
			
			$(".potentialed").qtip();
			$('.notifyLeader').button({
				icons: {primary: 'ui-icon-mail-closed',secondary:'ui-icon-person'}
			}).addClass('ui-button-notext-secondary').click(function() {
				var theButton = $(this);
				var theTd = $(this).parent('td');
				$('<div/>', {
					align:'center',
					title:'请确认',
					html: '客户： ' + $(theButton).parent('td').prev().prev().prev().prev().prev().prev().prev().text() + ' 是否请求领导支持？ '
				}).dialog({
					buttons:{
						确认:function(){
							$(theButton).remove();
							$(theTd).append("<img src='" + ctx + "/images/tip/ok.gif'/>");
							$(this).dialog("close");
						},
						取消:function(){
							$(this).dialog("close");
						}
					}
				});
			});
			$('.markPotential').button({
				icons:{primary: 'ui-icon-flag'}
			}).addClass('ui-button-notext').click(function() {
				var theButton = $(this);
				var theTd = $(this).parent('td');
				$('<div/>', {
					align:'center',
					title:'标记潜在客户',
					html: "<textarea rows='12' cols='30' class='potentialText'>有投保意向</textarea>"
				}).dialog({
					width:420,
					height:360,
					buttons:{
						确认:function(){
							$(theButton).remove();
							$(theTd).append("<img class='potentialTip' src='" + ctx + "/images/product/person.png' title='" + $.common.code.htmlEncode($(this).find("textarea").val()) + "' />");
							$(theTd).find("img").qtip();
							$(this).dialog("close");
						},
						取消:function(){
							$(this).dialog("close");
						}
					}
				});
			});
			verifyRole();
		},
		subGrid: true,
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

function selectInsuranceType(){
	if($(".insuranceType1").val() == '车险'){
		$(".lifeRisk").hide();
		$(".financialRisk").hide();
		$(".carRisk").show();
		$(".insuranceType2").html("<option>车险1</option><option>车险2</option><option>车险3</option>");
	}else if($(".insuranceType1").val() == '寿险'){
		$(".carRisk").hide();
		$(".financialRisk").hide();
		$(".lifeRisk").show();
		$(".insuranceType2").html("<option>寿险1</option><option>寿险2</option><option>寿险3</option>");
	}else if($(".insuranceType1").val() == '财险'){
		$(".lifeRisk").hide();
		$(".carRisk").hide();
		$(".financialRisk").show();
		$(".insuranceType2").html("<option>财险1</option><option>财险2</option><option>财险3</option>");
	}else {
		$(".insuranceType2").html("<option>---请选择---</option>");
		$(".carRisk").hide();
		$(".lifeRisk").hide();
		$(".financialRisk").hide();
	}
}

function fillInsureInfo() {
	var theButton = $(this);
	var theTd = $(this).parent('td');
	$("#insure").dialog({
		title:'填写保单',
		width:800,
		modal: true,
		height:document.documentElement.clientHeight - 15,
		align: 'center',
		open: function(event, ui){
			$(".insuranceType1 option:eq(0)").attr("selected",true);
			selectInsuranceType();
			$("#insure input").val("");
			$(".date").datepicker();
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