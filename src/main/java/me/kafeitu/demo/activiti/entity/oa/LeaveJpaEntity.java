package me.kafeitu.demo.activiti.entity.oa;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.apache.commons.lang3.builder.ToStringBuilder;

/**
 * 请假的JPA映射实体
 *
 * @author: Henry Yan
 */
@Entity(name = "LEAVE_JPA")
public class LeaveJpaEntity implements Serializable {

    private Long id;
    private String processInstanceId;
    private String userId;
    private Date startTime;
    private Date endTime;
    private Date realityStartTime;
    private Date realityEndTime;
    private Date reportBackDate;
    private Date applyTime;
    private String leaveType;
    private String reason;

    /**
     * 部门领导是否同意
     */
    private String deptLeaderApproved;

    /**
     * HR是否同意
     */
    private String hrApproved;

    @Id
    @Column(name="ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "APPLY_TIME")
    public Date getApplyTime() {
        return applyTime;
    }

    public void setApplyTime(Date applyTime) {
        this.applyTime = applyTime;
    }

    @Column(name = "END_TIME")
    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    @Column(name = "LEAVE_TYPE")
    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    @Column(name = "PROCESS_INSTANCE_ID")
    public String getProcessInstanceId() {
        return processInstanceId;
    }

    public void setProcessInstanceId(String processInstanceId) {
        this.processInstanceId = processInstanceId;
    }

    @Column(name = "REALITY_END_TIME")
    public Date getRealityEndTime() {
        return realityEndTime;
    }

    public void setRealityEndTime(Date realityEndTime) {
        this.realityEndTime = realityEndTime;
    }

    @Column(name = "REALITY_START_TIME")
    public Date getRealityStartTime() {
        return realityStartTime;
    }

    public void setRealityStartTime(Date realityStartTime) {
        this.realityStartTime = realityStartTime;
    }

    @Column(name = "REASON")
    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    @Column(name = "START_TIME")
    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    @Column(name = "USER_ID")
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Column(name = "REPORT_BACK_DATE")
    public Date getReportBackDate() {
        return reportBackDate;
    }

    public void setReportBackDate(Date reportBackDate) {
        this.reportBackDate = reportBackDate;
    }

    @Column
    public String getDeptLeaderApproved() {
        return deptLeaderApproved;
    }

    public void setDeptLeaderApproved(String deptLeaderApproved) {
        this.deptLeaderApproved = deptLeaderApproved;
    }

    @Column
    public String getHrApproved() {
        return hrApproved;
    }

    public void setHrApproved(String hrApproved) {
        this.hrApproved = hrApproved;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
