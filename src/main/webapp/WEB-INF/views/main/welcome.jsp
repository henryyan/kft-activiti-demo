<?xml version="1.0" encoding="UTF-8" ?>
<%@page import="me.kafeitu.demo.activiti.util.PropertyFileUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%@ include file="/common/global.jsp"%>
	<%@ include file="/common/meta.jsp"%>

	<%@ include file="/common/include-base-styles.jsp" %>
</head>
<body>
<div class="container">
	<h3>欢迎访问Activiti Demo，专为优秀的BPMN2.0规范的轻量级工作流引擎Activiti服务</h3>
	<dl class="dl-horizontal">
		<dt><strong>项目说明：</strong></dt>
		<dd><a target="_blank" href='https://github.com/henryyan/kft-activiti-demo'>kft-activiti-demo</a>为Activiti初学者快速入门所设计。</dd>
		<dd>源代码托管Github：<a target="_blank" href='https://github.com/henryyan/kft-activiti-demo'>https://github.com/henryyan/kft-activiti-demo</a></dd>

		<dt><strong>架构说明：</strong></dt>
		<dd>Activiti版本：<%=PropertyFileUtil.get("activiti.version") %></dd>
		<dd>使用<a href="http://maven.apache.org" target="_blank">Maven</a>管理依赖</dd>

		<dt>演示内容：</strong></dt>
		<dd>部署流程</dd>
		<dd>启动流程</dd>
		<dd>任务签收</dd>
		<dd>任务办理</dd>
		<dd>驳回请求</dd>
		<dd>查询运行中流程</dd>
		<dd>查询历史流程</dd>
		<dd>任务监听</dd>
		<dd>自定义表单</dd>
		<dd>动态表单</dd>

		<dt><strong>资源、文档链接：</strong></dt>
		<dd><b>Wiki：</b><a target="_blank" href="https://github.com/henryyan/kft-activiti-demo/wiki">https://github.com/henryyan/kft-activiti-demo/wiki</a></dd>
		<dd><b>Demo源码：</b><a target="_blank" href="https://github.com/henryyan/kft-activiti-demo">https://github.com/henryyan/kft-activiti-demo</a></dd>
		<dd><b>Activiti资料：</b><a target="_blank" href="http://www.kafeitu.me/categories.html#activiti-ref">http://www.kafeitu.me/categories.html#activiti-ref</a></dd>
	</dl>
</body>
</html>