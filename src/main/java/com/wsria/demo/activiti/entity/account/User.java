package com.wsria.demo.activiti.entity.account;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.GenericGenerator;
import org.springside.modules.utils.reflection.ConvertUtils;

import com.google.common.collect.Lists;

/**
 * 用户.
 * 
 * @author HenryYan
 */
@Entity
//表名与类名不相同时重新定义表名.
@Table(name = "ACCT_USER")
//默认的缓存策略.
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@JsonIgnoreProperties(value = { "userList", "roleList" })
public class User implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "theUserGenerator")
	@GenericGenerator(name = "theUserGenerator", strategy = "assigned")
	private String id;//手动设置Id

	private String password;//为简化演示使用明文保存的密码
	private String name;
	private String email;
	private String active;
	private String orgName;
	private String theme;
	private List<Role> roleList = Lists.newArrayList();//有序的关联对象集合
	private Organization org;

	// 临时属性
	private String roleNameForFind; // 前台查询使用的

	@Id
	//@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ACCT_ROLE_ID_GENERATOR")
	//@SequenceGenerator(name = "ACCT_ROLE_ID_GENERATOR", sequenceName = "SEQ_USER_AUTHORITY")
	public String getId() {
		return this.id;
	}

	/**
	 * 覆盖父类方法，手动设置ID
	 */
	@Column(name = "ID")
	public void setId(String id) {
		this.id = id;
	}

	@ManyToOne
	@JoinTable(name = "acct_organization_user", joinColumns = { @JoinColumn(name = "USER_ID") }, inverseJoinColumns = { @JoinColumn(name = "ORG_ID") })
	public Organization getOrg() {
		return org;
	}

	public void setOrg(Organization org) {
		this.org = org;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	//多对多定义
	@ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.REFRESH)
	//中间表定义,表名采用默认命名规则
	@JoinTable(name = "ACCT_USER_ROLE", joinColumns = { @JoinColumn(name = "USER_ID") }, inverseJoinColumns = { @JoinColumn(name = "ROLE_ID") })
	//Fecth策略定义
	@Fetch(FetchMode.SUBSELECT)
	//集合按id排序.
	@OrderBy("priority")
	public List<Role> getRoleList() {
		return roleList;
	}

	public void setRoleList(List<Role> roleList) {
		this.roleList = roleList;
	}

	@Column(name = "ACTIVE")
	public String getActive() {
		return active;
	}

	public void setActive(String active) {
		this.active = active;
	}

	@Column(name = "ORG_NAME")
	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	@Column
	public String getTheme() {
		return theme;
	}

	public void setTheme(String theme) {
		this.theme = theme;
	}

	/**
	 * 用户拥有的角色名称字符串, 多个角色名称用','分隔.
	 */
	//非持久化属性.
	@Transient
	public String getRoleNames() {
		return ConvertUtils.convertElementPropertyToString(roleList, "name", ", ");
	}

	/**
	 * 用户拥有的角色id字符串, 多个角色id用','分隔.
	 */
	//非持久化属性.
	@Transient
	@SuppressWarnings("unchecked")
	public List<Long> getRoleIds() {
		return ConvertUtils.convertElementPropertyToList(roleList, "id");
	}

	/**
	 * 获取用户主要角色，最大的角色
	 * @return
	 */
	@Transient
	public String getMajorRoleName() {
		if (CollectionUtils.isNotEmpty(roleList)) {
			return roleList.get(0).getName();
		}
		return StringUtils.EMPTY;
	}

	/**
	 * 获取用户主要角色，最大的角色
	 * @return
	 */
	@Transient
	public String getMajorRoleNames() {
		String names = "";
		if (CollectionUtils.isNotEmpty(roleList)) {
			for (Role name : roleList) {
				if (names.equals("")) {
					names = name.getName();
				} else {
					names += "," + name.getName();
				}
			}
			return names;
		}
		return StringUtils.EMPTY;
	}

	@Transient
	public String getRoleNameForFind() {
		return roleNameForFind;
	}

	public void setRoleNameForFind(String roleNameForFind) {
		this.roleNameForFind = roleNameForFind;
	}

	public boolean equals(User obj) {
		return (this.getId().equals(obj.getId()) && this.getName().equals(obj.getName())
				&& this.getActive().equals(obj.getActive()) && this.getOrg().getId().equals(obj.getOrg().getId()));
	}

	@Override
	public String toString() {
		return "user=" + id + "-" + name;
	}

}