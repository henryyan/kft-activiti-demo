package me.kafeitu.demo.activiti.web.form.dynamic;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import me.kafeitu.demo.activiti.util.UserUtil;

import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.form.FormProperty;
import org.activiti.engine.form.StartFormData;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.identity.User;
import org.activiti.engine.impl.form.StartFormDataImpl;
import org.activiti.engine.impl.form.TaskFormDataImpl;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * 动态表单Controller
 * 了解不同表单请访问：http://www.kafeitu.me/activiti/2012/08/05/diff-activiti-workflow-forms.html
 * @author HenryYan
 */
@Controller
@RequestMapping(value = "/form/dynamic")
public class DynamicFormController {

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private RepositoryService repositoryService;

	@Autowired
	private FormService formService;

	@Autowired
	private TaskService taskService;

	@Autowired
	private IdentityService identityService;

	@Autowired
	private HistoryService historyService;

	@Autowired
	private RuntimeService runtimeService;

	/**
	 * 动态form流程列表
	 * @param model
	 * @return
	 */
	@RequestMapping(value = { "process-list", "" })
	public ModelAndView processDefinitionList(Model model) {
		ModelAndView mav = new ModelAndView("/form/dynamic/dynamic-form-process-list");
		
		/*
		 * 只读取动态表单：leave-dynamic-from
		 */
		List<ProcessDefinition> list = repositoryService.createProcessDefinitionQuery()
				.processDefinitionKey("leave-dynamic-from").list();

		mav.addObject("processes", list);
		return mav;
	}

	/**
	 * 读取启动流程的表单字段
	 */
	@RequestMapping(value = "get-form/start/{processDefinitionId}")
	@ResponseBody
	public StartFormData findStartForm(@PathVariable("processDefinitionId") String processDefinitionId) throws Exception {
		StartFormDataImpl startFormData = (StartFormDataImpl) formService.getStartFormData(processDefinitionId);
		startFormData.setProcessDefinition(null);
		return startFormData;
	}

	/**
	 * 读取Task的表单
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "get-form/task/{taskId}")
	@ResponseBody
	public Map<String, Object> findTaskForm(@PathVariable("taskId") String taskId) throws Exception {
		Map<String, Object> result = new HashMap<String, Object>();
		TaskFormDataImpl taskFormData = (TaskFormDataImpl) formService.getTaskFormData(taskId);

		// 设置task为null，否则输出json的时候会报错
		taskFormData.setTask(null);

		result.put("taskFormData", taskFormData);
		/*
		 * 读取enum类型数据，用于下拉框
		 */
		List<FormProperty> formProperties = taskFormData.getFormProperties();
		for (FormProperty formProperty : formProperties) {
			Map<String, String> values = (Map<String, String>) formProperty.getType().getInformation("values");
			if (values != null) {
				for (Entry<String, String> enumEntry : values.entrySet()) {
					logger.debug("enum, key: {}, value: {}", enumEntry.getKey(), enumEntry.getValue());
				}
				result.put(formProperty.getId(), values);
			}
		}

