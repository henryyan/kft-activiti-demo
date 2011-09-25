<%-- jQuery UI的错误和警告DIV模板 --%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="ui-widget ui-tip-info" style="text-align: left;">
	<div class="ui-state-highlight ui-corner-all" style="padding: 0 .7em; margin: none; display: none"> 
		<p style="margin: .5em 0em .5em .2em;">
			<span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span>
			<strong>提示：</strong>
			<span class="ui-info-content"></span>
		</p>
	</div>
	<div class="ui-state-error ui-corner-all" style="padding: 0 .7em; display: none"> 
		<p style="margin: .5em 0em .5em .2em;">
			<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span> 
			<strong>错误：</strong>
			<span class="ui-info-content"></span>
		</p>
	</div>
</div>