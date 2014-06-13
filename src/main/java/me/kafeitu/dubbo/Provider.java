package me.kafeitu.dubbo;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Provider {
 
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"dubbo/applicationContext.xml", "dubbo/provider.xml"});
        context.start();
 
        System.in.read(); // 按任意键退出
    }
 
}