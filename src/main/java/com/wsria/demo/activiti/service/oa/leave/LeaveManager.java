package com.wsria.demo.activiti.service.oa.leave;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.runchain.arch.orm.dao.BaseHibernateDao;
import com.runchain.arch.service.base.BaseEntityManager;
import com.wsria.demo.activiti.dao.oa.leave.LeaveDao;
import com.wsria.demo.activiti.entity.oa.leave.Leave;

/**
 * 请假Manager
 * 
 * @author HenryYan
 *
 */
@Service
public class LeaveManager extends BaseEntityManager<Leave, Long> {
	
	@Autowired
	LeaveDao leaveDao;

	@Override
	public BaseHibernateDao<Leave, Long> getDao() {
		return leaveDao;
	}

}
