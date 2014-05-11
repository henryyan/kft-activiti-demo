package me.kafeitu.demo.activiti.webservice;

import java.util.Date;
import javax.jws.WebService;
import javax.xml.datatype.XMLGregorianCalendar;

import jodd.datetime.JDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 请假WebService接口简单实现
 * @author: Henry Yan
 */
@WebService(endpointInterface = "me.kafeitu.demo.activiti.webservice.LeaveWebService", serviceName = "LeaveWebService")
public class LeaveWebServiceImpl implements LeaveWebService {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    /**
     * 计算开始日期与结束日期相差天数
     * @throws java.text.ParseException
     */
    public int daysBetween(Date startDate, Date endDate) {
        JDateTime joddStartDate = new JDateTime(startDate);
        JDateTime joddEndDate = new JDateTime(endDate);
        int result = joddStartDate.daysBetween(joddEndDate);
        logger.info("日期比较：startDate={}, endDate={}, 相差 {} 天。", startDate, endDate, result);
        return result;
    }

    @Override
    public boolean generalManagerAudit(XMLGregorianCalendar startDate, XMLGregorianCalendar endDate) throws Exception {
        Date innerStartDate = startDate.toGregorianCalendar().getTime();
        Date innerEndDate = endDate.toGregorianCalendar().getTime();
        int days = daysBetween(innerStartDate, innerEndDate);
        return days > 3 ? true : false;
    }
}