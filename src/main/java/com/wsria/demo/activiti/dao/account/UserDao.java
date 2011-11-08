package com.wsria.demo.activiti.dao.account;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;

import com.runchain.arch.orm.dao.BaseHibernateDao;
import com.runchain.arch.util.orm.PropertyFilterUtils;
import com.wsria.demo.activiti.entity.account.User;

/**
 * 用户对象的泛型DAO类.
 * 
 * @author HenryYan
 */
@Component
public class UserDao extends BaseHibernateDao<User, String> {

	/**
	 * 按属性过滤条件列表分页查找对象.
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Page<User> findPage(final Page<User> page, final List<PropertyFilter> filters) {
		List<Object> values = new ArrayList<Object>();
		String jointHql = PropertyFilterUtils.jointHql(filters, values);
		jointHql = jointHql.replaceAll("o.roleNameForFind", "r.name");
		String hql = "select distinct o from User o left join o.roleList r where 1=1 " + jointHql;
		if (page.isOrderBySetted()) {
			hql += " order by o." + page.getOrderBy() + " " + page.getOrder();
		}

		Assert.notNull(page, "page不能为空");

		Query q = createQuery(hql, values.toArray());

		if (page.isAutoCount()) {
			long totalCount = q.list().size();
			page.setTotalCount(totalCount);
		}

		setPageParameterToQuery(q, page);

		List result = q.list();
		page.setResult(result);
		return page;
	}

	@SuppressWarnings("unchecked")
	public String getAllUserName() {
		String sql = "select name from acct_user ";
		String names = "";
		List<String> list = getSession().createSQLQuery(sql).list();
		if (list.size() > 0) {
			for (String name : list) {
				if (names.equals("")) {
					names = "'" + name + "'";
				} else {
					names += ",'" + name + "'";
				}
			}
		}
		return names;
	}

	@SuppressWarnings("unchecked")
	public String getAllOrgName(String userId) {
		String sql = "select org_name from acct_user where id=?";
		String orgs = "";
		List<String> list = getSession().createSQLQuery(sql).setString(0, userId).list();
		if (list.size() > 0) {
			for (String name : list) {
				orgs = name;
			}
		}
		return orgs;
	}

	@SuppressWarnings("unchecked")
	public String getUserIdByUserName(String name) {
		String sql = "select id from acct_user where name=?";
		List<String> list = getSession().createSQLQuery(sql).setString(0, name).list();
		if (list.size() > 0) {
			return list.get(0);
		}
		return "";
	}

	/**
	 * 查询所有部门列表
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<User> findAllUsers() {
		Criteria createCriteria = super.getSession().createCriteria(User.class);
		createCriteria.add(Restrictions.ne("active", "-1"));
		List<User> users = createCriteria.list();
		return users;
	}

	public void insertValueUserAndOrg(long org_id, String user_id) {
		String insertSql = "insert into acct_organization_user (ORG_ID,USER_ID) values(" + org_id + ",'" + user_id + "')";
		new JdbcTemplate().execute(insertSql);
	}
	
	/**
	 * 设置用户的组织ID
	 * @param orgId	部门ID
	 * @param userId	用户ID
	 */
	public void updateUserOrg(Long orgId, String... userId) {
		String sql = "update acct_organization_user set org_id=:orgid where user_id in (:uids)";
		Query query = getSession().createSQLQuery(sql).setParameter("orgid", orgId).setParameterList("uids", userId);
		query.executeUpdate();
	}

}
