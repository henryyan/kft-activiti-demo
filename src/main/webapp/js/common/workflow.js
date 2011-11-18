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
		}
	};
})(jQuery);
