package me.kafeitu.demo.activiti.service.oa.leave;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import me.kafeitu.demo.activiti.entity.oa.Leave;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
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

	protected TaskService taskService;

	protected HistoryService historyService;

	protected RepositoryService repositoryService;

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

	/**
	 * 查询待办任务
	 * 
	 * @param userId 用户ID
	 * @return
	 */
	@Transactional(readOnly = true)
	public List<Leave> findTodoTasks(String userId) {
		List<Leave> results = new ArrayList<Leave>();
		List<Task> tasks = new ArrayList<Task>();

		// 根据当前人的ID查询
		List<Task> todoList = taskService.createTaskQuery().taskAssignee(userId).orderByTaskPriority().desc()
				.orderByTaskCreateTime().desc().list();

		// 根据当前人未签收的任务
		List<Task> unsignedTasks = taskService.createTaskQuery().taskCandidateUser(userId).orderByTaskPriority().desc()
				.orderByTaskCreateTime().desc().list();

		// 合并
		tasks.addAll(todoList);
		tasks.addAll(unsignedTasks);

		// 根据流程的业务ID查询实体并关联
		for (Task task : tasks) {
			String processInstanceId = task.getProcessInstanceId();
			ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId)
					.singleResult();
			String businessKey = processInstance.getBusinessKey();
			Leave leave = leaveManager.getLeave(new Long(businessKey));
			leave.setTask(task);
			leave.setProcessInstance(processInstance);
			leave.setProcessDefinition(getProcessDefinition(processInstance.getProcessDefinitionId()));
			results.add(leave);
		}
		return results;
	}

	/**
	 * 读取运行中的流程
	 * @return
	 */
	@Transactional(readOnly = true)
	public List<Leave> findRunningProcessInstaces() {
		List<Leave> results = new ArrayList<Leave>();
		List<ProcessInstance> list = runtimeService.createProcessInstanceQuery().processDefinitionKey("leave").list();

		// 关联业务实体
		for (ProcessInstance processInstance : list) {
			String businessKey = processInstance.getBusinessKey();
			Leave leave = leaveManager.getLeave(new Long(businessKey));
			leave.setProcessInstance(processInstance);
			leave.setProcessDefinition(getProcessDefinition(processInstance.getProcessDefinitionId()));
			results.add(leave);

			// 设置当前任务信息
			List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstance.getId()).orderByTaskCreateTime()
					.desc().listPage(0, 1);
			leave.setTask(tasks.get(0));

		}
		return results;
	}

	/**
	 * 读取运行中的流程
	 * @return
	 */
	@Transactional(readOnly = true)
	public List<Leave> findFinishedProcessInstaces() {
		List<Leave> results = new ArrayList<Leave>();
		List<HistoricProcessInstance> list = historyService.createHistoricProcessInstanceQuery().processDefinitionKey("leave")
				.finished().list();

		// 关联业务实体
		for (HistoricProcessInstance historicProcessInstance : list) {
			String businessKey = historicProcessInstance.getBusinessKey();
			Leave leave = leaveManager.getLeave(new Long(businessKey));
			leave.setProcessDefinition(getProcessDefinition(historicProcessInstance.getProcessDefinitionId()));
			leave.setHistoricProcessInstance(historicProcessInstance);
			results.add(leave);
		}
		return results;
	}

	/**
	 *  查询流程定义对象
	 * @param processDefinitionId	流程定义ID
	 * @return
	 */
	protected ProcessDefinition getProcessDefinition(String processDefinitionId) {
		ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
				.processDefinitionId(processDefinitionId).singleResult();
		return processDefinition;
	}

	@Autowired
	public void setLeaveManager(LeaveManager leaveManager) {
		this.leaveManager = leaveManager;
	}

	@Autowired
	public void setRuntimeService(RuntimeService runtimeService) {
		this.runtimeService = runtimeService;
	}

	@Autowired
	public void setTaskService(TaskService taskService) {
		this.taskService = taskService;
	}

	@Autowired
	public void setHistoryService(HistoryService historyService) {
		this.historyService = historyService;
	}

	@Autowired
	public void setRepositoryService(RepositoryService repositoryService) {
		this.repositoryService = repositoryService;
	}

}
