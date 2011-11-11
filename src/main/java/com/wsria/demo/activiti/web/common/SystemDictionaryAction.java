package com.wsria.demo.activiti.web.common;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.runchain.arch.util.orm.PropertyFilterUtils;
import com.runchain.arch.util.string.HtmlUtil;
import com.runchain.arch.web.base.JqGridCrudActionSupport;
import com.wsria.demo.activiti.entity.common.SystemDictionary;
import com.wsria.demo.activiti.service.common.SystemDictionaryList;
import com.wsria.demo.activiti.service.common.SystemDictionaryManager;
import com.wsria.demo.activiti.util.common.SystemDictionaryUtil;

/**
 * 数据字典管理 Action
 * 
 * @author HenryYan
 * 
 */
public class SystemDictionaryAction extends JqGridCrudActionSupport<SystemDictionary, Long> {
	private static final long serialVersionUID = 1L;

	@Autowired protected SystemDictionaryManager manager;
	@Autowired protected SystemDictionaryList dataList;

	// -- ModelDriven 与 Preparable函数 --//

	public SystemDictionary getModel() {
		return entity;
	}

	@Override
	protected void prepareModel() {
		if (id != null) {
			// 获取单个数据字典
			entity = manager.getEntity(id);
		} else {
			entity = new SystemDictionary();
		}
	}

	// -- CRUD Action 函数 --//
	@Override
	public String save() {
		try {
			manager.saveEntity(entity);
		} catch (Exception e) {
			logger.error("保存单个数据字典", e);
		}
		return null;
	}

	@Override
	public String delete() {
		try {
			manager.deleteEntity(id);
		} catch (Exception e) {
			logger.error("删除单个数据字典", e);
		}
		return null;
	}

	@Override
	public String list() {
		try {
			List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
			PropertyFilterUtils.handleFilter(page, SystemDictionary.class, filters);

			page = manager.searchProperty(page, filters);
		} catch (Exception e) {
			logger.error("数据字典列表 ", e);
		}
		return JSON;
	}

	// 用途名称验证 唯一性
	public String validateDictCode() {
		String newId = Struts2Utils.getParameter("newId");
		String librarycode = Struts2Utils.getParameter("dictCode");
		if (manager.existLibrarycode(newId, librarycode)) {
			Struts2Utils.renderText("false");
		} else {
			Struts2Utils.renderText("true");
		}

		return null;
	}

	/**
	 * 根据类型查询数据字典
	 * @return
	 */
	public String findTypes() {
		String type = Struts2Utils.getParameter("type");
		if (StringUtils.isNotEmpty(type)) {
			List<SystemDictionary> dataLibraryList = SystemDictionaryUtil.getTypeGroupDataLibraryList(type);
			Struts2Utils.renderJson(dataLibraryList);
		}
		return null;
	}

	/**
	 * 根据类型查询数据字典
	 * 生成html的select代码
	 */
	public String findTypeForSelect() {
		String type = Struts2Utils.getParameter("type");
		boolean withTip = Boolean.valueOf(Struts2Utils.getParameter("withTip"));
		if (StringUtils.isNotEmpty(type)) {
			List<SystemDictionary> dataLibraryList = SystemDictionaryUtil.getTypeGroupDataLibraryList(type);
			if (dataLibraryList != null && !dataLibraryList.isEmpty()) {
				Map<String, String> parseToJson = SystemDictionaryUtil.parseToJson(dataLibraryList);
				String select = HtmlUtil.generateSelect(parseToJson, withTip);
				Struts2Utils.renderText(select);
			}
			Struts2Utils.renderText("");
		}
		return null;
	}
	
	/**
	 * 重载数据字典
	 * @return
	 */
	public String reload() {
		try {
			dataList.reload();
			logger.info("重载数据字典成功！");
			Struts2Utils.renderText(SUCCESS);
		} catch (Exception e) {
			logger.error("重载数据字典出错！", e);
			Struts2Utils.renderText("重载失败！");
		}
		return null;
	}

	// -- 页面属性访问函数 --//

	/**
	 * list页面显示列表.
	 */
	public Page<SystemDictionary> getPage() {
		return page;
	}

}
