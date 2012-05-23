package me.kafeitu.demo.activiti.service.oa.leave;

import static org.junit.Assert.assertNotNull;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import me.kafeitu.demo.activiti.entity.oa.Leave;
import me.kafeitu.demo.activiti.service.activiti.WorkflowProcessDefinitionService;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

/**
 * 请假流程Service测试
 *
 * @author HenryYan
 */
@ContextConfiguration(locations = { "/applicationContext.xml" })
public class LeaveWorkflowServiceTest extends SpringTransactionalTestCase {

	@Autowired
	private LeaveWorkflowService leaveWorkflowService;

	@Autowired
	protected WorkflowProcessDefinitionService workflowProcessDefinitionService;

	@Autowired
	protected RuntimeService runtimeService;

	@Before
	public void setUp() throws Exception {
		workflowProcessDefinitionService.deployAllFromClasspath();
	}

	/**
	 * 测试启动流程
	 * @throws Exception
	 */
	@Test
	public void testStartProcessInstance() throws Exception {
		Leave leave = new Leave();
		leave.setApplyTime(new Date());
		leave.setStartTime(new jodd.datetime.JDateTime("2012-05-22").convertToSqlDate());
		leave.setEndTime(new jodd.datetime.JDateTime("2012-05-23").convertToSqlDate());
		leave.setLeaveType("公休");
		leave.setUserId("kafeitu");
		leave.setReason("no reason");

		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("myVar1", "myVar1Value");
		leaveWorkflowService.startWorkflow(leave, variables);
		assertNotNull(leave.getProcessInstanceId());

		ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
				.processInstanceBusinessKey(leave.getId().toString()).singleResult();
		assertNotNull(processInstance);
	}

}
