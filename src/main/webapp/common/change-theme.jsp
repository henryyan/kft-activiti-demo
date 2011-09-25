<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%System.out.print(request.getParameter("themeName")); %>
<c:if test="${not empty param.themeName }">
	<c:set var="themeName" value="${param.themeName }" scope="session" />
</c:if>