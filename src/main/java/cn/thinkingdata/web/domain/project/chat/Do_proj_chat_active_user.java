package cn.thinkingdata.web.domain.project.chat;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_chat_active_user {
	
	
	private Integer info_id;
	private String qq_id;
	private String author;
	private Integer post_num;
	private String top_keywords;
	
	public Integer getInfo_id() {
		return info_id;
	}
	public void setInfo_id(Integer info_id) {
		this.info_id = info_id;
	}
	public String getQq_id() {
		return qq_id;
	}
	public void setQq_id(String qq_id) {
		this.qq_id = qq_id;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public Integer getPost_num() {
		return post_num;
	}
	public void setPost_num(Integer post_num) {
		this.post_num = post_num;
	}

	public String getTop_keywords() {
		return top_keywords;
	}
	public void setTop_keywords(String top_keywords) {
		this.top_keywords = top_keywords;
	}
	

}
