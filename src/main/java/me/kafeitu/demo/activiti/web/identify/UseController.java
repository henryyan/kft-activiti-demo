package me.kafeitu.demo.activiti.web.identify;

import javax.servlet.http.HttpSession;

import org.activiti.engine.IdentityService;
import org.activiti.engine.identity.User;
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

	/**
	 * 登录系统
	 * @param userName		
	 * @param password
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/logon", method = RequestMethod.GET)
	public String logon(@RequestParam("username") String userName, @RequestParam("password") String password, HttpSession session) {
		logger.debug("logon request: {username={}, password={}}", userName, password);
		boolean checkPassword = identityService.checkPassword(userName, password);
		if (checkPassword) {

			// read user from database
			User user = identityService.createUserQuery().userId(userName).singleResult();
			session.setAttribute("user", user);

			return "redirect:/main/index";
		} else {
			return "redirect:/login?error=true";
		}
	}

	@Autowired
	public void setIdentityService(IdentityService identityService) {
		this.identityService = identityService;
	}

}
