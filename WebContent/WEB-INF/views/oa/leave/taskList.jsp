<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<html lang="en">
<head>
	<%@ include file="/common/global.jsp"%>
	<title>请假待办任务列表</title>
	<%@ include file="/common/meta.jsp" %>
    <%@ include file="/common/include-base-styles.jsp" %>
    <%@ include file="/common/include-jquery-ui-theme.jsp" %>
    <link href="${ctx }/js/common/plugins/jui/extends/timepicker/jquery-ui-timepicker-addon.css" type="text/css" rel="stylesheet" />
    <link href="${ctx }/js/common/plugins/qtip/jquery.qtip.min.css" type="text/css" rel="stylesheet" />
    <%@ include file="/common/include-custom-styles.jsp" %>
    <style type="text/css">
    /* block ui */
	.blockOverlay {
		z-index: 1004 !important;
	}
	.blockMsg {
		z-index: 1005 !important;
	}
    </style>

    <script src="${ctx }/js/common/jquery-1.8.3.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/jui/jquery-ui-${themeVersion }.min.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/jui/extends/timepicker/jquery-ui-timepicker-addon.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/jui/extends/i18n/jquery-ui-date_time-picker-zh-CN.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/qtip/jquery.qtip.pack.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/html/jquery.outerhtml.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/blockui/jquery.blockUI.js" type="text/javascript"></script>
	<script src="${ctx }/js/module/activiti/workflow.js" type="text/javascript"></script>
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
				<th>任务创建时间</th>
				<th>流程状态</th>
				<th>操作</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${page.result }" var="leave">
				<c:set var="task" value="${leave.task }" />
				<c:set var="pi" value="${leave.processInstance }" />
				<tr id="${leave.id }" tid="${task.id }">
					<td>${leave.leaveType }</td>
					<td>${leave.userId }</td>
					<td>${leave.applyTime }</td>
					<td>${leave.startTime }</td>
					<td>${leave.endTime }</td>
					<td>
						<a class="trace" href='#' pid="${pi.id }" pdid="${pi.processDefinitionId}" title="点击查看流程图">${task.name }</a>
					</td>
					<%--<td><a target="_blank" href='${ctx }/workflow/resource/process-instance?pid=${pi.id }&type=xml'>${task.name }</a></td> --%>
					<td>${task.createTime }</td>
					<td>${pi.suspended ? "已挂起" : "正常" }；<b title='流程版本号'>V: ${leave.processDefinition.version }</b></td>
					<td>
						<c:if test="${empty task.assignee }">
							<a class="claim" href="${ctx }/oa/leave/task/claim/${task.id}">签收</a>
						</c:if>
						<c:if test="${not empty task.assignee }">
							<%-- 此处用tkey记录当前节点的名称 --%>
							<a class="handle" tkey='${task.taskDefinitionKey }' tname='${task.name }' href="#">办理</a>
						</c:if>
					</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	<tags:pagination page="${page}" paginationSize="${page.pageSize}"/>
	<!-- 下面是每个节点的模板，用来定义每个节点显示的内容 -->
	<!-- 使用DIV包裹，每个DIV的ID以节点名称命名，如果不同的流程版本需要使用同一个可以自己扩展（例如：在DIV添加属性，标记支持的版本） -->

	<!-- 部门领导审批 -->
	<div id="deptLeaderAudit" style="display: none">

		<!-- table用来显示信息，方便办理任务 -->
		<%@include file="view-form.jsp" %>
	</div>

	<!-- HR审批 -->
	<div id="hrAudit" style="display: none">

		<!-- table用来显示信息，方便办理任务 -->
		<%@include file="view-form.jsp" %>
	</div>

	<div id="modifyApply" style="display: none">
		<div class="info" style="display: none"></div>
		<div id="radio">
			<input type="radio" id="radio1" name="reApply" value="true" /><label for="radio1">调整申请</label>
			<input type="radio" id="radio2" name="reApply" checked="checked" value="false" /><label for="radio2">取消申请</label>
		</div>
		<hr />
		<table id="modifyApplyContent" style="display: none">
			<caption>调整请假内容</caption>
			<tr>
				<td>请假类型：</td>
				<td>
					<select id="leaveType" name="leaveType">
						<option>公休</option>
						<option>病假</option>
						<option>调休</option>
						<option>事假</option>
						<option>婚假</option>
					</select>
				</td>
			</tr>
			<tr>
				<td>开始时间：</td>
				<td><input type="text" id="startTime" name="startTime" /></td>
			</tr>
			<tr>
				<td>结束时间：</td>
				<td><input type="text" id="endTime" name="endTime" /></td>
			</tr>
			<tr>
				<td>请假原因：</td>
				<td>
					<textarea id="reason" name="reason" style="width: 250px;height: 50px"></textarea>
				</td>
			</tr>
		</table>
	</div>

	<!-- 销假 -->
	<div id="reportBack" style="display: none">
		<!-- table用来显示信息，方便办理任务 -->
		<%@include file="view-form.jsp" %>
		<hr/>
		<table>
			<tr>
				<td>实际请假开始时间：</td>
				<td>
					<input id="realityStartTime" />
				</td>
			</tr>
			<tr>
				<td>实际请假开始时间：</td>
				<td>
					<input id="realityEndTime" />
				</td>
			</tr>
		</table>
	</div>

</body>
</html>
