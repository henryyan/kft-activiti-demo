package me.kafeitu.demo.activiti.service.oa.leave;

import static org.junit.Assert.assertNotNull;

import java.util.Date;

import me.kafeitu.demo.activiti.entity.oa.Leave;
import me.kafeitu.modules.test.spring.SpringTransactionalTestCase;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;

/**
 * 请假实体管理测试
 *
 * @author HenryYan
 */
@ContextConfiguration(locations = { "/applicationContext-test.xml" })
public class LeaveManagerTest extends SpringTransactionalTestCase {

	@Autowired
	private LeaveManager leaveManager;

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testSave() {
		Leave leave = new Leave();
		leave.setApplyTime(new Date());
		leave.setStartTime(new jodd.datetime.JDateTime("2012-05-22").convertToSqlDate());
		leave.setEndTime(new jodd.datetime.JDateTime("2012-05-23").convertToSqlDate());
		leave.setLeaveType("公休");
		leave.setUserId("kafeitu");
		leave.setReason("no reason");
		leaveManager.saveLeave(leave);
		
		assertNotNull(leave.getId());
		
		Leave newLeave = leaveManager.getLeave(leave.getId());
		assertNotNull(newLeave);
	}

}
