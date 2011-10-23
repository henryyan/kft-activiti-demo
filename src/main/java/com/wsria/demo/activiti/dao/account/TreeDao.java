package com.wsria.demo.activiti.dao.account;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.runchain.arch.util.number.LongUtils;

/**
 * 周、月报通用DAO，直接使用JDBC完成数据库交互
 * 
 * 约定：限制数据库表名按照固定规则命名，例如：C919_MONTHLY_TASK_OF_DEPTS[大客月报部门任务]
 *
 * @author HenryYan
 *
 */
@Repository
public class TreeDao extends JdbcTemplate {

	@Autowired
	public TreeDao(DataSource dataSource) {
		super(dataSource);
	}

	/**
	 * 获取部门直属用户
	 * @param parentDeptId	上级部门ID
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getAllDirectManageUser(Long parentDeptId) throws Exception {
		String sql = "select t1.* from acct_user t1,acct_organization_user t2 where t2.user_id=t1.id and t2.org_id="
				+ parentDeptId;
		List<Map<String, Object>> list = super.queryForList(sql);
		return list;
	}

	/**
	 * 统计部门下属用户数量
	 * @param parentDeptId	上级部门ID
	 * @return
	 * @throws Exception
	 */
	public long countAcctUser(Long parentDeptId) throws Exception {
		String sql = "select count(*) from acct_user t1,acct_organization_user t2 where t2.user_id=t1.id and t2.org_id="
				+ parentDeptId;
		long userCounter = super.queryForLong(sql);
		return userCounter;
	}

	/**
	 * 查询出指定部门及其下属部门的所有用户ID
	 * @param parentDeptId	部门ID
	 * @return
	 */
	public List<String> getAllUserIds(Long... parentDeptId) {
		String arrayToString = LongUtils.convertArrayToString(parentDeptId);
		String sql = "SELECT t.user_id FROM acct_organization_user t left join acct_organization o on t.org_id = o.id"
				+ " WHERE t.org_id IN"
				+ " (SELECT id FROM acct_organization o START WITH id in(" + arrayToString + ") CONNECT BY PRIOR id = parent_id)"
				+ " order by o.sequence";
		List<Map<String, Object>> queryForList = super.queryForList(sql);
		List<String> userIds = new ArrayList<String>();
		for (Map<String, Object> map : queryForList) {
			userIds.add(map.get("user_id").toString());
		}
		return userIds;
	}
	
	/**
	 * 查询出指定部门及其下属部门的所有用户ID
	 * @param parentDeptId	部门ID
	 * @return
	 */
	public List<String> getAllUserNames(Long... parentDeptId) {
		String arrayToString = LongUtils.convertArrayToString(parentDeptId);
		String sql = "SELECT u.name FROM acct_user u WHERE u.id in(" +
				"SELECT t.user_id FROM acct_organization_user t left join acct_organization o on t.org_id = o.id"
				+ " WHERE t.org_id IN"
				+ " (SELECT id FROM acct_organization o START WITH id in(" + arrayToString + ") CONNECT BY PRIOR id = parent_id))";
		List<Map<String, Object>> queryForList = super.queryForList(sql);
		List<String> userIds = new ArrayList<String>();
		for (Map<String, Object> map : queryForList) {
			userIds.add(map.get("name").toString());
		}
		return userIds;
	}

	public void deleteAuthority(Long roleId) throws Exception {
		String sql = "delete from acct_role_authority where role_id=" + roleId;
		super.execute(sql);
	}

	public void insertAuthority(Long roleId, Long authorityId) throws Exception {
		String sql = "insert into acct_role_authority (role_id,authority_id) values(" + roleId + "," + authorityId
				+ ")";
		super.execute(sql);
	}

}
