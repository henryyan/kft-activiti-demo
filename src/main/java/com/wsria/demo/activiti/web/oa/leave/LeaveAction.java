package com.wsria.demo.activiti.web.oa.leave;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.impl.context.Context;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.runchain.arch.util.orm.EntityUtils;
import com.runchain.arch.util.orm.PropertyFilterUtils;
import com.runchain.arch.web.base.JqGridCrudActionSupportWithWorkflow;
import com.wsria.demo.activiti.entity.oa.leave.Leave;
import com.wsria.demo.activiti.service.oa.leave.LeaveManager;
import com.wsria.demo.activiti.util.account.UserUtil;
import com.wsria.demo.activiti.util.common.WorkflowConstants;
import com.wsria.demo.activiti.util.workflow.WorkflowUtils;

/**
 * 请假Action 
 * 
 * @author HenryYan
 *
 */
@Result(name = "todoList", location = "leave-todo.jsp")
public class LeaveAction extends JqGridCrudActionSupportWithWorkflow<Leave, Long> {

	private static final long serialVersionUID = 1L;

	@Autowired
	LeaveManager leaveManager;

	@Override
	public Leave getModel() {
		return entity;
	}

	@Override
	public Page<Leave> getPage() {
		return page;
	}

	@Override
	public String save() {
		try {
			leaveManager.saveEntity(entity);
			Map<String, Object> responses = new HashMap<String, Object>();
			responses.put("id", entity.getId());
			responses.put("success", true);
			Struts2Utils.renderJson(responses);
		} catch (Exception e) {
			logger.error("保存单个请假", e);
		}
		return null;
	}

	@Override
	public String delete() {
		try {
			leaveManager.deleteEntity(id);
		} catch (Exception e) {
			logger.error("删除单个请假", e);
		}
		return null;
	}

	@Override
	public String list() {
		try {
			List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
			PropertyFilterUtils.handleFilter(page, Leave.class, filters);
			filters.add(new PropertyFilter("INS_processInstanceId", ""));
			page = leaveManager.searchProperty(page, filters);
		} catch (Exception e) {
			logger.error("请假列表 ", e);
		}
		return JSON;
	}

	/**
	 * 运行中流程
	 * @return
	 */
	public String runningList() {
		try {
			// 根据角色查询任务
			TaskQuery taskQuery = taskService.createTaskQuery().processDefinitionKey(getProcessName()).taskCandidateUser(UserUtil.getCurrentUserId());

			// 根据代理人查询任务
			//			TaskQuery taskQuery = processEngine.getTaskService().createTaskQuery().processDefinitionKey(getProcessName())
			//					.taskAssignee(UserUtil.getCurrentUserId());

			// 根据个人查询任务
			//			TaskQuery taskQuery = taskService.createTaskQuery().processDefinitionKey(getProcessName()).taskOwner(UserUtil.getCurrentUserId());
			List<Task> tasks = taskQuery.listPage(0, 10);

			List<Leave> leaves = new ArrayList<Leave>();
			long startTime = System.currentTimeMillis();
			logger.debug("开始读取正在运行流程：{}", startTime);
			System.out.println(Context.getCommandContext());
			for (Task task : tasks) {
				String processInstanceId = task.getProcessInstanceId();
				ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
				if (processInstance != null) {
					String businessKey = processInstance.getBusinessKey();
					Leave leave = leaveManager.getEntity(Long.parseLong(businessKey));
					leave.setProcessInstance(WorkflowUtils.cloneExProcessInstance(processInstance));
					leave.setTask(WorkflowUtils.cloneExTask(task));
					leaves.add(leave);
				}
			}
			logger.debug("结束读取正在运行流程，耗时：{}", System.currentTimeMillis() - startTime);
			page.setResult(leaves);
			page.setTotalCount(taskQuery.count());
		} catch (Exception e) {
			logger.error("运行中请假列表 ", e);
		}
		return JSON;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id != null) {
			// 获取单个请假
			entity = leaveManager.getEntity(id);
		} else {
			entity = new Leave();
			entity.setUserId(UserUtil.getCurrentUserId());
			entity.setUserName(UserUtil.getCurrentUserName());
			entity.setApplyTime(new Date());
		}
	}

	/**
	 * 启动流程
	 * @return
	 */
	public String start() {
		try {
			if (EntityUtils.isNew(entity.getId())) {
				leaveManager.saveEntity(entity);
			}
			ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(getProcessName(), entity.getId().toString());
			entity.setProcessInstanceId(processInstance.getId());
			leaveManager.saveEntity(entity);
			Map<String, Object> responses = new HashMap<String, Object>();
			responses.put("bkey", entity.getId());
			responses.put("pid", processInstance.getId());
			responses.put("success", true);
			responses.put("started", true);
			Struts2Utils.renderJson(responses);
		} catch (Exception e) {
			logger.error("启动流程：[pname: {}, businessKey: {}]，失败：", new Object[] { getProcessName(), id, e });
		}
		return null;
	}
	
	/**
	 * 完成任务
	 * @return
	 */
	public String complete() {
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("approved", Struts2Utils.getParameter("approved"));
		taskService.complete(taskId, variables);
		return null;
	}

	@Override
	protected String getProcessName() {
		return WorkflowConstants.LEAVE;
	}

}
