package me.kafeitu.demo.activiti;

import java.io.File;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import freemarker.template.Configuration;
import freemarker.template.DefaultObjectWrapper;
import freemarker.template.Template;
import freemarker.template.TemplateException;

/**
 * @author: Henry Yan
 */
public class FreemarkerTest {

    public static void main(String[] args) throws IOException, TemplateException {
        Configuration cfg = new Configuration();
        cfg.setDirectoryForTemplateLoading(new File("/Users/henryyan/work/projects/activiti/kft-activiti-demo/src/test/resources/templates"));
        cfg.setObjectWrapper(new DefaultObjectWrapper());

        // 创建根哈希表
        Map root = new HashMap();

        // 在根中放入字符串"user"
        root.put("user", "Big Joe");

        // 为"latestProduct"创建哈希表
        Map latest = new HashMap();

        // 将它添加到根哈希表中
        root.put("latestProduct", latest);

        // 在latest中放置"url"和"name"
        latest.put("url", "products/greenmouse.html");
        latest.put("name", "green mouse");

        Template temp = cfg.getTemplate("hello.ftl");

        Writer out = new OutputStreamWriter(System.out);
        temp.process(root, out);
        out.flush();
    }

}
