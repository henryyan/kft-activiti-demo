package me.kafeitu.demo.activiti.activiti.form;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.form.StartFormData;
import org.activiti.engine.form.TaskFormData;
import org.activiti.engine.impl.context.Context;
import org.activiti.engine.impl.form.FormEngine;
import org.activiti.engine.task.Task;

/**
 * @author: Henry Yan
 */
public class FreemarkerForEngine implements FormEngine {

    @Override
    public String getName() {
        return "freemarker";
    }

    @Override
    public Object renderStartForm(StartFormData startForm) {
        String text = "";
        try {
            Template template = FreemarkerUtils.getTemplate(startForm.getFormKey());

            Map<String, Object> datas = new HashMap<String, Object>();

            Writer out = new StringWriter();
            template.process(datas, out);
            text = out.toString();

        } catch (IOException e) {
            e.printStackTrace();
        } catch (TemplateException e) {
            e.printStackTrace();
        }
        return text;
    }

    @Override
    public Object renderTaskForm(TaskFormData taskForm) {
        String text = "";
        try {
            Task task = taskForm.getTask();

            RuntimeService runtimeService = Context.getProcessEngineConfiguration().getRuntimeService();

            Map<String, Object> variables = runtimeService.getVariables(task.getExecutionId());

            Template template = FreemarkerUtils.getTemplate(taskForm.getFormKey());

            Writer out = new StringWriter();
            template.process(variables, out);
            text = out.toString();

        } catch (IOException e) {
            e.printStackTrace();
        } catch (TemplateException e) {
            e.printStackTrace();
        }
        return text;
    }

}
