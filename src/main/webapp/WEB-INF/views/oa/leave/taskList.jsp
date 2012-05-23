<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<head>
	<%@ include file="/common/global.jsp"%>
	<title>请假待办任务列表</title>
	<%@ include file="/common/meta.jsp" %>
    <%@ include file="/common/include-base-styles.jsp" %>
    <%@ include file="/common/include-jquery-ui-theme.jsp" %>
    <link href="${ctx }/js/common/plugins/jui/extends/timepicker/jquery-ui-timepicker-addon.css" type="text/css" rel="stylesheet" />
    
    <script src="${ctx }/js/common/jquery.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/jui/jquery-ui.min.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/jui/extends/timepicker/jquery-ui-timepicker-addon.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/jui/extends/i18n/jquery-ui-date_time-picker-zh-CN.js" type="text/javascript"></script>
	<script src="${ctx }/js/module/oa/leave/leave-todo.js" type="text/javascript"></script>
</head>

<body>
	<c:if test="${not empty message}">
		<div id="message" class="alert alert-success">${message}</div>
	</c:if>
	<table width="100%" class="need-border">
		<thead>
			<tr>
				<th>假种</th>
				<th>申请人</th>
				<th>申请时间</th>
				<th>开始时间</th>
				<th>结束时间</th>
				<th>当前节点</th>
				<th>操作</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${leaves }" var="leave">
				<c:set var="task" value="${leave.task }" />
				<tr id="${task.id }">
					<td>${leave.leaveType }</td>
					<td>${leave.userId }</td>
					<td>${leave.applyTime }</td>
					<td>${leave.startTime }</td>
					<td>${leave.endTime }</td>
					<td>${leave.task.name }</td>
					<td>
						<c:if test="${empty task.assignee }">
							<a class="claim" href="${ctx }/oa/leave/task/claim?id=${task.id}">签收</a>
						</c:if>
						<c:if test="${not empty task.assignee }">
							<a class="handle" href="${ctx }/oa/leave/task/claim/${task.id}">办理</a>
						</c:if>
					</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</body>
</html>
