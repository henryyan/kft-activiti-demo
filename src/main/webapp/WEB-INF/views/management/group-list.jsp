<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <%@ include file="/common/global.jsp"%>
    <%@ include file="/common/meta.jsp" %>
    <link rel="stylesheet" href="${ctx }/css/bootstrap.min.css" type="text/css"/>
    <link rel="stylesheet" href="${ctx }/css/bootstrap-responsive.min.css" type="text/css"/>
    <link rel="stylesheet" href="${ctx }/css/style.css" type="text/css"/>

    <script src="${ctx }/js/common/jquery-1.8.3.js" type="text/javascript"></script>
    <script type="text/javascript" src="${ctx }/js/common/bootstrap.min.js"></script>
    <title>组列表--management</title>
    <script type="text/javascript">
        $(function() {
            $('.edit-group').click(function() {
                var $tr = $('#' + $(this).data('id'));
                $('#groupId').val($tr.find('.prop-id').text());
                $('#groupName').val($tr.find('.prop-name').text());
                $('#type').val($tr.find('.prop-type').text());
            });
        });
    </script>
</head>
<body>
<ul class="nav nav-pills">
    <li><a href="${ctx}/management/identity/user/list"><i class="icon-user"></i>用户管理</a></li>
    <li class="active"><a href="${ctx}/management/identity/group/list"><i class="icon-list"></i>组管理</a></li>
</ul>
<hr>
<c:if test="${not empty message}">
    <div id="message" class="alert alert-success">${message}</div>
    <!-- 自动隐藏提示信息 -->
    <script type="text/javascript">
        setTimeout(function() {
            $('#message').hide('slow');
        }, 5000);
    </script>
</c:if>
<c:if test="${not empty errorMsg}">
    <div id="messageError" class="alert alert-error">${errorMsg}</div>
    <!-- 自动隐藏提示信息 -->
    <script type="text/javascript">
        setTimeout(function() {
            $('#messageError').hide('slow');
        }, 5000);
    </script>
</c:if>
<div class="row">
    <div class="span8">
        <fieldset>
            <legend><small>组列表</small></legend>
            <table width="100%" class="table table-bordered table-hover table-condensed">
                <thead>
                <tr>
                    <th>组ID</th>
                    <th>组名称</th>
                    <th>类型</th>
                    <th width="140">操作</th>
                </tr>
                </thead>
                <tbody>
                <c:forEach items="${page.result }" var="group">
                    <tr id="${group.id}">
                        <td class="prop-id">${group.id}</td>
                        <td class="prop-name">${group.name}</td>
                        <td class="prop-type">${group.type}</td>
                        <td>
                            <a class="btn btn-danger btn-small" href="${ctx}/management/identity/group/delete/${group.id}"><i class="icon-remove"></i>删除</a>
                            <a class="btn btn-info btn-small edit-group" data-id="${group.id}" href="#"><i class="icon-pencil"></i>编辑</a>
                        </td>
                    </tr>
                </c:forEach>
                </tbody>
            </table>
            <tags:pagination page="${page}" paginationSize="${page.pageSize}"/>
        </fieldset>
    </div>
    <div class="span4">
        <form action="${ctx }/management/identity/group/save" class="form-horizontal" method="post">
            <input type="hidden" name="id"/>
            <fieldset>
                <legend><small>新增/编辑组</small></legend>
                <div id="messageBox" class="alert alert-error input-large controls" style="display:none">输入有误，请先更正。</div>
                <div class="control-group">
                    <label for="groupId" class="control-label">组ID:</label>
                    <div class="controls">
                        <input type="text" id="groupId" name="groupId" class="required" />
                    </div>
                </div>
                <div class="control-group">
                    <label for="groupName" class="control-label">组名:</label>
                    <div class="controls">
                        <input type="text" id="groupName" name="groupName" class="required" />
                    </div>
                </div>
                <div class="control-group">
                    <label for="type" class="control-label">组类型:</label>
                    <div class="controls">
                        <select name="type" id="type" class="required">
                            <option value="security-role">安全角色</option>
                            <option value="feature-role">功能角色</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="reset" class="btn"><i class="icon-remove"></i>重置</button>
                    <button type="submit" class="btn btn-primary"><i class="icon-ok-sign"></i>保存</button>
                </div>
            </fieldset>
        </form>
    </div>
</div>
</body>
</html>