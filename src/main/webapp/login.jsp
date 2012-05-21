<%@page import="me.kafeitu.demo.activiti.util.account.UserUtil"%>
<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%@ include file="/common/global.jsp"%>
	<title>Activiti演示 登录页</title>
	<%@ include file="/common/meta.jsp" %>
	<%@ include file="/common/include-base-styles.jsp" %>
	<%@ include file="/common/include-jquery-ui-theme.jsp" %>
	<%@ include file="/common/include-custom-styles.jsp" %>
	<style type="text/css">
	.ui-dialog-titlebar-close {display: none;}
	</style>
	
	<script src="${ctx }/js/common/jquery.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/jui/jquery-ui.min.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/common.js" type="text/javascript"></script>
	<script>
		$(function(){
			if(parent != window) {
				$.common.window.getTopWin().location.href = ctx + '/login.jsp?timeout=true';
			}
			
			var btns = [{
				text: "登录",
				icons: 'ui-icon-person',
				click: loginForm
			}, {
				text: "?",
				click: function() {
					alert('忘记密码功能未实现！');
				}
			}];
			$('#loginFormTemplate').dialog({
				draggable: false,
				resizable: false,
				closeOnEscape: false,
				modal: true,
				open: function() {
					$.common.plugin.jqui.dialog.button.setAttrs(btns);
				},
				buttons: btns
			});
			
			$('#loginForm :input').keydown(function(event){
				if (event.keyCode == 13) {
					loginForm();
				}
			});
			$('#j_username').focus();
		});
		
		function loginForm() {
			if ($('#j_username').val() == '') {
				alert('请输入工号！');
				$('#j_username').focus();
			} else if ($('#j_password').val() == '') {
				alert('请输入密码！');
				$('#j_password').focus();
			} else {
				$('#loginForm').submit();
			}
		}
		
	</script>
</head>
<body>
	<div id="loginFormTemplate" title="登录Activiti演示系统" class="template">
		<form id="loginForm" action="${ctx}/j_spring_security_check" method="post" style="margin-top:1em">
			<p>工&nbsp;&nbsp;号：<input type="text" name="j_username" id="j_username" /></p>
			<p>密&nbsp;&nbsp; 码：<input type="password" name="j_password" id="j_password" /></p>
		</form>
	</div>
</body>
</html>