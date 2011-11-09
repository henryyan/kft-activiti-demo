package com.wsria.demo.base;

import org.springframework.test.context.ContextConfiguration;
import org.springside.modules.test.spring.SpringTxTestCase;

/**
 * 基于Spring的基础测试类
 *
 * @author HenryYan
 *
 */
@ContextConfiguration(locations = { "/applicationContext-test.xml" })
public class BaseSpringTxTestCase extends SpringTxTestCase {
	
}
