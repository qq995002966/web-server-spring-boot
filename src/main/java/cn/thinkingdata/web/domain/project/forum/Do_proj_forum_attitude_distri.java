package cn.thinkingdata.web.domain.project.forum;


public class Do_proj_forum_attitude_distri {

	private String attitude_score;
	private int post_num;
	private String data_date;
	private String forum_name;
	private int info_id;
	
	public int getInfo_id() {
		return info_id;
	}
	public void setInfo_id(int info_id) {
		this.info_id = info_id;
	}
	public String getAttitude_score() {
		return attitude_score;
	}
	public void setAttitude_score(String attitude_score) {
		this.attitude_score = attitude_score;
	}
	
	public int getPost_num() {
		return post_num;
	}
	public void setPost_num(int post_num) {
		this.post_num = post_num;
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
	
	

}
