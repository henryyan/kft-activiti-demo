/**
 * 首页JavaScript
 * 
 * @author HenryYan
 */
$(function() {
	
	// 修改密码
	$('#changePwd').click(function(){
		alert('我不会让你修改的，否则别人怎么登陆！！！');
	});

	// 退出系统
	$('#loginOut').click(function(){
		if (confirm('系统提示，您确定要退出本次登录吗?')) {
			location.href = ctx + '/user/logout';
		}
    });

	// 自动根据分辨率调整iframe的大小
    autoResizeIframeHeight();
    window.onresize = function() {
    	autoResizeIframeHeight();
    }

    $('.nav a[rel]').click(function(){
    	$('.nav .active').removeClass('active');
    	if ($(this).parents('li').hasClass('dropdown')) {
	    	$(this).parents('.dropdown').addClass('active');
	    	$('.active > a').trigger('click');
    	} else {
    		$(this).parent().addClass('active');
    	}
    	$('iframe').attr('src', ctx + "/" + $(this).attr('rel'));
    });
});

/**
 * 自动根据分辨率调整iframe的大小
 */
function autoResizeIframeHeight() {
	$('iframe').height(document.documentElement.clientHeight - 120);
}