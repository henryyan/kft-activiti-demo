package com.wsria.demo.activiti.web.oa.leave;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.runtime.ProcessInstance;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.runchain.arch.util.orm.PropertyFilterUtils;
import com.runchain.arch.web.base.JqGridCrudActionSupportWithWorkflow;
import com.wsria.demo.activiti.entity.oa.leave.Leave;
import com.wsria.demo.activiti.service.oa.leave.LeaveManager;
import com.wsria.demo.activiti.util.account.UserUtil;

/**
 * 请假Action 
 * 
 * @author HenryYan
 *
 */
public class LeaveAction extends JqGridCrudActionSupportWithWorkflow<Leave, Long> {

	private static final long serialVersionUID = 1L;

	@Autowired
	LeaveManager leaveManager;

	@Override
	public Leave getModel() {
		return entity;
	}

	@Override
	public Page<Leave> getPage() {
		return page;
	}

	@Override
	public String save() {
		try {
			leaveManager.saveEntity(entity);
			Map<String, Object> responses = new HashMap<String, Object>();
			responses.put("id", entity.getId());
			responses.put("success", true);
			Struts2Utils.renderJson(responses);
		} catch (Exception e) {
			logger.error("保存单个请假", e);
		}
		return null;
	}

	@Override
	public String delete() {
		try {
			leaveManager.deleteEntity(id);
		} catch (Exception e) {
			logger.error("删除单个请假", e);
		}
		return null;
	}

	@Override
	public String list() {
		try {

			List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
			PropertyFilterUtils.handleFilter(page, Leave.class, filters);
			page = leaveManager.searchProperty(page, filters);
			List<Leave> result = page.getResult();
			for (Leave leave : result) {
				List<ProcessInstance> processes = runtimeService.createProcessInstanceQuery()
						.processInstanceBusinessKey(leave.getId().toString()).list();
				if (!CollectionUtils.isEmpty(processes)) {
					ProcessInstance processInstance = processes.get(0);
					String processInstanceId = processInstance.getProcessInstanceId();
					leave.setProcessInstanceId(processInstanceId);
				}
			}
		} catch (Exception e) {
			logger.error("请假列表 ", e);
		}
		return JSON;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id != null) {
			// 获取单个请假
			entity = leaveManager.getEntity(id);
		} else {
			entity = new Leave();
			entity.setUserId(UserUtil.getCurrentUserId());
			entity.setUserName(UserUtil.getCurrentUserName());
			entity.setApplyTime(new Date());
		}
	}

	/**
	 * 启动流程
	 * @return
	 */
	public String start() {
		try {
			runtimeService.startProcessInstanceByKey("leave", id.toString());
			Struts2Utils.renderText(SUCCESS);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