		return result;
	}

	/**
	 * 提交task的并保存form
	 */
	@RequestMapping(value = "task/complete/{taskId}")
	@SuppressWarnings("unchecked")
	public String completeTask(@PathVariable("taskId") String taskId, RedirectAttributes redirectAttributes,
			HttpServletRequest request) {
		Map<String, String> formProperties = new HashMap<String, String>();

		// 从request中读取参数然后转换
		Map<String, String[]> parameterMap = request.getParameterMap();
		Set<Entry<String, String[]>> entrySet = parameterMap.entrySet();
		for (Entry<String, String[]> entry : entrySet) {
			String key = entry.getKey();

			// fp_的意思是form paremeter
			if (StringUtils.defaultString(key).startsWith("fp_")) {
				formProperties.put(key.split("_")[1], entry.getValue()[0]);
			}
		}

		logger.debug("start form parameters: {}", formProperties);

		User user = UserUtil.getUserFromSession(request.getSession());

		// 用户未登陆不能操作，实际应用使用权限框架实现，例如Spring Security、Shiro等
		if (user == null || StringUtils.isBlank(user.getId())) {
			return "redirect:/login?timeout=true";
		}
		identityService.setAuthenticatedUserId(user.getId());

		formService.submitTaskFormData(taskId, formProperties);

		redirectAttributes.addFlashAttribute("message", "任务完成：taskId=" + taskId);
		return "redirect:/form/dynamic/task/list";
	}

	/**
	 * 读取启动流程的表单字段
	 */
	@RequestMapping(value = "start-process/{processDefinitionId}")
	@SuppressWarnings("unchecked")
	public String submitStartFormAndStartProcessInstance(@PathVariable("processDefinitionId") String processDefinitionId,
			RedirectAttributes redirectAttributes, HttpServletRequest request) {
		Map<String, String> formProperties = new HashMap<String, String>();

		// 从request中读取参数然后转换
		Map<String, String[]> parameterMap = request.getParameterMap();
		Set<Entry<String, String[]>> entrySet = parameterMap.entrySet();
		for (Entry<String, String[]> entry : entrySet) {
			String key = entry.getKey();

			// fp_的意思是form paremeter
			if (StringUtils.defaultString(key).startsWith("fp_")) {
				formProperties.put(key.split("_")[1], entry.getValue()[0]);
			}
		}

		logger.debug("start form parameters: {}", formProperties);

		User user = UserUtil.getUserFromSession(request.getSession());
		// 用户未登陆不能操作，实际应用使用权限框架实现，例如Spring Security、Shiro等
		if (user == null || StringUtils.isBlank(user.getId())) {
			return "redirect:/login?timeout=true";
		}
		identityService.setAuthenticatedUserId(user.getId());

		ProcessInstance processInstance = formService.submitStartFormData(processDefinitionId, formProperties);
		logger.debug("start a processinstance: {}", processInstance);

		redirectAttributes.addFlashAttribute("message", "启动成功，流程ID：" + processInstance.getId());
		return "redirect:/form/dynamic/process-list";
	}

	/**
	 * task列表
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "task/list")
	public ModelAndView taskList(Model model, HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("/form/dynamic/dynamic-form-task-list");
		User user = UserUtil.getUserFromSession(request.getSession());

		List<Task> tasks = new ArrayList<Task>();

		/**
		 * 这里为了演示区分开自定义表单的请假流程，值读取leave-dynamic-from
		 */

		// 分配到当前登陆用户的任务
		List<Task> list = taskService.createTaskQuery().processDefinitionKey("leave-dynamic-from").taskAssignee(user.getId())
				.list();

		// 为签收的任务
		List<Task> list2 = taskService.createTaskQuery().processDefinitionKey("leave-dynamic-from")
				.taskCandidateUser(user.getId()).list();

		tasks.addAll(list);
		tasks.addAll(list2);

		mav.addObject("tasks", tasks);
		return mav;
	}

	/**
	 * 签收任务
	 */
	@RequestMapping(value = "task/claim/{id}")
	public String claim(@PathVariable("id") String taskId, HttpSession session, RedirectAttributes redirectAttributes) {
		String userId = UserUtil.getUserFromSession(session).getId();
		taskService.claim(taskId, userId);
		redirectAttributes.addFlashAttribute("message", "任务已签收");
		return "redirect:/form/dynamic/task/list";
	}

	/**
	 * 运行中的流程实例
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "process-instance/running/list")
	public ModelAndView running(Model model, HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("/form/dynamic/dynamic-form-running-list");
		List<ProcessInstance> list = runtimeService.createProcessInstanceQuery().list();
		mav.addObject("list", list);
		return mav;
	}

	/**
	 * 已结束的流程实例
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "process-instance/finished/list")
	public ModelAndView finished(Model model, HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("/form/dynamic/dynamic-form-finished-list");
		List<HistoricProcessInstance> list = historyService.createHistoricProcessInstanceQuery().finished().list();
		mav.addObject("list", list);
		return mav;
	}

}
