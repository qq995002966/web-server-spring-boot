package cn.thinkingdata.web.domain.project;

import org.springframework.stereotype.Repository;

@Repository
public class Do_project_hot_list {
	private Integer rank;
	private Integer project_id;
	
	public Integer getRank() {
		return rank;
	}
	public void setRank(Integer rank) {
		this.rank = rank;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	
}
