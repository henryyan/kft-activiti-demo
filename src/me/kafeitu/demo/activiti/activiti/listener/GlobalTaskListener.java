package me.kafeitu.demo.activiti.activiti.listener;

import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * User: henryyan
 */
public class GlobalTaskListener implements TaskListener {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Override
    public void notify(DelegateTask delegateTask) {
        logger.debug("触发了全局监听器, pid={}, tid={}, event={}", new Object[]{
                delegateTask.getProcessInstanceId(), delegateTask.getId(), delegateTask.getEventName()
        });
    }
}
