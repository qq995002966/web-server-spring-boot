package cn.thinkingdata.web.domain.project.chat;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_chat_attitude_distri {

	private Integer attitude_score;
	private Integer post_num;
	private Integer info_id;
	
	public Integer getAttitude_score() {
		return attitude_score;
	}
	public void setAttitude_score(Integer attitude_score) {
		this.attitude_score = attitude_score;
	}
	public int getPost_num() {
		return post_num;
	}
	public void setPost_num(Integer post_num) {
		this.post_num = post_num;
	}
	public int getInfo_id() {
		return info_id;
	}
	public void setInfo_id(Integer info_id) {
		this.info_id = info_id;
	}
	
	
	

}
