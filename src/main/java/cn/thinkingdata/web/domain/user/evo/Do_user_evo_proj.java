package cn.thinkingdata.web.domain.user.evo;

import org.springframework.stereotype.Repository;

@Repository
public class Do_user_evo_proj {

	private Integer id;
	private Integer user_id;
	private Integer project_id;
	private String data_time;
	private String project_name;
	private Integer project_type;
	private String project_desc;
	private String forum_name1 = "";
	private String forum_url1 = "";
	private String forum_name2 = "";
	private String forum_url2 = "";
	
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
	public String getData_time() {
		return data_time;
	}
	public void setData_time(String data_time) {
		this.data_time = data_time;
	}
	public String getProject_name() {
		return project_name;
	}
	public void setProject_name(String project_name) {
		this.project_name = project_name;
	}
	public Integer getProject_type() {
		return project_type;
	}
	public void setProject_type(Integer project_type) {
		this.project_type = project_type;
	}
	public String getProject_desc() {
		return project_desc;
	}
	public void setProject_desc(String project_desc) {
		this.project_desc = project_desc;
	}
	public String getForum_name1() {
		return forum_name1;
	}
	public void setForum_name1(String forum_name1) {
		this.forum_name1 = forum_name1;
	}
	public String getForum_url1() {
		return forum_url1;
	}
	public void setForum_url1(String forum_url1) {
		this.forum_url1 = forum_url1;
	}
	public String getForum_name2() {
		return forum_name2;
	}
	public void setForum_name2(String forum_name2) {
		this.forum_name2 = forum_name2;
	}
	public String getForum_url2() {
		return forum_url2;
	}
	public void setForum_url2(String forum_url2) {
		this.forum_url2 = forum_url2;
	}
	
	

}
