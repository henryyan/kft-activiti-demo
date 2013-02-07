package me.kafeitu.demo.activiti.service.oa.leave;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import me.kafeitu.demo.activiti.entity.oa.Leave;
import me.kafeitu.demo.activiti.service.activiti.WorkflowProcessDefinitionService;
import me.kafeitu.modules.test.spring.SpringTransactionalTestCase;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;

/**
 * 请假流程Service测试
 *
 * @author HenryYan
 */
@ContextConfiguration(locations = { "/applicationContext-test.xml" })
public class LeaveWorkflowServiceTest extends SpringTransactionalTestCase {

	@Autowired
	private LeaveWorkflowService leaveWorkflowService;

	@Autowired
	protected WorkflowProcessDefinitionService workflowProcessDefinitionService;

	@Autowired
	protected RuntimeService runtimeService;
	
	@Autowired
	protected TaskService taskService;
	
	@Autowired
	protected HistoryService historyService;
	
	@Autowired
	protected LeaveManager leaveManager;
	
	@PersistenceContext
	EntityManager em;

	@Before
	public void setUp() throws Exception {
		workflowProcessDefinitionService.deployAllFromClasspath("/tmp/kft-activiti-demo");
	}

	/**
	 * 测试全部审批通过的情况
	 * @throws Exception
	 */
	@Test
	public void testAllPass() throws Exception {
		Leave leave = new Leave();
		leave.setApplyTime(new Date());
		leave.setStartTime(new jodd.datetime.JDateTime("2012-05-22 12:00").convertToDate());
		leave.setEndTime(new jodd.datetime.JDateTime("2012-05-23 09:00").convertToDate());
		leave.setLeaveType("公休");
		leave.setUserId("kafeitu");
		leave.setReason("no reason");

		Map<String, Object> variables = new HashMap<String, Object>();
		leaveWorkflowService.startWorkflow(leave, variables);
		assertNotNull(leave.getProcessInstanceId());

		ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
				.processInstanceBusinessKey(leave.getId().toString()).singleResult();
		assertNotNull(processInstance);
		
		// 部门领导
		Task task = taskService.createTaskQuery().taskCandidateGroup("deptLeader").singleResult();
		assertNotNull(task);
		taskService.claim(task.getId(), "leaderuser");
		
		variables = new HashMap<String, Object>();
		variables.put("deptLeaderPass", true);
		taskService.complete(task.getId(), variables);
		
		// HR
		task = taskService.createTaskQuery().taskCandidateGroup("hr").singleResult();
		assertNotNull(task);
		taskService.claim(task.getId(), "hruser");
		
		variables = new HashMap<String, Object>();
		variables.put("hrPass", true);
		taskService.complete(task.getId(), variables);
		
		// 销假
		task = taskService.createTaskQuery().taskAssignee(leave.getUserId()).singleResult();
		variables = new HashMap<String, Object>();
		variables.put("realityStartTime", new jodd.datetime.JDateTime("2012-05-22 13:00").convertToDate());
		variables.put("realityEndTime", new jodd.datetime.JDateTime("2012-05-24 09:00").convertToDate());
		taskService.complete(task.getId(), variables);
		
		em.flush();
		
		leave = leaveManager.getLeave(leave.getId());
		assertNotNull(leave.getRealityStartTime());
		assertNotNull(leave.getRealityEndTime());
		
		// 验证已结束流程
		long count = historyService.createHistoricProcessInstanceQuery().processDefinitionKey("leave").finished().count();
		assertEquals(1, count);
	}

}
