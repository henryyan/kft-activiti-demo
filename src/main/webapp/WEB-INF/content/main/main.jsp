<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%@ include file="/common/global.jsp"%>
	<%@ include file="/common/meta.jsp" %>
    <title>上海中盈保险经纪有限公司-保险经纪业务ERP系统</title>
    <%@ include file="/common/include-base-styles.jsp" %>
	<%@ include file="/common/include-jquery-ui-theme.jsp" %>
    <link rel="stylesheet" type="text/css" href="${ctx }/css/menu.css" />
    <%@ include file="/common/include-custom-styles.jsp" %>
	<link href="${ctx }/css/main.css" type="text/css" rel="stylesheet"/>
    
    <script src="${ctx }/js/common/jquery.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/jui/jquery-ui.min.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/jui/extends/themeswitcher/jquery.ui.switcher.js" type="text/javascript"></script>
    <script src="${ctx }/js/common/plugins/tools/jquery.cookie.js" type="text/javascript"></script>
	<script src="${ctx }/js/common/plugins/jui/extends/layout/jquery.layout.min.js" type="text/javascript"></script>
	<script src='${ctx }/js/common/common.js' type="text/javascript"></script>
    <script src='${ctx }/js/module/main/main-frame.js' type="text/javascript"></script>
</head>
<body>
<!-- #TopPane -->
<div id="topPane" class="ui-layout-north ui-widget ui-widget-header ui-widget-content">
	<div style="padding-left:5px; font-size: 16px; margin-top: 1px;">
       	<table id="topTable" style="padding: 0px;margin: 0px;margin-top: -5px" width="100%">
       		<tr>
       			<td width="40px">
       				<img src="${ctx }/images/logos/logo.png" height="48" align="top" />
       			</td>
       			<td>
       				<span style="font-size: 17px;color:#FFFF33">上海中盈保险经纪有限公司</span><br/>
       				<span style="font-size: 14px;color:#FFFF33;padding-left: 2em;">保险经纪业务ERP系统</span>
       			</td>
       			<td>
       				<div style="float:right; color: #fff;font-size: 12px;margin-top: 2px">
		        		<div>
		        			<label for="username">欢迎：</label><span id="username" style="padding-right: 3px"></span>
		        		</div>
       					<div style="margin-top:-2px">
       						<label for="roles">角色：</label>
       						<select id="roles">
	       						<optgroup label="业务角色">
	       							<option value="martMan">市场人员</option>
	        						<option value="businessManager">业务经理</option>
	        						<option value="businessMan">业务人员</option>
	        						<option value="generalManager">总经理</option>
	        						<option value="financialWorker">财务人员</option>
	        						<option value="cashier">出纳人员</option>
	        					</optgroup>
	        					<optgroup label="系统管理角色">
	      								<option value="systemManager">系统管理员</option>
	      							</optgroup>
	        				</select>
       					</div>
		        	</div>
       			</td>
       			<td width="50" class="main-options">
       				<a id="chang-theme" href="#">切换风格</a>
       				<a href="#" id="editpass">修改密码</a>
       				<a href="#" id="loginOut">安全退出</a>
       			</td>
       		</tr>
       	</table>
       </div>
</div>

<!-- RightPane -->
<div id="centerPane" class="ui-layout-center ui-helper-reset ui-widget-content">
	<div id="tabs">
		<ul><li><a class="tabs-title" href="#tab-index">首页</a></li></ul>
		<div id="tab-index">
			<iframe id="centerIframe" name="centerIframe" scrolling="auto" frameborder="0" style="width:100%;height:100%;"></iframe>
		</div>
	</div>
</div>

<!-- #BottomPane -->
<div id="bottomPane" class="ui-layout-south ui-widget ui-widget-content">
	<div class="footer ui-state-default">
		<a href="" target="_blank">上海中盈保险经纪有限公司</a>
		<span class="copyright">©2011-2012</span>
	</div>
</div>
<%@ include file="./menu/menu.jsp" %>
<div id="themeswitcherDialog"><div id="switcher"></div></div>
</body>
</html>