package cn.thinkingdata.web.domain.project.forum;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_forms_date_span{
	

	private String form_type;
	private Integer project_id;
	private String start_date;
	private String end_date;
	
	public String getForm_type() {
		return form_type;
	}
	public void setForm_type(String form_type) {
		this.form_type = form_type;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public String getStart_date() {
		return start_date;
	}
	public void setStart_date(String start_date) {
		this.start_date = start_date;
	}
	public String getEnd_date() {
		return end_date;
	}
	public void setEnd_date(String end_date) {
		this.end_date = end_date;
	}
	


	

}
