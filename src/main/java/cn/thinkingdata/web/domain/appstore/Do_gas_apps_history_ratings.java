package cn.thinkingdata.web.domain.appstore;

import org.springframework.stereotype.Repository;

@Repository
public class Do_gas_apps_history_ratings {
	private Integer id;
	private Integer project_id;
	private String app_id;
	private Integer device_type;
	private Integer type_type;
	private Integer list_type;
	private Integer rank;
	private String data_date;
	private Long work_time;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public String getApp_id() {
		return app_id;
	}
	public void setApp_id(String app_id) {
		this.app_id = app_id;
	}
	public Integer getDevice_type() {
		return device_type;
	}
	public void setDevice_type(Integer device_type) {
		this.device_type = device_type;
	}
	public Integer getType_type() {
		return type_type;
	}
	public void setType_type(Integer type_type) {
		this.type_type = type_type;
	}
	public Integer getList_type() {
		return list_type;
	}
	public void setList_type(Integer list_type) {
		this.list_type = list_type;
	}
	public Integer getRank() {
		return rank;
	}
	public void setRank(Integer rank) {
		this.rank = rank;
	}
	public String getData_date() {
		return data_date;
	}
	public void setData_date(String data_date) {
		this.data_date = data_date;
	}
	public Long getWork_time() {
		return work_time;
	}
	public void setWork_time(Long work_time) {
		this.work_time = work_time;
	}
	
}
