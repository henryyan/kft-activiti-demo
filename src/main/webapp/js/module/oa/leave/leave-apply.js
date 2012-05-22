/**
 * 请假JavaScript
 *
 * @author HenryYan
 */
$(function() {
    // 自动根据窗口大小改变数据列表大小
    $.common.plugin.jqGrid.autoResize({
        dataGrid: '#list',
        callback: listDatas,
        filterToolbar: true
    });
    
    // 绑定表单
    $.form.bindAjaxSubmit({
        formId: '#leaveForm'
    });
});

var validator, $formDialog;
var moduleAction = "leave";

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
        colNames: ['工号', '姓名', '开始时间', '结束时间', '假种', '天数', '原因', '操作'],
        colModel: [{
            name: 'userId',
            align: 'center'
        }, {
            name: 'userName',
            align: 'center'
        }, {
            name: 'startTime',
            align: 'center',
            formatter: 'date',
            formatoptions: {
                srcformat: 'Y-m-dTH:i:s',
                newformat: 'Y-m-d H:i:s'
            },
            searchoptions: {
                dataInit: function(elem) {
                    $(elem).addClass('Wdate').click(WdatePicker);
                },
                sopt: $.common.plugin.jqGrid.search.date
            },
            sortable: false
        }, {
            name: 'endTime',
            align: 'center',
            formatter: 'date',
            formatoptions: {
                srcformat: 'Y-m-dTH:i:s',
                newformat: 'Y-m-d H:i:s'
            },
            searchoptions: {
                dataInit: function(elem) {
                    $(elem).addClass('Wdate').click(WdatePicker);
                },
                sopt: $.common.plugin.jqGrid.search.date
            },
            sortable: false
        }, {
            name: 'leaveType',
            align: 'center',
            stype: 'select',
            editoptions: {
                value: {
                    "公休": "公休",
                    "调休": "调休",
                    "事假": "事假",
                    "病假": "病假",
                    "产假": "产假",
                    "婚假": "婚假",
                    "其他": "其他"
                }
            }
        }, {
            name: 'days',
            align: 'center'
        }, {
            name: 'reason',
            editable: true
        }, {
            name: 'options',
            align: 'center',
            formatter: function(cellValue, options, rowObject) {
                return "<button class='workflow-start'>启动</button>";
            }
        }],
        caption: "请假申请",
        editurl: moduleAction + '!save.action',
        gridComplete: $.common.plugin.jqGrid.gridComplete('list', function() {
            $('#add_list').unbind('click').click(function() {
                showLeaveFormDialog({
                    oper: 'add'
                });
            });
            $('#edit_list').unbind('click').click(function() {
                var selRowId = $("#list").jqGrid('getGridParam', 'selrow');
                if (selRowId) {
                    showLeaveFormDialog({
                        oper: 'edit',
                        rowId: selRowId
                    });
                } else {
                    alert('请先选择记录！');
                }
            });
            $('.workflow-start').button({
                icons: {
                    primary: 'ui-icon-play'
                }
            }).click(function() {
                workflowStart({
                    rowId: $(this).parents('tr').attr('id')
                })
            });
        })
    })).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
        addtext: '申请'
    }), {}, {}, $.extend($.common.plugin.jqGrid.form.remove, {
        url: moduleAction + '!delete.action'
    }), $.extend($.common.plugin.jqGrid.form.search), {}).jqGrid('filterToolbar', $.extend($.common.plugin.jqGrid.filterToolbar.settings));
    
}

/**
 * 表单验证
 *
 * @return
 */
function validatorForm() {
    validator = $("#leaveForm").validate({
        rules: {
            startTime: {
                required: true
            },
            endTime: {
                required: true
            },
            days: {
                required: true,
                number: true,
                min: 0.5,
                max: 100
            },
            reason: {
                required: true
            }
        },
        errorPlacement: function(error, element) {
            // Set positioning based on the elements position in the form
            var elem = $(element), corners = ['right center', 'left center'], flipIt = elem.parents('span.right').length > 0;
            
            // Check we have a valid error message
            if (!error.is(':empty')) {
                // Apply the tooltip only if it isn't valid
                elem.filter(':not(.valid)').qtip({
                    overwrite: false,
                    content: error,
                    position: {
                        my: corners[flipIt ? 0 : 1],
                        at: corners[flipIt ? 1 : 0],
                        viewport: $(window)
                    },
                    show: {
                        event: false,
                        ready: true
                    },
                    hide: false,
                    style: {
                        classes: 'ui-tooltip-red'
                    }
                }).qtip('option', 'content.text', error);
            } else {
                elem.qtip('destroy');
            }
        },
        success: $.common.plugin.validator.success
    });
}

