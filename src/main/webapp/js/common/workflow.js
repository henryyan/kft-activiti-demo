/**
 * jquery.workflow.js
 * 说明：选择用户、组织
 * @author HenryYan
 */
;
(function($) {
	$.workflow = {
		
		/*
		 * 签收
		 */
		claim: function(options) {
			var opts = $.extend({
				taskId: ''
			}, options);
			
			$.ajax({
				url: ctx + '/activiti/activiti-task!claim.action',
				data: 'taskId=' + opts.taskId
			}).success(function(resp) {
				alert(resp);
			});
		},
		
		/*
		 * 图片形式跟踪流程
		 */
		graphTrace: function(processInstanceId) {
		    var srcEle = this;
			var pid = $(this).attr('pid');
			var imageUrl = ctx + "/activiti/activiti!loadResource.action?resourceType=image&processInstanceId=" + pid;
		    $.getJSON(ctx + '/activiti/activiti!traceProcess.action?processInstanceId=' + pid, function(info) {
		        $('<div/>', {
		            title: '查看流程图（按ESC键可以关闭）',
		            html: "<img src='" + imageUrl + "' style='position:absolute; left:0px; top:0px;' />"
						+ "<div style='position:absolute; border:1px solid red;left:" + (info.x - 1) + "px;top:" + (info.y - 1) + "px;width:" + info.width + "px;height:" + info.height + "px;'></div>"
		        }).dialog({
		            modal: true,
		            resizable: false,
		            dragable: false,
		            width: $.common.window.getClientWidth(),
		            height: $.common.window.getClientHeight()
		        });
		    });
		},
		
		/*
		 * 办理流程
		 */
		workflowDo: function(options) {
			var defaults = {
				buttonSelector: '.workflow-do',
				callback: null
			};
			var opts = $.extend(defaults, options);
			$('.workflow-do').button({
				icons: {
					primary: 'ui-icon-document'
				}
			}).off('click').on('click', function(){
				if ($.isFunction(opts.callback)) {
					opts.callback(this);
				}
			});
		},
		
		/*
		 * 删除流程实例
		 */
		deleteProcess: function(pid, callback) {
			$('#deleteProcessTemplate').remove();
			$('<div/>', {
				id: 'deleteProcessTemplate',
				title: '删除流程',
				html: "<textarea id='deleteProcessReason' style='width:100%;height: 100%'></textarea>"
			}).dialog({
				modal: true,
				buttons: [{
					text: '删除',
					click: function() {
						var dialog = this;
						if ($('#deleteProcessReason').val() == '') {
							alert('请输入原因!');
							return;
						}
						$.post(ctx + '/activiti/activiti!deleteProcessInstance.action', {
							processInstanceId: pid,
							deleteReason: $('#deleteProcessReason').val()
						}, function(resp) {
							$(dialog).dialog('close');
							if (resp == 'success') {
								if ($.isFunction(callback)) {
									callback();
								}
							} else {
								alert('删除流程失败');
							}
						});
					}
				}, {
					text: '取消',
					click: function() {
						$(this).dialog('close');
					}
				}]
			});
		}
	};
})(jQuery);
