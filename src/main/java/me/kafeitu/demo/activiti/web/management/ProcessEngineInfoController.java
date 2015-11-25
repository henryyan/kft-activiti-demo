package me.kafeitu.demo.activiti.web.management;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import org.activiti.engine.ManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * 作业控制器
 * User: henryyan
 */
@Controller
@RequestMapping(value = "/management/engine")
public class ProcessEngineInfoController {

    @Autowired
    ManagementService managementService;

    @RequestMapping("")
    public ModelAndView info() {
        ModelAndView mav = new ModelAndView("management/engine-info");
        Map<String,String> engineProperties = managementService.getProperties();
        mav.addObject("engineProperties", engineProperties);

        Map<String,String> systemProperties = new HashMap<String, String>();
        Properties systemProperties11 = System.getProperties();
        Set<Object> objects = systemProperties11.keySet();
        for (Object object : objects) {
            systemProperties.put(object.toString(), systemProperties11.get(object.toString()).toString());
        }
        mav.addObject("systemProperties", systemProperties);
        return mav;
    }

}
