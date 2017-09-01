package cn.thinkingdata.web.domain.project.forum;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_forum_useless_stat {

	private Integer forum_post_num;
	private String data_date;
	private String forum_name;
	private Integer info_id;
	public Integer getForum_post_num() {
		return forum_post_num;
	}
	public void setForum_post_num(Integer forum_post_num) {
		this.forum_post_num = forum_post_num;
	}
	public String getData_date() {
		return data_date;
	}
	public void setData_date(String data_date) {
		this.data_date = data_date;
	}
	public String getForum_name() {
		return forum_name;
	}
	public void setForum_name(String forum_name) {
		this.forum_name = forum_name;
	}
	public Integer getInfo_id() {
		return info_id;
	}
	public void setInfo_id(Integer info_id) {
		this.info_id = info_id;
	}
	
	
	

}
