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
	<center><h3>欢迎访问Activiti Demo，专为优秀的BPMN2.0规范的轻量级工作流引擎Activiti服务</h3></center>
	<dl class="dl-horizontal">
		<dt><strong>项目说明：</strong></dt>
		<dd><a target="_blank" href='https://github.com/henryyan/kft-activiti-demo'>kft-activiti-demo</a>为Activiti初学者快速入门所设计。</dd>
		<dd>源代码托管Github：<a target="_blank" href='https://github.com/henryyan/kft-activiti-demo'>https://github.com/henryyan/kft-activiti-demo</a></dd>

		<dt><strong>架构说明：</strong></dt>
		<dd>Activiti版本：<%=PropertyFileUtil.get("activiti.version") %></dd>
		<dd>使用<a href="http://maven.apache.org" target="_blank">Maven</a>管理依赖</dd>

		<dt>演示内容：</strong></dt>
		<dd>
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
			</ul>
		</dd>

		<dt><strong>资源、文档链接：</strong></dt>
		<dd><b>Wiki：</b><a target="_blank" href="https://github.com/henryyan/kft-activiti-demo/wiki">https://github.com/henryyan/kft-activiti-demo/wiki</a></dd>
		<dd><b>Demo源码：</b><a target="_blank" href="https://github.com/henryyan/kft-activiti-demo">https://github.com/henryyan/kft-activiti-demo</a></dd>
		<dd><b>Activiti资料：</b><a target="_blank" href="http://www.kafeitu.me/categories.html#activiti-ref">http://www.kafeitu.me/categories.html#activiti-ref</a></dd>

		<dt>关于Bootstrap分支</dt>
		<dd>基于优秀的UI框架<a href="http://twitter.github.com/bootstrap/index.html" target="_blank">Bootstrap</a></dd>
		<dd>能用Bootstrap代替的尽量代替原有的控件</dd>
		<dd>纯粹为学习Bootstrap建立的分支</dd>
		<dd>有需要可以从这里<a href="https://github.com/henryyan/kft-activiti-demo/tree/bootstrap" target="_blank">Fork</a></dd>
	</dl>
</body>
</html>