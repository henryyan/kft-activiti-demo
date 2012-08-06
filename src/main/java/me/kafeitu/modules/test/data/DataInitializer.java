package me.kafeitu.modules.test.data;

import javax.sql.DataSource;

import org.springframework.beans.factory.InitializingBean;

/**
 * 测试数据初始化工具
 * 
 * @author calvin
 */
public class DataInitializer implements InitializingBean {

	private DataSource dataSource;

	private String dataFile;

	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	public void setDataFile(String dataFile) {
		this.dataFile = dataFile;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		DataFixtures.reloadData(dataSource, dataFile);
	}
}
