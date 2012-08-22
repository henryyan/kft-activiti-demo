<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<head>
	<%@ include file="/common/global.jsp"%>
	<title>请假申请</title>
	<%@ include file="/common/meta.jsp" %>
    <%@ include file="/common/include-base-styles.jsp" %>
    <%@ include file="/common/include-jquery-ui-theme.jsp" %>
    <link href="${ctx }/js/common/plugins/jui/extends/timepicker/jquery-ui-timepicker-addon.css" type="text/css" rel="stylesheet" />
    
    <script src="${ctx }/js/common/jquery.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/jui/jquery-ui.min.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/jui/extends/timepicker/jquery-ui-timepicker-addon.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/jui/extends/i18n/jquery-ui-date_time-picker-zh-CN.js" type="text/javascript"></script>
    <script type="text/javascript">
    $(function() {
    	$('#startTime,#endTime').datetimepicker({
            stepMinute: 5
        });
    });
    </script>
</head>

<body>
	<div class="container showgrid">
	<c:if test="${not empty message}">
		<div id="message" class="alert alert-success">${message}</div>
		<!-- 自动隐藏提示信息 -->
		<script type="text/javascript">
		setTimeout(function() {
			$('#message').hide('slow');
		}, 5000);
		</script>
	</c:if>
	<c:if test="${not empty error}">
		<div id="error" class="alert alert-error">${error}</div>
		<!-- 自动隐藏提示信息 -->
		<script type="text/javascript">
		setTimeout(function() {
			$('#error').hide('slow');
		}, 5000);
		</script>
	</c:if>
	<form:form id="inputForm" modelAttribute="user" action="${ctx}/oa/leave/start" method="post" class="form-horizontal">
		<div class="control-group">
			<label class="control-label" for="leaveType">请假类型：</label>
			<div class="controls">
				<select id="leaveType" name="leaveType">
					<option>公休</option>
					<option>病假</option>
					<option>调休</option>
					<option>事假</option>
					<option>婚假</option>
				</select>
			</div>
		</div>
		<div class="control-group">
			<label class="control-label" for="startTime">开始时间：</label>
			<div class="controls">
				<input type="text" id="startTime" name="startTime" />
			</div>
		</div>
		<div class="control-group">
			<label class="control-label" for="endTime">结束时间：</label>
			<div class="controls">
				<input type="text" id="endTime" name="endTime" />
			</div>
		</div>
		<div class="control-group">
			<label class="control-label" for="reason">请假原因：</label>
			<div class="controls">
				<textarea id="reason" name="reason"></textarea>
			</div>
		</div>
		<div class="control-group">
			<label class="control-label" for="reason">请假原因：</label>
			<div class="controls">
				<button class="btn"><i class="icon-ok icon-black"></i>申请</button>
			</div>
		</div>
	</form:form>
	</div>
</body>
</html>
