/**
 * 客户管理列表Javascript
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

var moduleAction = 'customer/customer';
/**
 * 加载列表
 * 字段：客户编码、公司名称、客户来源、法人代表、客户来源、企业性质、是否大客户、潜在客户、注册资本、公司地址、备注、联系人
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: ctx + '/js/module/customer/customer-cpaPerson-data.json',
		colNames: ['客戶編碼', '公司名称', '法人代表', '客户来源', '企业性质', '是否大客户', '潜在客户','投保', '注册资本', '公司地址', '备注', '联系人'],
		colModel: [{
			name: 'Co-Num',
			align: 'center',
			width: 80,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		},{
			name: 'Co-name',
			align: 'center',
			editable: true,
			width: 80,
			edittype: 'text'
		},{
			name: 'cpaMan',
			align: 'center',
			width: 80,
			editable: true
		},{
			name: 'source',
			align: 'center',
			editable: true,
			width: 80,
			edittype: 'text'
		},{
			name: 'cpaProperty',
			align: 'center',
			editable: true,
			width: 80,
			edittype: 'select',
			editoptions: {
				value: {
					"1": "国有独资公司",
					"2": "股份有限公司",
					"3": "责任有限公司",
					"4": "个人有限公司",
					"5": "中外合资企业"
				}
			}
		},{
			name: 'bigClient',
			align: 'center',
			editable: true,
			edittype: 'select',
			width: 80,
			editoptions: {
				value: {
					"0": '是',
					"1": '否'
				}
			},
			formatter : 
        		function(cellvalue,options,cellobject){
				if(cellvalue == null
						|| cellvalue == 'null'
						|| cellvalue == 0) return "是"  + " <button class='notifyLeader'></button> ";
				return "否";
			}
		},{
			name: 'latencyClient',
			align: 'center',
			editable: true,
			width: 80,
			formatter: function(cellvalue, options, rowObject) {
        		if(cellvalue == '' || cellvalue == null ){
        			return "<button class='markPotential'></button> ";
        		}else{
        			return "<img class='potentialed' src='" + ctx + "/images/product/person.png' title='" + rowObject.latencyClient + "'/>";
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
			name: 'loginCap',
			align: 'center',
			editable: true,
			width: 80,
			edittype: 'text'
		},{
			name: 'address',
			align: 'center',
			editable: true,
			width: 80,
			edittype: 'textarea'
		},{
			name: 'remark',
			align: 'center',
			editable: true,
			width: 80,
			edittype: 'textarea'
		},{
			name: 'linkman',
			align: 'center',
			width: 80,
			editable: false,
			formatter: function(cellvalue, options, rowObject) {
				return "<span class='contact-list'>共 <a href='#'>" + cellvalue + " </a>个</span>";
			}
		}],
		caption: "[客户-企业]管理列表",
		editurl: ctx + '/common/return-true.action',
		gridComplete: function() {
			$('.contact-list').click(function(){
				$('#contactTemplate').dialog({
					modal: true,
					position: 'top',
					height: 260,
					width: $('body').width() * 0.9,
					open: function(){
						showPersonList({
							width: $('#contactTemplate').width(),
							height: '100%'
						});
					}
				});
			});
			
			$('.insureButton').button({
				icons: {primary: 'ui-icon-document'}
			}).addClass('ui-button-notext').click(fillInsureInfo);
			
			//潜在客户按钮操作
			$(".potentialed").qtip();
			$('.markPotential').button({
				icons:{primary: 'ui-icon-flag'}
			}).addClass('ui-button-notext').click(function(){
				var theButton = $(this);
				var theTd = $(this).parent('td');
				$('<div/>', {
					align:'center',
					title:'标记潜在客户',
					html: "<textarea rows='3' cols='36' class='potentialText'>有投保意向</textarea>"
				}).dialog({
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
			//大客户操作
			$('.notifyLeader').button({
				icons: {primary: 'ui-icon-mail-closed',secondary:'ui-icon-person'}
			}).addClass('ui-button-notext-secondary').click(function() {
				var theButton = $(this);
				var theTd = $(this).parent('td');
				$('<div/>', {
					align:'center',
					title:'请确认',
					html: '客户： ' + $(theButton).parent('td').prev().prev().prev().text() + ' 是否要请求领导支持？ '
				}).dialog({
					buttons:{
						确定:function(){
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
	})).jqGrid( '#pager');
	
}


function showPersonList(size) {
	$("#scheme-list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({
			size: size,
			pager: '#scheme-pager'
		}), {
		url: ctx + '/js/module/customer/customer-contactPerson-data.json',
		colNames: ['联络人名称', '办公电话', '手机', 'Email', '重要日期', '爱好', '职位', '是否负责人', '备注'],
        colModel: [{
			name: 'Co-Name',
			align: 'center',
			editable: true,
			edittype: 'text',
			width: 60,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'Co-Num',
			align: 'center',
			width: 60,
			editable: true,
			edittype: 'text'
		}, {
			name: 'Phone',
			align: 'center',
			width: 60,
			editable: true,
			edittype: 'text'
		}, {
			name: 'Email',
			align: 'center',
			width: 80,
			editable: true,
			edittype: 'text',
			formatter: 'email',
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}, {
			name: 'importDate',
			align: 'center',
			width: 80,
			editable: true,
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            },
            editoptions: {
				dataInit: function(elem) {
					$(elem).addClass('Wdate').attr('readonly', true).focus(function() {
	    				WdatePicker();
	    			});
				}
			}
		}, {
			name: 'favorite',
			width: 60,
			align: 'center',
			editable: true,
			edittype: 'textarea'
		}, {
			name: 'title',
			align: 'center',
			editable: true,
			width: 80
		}, {
			name: 'principal',
			width: 70,
			editable: true,
			edittype: 'select',
			editoptions: {
				value: {
					"0": '是',
					"1": '否'
				}
			}
		}, {
			name: 'remark',
			width: 60,
			editable: true,
			edittype: 'textarea',
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
		}],
		caption: "[企业法人]-联系人列表"
	})).jqGrid('navGrid', '#scheme-pager', $.extend($.common.plugin.jqGrid.pager, {
	}), 
	// edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
		width : 500,
		editCaption: '编辑联系人',
		reloadAfterSubmit: false,
		beforeShowForm: commonBeforeShowForm,
    	beforeSubmit: beforeSubmit
	}),
	
	// add options
    $.extend($.common.plugin.jqGrid.form.add, {
		width : 500,
		addCaption: '添加联系人',
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
	})).jqGrid('#pager');
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

function selectInsuranceType(){
	if($(".insuranceType1").val() == '车险'){
		$(".financialRisk").hide();
		$(".carRisk").show();
		$(".insuranceType2").html("<option>车险1</option><option>车险2</option><option>车险3</option>");
	}else if($(".insuranceType1").val() == '财险'){
		$(".carRisk").hide();
		$(".financialRisk").show();
		$(".insuranceType2").html("<option>财险1</option><option>财险2</option><option>财险3</option>");
	}else {
		$(".insuranceType2").html("<option>---请选择---</option>");
		$(".carRisk").hide();
		$(".financialRisk").hide();
	}
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