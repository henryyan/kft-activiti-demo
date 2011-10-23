package com.wsria.demo.activiti.service.account;

import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.collect.Sets;
import com.wsria.demo.activiti.entity.account.Role;
import com.wsria.demo.activiti.entity.account.User;

/**
 * 实现SpringSecurity的UserDetailsService接口,实现获取用户Detail信息的回调函数.
 * 
 * @author calvin
 */
@Transactional(readOnly = true)
public class UserDetailsServiceImpl implements UserDetailsService {

	private AccountManager accountManager;

	/**
	 * 获取用户Details信息的回调函数.
	 */
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException, DataAccessException {

		if (StringUtils.isBlank(username)) {
			throw new UsernameNotFoundException("没有" + username + "这个工号");
		}

		//-- mini-web示例中无以下属性, 暂时全部设为true. --//
		boolean enabled = true;
		boolean accountNonExpired = true;
		boolean credentialsNonExpired = true;
		boolean accountNonLocked = true;

		UserDetails userdetails = null;
		try {
			User user = accountManager.getEntity(username);

			Set<GrantedAuthority> grantedAuths = obtainGrantedAuthorities(user);

			userdetails = new org.springframework.security.core.userdetails.User(user.getId().toString(),
					user.getPassword(), enabled, accountNonExpired, credentialsNonExpired, accountNonLocked,
					grantedAuths);
		} catch (Exception e) {
			throw new UsernameNotFoundException("没有" + username + "这个工号");

		}

		return userdetails;
	}

	/**
	 * 获得用户所有角色的权限集合.
	 * 由于本系统没有设置资源所以用角色代替资源层 comment by HenryYan.
	 */
	private Set<GrantedAuthority> obtainGrantedAuthorities(User user) {
		Set<GrantedAuthority> authSet = Sets.newHashSet();
		for (Role role : user.getRoleList()) {
			authSet.add(new GrantedAuthorityImpl(role.getName()));
		}
		return authSet;
	}

	@Autowired
	public void setAccountManager(AccountManager accountManager) {
		this.accountManager = accountManager;
	}
}
