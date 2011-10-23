package com.wsria.demo.activiti.dao.account;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Component;

import com.runchain.arch.orm.dao.BaseHibernateDao;
import com.wsria.demo.activiti.entity.account.Organization;
import com.wsria.demo.activiti.entity.account.User;

/**
 * 用户对象的泛型DAO类.
 * 
 * @author calvin
 */
@Component
public class OrganizationDao extends BaseHibernateDao<Organization, Long> {

	/**
	 * 获取用户所在的部门
	 * @param userId	用户ID
	 * @return	部门对象
	 */
	public Organization getDeptOfUser(Long userId) {
		String sql = "select o.*" + " from acct_organization_user r" 
				+ " left join acct_organization o on r.org_id = o.id"
				+ " where r.user_id = ?";
		logger.debug("userId=[" + userId + "]");
		Query query = getSession().createSQLQuery(sql).addEntity("o", Organization.class).setLong(0, userId);
		return (Organization)query.uniqueResult();
	}
	
	/**
	 * 查询部门下面的所有用户ID
	 * @param superId	上级部门
	 * @return	用户ID集合
	 */
	@SuppressWarnings("unchecked")
	public List<String> findUserIds(Long superId) {
		String sql = "select user_id from acct_organization_user where org_id = ?";
		List<String> list = getSession().createSQLQuery(sql).setLong(0, superId).list();
		return list;
	}
	
	/**
	 * 查询部门下面的人员列表
	 * @param superId	部门ID
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<User> findUsersByOrgId(Long superId) {
		String sql = "select * from acct_user t left join acct_organization_user ou on t.id = ou.user_id where ou.org_id = " + superId;
		List<User> users = super.getSession().createSQLQuery(sql).addEntity(User.class).list();
		return users;
	}
	
	/**
	 * 查询所有部门列表
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<Organization> findAcctOrganizations() {
		Criteria criteria=super.getSession().createCriteria(Organization.class);
		criteria.add(Restrictions.ne("parentId",0l));
		List<Organization> orgs = criteria.list();
		return orgs;
	}
}
