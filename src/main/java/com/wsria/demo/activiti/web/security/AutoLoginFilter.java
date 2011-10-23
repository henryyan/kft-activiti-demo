package com.wsria.demo.activiti.web.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.GenericFilterBean;
import org.springside.modules.security.springsecurity.SpringSecurityUtils;

/**
 * 自动以默认用户名登录的filter, 用于开发时不需要每次进入登录页面.
 * 
 * @author kevin@ericsson.com
 */
public class AutoLoginFilter extends GenericFilterBean {

	private UserDetailsService userDetailsService;

	private boolean enabled = false;

	private String defaultUserName;

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,
			ServletException {
		//如果被激活且当前用户未登录则进行登录
		if (enabled && SpringSecurityUtils.getCurrentUser() == null) {
			UserDetails userDetails = userDetailsService.loadUserByUsername(defaultUserName);

			if (userDetails == null) {
				throw new RuntimeException("默认用户" + defaultUserName + "不存在");
			}

			SpringSecurityUtils.saveUserDetailsToContext(userDetails, (HttpServletRequest) request);
		}
        try {
		chain.doFilter(request, response);
        }catch(Exception e) {
        	
        }
	}

	@Autowired
	public void setUserDetailsService(UserDetailsService userDetailsService) {
		this.userDetailsService = userDetailsService;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	@Required
	public void setDefaultUserName(String defaultUserName) {
		this.defaultUserName = defaultUserName;
	}
}
