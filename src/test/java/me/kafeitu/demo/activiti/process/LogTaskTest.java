package me.kafeitu.demo.activiti.process;

import com.google.common.collect.Maps;
import org.activiti.engine.impl.test.PluggableActivitiTestCase;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.test.Deployment;

import java.util.Map;

/**
 * @author 三寻
 * @version 1.0
 * @date 16/11/13
 */
public class LogTaskTest extends PluggableActivitiTestCase {

    @Deployment
    public void testSample() {

        ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("extLogExample");

        System.out.println(processInstance);
    }

    @Deployment
    public void testWithVariable() {

        Map<String, Object> vars = Maps.newHashMap();
        vars.put("name", "Henry Yan");
        ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("extLogExample", vars);

        System.out.println(processInstance);
    }

}
