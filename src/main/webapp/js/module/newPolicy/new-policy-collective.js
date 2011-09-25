/**
 * 集体客户
 */
$(function() {
	
	// 布局
	$('body').layout({
		west__onresize: function (pane, $Pane) {
			$.common.plugin.jqGrid.autoResize({
				dataGrid: '#list',
				gridContainer: '#RightPane',
				callback: function(size) {
					$("#list").jqGrid('setGridWidth', size.width);
				}
			});
		},
		resizerClass: 'ui-state-default'
	});
	
	// 初始化组织树
	initCollectiveTree();
	
	// 自动根据窗口大小改变数据列表大小
	
});

var loadPersonGrid = false;
var loadSubCollectiveGrid = false;

/**
 * 左侧的组织树
 */
function initCollectiveTree() {
	$('#collectiveTree').jstree({
		core: {
			"initially_open": ["1", "2"]
		},
        themes: {
            theme: 'apple'
        },
		plugins: ["themes", "html_data", "ui"]
	}).bind('click.jstree', function(event){
		var eventNodeName = event.target.nodeName;
		if (eventNodeName == 'INS') {
			return;
		} else if (eventNodeName == 'A') {
			var $com = $(event.target);
			
			// 叶子节点
			if ($com.parent().hasClass('jstree-leaf')) {
				var companyId = $com.parent().attr('id');
				if (loadPersonGrid) {
					var gridUrl = ctx + '/js/module/customer/collective/customer-collective-person-data-' + companyId + '.json';
					$('#personList').jqGrid('setGridParam', {'url' : gridUrl}).trigger('reloadGrid');
				} else {
					cleanUp('collective');
					$.common.plugin.jqGrid.autoResize({
						dataGrid: '#personList',
						gridContainer: '#RightPane',
						callback: function(size) {
							listCompanyEmployeeDatas(size, companyId);
						}
					});
					loadPersonGrid = true;
					loadSubCollectiveGrid = false;
				}
			} else {
				// 集团节点
				var companyId = $com.parent().attr('id');
				var companyId = $com.parent().attr('id');
				if (loadSubCollectiveGrid) {
					var gridUrl = ctx + '/js/module/customer/collective/customer-sub-collective-data-' + companyId + '.json';
					$('#subCollectiveList').jqGrid('setGridParam', {'url' : gridUrl}).trigger('reloadGrid');
				} else {
					cleanUp('person');
					$.common.plugin.jqGrid.autoResize({
						dataGrid: '#subCollectiveList',
						gridContainer: '#RightPane',
						callback: function(size) {
							listSubCollectiveDatas(size, companyId);
						}
					});
					loadSubCollectiveGrid = true;
					loadPersonGrid = false;
				}
			}
		}
	});
}

/**
 * 清理列表
 */
function cleanUp(type) {
	$('#totolTip').slideUp();
	if (type == 'person') {
		$('#gbox_subCollectiveList').remove();
		$('#gbox_personList').remove();
		if ($('#subCollectiveList').length == 0) {
			$('#totolTip').after('<table id="subCollectiveList"></table><div id="subCollectivePager"></div>');
		}
	} else if (type == 'collective') {
		$('#gbox_personList').remove();
		$('#gbox_subCollectiveList').remove();
		if ($('#personList').length == 0) {
			$('#totolTip').after('<table id="personList"></table><div id="personPager"></div>');
		}
	}
}
