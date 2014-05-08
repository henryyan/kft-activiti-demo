<h2 id="error" class="alert alert-error">申请被驳回！！！</h2>
<table border="1">
	<tr>
		<td>请假类型：</td>
		<td>
			<select id="leaveType" name="fp_leaveType">
				<option>公休</option>
				<option>病假</option>
				<option>调休</option>
				<option>事假</option>
				<option>婚假</option>
			</select>
		</td>
	</tr>
	<tr>
		<td>开始时间：</td>
		<td><input type="text" id="startTime" value="${startTime}" name="fp_startTime" class="datetime required" /></td>
	</tr>
	<tr>
		<td>结束时间：</td>
		<td><input type="text" id="endTime" value="${endTime}" name="fp_endTime" class="datetime required" /></td>
	</tr>
	<tr>
		<td>请假原因：</td>
		<td>
			<textarea id="reason" name="fp_reason">${reason}</textarea>
		</td>
	</tr>
	<tr>
		<td>是否继续申请：</td>
		<td>
			<select id="reApply" name="fp_reApply">
				<option value='true'>重新申请</option>
				<option value='false'>结束流程</option>
			</select>
		</td>
	</tr>
</table>