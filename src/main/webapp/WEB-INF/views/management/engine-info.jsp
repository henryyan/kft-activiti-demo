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
</head>
<body>
<div class='page-title ui-corner-all'>引擎配置</div>
<table class="table table-bordered table-hover table-condensed">
    <tr>
        <th class="text-info" width="30%">属性名称</th>
        <th class="text-info">属性值</th>
    </tr>
    <c:forEach items="${engineProperties}" var="prop">
        <tr>
            <th>${prop.key}</th>
            <td>${prop.value}</td>
        </tr>
    </c:forEach>
</table>

<div class='page-title ui-corner-all'>系统参数</div>
<table class="table table-bordered table-hover table-condensed">
    <tr>
        <th class="text-info">属性名称</th>
        <th class="text-info">属性值</th>
    </tr>
    <c:forEach items="${systemProperties}" var="prop">
        <tr>
            <th>${prop.key}</th>
            <td>${prop.value}</td>
        </tr>
    </c:forEach>
</table>
</body>
</html>