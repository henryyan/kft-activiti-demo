package me.kafeitu.demo.activiti.dao;

import static org.junit.Assert.assertNotNull;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import me.kafeitu.demo.activiti.entity.account.Group;
import me.kafeitu.demo.activiti.entity.account.User;
import me.kafeitu.modules.test.spring.SpringTransactionalTestCase;

import org.junit.Test;
import org.springframework.test.context.ContextConfiguration;

/**
 * 测试初始化数据
 *
 * @author HenryYan
 */
@ContextConfiguration(locations = { "/applicationContext-test.xml" })
public class InitDataTest extends SpringTransactionalTestCase {

	@PersistenceContext
	private EntityManager em;
	
	@Test
	public void testUserData() throws Exception {
		Group group = em.find(Group.class, "admin");
		assertNotNull(group);
		
		group = em.find(Group.class, "user");
		assertNotNull(group);
		
		User user = em.find(User.class, "admin");
		assertNotNull(user);
		
		user = em.find(User.class, "kafeitu");
		assertNotNull(user);
	}

}
