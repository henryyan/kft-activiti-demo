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
    $("#list").jqGrid($.extend($.common.plugin.jqGrid.settings({
        size: size
    }), {
        url: ctx + '/js/module/newPolicy/new-policy-person-life.json',
        colNames: ['客户姓名', '客户编码', '投保单号', '客户性别', '手机号', '地址', '邮箱', '附件'],
        colModel: [{
            name: 'name',
            align: 'center',
            width: 80,
            editable: true
        }, {
            name: 'code',
            align: 'center',
            width: 80,
            editable: true
        }, {
            name: 'number',
            align: 'center',
            width: 80,
            editable: true
        }, {
            name: 'sex',
            align: 'center',
            width: 80,
            editable: true
        }, {
            name: 'phone',
            align: 'center',
            width: 80,
            editable: true
        }, {
            name: 'address',
            align: 'center',
            width: 80,
            editable: true
        }, {
            name: 'email',
            align: 'center',
            width: 80,
            editable: true
        }, {
            name: 'affix',
            width: 70,
            align: 'center',
            formatter: function(cellvalue, options, rowObject) {
                if (!isNaN(cellvalue) && cellvalue > 0) {
                    return "<a href='javascript:;' class='affix' rowId='" + options.rowId + "'>" + cellvalue + "个</a>";
                }
            }
        }],
        caption: "[新保-寿险-个人]管理列表",
        editurl: ctx + '/common/return-true.action',
        gridComplete: function() {
            // 附件上传
            $('.affix').unbind('click').click(showAffixDialog);
            
            $('#add_list').unbind('click').click(showDetailDialog);
            
            $('#edit_list').unbind('click').click(function() {
                var selRowId = $("#list").jqGrid('getGridParam', 'selrow');
                if (selRowId) {
                    showDetailDialog();
                } else {
                    alert('请先选择记录！');
                }
            });
            
            $('#view_list').unbind('click').click(showDetailDialog);
            
            verifyRole();
            
            // 生成投保方案
            $('.effect-insurance').button({
                icons: {
                    primary: 'ui-icon-document'
                }
            }).addClass('ui-button-notext').click(effectInsurance);
        },
        subGrid: true,
        subGridRowExpanded: subInquirAndQuoteGrid
    })).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {}), // edit options
 $.extend($.common.plugin.jqGrid.form.edit, {
        width: 500,
        editCaption: '编辑客户',
        reloadAfterSubmit: false,
        beforeShowForm: commonBeforeShowForm,
        beforeSubmit: beforeSubmit
    }), // add options
 $.extend($.common.plugin.jqGrid.form.add, {
        width: 500,
        addCaption: '添加客户',
        reloadAfterSubmit: false,
        beforeShowForm: commonBeforeShowForm,
        beforeSubmit: beforeSubmit
    }), // delete options
 $.extend($.common.plugin.jqGrid.form.remove, {
        url: ctx + '/common/return-true.action',
        reloadAfterSubmit: false
    }), // search optios
 $.extend($.common.plugin.jqGrid.form.search, {}), // view options
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

/**
 * 身份验证
 */
function verifyRole() {
    if (role == 'systemManager') {
    
    } else if (role == 'martMan') {
    
    } else if (role == 'businessManager') {
        $(".markPotential").hide();
        $(".notifyLeader").hide();
    } else if (role == 'businessMan') {
        $(".markPotential").hide();
        $(".notifyLeader").hide();
    } else {
        $(".markPotential").hide();
        $(".notifyLeader").hide();
    }
}

/**
 * 新增/编辑对话框
 */
function showDetailDialog() {
    $('#tabs').show().tabs({
        event: "mouseover"
    });
    var theButton = $(this);
    var theTd = $(this).parent('td');
    $("#tabTemplate").dialog({
        title: '填写保单',
        width: document.documentElement.clientWidth * 0.8,
        modal: true,
        height: document.documentElement.clientHeight - 15,
        align: 'center',
        open: function(event, ui) {
            $(".lifeRisk").show();
            $("#insure input").val("");
            $(".date").datepicker();
            autoComplete();
        },
        buttons: {
            确认: function() {
                $(theButton).remove();
                $(theTd).text("已投保");
                $(this).dialog("close");
            },
            取消: function() {
                $(this).dialog("close");
            }
        }
    });
    
    showInsuranceItemList();
}

