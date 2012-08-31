<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<ul id="css3menu">
	<li class="topfirst"><a rel="main/welcome">首页</a></li>
	<li>
		<a rel="#">请假（自定义表单）</a>
		<ul>
			<li><a rel="oa/leave/apply">请假申请(自定)</a></li>
			<li><a rel="oa/leave/list/task">请假办理(自定)</a></li>
			<li><a rel="oa/leave/list/running">运行中流程(自定)</a></li>
			<li><a rel="oa/leave/list/finished">已结束流程(自定)</a></li>
		</ul>
	</li>
	<li>
		<a rel="#">动态表单</a>
		<ul>
			<li><a rel="form/dynamic/process-list">流程列表(动态)</a></li>
			<li><a rel="form/dynamic/task/list">任务列表(动态)</a></li>
			<li><a rel="form/dynamic/process-instance/running/list">运行中流程表(动态)</a></li>
			<li><a rel="form/dynamic/process-instance/finished/list">已结束流程(动态)</a></li>
		</ul>
	</li>
	<li>
		<a rel="#">外部表单</a>
		<ul>
			<li><a rel="form/formkey/process-list">流程列表(外部)</a></li>
			<li><a rel="form/formkey/task/list">任务列表(外部)</a></li>
			<li><a rel="form/dynamic/process-instance/running/list">运行中流程表(外部)</a></li>
			<li><a rel="form/dynamic/process-instance/finished/list">已结束流程(外部)</a></li>
		</ul>
	</li>
	<li>
		<a rel='workflow/process-list'>流程管理</a>
	</li>
</ul>