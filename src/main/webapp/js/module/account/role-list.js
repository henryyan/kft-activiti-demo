/**
 * 数据字典JavaScript 功能：数据字典的列表以及CRUD操作
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

var validator;
var moduleAction = "role";

/**
 * 加载列表
 *
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid($.extend($.common.plugin.jqGrid.settings({
        size: size
    }), {
        url: moduleAction + '.action',
        colNames: ['EN_ID', '名称', '优先级', '类型'],
        colModel: [{
			name: 'enName',
			align: 'center',
			editable: false
		}, {
            name: 'name',
            align: 'center',
            editable: true,
            edittype: 'text',
            editoptions: {
                size: 20,
                maxlength: 50
            },
            searchoptions: {
                sopt: $.common.plugin.jqGrid.search.text
            },
            formoptions: {
                elmsuffix: $.common.plugin.jqGrid.form.must
            }
        }, {
            name: 'priority',
            align: 'center',
            editable: true,
            edittype: 'text',
            editoptions: {
                size: 20,
                maxlength: 2
            },
            searchoptions: {
                sopt: $.common.plugin.jqGrid.search.text
            }
        }, {
			name: 'type',
			align: 'center',
			editable: true,
            edittype: 'select',
            editoptions: {
                value: {"assignment": "assignment", "security-role": "security-role"}
            },
            searchoptions: {
                sopt: $.common.plugin.jqGrid.search.select
            }
		}],
        caption: "角色管理",
        cellEdit: true,
        cellurl: moduleAction + '.action',
        editurl: moduleAction + '.action',
        sortname: 'priority'
    })).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
        add: true,
        edit: false,
        view: false,
        search: false
    }),    // edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
        width: 450,
        editCaption: '修改',
        beforeShowForm: commonBeforeShowForm,
        beforeSubmit: beforeSubmit
    }),    // add options
    $.extend($.common.plugin.jqGrid.form.add, {
        width: 450,
        addCaption: '增加新角色',
        beforeShowForm: commonBeforeShowForm,
        beforeSubmit: beforeSubmit
    }),    // delete options
    $.extend($.common.plugin.jqGrid.form.remove, {
        url: moduleAction + '!delete.action'
    }),    // search optios
    $.extend($.common.plugin.jqGrid.form.search, {}),    // view options
    $.extend($.common.plugin.jqGrid.form.view));
    
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
            }
        },
        errorPlacement: $.common.plugin.validator.error,
        success: $.common.plugin.validator.success
    });
}


function commonBeforeShowForm() {
    // 注册表单验证事件
    validatorForm();
    $('.CaptionTD').width(70);
}

function beforeSubmit() {
    var valid = $("#FrmGrid_list").valid();
    return [valid, '表单有 ' + validator.numberOfInvalids() + ' 项错误，请检查！'];
}
