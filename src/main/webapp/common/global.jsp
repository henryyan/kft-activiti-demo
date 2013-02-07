<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*,org.apache.commons.lang3.StringUtils,org.apache.commons.lang3.ObjectUtils,org.springframework.web.context.WebApplicationContext" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<%
//jquery.ui主题
String defaultTheme = "redmond";
String themeVersion = "1.9.2";

session.setAttribute("themeName", defaultTheme);
session.setAttribute("themeVersion", themeVersion);
pageContext.setAttribute("timeInMillis", System.currentTimeMillis());

WebApplicationContext wac = WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
Properties props = wac.getBean("APP_PROPERTIES", Properties.class);
String diagramHttpUrl = props.getProperty("diagram.http.url");
%>
<c:set var="diagramHttpUrl" value="<%=diagramHttpUrl %>"/>
<script type="text/javascript">
	var ctx = '<%=request.getContextPath() %>';
	var diagramHttpUrl = '<%=diagramHttpUrl %>';
</script>