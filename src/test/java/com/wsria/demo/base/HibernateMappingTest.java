package com.wsria.demo.base;


import java.util.Map;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.persister.entity.EntityPersister;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springside.modules.test.spring.SpringTxTestCase;

/**
 * 简单测试所有Entity类的O/R Mapping.
 *  
 * @author HenryYan
 */
@ContextConfiguration(locations = { "/applicationContext-test.xml" })
public class HibernateMappingTest extends SpringTxTestCase {
	private static Logger logger = LoggerFactory.getLogger(HibernateMappingTest.class);

	@Autowired
	private SessionFactory sessionFactory;

	@Test
	@SuppressWarnings("rawtypes")
	public void allClassMapping() throws Exception {
		Session session = sessionFactory.openSession();

		try {
			Map metadata = sessionFactory.getAllClassMetadata();
			for (Object o : metadata.values()) {
				EntityPersister persister = (EntityPersister) o;
				String className = persister.getEntityName();
				Query q = session.createQuery("from " + className + " c");
				q.iterate();
				logger.debug("ok: " + className);
			}
		} finally {
			session.close();
		}
	}
}
