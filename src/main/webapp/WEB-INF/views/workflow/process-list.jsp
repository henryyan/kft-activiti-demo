<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%@ include file="/common/global.jsp"%>
	<script>
		var notLogon = ${empty user};
		if (notLogon) {
			location.href = '${ctx}/login?error=nologon';
		}
	</script>
	<%@ include file="/common/meta.jsp" %>
	<%@ include file="/common/include-base-styles.jsp" %>
	<%@ include file="/common/include-jquery-ui-theme.jsp" %>
	<title>流程列表</title>
	
	<script src="${ctx }/js/common/jquery.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/jui/jquery-ui.min.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/blockui/jquery.blockUI.js" type="text/javascript"></script>
	<script src="${ctx }/js/module/activiti/process-list.js" type="text/javascript"></script>
</head>
<body>
	<div style="text-align: center;padding: 2px 0 2px">
		<a id='redeploy' href='${ctx }/workflow/redeploy/all'>重新部署</a>
	</div>
	<table width="100%" class="need-border">
		<thead>
			<tr>
				<th>ID</th>
				<th>名称</th>
				<th>KEY</th>
				<th>版本号</th>
				<th>XML</th>
				<th>图片</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${processes }" var="process">
				<tr>
					<td>${process.id }</td>
					<td>${process.name }</td>
					<td>${process.key }</td>
					<td>${process.version }</td>
					<td>${process.resourceName }</td>
					<td>${process.diagramResourceName }</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</body>
</html>