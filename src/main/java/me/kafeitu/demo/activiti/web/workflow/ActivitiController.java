package me.kafeitu.demo.activiti.web.workflow;

import java.io.InputStream;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import me.kafeitu.demo.activiti.service.WorkflowProcessDefinitionService;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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

	protected RuntimeService runtimeService;

	/**
	 * 流程定义列表
	 * @return
	 */
	@RequestMapping(value = "/process-list", method = RequestMethod.GET)
	public ModelAndView processList() {
		ModelAndView mav = new ModelAndView("workflow/process-list");
		List<ProcessDefinition> list = repositoryService.createProcessDefinitionQuery().list();
		mav.addObject("processes", list);
		return mav;
	}

	/**
	 * 部署全部流程
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/redeploy/all", method = RequestMethod.GET)
	public String redeployAll() throws Exception {
		workflowProcessDefinitionService.deployAllFromClasspath();
		return "redirect:/workflow/process-list";
	}

	/**
	 * 读取资源，通过部署ID
	 */
	@RequestMapping(value = "/resource/deployment", method = RequestMethod.GET)
	public void loadByDeployment(@RequestParam("deploymentId") String deploymentId,
			@RequestParam("resourceName") String resourceName, HttpServletResponse response) throws Exception {
		InputStream resourceAsStream = repositoryService.getResourceAsStream(deploymentId, resourceName);
		byte[] b = new byte[1024];
		int len = -1;
		while ((len = resourceAsStream.read(b, 0, 1024)) != -1) {
			response.getOutputStream().write(b, 0, len);
		}
	}

	/**
	 * 读取资源，通过流程ID
	 */
	@RequestMapping(value = "/resource/process-instance", method = RequestMethod.GET)
	public void loadByProcessInstance(@RequestParam("resourceType") String resourceType,
			@RequestParam("processInstanceId") String processInstanceId, HttpServletResponse response) throws Exception {
		InputStream resourceAsStream = null;
		ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId)
				.singleResult();
		ProcessDefinition singleResult = repositoryService.createProcessDefinitionQuery()
				.processDefinitionId(processInstance.getProcessDefinitionId()).singleResult();

		String resourceName = "";
		if (resourceType.equals("image")) {
			resourceName = singleResult.getDiagramResourceName();
		} else if (resourceType.equals("xml")) {
			resourceName = singleResult.getResourceName();
		}
		resourceAsStream = repositoryService.getResourceAsStream(singleResult.getDeploymentId(), resourceName);
		byte[] b = new byte[1024];
		int len = -1;
		while ((len = resourceAsStream.read(b, 0, 1024)) != -1) {
			response.getOutputStream().write(b, 0, len);
		}
	}

	@Autowired
	public void setWorkflowProcessDefinitionService(WorkflowProcessDefinitionService workflowProcessDefinitionService) {
		this.workflowProcessDefinitionService = workflowProcessDefinitionService;
	}

	@Autowired
	public void setRepositoryService(RepositoryService repositoryService) {
		this.repositoryService = repositoryService;
	}

	public void setRuntimeService(RuntimeService runtimeService) {
		this.runtimeService = runtimeService;
	}

}
