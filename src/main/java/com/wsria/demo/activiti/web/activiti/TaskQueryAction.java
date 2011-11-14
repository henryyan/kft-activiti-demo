package com.wsria.demo.activiti.web.activiti;

import java.util.List;

import org.activiti.engine.TaskService;
import org.activiti.engine.impl.persistence.entity.TaskEntity;
import org.activiti.engine.task.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.opensymphony.xwork2.ActionSupport;
import com.wsria.demo.activiti.util.account.UserUtil;

/**
 * 流程查询
 * 
 * @author HenryYan
 *
 */
public class TaskQueryAction extends ActionSupport {

	private static final long serialVersionUID = 1L;

	protected Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	TaskService taskService;
	
	/**
	 * 运行中流程
	 * @return
	 */
	public String runningList() {
		try {
			List<Task> tasks = taskService.createTaskQuery().processDefinitionKey("leave")
					.taskCandidateUser(UserUtil.getCurrentUserId()).listPage(0, 10);
			for (Task task : tasks) {
				org.activiti.engine.impl.persistence.entity.TaskEntity te = (TaskEntity) task;
				System.out.println(task);
				System.out.println(te.getIdentityLinks());
			}
		} catch (Exception e) {
			logger.error("读取运行中流程出错：{}", e);
		}
		return null;
	}

}
