package com.wsria.demo.activiti.web.account;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.runchain.arch.service.ServiceException;
import com.runchain.arch.util.ajax.JqGridUtil;
import com.runchain.arch.util.constant.ServerConstants;
import com.runchain.arch.util.number.LongUtils;
import com.runchain.arch.util.orm.HibernateUtils;
import com.runchain.arch.util.orm.PropertyFilterUtils;
import com.runchain.arch.util.string.HtmlUtil;
import com.runchain.arch.web.base.CrudActionSupport;
import com.wsria.demo.activiti.entity.account.Role;
import com.wsria.demo.activiti.entity.account.User;
import com.wsria.demo.activiti.service.account.AccountManager;
import com.wsria.demo.activiti.util.account.UserUtil;

/**
 * 用户管理Action.
 * 
 * 使用Struts2 convention-plugin annotation定义Action参数.
 * 演示带分页的管理界面.
 * 
 * @author calvin
 */
//定义URL映射对应/account/user.action
@Namespace("/account")
//定义名为reload的result重定向到user.action, 其他result则按照convention默认.
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "user.action", type = "redirect"),
		@Result(name = CrudActionSupport.JSON, type = CrudActionSupport.JSON) })
public class UserAction extends CrudActionSupport<User> {

	private static final long serialVersionUID = 8683878162525847072L;

	private AccountManager accountManager;

	//-- 页面属性 --//
	protected String jqid;
	protected User entity;

	private String id;
	private Page<User> page = new Page<User>(20);//每页20条记录
	private String roleIds; //页面中钩选的角色id列表
	
	private String themeName;

	//-- ModelDriven 与 Preparable函数 --//
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * 设置实体的ID，如果jqGrid发送来的ID为<code>JqGridUtil.ID_EMPTY</code>则设置实体对象的ID为NULL，否则转换成LONG型
	 * @param jqid	jqGrid发送的实体ID
	 */
	public void setJqid(String jqid) {
		this.jqid = jqid;
		if (JqGridUtil.ID_EMPTY.equals(jqid)) {
			setId(null);
		} else {
			setId(jqid);
		}
	}

