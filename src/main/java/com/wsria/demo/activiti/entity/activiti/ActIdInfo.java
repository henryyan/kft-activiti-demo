package com.wsria.demo.activiti.entity.activiti;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

/**
 * The persistent class for the ACT_ID_INFO database table.
 * 
 */
@Entity
@Table(name = "ACT_ID_INFO")
public class ActIdInfo implements Serializable {
	private static final long serialVersionUID = 1L;
	private String id;
	private String key;
	private String parentId;
	private String password;
	private Float rev;
	private String type;
	private String userId;
	private String value;

	public ActIdInfo() {
	}

	@Id
	@Column(name = "ID_")
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "KEY_")
	public String getKey() {
		return this.key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	@Column(name = "PARENT_ID_")
	public String getParentId() {
		return this.parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	@Lob()
	@Column(name = "PASSWORD_")
	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Column(name = "REV_")
	public Float getRev() {
		return this.rev;
	}

	public void setRev(Float rev) {
		this.rev = rev;
	}

	@Column(name = "TYPE_")
	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Column(name = "USER_ID_")
	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@Column(name = "VALUE_")
	public String getValue() {
		return this.value;
	}

	public void setValue(String value) {
		this.value = value;
	}

}