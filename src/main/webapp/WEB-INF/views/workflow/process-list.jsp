<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
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
	<%@ include file="/common/include-custom-styles.jsp" %>
	<title>流程列表</title>

	<script src="${ctx }/js/common/jquery-1.8.3.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/jui/jquery-ui-${themeVersion }.min.js" type="text/javascript"></script>
    <script type="text/javascript">
    $(function() {
    	$('#redeploy').button({
    		icons: {
    			primary: 'ui-icon-refresh'
    		}
    	});
    	$('#deploy').button({
    		icons: {
    			primary: 'ui-icon-document'
    		}
    	}).click(function() {
    		$('#deployFieldset').toggle('normal');
    	});
    });
    </script>
</head>
<body>
	<c:if test="${not empty message}">
	<div class="ui-widget">
			<div class="ui-state-highlight ui-corner-all" style="margin-top: 20px; padding: 0 .7em;"> 
				<p><span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span>
				<strong>提示：</strong>${message}</p>
			</div>
		</div>
	</c:if>
	<div style="text-align: right;padding: 2px 1em 2px">
		<div id="message" class="info" style="display:inline;"><b>提示：</b>点击xml或者png链接可以查看具体内容！</div>
		<a id='deploy' href='#'>部署流程</a>
		<a id='redeploy' href='${ctx }/workflow/redeploy/all' style="display:none">重新部署流程</a>
	</div>
	<fieldset id="deployFieldset" style="display: none">
		<legend>部署新流程</legend>
		<div><b>支持文件格式：</b>zip、bar、bpmn、bpmn20.xml</div>
		<form action="${ctx }/workflow/deploy" method="post" enctype="multipart/form-data">
			<input type="file" name="file" />
			<input type="submit" value="Submit" />
		</form>
	</fieldset>
	<table width="100%" class="need-border">
		<thead>
			<tr>
				<th>ProcessDefinitionId</th>
				<th>DeploymentId</th>
				<th>名称</th>
				<th>KEY</th>
				<th>版本号</th>
				<th>XML</th>
				<th>图片</th>
				<th>部署时间</th>
				<th>是否挂起</th>
				<th>操作</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${page.result }" var="object">
				<c:set var="process" value="${object[0] }" />
				<c:set var="deployment" value="${object[1] }" />
				<tr>
					<td>${process.id }</td>
					<td>${process.deploymentId }</td>
					<td>${process.name }</td>
					<td>${process.key }</td>
					<td>${process.version }</td>
					<td><a target="_blank" href='${ctx }/workflow/resource/read?processDefinitionId=${process.id}&resourceType=xml'>${process.resourceName }</a></td>
					<td><a target="_blank" href='${ctx }/workflow/resource/read?processDefinitionId=${process.id}&resourceType=image'>${process.diagramResourceName }</a></td>
					<td>${deployment.deploymentTime }</td>
					<td>${process.suspended} |
						<c:if test="${process.suspended }">
							<a href="processdefinition/update/active/${process.id}">激活</a>
						</c:if>
						<c:if test="${!process.suspended }">
							<a href="processdefinition/update/suspend/${process.id}">挂起</a>
						</c:if>
					</td>
					<td>
                        <a href='${ctx }/workflow/process/delete?deploymentId=${process.deploymentId}'>删除</a>
                        <a href='${ctx }/workflow/process/convert-to-model/${process.id}'>转换为Model</a>
                    </td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	<tags:pagination page="${page}" paginationSize="${page.pageSize}"/>
</body>
</html>