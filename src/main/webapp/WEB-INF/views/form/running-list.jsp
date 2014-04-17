<%@page import="me.kafeitu.demo.activiti.util.ProcessDefinitionCache,org.activiti.engine.RepositoryService"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<html lang="en">
<head>
	<%@ include file="/common/global.jsp"%>
	<title>运行中流程列表</title>
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
	<script type="text/javascript">
	$(function() {
		// 跟踪
	    $('.trace').click(graphTrace);
	});
	</script>
</head>

<body>
	<%
	RepositoryService repositoryService = WebApplicationContextUtils.getWebApplicationContext(session.getServletContext()).getBean(org.activiti.engine.RepositoryService.class);
	ProcessDefinitionCache.setRepositoryService(repositoryService);
	%>
	<table>
		<tr>
			<th>执行ID</th>
			<th>流程实例ID</th>
			<th>流程定义ID</th>
			<th>当前节点</th>
			<th>是否挂起</th>
		</tr>

		<c:forEach items="${page.result }" var="p">
		<c:set var="pdid" value="${p.processDefinitionId }" />
		<c:set var="activityId" value="${p.activityId }" />
		<tr>
			<td>${p.id }</td>
			<td>${p.processInstanceId }</td>
			<td>${p.processDefinitionId }</td>
			<td><a class="trace" href='#' pid="${p.id }" pdid="${p.processDefinitionId}" title="点击查看流程图"><%=ProcessDefinitionCache.getActivityName(pageContext.getAttribute("pdid").toString(), ObjectUtils.toString(pageContext.getAttribute("activityId"))) %></a></td>
			<td>${p.suspended }</td>
		</tr>
		</c:forEach>
	</table>
	<tags:pagination page="${page}" paginationSize="${page.pageSize}"/>
	<!-- 办理任务对话框 -->
	<div id="handleTemplate" class="template"></div>

</body>
</html>
