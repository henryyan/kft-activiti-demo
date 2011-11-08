package com.wsria.demo.activiti.entity.activiti;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;

/**
 * The persistent class for the ACT_ID_USER database table.
 * 
 */
@Entity
@Table(name = "ACT_ID_USER")
public class ActIdUser implements Serializable {
	private static final long serialVersionUID = 1L;
	private String id;
	private String email;
	private String first;
	private String last;
	private Long pictureId;
	private String pwd;
	private Float rev;
	private List<ActIdGroup> actIdGroups;

	public ActIdUser() {
	}

	@Id
	@Column(name = "ID_")
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "EMAIL_")
	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Column(name = "FIRST_")
	public String getFirst() {
		return this.first;
	}

	public void setFirst(String first) {
		this.first = first;
	}

	@Column(name = "LAST_")
	public String getLast() {
		return this.last;
	}

	public void setLast(String last) {
		this.last = last;
	}

	@Column(name = "PICTURE_ID_")
	public Long getPictureId() {
		return this.pictureId;
	}

	public void setPictureId(Long pictureId) {
		this.pictureId = pictureId;
	}

	@Column(name = "PWD_")
	public String getPwd() {
		return this.pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	@Column(name = "REV_")
	public Float getRev() {
		return this.rev;
	}

	public void setRev(Float rev) {
		this.rev = rev;
	}

	//bi-directional many-to-many association to ActIdGroup
	@ManyToMany
	@JoinTable(name = "ACT_ID_MEMBERSHIP", joinColumns = { @JoinColumn(name = "USER_ID_") }, inverseJoinColumns = { @JoinColumn(name = "GROUP_ID_") })
	public List<ActIdGroup> getActIdGroups() {
		return this.actIdGroups;
	}

	public void setActIdGroups(List<ActIdGroup> actIdGroups) {
		this.actIdGroups = actIdGroups;
	}

}