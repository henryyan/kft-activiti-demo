package me.kafeitu.demo.activiti.web.workflow;

import java.util.List;

import me.kafeitu.demo.activiti.service.WorkflowProcessDefinitionService;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.ProcessDefinition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * 流程管理
 *
 * @author HenryYan
 */
@Controller
@RequestMapping(value = "/workflow")
public class ActivitiController {

	protected WorkflowProcessDefinitionService workflowProcessDefinitionService;

	protected RepositoryService repositoryService;

	@RequestMapping(value = "/process-list", method = RequestMethod.GET)
	public ModelAndView processList() {
		ModelAndView mav = new ModelAndView("workflow/process-list");
		List<ProcessDefinition> list = repositoryService.createProcessDefinitionQuery().list();
		mav.addObject("processes", list);
		return mav;
	}

	@RequestMapping(value = "/redeploy/all", method = RequestMethod.GET)
	public String redeployAll() throws Exception {
		workflowProcessDefinitionService.deployAllFromClasspath();
		return "redirect:/workflow/process-list";
	}

	@Autowired
	public void setWorkflowProcessDefinitionService(WorkflowProcessDefinitionService workflowProcessDefinitionService) {
		this.workflowProcessDefinitionService = workflowProcessDefinitionService;
	}

	@Autowired
	public void setRepositoryService(RepositoryService repositoryService) {
		this.repositoryService = repositoryService;
	}

}
