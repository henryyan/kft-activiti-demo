/**
 * 供应商管理列表Javascript
 *
 * @author HenryYan
 */
$(function(){
    // 自动根据窗口大小改变数据列表大小
    $.common.plugin.jqGrid.autoResize({
        dataGrid: '#list',
        callback: listDatas
    });
    
});

var moduleAction = 'supplier/supplier';
var insurance_subgrid_table_id = ''; // 第二级险种列表的table id
/**
 * 加载列表
 *
 * @return
 */
function listDatas(size){
    $("#list").jqGrid($.extend($.common.plugin.jqGrid.settings({
        size: size
    }), {
        url: ctx + '/js/module/supplier/supplier-insurance-company-data.json',
        colNames: ['保险公司编号', '公司(中文)名称', '保险公司简称'],
        colModel: [{
            name: 'code',
            align: 'center',
            width: 30,
            editable: true
        }, {
            name: 'cnName',
            align: 'center',
            editable: true
        }, {
            name: 'shortName',
            width: 30,
            editable: true
        }],
        caption: "[供应商-保险公司]管理列表",
        editurl: ctx + '/common/return-true.action',
        subGrid: true,
        subGridRowExpanded: subInsuranceGrid,
		gridComplete: function() {
			$('#add_list').unbind('click').click(showCompanyDialog);
			$('#edit_list').unbind('click').click(function() {
				var selRowId = $("#list").jqGrid('getGridParam','selrow');
				if (selRowId) {
					showCompanyDialog();
				} else {
					alert('请先选择记录！');
				}
			});
			$('#view_list').unbind('click').click(showCompanyDialog);
		}
    })).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
    }),    // edit options
    {},    // add options
    {},    // delete options
    $.extend($.common.plugin.jqGrid.form.remove, {
        url: ctx + '/common/return-true.action',
        reloadAfterSubmit: false
    }),    // search optios
    $.extend($.common.plugin.jqGrid.form.search, {}),    // view options
    $.extend($.common.plugin.jqGrid.form.view, {
        beforeShowForm: function(formid){
            $.common.plugin.jqGrid.navGrid.showAllField(formid);
        }
    })).jqGrid('navButtonAdd', '#pager', $.common.plugin.jqGrid.navButtonAdd.setColumns).jqGrid('navButtonAdd', '#pager', {
        caption: "Excel",
        title: "导出为Excel",
        buttonicon: "ui-icon-document"
    });
    
}

/**
 * 子列表：保险产品
 * @param {Object} subgrid_id
 * @param {Object} row_id
 */
function subInsuranceGrid(subgrid_id, row_id){
    // 保险公司名称
    var companyName = $('#list').jqGrid('getCell', row_id, 3);
    var rowNumberCounter = 1;
    var subgrid_table_id, pager_id;
    subgrid_table_id = subgrid_id + "_t";
    pager_id = "p_" + subgrid_table_id;
    insurance_subgrid_table_id = subgrid_table_id;
    $("#" + subgrid_id).html("<table id='" + subgrid_table_id + "' class='scroll'></table><div id='" + pager_id + "' class='scroll'></div>");
    $("#" + subgrid_table_id).jqGrid({
        url: ctx + "/js/module/supplier/supplier-insurance-list.json",
        datatype: "json",
        colNames: ['序号', '险种编号', '险种名称', '标的类别'],
        colModel: [{
            name: 'rowNumber',
            width: 20,
            align: 'center',
            formatter: function(){
                return rowNumberCounter++;
            }
        }, {
            name: 'code',
            width: 50,
			editable: true
        }, {
            name: 'name',
			editable: true
        }, {
            name: 'label',
			editable: true,
			edittype: 'select',
			editoptions: {
				value: {"财产险类": "财产险类", "车险类": "车险类", "个人寿险": "个人寿险"}
			}
        }],
        caption: '[' + companyName + ']保险列表',
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
        width: $("#" + subgrid_table_id).parent().width(),
        subGrid: true,
        subGridRowExpanded: subInsuranceItemGrid
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

/**
 * 子列表：保险项目
 * @param {Object} subgrid_id
 * @param {Object} row_id
 */
function subInsuranceItemGrid(subgrid_id, row_id){
    // 险种名称
    var insuranceName = $('#' + insurance_subgrid_table_id).jqGrid('getCell', row_id, 3);
    var rowNumberCounter = 1;
    var subgrid_table_id, pager_id;
    subgrid_table_id = subgrid_id + "_t";
    pager_id = "p_" + subgrid_table_id;
    $("#" + subgrid_id).html("<table id='" + subgrid_table_id + "' class='scroll'></table><div id='" + pager_id + "' class='scroll'></div>");
    $("#" + subgrid_table_id).jqGrid({
        url: ctx + "/js/module/supplier/supplier-insurance-item-list.json",
        datatype: "json",
        colNames: ['序号', '项目编号', '项目名称', '保费费率(卖)', '保费费率(买)', '代理费率', '业务员佣金比例', '管理费率', '是否主险'],
        colModel: [{
            name: 'rowNumber',
            width: 50,
            align: 'center',
            formatter: function(){
                return rowNumberCounter++;
            }
        }, {
            name: 'itemCode',
			align: 'center',
			editable: true
        }, {
            name: 'itemName',
			align: 'center',
			editable: true
        }, {
            name: 'itemRate1',
			align: 'center',
			editable: true
        }, {
            name: 'itemRate2',
			align: 'center',
			editable: true
        }, {
            name: 'itemRate3',
			align: 'center',
			editable: true
        }, {
            name: 'itemRate4',
			align: 'center',
			editable: true
        }, {
            name: 'itemRate5',
			align: 'center',
			editable: true
        }, {
            name: 'isMajor',
			align: 'center',
			editable: true
        }],
        caption: '险种[' + insuranceName + ']项目列表',
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
        width: $("#" + subgrid_table_id).parent().width()
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

/**
 * 新增/编辑保险公司对话框
 */
function showCompanyDialog() {
	var selRowId = $("#list").jqGrid('getGridParam','selrow');
	$('#companyFormTemplate').dialog({
		modal: true,
		width: 700,
		resizable: false,
		open: function() {
			// 按钮图标
			$.common.plugin.jqui.dialog.button.setIcons({
				保存: {primary: 'ui-icon-disk'},
				取消: {primary: 'ui-icon-cancel'}
			});
			$('#list').jqGrid('GridToForm', selRowId, "#companyForm");
		},
		height: document.documentElement.clientHeight - 15,
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
}
