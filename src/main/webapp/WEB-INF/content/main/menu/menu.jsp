<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<ul id="css3menu">
	<li class="topfirst"><a rel="main/welcome.action">首页</a></li>
	<li>
		<a rel="#">考勤管理</a>
		<ul>
			<li><a rel="workLeave/work-leave-list.action">请假流程</a></li>
		</ul>
	</li>
	<li>
		<a rel="#">系统管理</a>
		<ul>
			<li><a title="数据字典管理" rel="common/system-dict-list.action"><span>数据字典管理</span></a></li>
			<li>
				<a rel="#">组织及权限</a>
				<ul>
					<li><a title="用户管理" rel="account/user-list.action"><span>用户管理</span></a></li>
			        <li><a title="角色管理" rel="account/role-list.action"><span>角色管理</span></a></li>
				</ul>
			</li>
		</ul>
	</li>
	<li>
		<a rel='#'>流程管理</a>
		<ul>
			<li><a rel='activiti/activiti-manager.action'>流程列表</a></li>
		</ul>
	</li>
</ul>