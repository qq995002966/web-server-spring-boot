package cn.thinkingdata.web.domain.user;

import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public class Do_user_project_collection {
	private Long user_id;
	private Integer project_id;
	private Date create_time;
	
	public Long getUser_id() {
		return user_id;
	}
	public void setUser_id(Long user_id) {
		this.user_id = user_id;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public Date getCreate_time() {
		return create_time;
	}
	public void setCreate_time(Date create_time) {
		this.create_time = create_time;
	}
	
	

}
