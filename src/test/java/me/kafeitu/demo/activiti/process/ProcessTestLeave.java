package me.kafeitu.demo.activiti.process;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import java.io.FileInputStream;
import java.util.HashMap;
import java.util.Map;

import me.kafeitu.demo.activiti.modules.test.spring.SpringTransactionalTestCase;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;

/**
 * 测试请假流程定义
 *
 * @author HenryYan
 */
@ContextConfiguration(locations = { "/applicationContext.xml" })
public class ProcessTestLeave extends SpringTransactionalTestCase {

	@Autowired
	private RepositoryService repositoryService;

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private TaskService taskService;

	@Autowired
	private HistoryService historyService;

	@Test
	public void testLeave() throws Exception {
		// 部署流程
		String filePath = this.getClass().getClassLoader().getResource("diagrams/oa/leave.bpmn").getPath();
		FileInputStream inputStream = new FileInputStream(filePath);
		assertNotNull(inputStream);
		repositoryService.createDeployment().addInputStream("leave.bpmn20.xml", inputStream).deploy();

		// 启动流程
		Map<String, Object> variableMap = new HashMap<String, Object>();
		ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("leave", variableMap);
		assertNotNull(processInstance.getId());

		// 验证历史
		HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery().unfinished()
				.singleResult();
		assertNotNull(historicProcessInstance);

		// 领导审批
		Task task = taskService.createTaskQuery().taskCandidateGroup("deptLeader").singleResult();
		assertNotNull(task);

		// 签收任务
		taskService.claim(task.getId(), "leaderuser");

		// 验证签收后的任务
		task = taskService.createTaskQuery().taskCandidateGroup("deptLeader").singleResult();
		assertNull(task);

		// 审核通过
		task = taskService.createTaskQuery().taskAssignee("leaderuser").singleResult();
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("deptLeaderPass", true);
		taskService.complete(task.getId(), variables);

		// 人事任务查询
		task = taskService.createTaskQuery().taskCandidateGroup("hr").singleResult();
		assertNotNull(task);

		// 签收任务
		taskService.claim(task.getId(), "hruser");

		// 验证签收后的任务
		task = taskService.createTaskQuery().taskCandidateGroup("hr").singleResult();
		assertNull(task);

		// 审核通过
		task = taskService.createTaskQuery().taskAssignee("hruser").singleResult();
		variables = new HashMap<String, Object>();
		variables.put("hrPass", true);
		variables.put("applyUserId", "kafeitu");
		taskService.complete(task.getId(), variables);

		// 人事任务查询
		task = taskService.createTaskQuery().taskCandidateGroup("hr").singleResult();
		assertNull(task);
		
		// 申请人销假
		task = taskService.createTaskQuery().taskAssignee("kafeitu").singleResult();
		assertEquals("销假", task.getName());
		taskService.complete(task.getId());
		
		// 校验以完成流程
		HistoricProcessInstance finishedProcessInstance = historyService.createHistoricProcessInstanceQuery().finished().singleResult();
		assertNotNull(finishedProcessInstance);
	}

}
