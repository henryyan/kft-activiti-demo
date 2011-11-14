package com.wsria.demo.activiti.web.activiti;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.List;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.ProcessDefinition;
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
	RepositoryService repositoryService;

	private String deploymentId;
	private String resourceName;
	private boolean deleteCascade;

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
			List<ProcessDefinition> processDefinitions = repositoryService.createProcessDefinitionQuery().listPage(0,
					maxResults);
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
			repositoryService.createDeployment().addInputStream(deploymentFileName, fileInputStream).deploy();
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
			InputStream resourceAsStream = repositoryService.getResourceAsStream(deploymentId, resourceName);
			//Struts2Utils.getResponse().getOutputStream().write(resourceAsStream.read());
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

}
