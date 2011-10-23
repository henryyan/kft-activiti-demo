package com.wsria.demo.activiti.util.account;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.springside.modules.security.springsecurity.SpringSecurityUtils;
import org.springside.modules.utils.spring.SpringContextHolder;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.opensymphony.xwork2.ActionContext;
import com.wsria.demo.activiti.entity.account.Role;
import com.wsria.demo.activiti.entity.account.User;
import com.wsria.demo.activiti.service.account.AccountManager;

/**
 * 用户工具类.
 *
 * @author HenryYan
 *
 */
public class UserUtil {

	public static String USER = "user";
	
	/**
	 * 默认密码
	 */
	public static final String DEFAULT_USER_PASSWORD = "000000";

	/**
	 * 获取当前登录的管理员，如果没有根据spring security中的登录名查询
	 * @return
	 */
	public static User getCurrentUser() {
		// 交给spring security处理的时候不能获取上下文信息直接返回null
		if (ActionContext.getContext() == null) {
			return null;
		}
		HttpSession session = Struts2Utils.getSession();
		Object sessionUser = session.getAttribute(USER);
		User user = null;
		if (sessionUser == null) {
			String userId = SpringSecurityUtils.getCurrentUserName();
			AccountManager manager = SpringContextHolder.getBean("accountManager");
			if (StringUtils.isNotBlank(userId) && StringUtils.isNumeric(userId)) {
				user = manager.getEntity(userId);
				session.setAttribute(USER, user);
			}
		} else {
			user = (User) sessionUser;
		}
		return user;
	}

	/**
	 * 获取当前用户的ID
	 * @return 当前用户的ID
	 */
	public static String getCurrentUserId() {
		User currentUser = getCurrentUser();
		if (currentUser == null) {
			return null;
		}
		return getCurrentUser().getId();
	}

	/**
	 * 获取当前用户姓名
	 * @return	当前用户姓名
	 */
	public static String getCurrentUserName() {
		User currentUser = getCurrentUser();
		if (currentUser == null) {
			return "";
		}
		return currentUser.getName();
	}

	/**
	 * 获取当前用户权限ids
	 * @return	当前用户权限ids
	 */
	public static String getCurrentUserRoleIds() {
		User currentUser = getCurrentUser();
		if (currentUser == null) {
			return null;
		}
		List<Role> list = currentUser.getRoleList();
		String role = "";
		if (list.size() > 0) {
			for (Role l : list) {
				role = String.valueOf(l.getName());
			}
		}
		return role;
	}

	/**
	 * 获取全部用户
	 * @return	全部用户name
	 */
	public static String getAllUserName() {
		AccountManager manager = SpringContextHolder.getBean("accountManager");
		String names = manager.getAllUserName();
		return names;
	}

	/**
	 * 获取全部用户
	 * @return	全部用户name
	 */
	public static String getAllOrgName() {
		AccountManager manager = SpringContextHolder.getBean("accountManager");
		User currentUser = getCurrentUser();
		if (currentUser == null) {
			return "";
		}
		String orgs = manager.getAllOrgName(currentUser.getId());
		return orgs;
	}

	/**
	 * 判断用户是否有指定角色
	 * @param roles		用户拥有的角色
	 * @param roleName	需要验证的角色
	 * @return	true|false
	 */
	public static boolean hasAnyRole(List<Role> roles, String... roleName) {
		for (int i = 0; i < roleName.length; i++) {
			for (Role role : roles) {
				if (role.getName().equals(roleName[i])) {
					return true;
				}
			}
		}
		return false;
	}
	
	public static String getUserTheme() {
		User currentUser = getCurrentUser();
		if (currentUser == null) {
			return "";
		} else {
			return currentUser.getTheme();
		}
	}

}
