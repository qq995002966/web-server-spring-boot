package cn.thinkingdata.web.domain.user.custom;

import org.springframework.stereotype.Repository;

@Repository
public class Do_user_custom_keywords{

	private Integer id;
	private Integer user_id;
	private Integer project_id;
	private String custom_keywords;
	private String modify_datetime;
	
	
	

	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
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
	public String getCustom_keywords() {
		return custom_keywords;
	}
	public void setCustom_keywords(String custom_keywords) {
		this.custom_keywords = custom_keywords;
	}
	public String getModify_datetime() {
		return modify_datetime;
	}
	public void setModify_datetime(String modify_datetime) {
		this.modify_datetime = modify_datetime;
	}

	

}
