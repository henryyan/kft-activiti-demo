package com.wsria.demo.activiti.entity.account;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.runchain.arch.util.orm.SeqIdEntity;

/**
 * 角色.
 * 
 * 注释见{@link User}.
 * 
 * @author calvin
 */
@Entity
@Table(name = "ACCT_ROLE")
@JsonIgnoreProperties(value = { "userList" })
public class Role extends SeqIdEntity implements Serializable {

	private static final long serialVersionUID = 1L;
	private String name;
	private String priority;

	public Role() {

	}

	public Role(Long id, String name) {
		this.id = id;
		this.name = name;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ACCT_ROLE_ID_GENERATOR")
	@SequenceGenerator(name = "ACCT_ROLE_ID_GENERATOR", sequenceName = "SEQ_USER_AUTHORITY")
	public Long getId() {
		return this.id;
	}

	@Column(nullable = false, unique = true)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPriority() {
		return priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	@Override
	public String toString() {
		return "role-" + name;
	}
}
