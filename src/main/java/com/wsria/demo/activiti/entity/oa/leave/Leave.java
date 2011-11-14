package com.wsria.demo.activiti.entity.oa.leave;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import com.runchain.arch.util.orm.SeqIdEntity;

/**
 * 实体：请假 
 * @author HenryYan
 *
 */
@Entity(name = "OA_LEAVE")
public class Leave extends SeqIdEntity {

	private String userId;
	private String userName;
	private Date startTime;
	private Date endTime;
	private Date applyTime;
	private Float days;
	private String leaveType;
	private String reason;
	
	private String processInstanceId;

	@Override
	@Id
	@Column
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "LEAVE_ID_GENERATOR")
	@SequenceGenerator(name = "LEAVE_ID_GENERATOR", sequenceName = "SEQ_LEAVE")
	public Long getId() {
		return id;
	}

	@Column
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@Column
	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	@Column
	@Temporal(TemporalType.TIMESTAMP)
	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	@Column
	@Temporal(TemporalType.TIMESTAMP)
	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	@Column
	@Temporal(TemporalType.TIMESTAMP)
	public Date getApplyTime() {
		return applyTime;
	}

	public void setApplyTime(Date applyTime) {
		this.applyTime = applyTime;
	}

	@Column
	public Float getDays() {
		return days;
	}

	public void setDays(Float days) {
		this.days = days;
	}

	@Column
	public String getLeaveType() {
		return leaveType;
	}

	public void setLeaveType(String leaveType) {
		this.leaveType = leaveType;
	}

	@Column
	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	@Transient
	public String getProcessInstanceId() {
		return processInstanceId;
	}

	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}

}
