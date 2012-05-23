package me.kafeitu.demo.activiti.web.workflow;

import static org.junit.Assert.*;

import java.util.List;

import me.kafeitu.demo.activiti.service.WorkflowProcessDefinitionService;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.ProcessDefinition;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.web.servlet.ModelAndView;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

/**
 * 工作流控制器测试
 *
 * @author HenryYan
 */
@ContextConfiguration(locations = { "/applicationContext.xml" })
public class ActivitiControllerTest extends SpringTransactionalTestCase {

	@Autowired
	protected WorkflowProcessDefinitionService workflowProcessDefinitionService;

	@Autowired
	protected RepositoryService repositoryService;

	private ActivitiController activitiController;

	@Before
	public void setUp() throws Exception {
		activitiController = new ActivitiController();
		activitiController.setRepositoryService(repositoryService);
		activitiController.setWorkflowProcessDefinitionService(workflowProcessDefinitionService);
	}

	@Test
	public void testProcessList() {
		ModelAndView mav = activitiController.processList();
		assertNotNull(mav);
		Object processes = mav.getModelMap().get("processes");
		assertNotNull(processes);
	}

	@Test
	public void testRedeployAll() throws Exception {
		String view = activitiController.redeployAll();
		assertEquals("redirect:/workflow/process-list", view);
		List<ProcessDefinition> list = repositoryService.createProcessDefinitionQuery().list();
		assertEquals(1, list.size());
	}

}
