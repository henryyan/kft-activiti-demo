package me.kafeitu.demo.activiti.service.oa.leave;

import java.util.Map;

import me.kafeitu.demo.activiti.entity.oa.Leave;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * 请假流程Service
 *
 * @author HenryYan
 */
@Component
@Transactional
public class LeaveWorkflowService {

	private static Logger logger = LoggerFactory.getLogger(LeaveWorkflowService.class);

	private LeaveManager leaveManager;

	private RuntimeService runtimeService;

	/**
	 * 启动流程
	 * @param entity
	 */
	public ProcessInstance startWorkflow(Leave entity, Map<String, Object> variables) {
		leaveManager.saveLeave(entity);
		logger.debug("save entity: {}", entity);
		String businessKey = entity.getId().toString();
		ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("leave", businessKey, variables);
		String processInstanceId = processInstance.getId();
		entity.setProcessInstanceId(processInstanceId);
		logger.debug("start process of {key={}, bkey={}, pid={}, variables={}}", new Object[] { "leave", businessKey,
				processInstanceId, variables });
		return processInstance;
	}

	@Autowired
	public void setLeaveManager(LeaveManager leaveManager) {
		this.leaveManager = leaveManager;
	}

	@Autowired
	public void setRuntimeService(RuntimeService runtimeService) {
		this.runtimeService = runtimeService;
	}

}
