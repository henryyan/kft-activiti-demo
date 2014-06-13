package me.kafeitu.dubbo;

import java.util.Map;

import org.activiti.engine.ManagementService;
import org.activiti.engine.RuntimeService;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Consumer {
 
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"dubbo/consumer.xml"});
        context.start();

        // 读取引擎属性
        ManagementService managementService = (ManagementService)context.getBean("managementService"); // 获取远程服务代理
        Map<String, String> properties = managementService.getProperties();
        System.out.println( properties ); // 显示调用结果

        // 部署流程(有异常)
        /*RepositoryService repositoryService = (RepositoryService) context.getBean("repositoryService");
        String processFilePath = Consumer.class.getClassLoader().getResource("diagrams/leave/leave.bpmn").getPath();
        FileInputStream inputStream = new FileInputStream(processFilePath);
        repositoryService.createDeployment().addInputStream("leave.bpmn20.xml", inputStream).deploy();*/

        // 查询流程（有异常）
        RuntimeService runtimeService = context.getBean(RuntimeService.class);
        System.out.println(runtimeService.createExecutionQuery().list());
    }
 
}