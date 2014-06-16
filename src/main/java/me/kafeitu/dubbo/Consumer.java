package me.kafeitu.dubbo;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Consumer {
 
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"dubbo/consumer.xml"});
        context.start();

        // 读取引擎属性
        TestDubbo dubbo = context.getBean(TestDubbo.class);
        System.out.println(dubbo.engineProperties());
    }
 
}