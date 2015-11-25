<%@tag pageEncoding="UTF-8"%>
<%@ attribute name="page" type="me.kafeitu.demo.activiti.util.Page" required="true"%>
<%@ attribute name="paginationSize" type="java.lang.Integer" required="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
    int current =  page.getPageNo();
    long begin = Math.max(1, current - paginationSize/2);
    long end = Math.min(begin + (paginationSize - 1), page.getTotalPages());
    request.setAttribute("current", current);
    request.setAttribute("begin", begin);
    request.setAttribute("end", end);
%>
<div class="pagination pagination-centered">
    <ul>
        <li class="disabled"><a>共${page.totalCount }条数据</a></li>
        <% if ((page.isHasNext() && current != 1) || (current == end && current != 1)){%>
        <li><a href="?p=1&ps=${page.pageSize}&${page_params}">&lt;&lt;</a></li>
        <li><a href="?p=${current-1}&ps=${page.pageSize}&${page_params}">&lt;</a></li>
        <%}else{%>
        <li class="disabled"><a href="#">&lt;&lt;</a></li>
        <li class="disabled"><a href="#">&lt;</a></li>
        <%} %>

        <c:forEach var="i" begin="${begin}" end="${end}">
            <c:choose>
                <c:when test="${i == current}">
                    <li class="active"><a href="?p=${i}&ps=${page.pageSize}&${page_params}">${i}</a></li>
                </c:when>
                <c:otherwise>
                    <li><a href="?p=${i}&ps=${page.pageSize}&${page_params}">${i}</a></li>
                </c:otherwise>
            </c:choose>
        </c:forEach>

        <% if (page.isHasNext()){%>
        <li><a href="?p=${current+1}&ps=${page.pageSize}&${page_params}">&gt;</a></li>
        <li><a href="?p=${page.totalPages}&ps=${page.pageSize}&${page_params}">&gt;&gt;</a></li>
        <%}else{%>
        <li class="disabled"><a href="#">&gt;</a></li>
        <li class="disabled"><a href="#">&gt;&gt;</a></li>
        <%} %>
    </ul>
</div>