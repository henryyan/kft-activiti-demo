package com.wsria.demo.activiti.service.account;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.ArrayUtils;
import org.hibernate.Criteria;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.runchain.arch.orm.dao.BaseHibernateDao;
import com.runchain.arch.service.base.BaseEntityManager;
import com.wsria.demo.activiti.dao.account.OrganizationDao;
import com.wsria.demo.activiti.entity.account.Organization;
import com.wsria.demo.activiti.entity.account.User;
import com.wsria.demo.activiti.util.account.OrganizationUtil;

/**
 * 部门管理类
 *
 * @author HenryYan
 *
 */
@Service
@Transactional
public class DeptManager extends BaseEntityManager<Organization, Long> implements Serializable {

	private static final long serialVersionUID = 1L;

	@Autowired
	protected OrganizationDao orgDao;

	@Autowired
	private TreeService treeService;

	/**
	 * 查询所有的部门
	 * @param superId
	 * @return
	 * @throws Exception 
	 */
	@Transactional(readOnly = true)
	public List<Organization> findAcctOrganization(Long superId) {
		List<Organization> allTreeinfo = treeService.getAllTreeinfo(superId);
		return allTreeinfo;
	}
	
	/**
	 * 查询所有的部门
	 * @param superIds	可以是一个或多个部门ID
	 * @return
	 * @throws Exception 
	 */
	@SuppressWarnings("unchecked")
	@Transactional(readOnly = true)
	public List<Organization> findOrganization(Long... superIds) {
		if (ArrayUtils.isEmpty(superIds)) {
			return new ArrayList<Organization>();
		}
		Criteria criteria = orgDao.createCriteria(Restrictions.in("parentId", superIds));
		return criteria.list();
	}
	
	/**
	 * 查询所有部门ID
	 * @param superIds	可以是一个或多个部门ID
	 * @return	部门ID集合
	 * @see #findOrganizationIds(Long...)
	 */
	@Transactional(readOnly = true)
	public List<Long> findOrganizationIds(Collection<Long> superIds) {
		if (CollectionUtils.isEmpty(superIds) && superIds.size() > 0) {
			return new ArrayList<Long>();
		}
		Long[] arrayIds = new Long[superIds.size()];
		return findOrganizationIds(superIds.toArray(arrayIds));
	}
	
	/**
	 * 查询所有部门ID
	 * @param superIds	可以是一个或多个部门ID
	 * @return	部门ID集合
	 */
	@SuppressWarnings("unchecked")
	@Transactional(readOnly = true)
	public List<Long> findOrganizationIds(Long... superIds) {
		if (ArrayUtils.isEmpty(superIds)) {
			return new ArrayList<Long>();
		}
		Criteria criteria = orgDao.createCriteria(Restrictions.in("parentId", superIds));
		ProjectionList projection = Projections.projectionList();
		projection.add(Projections.property("id"));
		criteria.setProjection(projection);
		return criteria.list();
	}

	/**
	 * 设置指定部门下面的部门ID和名称，可以直接使用<code>OrganizationUtil.getDeptName</code>获取部门名称
	 * 可以根据制定部门ID获取下属部门
	 * 一些数据尽在内存中
	 * 
	 * @param superDeptId	部门ID
	 * @throws Exception
	 */
	@Transactional(readOnly = true)
	public void initOrganizations(Long superDeptId) {
		List<Organization> memoryDbOrgList = OrganizationUtil.CHILD_AND_PARENT_DEPTS.get(superDeptId);
		if (memoryDbOrgList != null) {
			logger.debug("部门缓存中存在{}个父级ID为{}的下属部门", memoryDbOrgList.size(), superDeptId);
			OrganizationUtil.setDeptIdAndNames(memoryDbOrgList);
		} else {
			List<Organization> allTreeinfo = treeService.getAllTreeinfo(superDeptId);
			logger.debug("根据部门{}查询到{}个下属部门", superDeptId, allTreeinfo.size());
			OrganizationUtil.CHILD_AND_PARENT_DEPTS.put(superDeptId, allTreeinfo);
			OrganizationUtil.setDeptIdAndNames(allTreeinfo);
		}
	}

	/**
	 * 查询部门下的用户
	 * @param superId
	 * @return
	 * @throws Exception
	 */
	@Transactional(readOnly = true)
	public List<Map<String, Object>> findUserByOrgId(Long superId) throws Exception {
		List<Map<String, Object>> allUserinfo = treeService.getAllDirectManageUser(superId);
		return allUserinfo;
	}

	/**
	 * 查询部门下的用户
	 * @param superId
	 * @return
	 * @throws Exception
	 */
	@Transactional(readOnly = true)
	public List<User> findUsersByOrgId(Long superId) throws Exception {
		return orgDao.findUsersByOrgId(superId);
	}

