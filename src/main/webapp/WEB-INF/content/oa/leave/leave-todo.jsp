<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.wsria.demo.activiti.util.account.UserUtil" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%@ include file="/common/global.jsp"%>
	<%@ include file="/common/meta.jsp" %>
	<title>请假流程管理</title>
	<%@ include file="/common/include-base-styles.jsp" %>
	<%@ include file="/common/include-jquery-ui-theme.jsp" %>
	<%@ include file="/common/include-custom-styles.jsp" %>

	<script src="${ctx }/js/common/jquery.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/jui/jquery-ui.min.js" type="text/javascript"></script>
	<script src='${ctx }/js/common/common.js' type="text/javascript"></script>
	<script src='${ctx }/js/common/workflow.js' type="text/javascript"></script>
	<script src='${ctx }/js/module/oa/leave/leave-todo.js' type="text/javascript"></script>
</head>
<body>
	<table class="center">
		<thead>
			<th>工号</th>
			<th>申请人</th>
			<th>开始时间</th>
			<th>时间</th>
			<th>天数</th>
			<th>类型</th>
			<th>原因</th>
			<th>节点名称</th>
			<th>优先级</th>
			<th>代理人</th>
			<th>所属人</th>
			<th>操作</th>
		</thead>
		<c:forEach items="${page.result }" var="leave">
			<tr>
				<td>${leave.userId }</td>
				<td>${leave.userName }</td>
				<td>${leave.startTime }</td>
				<td>${leave.endTime }</td>
				<td>${leave.days}</td>
				<td>${leave.leaveType }</td>
				<td>${leave.reason }</td>
				<td>${leave.task.name }</td>
				<td>${leave.task.priority }</td>
				<td>${leave.task.assignee }</td>
				<td>
					<c:if test="${empty leave.task.owner }">
						<button class='wf-claim' tid="${leave.task.id }">签收</button>
					</c:if>
					${leave.task.owner }
				</td>
				<td>
					<a href="#" class="trace-grpah" pid="${leave.processInstanceId }">跟踪流程图</a>
				</td>
			</tr>
		</c:forEach>
	</table>
</body>
</html>