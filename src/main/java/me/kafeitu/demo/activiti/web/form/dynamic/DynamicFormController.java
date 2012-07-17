package me.kafeitu.demo.activiti.web.form.dynamic;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.FormService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.form.StartFormData;
import org.activiti.engine.impl.form.StartFormDataImpl;
import org.activiti.engine.repository.ProcessDefinition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * 动态FormController
 *
 * @author HenryYan
 */
@Controller
@RequestMapping(value = "/form/dynamic")
public class DynamicFormController {
	
	@Autowired
	private RepositoryService repositoryService;
	
	@Autowired
	private FormService formService;

	/**
	 * 动态form流程列表
	 * @param model
	 * @return
	 */
	@RequestMapping(value = { "list", "" })
	public ModelAndView processDefinitionList(Model model) {
		ModelAndView mav = new ModelAndView("/form/dynamic/dynamic-form-process-list");
		List<ProcessDefinition> newResult = new ArrayList<ProcessDefinition>();
		List<ProcessDefinition> list = repositoryService.createProcessDefinitionQuery().list();
		
		/*
		 * 只读取包含dynamic的流程
		 */
		for (ProcessDefinition processDefinition : list) {
			if (processDefinition.getKey().indexOf("dynamic") != -1) {
				newResult.add(processDefinition);
			}
		}
		mav.addObject("processes", newResult);
		return mav;
	}
	
	/**
	 * 读取启动流程的表单字段
	 */
	@RequestMapping(value = "get-start-form-field/{processDefinitionId}")
	@ResponseBody
	public StartFormData findFieldOfForm(@PathVariable("processDefinitionId") String processDefinitionId) throws Exception {
		StartFormDataImpl startFormData = (StartFormDataImpl) formService.getStartFormData(processDefinitionId);
		startFormData.setProcessDefinition(null);
		return startFormData;
	}
	
}
