package com.wsria.demo.activiti.entity.activiti;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;

/**
 * The persistent class for the ACT_ID_GROUP database table.
 * 
 */
@Entity
@Table(name = "ACT_ID_GROUP")
public class ActIdGroup implements Serializable {
	private static final long serialVersionUID = 1L;
	private String id;
	private String name;
	private Float rev;
	private String type;
	private List<ActIdUser> actIdUsers;

	public ActIdGroup() {
	}

	@Id
	@Column(name = "ID_")
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "NAME_")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
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

	//bi-directional many-to-many association to ActIdUser
	@ManyToMany(mappedBy = "actIdGroups")
	public List<ActIdUser> getActIdUsers() {
		return this.actIdUsers;
	}

	public void setActIdUsers(List<ActIdUser> actIdUsers) {
		this.actIdUsers = actIdUsers;
	}

}