/**
 * 
 */
package com.wsria.demo.activiti.web.activiti;

import java.util.List;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.ProcessDefinition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.opensymphony.xwork2.ActionSupport;

/**
 * 工作流引擎Activiti Action
 * @author HenryYan
 *
 */
public class ActivitiAction extends ActionSupport {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Autowired
	RepositoryService repositoryService;

	public String list() {
		List<ProcessDefinition> listPage = repositoryService.createProcessDefinitionQuery().listPage(0, 10);
		Struts2Utils.renderJson(listPage);
		return null;
	}

	public String deployLeave() {
		try {
			repositoryService.createDeployment().addClasspathResource("diagrams/leave.bpmn20.xml")
					.addClasspathResource("diagrams/leave.png").deploy();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
