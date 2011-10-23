package com.wsria.demo.activiti.dao.account;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.wsria.demo.activiti.entity.account.Authority;

/**
 * 授权对象的泛型DAO.
 * 
 * @author calvin
 */
@Component
public class AuthorityDao extends HibernateDao<Authority, Long> {
	/**
	 * 查询角色下面的所有资源ID
	 * @param roleId	角色ID
	 * @return	资源ID集合
	 */
	@SuppressWarnings("unchecked")
	public List<Long> findAuthorityIds(Long roleId) {
		String sql = "select t1.id from acct_authority t1,acct_role_authority t2 where t1.id=t2.authority_id and  t2.role_id = ?";
		List<java.math.BigDecimal> list = getSession().createSQLQuery(sql).setLong(0, roleId).list();
		List<Long> result = new ArrayList<Long>();
		for (BigDecimal bigDecimal : list) {
			result.add(bigDecimal.longValue());
		}
		return result;
	}
}
