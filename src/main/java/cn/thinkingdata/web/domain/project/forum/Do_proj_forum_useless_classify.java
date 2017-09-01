package cn.thinkingdata.web.domain.project.forum;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_forum_useless_classify {
	private String data_date;
	private Integer project_id;
	private Long info_id;
	private String forum_name;
	private String useless_classify;
	private Integer useless_num;
	public String getData_date() {
		return data_date;
	}
	public void setData_date(String data_date) {
		this.data_date = data_date;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public Long getInfo_id() {
		return info_id;
	}
	public void setInfo_id(Long info_id) {
		this.info_id = info_id;
	}
	public String getForum_name() {
		return forum_name;
	}
	public void setForum_name(String forum_name) {
		this.forum_name = forum_name;
	}
	public String getUseless_classify() {
		return useless_classify;
	}
	public void setUseless_classify(String useless_classify) {
		this.useless_classify = useless_classify;
	}
	public Integer getUseless_num() {
		return useless_num;
	}
	public void setUseless_num(Integer useless_num) {
		this.useless_num = useless_num;
	}
	
	
}
