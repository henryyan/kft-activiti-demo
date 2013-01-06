package me.kafeitu.demo.activiti.web.user;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import me.kafeitu.demo.activiti.web.identify.UseController;
import me.kafeitu.modules.test.spring.SpringTransactionalTestCase;

import org.activiti.engine.IdentityService;
import org.activiti.engine.identity.User;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.ContextConfiguration;

/**
 * 测试用户控制器
 *
 * @author HenryYan
 */
@ContextConfiguration(locations = { "/applicationContext-test.xml" })
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
		MockHttpSession session = new MockHttpSession();
		String view = c.logon("kafeitu", "000000", session);
		assertEquals("redirect:/main/index", view);
		assertNotNull(session.getAttribute("user"));
		User user = (User) session.getAttribute("user");
		assertEquals("kafeitu", user.getId());
	}

	/**
	 * 用户名不存在
	 * @throws Exception
	 */
	@Test
	public void testUserNotExistInDb() throws Exception {
		UseController c = new UseController();
		c.setIdentityService(identityService);
		MockHttpSession session = new MockHttpSession();
		String view = c.logon("nothisuser", "000000", session);
		assertEquals("redirect:/login?error=true", view);
	}

}
