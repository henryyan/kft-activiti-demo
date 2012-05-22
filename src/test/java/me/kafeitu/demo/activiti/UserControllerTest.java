package me.kafeitu.demo.activiti;

import static org.junit.Assert.assertEquals;
import me.kafeitu.demo.activiti.web.UseController;

import org.activiti.engine.IdentityService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

/**
 * 测试用户控制器
 *
 * @author HenryYan
 */
@ContextConfiguration(locations = { "/applicationContext.xml" })
public class UserControllerTest extends SpringTransactionalTestCase {

	@Autowired
	private IdentityService identityService;

	/**
	 * 正确的用户名、密码
	 * @throws Exception
	 */
	@Test
	public void testUserExistInDb() throws Exception {
		UseController c = new UseController();
		c.setIdentityService(identityService);
		String view = c.logon("kafeitu", "000000");
		assertEquals("main", view);
	}
	
	/**
	 * 用户名不存在
	 * @throws Exception
	 */
	@Test
	public void testUserNotExistInDb() throws Exception {
		UseController c = new UseController();
		c.setIdentityService(identityService);
		String view = c.logon("nothisuser", "000000");
		assertEquals("redirect:/login?error=true", view);
	}

}
