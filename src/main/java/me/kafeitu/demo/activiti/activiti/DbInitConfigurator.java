package me.kafeitu.demo.activiti.activiti;

import org.activiti.engine.cfg.ProcessEngineConfigurator;
import org.activiti.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.activiti.engine.impl.db.DbSqlSessionFactory;

/**
 * @author 三寻
 * @version 1.0
 * @date 16/8/19
 */
public class DbInitConfigurator implements ProcessEngineConfigurator {

    @Override
    public void beforeInit(ProcessEngineConfigurationImpl processEngineConfiguration) {
        DbSqlSessionFactory.databaseSpecificLimitAfterStatements.put("h2", "LIMIT #{firstResult},#{maxResults}");
        DbSqlSessionFactory.databaseSpecificLimitAfterStatements.put("mysql", "LIMIT #{firstResult},#{maxResults}");
    }

    @Override
    public void configure(ProcessEngineConfigurationImpl processEngineConfiguration) {

    }

    @Override
    public int getPriority() {
        return 0;
    }
}
