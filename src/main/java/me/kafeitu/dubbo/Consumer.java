package me.kafeitu.dubbo;

import java.util.Map;

import org.activiti.engine.ManagementService;
import org.activiti.engine.RuntimeService;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Consumer {
 
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"dubbo/consumer.xml"});
        context.start();

        ManagementService managementService = (ManagementService)context.getBean("managementService"); // 获取远程服务代理
        Map<String, String> properties = managementService.getProperties();

        RuntimeService runtimeService = context.getBean(RuntimeService.class);
        System.out.println(runtimeService.createExecutionQuery().list());

        System.out.println( properties ); // 显示调用结果
    }
 
}