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
    <title>Job列表</title>

    <script type="text/javascript">
        $(function() {
            $('.change-retries').click(function() {
                var retries = prompt('请输入重试次数：');
                if (isNaN(retries)) {
                    alert('请输入数字!');
                } else {
                    location.href = ctx + '/management/job/change/retries/' + $(this).data('jobid') + "?retries=" + retries;
                }
            });
        });
    </script>
</head>
<body>
<div class='page-title ui-corner-all'>作业管理列表</div>
<table width="100%" class="table table-bordered table-hover table-condensed">
    <thead>
    <tr>
        <th>作业ID</th>
        <th>作业类型</th>
        <th>预定时间</th>
        <th>可重试次数</th>
        <th>流程定义ID</th>
        <th>流程实例ID</th>
        <th>执行ID</th>
        <th>异常消息</th>
        <th>作业配置信息</th>
        <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <c:forEach items="${page.result }" var="job">
        <tr>
            <td>${job.id}</td>
            <td>${JOB_TYPES[job.jobHandlerType]}</td>
            <td><fmt:formatDate value="${job.duedate}" pattern="yyyy-MM-dd hh:mm:ss"/></td>
            <td>${job.retries}</td>
            <td>${job.processDefinitionId}</td>
            <td>${job.processInstanceId}</td>
            <td>${job.executionId}</td>
            <td title="${exceptionStacktraces[job.id]}">${job.exceptionMessage}</td>
            <td>
                <%-- 特殊处理异步的job --%>
                <c:if test="${job.jobHandlerType == 'async-continuation'}">
                    到期时间：<fmt:formatDate value="${job.lockExpirationTime}" pattern="yyyy-MM-dd hh:mm:ss"/>
                    <br/>
                    锁标示(UUID)：${job.lockOwner}
                </c:if>
                ${job.jobHandlerConfiguration}
            </td>
            <td>
                <div class="btn-group">
                    <a class="btn btn-small btn-danger dropdown-toggle" data-toggle="dropdown" href="#">操作
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu" style="min-width: 100px;margin-left: -70px;">
                        <li><a href="execute/${job.id}"><i class="icon-play"></i>执行</a></li>
                        <li><a href="delete/${job.id}"><i class="icon-trash"></i>删除</a></li>
                        <li><a href="#" title="更改执行次数" data-jobid="${job.id}" class="change-retries"><i class="icon-wrench"></i>执行次数</a></li>
                    </ul>
                </div>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>
<tags:pagination page="${page}" paginationSize="${page.pageSize}"/>
</div>
</body>
</html>