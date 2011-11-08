$(function() {
	$('#syn').button().click(syn);
});

/**
 * 用户同步
 */
function syn() {
	$.post(ctx + '/activiti/syn-activiti-and-business-data.action', function(resp) {
		alert(resp);
	});
}
