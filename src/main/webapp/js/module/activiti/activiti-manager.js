/**
 * 流程管理Javascript
 *
 * @author HenryYan
 */
$(function() {
    // 自动根据窗口大小改变数据列表大小
    $.common.plugin.jqGrid.autoResize({
        dataGrid: '#list',
        callback: listDatas
    });
	
	// 绑定表单
    $.form.bindAjaxSubmit({
        formId: '#deployForm'
    });
});

var validator;
var moduleAction = "activiti";

/**
 * 加载列表
 *
 * @return
 */
function listDatas(size) {
    $("#list").jqGrid($.extend($.common.plugin.jqGrid.settings({
        size: size
    }), {
        url: moduleAction + '!list.action',
        colNames: ['ID', '部署ID', '名称', 'KEY', '版本', '流程[XML&图]', '描述', '操作'],
        colModel: [{
            name: 'id',
            align: 'center'
        }, {
            name: 'deploymentId',
            align: 'center'
        }, {
            name: 'name',
            align: 'center'
        }, {
            name: 'key',
            align: 'center'
        }, {
            name: 'version',
            align: 'center'
        }, {
            name: 'infos',
            align: 'center',
            formatter: function(cellValue, options, rowObject) {
                var xmlUrl = ctx + "/activiti/activiti!loadResource.action?deploymentId=" + rowObject.deploymentId + "&resourceName=" + rowObject.resourceName;
                var imageUrl = ctx + "/activiti/activiti!loadResource.action?deploymentId=" + rowObject.deploymentId + "&resourceName=" + rowObject.diagramResourceName;
                return "<a href='" + xmlUrl + "' target='_blank' ' class='resource-xml'>" + rowObject.resourceName + "</a><br/><a href='#' rel='" + imageUrl + "' class='resource-image'>" + rowObject.diagramResourceName + "</a>";
            }
        }, {
            name: 'description',
            align: 'center'
        }, {
            name: 'options',
            align: 'center',
            formatter: function(cellValue, options, rowObject) {
                return "<button class='delete-deployment'>删除</button>";
            }
        }],
        caption: "流程管理",
        editurl: moduleAction + '.action',
        gridComplete: function() {
			$('.resource-image').click(showImage);
            $('.delete-deployment').button({
                icons: {
                    primary: 'ui-icon-trash'
                }
            }).click(deleteDeployment);
		}
    })).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
        add: false,
        edit: false,
        del: false,
        search: false,
        view: false,
        addtext: '部署流程'
    }), {}, {}, {}, // search optios
 $.extend($.common.plugin.jqGrid.form.search), // view options
 $.extend($.common.plugin.jqGrid.form.view)).jqGrid('navButtonAdd', '#pager', {
        caption: "部署",
        title: "导出查询结果",
		position: 'first',
        buttonicon: "ui-icon-plus",
        onClickButton: deploy
    });
}

/**
 * 查看流程图片
 */
function showImage() {
    var srcEle = this;
    $('<div/>', {
        title: '查看流程图（按ESC键可以关闭）',
        html: "<img src='" + $(srcEle).attr('rel') + "' />"
    }).dialog({
        modal: true,
        resizable: false,
        dragable: false,
        width: $.common.window.getClientWidth(),
        height: $.common.window.getClientHeight()
    });
}

/**
 * 部署新流程
 */
function deploy() {
	$('#deployFormTemplate').dialog({
		modal: true,
		buttons: [{
			text: "部署",
			click: function() {
				$('#deployForm').submit();
			}
		}, {
			text: "关闭",
			click: function() {
				$(this).dialog('close');
			}
		}]
	});
}

/**
 * 删除流程
 */
function deleteDeployment() {
    var srcEle = this;
    var rowId = $(srcEle).parents('tr').attr('id');
    var deploymentId = $('#list').jqGrid('getCell', rowId, 'deploymentId');
    $('<div/>', {
        title: '请确认',
        html: '确认删除流程吗？<br/><input type="checkbox" id="deleteCascade" name="deleteCascade" /><label for="deleteCascade">关联删除流程实例？</label>'
    }).dialog({
        modal: true,
        buttons: [{
            text: '删除',
            click: function() {
                var dialog = this;
                $.get(ctx + '/activiti/activiti!delete.action', {
                    deploymentId: deploymentId,
                    deleteCascade: $('#deleteCascade').attr('checked')
                }, function(resp) {
                    $(dialog).dialog('close');
                    $('#list').jqGrid().trigger('reloadGrid');
                });
            }
        }]
    });
}

/**
 * 表单提交前
 */
function showRequest(formData, jqForm, options) {
    return $('#deployment').val() != '';
}

/**
 * 表单响应处理
 */
function showResponse(response, status) {
    if (status == 'success' && $(response).text() == 'success') {
        $('#deployFormTemplate').dialog('close');
		$('#list').jqGrid().trigger('reloadGrid');
    } else {
        alert('保存失败，请重试或告知管理员');
    }
}