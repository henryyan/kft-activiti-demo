$(function() {
	$('#portlet-container').portlet({
		sortable: true,
		columns: [{
			width: 500,
			portlets: [{
				title: '待办任务',
				content: {
					type: 'ajax',
					dataType: 'json',
					url: ctx + '/workflow/task/todo/list',
					formatter: function(o, pio, data) {
						var ct = "<ul>";
						$.each(data, function() {
							ct += "<li>" + this.pdname + "->PID:" + this.pid + "-><span class='ui-state-highlight ui-corner-all'>" + this.name + "</span>";
							ct += "<span class='version' title='流程定义版本：" + this.pdversion + "'><b>V:</b>" + this.pdversion + "</span>";
							ct += "<a class='trace' href='#' pid='" + this.pid + "' title='点击查看流程图'>跟踪</a>";
							ct += "<span class='status' title='任务状态'>" + (this.status == 'claim' ? '未签收' : '') + "</span>";
							ct += "</li>";
						});
						return ct + "</ul>";
					},
					afterShow: function() {
						$('.trace').click(graphTrace);
					}
				}
			}]
		}, {
			width: 200,
			portlets: [{
				title: '演示内容',
				content: {
					type: 'text',
					text: function() {
						return $('.demos').html();
					}
				}
			}]
		}, {
			width: 400,
			portlets: [{
				title: '项目说明',
				content: {
					type: 'text',
					text: function() {
						return $('.project-info').html();
					}
				}
			}, {
				title: '架构说明',
				content: {
					type: 'text',
					text: function() {
						return $('.arch').html();
					}
				}
			}]
		}]
	});
});