package cn.thinkingdata.web.domain.project;

public class Do_project_data_source {

	Integer id;
	Integer user_id;
	Integer project_id;
	String forum_name;
	String forum_url;
	Integer status;
	String last_update_time;

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
	public String getForum_name() {
		return forum_name;
	}
	public void setForum_name(String forum_name) {
		this.forum_name = forum_name;
	}
	public String getForum_url() {
		return forum_url;
	}
	public void setForum_url(String forum_url) {
		this.forum_url = forum_url;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public String getLast_update_time() {
		return last_update_time;
	}
	public void setLast_update_time(String last_update_time) {
		this.last_update_time = last_update_time;
	}
}
