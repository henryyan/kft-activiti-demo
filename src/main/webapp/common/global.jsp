<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*,org.apache.commons.lang.StringUtils" %>
<%@ page import="me.kafeitu.demo.activiti.util.account.UserUtil,me.kafeitu.demo.activiti.entity.account.User" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<%@ taglib prefix="security" uri="http://www.springframework.org/security/tags" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<%
Calendar ca = Calendar.getInstance();
int year = ca.get(Calendar.YEAR);
int month = ca.get(Calendar.MONTH);
int day = ca.get(Calendar.DAY_OF_MONTH);
int hour = ca.get(Calendar.HOUR_OF_DAY);
int minute = ca.get(Calendar.MINUTE);
int second = ca.get(Calendar.SECOND);

// 自然月，月份从1开始
String strSystemDate = year + "-" + ((month + 1) < 10 ? "0" + (month + 1) : (month + 1)) + "-" + (day < 10 ? "0" + day : day);

// 计算机表示的月份，月份从0开始
String strCpSystemDate = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
pageContext.setAttribute("strSystemDate", strSystemDate);
pageContext.setAttribute("strCpSystemDate", strCpSystemDate);

//jquery.ui主题
String defaultTheme = "redmond";
String themeVersion = "1.8.16";
String userTheme = StringUtils.defaultIfEmpty(UserUtil.getUserTheme(), defaultTheme);

User currentUser = UserUtil.getCurrentUser();
session.setAttribute("themeName", userTheme.toLowerCase().replace(" ", "-"));
session.setAttribute("themeVersion", themeVersion);
session.setAttribute("role", currentUser != null ? currentUser.getMajorRoleName() : "");
session.setAttribute("cuserId", currentUser != null ? currentUser.getId() : "0");
session.setAttribute("cuserName", currentUser != null ? currentUser.getName() : "");
session.setAttribute("cuserOrgName", currentUser != null ? currentUser.getOrgName() : "");
%>
<c:set var="okGif" value="<img src='${ctx }/images/tip/ok.gif'/>" />
<c:set var="errGif" value="<img src='${ctx }/images/tip/err.gif'/>" />
<script type="text/javascript">
	var ctx = '<%=request.getContextPath() %>';
	
	// jquery ui
	var themeVersion = '${themeVersion}';
	
	// 服务器日期
	var systemDate = new Date(<%=year %>, <%=month %>, <%=day %>);
	var strSystemDate = "<%=strSystemDate %>";
	var strCpSystemDate = "<%=strCpSystemDate %>";

	// 服务器日期、时间
	var systemDateTime = new Date(<%=year %>, <%=month %>, <%=day %>, <%=hour %>, <%=minute %>, <%=second %>);
	
	var cuser = {id: '${cuserId}', name: '${cuserName}', role: '${role}'};
</script>