/**
 * 集体客户
 */
$(function() {
	
	// 布局
	$('body').layout({
		west: {
			size: $('body').width() / 2
		}
	});
	
	$('.ui-layout-resizer').addClass('ui-state-default');
	
	// 初始化组织树
	initLeftTree();
	initRightTree();
	
});

var unCategoryData = {
	91: {
		code: 'C00002003',
		label: '财产险类',
		company: '太保'
	},
	92: {
		code: 'C00002005',
		label: '财产险类',
		company: '太保'
	},
	93: {
		code: 'C00003003',
		label: '车险类',
		company: '太保'
	},
	94: {
		code: 'C00002003',
		label: '人寿险类',
		company: '太保'
	}
};

/**
 * 左侧的组织树
 */
function initLeftTree() {
	$('#categoryTree').jstree({
		core: {
			"initially_open": ["1", "2"]
		},
        themes: {
            theme: 'apple'
        },
		"dnd" : {
			"drag_check" : function (data) {
				return { 
					after : true, 
					before : true, 
					inside : true 
				};
			}
		},
		plugins: ["themes", "html_data", "ui", "dnd", "crrm", "contextmenu"]
	});
}

/**
 * 右侧的组织树
 */
function initRightTree() {
	$('#noCategoryTree').jstree({
		core: {
			"initially_open": ["-1"]
		},
        themes: {
            theme: 'apple'
        },
		"dnd" : {
			"drag_check" : function (data) {
				return { 
					after : true, 
					before : true, 
					inside : true 
				};
			}
		},
		plugins: ["themes", "html_data", "ui", "dnd"]
	}).bind('click.jstree', function(event) {
		var eventTarget = event.target;
		var insuranceId = $(eventTarget).parent().attr('id');
		$(eventTarget).qtip({
			position: {
				my: 'top center',
				at: 'bottom center'
			},
			content: {
				text: $('#infoTemplate').html()
			},
			style: {
				width: 250
			},
			events: {
				show: function(event, api){
					$('.ui-tooltip-content #code').html(unCategoryData[insuranceId].code);
					$('.ui-tooltip-content #name').html($(eventTarget).text());
					$('.ui-tooltip-content #label').html(unCategoryData[insuranceId].label);
					$('.ui-tooltip-content #company').html(unCategoryData[insuranceId].company);
				}
			}
		});
	});
}