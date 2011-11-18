package com.wsria.demo.activiti.web.activiti;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.apache.struts2.ServletActionContext;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;

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

	private Page<Task> page = new Page<Task>();

	/**
	 * running list
	 * @return
	 */
	public String runningList() {
		try {
			TaskQuery taskQuery = taskService.createTaskQuery().processDefinitionKey("leave")
					.taskCandidateUser(UserUtil.getCurrentUserId());
			List<Task> tasks = taskQuery.listPage(0, 10);
			page.setTotalCount(taskQuery.count());
			page.setResult(tasks);
			page.setTotalCount(tasks.size());
			Map<String, Object> result = new HashMap<String, Object>();
			result.put("page", page);

			ObjectMapper mapper = new ObjectMapper();
			HttpServletResponse response = ServletActionContext.getResponse();
			//设置headers参数
			String fullContentType = "application/jso;charset=UTF-8";
			response.setContentType(fullContentType);
			mapper.writeValue(response.getWriter(), result);
		} catch (Exception e) {
			logger.error("读取运行中流程出错：", e);
		}
		return null;
	}

	public void setPage(Page<Task> page) {
		this.page = page;
	}

}
