<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<html>
<head>
	<title>登录页</title>
	<script>
		var logon = ${not empty user};
		if (logon) {
			location.href = '${ctx}/main/index';
		}
	</script>
</head>

<body>
	<center>
	<form action="${ctx }/user/logon" method="get">
		<table>
			<tr>
				<td>用户名：</td>
				<td><input id="username" name="username" /></td>
			</tr>
			<tr>
				<td>密码：</td>
				<td><input id="password" name="password" type="password" /></td>
			</tr>
			<tr>
				<td>&nbsp;</td>
				<td>
					<button type="submit">登录系统</button>
				</td>
			</tr>
		</table>
	</form>
	<hr />
	<table width="50%" border="1">
		<caption>用户列表(密码：000000)</caption>
		<tr>
			<th>用户名</th>
			<th>角色</th>
		</tr>
		<tr>
			<td>kafeitu</td>
			<td>管理员、用户</td>
		</tr>
		<tr>
			<td>hruser</td>
			<td>人事、用户</td>
		</tr>
		<tr>
			<td>leaderuser</td>
			<td>部门经理、用户</td>
		</tr>
	</table>
	</center>
</body>
</html>
