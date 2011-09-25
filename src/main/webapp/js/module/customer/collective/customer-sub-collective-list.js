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
        url: ctx + '/js/module/customer/collective/customer-sub-collective-data-' + companyId + '.json',
        colNames: ['客戶編碼', '公司名称', '法人代表', '客户来源', '注册资本', '公司地址', '投保', '备注', '联系人', '编制文档'],
        colModel: [{
            name: 'Co-Num',
            align: 'center',
            width: 80,
            editable: true,
            formoptions: {
                elmsuffix: $.common.plugin.jqGrid.form.must
            }
        }, {
            name: 'Co-name',
            editable: true,
            edittype: 'text'
        }, {
            name: 'cpaMan',
            editable: true
        }, {
            name: 'source',
            editable: true,
            edittype: 'text'
        }, {
            name: 'loginCap',
            editable: true,
            edittype: 'text'
        }, {
            name: 'address',
            editable: true,
            edittype: 'text'
        }, {
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
            editable: true,
            edittype: 'textarea'
        }, {
            name: 'linkman',
            width: 70,
            editable: true,
            edittype: 'text',
            formatter: function(cellvalue, options, rowObject){
                return "<span class='contact-list'>共 " + cellvalue + " 个</span>";
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
        caption: "[集体客户]管理列表",
        editurl: ctx + '/common/return-true.action',
        gridComplete: function(){
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
			//投保按钮操作
			$('.insureButton').button({
				icons: {primary: 'ui-icon-document'}
			}).addClass('ui-button-notext').click(function(){
				var theButton = $(this);
				var theTd = $(this).parent('td');
				$('#insure').dialog({
					width: 600,
					height: document.documentElement.clientHeight - 15,
					modal: true,
					open: function() {
			// 按钮图标
			$.common.plugin.jqui.dialog.button.setIcons({
				保存: {primary: 'ui-icon-disk'},
				取消: {primary: 'ui-icon-cancel'}
			});
			$('#list').jqGrid('GridToForm', selRowId, "#companyForm");
					},
					buttons: [{
			text: '保存',
			click: function() {
				$('#list').jqGrid('FormToGrid', 4, "#companyForm", "add");
				$(this).dialog('close');
			}
		}, {
			text: '取消',
			click: function() {
				$(this).dialog('close');
			}
		}]
				});
			});
			
		//编制文档操作
			$('.affix').unbind('click').click(function() {
				var srcEle = this;
				var customerName = $('#' + $(srcEle).attr('rowId')).find('td:eq(3)').text();
				$('#affixTemplate').dialog({
					title: '编制文档附件',
					modal: true,
					open: function() {
						$('.weboffice').click(function() {
							var backUrl  = location.href;
							var openurl = ctx + '/common/activex/iweboffice/DocumentEdit.jsp?FileType=.doc&UserName=aa&backUrl=' + backUrl;
							window.open(openurl,"", "left=50,top=50,height=550, width=1020, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no");
						});
					}
				});
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
		caption: "[企业法人]-联系人列表",
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
		}
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

//填写保单
function selectInsuranceType(){
	
		if($(".insuranceType2").val() == '天平汽车保险有限公司' ||
		  $(".insuranceType2").val() == '太平洋人寿保险有限公司' ||
		  $(".insuranceType2").val() == '上海安国保险有限公司' ||
		  $(".insuranceType2").val() == '上海安普信保险有限公司') {

	$(".insuranceType1").html(
		"<option>团体意外险</option><option>附加住院补贴险</option><option>团体医疗险</option><option>团体重大疾病险</option>");

		$('.InsuranceReport').show();
	}
		
}