	/**
	 * 查询部门下面的所有用户ID
	 * @param superId	上级部门
	 * @return	用户ID集合
	 */
	@Transactional(readOnly = true)
	public List<String> findUserIdsByOrgId(Long superId) {
		return orgDao.findUserIds(superId);
	}

	/**
	 * 根据部门名称查询部门对象
	 * @param deptName	部门名称
	 */
	@Transactional(readOnly = true)
	public Organization findByDeptName(String deptName) {
		return orgDao.findUniqueBy("name", deptName);
	}

	/**
	 * 根据部门ID查询部门对象
	 * @param deptNames	部门名称
	 */
	@Transactional(readOnly = true)
	public Organization findByDeptId(Long deptId) {
		return orgDao.findUniqueBy("id", deptId);
	}

	/**
	 * 根据部门名称查询部门对象
	 * @param deptName	部门名称
	 * @param parentId	上级部门ID
	 * @return
	 */
	@Transactional(readOnly = true)
	public Organization findByDeptName(String deptName, Long parentId) {
		Criteria createCriteria = orgDao.createCriteria(Restrictions.eq("name", deptName),
				Restrictions.eq("parentId", parentId));
		return (Organization) createCriteria.uniqueResult();
	}

	/**
	 * 根据部门名称的简称查询部门对象
	 * 如果根据没有找到部门则再根据全名查询
	 * @param deptNames	部门名称的简称
	 */
	@Transactional(readOnly = true)
	public Organization findByDeptShortName(String shortName) {
		Organization orgByShortName = orgDao.findUnique(Restrictions.eq("shortName", shortName),
				Restrictions.eq("parentId", OrganizationUtil.SUPER_UNIT_ID));
		if (orgByShortName == null) {
			return findByDeptName(shortName, OrganizationUtil.SUPER_UNIT_ID);
		}
		return orgByShortName;
	}

	/**
	 * 获取用户所在的部门，首先从内存缓存中查询，没有则从数据库查询
	 * @param userId	用户ID
	 * @return
	 */
	@Transactional(readOnly = true)
	public Organization getDeptOfUser(Long userId) {
		Organization deptOfUser = OrganizationUtil.USER_AND_DEPT_RELATIONS.get(userId);
		if (deptOfUser == null) {
			deptOfUser = orgDao.getDeptOfUser(userId);
		}
		return deptOfUser;
	}

	/**
	 * 获取一个用户的最高级部门ID，非单位ID
	 * <p>
	 * 例如一个用户属于【部门D】，而【部门C】又属于【部门B】，本方法得到的结果就是【部门B】的ID
	 * </p>
	 * @param userId	用户ID
	 * @return
	 */
	@Transactional(readOnly = true)
	public Organization getTopDeptOfUser(Long userId) {
		Organization deptOfUser = getDeptOfUser(userId);
		if (deptOfUser != null) {
			while (true) {
				Long deptId = deptOfUser.getParentId();
				if (deptId.equals(OrganizationUtil.SUPER_UNIT_ID)) {
					break;
				}
				deptOfUser = getEntity(deptId);
			}
		}
		return deptOfUser;
	}

	/**
	 * 统计下属组织数量
	 * @param superId
	 * @return
	 * @throws Exception 
	 */
	@Transactional(readOnly = true)
	public Long countAcctOrganization(Long superId) throws Exception {
		return treeService.countAcctOrganization(superId);
	}

	/**
	 * 统计用户数量
	 * @param superId
	 * @return
	 * @throws Exception
	 */
	@Transactional(readOnly = true)
	public Long countAcctUser(Long superId) throws Exception {
		return treeService.countAcctUser(superId);
	}

	/**
	 * 从一堆组织ID中过滤出本部门的ID
	 * @param parentDeptId	部门ID
	 * @param childDeptIds	下属部门ID集合
	 * @return	过滤后的仅仅属于本部门的部门ID集合
	 */
	@SuppressWarnings("unchecked")
	@Transactional(readOnly = true)
	public List<Long> filterOwnerChildOrgIds(Long parentDeptId, List<Long> childDeptIds) {
		if (CollectionUtils.isEmpty(childDeptIds) || childDeptIds.size() == 0) {
			return new ArrayList<Long>();
		}
		Criteria criteria = orgDao.createCriteria(Restrictions.eq("parentId", parentDeptId), Restrictions.in("id", childDeptIds));
		ProjectionList projection = Projections.projectionList();
		projection.add(Projections.property("id"));
		List<Long> deptIds = criteria.setProjection(projection).list();
		return deptIds;
	}

	@Override
	public BaseHibernateDao<Organization, Long> getDao() {
		return orgDao;
	}
}
