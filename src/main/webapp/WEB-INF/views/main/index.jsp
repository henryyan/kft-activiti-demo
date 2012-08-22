<%@page import="me.kafeitu.demo.activiti.util.PropertyFileUtil"%>
<%@page import="org.springframework.beans.factory.config.PropertiesFactoryBean"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
PropertyFileUtil.init();
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%@ include file="/common/global.jsp"%>
	<script>
		var notLogon = ${empty user};
		if (notLogon) {
			location.href = '${ctx}/login?timeout=true';
		}
	</script>
	<%@ include file="/common/meta.jsp" %>
    <title>Activiti-演示系统</title>
    <%@ include file="/common/include-base-styles.jsp" %>
    <link rel="stylesheet" type="text/css" href="${ctx }/css/menu.css" />
    <%@ include file="/common/include-custom-styles.jsp" %>
	<link href="${ctx }/css/main.css" type="text/css" rel="stylesheet"/>
	<style type="text/css">
	#activitiLogo {
		height: 30px !important;
		margin-top: -8px;
		margin-bottom: -8px;
	}
	#footer {
 		text-align: center !important;
    }
	</style>
    
    <script src="${ctx }/js/common/jquery.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/bootstrap/bootstrap.min.js" type="text/javascript"></script>
    <script src="${ctx }/js/module/main/main.js" type="text/javascript"></script>
</head>
<body>

  <div class="navbar navbar-fixed-top">
  <div class="navbar-inner">
      <div class="container-fluid">
        <a data-target=".nav-collapse" data-toggle="collapse" class="btn btn-navbar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </a>
        <a href="#" class="brand">
        	Demo For
        	<img id="activitiLogo" src="${ctx}/images/activiti_logo.png" />
        </a>
        <div class="nav-collapse">
          <ul class="nav">
            <li class="active"><a href="#"><i class="icon-home icon-black"></i>首页</a></li>
            <li class="dropdown">
				<a data-toggle="dropdown" class="dropdown-toggle" href="#"><i class="icon-th-large icon-black"></i>请假（自定义表单）<b class="caret"></b></a>
				<ul class="dropdown-menu">
					<li><a href="#" rel="oa/leave/apply">请假申请(自定)</a></li>
					<li><a href="#" rel="oa/leave/list/task">请假办理(自定)</a></li>
					<li><a href="#" rel="oa/leave/list/running">运行中流程(自定)</a></li>
					<li><a href="#" rel="oa/leave/list/finished">已结束流程(自定)</a></li>
				</ul>
            </li>
            <li class="dropdown">
				<a data-toggle="dropdown" class="dropdown-toggle" href="#"><i class="icon-fire icon-black"></i>动态表单<b class="caret"></b></a>
				<ul class="dropdown-menu">
					<li><a href="#" rel="form/dynamic/process-list">流程列表(动态)</a></li>
					<li><a href="#" rel="form/dynamic/task/list">任务列表(动态)</a></li>
					<li><a href="#" rel="form/dynamic/process-instance/running/list">运行中流程表(动态)</a></li>
					<li><a href="#" rel="form/dynamic/process-instance/finished/list">已结束流程(动态)</a></li>
				</ul>
            </li>
            <li><a href="#" rel='workflow/process-list'><i class="icon-wrench icon-black"></i>流程管理</a></li>
          </ul>
          
          <ul class="nav pull-right">
            <li class="dropdown">
            	<a data-toggle="dropdown" class="dropdown-toggle" href="#">
            		<i class="icon-user icon-black" style="margin-right: .3em"></i>${user.lastName }/${user.id }<b class="caret"></b>
            	</a>
            	<ul class="dropdown-menu">
					<li><a id="changePwd" href="#"><i class="icon-wrench icon-black"></i>修改密码</a></li>
					<li><a id="loginOut" href="#"><i class="icon-eject icon-black"></i>安全退出</a></li>
				</ul>
            </li>
          </ul>
        </div>
      </div>
  </div>
<div class="container">
	<iframe id="mainIframe" name="mainIframe" src="welcome" class="module-iframe" scrolling="auto" frameborder="0" style="width:100%;"></iframe>
</div>
<div id="footer">
		<hr class="soften">
		<a href="http://www.kafeitu.me">www.kafeitu.me</a> By <a href="http://weibo.com/kafeituzi">@咖啡兔</a>
		<span class="copyright">©2012</span>
		<span class="version" style="padding-left: .5em">版本：<%=PropertyFileUtil.get("system.version") %></span>
	</div>
</body>
</html>