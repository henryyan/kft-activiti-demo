package com.wsria.demo.activiti.web.activiti;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.runchain.arch.web.base.BaseActionSupport;
import com.wsria.demo.activiti.util.account.UserUtil;

/**
 * 工作流Activiti Task相关Action
 * 
 * @author HenryYan
 *
 */
public class ActivitiTaskAction extends BaseActionSupport {

	private static final long serialVersionUID = 1L;

	@Autowired
	protected RuntimeService runtimeService;
	
	@Autowired
	protected TaskService taskService;
	
	private String taskId;
	
	public String claim() {
		try {
			taskService.claim(taskId, UserUtil.getCurrentUserId());
			logger.debug("用户：{}签收任务成功！", UserUtil.getCurrentUserId());
			Struts2Utils.renderText(SUCCESS);
		} catch (Exception e) {
			logger.error("签收任务出错，taskId:{}", taskId, e);
		}
		return null;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}
	
}
