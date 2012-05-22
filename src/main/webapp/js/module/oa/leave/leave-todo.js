$(function() {
	
	// 签收
	$('.wf-claim').button({
		icons: {
			primary: 'ui-icon-person'
		}
	}).click(function() {
		$.workflow.claim({
			taskId: $(this).attr('tid')
		})
	});
	
	// 查看流程跟踪图
    $('.trace-grpah').click(showImage);
});

/**
 * 查看流程图片
 */
function showImage() {
    var imageUrl = ctx + "/activiti/activiti!loadResource.action?resourceType=image&processInstanceId=" + $(this).attr('pid');
    var srcEle = this;
    
    $.getJSON(ctx + '/activiti/activiti!traceProcess.action?processInstanceId=' + $(this).attr('pid'), function(info) {
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
    
}
