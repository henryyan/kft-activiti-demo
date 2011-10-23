package com.wsria.demo.activiti.service.common;

import java.io.Serializable;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.security.springsecurity.SpringSecurityUtils;

import com.runchain.arch.orm.dao.BaseHibernateDao;
import com.runchain.arch.service.base.BaseEntityManager;
import com.wsria.demo.activiti.dao.common.SystemDictionaryDao;
import com.wsria.demo.activiti.entity.common.SystemDictionary;
import com.wsria.demo.activiti.util.common.SystemDictionaryUtil;

/**
 * 
 * 数据字典管理类，包含添加，删除，修改，查询，条件查询
 * 
 * @author HenryYan
 * 
 */
@Service
@Transactional
public class SystemDictionaryManager extends BaseEntityManager<SystemDictionary, Long> implements Serializable {

	private static final long serialVersionUID = 1L;

	private static Logger logger = LoggerFactory.getLogger(SystemDictionaryManager.class);

	@Autowired
	private SystemDictionaryDao dictDao;

	/**
	 * @return 获取所有数据字典集合
	 */
	@Transactional(readOnly = true)
	public List<SystemDictionary> getAllSystemDictionarys() {
		return dictDao.findBy("enabled", true);
	}

	/**
	 * 添加数据字典
	 * 
	 * @param entity
	 */
	public void saveEntity(SystemDictionary entity) {
		dictDao.save(entity);
		SystemDictionaryUtil.addSystemDictionary(entity);
	}

	/**
	 * 删除标识为id值的数据字典
	 * 
	 * @param id
	 *            数据字典标识
	 */
	public void deleteEntity(Long id) {
		SystemDictionary datalibrary = dictDao.get(id);
		logger.info("id:{}数据字典被用户{}删除!", new Object[] { id, SpringSecurityUtils.getCurrentUserName() });
		dictDao.delete(id);
		SystemDictionaryUtil.deleteSystemDictionary(datalibrary.getDictCode());
	}

	/**
	 * 验证规则名称的唯一性， 存在返回false,不存在返回true
	 */
	public boolean existLibrarycode(String id, String dictCode) {
		SystemDictionary datalibrary = dictDao.findUniqueBy("dictCode", dictCode);
		// 添加时无id时，做唯一验证
		if (StringUtils.isEmpty(id) || "_empty".equals(id)) {
			if (datalibrary != null) {
				return true;
			} else {
				return false;
			}
		} else {
			// 修改时id已存在，做唯一验证
			if (datalibrary == null) {
				return false;
			} else {
				// 当对象存在时，判断原id与新id值是否一致
				Long newId = Long.valueOf(id);
				Long oldId = datalibrary.getId();
				if (oldId.equals(newId)) {
					return false;
				} else {
					return true;
				}
			}
		}
	}

	@Override
	public BaseHibernateDao<SystemDictionary, Long> getDao() {
		return dictDao;
	}

}
