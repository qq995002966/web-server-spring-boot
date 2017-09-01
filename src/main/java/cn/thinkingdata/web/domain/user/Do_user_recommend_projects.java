package cn.thinkingdata.web.domain.user;

import org.springframework.stereotype.Repository;

@Repository
public class Do_user_recommend_projects {
	private Integer user_id;
	private Integer project_id;
	private Float score;
	
	public Float getScore() {
		return score;
	}
	public void setScore(Float score) {
		this.score = score;
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

}
