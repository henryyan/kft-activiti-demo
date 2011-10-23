package com.wsria.demo.activiti.service.common;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wsria.demo.activiti.entity.common.SystemDictionary;
import com.wsria.demo.activiti.util.common.SystemDictionaryUtil;

/**
 * 数据字典初始化类
 * 
 * @author HenryYan
 * 
 */
@Service
public class SystemDictionaryList {

	@Autowired
	private SystemDictionaryManager dictManager;

	private SystemDictionaryList() {

	}

	/**
	 * 数据字典初始化：将数据写入缓存
	 */
	public void init() {
		List<SystemDictionary> dataLibraryList = dictManager.getAllSystemDictionarys();
		for (int i = 0; i < dataLibraryList.size(); i++) {
			SystemDictionary datalibrary = dataLibraryList.get(i);
			String key = datalibrary.getDictCode();
			
			/*
			 * 所有的数组字典
			 */
			SystemDictionaryUtil.getDataLibraryList().put(key, datalibrary);
			
			/*
			 * 根据library类型分组添加到Map中
			 */
			SystemDictionaryUtil.addToTypeMap(datalibrary);
		}
	}

	/**
	 * 重载数据字典
	 */
	public void reload() {
		SystemDictionaryUtil.clearDatas();
		init();
	}
	
}
