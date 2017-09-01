package cn.thinkingdata.web.domain.user;

import org.springframework.stereotype.Repository;

import java.io.Serializable;

@Repository
public class Do_user_opinion implements Serializable{

	/**
	 * 
	 */
	
	private Integer user_id;
	private Integer opinion_type;
	private String opinion_msg;
	private Integer submit_time;
	
	public Integer getUser_id() {
		return user_id;
	}
	public void setUser_id(Integer user_id) {
		this.user_id = user_id;
	}
	public Integer getOpinion_type() {
		return opinion_type;
	}
	public void setOpinion_type(Integer opinion_type) {
		this.opinion_type = opinion_type;
	}
	public String getOpinion_msg() {
		return opinion_msg;
	}
	public void setOpinion_msg(String opinion_msg) {
		this.opinion_msg = opinion_msg;
	}

	public Integer getSubmit_time() {
		return submit_time;
	}
	public void setSubmit_time(Integer submit_time) {
		this.submit_time = submit_time;
	}

}
