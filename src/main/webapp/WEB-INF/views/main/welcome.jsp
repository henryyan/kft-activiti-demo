<?xml version="1.0" encoding="UTF-8" ?>
<%@page import="me.kafeitu.demo.activiti.util.PropertyFileUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%@ include file="/common/global.jsp"%>
	<%@ include file="/common/meta.jsp"%>

	<%@ include file="/common/include-base-styles.jsp" %>
    <%@ include file="/common/include-jquery-ui-theme.jsp" %>
    <link href="${ctx }/js/common/plugins/jui/extends/portlet/jquery.portlet.css" type="text/css" rel="stylesheet" />
    <%@ include file="/common/include-custom-styles.jsp" %>
    <style type="text/css">
    	.template {display:none;}
    	.version {margin-left: 0.5em; margin-right: 0.5em;}
    	.trace {margin-right: 0.5em;}
    </style>

    <script src="${ctx }/js/common/jquery.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/jui/jquery-ui.min.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/jui/extends/portlet/jquery.portlet.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/qtip/jquery.qtip.pack.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/html/jquery.outerhtml.js" type="text/javascript"></script>
	<script src="${ctx }/js/module/activiti/workflow.js" type="text/javascript"></script>
    <script src="${ctx }/js/module/main/welcome-portlet.js" type="text/javascript"></script>
</head>
<body style="margin-top: 1em;">
	<center><h3>欢迎访问Activiti Demo，专为优秀的BPMN2.0规范的轻量级工作流引擎Activiti服务</h3></center>
	<div id='portlet-container'></div>

	<!-- 隐藏 -->
	<div class="project-info template">
		<ul>
			<li><a target="_blank" href='https://github.com/henryyan/kft-activiti-demo'>kft-activiti-demo</a>为Activiti初学者快速入门所设计。</li>
			<li>源代码托管Github：<a target="_blank" href='https://github.com/henryyan/kft-activiti-demo'>https://github.com/henryyan/kft-activiti-demo</a></li>
		</ul>
	</div>

	<div class="arch template">
		<ul>
			<li>Activiti版本：<%=PropertyFileUtil.get("activiti.version") %></li>
			<li>使用<a href="http://maven.apache.org" target="_blank">Maven</a>管理依赖</li>
		</ul>
	</div>

	<div class="demos template">
		<ul>
			<li>部署流程</li>
			<li>启动流程</li>
			<li>任务签收</li>
			<li>任务办理</li>
			<li>驳回请求</li>
			<li>查询运行中流程</li>
			<li>查询历史流程</li>
			<li>任务监听</li>
			<li>自定义表单</li>
			<li>动态表单</li>
			<li>外部表单(<font color='red'>New</font>)</li>
		</ul>
	</div>
</body>
</html>