<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<%@ include file="/common/global.jsp"%>
	<%@ include file="/common/meta.jsp"%>
	<title>中盈保险ERP系统Portal</title>
	<%@ include file="/common/include-base-styles.jsp" %>
	<%@ include file="/common/include-custom-styles.jsp" %>
	<link rel="stylesheet" type="text/css" href="${ctx }/js/common/plugins/jpolite/css/jquery.gritter.css"/>
	<link rel="stylesheet" type="text/css" href="${ctx }/js/common/plugins/jpolite/css/jqModal.css"/>
	<link href="${ctx }/js/common/plugins/jpolite/css/style.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx }/js/common/plugins/jpolite/css/style0.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx }/js/common/plugins/jpolite/css/style1.css" type="text/css" rel="stylesheet"/>
	<style type="text/css">
	.moduleHeader, .moduleContent {margin: 0px;}
	</style>
</head>
<body style="background-image: url('${ctx }/images/logos/back.jpg');">
	<ul id="main_nav" style="display:none">
		<li id="t1"><b class="hover">About V2</b>About V2</li>
		<li id="t2"><b class="hover">Layout</b><span>Layout</span><dl><dd id="t21">Same content, another layout</dd></dl></li>
		<li id="t3"><b class="hover">Module</b>Module</li>
		<li id="t4"><b class="hover">Controls</b><span>Controls</span><dl><dd id="t41">Tabs &amp; Accordion</dd><dd id="t42">jQuery UI with Theme</dd></dl></li>
		<li id="t5"><b class="hover">Customize</b>Customize</li>
		<li id="t6"><b class="hover">XDO</b><span>XDO</span><dl><dd id="t61">Programming Model</dd></dl></li>
		<li id="t8"><b class="hover">Download</b>Download</li>
	</ul>
	<div id="content" class="container">
		<div id="module_menu" class="jqmWindow"></div>
		<div id="c1" class="cc"></div>
		<div id="c2" class="cc"></div>
		<div id="c3" class="cc"></div>
	
		<div id="c4" class="cc">
			<div class="module blue" id="m104:t1">
				<div class="moduleFrame">
					<div class='moduleHeader'>
						<div class='moduleTitle'>Key New Features</div>
						<div class='moduleActions'>
							<b title="Collapse" class="actionMin"></b>
							<b title="Expand" class="actionMax"></b>
	
							<b title="Close" class="actionClose"></b>
						</div>
					</div>
					<div class='moduleContent'>
						<h4>SEO Support</h4>
						<p>Note this module is a static one pre-loaded in <b>index.html</b>, which is visible to search engines.</p>
						<script type="text/javascript">
							function switchTheme(t) {
								$('link[title]','head').each(function(){
									this.disabled = true;
									this.disabled = (this.title != t); 
								});
								return false;
							};
						</script>
	
						<fieldset><legend>Live Theme Switcher</legend>
							<p>
							<button onclick="switchTheme('modern')"><img style="width:126px;height:66px" src="img/t1.png" alt="Modern"/></button>
							<button onclick="switchTheme('silver')"><img style="width:126px;height:66px" src="img/t2.png" alt="Silver"/></button>
							<button onclick="switchTheme('classic')"><img style="width:126px;height:66px" src="img/t3.png" alt="Classic"/></button>
							</p>
						</fieldset>
						<div class="span-11">
	
							<h4>Layout Persistence</h4>
							<p>Module layout can be stored and retrieved to your selected store.</p>
							<button onclick="$.cookie('jpolite2layout',null)">Reset Layout</button>
							<p class="clear">Any drag-n-drop operation will trigger save layout. To resume the original layout, press above button then refresh.</p>						
						</div>
						<div class="span-11 last">
							<h4>Popup &amp; Dropdown Menu</h4>
	
							<p>A module popup menu is provided for users to add modules to current tab.</p>
							<button onclick="$('#menu_btn').click()">Show Module Menu</button>
							<p class="clear">Dropdown menu is now supported which provides additional navigation support in addition to horizontal tabs.</p>						
						</div>
					</div>
				</div>
			</div>
		</div>
	
	</div>
	
	<!-- A series of hidden module templates carried within the page, which can be modified easily -->
	<div class="module_template"><!-- A default template is required here without an ID -->
		<div class="moduleFrame">
	
			<div class='moduleHeader'>
				<div class='moduleTitle'></div>
				<div class='moduleActions'>
					<b title="Refresh" class="actionRefresh"></b>
					<b title="Collapse" class="actionMin"></b>
					<b title="Expand" class="actionMax"></b>
					<b title="Close" class="actionClose"></b>
				</div>
			</div>
	
			<div class='moduleContent'>
				<img src="img/loading.gif" alt="Loading..."/> Loading...
			</div>
		</div>
	</div>
	<div class="module_template" id="B"><!-- The ID 'B' will be used as the index to match all module layout definition with mt:'B' -->
		<div class="moduleFrame" style="border:6px groove red">
			<div class='moduleContent' style="background:#ffc">
				<img src="img/loading.gif" alt="Loading..."/> Loading...
			</div>
	
			<div class='moduleHeader'>
				<div class='moduleTitle'></div>
				<div class='moduleActions'>
					<b title="Collapse" class="actionMin"></b>
					<b title="Expand" class="actionMax"></b>
					<b title="Close" class="actionClose"></b>
				</div>
			</div>
		</div>
	
	</div>
	<div class="module_template" id="C"><!-- The ID 'C' will be used as the index to match all module layout definition with mt:'C' -->
		<div class="moduleFrame" style="border:6px double green">
			<div class='moduleContent' style="background:#cff">
				<img src="img/loading.gif" alt="Loading..."/> Loading...
			</div>
			<div class='moduleHeader'>
				<div class='moduleTitle'></div>
				<div class='moduleActions'>
					<b title="Collapse" class="actionMin"></b>
					<b title="Expand" class="actionMax"></b>
					<b title="Close" class="actionClose"></b>
				</div>
			</div>
		</div>
	</div>
	
	<script type="text/javascript" src="${ctx }/js/common/plugins/jpolite/js/jquery.js"></script>
	<script type="text/javascript" src="${ctx }/js/common/common.js"></script>
	<script type="text/javascript" src="${ctx }/js/common/plugins/jpolite/js/jquery.cookie.js"></script>
	<script type="text/javascript" src="${ctx }/js/common/plugins/jpolite/js/jquery-ui-1.7.2.custom.min.js"></script>
	<script type="text/javascript" src="${ctx }/js/module/portal/modules.js"></script>
	<script type="text/javascript" src="${ctx }/js/common/plugins/jpolite/js/jquery.gritter.js"></script>
	<script type="text/javascript" src="${ctx }/js/common/plugins/jpolite/js/jqModal.js"></script>
	<script type="text/javascript" src="${ctx }/js/common/plugins/jpolite/js/jpolite.core.js"></script>
	<script type="text/javascript" src="${ctx }/js/common/plugins/jpolite/js/jpolite.ext.js"></script>
</body>
</html>