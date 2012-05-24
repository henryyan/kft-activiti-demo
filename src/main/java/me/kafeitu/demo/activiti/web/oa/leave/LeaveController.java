package me.kafeitu.demo.activiti.web.oa.leave;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import me.kafeitu.demo.activiti.entity.oa.Leave;
import me.kafeitu.demo.activiti.service.oa.leave.LeaveManager;
import me.kafeitu.demo.activiti.service.oa.leave.LeaveWorkflowService;
import me.kafeitu.demo.activiti.util.UserUtil;

import org.activiti.engine.TaskService;
import org.activiti.engine.identity.User;
import org.activiti.engine.runtime.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * 请假控制器，包含保存、启动流程
 *
 * @author HenryYan
 */
@Controller
@RequestMapping(value = "/oa/leave")
public class LeaveController {

	@Autowired
	protected LeaveManager leaveManager;

	@Autowired
	protected LeaveWorkflowService workflowService;

	@Autowired
	protected TaskService taskService;

	@RequestMapping(value = { "apply", "" })
	public String createForm(Model model) {
		model.addAttribute("leave", new Leave());
		return "/oa/leave/leaveApply";
	}

	/**
	 * 启动请假流程
	 * @param leave	
	 */
	@RequestMapping(value = "start", method = RequestMethod.POST)
	public String startWorkflow(Leave leave, RedirectAttributes redirectAttributes, HttpSession session) {
		User user = UserUtil.getUserFromSession(session);
		leave.setUserId(user.getId());
		Map<String, Object> variables = new HashMap<String, Object>();
		ProcessInstance processInstance = workflowService.startWorkflow(leave, variables);
		redirectAttributes.addFlashAttribute("message", "流程已启动，流程ID：" + processInstance.getId());
		return "redirect:/oa/leave/apply";
	}

	/**
	 * 任务列表
	 * @param leave	
	 */
	@RequestMapping(value = "task/list")
	public ModelAndView taskList(HttpSession session) {
		ModelAndView mav = new ModelAndView("/oa/leave/taskList");
		String userId = UserUtil.getUserFromSession(session).getId();
		List<Leave> results = workflowService.findTodoTasks(userId);
		mav.addObject("leaves", results);
		return mav;
	}

	/**
	 * 任务列表
	 * @param leave	
	 */
	@RequestMapping(value = "task/claim")
	public String claim(@RequestParam("id") String taskId, HttpSession session, RedirectAttributes redirectAttributes) {
		String userId = UserUtil.getUserFromSession(session).getId();
		taskService.claim(taskId, userId);
		redirectAttributes.addFlashAttribute("message", "任务已签收");
		return "redirect:/oa/leave/task/list";
	}
	
	@RequestMapping(value = "detail")
	@ResponseBody
	public Leave getLeave(@RequestParam("id") Long id) {
		return leaveManager.getLeave(id);
	}
	
}
