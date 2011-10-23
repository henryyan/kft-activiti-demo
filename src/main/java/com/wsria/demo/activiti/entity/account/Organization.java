package com.wsria.demo.activiti.entity.account;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang.StringUtils;
import org.hibernate.annotations.GenericGenerator;

import com.runchain.arch.util.orm.SeqIdEntity;

/**
 * The persistent class for the ACCT_ORGANIZATION database table.
 * 
 */
@Entity
@Table(name = "ACCT_ORGANIZATION")
public class Organization extends SeqIdEntity implements Serializable {
	private static final long serialVersionUID = 1L;
	@Id
    @GeneratedValue(generator = "theOrgGenerator")    
    @GenericGenerator(name = "theOrgGenerator", strategy = "assigned")  
	private Long id;//手动设置Id
	private String isExpanded;
	private String name;
	private Long parentId;
	private String type;
	private String shortName;
	private String sequence;
//	private List<User> userLists = new ArrayList<User>();

	public Organization() {
	}

	@Id
	//@SequenceGenerator(name = "ACCT_ROLE_ID_GENERATOR", sequenceName = "SEQ_USER_AUTHORITY")
	//@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ACCT_ROLE_ID_GENERATOR")
	public Long getId() {
		return this.id;
	}
	
	/**
	 * 覆盖父类方法，手动设置ID
	 */
	@Column(name = "ID")
	public void setId(Long id) {
		this.id = id;
	}
	
	@Column(name = "IS_EXPANDED")
	public String getIsExpanded() {
		return this.isExpanded;
	}

	public void setIsExpanded(String isExpanded) {
		this.isExpanded = isExpanded;
	}

	@Column(name = "NAME")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "PARENT_ID")
	public Long getParentId() {
		return this.parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	@Column(name = "TYPE")
	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}
	

	//@ManyToMany
	//@JoinTable(name = "acct_organization_user", joinColumns = { @JoinColumn(name = "ORG_ID") }, inverseJoinColumns = { @JoinColumn(name = "USER_ID") })
	//Fecth策略定义
	//@Fetch(FetchMode.SUBSELECT)
	//集合按id排序.
	//@OrderBy("id")
//	@OneToMany
//	@JoinTable(name = "acct_organization_user", joinColumns = { @JoinColumn(name = "ORG_ID") }, inverseJoinColumns = { @JoinColumn(name = "USER_ID") })
//	public List<User> getUserLists() {
//		return userLists;
//	}
//
//	public void setUserLists(List<User> userLists) {
//		this.userLists = userLists;
//	}

	@Column(name = "SEQUENCE")
	public String getSequence() {
		return sequence;
	}

	public void setSequence(String sequence) {
		this.sequence = sequence;
	}

	@Column
	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}
	
	@Transient
	public String getShortOrFullName() {
		return StringUtils.isBlank(shortName) ? name : shortName; 
	}
	
    public boolean equals(Organization obj) {
    	return (this.getId().equals(obj.getId())&&
    			this.getName().equals(obj.getName())
    			&&this.getParentId().equals(obj.getParentId())
    			&&this.getSequence().equals(obj.getSequence()));
    }

}