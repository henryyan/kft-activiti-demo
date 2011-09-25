/**
 * 初始化保险项目列表
 */
function showInsuranceItemList(){
    // 自动根据窗口大小改变数据列表大小
    $.common.plugin.jqGrid.autoResize({
        dataGrid: '#insuranceItemTable',
        callback: listInsuranceItem,
        gridContainer: '#insuranceItem'
    });
}

var insuranceTypeDataMap = {
	意外伤害: {
		duty: "因意外导致的身故按保额给付<br/>因意外导致的残疾按比例给付<br/>因意外导致的烧伤按比例给付"
	},
	住院津贴: {
		duty: "一般住院给予每日补贴"
	}
};

/**
 * 保险项目列表
 */
function listInsuranceItem(size){
	size.width -= 30;
	size.height += 30;
	$("#insuranceItemTable").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({
			size: size,
			pager: '#insuranceItemPager'
		}), {
		url: ctx + '/js/common/empty.json',
		colNames: ['保险项目', '保险金额', '保险责任'],
		colModel: [{
			name: 'name',
			align: 'center',
			width: 80,
			editable: true,
			editoptions: {
				dataInit: function(elem) {
					$(elem).autocomplete({
						source: ["意外伤害", "住院津贴", "门急诊", "女性生育", "子女门诊住院"],
						autoFill: true,
						mustMatch: true,
						select: function(event, ui){
							var typeName = ui.item.value;
							$(insuranceTypeDataMap[typeName]).each(function() {
								$('#FrmGrid_insuranceItemTable #price').val(this.price);
							});
						}
					});
			}
			}
		}, {
			name: 'price',
			editable: true
		}, {
			name: 'duty',
			editable: true,
			edittype: 'textarea'
		}],
		caption: "[新保-寿险-个人]投保项目",
		editurl: ctx + '/common/return-true.action',
		gridComplete: function(){
		
		}
	})).jqGrid('navGrid', '#insuranceItemPager', $.extend($.common.plugin.jqGrid.pager), 
	// edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
		width : 500,
		editCaption: '编辑保险项目',
		reloadAfterSubmit: false,
		beforeSubmit: null
	}),
	
	// add options
    $.extend($.common.plugin.jqGrid.form.add, {
		width : 500,
		addCaption: '添加保险项目',
		reloadAfterSubmit: false,
		beforeSubmit: null
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
	}));
}
