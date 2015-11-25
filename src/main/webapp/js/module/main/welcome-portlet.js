$(function() {
	$('#portlet-container').portlet({
		sortable: true,
		columns: [{
			width: 400,
			portlets: [{
				title: '待办任务',
				content: {
					style: {
						maxHeight: 300
					},
					type: 'ajax',
					dataType: 'json',
					url: ctx + '/workflow/task/todo/list',
					formatter: function(o, pio, data) {
                        if (data.length == 0) {
                            return "无待办任务！";
                        }
						var ct = "<ol>";
						$.each(data, function() {
							ct += "<li>" + this.pdname + "->PID:" + this.pid + "-><span class='ui-state-highlight ui-corner-all'>" + this.name + "</span>";
							ct += "<span class='version' title='流程定义版本：" + this.pdversion + "'><b>V:</b>" + this.pdversion + "</span>";
							ct += "<a class='trace' href='#' pid='" + this.pid + "' title='点击查看流程图'>跟踪</a>";
							ct += "<span class='status' title='任务状态'>" + (this.status == 'claim' ? '未签收' : '') + "</span>";
							ct += "</li>";
						});
						return ct + "</ol>";
					},
					afterShow: function() {
						$('.trace').click(graphTrace);
					}
				}
			}, {
				title: '表单概念',
				content: {
					type: 'text',
					text: function() {
						return $('.forms').html();
					}
				}
			}, {
				title: '会签（多实例）说明',
				content: {
					type: 'text',
					text: function() {
						return $('#multiInstance').html();
					}
				}
			}, {
                title: '关于作者',
                content: {
                    type: 'text',
                    text: function() {
                        return $('.aboutme').html();
                    }
                }
            }]
		}, {
			width: 350,
			portlets: [{
				title: '演示内容',
				content: {
					type: 'text',
					text: function() {
						return $('.demos').html();
					}
				}
			}   ]
		}, {
			width: 450,
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
			}, {
				title: '资源链接',
				content: {
					type: 'text',
					text: function() {
						return $('.links').html();
					}
				}
			}, {
                title: 'Rest接口',
                content: {
                    type: 'text',
                    text: function() {
                        return $('.rest').html();
                    }
                }
            }]
		}]
	});
});