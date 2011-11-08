package com.wsria.demo.activiti.service.activiti;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.runchain.arch.service.base.BaseManager;
import com.wsria.demo.activiti.dao.account.RoleDao;
import com.wsria.demo.activiti.dao.account.UserDao;
import com.wsria.demo.activiti.entity.account.Role;
import com.wsria.demo.activiti.entity.account.User;
import com.wsria.demo.activiti.entity.activiti.ActIdGroup;

/**
 * 使用Activiti的数据同步业务用户数据
 * @author HenryYan
 *
 */
@Service
@Transactional
public class SynActivitiAndBusinessManager extends BaseManager {

	@Autowired
	UserDao userDao;

	@Autowired
	RoleDao roleDao;

	@SuppressWarnings("unchecked")
	public void syn() {
		Session session = userDao.getSession();
		// 1、同步角色
		// 删除全部角色数据
		session.createSQLQuery("delete from acct_role").executeUpdate();
		session.createSQLQuery("delete from acct_user_role").executeUpdate();
		logger.debug("删除全部角色数据ACCT_ROLE");

		// 读取activiti group
		List<ActIdGroup> actGroups = session.createSQLQuery("select * from act_id_group").addEntity(ActIdGroup.class)
				.list();
		for (ActIdGroup actIdGroup : actGroups) {
			Role role = new Role();
			role.setLabel(actIdGroup.getId());
			role.setName(actIdGroup.getName());
			roleDao.save(role);
		}

		// 2、同步用户
		session.createSQLQuery("delete from acct_user").executeUpdate();
		session.createSQLQuery(
				"insert into acct_user (id, name, password, active) select au.id_, au.first_ || au.last_, au.pwd_, '1' from ACT_ID_USER au")
				.executeUpdate();

		// 3、角色同步
		List<User> allUser = userDao.getAll();
		for (User user : allUser) {
			String userId = user.getId();
			List<Object[]> memerships = session.createSQLQuery("select * from act_id_membership where user_id_='" + userId + "'").list();
			for (Object[] objects : memerships) {
				Role role = roleDao.findUnique(Restrictions.eq("label", objects[1].toString()));
				user.getRoleList().add(role);
			}
		}
	}

	@Override
	public void flush() {
	}

}
