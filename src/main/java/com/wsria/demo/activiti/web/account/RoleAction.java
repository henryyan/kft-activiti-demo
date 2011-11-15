package com.wsria.demo.activiti.web.account;

import java.util.List;

import org.activiti.engine.IdentityService;
import org.activiti.engine.identity.Group;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.runchain.arch.util.orm.EntityUtils;
import com.runchain.arch.util.orm.PropertyFilterUtils;
import com.runchain.arch.web.base.JqGridCrudActionSupport;
import com.wsria.demo.activiti.entity.account.Authority;
import com.wsria.demo.activiti.entity.account.Role;
import com.wsria.demo.activiti.service.account.AccountManager;

/**
 * 角色管理Action.
 * 
 * @author HenryYan
 */
public class RoleAction extends JqGridCrudActionSupport<Role, Long> {

	private static final long serialVersionUID = -4052047494894591406L;
	public static final String AUTHORITYTREE = "authorityTree";
	
	private AccountManager accountManager;
	
	@Autowired
	IdentityService identityService;

	//-- 页面属性 --//
	private Long id;
	private Role entity;
	private List<Role> allRoleList;//角色列表
	private List<Long> checkedAuthIds;//页面中钩选的权限id列表
	private Page<Role> page = new Page<Role>(20);//每页20条记录

	//-- ModelDriven 与 Preparable函数 --//
	public Role getModel() {
		return entity;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id != null) {
			entity = accountManager.getRole(id);
		} else {
			entity = new Role();
		}
	}

	//-- CRUD Action 函数 --//
	@Override
	public String list() throws Exception {
		allRoleList = accountManager.getAllRole();
		try {
			List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
			PropertyFilterUtils.handleFilter(page, Role.class, filters);

			page = accountManager.searchRole(page, filters);
			Struts2Utils.renderJson(this);
		} catch (Exception e) {
			logger.error("角色列表 ", e);
		}
		return null;
	}

	public String authority() throws Exception {
		return AUTHORITYTREE;
	}

	@Override
	public String save() throws Exception {
		try {
			if (EntityUtils.isNew(entity.getId())) {
				Group newGroup = identityService.newGroup(entity.getEnName());
				newGroup.setName(entity.getName());
				newGroup.setType(entity.getType());
				identityService.saveGroup(newGroup);
			} else {
				List<Group> groups = identityService.createGroupQuery().groupId(entity.getEnName()).list();
				if (groups.size() > 0) {
					Group group = groups.get(0);
					group.setName(entity.getName());
					group.setType(entity.getType());
					identityService.saveGroup(group);
				}
			}
			accountManager.saveRole(entity);
		} catch (Exception e) {
			logger.error("保存角色出错：{}", e);
		}
		return null;
	}

	@Override
	public String delete() throws Exception {
		try {
			Role role = accountManager.getRole(id);
			identityService.deleteGroup(role.getEnName());
			accountManager.deleteRole(id);
		} catch (Exception e) {
			logger.error("删除角色出错：{}", e);
		}
		return null;
	}

	//-- 页面属性访问函数 --//
	/**
	 * list页面显示所有角色列表.
	 */
	public List<Role> getAllRoleList() {
		return allRoleList;
	}

	/**
	 * input页面显示所有授权列表.
	 */
	public List<Authority> getAllAuthorityList() {
		return accountManager.getAllAuthority();
	}

	/**
	 * input页面显示角色拥有的授权.
	 */
	public List<Long> getCheckedAuthIds() {
		return checkedAuthIds;
	}

	/**
	 * input页面提交角色拥有的授权.
	 */
	public void setCheckedAuthIds(List<Long> checkedAuthIds) {
		this.checkedAuthIds = checkedAuthIds;
	}

	@Autowired
	public void setAccountManager(AccountManager accountManager) {
		this.accountManager = accountManager;
	}

	@Override
	public Page<Role> getPage() {
		return page;
	}
}