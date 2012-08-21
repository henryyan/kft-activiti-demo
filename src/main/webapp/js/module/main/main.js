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

    $('iframe').height(document.documentElement.clientHeight - 80);

    $('.nav a[rel]').click(function(){
    	$('iframe').attr('src', ctx + "/" + $(this).attr('rel'));
    });
});