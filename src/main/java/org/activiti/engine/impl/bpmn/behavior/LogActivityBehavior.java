package org.activiti.engine.impl.bpmn.behavior;

import org.activiti.engine.ActivitiException;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.impl.el.Expression;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author 三寻
 * @version 1.0
 * @date 16/11/13
 */
public class LogActivityBehavior extends AbstractBpmnActivityBehavior {

    private static final long serialVersionUID = 1L;

    private static final Logger LOG = LoggerFactory.getLogger(LogActivityBehavior.class);

    protected Expression content;

    @Override
    public void execute(ActivityExecution execution) throws Exception {

        try {

            LOG.error(">>>>>> EXEC_ID: {}, PROC_INST_ID: {}, ct: {} <<<<<<",
                    execution.getId(),
                    execution.getProcessInstance().getId(),
                    getStringFromField(content, execution));

        } catch (ActivitiException e) {
            handleException(execution, e.getMessage(), e);
        }

        leave(execution);

    }

    protected String getStringFromField(org.activiti.engine.delegate.Expression expression, DelegateExecution execution) {
        if (expression != null) {
            Object value = expression.getValue(execution);
            if (value != null) {
                return value.toString();
            }
        }
        return null;
    }

    protected void handleException(ActivityExecution execution, String msg, Exception e) {
        LOG.warn("catch an exception for execute: {}", execution.getId());
        if (e instanceof ActivitiException) {
            throw (ActivitiException) e;
        } else {
            throw new ActivitiException(msg, e);
        }
    }
}
