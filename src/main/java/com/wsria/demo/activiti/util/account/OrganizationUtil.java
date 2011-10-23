package com.wsria.demo.activiti.util.account;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.wsria.demo.activiti.entity.account.Organization;
import com.wsria.demo.activiti.entity.account.User;
import com.wsria.demo.activiti.service.account.DeptManager;

/**
 * 部门组织工具类
 *
 * @author HenryYan
 *
 */
public class OrganizationUtil {

	private static Logger logger = LoggerFactory.getLogger(OrganizationUtil.class);

	/**
	 * 顶级单位ID
	 */
	public static final Long SUPER_UNIT_ID = 3l;

	/**
	 * 用户和部门关系
	 */
	public static Map<Long, Organization> USER_AND_DEPT_RELATIONS = new LinkedHashMap<Long, Organization>();

	/**
	 * 部门和下属用户
	 */
	public static Map<Long, List<User>> DEPT_AND_USERS = new LinkedHashMap<Long, List<User>>();

	/**
	 * 部门和下属部门
	 */
	public static Map<Long, List<Organization>> CHILD_AND_PARENT_DEPTS = new LinkedHashMap<Long, List<Organization>>();

	/**
	 * 部门ID和名称
	 */
	private static Map<Long, String> DEPT_ID_AND_NAMES = new HashMap<Long, String>();

	/**
	 * 部门ID和部门简称
	 */
	private static Map<Long, String> DEPT_ID_AND_SHORT_NAMES = new HashMap<Long, String>();

	/**
	 * 设置部门ID和名称
	 * @param orgs	部门列表
	 */
	public static void setDeptIdAndNames(List<Organization> orgs) {
		if (orgs == null || orgs.isEmpty()) {
			logger.debug("设置部门ID和名称，参数没有数据");
			return;
		}
		logger.debug("设置部门ID和名称，共设置{}个部门信息", orgs.size());
		for (Organization org : orgs) {
			DEPT_ID_AND_NAMES.put(org.getId(), org.getName());
			if (StringUtils.isNotBlank(org.getShortName())) {
				DEPT_ID_AND_SHORT_NAMES.put(org.getId(), org.getShortName());
			}
		}
	}

	/**
	 * 根据ID快速获取对应的部门名称
	 * @param deptId	部门ID
	 * @return	没有返回null
	 */
	public static String getDeptName(Long deptId) {
		return DEPT_ID_AND_NAMES.get(deptId);
	}

	/**
	 * 根据ID快速获取对应的部门简称
	 * @param deptId	部门ID
	 * @return	没有返回null
	 */
	public static String getDeptShortName(Long deptId) {
		return DEPT_ID_AND_SHORT_NAMES.get(deptId);
	}

	/**
	 * 获取下属部门的ID
	 * @param deptId	部门ID
	 * @return
	 */
	public static List<Long> getSubDeptIds(Long deptId) {
		List<Organization> subOrgs = OrganizationUtil.CHILD_AND_PARENT_DEPTS.get(deptId);
		return extractDeptIds(subOrgs);
	}

	/**
	 * 获取部门名称
	 * @param deptId	部门ID
	 * @return	如果有简称返回简称，否则返回全名，没有返回null
	 */
	public static String getDeptShortOrFullName(Long deptId) {
		String deptShortName = getDeptShortName(deptId);
		if (StringUtils.isBlank(deptShortName)) {
			return getDeptName(deptId);
		} else {
			return deptShortName;
		}
	}

	/**
	 * 根据部门ID抽取部分键值对
	 * @param deptIds	部门ID
	 * @return
	 */
	public static Map<Long, String> extractPartDeptIdAndNames(List<Long> deptIds) {
		Map<Long, String> orgs = new LinkedHashMap<Long, String>();
		for (Long groupId : deptIds) {
			orgs.put(groupId, OrganizationUtil.getDeptName(groupId));
		}
		return orgs;
	}

