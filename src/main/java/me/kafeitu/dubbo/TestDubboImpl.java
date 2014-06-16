package me.kafeitu.dubbo;

import java.util.Map;

import org.activiti.engine.ManagementService;

/**
 * @author: Henry Yan
 */
public class TestDubboImpl implements TestDubbo {

    ManagementService managementService;

    public void setManagementService(ManagementService managementService) {
        this.managementService = managementService;
    }

    @Override
    public Map<String, String> engineProperties() {
        return managementService.getProperties();
    }
}
