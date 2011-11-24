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
        url: moduleAction + '!runningList.action',
        colNames: ['PID', 'taskid', '工号', '姓名', '开始时间', '结束时间', '假种', '天数', '原因', '操作'],
        colModel: [{
			name: 'processInstanceId',
			hidden: true
		}, {
			name: 'task.id',
			hidden: true
		}, {
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
				return '<a href="#" class="trace-grpah" title="跟踪流程图" pid="' + rowObject.processInstanceId + '">跟踪</a>'
						+ '<button class="workflow-do">办理</button>';
			}
		}],
        caption: "请假管理",
        editurl: moduleAction + '!save.action',
        gridComplete: function() {
			$('.trace-grpah').off('click').on('click', $.workflow.graphTrace);
			$.workflow.workflowDo({
				callback: function(btn) {
					var rowId = $(btn).parents('tr').attr('id');
					showLeaveFormDialog({
						oper: 'wfdo',
						rowId: rowId
					});
				}
			});
        }
    })).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
		add: false,
		edit: false,
		del: false
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
    $('#leaveForm').data('oper', opts.oper).data('rowId', opts.rowId);
    
    var title = '';
	switch (opts.oper) {
		case 'wfdo':{
			title = '办理流程';
			btns = [{
				text: '提交',
				icons: 'ui-icon-check',
				title: '提交至下一节点',
				click: function() {
					$('#taskId').val($('#list').jqGrid('getCell', opts.rowId, 'task.id'));
					$('#leaveForm').attr('action', ctx + '/oa/leave/leave!complete.action').submit();
				}
			}, {
				text: '退回',
				icons: 'ui-icon-arrowreturnthick-1-w',
				title: '退回到上一节点'
			}, {
				text: '转办',
				icons: 'ui-icon-person',
				title: '转给其他人办理'
			}, {
				text: '删除',
				icons: 'ui-icon-trash',
				title: '删除流程实例',
				click: function() {
					var pid = $('#list').jqGrid('getCell', opts.rowId, 'processInstanceId');
					$.workflow.deleteProcess(pid, function() {
						$('#leaveFormTemplate').dialog('close');
						$('#list').jqGrid().trigger('reloadGrid');
					});
				}
			}];
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
            
            //validatorForm();
            
            if (opts.oper == 'wfdo') {
                $('#list').jqGrid('GridToForm', opts.rowId, "#leaveForm");
				$('.reason').html($('#reason').val());
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
		data: 'id=' + opts.rowId
	}).success(function() {
		alert('ok');
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
        if (oper == 'add') {
			$('#list').jqGrid('FormToGrid', responses.id, "#leaveForm", oper);
		} else {
			$('#list').jqGrid('FormToGrid', responses.id, "#leaveForm");
		}
		$formDialog.dialog('close');
    } else {
        alert('保存失败，请重试或告知管理员');
    }
}