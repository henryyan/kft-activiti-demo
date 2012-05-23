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
</head>
<body>
	<div style="text-align: right;padding: 2px 1em 2px">
		<a id='redeploy' href='${ctx }/workflow/redeploy/all'>重新部署流程</a>
	</div>
	<table width="100%" class="need-border">
		<thead>
			<tr>
				<th>ID</th>
				<th>DID</th>
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
					<td>${process.deploymentId }</td>
					<td>${process.name }</td>
					<td>${process.key }</td>
					<td>${process.version }</td>
					<td><a target="_blank" href='${ctx }/workflow/resource/deployment?deploymentId=${process.deploymentId}&resourceName=${process.resourceName }'>${process.resourceName }</a></td>
					<td><a target="_blank" href='${ctx }/workflow/resource/deployment?deploymentId=${process.deploymentId}&resourceName=${process.diagramResourceName }'>${process.diagramResourceName }</a></td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</body>
</html>