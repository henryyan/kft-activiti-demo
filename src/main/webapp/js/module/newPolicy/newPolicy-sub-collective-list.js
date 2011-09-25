
/**
 * 加载列表
 * 字段：客户编码、公司名称、法人代表、客户来源、注册资本、公司地址、投保、备注、联系人、编制文档
 * @return
 */
function listSubCollectiveDatas(size, companyId){
    $("#subCollectiveList").jqGrid($.extend($.common.plugin.jqGrid.settings({
        size: size,
		pager: '#subCollectivePager'
    }), {
        url: ctx + '/js/module/newPolicy/newPolicy-sub-collective-data-' + companyId + '.json',
        colNames: [ '投保单号', '企业名称', '法人代表', '性别', '企业性质', '公司地址', '备注', '审核', '编制文档'],
        colModel: [{
            name: 'policyNum',
            align: 'center',
            width: 80,
            editable: true
        }, {
            name: 'Co-name',
			width: 100,
			align: 'center',
            editable: true,
            edittype: 'text'
        }, {
            name: 'cpaMan',
			width: 80,
			align: 'center',
            editable: true
        }, {
            name: 'sex',
			width: 80,
			align: 'center',
            editable: true,
            formatter: function(cellvalue, options, rowObject){
				if(cellvalue == 0){
					return '男';
				}else{
					return '女';
				}
			}
        }, {
            name: 'cpaProperty',
			width: 80,
			align: 'center',
            editable: true
        },{
            name: 'address',
			width: 80,
			align: 'center',
            editable: true,
            edittype: 'text'
        },{
			name: 'remark',
			align:'center',
			width: 60,
			editable: true,
			edittype: 'textarea'
		},{
			name: 'verify',
			width: 50,
			align: 'center',
			formatter: function(cellvalue, options, rowObject) {
				if (cellvalue == 'true') {
					return "<img src='" + ctx + "/images/tip/ok.gif'/>";
				} else if (cellvalue == 'false') {
					return "<img src='" + ctx + "/images/tip/err.gif'/>";
				} else {
					if(role == 'businessManager'){
						return "<button class='ui-button-notext verify-ok' title='审核保单--通过' rowId='" + options.rowId + "'></button>"
						+ "<button class='ui-button-notext verify-fail' title='审核保单--不通过' rowId='" + options.rowId + "'></button>";
					}
					if(role == 'businessMan'){
						return "<button class='submit'></button>";
					}
					
				}
			}
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
        caption: "[集体-新保投保]管理列表",
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

			//审核操作
			$('.verify-ok').button({
		        icons: { primary: 'ui-icon-check' }
		    }).unbind('click').click(verifyOk);
			
			$('.verify-fail').button({
				icons: { primary: 'ui-icon-close' }
			}).unbind('click').click(verifyFail);;
			
		
			//提交审核操作
			$(".submit").button({
				icons: {primary: 'ui-icon-mail-closed',secondary:'ui-icon-person'}
			}).addClass('ui-button-notext-secondary').click(submitVerify);
			
			//新增
			$('#add_subCollectiveList').unbind('click').click(showDetailDialog);
			//编辑
			$('#edit_subCollectiveList').unbind('click').click(function() {
				var selRowId = $("#subCollectiveList").jqGrid('getGridParam','selrow');
				if (selRowId) {
					showDetailDialog();
				} else {
					alert('请先选择记录！');
				}
			});
			
			
			verifyRole();
		},
        subGrid: true,
        subGridRowExpanded: function(subgrid_id, row_id){
            var rowNumberCounter = 1;
            var subgrid_table_id, pager_id;
            subgrid_table_id = subgrid_id + "_t";
            pager_id = "p_" + subgrid_table_id;
            $("#" + subgrid_id).html("<table id='" + subgrid_table_id + "' class='scroll'></table><div id='" + pager_id + "' class='scroll'></div>");
            $("#" + subgrid_table_id).jqGrid({
                url: ctx + "/js/module/customer/customer-person-trace-data.json",
                datatype: "json",
                colNames: ['序号', '沟通时间', '沟通方式', '沟通内容', '沟通结果'],
                colModel: [{
                    name: 'rowNumber',
                    width: 20,
                    align: 'center',
                    formatter: function(){
                        return rowNumberCounter++;
                    }
                }, {
                    name: 'traceTime',
                    editable: true,
                    editoptions: {
                        dataInit: function(elem){
                            $(elem).addClass('Wdate').attr('readonly', true).focus(function(){
                                WdatePicker({
                                    dateFmt: 'yyyy-MM-dd HH:mm'
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
                        dataInit: function(elem){
                            $(elem).val($.common.code.htmlDecode($(elem).val()));
                        }
                    },
                    formatter: function(cellvalue){
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
                        dataInit: function(elem){
                            $(elem).val($.common.code.htmlDecode($(elem).val()));
                        }
                    },
                    formatter: function(cellvalue){
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
                afterEditCell: function(id, name, val, iRow, iCol){
                    // Ctrl + Enter 保存
                    $("#" + iRow + "_" + name).keypress(function(e){
                        if (e.ctrlKey && (e.which == 13 || e.which == 10)) {
                            $('#' + subgrid_table_id).jqGrid('saveCell', iRow, iCol);
                        }
                    }).blur(function(){ // 失去焦点自动保存
                        $('#' + subgrid_table_id).jqGrid('saveCell', iRow, iCol);
                    });
                },
                rowNum: 20,
                pager: pager_id,
                height: '100%',
                width: $("#" + subgrid_table_id).parent().width() * 0.9
            }).jqGrid('navGrid', "#" + pager_id, $.extend($.common.plugin.jqGrid.pager, {
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
    })).jqGrid('navGrid', '#subCollectivePager', $.extend($.common.plugin.jqGrid.pager, {}),    // edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
        width: 500,
        editCaption: '编辑客户',
        reloadAfterSubmit: false,
        beforeShowForm: commonBeforeShowForm,
        beforeSubmit: beforeSubmit
    }),    // add options
    $.extend($.common.plugin.jqGrid.form.add, {
        width: 500,
        addCaption: '添加客户',
        reloadAfterSubmit: false,
        beforeShowForm: commonBeforeShowForm,
        beforeSubmit: beforeSubmit
    }),    // delete options
    $.extend($.common.plugin.jqGrid.form.remove, {
        url: ctx + '/common/return-true.action',
        reloadAfterSubmit: false
    }),    // search optios
    $.extend($.common.plugin.jqGrid.form.search, {}),    // view options
    $.extend($.common.plugin.jqGrid.form.view, {
        beforeShowForm: function(formid){
            $.common.plugin.jqGrid.navGrid.showAllField(formid);
        }
    }));
    
}

/**
 * 审核保单
 * 审核通过
 */
function verifyOk() {
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

//审核不通过
function verifyFail() {
	var theButton = $(this);
	var theTd = $(this).parent('td');
	
	var rowId = $(this).attr('rowId');
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

//提交审核
function submitVerify(){
	var theButton = $(this);
	var theTd = $(this).parent('td');
	$('<div/>', {
		align: 'center',
		title: '提交审核',
		html: '您确定要提交吗?'
	}).dialog({
		buttons: {
			确定: function(){
				$(theButton).remove();
				$(theTd).append("<img src='" + ctx + "/images/tip/ok.gif'/>");
				$(this).dialog("close");
			},
			取消: function(){
				$(this).dialog(close);
			}
		}
	});
}


/**
 * 显示新增、编辑表单前处理
 * @param {Object} formid
 */
function commonBeforeShowForm(formid){
    // 注册表单验证事件
    validatorForm();
    $('tr.FormData[id]').show();
    $('.CaptionTD').width(70);
}

/**
 * 提交表单前
 */
function beforeSubmit(){
    var valid = $("#FrmGrid_list").valid();
    return [valid, '表单有 ' + validator.numberOfInvalids() + ' 项错误，请检查！'];
}

/**
 * 表单验证
 *
 * @return
 */
function validatorForm(){
    validator = $("#FrmGrid_list").validate({
        rules: {
            name: {
                required: true
            },
            level: {
                required: true
            },
            majorBusiness: {
                required: true
            },
            customerManager: {
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

//角色控制
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

//显示 保单对话框
function showDetailDialog() {
	var theButton = $(this);
	var theTd = $(this).parent('td');
	$("#insure").dialog({
		title:'填写投保单',
		width:800,
		modal: true,
		height:document.documentElement.clientHeight - 15,
		align: 'center',
		open: function(event, ui){
			
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

//填写保单
function selectInsuranceType(){
		if($(".insuranceType2").val() == '天平人寿保险有限公司' ||
		  $(".insuranceType2").val() == '上海安国人寿保险有限公司' ||
		  $(".insuranceType2").val() == '太平洋人寿保险有限公司' ||
		  $(".insuranceType2").val() == '上海安普信人寿保险有限公司'){

	$(".insuranceType1").html(
		"<option>医疗险 </option><option>重大疾病险</option><option>医疗险</option><option>附加住院险</option>");
		$('.InsuranceReport').show();
	}
}