	public User getModel() {
		return entity;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id != null) {
			entity = accountManager.getEntity(id);
		} else {
			entity = new User();
		}
	}

	//-- CRUD Action 函数 --//
	@Override
	public String list() throws Exception {
		try {
			List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
			PropertyFilterUtils.handleFilter(page, User.class, filters);

			page = accountManager.searchUser(page, filters);
			Struts2Utils.renderJson(this);
		} catch (Exception e) {
			logger.error("用户列表 ", e);
		}
		return null;
	}

	@Override
	public String input() throws Exception {
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		//根据页面上的checkbox选择 整合User的Roles Set
		//HibernateUtils.mergeByCheckedIds(entity.getRoleList(), checkedRoleIds, Role.class);
		List<Long> arrayRoleIds = LongUtils.convertList(roleIds);
		HibernateUtils.mergeByCheckedIds(entity.getRoleList(), arrayRoleIds, Role.class);
		accountManager.saveEntity(entity);
		addActionMessage("保存用户成功");
		return RELOAD;
	}

	@Override
	public String delete() throws Exception {
		try {
			accountManager.deleteUser(id);
			addActionMessage("删除用户成功");
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			addActionMessage("删除用户失败");
		}
		return RELOAD;
	}

	/**
	 * 修改密码
	 * @return
	 * @throws Exception
	 */
	public String updatePassWord() throws Exception {
		try {
			HttpServletRequest request = ServletActionContext.getRequest();
			String newpass = request.getParameter("newpass");
			String oldpass = request.getParameter("oldpass");
			entity = accountManager.getEntity(id);
			if (!entity.getPassword().equals(oldpass)) {
				Struts2Utils.renderText("原始密码不正确！");
				return null;
			}
			entity.setPassword(newpass);
			accountManager.saveEntity(entity);
			Struts2Utils.renderText(SUCCESS);
		} catch (Exception e) {
			logger.error("修改密码失败：", e);
		}
		return null;
	}

	/**
	 * 重置密码
	 * @return
	 * @throws Exception
	 */
	public String resetPassword() throws Exception {
		try {
			entity = accountManager.getEntity(id);
			entity.setPassword(UserUtil.DEFAULT_USER_PASSWORD);
			accountManager.saveEntity(entity);
			logger.info("重置用户：{}密码成功！", entity.getId() + "|" + entity.getName());
			Struts2Utils.renderText(SUCCESS);
		} catch (Exception e) {
			logger.error("重置密码失败：{user.id={}}", entity.getId(), e);
			Struts2Utils.renderText(ServerConstants.RESPONSE_SYSTEM_ERROR);
		}
		return null;
	}

	//-- 其他Action函数 --//
	/**
	 * 支持使用Jquery.validate Ajax检验用户名是否重复.
	 */
	public String checkLoginName() {
		HttpServletRequest request = ServletActionContext.getRequest();
		String newLoginName = request.getParameter("loginName");
		String oldLoginName = request.getParameter("oldLoginName");

		if (accountManager.isLoginNameUnique(newLoginName, oldLoginName)) {
			Struts2Utils.renderText("true");
		} else {
			Struts2Utils.renderText("false");
		}
		//因为直接输出内容而不经过jsp,因此返回null.
		return null;
	}

	/**
	 * 编辑用户是使用的下拉框生成器
	 * @return
	 * @throws Exception
	 */
	public String roleSelect() throws Exception {
		try {
			Map<Long, Map<Long, String>> majorJobs = new LinkedHashMap<Long, Map<Long, String>>();
			List<Role> list = accountManager.getAllRole();
			for (Role role : list) {
				Map<Long, String> value = new LinkedHashMap<Long, String>();
				value.put(role.getId(), role.getName());
				majorJobs.put(role.getId(), value);
			}
			// transfer to select
			String groupSelect = HtmlUtil.createRoleSelect(majorJobs);
			Struts2Utils.renderText(groupSelect);
		} catch (Exception e) {
			logger.error("生成角色OPTIONS的HTML代码, 出错:", e);
		}

		return null;
	}

	/**
	 * 搜索时用的下拉框生成器
	 * @return
	 * @throws Exception
	 */
	public String roleSelectForSearch() throws Exception {
		try {
			Map<String, String> roleNames = new LinkedHashMap<String, String>();
			List<Role> list = accountManager.getAllRole();
			for (Role role : list) {
				roleNames.put(role.getName(), role.getName());
			}
			// transfer to select
			String groupSelect = HtmlUtil.generateSelect(roleNames);
			Struts2Utils.renderText(groupSelect);
		} catch (Exception e) {
			logger.error("生成角色OPTIONS的HTML代码, 出错:", e);
		}

		return null;
	}
	
	/**
	 * 转移用户至部门
	 * @return
	 * @throws Exception
	 */
	public String moveUserToOrg() throws Exception {
		Long orgId = Long.parseLong(StringUtils.defaultIfEmpty(Struts2Utils.getParameter("orgId"), "0"));
		String[] userIds = StringUtils.defaultString(Struts2Utils.getParameter("userIds")).split(",");
		try {
			accountManager.moveUserToOrg(orgId, userIds);
			Struts2Utils.renderText(SUCCESS);
		} catch (Exception e) {
			logger.error("迁移用户：{}，至部门：{}", new Object[] {
					userIds, orgId, e
			});
		}
		return null;
	}

	//-- 页面属性访问函数 --//
	/**
	 * list页面显示用户分页列表.
	 */
	public Page<User> getPage() {
		return page;
	}

	/**
	 * input页面显示所有角色列表.
	 */
	public List<Role> getAllRoleList() {
		return accountManager.getAllRole();
	}
	
	/**
	 * 设置主题名称
	 * @return
	 */
	public String changeTheme() {
		try {
			entity = accountManager.getEntity(UserUtil.getCurrentUserId());
			entity.setTheme(themeName);
			accountManager.saveEntity(entity);
			UserUtil.getCurrentUser().setTheme(themeName);
			Struts2Utils.renderText(SUCCESS);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Autowired
	public void setAccountManager(AccountManager accountManager) {
		this.accountManager = accountManager;
	}

	public void setRoleIds(String roleIds) {
		this.roleIds = roleIds;
	}

	public void setThemeName(String themeName) {
		this.themeName = themeName;
	}

	
}
