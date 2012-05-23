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
	});
	
});