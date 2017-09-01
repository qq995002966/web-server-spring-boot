package cn.thinkingdata.web.domain.user.center;

import org.springframework.stereotype.Repository;

@Repository
public class Do_user_center {
	private Integer id;
	private Integer user_id;
	private Integer project_id;
	private String project_name;
	private String email_addr;
	private String email_title;
	private Integer status;
	private String keywords;
	private String send_day_of_week;
	private String send_hour_of_day;
	private String last_send_time;
	private Integer keywords_cnt;
	private Integer ignore_empty;
	
	public Integer getKeywords_cnt() {
		return keywords_cnt;
	}
	public void setKeywords_cnt(Integer keywords_cnt) {
		this.keywords_cnt = keywords_cnt;
	}
	
	public Integer getIgnore_empty() {
		return ignore_empty;
	}
	
	public void setIgnore_empty(Integer ignore_empty) {
		this.ignore_empty = ignore_empty;
	}
	
	public String getLast_send_time() {
		return last_send_time;
	}
	public void setLast_send_time(String last_send_time) {
		this.last_send_time = last_send_time;
	}
	public String getSend_hour_of_day() {
		return send_hour_of_day;
	}
	public void setSend_hour_of_day(String send_hour_of_day) {
		this.send_hour_of_day = send_hour_of_day;
	}
	public String getProject_name() {
		return project_name;
	}
	public void setProject_name(String project_name) {
		this.project_name = project_name;
	}
	public Integer getUser_id() {
		return user_id;
	}
	public void setUser_id(Integer user_id) {
		this.user_id = user_id;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public String getEmail_addr() {
		return email_addr;
	}
	public void setEmail_addr(String email_addr) {
		this.email_addr = email_addr;
	}
	public String getEmail_title() {
		return email_title;
	}
	public void setEmail_title(String email_title) {
		this.email_title = email_title;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public String getKeywords() {
		return keywords;
	}
	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}
	public String getSend_day_of_week() {
		return send_day_of_week;
	}
	public void setSend_day_of_week(String send_day_of_week) {
		this.send_day_of_week = send_day_of_week;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	
	

}
