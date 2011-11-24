package com.wsria.demo.activiti.web.activiti;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipInputStream;

import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.ManagementService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.impl.RepositoryServiceImpl;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.runtime.ProcessInstance;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.opensymphony.xwork2.ActionSupport;
import com.runchain.arch.web.base.CrudActionSupport;

/**
 * 工作流引擎Activiti Action
 * @author HenryYan
 *
 */
@Results({ @Result(name = CrudActionSupport.JSON, type = CrudActionSupport.JSON) })
public class ActivitiAction extends ActionSupport {

	private static final long serialVersionUID = 1L;

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	protected RuntimeService runtimeService;

	@Autowired
	protected TaskService taskService;

	@Autowired
	protected FormService formService;

	@Autowired
	protected RepositoryService repositoryService;

	@Autowired
	protected HistoryService historyService;

	@Autowired
	protected IdentityService identityService;

	@Autowired
	protected ManagementService managementService;

	private String deploymentId;
	private String resourceName;
	private boolean deleteCascade;
	private String processInstanceId;
	private String resourceType;

	private File deployment;
	private String deploymentFileName;

	private Page<ProcessDefinition> page = new Page<ProcessDefinition>(100);

	/**
	 * 已部署流程
	 * @return
	 */
	public String list() {
		try {
			int maxResults = 100;
			List<ProcessDefinition> processDefinitions = repositoryService.createProcessDefinitionQuery().listPage(0, maxResults);
			page.setResult(processDefinitions);
			page.setTotalCount(processDefinitions.size());
			page.setPageSize(maxResults);
		} catch (Exception e) {
			logger.error("查询已部署流程");
		}
		return "json";
	}

	/**
	 * 部署新流程
	 * @return
	 */
	public String deploy() {
		FileInputStream fileInputStream;
		try {
			fileInputStream = new FileInputStream(deployment);
			String extension = FilenameUtils.getExtension(deploymentFileName);
			if (extension.equals("zip") || extension.equals("bar")) {
				ZipInputStream zip = new ZipInputStream(fileInputStream);
				repositoryService.createDeployment().addZipInputStream(zip).deploy();
			} else {
				repositoryService.createDeployment().addInputStream(deploymentFileName, fileInputStream).deploy();
			}
			Struts2Utils.renderText(SUCCESS);
		} catch (FileNotFoundException e) {
			logger.error("部署时获取流程文件失败：{}", e);
		} catch (Exception e) {
			logger.error("部署流程时出错：{}", e);
		}
		return null;
	}

	/**
	 * 删除已部署流程
	 * @return
	 */
	public String delete() {
		try {
			repositoryService.deleteDeployment(deploymentId, deleteCascade);
			Struts2Utils.renderText(SUCCESS);
		} catch (Exception e) {
			logger.error("删除已部署的流程出错：{}", e);
		}
		return null;
	}

	/**
	 * 读取资源
	 * 
	 * @return
	 */
	public String loadResource() {
		try {
			InputStream resourceAsStream = null;
			if (StringUtils.isNotBlank(processInstanceId)) {
				ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
				ProcessDefinition singleResult = repositoryService.createProcessDefinitionQuery()
						.processDefinitionId(processInstance.getProcessDefinitionId()).singleResult();
				String resourceName = "";
				if (resourceType.equals("image")) {
					resourceName = singleResult.getDiagramResourceName();
				} else if (resourceType.equals("xml")) {
					resourceName = singleResult.getResourceName();
				}
				resourceAsStream = repositoryService.getResourceAsStream(singleResult.getDeploymentId(), resourceName);
			} else {
				resourceAsStream = repositoryService.getResourceAsStream(deploymentId, resourceName);
			}
			byte[] b = new byte[1024];
			int len = -1;
			while ((len = resourceAsStream.read(b, 0, 1024)) != -1) {
				Struts2Utils.getResponse().getOutputStream().write(b, 0, len);
			}
		} catch (Exception e) {
			logger.error("读取资源出错：{}", e);
		}
		return null;
	}

	/**
	 * 流程跟踪图
	 * @return
	 */
	public String traceProcess() {
		try {
			Execution execution = runtimeService.createExecutionQuery().executionId(processInstanceId).singleResult();//执行实例
			Object property = PropertyUtils.getProperty(execution, "activityId");
			String activityId = "";
			if (property != null) {
				activityId = property.toString();
			}
			ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
			ProcessDefinitionEntity processDefinition = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
					.getDeployedProcessDefinition(processInstance.getProcessDefinitionId());
			List<ActivityImpl> activitiList = processDefinition.getActivities();//获得当前任务的所有节点
			ActivityImpl activity = null;
			for (ActivityImpl activityImpl : activitiList) {
				String id = activityImpl.getId();
				if (id.equals(activityId)) {//获得执行到那个节点
					activity = activityImpl;
					break;
				}
			}
			Map<String, Integer> activityImageInfo = new HashMap<String, Integer>();
			activityImageInfo.put("x", activity.getX());
			activityImageInfo.put("y", activity.getY());
			activityImageInfo.put("width", activity.getWidth());
			activityImageInfo.put("height", activity.getHeight());
			Struts2Utils.renderJson(activityImageInfo);
		} catch (Exception e) {
			logger.error("查看流程跟踪图出错：");
		}
		return null;
	}
	
	/**
	 * 删除流程实例
	 * @return
	 */
	public String deleteProcessInstance() {
		try {
			runtimeService.deleteProcessInstance(processInstanceId, Struts2Utils.getParameter("deleteReason"));
			Struts2Utils.renderText(SUCCESS);
		} catch (Exception e) {
			logger.error("删除流程失败，PID={}", processInstanceId, e);
		}
		return null;
	}

	public Page<ProcessDefinition> getPage() {
		return page;
	}

	public void setDeploymentId(String deploymentId) {
		this.deploymentId = deploymentId;
	}

	public void setResourceName(String resourceName) {
		this.resourceName = resourceName;
	}

	public void setDeleteCascade(boolean deleteCascade) {
		this.deleteCascade = deleteCascade;
	}

	public void setDeployment(File deployment) {
		this.deployment = deployment;
	}

	public void setDeploymentFileName(String deploymentFileName) {
		this.deploymentFileName = deploymentFileName;
	}

	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}

	public void setResourceType(String resourceType) {
		this.resourceType = resourceType;
	}

}
