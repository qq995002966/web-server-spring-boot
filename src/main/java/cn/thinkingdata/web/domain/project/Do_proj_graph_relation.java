package cn.thinkingdata.web.domain.project;

public class Do_proj_graph_relation {
	private Integer project_id;
	private Integer relate_project_id;
	private Integer relate_index;
	private Integer hot_score;
	private String relation_name;

	public Integer getProject_id() {
		return project_id;
	}

	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}

	public Integer getRelate_project_id() {
		return relate_project_id;
	}

	public void setRelate_project_id(Integer relate_project_id) {
		this.relate_project_id = relate_project_id;
	}

	public Integer getRelate_index() {
		return relate_index;
	}

	public void setRelate_index(Integer relate_index) {
		this.relate_index = relate_index;
	}

	public Integer getHot_score() {
		return hot_score;
	}

	public void setHot_score(Integer hot_score) {
		this.hot_score = hot_score;
	}

	public String getRelation_name() {
		return relation_name;
	}

	public void setRelation_name(String relation_name) {
		this.relation_name = relation_name;
	}
}
