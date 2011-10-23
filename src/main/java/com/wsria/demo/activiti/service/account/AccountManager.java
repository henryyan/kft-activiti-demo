package com.wsria.demo.activiti.service.account;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.ArrayUtils;
import org.hibernate.Criteria;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.security.springsecurity.SpringSecurityUtils;

import com.runchain.arch.orm.dao.BaseHibernateDao;
import com.runchain.arch.service.ServiceException;
import com.runchain.arch.service.base.BaseEntityManager;
import com.wsria.demo.activiti.dao.account.AuthorityDao;
import com.wsria.demo.activiti.dao.account.OrganizationDao;
import com.wsria.demo.activiti.dao.account.RoleDao;
import com.wsria.demo.activiti.dao.account.UserDao;
import com.wsria.demo.activiti.entity.account.Authority;
import com.wsria.demo.activiti.entity.account.Organization;
import com.wsria.demo.activiti.entity.account.Role;
import com.wsria.demo.activiti.entity.account.User;
import com.wsria.demo.activiti.util.account.OrganizationUtil;

/**
 * 安全相关实体的管理类, 包括用户,角色,资源与授权类.
 * 
 * @author HenryYan
 */
@Component
@Transactional
public class AccountManager extends BaseEntityManager<User, String> {

	private static Logger logger = LoggerFactory.getLogger(AccountManager.class);

	private UserDao userDao;
	private RoleDao roleDao;

	@Autowired
	private AuthorityDao authorityDao;

	@Autowired
	private OrganizationDao OrganizationDao;

	@Autowired
	private DeptManager deptManager;

	//-- User Manager --//

	@Transactional(readOnly = true)
	public String getAllUserName() {
		return userDao.getAllUserName();
	}

	@Transactional(readOnly = true)
	public String getAllOrgName(String userId) {
		return userDao.getAllOrgName(userId);
	}

	@Transactional(readOnly = true)
	public String getUserIdByUserName(String name) {
		return userDao.getUserIdByUserName(name);
	}

	public void setOrganizationDao(OrganizationDao OrganizationDao) {
		this.OrganizationDao = OrganizationDao;
	}

	//-- Dept Manager --//
	@Transactional(readOnly = true)
	public Organization getOrganization(Long id) {
		return OrganizationDao.get(id);
	}

	/**
	 * 删除用户,如果尝试删除超级管理员将抛出异常.
	 */
	public void deleteUser(String id) {
		if (isSupervisor(id)) {
			logger.warn("操作员{}尝试删除超级管理员用户", SpringSecurityUtils.getCurrentUserName());
			throw new ServiceException("不能删除超级管理员用户");
		}
		userDao.delete(id);
	}

	/**
	 * 判断是否超级管理员.
	 */
	private boolean isSupervisor(String id) {
		return id.equals("1");
	}

	/**
	 * 根据部门id,得到下面的小组
	 */
	public List<Organization> getGroupByDeptId(Long id) {
		List<Organization> Organizations = OrganizationDao.findBy("parentId", id);
		return Organizations;
	}

	/**
	 * 使用属性过滤条件查询用户.
	 * @throws Exception 
	 */
	@Transactional(readOnly = true)
	public Page<User> searchUser(final Page<User> page, final List<PropertyFilter> filters) throws Exception {
		Page<User> findPage = userDao.findPage(page, filters);
		return findPage;
	}

	/**
	 * 使用属性过滤条件查询角色.
	 */
	@Transactional(readOnly = true)
	public Page<Role> searchRole(final Page<Role> page, final List<PropertyFilter> filters) {
		return roleDao.findPage(page, filters);
	}

	@Transactional(readOnly = true)
	public User findUserByLoginName(String loginName) {
		return userDao.findUniqueBy("loginName", loginName);
	}

	/**
	 * 根据ID查找用户
	 * @param id
	 * @return
	 */
	@Transactional(readOnly = true)
	public User findUserById(String id) {
		return userDao.findUniqueBy("id", id);
	}

	/**
	 * 检查用户名是否唯一.
	 *
	 * @return loginName在数据库中唯一或等于oldLoginName时返回true.
	 */
	@Transactional(readOnly = true)
	public boolean isLoginNameUnique(String newLoginName, String oldLoginName) {
		return userDao.isPropertyUnique("loginName", newLoginName, oldLoginName);
	}

	/**
	 * 查询用户ID和用户名称
	 * @param userId	用户ID（可以是多个）
	 * @return	Map<用户ID，用户名称>
	 */
	@SuppressWarnings("unchecked")
	@Transactional(readOnly = true)
	public Map<String, String> findIdAndNames(String... userId) {
		Map<String, String> idAndNames = new HashMap<String, String>();
		if (ArrayUtils.isEmpty(userId)) {
			return idAndNames;
		}
		Criteria criteria = userDao.createCriteria(Restrictions.in("id", userId));
		ProjectionList projectionList = Projections.projectionList();
		projectionList.add(Projections.property("id"));
		projectionList.add(Projections.property("name"));
		criteria.setProjection(projectionList);
		List<Object[]> list = criteria.list();
		for (Object[] objects : list) {
			idAndNames.put(objects[0].toString(), objects[1].toString());
		}
		return idAndNames;
	}

	/**
	 * 转移用户至部门
	 * @param orgId	部门ID
	 * @param userIds	用户IDs
	 */
	public void moveUserToOrg(Long orgId, String... userIds) {
		userDao.updateUserOrg(orgId, userIds);
		Organization targetOrg = deptManager.getEntity(orgId);
		String deptName = OrganizationUtil.getLevelableDeptName(targetOrg, deptManager);
		for (String userId : userIds) {
			User user = getEntity(userId);
			user.setOrgName(deptName);
			saveEntity(user);
		}
	}

	//-- Role Manager --//
	@Transactional(readOnly = true)
	public Role getRole(Long id) {
		return roleDao.get(id);
	}

	@Transactional(readOnly = true)
	public List<Role> getAllRole() {
		return roleDao.getAll("priority", true);
	}

	public void saveRole(Role entity) {
		roleDao.save(entity);
	}

	public void deleteRole(Long id) {
		roleDao.delete(id);
	}

	//-- Authority Manager --//
	@Transactional(readOnly = true)
	public List<Authority> getAllAuthority() {
		return authorityDao.getAll();
	}

	@Transactional(readOnly = true)
	public List<Long> getAllAuthorityByRoleId(Long id) {
		return authorityDao.findAuthorityIds(id);
	}

	@Autowired
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	@Autowired
	public void setRoleDao(RoleDao roleDao) {
		this.roleDao = roleDao;
	}

	@Autowired
	public void setAuthorityDao(AuthorityDao authorityDao) {
		this.authorityDao = authorityDao;
	}

	@Override
	public BaseHibernateDao<User, String> getDao() {
		return userDao;
	}

}
