package com.wsria.demo.activiti;

import static org.junit.Assert.*;

import java.util.Date;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;

import com.wsria.demo.activiti.dao.oa.leave.LeaveDao;
import com.wsria.demo.activiti.entity.oa.leave.Leave;
import com.wsria.demo.base.BaseSpringTxTestCase;

/**
 * DailyWorkLogDao的测试用例, 测试ORM映射及特殊的DAO操作.
 * 
 * 默认在每个测试函数后进行回滚.
 * 
 * @author HenryYan
 */
@ContextConfiguration(locations = { "/applicationContext-test.xml" })
public class LeaveDaoTest extends BaseSpringTxTestCase {

	@Autowired
	private LeaveDao entityDao;

	@Test
	//如果你需要真正插入数据库,将Rollback设为false
//	@Rollback(false) 
	public void crudEntity() {
		Leave entity = new Leave();
		entity.setUserId("henryyan");
		entity.setUserName("HenryYan");
		entity.setApplyTime(new Date());
		entity.setStartTime(new Date());
		entity.setEndTime(new Date());
		entity.setReason("wefwfw");
		entity.setLeaveType("公休");
		entityDao.save(entity);
		assertEquals(1, countRowsInTable("oa_leave"));
	}
}