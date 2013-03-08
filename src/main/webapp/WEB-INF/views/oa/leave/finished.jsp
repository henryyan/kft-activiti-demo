<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<html lang="en">
<head>
	<%@ include file="/common/global.jsp"%>
	<title>请假已结束的流程实例列表</title>
	<%@ include file="/common/meta.jsp" %>
    <%@ include file="/common/include-base-styles.jsp" %>
    <%@ include file="/common/include-jquery-ui-theme.jsp" %>
    <link href="${ctx }/js/common/plugins/jui/extends/timepicker/jquery-ui-timepicker-addon.css" type="text/css" rel="stylesheet" />
    <link href="${ctx }/js/common/plugins/qtip/jquery.qtip.min.css" type="text/css" rel="stylesheet" />
    <%@ include file="/common/include-custom-styles.jsp" %>

    <script src="${ctx }/js/common/jquery-1.8.3.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/jui/jquery-ui-${themeVersion }.min.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/jui/extends/timepicker/jquery-ui-timepicker-addon.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/jui/extends/i18n/jquery-ui-date_time-picker-zh-CN.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/qtip/jquery.qtip.pack.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/html/jquery.outerhtml.js" type="text/javascript"></script>
	<script src="${ctx }/js/module/activiti/workflow.js" type="text/javascript"></script>
</head>

<body>
	<table width="100%" class="need-border">
		<thead>
			<tr>
				<th>假种</th>
				<th>申请人</th>
				<th>申请时间</th>
				<th>开始时间</th>
				<th>结束时间</th>
				<th><b>实际</b>开<br/>始时间</th>
				<th><b>实际</b>结<br/>束时间</th>
				<th>流程启动时间</th>
				<th>流程结束时间</th>
				<th>流程结束原因</th>
				<th>流程版本</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${page.result }" var="leave">
				<c:set var="hpi" value="${leave.historicProcessInstance }" />
				<tr id="${leave.id }" tid="${task.id }">
					<td>${leave.leaveType }</td>
					<td>${leave.userId }</td>
					<td>${leave.applyTime }</td>
					<td>${leave.startTime }</td>
					<td>${leave.applyTime }</td>
					<td>${leave.realityStartTime }</td>
					<td>${leave.realityEndTime }</td>
					<td>${hpi.startTime }</td>
					<td>${hpi.endTime }</td>
					<td>${hpi.deleteReason }</td>
					<td><b title='流程版本号'>V: ${leave.processDefinition.version }</b></td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	<tags:pagination page="${page}" paginationSize="${page.pageSize}"/>
</body>
</html>
