package me.kafeitu.demo.activiti.webservice;

import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.xml.datatype.XMLGregorianCalendar;

/**
 * 请假WebService接口
 * @author: Henry Yan
 */
@WebService
public interface LeaveWebService {

    /**
     * 是否需要总经理审批
     * @param startDate 请假开始时间
     * @param endDate   请假结束时间
     * @return  true|false
     */
    @WebResult(name="needed")
    boolean generalManagerAudit(@WebParam(name = "startDate") XMLGregorianCalendar startDate, @WebParam(name = "endDate") XMLGregorianCalendar endDate) throws Exception;

}
