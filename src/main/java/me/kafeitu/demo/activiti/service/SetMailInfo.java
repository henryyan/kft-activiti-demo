package me.kafeitu.demo.activiti.service;

import java.util.Calendar;
import java.util.Date;

import org.activiti.engine.IdentityService;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.ExecutionListener;
import org.activiti.engine.identity.User;

/**
 * 请假流程--邮件任务监听器，用于设置发送邮件时的一些变量
 *
 * @author henryyan
 */
public class SetMailInfo implements ExecutionListener {

    private static final long serialVersionUID = 1L;

    @Override
    public void notify(DelegateExecution execution) throws Exception {
        IdentityService identityService = execution.getEngineServices().getIdentityService();
        String applyUserId = (String) execution.getVariable("applyUserId");
        User user = identityService.createUserQuery().userId(applyUserId).singleResult();
        String to = user.getEmail();
        execution.setVariableLocal("to", to);
        String userName = user.getFirstName() + " " + user.getLastName();
        execution.setVariableLocal("name", userName);

        // 超时提醒时间设置，请假结束时间+1天
        Date endDate = (Date) execution.getVariable("endDate");
        Calendar ca = Calendar.getInstance();
        ca.setTime(endDate);
        ca.add(Calendar.DAY_OF_MONTH, 1);
        execution.setVariableLocal("reportBackTimeout", ca.getTime());
    }

}