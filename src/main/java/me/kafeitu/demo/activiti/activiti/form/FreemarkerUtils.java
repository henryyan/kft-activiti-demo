package me.kafeitu.demo.activiti.activiti.form;

import java.io.File;
import java.io.IOException;

import freemarker.template.Configuration;
import freemarker.template.DefaultObjectWrapper;
import freemarker.template.Template;

/**
 * @author: Henry Yan
 */
public class FreemarkerUtils {

    private static Configuration cfg;

    public static void init() throws IOException {
        cfg = new Configuration();
        cfg.setDirectoryForTemplateLoading(new File("/Users/henryyan/work/projects/activiti/kft-activiti-demo/src/main/resources/templates"));
        cfg.setObjectWrapper(new DefaultObjectWrapper());
    }

    public static void reload() throws IOException {
        init();
    }

    public static Configuration getCfg() throws IOException {
        if (cfg == null) {
            init();
        }
        return cfg;
    }

    public static Template getTemplate(String templateFileName) throws IOException {
        return getCfg().getTemplate(templateFileName);
    }

}
