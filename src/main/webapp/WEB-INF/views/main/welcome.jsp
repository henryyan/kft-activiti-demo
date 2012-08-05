<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%@ include file="/common/global.jsp"%>
	<%@ include file="/common/meta.jsp"%>
</head>
<body style="margin-top: 1em;">
	<h1>欢迎访问Activiti Demo</h1>
	<p>
		<fieldset>
			<lenged>项目说明：</lenged>
			<ul>
				<li><a target="_blank" href='https://github.com/henryyan/kft-activiti-demo'>kft-activiti-demo</a>为Activiti初学者快速入门所设计。</li>
				<li>源代码托管Github：<a target="_blank" href='https://github.com/henryyan/kft-activiti-demo'>https://github.com/henryyan/kft-activiti-demo</a></li>
			</ul>
		</fieldset>
	</p>
	<p>
		<fieldset>
			<lenged>架构说明：</lenged>
			<ul>
				<li>Activiti版本：5.9</li>
				<li>使用Maven管理依赖</li>
			</ul>
		</fieldset>
	</p>
	<p>
		<fieldset>
			<lenged>演示内容：</lenged>
			<ul>
				<li>部署流程</li>
				<li>启动流程</li>
				<li>任务签收</li>
				<li>任务办理</li>
				<li>驳回请求</li>
				<li>查询运行中流程</li>
				<li>查询历史流程</li>
				<li>任务监听</li>
			</ul>
		</fieldset>
	</p>
</body>
</html>