package me.kafeitu.demo.activiti.web.oa.leave;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import me.kafeitu.demo.activiti.entity.oa.Leave;
import me.kafeitu.demo.activiti.service.oa.leave.LeaveWorkflowService;
import me.kafeitu.demo.activiti.util.UserUtil;

import org.activiti.engine.identity.User;
import org.activiti.engine.runtime.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
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
	protected LeaveWorkflowService workflowService;

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

}
