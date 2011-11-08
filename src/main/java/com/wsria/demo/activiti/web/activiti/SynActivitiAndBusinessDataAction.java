package com.wsria.demo.activiti.web.activiti;

import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.runchain.arch.web.base.BaseActionSupport;
import com.wsria.demo.activiti.service.activiti.SynActivitiAndBusinessManager;

/**
 * 同步业务表的用户数据和流程表的用户数据
 * @author HenryYan
 *
 */
public class SynActivitiAndBusinessDataAction extends BaseActionSupport {

	private static final long serialVersionUID = 1L;

	@Autowired
	SynActivitiAndBusinessManager synManager;

	@Override
	public String execute() throws Exception {
		try {
			synManager.syn();
			Struts2Utils.renderText(SUCCESS);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
