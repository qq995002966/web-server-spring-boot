package cn.thinkingdata.web.domain.industry;

import org.springframework.stereotype.Repository;

@Repository
public class Do_industry_appstore_type_distri {
	private String data_date;
	private Integer device_type;
	private Integer list_type;
	private Integer app_type;
	private Integer app_num;
	private Float avg_rating;
	public String getData_date() {
		return data_date;
	}
	public void setData_date(String data_date) {
		this.data_date = data_date;
	}
	public Integer getDevice_type() {
		return device_type;
	}
	public void setDevice_type(Integer device_type) {
		this.device_type = device_type;
	}
	public Integer getList_type() {
		return list_type;
	}
	public void setList_type(Integer list_type) {
		this.list_type = list_type;
	}
	public Integer getApp_type() {
		return app_type;
	}
	public void setApp_type(Integer app_type) {
		this.app_type = app_type;
	}
	public Integer getApp_num() {
		return app_num;
	}
	public void setApp_num(Integer app_num) {
		this.app_num = app_num;
	}
	public Float getAvg_rating() {
		return avg_rating;
	}
	public void setAvg_rating(Float avg_rating) {
		this.avg_rating = avg_rating;
	}
	
}
