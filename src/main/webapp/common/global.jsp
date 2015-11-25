<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*,org.apache.commons.lang3.StringUtils,org.apache.commons.lang3.ObjectUtils" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<%
//jquery.ui主题
String defaultTheme = "redmond";
String themeVersion = "1.9.2";

session.setAttribute("themeName", defaultTheme);
session.setAttribute("themeVersion", themeVersion);
pageContext.setAttribute("timeInMillis", System.currentTimeMillis());
%>
<script type="text/javascript">
	var ctx = '<%=request.getContextPath() %>';
</script>