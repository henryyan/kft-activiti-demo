package com.wsria.demo.activiti.util.workflow;

import java.lang.reflect.InvocationTargetException;

import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.apache.commons.beanutils.PropertyUtils;

import com.runchain.arch.entity.activiti.ExProcessInstance;
import com.runchain.arch.entity.activiti.ExTask;

/**
 * 工作流相关工具类
 * 
 * @author HenryYan
 *
 */
public class WorkflowUtils {

	/**
	 * 使用Activiti的{@link ProcessInstance}属性创建新对象{@link ExProcessInstance}
	 * @param processInstance	{@link ProcessInstance}
	 * @return	接口ProcessInstance中的getters和isEnded
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 * @throws NoSuchMethodException
	 */
	public static ExProcessInstance cloneExProcessInstance(ProcessInstance processInstance) throws IllegalAccessException, InvocationTargetException,
			NoSuchMethodException {
		ExProcessInstance exProcessInstance = new ExProcessInstance();
		String[] processInstanceFields = { "id", "processInstanceId", "processDefinitionId", "businessKey" };
		for (String field : processInstanceFields) {
			PropertyUtils.setProperty(exProcessInstance, field, PropertyUtils.getProperty(processInstance, field));
		}
		exProcessInstance.setIsEnded(processInstance.isEnded());
		return exProcessInstance;
	}
	
	/**
	 * 使用Activiti的{@link Task}属性创建新对象{@link ExTask}
	 * @param task	Activiti的Task对象
	 * @return	接口{@link Task}中的getters
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 * @throws NoSuchMethodException
	 */
	public static ExTask cloneExTask(Task task) throws IllegalAccessException, InvocationTargetException, NoSuchMethodException {
		ExTask exTask = new ExTask();
		String[] taskFields = { "id", "name", "description", "priority", "owner", "assignee", "delegationState", "processInstanceId",
				"executionId", "processDefinitionId", "createTime", "taskDefinitionKey", "dueDate", "parentTaskId" };
		for (String field : taskFields) {
			PropertyUtils.setProperty(exTask, field, PropertyUtils.getProperty(task, field));
		}
		return exTask;
	}

}