	/**
	 * 根据部门ID查询部门名称
	 * @param deptIds	部门ID
	 * @param fullName	是否使用全名
	 * @return
	 */
	public static List<String> extractDeptNames(List<Long> deptIds, boolean fullName) {
		List<String> orgNames = new ArrayList<String>(deptIds.size());
		for (Long deptId : deptIds) {
			if (fullName) {
				orgNames.add(OrganizationUtil.getDeptName(deptId));
			} else {
				orgNames.add(OrganizationUtil.getDeptShortOrFullName(deptId));
			}
		}
		return orgNames;
	}

	/**
	 * 抽取部门ID
	 * @param orgs	部门集合
	 * @return	部门ID集合
	 */
	public static List<Long> extractDeptIds(List<Organization> orgs) {
		List<Long> childDeptIds = new ArrayList<Long>();
		for (Organization org : orgs) {
			childDeptIds.add(org.getId());
		}
		return childDeptIds;
	}

	/**
	 * 获取部门ID
	 * @param org	部门对象
	 * @return	如果上级不是顶级单位ID{@link OrganizationUtil.SUPER_UNIT_ID}返回parentId，否则返回当前部门ID
	 */
	public static Long getDeptId(Organization org) {
		Long deptId;
		if (!org.getParentId().equals(OrganizationUtil.SUPER_UNIT_ID)) {
			deptId = org.getParentId();
		} else {
			deptId = org.getId();
		}
		return deptId;
	}

	/**
	 * 转换集合为Map对象
	 * @param orgs	部门集合
	 * @return	Map<部门ID, 部门>
	 */
	public static Map<Long, Organization> extractToMap(Collection<Organization> orgs) {
		Map<Long, Organization> orgMapper = new LinkedHashMap<Long, Organization>();
		for (Organization org : orgs) {
			orgMapper.put(org.getId(), org);
		}
		return orgMapper;
	}

	/**
	 * 为部门集合排序
	 * @param orgs	部门集合
	 */
	public static void sort(List<Organization> orgs) {
		Collections.sort(orgs, new Comparator<Organization>() {

			@Override
			public int compare(Organization org1, Organization org2) {
				if (StringUtils.isBlank(org1.getSequence()) || StringUtils.isBlank(org2.getSequence())) {
					return 0;
				}
				int sequence1 = Integer.parseInt(org1.getSequence());
				int sequence2 = Integer.parseInt(org2.getSequence());
				if (sequence1 == sequence2) {
					return 0;
				} else if (sequence1 > sequence2) {
					return 1;
				} else {
					return -1;
				}
			}

		});
	}
	
	/**
	 * 根据一个部门对象判断是否有小组
	 * @param org	部门
	 * @return	true|false
	 */
	public static boolean hasGroups(Organization org) {
		Long groupId = org.getId();
		Long deptId = OrganizationUtil.getDeptId(org);
		return !groupId.equals(deptId);
	}
	
	/**
	 * 获取层级部门名称
	 * @param org
	 * @return	如果上级部门ID为{@link OrganizationUtil.SUPER_UNIT_ID}则直接返回部门名称<br/>
	 * 			如果上级部门ID为{@link OrganizationUtil.SUPER_UNIT_ID}则返回：部门名称/小组名称
	 */
	public static String getLevelableDeptName(Organization org, DeptManager deptManager) {
		String orgName = "";
		if (org.getId().equals(OrganizationUtil.SUPER_UNIT_ID)) {
			orgName = org.getShortOrFullName();
		} else {
			if (org.getParentId() != null) {
				Organization superOrg = deptManager.findByDeptId(org.getParentId());
				if (superOrg != null) {
					orgName = superOrg.getShortOrFullName();
				}
			}
			if (StringUtils.isNotBlank(orgName)) {
				orgName += "/";
			}
			orgName += org.getShortOrFullName();
		}
		return orgName;
	}

}