/**
 * 打开表单对话框
 */
function showLeaveFormDialog(options) {
    var defaults = {
        oper: '',
        rowId: ''
    };
    var btns = [];
    var opts = $.extend(defaults, options);
    $('#leaveForm').attr('action', ctx + '/oa/leave/leave!save.action').data('oper', opts.oper).data('rowId', opts.rowId).find('#oper').val(opts.oper);
    
    var title = '';
    switch (opts.oper) {
        case 'add':{
            title = '申请请假';
            btns = [{
                text: '暂存',
                title: '保存当前表单',
                icons: 'ui-icon-disk',
                click: function() {
                    $('#leaveForm').submit();
                }
            }, {
                text: '启动',
                title: '启动流程',
                icons: 'ui-icon-play',
                click: function() {
                    $('#leaveForm').data('oper', 'wfstart').attr('action', ctx + '/oa/leave/leave!start.action').submit();
                }
            }];
            $('#leaveForm #id').val('');
            break;
        }
        case 'edit':{
            title = '修改请假信息';
            btns = [{
                text: '更新',
                title: '保存当前表单',
                icons: 'ui-icon-disk',
                click: function() {
                    $('#leaveForm').submit();
                }
            }, {
                text: '启动',
                title: '启动流程',
                icons: 'ui-icon-play',
                click: function() {
                    $('#leaveForm').data('oper', 'wfstart').attr('action', ctx + '/oa/leave/leave!start.action').submit();
                }
            }];
            $('#leaveForm #id').val(opts.rowId);
            break;
        }
    };
    
    // 附加按钮
    btns[btns.length] = {
        text: '关闭',
        title: '关闭对话框',
        icons: 'ui-icon-cancel',
        click: function() {
            $(this).dialog("close");
        }
    };
    
    // 打开办理对话框
    $formDialog = $('#leaveFormTemplate').dialog({
        modal: true,
        width: 700,
        height: 300,
        title: title,
        buttons: btns,
        open: function() {
            // 按钮图标
            $.common.plugin.jqui.dialog.button.setAttrs(btns);
            
            // 表单预处理
            $('#startTime,#endTime').click(function() {
                WdatePicker({
                    dateFmt: "yyyy-MM-dd HH:mm:ss"
                });
            });
            validatorForm();
            
            if (opts.oper == 'add') {
                $('#leaveForm').get(0).reset();
            } else if (opts.oper == 'edit') {
                $('#list').jqGrid('GridToForm', opts.rowId, "#leaveForm");
            }
            
        },
        close: function() {
            $('#leaveForm *').qtip('destroy');
        }
    });
}

/**
 * 启动流程
 */
function workflowStart(opts) {
    if (!confirm('启动流程？')) {
        return;
    }
    $.ajax({
        url: moduleAction + '!start.action',
        data: 'id=' + opts.rowId,
		dataType: 'json'
    }).success(function(resp) {
        $('#list').jqGrid().trigger('reloadGrid');
    });
}

/**
 * 表单提交前
 *
 * @return {Boolean}
 */
function showRequest(formData, jqForm, options) {
    return $('#leaveForm').valid();
}

/**
 * 表单响应处理
 *
 * @param {} responses
 * @param {} status
 */
function showResponse(responses, status) {
    if (status == 'success' && responses.success) {
        var oper = $('#leaveForm').data('oper');
		alert(oper);
        if (oper == 'wfstart' && responses.started) {
			$('#list').jqGrid().trigger('reloadGrid');
		} else if (oper == 'add') {
            $('#list').jqGrid('FormToGrid', responses.id, "#leaveForm", oper);
        } else {
            $('#list').jqGrid('FormToGrid', responses.id, "#leaveForm");
        }
        $formDialog.dialog('close');
    } else {
        alert('保存失败，请重试或告知管理员');
    }
}
