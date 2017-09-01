package cn.thinkingdata.web.domain.user;

import org.springframework.stereotype.Repository;

@Repository
public class Do_user_proj {
	
	public static final int LOCKED = 0;
	public static final int NORMAL = 1;
	public static final int PENGDING_VERIFY = 2;
	public static final int DELETED = 9;
	
	private Integer id;
	private Integer user_id;
	private Integer project_id;
	private Integer status;
	private String cus_forum_keywords;
	private String status_msg;
	private String follow_time;
	private String project_name;
	private Integer project_type;
	
	public Integer getProject_type() {
		return project_type;
	}
	public void setProject_type(Integer project_type) {
		this.project_type = project_type;
	}
	public String getProject_name() {
		return project_name;
	}
	public void setProject_name(String project_name) {
		this.project_name = project_name;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getStatus_msg() {
		return status_msg;
	}
	public void setStatus_msg(String status_msg) {
		this.status_msg = status_msg;
	}
	public String getFollow_time() {
		return follow_time;
	}
	public void setFollow_time(String follow_time) {
		this.follow_time = follow_time;
	}
	public String getCus_forum_keywords() {
		return cus_forum_keywords;
	}
	public void setCus_forum_keywords(String cus_forum_keywords) {
		this.cus_forum_keywords = cus_forum_keywords;
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
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public static int getLocked() {
		return LOCKED;
	}
	public static int getNormal() {
		return NORMAL;
	}
	public static int getPengdingVerify() {
		return PENGDING_VERIFY;
	}
	public static int getDeleted() {
		return DELETED;
	}

	
	

}
