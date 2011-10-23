package com.wsria.demo.activiti.entity.common;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.runchain.arch.util.orm.SeqIdEntity;

/**
 * 实体：数据字典
 *
 * @author HenryYan
 *
 */
@Entity
@Table(name = "SYSTEM_DICTIONARY")
public class SystemDictionary extends SeqIdEntity implements Serializable {
	private static final long serialVersionUID = 1L;
	private String dictCode;
	private String dictName;
	private String dictType;
	private String dictValue;
	private Boolean enabled;
	private String remark;
	private Integer sortNumber;

	public SystemDictionary() {
	}

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SYSTEM_DICTIONARY_ID_GENERATOR")
	@SequenceGenerator(name = "SYSTEM_DICTIONARY_ID_GENERATOR", sequenceName = "SEQ_SYSTEM_COMMON")
	public Long getId() {
		return this.id;
	}

	@Column(name = "DICT_CODE")
	public String getDictCode() {
		return this.dictCode;
	}

	public void setDictCode(String dictCode) {
		this.dictCode = dictCode;
	}

	@Column(name = "DICT_NAME")
	public String getDictName() {
		return this.dictName;
	}

	public void setDictName(String dictName) {
		this.dictName = dictName;
	}

	@Column(name = "DICT_TYPE")
	public String getDictType() {
		return this.dictType;
	}

	public void setDictType(String dictType) {
		this.dictType = dictType;
	}

	@Column(name = "DICT_VALUE")
	public String getDictValue() {
		return this.dictValue;
	}

	public void setDictValue(String dictValue) {
		this.dictValue = dictValue;
	}

	public Boolean getEnabled() {
		return this.enabled;
	}

	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}

	@Column(name = "REMARK")
	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@Column(name = "SORT_NUMBER")
	public Integer getSortNumber() {
		return this.sortNumber;
	}

	public void setSortNumber(Integer sortNumber) {
		this.sortNumber = sortNumber;
	}

}