function autoComplete() {
    var names = ["貂蝉", "西施", "王昭君", "杨玉环", "貂一", "西一", "王一", "杨一", "貂二", "西二", "王二", "杨二"];
    var diaochan = {
        "貂蝉": {
            code: "999",
            number: "1930491",
            sex: "女",
            phone: "13304958606",
            address: "闭月街1号",
            email: "diaocan@gmail.com"
        }
    };
    var xishi = {
        "西施": {
            code: "888",
            number: "1930491",
            sex: "女",
            phone: "13304953306",
            address: "沉鱼街1号",
            email: "xishi@gmail.com"
        }
    };
    var wangzhaojun = {
        "王昭君": {
            code: "777",
            number: "1930491",
            sex: "女",
            phone: "13304958080",
            address: "落雁街1号",
            email: "wangzhaonjun@gmail.com"
        }
    };
    var yangyuhuan = {
        "杨玉环": {
            code: "666",
            number: "1930491",
            sex: "女",
            phone: "13304959000",
            address: "羞花街1号",
            email: "yangyuhuan@gmail.com"
        }
    };
    $("#name").autocomplete({
        source: names,
        autoFill: true,
        mustMatch: true,
        select: function(event, ui) {
            var personName = ui.item.value;
            $("#name1").val(personName);
            if (personName == '貂蝉') {
                var personInfo = diaochan[personName];
                $.each(personInfo, function(i, v) {
                    $('#' + i).val(v);
                    $('.' + i).val(v);
                });
            } else if (personName == '西施') {
                var personInfo = xishi[personName];
                $.each(personInfo, function(i, v) {
                    $('#' + i).val(v);
                    $('.' + i).val(v);
                });
            } else if (personName == '王昭君') {
                var personInfo = wangzhaojun[personName];
                $.each(personInfo, function(i, v) {
                    $('#' + i).val(v);
                    $('.' + i).val(v);
                });
            } else if (personName == '杨玉环') {
                var personInfo = yangyuhuan[personName];
                $.each(personInfo, function(i, v) {
                    $('#' + i).val(v);
                    $('.' + i).val(v);
                });
            } else {
            
            }
        }
    });
}

function toVerify() {
    var theButton = $(this);
    var theTd = $(this).parent('td');
    $('<div/>', {
        align: 'center',
        title: '请确认',
        html: '确认要提交审核么？'
    }).dialog({
        modal: true,
        buttons: {
            确认: function() {
                $(theButton).remove();
                $(theTd).append("审核中");
                $(this).dialog("close");
            },
            取消: function() {
                $(this).dialog("close");
            }
        }
    });
}

/**
 * 审核保单
 */
function confirm() {
    var theButton = $(this);
    var theTd = $(this).parent('td');
    $('<div/>', {
        align: 'center',
        title: '请确认',
        html: '确认要通过审核么？'
    }).dialog({
        modal: true,
        buttons: {
            确认: function() {
                $(theTd).find("button").remove();
                $(theTd).append("<img src='" + ctx + "/images/tip/ok.gif'/>");
                $(this).dialog("close");
            },
            取消: function() {
                $(this).dialog("close");
            }
        }
    });
}

function negative() {
    var theTd = $(this).parent('td');
    $('#unVerifyTemplate').dialog({
        modal: true,
        buttons: {
            确认: function() {
                $(theTd).find("button").remove();
                $(theTd).append("<img src='" + ctx + "/images/tip/err.gif'/>");
                $(this).dialog("close");
            },
            取消: function() {
                $(this).dialog("close");
            }
        }
    });
}

