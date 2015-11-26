<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<ul id="css3menu">
	<li class="topfirst"><a rel="main/welcome">首页</a></li>
	<li>
		<a rel="#">请假（普通表单）</a>
		<ul>
			<li><a rel="oa/leave/apply">请假申请(普通)</a></li>
			<li><a rel="oa/leave/list/task">请假办理(普通)</a></li>
			<li><a rel="oa/leave/list/running">运行中流程(普通)</a></li>
			<li><a rel="oa/leave/list/finished">已结束流程(普通)</a></li>
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
		<a rel="#">外置表单</a>
		<ul>
			<li><a rel="form/formkey/process-list">流程列表(外置)</a></li>
			<li><a rel="form/formkey/task/list">任务列表(外置)</a></li>
			<li><a rel="form/formkey/process-instance/running/list">运行中流程表(外置)</a></li>
			<li><a rel="form/formkey/process-instance/finished/list">已结束流程(外置)</a></li>
		</ul>
	</li>
    <li>
        <a rel='#' title="不区分表单类型，可以显示设计器设计后部署的流程">综合流程</a>
        <ul>
            <li><a rel="form/dynamic/process-list?processType=all">流程列表</a></li>
            <li><a rel="form/dynamic/task/list?processType=all">任务列表(综合)</a></li>
            <li><a rel="form/dynamic/process-instance/running/list?processType=all">运行中流程表(综合)</a></li>
            <li><a rel="form/dynamic/process-instance/finished/list?processType=all">已结束流程(综合)</a></li>
        </ul>
    </li>
	<li>
		<a rel="#">管理模块</a>
		<ul>
			<li>
				<a rel='#'>流程管理</a>
				<ul>
					<li><a rel='workflow/process-list'>流程定义及部署管理</a></li>
					<li><a rel='workflow/processinstance/running'>运行中流程</a></li>
					<li><a rel='workflow/model/list'>模型工作区</a></li>
				</ul>
			</li>
			<li><a href="#" rel='management/engine'>引擎属性</a></li>
			<li><a href="#" rel='management/database'>引擎数据库</a></li>
			<li><a href="#" rel='management/job/list'>作业管理</a></li>
			<li><a href="#" rel='management/identity/user/list'>用户与组</a></li>
		</ul>
	</li>
	<li>
		<a rel="#">Rest示例</a>
		<ul>
			<li><a href="${ctx}/rest/management/properties" target="_blank">引擎属性</a></li>
			<li><a href="${ctx}/rest/runtime/tasks" target="_blank">我的任务</a></li>
			<li><a href="${ctx}/rest/runtime/executions" target="_blank">我参与的流程</a></li>
			<li><a href="${ctx}/rest/management/tables" target="_blank">数据库表</a></li>
			<li><a href="${ctx}/rest/identity/users" target="_blank">用户</a></li>
			<li><a href="${ctx}/rest/identity/groups" target="_blank">组</a></li>
		</ul>
	</li>
</ul>