package me.kafeitu.demo.activiti.web;

import javax.sql.DataSource;

import org.activiti.engine.IdentityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 用户相关控制器
 *
 * @author HenryYan
 */
@Controller
@RequestMapping("/user")
public class UseController {

	private static Logger logger = LoggerFactory.getLogger(UseController.class);

	// Activiti Identify Service
	private IdentityService identityService;

	@Autowired
	DataSource dataSource;

	@RequestMapping(value = "/logon", method = RequestMethod.GET)
	public String logon(@RequestParam("username") String userName, @RequestParam("password") String password) {
		logger.debug("logon request: {username={}, password={}}", userName, password);
		boolean checkPassword = identityService.checkPassword(userName, password);
		if (checkPassword) {
			return "main";
		} else {
			return "redirect:/login?error=true";
		}
	}

	@Autowired
	public void setIdentityService(IdentityService identityService) {
		this.identityService = identityService;
	}

}
