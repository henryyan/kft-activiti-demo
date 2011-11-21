package com.wsria.demo.activiti.entity.oa.leave;

import java.io.Serializable;
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

import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.runchain.arch.util.orm.SeqIdEntity;

/**
 * 实体：请假 
 * @author HenryYan
 *
 */
@Entity(name = "OA_LEAVE")
@JsonIgnoreProperties({"handler", "hibernateLazyInitializer", "processInstance"})
public class Leave extends SeqIdEntity implements Serializable {

	private static final long serialVersionUID = 1L;
	private String userId;
	private String userName;
	private Date startTime;
	private Date endTime;
	private Date applyTime;
	private Float days;
	private String leaveType;
	private String reason;

	private ProcessInstance processInstance;
	private String processInstanceId;
	private Task task;

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

	@Column
	public String getProcessInstanceId() {
		return processInstanceId;
	}

	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}

	@Transient
	public Task getTask() {
		return task;
	}

	public void setTask(Task task) {
		this.task = task;
	}

	@Transient
	public ProcessInstance getProcessInstance() {
		return processInstance;
	}

	public void setProcessInstance(ProcessInstance processInstance) {
		this.processInstance = processInstance;
	}

}
