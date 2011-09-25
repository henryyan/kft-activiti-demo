<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>403 - 缺少权限</title>
</head>

<body>
<div>
	<div><h1>你没有访问该页面的权限.</h1></div>
	<div><a href="<c:url value="/"/>">返回首页</a> <a href="<c:url value="/j_spring_security_logout"/>">退出登录</a></div>
</div>
</body>
</html>