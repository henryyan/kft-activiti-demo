package me.kafeitu.demo.activiti.web.workflow;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import me.kafeitu.demo.activiti.service.activiti.WorkflowProcessDefinitionService;
import me.kafeitu.demo.activiti.service.activiti.WorkflowTraceService;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * 流程管理控制器
 *
 * @author HenryYan
 */
@Controller
@RequestMapping(value = "/workflow")
public class ActivitiController {

	protected WorkflowProcessDefinitionService workflowProcessDefinitionService;

	protected RepositoryService repositoryService;

	protected RuntimeService runtimeService;

	protected WorkflowTraceService traceService;

	/**
	 * 流程定义列表
	 * @return
	 */
	@RequestMapping(value = "/process-list")
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
	@RequestMapping(value = "/redeploy/all")
	public String redeployAll() throws Exception {
		workflowProcessDefinitionService.deployAllFromClasspath();
		return "redirect:/workflow/process-list";
	}

	/**
	 * 读取资源，通过部署ID
	 * @param deploymentId	流程部署的ID
	 * @param resourceName	资源名称(foo.xml|foo.png)
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/resource/deployment")
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
	 * @param resourceType			资源类型(xml|image)
	 * @param processInstanceId		流程实例ID	
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/resource/process-instance")
	public void loadByProcessInstance(@RequestParam("type") String resourceType, @RequestParam("pid") String processInstanceId,
			HttpServletResponse response) throws Exception {
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

	/**
	 * 删除部署的流程，级联删除流程实例
	 * @param deploymentId	流程部署ID
	 */
	@RequestMapping(value = "/process/delete")
	public String delete(@RequestParam("deploymentId") String deploymentId) {
		repositoryService.deleteDeployment(deploymentId, true);
		return "redirect:/workflow/process-list";
	}

	/**
	 * 输出跟踪流程信息
	 * @param processInstanceId
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/process/trace")
	@ResponseBody
	public List<Map<String, Object>> traceProcess(@RequestParam("pid") String processInstanceId) throws Exception {
		List<Map<String, Object>> activityInfos = traceService.traceProcess(processInstanceId);
		return activityInfos;
	}

	@Autowired
	public void setWorkflowProcessDefinitionService(WorkflowProcessDefinitionService workflowProcessDefinitionService) {
		this.workflowProcessDefinitionService = workflowProcessDefinitionService;
	}

	@Autowired
	public void setRepositoryService(RepositoryService repositoryService) {
		this.repositoryService = repositoryService;
	}

	@Autowired
	public void setRuntimeService(RuntimeService runtimeService) {
		this.runtimeService = runtimeService;
	}

	@Autowired
	public void setTraceService(WorkflowTraceService traceService) {
		this.traceService = traceService;
	}

}
