package com.wsria.demo.activiti.service.account;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.runchain.arch.service.base.BaseManager;
import com.wsria.demo.activiti.dao.account.OrganizationDao;
import com.wsria.demo.activiti.dao.account.TreeDao;
import com.wsria.demo.activiti.entity.account.Organization;

@Component
@Transactional
public class TreeService extends BaseManager {

	@Autowired
	private OrganizationDao acctOrganizationDao;

	@Autowired
	TreeDao treeDao;

	/**
	* 得到树信息
	* @return
	* @throws Exception
	*/
	@Transactional(readOnly = true)
	public List<Organization> getAllTreeinfo(Long parentId) {
		HashMap<String, String> orderBy = new HashMap<String, String>();
		orderBy.put("sequence", "");
		List<Organization> list = acctOrganizationDao.findBy("parentId", parentId, orderBy);
		return list;
	}

	/**
	 * 获取部门直属用户
	 * @see {@link TreeDao#getAllDirectManageUser(Long)}
	 */
	@Transactional(readOnly = true)
	public List<Map<String, Object>> getAllDirectManageUser(Long parentId) throws Exception {
		return treeDao.getAllDirectManageUser(parentId);
	}
	
	/**
	 * 查询出指定部门及其下属部门的所有用户ID
	 * @see {@link TreeDao#getAllUserIds(Long)}
	 */
	@Transactional(readOnly = true)
	public List<String> getAllUserIds(Long... parentDeptId) {
		return treeDao.getAllUserIds(parentDeptId);
	}
	
	/**
	 * 查询出指定部门及其下属部门的所有用户名称
	 * @see {@link TreeDao#getAllUserNames(Long)}
	 */
	@Transactional(readOnly = true)
	public List<String> getAllUserNames(Long... parentDeptId) {
		return treeDao.getAllUserNames(parentDeptId);
	}

	@Transactional(readOnly = true)
	public long countAcctOrganization(Long parentId) throws Exception {
		Criteria criteria = acctOrganizationDao.createCriteria(Restrictions.eq("parentId", parentId));
		ProjectionList projection = Projections.projectionList();
		projection.add(Projections.count("id"));
		criteria.setProjection(projection);
		return (Long) criteria.uniqueResult();
	}

	public long countAcctUser(Long parentId) throws Exception {
		return treeDao.countAcctUser(parentId);
	}

	@Override
	public void flush() {
	}

}
