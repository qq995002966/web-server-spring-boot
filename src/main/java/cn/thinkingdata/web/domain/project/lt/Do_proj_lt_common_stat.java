package cn.thinkingdata.web.domain.project.lt;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_lt_common_stat {
	private String data_date;
	private Integer project_id;
	private Integer total_num;
	private Integer positive_num;
	private Integer negative_num;
	private Integer other_num;
		
	public String getData_date() {
		return data_date;
	}
	public void setData_date(String data_date) {
		this.data_date = data_date;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public Integer getTotal_num() {
		return total_num;
	}
	public void setTotal_num(Integer total_num) {
		this.total_num = total_num;
	}
	public Integer getPositive_num() {
		return positive_num;
	}
	public void setPositive_num(Integer positive_num) {
		this.positive_num = positive_num;
	}
	public Integer getNegative_num() {
		return negative_num;
	}
	public void setNegative_num(Integer negative_num) {
		this.negative_num = negative_num;
	}
	public Integer getOther_num() {
		return other_num;
	}
	public void setOther_num(Integer other_num) {
		this.other_num = other_num;
	}
	
	
}
