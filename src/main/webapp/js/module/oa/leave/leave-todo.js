/**
 * 请假流程任务办理
 */
$(function() {

    // 签收
    $('.claim').button({
        icons: {
            primary: 'ui-icon-person'
        }
    });
    
    // 办理
    $('.handle').button({
        icons: {
            primary: 'ui-icon-comment'
        }
    }).click(handle);
    
    // 跟踪
    $('.trace').click(graphTrace);
    
});


// 用于保存加载的详细信息
var detail = {};

/**
 * 加载详细信息
 * @param {Object} id
 */
function loadDetail(id) {
    var dialog = this;
    $.getJSON(ctx + '/oa/leave/detail/' + id, function(data) {
        detail = data;
        $.each(data, function(k, v) {
            $('.view-info td[name=' + k + ']', dialog).text(v);
        });
    });
}


/**
 * 完成任务
 * @param {Object} taskId
 */
function complete(taskId, variables) {
    var dialog = this;
    
	// 转换JSON为字符串
    var keys = "", values = "", types = "";
	if (variables) {
		$.each(variables, function() {
			if (keys != "") {
				keys += ",";
				values += ",";
				types += ",";
			}
			keys += this.key;
			values += this.value;
			types += this.type;
		});
	}
	// 发送任务完成请求
    $.post(ctx + '/oa/leave/complete/' + taskId, {
        keys: keys,
        values: values,
        types: types
    }, function(resp) {
        if (resp == 'success') {
            alert('任务完成');
            location.reload();
        } else {
            alert('操作失败!');
        }
    });
}


/*
 * 使用json方式定义每个节点的按钮
 * 以及按钮的功能
 * 
 * open:打开对话框的时候需要处理的任务
 * btns:对话框显示的按钮
 */
var handleOpts = {
	deptLeaderAudit: {
		width: 300,
		height: 300,
		open: function(id) {
			
			// 打开对话框的时候读取请假内容
			loadDetail.call(this, id);
		},
		btns: [{
			text: '同意',
			click: function() {
				var taskId = $(this).data('taskId');
				
				// 设置流程变量
				complete(taskId, [{
					key: 'deptLeaderPass',
					value: true,
					type: 'B'
				}]);
			}
		}, {
			text: '驳回',
			click: function() {
				var taskId = $(this).data('taskId');
				
				// 设置流程变量
				complete(taskId, [{
					key: 'deptLeaderPass',
					value: false,
					type: 'B'
				}, {
					key: 'applyUserId',
					value: detail.userId,
					type: 'S'
				}]);
			}
		}, {
			text: '取消',
			click: function() {
				$(this).dialog('close');
			}
		}]
	},
	hrAudit: {
		width: 300,
		height: 300,
		open: function(id) {
			// 打开对话框的时候读取请假内容
			loadDetail.call(this, id);
		},
		btns: [{
			text: '同意',
			click: function() {
				var taskId = $(this).data('taskId');
				
				// 设置流程变量
				complete(taskId, [{
					key: 'hrPass',
					value: true,
					type: 'B'
				}, {
					key: 'applyUserId',
					value: detail.userId,
					type: 'S'
				}]);
			}
		}, {
			text: '驳回',
			click: function() {
				var taskId = $(this).data('taskId');
				
				// 设置流程变量
				complete(taskId, [{
					key: 'hrPass',
					value: false,
					type: 'B'
				}, {
					key: 'applyUserId',
					value: detail.userId,
					type: 'S'
				}]);
			}
		}, {
			text: '取消',
			click: function() {
				$(this).dialog('close');
			}
		}]
	},
	modifyApply: {
		width: 300,
		height: 300,
		open: function(id) {
			$("#radio").buttonset();
		},
		btns: [{
			text: '提交',
			click: function() {
				var taskId = $(this).data('taskId');
				var reApply = $(':radio[name=reApply]:checked').val();
				complete(taskId, [{
					key: 'reApply',
					value: reApply,
					type: 'B'
				}]);
			}
		},{
			text: '取消',
			click: function() {
				$(this).dialog('close');
			}
		}]
	},
	reportBack: {
		width: 400,
		height: 400,
		open: function(id) {
			// 打开对话框的时候读取请假内容
			loadDetail.call(this, id);
			$('#realityStartTime,#realityEndTime').datetimepicker({
	            stepMinute: 5
	        });
		},
		btns: [{
			text: '提交',
			click: function() {
				var realityStartTime = $('#realityStartTime').val();
				var realityEndTime = $('#realityEndTime').val();
				
				if (realityStartTime == '') {
					alert('请选择实际开始时间！');
					return;
				}
				
				if (realityEndTime == '') {
					alert('请选择实际结束时间！');
					return;
				}
				
				var taskId = $(this).data('taskId');
				complete(taskId, [{
					key: 'realityStartTime',
					value: realityStartTime,
					type: 'D'
				}, {
					key: 'realityEndTime',
					value: realityEndTime,
					type: 'D'
				}]);
			}
		},{
			text: '取消',
			click: function() {
				$(this).dialog('close');
			}
		}]
	}
};

/**
 * 办理流程
 */
function handle() {
	// 当前节点的英文名称
	var tkey = $(this).attr('tkey');
	
	// 当前节点的中文名称
	var tname = $(this).attr('tname');
	
	// 请假记录ID
	var rowId = $(this).parents('tr').attr('id');
	
	// 任务ID
	var taskId = $(this).parents('tr').attr('tid');
	
	// 使用对应的模板
	$('#' + tkey).data({
		taskId: taskId
	}).dialog({
		title: '流程办理[' + tname + ']',
		modal: true,
		width: handleOpts[tkey].width,
		height: handleOpts[tkey].height,
		open: function() {
			handleOpts[tkey].open.call(this, rowId);
		},
		buttons: handleOpts[tkey].btns
	});
}