function selectCompany() {
    if ($(".insuranceCompany").val() == "太平洋保险公司") {
        $(".riskType").html("<option>太平美满两全险 </option>");
    } else if ($(".insuranceCompany").val() == "平安保险公司") {
        $(".riskType").html("<option>平安鸿利两全保险（分红型）  </option>");
    } else {
    
    }
}

/**
 * 询报价记录列表
 * @param {Object} subgrid_id
 * @param {Object} row_id
 */
function subInquirAndQuoteGrid(subgrid_id, row_id) {
    var rowNumberCounter = 1;
    var subgrid_table_id, pager_id;
    subgrid_table_id = subgrid_id + "_t";
    pager_id = "p_" + subgrid_table_id;
    $("#" + subgrid_id).html("<table id='" + subgrid_table_id + "' class='scroll'></table><div id='" + pager_id + "' class='scroll'></div>");
    $("#" + subgrid_table_id).jqGrid({
        url: ctx + "/js/module/customer/customer-person-life-price.json",
        datatype: "json",
        colNames: ['序号', '询价时间', '询价资料', '询价审核', '询价反馈资料', '报价时间', '报价资料', '报价审核', '备注'],
        colModel: [{
            name: 'rowNumber',
            width: 20,
            align: 'center',
            formatter: function() {
                return rowNumberCounter++;
            }
        }, {
            name: 'inquireDate',
            align: 'center',
            editable: true,
            editoptions: {
                dataInit: function(elem) {
                    $(elem).addClass('Wdate').attr('readonly', true).focus(function() {
                        WdatePicker({
                            dateFmt: 'yyyy-MM-dd'
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
            name: 'inquireDocs',
            align: 'center',
            formatter: function(cellvalue, options, rowObject) {
				var content = "";
                if (cellvalue != "") {
                    content += "<a href='javascript:;' class='weboffice'>" + cellvalue + "</a>";
                }
				if (rowObject[3] == 'true') {
					content += "<button class='inquire ui-button-notext-secondary'></button>";
				}
				return content;
            }
        }, {
            name: 'inquireVerify',
			width: 50,
            align: 'center',
            formatter: function(cellvalue, options, rowObject) {
                if (cellvalue == 'toVerify') {
                    if (role == 'businessManager') {
                        return "<button class='confirm ui-button-notext'></button>" + "<button class='negative ui-button-notext'></button>";
                    } else {
                        return "审核中";
                    }
                    return "";
                } else if (cellvalue == 'true') {
                    return "<img src='" + ctx + "/images/tip/ok.gif'/>";
                } else if (cellvalue == 'false') {
					return "<img src='" + ctx + "/images/tip/err.gif'/>";
                } else {
                    if (role == 'businessMan') {
                        var style = "display:" + (rowObject.scheme == '0' ? 'none' : "");
                        return "<button class='toVerify ui-button-notext-secondary' style='" + style + "'></button>";
                    }
                    return "";
                }
            }
        }, {
            name: 'inquireDocs',
            align: 'center',
            formatter: function(cellvalue, options, rowObject) {
                if (cellvalue == "") {
                    return "<a href='#'>上传</a>";
                } else {
                    return cellvalue;
                }
            }
        }, {
            name: 'quoteDate',
            align: 'center',
			width: 70,
            editable: true,
            editoptions: {
                dataInit: function(elem) {
                    $(elem).addClass('Wdate').attr('readonly', true).focus(function() {
                        WdatePicker({
                            dateFmt: 'yyyy-MM-dd'
                        });
                    });
                }
            }
        }, {
            name: 'quoteDocs',
            align: 'center',
            formatter: function(cellvalue, options, rowObject) {
                if (rowObject[5] == 'false') {
                    return "";
                }
				var content = "";
				var style = "";
                if (cellvalue == undefined) {
                    return "";
                } else {
					content += "<a class='weboffice'>" + cellvalue + "</a>";
				}
				if (!rowObject[7]) {
					style += 'display:none';
				}
                content += "<button class='quote-price ui-button-notext-secondary' style='" + style + "'></button>";
				return content;
            }
        }, {
            name: 'quoteVerify',
			width: 90,
            align: 'center',
            formatter: function(cellvalue, options, rowObject) {
                if (cellvalue == undefined) {
                    return "";
                }
                if (cellvalue == 'false') {
                    return "<img src='" + ctx + "/images/tip/err.gif' class='err-qtip'/>";
                } else if (cellvalue == undefined || cellvalue == "") {
                    // 业务人员
                    if (role == 'businessMan') {
                        return "<button class='quote-verify-book ui-button-notext-secondary'></button>";
                    } else if (role == 'businessManager') {
                        return "<button class='quote-verify-book-ok ui-button-notext'></button><button class='quote-verify-book-fail ui-button-notext'></button>";
                    }
                } else if (cellvalue == "true") {
                    return "<img src='" + ctx + "/images/tip/ok.gif'/>";
                }
                
            }
        }, {
            name: 'remark',
			width: 50
        }],
        caption: '询价报价记录',
        editurl: ctx + '/common/return-true.action',
        rowNum: 20,
        pager: pager_id,
        height: '100%',
        width: $("#" + subgrid_table_id).parent().width() - 10,
        subGrid: true,
        subGridRowExpanded: insuranceItemGrid,
        gridComplete: function() {
            bindBookVerify();
            bindPrice();
            $('.err-qtip').qtip();
            
            $('.weboffice').click(openOnlineDoc);
			
			// 询价
			$(".inquire").button({
                icons: {
                    primary: 'ui-icon-mail-closed',
                    secondary: 'ui-icon-help'
                }
            }).click(function() {
				createInquireBook(subgrid_table_id);
			});
            
            $(".toVerify").button({
                icons: {
                    primary: 'ui-icon-mail-closed',
                    secondary: 'ui-icon-person'
                }
            }).click(toVerify);
            
            $(".confirm").button({
                icons: {
                    primary: 'ui-icon-check'
                }
            }).click(confirm);
            
            $(".negative").button({
                icons: {
                    primary: 'ui-icon-closethick'
                }
            }).click(negative);
        }
    }).jqGrid('navGrid', "#" + pager_id, $.extend($.common.plugin.jqGrid.pager, {
        add: false,
        del: false,
        edit: false,
        view: false
    }), {
        closeAfterEdit: true,
        reloadAfterSubmit: false
    }, {
        closeAfterEdit: true,
        reloadAfterSubmit: false
    }).jqGrid('navButtonAdd', pager_id, {
        caption: "添加询价",
        title: "根据投保意向生成询价书",
        buttonicon: "ui-icon-plus",
        onClickButton: function() {
            $('#' + subgrid_table_id).jqGrid('addRowData', 3, {
		        "id": 3,
		        "inquireDate": strSystemDate,
		        "inquireDocs": "XX保险询价.doc"
		    });
			openOnlineDoc();
        }
    });
}

/**
 * 打开在线文档
 */
function openOnlineDoc() {
	var openurl = ctx + '/common/activex/iweboffice/DocumentEdit.jsp?RecordID=1316593910999&EditType=2,1&ShowType=1&UserName=' + role;
	window.open(openurl, "", "left=50,top=50,height=600, width=1020, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no");
}

/**
 * 生成询价书
 */
function createInquireBook(subgrid_id) {
    $('#inquirePriceTemplate').dialog({
        modal: true,
        width: 350,
        open: function() {
            $('#selectCreateStyle').buttonset();
        },
        buttons: [{
            text: '生成',
            click: function() {
                var dialog = this;
                $('#' + subgrid_id).jqGrid('addRowData', 3, {
                    "id": 3,
                    "inquireDate": strSystemDate,
                    "inquireDocs": "",
                    verify: ""
                });
                var style = $(':radio[name=selectCreateStyle]:checked').val();
                if (style == 'word') {
                    $.common.file.download('files/个人寿险询价书.doc');
                    $('.sending-mail').remove();
                    $(dialog).dialog('close');
                } else if (style == 'print') {
                    window.open('new-policy-insure-print.action');
                    $('.sending-mail').remove();
                    $(dialog).dialog('close');
                } else if (style == 'email') {
                    $('#selectCreateStyleContainer').after("<div class='sending-mail'><img src='" + ctx + "/images/ajax/loading.gif'/>正在发送邮件至：xiaoshou1@pingan.com</div>");
                    setTimeout(function() {
                        $('.sending-mail').html('<span class="ui-icon ui-icon-info ui-icon-p-left" style="margin-right: .3em;"></span>邮件已发送！');
                        $(dialog).dialog('close');
                    }, 5000);
                }
                
            }
        }, {
            text: '取消',
            click: function() {
                $(this).dialog('close');
            }
        }]
    });
}

/**
 * 保险项目列表
 * @param {Object} subgrid_id
 * @param {Object} row_id
 */
function insuranceItemGrid(subgrid_id, row_id) {
    var subgrid_table_id, pager_id;
    subgrid_table_id = subgrid_id + "_t";
    pager_id = "p_" + subgrid_table_id;
    $("#" + subgrid_id).html("<table id='" + subgrid_table_id + "' class='scroll'></table><div id='" + pager_id + "' class='scroll'></div>");
    $("#" + subgrid_table_id).jqGrid({
        url: ctx + "/js/module/customer/customer-person-life-insurance-item.json",
        datatype: "json",
        colNames: ['险种', '保险公司', '保险金额(￥)', '保费询价(￥)', '保费报价(￥)', '备注'],
        colModel: [{
            name: 'type',
            editable: true,
            align: 'center',
            edittype: 'select',
            editoptions: {
                value: {
                    "1": "人身险",
                    "2": "重疾险",
                    "3": "意外险",
                    "4": "医疗险",
                    "5": "养老险"
                }
            }
        }, {
            name: 'companyName',
			align: 'center'
        }, {
            name: 'total',
            align: 'center',
            editable: false,
            formatter: 'number',
            formatoptions: {
                thousandsSeparator: ","
            },
            formoptions: {
                elmsuffix: $.common.plugin.jqGrid.form.must
            }
        }, {
            name: 'askPrice',
            align: 'center',
            editable: true,
            formatter: 'number',
            formatoptions: {
                thousandsSeparator: ","
            }
        }, {
            name: 'qauotedPrice',
            align: 'center',
            editable: true,
            formatter: 'number',
            formatoptions: {
                thousandsSeparator: ","
            }
        }, {
            name: 'remark',
            align: 'center',
            editable: true,
            edittype: 'textarea'
        }],
        caption: '保险项目',
        cellEdit: true,
        cellurl: ctx + '/common/return-true.action',
        editurl: ctx + '/common/return-true.action',
        rowNum: 20,
        pager: pager_id,
        pgbuttons: false,
        pginput: false,
        pgtext: false,
        recordpos: false,
        rowList: false,
        height: '100%',
        width: $("#" + subgrid_table_id).parent().width() - 100,
        grouping: true,
        groupingView: {
            groupField: ['companyName'],
            groupColumnShow: [true],
            groupText: ['<b>{0} - {1} 项</b>']
        },
    }).jqGrid('navGrid', "#" + pager_id, $.extend($.common.plugin.jqGrid.pager, {
        add: false,
        del: false,
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

/**
 * 生成投保方案
 */
function effectInsurance() {
    var srcEle = this;
    
    $('#effectInsuranceTemplate').dialog({
        modal: true,
        open: function() {
            $.common.plugin.jqui.dialog.button.setIcons({
                生成: {
                    primary: 'ui-icon-document'
                },
                取消: {
                    primary: 'ui-icon-cancel'
                }
            });
        },
        buttons: [{
            text: "生成",
            click: function() {
                var rowId = $(srcEle).parents('tr').attr('id');
                $('#' + rowId + ' .toVerify').show();
                $(srcEle).parent().html("<a href='#' class='affix' rowId='" + rowId + "'>1个</a>");
                bindAffix();
                $(this).dialog('close');
            }
        }, {
            text: "取消",
            click: function() {
                $(this).dialog('close');
            }
        }]
    });
}

/**
 * 验证询价书
 */
function bindBookVerify() {

    // 报价提交审核
    $('.quote-verify-book').button({
        icons: {
            primary: 'ui-icon-mail-closed',
            secondary: 'ui-icon-person'
        }
    }).click(function() {
        var srcEle = this;
        $('<div/>', {
            title: '请确认',
            html: '确认提交审核报价书吗？'
        }).dialog({
            modal: true,
            buttons: {
                确认: function() {
                    $(srcEle).parent().html("审核中");
                    $(this).dialog("close");
                },
                取消: function() {
                    $(this).dialog("close");
                }
            }
        });
    });
    
    // 报价书验证通过
    $('.quote-verify-book-ok').button({
        icons: {
            primary: 'ui-icon-check'
        }
    }).click(function() {
        var srcEle = this;
        $('<div/>', {
            title: '请确认',
            html: '确认要通过审核么？'
        }).dialog({
            modal: true,
            buttons: {
                确认: function() {
					$(srcEle).parents('tr').find('.quote-price').show();
                    $(srcEle).parent().html("<img src='" + ctx + "/images/tip/ok.gif'/>");
                    $(this).dialog("close");
                },
                取消: function() {
                    $(this).dialog("close");
                }
            }
        });
    });
    
    // 报价书验证通过
    $('.quote-verify-book-fail').button({
        icons: {
            primary: 'ui-icon-closethick'
        }
    }).click(function() {
        var srcEle = this;
        $('#unVerifyTemplate').dialog({
            modal: true,
            buttons: {
                确认: function() {
                    $(srcEle).parent().html("<img src='" + ctx + "/images/tip/err.gif'/>");
                    $(this).dialog("close");
                },
                取消: function() {
                    $(this).dialog("close");
                }
            }
        });
    });
}

/**
 * 询价、报价按钮
 */
function bindPrice() {
    // 报价给客户
    $('.quote-price').button({
        icons: {
            primary: 'ui-icon-mail-closed',
			secondary: 'ui-icon-document'
        }
    }).click(function() {
        var srcEle = this;
        $('#quotePriceTemplate').dialog({
            modal: true,
            width: 400,
            open: function() {
                $('#completeQuotePriceStatus,#selectQuoteStyle').buttonset();
                $(':radio[name=completeQuotePrice]').change(function() {
                    if ($(this).val() == 'true') {
                        $('#quoteStyleContainer').show();
                    } else {
                        $('#quoteStyleContainer').fadeOut();
                    }
                });
            },
            buttons: [{
                text: "报价",
                click: function() {
                    var dialog = this;
                    // 没有填写报价回馈时展开
                    var completeQuotePrice = $(':radio[name=completeQuotePrice]:checked').val();
                    if (completeQuotePrice == 'false') {
                        var rowId = $(srcEle).parents('tr').attr('id');
                        $('#' + rowId + ' .ui-sgcollapsed a').trigger('click');
                        $(this).dialog('close');
                        return;
                    }
                    
                    var style = $(':radio[name=selectQuoteStyle]:checked').val();
                    if (style == 'word') {
                        $.common.file.download('files/个人寿险询价书.doc');
                        $('.sending-mail').remove();
                        $(dialog).dialog('close');
                    } else if (style == 'print') {
                        window.open('new-policy-insure-print-with-data.action');
                        $('.sending-mail').remove();
                        $(dialog).dialog('close');
                    } else if (style == 'email') {
                        $('#selectCreateStyleContainer').after("<div class='sending-mail'><img src='" + ctx + "/images/ajax/loading.gif'/>正在发送邮件至：xiaoshou1@pingan.com</div>");
                        setTimeout(function() {
                            $('.sending-mail').html('<span class="ui-icon ui-icon-info ui-icon-p-left" style="margin-right: .3em;"></span>邮件已发送！');
                            $(dialog).dialog('close');
                        }, 5000);
                    }
                }
            }, {
                text: '取消',
                click: function() {
                    $(this).dialog('close');
                }
            }]
        });
    });
}
