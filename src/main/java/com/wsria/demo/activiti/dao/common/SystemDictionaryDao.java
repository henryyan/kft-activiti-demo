package com.wsria.demo.activiti.dao.common;

import org.springframework.stereotype.Component;

import com.runchain.arch.orm.dao.BaseHibernateDao;
import com.wsria.demo.activiti.entity.common.SystemDictionary;

/**
 * 数据字典 对象泛型Dao
 * 
 * @author HenryYan
 * 
 */
@Component
public class SystemDictionaryDao extends BaseHibernateDao<SystemDictionary, Long> {

}
